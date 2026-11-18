# Currency Rate Pair

- Bağlam: 05-odeme
- Tür: Ana kayıt
- Klasör: `tradehub_core/tradehub_core/doctype/currency_rate_pair`
- Denetleyici: `tradehub_core/tradehub_core/doctype/currency_rate_pair/currency_rate_pair.py` (5 satır)
- Önerilen sahip bağlam: 14-platform-cekirdek, paylaşılan çekirdek (`tradehub_core/shared/money/`). Kur bilgisi sepet, katalog, lojistik ve masraf merkezi tarafından okunur. Ödemeye özel değildir.

## Epic

- Epic adı: Currency Rate Pair: 14-platform-cekirdek bağlamına taşıma
- Öncelik: Önemli
- Faz: Faz 4
- Tahmini büyüklük: Orta

### User story

Bir geliştirici olarak, kur bilgisini paylaşılan çekirdekten okumak istiyorum.
Böylece sepet, lojistik ve katalog aynı kuru kullanır.

### Kabul kriterleri

- [ ] Kur fonksiyonları `shared/money/fx.py` içinde.
- [ ] Lojistik ve sepet `api/currency.py` içe aktarmıyor.
- [ ] Kur işi `tabListing` tablosuna ham SQL ile yazmıyor.
- [ ] `fx.rates_updated` olayı katalog fiyatını güncelliyor.
- [ ] Characterization test: `Currency Rate Pair` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- Kur kodundan `Listing` tablosuna yazmayın. Katalog olayı dinler.
- Kuru sıfır ya da negatif kaydetmeyin.
- `api/` katmanını başka bağlamdan içe aktarmayın.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] Kur güncelleme testi geçiyor.
- [ ] Önbellek temizliği testi geçiyor.
- [ ] `import-linter` kontrolü geçiyor.
- [ ] Katalog ve lojistik ekibinden inceleme istendi.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?
`Currency Rate Pair` iki para birimi arasındaki güncel kuru tutar. Kayıt adı `TRY-USD` biçimindedir. Kur her gün TCMB verisinden güncellenir. TCMB, Türkiye Cumhuriyet Merkez Bankası demektir.

## Bugünkü bağımlılıklar
### Bu kaydın bağlandığı kayıtlar
- Bağlantı alanı yok.

### Bu kayda dokunan kod
- `tradehub_core/services/tcmb.py:144`: yazıyor (yeni kur)
- `tradehub_core/services/tcmb.py:134`: yazıyor (`db.set_value`)
- `tradehub_core/services/tcmb.py:161`: yazıyor (eski kuru pasif yapar)
- `tradehub_core/api/currency.py:168`: okuyor (önbellekli)
- `tradehub_core/services/abac_context.py:120`: okuyor (yetki kuralında tutar çevirisi)
- `api/currency.py` fonksiyonlarını şu paketler içe aktarır: `api/cart.py`, `logistics/order_shipping.py`, `logistics/services/pricing_engine.py`, `services/cost_center.py`.

### hooks.py kayıtları
- `hooks.py:545`: `on_update`, `after_insert` ve `on_trash` olayları `api.currency.invalidate_currency_cache` çağırır.
- `hooks.py:339`: zamanlanmış görev `services.tcmb.fetch_and_update_rates` çalışır.

## Bağımlılık sorunları
1. Kur servisi katalog tablosunu ham SQL ile güncelliyor (`services/tcmb.py:205`). Bu yazım `Listing` doğrulamasını atlar. Katalog fiyat kuralı değişirse kur işi yanlış fiyat yazar. Bu sorun 03a-katalog bağlamını bağlar.
2. Kur okuma fonksiyonları `api/` katmanında duruyor (`api/currency.py`). Lojistik ve sepet bu API dosyasını içe aktarır. Paylaşılan çekirdek olması gereken kod bir uç nokta dosyasında.

## Hedef tasarım
- Sahip bağlam: paylaşılan çekirdek. Paket yolu: `tradehub_core/shared/money/fx.py`.
- Dışarıya açılan fonksiyonlar: `shared.money.get_rate(from_currency, to_currency) -> Decimal` ve `shared.money.convert(amount, from_currency, to_currency)`.
- Yayınladığı olaylar: `fx.rates_updated`. Veri `as_of`, `pairs`.
- 03a-katalog `fx.rates_updated` olayını dinler. `selling_price_base` alanını kendisi günceller.
- Denetleyicide kalacak doğrulama: kur sıfırdan büyük olmalı. Bu kural bugün yok.

## Geçiş adımları
1. `api/currency.py` içindeki okuma fonksiyonlarını `shared/money/fx.py` içine taşıyın. `api/currency.py` yeni yolu çağırsın.
2. Lojistik, sepet ve masraf merkezi içe aktarımlarını yeni yola çevirin. Her bağlam ayrı PR açabilir.
3. `services/tcmb.py:205` güncellemesini `fx.rates_updated` olayına çevirin. Katalog dinleyicisi aynı PR içinde gelir.

## Riskler ve testler
- Vitrin fiyatı eski kurla kalabilir. Test: kur güncellenince ilan baz fiyatı yeni kurla hesaplanmalı.
- Kur bulunamazsa sipariş yanlış tutar alabilir. Test: kur yoksa sepet hata vermeli.
