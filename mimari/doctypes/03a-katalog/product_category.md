# Product Category

- Bağlam: 03a-katalog
- Tür: Ana kayıt (ağaç)
- Klasör: `tradehub_core/tradehub_core/doctype/product_category`
- Denetleyici: `tradehub_core/tradehub_core/doctype/product_category/product_category.py` (51 satır)
- Önerilen sahip bağlam: 03a-katalog

## Epic

- Epic adı: Product Category: 03a-katalog bağlamına taşıma
- Öncelik: Acil
- Faz: Faz 4
- Tahmini büyüklük: Büyük

### User story

Bir platform yöneticisi olarak, kategori kaydının başka bağlam hatasıyla durmamasını istiyorum. SEO, öneri ve vergi işleri arkada yapılır.
Böylece kategori ağacını güvenle düzenlerim ve diğer işler arkada olayla yapılır.

### Kabul kriterleri

- [ ] `catalog/api.py` içinde `get_category`, `get_category_descendants`, `get_category_ancestors`, `get_category_tree` var. `api/listing.py:193` fonksiyonu taşındı.
- [ ] Slug üretimi tek yerde. `api/category.py` ve denetleyici aynı fonksiyonu çağırıyor.
- [ ] `hooks.py` içinde `Product Category` için SEO, öneri, vergi fiyatı ve vitrin önbelleği kancası kalmadı. Hepsi `catalog.category_*` dinleyicisinde.
- [ ] Kategori silme servisi yalnız katalog tablolarını taşıyor. Diğer bağlamlar `catalog.category_deleted` olayını dinliyor.
- [ ] KDV oranı değişince alt ağaç ürün fiyatı olay üzerinden güncelleniyor. Test var.
- [ ] `import-linter` geçiyor.
- [ ] Characterization test: `Product Category` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- `hooks.py` içine `Product Category` için yeni `doc_events` eklemeyin. Olay dinleyicisi yazın.
- `category_delete.py` içinden başka bağlamın tablosuna `UPDATE` yazmayın. O bağlam kendi satırını taşır.
- Üçüncü bir slug üretici yazmayın. Tek fonksiyon kullanılır.
- `vat_rate` değişiminde ürün fiyatını katalog kodundan hesaplamayın. Vergi bağlamı dinleyicisi hesaplar.
- `lft` ve `rgt` alanlarını elle yazmayın. `NestedSet` yönetir.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] Kategori silme testi (`test_mogem989_kategori_silme.py`) geçiyor.
- [ ] Olay sözleşme testleri eklendi.
- [ ] Slug ve 301 testi geçiyor.
- [ ] Aynı seviyede ad tekrarı testi geçiyor.
- [ ] `import-linter` geçiyor.
- [ ] `CODEOWNERS` katalog, SEO, vergi ve öneri ekiplerinden inceleme istendi.
- [ ] Ruff lint temiz.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?
Product Category platformun ürün kategori ağacıdır. Örneğin "Mutfak" altında "Küçük Ev Aletleri". Her ürün bir kategoriye bağlanır. Kategori KDV oranı, yaş sınırı ve SEO ayarlarını da taşır. Ağaç yapısı `lft` ve `rgt` sayılarıyla tutulur. Bu sayılar alt ağacı tek sorguda bulmayı sağlar.

## Bugünkü bağımlılıklar
### Bu kaydın bağlandığı kayıtlar
- `Product Category` (parent_product_category, old_parent): aynı bağlam
- Alt tablo `Product Category Required Certification` (required_certifications): aynı bağlam
- Bu kayda bağlanan alanlar: `Listing.product_category` (03a), `Attribute Set Category Map`, `Product Family`, `Product Type` (03a), `Catalog Product` (03b), `Category Embedding`, `Category Neighbour Cache` (03c), `SEO Facet Landing Page` (10-seo), `RFQ` (04), `Seller Category`, `Approval Rule`, `Category Review Template` (`category_delete.py:31-41` listesinden)
### Bu kayda dokunan kod
- `tradehub_core/tradehub_core/doctype/product_category/product_category.py:20-51`: aynı seviyede ad tekrarı kontrolü ve slug üretimi
- `tradehub_core/api/category.py:48,260,573,616,686,709`: mega menü, ağaç, oluşturma, güncelleme, silme ve içe aktarma uç noktaları (okuyor ve yazıyor)
- `tradehub_core/api/listing.py:193`: `_get_category_descendants` alt ağacı okuyor (önbellekli)
- `tradehub_core/services/category_delete.py:58-323`: kategori silme ve bağlı kayıt taşıma servisi (yazıyor)
- `tradehub_core/utils/listing_gross_price.py:537`: KDV oranı değişince ürün vergili fiyatını yeniden hesaplıyor (06 ile ilgili iş)
- `tradehub_core/recommendations/cleanup.py:16-60`: silinince öneri önbelleklerini düşürüyor (03c)
- `tradehub_core/seo_helper/core/catalog.py:105,133,169,180`: SEO karar motoru okuyor (10)
- `tradehub_core/shared_sync/operations.py:265`: paylaşım bağlamı varlık kontrolü
- `tradehub_core/catalog/category_i18n.py:53`: çeviri yardımcıları
- `tradehub_core/bulk_import/persister.py:292`: içe aktarma Link çözüyor (03b)
### hooks.py kayıtları
- `tradehub_core/hooks.py:636-655`: `on_trash` öneri temizliği, sitemap ve vitrin önbelleği. `before_validate` ve `validate` SEO slug ve uzunluk. `after_insert` ve `on_update` vitrin ve SEO önbelleği.
- `tradehub_core/hooks.py:1402-1407`: `on_update` ve `on_trash` SEO ayna kaydı (10)
- `tradehub_core/hooks.py:1497`: `on_update` ürün vergili fiyat yeniden hesabı

