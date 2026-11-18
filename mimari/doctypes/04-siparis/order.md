# Order

- Bağlam: 04-siparis
- Tür: Ana kayıt
- Klasör: `tradehub_core/tradehub_core/doctype/order`
- Denetleyici: `tradehub_core/tradehub_core/doctype/order/order.py` (535 satır)
- Önerilen sahip bağlam: 04-siparis

## Epic

- Epic adı: Order: 04-siparis bağlamına taşıma
- Öncelik: Kritik
- Faz: Faz 3
- Tahmini büyüklük: Büyük

### User story

Bir geliştirici olarak, sipariş durumunu tek bir yerden değiştirmek istiyorum.
Böylece ödeme, lojistik ve onay kodu birbirini bozmaz.

### Kabul kriterleri

- [ ] `Order.status` alanını yalnız `ordering/state.py` içindeki `transition` fonksiyonu yazıyor.
- [ ] `payments/service.py`, `logistics/hooks.py` ve `services/approval_workflow.py` içinde `Order` yazımı kalmadı.
- [ ] Ödeme tahsil edilince `payment.collected` olayı geliyor. Sipariş bir kez "Onaylanıyor" oluyor.
- [ ] Sipariş kesinleşince `order.confirmed` olayı yayınlanıyor. Olayın sözleşme testi geçiyor.
- [ ] Aynı sepet eski ve yeni yoldan aynı `grand_total_exact` değerini üretiyor.
- [ ] `import-linter` kontrolü `ordering` paketi için geçiyor.
- [ ] Characterization test: `Order` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- `logistics/hooks.py` içinden `Order.status` alanına yazmayın. Sipariş durumunu yalnız sipariş bağlamı değiştirir.
- `frappe.db.set_value("Order", ...)` kullanmayın. Bu yazım sipariş olaylarını atlar.
- Sipariş denetleyicisinden `tax_core` iç modüllerini çağırmayın. Vergiyi `tax.api.quote_order_taxes` hesaplar.
- Kesinleşmiş siparişin tutar ve vergi alanlarını değiştirmeyin. `order.py:372` bu kuralı korur.
- `hooks.py` içine yeni `Order` olayı eklemeyin. Yeni dinleyiciyi `ordering/subscriptions.py` dosyasına yazın.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] Durum geçişi için birim testi eklendi.
- [ ] `payment.collected` olayı iki kez gönderildi ve sipariş bir kez değişti.
- [ ] Tek sevkiyat iptal edilince durumun doğru geri döndüğü test edildi.
- [ ] Ödeme ve lojistik `CODEOWNERS` sahiplerinden inceleme istendi.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?
`Order` alıcının bir satıcıdan verdiği siparişi tutar. Kalemler `Order Item` alt tablosundadır. Vergi satırları `Order Tax Line` alt tablosundadır. Tutarlar sipariş anında hesaplanır ve sonra değişmez.

## Bugünkü bağımlılıklar
### Bu kaydın bağlandığı kayıtlar
- `User` (`buyer`): framework kaydı, kimlik bağlamı (01-kimlik-erisim)
- `Admin Seller Profile` (`seller`): başka bağlam (02-satici-magaza)
- `Currency` (`currency`, `coupon_currency`): framework kaydı
- `Shipping Method` (`shipping_method_id`): başka bağlam (07-lojistik)
- `Carrier Account` (`return_carrier_account`): başka bağlam (07-lojistik)
- `Order Contract Acceptance` (`contract_acceptance`): aynı bağlam
- `Order Item` (`items`, alt tablo): aynı bağlam
- `Order Tax Line` (`tax_lines`, alt tablo): başka bağlam (06-vergi-fatura)

