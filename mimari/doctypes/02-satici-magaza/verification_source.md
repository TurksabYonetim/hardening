# Verification Source

- Bağlam: 02-satici-magaza
- Tür: Ayar (çok kayıtlı katalog)
- Klasör: `tradehub_core/tradehub_core/doctype/verification_source`
- Denetleyici: `tradehub_core/tradehub_core/doctype/verification_source/verification_source.py` (5 satır)
- Önerilen sahip bağlam: 02-satici-magaza

## Epic

- Epic adı: Verification Source: 02-satici-magaza bağlamına taşıma
- Öncelik: Düşük
- Faz: Faz 4
- Tahmini büyüklük: Küçük

### User story

Bir platform yöneticisi olarak, pasif doğrulama kurumunun yeni talepte seçilmemesini istiyorum.
Böylece geçersiz denetim açılmaz.

### Kabul kriterleri

- [ ] `is_verification_source_active` fonksiyonu var. İki okuyucu bunu kullanıyor.
- [ ] Medya bağlamı simge dosyasını kayıt yöntemiyle tanıyor.
- [ ] Pasif kaynak seçilemiyor. Test geçiyor.
- [ ] Characterization test: `Verification Source` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- Medya kodunda tablo adını sabit olarak yazmayın.
- Kaynak adını değiştirmeyin. Ad kaydın anahtarıdır.
- Pasif kaynak kontrolünü yalnız arayüzde bırakmayın.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] Değişen davranış için önce başarısız olan test yazıldı.
- [ ] Ruff ve ilgili testler yerelde geçiyor.
- [ ] `import-linter` kontrolü yeni ihlal üretmiyor.
- [ ] `CODEOWNERS` içindeki 02-satici-magaza sahibi inceleyici olarak eklendi.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?
Bu kayıt satıcı doğrulaması yapan kurumların listesidir. Her kaynağın adı, simgesi ve açıklaması vardır. Pasif kaynak yeni doğrulamada seçilemez.

## Bugünkü bağımlılıklar
### Bu kaydın bağlandığı kayıtlar
- Link alanı yok.
### Bu kayda dokunan kod
- `tradehub_core/api/seller_verifications.py:86`: listeliyor
- `tradehub_core/api/seller_verifications.py:149`, `:198`: etkin mi diye okuyor
- `tradehub_core/api/seller.py:1380`: okuyor
- `tradehub_core/media/usage.py:147`: simge dosyasının kullanım yerini tanıyor
### hooks.py kayıtları
- Kayıt yok.

## Bağımlılık sorunları
1. Önemli bir bağımlılık sorunu bulunmadı.
2. Medya kodu tablo adını sabit olarak biliyor. Kanıt: `media/usage.py:147`. Bu bilgi bir kayıt listesi olarak medya bağlamına bildirilmeli.

## Hedef tasarım
- Sahip bağlam: 02-satici-magaza. Paket yolu: `tradehub_core/seller/verification/`.
- Dışa açık fonksiyon: `is_verification_source_active(name) -> bool`.
- Olay yoktur.
- Medya bağlamı `media.api.register_file_owner(doctype, field)` ile bilgilendirilir.

## Geçiş adımları
1. `is_verification_source_active` fonksiyonunu ekleyin. İki okumayı buna bağlayın.
2. Medya kullanım kaydını bildirim yöntemine çevirin. Bu iş 08-medya ekibiyle ortak PR'dır.

## Riskler ve testler
- Pasif kaynak seçilememeli. `test_seller_verification.py` testi korunmalı.
