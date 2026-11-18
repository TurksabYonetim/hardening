# Shipping Method

- Bağlam: 07-lojistik
- Tür: Ana kayıt
- Klasör: `tradehub_core/tradehub_core/doctype/shipping_method`
- Denetleyici: `tradehub_core/tradehub_core/doctype/shipping_method/shipping_method.py` (58 satır)
- Önerilen sahip bağlam: 07-lojistik

## Epic

- Epic adı: Shipping Method: 07-lojistik bağlamına taşıma
- Öncelik: Acil
- Faz: Faz 3
- Tahmini büyüklük: Orta

### User story

Bir geliştirici olarak, sepet ve ürün kodunun kargo yöntemlerini tek bir genel API ile okumasını istiyorum.
Böylece lojistik içini değiştirince sepet bozulmaz.

### Kabul kriterleri

- [ ] `logistics/api.py` içinde `offered_methods`, `resolve_order_method`, `get_method_display` ve `quote_order` fonksiyonları var.
- [ ] `api/cart.py`, `api/cart_summary.py` ve `api/listing.py` yalnız `logistics.api` içe aktarıyor.
- [ ] Sepet ve ürün kodunda `Shipping Method` tablosunu doğrudan okuyan satır kalmadı.
- [ ] `import-linter` kuralı lojistik iç modüllerinin dışarıdan içe aktarılmasını yakalıyor.
- [ ] Platformda tek varsayılan yöntem var. Bunu bir test gösteriyor.
- [ ] Characterization test: `Shipping Method` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- Sepet ya da ürün kodundan `logistics.shipping_methods` modülünü yeniden içe aktarmayın. Genel API kullanılmalı.
- `api/cart.py` içinden `Shipping Method` tablosunu doğrudan okumayın.
- Varsayılan yöntemi silmeye izin vermeyin. Sepet yöntemsiz kalır.
- Fonksiyon imzalarını tüketicilere haber vermeden değiştirmeyin.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] `test_order_shipping.py` ve `test_shipping_methods.py` geçiyor.
- [ ] `import-linter` kontrolü geçiyor.
- [ ] Sipariş ve katalog ekiplerinden `CODEOWNERS` incelemesi istendi.
- [ ] Sepette kargo ücreti elle denendi.
- [ ] Genel API fonksiyonları için sözleşme testi eklendi.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?

`Shipping Method` alıcının seçtiği kargo yöntemini tutar. Örneğin "Standart Kargo" bir yöntemdir. Kayıtta teslim günü, ağırlık sınırı, temel ücret ve ücretsiz kargo eşiği vardır. Bir yöntem platform varsayılanı olabilir.

## Bugünkü bağımlılıklar

### Bu kaydın bağlandığı kayıtlar

- `Shipping Channel` (`channel`): aynı bağlam
- `Currency` (`currency`): çekirdek Frappe kaydı
- `Carrier Service Item` (`carrier_services`, alt tablo): aynı bağlam

### Bu kayda dokunan kod

Lojistik içinden:

- `tradehub_core/logistics/shipping_methods.py:92`: okuyor. Ürünün sunduğu yöntemleri hesaplıyor.
- `tradehub_core/logistics/shipping_methods.py:143`: okuyor. Sipariş yöntemini seçiyor.
- `tradehub_core/logistics/services/split_engine.py:310`: okuyor. Sevkiyat kanalını yöntemden alıyor.
- `tradehub_core/logistics/services/pricing_engine.py:125`: okuyor.
- `tradehub_core/api/v1/seller_shipping.py:122`: okuyor.

Başka bağlamlardan:

- `tradehub_core/api/cart.py:10`: lojistik `resolve_order_method` fonksiyonunu içe aktarıyor (04-siparis).
- `tradehub_core/api/cart.py:2102`: tabloyu doğrudan okuyor.
- `tradehub_core/api/listing.py:2043`: lojistik `offered_methods` fonksiyonunu çağırıyor (03a-katalog).
- `tradehub_core/api/listing.py:3143`: tabloyu doğrudan okuyor.
- `tradehub_core/seed_demo_data.py:4269`: yazıyor. Demo verisi.

### hooks.py kayıtları

- Kayıt yok.

## Bağımlılık sorunları

1. Sepet ve ürün kodu tabloyu doğrudan okuyor. Kanıt: `tradehub_core/api/cart.py:2102` ve `tradehub_core/api/listing.py:3143`. Lojistik alan adını değiştirirse sepet ve ürün sayfası bozulur.
2. Sepet ve ürün kodu lojistik iç modüllerini içe aktarıyor. Kanıt: `tradehub_core/api/cart.py:10` ve `tradehub_core/api/listing.py:2043`. Bu modüller bugün genel API olarak işaretli değil.
3. Kayıt "All" rolüne okuma izni veriyor. Bu bilinçli bir tercih olabilir. Gerekçe bulunamadı, doğrulanmadı.

## Hedef tasarım

- Sahip bağlam ve paket yolu: 07-lojistik, `tradehub_core/logistics/doctype/shipping_method/`.
- Dışarıya açılan fonksiyonlar (`tradehub_core/logistics/api.py`):
  - `offered_methods(listing, seller_profile=None) -> list[MethodOption]`
  - `resolve_order_method(listings, requested=None) -> str | None`
  - `get_method_display(method) -> MethodDisplay`
  - `quote_order(lines, method, address) -> ShippingQuote`
- Yayınladığı olaylar: `logistics.methods_changed`. Ürün önbelleği bu olayı dinleyebilir.
- Dinlediği olaylar: yok.
- Başka bağlamlara bağlantılar: `Order.shipping_method_id` alanı bu kayda bağlanabilir. Yöntem kararlı bir ana kayıttır.
- Denetleyicide kalacak doğrulamalar: kanal, teslim günü, tek varsayılan kuralı.

## Geçiş adımları

1. `tradehub_core/logistics/api.py` içine yukarıdaki dört fonksiyonu ekleyin. İçeride bugünkü kodu çağırsın.
2. `api/cart.py` ve `api/cart_summary.py` içe aktarmalarını `logistics.api` yoluna çevirin.
3. `api/listing.py` içe aktarmalarını `logistics.api` yoluna çevirin.
4. Doğrudan tablo okumalarını `get_method_display` fonksiyonuna çevirin.
5. `import-linter` kuralı ile `logistics` iç modüllerinin dışarıdan içe aktarılmasını yasaklayın.

## Riskler ve testler

- Sepette yanlış kargo ücreti çıkabilir. `tradehub_core/logistics/tests/test_order_shipping.py` testlerini her adımda çalıştırın.
- Varsayılan yöntem kaybolabilir. Tek varsayılan testini koruyun.
