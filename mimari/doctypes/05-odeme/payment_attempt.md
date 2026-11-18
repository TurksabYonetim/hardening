# Payment Attempt

- Bağlam: 05-odeme
- Tür: Ana kayıt
- Klasör: `tradehub_core/tradehub_core/doctype/payment_attempt`
- Denetleyici: `tradehub_core/tradehub_core/doctype/payment_attempt/payment_attempt.py` (158 satır)
- Önerilen sahip bağlam: 05-odeme

## Epic

- Epic adı: Payment Attempt: 05-odeme bağlamına taşıma
- Öncelik: Kritik
- Faz: Faz 3
- Tahmini büyüklük: Orta

### User story

Bir geliştirici olarak, başarılı ödemenin sipariş ve stok koduna bağlı olmamasını istiyorum.
Böylece sipariş hatası ödeme kaydını geri almaz.

### Kabul kriterleri

- [ ] `record_attempt_result` siparişe ve stoğa doğrudan yazmıyor.
- [ ] Başarı `payment.collected` olayına dönüşüyor.
- [ ] `payments/service.py` `shared_sync.checkout` modülünü içe aktarmıyor.
- [ ] Doğrulama olmadan "Succeeded" yazımı reddediliyor.
- [ ] Characterization test: `Payment Attempt` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- Kanıtsız başarı yazmayın. `require_verified_write` kapısını atlamayın.
- Ödeme kodundan `deduct_stock_for_order` çağırmayın. Stok olayla düşer.
- Belirsiz sağlayıcı sonucunu "Failed" diye kapatmayın.
- `shared_sync` iç fonksiyonunu yeni yerden çağırmayın.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] Doğrulanmış yazım testi geçiyor.
- [ ] Olay tekrar gönderim testi eklendi.
- [ ] `import-linter` kontrolü geçiyor.
- [ ] Sipariş ekibinden inceleme istendi.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?
`Payment Attempt` bir ödeme talebi için yapılan tek denemedir. Deneme kartla ya da elle ödeme olabilir. Deneme sağlayıcıyı, dış kimliği ve tutarı tutar. Başarılı deneme bir `Payment Collection` kaydı üretir.

## Bugünkü bağımlılıklar
### Bu kaydın bağlandığı kayıtlar
- `Payment Intent` (`payment_intent`): aynı bağlam
- `Order` (`order`): başka bağlam (04-siparis)
- `User` (`buyer`, `verified_by`): framework kaydı
- `Admin Seller Profile` (`seller`): başka bağlam (02-satici-magaza)
- `Seller Bank Account Version` (`payee_bank_account_version`): aynı bağlam
- `Currency` (`currency`): framework kaydı
- `Payment Transaction` (`legacy_transaction`): aynı bağlam
- `Payment Installment Plan` (`declared_plan`): aynı bağlam

### Bu kayda dokunan kod
- `tradehub_core/payments/service.py:307`: yazıyor (`start_attempt`)
- `tradehub_core/payments/service.py:362`: yazıyor (`record_attempt_result`)
- `tradehub_core/payments/service.py:421`: yazıyor (banka ekstresinden deneme)
- `tradehub_core/payments/jobs.py:499`: okuyor (sağlayıcı işi)
- `tradehub_core/payments/jobs.py:807`: kilitli okuyor
- `tradehub_core/payments/installment_seller.py:131`: okuyor (taksit beyanı)
- `tradehub_core/api/order.py:1420`: okuyor
- `tradehub_core/shared_sync/cutover.py:355`: okuyor

### Denetleyicinin kendi dış çağrıları
- `payment_attempt.py:35`: `listing_purge.fences.assert_open` çağırır.
- `payment_attempt.py:43`: `payments.bank_accounts.validate_version_link` çağırır.
- `payment_attempt.py:48`: `payments.write_guard.require_verified_write` çağırır. Başarı yalnız doğrulanmış yazımla kaydedilir.

### hooks.py kayıtları
- `hooks.py:1196` ve `hooks.py:1327`: liste ve kayıt izni.
- `hooks.py:1515`: `on_update` olayına denetim işleyicisi eklenir.

## Bağımlılık sorunları
1. Başarılı deneme aynı işlem içinde siparişi değiştirir (`payments/service.py:372`). Sonra stok düşülür (`payments/service.py:454`). Ödeme hatası sipariş ve stoğu da geri alır. Sipariş ya da stok hatası ödeme kaydını da düşürür. Bu sorun 04-siparis ve 03a-katalog bağlamlarını bağlar.
2. Deneme başlatma `shared_sync.checkout.assert_payment_ready` çağırır (`payments/service.py:286`). Ödeme bağlamı başka bir paketin iç kuralını bilir.

## Hedef tasarım
- Sahip bağlam: 05-odeme.
- Dışarıya açılan fonksiyonlar (`payments/api.py`):
  - `start_attempt(intent: str, method: AttemptInput) -> str`
  - `record_attempt_result(attempt: str, outcome: str, evidence: ProviderEvidence) -> AttemptResult`
- Yayınladığı olaylar: `payment.attempt_failed`. Veri `intent`, `attempt`, `failure_code`.
- Başarı olayı `Payment Collection` üzerinden yayınlanır.
- Dinlediği olaylar: yok.
- `shared_sync` hazır olma kontrolü bir arayüz üzerinden çağrılır. Örnek: `payments/ports.py` içinde `PaymentReadinessCheck` listesi. `shared_sync` kendi kontrolünü buraya kaydeder.
- Denetleyicide kalacak doğrulamalar: para (`payment_attempt.py:73`), sağlayıcı (`payment_attempt.py:80`), durum ve doğrulanmış yazım kuralı.

## Geçiş adımları
1. `payments/ports.py` ile hazır olma kontrol listesini açın. `shared_sync` kendi kontrolünü kaydetsin. Sonra `payments/service.py:286` içe aktarımını kaldırın.
2. `_apply_order_side_effects` çağrısını olay yayınına çevirin. Ayrıntı `Payment Collection` raporundadır.

## Riskler ve testler
- Kanıtsız başarı yazılabilir. Var olan kural korunmalı (`payment_attempt.py:48`). Test: doğrulama olmadan "Succeeded" yazımı reddedilmeli.
- Ödeme başarılı ama sipariş güncellenmemiş kalabilir. Test: olay işleyicisi hata verirse olay yeniden denenmeli.
