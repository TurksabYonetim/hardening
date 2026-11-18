# Listing Variant Item

- Bağlam: 03a-katalog
- Tür: Alt tablo
- Klasör: `tradehub_core/tradehub_core/doctype/listing_variant_item`
- Denetleyici: `tradehub_core/tradehub_core/doctype/listing_variant_item/listing_variant_item.py` (28 satır)
- Önerilen sahip bağlam: 03a-katalog

## Epic

- Epic adı: Listing Variant Item: 03a-katalog bağlamına taşıma
- Öncelik: Kritik
- Faz: Faz 4
- Tahmini büyüklük: Büyük

### User story

Bir satıcı olarak, varyant stoğumun sipariş, paylaşım ve içe aktarma işlemlerinde doğru kalmasını istiyorum.
Böylece yanlış stok yüzünden satış kaçırmam ya da fazla satış yapmam.

### Kabul kriterleri

- [ ] `utils/stock.py` varyant fonksiyonları `catalog/stock_service.py` içinde. Dış adlar korunuyor.
- [ ] `catalog/api.py` içinde `get_variants`, `get_variant_offer`, `upsert_variants`, `adjust_variant_stock`, `reserve_variant`, `release_variant` var.
- [ ] `shared_sync/projections.py` varyant satırlarını `upsert_variants` ile yazıyor. `frappe.db.delete` ve `get_doc().insert` kalmadı.
- [ ] `api/cart.py` varyant fiyatını `get_variant_offer` ile okuyor.
- [ ] Varyant stok sapma kontrolü (`check_variant_stock_drift.py`) temiz.
- [ ] `upsert_variants` `reserved_qty` alanına dokunmuyor. Test var.
- [ ] Characterization test: `Listing Variant Item` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- Sipariş kodundan `tabListing Variant Item` tablosuna ham `UPDATE` yazmayın. Katalog kuralı atlanır.
- Paylaşım bağlamından satırları doğrudan silip yeniden oluşturmayın. Yerel rezerv kaybolur.
- Üst ürünün `modified` alanını `set_value` ile elle yazmayın.
- `Listing Variant Item.validate` içindeki stok ve rezerv korumasını kaldırmayın. Eski form kaydı satışı geri alır.
- Eksen adlarını farklı yazımlarla çoğaltmayın. İleride `Product Attribute` koduna bağlanacak.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] Rezerv, düşüm ve iade için birim testleri geçiyor.
- [ ] `upsert_variants` rezerv koruma testi eklendi.
- [ ] Sepet varyant fiyat testi geçiyor.
- [ ] Mevcut varyant stok testleri geçiyor.
- [ ] `import-linter` geçiyor.
- [ ] `CODEOWNERS` katalog, sipariş ve paylaşım ekiplerinden inceleme istendi.
- [ ] Ruff lint temiz.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?
Bu alt tablo bir ürünün varyant satırlarını tutar. Varyant, aynı ürünün renk ya da beden gibi farklı seçeneğidir. Satır fiyat, stok, rezerve miktar, görsel ve stok kodu taşır. Ürün stoğu varyant satırlarından türetilir.

## Bugünkü bağımlılıklar
### Bu kaydın bağlandığı kayıtlar
- Link alanı yok. Eksen adları serbest metindir (`attribute_type`, `attribute_value`).
### Bu kayda dokunan kod
- `tradehub_core/tradehub_core/doctype/listing_variant_item/listing_variant_item.py:6-28`: doğrudan satır kaydında stok ve rezervi DB değeriyle koruyor
- `tradehub_core/tradehub_core/doctype/listing/listing.py:468-612`: ürün kaydı stoğu varyantlardan topluyor
- `tradehub_core/utils/stock.py:95,179,255,280,306`: sipariş akışı `variant_stock` ve `reserved_qty` alanlarını ham SQL ile yazıyor (04 işi)
- `tradehub_core/api/cart.py` (8 referans): sepet varyant fiyatını okuyor (04)
- `tradehub_core/catalog/service.py:389,486,678,962,1033,1091,1135`: içe aktarma ürün servisi okuyor ve yazıyor (03b)
- `tradehub_core/shared_sync/projections.py:311,356,517,528,576,589,593`: paylaşım bağlamı satırları siliyor, yazıyor, oluşturuyor
- `tradehub_core/shared_sync/media.py:465`, `cutover.py:478`, `onboarding.py:260`, `clone_adoption.py:405,486`: paylaşım bağlamı `set_value` ile yazıyor
- `tradehub_core/api/v1/catalog.py:829`: varyant güncellenince üst ürünün `modified` alanını yazıyor
- `tradehub_core/media/kare.py` (3 referans): görsel kare işleme okuyor (08)
- `tradehub_core/utils/sku.py`, `gtin.py`, `internal_barcode.py`: kod benzersizliği okuyor (03a)
### hooks.py kayıtları
- Kayıt yok. Ürün (`Listing`) kancaları dolaylı etkiler.

