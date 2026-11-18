# Product Type

- Bağlam: 03a-katalog
- Tür: Ana kayıt
- Klasör: `tradehub_core/tradehub_core/doctype/product_type`
- Denetleyici: `tradehub_core/tradehub_core/doctype/product_type/product_type.py` (28 satır)
- Önerilen sahip bağlam: 03a-katalog

## Epic

- Epic adı: Product Type: 03a-katalog bağlamına taşıma
- Öncelik: Önemli
- Faz: Faz 4
- Tahmini büyüklük: Küçük

### User story

Bir geliştirici olarak, ürün tipi bayraklarını `get_product_type` ile okumak istiyorum.
Böylece lojistik `requires_shipping` değerini sözleşmeyle okur ve tohum verisi tek yerde durur.

### Kabul kriterleri

- [ ] `catalog/api.py` içinde `get_product_type` var.
- [ ] `bulk_import/persister.py` tip kodunu bu fonksiyonla çözüyor.
- [ ] Tohum yamaları `catalog/setup.py` içinde tek fonksiyon. "PHYSICAL" kaydı migrate sonrası var. Test var.
- [ ] Hizmet tipi kargo gerektiremiyor. Test var.
- [ ] `module` alanı "Catalog" oldu.
- [ ] Characterization test: `Product Type` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- Lojistik kodundan `Product Type` tablosunu doğrudan okumayın. `get_product_type` kullanın.
- Varsayılan tipleri yeni yamalarla dağıtmayın. `catalog/setup.py` tek kaynak.
- Döngü kontrolünü kaldırmayın.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] Bayrak ve döngü testleri geçiyor.
- [ ] Tohum fonksiyonu iki kez çalışınca hata vermiyor.
- [ ] `CODEOWNERS` katalog ekibinden inceleme istendi.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?
Product Type ürün tipi kaydıdır. Örneğin "Fiziksel", "Dijital", "Hizmet". Tip kargo gerekir mi, parti takibi var mı gibi bayrakları tutar. Ürün kartı ve ürün ailesi bu kayda bağlanır.

## Bugünkü bağımlılıklar
### Bu kaydın bağlandığı kayıtlar
- `Product Type` (parent_product_type): aynı bağlam
- `Product Category` (category_hint): aynı bağlam
### Bu kayda dokunan kod
- `tradehub_core/tradehub_core/doctype/product_type/product_type.py:11-28`: döngü ve hizmet bayrağı kontrolleri
- `tradehub_core/bulk_import/persister.py:293` ve `api.py:672`: içe aktarma Link çözüyor (03b okuyor)
- `tradehub_core/eca/api.py:72`: kural motoru alan listesinde
- `tradehub_core/services/category_delete.py:36`: kategori silmede bağlı kayıt
- `tradehub_core/setup/module_navigation_spec.py:255`: menü tanımı
- `tradehub_core/tradehub_core/doctype/catalog_product/catalog_product.json:18`: 03b `Catalog Product` Link veriyor
- Yamalar: `create_default_product_types.py`, `v15_9_0_product_type_default_icon.py`, `v15_9_1_product_type_meaningful_icons.py` varsayılan tipleri tohumluyor
### hooks.py kayıtları
- Kayıt yok.

## Bağımlılık sorunları
1. `requires_shipping` bayrağı lojistik için anlamlıdır. Ancak lojistik kodunda bu alanı okuyan satır bulunmadı (grep ile doğrulandı). Bayrak kullanılmıyor olabilir. Doğrulanmadı: kargo hesabı bu bayrağı başka yoldan okuyabilir.
2. Rol ayarı satıcıya yalnız okuma veriyor ancak `permission_query_conditions` yok. Bu durum doğru görünür. Sorun yok.

## Hedef tasarım
- Sahip bağlam `03a-katalog`, paket yolu `tradehub_core/catalog/`.
- Dışarıya açılan fonksiyonlar (`catalog/api.py`): `get_product_type(code)` bayrakları verir. Lojistik `requires_shipping` değerini bu fonksiyonla okur.
- Olay yok.
- Başka bağlamlara bağlantılar: `Catalog Product.product_type` Link alanı kalır.
- Denetleyicide kalacak doğrulamalar: döngü ve hizmet bayrağı kontrolleri. Servise taşınacak iş kuralı yok.

## Geçiş adımları
1. `catalog/api.py` içine `get_product_type` ekleyin.
2. `bulk_import/persister.py:293` çözümünü 1. adımdaki fonksiyona çevirin.
3. Tohum yamalarını `catalog/setup.py` içine toplayın. Bağımsızdır.
4. `module` alanını "Catalog" yapın. 2. adımdan sonra gelir.

## Riskler ve testler
- Hizmet tipi kargo gerektirememeli. Test: `is_service=1` ve `requires_shipping=1` reddedilir.
- Varsayılan tipler migrate sonrası var olmalı. Test: "PHYSICAL" kaydı bulunur.
