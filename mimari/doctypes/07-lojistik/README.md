# 07-lojistik bağlamı

Bu belge lojistik bağlamının bugünkü durumunu ve hedef tasarımını anlatır. Kod analizi `origin/version-15` dalında, `08e51e53` sürümünde yapıldı. Gerçek okurla denenmedi.

## 1. Bağlamın amacı

Lojistik bağlamı siparişin satıcıdan alıcıya gitmesini yönetir. Sevkiyat açar, koli ve palet hazırlar, etiket basar. Taşıyıcıdan takip bilgisi alır ve teslim kanıtını saklar. Kargo fiyatını da bu bağlam hesaplar.

Bağlamın Python paketi zaten vardır: `tradehub_core/logistics/`. DocType klasörleri ise hâlâ ortak `tradehub_core/tradehub_core/doctype/` altındadır. Hepsinin `module` alanı "Tradehub Core" değerindedir.

## 2. DocType listesi

### Ana kayıtlar

- `Shipment` sevkiyatı tutar. Bağlamın ana kaydıdır.
- `Shipment Leg` sevkiyatın bir ayağını tutar. Kayıt kullanılmıyor gibi görünüyor.
- `Proof of Delivery` teslim kanıtını tutar.
- `Logistics Exception` sevkiyat sorununu tutar.
- `Shipment Import Job` CSV ile toplu sevkiyat işini tutar.
- `Carrier Account` taşıyıcı API hesabını tutar.
- `Logistics Provider` taşıyıcı firmayı tutar.
- `Carrier Service` taşıyıcı hizmetini tutar.
- `Carrier Branch` taşıyıcı şubesini tutar.
- `Carrier Status Mapping` taşıyıcı durum kodunu iç duruma çevirir.
- `Service Coverage Area` hizmetin gittiği il ve ilçeyi tutar.
- `Shipping Method` alıcının seçtiği kargo yöntemini tutar.
- `Shipping Channel` gönderim kanalını tutar.
- `Shipping Price Rule` kargo fiyat kuralını tutar.
- `Shipping Zone` fiyat bölgesini tutar.
- `Shipment Exception Code` sorun kodlarının kataloğudur.
- `Package Type` koli ve palet tiplerini tutar.
- `Vehicle Type` araç tiplerini tutar.
- `Issued Barcode` iç barkod sicilidir. Kayıt 03a-katalog bağlamına aittir.
- `Region` hukuk ve veri bölgesini tutar. Kayıt 13-uyum-gizlilik bağlamına aittir.

### Kayıt defterleri

- `Shipment Event` sevkiyatın durum geçmişini tutar.
- `Carrier Integration Log` taşıyıcı API çağrılarını kaydeder.
- `Proof of Delivery Revision` teslim kanıtının eski sürümlerini tutar.
- `Seller Shipping Charge` satıcının kargo borcunu tutar.

### Alt tablolar

- `Shipment` altında: `Shipment Item`, `Shipment Package`, `Shipment Package Content`, `Shipment Pallet`, `Shipment Address Snapshot`, `Shipment Document`.
- `Shipping Price Rule` altında: `Shipping Price Rule Tier`, `Shipping Price Rule Surcharge`.
- `Shipping Zone` altında: `Shipping Zone City`.
- `Shipping Method` altında: `Carrier Service Item`.
- `Logistics Provider` altında: `Provider Operating Channel`.
- `Shipment Import Job` altında: `Shipment Import Row`.
- `Admin Seller Profile` altında: `Seller Shipping Method`. Üst kayıt 02-satici-magaza bağlamındadır.
- `Listing` altında: `Shipping Method Item`. Üst kayıt 03a-katalog bağlamındadır.

### Ayarlar

- `Logistics Settings` lojistik modülünün tek ayar kaydıdır.

## 3. Bugün siparişten sevkiyat nasıl oluşuyor?

Bu bölüm görevin ana sorusunu yanıtlar. Kısa yanıt şudur: sevkiyat otomatik açılmaz. Satıcı ya da operatör sevkiyatı elle başlatır.

### Sipariş ve ödeme adımı

