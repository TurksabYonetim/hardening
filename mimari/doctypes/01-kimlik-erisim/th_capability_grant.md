# TH Capability Grant

- Bağlam: 01-kimlik-erisim
- Tür: Ana kayıt (yetki tanımı)
- Klasör: `tradehub_core/tradehub_core/doctype/th_capability_grant`
- Denetleyici: `tradehub_core/tradehub_core/doctype/th_capability_grant/th_capability_grant.py` (50 satır)
- Önerilen sahip bağlam: 01-kimlik-erisim

## Epic

- Epic adı: TH Capability Grant: 01-kimlik-erisim bağlamına taşıma
- Öncelik: Önemli
- Faz: Faz 4
- Tahmini büyüklük: Orta

### User story

Bir geliştirici olarak, yetki bağlarını tek fonksiyonla eklemek istiyorum.
Böylece önbellek her değişiklikte temizlenir.

### Kabul kriterleri

- [ ] `register_default_grants` fonksiyonu var. Yeni patch'ler bu fonksiyonu kullanıyor.
- [ ] Önbellek temizliği yalnız `hooks.py` kaydında duruyor.
- [ ] Rol profili silinince yetki kalmıyor ve önbellek temizleniyor. Test geçiyor.
- [ ] `tradehub_core/tests/test_sprint6_rbac.py` geçiyor.
- [ ] Characterization test: `TH Capability Grant` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- `TH Capability Grant` kaydını `frappe.db.delete` ile silmeyin. Önbellek bayat kalır.
- Başka bağlamın patch'inde bu tabloya doğrudan yazmayın.
- Eski seed patch'lerini değiştirmeyin. Çalışmış patch tekrar çalışmaz.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] Değişen davranış için önce başarısız olan test yazıldı.
- [ ] Ruff ve ilgili testler yerelde geçiyor.
- [ ] `import-linter` kontrolü yeni ihlal üretmiyor.
- [ ] `CODEOWNERS` içindeki 01-kimlik-erisim sahibi inceleyici olarak eklendi.
- [ ] Patch iki kez çalışınca kayıt çoğalmıyor.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?
Bu kayıt bir rol profiline bir yeteneği verir. Yetenek (capability), kullanıcının yapabileceği tek bir iştir. Örneğin "sipariş iptal etme" bir yetenektir. Kaydın bitiş zamanı olabilir.

## Bugünkü bağımlılıklar
### Bu kaydın bağlandığı kayıtlar
- `Role Profile` (`role_profile`): Frappe çekirdeği
- `TH Capability Registry` (`capability`): aynı bağlam
- `User` (`granted_by`): Frappe çekirdeği
### Bu kayda dokunan kod
- `tradehub_core/tradehub_core/doctype/th_capability_grant/th_capability_grant.py:21`: aynı çiftin tekliğini kontrol ediyor
- `tradehub_core/tradehub_core/doctype/th_capability_grant/th_capability_grant.py:44`: önbelleği temizliyor
- `tradehub_core/api/v1/permission_console.py:459`, `:1809`: oluşturuyor
- `tradehub_core/api/v1/permission_console.py:630`: rol profili silinince `frappe.db.delete` ile siliyor
- `tradehub_core/_audit_rbac.py:152`: denetim betiği okuyor
- Lojistik ve fatura patch'leri yeni yetki veriyor: `tradehub_core/patches/v15_tur103_seed_logistics_capabilities.py`, `tradehub_core/patches/v15_9_99_seller_invoice_documents.py`
### hooks.py kayıtları
- `tradehub_core/hooks.py:997-1001`: `after_insert`, `on_update`, `after_delete` olayları `permission_resolver.on_capability_grant_change` çağırıyor

## Bağımlılık sorunları
1. Önbellek iki kez temizleniyor. Kanıt: denetleyici `th_capability_grant.py:12-18` ve `hooks.py:997`. İki kod aynı işi yapıyor.
2. `frappe.db.delete` kancaları atlıyor. Kanıt: `permission_console.py:630`. Silmede önbellek temizlenmeyebilir.
3. Her bağlam kendi patch'inde yetki tablosuna yazıyor. Kanıt: yukarıdaki patch listesi. Kimlik ekibi bu yazımları göremiyor.

## Hedef tasarım
- Sahip bağlam: 01-kimlik-erisim. Paket yolu: `tradehub_core/identity/capabilities/`.
- Dışa açık fonksiyonlar:
  - `has_capability(user, capability) -> bool`
  - `grant_capability(role_profile, capability, expires_at=None)`
  - `register_default_grants(grants: list[GrantSpec])`. Başka bağlamlar patch içinde bunu çağırır.
- Yayınladığı olay: `identity.capability.changed` (alan: `role_profile`).
- Denetleyicide tek çift kuralı kalır. Önbellek temizliği tek yere iner.

## Geçiş adımları
1. Önbellek temizliğini yalnız `hooks.py` kaydında bırakın. Denetleyicideki kopyayı kaldırın.
2. `permission_console.py:630` satırında kayıtları tek tek silin. Ya da silme sonrası önbelleği açıkça temizleyin.
3. `register_default_grants` fonksiyonunu ekleyin. Yeni patch'ler bunu kullansın. Eski patch'lere dokunmayın.

## Riskler ve testler
- Önbellek bayat kalırsa kullanıcı yetkisiz iş yapabilir. `tradehub_core/tests/test_sprint6_rbac.py` önbellek testleri korunmalı.
- Rol profili silme sonrası yetki kalmadığını gösteren test ekleyin.
