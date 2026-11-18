# Payment Idempotency Record

- Bağlam: 05-odeme
- Tür: Kayıt defteri (log)
- Klasör: `tradehub_core/tradehub_core/doctype/payment_idempotency_record`
- Denetleyici: `tradehub_core/tradehub_core/doctype/payment_idempotency_record/payment_idempotency_record.py` (20 satır)
- Önerilen sahip bağlam: 05-odeme

## Epic

- Epic adı: Payment Idempotency Record: 05-odeme bağlamına taşıma
- Öncelik: Düşük
- Faz: Faz 3
- Tahmini büyüklük: Küçük

### User story

Bir alıcı olarak, düğmeye iki kez basınca iki kez ödeme yapmamak istiyorum.
Böylece param iki kez çekilmez.

### Kabul kriterleri

- [ ] Aynı anahtarla iki istek tek iş üretiyor.
- [ ] `planned_delete` kapısı `shared/retention.py` içinden geliyor.
- [ ] Kayıt yazıldıktan sonra değişmiyor.
- [ ] Characterization test: `Payment Idempotency Record` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- Tekillik kaydını elle silmeyin.
- Anahtarı aktörsüz kullanmayın.
- Doğrulanmış yazım kapısını atlamayın.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] Çift istek testi geçiyor.
- [ ] Temizlik kapısı testi geçiyor.
- [ ] `ruff` kontrolü geçiyor.
- [ ] `CODEOWNERS` sahibinden inceleme istendi.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?
`Payment Idempotency Record` ödeme başlatma isteğinin tekillik kaydıdır. Kayıt aktörü, kapsamı ve anahtarı tutar. Aynı istek tekrar gelirse yeni ödeme başlamaz.

## Bugünkü bağımlılıklar
### Bu kaydın bağlandığı kayıtlar
- `User` (`actor`): framework kaydı
- `User` (`buyer`): framework kaydı
- `Admin Seller Profile` (`seller`): başka bağlam (02-satici-magaza)
- `DocType` (`source_doctype`): framework kaydı
- Dinamik bağlantı (`source_name`): hedef türü `source_doctype` alanında yazılır
- `Order` (`order`): başka bağlam (04-siparis)
- `Payment Intent` (`payment_intent`): aynı bağlam
- `Payment Attempt` (`payment_attempt`): aynı bağlam
- `Payment Job` (`payment_job`): aynı bağlam

### Bu kayda dokunan kod
- `tradehub_core/payments/idempotency.py:143`: yazıyor
- `tradehub_core/payments/idempotency.py:303`: okuyor
- `tradehub_core/payments/idempotency.py:333`: okuyor

### hooks.py kayıtları
- `hooks.py:1075` ve `hooks.py:1203`: liste ve kayıt izni.

## Bağımlılık sorunları
Önemli bir bağımlılık sorunu bulunmadı.

## Hedef tasarım
- Sahip bağlam: 05-odeme.
- Dışarıya açılan fonksiyon ve olay yoktur.
- Denetleyicide kalacak doğrulama: doğrulanmış yazım kapısı (`payment_idempotency_record.py:11`).

## Geçiş adımları
1. Değişiklik gerekmez. `planned_delete` taşımasıyla içe aktarımı güncelleyin.

## Riskler ve testler
- Çift tıklama iki ödeme başlatabilir. Test: aynı anahtarla iki istek tek iş üretmeli.
