# Retention Anonymize Field

- Bağlam: 13-uyum-gizlilik
- Tür: Alt tablo
- Klasör: `tradehub_core/tradehub_core/doctype/retention_anonymize_field`
- Denetleyici: `tradehub_core/tradehub_core/doctype/retention_anonymize_field/retention_anonymize_field.py` (5 satır)
- Önerilen sahip bağlam: 13-uyum-gizlilik

## Epic

- Epic adı: Retention Anonymize Field: 13-uyum-gizlilik bağlamına taşıma
- Öncelik: Düşük
- Faz: Faz 5
- Tahmini büyüklük: Küçük

### User story

Bir geliştirici olarak, `Retention Anonymize Field` tablosunun ebeveyni `Data Retention Policy` ile aynı modülde durmasını istiyorum.
Böylece tabloyu kimin değiştireceği açık olur.

### Kabul kriterleri

- [ ] `Retention Anonymize Field` ve `Data Retention Policy` aynı Frappe modülünde duruyor.
- [ ] `Data Retention Policy` kaydı açılınca `Retention Anonymize Field` satırları eksiksiz görünüyor.
- [ ] `Retention Anonymize Field` satırlarını yalnız `tradehub_core.privacy` paketi yazıyor.
- [ ] Characterization test: `Retention Anonymize Field` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- `Retention Anonymize Field` modülünü ebeveynden ayrı bir PR ile taşımayın. Alt tablo bağı kopar.
- Başka bağlamın kodundan `Retention Anonymize Field` satırı eklemeyin ya da silmeyin. Bu tabloyu yalnız `Data Retention Policy` sahibi değiştirir.
- Alan adlarını taşıma PR'ı içinde değiştirmeyin. Taşıma ile alan değişikliği ayrı PR olmalı.
- Alan adını hedef DocType'ta olmayan bir değerle kaydetmeyin. Kural sessizce çalışmaz.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] Değişen davranış için önce başarısız olan bir test yazıldı.
- [ ] Ruff ve uygulama testleri yerelde geçiyor.
- [ ] `import-linter` kontrolü `tradehub_core.privacy` için geçiyor.
- [ ] `CODEOWNERS` içindeki gizlilik bağlamı sahibinden inceleme istendi.
- [ ] DocType modülü taşınırsa patch iki kez çalışınca hata vermiyor.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?

Bu alt tablo saklama kuralında anonim yapılacak alanları listeler. Her satır bir alan adı ve bir yöntemdir.

## Bugünkü bağımlılıklar

### Bu kaydın bağlandığı kayıtlar

- Bu kaydın başka kayda bağlantısı yok.

### Bu kayda dokunan kod

- `tradehub_core/privacy/data_retention.py:44`: adını kullanıyor
- `tradehub_core/tradehub_core/doctype/data_retention_policy/data_retention_policy.json:20`: alt tablo ya da Link tanımı

### hooks.py kayıtları

- `hooks.py` içinde bu DocType için kayıt yok.

## Bağımlılık sorunları

1. Alan adı serbest metindir. Hedef bağlam alanın adını değiştirirse satır bozulur. Kanıt: `data_retention_policy.py:18` yalnız kayıt anında kontrol ediyor.

## Hedef tasarım

- Sahip bağlam ve paket yolu: `tradehub_core/privacy/` paketi ve yeni `Privacy` Frappe modülü. Ebeveyni ile aynı yerde kalır.
- Dışarıya açılan fonksiyonlar: Ayrı fonksiyon gerekmez.
- Yayınladığı olaylar: Yok.
- Dinlediği olaylar: Yok.
- Başka bağlamlara bağlantılar: Başka bağlama bağlantı yok.
- Denetleyicide kalacak doğrulamalar: Alan varlığı kontrolü ebeveyn denetleyicisinde kalır.
- Servise taşınacak iş kuralları: Taşınacak iş kuralı yok.

## Geçiş adımları

1. Ebeveyn ile aynı PR içinde `Privacy` modülüne taşıyın.
2. CI testi tüm satırları hedef DocType meta bilgisiyle kontrol etsin.

## Riskler ve testler

- Alan adı değişince anonimleştirme atlanır. Test: CI testi bilinmeyen alanı yakalamalı.
