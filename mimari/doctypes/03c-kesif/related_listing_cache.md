# Related Listing Cache

- Bağlam: 03c-kesif
- Tür: Kayıt defteri (hesaplanmış önbellek)
- Klasör: `tradehub_core/tradehub_core/doctype/related_listing_cache`
- Denetleyici: `tradehub_core/tradehub_core/doctype/related_listing_cache/related_listing_cache.py` (11 satır)
- Önerilen sahip bağlam: 03c-kesif

## Epic

- Epic adı: Related Listing Cache: 03c-kesif bağlamına taşıma
- Öncelik: Önemli
- Faz: Faz 4
- Tahmini büyüklük: Büyük

### User story

Bir geliştirici olarak, öneri tablosunun katalog olaylarını dinlemesini ve vitrinin API ile okumasını istiyorum.
Böylece ürün kaydı öneri koduna bağlı kalmaz ve şema değişince vitrin kırılmaz.

### Kabul kriterleri

- [ ] `discovery/api.py` içinde `get_related_listings` var. `api/listing.py:3714` bunu çağırıyor. Ham SQL okuma kalmadı.
- [ ] `hooks.py:597,600,613,625` kancaları `catalog.listing_*` dinleyicisinde.
- [ ] `source_listing` ve `target_listing` alanları `Data`. Yama değer koruyor.
- [ ] `category_delete.py:310-311` ve `api/listing.py:114-115` satırları kaldırıldı.
- [ ] Pasif ürün önerilerden düşüyor. Test var.
- [ ] Gölge tablo değişimi atomik. Mevcut `swap.py` testi geçiyor.
- [ ] Characterization test: `Related Listing Cache` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- Vitrin kodundan `tabRelated Listing Cache` tablosunu ham SQL ile okumayın.
- `hooks.py` içine öneri kancası eklemeyin. Olay dinleyicisi yazın.
- Sipariş tablosunu (`Order Item`) doğrudan okumayın. `order.api.get_copurchase_pairs` okuma modelini kullanın.
- `swap.py` içindeki tablo adı güvenlik kontrolünü (`_assert_safe_table`) kaldırmayın.
- Yeniden kurma sırasında üretim tablosunu boşaltmayın.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] Okuma modeli sıra testi eklendi.
- [ ] Olay dinleyici testleri eklendi.
- [ ] Tür değişimi yaması idempotent.
- [ ] Atomik değişim testi geçiyor.
- [ ] `import-linter` geçiyor.
- [ ] `CODEOWNERS` keşif, katalog ve sipariş ekiplerinden inceleme istendi.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?
Related Listing Cache bir ürün için önerilen diğer ürünleri tutar. Dört ilişki türü var: benzer, alternatif, tamamlayıcı, aksesuar. Haftalık görev tabloyu yeniden kurar. Vitrin "benzer ürünler" kutusunu buradan okur.

## Bugünkü bağımlılıklar
### Bu kaydın bağlandığı kayıtlar
- `Listing` (source_listing, target_listing): başka bağlam (03a-katalog)
### Bu kayda dokunan kod
- `tradehub_core/recommendations/engine.py:59-320`: hesaplama ve gölge tablo ile atomik değişim
- `tradehub_core/recommendations/swap.py:17-78`: ham SQL ile tablo değişimi (f-string tablo adı, `_assert_safe_table` korumalı)
- `tradehub_core/recommendations/engine.py:327-377`: ürün kancaları satır siliyor ve yeniden hesap kuyruğa alıyor
- `tradehub_core/recommendations/tasks.py:40`: `refresh_copurchase_lift` tabloyu okuyor
- `tradehub_core/api/listing.py:3714-3728`: vitrin `get_related_listings_grouped` ham SQL ile okuyor (03a kodu)
- `tradehub_core/api/listing.py:114-115`: ürün silinirken temizlenecek listede (03a kodu siliyor)
- `tradehub_core/services/category_delete.py:310-311`: katalog servisi satırları siliyor
- `tradehub_core/setup/install.py:326-328`: kurulum kontrolü
### hooks.py kayıtları
- `tradehub_core/hooks.py:422`: haftalık `rebuild_related_matrix`
- `tradehub_core/hooks.py:231`: saatlik `refresh_copurchase_lift`
- `tradehub_core/hooks.py:597,600,613,625`: `Listing` `on_update`, `after_insert`, `on_trash` kancaları
- `tradehub_core/hooks.py:638`: `Product Category.on_trash` temizliği

## Bağımlılık sorunları
1. `tradehub_core/hooks.py:597,600,613,625` dört kanca ürün kaydına bağlı. `schedule_recompute_on_listing_update` her kayıtta kuyruğa iş atıyor. Katalog kaydı öneri koduna bağımlı.
2. `tradehub_core/api/listing.py:3728` vitrin kodu önbellek tablosunu ham SQL ile okuyor. Şema değişince vitrin kırılır.
3. `tradehub_core/services/category_delete.py:310-311` ve `api/listing.py:114-115` katalog kodu keşif tablosunu siliyor. Üç yer aynı temizliği yapıyor (`recommendations/cleanup.py` dahil).
4. `recommendations/complementary.py:92-159` sipariş tablosunu (`Order Item`, 04) ve görüntüleme tablosunu doğrudan okuyor (birlikte satın alma). Doğrulanmadı: fonksiyon içi okunmadı, ad ve yorumdan çıkarıldı.

## Hedef tasarım
- Sahip bağlam `03c-kesif`, paket yolu `tradehub_core/discovery/recommendations/`.
- Dışarıya açılan fonksiyonlar (`discovery/api.py`): `get_related_listings(listing, relation_type=None, limit=8)` okuma modeli. Vitrin bunu çağırır. `trigger_rebuild()` yönetici.
- Yayınladığı olay yok. Dinlediği olaylar: `catalog.listing_updated` yeniden hesabı kuyruğa alır. `catalog.listing_deleted` ve `catalog.listing_status_changed` satırları temizler. `catalog.category_deleted` kategori satırlarını temizler. `order.confirmed` birlikte satın alma verisini toplar. Böylece sipariş tablosu doğrudan okunmaz.
- Başka bağlamlara bağlantılar: iki Link alanı `Data` olmalı. Önbellek ürün silmeyi kilitlememeli. Bugün `api/listing.py:107-116` bu yüzden özel liste tutuyor.
- Denetleyicide doğrulama yok.

## Geçiş adımları
1. `discovery/api.py` içine `get_related_listings` ekleyin. `api/listing.py:3714` bunu çağırır.
2. `hooks.py:597,600,613,625` kancalarını `catalog.listing_*` dinleyicilerine taşıyın. Outbox gerekir.
3. `source_listing` ve `target_listing` alanlarını `Data` yapın. Yama değer korur. `api/listing.py:114-115` ve `category_delete.py:310-311` satırları kalkar.
4. Sipariş okumasını `order.api.get_copurchase_pairs(since)` okuma modeline çevirin (04 ekibi yazar).
5. `module` alanını "Discovery" yapın.

## Riskler ve testler
- Ürün pasif olunca önerilerden düşmeli. Test: `catalog.listing_status_changed` dinleyicisi satırları siler.
- Yeniden kurma sırasında tablo boş kalmamalı. Test: gölge tablo değişimi atomik (mevcut `swap.py` testi korunur).
- Vitrin okuma modeli aynı sırayı vermeli. Test: `final_score` azalan sıra.
