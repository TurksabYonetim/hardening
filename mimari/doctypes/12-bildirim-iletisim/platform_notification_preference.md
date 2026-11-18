# Platform Notification Preference

- Bağlam: 12-bildirim-iletisim
- Tür: Ana kayıt
- Klasör: `tradehub_core/tradehub_core/doctype/platform_notification_preference`
- Denetleyici: `tradehub_core/tradehub_core/doctype/platform_notification_preference/platform_notification_preference.py` (23 satır)
- Önerilen sahip bağlam: 12-bildirim-iletisim

## Epic

- Epic adı: Platform Notification Preference: 12-bildirim-iletisim bağlamına taşıma
- Öncelik: Acil
- Faz: Faz 4
- Tahmini büyüklük: Orta

### User story

Bir alıcı olarak, bildirim tercihlerimi taşımak istiyorum.
Böylece kapattığım kanallar kapalı kalır.

### Kabul kriterleri

- [ ] Eski e-posta kapatma tercihi aktarımda açılmaz.
- [ ] Sözleşme testi `notifications/api.py::get_notification_preferences` çağrısının mevcut davranışı koruduğunu gösterir.
- [ ] Alıcı ve satıcı yetenekleri kimlik API’sinden okunur.
- [ ] Characterization test: `Platform Notification Preference` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- Kullanıcı profilini doğrudan sorgulamayın. Alanları kimlik paketi yönetir.
- Eski kapatma tercihini varsayılanla ezmeyin. Kullanıcının seçimi korunmalıdır.
- Dış bağlamdan `notifications` iç dosyalarını çağırmayın. Geçişte `get_notification_preferences` sözleşmesini kullanın.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] `Platform Notification Preference` için kabul koşullarını otomatik testte doğrulayın.
- [ ] `notifications` iç dosyalarına dış erişimleri `import-linter` ile kontrol edin.
- [ ] `CODEOWNERS` üzerinden `notifications` paketinin sahibinden inceleme isteyin.
- [ ] `tradehub_core/notifications/preferences.py:34` bağımlılığının geçiş sonrası çağrı yolunu inceleyin.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?
Kullanıcının bildirim tercihlerini tutar. `tradehub_core/tradehub_core/doctype/platform_notification_preference/platform_notification_preference.json:83`
Denetleyici tercih servisinin izin verdiği yazım yolunu denetler. `tradehub_core/tradehub_core/doctype/platform_notification_preference/platform_notification_preference.py:15`

## Bugünkü bağımlılıklar
### Bu kaydın bağlandığı kayıtlar
- `User` (`user`): başka bağlam (`01-kimlik-erisim`). `tradehub_core/tradehub_core/doctype/platform_notification_preference/platform_notification_preference.json:19`
### Bu kayda dokunan kod
- `tradehub_core/notifications/preferences.py:334`: yazıyor
- `tradehub_core/notifications/purge.py:24`: siliyor
- `tradehub_core/tests/test_notification_backend.py:68`: siliyor
### hooks.py kayıtları
- `tradehub_core/hooks.py:1485` İlgili kayıt dışı tetikleyici. `scheduler_events["hourly"].append("tradehub_core.notifications.jobs.run_digests")`

## Bağımlılık sorunları
1. Bildirim tercihi kullanıcı profilinin yetenek alanlarını doğrudan okuyor. Kimlik şeması değişirse tercih çözümü etkilenebilir. `tradehub_core/notifications/preferences.py:34`

## Hedef tasarım
- `12-bildirim-iletisim` bu kayda `tradehub_core/notifications/` paketinde sahip olsun.
- Dışarıya açılacak fonksiyonlar. `tradehub_core/notifications/api.py::get_notification_preferences` `tradehub_core/notifications/api.py::save_notification_preferences`
- Olaylar. Bu kayıt için ayrıca bağlamlar arası olay önerilmiyor.
- Bağlantılar. `user` sabit `User` kimliğine bağlansın.
- Doğrulama ve iş akışı. Kanal kararını tercih servisi versin. Eski tercih aktarımı ve yeni yazım aynı kullanıcıyı esas alsın.

## Geçiş adımları
1. Mevcut davranış için aşağıdaki testi ekle. `get_notification_preferences` sözleşmesini mevcut uygulama üzerinden geçir.
2. İlk adımdan sonra alıcı ve satıcı yeteneklerini kimlik API’sinden al.
3. İkinci adımdan sonra modül kaydını taşı. Eski Python girişlerini geçiş süresince yönlendir.

## Riskler ve testler
- Eski e-posta kapatma tercihi aktarımda açılmaz.
