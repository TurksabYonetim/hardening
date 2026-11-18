# Platform Notification

- Bağlam: 12-bildirim-iletisim
- Tür: Ana kayıt
- Klasör: `tradehub_core/tradehub_core/doctype/platform_notification`
- Denetleyici: `tradehub_core/tradehub_core/doctype/platform_notification/platform_notification.py` (45 satır)
- Önerilen sahip bağlam: 12-bildirim-iletisim

## Epic

- Epic adı: Platform Notification: 12-bildirim-iletisim bağlamına taşıma
- Öncelik: Acil
- Faz: Faz 4
- Tahmini büyüklük: Büyük

### User story

Bir alıcı olarak, bildirimlerimi tek yerde görmek istiyorum.
Böylece aynı olay için iki bildirim almam.

### Kabul kriterleri

- [ ] Bir olay eski ve yeni akışta çift bildirim oluşturmaz.
- [ ] Sözleşme testi `notifications/api.py::list_inbox` çağrısının mevcut davranışı koruduğunu gösterir.
- [ ] Yalnız bildirimin alıcısı bildirimi okundu olarak işaretleyebilir.
- [ ] Aynı olay kimliği yeniden işlendiğinde ikinci sonuç kaydı oluşmaz.
- [ ] Characterization test: `Platform Notification` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- Lojistik ekranından bildirim tablosunu sorgulamayın. Ortak görünüm yetki kapsamını korur.
- Eski ve yeni üreticiyi bağımsız çalıştırmayın. Aynı olay iki bildirim oluşturabilir.
- Dış bağlamdan `notifications` iç dosyalarını çağırmayın. Geçişte `list_inbox` sözleşmesini kullanın.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] `Platform Notification` için kabul koşullarını otomatik testte doğrulayın.
- [ ] `notifications` iç dosyalarına dış erişimleri `import-linter` ile kontrol edin.
- [ ] `CODEOWNERS` üzerinden `notifications` paketinin sahibinden inceleme isteyin.
- [ ] `tradehub_core/api/v1/logistics_ops.py:1024` bağımlılığının geçiş sonrası çağrı yolunu inceleyin.
- [ ] Olay verisini ve yeniden teslimi sözleşme testiyle doğrulayın.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?
Kullanıcının uygulama içi bildirimini tutar. `tradehub_core/tradehub_core/doctype/platform_notification/platform_notification.json:130`
Denetleyici, kayıt yazılmadan önce kayıt kurallarını uygular. `tradehub_core/tradehub_core/doctype/platform_notification/platform_notification.py:6`

## Bugünkü bağımlılıklar
### Bu kaydın bağlandığı kayıtlar
- `User` (`recipient_user`): başka bağlam (`01-kimlik-erisim`). `tradehub_core/tradehub_core/doctype/platform_notification/platform_notification.json:33`
### Bu kayda dokunan kod
- `tradehub_core/notifications/dispatch.py:380`: yazıyor
- `tradehub_core/utils/notify.py:124`: yazıyor
- `tradehub_core/api/v1/logistics_ops.py:1024`: okuyor
- `tradehub_core/services/approval_workflow.py:490`: yazıyor
- `tradehub_core/bulk_import/notifications.py:63`: okuyor
- `tradehub_core/tests/test_notification_backend.py:191`: okuyor
### hooks.py kayıtları
- `tradehub_core/hooks.py:1117` Liste sorgusu yetki kancası.
- `tradehub_core/hooks.py:1240` Tekil kayıt yetki kancası.

## Bağımlılık sorunları
1. Lojistik ekranı uygulama içi bildirim tablosunu doğrudan sorguluyor. Bildirim şeması değişirse lojistik ekranı etkilenebilir. `tradehub_core/api/v1/logistics_ops.py:1024`

## Hedef tasarım
- `12-bildirim-iletisim` bu kayda `tradehub_core/notifications/` paketinde sahip olsun.
- Dışarıya açılacak fonksiyonlar. `tradehub_core/notifications/api.py::list_inbox` `tradehub_core/notifications/api.py::mark_notification_read`
- Olaylar. İletişim bağlamı şu lojistik olayını dinlesin: `logistics.exception_opened`. Veri: `event_id`, `exception_id`, `recipient_id`. `12-bildirim-iletisim` dinler. Olay, değişiklikle aynı işlemde olay kuyruğuna yazılsın. Dinleyici olay kimliğini tek kez işlesin.
- Bağlantılar. `recipient_user` sabit `User` kimliğine bağlansın.
- Doğrulama ve iş akışı. Alıcı yetkisi korunsun. Eski ve yeni üreticiler tek bildirim yazma yoluna bağlansın.

## Geçiş adımları
1. Mevcut davranış için aşağıdaki testi ekle. `list_inbox` sözleşmesini mevcut uygulama üzerinden geçir.
2. İlk adımdan sonra lojistik için eski bildirim satırlarını ortak teslim görünümüne kat.
3. İkinci adımdan sonra olay kuyruğunu yeni ve eski girişleri tekilleştirerek devreye al.
4. Üçüncü adımdan sonra modül kaydını taşı ve eski girişleri uyum katmanına bağla.

## Riskler ve testler
- Bir olay eski ve yeni akışta çift bildirim oluşturmaz.
