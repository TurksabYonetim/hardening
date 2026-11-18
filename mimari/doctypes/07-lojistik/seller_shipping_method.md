# Seller Shipping Method

- Bağlam: 07-lojistik
- Tür: Alt tablo
- Klasör: `tradehub_core/tradehub_core/doctype/seller_shipping_method`
- Denetleyici: `tradehub_core/tradehub_core/doctype/seller_shipping_method/seller_shipping_method.py` (8 satır)
- Önerilen sahip bağlam: 07-lojistik verinin anlamına sahiptir. Ama tablo bugün 02-satici-magaza bağlamındaki `Admin Seller Profile` kaydının alt tablosudur.

## Epic

- Epic adı: Seller Shipping Method: 07-lojistik bağlamına taşıma
- Öncelik: Acil
- Faz: Faz 3
- Tahmini büyüklük: Orta

### User story

Bir satıcı olarak, mağazamın kargo yöntemlerini güvenle kaydetmek istiyorum.
Böylece satıcı kaydı değişince ayarlarım kaybolmaz.

### Kabul kriterleri

- [ ] Mağaza kargo yöntemleri ayrı bir lojistik kaydında duruyor. Kayıtta `seller_profile` Link alanı var.
- [ ] Yama eski satırları yeni kayda kopyalıyor. Satır sayısı yama öncesi ve sonrası aynı.
- [ ] `seller_shipping.py` artık `Admin Seller Profile` alt tablosuna yazmıyor.
- [ ] `shipping_methods.py` yöntemleri yeni kayıttan okuyor.
- [ ] `test_shipping_methods.py` testleri geçiyor.
- [ ] Characterization test: `Seller Shipping Method` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- `Admin Seller Profile` alt tablosuna yeni yazma eklemeyin. Bu tablo satıcı bağlamına aittir.
- Eski `shipping_methods` alanını okumalar taşınmadan silmeyin. Sepet yanlış yöntem gösterir.
- Yamayı tekrar çalışınca satırları çoğaltacak şekilde yazmayın. Yama tekrar güvenli olmalı.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] Yama tekrar çalıştırıldı ve satır sayısı değişmedi.
- [ ] Satır sayısı karşılaştırma testi eklendi.
- [ ] Satıcı ekibinden `CODEOWNERS` incelemesi istendi.
- [ ] `import-linter` kontrolü geçiyor.
- [ ] Sepet ve ürün sayfası yöntem listesi elle denendi.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?

`Seller Shipping Method` bir mağazanın sunduğu kargo yöntemlerini tutar. Satırda yöntem adı ve en az ile en çok teslim günü vardır. Mağaza liste boş bırakırsa platform varsayılanı kullanılır.

## Bugünkü bağımlılıklar

### Bu kaydın bağlandığı kayıtlar

- `Shipping Method` (`shipping_method`, zorunlu): aynı bağlam
- Üst kayıt `Admin Seller Profile` (`shipping_methods` alanı): başka bağlam (02-satici-magaza)

### Bu kayda dokunan kod

- `tradehub_core/api/v1/seller_shipping.py:179`: siliyor. Satırları üst kaydı açmadan siliyor.
- `tradehub_core/api/v1/seller_shipping.py:181`: yazıyor. Satırları üst kaydı açmadan ekliyor.
- `tradehub_core/logistics/shipping_methods.py:108`: okuyor. Ürün sayfası ve sepet için yöntemleri hesaplıyor.

### hooks.py kayıtları

- Kayıt yok.

## Bağımlılık sorunları

1. Lojistik, başka bağlamın ana kaydının alt tablosuna doğrudan yazıyor. Kanıt: `tradehub_core/api/v1/seller_shipping.py:179` ve `tradehub_core/api/v1/seller_shipping.py:181`. Satıcı ekibi `Admin Seller Profile` şemasını değiştirirse lojistik ucu bozulur. Bu, hedef mimarideki alt tablo kuralına aykırıdır.
2. Kod üst kaydı bilerek kaydetmiyor. Gerekçe yorumda yazılı (`tradehub_core/api/v1/seller_shipping.py:177`). Yani satıcı kaydının kuralları bu yolda çalışmıyor.

## Hedef tasarım

- Sahip bağlam ve paket yolu: 07-lojistik. Tablo ayrı bir ana kayda dönüşür. Örneğin `Store Shipping Preference` adında, `seller_profile` Link alanı olan bir lojistik kaydı olur.
- Dışarıya açılan fonksiyonlar: `get_store_shipping_methods(seller_profile: str) -> list[MethodOption]` ve `set_store_shipping_methods(seller_profile, rows)`.
- Yayınladığı olaylar: `logistics.store_methods_changed`. Ürün önbelleği bu olayı dinleyebilir.
- Dinlediği olaylar: yok.
- Başka bağlamlara bağlantılar: `seller_profile` Link alanı kalır. `Admin Seller Profile` kaydında alt tablo kalmaz.

## Geçiş adımları

1. Yeni lojistik ana kaydını ekleyin. Bugünkü satırları bir yama ile kopyalayın.
2. `shipping_methods.py:108` okumasını yeni kayda çevirin. Eski tablo bir süre okunmaya devam etsin.
3. `seller_shipping.py` yazmasını yeni kayda çevirin.
4. Satıcı ekibiyle birlikte `Admin Seller Profile.shipping_methods` alanını kaldırın. Bu adım en sona kalır.

## Riskler ve testler

- Mağazanın yöntemleri geçişte kaybolabilir. Yama öncesi ve sonrası satır sayısını karşılaştıran test ekleyin.
- Sepet yanlış yöntem gösterebilir. `tradehub_core/logistics/tests/test_shipping_methods.py` testlerini her adımda çalıştırın.
