# Payment Refund Record

- Bağlam: 05-odeme
- Tür: Kayıt defteri (log)
- Klasör: `tradehub_core/tradehub_core/doctype/payment_refund_record`
- Denetleyici: `tradehub_core/tradehub_core/doctype/payment_refund_record/payment_refund_record.py` (43 satır)
- Önerilen sahip bağlam: 05-odeme

## Epic

- Epic adı: Payment Refund Record: 05-odeme bağlamına taşıma
- Öncelik: Acil
- Faz: Faz 3
- Tahmini büyüklük: Orta

### User story

Bir geliştirici olarak, iade kaydını yalnız ödeme kodunun üretmesini istiyorum.
Böylece kurtarma yolu iade numaralarını bozmaz.

### Kabul kriterleri

- [ ] `restore_refund_record` fonksiyonu var.
- [ ] `shared_sync/decision_recovery.py` bu fonksiyonu çağırıyor.
- [ ] `shared_sync` iade tablosunu ham SQL ile okumuyor.
- [ ] Kurtarılan kaydın adı seriyle çakışmıyor.
- [ ] Characterization test: `Payment Refund Record` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- `tabSeries` tablosuna başka paketten yazmayın.
- İade kaydını `shared_sync` içinden `insert` etmeyin.
- Doğrulanmış iadeyi silmeyin.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] Kurtarma testi geçiyor.
- [ ] İade toplamı testi geçiyor.
- [ ] `import-linter` kontrolü geçiyor.
- [ ] Senkron paketi sahibinden inceleme istendi.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?
`Payment Refund Record` onaylı elle iadenin gönderim kaydıdır. Satıcı parayı gönderdiğini bildirir. Finans ekibi banka satırıyla iadeyi doğrular. Durum "Seller Reported Sent" ya da "Bank Verified" olabilir.

## Bugünkü bağımlılıklar
### Bu kaydın bağlandığı kayıtlar
- `Payment Intent` (`payment_intent`): aynı bağlam
- `Order` (`order`): başka bağlam (04-siparis)
- `User` (`buyer`): framework kaydı
- `Admin Seller Profile` (`seller`): başka bağlam (02-satici-magaza)
- `Payment Operation` (`payment_operation`): aynı bağlam
- `Payment Approval` (`approval`): aynı bağlam
- `Currency` (`currency`): framework kaydı
- `User` (`reported_by`): framework kaydı
- `Bank Statement Line` (`bank_statement_line`): aynı bağlam
- `User` (`verified_by`): framework kaydı

### Bu kayda dokunan kod
- `tradehub_core/payments/manual_refunds.py:176`: yazıyor
- `tradehub_core/shared_sync/decision_recovery.py:214`: yazıyor (kurtarma yolunda kayıt üretir)
- `tradehub_core/shared_sync/decision_recovery.py:211`: `tabSeries` tablosuna ham SQL yazar
- `tradehub_core/payments/obligations.py:56`: kilitli okuyor
- `tradehub_core/payments/refund_balance.py:10`: kilitli okuyor
- `tradehub_core/shared_sync/customer_orders.py:133`: okuyor
- `tradehub_core/shared_sync/order_events.py:53`: kilitli ham SQL ile okuyor

### hooks.py kayıtları
- `hooks.py:1571`: liste ve kayıt izni `payments.manual_guard` içindedir.

## Bağımlılık sorunları
1. `shared_sync` bu kaydı doğrudan üretiyor (`shared_sync/decision_recovery.py:214`). Kayıt adı serisini ham SQL ile ilerletiyor (`shared_sync/decision_recovery.py:211`). Ödeme ekibi seri biçimini değiştirirse kurtarma yolu bozulur.
2. `shared_sync` iade tablosunu ham SQL ile okuyor (`shared_sync/order_events.py:53`).

## Hedef tasarım
- Sahip bağlam: 05-odeme.
- Dışarıya açılan fonksiyonlar (`payments/api.py`):
  - `report_refund_sent(operation: str, data) -> str`
  - `restore_refund_record(record: RefundRecordSnapshot) -> str` (yalnız kurtarma için)
  - `get_refund_totals(intent: str) -> RefundTotals`
- Yayınladığı olaylar: `payment.refunded`. Veri `intent`, `order`, `refund`, `amount_exact`, `currency`.
- Dinlediği olaylar: yok.

## Geçiş adımları
1. `restore_refund_record` fonksiyonunu ekleyin. `decision_recovery.py:214` bu fonksiyonu çağırsın.
2. `get_refund_totals` fonksiyonunu ekleyin. `order_events.py:53` ve `customer_orders.py:133` bu fonksiyonu kullansın.

## Riskler ve testler
- Kurtarma yolu kayıt adını çakıştırabilir. Test: kurtarılan kaydın adı seriyle çakışmamalı.
