# Shipping Zone City

- Bağlam: 07-lojistik
- Tür: Alt tablo
- Klasör: `tradehub_core/tradehub_core/doctype/shipping_zone_city`
- Denetleyici: `tradehub_core/tradehub_core/doctype/shipping_zone_city/shipping_zone_city.py` (10 satır)
- Önerilen sahip bağlam: 07-lojistik

## Epic

- Epic adı: Shipping Zone City: 07-lojistik bağlamına taşıma
- Öncelik: Düşük
- Faz: Faz 5
- Tahmini büyüklük: Küçük

### User story

Bir geliştirici olarak, `Shipping Zone City` kaydının lojistik modülünde durmasını istiyorum.
Böylece kaydın sahibi açık olur ve başka ekip kaydı yanlışlıkla değiştirmez.

### Kabul kriterleri

- [ ] DocType klasörü `tradehub_core/logistics/doctype/shipping_zone_city/` altında duruyor.
- [ ] JSON dosyasındaki `module` alanı "Logistics" değerinde.
- [ ] `tabDocType` modül değerini güncelleyen yama tekrar çalışınca hata vermiyor.
- [ ] Taşıma üst kayıt `Shipping Zone` ile aynı PR içinde yapıldı.
- [ ] Türkçe karakterli il adı doğru bölgede bulunuyor. Bunu bir test gösteriyor.
- [ ] Characterization test: `Shipping Zone City` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- İl adını düzeltme tablosu dışında elle normalleştirmeyin.
- Taşımayı önce test sitesinde denemeden canlıya göndermeyin. Modül değişikliği veritabanını etkiler.
- Bu tabloyu `Shipping Zone` kaydından ayrı taşımayın. Üst kayıt alt tabloyu bulamaz.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] Yama test sitesinde iki kez çalıştırıldı ve hata vermedi.
- [ ] `bench migrate` test sitesinde hatasız bitti.
- [ ] Taşıma sonrası `Shipping Zone` kaydı Desk ekranında açıldı.
- [ ] `test_pricing_engine.py` geçiyor.
- [ ] Lojistik ekibinden `CODEOWNERS` incelemesi istendi.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?

`Shipping Zone City`, `Shipping Zone` kaydının `cities` alt tablosudur. Her satır bölgedeki bir ili tutar.

## Bugünkü bağımlılıklar

### Bu kaydın bağlandığı kayıtlar

- Link alanı yok. `city` alanı düz metindir.

### Bu kayda dokunan kod

- `tradehub_core/logistics/services/pricing_engine.py:463`: okuyor.
- `tradehub_core/tradehub_core/doctype/shipping_zone/shipping_zone.py:40`: okuyor. Çakışma denetimi yapıyor.

### hooks.py kayıtları

- Kayıt yok.

## Bağımlılık sorunları

1. İl adı düz metin. Adres bağlamındaki il adıyla aynı yazım beklenir. Yazım farkı bölgeyi bulamaz. Bu sorun adres verisine bağlıdır (01-kimlik-erisim).

## Hedef tasarım

- Sahip bağlam ve paket yolu: 07-lojistik, `tradehub_core/logistics/doctype/shipping_zone_city/`.
- Dışarıya açılan fonksiyonlar ve olaylar: yok.
- Başka bağlamlara bağlantılar: il adı düzeltme tablosu ortak çekirdekte (`tradehub_core/shared/geo.py`) durur.

## Geçiş adımları

1. Üst kayıt `Shipping Zone` ile aynı PR içinde "Logistics" modülüne taşıyın.

## Riskler ve testler

- Türkçe karakterli il adı eşleşmeyebilir. İl adı eşleşme testini ekleyin.