1. Alıcı sepeti onaylar. `tradehub_core/api/cart.py:1885` lojistiğin fiyat modülünü içe aktarır.
2. Sepet kodu siparişe kargo bilgisini yazar (`tradehub_core/api/cart.py:2088`). Yazılan alanlar şunlardır: `shipping_method_id`, `shipping_quote`, `estimated_delivery_from`, `estimated_delivery_to`, `return_carrier_account`.
3. Ödeme alınır. `tradehub_core/payments/service.py:453` siparişin durumunu "Onaylanıyor" yapar.
4. Aynı fonksiyon stoğu düşer (`tradehub_core/payments/service.py:454`).
5. Bu noktada hiçbir olay yayınlanmaz. Vergi ve lojistik bağlamı ödemeden haberdar olmaz.

### Sevkiyat açma adımı

Sevkiyat dört yoldan açılır:

1. Satıcı ya da operatör `create_shipment` ucunu çağırır (`tradehub_core/api/v1/shipment.py:198`).
2. Operatör elle sevkiyat ucunu çağırır (`tradehub_core/api/v1/shipment.py:288`). Bu uç `tradehub_core/logistics/services/manual_shipment.py:158` fonksiyonuna gider.
3. Satıcı CSV dosyası yükler. `tradehub_core/logistics/services/shipment_import.py:385` her satır için elle sevkiyat fonksiyonunu çağırır.
4. İade sevkiyatı `tradehub_core/logistics/return_shipping.py:131` fonksiyonuyla açılır. Bu fonksiyonu çağıran üretim kodu bulunamadı. Bu nokta doğrulanmadı.

İlk üç yol aynı fonksiyona varır: `create_shipment_draft_from_order` (`tradehub_core/logistics/services/split_engine.py:150`). Bu fonksiyon şu sırayla çalışır:

1. Ödeme kaydını ve siparişi kilitler (`tradehub_core/logistics/services/order_lock.py:66`).
2. Aynı tekrar anahtarı (idempotency key) varsa eski sevkiyatı döndürür (`tradehub_core/logistics/services/split_engine.py:222`).
3. Sipariş iptal edilmişse durur (`tradehub_core/logistics/services/split_engine.py:279`).
4. `Order` kaydını okur (`tradehub_core/logistics/services/split_engine.py:285`).
5. Her kalem için kalan miktarı hesaplar (`tradehub_core/logistics/services/split_engine.py:291`).
6. Kargo yönteminden kanalı okur (`tradehub_core/logistics/services/split_engine.py:310`).
7. Taslak `Shipment` kaydını ekler (`tradehub_core/logistics/services/split_engine.py:335`).
8. Siparişin kargo ücretini ilk sevkiyata kopyalar (`tradehub_core/logistics/services/split_engine.py:358`).

### Ekleme sırasında çalışan kancalar

1. `before_validate`: paylaşımlı stok kodu alanları düzeltir (`tradehub_core/hooks.py:1030`).
2. `before_insert`: kiracı kancası satıcıyı yazar (`tradehub_core/hooks.py:1032`).
3. `before_insert`: adres kopyası alınır. Kod `Order.shipping_address` ve `Addresses` kayıtlarını okur (`tradehub_core/logistics/hooks.py:596`).
4. `before_insert`: kalem kopyası alınır. Kod `Order Item` ve `Listing` kayıtlarını okur (`tradehub_core/logistics/hooks.py:137`).
5. `validate`: durum geçişi ve bölme kuralları denetlenir (`tradehub_core/hooks.py:1036`).
6. `before_save`: paylaşımlı stok kodu fiziksel teslim olayı yazar (`tradehub_core/shared_sync/order_events.py:163`).
7. `after_insert`: `update_order_fulfillment` çalışır (`tradehub_core/logistics/hooks.py:173`).
8. Bu fonksiyon `Order` kaydına doğrudan yazar (`tradehub_core/logistics/hooks.py:339`). `fulfillment_status`, `shipment_count` ve gerekirse `status` alanı değişir.

### Durum değiştiğinde

1. Durum `transition_status` ile değişir (`tradehub_core/logistics/services/shipment_service.py:26`).
2. `on_update` kancası `Shipment Event` kaydı yazar (`tradehub_core/logistics/hooks.py:204`).
3. Sevkiyat iptal edildiyse satıcı kargo borcu iptal edilir (`tradehub_core/logistics/hooks.py:220`).
4. Sipariş durumu yeniden türetilir. Mal taşıyıcıya verildiyse sipariş "Kargoda" olur. Hepsi teslim edildiyse "Tamamlandı" olur (`tradehub_core/logistics/hooks.py:358`).
5. Sevkiyat geri alınırsa sipariş durumu ödeme kaydına bakılarak geri döner (`tradehub_core/logistics/hooks.py:439`).

