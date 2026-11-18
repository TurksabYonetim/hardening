# Carrier Status Mapping

- Bağlam: 07-lojistik
- Tür: Ana kayıt
- Klasör: `tradehub_core/tradehub_core/doctype/carrier_status_mapping`
- Denetleyici: `tradehub_core/tradehub_core/doctype/carrier_status_mapping/carrier_status_mapping.py` (62 satır)
- Önerilen sahip bağlam: 07-lojistik

## Epic

- Epic adı: Carrier Status Mapping: 07-lojistik bağlamına taşıma
- Öncelik: Düşük
- Faz: Faz 5
- Tahmini büyüklük: Küçük

### User story

Bir geliştirici olarak, `Carrier Status Mapping` kaydının lojistik modülünde durmasını istiyorum.
Böylece kaydın sahibi açık olur ve başka ekip kaydı yanlışlıkla değiştirmez.

### Kabul kriterleri

- [ ] DocType klasörü `tradehub_core/logistics/doctype/carrier_status_mapping/` altında duruyor.
- [ ] JSON dosyasındaki `module` alanı "Logistics" değerinde.
- [ ] `tabDocType` modül değerini güncelleyen yama tekrar çalışınca hata vermiyor.
- [ ] `internal_status` seçeneklerini `ShipmentStatus` sabitleriyle karşılaştıran test var.
- [ ] Characterization test: `Carrier Status Mapping` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- `Shipment.status` listesine durum ekleyip bu listeyi unutmayın. Eşleme geçersiz olur.
- Taşımayı önce test sitesinde denemeden canlıya göndermeyin. Modül değişikliği veritabanını etkiler.
- Kaydın adını ya da `autoname` kuralını taşıma sırasında değiştirmeyin. Mevcut bağlar kırılır.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] Yama test sitesinde iki kez çalıştırıldı ve hata vermedi.
- [ ] `bench migrate` test sitesinde hatasız bitti.
- [ ] Taşıma sonrası `Carrier Status Mapping` kaydı Desk ekranında açıldı.
- [ ] `test_tracking_ingest.py` geçiyor.
- [ ] Lojistik ekibinden `CODEOWNERS` incelemesi istendi.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?

`Carrier Status Mapping` taşıyıcının durum kodunu iç sevkiyat durumuna çevirir. Örneğin taşıyıcının "DLV" kodu "Delivered" olur. Kayıt isterse bir istisna kodu da bağlar.

## Bugünkü bağımlılıklar

### Bu kaydın bağlandığı kayıtlar

- `Logistics Provider` (`carrier`, zorunlu): aynı bağlam
- `Shipment Exception Code` (`exception_code`): aynı bağlam

### Bu kayda dokunan kod

- `tradehub_core/logistics/services/tracking_service.py:194`: okuyor. Takip olayını çevirirken kullanıyor.
- `tradehub_core/api/v1/logistics_catalog.py:155`: okuyor.
- `tradehub_core/tradehub_core/doctype/carrier_status_mapping/carrier_status_mapping.py:8`: denetleyici `ShipmentStatus` sabitlerini kullanıyor.

### hooks.py kayıtları

- Kayıt yok.

## Bağımlılık sorunları

1. `internal_status` seçenek listesi `Shipment.status` listesinin kopyasıdır. Kanıt: denetleyici `tradehub_core/tradehub_core/doctype/carrier_status_mapping/carrier_status_mapping.py:55` satırında sabitlerle denetliyor. İki liste aynı bağlamda ama elle eşit tutuluyor. Yeni durum eklenirse iki JSON birlikte değişmeli.

## Hedef tasarım

- Sahip bağlam ve paket yolu: 07-lojistik, `tradehub_core/logistics/doctype/carrier_status_mapping/`.
- Dışarıya açılan fonksiyonlar: yok.
- Yayınladığı ve dinlediği olaylar: yok.
- Denetleyicide kalacak doğrulamalar: durum kodu biçimi, tekil eşleme, iç durumun geçerliliği.

## Geçiş adımları

1. Seçenek listesini sabitlerle karşılaştıran bir test ekleyin.
2. DocType klasörünü "Logistics" modülüne taşıyın.

## Riskler ve testler

- Eksik eşleme olayı "unmapped" yapar. `tracking_health` panosundaki sayıyı izleyen testi koruyun.
