# Template Question

- Bağlam: 11-degerlendirme
- Tür: Alt tablo
- Klasör: `tradehub_core/tradehub_core/doctype/template_question`
- Denetleyici: `tradehub_core/tradehub_core/doctype/template_question/template_question.py` (5 satır)
- Önerilen sahip bağlam: 11-degerlendirme

## Epic

- Epic adı: Template Question: 11-degerlendirme bağlamına taşıma
- Öncelik: Düşük
- Faz: Faz 5
- Tahmini büyüklük: Küçük

### User story

Bir geliştirici olarak, şablon soru tablosunun `Reviews` modülünde durmasını istiyorum.
Böylece değerlendirme ekibi kendi kayıtlarını tek yerde bulur.

### Kabul kriterleri

- [ ] DocType JSON dosyasının `module` alanı `Reviews` değerinde.
- [ ] Taşıma `Category Review Template` ile aynı PR içinde yapıldı.
- [ ] Taşıma sonrası şablon okuma ucu çalışıyor.
- [ ] Characterization test: `Template Question` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- Alt tabloyu ana kayıttan ayrı taşımayın. Ana kayıt bozulabilir.
- Modül değerini yamasız değiştirmeyin. `tabDocType` tablosu eski değerde kalır.
- Soru `key` değerini değiştirmeyin. Eski yorum cevapları bu anahtarla saklanır.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] Modül taşıma yaması tekrar çalıştırılabilir.
- [ ] Taşıma bir test sitesinde denendi.
- [ ] Şablon okuma testi geçiyor.
- [ ] `CODEOWNERS` dosyasında yeni yolun sahibi yazıldı.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?
Bu alt tablo, kategori şablonundaki her ek soruyu bir satırda tutar. Satır, sorunun anahtarını, etiketini ve türünü saklar. Ana kayıt `Category Review Template` kaydıdır.

## Bugünkü bağımlılıklar
### Bu kaydın bağlandığı kayıtlar
- Link alanı yoktur.
### Bu kayda dokunan kod
- DocType adını içeren kod yoktur. Satırlar ana kayıt üzerinden okunur (`tradehub_core/api/templates.py:42`).
- Zorunlu soru kontrolü `tradehub_core/api/templates.py:88` satırında yapılır.
### hooks.py kayıtları
- Kayıt yoktur.

## Bağımlılık sorunları
Önemli bir bağımlılık sorunu bulunmadı.

## Hedef tasarım
- Sahip bağlam ve paket yolu: `tradehub_core/reviews/templates/`.
- Dışarıya açılan fonksiyon yoktur.
- Olay yayınlamaz ve dinlemez.
- Başka bağlama bağlantısı yoktur.
- `key` değerinin şablon içinde tekil olması ana kaydın denetleyicisinde kontrol edilebilir.

## Geçiş adımları
1. DocType JSON dosyasının `module` alanını `Reviews` yapın. Bu adım `Category Review Template` ile aynı PR'da yapılır.

## Riskler ve testler
- Aynı anahtar iki kez tanımlanırsa cevaplar karışır. Tekil anahtar testi ekleyin.