### Bu kayda dokunan kod
`Order` adı test dışında 123 dosyada geçer. En yoğun paketler şunlardır: `shared_sync` (21 dosya), `payments` (20), `api` (17), `logistics` (11).
- `tradehub_core/api/cart.py:2066`: yazıyor (`create_order` siparişi kurar)
- `tradehub_core/api/cart.py:2163`: yazıyor (`contract_acceptance` alanı `db.set_value` ile)
- `tradehub_core/api/order.py:564`: yazıyor (iptalde `status` ve `save`)
- `tradehub_core/api/order.py:1489`: yazıyor (`seller_ship_order` durumu "Kargoda" yapar)
- `tradehub_core/payments/service.py:453`: yazıyor (tahsilatta durumu "Onaylanıyor" yapar)
- `tradehub_core/payments/service.py:182`: okuyor (`ensure_intent_for_order`)
- `tradehub_core/payments/manual_evidence.py:174`: yazıyor (`receipt_url`)
- `tradehub_core/logistics/hooks.py:339`: yazıyor (`fulfillment_status`, `shipment_count`, `status`)
- `tradehub_core/logistics/services/split_engine.py:285`: okuyor (sevkiyat taslağı için)
- `tradehub_core/services/order_approval_hooks.py:72`: yazıyor (`db_set("status", "Onaylanıyor")`)
- `tradehub_core/services/approval_workflow.py:509`: yazıyor (onay sonucu durum ve `save`)
- `tradehub_core/utils/stock.py:569`: yazıyor (`stock_deducted`)
- `tradehub_core/shared_sync/checkout.py:379`: yazıyor (durum "İptal Edildi")
- `tradehub_core/shared_sync/amendments.py:601`: yazıyor (durum)
- `tradehub_core/shared_sync/refund_links.py:148`: yazıyor (`refund_status`)
- `tradehub_core/invoice_documents/service.py:75`: okuyor (belge üretimi)

### Denetleyicinin kendi dış çağrıları
- `order.py:141`: `tax_core.engine` ve `tax_core.service` içini doğrudan çağırır.
- `order.py:155`: her kalem için `frappe.get_doc("Listing", ...)` okur (03a-katalog).
- `order.py:265`: `shared_sync.verification_gate.require` çağırır.
- `order.py:270`: `Admin Seller Profile.user` okur (02-satici-magaza).
- `order.py:336`: `contracts.reseller.reseller_mode` çağırır.
- `order.py:356`: `utils.stock.STOCK_RECORD_FIELDS` okur.

### hooks.py kayıtları
- `hooks.py:701`: `before_insert` olayında üç işleyici var. Kiracı izolasyonu, onaylı tedarikçi ve masraf merkezi denetlenir.
- `hooks.py:707`: `validate` olayında kiracı izolasyonu denetlenir.
- `hooks.py:708`: `before_save` olayında iki işleyici var. `api.listing.bump_listing_order_counts` ve `api.social_proof.invalidate_for_order` çalışır.
- `hooks.py:713`: `after_insert` olayında `tuple_sync.on_order_insert` ve `order_approval_hooks.on_order_after_insert` çalışır.
- `hooks.py:718`: `on_update` olayında tailored önbelleği ve `tuple_sync` çalışır.
- `hooks.py:723`: `on_trash` olayında `tuple_sync.on_order_trash` çalışır.
- `hooks.py:1408`: SEO atıf işleyicisi `after_insert` olayına eklenir.
- `hooks.py:1098` ve `hooks.py:1224`: liste ve kayıt izni `permissions.py` içindedir.

