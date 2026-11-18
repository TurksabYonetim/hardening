# Platform Notification Settings

- Bağlam: 12-bildirim-iletisim
- Tür: Ayar (single)
- Klasör: `tradehub_core/tradehub_core/doctype/platform_notification_settings`
- Denetleyici: `tradehub_core/tradehub_core/doctype/platform_notification_settings/platform_notification_settings.py` (27 satır)
- Önerilen sahip bağlam: 12-bildirim-iletisim

## Epic

- Epic adı: Platform Notification Settings: 12-bildirim-iletisim bağlamına taşıma
- Öncelik: Önemli
- Faz: Faz 4
- Tahmini büyüklük: Orta

### User story

Bir platform yöneticisi olarak, gönderim varsayılanlarını tek yerden yönetmek istiyorum.
Böylece kapattığım hatırlatmalar gönderilmez.

### Kabul kriterleri

- [ ] Kapalı hatırlatma ayarı çalışanın gönderim yapmasını engeller.
- [ ] `import-linter` denetimi, dış bağlamın `Platform Notification Settings` işleyicisini içe aktarmasını engeller.
- [ ] Geçiş testi, mevcut `Platform Notification Settings` kaydının sahip paket üzerinden okunabildiğini gösterir.
- [ ] Characterization test: `Platform Notification Settings` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- Ayarı her göndericide ayrı yorumlamayın. Varsayılanlar farklılaşabilir.
- Ayar kapalıyken zamanlayıcıdan deneme bildirimi göndermeyin. Kullanıcı istemeden bildirim alabilir.
- `Platform Notification Settings` için dış bağlama doğrudan yazma yolu açmayın. Yazım kuralları `notifications` paketinde kalır.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] `Platform Notification Settings` için kabul koşullarını otomatik testte doğrulayın.
- [ ] `notifications` iç dosyalarına dış erişimleri `import-linter` ile kontrol edin.
- [ ] `CODEOWNERS` üzerinden `notifications` paketinin sahibinden inceleme isteyin.
- [ ] Mevcut bir `Platform Notification Settings` kaydını eski girişten ve sahip paketten okuyup karşılaştırın.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?
Bildirim motorunun genel ayarlarını tutar. `tradehub_core/tradehub_core/doctype/platform_notification_settings/platform_notification_settings.json:156`
Denetleyici, kayıt yazılmadan önce kayıt kurallarını uygular. `tradehub_core/tradehub_core/doctype/platform_notification_settings/platform_notification_settings.py:16`

## Bugünkü bağımlılıklar
### Bu kaydın bağlandığı kayıtlar
- Bağlantı alanı bulunmadı. `tradehub_core/tradehub_core/doctype/platform_notification_settings/platform_notification_settings.json:156`
### Bu kayda dokunan kod
- `tradehub_core/notifications/templates.py:518`: yazıyor
- `tradehub_core/notifications/preferences.py:137`: okuyor
### hooks.py kayıtları
- `tradehub_core/hooks.py:1487` İlgili kayıt dışı tetikleyici. `scheduler_events["hourly"].append("tradehub_core.notifications.jobs.run_order_reminders")`

## Bağımlılık sorunları
Önemli bir bağımlılık sorunu bulunmadı.

## Hedef tasarım
- `12-bildirim-iletisim` bu kayda `tradehub_core/notifications/` paketinde sahip olsun.
- Dışarıya açılacak fonksiyonlar. `tradehub_core/notifications/api.py` içinde bu kayıt için ayrı fonksiyon önerilmiyor.
- Olaylar. Bu kayıt için ayrıca bağlamlar arası olay önerilmiyor.
- Bağlantılar. Bu kayıt için yeni bağlamlar arası bağlantı veya anlık görüntü alanı önerilmiyor.
- Doğrulama ve iş akışı. Ayar doğrulaması denetleyicide kalsın. Varsayılanları tercih ve şablon servisleri tek noktadan okusun.

## Geçiş adımları
1. Mevcut davranış için aşağıdaki testi ekle. Sahip paket için mevcut davranışı sabitle.
2. İlk adımdan sonra rapordaki doğrulamayı ve iş akışını sahip pakette topla.
3. İkinci adımdan sonra modül kaydını taşı. Eski Python girişlerini geçiş süresince yönlendir.

## Riskler ve testler
- Kapalı hatırlatma ayarı çalışanın gönderim yapmasını engeller.
