# Media Crop Intent

- Bağlam: 08-medya
- Tür: Ana kayıt
- Klasör: `tradehub_core/tradehub_core/doctype/media_crop_intent`
- Denetleyici: `tradehub_core/tradehub_core/doctype/media_crop_intent/media_crop_intent.py` (331 satır)
- Önerilen sahip bağlam: 08-medya

## Epic

- Epic adı: Media Crop Intent: 08-medya bağlamına taşıma
- Öncelik: Önemli
- Faz: Faz 4
- Tahmini büyüklük: Orta

### User story

Bir satıcı olarak, önizlediğim kırpmayı yayınlamak istiyorum.
Böylece yayında onayladığım görüntüyü görürüm.

### Kabul kriterleri

- [ ] Eksik koordinat çifti reddedilir.
- [ ] Onaylı kırpma üretimde aynı sonucu verir.
- [ ] Sözleşme testi `media/api.py::save_crop_intent` çağrısının mevcut davranışı koruduğunu gösterir.
- [ ] Characterization test: `Media Crop Intent` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- Onay kanıtını önizleme olmadan üretmeyin. Kanıt gösterilen görüntüyü temsil eder.
- Kırpma kaydını katalogdan silmeyin. Silme sırasını medya yönetir.
- Dış bağlamdan `media` iç dosyalarını çağırmayın. Geçişte `save_crop_intent` sözleşmesini kullanın.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] `Media Crop Intent` için kabul koşullarını otomatik testte doğrulayın.
- [ ] `media` iç dosyalarına dış erişimleri `import-linter` ile kontrol edin.
- [ ] `CODEOWNERS` üzerinden `media` paketinin sahibinden inceleme isteyin.
- [ ] `tradehub_core/listing_purge/executor.py:42` bağımlılığının geçiş sonrası çağrı yolunu inceleyin.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?
Varlığın odak, güvenli alan ve kırpma tercihlerini tutar. `tradehub_core/tradehub_core/doctype/media_crop_intent/media_crop_intent.json:160`
Denetleyici koordinat çiftlerini, güvenli alanı ve onay kanıtını doğrular. `tradehub_core/tradehub_core/doctype/media_crop_intent/media_crop_intent.py:77`

## Bugünkü bağımlılıklar
### Bu kaydın bağlandığı kayıtlar
- `Media Asset` (`asset`): aynı bağlam. `tradehub_core/tradehub_core/doctype/media_crop_intent/media_crop_intent.json:31`
- `Media Crop Override` (`overrides`) alt tablosu. `tradehub_core/tradehub_core/doctype/media_crop_intent/media_crop_intent.json:146`
### Bu kayda dokunan kod
- `tradehub_core/media/pipeline_bridge.py:1605`: okuyor
- `tradehub_core/tests/test_magaza_odak.py:131`: yazıyor
- `tradehub_core/tests/test_pipeline_bridge.py:107`: yazıyor
- `tradehub_core/tests/test_serit_a_kablolama.py:115`: yazıyor
### hooks.py kayıtları
- `tradehub_core/hooks.py:1174` Liste sorgusu yetki kancası.
- `tradehub_core/hooks.py:1296` Tekil kayıt yetki kancası.

## Bağımlılık sorunları
1. Katalog silme sırası kırpma kaydına bağlı. Yeni ilişkiler katalog temizliğini durdurabilir. `tradehub_core/listing_purge/executor.py:42`

## Hedef tasarım
- `08-medya` bu kayda `tradehub_core/media/` paketinde sahip olsun.
- Dışarıya açılacak fonksiyonlar. `tradehub_core/media/api.py::save_crop_intent`
- Olaylar. Bu kayıt için ayrıca bağlamlar arası olay önerilmiyor.
- Bağlantılar. Bu kayıt için yeni bağlamlar arası bağlantı veya anlık görüntü alanı önerilmiyor.
- Doğrulama ve iş akışı. Koordinat ve onay kanıtı doğrulaması denetleyicide kalsın. Önizlemeyi ve türevleri üretme işini medya servisi yürütsün.

## Geçiş adımları
1. Mevcut davranış için aşağıdaki testi ekle. `save_crop_intent` sözleşmesini mevcut uygulama üzerinden geçir.
2. İlk adımdan sonra kırpma kaydını medya silme planı üzerinden temizle.
3. İkinci adımdan sonra modül kaydını taşı. Eski Python girişlerini geçiş süresince yönlendir.

## Riskler ve testler
- Eksik koordinat çifti reddedilir. Onaylı kırpma üretimde aynı sonucu verir.
