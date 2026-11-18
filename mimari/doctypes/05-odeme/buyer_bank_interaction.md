# Buyer Bank Interaction

- Bağlam: 05-odeme
- Tür: Ana kayıt
- Klasör: `tradehub_core/tradehub_core/doctype/buyer_bank_interaction`
- Denetleyici: `tradehub_core/tradehub_core/doctype/buyer_bank_interaction/buyer_bank_interaction.py` (5 satır)
- Önerilen sahip bağlam: 05-odeme

## Epic

- Epic adı: Buyer Bank Interaction: 05-odeme bağlamına taşıma
- Öncelik: Önemli
- Faz: Faz 3
- Tahmini büyüklük: Küçük

### User story

Bir geliştirici olarak, havale özetini yalnız ödeme olaylarının güncellemesini istiyorum.
Böylece satıcı ekranındaki toplam kaymaz.

### Kabul kriterleri

- [ ] Güncelleme fonksiyonları `payments/legacy_view.py` içinde.
- [ ] `api/order.py` bu kayda yazmıyor.
- [ ] Dekont onayı sonrası bekleyen tutar azalıyor.
- [ ] Characterization test: `Buyer Bank Interaction` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- Sipariş API'sinden `upsert_bank_interaction` çağırmayın.
- IBAN alanını asıl kaynak gibi kullanmayın.
- Toplamları elle düzeltmeyin.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] Havale toplamı testi geçiyor.
- [ ] Olay dinleyici testi eklendi.
- [ ] `import-linter` kontrolü geçiyor.
- [ ] Sipariş ekibinden inceleme istendi.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?
`Buyer Bank Interaction` bir alıcının bir satıcıya yaptığı havalelerin özetidir. Kayıt toplam havale tutarını ve eşleşme bekleyen tutarı tutar. Satıcının IBAN ve banka adı da düz metin olarak saklanır.

## Bugünkü bağımlılıklar
### Bu kaydın bağlandığı kayıtlar
- `User` (`buyer`): framework kaydı
- `Currency` (`currency`): framework kaydı
- `seller` alanı Link değil, düz metindir.

### Bu kayda dokunan kod
- `tradehub_core/api/payment.py:889`: yazıyor (`upsert_bank_interaction`)
- `tradehub_core/api/payment.py:924`: yazıyor (`update_bank_interaction_on_confirm`)
- `tradehub_core/payments/installment_seller.py:276`: yazıyor (`db.set_value`)
- `tradehub_core/api/order.py:1083`: `api.payment.upsert_bank_interaction` çağırır
- `tradehub_core/api/order.py:1414`: `api.payment.update_bank_interaction_on_confirm` çağırır
- `tradehub_core/api/payment.py:453`: okuyor (satıcı ekranı)

### hooks.py kayıtları
- Kayıt yok.

## Bağımlılık sorunları
1. Sipariş API'si bu özeti ödeme API dosyası üzerinden yazıyor (`api/order.py:1083`, `api/order.py:1414`). İki uç nokta dosyası birbirine bağlı.
2. Satıcının IBAN bilgisi burada kopya olarak duruyor. Asıl kaynak `Seller Bank Account Version` kaydıdır. İki kaynak ayrışabilir.

## Hedef tasarım
- Sahip bağlam: 05-odeme. Paket yolu: `tradehub_core/payments/legacy_view.py`.
- Kayıt bir okuma modeli olur. Yalnız ödeme bağlamı yazar.
- Dinlediği olaylar: `payment.evidence_submitted` ve `payment.collected` (aynı bağlam).
- Dışarıya açılan fonksiyon: `payments.api.list_bank_interactions(seller, filters)`.
- IBAN alanları `bank_account_version` bağlantısıyla değiştirilir. Bu bir öneridir.

## Geçiş adımları
1. `upsert_bank_interaction` ve `update_bank_interaction_on_confirm` fonksiyonlarını `payments/legacy_view.py` içine taşıyın.
2. `api/order.py:1083` ve `api/order.py:1414` çağrılarını kaldırın. Güncellemeyi ödeme olayları yapsın.

## Riskler ve testler
- Satıcı ekranındaki havale toplamı kayabilir. Test: dekont onayı sonrası bekleyen tutar azalmalı.
