# Push Notification Settings

- Bağlam: 12-bildirim-iletisim
- Tür: Ayar (single)
- Klasör: `tradehub_core/tradehub_core/doctype/push_notification_settings`
- Denetleyici: `tradehub_core/tradehub_core/doctype/push_notification_settings/push_notification_settings.py` (5 satır)
- Önerilen sahip bağlam: 12-bildirim-iletisim

## Epic

- Epic adı: Push Notification Settings: 12-bildirim-iletisim bağlamına taşıma
- Öncelik: Önemli
- Faz: Faz 4
- Tahmini büyüklük: Küçük

### User story

Bir geliştirici olarak, tarayıcı bildirim ayarlarını güvenle sunmak istiyorum.
Böylece özel anahtar istemciye çıkmaz.

### Kabul kriterleri

- [ ] Genel ayar yanıtında özel anahtar bulunmaz.
- [ ] `import-linter` denetimi, dış bağlamın `Push Notification Settings` işleyicisini içe aktarmasını engeller.
- [ ] Geçiş testi, mevcut `Push Notification Settings` kaydının sahip paket üzerinden okunabildiğini gösterir.
- [ ] Characterization test: `Push Notification Settings` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- Ayar belgesinin tamamını istemciye döndürmeyin. Belge özel anahtar içerir.
- Özel anahtarı hata günlüğüne yazmayın. Anahtar gönderim servisinde kalmalıdır.
- `Push Notification Settings` için dış bağlama doğrudan yazma yolu açmayın. Yazım kuralları `notifications` paketinde kalır.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] `Push Notification Settings` için kabul koşullarını otomatik testte doğrulayın.
- [ ] `notifications` iç dosyalarına dış erişimleri `import-linter` ile kontrol edin.
- [ ] `CODEOWNERS` üzerinden `notifications` paketinin sahibinden inceleme isteyin.
- [ ] Mevcut bir `Push Notification Settings` kaydını eski girişten ve sahip paketten okuyup karşılaştırın.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?
Tarayıcıya gönderilen bildirimlerin genel ayarlarını tutar. `tradehub_core/tradehub_core/doctype/push_notification_settings/push_notification_settings.json:19`
Kayıt alanlarını DocType şeması tanımlar. `tradehub_core/tradehub_core/doctype/push_notification_settings/push_notification_settings.json:19`

## Bugünkü bağımlılıklar
### Bu kaydın bağlandığı kayıtlar
- Bağlantı alanı bulunmadı. `tradehub_core/tradehub_core/doctype/push_notification_settings/push_notification_settings.json:19`
### Bu kayda dokunan kod
- `tradehub_core/api/push.py:26`: okuyor
### hooks.py kayıtları
- Doğrudan ada göre kanca bulunmadı. Dolaylı kayıtlar doğrulanmadı. `tradehub_core/hooks.py:453`

## Bağımlılık sorunları
Önemli bir bağımlılık sorunu bulunmadı.

## Hedef tasarım
- `12-bildirim-iletisim` bu kayda `tradehub_core/notifications/` paketinde sahip olsun.
- Dışarıya açılacak fonksiyonlar. `tradehub_core/notifications/api.py` içinde bu kayıt için ayrı fonksiyon önerilmiyor.
- Olaylar. Bu kayıt için ayrıca bağlamlar arası olay önerilmiyor.
- Bağlantılar. Bu kayıt için yeni bağlamlar arası bağlantı veya anlık görüntü alanı önerilmiyor.
- Doğrulama ve iş akışı. İstemciye yalnız genel anahtar ver. Özel ayarları gönderim bağdaştırıcısında kullan.

## Geçiş adımları
1. Mevcut davranış için aşağıdaki testi ekle. Sahip paket için mevcut davranışı sabitle.
2. İlk adımdan sonra rapordaki doğrulamayı ve iş akışını sahip pakette topla.
3. İkinci adımdan sonra modül kaydını taşı. Eski Python girişlerini geçiş süresince yönlendir.

## Riskler ve testler
- Genel ayar yanıtında özel anahtar bulunmaz.
