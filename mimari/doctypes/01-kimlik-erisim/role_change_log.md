# Role Change Log

- Bağlam: 01-kimlik-erisim
- Tür: Kayıt defteri (log)
- Klasör: `tradehub_core/tradehub_core/doctype/role_change_log`
- Denetleyici: `tradehub_core/tradehub_core/doctype/role_change_log/role_change_log.py` (27 satır)
- Önerilen sahip bağlam: 01-kimlik-erisim

## Epic

- Epic adı: Role Change Log: 01-kimlik-erisim bağlamına taşıma
- Öncelik: Önemli
- Faz: Faz 4
- Tahmini büyüklük: Küçük

### User story

Bir geliştirici olarak, rol değişikliğini tek fonksiyonla yazıp okumak istiyorum.
Böylece ödeme kodu denetim kaydını silmez.

### Kabul kriterleri

- [ ] `list_role_changes` okuma modeli var. `payments/audit.py` bu fonksiyonu kullanıyor.
- [ ] `payments/sandbox_setup.py` içinde `Role Change Log` silmesi yok.
- [ ] Üç servis rol değişikliğini tek `log_role_change` ile yazıyor.
- [ ] Characterization test: `Role Change Log` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- Bu kaydı `frappe.db.delete` ile silmeyin. Silme yasağı atlanır.
- Test kurulumunda denetim kayıtlarını temizlemeyin. Ayrı test verisi kullanın.
- Rol kaydı için yeni bir yerel yazma fonksiyonu eklemeyin.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] Değişen davranış için önce başarısız olan test yazıldı.
- [ ] Ruff ve ilgili testler yerelde geçiyor.
- [ ] `import-linter` kontrolü yeni ihlal üretmiyor.
- [ ] `CODEOWNERS` içindeki 01-kimlik-erisim sahibi inceleyici olarak eklendi.
- [ ] `tradehub_core/payments/tests/test_security.py` geçiyor.
- [ ] Ödeme bağlamı (05) sahibi inceleyici olarak eklendi.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?
Bu kayıt kullanıcı rol değişikliklerinin izidir. Önceki ve sonraki rolleri JSON olarak tutar. Geçici rol için geri alma zamanı da tutar. Kayıt silinemez.

## Bugünkü bağımlılıklar
### Bu kaydın bağlandığı kayıtlar
- `User` (`changed_by`, `target_user`): Frappe çekirdeği
- `Admin Seller Profile` (`tenant`): başka bağlam (02-satici-magaza)
### Bu kayda dokunan kod
- `tradehub_core/audit/log.py:248`: yazma noktası
- `tradehub_core/audit/tasks.py:59`, `:94`: sayıyor
- `tradehub_core/api/v1/permission_console.py:118`, `:1587`: okuyor
- `tradehub_core/payments/audit.py:180`: ödeme denetimi için okuyor
- `tradehub_core/payments/sandbox_setup.py:750`: test kullanıcılarının kayıtlarını `frappe.db.delete` ile siliyor
### hooks.py kayıtları
- `tradehub_core/hooks.py:1134`: `permission_query_conditions`
- `tradehub_core/hooks.py:1257`: `has_permission`
- `tradehub_core/hooks.py:981`: `User.on_update` olayı `audit.user_hooks.on_user_update` çağırıyor. Bu işleyici rol değişikliğini kaydeder (doğrulanmadı: işleyicinin içi okunmadı).

## Bağımlılık sorunları
1. Ödeme kodu silinemez kaydı doğrudan siliyor. Kanıt: `tradehub_core/payments/sandbox_setup.py:750`. `frappe.db.delete` denetleyicinin silme yasağını atlar.
2. Ödeme denetimi tabloyu doğrudan okuyor. Kanıt: `tradehub_core/payments/audit.py:180`. Alan adı değişirse ödeme ekranı bozulur.
3. Rol değişikliği birçok serviste ayrı ayrı yazılıyor. Kanıt: `services/owner_transfer.py:224`, `services/delegation_service.py:306`, `services/anomaly_actions.py:130`.

## Hedef tasarım
- Sahip bağlam: 01-kimlik-erisim. Paket yolu: `tradehub_core/identity/audit/`.
- Dışa açık fonksiyonlar: `log_role_change(...)`, `list_role_changes(users, since) -> list[RoleChangeRow]` (okuma modeli).
- Yayınladığı olay: `identity.role.changed` (alan: `user`, `added`, `removed`, `tenant`).
- Ödeme bağlamı okuma modelini kullanır.
- Denetleyicide silme yasağı kalır.

## Geçiş adımları
1. `list_role_changes` okuma modelini ekleyin. `payments/audit.py:180` sorgusunu buna bağlayın.
2. `sandbox_setup.py:750` silmesini kaldırın. Test verisini ayrı tutun. Bu iş 05-odeme ekibinin PR'ıdır.
3. Üç servisteki yerel yazma fonksiyonlarını tek `log_role_change` çağrısına indirin.

## Riskler ve testler
- Sandbox kurulumu eski kayıt yüzünden hata verebilir. `tradehub_core/payments/tests/test_security.py` testlerini çalıştırın.
