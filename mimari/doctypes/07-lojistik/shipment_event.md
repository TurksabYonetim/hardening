# Shipment Event

- Bağlam: 07-lojistik
- Tür: Kayıt defteri (log)
- Klasör: `tradehub_core/tradehub_core/doctype/shipment_event`
- Denetleyici: `tradehub_core/tradehub_core/doctype/shipment_event/shipment_event.py` (123 satır)
- Önerilen sahip bağlam: 07-lojistik

## Epic

- Epic adı: Shipment Event: 07-lojistik bağlamına taşıma
- Öncelik: Acil
- Faz: Faz 3
- Tahmini büyüklük: Orta

### User story

Bir geliştirici olarak, sevkiyat durumu değişince başka bağlamların bir olayla haberdar olmasını istiyorum.
Böylece lojistik siparişe doğrudan yazmak zorunda kalmaz.

### Kabul kriterleri

- [ ] "applied" sonuçlu her `Shipment Event` satırı için bir `shipment.status_changed` olayı yazılıyor.
- [ ] Olay satırı ile Outbox satırı aynı işlemde yazılıyor. Bunu bir test gösteriyor.
- [ ] Aynı durum geçişi tek olay üretiyor. Bayrak koruması testi geçiyor.
- [ ] `get_shipment_timeline` fonksiyonu `logistics/api.py` içinde var.
- [ ] Characterization test: `Shipment Event` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- Olayı `frappe.enqueue` ile işlem bitmeden göndermeyin. İşlem geri alınırsa olay yanlış olur.
- `event_hash` alanının tekilliğini kaldırmayın. Aynı taşıyıcı olayı iki kez yazılır.
- Bu kaydı başka bağlamdan doğrudan okumayın. Başka bağlam olayı dinlemeli.
- `th_transition_event_written` bayrağını atlamayın. Aynı geçiş iki satır üretir.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] `test_shipment_events_api.py` ve `test_tracking_ingest.py` geçiyor.
- [ ] `shipment.status_changed` için sözleşme testi eklendi.
- [ ] Outbox ile aynı işlem testi eklendi.
- [ ] `import-linter` kontrolü geçiyor.
- [ ] Sipariş ekibinden olay alanları için onay alındı.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?

`Shipment Event` bir sevkiyatın durum geçmişini tutar. Her durum değişikliği ve her taşıyıcı bildirimi bir satır olur. `processing_outcome` alanı olayın uygulanıp uygulanmadığını söyler. `event_hash` alanı aynı olayın iki kez yazılmasını engeller.

## Bugünkü bağımlılıklar

### Bu kaydın bağlandığı kayıtlar

- `Shipment` (`shipment`, zorunlu): aynı bağlam
- `Shipment Leg` (`leg`): aynı bağlam
- `Carrier Account` (`carrier_account`): aynı bağlam
- `Admin Seller Profile` (`seller_profile`): başka bağlam (02-satici-magaza)
- `User` (`actor`): çekirdek Frappe kaydı

### Bu kayda dokunan kod

- `tradehub_core/logistics/services/shipment_service.py:181`: yazıyor. Durum geçişini kaydediyor.
- `tradehub_core/logistics/services/tracking_ingest.py:291`: yazıyor. Taşıyıcı olayını kaydediyor.
- `tradehub_core/logistics/services/pallet_service.py:395`: yazıyor.
- `tradehub_core/logistics/services/label_service.py:715`: yazıyor.
- `tradehub_core/logistics/services/tracking_health.py:156`: okuyor.
- `tradehub_core/listing_purge/executor.py:39`: siliyor.
- `tradehub_core/tradehub_core/doctype/shipment_event/shipment_event.py:60`: denetleyici `Shipment` kaydını okuyor.

### hooks.py kayıtları

- `tradehub_core/hooks.py:1063`: kiracı kancaları.
- `tradehub_core/hooks.py:1155` ve `tradehub_core/hooks.py:1279`: izin kancaları.

## Bağımlılık sorunları

1. Kayıt adı bir "olay" ama başka bağlamlara olay olarak ulaşmıyor. Kayıt yalnız lojistik içinde okunuyor. Sipariş ve bildirim bağlamları durum değişikliğini bu yoldan öğrenemiyor. Bu yüzden lojistik `Order` kaydına doğrudan yazıyor (`tradehub_core/logistics/hooks.py:339`).
2. Ürün kalıcı silme akışı bu kaydı siliyor. Kanıt: `tradehub_core/listing_purge/executor.py:39`.

## Hedef tasarım

- Sahip bağlam ve paket yolu: 07-lojistik, `tradehub_core/logistics/doctype/shipment_event/`.
- Dışarıya açılan fonksiyonlar: `get_shipment_timeline(shipment: str) -> list[TimelineEntry]`.
- Yayınladığı olaylar: "applied" sonuçlu her satır için `shipment.status_changed` olayı Outbox kaydına yazılır. İkisi aynı işlemde (transaction) yazılır.
- Dinlediği olaylar: yok.
- Başka bağlamlara bağlantılar: `seller_profile` alanı `Shipment` kaydından kopyalanan anlık görüntüdür.
- Denetleyicide kalacak doğrulamalar: satıcı eşleşmesi, olay özeti hesabı, taşıyıcı kimliği.

## Geçiş adımları

1. `_create_transition_event` fonksiyonuna Outbox yazmasını ekleyin. Outbox hazır olduktan sonra yapılır.
2. Taşıyıcı olayı işleyen `tracking_ingest` yoluna da aynı yazmayı ekleyin.
3. DocType klasörünü "Logistics" modülüne taşıyın.

## Riskler ve testler

- Aynı geçiş iki olay üretebilir. Bayrak koruması testini koruyun (`tradehub_core/logistics/hooks.py:204`).
- Olay kaydı ile Outbox satırı ayrı düşebilir. Aynı işlemde yazıldığını test edin.
