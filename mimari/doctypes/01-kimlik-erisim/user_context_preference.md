# User Context Preference

- Bağlam: 01-kimlik-erisim
- Tür: Ana kayıt (kullanıcı tercihi)
- Klasör: `tradehub_core/tradehub_core/doctype/user_context_preference`
- Denetleyici: `tradehub_core/tradehub_core/doctype/user_context_preference/user_context_preference.py` (45 satır)
- Önerilen sahip bağlam: 01-kimlik-erisim. Kod `tradehub_core/context/` paketinde duruyor. Bu paket dil ve para birimi bağlamını çözer. Paket 14-platform-cekirdek ile de ilişkili.

## Epic

- Epic adı: User Context Preference: 01-kimlik-erisim bağlamına taşıma
- Öncelik: Düşük
- Faz: Faz 4
- Tahmini büyüklük: Küçük

### User story

Bir alıcı olarak, dil ve para birimi tercihimin kaydedilmesini istiyorum.
Böylece her girişte yeniden seçmem.

### Kabul kriterleri

- [ ] Denetleyici `shared.auth.is_platform_admin` kullanıyor. `permissions._is_platform_full_access` çağrısı yok.
- [ ] `context/preferences.py` kodu kimlik paketinde duruyor.
- [ ] Başka kullanıcı adına tercih yazılamıyor. Test geçiyor.
- [ ] Characterization test: `User Context Preference` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- Denetleyiciden alt çizgili iç fonksiyon çağırmayın.
- Okumada `get_all` kullanmayın. Kiracı sınırı `get_list` ile korunur.
- `User.language` alanını başka yerden yazmayın.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] Değişen davranış için önce başarısız olan test yazıldı.
- [ ] Ruff ve ilgili testler yerelde geçiyor.
- [ ] `import-linter` kontrolü yeni ihlal üretmiyor.
- [ ] `CODEOWNERS` içindeki 01-kimlik-erisim sahibi inceleyici olarak eklendi.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?
Bu kayıt kullanıcının dil, para birimi ve ülke tercihidir. Kullanıcı öneriyi kabul ederse değer kaydedilir. Reddederse bir süre öneri gösterilmez.

## Bugünkü bağımlılıklar
### Bu kaydın bağlandığı kayıtlar
- `User` (`user`): Frappe çekirdeği
### Bu kayda dokunan kod
- `tradehub_core/context/preferences.py:22`: DocType adını sabit olarak tutuyor
- `tradehub_core/context/preferences.py:50`: `get_list` ile okuyor
- `tradehub_core/context/preferences.py:103`: kaydı oluşturuyor ya da güncelliyor
- `tradehub_core/context/preferences.py:137`: `User.language` alanını `set_value` ile yazıyor
- `tradehub_core/tradehub_core/doctype/user_context_preference/user_context_preference.py:37`: `permissions._is_platform_full_access` iç fonksiyonunu çağırıyor
### hooks.py kayıtları
- `tradehub_core/hooks.py:1104`: `permission_query_conditions`
- `tradehub_core/hooks.py:1228`: `has_permission`

## Bağımlılık sorunları
1. Denetleyici izin dosyasının iç fonksiyonunu çağırıyor. Kanıt: `user_context_preference.py:37`. Alt çizgili fonksiyon iç ayrıntıdır. Adı değişirse kayıt bozulur.
2. Önemli başka bir bağımlılık sorunu bulunmadı. Okuma `get_list` ile yapılıyor.

## Hedef tasarım
- Sahip bağlam: 01-kimlik-erisim. Paket yolu: `tradehub_core/identity/preferences/`. Mevcut `tradehub_core/context/` paketi buraya taşınabilir.
- Dışa açık fonksiyonlar: `read_preferences(user)`, `save_preference(user, dimension, value)`.
- Paylaşılan çekirdekte `shared.auth.is_platform_admin(user)` fonksiyonu olmalı.
- Yayınladığı olay: `identity.preference.changed` (alan: `user`, `dimension`, `value`).
- Denetleyicide kendi kaydını yazma kuralı kalır.

## Geçiş adımları
1. `shared.auth.is_platform_admin` fonksiyonunu ekleyin. Denetleyiciyi buna bağlayın.
2. `context/preferences.py` dosyasını kimlik paketine taşıyın. `api/context.py:16` içe aktarmasını güncelleyin.

## Riskler ve testler
- Başka kullanıcı adına tercih yazılmamalı. Bunun için test ekleyin.
