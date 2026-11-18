# Bank Statement Line

- Bağlam: 05-odeme
- Tür: Kayıt defteri (log)
- Klasör: `tradehub_core/tradehub_core/doctype/bank_statement_line`
- Denetleyici: `tradehub_core/tradehub_core/doctype/bank_statement_line/bank_statement_line.py` (63 satır)
- Önerilen sahip bağlam: 05-odeme

## Epic

- Epic adı: Bank Statement Line: 05-odeme bağlamına taşıma
- Öncelik: Düşük
- Faz: Faz 3
- Tahmini büyüklük: Küçük

### User story

Bir platform yöneticisi olarak, banka satırını havaleyle güvenle eşleştirmek istiyorum.
Böylece elle ödemeyi kanıtlarım.

### Kabul kriterleri

- [ ] Aynı `line_key` ikinci kez reddediliyor.
- [ ] Eşleşme sonucu `payment.collected` olayına dönüşüyor.
- [ ] `planned_delete` kapısı `shared/retention.py` içinden geliyor.
- [ ] Characterization test: `Bank Statement Line` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- Eşleşmiş satırı silmeyin.
- Satırı `manual_guard` dışında yazmayın.
- Tam IBAN değerini loga yazmayın.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] Tekillik testi geçiyor.
- [ ] Eşleşme testi geçiyor.
- [ ] `ruff` kontrolü geçiyor.
- [ ] `CODEOWNERS` sahibinden inceleme istendi.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?
`Bank Statement Line` finans ekibinin girdiği banka ekstresi satırıdır. Satır bir para girişini ya da çıkışını tutar. Satır bir tahsilatla ya da iade kaydıyla eşleştirilir. Böylece elle havale ödemesi kanıtlanır.

## Bugünkü bağımlılıklar
### Bu kaydın bağlandığı kayıtlar
- `Admin Seller Profile` (`seller`): başka bağlam (02-satici-magaza)
- `Seller Bank Account Version` (`bank_account_version`): aynı bağlam
- `Currency` (`currency`): framework kaydı
- `User` (`entered_by`): framework kaydı
- `Payment Intent` (`payment_intent`): aynı bağlam
- `Order` (`order`): başka bağlam (04-siparis)
- `Payment Attempt` (`payment_attempt`): aynı bağlam
- `Payment Collection` (`payment_collection`): aynı bağlam
- `Payment Refund Record` (`refund_record`): aynı bağlam
- `User` (`matched_by`): framework kaydı
- `User` (`reviewed_by`): framework kaydı

### Bu kayda dokunan kod
- `tradehub_core/payments/bank_statements.py:153`: yazıyor (satırı açar)
- `tradehub_core/payments/bank_statements.py:521`: tahsilat eşleştirmesinde okuyor
- `tradehub_core/payments/service.py:421`: satırdan deneme ve tahsilat üretir
- `tradehub_core/payments/manual_guard.py:91`: yazım kapısı

### Denetleyicinin kendi dış çağrıları
- `bank_statement_line.py:13`: `listing_purge.guards.planned_delete` içe aktarır.
- `bank_statement_line.py:15`: `payments.manual_guard` çağırır.

### hooks.py kayıtları
- `hooks.py:1570`: liste ve kayıt izni `payments.manual_guard` içindedir.

## Bağımlılık sorunları
Önemli bir bağımlılık sorunu bulunmadı. Bütün yazımlar ödeme paketinin içindedir. Tek dış bağ `listing_purge` silme kapısıdır.

## Hedef tasarım
- Sahip bağlam: 05-odeme. Paket yolu: `tradehub_core/payments/`.
- Dışarıya açılan fonksiyon yoktur. Kayıt finans ekranından kullanılır.
- Olay: eşleşme sonucu `payment.collected` olayına dönüşür.
- `planned_delete` kontrolü `shared/retention.py` kapısına taşınır.

## Geçiş adımları
1. `planned_delete` taşıması ile birlikte içe aktarımı güncelleyin.

## Riskler ve testler
- Aynı satır iki kez girilebilir. Test: aynı `line_key` ikinci kez reddedilmeli.
