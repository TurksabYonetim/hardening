# Payment Evidence Cleanup

- Bağlam: 05-odeme
- Tür: Kayıt defteri (log)
- Klasör: `tradehub_core/tradehub_core/doctype/payment_evidence_cleanup`
- Denetleyici: `tradehub_core/tradehub_core/doctype/payment_evidence_cleanup/payment_evidence_cleanup.py` (20 satır)
- Önerilen sahip bağlam: 05-odeme

## Epic

- Epic adı: Payment Evidence Cleanup: 05-odeme bağlamına taşıma
- Öncelik: Düşük
- Faz: Faz 3
- Tahmini büyüklük: Küçük

### User story

Bir geliştirici olarak, süresi dolan belge dosyalarının güvenle silinmesini istiyorum.
Böylece mali kayıt bozulmadan yer açılır.

### Kabul kriterleri

- [ ] Dosya silme hatası satırı "Pending" bırakıyor.
- [ ] `planned_delete` kapısı `shared/retention.py` içinden geliyor.
- [ ] Mali kayıtlar değişmiyor.
- [ ] Characterization test: `Payment Evidence Cleanup` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- Mali kaydı bu kuyrukla silmeyin. Yalnız dosya silinir.
- Satırı silinmeden "Completed" yapmayın.
- Saklama süresini koda gömülü yeni değerle değiştirmeyin.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] Silme hatası testi geçiyor.
- [ ] Günlük iş testi geçiyor.
- [ ] `ruff` kontrolü geçiyor.
- [ ] `CODEOWNERS` sahibinden inceleme istendi.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?
`Payment Evidence Cleanup` saklama süresi dolan ödeme belgesi dosyalarının silme kuyruğudur. Her satır bir dosyayı ve silme durumunu tutar. Mali kayıtlar değişmez. Yalnız dosya kaldırılır.

## Bugünkü bağımlılıklar
### Bu kaydın bağlandığı kayıtlar
- `Payment Intent` (`payment_intent`): aynı bağlam
- `Order` (`source_order`): başka bağlam (04-siparis)

### Bu kayda dokunan kod
- `tradehub_core/payments/retention.py:100`: yazıyor (kuyruğa ekler)
- `tradehub_core/payments/retention.py:140`: yazıyor (deneme sayısı)
- `tradehub_core/payments/retention.py:183`: yazıyor (tamamlandı)
- `tradehub_core/payments/documents.py:269`: okuyor

### hooks.py kayıtları
- `hooks.py:1534`: günlük zamanlanmış görev `payments.retention.run_scheduled` çalışır. Bu kayıt proje kodundadır.

## Bağımlılık sorunları
Önemli bir bağımlılık sorunu bulunmadı.

## Hedef tasarım
- Sahip bağlam: 05-odeme.
- Dışarıya açılan fonksiyon ve olay yoktur.
- Saklama kuralı 13-uyum-gizlilik bağlamının politikasına bağlanabilir. Bugün kural ödeme kodundadır.

## Geçiş adımları
1. Değişiklik gerekmez. `planned_delete` taşımasıyla içe aktarımı güncelleyin.

## Riskler ve testler
- Dosya silinmeden kayıt "Completed" olabilir. Test: dosya silme hatası satırı "Pending" bırakmalı.
