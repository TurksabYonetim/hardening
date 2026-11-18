# SEO Entity

- Bağlam: 10-seo
- Tür: Ana kayıt
- Klasör: `tradehub_core/seo_core/doctype/seo_entity`
- Denetleyici: `tradehub_core/seo_core/doctype/seo_entity/seo_entity.py` (8 satır)
- Önerilen sahip bağlam: 10-seo

## Epic

- Epic adı: SEO Entity: 10-seo bağlamına taşıma
- Öncelik: Acil
- Faz: Faz 4
- Tahmini büyüklük: Büyük

### User story

Bir geliştirici olarak, ilan ya da mağaza kaydederken SEO kodunun kaydımı durdurmamasını istiyorum.
Böylece katalog ve SEO ekipleri birbirini bozmaz.

### Kabul kriterleri

- [ ] `hooks.py:1398`, `hooks.py:1403` ve `hooks.py:1407` kancaları kaldırıldı. Ayna olay aboneleriyle güncelleniyor.
- [ ] `shared_sync/projections.py` ve `shared_sync/metadata_projection.py` SEO tablosuna yazmıyor. `seo/api.set_indexable` çağırıyor.
- [ ] `listing.deleted` olayı sonrası ayna satırı kalmıyor.
- [ ] Ayna aboneleri hata verince katalog kaydı yine başarılı oluyor.
- [ ] Characterization test: `SEO Entity` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- Katalog ya da mağaza `doc_events` kaydına yeni SEO işleyicisi eklemeyin. Olaya abone olun.
- `SEO Entity` tablosuna `frappe.db.set_value` ile SEO dışından yazmayın. `set_indexable` fonksiyonunu kullanın.
- Silme kancasını kaldırırken olay abonesi hazır değilse PR'ı birleştirmeyin. Yetim satır sorunu geri gelir.
- Ayna satırını `indexable=1` ile varsayılan açmayın. Yetim satır dizine girer.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] Değişen davranış için önce başarısız olan bir test yazıldı.
- [ ] Ruff ve uygulama testleri yerelde geçiyor.
- [ ] `import-linter` kontrolü `tradehub_core.seo` için geçiyor.
- [ ] `CODEOWNERS` içindeki SEO bağlamı sahibinden inceleme istendi.
- [ ] Yeni olay için sözleşme testi eklendi. Test olay alanlarını kontrol ediyor.
- [ ] Abone aynı olayı iki kez alınca ikinci işlem hiçbir şey değiştirmiyor.
- [ ] Kanca ve abone geçiş süresince aynı sonucu üretiyor. Karşılaştırma testi var.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?

Bu kayıt katalog kayıtlarının SEO aynasıdır. Ayna, başka bir kaydın SEO için tutulan kopyasıdır. İlan, kategori, marka ve mağaza için birer satır tutulur. Satır kanonik adresi ve dizinlenebilirlik bilgisini saklar.

## Bugünkü bağımlılıklar

### Bu kaydın bağlandığı kayıtlar

- `DocType` (`ref_doctype`, Link): başka bağlam (Frappe çekirdeği)
- `Admin Seller Profile` (`store`, Link): başka bağlam (02-satici-magaza)
- `SEO Domain` (`domain`, Link): aynı bağlam

### Bu kayda dokunan kod

- `tradehub_core/seo_helper/catalog/mirror.py:131`: yazıyor
- `tradehub_core/seo_helper/catalog/mirror.py:134`: yazıyor
- `tradehub_core/shared_sync/metadata_projection.py:127`: yazıyor
- `tradehub_core/shared_sync/projections.py:332`: yazıyor
- `tradehub_core/seo_helper/catalog/mirror.py:28`: okuyor
- `tradehub_core/seo_helper/core/monitoring.py:26`: okuyor
- `tradehub_core/seo_helper/audit/reporter.py:104`: adını kullanıyor
- `tradehub_core/seo_helper/audit/reporter.py:111`: adını kullanıyor
- `tradehub_core/seo_helper/catalog/mirror.py:1`: adını kullanıyor
- `tradehub_core/seo_helper/catalog/mirror.py:123`: adını kullanıyor
- `tradehub_core/seo_core/doctype/seo_page/seo_page.json:70`: alt tablo ya da Link tanımı
- 1 patch ya da tohum dosyası bu adı kullanıyor. Örnek: `tradehub_core/patches/v15_9_81_mogem654_yetim_seo_entity.py`.

