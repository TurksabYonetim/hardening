# Listing Bulk Pricing Tier

- Bağlam: 03a-katalog
- Tür: Alt tablo
- Klasör: `tradehub_core/tradehub_core/doctype/listing_bulk_pricing_tier`
- Denetleyici: `tradehub_core/tradehub_core/doctype/listing_bulk_pricing_tier/listing_bulk_pricing_tier.py` (5 satır)
- Önerilen sahip bağlam: 03a-katalog

## Epic

- Epic adı: Listing Bulk Pricing Tier: 03a-katalog bağlamına taşıma
- Öncelik: Önemli
- Faz: Faz 4
- Tahmini büyüklük: Küçük

### User story

Bir alıcı olarak, toptan fiyatın sepette ve ürün sayfasında aynı çıkmasını istiyorum.
Böylece fiyat kuralı tek yerde hesaplanır ve yanlış fiyat ödemem.

### Kabul kriterleri

- [ ] `catalog/api.py` içinde `get_offer_price` var. `api/cart.py` ve `api/listing.py` bunu çağırıyor.
- [ ] Basamak hesabı iki yerde değil tek yerde. `grep` ile `Listing Bulk Pricing Tier` okuması yalnız `catalog/` içinde.
- [ ] `b2b_enabled=0` üründe basamak uygulanmıyor. Test var.
- [ ] `replace_pricing_tiers` paylaşım için var.
- [ ] Characterization test: `Listing Bulk Pricing Tier` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- Sepet kodunda basamak fiyatını yeniden hesaplamayın. `get_offer_price` çağırın.
- Paylaşım bağlamından satırları doğrudan silmeyin.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] `get_offer_price` için 10 adet ve B2B kapalı testleri eklendi.
- [ ] Sepet fiyat testleri geçiyor.
- [ ] `CODEOWNERS` katalog ve sipariş ekiplerinden inceleme istendi.
- [ ] Ruff lint temiz.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?
Bu alt tablo toptan fiyat basamaklarını tutar. Örneğin 10 adetten sonra daha düşük fiyat. Sepet miktara göre doğru basamağı seçer. Ana kayıt `Listing` kaydıdır.

## Bugünkü bağımlılıklar
### Bu kaydın bağlandığı kayıtlar
- Link alanı yok.
### Bu kayda dokunan kod
- `tradehub_core/tradehub_core/doctype/listing/listing.py:705-723`: basamak doğrulaması ve `get_price_for_qty`
- `tradehub_core/api/cart.py:736`: sepet basamakları `frappe.get_all` ile okuyor (04)
- `tradehub_core/api/listing.py:1205,3598,4272`: vitrin okuyor
- `tradehub_core/api/seller.py:450,1606`: satıcı paneli okuyor (02)
- `tradehub_core/shared_sync/projections.py:511-513`: paylaşım bağlamı siliyor ve yeniden oluşturuyor
### hooks.py kayıtları
- Kayıt yok.

## Bağımlılık sorunları
1. `tradehub_core/api/cart.py:736` sipariş bağlamı fiyat basamağını kendi hesaplıyor. Katalogda `get_price_for_qty` (`listing.py:718`) zaten var. Fiyat kuralı iki yerde.
2. `tradehub_core/shared_sync/projections.py:511-513` paylaşım bağlamı satırları doğrudan siliyor ve yazıyor.

## Hedef tasarım
- Sahip bağlam `03a-katalog`, paket yolu `tradehub_core/catalog/`.
- Dışarıya açılan fonksiyon (`catalog/api.py`): `get_offer_price(listing, qty, variant_row=None)` fiyatı tek yerden verir. Sepet ve vitrin bunu çağırır. `replace_pricing_tiers(listing, rows)` paylaşım için.
- Olay yok.
- Başka bağlamlara bağlantı yok. Sepet satırı fiyatı anlık görüntü olarak saklar.
- Denetleyicide kalacak doğrulamalar: basamak sırası ve eksi fiyat kontrolü. `get_price_for_qty` servise taşınır.

## Geçiş adımları
1. `catalog/api.py` içine `get_offer_price` ekleyin. `listing.py:718` mantığı buraya taşınır.
2. `api/cart.py:736` ve `api/listing.py:1205` okumalarını `get_offer_price` ile değiştirin. 1. adımdan sonra gelir.
3. `replace_pricing_tiers` yazın. `shared_sync/projections.py:511` bunu çağırır.

## Riskler ve testler
- 10 adet için doğru basamak fiyatı seçilmeli. Test: `get_offer_price(listing, 10)` basamak fiyatını verir.
- B2B kapalıysa basamak uygulanmamalı. Test: `b2b_enabled=0` ürün satış fiyatını verir.
