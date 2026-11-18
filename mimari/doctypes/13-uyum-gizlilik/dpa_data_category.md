# DPA Data Category

- Bağlam: 13-uyum-gizlilik
- Tür: Alt tablo
- Klasör: `tradehub_core/tradehub_core/doctype/dpa_data_category`
- Denetleyici: `tradehub_core/tradehub_core/doctype/dpa_data_category/dpa_data_category.py` (5 satır)
- Önerilen sahip bağlam: 13-uyum-gizlilik

## Epic

- Epic adı: DPA Data Category: 13-uyum-gizlilik bağlamına taşıma
- Öncelik: Düşük
- Faz: Faz 5
- Tahmini büyüklük: Küçük

### User story

Bir geliştirici olarak, `DPA Data Category` tablosunun ebeveyni `Data Processing Agreement` ile aynı modülde durmasını istiyorum.
Böylece tabloyu kimin değiştireceği açık olur.

### Kabul kriterleri

- [ ] `DPA Data Category` ve `Data Processing Agreement` aynı Frappe modülünde duruyor.
- [ ] `Data Processing Agreement` kaydı açılınca `DPA Data Category` satırları eksiksiz görünüyor.
- [ ] `DPA Data Category` satırlarını yalnız `tradehub_core.privacy` paketi yazıyor.
- [ ] Characterization test: `DPA Data Category` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- `DPA Data Category` modülünü ebeveynden ayrı bir PR ile taşımayın. Alt tablo bağı kopar.
- Başka bağlamın kodundan `DPA Data Category` satırı eklemeyin ya da silmeyin. Bu tabloyu yalnız `Data Processing Agreement` sahibi değiştirir.
- Alan adlarını taşıma PR'ı içinde değiştirmeyin. Taşıma ile alan değişikliği ayrı PR olmalı.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] Değişen davranış için önce başarısız olan bir test yazıldı.
- [ ] Ruff ve uygulama testleri yerelde geçiyor.
- [ ] `import-linter` kontrolü `tradehub_core.privacy` için geçiyor.
- [ ] `CODEOWNERS` içindeki gizlilik bağlamı sahibinden inceleme istendi.
- [ ] DocType modülü taşınırsa patch iki kez çalışınca hata vermiyor.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?

Bu alt tablo bir veri işleme sözleşmesindeki veri türlerini listeler. Her satır bir veri kategorisidir. Tablo yalnız `Data Processing Agreement` içinde kullanılır.

## Bugünkü bağımlılıklar

### Bu kaydın bağlandığı kayıtlar

- Bu kaydın başka kayda bağlantısı yok.

### Bu kayda dokunan kod

- `tradehub_core/tradehub_core/doctype/data_processing_agreement/data_processing_agreement.json:23`: alt tablo ya da Link tanımı

### hooks.py kayıtları

- `hooks.py` içinde bu DocType için kayıt yok.

## Bağımlılık sorunları

Önemli bir bağımlılık sorunu bulunmadı.

## Hedef tasarım

- Sahip bağlam ve paket yolu: `tradehub_core/privacy/` paketi ve yeni `Privacy` Frappe modülü. Ebeveyni ile aynı yerde kalır.
- Dışarıya açılan fonksiyonlar: Ayrı fonksiyon gerekmez. Okuma ebeveyn kaydın API'si üzerinden yapılır.
- Yayınladığı olaylar: Yok.
- Dinlediği olaylar: Yok.
- Başka bağlamlara bağlantılar: Başka bağlama bağlantı yok.
- Denetleyicide kalacak doğrulamalar: Satır düzeyinde doğrulama gerekmiyor.
- Servise taşınacak iş kuralları: Taşınacak iş kuralı yok.

## Geçiş adımları

1. Ebeveyn `Data Processing Agreement` ile aynı PR içinde `Privacy` modülüne taşıyın.

## Riskler ve testler

- Taşıma sırasında alt tablo bağı kopabilir. Test: sözleşme açılınca kategori satırları görünmeli.
