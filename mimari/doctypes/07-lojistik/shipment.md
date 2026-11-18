# Shipment

- Bağlam: 07-lojistik
- Tür: Ana kayıt
- Klasör: `tradehub_core/tradehub_core/doctype/shipment`
- Denetleyici: `tradehub_core/tradehub_core/doctype/shipment/shipment.py` (398 satır)
- Önerilen sahip bağlam: 07-lojistik

## Epic

- Epic adı: Shipment: 07-lojistik bağlamına taşıma
- Öncelik: Kritik
- Faz: Faz 3
- Tahmini büyüklük: Büyük

### User story

Bir geliştirici olarak, sevkiyat kodunun siparişe doğrudan yazmasını istemiyorum.
Böylece sipariş ekibi bir durum adını değiştirince lojistik bozulmaz.

### Kabul kriterleri

- [ ] `tradehub_core/logistics/api.py` ve `contracts.py` dosyaları var. Sipariş iptali yalnız bu dosyadaki fonksiyonları çağırıyor.
- [ ] `logistics/hooks.py` içinde `Order` tablosuna yazan satır yok. `Order` alanlarını `order.fulfillment_changed` dinleyicisi yazıyor.
- [ ] Aynı `order.fulfillment_changed` olayı iki kez işlenince `Order` kaydı bir kez değişiyor. Bunu bir test gösteriyor.
- [ ] `order_lock.py` ödeme bağlamının genel kilit fonksiyonunu kullanıyor. `_lock_intent` çağrısı kalmadı.
- [ ] `order.confirmed` olayı gelince aynı sipariş için tek taslak sevkiyat açılıyor. Özellik bayrağı kapalıyken davranış değişmiyor.
- [ ] `import-linter` kontrolü geçiyor. Dış kod `tradehub_core.logistics` içinden yalnız `api` ve `contracts` içe aktarıyor.
- [ ] Characterization test: `Shipment` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- `logistics/hooks.py` içinden `Order.status` alanına yazmayın. Sipariş durumunu yalnız sipariş bağlamı değiştirir.
- `Order Item.cancelled_qty` alanına lojistikten yazmayın. Bu alan sipariş bağlamına aittir.
- Ödeme bağlamının `_lock_intent` gibi alt çizgili fonksiyonlarını yeni yerlerden çağırmayın. Ödeme ekibi bu adı değiştirebilir.
- `create_shipment_draft_from_order` içinde kilitten sonra `frappe.db.commit()` çağırmayın. Commit kilidi erken bırakır ve yarışı geri açar.
- `hooks.py` içinde `Shipment` için yeni `doc_events` kaydını doğrudan eklemeyin. Kaydı lojistiğin kanca dosyasına ekleyin.
- `shared_sync/schema.py` tetikleyicisini haber vermeden değiştirmeyin. Paylaşımlı stok ekibi bu tetikleyiciye güvenir.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] `test_shipment_core.py`, `test_split_concurrency.py`, `test_order_cancellation.py` ve `test_order_shipping.py` geçiyor.
- [ ] Yeni olaylar için sözleşme testi eklendi. Test olay verisindeki alanları denetliyor.
- [ ] Olay dinleyicisinin tekrar güvenli olduğunu gösteren test eklendi.
- [ ] `import-linter` kontrolü yerelde geçiyor.
- [ ] Sipariş ekibinden ve ödeme ekibinden `CODEOWNERS` incelemesi istendi.
- [ ] Özellik bayrağı kapalıyken eski akışın aynı çalıştığı denendi.
- [ ] Lojistik sözleşme dosyasına dokunulduysa `python3 scripts/gen_logistics_types.py --check` çalıştırıldı.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?

`Shipment` bir siparişin satıcıdan alıcıya giden bir sevkiyatını tutar. Bir siparişin birden çok sevkiyatı olabilir. Kayıt kalemleri, kolileri, paletleri ve adres kopyalarını alt tablolarda saklar. Taşıyıcı, takip numarası, maliyet ve durum bilgisi de bu kayıttadır.

## Bugünkü bağımlılıklar

### Bu kaydın bağlandığı kayıtlar

