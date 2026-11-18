# ROPA DocType Link

- Bağlam: 13-uyum-gizlilik
- Tür: Alt tablo
- Klasör: `tradehub_core/tradehub_core/doctype/ropa_doctype_link`
- Denetleyici: `tradehub_core/tradehub_core/doctype/ropa_doctype_link/ropa_doctype_link.py` (5 satır)
- Önerilen sahip bağlam: 13-uyum-gizlilik

## Epic

- Epic adı: ROPA DocType Link: 13-uyum-gizlilik bağlamına taşıma
- Öncelik: Düşük
- Faz: Faz 5
- Tahmini büyüklük: Küçük

### User story

Bir geliştirici olarak, `ROPA DocType Link` tablosunun ebeveyni `Processing Activity Record` ile aynı modülde durmasını istiyorum.
Böylece tabloyu kimin değiştireceği açık olur.

### Kabul kriterleri

- [ ] `ROPA DocType Link` ve `Processing Activity Record` aynı Frappe modülünde duruyor.
- [ ] `Processing Activity Record` kaydı açılınca `ROPA DocType Link` satırları eksiksiz görünüyor.
- [ ] `ROPA DocType Link` satırlarını yalnız `tradehub_core.privacy` paketi yazıyor.
- [ ] Characterization test: `ROPA DocType Link` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- `ROPA DocType Link` modülünü ebeveynden ayrı bir PR ile taşımayın. Alt tablo bağı kopar.
- Başka bağlamın kodundan `ROPA DocType Link` satırı eklemeyin ya da silmeyin. Bu tabloyu yalnız `Processing Activity Record` sahibi değiştirir.
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

Bu alt tablo bir işleme faaliyetinin hangi DocType'ları kullandığını listeler. Her satır bir DocType adıdır.

## Bugünkü bağımlılıklar

### Bu kaydın bağlandığı kayıtlar

- `DocType` (`ref_doctype`, Link): başka bağlam (Frappe çekirdeği)

### Bu kayda dokunan kod

- `tradehub_core/api/v1/compliance.py:466`: adını kullanıyor
- `tradehub_core/tradehub_core/doctype/processing_activity_record/processing_activity_record.json:31`: alt tablo ya da Link tanımı

### hooks.py kayıtları

- `hooks.py` içinde bu DocType için kayıt yok.

## Bağımlılık sorunları

Önemli bir bağımlılık sorunu bulunmadı.

## Hedef tasarım

- Sahip bağlam ve paket yolu: `tradehub_core/privacy/` paketi ve yeni `Privacy` Frappe modülü. Ebeveyni ile aynı yerde kalır.
- Dışarıya açılan fonksiyonlar: Ayrı fonksiyon gerekmez.
- Yayınladığı olaylar: Yok.
- Dinlediği olaylar: Yok.
- Başka bağlamlara bağlantılar: `ref_doctype` Link alanı Frappe `DocType` kaydına bağlıdır. Bu bağ kalır.
- Denetleyicide kalacak doğrulamalar: Doğrulama gerekmiyor.
- Servise taşınacak iş kuralları: Taşınacak iş kuralı yok.

## Geçiş adımları

1. Ebeveyn ile aynı PR içinde `Privacy` modülüne taşıyın.

## Riskler ve testler

- DocType adı değişirse satır geçersiz kalır. Test: ROPA raporu var olmayan DocType için uyarı vermeli.
