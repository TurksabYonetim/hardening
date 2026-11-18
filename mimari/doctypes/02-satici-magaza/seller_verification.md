# Seller Verification

- Bağlam: 02-satici-magaza
- Tür: Ana kayıt (denetim talebi)
- Klasör: `tradehub_core/tradehub_core/doctype/seller_verification`
- Denetleyici: `tradehub_core/tradehub_core/doctype/seller_verification/seller_verification.py` (78 satır)
- Önerilen sahip bağlam: 02-satici-magaza

## Epic

- Epic adı: Seller Verification: 02-satici-magaza bağlamına taşıma
- Öncelik: Düşük
- Faz: Faz 4
- Tahmini büyüklük: Küçük

### User story

Bir satıcı olarak, denetim talebimin tek bir kuralla işlenmesini istiyorum.
Böylece iki ekran farklı sonuç vermez.

### Kabul kriterleri

- [ ] Denetim talebi işleri tek servis dosyasında duruyor.
- [ ] `api/seller.py` ve `api/seller_verifications.py` bu servisi çağırıyor.
- [ ] Belgesiz onay reddediliyor. Test geçiyor.
- [ ] Characterization test: `Seller Verification` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- Aynı kuralı iki API dosyasında ayrı yazmayın.
- Medya kodunda belge alan adını sabit olarak yazmayın.
- Tekrar talep kontrolünü kaldırmayın.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] Değişen davranış için önce başarısız olan test yazıldı.
- [ ] Ruff ve ilgili testler yerelde geçiyor.
- [ ] `import-linter` kontrolü yeni ihlal üretmiyor.
- [ ] `CODEOWNERS` içindeki 02-satici-magaza sahibi inceleyici olarak eklendi.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?
Bu kayıt mağazanın dış kurum denetim talebidir. Örneğin bir denetim firması fabrikayı ziyaret eder. Kayıt denetim tarihi, bitiş tarihi ve belgeyi tutar. Onay için denetim belgesi zorunludur.

## Bugünkü bağımlılıklar
### Bu kaydın bağlandığı kayıtlar
- `Admin Seller Profile` (`seller`): aynı bağlam
- `Verification Source` (`source`): aynı bağlam
### Bu kayda dokunan kod
- `tradehub_core/tradehub_core/doctype/seller_verification/seller_verification.py:26`: aynı kaynak için tekrar talebi kontrol ediyor
- `tradehub_core/api/seller.py:1408`, `:1426`, `:1441`: güncelliyor
- `tradehub_core/api/seller_verifications.py:158`, `:207`, `:243`: oluşturuyor ve güncelliyor
- `tradehub_core/media/file_isolation.py:89`, `:102`: belge erişimini mağazaya bağlıyor
- `tradehub_core/media/presets.py:48`, `:87`: belge alanını tanıyor
### hooks.py kayıtları
- `tradehub_core/hooks.py:1144`: `permission_query_conditions`
- `tradehub_core/hooks.py:1270`: `has_permission`

## Bağımlılık sorunları
1. İki API dosyası aynı kaydı yönetiyor. Kanıt: `api/seller.py:1408` ve `api/seller_verifications.py:243`. Kural iki yerde ayrışabilir.
2. Medya kodu alan adlarını sabit biliyor. Kanıt: `media/presets.py:87`.

## Hedef tasarım
- Sahip bağlam: 02-satici-magaza. Paket yolu: `tradehub_core/seller/verification/`.
- Dışa açık fonksiyonlar: `request_verification(store, source)`, `list_store_verifications(store)`.
- Yayınladığı olay: `seller.verification.status_changed` (alan: `store`, `source`, `status`).
- Medya bağlamına belge alanı bildirimle verilir.
- Denetleyicide tekrar talep ve belge zorunluluğu kalır.

## Geçiş adımları
1. İki API dosyasındaki işi tek servis dosyasına taşıyın.
2. Medya alan bildirimini medya bağlamının kayıt yöntemine çevirin.

## Riskler ve testler
- Belgesiz onay engellenmeli. `test_seller_verification.py` korunmalı.
