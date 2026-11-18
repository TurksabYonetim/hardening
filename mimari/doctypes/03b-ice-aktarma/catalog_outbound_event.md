# Catalog Outbound Event

- Bağlam: 03b-ice-aktarma
- Tür: Kayıt defteri (log)
- Klasör: `tradehub_core/tradehub_core/doctype/catalog_outbound_event`
- Denetleyici: `tradehub_core/tradehub_core/doctype/catalog_outbound_event/catalog_outbound_event.py` (17 satır)
- Önerilen sahip bağlam: 03b-ice-aktarma (dış sistem köprüsü). Alternatif: ayrı "entegrasyon" alt paketi.

## Epic

- Epic adı: Catalog Outbound Event: 03b-ice-aktarma bağlamına taşıma
- Öncelik: Önemli
- Faz: Faz 4
- Tahmini büyüklük: Orta

### User story

Bir geliştirici olarak, dış sisteme giden stok olayının `catalog.listing_stock_changed` olayından üretilmesini istiyorum.
Böylece stok kodu entegrasyonu bilmez ve ürün silme entegrasyon hatasıyla durmaz.

### Kabul kriterleri

- [ ] `utils/stock.py` içinde `emit_stock_change` çağrısı yok. Dinleyici `catalog.listing_stock_changed` olayını işliyor.
- [ ] `hooks.py` içinde `Listing.on_trash` için `outbound.on_listing_trash` kancası yok. `catalog.listing_deleted` dinleyicisi var.
- [ ] Aynı `event_id` ikinci kez satır üretmiyor. Test var.
- [ ] Başarısız gönderim `sweep_due` ile yeniden deneniyor. Test geçiyor.
- [ ] Paket `import_pipeline/outbound.py` altında.
- [ ] Characterization test: `Catalog Outbound Event` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- Stok ya da sipariş kodundan `integration.outbound` modülünü içe aktarmayın.
- `listing` alanını Link yapmayın. Olay geçmişi ürün silinince kilitlenmemeli.
- Satıcıya yazma izni vermeyin. Satırları yalnız sistem yazar.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] Dinleyici ve tekrar koruması testleri eklendi.
- [ ] Yeniden deneme testi geçiyor.
- [ ] İzin sorgusu testi var.
- [ ] `import-linter` geçiyor.
- [ ] `CODEOWNERS` içe aktarma ve katalog ekiplerinden inceleme istendi.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?
Bu kayıt mağazanın dış sistemine giden stok olayıdır. Stok değişince bir satır yazılır. Ayrı bir iş satırı webhook adresine gönderir. Başarısız gönderim yeniden denenir. Satıcı panelden olayları görür ve yeniden kuyruğa alır.

## Bugünkü bağımlılıklar
### Bu kaydın bağlandığı kayıtlar
- `Admin Seller Profile` (seller_profile): başka bağlam (02-satici-magaza)
- `listing` alanı bilerek `Data`, Link değil (`catalog_outbound_event.py:7-9`)
### Bu kayda dokunan kod
- `tradehub_core/integration/outbound.py:64`: `emit_stock_change` satır yazıyor
- `tradehub_core/integration/outbound.py:120,196,209`: gönderim, yeniden kuyruk ve tarama
- `tradehub_core/utils/stock.py:734`: stok akışı (04 işi) `emit_stock_change` çağırıyor
- `tradehub_core/api/catalog_integration.py:180,221`: satıcı paneli listeliyor ve yeniden kuyruğa alıyor
- `tradehub_core/api/v1/catalog.py:974`: ürün API'si `changes` uç noktası okuyor
- `tradehub_core/permissions.py:3247-3268`: satıcı yalnız okur
### hooks.py kayıtları
- `tradehub_core/hooks.py:217`: zamanlayıcı `outbound.sweep_due`
- `tradehub_core/hooks.py:629`: `Listing.on_trash` içinde `outbound.on_listing_trash`
- `tradehub_core/hooks.py:1121,1245`: izin sorgusu ve tek kayıt izni

## Bağımlılık sorunları
1. `tradehub_core/utils/stock.py:734` stok akışı dış entegrasyon modülünü doğrudan çağırıyor. Stok kodu entegrasyonu bilmemeli.
2. `tradehub_core/hooks.py:629` katalog ürün silinince entegrasyon kodu kanca ile çalışıyor. Katalog kaydı entegrasyon hatasıyla durabilir.
3. Bu kayıt zaten bir "Outbox" desenidir. Ancak yalnız dış webhook için. İç olay sistemi yok. İki ayrı outbox kafa karıştırır.

## Hedef tasarım
- Sahip bağlam `03b-ice-aktarma`, alt paket `import_pipeline/outbound/` (ya da `integration/`).
- Dışarıya açılan fonksiyonlar: `list_outbound_events(seller_profile, status)` ve `requeue_outbound_event(name)`. Yazma fonksiyonu dışa açılmaz.
- Yayınladığı olay yok (dış webhook iç olay değildir). Dinlediği olaylar: `catalog.listing_stock_changed` (listing, reason, stock_qty, reserved_qty, available_qty) ve `catalog.listing_deleted`. Dinleyici `emit_stock_change` çağırır. Bugün `utils/stock.py:734` ve `hooks.py:629` doğrudan çağırıyor.
- Başka bağlamlara bağlantı: `seller_profile` Link kalır. `listing` `Data` olarak kalır (denetim kaydı).
- Denetleyicide doğrulama yok. Satırları yalnız sistem yazar.

## Geçiş adımları
1. İç olay Outbox ve `catalog.listing_stock_changed` olayını ekleyin (03a ekibi).
2. `integration/outbound.py` içine olay dinleyicisi ekleyin. `utils/stock.py:734` çağrısını kaldırın. 1. adımdan sonra gelir.
3. `hooks.py:629` kancasını `catalog.listing_deleted` dinleyicisine taşıyın. 1. adımdan sonra gelir.
4. Paketi `import_pipeline/outbound.py` altına taşıyın. `module` alanını değiştirin.

## Riskler ve testler
- Stok değişince olay kuyruğa girmeli. Test: `catalog.listing_stock_changed` dinleyicisi `queued` satır yazar.
- Başarısız gönderim yeniden denenmeli. Test: `sweep_due` vadesi gelen `failed` satırı yeniden gönderir.
- Aynı olay iki kez işlenmemeli. Test: aynı `event_id` ikinci kez satır üretmez.
