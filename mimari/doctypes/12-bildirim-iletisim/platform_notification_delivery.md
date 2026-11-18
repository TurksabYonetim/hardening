# Platform Notification Delivery

- Bağlam: 12-bildirim-iletisim
- Tür: Kayıt defteri (log)
- Klasör: `tradehub_core/tradehub_core/doctype/platform_notification_delivery`
- Denetleyici: `tradehub_core/tradehub_core/doctype/platform_notification_delivery/platform_notification_delivery.py` (23 satır)
- Önerilen sahip bağlam: 12-bildirim-iletisim

## Epic

- Epic adı: Platform Notification Delivery: 12-bildirim-iletisim bağlamına taşıma
- Öncelik: Acil
- Faz: Faz 4
- Tahmini büyüklük: Büyük

### User story

Bir geliştirici olarak, teslim durumunu tek görünümden okumak istiyorum.
Böylece lojistik ekranı bildirim şemasına bağımlı kalmaz.

### Kabul kriterleri

- [ ] Lojistik ekranı eski ve yeni teslimleri çakıştırmadan gösterir.
- [ ] Sözleşme testi `notifications/api.py::list_delivery_status` çağrısının mevcut davranışı koruduğunu gösterir.
- [ ] İstisna adı ve tekrar anahtarıyla gelen teslimler doğru kayda bağlanır.
- [ ] Aynı olay kimliği yeniden işlendiğinde ikinci sonuç kaydı oluşmaz.
- [ ] Characterization test: `Platform Notification Delivery` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- Lojistik kodunda teslim tablosunu birleştirmeyin. Eşleşmeyi iletişim görünümü sağlar.
- Yeniden gelen olayı ikinci kez teslim etmeyin. Olay kimliğini kanal bazında kontrol edin.
- Dış bağlamdan `notifications` iç dosyalarını çağırmayın. Geçişte `list_delivery_status` sözleşmesini kullanın.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] `Platform Notification Delivery` için kabul koşullarını otomatik testte doğrulayın.
- [ ] `notifications` iç dosyalarına dış erişimleri `import-linter` ile kontrol edin.
- [ ] `CODEOWNERS` üzerinden `notifications` paketinin sahibinden inceleme isteyin.
- [ ] `tradehub_core/api/v1/logistics_ops.py:1081` bağımlılığının geçiş sonrası çağrı yolunu inceleyin.
- [ ] Olay verisini ve yeniden teslimi sözleşme testiyle doğrulayın.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?
Bildirim kanalına yapılan teslim girişiminin kaydını tutar. `tradehub_core/tradehub_core/doctype/platform_notification_delivery/platform_notification_delivery.json:149`
Denetleyici bildirim servisinin dışında yazılmasını engeller. `tradehub_core/tradehub_core/doctype/platform_notification_delivery/platform_notification_delivery.py:15`

## Bugünkü bağımlılıklar
### Bu kaydın bağlandığı kayıtlar
- `Platform Notification Event` (`event`): aynı bağlam. `tradehub_core/tradehub_core/doctype/platform_notification_delivery/platform_notification_delivery.json:35`
- `User` (`user`): başka bağlam (`01-kimlik-erisim`). `tradehub_core/tradehub_core/doctype/platform_notification_delivery/platform_notification_delivery.json:44`
### Bu kayda dokunan kod
- `tradehub_core/api/v1/logistics_ops.py:1081`: okuyor
- `tradehub_core/tests/test_notification_backend.py:179`: okuyor
### hooks.py kayıtları
- `tradehub_core/hooks.py:1478` İlgili kayıt dışı tetikleyici. `scheduler_events["cron"].setdefault("*/5 * * * *", []).append("tradehub_core.notifications.dispatch.sweep")`
- `tradehub_core/hooks.py:1489` İlgili kayıt dışı tetikleyici. `scheduler_events["daily"].append("tradehub_core.notifications.purge.cleanup_deliveries")`

## Bağımlılık sorunları
1. Lojistik ekranı teslim kaydını istisna tablosuna bağlıyor. Eşleştirme değişirse teslim görünümü bozulabilir. `tradehub_core/api/v1/logistics_ops.py:1081`

## Hedef tasarım
- `12-bildirim-iletisim` bu kayda `tradehub_core/notifications/` paketinde sahip olsun.
- Dışarıya açılacak fonksiyonlar. `tradehub_core/notifications/api.py::list_delivery_status`
- Olaylar. İletişim bağlamı şu lojistik olayını dinlesin: `logistics.sla_breached`. Veri: `event_id`, `exception_key`, `recipient_id`. `12-bildirim-iletisim` dinler. Olay, değişiklikle aynı işlemde olay kuyruğuna yazılsın. Dinleyici olay kimliğini tek kez işlesin.
- Bağlantılar. `user` sabit `User` kimliğine bağlansın. Lojistik okuma modeli olay kimliğini ve teslim durumunu taşısın.
- Doğrulama ve iş akışı. Teslim durumunu bildirim servisi yazsın. Lojistik için yetki kapsamlı durum görünümü sağlasın.

## Geçiş adımları
1. Mevcut davranış için aşağıdaki testi ekle. `list_delivery_status` sözleşmesini mevcut uygulama üzerinden geçir.
2. İlk adımdan sonra lojistik ekranını `list_delivery_status` görünümüne geçir.
3. İkinci adımdan sonra olay kuyruğunu yeni ve eski girişleri tekilleştirerek devreye al.
4. Üçüncü adımdan sonra modül kaydını taşı ve eski girişleri uyum katmanına bağla.

## Riskler ve testler
- Lojistik ekranı eski ve yeni teslimleri çakıştırmadan gösterir.
