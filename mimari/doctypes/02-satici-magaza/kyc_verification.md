# KYC Verification

- Bağlam: 02-satici-magaza
- Tür: Ana kayıt (doğrulama iş akışı)
- Klasör: `tradehub_core/tradehub_core/doctype/kyc_verification`
- Denetleyici: `tradehub_core/tradehub_core/doctype/kyc_verification/kyc_verification.py` (416 satır)
- Önerilen sahip bağlam: 01-kimlik-erisim. KYC kişi doğrulamasıdır. Alım yetkisini (`can_buy`) açar. Alıcılar da bu kaydı kullanır. Satıcı mağazasıyla bağı yoktur.

## Epic

- Epic adı: KYC Verification: 01-kimlik-erisim bağlamına taşıma
- Öncelik: Acil
- Faz: Faz 4
- Tahmini büyüklük: Orta

### User story

Bir alıcı olarak, kimliğim onaylanınca sipariş verebilmek istiyorum.
Böylece alım yetkim tek bir kurala bağlı olur.

### Kabul kriterleri

- [ ] `identity.api.can_user_buy` var. `api/cart.py` bu fonksiyonu kullanıyor.
- [ ] Profil senkronu `tradehub_core/identity/verification/service.py` içinde duruyor.
- [ ] `api/v1/kyc.py` içinde `kyc_status` için `set_value` yok.
- [ ] `test_kyc_tenant_isolation.py` ve `test_shared_sync_verification_references.py` geçiyor.
- [ ] Characterization test: `KYC Verification` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- `can_buy` alanını iki ayrı yerden yazmayın. Tek servis yazar.
- Sipariş kodunda `kyc_status` alanını doğrudan okumayın.
- TCKN ve VKN sağlama kontrolünü kaldırmayın.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] Değişen davranış için önce başarısız olan test yazıldı.
- [ ] Ruff ve ilgili testler yerelde geçiyor.
- [ ] `import-linter` kontrolü yeni ihlal üretmiyor.
- [ ] `CODEOWNERS` içindeki 01-kimlik-erisim sahibi inceleyici olarak eklendi.
- [ ] Sipariş bağlamı (04) sahibi inceleyici olarak eklendi.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?
Bu kayıt kişinin kimlik doğrulama başvurusudur. KYC "müşterini tanı" demektir. Kayıt vergi ya da kimlik numarası, telefon ve kimlik belgesi tutar. Yönetici başvuruyu onaylar. Onay alım yetkisini açar.

## Bugünkü bağımlılıklar
### Bu kaydın bağlandığı kayıtlar
- `User` (`user`, `reviewed_by`): Frappe çekirdeği
### Bu kayda dokunan kod
Denetleyicinin dokunduğu yerler:
- `kyc_verification.py:116`: `User Profile` ülkesini okuyor
- `kyc_verification.py:135`, `:260`: `shared_sync.verification_references` çağırıyor
- `kyc_verification.py:157`: `permissions.guard_verification_status_change` çağırıyor
- `kyc_verification.py:287-311`: `User Profile.kyc_status`, `can_buy`, `kyc_verified_at` alanlarını `set_value` ile yazıyor
- `kyc_verification.py:344`: hesap türünü yazıyor
- `kyc_verification.py:353`: profil durumunu askıya alıyor
- `kyc_verification.py:364`: bildirim gönderiyor
Başka yerler:
- `tradehub_core/api/v1/kyc.py:48`, `:114`, `:140`, `:164`: oluşturuyor ve güncelliyor
- `tradehub_core/api/v1/kyc.py:204`: `User Profile.kyc_status` alanını ayrıca yazıyor
- `tradehub_core/api/cart.py:44`: sepet kapısı `User Profile.kyc_status` okuyor
- `tradehub_core/media/file_isolation.py`, `tradehub_core/media/presets.py`: belge dosyasını tanıyor
### hooks.py kayıtları
- `tradehub_core/hooks.py:1097`: `permission_query_conditions`
- `tradehub_core/hooks.py:1223`: `has_permission`

## Bağımlılık sorunları
1. Denetleyici kimlik tablosunu altı kez doğrudan yazıyor. Kanıt: `kyc_verification.py:287-353`. Alım yetkisi kuralı burada. Kimlik ekibi bu kuralı göremiyor.
2. API dosyası aynı alanı ayrıca yazıyor. Kanıt: `api/v1/kyc.py:204`. İki yazma noktası çelişebilir.
3. Bildirim ve paylaşım senkronu denetleyicide. Kanıt: `kyc_verification.py:260`, `:364`. Biri hata verirse onay kaydedilmez.
4. Sipariş kapısı KYC durumunu profilden okuyor. Kanıt: `api/cart.py:44`. Bu iyi bir okuma noktası. Ama okuma bir fonksiyon değil, doğrudan alan.

## Hedef tasarım
- Sahip bağlam: 01-kimlik-erisim. Paket yolu: `tradehub_core/identity/verification/`.
- Dışa açık fonksiyonlar (`tradehub_core/identity/api.py`):
  - `get_kyc_status(user) -> str`
  - `can_user_buy(user) -> bool`
  - `submit_kyc(user, data) -> str`
  - `review_kyc(name, decision, reason)`
- Yayınladığı olay: `identity.kyc.status_changed` (alan: `kyc`, `user`, `old_status`, `new_status`).
- Dinleyenler: bildirim (12) ve paylaşım senkronu.
- Profil güncellemesi aynı bağlamda kalır. Bu yüzden servis fonksiyonu olarak yapılabilir.
- Sipariş (04) `can_user_buy(user)` fonksiyonunu çağırır.
- Denetleyicide kalacak kurallar: TCKN ve VKN sağlaması, zorunlu alanlar, belge türü, ret gerekçesi, durum geçişi.

## Geçiş adımları
1. `can_user_buy` fonksiyonunu ekleyin. `api/cart.py:44` satırını buna bağlayın.
2. Profil senkronunu `tradehub_core/identity/verification/service.py` dosyasına taşıyın. `api/v1/kyc.py:204` yazmasını kaldırın.
3. Bildirim gönderimini `identity.kyc.status_changed` olayına bağlayın. Bu adım olay altyapısından sonra gelir.
4. JSON `module` alanını kimlik modülüne çevirin.

## Riskler ve testler
- Onaylı alıcı sipariş veremezse satış durur. Onay sonrası `can_buy` testi ekleyin.
- Kiracı izolasyonu `tradehub_core/tests/test_kyc_tenant_isolation.py` ile korunmalı.
- Paylaşım referans testi `tradehub_core/tests/test_shared_sync_verification_references.py` korunmalı.
