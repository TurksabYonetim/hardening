# 02-satici-magaza: Satıcı ve mağaza

## 1. Bağlamın amacı
Bu bağlam mağazanın yaşam döngüsünü yönetir. Başvuru, şirket doğrulaması (KYB), mağaza profili ve abonelik burada durur. Satış koşulları ve mağaza ekibi de bu bağlamın işidir. `Admin Seller Profile` kaydı mağazanın kök kaydıdır. Platformdaki 89 DocType bu kayda bağlanır. Bu yüzden bu bağlamın açık API'si en çok kullanılan API olacaktır.

Önerilen paket yolu: `tradehub_core/seller/`. Frappe modülü: `Seller`.

## 2. DocType listesi
Ana kayıtlar:
- `Admin Seller Profile` (kök kayıt)
- `Seller Application`, `KYB Verification`, `Seller Verification`
- `Store Subscription`, `Subscription Plan`
- `Seller Terms`, `Seller Category`, `Seller Sub User Invite`
- `KYC Verification` (taşınacak, bkz. bölüm 7)
- `Seller Template Profile` (taşınacak, bkz. bölüm 7)
- `Seller Profile` (kullanımdan kalktı)

Alt tablolar:
- `Seller Gallery Image`, `Seller Certification`, `Pricing Plan Feature`, `Subscription Plan Region`

Ayarlar ve kataloglar:
- `Trial Settings` (single), `Feature Catalog`, `Verification Source`

Kayıt defterleri:
- `Seller Terms Version` (değişmez sürüm)

## 3. Bağlamın dışa açık API'si
Önerilen dosya: `tradehub_core/seller/api.py`. Tipler `tradehub_core/seller/contracts.py` içinde durur.

Mağaza:
- `get_store(store) -> StoreView`
- `get_store_for_user(user) -> str | None`
- `is_store_active(store) -> bool`
- `update_store_profile(store, changes)`
- `suspend_store(store, reason, actor)` ve `reactivate_store(store, actor)`
- `get_sku_settings(store) -> SkuSettings`

Doğrulama:
- `get_kyb_status(user) -> str`
- `is_verified_seller(user) -> bool`
- `submit_kyb(user, data)` ve `review_kyb(name, decision, reason)`

Başvuru:
- `submit_application(user, data)`, `approve_application(name, reviewer)`, `reject_application(name, reason)`

Abonelik:
- `get_active_subscription(store) -> SubscriptionView | None`
- `get_entitlements(store) -> Entitlements`
- `get_plan(plan) -> PlanView`
- `list_plan_feature_keys() -> list[str]`
- `get_store_regions(store) -> set[str]`

Satış koşulları:
- `get_published_terms(store) -> TermsVersionRef | None`
- `get_terms_snapshot(version) -> TermsSnapshot`

Ekip:
- `invite_store_member(store, email, role_profile)`, `accept_store_invite(token)`

## 4. Yayınlanan ve dinlenen olaylar
Yayınlanan olaylar:

| Olay | Veri alanları | Kim dinler |
|---|---|---|
| `seller.store.created` | `store`, `user` | SEO (10), yardım masası, kimlik (01) |
| `seller.store.updated` | `store`, `changed_fields` | SEO (10), katalog (03a), medya (08), paylaşım senkronu |
| `seller.store.status_changed` | `store`, `old`, `new`, `reason` | Katalog (03a), SEO (10), kimlik (01) |
| `seller.store.owner_changed` | `store`, `old_owner`, `new_owner` | Kimlik (01) |
| `seller.store.deleted` | `store` | Ödeme (05), vitrin (09), sohbet (12), kimlik (01), sepet (04), içe aktarma (03b) |
| `seller.application.approved` | `application`, `user`, `store`, `trial_plan` | Kimlik (01), bildirim (12) |
| `seller.application.revoked` | `application`, `user`, `store` | Kimlik (01), bildirim (12) |
| `seller.kyb.status_changed` | `kyb`, `user`, `old_status`, `new_status` | Kimlik (01), bildirim (12), paylaşım senkronu |
| `seller.subscription.status_changed` | `store`, `old_status`, `new_status`, `operational` | Katalog (03a), SEO (10), kimlik (01) |
| `seller.plan.changed` | `plan`, `changed_fields` | Kimlik (01), ödeme (05) |
| `seller.terms.published` | `store`, `version`, `version_no` | Sipariş (04) |
| `seller.member.joined` | `store`, `user`, `role_profile` | Bildirim (12) |