- `Order` (`order`, zorunlu): başka bağlam (04-siparis)
- `Admin Seller Profile` (`seller_profile`, zorunlu): başka bağlam (02-satici-magaza)
- `User` (`buyer`): çekirdek Frappe kaydı
- `Currency` (`currency`): çekirdek Frappe kaydı
- `Shipping Method` (`shipping_method`): aynı bağlam
- `Shipping Channel` (`channel`): aynı bağlam
- `Logistics Provider` (`carrier`): aynı bağlam
- `Carrier Account` (`carrier_account`): aynı bağlam
- `Carrier Service` (`carrier_service`): aynı bağlam
- `Proof of Delivery` (`proof_of_delivery`): aynı bağlam
- `Shipping Price Rule` (`applied_pricing_rule`): aynı bağlam
- `Shipment` (`return_of`): aynı bağlam
- Alt tablolar: `Shipment Item`, `Shipment Package`, `Shipment Package Content`, `Shipment Pallet`, `Shipment Address Snapshot`, `Shipment Document`. Hepsi aynı bağlamdadır.

### Bu kayda dokunan kod

Lojistik içinden:

- `tradehub_core/logistics/services/split_engine.py:150`: yazıyor. Siparişten taslak sevkiyat açan tek fonksiyon budur.
- `tradehub_core/logistics/services/split_engine.py:358`: yazıyor. Siparişin kargo ücretini `frappe.db.set_value` ile sevkiyata kopyalıyor.
- `tradehub_core/logistics/services/shipment_service.py:26`: yazıyor. Durum geçişlerini yapan motor budur.
- `tradehub_core/logistics/services/packaging_service.py:85`: okuyor ve yazıyor. Koli ve palet işlerini yapıyor.
- `tradehub_core/logistics/services/manual_shipment.py:158`: yazıyor. Elle sevkiyat açıyor.
- `tradehub_core/logistics/services/shipment_import.py:385`: yazıyor. CSV dosyasından sevkiyat açıyor.
- `tradehub_core/logistics/return_shipping.py:151`: yazıyor. İade sevkiyatı açıyor.
- `tradehub_core/logistics/services/carrier_measurement.py:131`: yazıyor. Taşıyıcının ölçtüğü desiyi yazıyor.
- `tradehub_core/logistics/services/shipment_money.py:162`: yazıyor. Taşıyıcı hesabını ve maliyeti yazıyor.
- `tradehub_core/logistics/services/tracking_ingest.py:96`: okuyor ve yazıyor. Taşıyıcı takip olaylarını işliyor.
- `tradehub_core/logistics/jobs/tracking_poll.py:136`: okuyor. Zamanlanmış takip sorgusu yapıyor.
- `tradehub_core/logistics/services/order_cancellation.py:145`: yazıyor. Sipariş iptalinde taslakları iptal ediyor.
- `tradehub_core/api/v1/shipment.py:198`: yazıyor. Satıcı ve operatör için REST ucu.

Başka bağlamlardan:

- `tradehub_core/api/order.py:412`: okuyor. Sipariş iptali sevkiyat durumuna bakıyor.
- `tradehub_core/api/order.py:428`: yazıyor. Sipariş iptali lojistik servislerini doğrudan çağırıyor.
- `tradehub_core/shared_sync/order_events.py:163`: doc_event. Kayıttan önce paylaşımlı stok olayı yazıyor.
- `tradehub_core/shared_sync/amended_fulfillment.py:78`: doc_event. Kayıttan önce alanları düzeltiyor.
- `tradehub_core/shared_sync/schema.py:46`: şemaya `shared_sync_physical_id` alanı ekliyor.
- `tradehub_core/shared_sync/schema.py:218`: tabloya veritabanı tetikleyicisi koyuyor.
- `tradehub_core/shared_sync/cutover.py:225`: okuyor ve kilitliyor.
- `tradehub_core/shared_sync/customer_orders.py:183`: okuyor.
- `tradehub_core/shared_sync/amendments.py:104`: okuyor.
- `tradehub_core/listing_purge/executor.py:387`: siliyor. Ürün kalıcı silme akışı sevkiyatı siliyor.
- `tradehub_core/media/file_isolation.py:235`: okuyor. Etiket dosyasının sahibini buluyor.

### hooks.py kayıtları

