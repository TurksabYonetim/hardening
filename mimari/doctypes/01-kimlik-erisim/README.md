# 01-kimlik-erisim: Kimlik ve erişim

## 1. Bağlamın amacı
Bu bağlam kullanıcının kim olduğunu ve neye erişebileceğini yönetir. Kullanıcı profili, adresler ve doğrulama durumu burada durur. Roller, yetenekler ve menü görünürlüğü de burada durur. Yetki kararlarının denetim kayıtları da bu bağlamın işidir. Diğer bağlamlar bu bağlama yalnız açık fonksiyonlarla sorar. Örneğin "Bu kullanıcı alım yapabilir mi?" sorusu `identity.api.can_user_buy(user)` ile sorulur.

Önerilen paket yolu: `tradehub_core/identity/`. Frappe modülü: `Identity`.

## 2. DocType listesi
Ana kayıtlar:
- `User Profile`, `Addresses`, `API Application`, `Buyer Sub User Invite`
- `Role Delegation`, `Owner Transfer Request`, `Sales Team`, `User Context Preference`
- `TH Capability Grant`, `TH Module Policy`
- `Approval Rule`, `Cost Center` (taşınacak, bkz. bölüm 7)
- `Buyer Profile` (kullanımdan kalktı)

Alt tablolar:
- `API Scope`, `Approval Rule Approver`, `Sales Team Member`

Ayarlar ve kataloglar:
- `TH Capability Registry`, `TH Module Registry`, `Authorization Anomaly Rule`

Kayıt defterleri (log):
- `Authorization Decision Log`, `Authorization Anomaly Alert`, `Permission Override Log`, `Role Change Log`, `Email Verification Log`, `Mobile API Token`

## 3. Bağlamın dışa açık API'si
Önerilen dosya: `tradehub_core/identity/api.py`. Tipler `tradehub_core/identity/contracts.py` içinde durur.

Profil ve doğrulama:
- `get_profile(user) -> ProfileView`
- `is_email_verified(user) -> bool`
- `can_user_buy(user) -> bool`
- `get_verification_status(user) -> VerificationStatus`
- `ensure_profile(user, data) -> str`
- `get_user_organization(user) -> str | None`
- `get_org_ancestors(org) -> list[str]`

Adres:
- `get_address_snapshot(address_name) -> AddressSnapshot`
- `list_addresses(owner_kind, owner) -> list[AddressSnapshot]`
- `mark_address_used_by_order(address_name)`

Yetki ve menü:
- `has_capability(user, capability) -> bool`
- `register_capabilities(specs)`
- `register_default_grants(grants)`
- `register_navigation(context_key, items)`
- `register_module_policies(specs)`

API istemcileri ve oturum:
- `verify_client(client_id, client_secret) -> ApiClientIdentity`
- `record_webhook_result(app_name, ok)`
- `revoke_user_tokens(user) -> int`

Ekip:
- `create_member_user(email, full_name, role_profile, tenant) -> str`
- `get_active_team_for_agent(agent) -> TeamRef | None`

Denetim:
- `log_decision(...)`, `query_decisions(filters, limit)`, `log_role_change(...)`, `list_role_changes(users, since)`

## 4. Yayınlanan ve dinlenen olaylar
Yayınlanan olaylar:

| Olay | Veri alanları | Kim dinler |
|---|---|---|
| `identity.profile.updated` | `user`, `changed_fields` | Paylaşım senkronu, bildirim (12) |
| `identity.capability_flags.changed` | `user`, `can_buy`, `can_sell` | Sipariş (04), katalog (03a) |
| `identity.kyc.status_changed` | `kyc`, `user`, `old_status`, `new_status` | Bildirim (12), paylaşım senkronu |
| `identity.email.verified` | `user`, `method` | Bildirim (12) |
| `identity.role.changed` | `user`, `added`, `removed`, `tenant` | Denetim ekranları |
| `identity.capability.changed` | `role_profile` | Yetki önbelleği |
| `identity.navigation.changed` | `module` | Panel önbelleği |
| `identity.anomaly.detected` | `alert`, `tenant`, `actor`, `severity`, `actions` | Satıcı (02) mağaza askıya alma |
| `identity.member.joined` | `user`, `organization`, `side` | Bildirim (12) |

