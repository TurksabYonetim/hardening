# Seller Application

- Bağlam: 02-satici-magaza
- Tür: Ana kayıt (başvuru iş akışı)
- Klasör: `tradehub_core/tradehub_core/doctype/seller_application`
- Denetleyici: `tradehub_core/tradehub_core/doctype/seller_application/seller_application.py` (760 satır)
- Önerilen sahip bağlam: 02-satici-magaza

## Epic

- Epic adı: Seller Application: 02-satici-magaza bağlamına taşıma
- Öncelik: Acil
- Faz: Faz 4
- Tahmini büyüklük: Büyük

### User story

Bir satıcı olarak, başvurum onaylanınca mağazamın, rolümün ve deneme aboneliğimin eksiksiz açılmasını istiyorum.
Böylece bir adım hata verse de süreç tekrar denenir.

### Kabul kriterleri

- [ ] Onay akışı `tradehub_core/seller/onboarding/service.py` içinde duruyor. Denetleyici yalnız servisi çağırıyor.
- [ ] `seller_application.py` içinde ham SQL `INSERT` yok.
- [ ] `seller.application.approved` olayı yayınlanıyor. Sözleşme testi geçiyor.
- [ ] Aynı olay iki kez gelince tek deneme aboneliği açılıyor. Test geçiyor.
- [ ] Aynı vergi numarasıyla ikinci mağaza açılamıyor. Test geçiyor.
- [ ] Characterization test: `Seller Application` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- Mağaza kancalarını elle çağıran kodu genişletmeyin. Kancalar olay işleyicisine taşınır.
- `tabUser Profile` ya da başka tabloya ham SQL ile yazmayın.
- Denetleyiciden `seo_helper` iç modülünü çağırmayın.
- Onay akışına yeni doğrudan tablo yazımı eklemeyin. Yeni iş olay işleyicisi olur.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] Değişen davranış için önce başarısız olan test yazıldı.
- [ ] Ruff ve ilgili testler yerelde geçiyor.
- [ ] `import-linter` kontrolü yeni ihlal üretmiyor.
- [ ] `CODEOWNERS` içindeki 02-satici-magaza sahibi inceleyici olarak eklendi.
- [ ] Kimlik (01), SEO (10) ve bildirim (12) sahipleri inceleyici olarak eklendi.
- [ ] Ret sonrası mağazanın askıya alındığı test edildi.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?
Bu kayıt bir kullanıcının satıcı olma başvurusudur. Başvuru şirket, vergi, banka ve iletişim bilgisi tutar. Yönetici başvuruyu onaylarsa mağaza açılır. Onay aynı anda KYB kaydı oluşturur, rolleri verir ve isterse deneme aboneliği başlatır. Ret ya da geri alma bu işleri tersine çevirir.

## Bugünkü bağımlılıklar
### Bu kaydın bağlandığı kayıtlar
- `User` (`applicant_user`, `reviewed_by`): Frappe çekirdeği
- `Subscription Plan` (`requested_trial_plan`): aynı bağlam
- `Country` (`country`): Frappe çekirdeği
### Bu kayda dokunan kod
Denetleyicinin dokunduğu yerler:
- `seller_application.py:6-16`: dosya başında bildirim, rol senkronu, vergi doğrulama ve doğrulanmış satıcı paketlerini içe aktarıyor
- `seller_application.py:204`: `permissions.is_verification_reviewer` çağırıyor
- `seller_application.py:271`, `:291`, `:635`: `User` alanlarını `set_value` ile yazıyor
- `seller_application.py:429`, `:640`: `User Profile` alanlarını `set_value` ile yazıyor
- `seller_application.py:437`: `tabUser Profile` tablosuna ham SQL `INSERT` yapıyor
- `seller_application.py:479`, `:508`, `:653`: `Admin Seller Profile` alanlarını `set_value` ile yazıyor
- `seller_application.py:483`: yeni mağaza kaydı oluşturuyor
- `seller_application.py:516-522`: mağaza kancalarını elle çağırıyor (SEO aynası, yardım masası, rol)
- `seller_application.py:548`, `:564`, `:579`: `KYB Verification` oluşturuyor ve sahibini yazıyor
- `seller_application.py:605`: `Store Subscription` oluşturuyor
Başka yerler:
- `tradehub_core/api/v1/identity.py` (9 yer), `tradehub_core/api/v1/auth.py` (6 yer), `tradehub_core/api/v1/kyb.py` (3 yer): okuyor
- `tradehub_core/tradehub_core/doctype/kyb_verification/kyb_verification.py:202`: ülkeyi okuyor
- `tradehub_core/privacy/account_deletion.py`, `tradehub_core/privacy/data_export.py`: silme ve dışa aktarma
- `tradehub_core/media/file_isolation.py`, `tradehub_core/media/presets.py`: belge dosyasını tanıyor
### hooks.py kayıtları
- Bu DocType için `doc_events` ya da izin kaydı yok.

