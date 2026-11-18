# Carrier Service

- Bağlam: 07-lojistik
- Tür: Ana kayıt
- Klasör: `tradehub_core/tradehub_core/doctype/carrier_service`
- Denetleyici: `tradehub_core/tradehub_core/doctype/carrier_service/carrier_service.py` (25 satır)
- Önerilen sahip bağlam: 07-lojistik

## Epic

- Epic adı: Carrier Service: 07-lojistik bağlamına taşıma
- Öncelik: Düşük
- Faz: Faz 5
- Tahmini büyüklük: Küçük

### User story

Bir geliştirici olarak, `Carrier Service` kaydının lojistik modülünde durmasını istiyorum.
Böylece kaydın sahibi açık olur ve başka ekip kaydı yanlışlıkla değiştirmez.

### Kabul kriterleri

- [ ] DocType klasörü `tradehub_core/logistics/doctype/carrier_service/` altında duruyor.
- [ ] JSON dosyasındaki `module` alanı "Logistics" değerinde.
- [ ] `tabDocType` modül değerini güncelleyen yama tekrar çalışınca hata vermiyor.
- [ ] Characterization test: `Carrier Service` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- `service_code` tekilliğini kaldırmayın. Hizmet kayıtları bu kodla adlanır.
- Açık sevkiyatı olan hizmeti silmeyin.
- Taşımayı önce test sitesinde denemeden canlıya göndermeyin. Modül değişikliği veritabanını etkiler.
- Kaydın adını ya da `autoname` kuralını taşıma sırasında değiştirmeyin. Mevcut bağlar kırılır.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] Yama test sitesinde iki kez çalıştırıldı ve hata vermedi.
- [ ] `bench migrate` test sitesinde hatasız bitti.
- [ ] Taşıma sonrası `Carrier Service` kaydı Desk ekranında açıldı.
- [ ] `test_logistics_api.py` geçiyor.
- [ ] Lojistik ekibinden `CODEOWNERS` incelemesi istendi.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?

`Carrier Service` bir taşıyıcının sunduğu hizmeti tutar. Örneğin "Standart" ya da "Aynı Gün" bir hizmettir. Kayıtta ağırlık sınırı, tahmini gün ve kapıda ödeme desteği vardır.

## Bugünkü bağımlılıklar

### Bu kaydın bağlandığı kayıtlar

- `Logistics Provider` (`carrier`, zorunlu): aynı bağlam

### Bu kayda dokunan kod

- `tradehub_core/api/v1/logistics_catalog.py:119`: okuyor.
- `tradehub_core/logistics/services/manual_shipment.py:98`: okuyor. Elle sevkiyatta hizmetin varlığını denetliyor.
- `tradehub_core/tradehub_core/doctype/service_coverage_area/service_coverage_area.py:42`: okuyor.
- `tradehub_core/logistics/contract.py:65`: sözleşme tanımında alan tipi olarak geçiyor.

### hooks.py kayıtları

- Kayıt yok.

## Bağımlılık sorunları

Önemli bir bağımlılık sorunu bulunmadı.

## Hedef tasarım

- Sahip bağlam ve paket yolu: 07-lojistik, `tradehub_core/logistics/doctype/carrier_service/`.
- Dışarıya açılan fonksiyonlar: yok.
- Yayınladığı ve dinlediği olaylar: yok.
- Başka bağlamlara bağlantılar: yok.
- Denetleyicide kalacak doğrulamalar: hizmet kodu biçimi.

## Geçiş adımları

1. DocType klasörünü "Logistics" modülüne taşıyın.

## Riskler ve testler

- Hizmet pasif yapılırsa açık sevkiyatlar etkilenebilir. Pasif hizmetle elle sevkiyat testini ekleyin.