## Bağımlılık sorunları
1. Sipariş durumunu altı ayrı yer yazıyor. Kanıt: `payments/service.py:453`, `logistics/hooks.py:339`, `services/order_approval_hooks.py:72`, `services/approval_workflow.py:509`, `api/order.py:1489`, `shared_sync/checkout.py:379`. Biri durum kuralını değiştirince diğerleri bozulur. Bu sorun 05-odeme, 07-lojistik ve 01-kimlik-erisim bağlamlarını etkiler.
2. "Onaylanıyor" değeri iki anlam taşıyor. Ödeme bu değeri "ödendi" anlamında yazar (`payments/service.py:50`). Onay akışı aynı değeri "onay bekliyor" anlamında yazar (`services/order_approval_hooks.py:72`). Lojistik bu değeri ödeme kaydından yeniden türetir (`logistics/hooks.py:445`). Onay bekleyen sipariş satıcıya ödenmiş gibi görünebilir. Bu nokta doğrulanmadı, test ile denenmeli.
3. Lojistik, siparişi `frappe.db.set_value` ile yazıyor (`logistics/hooks.py:339`). Bu yazım `Order` olaylarını atlar. Bu yüzden önbellek temizliği elle çağrılır (`logistics/hooks.py:343`). Yeni bir `on_update` işleyicisi eklenirse lojistik yolu onu çalıştırmaz.
4. Lojistik, ödeme bağlamının içini içe aktarıyor (`logistics/hooks.py:444`). `find_intent` ve `Payment Intent.status` okunur. Ödeme durum adları değişirse lojistik bozulur.
5. Vergi hesabı sipariş denetleyicisinin içinde (`order.py:139`). Denetleyici `tax_core` iç modüllerini çağırır. Vergi motoru imzası değişirse her sipariş kaydı düşer.
6. Sepet akışı tek işlemde beş bağlamı çağırıyor (`api/cart.py:1885`, `api/cart.py:2151`, `api/cart.py:2160`, `api/cart.py:2170`, `api/cart.py:2176`). Lojistik, sözleşme, stok ve ödeme bu akışın içindedir. Bir bağlamdaki hata bütün siparişi düşürür.
7. Onay reddi siparişi yalnız "İptal Edildi" yapar (`services/approval_workflow.py:511`). Normal iptal yolu stoğu bırakır ve ödeme talebini kapatır (`api/order.py:536`, `api/order.py:579`). Onay reddi bu iki işi yapmaz. Bu nokta doğrulanmadı.
8. Onay işleyicisi `doc.seller_profile` alanını okur (`services/order_approval_hooks.py:54`). `Order` kaydında bu alan yok, alanın adı `seller`. Frappe bu durumda hata verirse onay akışı hiç başlamaz. Hata `except Exception` ile yutulur (`services/order_approval_hooks.py:77`). Bu nokta doğrulanmadı.
9. `before_save` olayı katalog sayaçlarını yazar (`hooks.py:708`). Sipariş her kaydedildiğinde 03a-katalog kodu çalışır.

## Hedef tasarım
- Sahip bağlam: 04-siparis. Paket yolu: `tradehub_core/ordering/`.
- Durum kuralları tek dosyada olur: `ordering/state.py`. Durumu yalnız `ordering.state.transition(order, to, reason)` yazar.
- Dışarıya açılan fonksiyonlar (`ordering/api.py`):
  - `place_orders(checkout: CheckoutInput) -> list[PlacedOrder]`
  - `get_order_summary(order: str) -> OrderSummary` (okuma modeli)
  - `get_payable_order(order: str) -> PayableOrder` (ödeme için okuma modeli)
  - `get_fulfillment_view(order: str) -> FulfillmentOrder` (lojistik için okuma modeli)
  - `request_cancellation(order: str, reason: str) -> CancellationResult`
- Yayınladığı olaylar:
  - `order.placed`: sipariş ve kalemler yazıldı. Veri: `order`, `buyer`, `seller`, `currency`, `grand_total_exact`, `items`.
  - `order.approval_required` ve `order.approved`: alıcı şirketinin onay akışı.
  - `order.confirmed`: ödeme tahsil edildi ve onay tamam. Veri: `order`, `seller`, `buyer`, `order_date`, `items` (`order_item`, `listing`, `qty`, `supplier`).
  - `order.cancelled`: veri `order`, `reason`, `stage`.
  - `order.completed`: bütün kalemler teslim edildi.
- Dinlediği olaylar:
  - `payment.collected` (05-odeme): sipariş "Ödendi" durumuna geçer. Sonra `order.confirmed` yayınlanır.
  - `payment.refunded` (05-odeme): `refund_status` güncellenir.
  - `order.tax_calculated` (06-vergi-fatura): sipariş vergi belgesinin hazır olduğunu kaydeder.
  - `shipment.created`, `shipment.handed_over`, `shipment.delivered`, `shipment.cancelled` (07-lojistik): `fulfillment_status` ve durum siparişin kendi kodunda türetilir.
- Olay zinciri:
  1. Sepet onayında sipariş bağlamı `tax.api.quote_order_taxes(...)` çağırır. Bu çağrı yalnız hesaplar, hiçbir şey yazmaz.
  2. Sipariş bağlamı siparişi, kalemleri ve vergi anlık görüntüsünü yazar. Aynı işlemde `order.placed` olayı Outbox kaydına yazılır.
  3. Ödeme bağlamı tahsilatı doğrular. Sonra `payment.collected` olayını yayınlar.
  4. Sipariş bağlamı bu olayı işler. Durumu değiştirir ve `order.confirmed` yayınlar.
  5. Vergi bağlamı `order.confirmed` olayını işler. Vergi kaydını kesinleştirir ve fatura taslağını açar. Sonra `order.tax_calculated` yayınlar.
  6. Lojistik bağlamı `order.tax_calculated` olayını işler. Sevkiyat taslağını açar ve `shipment.created` yayınlar.