### Eski yol

`tradehub_core/api/order.py:1455` sevkiyat açmadan siparişe "Kargoda" yazar (`tradehub_core/api/order.py:1489`). Bu yolda `Shipment` kaydı hiç oluşmaz. Lojistik bu siparişlere bilerek dokunmaz (`tradehub_core/logistics/hooks.py:409`).

### Sipariş iptal edilince

1. Sipariş bağlamı lojistik iç servislerini doğrudan çağırır (`tradehub_core/api/order.py:412`, `tradehub_core/api/order.py:428`).
2. Lojistik yola çıkmamış taslakları iptal eder (`tradehub_core/logistics/services/order_cancellation.py:122`).
3. Lojistik `Order Item.cancelled_qty` alanına yazar (`tradehub_core/logistics/services/order_cancellation.py:264`).

## 4. Lojistiğin dinlemesi gereken olaylar

Bu bölüm hedef tasarımdır. Olaylar Outbox ile taşınır. Outbox, olayın kayıtla aynı işlemde saklandığı bir tablodur. Bir arka plan işi olayı işlem bittikten sonra dağıtır. Her dinleyici olay kimliğini saklar. Böylece aynı olay iki kez işlenmez.

### Dinlenen olaylar

| Olay | Kim yayınlar | Veri alanları | Lojistik ne yapar |
|---|---|---|---|
| `order.confirmed` | 04-siparis | `event_id`, `order`, `seller_profile`, `buyer`, `shipping_method`, `shipping_address`, `address_snapshot`, `lines`, `estimated_delivery_to`, `shipping_fee`, `currency`, `is_shared_order` | Taslak sevkiyat açar ya da siparişi "gönderime hazır" listesine koyar |
| `order.tax_calculated` | 06-vergi-fatura | `event_id`, `order`, `tax_total`, `invoice_ready` | Ürün sahibi isterse taslak sevkiyat bu olayla açılır |
| `order.cancelled` | 04-siparis | `event_id`, `order`, `cancelled_lines` | Yola çıkmamış taslakları iptal eder |
| `return.approved` | 04-siparis | `event_id`, `order`, `original_shipment`, `lines`, `reason`, `paid_by` | İade sevkiyatı açar |
| `user.account_deleted` | 01-kimlik-erisim | `event_id`, `user`, `addresses` | Adres kopyalarını 90 gün sonra anonim yapar |
| `payment.seller_charge_settled` | 05-odeme | `event_id`, `charge`, `source_key` | Satıcı kargo borcunu "Settled" yapar |

`lines` alanı her kalem için şunları taşır: `order_item`, `listing`, `item_name`, `variation`, `qty`, `unit_price`.

Taslak sevkiyat için tek bir tetikleyici seçilmelidir. Önerimiz `order.confirmed` olayıdır. Sevkiyat vergi hesabını beklemez. Fatura sevkiyattan önce zorunluysa `order.tax_calculated` seçilir. Bu kararı ürün sahibi verir.

### Yayınlanan olaylar

| Olay | Veri alanları | Kim dinler |
|---|---|---|
| `shipment.created` | `shipment`, `order`, `seller_profile`, `lines` | 04-siparis, 12-bildirim-iletisim |
| `shipment.status_changed` | `shipment`, `order`, `old_status`, `new_status`, `occurred_at`, `source` | 04-siparis, 12-bildirim-iletisim, paylaşımlı stok kodu |
| `shipment.handed_over` | `shipment`, `order`, `lines` | paylaşımlı stok kodu, 05-odeme |
| `shipment.delivered` | `shipment`, `order`, `delivered_at` | 04-siparis, 11-degerlendirme |
| `shipment.cancelled` | `shipment`, `order`, `reason` | 04-siparis, 05-odeme |
| `order.fulfillment_changed` | `order`, `fulfillment_status`, `shipment_count`, `ordered_qty`, `handed_over_qty`, `delivered_qty` | 04-siparis. Sipariş `Order` alanlarını kendisi yazar |
| `shipment.pod_recorded` | `shipment`, `order`, `has_discrepancy`, `delivered_package_count` | 04-siparis |
| `logistics.exception_opened` | `exception`, `shipment`, `seller_profile`, `code`, `priority` | 12-bildirim-iletisim |
| `logistics.charge_recorded` | `charge`, `seller_profile`, `shipment`, `order`, `charge_type`, `amount`, `currency`, `source_key` | 05-odeme |
| `logistics.methods_changed` | `methods` | 03a-katalog önbelleği |
| `logistics.method_retired` | `old_method`, `new_method` | 03a-katalog |

