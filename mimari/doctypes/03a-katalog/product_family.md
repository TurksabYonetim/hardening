# Product Family

- Bağlam: 03a-katalog
- Tür: Ana kayıt
- Klasör: `tradehub_core/tradehub_core/doctype/product_family`
- Denetleyici: `tradehub_core/tradehub_core/doctype/product_family/product_family.py` (27 satır)
- Önerilen sahip bağlam: 03a-katalog

## Epic

- Epic adı: Product Family: 03a-katalog bağlamına taşıma
- Öncelik: Önemli
- Faz: Faz 4
- Tahmini büyüklük: Küçük

### User story

Bir geliştirici olarak, ürün ailesini `get_product_family` ile okumak istiyorum.
Böylece içe aktarma aile şemasına bağlı kalmaz ve izin kuralı netleşir.

### Kabul kriterleri

- [ ] `catalog/api.py` içinde `get_product_family` ve `resolve_product_family_code` var.
- [ ] `bulk_import/persister.py` aile kodunu bu fonksiyonla çözüyor.
- [ ] İzin kuralı `Product Attribute` ile birlikte netleşti. Karar raporda.
- [ ] Kategori silmede aile hedef kategoriye taşınıyor. Test geçiyor.
- [ ] `module` alanı "Catalog" oldu.
- [ ] Characterization test: `Product Family` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- İçe aktarma kodundan aile kodunu doğrudan çözmeyin.
- `Catalog Product.product_family` Link alanını kaldırmayın. Aile kararlı sözlük kaydıdır.
- Döngü kontrolünü kaldırmayın.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] Döngü testi geçiyor.
- [ ] Kategori silme testi geçiyor.
- [ ] İzin kararı testi eklendi.
- [ ] `CODEOWNERS` katalog ekibinden inceleme istendi.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?
Product Family ürün ailesi kaydıdır. Aynı modelin varyantlarını bir çatı altında toplar. Örneğin "X Serisi Blender" ailesi. Aile bir ürün tipine, bir markaya ve bir kategoriye bağlanır.

## Bugünkü bağımlılıklar
### Bu kaydın bağlandığı kayıtlar
- `Product Category` (primary_category): aynı bağlam
- `Brand` (brand): aynı bağlam
- `Product Type` (product_type): aynı bağlam
- `Product Family` (parent_family): aynı bağlam
- Alt tablo `Product Family Attribute` (family_attributes): aynı bağlam
### Bu kayda dokunan kod
- `tradehub_core/tradehub_core/doctype/product_family/product_family.py:11-27`: döngü kontrolü ve eksen normalizasyonu
- `tradehub_core/bulk_import/persister.py:294` ve `api.py:673`: içe aktarma Link çözüyor (03b okuyor)
- `tradehub_core/services/category_delete.py:34`: kategori silmede bağlı kayıt olarak taşınıyor
- `tradehub_core/setup/module_navigation_spec.py:266`: menü tanımı
- `tradehub_core/permissions.py:1396-1414`: satıcı yalnız kendi oluşturduğunu görür
- `tradehub_core/utils/tenant.py:71`: satıcı izolasyonundan muaf
- `tradehub_core/tradehub_core/doctype/catalog_product/catalog_product.json:19`: 03b `Catalog Product` kaydı bu kayda Link veriyor
### hooks.py kayıtları
- `tradehub_core/hooks.py:1106`: izin sorgusu
- `tradehub_core/hooks.py:1230`: tek kayıt izni

## Bağımlılık sorunları
1. `tradehub_core/permissions.py:1396-1404` izin "oluşturan kullanıcı" ile sınırlı. `tenant.py:71` kaydı herkese açık sayıyor. Çelişki `Product Attribute` ile aynıdır.
2. `tradehub_core/tradehub_core/doctype/catalog_product/catalog_product.json:19` içe aktarma bağlamındaki `Catalog Product` bu kayda Link veriyor. Aile bir sözlük kaydıdır. Link kabul edilebilir ancak belgelenmeli.

## Hedef tasarım
- Sahip bağlam `03a-katalog`, paket yolu `tradehub_core/catalog/`.
- Dışarıya açılan fonksiyonlar (`catalog/api.py`): `get_product_family(code)` ve `resolve_product_family_code(label)`.
- Olay yok.
- Başka bağlamlara bağlantılar: `Catalog Product.product_family` Link alanı kalır. Aile kodu kararlı kimliktir.
- Denetleyicide kalacak doğrulamalar: döngü kontrolü ve eksen normalizasyonu. Servise taşınacak iş kuralı yok.

## Geçiş adımları
1. `catalog/api.py` içine `get_product_family` ve `resolve_product_family_code` ekleyin.
2. `bulk_import/persister.py:294` çözümünü 1. adımdaki fonksiyona çevirin. 1. adımdan sonra gelir.
3. İzin kuralını `Product Attribute` ile birlikte netleştirin.
4. `module` alanını "Catalog" yapın. 2. adımdan sonra gelir.

## Riskler ve testler
- Kategori silinince aile hedef kategoriye taşınmalı. Test: `test_mogem989_kategori_silme.py:149` zaten bunu doğrular.
- Üst aile döngüsü reddedilmeli. Test: A üstü B, B üstü A reddedilir.