Dinlenen olaylar:

| Olay | Yayınlayan | Bu bağlam ne yapar |
|---|---|---|
| `seller.kyb.status_changed` | 02 | `kyb_status`, `can_sell` ve "Verified Seller" rolünü günceller |
| `seller.application.approved` | 02 | Profili tamamlar, rolleri verir |
| `seller.store.owner_changed` | 02 | Sahip bayrağını ve ReBAC eşlemesini günceller |
| `seller.store.status_changed` | 02 | Askıdaki mağazanın API uygulamalarını kapatır |
| `seller.store.deleted` | 02 | Satıcı adreslerini siler |
| `order.placed` | 04 | Adresi "siparişte kullanıldı" olarak işaretler |
| `privacy.account_deletion_requested` | 13 | Adres, anahtar ve doğrulama kaydını siler |

## 5. Bağlamlar arası en ağır 10 bağımlılık
1. Satıcı bağlamı profil durumunu doğrudan yazıyor. Kanıt: `tradehub_core/tradehub_core/doctype/kyb_verification/kyb_verification.py:262`, `tradehub_core/tradehub_core/doctype/kyc_verification/kyc_verification.py:287`.
2. Satıcı başvurusu profil tablosuna ham SQL ile kayıt ekliyor. Kanıt: `tradehub_core/tradehub_core/doctype/seller_application/seller_application.py:437`.
3. `email_verified` alanı 20'den fazla yerde doğrudan okunuyor. Kanıt örnekleri: `tradehub_core/shared_sync/local.py:45`, `tradehub_core/notifications/consent_bridge.py:48`, `tradehub_core/utils/auth_guards.py:40`.
4. Sipariş kodu adres tablosuna yazıyor. Kanıt: `tradehub_core/api/cart.py:2206`.
5. Lojistik, fatura ve sipariş canlı adres satırını okuyor. Kanıt: `tradehub_core/logistics/hooks.py:599`, `tradehub_core/invoice_documents/service.py:195`, `tradehub_core/api/order.py:1552`.
6. Adres denetleyicisi API dosyasının iç fonksiyonunu çağırıyor. Kanıt: `tradehub_core/tradehub_core/doctype/addresses/addresses.py:111`.
7. Değerlendirme işleri alıcı puanını profile yazıyor. Kanıt: `tradehub_core/tasks.py:241`, `tradehub_core/tradehub_core/scoring/engine.py:182`.
8. Anomali eylemi mağazayı `set_value` ile askıya alıyor. Kanıt: `tradehub_core/services/anomaly_actions.py:119`.
9. Lojistik kurulumu yetenek tablosuna yazıyor. Kanıt: `tradehub_core/logistics/shipping_zones.py:52`.
10. Sipariş oluşturma onay ve bütçe servislerine doğrudan bağlı. Kanıt: `tradehub_core/hooks.py:705`, `tradehub_core/hooks.py:716`.

## 6. Önerilen geçiş sırası
1. `tradehub_core/identity/` paketini ve boş `api.py`, `contracts.py` dosyalarını açın. CODEOWNERS kaydını ekleyin.
2. `is_email_verified`, `get_profile` ve `can_user_buy` fonksiyonlarını ekleyin.
3. `shared_sync` ve `notifications` okumalarını bu fonksiyonlara çevirin. Her paket ayrı PR olsun.
4. `api/cart.py:44` KYC okumasını `can_user_buy` çağrısına çevirin.
5. Adres kilit kodunu `api/buyer.py` dosyasından kimlik paketine taşıyın.
6. `get_address_snapshot` fonksiyonunu ekleyin. Lojistik, fatura ve sipariş okumalarını çevirin.
7. `mark_address_used_by_order` fonksiyonunu ekleyin. `cart.py:2206` satırını çevirin.
8. `register_capabilities`, `register_default_grants` ve `register_navigation` fonksiyonlarını ekleyin.
9. Lojistik yetenek kurulumunu `register_capabilities` çağrısına çevirin.
10. Olay altyapısını bekleyin. Altyapı 14-platform-cekirdek README dosyasında anlatılır. Sonra KYB ve KYC senkronunu olay işleyicisine taşıyın.
11. `Approval Rule`, `Approval Rule Approver` ve `Cost Center` kayıtlarını 04-siparis bağlamına taşıyın.
12. Alıcı puanı alanlarını 11-degerlendirme bağlamına taşıyın.
13. `Buyer Profile` tablosunu kaldırın.
14. `import-linter` kuralını açın: başka bağlam `tradehub_core.identity` altında yalnız `api` ve `contracts` modüllerini içe aktarabilir.

