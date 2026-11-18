# Service Coverage Area

- Bağlam: 07-lojistik
- Tür: Ana kayıt
- Klasör: `tradehub_core/tradehub_core/doctype/service_coverage_area`
- Denetleyici: `tradehub_core/tradehub_core/doctype/service_coverage_area/service_coverage_area.py` (44 satır)
- Önerilen sahip bağlam: 07-lojistik

## Epic

- Epic adı: Service Coverage Area: 07-lojistik bağlamına taşıma
- Öncelik: Düşük
- Faz: Faz 3
- Tahmini büyüklük: Küçük

### User story

Bir geliştirici olarak, kapsama alanı kaydının bir yama dosyasına bağlı olmamasını istiyorum.
Böylece yama silinince kayıt bozulmaz.

### Kabul kriterleri

- [ ] `ASCII_TO_DIACRITIC` sabiti `tradehub_core/shared/geo.py` dosyasında duruyor.
- [ ] Denetleyici `tradehub_core.patches` paketinden içe aktarmıyor.
- [ ] İl adı düzeltme testi geçiyor.
- [ ] Characterization test: `Service Coverage Area` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- DocType kodundan yama dosyalarını içe aktarmayın. Yamalar bir kez çalışan kodlardır.
- Hizmetin başka taşıyıcıya ait olmasına izin vermeyin.
- İl adı düzeltme tablosunu iki yerde tutmayın.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] İl adı düzeltme testi eklendi.
- [ ] Yama hâlâ yeni yerden sabiti alıyor ve çalışıyor.
- [ ] `import-linter` kontrolü geçiyor.
- [ ] Adres ekibinden `CODEOWNERS` incelemesi istendi.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?

`Service Coverage Area` bir taşıyıcı hizmetinin hangi il ve ilçeye gittiğini tutar. Kayıtta posta kodu aralığı ve isteğe bağlı teslim günü vardır.

## Bugünkü bağımlılıklar

### Bu kaydın bağlandığı kayıtlar

- `Logistics Provider` (`carrier`, zorunlu): aynı bağlam
- `Carrier Service` (`carrier_service`): aynı bağlam

### Bu kayda dokunan kod

- `tradehub_core/api/v1/logistics_catalog.py:145`: okuyor.
- `tradehub_core/tradehub_core/doctype/service_coverage_area/service_coverage_area.py:42`: denetleyici `Carrier Service` kaydını okuyor.

### hooks.py kayıtları

- Kayıt yok.

## Bağımlılık sorunları

1. Denetleyici bir yama dosyasından sabit içe aktarıyor. Kanıt: `tradehub_core/tradehub_core/doctype/service_coverage_area/service_coverage_area.py:8`. Yama dosyası `tradehub_core/patches/normalize_address_provinces_diacritics.py` adres bağlamına aittir (01-kimlik-erisim). Yama silinirse ya da değişirse bu kayıt açılamaz.

## Hedef tasarım

- Sahip bağlam ve paket yolu: 07-lojistik, `tradehub_core/logistics/doctype/service_coverage_area/`.
- Dışarıya açılan fonksiyonlar ve olaylar: yok.
- Başka bağlamlara bağlantılar: il adı düzeltme tablosu ortak çekirdekte durmalıdır. Örneğin `tradehub_core/shared/geo.py` olabilir.
- Denetleyicide kalacak doğrulamalar: il ve ilçe yazımını düzeltme, hizmetin taşıyıcıya ait olması.

## Geçiş adımları

1. `ASCII_TO_DIACRITIC` sabitini `tradehub_core/shared/geo.py` dosyasına taşıyın. Yama ve denetleyici oradan alsın.
2. DocType klasörünü "Logistics" modülüne taşıyın.

## Riskler ve testler

- İl adı yanlış düzeltilirse kapsama bulunamaz. İl adı düzeltme testi ekleyin.
