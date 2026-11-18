# Package Type

- Bağlam: 07-lojistik
- Tür: Ana kayıt
- Klasör: `tradehub_core/tradehub_core/doctype/package_type`
- Denetleyici: `tradehub_core/tradehub_core/doctype/package_type/package_type.py` (36 satır)
- Önerilen sahip bağlam: 07-lojistik

## Epic

- Epic adı: Package Type: 07-lojistik bağlamına taşıma
- Öncelik: Düşük
- Faz: Faz 5
- Tahmini büyüklük: Küçük

### User story

Bir geliştirici olarak, `Package Type` kaydının lojistik modülünde durmasını istiyorum.
Böylece kaydın sahibi açık olur ve başka ekip kaydı yanlışlıkla değiştirmez.

### Kabul kriterleri

- [ ] DocType klasörü `tradehub_core/logistics/doctype/package_type/` altında duruyor.
- [ ] JSON dosyasındaki `module` alanı "Logistics" değerinde.
- [ ] `tabDocType` modül değerini güncelleyen yama tekrar çalışınca hata vermiyor.
- [ ] Kurulum çağrısı lojistik içi bir dosyada. `setup/install.py` yalnız bu fonksiyonu çağırıyor.
- [ ] Characterization test: `Package Type` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- Varsayılan paket tipini silmeyin. Paketleme hata verir.
- Taşımayı önce test sitesinde denemeden canlıya göndermeyin. Modül değişikliği veritabanını etkiler.
- Kaydın adını ya da `autoname` kuralını taşıma sırasında değiştirmeyin. Mevcut bağlar kırılır.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] Yama test sitesinde iki kez çalıştırıldı ve hata vermedi.
- [ ] `bench migrate` test sitesinde hatasız bitti.
- [ ] Taşıma sonrası `Package Type` kaydı Desk ekranında açıldı.
- [ ] `test_packaging_api.py` geçiyor.
- [ ] Lojistik ekibinden `CODEOWNERS` incelemesi istendi.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?

`Package Type` koli ve palet tiplerini tutar. Kayıtta en büyük ölçü, ağırlık ve desi vardır. `is_pallet` alanı kaydın palet olup olmadığını söyler.

## Bugünkü bağımlılıklar

### Bu kaydın bağlandığı kayıtlar

- Link alanı yok.

### Bu kayda dokunan kod

- `tradehub_core/logistics/package_types.py:39`: yazıyor. Varsayılan tipleri kuruyor.
- `tradehub_core/logistics/services/packaging_service.py:618`: okuyor.
- `tradehub_core/logistics/services/pallet_service.py:72`: okuyor.
- `tradehub_core/logistics/services/label_service.py:187`: okuyor.
- `tradehub_core/api/v1/logistics_catalog.py:165`: okuyor.
- `tradehub_core/setup/install.py:27`: kurulumda varsayılan tipleri yüklüyor.
- `tradehub_core/tradehub_core/doctype/package_type/package_type.py:36`: yazıyor. Diğer varsayılan bayraklarını kapatıyor.

### hooks.py kayıtları

- Kayıt yok.

## Bağımlılık sorunları

Önemli bir bağımlılık sorunu bulunmadı.

## Hedef tasarım

- Sahip bağlam ve paket yolu: 07-lojistik, `tradehub_core/logistics/doctype/package_type/`.
- Dışarıya açılan fonksiyonlar, olaylar ve başka bağlam bağlantıları: yok.
- Denetleyicide kalacak doğrulamalar: tek varsayılan kuralı.

## Geçiş adımları

1. Kurulum çağrısını `tradehub_core/logistics/setup.py` gibi lojistik içi bir dosyaya alın. `setup/install.py` yalnız bu fonksiyonu çağırsın.
2. DocType klasörünü "Logistics" modülüne taşıyın.

## Riskler ve testler

- Varsayılan tip kaybolursa paketleme hata verir. Kurulum sonrası varsayılan tip testini koruyun.
