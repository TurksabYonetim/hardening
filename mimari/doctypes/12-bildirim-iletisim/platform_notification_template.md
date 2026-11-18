# Platform Notification Template

- Bağlam: 12-bildirim-iletisim
- Tür: Ana kayıt
- Klasör: `tradehub_core/tradehub_core/doctype/platform_notification_template`
- Denetleyici: `tradehub_core/tradehub_core/doctype/platform_notification_template/platform_notification_template.py` (23 satır)
- Önerilen sahip bağlam: 12-bildirim-iletisim

## Epic

- Epic adı: Platform Notification Template: 12-bildirim-iletisim bağlamına taşıma
- Öncelik: Önemli
- Faz: Faz 4
- Tahmini büyüklük: Orta

### User story

Bir platform yöneticisi olarak, bildirim taslağını hazırlamak istiyorum.
Böylece taslak onaysız yayına çıkmaz.

### Kabul kriterleri

- [ ] Taslak düzenlemesi kullanıcıya giden metni değiştirmez.
- [ ] `import-linter` denetimi, dış bağlamın `Platform Notification Template` işleyicisini içe aktarmasını engeller.
- [ ] Geçiş testi, mevcut `Platform Notification Template` kaydının sahip paket üzerinden okunabildiğini gösterir.
- [ ] Characterization test: `Platform Notification Template` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- Taslakta etkin sürüm alanını yazmayın. Gönderim önceki metni kullanmalıdır.
- Şablon alanlarını dış bağlamdan değiştirmeyin. Revizyon denetimi bildirim servisindedir.
- `Platform Notification Template` için dış bağlama doğrudan yazma yolu açmayın. Yazım kuralları `notifications` paketinde kalır.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] `Platform Notification Template` için kabul koşullarını otomatik testte doğrulayın.
- [ ] `notifications` iç dosyalarına dış erişimleri `import-linter` ile kontrol edin.
- [ ] `CODEOWNERS` üzerinden `notifications` paketinin sahibinden inceleme isteyin.
- [ ] Mevcut bir `Platform Notification Template` kaydını eski girişten ve sahip paketten okuyup karşılaştırın.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?
Olay için düzenlenen bildirim şablonunu ve yayınlanan sürümü tutar. `tradehub_core/tradehub_core/doctype/platform_notification_template/platform_notification_template.json:92`
Denetleyici bildirim servisinin dışında yazılmasını engeller. `tradehub_core/tradehub_core/doctype/platform_notification_template/platform_notification_template.py:15`

## Bugünkü bağımlılıklar
### Bu kaydın bağlandığı kayıtlar
- `Platform Notification Event` (`event`): aynı bağlam. `tradehub_core/tradehub_core/doctype/platform_notification_template/platform_notification_template.json:21`
- `Platform Notification Version` (`published_version`): aynı bağlam. `tradehub_core/tradehub_core/doctype/platform_notification_template/platform_notification_template.json:41`
- `User` (`saved_by`): başka bağlam (`01-kimlik-erisim`). `tradehub_core/tradehub_core/doctype/platform_notification_template/platform_notification_template.json:53`
- `User` (`review_requested_by`): başka bağlam (`01-kimlik-erisim`). `tradehub_core/tradehub_core/doctype/platform_notification_template/platform_notification_template.json:76`
### Bu kayda dokunan kod
- `tradehub_core/notifications/store.py:173`: yazıyor
### hooks.py kayıtları
- `tradehub_core/hooks.py:1476` İlgili kayıt dışı tetikleyici. `after_migrate.append("tradehub_core.notifications.seed.run")`

## Bağımlılık sorunları
Önemli bir bağımlılık sorunu bulunmadı.

## Hedef tasarım
- `12-bildirim-iletisim` bu kayda `tradehub_core/notifications/` paketinde sahip olsun.
- Dışarıya açılacak fonksiyonlar. `tradehub_core/notifications/api.py` içinde bu kayıt için ayrı fonksiyon önerilmiyor.
- Olaylar. Bu kayıt için ayrıca bağlamlar arası olay önerilmiyor.
- Bağlantılar. `saved_by` sabit `User` kimliğine bağlansın. `review_requested_by` sabit `User` kimliğine bağlansın.
- Doğrulama ve iş akışı. Taslak ve yayın ayrımını koru. Yayın geçişini servis tek işlemde yapsın.

## Geçiş adımları
1. Mevcut davranış için aşağıdaki testi ekle. Sahip paket için mevcut davranışı sabitle.
2. İlk adımdan sonra rapordaki doğrulamayı ve iş akışını sahip pakette topla.
3. İkinci adımdan sonra modül kaydını taşı. Eski Python girişlerini geçiş süresince yönlendir.

## Riskler ve testler
- Taslak düzenlemesi kullanıcıya giden metni değiştirmez.
