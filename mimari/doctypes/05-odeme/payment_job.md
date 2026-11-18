# Payment Job

- Bağlam: 05-odeme
- Tür: Kayıt defteri (log)
- Klasör: `tradehub_core/tradehub_core/doctype/payment_job`
- Denetleyici: `tradehub_core/tradehub_core/doctype/payment_job/payment_job.py` (21 satır)
- Önerilen sahip bağlam: 05-odeme

## Epic

- Epic adı: Payment Job: 05-odeme bağlamına taşıma
- Öncelik: Düşük
- Faz: Faz 3
- Tahmini büyüklük: Küçük

### User story

Bir geliştirici olarak, ödeme iş kuyruğunu olay altyapısına örnek almak istiyorum.
Böylece kanıtlanmış bir tasarım yeniden kullanılır.

### Kabul kriterleri

- [ ] Kayıt değişmeden kalıyor.
- [ ] Paylaşılan Outbox tasarım notu bu kayda atıf yapıyor.
- [ ] Kurtarma işi testi geçiyor.
- [ ] Characterization test: `Payment Job` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- `sent_unknown` durumundaki işi yeniden göndermeyin. Çift çekim olur.
- Kilit sırasını değiştirmeyin (`payments/jobs.py:30`).
- İşi "Review" durumundan kanıtsız kapatmayın.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] Kuyruk testleri geçiyor.
- [ ] `CODEOWNERS` kaydı ödeme ekibini gösteriyor.
- [ ] `ruff` kontrolü geçiyor.
- [ ] Tasarım notu gözden geçirildi.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?
`Payment Job` sağlayıcıya giden ödeme işinin kalıcı kuyruğudur. Bu tasarıma Outbox denir. Outbox, işin önce veritabanına yazılması ve sonra gönderilmesi demektir. İş denemeyi açan işlemle aynı anda yazılır. Redis'e gönderim işlem bittikten sonra yapılır (`payments/jobs.py:328`).

## Bugünkü bağımlılıklar
### Bu kaydın bağlandığı kayıtlar
- `Payment Intent` (`payment_intent`): aynı bağlam
- `Payment Attempt` (`payment_attempt`): aynı bağlam
- `Payment Operation` (`payment_operation`): aynı bağlam
- `Payment Idempotency Record` (`idempotency_record`): aynı bağlam
- `Order` (`order`): başka bağlam (04-siparis)
- `User` (`buyer`): framework kaydı
- `Admin Seller Profile` (`seller`): başka bağlam (02-satici-magaza)

### Bu kayda dokunan kod
- `tradehub_core/payments/jobs.py:289`: yazıyor (`create_charge_job`)
- `tradehub_core/payments/jobs.py:953`: yazıyor
- `tradehub_core/payments/jobs.py:349`: okuyor (zamanlanmış kurtarma)
- `tradehub_core/api/v1/payment_initiation.py:44`: okuyor
- `tradehub_core/shared_sync/amendments.py:80`: kilitli okuyor

### hooks.py kayıtları
- `hooks.py:1076` ve `hooks.py:1204`: liste ve kayıt izni.
- `hooks.py:1482`: zamanlanmış görev `payments.jobs.recover_payment_jobs` çalışır. Bu kayıt proje kodundadır.

## Bağımlılık sorunları
Önemli bir bağımlılık sorunu bulunmadı. Bu kayıt hedef olay altyapısı için iyi bir örnektir. Kilit sırası belgelidir (`payments/jobs.py:30`).

## Hedef tasarım
- Sahip bağlam: 05-odeme.
- Dışarıya açılan fonksiyon yoktur. İş yalnız ödeme bağlamı içinde kullanılır.
- Olay yoktur.
- Paylaşılan olay altyapısı bu tasarımı örnek alır. `after_commit` ile gönderim ve zamanlanmış kurtarma aynı kalır.

## Geçiş adımları
1. Paylaşılan Outbox tasarlanırken `payments/jobs.py` deseni kullanılsın. Bu kayıt değişmez.

## Riskler ve testler
- Redis kesintisinde iş kaybolabilir. Var olan kurtarma testi korunmalı.
