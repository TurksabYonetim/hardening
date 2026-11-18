# Payment Installment Plan

- Bağlam: 05-odeme
- Tür: Ana kayıt
- Klasör: `tradehub_core/tradehub_core/doctype/payment_installment_plan`
- Denetleyici: `tradehub_core/tradehub_core/doctype/payment_installment_plan/payment_installment_plan.py` (88 satır)
- Önerilen sahip bağlam: 05-odeme

## Epic

- Epic adı: Payment Installment Plan: 05-odeme bağlamına taşıma
- Öncelik: Önemli
- Faz: Faz 3
- Tahmini büyüklük: Orta

### User story

Bir alıcı olarak, kabul ettiğim taksit planının değişmemesini istiyorum.
Böylece ödeme takvimime güvenirim.

### Kabul kriterleri

- [ ] `get_active_plan` fonksiyonu var.
- [ ] `shared_sync` plan tablosunu bu fonksiyondan okuyor.
- [ ] Kabul sonrası satır değişince kayıt reddediliyor.
- [ ] Gecikme `payment.installment_overdue` olayı yayınlıyor.
- [ ] Characterization test: `Payment Installment Plan` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- Kabul edilmiş planı değiştirmeyin. Yeni sürüm açın.
- Plan tablosunu başka pakette kilitli okumayın.
- Plan toplamını borçtan farklı yapmayın.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] Donma testi geçiyor.
- [ ] Gecikme testi geçiyor.
- [ ] `import-linter` kontrolü geçiyor.
- [ ] Senkron paketi sahibinden inceleme istendi.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?
`Payment Installment Plan` bir siparişin taksit planıdır. Taraflardan biri planı önerir, diğeri kabul eder. Plan borcun tamamını kapsar. Taksit satırları `Payment Installment` alt tablosundadır. Plan değişince yeni sürüm açılır.

## Bugünkü bağımlılıklar
### Bu kaydın bağlandığı kayıtlar
- `Payment Intent` (`payment_intent`): aynı bağlam
- `Order` (`order`): başka bağlam (04-siparis)
- `User` (`buyer`): framework kaydı
- `Admin Seller Profile` (`seller`): başka bağlam (02-satici-magaza)
- `Currency` (`currency`): framework kaydı
- `Payment Installment` (`installments`, alt tablo): aynı bağlam
- `User` (`proposed_by`): framework kaydı
- `User` (`buyer_accepted_by`): framework kaydı
- `User` (`seller_accepted_by`): framework kaydı
- `User` (`closed_by`): framework kaydı
- `Payment Installment Plan` (`replaced_by`): aynı bağlam
- `Seller Terms Version` (`source_terms_version`): başka bağlam (02-satici-magaza)

### Bu kayda dokunan kod
- `tradehub_core/payments/installments.py:336`: yazıyor (planı açar)
- `tradehub_core/payments/installments.py:371`: yazıyor (kabul)
- `tradehub_core/payments/installments.py:438`: yazıyor (kapatır)
- `tradehub_core/api/v1/payment_installments.py:38`: uç nokta
- `tradehub_core/payments/payment_summary.py:232`: okuyor
- `tradehub_core/shared_sync/amendments.py:593`: kilitli okuyor
- `tradehub_core/shared_sync/return_credits.py:217`: kilitli okuyor
- `tradehub_core/shared_sync/seller_records.py:255`: okuyor

### Denetleyicinin kendi dış çağrıları
- `payment_installment_plan.py:15`: `listing_purge.guards.planned_delete` içe aktarır.

### hooks.py kayıtları
- `hooks.py:1549`: liste izni `payments.installments.plan_query_conditions`.
- `hooks.py:1553`: kayıt izni `payments.installments.has_permission`.
- `hooks.py:1558`: `on_update` olayına denetim işleyicisi eklenir.
- `hooks.py:1563`: günlük zamanlanmış görev `payments.installments.refresh_overdue_flags` çalışır.

## Bağımlılık sorunları
1. `shared_sync` plan tablosunu kilitli okuyor (`shared_sync/amendments.py:593`). Sipariş değişikliği akışı ödeme planının iç durumunu biliyor.

## Hedef tasarım
- Sahip bağlam: 05-odeme. Paket yolu: `tradehub_core/payments/installments.py`.
- Dışarıya açılan fonksiyonlar (`payments/api.py`):
  - `propose_installment_plan(order, rows, currency, terms) -> PlanView`
  - `accept_installment_plan(plan, content_hash) -> PlanView`
  - `get_active_plan(order) -> PlanView | None`
- Yayınladığı olaylar: `payment.plan_accepted`, `payment.installment_overdue`. Veri `intent`, `order`, `plan`, `installment_no`.
- Dinlediği olaylar: `order.amended` (04-siparis). Plan geçersiz olursa kapatılır.
- Denetleyicide kalacak doğrulama: kabul sonrası donma (`payment_installment_plan.py:60`).

## Geçiş adımları
1. `get_active_plan` okuma fonksiyonunu ekleyin. `shared_sync` okumaları bu fonksiyona geçsin.
2. Gecikme bayrağı için `payment.installment_overdue` olayını yayınlayın. Bildirimi 12-bildirim-iletisim yapsın.

## Riskler ve testler
- Kabul edilen plan değişebilir. Test: kabul sonrası satır değişince kayıt reddedilmeli.
- Gecikme bayrağı yanlış olabilir. Test: vadesi geçen ödenmemiş taksit "is_overdue" olmalı.
