# Platform Notification Event

- Bağlam: 12-bildirim-iletisim
- Tür: Ana kayıt
- Klasör: `tradehub_core/tradehub_core/doctype/platform_notification_event`
- Denetleyici: `tradehub_core/tradehub_core/doctype/platform_notification_event/platform_notification_event.py` (23 satır)
- Önerilen sahip bağlam: 12-bildirim-iletisim

## Epic

- Epic adı: Platform Notification Event: 12-bildirim-iletisim bağlamına taşıma
- Öncelik: Önemli
- Faz: Faz 4
- Tahmini büyüklük: Orta

### User story

Bir geliştirici olarak, bildirim olay tanımını düzenlemek istiyorum.
Böylece eşzamanlı değişiklikler kaybolmaz.

### Kabul kriterleri

- [ ] Aynı anahtarın eşzamanlı düzenlemesi eski revizyonla üzerine yazamaz.
- [ ] `import-linter` denetimi, dış bağlamın `Platform Notification Event` işleyicisini içe aktarmasını engeller.
- [ ] Geçiş testi, mevcut `Platform Notification Event` kaydının sahip paket üzerinden okunabildiğini gösterir.
- [ ] Characterization test: `Platform Notification Event` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- Olay tanımını iş olayı kuyruğu olarak kullanmayın. Tanım bir bildirim türünü belirtir.
- Revizyon denetimini atlamayın. Önceki değişiklik silinebilir.
- `Platform Notification Event` için dış bağlama doğrudan yazma yolu açmayın. Yazım kuralları `notifications` paketinde kalır.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] `Platform Notification Event` için kabul koşullarını otomatik testte doğrulayın.
- [ ] `notifications` iç dosyalarına dış erişimleri `import-linter` ile kontrol edin.
- [ ] `CODEOWNERS` üzerinden `notifications` paketinin sahibinden inceleme isteyin.
- [ ] Mevcut bir `Platform Notification Event` kaydını eski girişten ve sahip paketten okuyup karşılaştırın.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?
Bildirim motorunda tanımlı olayları tutar. `tradehub_core/tradehub_core/doctype/platform_notification_event/platform_notification_event.json:89`
Denetleyici bildirim servisinin dışında yazılmasını engeller. `tradehub_core/tradehub_core/doctype/platform_notification_event/platform_notification_event.py:15`

## Bugünkü bağımlılıklar
### Bu kaydın bağlandığı kayıtlar
- Bağlantı alanı bulunmadı. `tradehub_core/tradehub_core/doctype/platform_notification_event/platform_notification_event.json:89`
### Bu kayda dokunan kod
- `tradehub_core/notifications/store.py:178`: yazıyor
### hooks.py kayıtları
- `tradehub_core/hooks.py:1476` İlgili kayıt dışı tetikleyici. `after_migrate.append("tradehub_core.notifications.seed.run")`
- `tradehub_core/hooks.py:1478` İlgili kayıt dışı tetikleyici. `scheduler_events["cron"].setdefault("*/5 * * * *", []).append("tradehub_core.notifications.dispatch.sweep")`

## Bağımlılık sorunları
Önemli bir bağımlılık sorunu bulunmadı.

## Hedef tasarım
- `12-bildirim-iletisim` bu kayda `tradehub_core/notifications/` paketinde sahip olsun.
- Dışarıya açılacak fonksiyonlar. `tradehub_core/notifications/api.py` içinde bu kayıt için ayrı fonksiyon önerilmiyor.
- Olaylar. Bu kayıt için ayrıca bağlamlar arası olay önerilmiyor.
- Bağlantılar. Bu kayıt için yeni bağlamlar arası bağlantı veya anlık görüntü alanı önerilmiyor.
- Doğrulama ve iş akışı. Olay anahtarını ve revizyonu bildirim servisi yönetsin. İş olayının yayın kaydı ayrı tutulsun.

## Geçiş adımları
1. Mevcut davranış için aşağıdaki testi ekle. Sahip paket için mevcut davranışı sabitle.
2. İlk adımdan sonra rapordaki doğrulamayı ve iş akışını sahip pakette topla.
3. İkinci adımdan sonra modül kaydını taşı. Eski Python girişlerini geçiş süresince yönlendir.

## Riskler ve testler
- Aynı anahtarın eşzamanlı düzenlemesi eski revizyonla üzerine yazamaz.
