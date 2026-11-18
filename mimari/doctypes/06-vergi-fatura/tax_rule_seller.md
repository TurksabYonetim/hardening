# Tax Rule Seller

- Bağlam: 06-vergi-fatura
- Tür: Alt tablo
- Klasör: `tradehub_core/tradehub_core/doctype/tax_rule_seller`
- Denetleyici: `tradehub_core/tradehub_core/doctype/tax_rule_seller/tax_rule_seller.py` (5 satır)
- Önerilen sahip bağlam: 06-vergi-fatura

## Epic

- Epic adı: Tax Rule Seller: 06-vergi-fatura bağlamına taşıma
- Öncelik: Düşük
- Faz: Faz 3
- Tahmini büyüklük: Küçük

### User story

Bir geliştirici olarak, silinen mağazanın vergi kuralında kalmamasını istiyorum.
Böylece kural kaydı hata vermez.

### Kabul kriterleri

- [ ] Satır `Tax Rule` ile aynı pakette.
- [ ] `store.deleted` olayı satırı temizliyor.
- [ ] Kural kaydı silinmiş mağaza ile hata vermiyor.
- [ ] Characterization test: `Tax Rule Seller` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- Satırı ana kayıt dışında yazmayın.
- Mağaza tablosuna vergi kodundan yazmayın.
- `seller_scope` boşken satıra güvenmeyin.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] Mağaza silme testi eklendi.
- [ ] `tax_core` testleri geçiyor.
- [ ] `ruff` kontrolü geçiyor.
- [ ] `CODEOWNERS` sahibinden inceleme istendi.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?
`Tax Rule Seller` bir vergi kuralını kullanabilen satıcıyı tutar. Bu satırlar yalnız kural "Selected Sellers" kapsamındaysa anlam taşır.

## Bugünkü bağımlılıklar
### Bu kaydın bağlandığı kayıtlar
- `Admin Seller Profile` (`seller_profile`): başka bağlam (02-satici-magaza)

### Bu kayda dokunan kod
- `tradehub_core/tax_core/service.py:54`: okuyor (`_seller_allowed`, ana kayıt üzerinden)
- Ad ile doğrudan referans bulunmadı.

### hooks.py kayıtları
- Kayıt yok.

## Bağımlılık sorunları
Önemli bir bağımlılık sorunu bulunmadı.

## Hedef tasarım
- Sahip bağlam: 06-vergi-fatura. Paket yolu: `tradehub_core/tax/`.
- Dışarıya açılan fonksiyon yoktur. Satırlar `Tax Rule` ile okunur.
- Dinlediği olaylar: `store.deleted` (02-satici-magaza). Silinen mağazanın satırı temizlenir.
- `seller_profile` Link alanı kalır.

## Geçiş adımları
1. `Tax Rule` ile aynı PR içinde taşıyın.
2. `store.deleted` olayı tanımlanınca temizlik işleyicisini ekleyin.

## Riskler ve testler
- Silinen mağaza kuralda kalabilir. Test: mağaza silinince satır temizlenmeli ya da kayıt hata vermemeli.
