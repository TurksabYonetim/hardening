# Owner Transfer Request

- Bağlam: 01-kimlik-erisim
- Tür: Ana kayıt (iş akışı)
- Klasör: `tradehub_core/tradehub_core/doctype/owner_transfer_request`
- Denetleyici: `tradehub_core/tradehub_core/doctype/owner_transfer_request/owner_transfer_request.py` (8 satır)
- Önerilen sahip bağlam: 02-satici-magaza. Talep mağaza sahipliğini değiştirir. Sahiplik mağaza kaydının parçasıdır.

## Epic

- Epic adı: Owner Transfer Request: 02-satici-magaza bağlamına taşıma
- Öncelik: Acil
- Faz: Faz 4
- Tahmini büyüklük: Orta

### User story

Bir satıcı olarak, mağaza sahipliğini devrettiğimde eski sahibin erişiminin kesin kapanmasını istiyorum.
Böylece mağazam güvende kalır.

### Kabul kriterleri

- [ ] `owner_transfer.py` içinde `Admin Seller Profile` için `set_value` yok. Yazma `doc.save()` ile yapılıyor.
- [ ] Denetleyici durum geçişlerini doğruluyor. `completed` talep yeniden açılamıyor.
- [ ] Rol ve ReBAC güncellemesi `seller.store.owner_changed` olayıyla yapılıyor.
- [ ] Devir sonrası eski sahibin yetkisi kalmıyor. Test geçiyor.
- [ ] Characterization test: `Owner Transfer Request` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- `tradehub_owner` alanına sütun var mı diye bakan koda yeni iş eklemeyin. Önce alanın durumu netleşmeli.
- `User.tradehub_is_owner` alanını `set_value` ile yazmayın. Kullanıcı kancaları atlanır.
- Süper yönetici onayını atlayan bir yol eklemeyin.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] Değişen davranış için önce başarısız olan test yazıldı.
- [ ] Ruff ve ilgili testler yerelde geçiyor.
- [ ] `import-linter` kontrolü yeni ihlal üretmiyor.
- [ ] `CODEOWNERS` içindeki 02-satici-magaza sahibi inceleyici olarak eklendi.
- [ ] `tradehub_core/tests/test_delegation.py` geçiyor.
- [ ] Kimlik bağlamı (01) sahibi inceleyici olarak eklendi.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?
Bu kayıt mağaza sahipliğini başka kullanıcıya devretme talebidir. Önce mevcut sahip onaylar. Sonra süper yönetici onaylar. Onay bitince sahiplik yeni kullanıcıya geçer.

## Bugünkü bağımlılıklar
### Bu kaydın bağlandığı kayıtlar
- `Admin Seller Profile` (`tenant`): başka bağlam (02-satici-magaza)
- `User` (`current_owner`, `proposed_owner`, `super_admin_approved_by`): Frappe çekirdeği
### Bu kayda dokunan kod
- `tradehub_core/services/owner_transfer.py:60`: talebi oluşturuyor
- `tradehub_core/services/owner_transfer.py:82`, `:115`, `:152`, `:175`: durumu güncelliyor
- `tradehub_core/services/owner_transfer.py:121-122`: `User.tradehub_is_owner` alanını `set_value` ile yazıyor
- `tradehub_core/services/owner_transfer.py:124-125`: `Admin Seller Profile.tradehub_owner` alanını `set_value` ile yazıyor
- `tradehub_core/api/v1/owner_transfer.py:29`: listeliyor
### hooks.py kayıtları
- `tradehub_core/hooks.py:1131`: `permission_query_conditions`
- `tradehub_core/hooks.py:1254`: `has_permission`

## Bağımlılık sorunları
1. Servis mağaza kaydını `set_value` ile yazıyor. Kanıt: `tradehub_core/services/owner_transfer.py:125`. Mağazanın `on_update` kancaları çalışmaz. ReBAC (ilişki tabanlı yetki) eşlemesi `hooks.py:807` bu yüzden güncellenmeyebilir.
2. Yazılan `tradehub_owner` alanı DocType JSON içinde yok. Kod önce sütun var mı diye bakıyor (`owner_transfer.py:124`). Alanın özel alan olarak eklenip eklenmediği doğrulanmadı.
3. Kullanıcı bayrağı doğrudan yazılıyor. Kanıt: `owner_transfer.py:121`. `User` kancaları atlanır.

## Hedef tasarım
- Sahip bağlam: 02-satici-magaza. Paket yolu: `tradehub_core/seller/ownership/`.
- Dışa açık fonksiyonlar (`tradehub_core/seller/api.py`): `request_owner_transfer(store, proposed_owner, reason)`, `confirm_owner_transfer(name)`, `approve_owner_transfer(name)`.
- Yayınladığı olay: `seller.store.owner_changed` (alan: `store`, `old_owner`, `new_owner`).
- Kimlik bağlamı bu olayı dinler. Rolleri ve ReBAC eşlemesini günceller.
- `tenant` Link alanı kalır.
- Denetleyicide durum geçiş kuralı olmalı. Örneğin `completed` talep yeniden açılamaz.

## Geçiş adımları
1. Denetleyiciye durum geçiş doğrulaması ekleyin.
2. `owner_transfer.py:125` satırında `set_value` yerine `doc.save()` kullanın. Böylece mağaza kancaları çalışır.
3. `tradehub_owner` alanının durumunu netleştirin. Alan yoksa kodu kaldırın.
4. Servisi `tradehub_core/seller/ownership/` altına taşıyın. JSON `module` alanını satıcı modülüne çevirin.
5. Rol güncellemesini `seller.store.owner_changed` olayına bağlayın. Bu adım olay altyapısından sonra gelir.

## Riskler ve testler
- Devirden sonra eski sahip erişimini korursa güvenlik açığı oluşur. Devir sonrası yetki testi ekleyin.
- `tradehub_core/tests/test_delegation.py` testleri korunmalı.
