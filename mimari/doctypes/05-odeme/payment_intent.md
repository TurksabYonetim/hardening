# Payment Intent

- Bağlam: 05-odeme
- Tür: Ana kayıt
- Klasör: `tradehub_core/tradehub_core/doctype/payment_intent`
- Denetleyici: `tradehub_core/tradehub_core/doctype/payment_intent/payment_intent.py` (267 satır)
- Önerilen sahip bağlam: 05-odeme

## Epic

- Epic adı: Payment Intent: 05-odeme bağlamına taşıma
- Öncelik: Kritik
- Faz: Faz 3
- Tahmini büyüklük: Büyük

### User story

Bir geliştirici olarak, ödeme durumunu belgeli bir fonksiyondan okumak istiyorum.
Böylece ödeme durum adı değişince lojistik ve sipariş bozulmaz.

### Kabul kriterleri

- [ ] `payments/api.py` ve `payments/contracts.py` dosyaları var.
- [ ] `logistics/hooks.py` ödeme durumunu `get_payment_status` ile okuyor.
- [ ] `api/order.py` ödeme talebini doğrudan okumuyor.
- [ ] Eşzamanlı iki çağrı aynı siparişe tek talep açıyor.
- [ ] `import-linter` kontrolü `payments` paketi için geçiyor.
- [ ] Characterization test: `Payment Intent` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- Başka bağlamdan `frappe.db.get_value("Payment Intent", ..., "status")` okumayın. `get_payment_status` kullanın.
- Talebin tutarını deneme açıldıktan sonra değiştirmeyin. `payment_intent.py:238` bunu engeller.
- Kilit sırasını bozmayın. Önce `Payment Intent`, sonra `Order` kilitlenir.
- Talep durumunu elle yazmayın. Durum tahsilatlardan türetilir.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] Durum türetme testleri geçiyor.
- [ ] Eşzamanlı açılış testi geçiyor.
- [ ] Lojistik geri dönüş testi geçiyor.
- [ ] Lojistik ve sipariş ekibinden inceleme istendi.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?
`Payment Intent` bir borcun ödeme talebidir. Talep kimin kime ne kadar borçlu olduğunu tutar. Kaynak bir sipariş ya da abonelik ödemesidir. Talebin durumu tahsilatlardan türetilir. Durum "Open", "Partially Collected", "Collected" ya da "Cancelled" olabilir.

## Bugünkü bağımlılıklar
### Bu kaydın bağlandığı kayıtlar
- `DocType` ve `source_name` (`source_doctype`, Dynamic Link): kaynak kayıt. Bugün `Order` ya da `Subscription Payment` olur.
- `Order` (`order`): başka bağlam (04-siparis)
- `User` (`buyer`): framework kaydı
- `Admin Seller Profile` (`seller`): başka bağlam (02-satici-magaza)
- `Currency` (`currency`): framework kaydı
- `Subscription Plan` (`subscription_plan`): başka bağlam (02-satici-magaza)
- `Payment Transaction` (`legacy_transaction`): aynı bağlam
- `Payment Intent Charge` (`charges`, alt tablo): aynı bağlam

### Bu kayda dokunan kod
Ad, test dışında 44 dosyada geçer. Yazım yalnız `payments/service.py` içindedir.
- `tradehub_core/payments/service.py:194`: yazıyor (siparişten talep açar)
- `tradehub_core/payments/service.py:236`: yazıyor (abonelikten talep açar)
- `tradehub_core/payments/service.py:406`: yazıyor (durumu yeniden türetir)
- `tradehub_core/payments/service.py:189`: siparişi kilitli okuyor ve tutarı `grand_total` alanından alıyor (`payments/service.py:193`)
- `tradehub_core/logistics/hooks.py:448`: okuyor (durumu "Collected" mi diye bakar)
- `tradehub_core/api/order.py:1421`: okuyor (tahsil edilen tutar)
- `tradehub_core/api/order.py:1627`: kilitli okuyor
- `tradehub_core/shared_sync/checkout.py:332`: okuyor
- `tradehub_core/shared_sync/cutover.py:226`: okuyor
- `tradehub_core/shared_sync/amendments.py:39`: kilitli okuyor
- `tradehub_core/shared_sync/schema.py:299`: veritabanı tetikleyicisi kurar
- `tradehub_core/permissions.py:264`: okuyor (izin)

### Denetleyicinin kendi dış çağrıları
- `payment_intent.py:58`: `frappe.get_doc("Order", ..., for_update=True)` ile siparişi kilitler.
- `payment_intent.py:59`: `listing_purge.fences.assert_open` çağırır.
- `payment_intent.py:64`: `Order Item` satırlarını okur.
- `payment_intent.py:71`: `Subscription Payment.store` okur.

