# Vehicle Type

- Bağlam: 07-lojistik
- Tür: Ana kayıt
- Klasör: `tradehub_core/tradehub_core/doctype/vehicle_type`
- Denetleyici: `tradehub_core/tradehub_core/doctype/vehicle_type/vehicle_type.py` (17 satır)
- Önerilen sahip bağlam: 07-lojistik

## Epic

- Epic adı: Vehicle Type: 07-lojistik bağlamına taşıma
- Öncelik: Düşük
- Faz: Faz 5
- Tahmini büyüklük: Küçük

### User story

Bir geliştirici olarak, `Vehicle Type` kaydının lojistik modülünde durmasını istiyorum.
Böylece kaydın sahibi açık olur ve başka ekip kaydı yanlışlıkla değiştirmez.

### Kabul kriterleri

- [ ] DocType klasörü `tradehub_core/logistics/doctype/vehicle_type/` altında duruyor.
- [ ] JSON dosyasındaki `module` alanı "Logistics" değerinde.
- [ ] `tabDocType` modül değerini güncelleyen yama tekrar çalışınca hata vermiyor.
- [ ] Başlangıç verisi yaması `tradehub_core/logistics/patches/` altında.
- [ ] Characterization test: `Vehicle Type` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- Ayar kaydı bağlıyken araç tipini silmeyin.
- Taşımayı önce test sitesinde denemeden canlıya göndermeyin. Modül değişikliği veritabanını etkiler.
- Kaydın adını ya da `autoname` kuralını taşıma sırasında değiştirmeyin. Mevcut bağlar kırılır.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] Yama test sitesinde iki kez çalıştırıldı ve hata vermedi.
- [ ] `bench migrate` test sitesinde hatasız bitti.
- [ ] Taşıma sonrası `Vehicle Type` kaydı Desk ekranında açıldı.
- [ ] Lojistik ekibinden `CODEOWNERS` incelemesi istendi.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?

`Vehicle Type` araç tiplerini tutar. Örneğin motokurye, panelvan ve TIR birer araç tipidir. Kayıtta en çok ağırlık, hacim ve desi vardır.

## Bugünkü bağımlılıklar

### Bu kaydın bağlandığı kayıtlar

- Link alanı yok.

### Bu kayda dokunan kod

- `tradehub_core/api/v1/logistics_catalog.py:195`: okuyor.
- `tradehub_core/patches/v15_log032_seed_vehicle_types.py:23`: yazıyor. Başlangıç verisi.
- `Shipment Leg.vehicle_type` ve `Logistics Settings.default_vehicle_type` alanları bu kayda bağlanır.

### hooks.py kayıtları

- Kayıt yok.

## Bağımlılık sorunları

Önemli bir bağımlılık sorunu bulunmadı.

## Hedef tasarım

- Sahip bağlam ve paket yolu: 07-lojistik, `tradehub_core/logistics/doctype/vehicle_type/`.
- Dışarıya açılan fonksiyonlar, olaylar ve bağlantılar: yok.
- Denetleyicide kalacak doğrulamalar: araç kodu biçimi.

## Geçiş adımları

1. Başlangıç verisi yamasını `tradehub_core/logistics/patches/` altına taşıyın.
2. DocType klasörünü "Logistics" modülüne taşıyın.

## Riskler ve testler

- Araç tipi silinirse ayar kaydı boş bağ gösterir. Silme engeli testini ekleyin.
