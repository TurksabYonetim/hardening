# TH Module Policy

- Bağlam: 01-kimlik-erisim
- Tür: Ana kayıt (görünürlük kuralı)
- Klasör: `tradehub_core/tradehub_core/doctype/th_module_policy`
- Denetleyici: `tradehub_core/tradehub_core/doctype/th_module_policy/th_module_policy.py` (44 satır)
- Önerilen sahip bağlam: 01-kimlik-erisim

## Epic

- Epic adı: TH Module Policy: 01-kimlik-erisim bağlamına taşıma
- Öncelik: Düşük
- Faz: Faz 4
- Tahmini büyüklük: Küçük

### User story

Bir platform yöneticisi olarak, menü görünürlük kuralının hemen uygulanmasını istiyorum.
Böylece eski menü görünmez.

### Kabul kriterleri

- [ ] `register_module_policies` fonksiyonu var.
- [ ] Rol profili silmede önbellek açıkça temizleniyor.
- [ ] Rol profiline göre menü testi geçiyor.
- [ ] Characterization test: `TH Module Policy` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- Bu kaydı `frappe.db.delete` ile silmeyin.
- Başka bağlamın menü patch'inde bu tabloya doğrudan yazmayın.
- Tarih aralığı kontrolünü kaldırmayın.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] Değişen davranış için önce başarısız olan test yazıldı.
- [ ] Ruff ve ilgili testler yerelde geçiyor.
- [ ] `import-linter` kontrolü yeni ihlal üretmiyor.
- [ ] `CODEOWNERS` içindeki 01-kimlik-erisim sahibi inceleyici olarak eklendi.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?
Bu kayıt bir menü modülünün bir rol profilinde nasıl görüneceğini söyler. Değerler `visible`, `masked` ya da `hidden` olur. Kuralın başlangıç ve bitiş tarihi olabilir.

## Bugünkü bağımlılıklar
### Bu kaydın bağlandığı kayıtlar
- `TH Module Registry` (`module`): aynı bağlam
- `Role Profile` (`role_profile`): Frappe çekirdeği
### Bu kayda dokunan kod
- `tradehub_core/api/v1/permission_console.py:474`: oluşturuyor
- `tradehub_core/api/v1/permission_console.py:631`: rol profili silinince `frappe.db.delete` ile siliyor
- `tradehub_core/api/v1/permission_console.py:1973`, `:1977`: okuyor ve siliyor
- Menü patch'leri kural ekliyor: `tradehub_core/patches/v15_9_97_seed_seller_terms_nav.py`, `tradehub_core/patches/v15_9_98_seller_payment_settings.py`
### hooks.py kayıtları
- `tradehub_core/hooks.py:1006-1009`: `after_insert`, `on_update`, `after_delete` olayları `permission_resolver.on_module_policy_change` çağırıyor

## Bağımlılık sorunları
1. `frappe.db.delete` önbellek kancasını atlıyor. Kanıt: `permission_console.py:631`.
2. Önbellek iki yerde temizleniyor. Kanıt: `th_module_policy.py:11-17` ve `hooks.py:1006`.
3. Her bağlam menü kuralını kendi patch'inde yazıyor. Kanıt: yukarıdaki patch listesi.

## Hedef tasarım
- Sahip bağlam: 01-kimlik-erisim. Paket yolu: `tradehub_core/identity/navigation/`.
- Dışa açık fonksiyonlar: `set_module_policy(module, role_profile, mode)`, `register_module_policies(specs)`.
- Yayınladığı olay: `identity.navigation.changed`.
- Denetleyicide tek çift ve tarih aralığı kuralı kalır.

## Geçiş adımları
1. `register_module_policies` fonksiyonunu ekleyin. Yeni menü patch'leri bunu kullansın.
2. Rol profili silmede önbelleği açıkça temizleyin.
3. Denetleyicideki yinelenen önbellek temizliğini kaldırın.

## Riskler ve testler
- Yanlış kural menüyü gizler. Rol profiline göre menü testi ekleyin.
