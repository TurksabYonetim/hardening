# Seller Category

- Bağlam: 02-satici-magaza
- Tür: Ana kayıt
- Klasör: `tradehub_core/tradehub_core/doctype/seller_category`
- Denetleyici: `tradehub_core/tradehub_core/doctype/seller_category/seller_category.py` (88 satır)
- Önerilen sahip bağlam: 02-satici-magaza. Kayıt mağazanın kendi vitrin kategorisidir. `Listing` bu kayda bağlanır. Katalog (03a) ile sık ilişkili olduğu için sınır net tutulmalı.

## Epic

- Epic adı: Seller Category: 02-satici-magaza bağlamına taşıma
- Öncelik: Önemli
- Faz: Faz 4
- Tahmini büyüklük: Orta

### User story

Bir satıcı olarak, mağaza kategorilerimin yalnız benim mağazamda görünmesini istiyorum.
Böylece başka satıcı kategorime dokunamaz.

### Kabul kriterleri

- [ ] `count_categories_using` fonksiyonu var. `category_delete.py` bu fonksiyonu kullanıyor.
- [ ] Bildirim `seller.store_category.changed` olayıyla gönderiliyor.
- [ ] Başka mağaza adına kategori açılamıyor. Test geçiyor.
- [ ] `test_shared_sync_product_metadata.py` geçiyor.
- [ ] Characterization test: `Seller Category` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- Katalog ya da silme kodundan bu tabloyu doğrudan sorgulamayın.
- Paylaşım senkron kancalarını kaldırmayın.
- Medya kodundan `image` alanını doğrudan okumayın.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] Değişen davranış için önce başarısız olan test yazıldı.
- [ ] Ruff ve ilgili testler yerelde geçiyor.
- [ ] `import-linter` kontrolü yeni ihlal üretmiyor.
- [ ] `CODEOWNERS` içindeki 02-satici-magaza sahibi inceleyici olarak eklendi.
- [ ] Katalog bağlamı (03a) sahibi inceleyici olarak eklendi.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?
Bu kayıt bir mağazanın kendi ürün grubudur. Satıcı kategoriyi açar. Yönetici onaylar ya da reddeder. Kategori platform kategorisine (`Product Category`) bağlanabilir. Ürünler bu kategoriye atanır.

## Bugünkü bağımlılıklar
### Bu kaydın bağlandığı kayıtlar
- `Admin Seller Profile` (`seller`): aynı bağlam
- `Product Category` (`category`): başka bağlam (03a-katalog)
- Bu kayda bağlananlar: `Listing` (03a-katalog), `Seller Product` (03b-ice-aktarma)
### Bu kayda dokunan kod
- `tradehub_core/tradehub_core/doctype/seller_category/seller_category.py:5`: dosya başında `utils.notify` içe aktarıyor
- `tradehub_core/tradehub_core/doctype/seller_category/seller_category.py:15`, `:23`: `shared_sync.projections.is_applying` çağırıyor
- `tradehub_core/tradehub_core/doctype/seller_category/seller_category.py:54`: mağaza sahibini okuyor
- `tradehub_core/api/seller.py:1096`, `:1099`, `:1145`: okuyor ve yazıyor (15 yer)
- `tradehub_core/api/listing.py:4465`: paylaşım izin kontrolü
- `tradehub_core/shared_sync/seller_records.py:424`: okuyor
- `tradehub_core/media/magaza_gorseli.py:139`: görselleri okuyor
- `tradehub_core/services/category_delete.py:39`: kategori silmede bu kaydı sayıyor
- `tradehub_core/listing_purge/plan.py:57`: ürün kalıcı silmede bu tabloyu biliyor
### hooks.py kayıtları
- `tradehub_core/hooks.py:930-933`: `before_insert` ve `validate` olayları kiracı izolasyonu
- `tradehub_core/hooks.py:1623-1627`: `before_save`, `on_trash`, `on_update` olayları paylaşım senkronu (üç işleyici)
- `tradehub_core/hooks.py:1091`: `permission_query_conditions`
- `tradehub_core/hooks.py:1218`: `has_permission`

## Bağımlılık sorunları
1. Katalog ve silme kodları bu tabloyu biliyor. Kanıt: `services/category_delete.py:39`, `listing_purge/plan.py:57`. Satıcı ekibi alan değiştirirse ürün silme bozulur.
2. Denetleyici paylaşım paketine bağlı. Kanıt: `seller_category.py:15`, `:23`.
3. Medya kodu görsel alanını doğrudan okuyor. Kanıt: `media/magaza_gorseli.py:139`.

## Hedef tasarım
- Sahip bağlam: 02-satici-magaza. Paket yolu: `tradehub_core/seller/storefront_categories/`.
- Dışa açık fonksiyonlar: `get_store_category(name) -> StoreCategoryView`, `list_store_categories(store)`, `count_categories_using(product_category) -> int`.
- Yayınladığı olaylar: `seller.store_category.changed`, `seller.store_category.deleted`.
- Dinlediği olay: `catalog.product_category.deleted`. Bağlantıyı boşaltır.
- Kalacak Link alanları: `seller`, `category`. `Listing.category` alanı bu kayda bağlı kalır.
- Denetleyicide sahiplik ve durum geçişi kalır. Bildirim olaya taşınır.

## Geçiş adımları
1. `count_categories_using` fonksiyonunu ekleyin. `category_delete.py:39` satırını buna bağlayın.
2. Bildirimi `seller.store_category.changed` olayına taşıyın. Bu adım olay altyapısından sonra gelir.
3. Medya görsel okumasını medya bağlamının kayıt yöntemine çevirin.

## Riskler ve testler
- Başka mağaza adına kategori açılmamalı. `tradehub_core/tests/test_rfq_permissions.py` ve kiracı testleri korunmalı.
- Paylaşım senkronu `tradehub_core/tests/test_shared_sync_product_metadata.py` ile korunmalı.
