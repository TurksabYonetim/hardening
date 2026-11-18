# User Profile

- Bağlam: 01-kimlik-erisim
- Tür: Ana kayıt (kullanıcı başına tek kayıt)
- Klasör: `tradehub_core/tradehub_core/doctype/user_profile`
- Denetleyici: `tradehub_core/tradehub_core/doctype/user_profile/user_profile.py` (116 satır)
- Önerilen sahip bağlam: 01-kimlik-erisim. Bazı alan grupları başka bağlamlara aittir. Ayrıntı aşağıdadır.

## Epic

- Epic adı: User Profile: 01-kimlik-erisim bağlamına taşıma
- Öncelik: Kritik
- Faz: Faz 4
- Tahmini büyüklük: Büyük

### User story

Bir geliştirici olarak, kullanıcı profilini yalnız kimlik API'si ile okumak ve değiştirmek istiyorum.
Böylece doğrulama ve satış yetkisi kuralları başka ekibin değişikliğiyle bozulmaz.

### Kabul kriterleri

- [ ] `identity.api.is_email_verified`, `get_profile` ve `set_verification_status` fonksiyonları var.
- [ ] `shared_sync` ve `notifications` paketlerinde `User Profile` için doğrudan `get_value` yok.
- [ ] `kyb_verification.py`, `kyc_verification.py`, `api/v1/kyc.py` ve `seller_application.py` içinde `User Profile` için `set_value` ya da SQL yok.
- [ ] KYB onayından sonra `can_sell` açılıyor. Test geçiyor.
- [ ] `tradehub_core/tests/test_pii_compliance.py` geçiyor.
- [ ] Characterization test: `User Profile` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- `kyb_status`, `kyc_status`, `can_buy` ve `can_sell` alanlarına satıcı bağlamından yazmayın. Bu alanları yalnız kimlik bağlamı değiştirir.
- Bu DocType'a yeni puan ya da banka alanı eklemeyin. Bu veriler kendi bağlamlarında durur.
- `tabUser Profile` tablosuna ham SQL ile kayıt eklemeyin.
- `email_verified` alanını yeni kodda doğrudan okumayın. `is_email_verified` kullanın.
- Maskeleme kancası `crm_masking.mask_pii_fields` kaydını kaldırmayın.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] Değişen davranış için önce başarısız olan test yazıldı.
- [ ] Ruff ve ilgili testler yerelde geçiyor.
- [ ] `import-linter` kontrolü yeni ihlal üretmiyor.
- [ ] `CODEOWNERS` içindeki 01-kimlik-erisim sahibi inceleyici olarak eklendi.
- [ ] Satıcı (02) ve değerlendirme (11) sahipleri inceleyici olarak eklendi.
- [ ] Alan taşıma patch'i iki kez çalışınca veri bozulmuyor.
- [ ] Olay için sözleşme testi eklendi.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?
Bu kayıt her kullanıcının platform profilidir. Alıcı ve satıcı bilgisi tek kayıtta birleşti. Kayıt alım ve satım yetkisini (`can_buy`, `can_sell`) tutar. E-posta doğrulama, KYC ve KYB durumunu da tutar. KYC kişi kimlik doğrulamasıdır. KYB şirket doğrulamasıdır. Kayıtta banka bilgisi ve alıcı puanı alanları da vardır.

## Bugünkü bağımlılıklar
### Bu kaydın bağlandığı kayıtlar
- `User` (`user`): Frappe çekirdeği
- `Country` (`country`): Frappe çekirdeği
- `tenant` alanı düz metindir. Link değildir.
### Bu kayda dokunan kod
Yazanlar:
- `tradehub_core/api/v1/identity.py:490`, `:705`: kaydı oluşturuyor
- `tradehub_core/tradehub_core/doctype/kyb_verification/kyb_verification.py:150`, `:262`: `kyb_status` alanını `set_value` ile yazıyor
- `tradehub_core/tradehub_core/doctype/kyc_verification/kyc_verification.py:275`: KYC durumunu yazıyor
- `tradehub_core/api/v1/kyc.py:204`: `kyc_status` alanını `set_value` ile yazıyor
- `tradehub_core/tradehub_core/doctype/seller_application/seller_application.py:429`: banka ve telefon alanlarını `set_value` ile yazıyor
- `tradehub_core/tasks.py:241`, `:492`: alıcı metriklerini ve seviyesini yazıyor
- `tradehub_core/tradehub_core/scoring/engine.py:182`: puanı hesaplayıp yazıyor
- `tradehub_core/shared_sync/projections.py:620`, `:637` ve `tradehub_core/shared_sync/accounts.py:101`, `:111`: yazıyor ve siliyor
- `tradehub_core/shared_sync/profile_editor.py:64`: yazıyor
Okuyanlar (örnekler):
- `tradehub_core/permissions.py:259`: hesap türü, KYC ve KYB durumunu okuyor
- `tradehub_core/api/cart.py:44`, `:2096`: KYC durumu ve hesap türünü okuyor
- `tradehub_core/utils/auth_guards.py:40`: `email_verified` okuyor
- `tradehub_core/notifications/consent_bridge.py:48`: `email_verified` okuyor
- `shared_sync` paketinde en az 12 dosya `email_verified` okuyor. Örnek: `tradehub_core/shared_sync/local.py:45`
Denetleyicinin dokunduğu yerler:
- `tradehub_core/tradehub_core/doctype/user_profile/user_profile.py:56`: `api.v1.identity._log_email_verification_event` iç fonksiyonunu çağırıyor
- `tradehub_core/tradehub_core/doctype/user_profile/user_profile.py:81`, `:88`: `User.enabled` ve `User.user_type` alanlarını `set_value` ile yazıyor
### hooks.py kayıtları
- `tradehub_core/hooks.py:853-856`: `on_load` olayı `crm_masking.mask_pii_fields` çağırıyor
- `tradehub_core/hooks.py:1080`: `permission_query_conditions`
- `tradehub_core/hooks.py:1207`: `has_permission`
- `tradehub_core/hooks.py:1619-1620`: `on_update` olayı `shared_sync.catalog.profile_changed` çağırıyor
- `tradehub_core/hooks.py:1621-1622`: `before_save` olayı `shared_sync.profile_editor.guard_document` çağırıyor

