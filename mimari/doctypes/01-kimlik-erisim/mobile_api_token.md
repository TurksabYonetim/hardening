# Mobile API Token

- Bağlam: 01-kimlik-erisim
- Tür: Kayıt defteri (oturum anahtarı)
- Klasör: `tradehub_core/tradehub_core/doctype/mobile_api_token`
- Denetleyici: `tradehub_core/tradehub_core/doctype/mobile_api_token/mobile_api_token.py` (5 satır)
- Önerilen sahip bağlam: 01-kimlik-erisim

## Epic

- Epic adı: Mobile API Token: 01-kimlik-erisim bağlamına taşıma
- Öncelik: Önemli
- Faz: Faz 4
- Tahmini büyüklük: Küçük

### User story

Bir alıcı olarak, hesabımı silince mobil oturumlarımın da kapanmasını istiyorum.
Böylece eski cihazdan erişim kalmaz.

### Kabul kriterleri

- [ ] `revoke_user_tokens(user)` fonksiyonu var. `identity.py` ve `account_deletion.py` bu fonksiyonu kullanıyor.
- [ ] `privacy/account_deletion.py` içinde `Mobile API Token` adı geçmiyor.
- [ ] İptal edilen anahtarla istek reddediliyor. Test geçiyor.
- [ ] `tradehub_core/tests/test_account_deletion_backend.py` geçiyor.
- [ ] Characterization test: `Mobile API Token` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- Gizlilik bağlamından bu tabloyu doğrudan silmeyin. Silme kimlik API'si ile yapılır.
- Anahtar değerini loga yazmayın.
- Süre kontrolünü yalnız API dosyasında bırakmayın. Kural servis fonksiyonunda olmalı.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] Değişen davranış için önce başarısız olan test yazıldı.
- [ ] Ruff ve ilgili testler yerelde geçiyor.
- [ ] `import-linter` kontrolü yeni ihlal üretmiyor.
- [ ] `CODEOWNERS` içindeki 01-kimlik-erisim sahibi inceleyici olarak eklendi.
- [ ] Gizlilik bağlamı (13) sahibi inceleyici olarak eklendi.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?
Bu kayıt mobil uygulama oturum anahtarıdır. Her kayıt bir kullanıcı ve bir cihaz tutar. Kayıt erişim anahtarını ve yenileme anahtarını saklar. `revoked` alanı iptal edilen anahtarı işaretler.

## Bugünkü bağımlılıklar
### Bu kaydın bağlandığı kayıtlar
- `User` (`user`): Frappe çekirdeği
### Bu kayda dokunan kod
- `tradehub_core/api/mobile_api.py:103`: anahtarı oluşturuyor
- `tradehub_core/api/mobile_api.py:173`: iptal edilmiş mi diye okuyor
- `tradehub_core/api/v1/identity.py:2053`: kullanıcının tüm anahtarlarını `frappe.db.delete` ile siliyor
- `tradehub_core/privacy/account_deletion.py:350`: hesap silmede anahtarları siliyor
### hooks.py kayıtları
- Kayıt yok.

## Bağımlılık sorunları
1. İki ayrı yer aynı silme işini yapıyor. Kanıt: `tradehub_core/api/v1/identity.py:2053` ve `tradehub_core/privacy/account_deletion.py:350`. Gizlilik bağlamı (13) kimlik tablosunu doğrudan siliyor.
2. Denetleyici boş. Süre ve iptal kuralı yalnız API dosyasında (`mobile_api.py:173`).

## Hedef tasarım
- Sahip bağlam: 01-kimlik-erisim. Paket yolu: `tradehub_core/identity/sessions/`.
- Dışa açık fonksiyonlar: `issue_mobile_token(user, device)`, `is_mobile_token_valid(user, token) -> bool`, `revoke_user_tokens(user) -> int`.
- Dinlediği olay: `privacy.account_deletion_requested`. Gelirse kullanıcının anahtarlarını siler.
- Yayınladığı olay yok.
- Denetleyicide `expires_at` alanının `issued_at` alanından sonra olması kontrol edilir.

## Geçiş adımları
1. `revoke_user_tokens` fonksiyonunu ekleyin. `identity.py:2053` satırını bu fonksiyona bağlayın.
2. `account_deletion.py:350` döngüsünden bu DocType'ı çıkarın. Yerine `identity.api.revoke_user_tokens` çağırın.
3. Sonra bu çağrıyı olay işleyicisine çevirin. Bu adım olay altyapısından sonra gelir.

## Riskler ve testler
- Silinen hesapta anahtar kalırsa güvenlik açığı oluşur. `tradehub_core/tests/test_account_deletion_backend.py` testi korunmalı.
- İptal edilen anahtarla istek reddedilmeli. Bunun için test ekleyin.
