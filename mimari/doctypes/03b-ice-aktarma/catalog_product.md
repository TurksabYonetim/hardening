# Catalog Product

- Bağlam: 03b-ice-aktarma
- Tür: Ana kayıt
- Klasör: `tradehub_core/tradehub_core/doctype/catalog_product`
- Denetleyici: `tradehub_core/tradehub_core/doctype/catalog_product/catalog_product.py` (50 satır)
- Önerilen sahip bağlam: 03b-ice-aktarma. Not: Bu kayıt "ortak katalog ürünü"dür. Birden çok satıcının aynı ürünü (aynı barkod) tek kayıtta toplanır. Kavram olarak kataloğa (03a) yakındır. Ancak kodun tamamı `catalog/service.py` eşleştirme servisindedir. README'de bu ikilik not edilir.

## Epic

- Epic adı: Catalog Product: 03b-ice-aktarma bağlamına taşıma
- Öncelik: Önemli
- Faz: Faz 4
- Tahmini büyüklük: Büyük

### User story

Bir alıcı olarak, aynı barkodlu ürünlerin tek sayfada toplanmasını istiyorum. En iyi teklif öne çıksın.
Böylece aynı ürünü farklı satıcılardan kolay karşılaştırırım.

### Kabul kriterleri

- [ ] `catalog/service.py` ve `catalog/hooks.py` dosyaları `import_pipeline/matching/` altında.
- [ ] `utils/gtin.py` dosyası `shared/gtin.py` oldu. İki bağlam da buradan içe aktarıyor.
- [ ] `_listing_fields` yerine `catalog.api.get_listing` kullanılıyor.
- [ ] `hooks.py:1399-1400` kancaları `catalog.listing_*` dinleyicisinde.
- [ ] `winner_listing` alanı `Data` anlık görüntü. Kazanan ürün silinince katalog ürünü kilitlenmiyor. Test var.
- [ ] İki satıcı aynı GTIN ile ürün açınca tek `Catalog Product` oluşuyor. Test var.
- [ ] Characterization test: `Catalog Product` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- Eşleştirme servisini `catalog/` klasöründe tutmayın. Katalog ekibiyle klasör çakışır.
- `Listing` alanlarını `frappe.db.get_value` ile doğrudan okumayın. Okuma modelini kullanın.
- `winner_listing` alanını Link olarak bırakmayın. Ürün silmeyi kilitler.
- GTIN kanonik anahtar kontrolünü kaldırmayın. UPC-A ve 13 haneli yazım aynı ürün.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] GTIN eşleşme ve kanonik anahtar testleri geçiyor.
- [ ] Kazanan ürün silme testi eklendi.
- [ ] Yama (`winner_listing` tür değişimi) idempotent ve değer koruyor.
- [ ] Olay sözleşme testleri eklendi.
- [ ] `import-linter` geçiyor.
- [ ] `CODEOWNERS` içe aktarma ve katalog ekiplerinden inceleme istendi.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?
Catalog Product barkoda (GTIN) göre tek bir ürün kimliğidir. Farklı satıcıların aynı ürünü buraya eşlenir. "Buybox" en iyi teklifi seçer. Kazanan ürün kartı `winner_listing` alanında tutulur.

## Bugünkü bağımlılıklar
### Bu kaydın bağlandığı kayıtlar
- `Brand`, `Product Category`, `Product Type`, `Product Family` (brand, product_category, product_type, product_family): başka bağlam (03a-katalog)
- `Listing` (winner_listing): başka bağlam (03a-katalog)
- Bu kayda bağlanan: `Product Mapping.catalog_product` (03b), `Buybox Selection.catalog_product` (03c)
### Bu kayda dokunan kod
- `tradehub_core/tradehub_core/doctype/catalog_product/catalog_product.py:13-30`: GTIN normalizasyonu için `utils.gtin` kullanıyor (03a yardımcısı)
- `tradehub_core/catalog/service.py:132-146,216,318,357,810-841,979,1058,1151-1170`: eşleştirme ve buybox servisi oluşturuyor, okuyor, yazıyor
- `tradehub_core/listing_purge/preview.py:128`: ürün silme aracı `winner_listing` bağını özel işliyor
- `tradehub_core/listing_purge/plan.py:57`: silme planında adı geçiyor
### hooks.py kayıtları
- Kayıt yok. `Listing.on_update` içindeki `catalog.hooks.on_listing_update` (`hooks.py:1399`) eşleştirmeyi tetikliyor.

