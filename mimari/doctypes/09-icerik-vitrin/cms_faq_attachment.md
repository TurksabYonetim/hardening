# CMS FAQ Attachment

- Bağlam: 09-icerik-vitrin
- Tür: Alt tablo
- Klasör: `tradehub_core/seo_cms/doctype/cms_faq_attachment`
- Denetleyici: `tradehub_core/seo_cms/doctype/cms_faq_attachment/cms_faq_attachment.py` (8 satır)
- Önerilen sahip bağlam: 09-icerik-vitrin

## Epic

- Epic adı: CMS FAQ Attachment: 09-icerik-vitrin bağlamına taşıma
- Öncelik: Düşük
- Faz: Faz 5
- Tahmini büyüklük: Küçük

### User story

Bir geliştirici olarak, `CMS FAQ Attachment` tablosunun ebeveyni `CMS Content` ile aynı modülde durmasını istiyorum.
Böylece tabloyu kimin değiştireceği açık olur.

### Kabul kriterleri

- [ ] `CMS FAQ Attachment` ve `CMS Content` aynı Frappe modülünde duruyor.
- [ ] `CMS Content` kaydı açılınca `CMS FAQ Attachment` satırları eksiksiz görünüyor.
- [ ] `CMS FAQ Attachment` satırlarını yalnız `tradehub_core.content` paketi yazıyor.
- [ ] Characterization test: `CMS FAQ Attachment` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- `CMS FAQ Attachment` modülünü ebeveynden ayrı bir PR ile taşımayın. Alt tablo bağı kopar.
- Başka bağlamın kodundan `CMS FAQ Attachment` satırı eklemeyin ya da silmeyin. Bu tabloyu yalnız `CMS Content` sahibi değiştirir.
- Alan adlarını taşıma PR'ı içinde değiştirmeyin. Taşıma ile alan değişikliği ayrı PR olmalı.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] Değişen davranış için önce başarısız olan bir test yazıldı.
- [ ] Ruff ve uygulama testleri yerelde geçiyor.
- [ ] `import-linter` kontrolü `tradehub_core.content` için geçiyor.
- [ ] `CODEOWNERS` içindeki içerik bağlamı sahibinden inceleme istendi.
- [ ] DocType modülü taşınırsa patch iki kez çalışınca hata vermiyor.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?

Bu alt tablo bir SSS bloğunun hangi içeriklere eklendiğini listeler. SSS, sık sorulan sorular demektir. Her satır bir `CMS Content` bağıdır.

## Bugünkü bağımlılıklar

### Bu kaydın bağlandığı kayıtlar

- `CMS Content` (`content`, Link): aynı bağlam

### Bu kayda dokunan kod

- `tradehub_core/seo_cms/doctype/cms_content/cms_content.json:275`: alt tablo ya da Link tanımı

### hooks.py kayıtları

- `hooks.py` içinde bu DocType için kayıt yok.

## Bağımlılık sorunları

Önemli bir bağımlılık sorunu bulunmadı.

## Hedef tasarım

- Sahip bağlam ve paket yolu: `tradehub_core/content/cms/` paketi. Bugünkü `SEO CMS` modülü bu bağlama ait sayılır.
- Dışarıya açılan fonksiyonlar: Ayrı fonksiyon gerekmez.
- Yayınladığı olaylar: Yok.
- Dinlediği olaylar: Yok.
- Başka bağlamlara bağlantılar: Aynı bağlam içi Link. Bağ kalır.
- Denetleyicide kalacak doğrulamalar: Doğrulama gerekmiyor.
- Servise taşınacak iş kuralları: Taşınacak iş kuralı yok.

## Geçiş adımları

1. Ebeveyn ile aynı PR içinde `Content` modülüne taşıyın.

## Riskler ve testler

- Bağlı içerik silinince satır yetim kalabilir. Test: içerik silinince satır temizlenmeli.