- `tradehub_core/hooks.py:1030`: `before_validate` olarak `shared_sync.amended_fulfillment.normalize` çalışıyor.
- `tradehub_core/hooks.py:1031`: `before_insert` olarak kiracı koruması ve iki kopya alma fonksiyonu çalışıyor.
- `tradehub_core/hooks.py:1036`: `validate` olarak kiracı, durum geçişi ve bölme kuralları çalışıyor.
- `tradehub_core/hooks.py:1041`: `after_insert` olarak `logistics.hooks.on_shipment_created` çalışıyor.
- `tradehub_core/hooks.py:1044`: `before_save` olarak `shared_sync.order_events.before_shipment_save` çalışıyor.
- `tradehub_core/hooks.py:1045`: `on_update` olarak `logistics.hooks.on_shipment_status_change` çalışıyor.
- `tradehub_core/hooks.py:1054`: `after_delete` olarak `logistics.hooks.update_order_fulfillment` çalışıyor.
- `tradehub_core/hooks.py:1152` ve `tradehub_core/hooks.py:1276`: kiracı okuma ve yazma izinleri.
- `tradehub_core/hooks.py:220`: her 5 dakikada takip sorgusu çalışıyor.
- `tradehub_core/hooks.py:238`: her saat gecikme denetimi çalışıyor.

## Bugün siparişten sevkiyat nasıl oluşuyor?

Bu bölüm bugünkü akışı adım adım anlatır.

1. Alıcı sepeti onaylar. `tradehub_core/api/cart.py:2088` siparişe kargo yöntemini ve kargo fiyatını yazar. Bu bilgi lojistiğin fiyat modülünden gelir (`tradehub_core/api/cart.py:1885`).
2. Ödeme alınır. `tradehub_core/payments/service.py:453` siparişin durumunu "Onaylanıyor" yapar. Bu anda hiçbir olay yayınlanmaz. Sevkiyat da otomatik açılmaz.
3. Satıcı ya da operatör sevkiyatı elle başlatır. Dört giriş yolu vardır:
   - REST ucu `create_shipment` (`tradehub_core/api/v1/shipment.py:198`).
   - Elle sevkiyat ucu `create_manual_shipment` (`tradehub_core/api/v1/shipment.py:288`).
   - CSV içe aktarma (`tradehub_core/logistics/services/shipment_import.py:385`).
   - İade sevkiyatı (`tradehub_core/logistics/return_shipping.py:131`). Bu fonksiyonu çağıran üretim kodu bulunamadı. Bu nokta doğrulanmadı.
4. İlk üç yol `create_shipment_draft_from_order` fonksiyonuna varır (`tradehub_core/logistics/services/split_engine.py:150`).
5. Fonksiyon önce ödeme kaydını ve siparişi kilitler (`tradehub_core/logistics/services/order_lock.py:66`). Bunun için ödeme bağlamının iç fonksiyonu `_lock_intent` çağrılır.
6. Fonksiyon siparişin iptal edilip edilmediğine bakar (`tradehub_core/logistics/services/split_engine.py:279`).
7. Fonksiyon `Order` kaydını ve kalemlerini okur (`tradehub_core/logistics/services/split_engine.py:285`). Kalan miktarları hesaplar.
8. Fonksiyon taslak `Shipment` kaydını ekler (`tradehub_core/logistics/services/split_engine.py:335`).
9. Ekleme sırasında `before_insert` kancaları çalışır. Bu kancalar `Addresses`, `Order Item` ve `Listing` kayıtlarını okur (`tradehub_core/logistics/hooks.py:89`, `tradehub_core/logistics/hooks.py:114`).
10. `after_insert` kancası `update_order_fulfillment` fonksiyonunu çağırır (`tradehub_core/logistics/hooks.py:173`).
11. Bu fonksiyon `Order` kaydına doğrudan yazar (`tradehub_core/logistics/hooks.py:339`). `fulfillment_status`, `shipment_count` ve `status` alanları değişir.
12. Son olarak siparişin kargo ücreti ilk sevkiyata kopyalanır (`tradehub_core/logistics/services/split_engine.py:340`).

Eski bir yol daha vardır. `tradehub_core/api/order.py:1455` sevkiyat açmadan siparişe "Kargoda" yazar (`tradehub_core/api/order.py:1489`). Bu yol lojistik kayıtlarını hiç kullanmaz.

