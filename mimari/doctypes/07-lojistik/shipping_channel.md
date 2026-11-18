# Shipping Channel

- Bağlam: 07-lojistik
- Tür: Ana kayıt
- Klasör: `tradehub_core/tradehub_core/doctype/shipping_channel`
- Denetleyici: `tradehub_core/tradehub_core/doctype/shipping_channel/shipping_channel.py` (17 satır)
- Önerilen sahip bağlam: 07-lojistik

## Epic

- Epic adı: Shipping Channel: 07-lojistik bağlamına taşıma
- Öncelik: Düşük
- Faz: Faz 5
- Tahmini büyüklük: Küçük

### User story

Bir geliştirici olarak, `Shipping Channel` kaydının lojistik modülünde durmasını istiyorum.
Böylece kaydın sahibi açık olur ve başka ekip kaydı yanlışlıkla değiştirmez.

### Kabul kriterleri

- [ ] DocType klasörü `tradehub_core/logistics/doctype/shipping_channel/` altında duruyor.
- [ ] JSON dosyasındaki `module` alanı "Logistics" değerinde.
- [ ] `tabDocType` modül değerini güncelleyen yama tekrar çalışınca hata vermiyor.
- [ ] Başlangıç verisi yamaları `tradehub_core/logistics/patches/` altında. `patches.txt` sırası değişmedi.
- [ ] Characterization test: `Shipping Channel` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- `channel_code` değerini değiştirmeyin. Sevkiyat tipi kanaldan türetilir.
- Taşımayı önce test sitesinde denemeden canlıya göndermeyin. Modül değişikliği veritabanını etkiler.
- Kaydın adını ya da `autoname` kuralını taşıma sırasında değiştirmeyin. Mevcut bağlar kırılır.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] Yama test sitesinde iki kez çalıştırıldı ve hata vermedi.
- [ ] `bench migrate` test sitesinde hatasız bitti.
- [ ] Taşıma sonrası `Shipping Channel` kaydı Desk ekranında açıldı.
- [ ] `test_shipment_core.py` geçiyor.
- [ ] Lojistik ekibinden `CODEOWNERS` incelemesi istendi.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?

`Shipping Channel` gönderim kanalını tutar. Örneğin kargo, satıcının kendi teslimatı ve alıcının gelip alması ayrı kanallardır. Sevkiyat tipi kanaldan türetilir.

## Bugünkü bağımlılıklar

### Bu kaydın bağlandığı kayıtlar

- Link alanı yok.

### Bu kayda dokunan kod

- `tradehub_core/logistics/services/manual_shipment.py:83`: okuyor.
- `tradehub_core/logistics/services/shipment_import.py:264`: okuyor.
- `tradehub_core/api/v1/logistics_catalog.py:78`: okuyor.
- `tradehub_core/logistics/contract.py:63`: sözleşme tanımında geçiyor.
- `tradehub_core/patches/v15_log024_seed_shipping_channels_methods.py:46`: yazıyor. Başlangıç verisi.

### hooks.py kayıtları

- Kayıt yok.

## Bağımlılık sorunları

Önemli bir bağımlılık sorunu bulunmadı.

## Hedef tasarım

- Sahip bağlam ve paket yolu: 07-lojistik, `tradehub_core/logistics/doctype/shipping_channel/`.
- Dışarıya açılan fonksiyonlar, olaylar ve bağlantılar: yok.
- Denetleyicide kalacak doğrulamalar: kanal kodu biçimi.

## Geçiş adımları

1. Başlangıç verisi yamalarını `tradehub_core/logistics/patches/` altına taşıyın.
2. DocType klasörünü "Logistics" modülüne taşıyın.

## Riskler ve testler

- Kanal kodu değişirse sevkiyat tipi yanlış türer. `shipment_type_for_channel` testini ekleyin.
