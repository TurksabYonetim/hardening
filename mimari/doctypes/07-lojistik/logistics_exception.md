# Logistics Exception

- Bağlam: 07-lojistik
- Tür: Ana kayıt
- Klasör: `tradehub_core/tradehub_core/doctype/logistics_exception`
- Denetleyici: `tradehub_core/tradehub_core/doctype/logistics_exception/logistics_exception.py` (357 satır)
- Önerilen sahip bağlam: 07-lojistik

## Epic

- Epic adı: Logistics Exception: 07-lojistik bağlamına taşıma
- Öncelik: Önemli
- Faz: Faz 3
- Tahmini büyüklük: Orta

### User story

Bir platform yöneticisi olarak, sevkiyat sorunu açılınca bildirimin bir olayla gitmesini istiyorum.
Böylece bildirim kodu değişince sorun akışı bozulmaz.

### Kabul kriterleri

- [ ] Yeni istisna açılınca `logistics.exception_opened` olayı yayınlanıyor.
- [ ] Bildirim bağlamı olayı dinliyor ve tek bildirim gönderiyor.
- [ ] `exception_notifier.py` artık `utils.notify` modülünü doğrudan çağırmıyor.
- [ ] Yaşam döngüsü kapısı Desk yolunda da çalışıyor. `test_logistics_exception_lifecycle.py` geçiyor.
- [ ] Characterization test: `Logistics Exception` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- Yaşam döngüsü kurallarını denetleyiciden API katmanına taşımayın. Desk yazması kapıyı atlar.
- `seller_profile` alanını istemciden kabul etmeyin. Alan `Shipment` kaydından türetilir.
- `dedupe_key` tekilliğini kaldırmayın. Aynı sorun iki kez açılır.
- Ürün silme akışından bu tabloya yeni doğrudan silme eklemeyin.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] `test_logistics_exception_lifecycle.py` ve `test_exception_notifier.py` geçiyor.
- [ ] Olay sözleşme testi eklendi.
- [ ] Bildirim ekibinden `CODEOWNERS` incelemesi istendi.
- [ ] `import-linter` kontrolü geçiyor.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?

`Logistics Exception` bir sevkiyattaki sorunu tutar. Örneğin adres hatası ya da gecikme bir istisnadır (exception). Kayıt "Open", "In Progress", "Resolved" ve "Closed" durumlarından geçer. Operatör kaydı atar, çözer ve kapatır.

## Bugünkü bağımlılıklar

### Bu kaydın bağlandığı kayıtlar

- `Shipment` (`shipment`, zorunlu): aynı bağlam
- `Shipment Exception Code` (`exception_code`, zorunlu): aynı bağlam
- `Admin Seller Profile` (`seller_profile`, zorunlu): başka bağlam (02-satici-magaza)
- `User` (`assigned_to`, `assigned_by`, `resolved_by`, `closed_by`): çekirdek Frappe kaydı

### Bu kayda dokunan kod

- `tradehub_core/logistics/services/exception_service.py:228`: yazıyor. İstisnayı açan tek servis budur.
- `tradehub_core/logistics/jobs/sla_monitor.py:324`: yazıyor. Gecikme bulunca istisna açıyor.
- `tradehub_core/api/v1/logistics_ops.py:335`: okuyor ve yazıyor. Operasyon panosu ucu.
- `tradehub_core/logistics/services/exception_notifier.py:71`: okuyor. Bildirim gönderiyor.
- `tradehub_core/api/v1/shipment.py:845`: okuyor. Açık istisna sayısını gösteriyor.
- `tradehub_core/logistics/services/ops_metrics.py:135`: okuyor.
- `tradehub_core/listing_purge/executor.py:40`: siliyor. Ürün kalıcı silme akışı.
- `tradehub_core/tradehub_core/doctype/logistics_exception/logistics_exception.py:140`: denetleyici `Shipment` kaydını okuyor.

### hooks.py kayıtları

- `tradehub_core/hooks.py:1159` ve `tradehub_core/hooks.py:1282`: izin kancaları.
- `tradehub_core/hooks.py:238`: her saat gecikme denetimi yeni istisna açabilir.

## Bağımlılık sorunları

1. Denetleyici büyük ve iş kuralı taşıyor. Kanıt: yaşam döngüsü kuralları `tradehub_core/tradehub_core/doctype/logistics_exception/logistics_exception.py:209` ve yetki kuralları `tradehub_core/tradehub_core/doctype/logistics_exception/logistics_exception.py:255`. Bu kurallar aynı bağlamda kalıyor. Gerekçe dosyanın başında yazılı: Desk yazması da kapıdan geçmeli.
2. Bildirim ortak `utils.notify` modülüne doğrudan gidiyor. Kanıt: `tradehub_core/logistics/services/exception_notifier.py:204`. Bildirim ekibi imzayı değiştirirse istisna akışı bozulur (12-bildirim-iletisim).
3. Ürün kalıcı silme akışı bu kaydı siliyor. Kanıt: `tradehub_core/listing_purge/executor.py:40`. Katalog bağlamı lojistik kaydını siliyor.

## Hedef tasarım

- Sahip bağlam ve paket yolu: 07-lojistik, `tradehub_core/logistics/doctype/logistics_exception/`.
- Dışarıya açılan fonksiyonlar: `count_open_exceptions(shipments: list[str]) -> dict[str, int]`. Sevkiyat listesi bu okumayı kullanır.
- Yayınladığı olaylar: `logistics.exception_opened` (`exception`, `shipment`, `seller_profile`, `code`, `priority`) ve `logistics.exception_resolved`.
- Dinlediği olaylar: yok. İstisnayı lojistik kendi içinde açar.
- Başka bağlamlara bağlantılar: `seller_profile` Link alanı kalır. Bu alan `Shipment` kaydından türetilmiş bir anlık görüntüdür.
- Denetleyicide kalacak doğrulamalar: kimlik alanlarının değişmezliği, yaşam döngüsü, yetki kapısı.
- Servise taşınacak iş kuralları: bildirim gönderimi olaya bağlanır. Bildirim bağlamı `logistics.exception_opened` olayını dinler.

## Geçiş adımları

1. `logistics.exception_opened` olayını yayınlayın. Eski bildirim çağrısı bir süre kalsın.
2. 12-bildirim-iletisim bağlamında dinleyiciyi yazın. Sonra `exception_notifier.py:204` çağrısını kaldırın.
3. Ürün silme akışının lojistik `api.py` üzerinden bir temizleme fonksiyonu çağırmasını sağlayın.
4. DocType klasörünü "Logistics" modülüne taşıyın.

## Riskler ve testler

- Bildirim kaybolabilir. Olay dinleyicisinin tek bildirim gönderdiğini test edin.
- Yaşam döngüsü kapısı Desk yolunda atlanabilir. `tradehub_core/logistics/tests/test_logistics_exception_lifecycle.py` testlerini koruyun.