## 7. Başka bağlama taşınması gereken DocType'lar
- `Approval Rule`: 04-siparis. Yalnız sipariş onay akışında kullanılıyor.
- `Approval Rule Approver`: 04-siparis. Üst kaydıyla birlikte taşınır.
- `Cost Center`: 04-siparis. Tek kullanıcısı sipariş bütçe kapısı.
- `Owner Transfer Request`: 02-satici-magaza. Mağaza sahipliğini değiştiriyor.
- `KYC Verification` bugün 02 bağlamında. Bu bağlama taşınmalı. Ayrıntı: `mimari/doctypes/02-satici-magaza/kyc_verification.md`.
- `User Profile` içindeki alıcı puanı alanları 11-degerlendirme bağlamına, banka alanları 05-odeme bağlamına taşınmalı.
- `User Context Preference` burada kalır. Kodu `tradehub_core/context/` paketinde. Paket kimlik paketine taşınmalı.

## 8. Paralel çalışan geliştiriciler için kurallar
1. Başka bağlamın kodu `User Profile` alanını doğrudan okumaz. Önce `identity.api` içinde fonksiyon olup olmadığına bakın. Yoksa fonksiyonu ekleyin.
2. Başka bağlam kimlik tablolarına `set_value`, `db.delete` ya da SQL ile yazmaz. Örneğin KYB onayı profil durumunu olayla bildirir.
3. Yeni yetenek, menü öğesi ya da yetki bağı yalnız `register_*` fonksiyonlarıyla eklenir. Elle patch yazılmaz.
4. Denetim kayıtları değiştirilemez. Test kurulumu bu kayıtları silmez.
5. Denetleyici başka paketin alt çizgili iç fonksiyonunu çağırmaz.
6. `hooks.py` içinde kimlik DocType'ları için yeni kayıt yalnız kimlik ekibinin onayıyla eklenir.
7. Her PR `tradehub_core/identity/tests/` altında test içerir.

## Epic özeti

Bu bağlamdaki epic listesi aşağıdadır. Hedef bağlam her raporun Epic bölümünde yazılıdır.

- API Application: Önemli, Faz 4, Orta
- API Scope: Düşük, Faz 4, Küçük
- Addresses: Acil, Faz 4, Büyük
- Approval Rule: Önemli, Faz 3, Orta
- Approval Rule Approver: Düşük, Faz 3, Küçük
- Authorization Anomaly Alert: Önemli, Faz 4, Orta
- Authorization Anomaly Rule: Düşük, Faz 4, Küçük
- Authorization Decision Log: Önemli, Faz 4, Orta
- Buyer Profile: Düşük, Faz 4, Küçük
- Buyer Sub User Invite: Önemli, Faz 4, Orta
- Cost Center: Önemli, Faz 3, Orta
- Email Verification Log: Düşük, Faz 4, Küçük
- Mobile API Token: Önemli, Faz 4, Küçük
- Owner Transfer Request: Acil, Faz 4, Orta
- Permission Override Log: Düşük, Faz 4, Küçük
- Role Change Log: Önemli, Faz 4, Küçük
- Role Delegation: Düşük, Faz 4, Küçük
- Sales Team: Önemli, Faz 4, Küçük
- Sales Team Member: Düşük, Faz 4, Küçük
- TH Capability Grant: Önemli, Faz 4, Orta
- TH Capability Registry: Önemli, Faz 4, Orta
- TH Module Policy: Düşük, Faz 4, Küçük
- TH Module Registry: Acil, Faz 4, Büyük
- User Context Preference: Düşük, Faz 4, Küçük
- User Profile: Kritik, Faz 4, Büyük
