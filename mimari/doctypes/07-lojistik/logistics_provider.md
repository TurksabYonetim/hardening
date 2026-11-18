# Logistics Provider

- Bağlam: 07-lojistik
- Tür: Ana kayıt
- Klasör: `tradehub_core/tradehub_core/doctype/logistics_provider`
- Denetleyici: `tradehub_core/tradehub_core/doctype/logistics_provider/logistics_provider.py` (24 satır)
- Önerilen sahip bağlam: 07-lojistik

## Epic

- Epic adı: Logistics Provider: 07-lojistik bağlamına taşıma
- Öncelik: Önemli
- Faz: Faz 5
- Tahmini büyüklük: Küçük

### User story

Bir geliştirici olarak, `Logistics Provider` kaydının lojistik modülünde durmasını istiyorum.
Böylece kaydın sahibi açık olur ve başka ekip kaydı yanlışlıkla değiştirmez.

### Kabul kriterleri

- [ ] DocType klasörü `tradehub_core/logistics/doctype/logistics_provider/` altında duruyor.
- [ ] JSON dosyasındaki `module` alanı "Logistics" değerinde.
- [ ] `tabDocType` modül değerini güncelleyen yama tekrar çalışınca hata vermiyor.
- [ ] Sağlayıcı yamaları `tradehub_core/logistics/patches/` altında. `patches.txt` sırası değişmedi.
- [ ] Characterization test: `Logistics Provider` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- `provider_code` değerini değiştirmeyin. Taşıyıcı bildirimleri bu kodla yönlendirilir.
- Sepet ve sipariş ekranı için taşıyıcı adını tabloyu okuyarak değil `get_carrier_display` ile verin.
- Taşımayı önce test sitesinde denemeden canlıya göndermeyin. Modül değişikliği veritabanını etkiler.
- Kaydın adını ya da `autoname` kuralını taşıma sırasında değiştirmeyin. Mevcut bağlar kırılır.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] Yama test sitesinde iki kez çalıştırıldı ve hata vermedi.
- [ ] `bench migrate` test sitesinde hatasız bitti.
- [ ] Taşıma sonrası `Logistics Provider` kaydı Desk ekranında açıldı.
- [ ] `test_logistics_webhook.py` geçiyor.
- [ ] Lojistik ekibinden `CODEOWNERS` incelemesi istendi.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?

`Logistics Provider` bir taşıyıcı firmayı tutar. Örneğin bir kargo firması ya da kurye bir sağlayıcıdır. Kayıtta firma adı, kodu, entegrasyon tipi ve çalıştığı kanallar vardır.

## Bugünkü bağımlılıklar

### Bu kaydın bağlandığı kayıtlar

- `Country` (`country`): çekirdek Frappe kaydı
- `Provider Operating Channel` (`operating_channels`, alt tablo): aynı bağlam

### Bu kayda dokunan kod

- `tradehub_core/api/v1/seller_shipping.py:52`: okuyor. Taşıyıcı adını gösteriyor.
- `tradehub_core/api/v1/logistics_webhook.py:270`: okuyor. Bildirimi doğru taşıyıcıya yönlendiriyor.
- `tradehub_core/logistics/jobs/tracking_poll.py:141`: okuyor. Pasif taşıyıcıyı atlıyor.
- `tradehub_core/logistics/services/tracking_ingest.py:274`: okuyor.
- `tradehub_core/logistics/services/manual_shipment.py:92`: okuyor.
- `tradehub_core/logistics/services/shipment_import.py:270`: okuyor.
- `tradehub_core/logistics/services/label_service.py:119`: okuyor.
- `tradehub_core/logistics/return_shipping.py:50`: okuyor.
- `tradehub_core/patches/v15_log025_seed_logistics_providers.py:33`: yazıyor. Başlangıç verisi.

### hooks.py kayıtları

- Kayıt yok.

## Bağımlılık sorunları

Önemli bir bağımlılık sorunu bulunmadı. Bütün kullanıcılar lojistik içindedir.

## Hedef tasarım

- Sahip bağlam ve paket yolu: 07-lojistik, `tradehub_core/logistics/doctype/logistics_provider/`.
- Dışarıya açılan fonksiyonlar: `get_carrier_display(carrier: str) -> CarrierDisplay`. Sepet ve sipariş ekranı taşıyıcı adını bu fonksiyonla okur.
- Yayınladığı ve dinlediği olaylar: yok.
- Başka bağlamlara bağlantılar: `country` Link alanı kalır.
- Denetleyicide kalacak doğrulamalar: sağlayıcı kodu biçimi ve tekilliği.

## Geçiş adımları

1. Başlangıç verisi yamalarını `tradehub_core/logistics/patches/` altına taşıyın. `patches.txt` sırasını koruyun.
2. DocType klasörünü "Logistics" modülüne taşıyın.

## Riskler ve testler

- Sağlayıcı kodu değişirse bildirim yönlendirmesi kırılır. Bildirim yönlendirme testini koruyun.
