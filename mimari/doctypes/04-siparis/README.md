# 04-siparis bağlamı

Bu belge sipariş bağlamının hedef tasarımını anlatır. Belgede kod yolu ve satır numarası kanıt olarak verilir. Satır numaraları `origin/version-15` dalının `08e51e53` işlemine göredir.

Önce dört terimi açıklayalım:

- **Bağlam:** Bir iş alanının kendi kodu, kendi kayıtları ve kendi ekibidir. Örneğin sipariş bir bağlamdır.
- **Olay:** Bir bağlamın "bu iş oldu" diye yazdığı kayıttır. Örneğin `order.confirmed` olayı "sipariş kesinleşti" demektir.
- **Outbox:** Olayın önce veritabanına yazıldığı tablodur. Olay, işlem bitince arka planda dağıtılır.
- **Okuma modeli:** Bir bağlamın başka bağlamlara verdiği sade, belgeli veri görünümüdür.

## 1. Bağlamın amacı

Sipariş bağlamı alıcının sepetini, siparişini ve sipariş sonrası işlerini yönetir. Sepet, kupon, sipariş, kalem, sözleşme kabulü ve anlaşmazlık bu bağlamdadır. Alıcı şirketin onay süreci ve onaylı tedarikçi listesi de buradadır. Teklif isteği (RFQ) ve satıcı teklifi de buradadır.

Bağlamın tek görevi şudur: siparişin durumunu tek yerden yönetmek. Bugün bu kural yok. Sipariş durumunu altı ayrı yer yazıyor. Ayrıntı 5. bölümdedir.

## 2. DocType listesi

Ana kayıtlar:

- `Order`
- `Cart`
- `Coupon`
- `Approved Supplier List`
- `Order Approval`
- `Order Dispute`
- `RFQ`
- `RFQ Quote`
- `Seller Inquiry` (12-bildirim-iletisim bağlamına taşınmalı)

Kayıt defteri (log):

- `Order Contract Acceptance`

Alt tablolar:

- `Order Item`
- `Cart Item`
- `Approved Supplier Entry`
- `Order Approval Log`

Ayar kaydı: yok.

Bu bağlama gelmesi gerekenler:

- `Order Tax Line` bugün 06-vergi-fatura listesinde. Tablo `Order` kaydının alt tablosudur (`order.json:258`). Sahibi sipariş bağlamı olmalı.

## 3. Bağlamın dışa açık API'si

Diğer bağlamlar yalnız `tradehub_core/ordering/api.py` içindeki fonksiyonları çağırır. Girdi ve çıktı tipleri `tradehub_core/ordering/contracts.py` dosyasındadır.

Yazma fonksiyonları:

1. `place_orders(checkout: CheckoutInput) -> list[PlacedOrder]`
2. `request_cancellation(order: str, reason: str) -> CancellationResult`
3. `record_cancelled_quantity(order: str, quantities: dict[str, int], reason: str) -> None`
4. `open_dispute(order: str, order_item: str | None, dispute_type: str, description: str, related_review: str | None) -> str`
5. `resolve_dispute(dispute: str, in_favor_of: str, note: str) -> None`
6. `approve(approval: str, comment: str) -> ApprovalState`
7. `reject(approval: str, reason: str) -> ApprovalState`
8. `create_rfq(data: RfqInput) -> str`
9. `submit_quote(rfq: str, data: QuoteInput) -> str`
10. `remove_ordered_lines(user: str, lines: list[CartLineKey]) -> None`

Okuma modelleri:

