# Payment Job Event

- Bağlam: 05-odeme
- Tür: Kayıt defteri (log)
- Klasör: `tradehub_core/tradehub_core/doctype/payment_job_event`
- Denetleyici: `tradehub_core/tradehub_core/doctype/payment_job_event/payment_job_event.py` (16 satır)
- Önerilen sahip bağlam: 05-odeme

## Epic

- Epic adı: Payment Job Event: 05-odeme bağlamına taşıma
- Öncelik: Düşük
- Faz: Faz 3
- Tahmini büyüklük: Küçük

### User story

Bir geliştirici olarak, her ödeme işi adımının iz bırakmasını istiyorum.
Böylece sorun çıkınca adım adım inceleme yaparım.

### Kabul kriterleri

- [ ] Her iş olayı bir denetim satırı yazıyor.
- [ ] `hooks.py:1525` kaydı ödeme bağlamının kendi işleyicisini çağırıyor.
- [ ] Kayıt silinemiyor.
- [ ] Characterization test: `Payment Job Event` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- Olay satırını güncellemeyin.
- Bu kaydı başka bağlamın olay altyapısı yerine kullanmayın.
- Satırı elle silmeyin.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] Denetim izi testi geçiyor.
- [ ] `ruff` kontrolü geçiyor.
- [ ] `CODEOWNERS` kaydı güncellendi.
- [ ] İzin testi geçiyor.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?
`Payment Job Event` ödeme işinin adım kaydıdır. Her satır işin ne zaman alındığını, gönderildiğini ya da bittiğini yazar. Satır işçi kimliğini ve kilit numarasını da tutar.

## Bugünkü bağımlılıklar
### Bu kaydın bağlandığı kayıtlar
- `Payment Job` (`payment_job`): aynı bağlam
- `User` (`actor`): framework kaydı

### Bu kayda dokunan kod
- `tradehub_core/payments/jobs.py:149`: yazıyor (`_event`)

### hooks.py kayıtları
- `hooks.py:1525`: `after_insert` olayı `payments.audit.on_job_event` işleyicisini çağırır.
- `hooks.py:1077` ve `hooks.py:1205`: liste ve kayıt izni.

## Bağımlılık sorunları
Önemli bir bağımlılık sorunu bulunmadı.

## Hedef tasarım
- Sahip bağlam: 05-odeme.
- Dışarıya açılan fonksiyon ve olay yoktur.
- `hooks.py:1525` kaydı ödeme bağlamının kendi işleyicisidir. Bu kural hedefle uyumludur.

## Geçiş adımları
1. Değişiklik gerekmez. Yalnız `CODEOWNERS` kaydına ödeme ekibini yazın.

## Riskler ve testler
- Denetim izi eksik kalabilir. Test: her iş olayı bir denetim satırı üretmeli.
