# Shipment Import Row

- Bağlam: 07-lojistik
- Tür: Alt tablo
- Klasör: `tradehub_core/tradehub_core/doctype/shipment_import_row`
- Denetleyici: `tradehub_core/tradehub_core/doctype/shipment_import_row/shipment_import_row.py` (18 satır)
- Önerilen sahip bağlam: 07-lojistik

## Epic

- Epic adı: Shipment Import Row: 07-lojistik bağlamına taşıma
- Öncelik: Düşük
- Faz: Faz 5
- Tahmini büyüklük: Küçük

### User story

Bir geliştirici olarak, `Shipment Import Row` kaydının lojistik modülünde durmasını istiyorum.
Böylece kaydın sahibi açık olur ve başka ekip kaydı yanlışlıkla değiştirmez.

### Kabul kriterleri

- [ ] DocType klasörü `tradehub_core/logistics/doctype/shipment_import_row/` altında duruyor.
- [ ] JSON dosyasındaki `module` alanı "Logistics" değerinde.
- [ ] `tabDocType` modül değerini güncelleyen yama tekrar çalışınca hata vermiyor.
- [ ] Taşıma üst kayıt `Shipment Import Job` ile aynı PR içinde yapıldı.
- [ ] Characterization test: `Shipment Import Row` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- Uygulanmış satırı yeniden uygulamayın. `row_key` tekrar sevkiyat açar.
- Taşımayı önce test sitesinde denemeden canlıya göndermeyin. Modül değişikliği veritabanını etkiler.
- Bu tabloyu `Shipment Import Job` kaydından ayrı taşımayın. Üst kayıt alt tabloyu bulamaz.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] Yama test sitesinde iki kez çalıştırıldı ve hata vermedi.
- [ ] `bench migrate` test sitesinde hatasız bitti.
- [ ] Taşıma sonrası `Shipment Import Job` kaydı Desk ekranında açıldı.
- [ ] `test_shipment_import.py` geçiyor.
- [ ] Lojistik ekibinden `CODEOWNERS` incelemesi istendi.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?

`Shipment Import Row`, `Shipment Import Job` kaydının `rows` alt tablosudur. CSV dosyasının bir satırını tutar. Satır geçerli, hatalı, uygulanmış ya da atlanmış olabilir. Uygulanan satır açılan sevkiyatı gösterir.

## Bugünkü bağımlılıklar

### Bu kaydın bağlandığı kayıtlar

- `Shipment` (`shipment`): aynı bağlam

### Bu kayda dokunan kod

- `tradehub_core/logistics/services/shipment_import.py:280`: yazıyor. Satırları kuruyor.
- `tradehub_core/logistics/services/shipment_import.py:340`: yazıyor. Satırları uyguluyor.

### hooks.py kayıtları

- Kayıt yok.

## Bağımlılık sorunları

Önemli bir bağımlılık sorunu bulunmadı.

## Hedef tasarım

- Sahip bağlam ve paket yolu: 07-lojistik, `tradehub_core/logistics/doctype/shipment_import_row/`.
- Dışarıya açılan fonksiyonlar, olaylar ve bağlantılar: yok.

## Geçiş adımları

1. Üst kayıt `Shipment Import Job` ile aynı PR içinde "Logistics" modülüne taşıyın.

## Riskler ve testler

- Aynı satır iki kez uygulanabilir. `row_key` tekrar testini koruyun.
