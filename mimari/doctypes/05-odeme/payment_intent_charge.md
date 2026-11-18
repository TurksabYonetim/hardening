# Payment Intent Charge

- Bağlam: 05-odeme
- Tür: Alt tablo
- Klasör: `tradehub_core/tradehub_core/doctype/payment_intent_charge`
- Denetleyici: `tradehub_core/tradehub_core/doctype/payment_intent_charge/payment_intent_charge.py` (5 satır)
- Önerilen sahip bağlam: 05-odeme

## Epic

- Epic adı: Payment Intent Charge: 05-odeme bağlamına taşıma
- Öncelik: Düşük
- Faz: Faz 3
- Tahmini büyüklük: Küçük

### User story

Bir geliştirici olarak, talep kalemlerini okuma modelinden almak istiyorum.
Böylece alt tablo değişince senkron kodu bozulmaz.

### Kabul kriterleri

- [ ] `get_payment_status` sonucu kalemleri veriyor.
- [ ] `shared_sync/seller_records.py` alt tabloyu doğrudan okumuyor.
- [ ] Kalem doğrulaması `payment_intent.py:194` içinde kalıyor.
- [ ] Characterization test: `Payment Intent Charge` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- Bu alt tabloya talep dışından yazmayın.
- Kalem tutarını negatif yapmayın.
- Başka bağlamda `tabPayment Intent Charge` sorgusu yazmayın.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] Okuma modeli testi eklendi.
- [ ] `shared_sync` testleri geçiyor.
- [ ] `ruff` kontrolü geçiyor.
- [ ] `CODEOWNERS` sahibinden inceleme istendi.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?
`Payment Intent Charge` ödeme talebinin ek kalemidir. Kalem alıcı ücreti ya da tedarikçi komisyonu olabilir. Kalem tarafı ve tutarı tutar.

## Bugünkü bağımlılıklar
### Bu kaydın bağlandığı kayıtlar
- `Currency` (`currency`): framework kaydı
- `party` alanı düz metindir. Tür `party_type` alanında yazılır.

### Bu kayda dokunan kod
- `tradehub_core/payments/service.py:208`: yazıyor (`intent.append("charges", row)`)
- `tradehub_core/tradehub_core/doctype/payment_intent/payment_intent.py:194`: okuyor (doğrulama)
- `tradehub_core/shared_sync/seller_records.py:252`: okuyor

### hooks.py kayıtları
- Kayıt yok.

## Bağımlılık sorunları
1. `shared_sync` paketi alt tabloyu doğrudan okuyor (`shared_sync/seller_records.py:252`). Okuma modeli yok.

## Hedef tasarım
- Sahip bağlam: 05-odeme.
- Dışarıya açılan fonksiyon: `payments.api.get_payment_status` sonucu kalemleri de taşır.
- Olay yoktur.
- Denetleyicide kalacak doğrulama: ana kayıttaki `_validate_charges` (`payment_intent.py:194`).

## Geçiş adımları
1. `shared_sync/seller_records.py:252` okumasını `get_payment_status` çağrısına çevirin.

## Riskler ve testler
- Komisyon kaybolabilir. Test: talep okuma modeli kalemleri tam vermeli.
