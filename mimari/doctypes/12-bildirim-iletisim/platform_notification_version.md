# Platform Notification Version

- Bağlam: 12-bildirim-iletisim
- Tür: Ana kayıt
- Klasör: `tradehub_core/tradehub_core/doctype/platform_notification_version`
- Denetleyici: `tradehub_core/tradehub_core/doctype/platform_notification_version/platform_notification_version.py` (23 satır)
- Önerilen sahip bağlam: 12-bildirim-iletisim

## Epic

- Epic adı: Platform Notification Version: 12-bildirim-iletisim bağlamına taşıma
- Öncelik: Önemli
- Faz: Faz 4
- Tahmini büyüklük: Orta

### User story

Bir platform yöneticisi olarak, teslim edilen metnin sürümünü görmek istiyorum.
Böylece önceki gönderimi inceleyebilirim.

### Kabul kriterleri

- [ ] Yeni sürüm yayınlandıktan sonra önceki teslimin metni izlenebilir kalır.
- [ ] `import-linter` denetimi, dış bağlamın `Platform Notification Version` işleyicisini içe aktarmasını engeller.
- [ ] Geçiş testi, mevcut `Platform Notification Version` kaydının sahip paket üzerinden okunabildiğini gösterir.
- [ ] Characterization test: `Platform Notification Version` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- Yayınlanmış sürüm metnini değiştirmeyin. Eski teslimler bu metne dayanır.
- Etkin sürümü doğrudan tablo yazımıyla değiştirmeyin. Yayını servis yönetir.
- `Platform Notification Version` için dış bağlama doğrudan yazma yolu açmayın. Yazım kuralları `notifications` paketinde kalır.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] `Platform Notification Version` için kabul koşullarını otomatik testte doğrulayın.
- [ ] `notifications` iç dosyalarına dış erişimleri `import-linter` ile kontrol edin.
- [ ] `CODEOWNERS` üzerinden `notifications` paketinin sahibinden inceleme isteyin.
- [ ] Mevcut bir `Platform Notification Version` kaydını eski girişten ve sahip paketten okuyup karşılaştırın.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?
Bir bildirim şablonunun sürüm içeriğini tutar. `tradehub_core/tradehub_core/doctype/platform_notification_version/platform_notification_version.json:63`
Denetleyici bildirim servisinin dışında yazılmasını engeller. `tradehub_core/tradehub_core/doctype/platform_notification_version/platform_notification_version.py:15`

## Bugünkü bağımlılıklar
### Bu kaydın bağlandığı kayıtlar
- `Platform Notification Event` (`event`): aynı bağlam. `tradehub_core/tradehub_core/doctype/platform_notification_version/platform_notification_version.json:17`
- `User` (`created_by`): başka bağlam (`01-kimlik-erisim`). `tradehub_core/tradehub_core/doctype/platform_notification_version/platform_notification_version.json:48`
### Bu kayda dokunan kod
- `tradehub_core/notifications/store.py:199`: yazıyor
### hooks.py kayıtları
- Doğrudan ada göre kanca bulunmadı. Dolaylı kayıtlar doğrulanmadı. `tradehub_core/hooks.py:453`

## Bağımlılık sorunları
Önemli bir bağımlılık sorunu bulunmadı.

## Hedef tasarım
- `12-bildirim-iletisim` bu kayda `tradehub_core/notifications/` paketinde sahip olsun.
- Dışarıya açılacak fonksiyonlar. `tradehub_core/notifications/api.py` içinde bu kayıt için ayrı fonksiyon önerilmiyor.
- Olaylar. Bu kayıt için ayrıca bağlamlar arası olay önerilmiyor.
- Bağlantılar. `created_by` sabit `User` kimliğine bağlansın.
- Doğrulama ve iş akışı. Sürüm oluşturma ve etkinleştirme bildirim servisinde kalsın. Yayın metni sürüm kimliğiyle okunabilsin.

## Geçiş adımları
1. Mevcut davranış için aşağıdaki testi ekle. Sahip paket için mevcut davranışı sabitle.
2. İlk adımdan sonra rapordaki doğrulamayı ve iş akışını sahip pakette topla.
3. İkinci adımdan sonra modül kaydını taşı. Eski Python girişlerini geçiş süresince yönlendir.

## Riskler ve testler
- Yeni sürüm yayınlandıktan sonra önceki teslimin metni izlenebilir kalır.
