# Translation Usage Log

- Bağlam: 09-icerik-vitrin
- Tür: Kayıt defteri (log)
- Klasör: `tradehub_core/tradehub_core/doctype/translation_usage_log`
- Denetleyici: `tradehub_core/tradehub_core/doctype/translation_usage_log/translation_usage_log.py` (5 satır)
- Önerilen sahip bağlam: 11-degerlendirme. Kayıt yorum çevirisine bağlı.

## Epic

- Epic adı: Translation Usage Log: 11-degerlendirme bağlamına taşıma
- Öncelik: Düşük
- Faz: Faz 4
- Tahmini büyüklük: Küçük

### User story

Bir platform yöneticisi olarak, çeviri maliyetini doğru görmek istiyorum.
Böylece aylık harcamayı izleyebilirim.

### Kabul kriterleri

- [ ] Kayıt `Review Translation` ile aynı bağlamda duruyor.
- [ ] `api/analytics.py:154` sayımı `count_translations` fonksiyonuyla yapıyor.
- [ ] Her çeviri isteği tek bir maliyet satırı yazıyor.
- [ ] Characterization test: `Translation Usage Log` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- Çeviri silinince maliyet satırını silmeyin. Yalnız bağ boşaltılır.
- Maliyet satırını analitik kodundan yazmayın. Yazım yalnız çeviri kodunda olmalı.
- `cost_usd` alanının türünü değiştirmeyin. Geçmiş raporlar bozulur.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] Değişen davranış için önce başarısız olan bir test yazıldı.
- [ ] Ruff ve uygulama testleri yerelde geçiyor.
- [ ] `import-linter` kontrolü `tradehub_core.reviews` için geçiyor.
- [ ] `CODEOWNERS` içindeki değerlendirme bağlamı sahibinden inceleme istendi.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?

Bu kayıt her çeviri isteğinin maliyetini tutar. Satır sağlayıcıyı, dilleri, token sayısını ve dolar maliyetini saklar.

## Bugünkü bağımlılıklar

### Bu kaydın bağlandığı kayıtlar

- `Review Translation` (`translation`, Link): başka bağlam (11-degerlendirme)

### Bu kayda dokunan kod

- `tradehub_core/api/translation.py:116`: yazıyor
- `tradehub_core/api/analytics.py:154`: adını kullanıyor
- `tradehub_core/tradehub_core/doctype/review_translation/review_translation.py:11`: adını kullanıyor

### hooks.py kayıtları

- `hooks.py` içinde bu DocType için kayıt yok.

## Bağımlılık sorunları

1. Kayıt 11 bağlamındaki `Review Translation` kaydına bağlı. Kanıt: `translation` Link alanı.
2. Yorum çevirisi silinince bu satırı `set_value` ile güncelliyor. Kanıt: `review_translation.py:11`. Aynı bağlama taşınınca sorun kalkar.
3. Analitik kodu tabloyu sayıyor. Kanıt: `api/analytics.py:154`.

## Hedef tasarım

- Sahip bağlam ve paket yolu: `tradehub_core/reviews/` paketi. 11-degerlendirme bağlamına taşınır.
- Dışarıya açılan fonksiyonlar: `reviews/api.py` içinde `count_translations(day)`.
- Yayınladığı olaylar: Yok.
- Dinlediği olaylar: Yok.
- Başka bağlamlara bağlantılar: `translation` Link alanı aynı bağlama ait olur.
- Denetleyicide kalacak doğrulamalar: Doğrulama gerekmiyor.
- Servise taşınacak iş kuralları: Taşınacak iş kuralı yok.

## Geçiş adımları

1. DocType'ı `Review Translation` ile aynı modüle taşıyın.
2. `analytics.py:154` sayımını `count_translations` çağrısına çevirin.

## Riskler ve testler

- Maliyet kaydı kaybolabilir. Test: çeviri sonrası tek satır yazılmalı.
