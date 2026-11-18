# API Application

- Bağlam: 01-kimlik-erisim
- Tür: Ana kayıt
- Klasör: `tradehub_core/tradehub_core/doctype/api_application`
- Denetleyici: `tradehub_core/tradehub_core/doctype/api_application/api_application.py` (11 satır)
- Önerilen sahip bağlam: 01-kimlik-erisim

## Epic

- Epic adı: API Application: 01-kimlik-erisim bağlamına taşıma
- Öncelik: Önemli
- Faz: Faz 4
- Tahmini büyüklük: Orta

### User story

Bir geliştirici olarak, dış uygulama kimliğini tek bir fonksiyonla doğrulamak istiyorum.
Böylece doğrulama kuralı üç dosyada ayrı ayrı bozulmaz.

### Kabul kriterleri

- [ ] `identity.api.verify_client` fonksiyonu var. `public_api.py`, `_catalog_auth.py` ve `catalog_integration.py` bu fonksiyonu kullanıyor.
- [ ] `API Application` kaydını yalnız `identity` paketi `get_doc` ile açıyor. Arama sonucu boş dönüyor.
- [ ] `outbound.py` içinde `webhook_failures` alanına doğrudan yazma yok. Yazma `record_webhook_result` ile yapılıyor.
- [ ] Doğru ve yanlış anahtar için iki test geçiyor.
- [ ] Characterization test: `API Application` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- `integration/outbound.py` içinden `API Application` alanlarına `set_value` ile yazmayın. Sayacı yalnız kimlik bağlamı değiştirir.
- Gizli anahtarı loga ya da hata mesajına yazmayın. `test_secret_access_audit.py` bunu denetler.
- `client_id` üretimini denetleyiciden başka yere kopyalamayın. Anahtar tek yerde üretilir.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] Değişen davranış için önce başarısız olan test yazıldı.
- [ ] Ruff ve ilgili testler yerelde geçiyor.
- [ ] `import-linter` kontrolü yeni ihlal üretmiyor.
- [ ] `CODEOWNERS` içindeki 01-kimlik-erisim sahibi inceleyici olarak eklendi.
- [ ] `tradehub_core/tests/test_secret_access_audit.py` geçiyor.
- [ ] `tradehub_core/tests/test_mogem665_d_bildirim.py` geçiyor.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?
Bu kayıt dış yazılımların platforma bağlanma kimliğidir. Her uygulamanın bir `client_id` ve gizli anahtarı vardır. Uygulama izin listesini `scopes` alt tablosunda tutar. Webhook (dış sisteme otomatik bildirim) adresi ve hata sayacı da burada durur.

## Bugünkü bağımlılıklar
### Bu kaydın bağlandığı kayıtlar
- `API Scope` (`scopes`): aynı bağlam, alt tablo
- `Admin Seller Profile` (`seller_profile`): başka bağlam (02-satici-magaza)
### Bu kayda dokunan kod
- `tradehub_core/tradehub_core/doctype/api_application/api_application.py:7`: `before_insert` içinde anahtar üretiyor
- `tradehub_core/api/v1/public_api.py:49`: istemci doğrulaması için okuyor
- `tradehub_core/api/v1/public_api.py:56`: gizli anahtarı okumak için `get_doc` çağırıyor
- `tradehub_core/api/v1/_catalog_auth.py:159`: katalog API kimliğini okuyor
- `tradehub_core/api/catalog_integration.py:63`: kaydı açıyor, `catalog_integration.py:95`, `:148`, `:171` yazıyor
- `tradehub_core/api/catalog_integration.py:108`: yeni kayıt oluşturuyor
- `tradehub_core/integration/outbound.py:131`: webhook gizli anahtarını okuyor
- `tradehub_core/integration/outbound.py:171`: `webhook_failures` alanını `set_value` ile yazıyor
### hooks.py kayıtları
- Bu DocType için `doc_events`, `permission_query_conditions` veya `has_permission` kaydı yok.

## Bağımlılık sorunları
1. Üç ayrı paket kaydı doğrudan açıyor. Kanıt: `tradehub_core/api/v1/public_api.py:56`, `tradehub_core/api/catalog_integration.py:63`, `tradehub_core/integration/outbound.py:131`. Kimlik bağlamı kendi kaydının sahibi değil gibi davranıyor.
2. Webhook gönderici kodu hata sayacını doğrudan yazıyor. Kanıt: `tradehub_core/integration/outbound.py:171`. Bildirim bağlamı (12) değişirse kimlik verisi bozulabilir.
3. Satır düzeyi izin kuralı yok. Kayıt `seller_profile` taşıyor ama `hooks.py` içinde izin kaydı yok. Erişim yalnız rol izniyle sınırlı (doğrulanmadı: rol izinleri yeterli mi).

## Hedef tasarım
- Sahip bağlam: 01-kimlik-erisim. Paket yolu: `tradehub_core/identity/api_clients/`.
- Dışa açık fonksiyonlar (`tradehub_core/identity/api.py`):
  - `verify_client(client_id, client_secret) -> ApiClientIdentity`
  - `get_webhook_target(app_name) -> WebhookTarget | None`
  - `record_webhook_result(app_name, ok: bool)`
  - `create_api_client(seller, name, scopes) -> ApiClientCredentials`
- Yayınladığı olaylar: `identity.api_client.created`, `identity.api_client.disabled`.
- Dinlediği olaylar: `seller.store.suspended` gelirse mağazanın uygulamalarını kapatır.
- Kalacak Link: `seller_profile` alanı `Admin Seller Profile` kök kaydına bağlı kalır.
- Denetleyicide kalacak kural: anahtar üretimi ve `client_id` tekliği.
- Servise taşınacak kural: istemci doğrulama, webhook sayacı ve kapsam kontrolü.

## Geçiş adımları
1. `tradehub_core/identity/api.py` içine `verify_client` fonksiyonunu ekleyin. Kodu `public_api.py:36` bölümünden taşıyın.
2. `public_api.py`, `_catalog_auth.py` ve `catalog_integration.py` dosyalarını yeni fonksiyona bağlayın. Bu adım 1. adımdan sonra gelir.
3. `record_webhook_result` fonksiyonunu ekleyin. `outbound.py:171` satırını bu fonksiyona çevirin.
4. DocType JSON `module` alanını yeni kimlik modülüne taşıyın. Bu adım 1-3 bittikten sonra gelir.
5. `seller.store.suspended` olayını dinleyen işleyiciyi ekleyin. Bu adım olay altyapısı kurulduktan sonra gelir.

## Riskler ve testler
- İstemci doğrulaması bozulursa dış entegrasyonlar durur. `verify_client` için doğru ve yanlış anahtar testi ekleyin.
- Webhook sayacı yanlış artarsa uygulama kapanabilir. Mevcut `tradehub_core/tests/test_mogem665_d_bildirim.py` testleri korunmalı.
- Gizli anahtar okuma denetimi `tradehub_core/tests/test_secret_access_audit.py` ile korunmalı.
