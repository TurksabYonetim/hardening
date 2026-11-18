# Shipping Method Item

- Bağlam: 07-lojistik
- Tür: Alt tablo
- Klasör: `tradehub_core/tradehub_core/doctype/shipping_method_item`
- Denetleyici: `tradehub_core/tradehub_core/doctype/shipping_method_item/shipping_method_item.py` (5 satır)
- Önerilen sahip bağlam: 07-lojistik verinin anlamına sahiptir. Ama tablo bugün 03a-katalog bağlamındaki `Listing` kaydının alt tablosudur.

## Epic

- Epic adı: Shipping Method Item: 03a-katalog bağlamına taşıma
- Öncelik: Acil
- Faz: Faz 3
- Tahmini büyüklük: Orta

### User story

Bir geliştirici olarak, ürünün kargo satırlarını yalnız katalog kodunun değiştirmesini istiyorum.
Böylece `Listing` şeması değişince lojistik bozulmaz.

### Kabul kriterleri

- [ ] `logistics.method_retired` olayı tanımlı. Olayın sözleşme testi var.
- [ ] Katalog bağlamı bu olayı dinliyor ve eski yöntem satırlarını değiştiriyor.
- [ ] `logistics/shipping_methods.py` içinde `Shipping Method Item` tablosuna yazma kalmadı.
- [ ] Yöntem değişimi sonrası ürün satırı yeni yöntemi gösteriyor. Bunu bir test gösteriyor.
- [ ] Characterization test: `Shipping Method Item` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- `Listing` alt tablosuna lojistikten `frappe.db.set_value` ile yazmayın. `Listing` denetleyicisi bu yolda çalışmaz.
- Bağlam haritasını bu epic içinde değiştirmeyin. Harita değişikliği ayrı bir karardır.
- `shipping_method` Link alanını kaldırmayın. Ürün yöntemi bu alanla bulur.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] Olay sözleşme testi eklendi.
- [ ] Katalog dinleyicisi için tekrar güvenli test eklendi.
- [ ] Katalog ekibinden `CODEOWNERS` incelemesi istendi.
- [ ] `test_shipping_methods.py` geçiyor.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?

`Shipping Method Item`, `Listing` kaydının `shipping_methods` alt tablosudur. Bir ürünün hangi kargo yöntemleriyle gönderildiğini tutar. Satırda ücret ve teslim günü vardır.

## Bugünkü bağımlılıklar

### Bu kaydın bağlandığı kayıtlar

- `Shipping Method` (`shipping_method`, zorunlu): aynı bağlam
- Üst kayıt `Listing` (`shipping_methods` alanı): başka bağlam (03a-katalog)

### Bu kayda dokunan kod

- `tradehub_core/logistics/shipping_methods.py:64`: okuyor.
- `tradehub_core/logistics/shipping_methods.py:69`: yazıyor. Ürün satırlarındaki eski yöntemi yenisiyle değiştiriyor.
- `tradehub_core/patches/v15_log040_deactivate_channel_duplicate_methods.py:61`: okuyor.

### hooks.py kayıtları

- Kayıt yok.

## Bağımlılık sorunları

1. Lojistik, katalog ana kaydının alt tablosuna doğrudan yazıyor. Kanıt: `tradehub_core/logistics/shipping_methods.py:69`. Katalog ekibi `Listing` şemasını değiştirirse bu kod bozulur. Bu, hedef mimarideki alt tablo kuralına aykırıdır.
2. Yazma `frappe.db.set_value` ile yapılıyor. `Listing` denetleyicisi bu yolda çalışmaz. Ürün önbelleği bayat kalabilir.

## Hedef tasarım

- Sahip bağlam ve paket yolu: tablo 03a-katalog içinde kalır. Ürünün kargo seçenekleri ürün verisinin parçasıdır.
- Dışarıya açılan fonksiyonlar: katalog `catalog.api.replace_shipping_method(old, new)` fonksiyonunu açar.
- Dinlediği olaylar: katalog `logistics.method_retired` olayını dinler. Eski yöntem satırlarını kendisi değiştirir.
- Başka bağlamlara bağlantılar: `shipping_method` Link alanı kalır. `Shipping Method` kararlı bir ana kayıttır.

## Geçiş adımları

1. Bağlam haritasında tabloyu 03a-katalog altına almayı önerin. Haritayı bu analizde değiştirmeyin.
2. `logistics.method_retired` olayını tanımlayın.
3. Katalog bağlamında dinleyiciyi yazın. Sonra `shipping_methods.py:69` yazmasını kaldırın.

## Riskler ve testler

- Ürün eski yöntemle kalabilir. Yöntem değişimi sonrası ürün satırı testini ekleyin.
