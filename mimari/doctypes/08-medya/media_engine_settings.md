# Media Engine Settings

- Bağlam: 08-medya
- Tür: Ayar (single)
- Klasör: `tradehub_core/tradehub_core/doctype/media_engine_settings`
- Denetleyici: `tradehub_core/tradehub_core/doctype/media_engine_settings/media_engine_settings.py` (58 satır)
- Önerilen sahip bağlam: 08-medya

## Epic

- Epic adı: Media Engine Settings: 08-medya bağlamına taşıma
- Öncelik: Önemli
- Faz: Faz 4
- Tahmini büyüklük: Orta

### User story

Bir geliştirici olarak, üretim sınırlarını tek yerden değiştirmek istiyorum.
Böylece medya üretimini kontrollü açarım.

### Kabul kriterleri

- [ ] Motor kapalıyken yeni türev işi başlamaz.
- [ ] `import-linter` denetimi, dış bağlamın `Media Engine Settings` işleyicisini içe aktarmasını engeller.
- [ ] Geçiş testi, mevcut `Media Engine Settings` kaydının sahip paket üzerinden okunabildiğini gösterir.
- [ ] Characterization test: `Media Engine Settings` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- Önbelleği işlem kesinleşmeden yenilemeyin. Geri alınan değer yayılabilir.
- Arka plan işinde kapatma ayarını atlamayın. Kapatma tercihi korunmalıdır.
- `Media Engine Settings` için dış bağlama doğrudan yazma yolu açmayın. Yazım kuralları `media` paketinde kalır.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] `Media Engine Settings` için kabul koşullarını otomatik testte doğrulayın.
- [ ] `media` iç dosyalarına dış erişimleri `import-linter` ile kontrol edin.
- [ ] `CODEOWNERS` üzerinden `media` paketinin sahibinden inceleme isteyin.
- [ ] Mevcut bir `Media Engine Settings` kaydını eski girişten ve sahip paketten okuyup karşılaştırın.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?
Medya motorunun üretim sınırlarını ve devreye alma ayarlarını tutar. `tradehub_core/tradehub_core/doctype/media_engine_settings/media_engine_settings.json:46`
Denetleyici çıktı sınırını ve devreye alma ayarını doğrular. `tradehub_core/tradehub_core/doctype/media_engine_settings/media_engine_settings.py:21`

## Bugünkü bağımlılıklar
### Bu kaydın bağlandığı kayıtlar
- Bağlantı alanı bulunmadı. `tradehub_core/tradehub_core/doctype/media_engine_settings/media_engine_settings.json:46`
### Bu kayda dokunan kod
- `tradehub_core/media/pipeline_flags.py:231`: okuyor
- `tradehub_core/setup/install.py:74`: okuyor
### hooks.py kayıtları
- `tradehub_core/hooks.py:1312` Tekil kayıt yetki kancası.
- `tradehub_core/hooks.py:504` İlgili kayıt dışı tetikleyici. `"tradehub_core.media.pipeline_bridge.maybe_generate_renditions",`

## Bağımlılık sorunları
Önemli bir bağımlılık sorunu bulunmadı.

## Hedef tasarım
- `08-medya` bu kayda `tradehub_core/media/` paketinde sahip olsun.
- Dışarıya açılacak fonksiyonlar. `tradehub_core/media/api.py` içinde bu kayıt için ayrı fonksiyon önerilmiyor.
- Olaylar. Bu kayıt için ayrıca bağlamlar arası olay önerilmiyor.
- Bağlantılar. Bu kayıt için yeni bağlamlar arası bağlantı veya anlık görüntü alanı önerilmiyor.
- Doğrulama ve iş akışı. Kapsam ve sınır doğrulaması denetleyicide kalsın. Önbelleği işlem kaydı kesinleşince servis yenilesin.

## Geçiş adımları
1. Mevcut davranış için aşağıdaki testi ekle. Sahip paket için mevcut davranışı sabitle.
2. İlk adımdan sonra rapordaki doğrulamayı ve iş akışını sahip pakette topla.
3. İkinci adımdan sonra modül kaydını taşı. Eski Python girişlerini geçiş süresince yönlendir.

## Riskler ve testler
- Motor kapalıyken yeni türev işi başlamaz.
