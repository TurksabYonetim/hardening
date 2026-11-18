# Payment Operation

- Bağlam: 05-odeme
- Tür: Ana kayıt
- Klasör: `tradehub_core/tradehub_core/doctype/payment_operation`
- Denetleyici: `tradehub_core/tradehub_core/doctype/payment_operation/payment_operation.py` (14 satır)
- Önerilen sahip bağlam: 05-odeme

## Epic

- Epic adı: Payment Operation: 05-odeme bağlamına taşıma
- Öncelik: Acil
- Faz: Faz 3
- Tahmini büyüklük: Orta

### User story

Bir platform yöneticisi olarak, iadenin onaylı içerikle yapılmasını istiyorum.
Böylece onaydan sonra tutar değişmez.

### Kabul kriterleri

- [ ] `request_refund` fonksiyonu `payments/api.py` içinde.
- [ ] `api/order.py` iade isteğinde bu fonksiyonu çağırıyor.
- [ ] Onaydan sonra tutar değişince işlem reddediliyor.
- [ ] `shared_sync` okumaları okuma modelinden geçiyor.
- [ ] Characterization test: `Payment Operation` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- Onaylı işlemin tutarını ya da hedef hesabını değiştirmeyin.
- `guard_write` kapısını atlamayın.
- Kilit sırasını `shared_sync` içinde farklı kurmayın.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] İçerik özeti testi geçiyor.
- [ ] İade akışı testi geçiyor.
- [ ] `import-linter` kontrolü geçiyor.
- [ ] Sipariş ekibinden inceleme istendi.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?
`Payment Operation` para çıkışı isteğidir. İstek iade ya da aktarım olabilir. İstek onay ister ve onay `Payment Approval` kaydına yazılır. İstek sürüm ve içerik özeti tutar. Böylece onaydan sonra içerik değiştirilemez.

## Bugünkü bağımlılıklar
### Bu kaydın bağlandığı kayıtlar
- `Payment Intent` (`payment_intent`): aynı bağlam
- `User` (`requester`): framework kaydı
- `Payment Approval` (`approval`): aynı bağlam
- `User` (`cancelled_by`): framework kaydı
- `User` (`buyer`): framework kaydı
- `Admin Seller Profile` (`seller`): başka bağlam (02-satici-magaza)

### Bu kayda dokunan kod
- `tradehub_core/payments/operations.py:137`: yazıyor (isteği açar)
- `tradehub_core/payments/manual_refunds.py:98`: kilitli okuyor (elle iade)
- `tradehub_core/api/v1/payment_core.py:92`: okuyor
- `tradehub_core/api/v1/manual_payments.py:272`: okuyor
- `tradehub_core/shared_sync/decision_recovery.py:194`: kilitli okuyor
- `tradehub_core/shared_sync/amendments.py:85`: kilitli okuyor

### Denetleyicinin kendi dış çağrıları
- `payment_operation.py:3`: `listing_purge.guards.planned_delete` içe aktarır.
- `payment_operation.py:5`: `payments.operations.guard_write` çağırır.

### hooks.py kayıtları
- `hooks.py:1073` ve `hooks.py:1201`: liste ve kayıt izni.
- `hooks.py:1517`: `on_update` olayına denetim işleyicisi eklenir.

## Bağımlılık sorunları
1. `shared_sync` bu kaydı kilitli okuyor (`shared_sync/decision_recovery.py:194`). Kilit sırası iki pakette ayrı yazılı. Sıra ayrışırsa kilitlenme olabilir. Bu nokta doğrulanmadı.

## Hedef tasarım
- Sahip bağlam: 05-odeme.
- Dışarıya açılan fonksiyonlar (`payments/api.py`):
  - `request_refund(order: str, amount, reason) -> str`
  - `approve_operation(operation: str, decision: str) -> OperationView`
- Yayınladığı olaylar: `payment.refund_approved` ve `payment.refunded`. Veri `intent`, `order`, `operation`, `amount_exact`, `currency`.
- Dinlediği olaylar: `order.refund_requested` (04-siparis).
- Denetleyicide kalacak doğrulama: `guard_write` yazım kapısı.

## Geçiş adımları
1. `request_refund` fonksiyonunu `payments/api.py` içinden dışarı verin.
2. `api/order.py:1607` iade isteği bu fonksiyonu çağırsın.
3. `shared_sync` okumalarını belgeli okuma modeline çevirin.

## Riskler ve testler
- Onaylı içerik değişebilir. Test: onaydan sonra tutar değişince işlem reddedilmeli.