- Başka bağlamlara bağlantılar:
  - Kalacak Link alanları: `buyer`, `seller`, `shipping_method_id`, `return_carrier_account`, `contract_acceptance`.
  - Anlık görüntü alanları: `shipping_method`, `shipping_quote`, `estimated_delivery_*`, `billing_*`, `incoterm*`, `contract_payment_model`. Bu alanlar belgede "anlık görüntü" diye işaretlenir.
  - `fulfillment_status` ve `shipment_count` lojistik olaylarından türeyen okuma alanlarıdır. Bunları yalnız sipariş bağlamı yazar.
  - `receipt_url`, `remittance_*` alanları ödeme verisidir. Bu alanlar ödeme okuma modeline taşınır.
- Denetleyicide kalacak doğrulamalar: para birimi ve tedarikçi kimliği (`order.py:285`), stok kaydı koruması (`order.py:348`), vergi kanıtı değişmezliği (`order.py:372`), toplam hesabı (`order.py:433`).
- Servise taşınacak iş kuralları: vergi hesabı (`order.py:139`) vergi bağlamının `quote_order_taxes` fonksiyonuna gider. KYC ve KYB kapısı (`order.py:262`, `order.py:507`) `identity.api.require_verified(...)` çağrısına döner.

## Geçiş adımları
1. Paylaşılan olay altyapısını kurun: `shared/events.py`, Outbox DocType ve alıcı makbuzu DocType. Bu adım her şeyden önce gelir.
2. `ordering/state.py` dosyasını açın. Bütün durum adlarını sabit olarak buraya koyun. `payments/service.py:49` sabitleri buradan okusun.
3. `ordering/api.py` içine `get_payable_order` ve `get_fulfillment_view` okuma modellerini ekleyin. Bu adım 1. adıma bağlı değildir.
4. Ödemenin sipariş yazımını kaldırın. `payments/service.py:453` yerine `payment.collected` olayı yayınlansın. Sipariş işleyicisi durumu değiştirsin. Bu adım 1. ve 2. adımdan sonra gelir.
5. Onay akışının sipariş yazımını kaldırın (`services/order_approval_hooks.py:72`, `services/approval_workflow.py:509`). Onay sonucu olay olarak gelsin. Bu adım 2. adımdan sonra gelir.
6. Lojistiğin sipariş yazımını kaldırın (`logistics/hooks.py:339`). Lojistik `shipment.*` olaylarını yayınlasın. Sipariş bağlamı türetmeyi kendi kodunda yapsın. Bu adım 1. adımdan sonra gelir.
7. Vergi hesabını `tax/api.py` içine taşıyın. `order.py:139` bu fonksiyonu çağırsın. Ayrıntı `06-vergi-fatura/README.md` içindedir.
8. `api/cart.py:create_order` akışını `ordering/checkout.py` içine taşıyın. Lojistik ve sözleşme çağrıları yalnız public API üzerinden yapılsın.
9. `before_save` katalog sayacını (`hooks.py:708`) `order.placed` olayına bağlayın. Sayaç 03a-katalog bağlamında güncellensin.
10. DocType JSON `module` alanını "Ordering" yapın. Bu adım en son gelir. Önce `modules.txt` güncellenir.

## Riskler ve testler
- Ödeme sonrası durum geçişi kırılabilir. Test: `payment.collected` olayı iki kez gelince sipariş bir kez değişmeli ve stok bir kez düşmeli.
- Onay bekleyen sipariş satıcıya ödenmiş görünebilir. Test: onay bekleyen siparişte satıcı "kargola" düğmesini kullanamamalı.
- Sevkiyat iptalinde durum geri dönüşü bozulabilir (`logistics/hooks.py:424`). Test: tek sevkiyat iptal edilince durum ödeme durumuna göre geri dönmeli.
- Vergi tutarı değişebilir. Test: aynı sepet eski ve yeni yoldan aynı `grand_total_exact` değerini üretmeli.
- Paylaşılan senkron siparişleri (`shared_sync`) ayrı durum yazar. Test: `shared_sync/checkout.py:379` yolunda iptal yeni durum fonksiyonundan geçmeli.
