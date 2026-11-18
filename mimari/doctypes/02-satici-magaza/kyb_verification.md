# KYB Verification

- Bağlam: 02-satici-magaza
- Tür: Ana kayıt (doğrulama iş akışı)
- Klasör: `tradehub_core/tradehub_core/doctype/kyb_verification`
- Denetleyici: `tradehub_core/tradehub_core/doctype/kyb_verification/kyb_verification.py` (433 satır)
- Önerilen sahip bağlam: 02-satici-magaza

## Epic

- Epic adı: KYB Verification: 02-satici-magaza bağlamına taşıma
- Öncelik: Acil
- Faz: Faz 4
- Tahmini büyüklük: Büyük

### User story

Bir satıcı olarak, şirket doğrulamam onaylanınca satış yetkimin hemen açılmasını istiyorum.
Böylece bildirim ya da senkron hatası onayımı durdurmaz.

### Kabul kriterleri

- [ ] `seller.api.is_verified_seller` ve `get_kyb_status` var. Yorum, soru ve itibar kodu bunları kullanıyor.
- [ ] Denetleyicide `User Profile` için `set_value` yok.
- [ ] `seller.kyb.status_changed` olayı yayınlanıyor. Sözleşme testi geçiyor.
- [ ] Bildirim ve profil senkronu olay işleyicisinde çalışıyor.
- [ ] `test_verification_status_guard.py` ve `test_mogem685_aml_gate.py` geçiyor.
- [ ] Characterization test: `KYB Verification` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- Denetleyiciye yeni bildirim ya da senkron kodu eklemeyin. Olaya abone olun.
- `listing_review.py` ya da `listing_question.py` içinden KYB tablosunu okumayın. `is_verified_seller` kullanın.
- "Verified Seller" rolünü `add_roles` ile vermeyin. Rol profili bu rolü siler.
- Denetleyiciden `api.v1.kyb` iç fonksiyonunu çağırmayın.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] Değişen davranış için önce başarısız olan test yazıldı.
- [ ] Ruff ve ilgili testler yerelde geçiyor.
- [ ] `import-linter` kontrolü yeni ihlal üretmiyor.
- [ ] `CODEOWNERS` içindeki 02-satici-magaza sahibi inceleyici olarak eklendi.
- [ ] Kimlik (01) ve bildirim (12) sahipleri inceleyici olarak eklendi.
- [ ] KYB silindikten sonra yetkinin yeniden hesaplandığı test edildi.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?
Bu kayıt satıcı şirketin doğrulama başvurusudur. KYB "işletmeni tanı" demektir. Kayıt şirket unvanı, vergi numarası, ticaret sicili ve belgeleri tutar. Yönetici başvuruyu onaylar ya da reddeder. Onaylı KYB satış yetkisini açar. Proje kuralı şudur: `can_sell` yalnız KYB "Verified" iken açıktır (`CLAUDE.md` 6.1).

## Bugünkü bağımlılıklar
### Bu kaydın bağlandığı kayıtlar
- `User` (`user`, `verified_by`): Frappe çekirdeği
- Mağaza linki yok. Kayıt kullanıcıya bağlı.
### Bu kayda dokunan kod
Denetleyicinin dokunduğu yerler:
- `kyb_verification.py:8-9`: dosya başında bildirim paketini içe aktarıyor
- `kyb_verification.py:40`: `api.v1.kyb._get_seller_data` iç fonksiyonunu çağırıyor
- `kyb_verification.py:57`, `:113`: `shared_sync.verification_references` çağırıyor
- `kyb_verification.py:83`, `:89`: `permissions.guard_verification_status_change` ve `guard_aml_fields_change` çağırıyor
- `kyb_verification.py:150`, `:262`, `:265`: `User Profile` alanlarını `set_value` ile yazıyor
- `kyb_verification.py:168`: `utils.verified_seller.sync_seller_from_kyb` ile rolü yönetiyor
- `kyb_verification.py:202`: `Seller Application` ülkesini okuyor
- `kyb_verification.py:335-418`: bildirim gönderiyor
Başka yerler:
- `tradehub_core/api/v1/kyb.py:187`, `:203`, `:215`, `:454`: oluşturuyor ve güncelliyor
- `tradehub_core/tradehub_core/doctype/seller_application/seller_application.py:548`, `:564`: başvuru onayında KYB oluşturuyor
- `tradehub_core/utils/verified_seller.py:71`: onaylı KYB var mı diye okuyor
- `tradehub_core/api/reputation.py:64`, `tradehub_core/api/qa.py:51`: durumu okuyor
- `tradehub_core/tradehub_core/doctype/listing_question/listing_question.py:30`: durumu okuyor
- `tradehub_core/tradehub_core/doctype/listing_review/listing_review.py:280`: durumu okuyor
- `tradehub_core/media/file_isolation.py`, `tradehub_core/media/presets.py`: belge dosyası erişimini tanıyor
### hooks.py kayıtları
- `tradehub_core/hooks.py:922-925`: `before_insert` ve `validate` olayları kiracı izolasyonu
- `tradehub_core/hooks.py:1093`: `permission_query_conditions`
- `tradehub_core/hooks.py:1222`: `has_permission`

