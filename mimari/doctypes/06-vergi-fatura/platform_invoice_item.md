# Platform Invoice Item

- Bağlam: 06-vergi-fatura
- Tür: Alt tablo
- Klasör: `tradehub_core/tradehub_core/doctype/platform_invoice_item`
- Denetleyici: `tradehub_core/tradehub_core/doctype/platform_invoice_item/platform_invoice_item.py` (8 satır)
- Önerilen sahip bağlam: 06-vergi-fatura

## Epic

- Epic adı: Platform Invoice Item: 06-vergi-fatura bağlamına taşıma
- Öncelik: Düşük
- Faz: Faz 3
- Tahmini büyüklük: Küçük

### User story

Bir geliştirici olarak, eski fatura kalemlerinin toplamla uyuşmasını istiyorum.
Böylece muhasebe farkı çıkmaz.

### Kabul kriterleri

- [ ] Satır `Platform Invoice` ile aynı PR içinde taşındı.
- [ ] Kalem toplamı fatura toplamına eşit.
- [ ] Yuvarlama yaması tekrar çalışınca veri değişmiyor.
- [ ] Characterization test: `Platform Invoice Item` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- Satırı ana kayıt dışında yazmayın.
- Kalem tutarını `Banker's Rounding` ile yuvarlamayın. Kural `utils/pricing.py` içindedir.
- `listing` alanını güncel ilan fiyatı için kullanmayın.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] Toplam testi geçiyor.
- [ ] Yama tekrar çalıştırıldı ve değişiklik üretmedi.
- [ ] `ruff` kontrolü geçiyor.
- [ ] `CODEOWNERS` sahibinden inceleme istendi.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?
`Platform Invoice Item` eski faturanın kalem satırıdır. Satır ilanı, adedi, birim fiyatı, KDV oranını ve tutarı tutar.

## Bugünkü bağımlılıklar
### Bu kaydın bağlandığı kayıtlar
- `Listing` (`listing`): başka bağlam (03a-katalog)

### Bu kayda dokunan kod
- `tradehub_core/tradehub_core/doctype/platform_invoice/platform_invoice.py:109`: yazıyor (kalem tutarı)
- `tradehub_core/api/invoice.py:81`: yazıyor (ana kayıtla birlikte)
- `tradehub_core/patches/v15_9_84_mogem654_fatura_tutar_yuvarlama.py:148`: okuyor (yama)

### hooks.py kayıtları
- Kayıt yok.

## Bağımlılık sorunları
Önemli bir bağımlılık sorunu bulunmadı.

## Hedef tasarım
- Sahip bağlam: 06-vergi-fatura. Paket yolu: `tradehub_core/tax/invoicing/`.
- Dışarıya açılan fonksiyon ve olay yoktur.
- `listing` Link alanı kalır. `item_name` ve `unit_price` anlık görüntüdür.

## Geçiş adımları
1. `Platform Invoice` ile aynı PR içinde taşıyın.

## Riskler ve testler
- Yuvarlama farkı geri gelebilir. Test: kalem toplamı fatura toplamına eşit olmalı.