11-degerlendirme bağlamı yorum izni için `shipment.delivered` olayını kullanabilir. Bugün yorum kodu sipariş durum adına bakıyor.

## 5. Bağlamın dışa açık API'si

Dosya: `tradehub_core/logistics/api.py`. Tipler `tradehub_core/logistics/contracts.py` dosyasında durur.

Sipariş bağlamı için:

- `create_shipment_draft(order, items=None, idempotency_key=None) -> ShipmentSummary`
- `get_order_shipments(order) -> list[ShipmentSummary]`
- `get_shipped_quantities(order) -> dict[str, ShippedQty]`
- `get_cancellation_block(order) -> str | None`
- `cancel_open_shipments(order, reason) -> list[str]`

Sepet ve katalog için:

- `quote_order(lines, method, address) -> ShippingQuote`
- `offered_methods(listing, seller_profile=None) -> list[MethodOption]`
- `resolve_order_method(listings, requested=None) -> str | None`
- `get_method_display(method) -> MethodDisplay`
- `get_return_carrier(seller_profile) -> tuple[str | None, str | None]`
- `is_logistics_enabled() -> bool`

Satıcı bağlamı için:

- `get_store_shipping_methods(seller_profile) -> list[MethodOption]`
- `set_store_shipping_methods(seller_profile, rows) -> None`

Medya, gizlilik ve ürün silme için:

- `get_label_file_owner(file_name) -> FileOwner | None`
- `get_pod_file_owner(file_name) -> FileOwner | None`
- `label_files_for_shipments(shipments) -> list[str]`
- `anonymize_address_snapshots(addresses, reason) -> None`
- `purge_shipments_for_plan(plan) -> PurgeResult`

## 6. Bağlamlar arası en ağır 10 bağımlılık

1. Lojistik, sipariş tablosuna doğrudan yazıyor. Kanıt: `tradehub_core/logistics/hooks.py:339`. Etkilenen bağlam: 04-siparis.
2. Sipariş iptali lojistik iç servislerini çağırıyor. Kanıt: `tradehub_core/api/order.py:428`. Etkilenen bağlam: 04-siparis.
3. Lojistik, sipariş kalemine iptal miktarı yazıyor. Kanıt: `tradehub_core/logistics/services/order_cancellation.py:264`. Etkilenen bağlam: 04-siparis.
4. Lojistik, ödeme bağlamının iç kilit fonksiyonunu çağırıyor. Kanıt: `tradehub_core/logistics/services/order_lock.py:66`. Ödeme kaydını da okuyor: `tradehub_core/logistics/hooks.py:448`. Etkilenen bağlam: 05-odeme.
5. Paylaşımlı stok kodu `Shipment` kancalarına ve tablosuna bağlı. Kanıt: `tradehub_core/hooks.py:1044`, `tradehub_core/shared_sync/order_events.py:103`, `tradehub_core/shared_sync/schema.py:218`. Veritabanı tetikleyicisi kodda görünmüyor.
6. Lojistik, satıcı kaydının alt tablosuna yazıyor. Kanıt: `tradehub_core/api/v1/seller_shipping.py:179`. Etkilenen bağlam: 02-satici-magaza.
7. Lojistik, ürün kaydının alt tablosuna yazıyor. Kanıt: `tradehub_core/logistics/shipping_methods.py:69`. Etkilenen bağlam: 03a-katalog.
8. Ürün kalıcı silme akışı lojistik kayıtlarını siliyor. Kanıt: `tradehub_core/listing_purge/executor.py:39`, `tradehub_core/listing_purge/executor.py:387`. Lojistik denetleyicileri de bu paketi içe aktarıyor: `tradehub_core/tradehub_core/doctype/proof_of_delivery/proof_of_delivery.py:7`.
9. Sepet ve ürün kodu lojistik iç modüllerini içe aktarıyor. Kanıt: `tradehub_core/api/cart.py:10`, `tradehub_core/api/cart.py:1885`, `tradehub_core/api/listing.py:2043`. Sepet tabloyu da doğrudan okuyor: `tradehub_core/api/cart.py:2102`.
10. Gizlilik ve medya kodu lojistik tablolarını doğrudan okuyup yazıyor. Kanıt: `tradehub_core/privacy/account_deletion.py:269`, `tradehub_core/media/file_isolation.py:235`, `tradehub_core/media/file_isolation.py:296`.