1. `get_order_summary(order: str) -> OrderSummary`
2. `get_payable_order(order: str) -> PayableOrder`. Ödeme bağlamı kullanır.
3. `get_fulfillment_view(order: str) -> FulfillmentOrder`. Lojistik bağlamı kullanır.
4. `get_order_lines(order: str) -> list[OrderLine]`
5. `get_order_tax_snapshot(order: str) -> OrderTaxSnapshot`. Vergi bağlamı kullanır.
6. `get_invoice_source(order: str) -> InvoiceSource`. Fatura belgesi kullanır.
7. `get_accepted_terms(order: str) -> AcceptedTerms`. Ödeme ve lojistik kullanır.
8. `get_active_cart(user: str) -> CartView`
9. `check_supplier_allowed(buyer_tenant: str, supplier: str, amount, categories) -> Decision`
10. `count_disputes_for_buyer(user: str) -> int`

Sipariş durumunu yalnız `ordering/state.py` içindeki `transition(order, to, reason)` fonksiyonu yazar. Bu fonksiyon dışarıya açık değildir. Diğer bağlamlar durumu olay göndererek değiştirir.

## 4. Yayınlanan ve dinlenen olaylar

### 4.1 Olay altyapısı

Olay altyapısı paylaşılan çekirdekte durur: `tradehub_core/shared/events.py`. Tasarım `payments/jobs.py` dosyasındaki kalıcı kuyruğu örnek alır (`payments/jobs.py:1`).

1. Bir bağlam `shared.events.publish(event_type, aggregate, payload)` çağırır.
2. Fonksiyon olayı `Domain Event` kaydına yazar. Bu yazım iş kaydıyla aynı işlemdedir.
3. Fonksiyon `frappe.db.after_commit` ile dağıtım işini kuyruğa verir. Bugün `payments/jobs.py:330` aynı yolu kullanır.
4. Dağıtıcı her dinleyiciyi ayrı bir işlemde çalıştırır.
5. Dinleyici önce `Domain Event Receipt` kaydını yazar. Bu kayıtta olay kimliği ve dinleyici adı birlikte benzersizdir. Kayıt zaten varsa dinleyici işi atlar. Böylece aynı olay iki kez işlenmez.
6. Dinleyici hata verirse işlem geri alınır. Deneme sayısı artar ve iş sonra yeniden denenir.
7. Zamanlanmış bir kurtarma işi bekleyen olayları yeniden kuyruğa verir. Bu iş proje kodundaki `scheduler_events` listesine eklenir. Bugün `hooks.py:1482` aynı yolu ödeme işleri için kullanır.

Her bağlam kendi dinleyicilerini kendi dosyasına yazar. Örnek: `tradehub_core/ordering/subscriptions.py`. `hooks.py` dosyasına yalnız bir satır eklenir: `domain_event_subscribers = [...]`. Bu satır her bağlamın listesini toplar.

Her olay verisi şu ortak alanları taşır: `event_id`, `event_type`, `schema_version`, `occurred_at`, `aggregate_doctype`, `aggregate_name`.

### 4.2 Sipariş, vergi ve lojistik olay zinciri

Bu zincir sahibin örneğini karşılar. Sipariş kesinleşince vergi otomatik hesaplanır. Sonra alıcı ile satıcı arasındaki lojistik akışı başlar.

Önemli bir kural vardır. Vergi tutarı sipariş anında bilinmelidir. Çünkü alıcı vergili tutarı öder (`order.py:26`). Bu yüzden zincir iki parçadır. Önce vergi eşzamanlı ve yazımsız hesaplanır. Sonra vergi kaydı olayla kesinleşir.

**Adım 1. Sepet onayı (tek işlem, eşzamanlı)**

