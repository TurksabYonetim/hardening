# Proof of Delivery

- Bağlam: 07-lojistik
- Tür: Ana kayıt
- Klasör: `tradehub_core/tradehub_core/doctype/proof_of_delivery`
- Denetleyici: `tradehub_core/tradehub_core/doctype/proof_of_delivery/proof_of_delivery.py` (28 satır)
- Önerilen sahip bağlam: 07-lojistik

## Epic

- Epic adı: Proof of Delivery: 07-lojistik bağlamına taşıma
- Öncelik: Önemli
- Faz: Faz 3
- Tahmini büyüklük: Orta

### User story

Bir geliştirici olarak, teslim kanıtının ürün silme ve medya koduna bağlı olmamasını istiyorum.
Böylece o ekipler değişiklik yapınca teslim kanıtı çalışmaya devam eder.

### Kabul kriterleri

- [ ] `planned_delete` süsleyicisi `tradehub_core/shared/` altında. Denetleyici oradan içe aktarıyor.
- [ ] `logistics/api.py` içinde `get_pod_file_owner` fonksiyonu var.
- [ ] `media/file_isolation.py` teslim kanıtı tablosunu doğrudan okumuyor.
- [ ] Teslim kanıtı kaydedilince `shipment.pod_recorded` olayı yayınlanıyor.
- [ ] Characterization test: `Proof of Delivery` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- Kaydı servis dışından yazmayın. Denetleyici `pod_service_write` bayrağı olmadan yazmayı reddeder.
- Kaydı silmeye izin vermeyin. Teslim kanıtı silinemez bir kayıttır.
- "Delivered" olmayan sevkiyata teslim kanıtı yazdırmayın.
- Özel dosyaları herkese açık yapmayın. Dosyada alıcı bilgisi vardır.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] `test_pod_api.py` ve medya dosya izni testleri birlikte geçiyor.
- [ ] Olay sözleşme testi eklendi.
- [ ] Medya ve katalog ekiplerinden `CODEOWNERS` incelemesi istendi.
- [ ] `import-linter` kontrolü geçiyor.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?

`Proof of Delivery` bir sevkiyatın teslim kanıtıdır. Kayıtta teslim alan kişi, teslim zamanı ve koli sayısı vardır. İmza, fotoğraf ve belge dosyaları da bağlanabilir. Her sevkiyatın en çok bir teslim kanıtı olur.

## Bugünkü bağımlılıklar

### Bu kaydın bağlandığı kayıtlar

- `Shipment` (`shipment`, zorunlu ve tekil): aynı bağlam
- `Admin Seller Profile` (`seller_profile`): başka bağlam (02-satici-magaza)
- `Shipment Exception Code` (`exception_code`): aynı bağlam
- `Carrier Branch` (`delivery_point`): aynı bağlam
- `File` (`signature_file`, `photo_file`, `document_file`): çekirdek Frappe kaydı

### Bu kayda dokunan kod

- `tradehub_core/logistics/services/pod_service.py:274`: yazıyor. Kayıt yalnız bu servisten yazılır.
- `tradehub_core/logistics/services/pod_service.py:298`: yazıyor. `Shipment.proof_of_delivery` alanını dolduruyor.
- `tradehub_core/api/v1/pod.py:32`: okuyor.
- `tradehub_core/logistics/services/shipment_timeline.py:122`: okuyor.
- `tradehub_core/media/file_isolation.py:293`: okuyor. Dosyanın sahibini buluyor.
- `tradehub_core/listing_purge/executor.py:39`: siliyor. Ürün kalıcı silme akışı.
- `tradehub_core/tradehub_core/doctype/proof_of_delivery/proof_of_delivery.py:7`: denetleyici `listing_purge.guards` modülünü içe aktarıyor.

### hooks.py kayıtları

- `tradehub_core/hooks.py:1156` ve `tradehub_core/hooks.py:1280`: izin kancaları.

## Bağımlılık sorunları

1. Lojistik denetleyicisi ürün silme paketine bağlı. Kanıt: `tradehub_core/tradehub_core/doctype/proof_of_delivery/proof_of_delivery.py:7`. Katalog ekibi `planned_delete` imzasını değiştirirse teslim kanıtı yüklenemez (03a-katalog).
2. Medya bağlamı teslim kanıtı tablosunu doğrudan okuyor. Kanıt: `tradehub_core/media/file_isolation.py:296`. Alan adı değişirse dosya erişimi bozulur (08-medya).
3. Teslim kanıtı kaydı sevkiyatı "Delivered" yapmıyor. Kanıt: `tradehub_core/logistics/services/pod_service.py:260`. Önce sevkiyat teslim edilmiş olmalı. Bu bir kuraldır, sorun değildir.

## Hedef tasarım

- Sahip bağlam ve paket yolu: 07-lojistik, `tradehub_core/logistics/doctype/proof_of_delivery/`.
- Dışarıya açılan fonksiyonlar: `get_pod_file_owner(file_name: str) -> FileOwner | None`. Medya bağlamı dosya iznini bu fonksiyonla sorar.
- Yayınladığı olaylar: `shipment.pod_recorded` (`shipment`, `order`, `has_discrepancy`, `delivered_package_count`). Sipariş ve itiraz akışı bunu dinleyebilir.
- Dinlediği olaylar: yok.
- Başka bağlamlara bağlantılar: `seller_profile` alanı `Shipment` kaydından kopyalanan anlık görüntüdür.
- Denetleyicide kalacak doğrulamalar: yalnız servis yazabilir, kayıt silinemez.

## Geçiş adımları

1. `planned_delete` süsleyicisini ortak çekirdeğe (`tradehub_core/shared/`) taşıyın. İki bağlam da oradan alsın.
2. `get_pod_file_owner` fonksiyonunu ekleyin. Medya bağlamı bu fonksiyonu kullansın.
3. `shipment.pod_recorded` olayını yayınlayın.
4. DocType klasörünü "Logistics" modülüne taşıyın.

## Riskler ve testler

- Özel dosya yanlış kişiye açılabilir. `tradehub_core/logistics/tests/test_pod_api.py` ve medya dosya izni testlerini birlikte çalıştırın.
