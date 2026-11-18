# Email Preference Category

- Bağlam: 12-bildirim-iletisim
- Tür: Ana kayıt
- Klasör: `tradehub_core/tradehub_core/doctype/email_preference_category`
- Denetleyici: `tradehub_core/tradehub_core/doctype/email_preference_category/email_preference_category.py` (34 satır)
- Önerilen sahip bağlam: 12-bildirim-iletisim

## Epic

- Epic adı: Email Preference Category: 12-bildirim-iletisim bağlamına taşıma
- Öncelik: Önemli
- Faz: Faz 4
- Tahmini büyüklük: Orta

### User story

Bir alıcı olarak, e-posta seçeneklerini kategoriye göre görmek istiyorum.
Böylece istediğim seçeneği kolay bulurum.

### Kabul kriterleri

- [ ] Aynı anahtara sahip iki öğe kaydedilemez.
- [ ] Sözleşme testi `notifications/api.py::list_email_preferences` çağrısının mevcut davranışı koruduğunu gösterir.
- [ ] Geçiş testi, mevcut `Email Preference Category` kaydının sahip paket üzerinden okunabildiğini gösterir.
- [ ] Characterization test: `Email Preference Category` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- Öğeyi kategori dışında yazmayın. Anahtar denetimi üst kayıttadır.
- Anahtarı görünen etiketle değiştirmeyin. Kullanıcı tercihleri anahtarı kullanır.
- Dış bağlamdan `notifications` iç dosyalarını çağırmayın. Geçişte `list_email_preferences` sözleşmesini kullanın.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] `Email Preference Category` için kabul koşullarını otomatik testte doğrulayın.
- [ ] `notifications` iç dosyalarına dış erişimleri `import-linter` ile kontrol edin.
- [ ] `CODEOWNERS` üzerinden `notifications` paketinin sahibinden inceleme isteyin.
- [ ] Mevcut bir `Email Preference Category` kaydını eski girişten ve sahip paketten okuyup karşılaştırın.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?
E-posta tercihlerini kategori altında toplar. `tradehub_core/tradehub_core/doctype/email_preference_category/email_preference_category.json:79`
Denetleyici, tercih öğelerinin anahtarlarının tekil olmasını sağlar. `tradehub_core/tradehub_core/doctype/email_preference_category/email_preference_category.py:7`

## Bugünkü bağımlılıklar
### Bu kaydın bağlandığı kayıtlar
- `Email Preference Item` (`items`) alt tablosu. `tradehub_core/tradehub_core/doctype/email_preference_category/email_preference_category.json:69`
### Bu kayda dokunan kod
- `tradehub_core/api/v1/email_preferences.py:15`: okuyor
- `tradehub_core/setup/install.py:160`: okuyor
### hooks.py kayıtları
- Doğrudan ada göre kanca bulunmadı. Dolaylı kayıtlar doğrulanmadı. `tradehub_core/hooks.py:453`

## Bağımlılık sorunları
Önemli bir bağımlılık sorunu bulunmadı.

## Hedef tasarım
- `12-bildirim-iletisim` bu kayda `tradehub_core/notifications/` paketinde sahip olsun.
- Dışarıya açılacak fonksiyonlar. `tradehub_core/notifications/api.py::list_email_preferences`
- Olaylar. Bu kayıt için ayrıca bağlamlar arası olay önerilmiyor.
- Bağlantılar. Bu kayıt için yeni bağlamlar arası bağlantı veya anlık görüntü alanı önerilmiyor.
- Doğrulama ve iş akışı. Kategori ve öğe anahtarları üst kayıtta doğrulansın. Tercih görünümünü iletişim API’si sunsun.

## Geçiş adımları
1. Mevcut davranış için aşağıdaki testi ekle. `list_email_preferences` sözleşmesini mevcut uygulama üzerinden geçir.
2. İlk adımdan sonra rapordaki doğrulamayı ve iş akışını sahip pakette topla.
3. İkinci adımdan sonra modül kaydını taşı. Eski Python girişlerini geçiş süresince yönlendir.

## Riskler ve testler
- Aynı anahtara sahip iki öğe kaydedilemez.