1. Alıcı sepeti onaylar. Sipariş bağlamı `ordering.checkout.place_orders` fonksiyonunu çalıştırır.
2. Sipariş bağlamı ilan bilgisini `catalog.api.get_purchasable(listing)` ile okur.
3. Sipariş bağlamı kargo ücretini `logistics.api.quote_shipping(...)` ile sorar. Bu çağrı hiçbir şey yazmaz. Bugün aynı iş `api/cart.py:1885` içinde yapılır.
4. Sipariş bağlamı vergiyi `tax.api.quote_order_taxes(OrderTaxInput)` ile sorar. Bu çağrı da hiçbir şey yazmaz. Bugün aynı iş `order.py:139` içinde yapılır.
5. Sipariş bağlamı `Order`, `Order Item` ve `Order Tax Line` kayıtlarını yazar.
6. Sipariş bağlamı stoğu `catalog.api.reserve_stock(order_lines)` ile ayırır. Bu çağrı eşzamanlıdır. Aksi halde aynı ürün iki alıcıya satılabilir. Bugün aynı iş `api/cart.py:2170` içinde yapılır.
7. Sipariş bağlamı ödeme talebini `payments.api.open_for_order(PayableOrder, ...)` ile açar. Bu çağrı eşzamanlıdır. Çünkü kart ödemesi için talep adı hemen gerekir. Bugün aynı iş `api/cart.py:2176` içinde yapılır.
8. Sipariş bağlamı `order.placed` olayını Outbox kaydına yazar. Bütün bu adımlar tek işlemdir.

**Adım 2. Ödeme**

1. Ödeme sağlayıcısı sonucu bildirir.
2. Ödeme bağlamı `Payment Collection` kaydını yazar. Talep "Collected" olur.
3. Ödeme bağlamı `payment.collected` olayını aynı işlemde Outbox kaydına yazar.
4. Ödeme bağlamı siparişe ve stoğa artık dokunmaz. Bugün dokunuyor (`payments/service.py:453`, `payments/service.py:454`).

**Adım 3. Siparişin kesinleşmesi**

1. Sipariş bağlamı `payment.collected` olayını dinler.
2. Sipariş bağlamı iki koşula bakar. Ödeme tamam mı? Alıcı şirketin onayı gerekiyorsa onay tamam mı?
3. İki koşul tamamsa sipariş bağlamı durumu "Onaylanıyor" yapar.
4. Sipariş bağlamı `order.confirmed` olayını yayınlar.
5. Onay sonradan gelirse aynı kontrol `order.approved` olayında yapılır.

`order.confirmed` verisi:

- `order`, `buyer`, `seller`, `currency`, `order_date`
- `grand_total_exact`, `tax_amount_exact`
- `items`: her satır için `order_item`, `listing`, `listing_variant`, `qty`, `supplier`

**Adım 4. Vergi kaydının kesinleşmesi**

1. Vergi bağlamı `order.confirmed` olayını dinler.
2. Vergi bağlamı anlık görüntüyü `ordering.api.get_order_tax_snapshot(order)` ile okur.
3. Vergi bağlamı tutarı sipariş tarihindeki kurallarla yeniden hesaplar. Bu hesap yazımsızdır.
4. Tutar tutarsa vergi bağlamı proforma taslağını açar. Bugünkü fonksiyon `invoice_documents/service.py:471` içindedir. Taslak anahtarı olay kimliğidir. Böylece taslak iki kez açılmaz.
5. Vergi bağlamı `order.tax_calculated` olayını yayınlar.
6. Tutar tutmazsa vergi bağlamı `order.tax_mismatch` olayını yayınlar. Sevkiyat açılmaz. Finans ekibi siparişi inceler.

`order.tax_calculated` verisi:

- `order`, `seller`, `currency`
- `tax_total_exact`, `grand_total_exact`
- `tax_lines_hash`: vergi satırlarının özeti
- `invoice_document`: proforma taslağının adı

**Adım 5. Lojistik akışının başlaması**

1. Lojistik bağlamı `order.tax_calculated` olayını dinler.
2. Lojistik bağlamı sipariş bilgisini `ordering.api.get_fulfillment_view(order)` ile okur.
3. Lojistik bağlamı sevkiyat taslağını açar. Bugünkü fonksiyon `logistics/services/split_engine.py:150` içindedir. Anahtar `order:<sipariş>:initial` olur.
4. Lojistik bağlamı `shipment.created` olayını yayınlar.

