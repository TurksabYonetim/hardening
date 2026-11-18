# Email Verification Log

- Bağlam: 01-kimlik-erisim
- Tür: Kayıt defteri (log)
- Klasör: `tradehub_core/tradehub_core/doctype/email_verification_log`
- Denetleyici: `tradehub_core/tradehub_core/doctype/email_verification_log/email_verification_log.py` (14 satır)
- Önerilen sahip bağlam: 01-kimlik-erisim

## Epic

- Epic adı: Email Verification Log: 01-kimlik-erisim bağlamına taşıma
- Öncelik: Düşük
- Faz: Faz 4
- Tahmini büyüklük: Küçük

### User story

Bir geliştirici olarak, e-posta doğrulama kaydını kimlik paketinde yazmak istiyorum.
Böylece hesap silmede bu kayıt da temizlenir.

### Kabul kriterleri

- [ ] Yazma kodu `tradehub_core/identity/verification/` altında duruyor.
- [ ] `erase_user_data` bu kaydı siliyor. Test geçiyor.
- [ ] Kayıt yazılamazsa doğrulama yine tamamlanıyor. Test geçiyor.
- [ ] Characterization test: `Email Verification Log` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- Bu kayda IP dışında yeni kişisel veri eklemeyin.
- `api/v1/identity.py` iç fonksiyonunu başka bağlamdan çağırmayın.
- Kayıt hatası yüzünden doğrulamayı durdurmayın.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] Değişen davranış için önce başarısız olan test yazıldı.
- [ ] Ruff ve ilgili testler yerelde geçiyor.
- [ ] `import-linter` kontrolü yeni ihlal üretmiyor.
- [ ] `CODEOWNERS` içindeki 01-kimlik-erisim sahibi inceleyici olarak eklendi.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?
Bu kayıt e-posta doğrulama olaylarının izidir. Doğrulama, değişiklik ve yönetici müdahalesini tutar. IP adresi ve tarayıcı bilgisi de saklanır.

## Bugünkü bağımlılıklar
### Bu kaydın bağlandığı kayıtlar
- `User` (`user`, `actor`): Frappe çekirdeği
### Bu kayda dokunan kod
- `tradehub_core/api/v1/identity.py:164`: DocType var mı diye bakıyor
- `tradehub_core/api/v1/identity.py:166`: kaydı oluşturuyor
### hooks.py kayıtları
- Kayıt yok.

## Bağımlılık sorunları
1. Önemli bir bağımlılık sorunu bulunmadı.
2. Kayıt kişisel veri (IP) tutuyor. Hesap silme akışında temizlenip temizlenmediği doğrulanmadı.

## Hedef tasarım
- Sahip bağlam: 01-kimlik-erisim. Paket yolu: `tradehub_core/identity/verification/`.
- Dışa açık fonksiyon gerekmez. Yazma iç servis fonksiyonudur.
- Yayınladığı olay: `identity.email.verified` (alan: `user`, `method`).
- Gizlilik bağlamı (13) silme isteğinde `identity.api.erase_user_data(user)` çağırır.
- Denetleyici boş kalabilir.

## Geçiş adımları
1. Yazma kodunu `identity.py:160-170` bölümünden `tradehub_core/identity/verification/` altına taşıyın.
2. `erase_user_data` içine bu kaydı ekleyin.

## Riskler ve testler
- Kayıt yazılamazsa doğrulama durmamalı. Hata testi ekleyin.