### hooks.py kayıtları
- `hooks.py:1195` ve `hooks.py:1326`: liste ve kayıt izni `permissions.py` içindedir.
- `hooks.py:1514`: `on_update` olayına `payments.audit.on_payment_change` eklenir.

## Bağımlılık sorunları
1. Lojistik bu kaydın durum değerini doğrudan okuyor (`logistics/hooks.py:448`). Ödeme durum adını değiştirirse sipariş durumu yanlış geri döner. Bu sorun 07-lojistik bağlamını bozar.
2. Talep siparişi doğrudan kilitli okuyor (`payments/service.py:189`, `payment_intent.py:58`). Sipariş alan adları değişirse ödeme açılamaz. Okuma kabul edilebilir ama belgeli okuma modeli yok.
3. `shared_sync` paketi bu tabloyu en az 8 dosyada okuyor. Paket ayrıca veritabanı tetikleyicisi kurar (`shared_sync/schema.py:299`). Ödeme şeması değişirse tetikleyici sessizce bozulabilir.
4. Ödeme API'si `api/order.py:1421` içinde dağınık okunur. Sipariş ekranı ödeme tablosunun iç alanlarını bilir.

## Hedef tasarım
- Sahip bağlam: 05-odeme. Paket yolu: `tradehub_core/payments/` (bugünkü paket korunur).
- Dışarıya açılan fonksiyonlar (`payments/api.py`):
  - `open_for_order(order: PayableOrder, method: str, instant: bool, accepted: AcceptedTerms) -> PaymentChain`
  - `get_payment_status(source_doctype: str, source_name: str) -> PaymentStatusView`
  - `cancel_for_order(order: str, reason: str) -> CancelResult`
  - `ensure_subscription_intent(payment: str, period_start, period_end) -> str`
- Yayınladığı olaylar:
  - `payment.collected`: talep "Collected" oldu. Veri `intent`, `source_doctype`, `source_name`, `order`, `amount_exact`, `currency`, `collected_at`.
  - `payment.partially_collected`: veri aynı, ek alan `collected_amount_exact`.
  - `payment.cancelled`: veri `intent`, `order`, `reason`.
  - `payment.refunded`: veri `intent`, `order`, `refund`, `amount_exact`.
- Dinlediği olaylar:
  - `order.cancelled` (04-siparis): talep kapatılır. Bugün bu çağrı eşzamanlı yapılır (`api/order.py:536`).
- Başka bağlamlara bağlantılar: `order`, `buyer`, `seller` Link alanları kalır. `amount` ve `currency` siparişin anlık görüntüsüdür.
- Okuma modeli: `ordering.api.get_payable_order(order)` siparişin tutarını, tarafları ve para birimini verir.
- Denetleyicide kalacak doğrulamalar: para (`payment_intent.py:123`), taraflar (`payment_intent.py:130`), kalemler (`payment_intent.py:194`), deneme sonrası donma (`payment_intent.py:238`).
- Taşınacak kural: `listing_purge` kontrolü `shared/retention.py` içindeki ortak kapıya gider.

## Geçiş adımları
1. `payments/contracts.py` dosyasını açın. `PayableOrder`, `PaymentChain`, `PaymentStatusView` sözleşmelerini yazın.
2. `payments/api.py` dosyasını açın. Bugünkü `service.open_for_order`, `find_intent`, `cancel_for_order` fonksiyonlarını buradan dışarı verin.
3. `logistics/hooks.py:444` okumasını `get_payment_status` çağrısına çevirin. Bu adım 2. adımdan sonra gelir.
4. `api/order.py:1421` ve `api/order.py:1627` okumalarını aynı fonksiyona çevirin.
5. `payment.collected` olayını `_apply_order_side_effects` yerine yayınlayın. Ayrıntı `Payment Collection` raporundadır.
6. `shared_sync` okumalarını `get_payment_status` üzerinden geçirin. Bu adım 14-platform-cekirdek sahibiyle yapılır.

## Riskler ve testler
- Aynı siparişe iki talep açılabilir. Var olan kilit davranışı korunmalı (`payments/service.py:186`). Test: eşzamanlı iki çağrı tek talep üretmeli.
- Durum türetmesi bozulabilir. Test: kısmi tahsilatta durum "Partially Collected" olmalı.
- Lojistik geri dönüşü bozulabilir. Test: tek sevkiyat iptal edilince ödenmiş sipariş "Onaylanıyor" durumuna dönmeli.