## Bağımlılık sorunları
1. `tradehub_core/catalog/hooks.py:7-16` her ürün kaydında `match_listing` eşzamanlı çalışıyor. Eşleştirme hatası ürün kaydını durdurabilir. Katalog kaydı eşleştirme servisine bağımlı.
2. `tradehub_core/catalog/service.py:59-100` `_listing_fields` ürün tablosunu doğrudan okuyor. Okuma modeli yok.
3. `winner_listing` Link alanı ürün silinirken `LinkExistsError` üretebilir. `listing_purge/preview.py:128` bunu özel işliyor. Anlık görüntü olmalı.
4. Paket adı `catalog/` ama iş "eşleştirme ve buybox". Katalog ekibi ile içe aktarma ekibi aynı klasörde çakışır.

## Hedef tasarım
- Sahip bağlam `03b-ice-aktarma`, paket yolu `tradehub_core/import_pipeline/matching/` (bugünkü `catalog/service.py` buraya taşınır).
- Dışarıya açılan fonksiyonlar (`import_pipeline/api.py`): `get_catalog_product(code)`, `find_product_by_gtin(gtin)`, `get_offers_for_listing(listing)` (vitrin "diğer satıcılar" kutusu), `get_buybox_winner(product)`.
- Yayınladığı olaylar: `matching.product_created`, `matching.buybox_changed` (product, winner_listing, score). Dinleyen: 03c-kesif (`Buybox Selection`), vitrin önbelleği. Dinlediği olaylar: `catalog.listing_created`, `catalog.listing_updated` (eşleştirme için), `catalog.listing_deleted` (ayırma için), `seller_store.profile_updated` (buybox için).
- Başka bağlamlara bağlantılar: `brand`, `product_category`, `product_type`, `product_family` Link alanları kalır. Hepsi kararlı sözlük kayıtlarıdır. `winner_listing` Link alanı `Data` anlık görüntüye çevrilir. Silinen ürünle kilitlenme kalkar.
- Denetleyicide kalacak doğrulamalar: GTIN biçimi, kanonik anahtar benzersizliği, slug üretimi. GTIN yardımcıları `shared/gtin.py` olur (katalog ve eşleştirme ortak kullanır).

## Geçiş adımları
1. `utils/gtin.py` dosyasını `shared/gtin.py` olarak taşıyın. İki bağlam da buradan içe aktarır.
2. `catalog/service.py` ve `catalog/hooks.py` dosyalarını `import_pipeline/matching/` altına taşıyın. Dış adlar `hooks.py` içinde güncellenir. Bağımsızdır.
3. `_listing_fields` okumasını `catalog.api.get_listing` ile değiştirin. 03a 1. adımından sonra gelir.
4. `hooks.py:1399-1400` kancalarını `catalog.listing_*` olay dinleyicisine taşıyın. Outbox gerekir.
5. `winner_listing` alanını `Data` yapın. Yama ile değer korunur. `listing_purge/preview.py:128` özel kodu kalkar.
6. `module` alanını "Import Pipeline" yapın.

## Riskler ve testler
- Aynı barkodlu iki ürün tek katalog ürününe eşlenmeli. Test: iki satıcı aynı GTIN ile ürün açar, tek `Catalog Product` oluşur.
- UPC-A ve 13 haneli yazım aynı anahtara düşmeli. Test: `gtin_key` iki yazımda eşittir.
- Kazanan ürün silinince katalog ürünü kilitlenmemeli. Test: `winner_listing` ürünü silinir, katalog ürünü kalır.