Bu adımın iş kuralı doğrulanmadı. Lojistiğin vergiyi beklemesi bir iş kararıdır. Örneğin fatura olmadan kargo çıkmasın denebilir. Böyle bir kural yoksa lojistik doğrudan `order.confirmed` olayını dinleyebilir. Zincirin geri kalanı değişmez.

**Adım 6. Sevkiyat ilerlemesi**

1. Lojistik bağlamı sevkiyat durumunu değiştirir.
2. Lojistik bağlamı şu olaylardan birini yayınlar: `shipment.handed_over`, `shipment.delivered`, `shipment.cancelled`.
3. Sipariş bağlamı olayı dinler. Sevk bilgisini `logistics.api.get_fulfillment_facts(order)` ile okur.
4. Sipariş bağlamı `fulfillment_status` ve durum alanını kendisi yazar. Bugün bu yazımı lojistik yapıyor (`logistics/hooks.py:339`).
5. Bütün kalemler teslim edilince sipariş bağlamı `order.completed` yayınlar.

**İptal yolu**

1. Alıcı iptal ister. Sipariş bağlamı `request_cancellation` çalıştırır.
2. Sipariş bağlamı `logistics.api.cancellation_block_reason(order)` ile engel var mı diye sorar. Bugün aynı soru `api/order.py:412` içinde sorulur.
3. Engel yoksa sipariş bağlamı durumu "İptal Edildi" yapar ve `order.cancelled` yayınlar.
4. Ödeme bağlamı talebi kapatır ya da iadeyi başlatır.
5. Katalog bağlamı ayrılmış stoğu bırakır.
6. Lojistik bağlamı açık taslakları iptal eder.
7. Vergi bağlamı proforma taslağını geri çeker.

### 4.3 Bu bağlamın yayınladığı olaylar

- `order.placed`. Veri: `order`, `buyer`, `seller`, `currency`, `grand_total_exact`, `coupon_code`, `items`. Dinleyenler: 03a-katalog (sipariş sayacı), 10-seo (atıf), 04-siparis (onay başlatma).
- `order.approval_required`. Veri: `order`, `approval`, `level`. Dinleyen: 12-bildirim-iletisim.
- `order.approved` ve `order.approval_rejected`. Veri: `order`, `approval`, `reason`. Dinleyen: 04-siparis.
- `order.confirmed`. Veri 4.2 bölümündedir. Dinleyenler: 06-vergi-fatura, 03a-katalog (stok düşümü), 12-bildirim-iletisim.
- `order.cancelled`. Veri: `order`, `reason`, `stage`. Dinleyenler: 05-odeme, 03a-katalog, 07-lojistik, 06-vergi-fatura.
- `order.completed`. Veri: `order`, `delivered_at`. Dinleyenler: 11-degerlendirme (yorum daveti), 05-odeme (satıcı bakiyesi).
- `order.refund_requested`. Veri: `order`, `amount_exact`, `reason`. Dinleyen: 05-odeme.
- `order.dispute_opened` ve `order.dispute_resolved`. Veri: `dispute`, `order`, `related_review`, `in_favor_of`. Dinleyen: 11-degerlendirme.
- `rfq.submitted`, `rfq.approved`, `rfq.closed`, `rfq.quote_submitted`. Dinleyen: 12-bildirim-iletisim.

### 4.4 Bu bağlamın dinlediği olaylar

- `payment.collected`, `payment.refunded`, `payment.evidence_submitted` (05-odeme)
- `order.tax_calculated`, `order.tax_mismatch` (06-vergi-fatura)
- `shipment.created`, `shipment.handed_over`, `shipment.delivered`, `shipment.cancelled` (07-lojistik)
- `listing.archived` (03a-katalog): sepet satırı silinir
- `store.deleted` (02-satici-magaza): sepet satırı silinir
- `review.published`, `review.removed` (11-degerlendirme): `Order Item.has_review` güncellenir
- `user.erased` (13-uyum-gizlilik): sepet silinir

## 5. Bağlamlar arası en ağır 10 bağımlılık

