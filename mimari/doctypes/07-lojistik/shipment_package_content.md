# Shipment Package Content

- Bağlam: 07-lojistik
- Tür: Alt tablo
- Klasör: `tradehub_core/tradehub_core/doctype/shipment_package_content`
- Denetleyici: `tradehub_core/tradehub_core/doctype/shipment_package_content/shipment_package_content.py` (18 satır)
- Önerilen sahip bağlam: 07-lojistik

## Epic

- Epic adı: Shipment Package Content: 07-lojistik bağlamına taşıma
- Öncelik: Düşük
- Faz: Faz 5
- Tahmini büyüklük: Küçük

### User story

Bir geliştirici olarak, `Shipment Package Content` kaydının lojistik modülünde durmasını istiyorum.
Böylece kaydın sahibi açık olur ve başka ekip kaydı yanlışlıkla değiştirmez.

### Kabul kriterleri

- [ ] DocType klasörü `tradehub_core/logistics/doctype/shipment_package_content/` altında duruyor.
- [ ] JSON dosyasındaki `module` alanı "Logistics" değerinde.
- [ ] `tabDocType` modül değerini güncelleyen yama tekrar çalışınca hata vermiyor.
- [ ] Taşıma üst kayıt `Shipment` ile aynı PR içinde yapıldı.
- [ ] Characterization test: `Shipment Package Content` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- Satırı paketleme servisi dışından yazmayın. Koli içeriği servis tarafından hesaplanır.
- Taşımayı önce test sitesinde denemeden canlıya göndermeyin. Modül değişikliği veritabanını etkiler.
- Bu tabloyu `Shipment` kaydından ayrı taşımayın. Üst kayıt alt tabloyu bulamaz.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] Yama test sitesinde iki kez çalıştırıldı ve hata vermedi.
- [ ] `bench migrate` test sitesinde hatasız bitti.
- [ ] Taşıma sonrası `Shipment` kaydı Desk ekranında açıldı.
- [ ] `test_packaging_api.py` geçiyor.
- [ ] Lojistik ekibinden `CODEOWNERS` incelemesi istendi.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?

`Shipment Package Content`, `Shipment` kaydının `package_contents` alt tablosudur. Hangi kolide hangi kalemden kaç adet olduğunu tutar. Koli ve kalem bağı düz metin alanlarıyla kurulur.

## Bugünkü bağımlılıklar

### Bu kaydın bağlandığı kayıtlar

- Link alanı yok. `package_code` ve `shipment_item` alanları aynı sevkiyatın satırlarını gösterir.

### Bu kayda dokunan kod

- `tradehub_core/logistics/services/packaging_service.py:324`: yazıyor.
- `tradehub_core/tradehub_core/doctype/shipment/shipment.py:144`: yazıyor. Boşta kalan satırları siliyor.

### hooks.py kayıtları

- Kayıt yok.

## Bağımlılık sorunları

Önemli bir bağımlılık sorunu bulunmadı.

## Hedef tasarım

- Sahip bağlam ve paket yolu: 07-lojistik, `tradehub_core/logistics/doctype/shipment_package_content/`.
- Dışarıya açılan fonksiyonlar, olaylar ve bağlantılar: yok.

## Geçiş adımları

1. Üst kayıt `Shipment` ile aynı PR içinde "Logistics" modülüne taşıyın.

## Riskler ve testler

- Koli silinince içerik satırı kalabilir. Temizleme testini koruyun.
