# Payment Installment

- Bağlam: 05-odeme
- Tür: Alt tablo
- Klasör: `tradehub_core/tradehub_core/doctype/payment_installment`
- Denetleyici: `tradehub_core/tradehub_core/doctype/payment_installment/payment_installment.py` (11 satır)
- Önerilen sahip bağlam: 05-odeme

## Epic

- Epic adı: Payment Installment: 05-odeme bağlamına taşıma
- Öncelik: Düşük
- Faz: Faz 3
- Tahmini büyüklük: Küçük

### User story

Bir geliştirici olarak, taksit satırlarını okuma modelinden almak istiyorum.
Böylece alt tablo değişince başka kod bozulmaz.

### Kabul kriterleri

- [ ] `get_active_plan` satırları veriyor.
- [ ] `shared_sync` alt tabloyu doğrudan okumuyor.
- [ ] Kısmi ödemede kalan tutar doğru azalıyor.
- [ ] Characterization test: `Payment Installment` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- Satırı plan dışında yazmayın.
- Kalan tutarı elle düzeltmeyin. Dağıtımdan türetilir.
- Başka pakette `tabPayment Installment` sorgusu yazmayın.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] Kalan tutar testi geçiyor.
- [ ] Okuma modeli testi eklendi.
- [ ] `ruff` kontrolü geçiyor.
- [ ] `CODEOWNERS` sahibinden inceleme istendi.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?
`Payment Installment` taksit planının tek satırıdır. Satır taksit numarasını, vadeyi ve tutarı tutar. Ödenen ve kalan tutar da satırda saklanır.

## Bugünkü bağımlılıklar
### Bu kaydın bağlandığı kayıtlar
- Bağlantı alanı yok.

### Bu kayda dokunan kod
- `tradehub_core/payments/installments.py:42`: yazıyor ve okuyor
- `tradehub_core/payments/payment_summary.py:240`: okuyor
- `tradehub_core/payments/seller_order_summary.py:44`: okuyor
- `tradehub_core/shared_sync/seller_records.py:257`: okuyor

### hooks.py kayıtları
- Kayıt yok.

## Bağımlılık sorunları
1. `shared_sync` alt tabloyu doğrudan okuyor (`shared_sync/seller_records.py:257`).

## Hedef tasarım
- Sahip bağlam: 05-odeme.
- Dışarıya açılan fonksiyon: `payments.api.get_active_plan` satırları da verir.
- Olay yoktur.

## Geçiş adımları
1. `shared_sync/seller_records.py:257` okumasını `get_active_plan` çağrısına çevirin.

## Riskler ve testler
- Kalan tutar yanlış hesaplanabilir. Test: kısmi ödemede `outstanding_amount` doğru azalmalı.