## Bağımlılık sorunları
1. `tradehub_core/utils/stock.py:95,179,255,280,306` sipariş bağlamı (04) varyant satırını ham SQL ile yazıyor. `Listing.validate` çalışmaz. Katalog kuralı atlanır. Sipariş kodu değişirse stok tutarsız kalır.
2. `tradehub_core/shared_sync/projections.py:576-593` paylaşım bağlamı satırları `frappe.db.delete` ve `frappe.get_doc(...).insert` ile doğrudan yönetiyor. Beş ayrı dosya aynı tabloyu yazıyor. Bu, en ağır çapraz yazma noktasıdır.
3. `tradehub_core/catalog/service.py:1091` içe aktarma ürün servisi varyant tablosuna `frappe.qb` ile gidiyor. Bu dosya `catalog/` adını taşıyor ancak 03b işi yapıyor. Ad karışıklığı var.
4. `tradehub_core/api/v1/catalog.py:829` üst ürünün `modified` alanı `set_value` ile elle yazılıyor. Denetim izi için kaydı atlamak kırılgandır.
5. Eksenler serbest metin. `Product Attribute` ile bağ yok. Aynı eksen farklı yazımla ("Renk", "renk") ayrı eksen olur.

## Hedef tasarım
- Sahip bağlam `03a-katalog`, paket yolu `tradehub_core/catalog/`.
- Dışarıya açılan fonksiyonlar (`catalog/api.py`): `get_variants(listing)` okuma modeli. `get_variant_offer(listing, variant_row)` fiyat ve stok verir (sepet için). `adjust_variant_stock(listing, variant_row, delta, reason)` stoğu değiştirir. `reserve_variant(listing, variant_row, qty)` ve `release_variant(...)` rezerv işlemleri. `upsert_variants(listing, rows)` içe aktarma ve paylaşım için toplu yazma.
- Yayınladığı olaylar: `catalog.variant_stock_changed` (listing, variant_row, old, new). Dinleyen: 03c öneri ve vitrin önbelleği. Dinlediği olaylar: `order.confirmed`, `order.cancelled`, `order.refunded` (rezerv ve düşüm için). Bugün bu iş `utils/stock.py` içinde doğrudan yapılıyor.
- Başka bağlamlara bağlantılar: `Cart Item` ve `Order Item` varyant satır adını `Data` alanda tutar. Bu bir anlık görüntü (snapshot) alanıdır. Belgelenir.
- Denetleyicide kalacak doğrulamalar: doğrudan kayıtta stok ve rezerv koruması (`listing_variant_item.py:21-28`). Servise taşınacak iş kuralı: stok toplama (`listing.py:468-612`) `catalog/stock_service.py` içine gider. Ham SQL yazmalar `adjust_variant_stock` ve `reserve_variant` olur.

## Geçiş adımları
1. `catalog/stock_service.py` oluşturun. `utils/stock.py` içindeki varyant fonksiyonlarını (`_update_variant_stock`, `_reserve_variant`, `_settle_variant_reservation`, `_return_variant`) buraya taşıyın. Dış ad değişmez.
2. `catalog/api.py` içine `get_variants`, `get_variant_offer`, `upsert_variants` ekleyin. Bağımsızdır.
3. `api/cart.py` varyant okumalarını `get_variant_offer` ile değiştirin. 2. adımdan sonra gelir.
4. `shared_sync/projections.py:576-593` ve diğer paylaşım yazmalarını `upsert_variants` ile değiştirin. 2. adımdan sonra gelir.
5. `order.*` olaylarını dinleyen `catalog/listeners.py` yazın. `utils/stock.py` çağrıları olay dinleyicisine döner. Outbox ve 1. adımdan sonra gelir.
6. Eksen adlarını `Product Attribute` koduna bağlayan yeni alan ekleyin (ileride, isteğe bağlı).

## Riskler ve testler
- Sipariş sonrası varyant stoğu doğru düşmeli. Test: `check_variant_stock_drift.py` kontrolü ve mevcut stok testleri korunur.
- Eski form kaydı bu arada yapılmış satışı geri almamalı. Test: `listing_variant_item.py:24-28` koruması için mevcut test korunur.
- Paylaşımdan gelen varyant yerel rezervi silmemeli. Test: `upsert_variants` `reserved_qty` alanına dokunmaz.
