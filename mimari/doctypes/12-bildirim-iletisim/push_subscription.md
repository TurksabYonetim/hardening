# Push Subscription

- Bağlam: 12-bildirim-iletisim
- Tür: Ana kayıt
- Klasör: `tradehub_core/tradehub_core/doctype/push_subscription`
- Denetleyici: `tradehub_core/tradehub_core/doctype/push_subscription/push_subscription.py` (5 satır)
- Önerilen sahip bağlam: 12-bildirim-iletisim

## Epic

- Epic adı: Push Subscription: 12-bildirim-iletisim bağlamına taşıma
- Öncelik: Acil
- Faz: Faz 4
- Tahmini büyüklük: Orta

### User story

Bir alıcı olarak, hesap kapanınca tarayıcı aboneliğimi kaldırmak istiyorum.
Böylece eski tarayıcıma bildirim gitmez.

### Kabul kriterleri

- [ ] Hesap silindikten sonra eski abonelik kullanılmaz.
- [ ] Sözleşme testi `notifications/api.py::revoke_user_push_subscriptions` çağrısının mevcut davranışı koruduğunu gösterir.
- [ ] Hesap temizliği abonelikleri iletişim API’si üzerinden iptal eder.
- [ ] Characterization test: `Push Subscription` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- Gizlilik kodundan abonelik tablosunu silmeyin. İptali iletişim servisi yönetir.
- İptal sorgusunu kullanıcı kapsamı olmadan çalıştırmayın. Başka abonelikler etkilenebilir.
- Dış bağlamdan `notifications` iç dosyalarını çağırmayın. Geçişte `revoke_user_push_subscriptions` sözleşmesini kullanın.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] `Push Subscription` için kabul koşullarını otomatik testte doğrulayın.
- [ ] `notifications` iç dosyalarına dış erişimleri `import-linter` ile kontrol edin.
- [ ] `CODEOWNERS` üzerinden `notifications` paketinin sahibinden inceleme isteyin.
- [ ] `tradehub_core/privacy/account_deletion.py:355` bağımlılığının geçiş sonrası çağrı yolunu inceleyin.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?
Bir kullanıcının tarayıcı bildirim aboneliğini tutar. `tradehub_core/tradehub_core/doctype/push_subscription/push_subscription.json:21`
Kayıt alanlarını DocType şeması tanımlar. `tradehub_core/tradehub_core/doctype/push_subscription/push_subscription.json:21`

## Bugünkü bağımlılıklar
### Bu kaydın bağlandığı kayıtlar
- `User` (`user`): başka bağlam (`01-kimlik-erisim`). `tradehub_core/tradehub_core/doctype/push_subscription/push_subscription.json:9`
### Bu kayda dokunan kod
- `tradehub_core/privacy/account_deletion.py:355`: siliyor
- `tradehub_core/api/push.py:74`: yazıyor
- `tradehub_core/notifications/push.py:30`: okuyor
### hooks.py kayıtları
- `tradehub_core/hooks.py:758`: doc_event. Yorum güncellemesi tarayıcı bildirim işleyicisini çağırıyor.
- Doğrudan ada göre kanca bulunmadı. Dolaylı kayıtlar doğrulanmadı. `tradehub_core/hooks.py:453`

## Bağımlılık sorunları
1. Gizlilik akışı tarayıcı aboneliğini doğrudan siliyor. Abonelik saklama kuralı hesap silmeyi etkileyebilir. `tradehub_core/privacy/account_deletion.py:355`

## Hedef tasarım
- `12-bildirim-iletisim` bu kayda `tradehub_core/notifications/` paketinde sahip olsun.
- Dışarıya açılacak fonksiyonlar. `tradehub_core/notifications/api.py::revoke_user_push_subscriptions`
- Olaylar. Bu kayıt için ayrıca bağlamlar arası olay önerilmiyor.
- Bağlantılar. `user` sabit `User` kimliğine bağlansın.
- Doğrulama ve iş akışı. Hesap silme servisi abonelik iptalini iletişim API’si üzerinden istesin.

## Geçiş adımları
1. Mevcut davranış için aşağıdaki testi ekle. `revoke_user_push_subscriptions` sözleşmesini mevcut uygulama üzerinden geçir.
2. İlk adımdan sonra hesap silme akışını `revoke_user_push_subscriptions` işlevine bağla.
3. İkinci adımdan sonra modül kaydını taşı. Eski Python girişlerini geçiş süresince yönlendir.

## Riskler ve testler
- Hesap silindikten sonra eski abonelik kullanılmaz.
