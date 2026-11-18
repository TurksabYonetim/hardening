# Payment Provider Credential

- Bağlam: 05-odeme
- Tür: Ayar (single değil, sağlayıcı başına kayıt)
- Klasör: `tradehub_core/tradehub_core/doctype/payment_provider_credential`
- Denetleyici: `tradehub_core/tradehub_core/doctype/payment_provider_credential/payment_provider_credential.py` (13 satır)
- Önerilen sahip bağlam: 05-odeme

## Epic

- Epic adı: Payment Provider Credential: 05-odeme bağlamına taşıma
- Öncelik: Düşük
- Faz: Faz 3
- Tahmini büyüklük: Küçük

### User story

Bir geliştirici olarak, sağlayıcı anahtarlarının ödeme bağlamı dışına çıkmamasını istiyorum.
Böylece gizli anahtar sızmaz.

### Kabul kriterleri

- [ ] Anahtar yalnız `payments/credentials.py` ile okunuyor.
- [ ] Hata kaydında anahtar değeri görünmüyor.
- [ ] İzin kancası değişmeden çalışıyor.
- [ ] Characterization test: `Payment Provider Credential` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- Anahtarı loga ya da yanıta yazmayın.
- Anahtarı Git deposuna koymayın.
- Başka bağlamdan `get_decrypted_password` ile okumayın.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] Gizli veri sızıntı testi geçiyor.
- [ ] İzin testi geçiyor.
- [ ] `ruff` kontrolü geçiyor.
- [ ] `CODEOWNERS` sahibinden inceleme istendi.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?
`Payment Provider Credential` ödeme sağlayıcısının gizli anahtarını tutar. Anahtar ortama ve amaca göre ayrılır. Ortam "sandbox" ya da "production" olur. Anahtar `Password` alanında şifreli saklanır.

## Bugünkü bağımlılıklar
### Bu kaydın bağlandığı kayıtlar
- `User` (`rotated_by`): framework kaydı

### Bu kayda dokunan kod
- `tradehub_core/payments/credentials.py:49`: yazıyor (anahtarı döndürür)
- `tradehub_core/payments/credentials.py:105`: okuyor (şifreyi çözer)

### hooks.py kayıtları
- `hooks.py:1529` ve `hooks.py:1532`: liste ve kayıt izni `payments.credentials` içindedir.

## Bağımlılık sorunları
Önemli bir bağımlılık sorunu bulunmadı.

## Hedef tasarım
- Sahip bağlam: 05-odeme.
- Dışarıya açılan fonksiyon yoktur. Gizli anahtar bağlam dışına çıkmaz.
- Olay yoktur.

## Geçiş adımları
1. Değişiklik gerekmez.

## Riskler ve testler
- Anahtar loga düşebilir. Test: hata kaydında anahtar değeri görünmemeli.