Ek not: kargo fiyatı katalogdaki KDV oranını doğrudan okuyor (`tradehub_core/logistics/services/pricing_engine.py:54`). Vergi kuralı değişirse kargo fiyatı da değişir.

## 7. Önerilen geçiş sırası

Her madde bir PR boyutundadır. Sıra önemlidir.

1. `tradehub_core/logistics/contracts.py` ve boş `tradehub_core/logistics/api.py` dosyalarını ekleyin.
2. `api.py` içine sipariş, sepet ve katalog fonksiyonlarını ekleyin. Fonksiyonlar bugünkü kodu çağırsın.
3. `api/order.py`, `api/cart.py`, `api/cart_summary.py` ve `api/listing.py` içe aktarmalarını `logistics.api` yoluna çevirin.
4. `import-linter` kuralını ekleyin. Dış kod yalnız `tradehub_core.logistics.api` ve `contracts` içe aktarabilsin. Kural önce uyarı versin.
5. Medya, gizlilik ve ürün silme fonksiyonlarını ekleyin. Bu üç bağlamın çağrılarını değiştirin.
6. Ödeme bağlamı genel bir kilit fonksiyonu açsın. `order_lock.py` bu fonksiyonu kullansın.
7. Ortak Outbox altyapısı hazır olsun. Bu iş 14-platform-cekirdek bağlamındadır. Lojistik bu adımı bekler.
8. `Shipment Event` yazan yerlere Outbox yazmasını ekleyin. `shipment.status_changed` ve `order.fulfillment_changed` olayları yayınlansın.
9. Sipariş bağlamı `order.fulfillment_changed` dinleyicisini yazsın. İki yol bir süre birlikte çalışsın.
10. `tradehub_core/logistics/hooks.py:339` doğrudan yazmasını kaldırın. Sipariş durumu türetme kodu sipariş bağlamına geçsin.
11. `Order Item.cancelled_qty` yazımını sipariş bağlamına taşıyın.
12. `Seller Shipping Method` için ayrı bir lojistik kaydı açın. Veriyi kopyalayın ve okumaları çevirin.
13. `Shipping Method Item` yazmasını `logistics.method_retired` olayına çevirin.
14. `order.confirmed` dinleyicisini bir özellik bayrağı arkasında ekleyin.
15. Paylaşımlı stok kancalarını `shipment.status_changed` olayına bağlayın.
16. `modules.txt` dosyasına "Logistics" modülünü ekleyin. DocType klasörlerini küçük gruplar halinde `tradehub_core/logistics/doctype/` altına taşıyın. Her grup bir PR olsun.
17. Lojistik yamalarını `tradehub_core/logistics/patches/` altına taşıyın. `patches.txt` sırası değişmesin.
18. `import-linter` kuralını uyarıdan hataya çevirin.

## 8. Başka bağlama taşınması gereken DocType'lar

- `Issued Barcode`: 03a-katalog bağlamına taşınmalı. Bütün kullanıcıları ürün kodudur.
- `Region`: 13-uyum-gizlilik bağlamına taşınmalı. Kayıt hukuk bölgesini ve kişisel veri kuralını tutar.
- `Shipping Method Item`: 03a-katalog bağlamında kalmalı. Tablo `Listing` kaydının alt tablosudur.
- `Seller Shipping Method`: lojistikte kalmalı. Ama `Admin Seller Profile` alt tablosu olmaktan çıkıp ayrı bir lojistik kaydı olmalı.
- `Seller Shipping Charge`: lojistikte kalmalı. Ödeme bağlamı bu kaydı olayla almalı.

Bağlam haritası bu analizde değiştirilmedi.