Dinlenen olaylar:

| Olay | Yayınlayan | Bu bağlam ne yapar |
|---|---|---|
| `identity.anomaly.detected` | 01 | Kural isterse mağazayı askıya alır |
| `payments.subscription_payment.succeeded` | 05 | Aboneliği etkin yapar |
| `payments.subscription_payment.failed` | 05 | Aboneliği gecikmiş yapar |
| `catalog.product_category.deleted` | 03a | Mağaza kategorisinin bağını boşaltır |
| `privacy.account_deletion_requested` | 13 | Sahibin aboneliğini iptal eder |

## 5. Bağlamlar arası en ağır 10 bağımlılık
1. `Admin Seller Profile` kaydında 9 paketten 20'den fazla kanca var. Kanıt: `tradehub_core/hooks.py:780-817`, `:1401-1407`, `:1616`, `:1621`.
2. Kanca zinciri ağır olduğu için ekipler kancayı atlıyor. Kanıt: `tradehub_core/api/v1/seller_shipping.py:176` yorumu ve on bir `set_value` yazımı (`api/seller.py:940`, `api/v1/auth.py:838`, `api/sku.py:77` ve diğerleri).
3. Başvuru onayı yedi tabloya yazıyor ve kancaları elle çağırıyor. Kanıt: `tradehub_core/tradehub_core/doctype/seller_application/seller_application.py:437`, `:479`, `:512-522`, `:605`.
4. Abonelik kodu ürün tablosunu ham SQL ile yazıyor. Kanıt: `tradehub_core/services/storefront_visibility.py:59-61`.
5. KYB denetleyicisi kimlik, rol, bildirim ve paylaşım işini yapıyor. Kanıt: `tradehub_core/tradehub_core/doctype/kyb_verification/kyb_verification.py:113`, `:168`, `:262`, `:335`.
6. Mağaza denetleyicisi ödeme paketine bağlı. Kanıt: `tradehub_core/tradehub_core/doctype/admin_seller_profile/admin_seller_profile.py:62`, `:95`, `:105`.
7. Lojistik alt tablosu mağaza kaydının içinde. Kanıt: `shipping_methods` alanı ve `tradehub_core/api/v1/seller_shipping.py:179`.
8. Mağaza silme başka bağlamların tablolarını siliyor. Kanıt: `tradehub_core/services/store_cleanup.py:26-31`.
9. Plan kaydında ödeme bağlamının alt tablosu var. Kanıt: `Subscription Plan.quota_tiers` alanı ve `tradehub_core/tradehub_core/utils/field_commission.py:52`.
10. Yorum ve soru akışı KYB tablosunu doğrudan okuyor. Kanıt: `tradehub_core/tradehub_core/doctype/listing_review/listing_review.py:280`, `tradehub_core/tradehub_core/doctype/listing_question/listing_question.py:30`.

## 6. Önerilen geçiş sırası
1. `tradehub_core/seller/` paketini, `api.py` ve `contracts.py` dosyalarını açın. CODEOWNERS kaydını ekleyin.
2. `get_store`, `get_store_for_user` ve `is_store_active` fonksiyonlarını ekleyin. Yeni kod yalnız bunları kullansın.
3. `is_verified_seller` ve `get_kyb_status` fonksiyonlarını ekleyin. Yorum, soru ve itibar okumalarını çevirin.
4. `suspend_store` fonksiyonunu ekleyin. Dört askıya alma noktasını buna bağlayın.
5. Başvuru onayını denetleyiciden `seller/onboarding/service.py` dosyasına taşıyın. Davranış aynı kalsın.
6. Katalog bağlamıyla `set_store_listings_visible` fonksiyonunu kararlaştırın. Ham SQL yazımını kaldırın.
7. Olay altyapısı hazır olunca `seller.store.updated`, `seller.store.status_changed` ve `seller.kyb.status_changed` olaylarını yayınlayın.
8. `Admin Seller Profile` kancalarını tek tek olay işleyicilerine taşıyın. Her bağlam ayrı PR olsun.
9. KYB ve başvuru senkronunu olay işleyicilerine taşıyın.
10. `store_cleanup.py` silmelerini `seller.store.deleted` işleyicilerine dağıtın.
11. Lojistik alanlarını (`shipping_methods`, `return_carrier_account`) 07-lojistik kaydına taşıyın.
12. Banka alanlarını 05-odeme kaydına taşıyın.
13. Puan alanlarını 11-degerlendirme kaydına taşıyın.
14. `KYC Verification` ve `Seller Template Profile` kayıtlarını hedef bağlamlarına taşıyın.
15. `Seller Profile` tablosunu kaldırın.
16. `import-linter` kuralını açın.

