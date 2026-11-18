# Buyer Sub User Invite

- Bağlam: 01-kimlik-erisim
- Tür: Ana kayıt
- Klasör: `tradehub_core/tradehub_core/doctype/buyer_sub_user_invite`
- Denetleyici: `tradehub_core/tradehub_core/doctype/buyer_sub_user_invite/buyer_sub_user_invite.py` (29 satır)
- Önerilen sahip bağlam: 01-kimlik-erisim

## Epic

- Epic adı: Buyer Sub User Invite: 01-kimlik-erisim bağlamına taşıma
- Öncelik: Önemli
- Faz: Faz 4
- Tahmini büyüklük: Orta

### User story

Bir alıcı şirket yöneticisi olarak, ekip davetimin yalnız kendi kurumumda görünmesini istiyorum.
Böylece başka kurum davetimi göremez.

### Kabul kriterleri

- [ ] Davet kuralları `tradehub_core/identity/team/service.py` içinde duruyor. `buyer_team.py` yalnız servisi çağırıyor.
- [ ] `permissions.py` içinde kurum filtresi var. `hooks.py` kayıtları eklendi.
- [ ] Başka kurumun davetini görme testi başarısız dönüyor, yani erişim engelleniyor.
- [ ] Süresi dolmuş davetin kabul edilmediği test geçiyor.
- [ ] Characterization test: `Buyer Sub User Invite` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- Davet e-postasını denetleyiciden göndermeyin. E-postayı bildirim bağlamı olaydan gönderir.
- Daveti silmeyin. Silme yasağı denetleyicide kalmalı.
- Kullanıcı oluşturma kodunu API dosyasında tekrar yazmayın. `create_member_user` kullanın.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] Değişen davranış için önce başarısız olan test yazıldı.
- [ ] Ruff ve ilgili testler yerelde geçiyor.
- [ ] `import-linter` kontrolü yeni ihlal üretmiyor.
- [ ] `CODEOWNERS` içindeki 01-kimlik-erisim sahibi inceleyici olarak eklendi.
- [ ] Olay için sözleşme testi eklendi.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?
Bu kayıt alıcı şirkete yeni ekip üyesi davetidir. Davet bir e-posta, kurum ve rol profili tutar. Davet kabul edilince yeni kullanıcı oluşur. Davetin bir son kullanma zamanı vardır.

## Bugünkü bağımlılıklar
### Bu kaydın bağlandığı kayıtlar
- `CRM Organization` (`organization`): dış uygulama (Frappe CRM)
- `Role Profile` (`role_profile`): Frappe çekirdeği
- `User` (`invited_by`, `created_user`): Frappe çekirdeği
### Bu kayda dokunan kod
- `tradehub_core/api/v1/buyer_team.py:262`: daveti oluşturuyor
- `tradehub_core/api/v1/buyer_team.py:426`, `:468`: daveti açıp güncelliyor
- `tradehub_core/api/v1/buyer_team.py:233`, `:317`, `:461`: listeliyor
- `tradehub_core/authz/registry.py:99`: oluşturma iznini `buyer_team_management` yeteneğine bağlıyor
### hooks.py kayıtları
- Kayıt yok. Satır düzeyi izin kuralı da yok.

## Bağımlılık sorunları
1. İş akışı tümüyle API dosyasında. Kanıt: `tradehub_core/api/v1/buyer_team.py:262-468`. Başka bir akış (örneğin yönetici paneli) aynı kuralı tekrar yazmak zorunda kalır.
2. Satır düzeyi izin yok. Bir kurumun daveti başka kuruma görünebilir (doğrulanmadı: API katmanı filtreliyor olabilir).

## Hedef tasarım
- Sahip bağlam: 01-kimlik-erisim. Paket yolu: `tradehub_core/identity/team/`.
- Dışa açık fonksiyonlar: `invite_buyer_member(org, email, role_profile)`, `accept_invite(token)`, `revoke_invite(name, reason)`.
- Yayınladığı olay: `identity.member.joined` (alan: `user`, `organization`, `side="buyer"`).
- Bildirim bağlamı (12) davet e-postasını bu olaya göre gönderir.
- Link alanları kalır. Hepsi kök kayıtlara bağlı.
- Denetleyicide e-posta biçimi ve silme yasağı kalır. Süre ve durum geçişi servise taşınır.

## Geçiş adımları
1. `buyer_team.py` içindeki iş kurallarını `tradehub_core/identity/team/service.py` dosyasına taşıyın. API yalnız servisi çağırsın.
2. `permissions.py` içine kurum filtresi ekleyin. `hooks.py` kayıtlarını ekleyin.
3. Davet e-postasını olay üzerinden gönderin. Bu adım olay altyapısından sonra gelir.

## Riskler ve testler
- Süresi dolmuş davetin kabulü engellenmeli. Süre testi ekleyin.
- Başka kurumun davetini görme testi ekleyin.