## 9. Bu bağlamda paralel çalışacak geliştiriciler için kurallar

1. Başka bağlamın tablosuna yazmayın. Örneğin `Order` kaydını değiştirmek için bir olay yayınlayın.
2. Başka bağlamın iç modülünü içe aktarmayın. Yalnız onun `api.py` dosyasını kullanın.
3. Başka bağlamlar da lojistiğin iç modüllerini kullanmasın. Yeni bir ihtiyaç varsa `logistics/api.py` dosyasına fonksiyon ekleyin.
4. `contracts.py` içindeki bir tipi değiştirirseniz tüketici bağlamın sahibine haber verin. Alan silmeyin, yeni alan ekleyin.
5. Yeni bir `doc_events` kaydını yalnız lojistik kancalarına bağlayın. Kanca başka bağlamın kodunu çağırmasın.
6. Olay dinleyicisi olay kimliğini saklasın. Aynı olay iki kez gelirse ikinci kez iş yapmasın.
7. Kritik bölgede `frappe.db.commit()` çağırmayın. Kilit ve Outbox yazması aynı işlemde kalmalı.
8. Lojistik sözleşme dosyalarına dokunduysanız üreteci çalıştırın. Komut: `python3 scripts/gen_logistics_types.py --check`. Bu kural `CLAUDE.md` dosyasında yazılıdır.
9. Her PR'da şu testleri çalıştırın: `test_shipment_core.py`, `test_split_concurrency.py`, `test_order_cancellation.py`, `test_order_shipping.py`.
10. `CODEOWNERS` dosyasında `tradehub_core/logistics/` yolunun sahibi lojistik ekibidir. Bu yolu değiştiren PR lojistik ekibinin onayını alır.

## Epic özeti

Bu listede lojistik bağlamının 39 epic'i var. Liste önceliğe göre sıralıdır.

- Shipment: Kritik, Faz 3, Büyük
- Shipment Item: Kritik, Faz 3, Orta
- Seller Shipping Charge: Acil, Faz 3, Orta
- Seller Shipping Method: Acil, Faz 3, Orta
- Shipment Address Snapshot: Acil, Faz 3, Küçük
- Shipment Event: Acil, Faz 3, Orta
- Shipping Method: Acil, Faz 3, Orta
- Shipping Method Item: Acil, Faz 3, Orta
- Logistics Exception: Önemli, Faz 3, Orta
- Logistics Settings: Önemli, Faz 3, Küçük
- Proof of Delivery: Önemli, Faz 3, Orta
- Shipment Import Job: Önemli, Faz 3, Küçük
- Shipment Package: Önemli, Faz 3, Küçük
- Shipping Price Rule: Önemli, Faz 3, Orta
- Issued Barcode: Önemli, Faz 4, Küçük
- Region: Önemli, Faz 4, Orta
- Logistics Provider: Önemli, Faz 5, Küçük
- Carrier Account: Düşük, Faz 3, Küçük
- Proof of Delivery Revision: Düşük, Faz 3, Küçük
- Service Coverage Area: Düşük, Faz 3, Küçük
- Shipment Exception Code: Düşük, Faz 3, Küçük
- Shipment Leg: Düşük, Faz 3, Küçük
- Shipping Zone: Düşük, Faz 3, Küçük
- Carrier Branch: Düşük, Faz 5, Küçük
- Carrier Integration Log: Düşük, Faz 5, Küçük
- Carrier Service: Düşük, Faz 5, Küçük
- Carrier Service Item: Düşük, Faz 5, Küçük
- Carrier Status Mapping: Düşük, Faz 5, Küçük
- Package Type: Düşük, Faz 5, Küçük
- Provider Operating Channel: Düşük, Faz 5, Küçük
- Shipment Document: Düşük, Faz 5, Küçük
- Shipment Import Row: Düşük, Faz 5, Küçük
- Shipment Package Content: Düşük, Faz 5, Küçük
- Shipment Pallet: Düşük, Faz 5, Küçük
- Shipping Channel: Düşük, Faz 5, Küçük
- Shipping Price Rule Surcharge: Düşük, Faz 5, Küçük
- Shipping Price Rule Tier: Düşük, Faz 5, Küçük
- Shipping Zone City: Düşük, Faz 5, Küçük
- Vehicle Type: Düşük, Faz 5, Küçük