## Bağımlılık sorunları

1. Lojistik, sipariş tablosuna doğrudan yazıyor. Kanıt: `tradehub_core/logistics/hooks.py:339`. Sipariş durumu kuralları iki bağlama dağılıyor. Sipariş ekibi bir durum adını değiştirirse lojistik bozulur.
2. Lojistik, sipariş durumunu ödeme kaydına bakarak geri alıyor. Kanıt: `tradehub_core/logistics/hooks.py:439`. Bu kod `Payment Intent` tablosunu okuyor. Ödeme ekibinin değişikliği lojistiği bozabilir (05-odeme).
3. Lojistik, ödeme bağlamının iç kilit fonksiyonunu çağırıyor. Kanıt: `tradehub_core/logistics/services/order_lock.py:66`. Alt çizgili `_lock_intent` bir iç fonksiyondur. Adı değişirse sevkiyat açılamaz.
4. Sipariş iptali lojistik iç servislerini çağırıyor. Kanıt: `tradehub_core/api/order.py:428`. İptal kuralı iki bağlamın iç koduna bağlı. Lojistik servis adı değişirse iptal bozulur.
5. Lojistik, `Order Item.cancelled_qty` alanına yazıyor. Kanıt: `tradehub_core/logistics/services/order_cancellation.py:264`. Bu alan sipariş bağlamına aittir.
6. Paylaşımlı stok kodu her kayıtta çalışıyor. Kanıt: `tradehub_core/hooks.py:1044` ve `tradehub_core/shared_sync/order_events.py:103`. Bu kod `Order` kaydını kilitliyor ve ödeme yükümlülüğünü denetliyor. Sevkiyat kaydı üç bağlamın kuralına bağlı hale geliyor.
7. Paylaşımlı stok kodu tabloya veritabanı tetikleyicisi koyuyor. Kanıt: `tradehub_core/shared_sync/schema.py:218`. Lojistik ekibi bu tetikleyiciyi kodda göremez.
8. Ürün kalıcı silme akışı sevkiyatı siliyor. Kanıt: `tradehub_core/listing_purge/executor.py:344`. Katalog bağlamı lojistik kaydını kendi kurallarıyla siliyor.
9. Sevkiyat açılışı olayla değil, elle başlıyor. Ödeme sonrası hiçbir olay yok (`tradehub_core/payments/service.py:453`). Vergi ve lojistik akışı bu yüzden zincirlenemiyor.
10. Eski "Kargoda" yolu sevkiyat kaydı açmıyor. Kanıt: `tradehub_core/api/order.py:1489`. Lojistik bu yüzden kural 2 ile o siparişlere hiç dokunmuyor (`tradehub_core/logistics/hooks.py:409`). Aynı iş için iki doğruluk kaynağı var.
11. Fiyat hesabı katalogdaki KDV oranını doğrudan okuyor. Kanıt: `tradehub_core/logistics/services/pricing_engine.py:54`. Vergi kuralı değişirse kargo fiyatı da değişir (06-vergi-fatura).

## Hedef tasarım

- Sahip bağlam ve paket yolu: 07-lojistik. Paket `tradehub_core/logistics/` zaten vardır. DocType klasörü `tradehub_core/logistics/doctype/shipment/` olur. JSON `module` alanı "Logistics" olur.
- Dışarıya açılan fonksiyonlar (`tradehub_core/logistics/api.py`):
  - `create_shipment_draft(order: str, items: list[ShipmentLineInput] | None, idempotency_key: str | None) -> ShipmentSummary`
  - `get_order_shipments(order: str) -> list[ShipmentSummary]`
  - `get_shipped_quantities(order: str) -> dict[str, ShippedQty]`. Sipariş iptali bu okuma ile karar verir.
  - `get_cancellation_block(order: str) -> str | None`
  - `cancel_open_shipments(order: str, reason: str) -> list[str]`
- Yayınladığı olaylar:
  - `shipment.created`: `shipment`, `order`, `seller_profile`, `lines`.
  - `shipment.status_changed`: `shipment`, `order`, `old_status`, `new_status`, `occurred_at`.
  - `shipment.handed_over`: taşıyıcı malı aldığında yayınlanır.
  - `shipment.delivered` ve `shipment.cancelled`.
  - `order.fulfillment_changed`: `order`, `fulfillment_status`, `shipment_count`, `ordered_qty`, `handed_over_qty`, `delivered_qty`. Sipariş bağlamı bu olayı dinler. `Order` alanlarını kendisi yazar.