1. Ödeme sipariş durumunu yazıyor. Kanıt: `payments/service.py:453`. Etkilenen bağlam 05-odeme.
2. Lojistik siparişi `frappe.db.set_value` ile yazıyor. Bu yazım sipariş olaylarını atlar. Kanıt: `logistics/hooks.py:339`, `logistics/hooks.py:343`. Etkilenen bağlam 07-lojistik.
3. Lojistik sipariş kalemine iptal adedi yazıyor. Kanıt: `logistics/services/order_cancellation.py:264`. Etkilenen bağlam 07-lojistik.
4. Sipariş denetleyicisi vergi motorunun içini çağırıyor. Denetleyici, DocType'ın kendi Python sınıfı demektir. Kanıt: `order.py:141`, `order.py:142`, `order.py:155`. Etkilenen bağlamlar 06-vergi-fatura ve 03a-katalog.
5. Sepet onayı tek işlemde beş bağlamı çağırıyor. Kanıt: `api/cart.py:1885` (lojistik), `api/cart.py:2160` (sözleşme), `api/cart.py:2170` (stok), `api/cart.py:2176` (ödeme), `api/cart.py:2184` (taksit planı).
6. Onay akışı ödeme ile aynı durum değerini yazıyor. Kanıt: `services/order_approval_hooks.py:72` ve `payments/service.py:50`. Etkilenen bağlamlar 01-kimlik-erisim ve 05-odeme.
7. Değerlendirme sipariş kalemine yazıyor. Kanıt: `listing_review.py:128`, `listing_review.py:367`. Etkilenen bağlam 11-degerlendirme.
8. Stok kodu sipariş ve kalem alanlarını yazıyor. Kanıt: `utils/stock.py:569`, `utils/stock.py:210`. Etkilenen bağlam 03a-katalog.
9. `shared_sync` paketi sipariş durumunu en az beş yerden yazıyor. Kanıt: `shared_sync/checkout.py:379`, `shared_sync/checkout.py:486`, `shared_sync/amendments.py:601`, `shared_sync/checkout_review.py:90`, `shared_sync/refund_links.py:148`. Paketin sahibi belirsiz.
10. Sipariş kaydı her kaydedilişte katalog sayacını çalıştırıyor. Kanıt: `hooks.py:708`. Katalog ayrıca sepet satırını doğrudan siliyor (`api/listing.py:5748`). Etkilenen bağlam 03a-katalog.

## 6. Önerilen geçiş sırası

Her madde tek bir PR olacak kadar küçüktür. Sıra bağımlılığa göredir.

1. `shared/events.py`, `Domain Event` ve `Domain Event Receipt` kayıtlarını ekleyin. Henüz kimse olay yayınlamaz.
2. `ordering/state.py` dosyasını açın. Durum adlarını sabit yapın. `payments/service.py:49` bu sabitleri okusun.
3. `ordering/api.py` ve `ordering/contracts.py` dosyalarını açın. Okuma modellerini ekleyin. Davranış değişmez.
4. Ödeme, lojistik ve fatura kodundaki sipariş okumalarını okuma modellerine çevirin. Her bağlam ayrı PR açar.
5. `payment.collected` olayını ekleyin. Sipariş dinleyicisini yazın. Eski yolu bir ayar bayrağıyla açık tutun.
6. Bayrağı açın. `payments/service.py:434` içindeki sipariş ve stok yazımını silin.
7. Onay akışı için ayrı durum değeri açın. Onay yazımlarını olaya çevirin.
8. `shipment.*` olaylarını ekleyin. `logistics/hooks.py:339` yazımını silin.
9. `api/order.py:1489` içindeki eski "Kargoda" yolunu lojistik bağlamına taşıyın. Bu yol bugün sevkiyat kaydı açmadan durumu yazar.
10. Vergi hesabını `tax.api.quote_order_taxes` fonksiyonuna taşıyın. Sipariş denetleyicisi yalnız sonucu yazsın.
11. `order.confirmed`, `order.tax_calculated` ve sevkiyat taslağı dinleyicisini ekleyin. Otomatik taslak açılışını bir ayar bayrağı arkasında başlatın.
12. `api/cart.py:create_order` akışını `ordering/checkout.py` içine taşıyın.
13. `modules.txt` dosyasına "Ordering" modülünü ekleyin. DocType JSON `module` alanlarını değiştirin.
14. `import-linter` kuralını ve `CODEOWNERS` kaydını ekleyin.