## Bağımlılık sorunları
1. Denetleyici dört bağlamın işini yapıyor. Kanıt: profil yazımı `kyb_verification.py:262`, rol yönetimi `:168`, bildirim `:335`, paylaşım senkronu `:113`. Bu kodlardan biri hata verirse onay kaydedilmez. Bildirim ekibinin değişikliği KYB onayını bozabilir.
2. Kimlik tablosu doğrudan yazılıyor. Kanıt: `kyb_verification.py:150`, `:262`, `:265`. Kancalar atlanır.
3. Değerlendirme ve soru-cevap kodu KYB tablosunu doğrudan okuyor. Kanıt: `listing_review.py:280`, `listing_question.py:30`, `api/qa.py:51`, `api/reputation.py:64`. KYB alanı değişirse yorum ve soru akışı bozulur.
4. Denetleyici API dosyasının iç fonksiyonunu çağırıyor. Kanıt: `kyb_verification.py:40`.
5. KYB kaydında mağaza linki yok. Ama `hooks.py:922` kiracı izolasyonu uyguluyor. İzolasyon kullanıcıdan mağazaya çeviri yapıyor olmalı (doğrulanmadı).

## Hedef tasarım
- Sahip bağlam: 02-satici-magaza. Paket yolu: `tradehub_core/seller/verification/`.
- Dışa açık fonksiyonlar (`tradehub_core/seller/api.py`):
  - `get_kyb_status(user) -> str`
  - `is_verified_seller(user) -> bool`
  - `submit_kyb(user, data) -> str`
  - `review_kyb(name, decision, reason)`
- Yayınladığı olay: `seller.kyb.status_changed` (alan: `kyb`, `user`, `old_status`, `new_status`, `verified_at`).
- Dinleyenler:
  - Kimlik (01): `User Profile.kyb_status` ve `can_sell` alanlarını günceller. "Verified Seller" rolünü yönetir.
  - Bildirim (12): satıcıya ve yöneticiye bildirim gönderir.
  - Paylaşım senkronu: doğrulama referansını günceller.
- Değerlendirme (11) ve soru-cevap `is_verified_seller(user)` fonksiyonunu çağırır.
- Denetleyicide kalacak kurallar: vergi numarası, MERSİS, KEP adresi, dosya türü, ret gerekçesi, durum geçişi.

## Geçiş adımları
1. `get_kyb_status` ve `is_verified_seller` fonksiyonlarını ekleyin. Dört okuyucuyu buna bağlayın. Her okuyucu ayrı PR olabilir.
2. `_get_seller_data` fonksiyonunu `seller/verification/` altına taşıyın. Denetleyici buradan alsın.
3. Olay yayıncısını ekleyin. `on_update` içinde `seller.kyb.status_changed` yayınlayın. Eski kod da bir süre çalışsın.
4. Bildirim gönderimini olay işleyicisine taşıyın. Bu iş 12 ekibinin PR'ıdır.
5. Profil ve rol senkronunu kimlik bağlamının olay işleyicisine taşıyın. Bu adım 3. adımdan sonra gelir.
6. Senkron artık işleyicide çalışır. Denetleyicide yalnız doğrulamalar kalır.

## Riskler ve testler
- Olay gecikirse onaylı satıcı birkaç saniye satış yapamaz. Bu kabul edilmeli. Onay sonrası bayrak testi ekleyin.
- Rol senkronu kaçarsa onaysız satıcı satış yapar. `tradehub_core/tests/test_verification_status_guard.py` korunmalı.
- AML (kara para aklama) kapısı testi `tradehub_core/tests/test_mogem685_aml_gate.py` korunmalı.
- Silme sonrası yetki yeniden hesaplanmalı. `after_delete` davranışı için test ekleyin.
