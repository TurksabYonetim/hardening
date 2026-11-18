# Subscription Payment

- Bağlam: 05-odeme
- Tür: Ana kayıt
- Klasör: `tradehub_core/tradehub_core/doctype/subscription_payment`
- Denetleyici: `tradehub_core/tradehub_core/doctype/subscription_payment/subscription_payment.py` (124 satır)
- Önerilen sahip bağlam: 02-satici-magaza. Kayıt mağazanın abonelik ödeme isteğidir. Abonelik kuralları ve `Store Subscription` orada durur. Para hareketi yine `Payment Intent` ile 05-odeme bağlamında kalır.

## Epic

- Epic adı: Subscription Payment: 02-satici-magaza bağlamına taşıma
- Öncelik: Önemli
- Faz: Faz 4
- Tahmini büyüklük: Orta

### User story

Bir satıcı olarak, paket ödememin onaylanınca aboneliğimin bir kez açılmasını istiyorum.
Böylece fazla ücret ödemem.

### Kabul kriterleri

- [ ] Abonelik kodu `payments.api` fonksiyonlarını çağırıyor.
- [ ] `identity.py` bu kayda yazmıyor. `user.erased` olayı kullanılıyor.
- [ ] Aynı istek iki kez onaylanınca tek etkinleşme oluyor.
- [ ] Characterization test: `Subscription Payment` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- Abonelik kodundan `payments.service` içe aktarmayın.
- Son durumdaki isteği değiştirmeyin.
- `module` alanını Faz 5 öncesinde değiştirmeyin.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] Çift onay testi geçiyor.
- [ ] Durum geçişi testi geçiyor.
- [ ] Mağaza ekibinden onay alındı.
- [ ] `import-linter` kontrolü geçiyor.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?
`Subscription Payment` mağazanın paket ödemesi isteğidir. İstek paketi, dönemi, tutarı ve yöntemi tutar. Yönetici isteği onaylar ya da reddeder. Onay sonrası abonelik etkinleşir.

## Bugünkü bağımlılıklar
### Bu kaydın bağlandığı kayıtlar
- `Admin Seller Profile` (`store`): başka bağlam (02-satici-magaza)
- `Subscription Plan` (`plan`): başka bağlam (02-satici-magaza)
- `User` (`confirmed_by`): framework kaydı

### Bu kayda dokunan kod
- `tradehub_core/api/v1/subscription_payment.py:128`: yazıyor (isteği açar)
- `tradehub_core/api/v1/subscription_payment.py:224`: yazıyor (onay)
- `tradehub_core/api/v1/subscription_payment.py:244`: aboneliği etkinleştirir (`upgrade_subscription_plan`)
- `tradehub_core/api/v1/subscription_payment.py:265`: ödeme talebi açar (`payments.service.ensure_subscription_intent`)
- `tradehub_core/api/v1/subscription_payment.py:280`: tahsilatı yazar (`payments.service.record_attempt_result`)
- `tradehub_core/api/v1/identity.py:1979`: yazıyor (hesap silinince reddeder)
- `tradehub_core/services/store_cleanup.py:27`: yazıyor (mağaza silinince siler)
- `tradehub_core/payments/service.py:216`: okuyor
- `tradehub_core/tradehub_core/doctype/payment_intent/payment_intent.py:71`: okuyor

### hooks.py kayıtları
- Kayıt yok.

## Bağımlılık sorunları
1. Abonelik API'si ödeme iç servisini doğrudan çağırıyor (`api/v1/subscription_payment.py:254`). Ödeme imzası değişirse abonelik onayı düşer.
2. Onay, abonelik etkinleştirme ve tahsilat aynı işlemde yapılır. Bir adım düşerse hepsi geri alınır. Bu bilinçli olabilir, doğrulanmadı.
3. Kimlik API'si bu kaydı doğrudan yazıyor (`api/v1/identity.py:1979`). Bu sorun 01-kimlik-erisim bağlamını bağlar.

## Hedef tasarım
- Sahip bağlam: 02-satici-magaza. Paket yolu: `tradehub_core/stores/subscriptions/`.
- Ödeme bağlamı yalnız `payments.api.ensure_subscription_intent` ve `payments.api.record_attempt_result` verir.
- Yayınladığı olaylar: `subscription.payment_requested`, `subscription.payment_confirmed`.
- Dinlediği olaylar:
  - `payment.collected` (05-odeme): kaynak `Subscription Payment` ise abonelik etkinleşir.
  - `user.erased` (01-kimlik-erisim): bekleyen istek reddedilir.
- Denetleyicide kalacak doğrulamalar: durum geçişi (`subscription_payment.py:80`), son durumda donma (`subscription_payment.py:93`).

## Geçiş adımları
1. 02-satici-magaza sahibiyle taşıma kararını onaylayın.
2. `subscription_payment.py:254` çağrılarını `payments.api` fonksiyonlarına çevirin.
3. `identity.py:1979` yazımını `user.erased` olayına çevirin.
4. DocType JSON `module` alanını yeni modüle çevirin.

## Riskler ve testler
- Abonelik iki kez etkinleşebilir. Test: aynı istek iki kez onaylanınca tek etkinleşme olmalı.
