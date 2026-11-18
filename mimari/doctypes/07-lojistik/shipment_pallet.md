# Shipment Pallet

- Bağlam: 07-lojistik
- Tür: Alt tablo
- Klasör: `tradehub_core/tradehub_core/doctype/shipment_pallet`
- Denetleyici: `tradehub_core/tradehub_core/doctype/shipment_pallet/shipment_pallet.py` (17 satır)
- Önerilen sahip bağlam: 07-lojistik

## Epic

- Epic adı: Shipment Pallet: 07-lojistik bağlamına taşıma
- Öncelik: Düşük
- Faz: Faz 5
- Tahmini büyüklük: Küçük

### User story

Bir geliştirici olarak, `Shipment Pallet` kaydının lojistik modülünde durmasını istiyorum.
Böylece kaydın sahibi açık olur ve başka ekip kaydı yanlışlıkla değiştirmez.

### Kabul kriterleri

- [ ] DocType klasörü `tradehub_core/logistics/doctype/shipment_pallet/` altında duruyor.
- [ ] JSON dosyasındaki `module` alanı "Logistics" değerinde.
- [ ] `tabDocType` modül değerini güncelleyen yama tekrar çalışınca hata vermiyor.
- [ ] Taşıma üst kayıt `Shipment` ile aynı PR içinde yapıldı.
- [ ] Characterization test: `Shipment Pallet` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- Palet yükünü elle yazmayın. Yük koli satırlarından hesaplanır.
- Taşımayı önce test sitesinde denemeden canlıya göndermeyin. Modül değişikliği veritabanını etkiler.
- Bu tabloyu `Shipment` kaydından ayrı taşımayın. Üst kayıt alt tabloyu bulamaz.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] Yama test sitesinde iki kez çalıştırıldı ve hata vermedi.
- [ ] `bench migrate` test sitesinde hatasız bitti.
- [ ] Taşıma sonrası `Shipment` kaydı Desk ekranında açıldı.
- [ ] `test_pallet_plan.py` geçiyor.
- [ ] Lojistik ekibinden `CODEOWNERS` incelemesi istendi.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?

`Shipment Pallet`, `Shipment` kaydının `pallets` alt tablosudur. Her satır bir paleti tutar. Satırda palet tipi, kat sayısı, yük ağırlığı ve aşım bayrağı vardır.

## Bugünkü bağımlılıklar

### Bu kaydın bağlandığı kayıtlar

- `Package Type` (`pallet_type`, zorunlu): aynı bağlam

### Bu kayda dokunan kod

- `tradehub_core/logistics/services/pallet_service.py:357`: yazıyor.
- `tradehub_core/logistics/services/packaging_service.py:303`: okuyor.
- `tradehub_core/tradehub_core/doctype/shipment/shipment.py:128`: yazıyor. Palet yükünü yeniden hesaplıyor.

### hooks.py kayıtları

- Kayıt yok.

## Bağımlılık sorunları

Önemli bir bağımlılık sorunu bulunmadı.

## Hedef tasarım

- Sahip bağlam ve paket yolu: 07-lojistik, `tradehub_core/logistics/doctype/shipment_pallet/`.
- Dışarıya açılan fonksiyonlar, olaylar ve bağlantılar: yok.

## Geçiş adımları

1. Üst kayıt `Shipment` ile aynı PR içinde "Logistics" modülüne taşıyın.

## Riskler ve testler

- Palet aşımı yanlış hesaplanabilir. `tradehub_core/logistics/tests/test_pallet_plan.py` testlerini koruyun.
