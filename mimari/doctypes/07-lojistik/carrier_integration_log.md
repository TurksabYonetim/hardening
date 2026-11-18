# Carrier Integration Log

- Bağlam: 07-lojistik
- Tür: Kayıt defteri (log)
- Klasör: `tradehub_core/tradehub_core/doctype/carrier_integration_log`
- Denetleyici: `tradehub_core/tradehub_core/doctype/carrier_integration_log/carrier_integration_log.py` (97 satır)
- Önerilen sahip bağlam: 07-lojistik

## Epic

- Epic adı: Carrier Integration Log: 07-lojistik bağlamına taşıma
- Öncelik: Düşük
- Faz: Faz 5
- Tahmini büyüklük: Küçük

### User story

Bir geliştirici olarak, `Carrier Integration Log` kaydının lojistik modülünde durmasını istiyorum.
Böylece kaydın sahibi açık olur ve başka ekip kaydı yanlışlıkla değiştirmez.

### Kabul kriterleri

- [ ] DocType klasörü `tradehub_core/logistics/doctype/carrier_integration_log/` altında duruyor.
- [ ] JSON dosyasındaki `module` alanı "Logistics" değerinde.
- [ ] `tabDocType` modül değerini güncelleyen yama tekrar çalışınca hata vermiyor.
- [ ] Yama `tradehub_core/logistics/patches/` altında.
- [ ] Characterization test: `Carrier Integration Log` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- Kaydı `integration/log.py` dışından yazmayın. Maskeleme yalnız orada yapılır.
- Satıcıya bu kaydı okuma izni vermeyin. Kayıt platform verisidir.
- Taşımayı önce test sitesinde denemeden canlıya göndermeyin. Modül değişikliği veritabanını etkiler.
- Kaydın adını ya da `autoname` kuralını taşıma sırasında değiştirmeyin. Mevcut bağlar kırılır.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] Yama test sitesinde iki kez çalıştırıldı ve hata vermedi.
- [ ] `bench migrate` test sitesinde hatasız bitti.
- [ ] Taşıma sonrası `Carrier Integration Log` kaydı Desk ekranında açıldı.
- [ ] `test_integration_log.py` geçiyor.
- [ ] Lojistik ekibinden `CODEOWNERS` incelemesi istendi.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?

`Carrier Integration Log` taşıyıcı API çağrılarını kaydeder. Her kayıtta istek, yanıt, süre ve hata bilgisi vardır. Gizli değerler kayda yazılmadan önce maskelenir.

## Bugünkü bağımlılıklar

### Bu kaydın bağlandığı kayıtlar

- `Logistics Provider` (`carrier`, zorunlu): aynı bağlam
- `Carrier Account` (`carrier_account`): aynı bağlam
- `Shipment` (`shipment`): aynı bağlam

### Bu kayda dokunan kod

- `tradehub_core/logistics/integration/log.py:80`: yazıyor. Kayıt yalnız bu modülden yazılır.
- `tradehub_core/logistics/services/tracking_health.py:172`: okuyor. Sağlık panosu hata sayısını hesaplıyor.
- `tradehub_core/tradehub_core/doctype/carrier_integration_log/carrier_integration_log.py:44`: denetleyici maskeleme modülünü kullanıyor.
- `tradehub_core/patches/v15_log043_carrier_integration_log.py:29`: yama kaydı.

### hooks.py kayıtları

- `tradehub_core/hooks.py:401`: her saat eski kayıtları silen iş.
- `tradehub_core/hooks.py:1162` ve `tradehub_core/hooks.py:1285`: izin kancaları. Satıcı bu kayıtları göremez.

## Bağımlılık sorunları

Önemli bir bağımlılık sorunu bulunmadı. Kayıt yalnız lojistik içinde yazılıyor ve okunuyor.

## Hedef tasarım

- Sahip bağlam ve paket yolu: 07-lojistik, `tradehub_core/logistics/doctype/carrier_integration_log/`.
- Dışarıya açılan fonksiyonlar: yok.
- Yayınladığı olaylar: yok. Tekrarlayan hata için `logistics.carrier_degraded` olayı ileride eklenebilir.
- Dinlediği olaylar: yok.
- Denetleyicide kalacak doğrulamalar: maskeleme ve kayıt değişmezliği.

## Geçiş adımları

1. DocType klasörünü "Logistics" modülüne taşıyın. Yamayı `tradehub_core/logistics/patches/` altına alın.

## Riskler ve testler

- Gizli değer maskelenmeden yazılabilir. `tradehub_core/logistics/tests/test_integration_log.py` testlerini koruyun.
- Saklama işi yanlış kayıtları silebilir. Saklama süresi sınır testini koruyun.
