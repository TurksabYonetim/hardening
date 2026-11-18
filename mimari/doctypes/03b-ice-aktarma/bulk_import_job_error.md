# Bulk Import Job Error

- Bağlam: 03b-ice-aktarma
- Tür: Alt tablo
- Klasör: `tradehub_core/tradehub_core/doctype/bulk_import_job_error`
- Denetleyici: `tradehub_core/tradehub_core/doctype/bulk_import_job_error/bulk_import_job_error.py` (12 satır)
- Önerilen sahip bağlam: 03b-ice-aktarma

## Epic

- Epic adı: Bulk Import Job Error: 03b-ice-aktarma bağlamına taşıma
- Öncelik: Düşük
- Faz: Faz 4
- Tahmini büyüklük: Küçük

### User story

Bir satıcı olarak, hata dosyasında her hatalı satırın açık türle görünmesini istiyorum.
Böylece dosyamı hızlı düzeltip yeniden yüklerim.

### Kabul kriterleri

- [ ] `error_type` seçenekleri genelleşti. `rejected_by_rule` var, `eca_*` değerleri yama ile çevrildi.
- [ ] `get_job_errors` okuma modeli var. Hata dosyası bundan üretiliyor.
- [ ] 3 hatalı satır için indirilen dosyada 3 satır var. Test geçiyor.
- [ ] Characterization test: `Bulk Import Job Error` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- Kural motoru adını (`eca`) hata türü olarak yazmayın. Şema bağlamdan bağımsız kalır.
- Bu alt tabloya ayrı uç nokta yazmayın. Ana kayıt yazar.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] Hata türü yaması idempotent.
- [ ] Hata dosyası testi geçiyor.
- [ ] `CODEOWNERS` içe aktarma ekibinden inceleme istendi.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?
Bu alt tablo toplu yüklemedeki hatalı satırları tutar. Her satır satır numarası, stok kodu, hata türü ve mesajı taşır. Ana kayıt `Bulk Import Job` kaydıdır. Satıcı bu listeden hata dosyasını indirir.

## Bugünkü bağımlılıklar
### Bu kaydın bağlandığı kayıtlar
- Link alanı yok.
### Bu kayda dokunan kod
- `tradehub_core/bulk_import/runner.py:232,521,565`: eski hataları siliyor, yeni hata ve uyarı satırı ekliyor
- `tradehub_core/bulk_import/tasks.py:88`: temizlikte satırları siliyor
- `tradehub_core/bulk_import/api.py:574,977`: hata dosyası ve yeniden deneme okuyor
### hooks.py kayıtları
- Kayıt yok.

## Bağımlılık sorunları
1. `error_type` seçeneklerinde `eca_action_failed` ve `eca_rejected` var (`bulk_import_job_error.json`). Kural motoru (14) kavramı içe aktarma şemasına sızmış. Katalog hatası ile kural hatası ayrılmalı.

## Hedef tasarım
- Sahip bağlam `03b-ice-aktarma`.
- Dışarıya açılan fonksiyon: `get_job_errors(job)` okuma modeli. Hata dosyası bu fonksiyondan üretilir.
- Olay yok.
- Başka bağlamlara bağlantı yok.
- Denetleyicide kalacak doğrulama: hata mesajı zorunlu. `error_type` seçenekleri genelleştirilir: `validation`, `duplicate`, `image_missing`, `system`, `rejected_by_rule`.

## Geçiş adımları
1. `rejected_by_rule` seçeneğini ekleyin. Eski `eca_*` değerlerini yama ile çevirin.
2. Ana kayıtla birlikte `module` alanını değiştirin.

## Riskler ve testler
- Hata dosyası tüm satırları içermeli. Test: 3 hatalı satır indirilen dosyada 3 satır olur.