## 7. Başka bağlama taşınması gereken DocType'lar
- `KYC Verification`: 01-kimlik-erisim. Kişi doğrulamasıdır ve alım yetkisini açar.
- `Seller Template Profile`: 03b-ice-aktarma. Tek kullanıcısı toplu yükleme kodu.
- `Admin Seller Profile` içindeki alan grupları:
  - `shipping_methods` ve `return_carrier_account`: 07-lojistik
  - Banka alanları (`iban`, `bank_name`, `account_holder` ve diğerleri): 05-odeme
  - Puan alanları (`health_score`, `rating`, `review_count`, `on_time_delivery`): 11-degerlendirme
- `Subscription Plan.quota_tiers` alt tablosu: 05-odeme
- `Owner Transfer Request` bugün 01 bağlamında. Bu bağlama taşınmalı. Ayrıntı: `mimari/doctypes/01-kimlik-erisim/owner_transfer_request.md`.

## 8. Paralel çalışan geliştiriciler için kurallar
1. Mağaza bilgisi için `seller.api.get_store` kullanın. `Admin Seller Profile` alanını doğrudan okumayın.
2. Mağaza kaydına başka bağlamdan yazmayın. Gereken değişiklik için `seller.api` içinde fonksiyon isteyin.
3. `Admin Seller Profile` için `hooks.py` içine yeni kanca eklemeyin. Olaya abone olun.
4. Mağaza durumunu yalnız `suspend_store` ve `reactivate_store` değiştirir.
5. `Seller Terms Version` değişmez. Diğer bağlamlar yalnız `get_terms_snapshot` ile okur.
6. Yeni plan özelliği önce `Feature Catalog` kaydına eklenir. Sonra kimlik bağlamına `register_capabilities` ile bildirilir.
7. Mağaza JSON dosyasına yeni alan eklemek satıcı ekibinin onayını ister. Başka bağlamın verisi kendi DocType'ında durur ve `store` Link alanı taşır.
8. Her PR `tradehub_core/seller/tests/` altında test içerir.

## Epic özeti

Bu bağlamdaki epic listesi aşağıdadır. Hedef bağlam her raporun Epic bölümünde yazılıdır.

- Admin Seller Profile: Kritik, Faz 4, Büyük
- Feature Catalog: Önemli, Faz 4, Küçük
- KYB Verification: Acil, Faz 4, Büyük
- KYC Verification: Acil, Faz 4, Orta
- Pricing Plan Feature: Düşük, Faz 4, Küçük
- Seller Application: Acil, Faz 4, Büyük
- Seller Category: Önemli, Faz 4, Orta
- Seller Certification: Önemli, Faz 4, Küçük
- Seller Gallery Image: Önemli, Faz 4, Küçük
- Seller Profile: Düşük, Faz 4, Küçük
- Seller Sub User Invite: Önemli, Faz 4, Orta
- Seller Template Profile: Düşük, Faz 4, Küçük
- Seller Terms: Önemli, Faz 4, Orta
- Seller Terms Version: Önemli, Faz 4, Küçük
- Seller Verification: Düşük, Faz 4, Küçük
- Store Subscription: Acil, Faz 4, Büyük
- Subscription Plan: Önemli, Faz 4, Orta
- Subscription Plan Region: Önemli, Faz 4, Küçük
- Trial Settings: Düşük, Faz 4, Küçük
- Verification Source: Düşük, Faz 4, Küçük
