# PII Jurisdiction Rule

- Bağlam: 13-uyum-gizlilik
- Tür: Alt tablo
- Klasör: `tradehub_core/tradehub_core/doctype/pii_jurisdiction_rule`
- Denetleyici: `tradehub_core/tradehub_core/doctype/pii_jurisdiction_rule/pii_jurisdiction_rule.py` (8 satır)
- Önerilen sahip bağlam: 13-uyum-gizlilik

## Epic

- Epic adı: PII Jurisdiction Rule: 13-uyum-gizlilik bağlamına taşıma
- Öncelik: Düşük
- Faz: Faz 5
- Tahmini büyüklük: Küçük

### User story

Bir geliştirici olarak, `PII Jurisdiction Rule` tablosunun ebeveyni `PII Field Policy` ile aynı modülde durmasını istiyorum.
Böylece tabloyu kimin değiştireceği açık olur.

### Kabul kriterleri

- [ ] `PII Jurisdiction Rule` ve `PII Field Policy` aynı Frappe modülünde duruyor.
- [ ] `PII Field Policy` kaydı açılınca `PII Jurisdiction Rule` satırları eksiksiz görünüyor.
- [ ] `PII Jurisdiction Rule` satırlarını yalnız `tradehub_core.privacy` paketi yazıyor.
- [ ] Characterization test: `PII Jurisdiction Rule` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- `PII Jurisdiction Rule` modülünü ebeveynden ayrı bir PR ile taşımayın. Alt tablo bağı kopar.
- Başka bağlamın kodundan `PII Jurisdiction Rule` satırı eklemeyin ya da silmeyin. Bu tabloyu yalnız `PII Field Policy` sahibi değiştirir.
- Alan adlarını taşıma PR'ı içinde değiştirmeyin. Taşıma ile alan değişikliği ayrı PR olmalı.
- Uyum API'sinden bu tabloya `parenttype` filtresiyle yazmayın. Yazım ebeveyn kayıt üzerinden yapılmalı.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] Değişen davranış için önce başarısız olan bir test yazıldı.
- [ ] Ruff ve uygulama testleri yerelde geçiyor.
- [ ] `import-linter` kontrolü `tradehub_core.privacy` için geçiyor.
- [ ] `CODEOWNERS` içindeki gizlilik bağlamı sahibinden inceleme istendi.
- [ ] DocType modülü taşınırsa patch iki kez çalışınca hata vermiyor.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?

Bu alt tablo kişisel veri kuralının ülkeye göre farkını tutar. Her satır bir hukuk bölgesidir. Örnek bölgeler TR ve AB olabilir. Tablo yalnız `PII Field Policy` içinde kullanılır.

## Bugünkü bağımlılıklar

### Bu kaydın bağlandığı kayıtlar

- Bu kaydın başka kayda bağlantısı yok.

### Bu kayda dokunan kod

- `tradehub_core/api/v1/compliance.py:66`: adını kullanıyor
- `tradehub_core/setup/handover_validator.py:103`: adını kullanıyor
- `tradehub_core/tradehub_core/doctype/pii_field_policy/pii_field_policy.json:65`: alt tablo ya da Link tanımı
- 1 patch ya da tohum dosyası bu adı kullanıyor. Örnek: `tradehub_core/scripts/patch_specs/spec04.json`.

### hooks.py kayıtları

- `hooks.py` içinde bu DocType için kayıt yok.

## Bağımlılık sorunları

1. Uyum API'si alt tabloyu `parenttype` filtresiyle doğrudan okuyor. Kanıt: `api/v1/compliance.py:66`. Aynı bağlamda olduğu için kabul edilebilir.

## Hedef tasarım

- Sahip bağlam ve paket yolu: `tradehub_core/privacy/` paketi ve yeni `Privacy` Frappe modülü. Ebeveyni ile aynı yerde kalır.
- Dışarıya açılan fonksiyonlar: Ayrı fonksiyon gerekmez.
- Yayınladığı olaylar: Yok.
- Dinlediği olaylar: Yok.
- Başka bağlamlara bağlantılar: Başka bağlama bağlantı yok.
- Denetleyicide kalacak doğrulamalar: Tekillik kontrolü ebeveyn denetleyicisinde kalır.
- Servise taşınacak iş kuralları: Taşınacak iş kuralı yok.

## Geçiş adımları

1. Ebeveyn ile aynı PR içinde `Privacy` modülüne taşıyın.

## Riskler ve testler

- Aynı bölge iki kez girilebilir. Test: ikinci satır kayıtta hata vermeli.
