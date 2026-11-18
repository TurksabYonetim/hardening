# Shipment Document

- Bağlam: 07-lojistik
- Tür: Alt tablo
- Klasör: `tradehub_core/tradehub_core/doctype/shipment_document`
- Denetleyici: `tradehub_core/tradehub_core/doctype/shipment_document/shipment_document.py` (8 satır)
- Önerilen sahip bağlam: 07-lojistik

## Epic

- Epic adı: Shipment Document: 07-lojistik bağlamına taşıma
- Öncelik: Düşük
- Faz: Faz 5
- Tahmini büyüklük: Küçük

### User story

Bir geliştirici olarak, `Shipment Document` kaydının lojistik modülünde durmasını istiyorum.
Böylece kaydın sahibi açık olur ve başka ekip kaydı yanlışlıkla değiştirmez.

### Kabul kriterleri

- [ ] DocType klasörü `tradehub_core/logistics/doctype/shipment_document/` altında duruyor.
- [ ] JSON dosyasındaki `module` alanı "Logistics" değerinde.
- [ ] `tabDocType` modül değerini güncelleyen yama tekrar çalışınca hata vermiyor.
- [ ] Taşıma üst kayıt `Shipment` ile aynı PR içinde yapıldı.
- [ ] Characterization test: `Shipment Document` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- Fatura belgesini lojistik kodundan üretmeyin. Fatura 06-vergi-fatura bağlamına aittir.
- Taşımayı önce test sitesinde denemeden canlıya göndermeyin. Modül değişikliği veritabanını etkiler.
- Bu tabloyu `Shipment` kaydından ayrı taşımayın. Üst kayıt alt tabloyu bulamaz.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] Yama test sitesinde iki kez çalıştırıldı ve hata vermedi.
- [ ] `bench migrate` test sitesinde hatasız bitti.
- [ ] Taşıma sonrası `Shipment` kaydı Desk ekranında açıldı.
- [ ] `test_label_service.py` geçiyor.
- [ ] Lojistik ekibinden `CODEOWNERS` incelemesi istendi.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?

`Shipment Document`, `Shipment` kaydının `documents` alt tablosudur. Sevkiyata bağlı irsaliye, fatura, etiket ve teslim belgelerini tutar. Satırda dosya, not ve yükleyen kişi vardır.

## Bugünkü bağımlılıklar

### Bu kaydın bağlandığı kayıtlar

- `User` (`uploaded_by`): çekirdek Frappe kaydı

### Bu kayda dokunan kod

- `tradehub_core/logistics/services/label_service.py:388`: yazıyor. Etiket belgesini ekliyor.
- `tradehub_core/logistics/services/label_service.py:352`: yazıyor. Silinmiş dosyaların satırlarını temizliyor.
- `tradehub_core/api/v1/shipment.py:484`: okuyor. Sevkiyat ayrıntısında gösteriyor.

### hooks.py kayıtları

- Kayıt yok.

## Bağımlılık sorunları

1. `document_type` alanında "Fatura" seçeneği var. Fatura belgesi 06-vergi-fatura bağlamına aittir. Bugün bu satırı yazan fatura kodu bulunamadı. Bu nokta doğrulanmadı.

## Hedef tasarım

- Sahip bağlam ve paket yolu: 07-lojistik, `tradehub_core/logistics/doctype/shipment_document/`.
- Dışarıya açılan fonksiyonlar: `attach_shipment_document(shipment, document_type, file, note)`. Fatura bağlamı irsaliye ya da fatura eklerken bunu kullanır.
- Dinlediği olaylar: `invoice.issued` gelirse fatura belgesi eklenebilir. Bu bir öneridir.
- Başka bağlamlara bağlantılar: yok.

## Geçiş adımları

1. Üst kayıt `Shipment` ile aynı PR içinde "Logistics" modülüne taşıyın.

## Riskler ve testler

- Etiket dosyası silinince satır kalabilir. Etiket temizleme testini koruyun.
