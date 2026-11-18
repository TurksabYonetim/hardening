# Seller Sub User Invite

- Bağlam: 02-satici-magaza
- Tür: Ana kayıt
- Klasör: `tradehub_core/tradehub_core/doctype/seller_sub_user_invite`
- Denetleyici: `tradehub_core/tradehub_core/doctype/seller_sub_user_invite/seller_sub_user_invite.py` (40 satır)
- Önerilen sahip bağlam: 02-satici-magaza. Alıcı tarafındaki eşi `Buyer Sub User Invite` 01-kimlik-erisim bağlamında. İkisi aynı ekip yönetimi kodunu paylaşabilir.

## Epic

- Epic adı: Seller Sub User Invite: 02-satici-magaza bağlamına taşıma
- Öncelik: Önemli
- Faz: Faz 4
- Tahmini büyüklük: Orta

### User story

Bir satıcı olarak, ekibime davet ettiğim kişinin yalnız benim mağazama bağlanmasını istiyorum.
Böylece yanlış mağazaya erişim olmaz.

### Kabul kriterleri

- [ ] Kullanıcı oluşturma `identity.api.create_member_user` ile yapılıyor.
- [ ] `permissions.py` içinde mağaza filtresi var. `hooks.py` kayıtları eklendi.
- [ ] Mağaza silinince bekleyen davetler olayla iptal ediliyor.
- [ ] `test_p5_team_integration.py` ve `test_store_cleanup.py` geçiyor.
- [ ] Characterization test: `Seller Sub User Invite` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- `seller_users.py` içinden `User` kaydını doğrudan değiştirmeyin. Kimlik API'sini kullanın.
- Daveti silmeyin. Silme yasağı denetleyicide kalmalı.
- Alıcı ve satıcı davet kurallarını ayrı ayrı yeniden yazmayın.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] Değişen davranış için önce başarısız olan test yazıldı.
- [ ] Ruff ve ilgili testler yerelde geçiyor.
- [ ] `import-linter` kontrolü yeni ihlal üretmiyor.
- [ ] `CODEOWNERS` içindeki 02-satici-magaza sahibi inceleyici olarak eklendi.
- [ ] Kimlik bağlamı (01) sahibi inceleyici olarak eklendi.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?
Bu kayıt mağazaya yeni ekip üyesi davetidir. Davet e-posta, mağaza ve rol profili tutar. Davet kabul edilince yeni kullanıcı oluşur ve mağazaya bağlanır.

## Bugünkü bağımlılıklar
### Bu kaydın bağlandığı kayıtlar
- `Admin Seller Profile` (`tenant`): aynı bağlam
- `Role Profile` (`role_profile`): Frappe çekirdeği
- `User` (`invited_by`, `created_user`): Frappe çekirdeği
### Bu kayda dokunan kod
- `tradehub_core/api/v1/seller_users.py:236`, `:247`: daveti oluşturuyor
- `tradehub_core/api/v1/seller_users.py:425`, `:458`: daveti güncelliyor
- `tradehub_core/api/v1/seller_users.py:213`, `:313`, `:356`: `User.tradehub_tenant` alanını okuyor
- `tradehub_core/api/v1/seller_users.py:329`, `:367`: `User` kaydını açıp değiştiriyor
- `tradehub_core/services/store_cleanup.py:29`: mağaza silinince davetleri siliyor
### hooks.py kayıtları
- Kayıt yok. Satır düzeyi izin kuralı da yok.

## Bağımlılık sorunları
1. Mağaza API'si `User` kaydını doğrudan yönetiyor. Kanıt: `seller_users.py:329`, `:367`. Kimlik bağlamının kuralları burada tekrar yazılmış.
2. Satır düzeyi izin yok. Mağaza filtresi yalnız API kodunda (`seller_users.py:61`).
3. Alıcı ve satıcı davet kodu ayrı. Kanıt: `api/v1/buyer_team.py` ve `api/v1/seller_users.py`. Aynı hata iki yerde düzeltilmek zorunda.

## Hedef tasarım
- Sahip bağlam: 02-satici-magaza. Paket yolu: `tradehub_core/seller/team/`.
- Dışa açık fonksiyonlar: `invite_store_member(store, email, role_profile)`, `accept_store_invite(token)`, `revoke_store_invite(name)`.
- Kullanıcı oluşturma kimlik bağlamında yapılır: `identity.api.create_member_user(email, full_name, role_profile, tenant)`.
- Yayınladığı olay: `seller.member.joined` (alan: `store`, `user`, `role_profile`).
- Dinlediği olay: `seller.store.deleted`. Bekleyen davetleri iptal eder.
- Denetleyicide e-posta biçimi ve silme yasağı kalır.

## Geçiş adımları
1. `identity.api.create_member_user` fonksiyonunu ekleyin. İki davet akışı bunu kullansın.
2. `permissions.py` içine mağaza filtresi ekleyin. `hooks.py` kayıtlarını ekleyin.
3. `store_cleanup.py:29` satırını olay işleyicisine taşıyın.

## Riskler ve testler
- Davet kabulünde kullanıcı yanlış mağazaya bağlanmamalı. `tradehub_core/tests/test_p5_team_integration.py` korunmalı.
- Mağaza silme testi `tradehub_core/tests/test_store_cleanup.py` korunmalı.