## Bağımlılık sorunları
1. `tradehub_core/hooks.py:636-655` ve `1402-1407` sekiz kanca dört farklı bağlamdan geliyor: SEO (10), öneri (03c), vitrin önbelleği (`api/listing.py`), vergi fiyatı (`listing_gross_price`). Biri hata verirse kategori kaydedilemez.
2. `tradehub_core/hooks.py:1497` kategori `vat_rate` değişimi ürün fiyat kolonunu yeniden yazıyor. Bu, vergi bağlamının (06) işidir. Katalog kaydı vergi hesabını tetikliyor.
3. `tradehub_core/services/category_delete.py:85-103` silme servisi `Link` alanı taşıyan tüm DocType'ları tarayıp başka bağlamların tablolarını güncelliyor (`_move_rows`, satır 273). Bu, başka bağlamın tablosuna yazmaktır.
4. `tradehub_core/api/listing.py:193` alt ağaç hesabı vitrin dosyasında duruyor. Katalog kavramı yanlış dosyada.
5. Üç farklı slug üretici var: `product_category.py:10-14,49-51`, `api/category.py:13`, `seo/hooks_seo.py:71`. Hangisi kazanır belirsiz. `before_validate` SEO kancası önce çalışır, `before_save` denetleyici sonra çalışır.

## Hedef tasarım
- Sahip bağlam `03a-katalog`, paket yolu `tradehub_core/catalog/`.
- Dışarıya açılan fonksiyonlar (`catalog/api.py`): `get_category(name)` ad, slug, üst kategori ve `vat_rate` verir. `get_category_descendants(name)` alt ağacı verir (önbellekli). `get_category_ancestors(name)` yolu verir. `get_category_tree(parent, lang)` menü için ağaç verir. `list_categories_for_listings(listing_names)` toplu okuma.
- Yayınladığı olaylar: `catalog.category_created`, `catalog.category_updated` (name, slug, parent, vat_rate, changed_fields), `catalog.category_deleted` (name, moved_to). Dinleyenler: 10-seo (ayna ve sitemap), 03c-kesif (önbellek temizliği), 06-vergi (vat_rate değişimi), vitrin önbelleği. Dinlediği olay yok.
- Başka bağlamlara bağlantılar: `Listing.product_category`, `RFQ`, `Catalog Product`, `SEO Facet Landing Page` Link alanları kalır. Kategori kararlı kök kayıttır. Kategori silme servisi bağlı kayıtları olay ile bildirir. Her bağlam kendi satırlarını taşır.
- Denetleyicide kalacak doğrulamalar: aynı seviyede ad tekrarı. Slug üretimi tek yerde kalır (denetleyici). Servise taşınacak iş kuralı: içe aktarma, silme ve taşıma (`api/category.py:709`, `category_delete.py`) `catalog/category_service.py` içinde kalır.

## Geçiş adımları
1. `catalog/api.py` içine `get_category`, `get_category_descendants`, `get_category_ancestors` ekleyin. `api/listing.py:193` fonksiyonunu buraya taşıyın.
2. Slug üretimini tek yere indirin. `api/category.py:13` ve denetleyici aynı fonksiyonu çağırır. Bağımsızdır.
3. Outbox ve `catalog.category_*` olaylarını ekleyin. Olay `on_update` ve `on_trash` içinde yayınlanır.
4. `hooks.py:1497` vergi fiyat kancasını `catalog.category_updated` dinleyicisine taşıyın. 06 ekibi dinleyiciyi yazar. 3. adımdan sonra gelir.
5. `hooks.py:636-640` öneri temizliğini `catalog.category_deleted` dinleyicisine taşıyın (03c ekibi). 3. adımdan sonra gelir.
6. `hooks.py:1402-1407` ve `642-655` SEO kancalarını `catalog.category_updated` dinleyicisine taşıyın (10 ekibi). 3. adımdan sonra gelir.
7. `category_delete.py:258-300` taşıma işini bağlam başına ayırın. Katalog yalnız kendi tablolarını taşır. Diğerleri `catalog.category_deleted` olayını dinler. 3. adımdan sonra gelir.
8. `module` alanını "Catalog" yapın. 7. adımdan sonra gelir.

## Riskler ve testler
- Kategori silinince ürünler hedef kategoriye taşınmalı. Test: `test_mogem989_kategori_silme.py` zaten var. Olay geçişinde korunur.
- KDV oranı değişince alt ağaçtaki ürün fiyatı güncellenmeli. Test: `vat_rate` değişimi olay yayınlar, 06 dinleyicisi fiyatı yeniler.
- Slug değişince 301 yönlendirmesi oluşmalı. Test: SEO dinleyicisi `on_slug_change` çağırır.
- Aynı seviyede aynı ad reddedilmeli. Test: iki kardeş kategori aynı adla kaydedilemez.