- Dinlediği olaylar:
  - `order.confirmed` ya da `order.tax_calculated`: taslak sevkiyat açılır. Hangisinin kullanılacağına ürün sahibi karar verir.
  - `order.cancelled`: yola çıkmamış taslaklar iptal edilir.
  - `return.approved`: iade sevkiyatı açılır.
  - `user.account_deleted`: adres kopyası anonim yapılır.
- Başka bağlamlara bağlantılar:
  - `order` ve `seller_profile` Link alanları kalır. İkisi de kararlı ana kayıttır.
  - `buyer` Link alanı kalır.
  - Adres ve kalem bilgileri anlık görüntü (snapshot) olarak kalır. Anlık görüntü, kaydın o anki kopyasıdır.
  - Sipariş bilgisi olay verisinden gelir. Lojistik `Order` kaydını okumak için sipariş bağlamının okuma modelini kullanır.
- Denetleyicide kalacak doğrulamalar: durum geçişi, bölme kuralları, maliyet alanı koruması, kopya değişmezliği, koli toplamları.
- Servise taşınacak iş kuralları: sipariş durumunu türetme (`_derive_order_status`) sipariş bağlamına taşınır. Kargo ücreti kopyalama olay verisine bağlanır.

## Geçiş adımları

1. `tradehub_core/logistics/contracts.py` dosyasını ekleyin. `ShipmentSummary` ve `ShipmentLineInput` tiplerini yazın. Davranış değişmez.
2. `tradehub_core/logistics/api.py` dosyasını ekleyin. İçeride bugünkü `split_engine` ve `order_cancellation` fonksiyonlarını çağırın. Adım 1'den sonra gelir.
3. `tradehub_core/api/order.py:412` ve `tradehub_core/api/order.py:428` çağrılarını `logistics.api` fonksiyonlarına çevirin. Adım 2'den sonra gelir.
4. Ortak olay altyapısı (Outbox) hazır olunca `order.fulfillment_changed` olayını yayınlayın. Bu adım 14-platform-cekirdek bağlamındaki Outbox işine bağlıdır.
5. Sipariş bağlamında bu olayın dinleyicisini yazın. Dinleyici `Order` alanlarını yazsın. Bir süre iki yol birlikte çalışsın.
6. `tradehub_core/logistics/hooks.py:339` satırındaki doğrudan yazmayı kaldırın. Adım 5 canlıda doğrulandıktan sonra gelir.
7. Ödeme bağlamı `lock_payment_for_order(order)` adında genel bir fonksiyon açsın. `order_lock.py` bu fonksiyonu kullansın.
8. `Order Item.cancelled_qty` yazımını sipariş bağlamına taşıyın. Lojistik yalnız `get_shipped_quantities` sağlasın.
9. `order.confirmed` dinleyicisini bir özellik bayrağı arkasında ekleyin. Bayrak kapalıyken davranış değişmez.
10. `shared_sync` kancalarını `shipment.status_changed` olayına bağlayın. Bu adım paylaşımlı stok ekibiyle birlikte yapılır.
11. DocType klasörünü "Logistics" modülüne taşıyın. Taşıma için bir yama (patch) yazın. Bu adım en sona kalır.

## Riskler ve testler

- Sipariş durumu "Kargoda" ve "Tamamlandı" gecikmeli yazılabilir. Olay işleme sonrası durum testi ekleyin.
- İki yol birlikte çalışırken sipariş alanı iki kez yazılabilir. Dinleyicinin tekrar güvenli (idempotent) olduğunu test edin.
- Sipariş iptali ile sevkiyat açılışı yarışabilir. `tradehub_core/logistics/tests/test_split_concurrency.py` testlerini her adımda çalıştırın.
- Paylaşımlı stok olayı kaybolabilir. Fiziksel teslim durumunda `shipment_fact` kaydının oluştuğunu test edin.
- `order.confirmed` ile otomatik taslak açılırsa elle açma ile çakışabilir. Aynı sipariş için tek taslak oluştuğunu test edin.
