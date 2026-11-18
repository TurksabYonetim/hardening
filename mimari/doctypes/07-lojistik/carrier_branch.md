# Carrier Branch

- Bağlam: 07-lojistik
- Tür: Ana kayıt
- Klasör: `tradehub_core/tradehub_core/doctype/carrier_branch`
- Denetleyici: `tradehub_core/tradehub_core/doctype/carrier_branch/carrier_branch.py` (24 satır)
- Önerilen sahip bağlam: 07-lojistik

## Epic

- Epic adı: Carrier Branch: 07-lojistik bağlamına taşıma
- Öncelik: Düşük
- Faz: Faz 5
- Tahmini büyüklük: Küçük

### User story

Bir geliştirici olarak, `Carrier Branch` kaydının lojistik modülünde durmasını istiyorum.
Böylece kaydın sahibi açık olur ve başka ekip kaydı yanlışlıkla değiştirmez.

### Kabul kriterleri

- [ ] DocType klasörü `tradehub_core/logistics/doctype/carrier_branch/` altında duruyor.
- [ ] JSON dosyasındaki `module` alanı "Logistics" değerinde.
- [ ] `tabDocType` modül değerini güncelleyen yama tekrar çalışınca hata vermiyor.
- [ ] Characterization test: `Carrier Branch` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- Teslim kanıtı bağlıyken şubeyi silmeyin. `Proof of Delivery.delivery_point` bağı kırılır.
- Aynı taşıyıcıda şube kodunu tekrar etmeyin.
- Taşımayı önce test sitesinde denemeden canlıya göndermeyin. Modül değişikliği veritabanını etkiler.
- Kaydın adını ya da `autoname` kuralını taşıma sırasında değiştirmeyin. Mevcut bağlar kırılır.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] Yama test sitesinde iki kez çalıştırıldı ve hata vermedi.
- [ ] `bench migrate` test sitesinde hatasız bitti.
- [ ] Taşıma sonrası `Carrier Branch` kaydı Desk ekranında açıldı.
- [ ] `test_logistics_api.py` geçiyor.
- [ ] Lojistik ekibinden `CODEOWNERS` incelemesi istendi.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?

`Carrier Branch` bir taşıyıcının şubesini tutar. Şube bir aktarma merkezi ya da teslim noktası olabilir. Kayıtta adres, telefon ve konum bilgisi vardır.

## Bugünkü bağımlılıklar

### Bu kaydın bağlandığı kayıtlar

- `Logistics Provider` (`carrier`, zorunlu): aynı bağlam

### Bu kayda dokunan kod

- `tradehub_core/api/v1/logistics_catalog.py:132`: okuyor. Katalog listesi ucu.
- `Proof of Delivery.delivery_point` ve `Shipment Leg.origin_branch` alanları bu kayda bağlanır. Bu bağlantılar aynı bağlamdadır.

### hooks.py kayıtları

- Kayıt yok.

## Bağımlılık sorunları

Önemli bir bağımlılık sorunu bulunmadı.

## Hedef tasarım

- Sahip bağlam ve paket yolu: 07-lojistik, `tradehub_core/logistics/doctype/carrier_branch/`.
- Dışarıya açılan fonksiyonlar: yok.
- Yayınladığı ve dinlediği olaylar: yok.
- Başka bağlamlara bağlantılar: yok.
- Denetleyicide kalacak doğrulamalar: aynı taşıyıcıda şube kodu tekrarı yasağı.

## Geçiş adımları

1. DocType klasörünü "Logistics" modülüne taşıyın. Bu adım toplu taşıma ile birlikte yapılır.

## Riskler ve testler

- Şube silinirse teslim kanıtı bağlantısı kırılabilir. Silme engeli testini ekleyin.
