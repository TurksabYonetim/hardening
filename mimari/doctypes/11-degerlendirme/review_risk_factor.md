# Review Risk Factor

- Bağlam: 11-degerlendirme
- Tür: Alt tablo
- Klasör: `tradehub_core/tradehub_core/doctype/review_risk_factor`
- Denetleyici: `tradehub_core/tradehub_core/doctype/review_risk_factor/review_risk_factor.py` (5 satır)
- Önerilen sahip bağlam: 11-degerlendirme

## Epic

- Epic adı: Review Risk Factor: 11-degerlendirme bağlamına taşıma
- Öncelik: Düşük
- Faz: Faz 5
- Tahmini büyüklük: Küçük

### User story

Bir geliştirici olarak, risk faktörü tablosunun `Reviews` modülünde durmasını istiyorum.
Böylece değerlendirme ekibi kendi kayıtlarını tek yerde bulur.

### Kabul kriterleri

- [ ] DocType JSON dosyasının `module` alanı `Reviews` değerinde.
- [ ] Taşıma `Review Risk Score` ile aynı PR içinde yapıldı.
- [ ] Taşıma sonrası risk puanı kayıtları okunabiliyor.
- [ ] Characterization test: `Review Risk Factor` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- Alt tabloyu ana kayıttan ayrı taşımayın. Ana kayıt bozulabilir.
- Modül değerini yamasız değiştirmeyin. `tabDocType` tablosu eski değerde kalır.
- Risk faktörlerine başka bağlamdan yazmayın. Satırlar yalnız risk servisinden yazılır.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] Modül taşıma yaması tekrar çalıştırılabilir.
- [ ] Taşıma bir test sitesinde denendi.
- [ ] Risk puanı okuma testi geçiyor.
- [ ] `CODEOWNERS` dosyasında yeni yolun sahibi yazıldı.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?
Bu alt tablo, risk puanını oluşturan her etkeni bir satırda tutar. Satır, etkenin adını, ağırlığını ve kanıtını saklar. Ana kayıt `Review Risk Score` kaydıdır.

## Bugünkü bağımlılıklar
### Bu kaydın bağlandığı kayıtlar
- Link alanı yoktur.
### Bu kayda dokunan kod
- `tradehub_core/api/risk.py:305`: yazıyor (`rs.append("factors", f)`)
### hooks.py kayıtları
- Kayıt yoktur.

## Bağımlılık sorunları
Önemli bir bağımlılık sorunu bulunmadı.

## Hedef tasarım
- Sahip bağlam ve paket yolu: `tradehub_core/reviews/risk/`.
- Dışarıya açılan fonksiyon yoktur.
- Olay yayınlamaz ve dinlemez.
- Başka bağlama bağlantısı yoktur.
- Denetleyici boş kalır.

## Geçiş adımları
1. DocType JSON dosyasının `module` alanını `Reviews` yapın. Bu adım `Review Risk Score` ile aynı PR'da yapılır.

## Riskler ve testler
- Yeniden hesapta eski satırlar kalabilir. `rs.factors = []` davranışını sınayan test ekleyin.
