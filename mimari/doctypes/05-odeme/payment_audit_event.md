# Payment Audit Event

- Bağlam: 05-odeme
- Tür: Kayıt defteri (log)
- Klasör: `tradehub_core/tradehub_core/doctype/payment_audit_event`
- Denetleyici: `tradehub_core/tradehub_core/doctype/payment_audit_event/payment_audit_event.py` (20 satır)
- Önerilen sahip bağlam: 05-odeme

## Epic

- Epic adı: Payment Audit Event: 05-odeme bağlamına taşıma
- Öncelik: Düşük
- Faz: Faz 3
- Tahmini büyüklük: Küçük

### User story

Bir platform yöneticisi olarak, ödeme değişikliklerinin tam izini görmek istiyorum.
Böylece şikâyeti kanıtla çözerim.

### Kabul kriterleri

- [ ] Talep durumu değişince bir denetim satırı yazılıyor.
- [ ] `get_payment_history` fonksiyonu var.
- [ ] Kayıt değiştirilemiyor ve silinemiyor.
- [ ] Characterization test: `Payment Audit Event` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- Denetim satırını güncellemeyin.
- Bu kaydı bağlamlar arası olay gibi kullanmayın.
- Satıra gizli veri yazmayın. Örneğin tam IBAN yazmayın.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] Denetim testi geçiyor.
- [ ] Gizli veri maskesi testi geçiyor.
- [ ] `ruff` kontrolü geçiyor.
- [ ] `CODEOWNERS` sahibinden inceleme istendi.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?
`Payment Audit Event` ödeme kayıtlarındaki her değişikliğin denetim izidir. Satır önceki ve sonraki durumu, sürümü ve iş etkisini tutar. Satır yazıldıktan sonra değiştirilemez.

## Bugünkü bağımlılıklar
### Bu kaydın bağlandığı kayıtlar
- `Payment Intent` (`payment_intent`): aynı bağlam
- `DocType` (`source_doctype`): framework kaydı
- Dinamik bağlantı (`source_name`): hedef türü `source_doctype` alanında yazılır
- `User` (`actor`): framework kaydı

### Bu kayda dokunan kod
- `tradehub_core/payments/audit.py:48`: yazıyor
- `tradehub_core/payments/audit.py:129`: okuyor
- `tradehub_core/payments/payment_summary.py:123`: okuyor

### hooks.py kayıtları
- `hooks.py:1524`: beş ödeme kaydının `on_update` olayı `payments.audit.on_payment_change` çağırır.
- `hooks.py:1526` ve `hooks.py:1527`: liste ve kayıt izni.

## Bağımlılık sorunları
Önemli bir bağımlılık sorunu bulunmadı.

## Hedef tasarım
- Sahip bağlam: 05-odeme.
- Dışarıya açılan fonksiyon: `payments.api.get_payment_history(intent)`.
- Olay yoktur. Bu kayıt bağlam içi denetim içindir. Bağlamlar arası olay değildir.

## Geçiş adımları
1. Değişiklik gerekmez.

## Riskler ve testler
- Değişiklik izsiz kalabilir. Test: talep durumu değişince bir denetim satırı yazılmalı.