## Bağımlılık sorunları
1. Onay akışı yedi tabloya yazıyor. Kanıt: `User`, `User Profile`, `Admin Seller Profile`, `KYB Verification`, `Store Subscription`, rol satırları ve bildirim. Bu tablolardan birinin sahibi alan değiştirirse onay bozulur. Bu, bağlamlar arası en riskli akışlardan biridir.
2. Ham SQL ile profil oluşturuluyor. Kanıt: `seller_application.py:437`. Proje kuralı (`CLAUDE.md` 4.4) ham SQL yerine `frappe.qb` ister. `User Profile` alanı eklenirse bu SQL eksik kalır.
3. Kanca atlanıyor, sonra elle çağrılıyor. Kanıt: `seller_application.py:512-522`. Yorum nedeni açıklıyor: mağaza `validate` kuralı yönetici yazmasını engelliyor. `hooks.py` listesine yeni kanca eklenirse buraya eklenmez. Yeni kanca onayda çalışmaz.
4. Denetleyici SEO iç modülünü çağırıyor. Kanıt: `seller_application.py:516`. SEO ekibi fonksiyon adını değiştirirse başvuru onayı kırılır.
5. Denetleyici izin dosyasına bağlı. Kanıt: `seller_application.py:204`.

## Hedef tasarım
- Sahip bağlam: 02-satici-magaza. Paket yolu: `tradehub_core/seller/onboarding/`.
- Dışa açık fonksiyonlar (`tradehub_core/seller/api.py`): `submit_application(user, data)`, `approve_application(name, reviewer)`, `reject_application(name, reason)`.
- Onay bir süreç yöneticisidir (saga). Süreç yöneticisi, adımları sırayla çalıştıran servistir. Adımlar:
  1. Satıcı bağlamı kendi tablolarını yazar: mağaza, KYB taslağı, deneme aboneliği.
  2. Aynı işlemde `seller.application.approved` olayını Outbox (giden olay tablosu) içine yazar. Alanlar: `application`, `user`, `store`, `trial_plan`.
  3. Kimlik bağlamı olayı dinler. Profil, rol ve `User` alanlarını günceller.
  4. Bildirim bağlamı olayı dinler. Başvuru sahibine e-posta gönderir.
  5. SEO ve yardım masası `seller.store.created` olayını dinler.
- Ret ve geri alma için `seller.application.revoked` olayı yayınlanır.
- Kalacak Link alanları: `applicant_user`, `requested_trial_plan`.
- Denetleyicide kalacak kurallar: zorunlu alanlar, vergi ve kimlik numarası biçimi, banka bilgisi, karar değişikliği yetkisi.

## Geçiş adımları
1. Onay akışını denetleyiciden `tradehub_core/seller/onboarding/service.py` dosyasına taşıyın. Davranış aynı kalsın. Denetleyici yalnız servisi çağırsın.
2. Ham SQL `INSERT` yerine `identity.api.ensure_profile(user, data)` çağırın. Bu adım kimlik API'si eklendikten sonra gelir.
3. Mağaza `validate` kuralını yönetici akışına izin verecek şekilde düzeltin. Sonra `set_value` ve elle kanca çağrısı yerine `doc.save()` kullanın.
4. Olay altyapısı gelince `seller.application.approved` olayını yayınlayın.
5. Profil, rol ve bildirim adımlarını tek tek olay işleyicisine taşıyın. Her taşıma ayrı PR olsun. Her PR servisten bir doğrudan çağrıyı siler.

## Riskler ve testler
- Onay yarım kalırsa mağaza açılır ama satıcı rol alamaz. Olay işleyicisi tekrar denenebilir olmalı. Tekrar deneme testi ekleyin.
- Vergi çakışma kuralı (`TaxConflictError`) korunmalı. Aynı vergi numarasıyla ikinci mağaza testi ekleyin.
- Deneme aboneliği iki kez açılmamalı. Aynı olay iki kez gelince tek abonelik testi ekleyin.
- Ret sonrası mağaza askıya alınmalı ve rol kalkmalı. Ret testi ekleyin.