## 7. Başka bağlama taşınması gereken DocType'lar

- `Seller Inquiry` 12-bildirim-iletisim bağlamına gitmeli. Kayıt bir iletişim mesajıdır. Sipariş ile bağı yoktur.
- `Order Tax Line` bu bağlama gelmeli. Bugün 06-vergi-fatura listesindedir.
- `Approval Rule` ve `Cost Center` bugün 01-kimlik-erisim listesindedir. Bu iki kayıt `Approved Supplier List` ve `Order Approval` ile aynı satın alma politikasıdır. Hepsi `ordering/procurement/` alt paketinde toplanmalı. Karar 01-kimlik-erisim sahibiyle verilmeli.
- `Order Contract Acceptance` bu bağlamda kalır. Kaydı yazan `contracts/` paketi `ordering/contracts/` konumuna taşınmalı.

## 8. Paralel çalışacak geliştiriciler için kurallar

1. Yalnız kendi paketinizdeki dosyayı değiştirin. Sipariş paketi `tradehub_core/ordering/` olur.
2. Başka bağlamın yalnız `api.py` ve `contracts.py` dosyasını içe aktarın. Örneğin `from tradehub_core.payments.service import ...` yazmayın.
3. Başka bağlamın tablosuna yazmayın. `frappe.db.set_value`, `frappe.get_doc(...).save()` ve SQL ile yazım yasaktır.
4. Sipariş durumunu yalnız `ordering.state.transition` ile değiştirin.
5. Olay verisine yalnız alan ekleyin. Alan silmek ya da anlamını değiştirmek için `schema_version` değerini artırın. Eski alanı iki sürüm boyunca koruyun.
6. Her olay dinleyicisi aynı olayı iki kez işleyebilmeli. Örneğin stok düşümü `stock_deducted` alanına bakar.
7. `hooks.py` dosyasında yalnız sipariş bölümüne satır ekleyin. Başka bağlamın satırını silmeyin.
8. Her API fonksiyonu için bir sözleşme testi yazın. Test `tradehub_core/ordering/tests/` klasöründe durur.
9. CI şu kuralı denetler: `tradehub_core.ordering` paketi başka bağlamın iç modülünü içe aktaramaz. Araç `import-linter` olur.
10. `CODEOWNERS` dosyasında `tradehub_core/ordering/` yolunun sahibi sipariş ekibidir. Bu yola dokunan PR sipariş ekibinin onayını bekler.

Bu belge gerçek okurla denenmedi.

## Epic özeti

Bu bağlamdaki her DocType bir epic olur. Liste öncelik, faz ve büyüklüğü verir.

- Approved Supplier Entry: Düşük, Faz 3, Küçük
- Approved Supplier List: Önemli, Faz 3, Orta
- Cart: Önemli, Faz 3, Küçük
- Cart Item: Önemli, Faz 3, Küçük
- Coupon: Önemli, Faz 3, Küçük
- Order: Kritik, Faz 3, Büyük
- Order Approval: Acil, Faz 3, Orta
- Order Approval Log: Düşük, Faz 3, Küçük
- Order Contract Acceptance: Önemli, Faz 3, Orta
- Order Dispute: Önemli, Faz 3, Orta
- Order Item: Kritik, Faz 3, Orta
- RFQ: Önemli, Faz 3, Orta
- RFQ Quote: Önemli, Faz 3, Küçük
- Seller Inquiry: Düşük, Faz 4, Küçük