### hooks.py kayıtları

- `tradehub_core/hooks.py:1424`: mağaza kapsamlı izin döngüsü. `hooks.py:1437` `store_query_conditions` ve `hooks.py:1438` `store_has_permission` kaydını bağlar.
- `tradehub_core/hooks.py:1398`: `Listing` `on_update` kaydı `mirror.on_listing_update` fonksiyonunu çağırıyor.
- `tradehub_core/hooks.py:1403`: `Product Category`, `Brand` ve `Admin Seller Profile` `on_update` kaydı `mirror.on_catalog_update` fonksiyonunu çağırıyor.
- `tradehub_core/hooks.py:1407`: aynı dört DocType `on_trash` kaydı `mirror.on_catalog_trash` fonksiyonunu çağırıyor.

## Bağımlılık sorunları

1. Katalog kayıtlarının kancaları SEO kodunu doğrudan çağırıyor. Kanıt: `hooks.py:1398`, `hooks.py:1403` ve `hooks.py:1407`. SEO kodu hata verirse ilan kaydı da düşer.
2. Paylaşılan senkron kodu SEO tablosuna doğrudan yazıyor. Kanıt: `shared_sync/projections.py:332` ve `shared_sync/metadata_projection.py:127`. Bu kod SEO bağlamına ait değil.
3. Ayna kayıtları geçmişte yetim kaldı. Kanıt: `hooks.py:1404` yorumu 807 satırın 800'ünün yetim olduğunu yazıyor.

## Hedef tasarım

- Sahip bağlam ve paket yolu: `tradehub_core/seo/` paketi. Bugünkü `seo_helper/` kodu bu paketin içine taşınır. Mevcut `SEO Core`, `SEO Crawler`, `SEO Catalog`, `SEO Merchant` ve `SEO MCP` modülleri 10 bağlamının alt modülleri olarak kalır.
- Dışarıya açılan fonksiyonlar: `seo/api.py` içinde `get_entity(ref_doctype, ref_name)` ve `set_indexable(ref_doctype, ref_name, value)`.
- Yayınladığı olaylar: `seo.entity_indexability_changed`. Olay şu alanları taşır: `ref_doctype`, `ref_name`, `indexable`.
- Dinlediği olaylar: 03a bağlamının `listing.updated`, `listing.deleted`, `category.updated`, `category.deleted`, `brand.updated` ve `brand.deleted` olayları. 02 bağlamının `seller.updated` ve `seller.deleted` olayları.
- Başka bağlamlara bağlantılar: `ref_doctype` ve `ref_name` dinamik bağ olarak kalır. `store` Link alanı kalır. Başlık ve slug anlık görüntü alanıdır.
- Denetleyicide kalacak doğrulamalar: Ayrı doğrulama gerekmiyor.
- Servise taşınacak iş kuralları: Ayna güncelleme `seo/catalog/mirror.py` içinde olay işleyicisi olur.

## Geçiş adımları

1. 03a ve 02 bağlamları olaylarını yayınlasın. Bu adım önce gelir.
2. `mirror.py` işleyicilerini olay abonesi olarak kaydedin. `hooks.py` kancaları geçiş süresince kalsın.
3. Abone sağlıklı çalışınca `hooks.py:1398`, `:1403` ve `:1407` kancalarını kaldırın.
4. `shared_sync` yazımlarını `seo/api.set_indexable` çağrısına çevirin.

## Riskler ve testler

- Silinen ilan dizinde kalabilir. Test: `listing.deleted` olayı sonrası ayna satırı kalkmalı.
- Olay gecikirse site haritası kısa süre eski kalır. Test: olay işlenince site haritası güncellenmeli.
