# User Email Preference

- Bağlam: 12-bildirim-iletisim
- Tür: Ana kayıt
- Klasör: `tradehub_core/tradehub_core/doctype/user_email_preference`
- Denetleyici: `tradehub_core/tradehub_core/doctype/user_email_preference/user_email_preference.py` (14 satır)
- Önerilen sahip bağlam: 12-bildirim-iletisim

## Epic

- Epic adı: User Email Preference: 12-bildirim-iletisim bağlamına taşıma
- Öncelik: Önemli
- Faz: Faz 4
- Tahmini büyüklük: Orta

### User story

Bir alıcı olarak, e-posta tercihlerimi dışa aktarmak istiyorum.
Böylece kayıtlı seçimlerimi görebilirim.

### Kabul kriterleri

- [ ] Dışa aktarım yalnız istek sahibinin tercihlerini içerir.
- [ ] Sözleşme testi `notifications/api.py::export_email_preferences` çağrısının mevcut davranışı koruduğunu gösterir.
- [ ] Gizlilik dışa aktarımı tercih verisini iletişim API’sinden alır.
- [ ] Characterization test: `User Email Preference` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- Dışa aktarım alanlarını gizlilik kodunda tekrar tanımlamayın. Tercih şeması değişebilir.
- Dışa aktarım sırasında varsayılan tercih yazmayın. Okuma işlemi seçimi değiştirmemelidir.
- Dış bağlamdan `notifications` iç dosyalarını çağırmayın. Geçişte `export_email_preferences` sözleşmesini kullanın.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] `User Email Preference` için kabul koşullarını otomatik testte doğrulayın.
- [ ] `notifications` iç dosyalarına dış erişimleri `import-linter` ile kontrol edin.
- [ ] `CODEOWNERS` üzerinden `notifications` paketinin sahibinden inceleme isteyin.
- [ ] `tradehub_core/privacy/data_export.py:204` bağımlılığının geçiş sonrası çağrı yolunu inceleyin.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?
Kullanıcının e-posta tercihlerini saklar. `tradehub_core/tradehub_core/doctype/user_email_preference/user_email_preference.json:32`
Denetleyici, kayıt yazılmadan önce kayıt kurallarını uygular. `tradehub_core/tradehub_core/doctype/user_email_preference/user_email_preference.py:7`

## Bugünkü bağımlılıklar
### Bu kaydın bağlandığı kayıtlar
- `User` (`user`): başka bağlam (`01-kimlik-erisim`). `tradehub_core/tradehub_core/doctype/user_email_preference/user_email_preference.json:13`
### Bu kayda dokunan kod
- `tradehub_core/notifications/preferences.py:95`: okuyor
- `tradehub_core/privacy/data_export.py:204`: dışa aktarım alanlarını tanımlıyor
- `tradehub_core/api/v1/email_preferences.py:103`: okuyor
### hooks.py kayıtları
- Doğrudan ada göre kanca bulunmadı. Dolaylı kayıtlar doğrulanmadı. `tradehub_core/hooks.py:453`

## Bağımlılık sorunları
1. Gizlilik dışa aktarımı tercih tablosunun alanlarına bağlı. Tercih şeması değişirse dışa aktarım etkilenebilir. `tradehub_core/privacy/data_export.py:204`

## Hedef tasarım
- `12-bildirim-iletisim` bu kayda `tradehub_core/notifications/` paketinde sahip olsun.
- Dışarıya açılacak fonksiyonlar. `tradehub_core/notifications/api.py::export_email_preferences`
- Olaylar. Bu kayıt için ayrıca bağlamlar arası olay önerilmiyor.
- Bağlantılar. `user` sabit `User` kimliğine bağlansın.
- Doğrulama ve iş akışı. Eski tercih biçimini tercih servisi üzerinden oku. Gizlilik dışa aktarımı aynı görünümü kullansın.

## Geçiş adımları
1. Mevcut davranış için aşağıdaki testi ekle. `export_email_preferences` sözleşmesini mevcut uygulama üzerinden geçir.
2. İlk adımdan sonra gizlilik dışa aktarımını `export_email_preferences` işlevine geçir.
3. İkinci adımdan sonra modül kaydını taşı. Eski Python girişlerini geçiş süresince yönlendir.

## Riskler ve testler
- Dışa aktarım yalnız istek sahibinin tercihlerini içerir.