## Bağımlılık sorunları
1. Satıcı bağlamı profil durumunu doğrudan yazıyor. Kanıt: `kyb_verification.py:150`, `kyc_verification.py:275`, `api/v1/kyc.py:204`. `set_value` kancaları atlıyor. `can_buy` ve `can_sell` bayrakları bu durumlardan türetiliyor (proje notu: `CLAUDE.md` 6.1). Bayrak tutarsız kalabilir.
2. Başvuru kaydı banka bilgisini profile kopyalıyor. Kanıt: `seller_application.py:429`. Kod yorumu kanca atlamayı açıkça söylüyor (`seller_application.py:428`).
3. Alıcı puanı ve metrikleri bu kayıtta. Kanıt: alanlar `total_spent`, `buyer_score`, `dispute_rate`. Yazan kod `tasks.py:241` ve `scoring/engine.py:182`. Değerlendirme işi (11) kimlik tablosunu yazıyor. Puan alanı eklemek bu JSON dosyasını değiştirir. İki ekip aynı dosyada çakışır.
4. Banka bilgisi (`iban`, `bank_name`) bu kayıtta. Bu bilgi ödeme bağlamına (05) yakın. Maskeleme kancası `hooks.py:855` bu yüzden var.
5. Denetleyici API dosyasının iç fonksiyonunu çağırıyor. Kanıt: `user_profile.py:56`.
6. `email_verified` alanı 20'den fazla yerde doğrudan okunuyor. Kanıt: `shared_sync` ve `notifications` örnekleri. Alan adı değişirse bu yerler sessizce bozulur.

## Hedef tasarım
- Sahip bağlam: 01-kimlik-erisim. Paket yolu: `tradehub_core/identity/profile/`.
- Dışa açık fonksiyonlar (`tradehub_core/identity/api.py`):
  - `get_profile(user) -> ProfileView` (alan: `full_name`, `account_type`, `can_buy`, `can_sell`, `country`, `status`)
  - `is_email_verified(user) -> bool`
  - `get_verification_status(user) -> VerificationStatus` (alan: `kyc_status`, `kyb_status`)
  - `ensure_profile(user, data) -> str`
- Dinlediği olaylar:
  - `seller.kyc.status_changed` ve `seller.kyb.status_changed`. Gelince durumu ve bayrakları kendisi hesaplar.
  - `seller.application.approved`. Gelince eksik telefon bilgisini doldurur.
- Yayınladığı olaylar: `identity.profile.updated`, `identity.capability_flags.changed` (alan: `user`, `can_buy`, `can_sell`).
- Taşınacak alan grupları:
  - Alıcı metrikleri ve puanı 11-degerlendirme bağlamında ayrı bir `Buyer Score` kaydına geçer. Link: `user`.
  - Banka bilgisi 05-odeme bağlamında satıcı ödeme hesabı kaydına geçer. Hedef DocType adını ödeme ekibi seçmeli (doğrulanmadı).
- Denetleyicide hesap türü kuralı ve geri düşürme yasağı kalır. `User` senkronu servis fonksiyonuna taşınır.

## Geçiş adımları
1. `is_email_verified` ve `get_profile` fonksiyonlarını ekleyin. Önce yeni kod bunları kullansın.
2. `shared_sync` ve `notifications` okumalarını bu fonksiyonlara çevirin. Her paket ayrı PR olsun.
3. `set_verification_status(user, kind, status)` fonksiyonunu ekleyin. KYB ve KYC kodu bunu çağırsın. Bu adım 1. adımdan sonra gelir.
4. E-posta kayıt fonksiyonunu kimlik paketine taşıyın. `user_profile.py:56` buna bağlansın.
5. Alıcı metrikleri için yeni kaydı açın. Önce iki yere birden yazın. Okumaları yeni kayda çevirin. Sonra eski alanları kaldırın. Her aşama ayrı PR olsun.
6. 3. adımdaki çağrıları olay işleyicisine çevirin. Bu adım olay altyapısından sonra gelir.

## Riskler ve testler
- KYB onayından sonra `can_sell` açılmazsa satıcı satış yapamaz. KYB onayı sonrası bayrak testi ekleyin.
- Maskeleme bozulursa banka bilgisi görünür. `tradehub_core/tests/test_pii_compliance.py` korunmalı.
- Alan taşıma sırasında puan ekranı boş görünebilir. Kademeli geçiş için karşılaştırma testi ekleyin.
- `status` değişince `User.enabled` güncellenmeli. Bu davranış için test ekleyin.
