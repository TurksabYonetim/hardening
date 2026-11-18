# Payment Installment Allocation

- Bağlam: 05-odeme
- Tür: Kayıt defteri (log)
- Klasör: `tradehub_core/tradehub_core/doctype/payment_installment_allocation`
- Denetleyici: `tradehub_core/tradehub_core/doctype/payment_installment_allocation/payment_installment_allocation.py` (64 satır)
- Önerilen sahip bağlam: 05-odeme

## Epic

- Epic adı: Payment Installment Allocation: 05-odeme bağlamına taşıma
- Öncelik: Düşük
- Faz: Faz 3
- Tahmini büyüklük: Küçük

### User story

Bir geliştirici olarak, bir tahsilatın taksitlere doğru dağıtılmasını istiyorum.
Böylece fazla ya da eksik ödeme görünmez.

### Kabul kriterleri

- [ ] Dağıtılan toplam tahsilat tutarını geçmiyor.
- [ ] Yanlış dağıtım "Reversed" yapılıyor, silinmiyor.
- [ ] `planned_delete` kapısı `shared/retention.py` içinden geliyor.
- [ ] Characterization test: `Payment Installment Allocation` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- Dağıtım kaydını silmeyin.
- Farklı para birimli tahsilatı dağıtmayın.
- Kilitsiz dağıtım yapmayın.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] Toplam sınırı testi geçiyor.
- [ ] Ters çevirme testi geçiyor.
- [ ] `ruff` kontrolü geçiyor.
- [ ] `CODEOWNERS` sahibinden inceleme istendi.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?
`Payment Installment Allocation` bir tahsilatın hangi taksite yazıldığını tutar. Kayıt tahsilatı, planı ve taksit satırını bağlar. Yanlış dağıtım "Reversed" yapılır, silinmez.

## Bugünkü bağımlılıklar
### Bu kaydın bağlandığı kayıtlar
- `Payment Installment Plan` (`plan`): aynı bağlam
- `Payment Intent` (`payment_intent`): aynı bağlam
- `Order` (`order`): başka bağlam (04-siparis)
- `User` (`buyer`): framework kaydı
- `Admin Seller Profile` (`seller`): başka bağlam (02-satici-magaza)
- `Payment Collection` (`payment_collection`): aynı bağlam
- `Currency` (`currency`): framework kaydı
- `User` (`allocated_by`): framework kaydı
- `User` (`reversed_by`): framework kaydı

### Bu kayda dokunan kod
- `tradehub_core/payments/installments.py:663`: yazıyor (`allocate_locked`)
- `tradehub_core/payments/installments.py:218`: kilitli okuyor
- `tradehub_core/api/v1/payment_installments.py:69`: uç nokta
- `tradehub_core/shared_sync/contracts.py:149`: değişiklik tetikleyici listesinde

### hooks.py kayıtları
- `hooks.py:1550`: liste izni `payments.installments.allocation_query_conditions`.
- `hooks.py:1553`: kayıt izni.
- `hooks.py:1558`: `on_update` olayına denetim işleyicisi eklenir.

## Bağımlılık sorunları
Önemli bir bağımlılık sorunu bulunmadı.

## Hedef tasarım
- Sahip bağlam: 05-odeme.
- Dışarıya açılan fonksiyon: `payments.api.allocate_collection(collection, plan, installment_no)`.
- Olay yoktur.
- Denetleyicide kalacak doğrulama: tutar ve para birimi uyumu (`payment_installment_allocation.py:40`).

## Geçiş adımları
1. Değişiklik gerekmez. `planned_delete` taşımasıyla içe aktarımı güncelleyin.

## Riskler ve testler
- Aynı tahsilat iki taksite yazılabilir. Test: dağıtılan toplam tahsilat tutarını geçmemeli.
