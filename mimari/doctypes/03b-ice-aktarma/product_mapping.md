# Product Mapping

- Bağlam: 03b-ice-aktarma
- Tür: Ana kayıt
- Klasör: `tradehub_core/tradehub_core/doctype/product_mapping`
- Denetleyici: `tradehub_core/tradehub_core/doctype/product_mapping/product_mapping.py` (24 satır)
- Önerilen sahip bağlam: 03b-ice-aktarma

## Epic

- Epic adı: Product Mapping: 03b-ice-aktarma bağlamına taşıma
- Öncelik: Önemli
- Faz: Faz 4
- Tahmini büyüklük: Orta

### User story

Bir platform yöneticisi olarak, ürün eşlemesinin ürün ya da mağaza kaydını yavaşlatmadan arkada çalışmasını istiyorum.
Böylece satıcı ürün kaydederken beklemez ve elle verdiğim karar korunur.

### Kabul kriterleri

- [ ] `detach_mappings_for_listing` ve `recompute_buybox_for_seller` servis fonksiyonları var.
- [ ] `hooks.py:1399-1401` kancaları `catalog.listing_*` ve `seller_store.profile_updated` dinleyicisinde. Mağaza güncellemesi `frappe.enqueue` ile arka planda.
- [ ] Ürün silinince eşleme "Detached" oluyor ve `previous_catalog_product` doluyor. Test var.
- [ ] Elle karar `rematch` sonrası korunuyor. Test var.
- [ ] Aynı `mapping_key` ikinci kayıtta hata veriyor. Test var.
- [ ] Characterization test: `Product Mapping` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- `Admin Seller Profile.on_update` içinde tüm ürünleri eşzamanlı taramayın. Büyük mağazada kayıt yavaşlar.
- `hooks.py` içine yeni kanca eklemeyin. Olay dinleyicisi yazın.
- `variant_item` alanını Link yapmayın. Anlık görüntü olarak belgelenir.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] Ayırma, teklik ve elle karar testleri geçiyor.
- [ ] Arka plan iş testi eklendi.
- [ ] `import-linter` geçiyor.
- [ ] `CODEOWNERS` içe aktarma ekibinden inceleme istendi.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?
Product Mapping bir ürün kartını (Listing) ortak katalog ürününe bağlar. Eşleşme barkodla, marka ve parça numarasıyla ya da elle yapılır. Durum "Pending", "Review", "Mapped", "Rejected" ya da "Detached" olur. Varyant satırı için ayrı eşleme de tutulur.

## Bugünkü bağımlılıklar
### Bu kaydın bağlandığı kayıtlar
- `Listing` (listing): başka bağlam (03a-katalog)
- `Catalog Product` (catalog_product, previous_catalog_product): aynı bağlam
- `User` (decided_by): başka bağlam (01-kimlik-erisim)
- `variant_item` alanı `Data` (varyant satır adı, anlık görüntü)
### Bu kayda dokunan kod
- `tradehub_core/tradehub_core/doctype/product_mapping/product_mapping.py:11-24`: anahtar üretimi ve durum kuralları
- `tradehub_core/catalog/service.py:202,245-271,293,426-427,502,521,578,862,953,1002,1077,1147`: eşleştirme servisi oluşturuyor, okuyor, yazıyor
- `tradehub_core/catalog/hooks.py:20-40`: ürün silinince satırı "Detached" yapıyor (`set_value`)
- `tradehub_core/catalog/hooks.py:44-62`: mağaza güncellenince buybox yeniden hesaplanıyor
- `tradehub_core/listing_purge/preview.py`: ürün silme aracı bağı sayıyor
### hooks.py kayıtları
- `tradehub_core/hooks.py:1399`: `Listing.on_update` eşleştirme
- `tradehub_core/hooks.py:1400`: `Listing.on_trash` ayırma
- `tradehub_core/hooks.py:1401`: `Admin Seller Profile.on_update` buybox

## Bağımlılık sorunları
1. `tradehub_core/hooks.py:1399-1401` üç kanca iki başka bağlamın (03a, 02) kaydına bağlı. Mağaza profili kaydedilince `on_seller_update` tüm ürünleri tarıyor (`catalog/hooks.py:48`). Büyük mağazada kayıt yavaşlar.
2. `tradehub_core/catalog/hooks.py:27-32` ürün silinirken `set_value` ile `update_modified=False` yazıyor. Denetleyici kuralı atlanır. Kabul edilebilir ancak servis fonksiyonu olmalı.
3. `tradehub_core/catalog/service.py:59-100` ürün alanlarını doğrudan okuyor. Katalog şeması değişince eşleştirme kırılır.

## Hedef tasarım
- Sahip bağlam `03b-ice-aktarma`, paket yolu `tradehub_core/import_pipeline/matching/`.
- Dışarıya açılan fonksiyonlar (`import_pipeline/api.py`): `get_mapping_for_listing(listing)`, `decide_mapping(mapping, action, product)` (yönetici), `rematch_listing(listing)`.
- Yayınladığı olay: `matching.mapping_changed` (listing, product, status). Dinleyen: 03c-kesif buybox, vitrin önbelleği. Dinlediği olaylar: `catalog.listing_updated`, `catalog.listing_deleted`, `seller_store.profile_updated`.
- Başka bağlamlara bağlantılar: `listing` Link alanı kalır. Ürün kararlı kök kayıttır. `variant_item` `Data` anlık görüntü olarak belgelenir.
- Denetleyicide kalacak doğrulamalar: anahtar üretimi, güven aralığı, "Mapped" için ürün zorunlu, karar veren kayıt. Servise taşınacak iş kuralı: ayırma (`catalog/hooks.py:20-40`) `detach_mappings_for_listing(listing)` olur.

## Geçiş adımları
1. `detach_mappings_for_listing` ve `recompute_buybox_for_seller` servis fonksiyonlarını yazın. `catalog/hooks.py` bunları çağırır.
2. `hooks.py:1399-1401` kancalarını olay dinleyicisine taşıyın. `on_seller_update` işi `frappe.enqueue` ile arka plana alınır. Outbox gerekir.
3. Katalog okumalarını `catalog.api.get_listing` ile değiştirin.
4. `module` alanını "Import Pipeline" yapın.

## Riskler ve testler
- Ürün silinince eşleme "Detached" olmalı. Test: `catalog.listing_deleted` dinleyicisi durumu değiştirir ve `previous_catalog_product` saklar.
- Aynı ürün ve varyant için ikinci eşleme reddedilmeli. Test: aynı `mapping_key` ikinci kayıtta hata verir.
- Elle karar otomatik eşleştirmeyle ezilmemeli. Test: `Manual` karar `rematch` sonrasında korunur.
