# Carrier Service Item

- Bağlam: 07-lojistik
- Tür: Alt tablo
- Klasör: `tradehub_core/tradehub_core/doctype/carrier_service_item`
- Denetleyici: `tradehub_core/tradehub_core/doctype/carrier_service_item/carrier_service_item.py` (8 satır)
- Önerilen sahip bağlam: 07-lojistik

## Epic

- Epic adı: Carrier Service Item: 07-lojistik bağlamına taşıma
- Öncelik: Düşük
- Faz: Faz 5
- Tahmini büyüklük: Küçük

### User story

Bir geliştirici olarak, `Carrier Service Item` kaydının lojistik modülünde durmasını istiyorum.
Böylece kaydın sahibi açık olur ve başka ekip kaydı yanlışlıkla değiştirmez.

### Kabul kriterleri

- [ ] DocType klasörü `tradehub_core/logistics/doctype/carrier_service_item/` altında duruyor.
- [ ] JSON dosyasındaki `module` alanı "Logistics" değerinde.
- [ ] `tabDocType` modül değerini güncelleyen yama tekrar çalışınca hata vermiyor.
- [ ] Taşıma üst kayıt `Shipping Method` ile aynı PR içinde yapıldı.
- [ ] Characterization test: `Carrier Service Item` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- Satırı `Shipping Method` dışından yazmayın.
- Taşımayı önce test sitesinde denemeden canlıya göndermeyin. Modül değişikliği veritabanını etkiler.
- Bu tabloyu `Shipping Method` kaydından ayrı taşımayın. Üst kayıt alt tabloyu bulamaz.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] Yama test sitesinde iki kez çalıştırıldı ve hata vermedi.
- [ ] `bench migrate` test sitesinde hatasız bitti.
- [ ] Taşıma sonrası `Shipping Method` kaydı Desk ekranında açıldı.
- [ ] `test_shipping_methods.py` geçiyor.
- [ ] Lojistik ekibinden `CODEOWNERS` incelemesi istendi.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?

`Carrier Service Item`, `Shipping Method` kaydının `carrier_services` alt tablosudur. Bir kargo yönteminin hangi taşıyıcı hizmetleriyle çalıştığını gösterir. Satırda öncelik ve tercih bayrağı vardır.

## Bugünkü bağımlılıklar

### Bu kaydın bağlandığı kayıtlar

- `Carrier Service` (`carrier_service`, zorunlu): aynı bağlam

### Bu kayda dokunan kod

- Doğrudan isimle okuyan kod bulunamadı. Satırlar üst kayıt `Shipping Method` ile birlikte yazılır.

### hooks.py kayıtları

- Kayıt yok.

## Bağımlılık sorunları

Önemli bir bağımlılık sorunu bulunmadı.

## Hedef tasarım

- Sahip bağlam ve paket yolu: 07-lojistik, `tradehub_core/logistics/doctype/carrier_service_item/`.
- Dışarıya açılan fonksiyonlar, olaylar ve bağlantılar: yok.
- Denetleyicide kalacak doğrulamalar: yok.

## Geçiş adımları

1. Üst kayıt `Shipping Method` ile aynı PR içinde "Logistics" modülüne taşıyın.

## Riskler ve testler

- Alt tablo taşınırken üst kayıt bozulabilir. Taşıma sonrası `Shipping Method` okuma testini çalıştırın.
