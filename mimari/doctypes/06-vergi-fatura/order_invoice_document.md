# Order Invoice Document

- Bağlam: 06-vergi-fatura
- Tür: Ana kayıt
- Klasör: `tradehub_core/tradehub_core/doctype/order_invoice_document`
- Denetleyici: `tradehub_core/tradehub_core/doctype/order_invoice_document/order_invoice_document.py` (127 satır)
- Önerilen sahip bağlam: 06-vergi-fatura

## Epic

- Epic adı: Order Invoice Document: 06-vergi-fatura bağlamına taşıma
- Öncelik: Kritik
- Faz: Faz 3
- Tahmini büyüklük: Büyük

### User story

Bir satıcı olarak, sipariş kesinleşince proforma belgesinin kendiliğinden hazırlanmasını istiyorum.
Böylece alıcıya hızlı belge veririm.

### Kabul kriterleri

- [ ] `order.confirmed` olayı tek proforma taslağı açıyor. Olay iki kez gelince tek taslak kalıyor.
- [ ] `order.tax_calculated` olayı yayınlanıyor ve sözleşme testi geçiyor.
- [ ] Fatura servisi siparişi `ordering.api.get_invoice_source` ile okuyor.
- [ ] Paket `tax/invoicing/` konumunda. Eski yol çalışıyor.
- [ ] Characterization test: `Order Invoice Document` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- Yayımlı belgeyi değiştirmeyin. Yeni sürüm açın.
- Fatura servisi dışından bu kayda yazmayın. Kural `hooks.py:1579` yorumunda yazılıdır.
- `shared_sync` iç modülünü fatura kodundan çağırmayın.
- Vergi satırlı siparişe eski tek oranlı şablonla belge üretmeyin.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] Tekrar gönderilen olay testi eklendi.
- [ ] Yayımlı belge değişmezlik testi geçiyor.
- [ ] Olay sözleşme testi eklendi.
- [ ] Sipariş ve lojistik ekibinden inceleme istendi.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?
`Order Invoice Document` siparişe bağlı proforma belgesini ya da satıcının yüklediği faturayı tutar. Proforma, ödeme öncesi düzenlenen bilgi faturası demektir. Belge satıcı, alıcı ve tutar anlık görüntüsünü JSON olarak saklar. Belge yayımlanınca değiştirilemez. Yeni sürüm eskisinin yerine geçer.

## Bugünkü bağımlılıklar
### Bu kaydın bağlandığı kayıtlar
- `Order` (`order`): başka bağlam (04-siparis)
- `Admin Seller Profile` (`seller`): başka bağlam (02-satici-magaza)
- `User` (`buyer`): framework kaydı
- `Order Invoice Document` (`replaces`): aynı bağlam

### Bu kayda dokunan kod
- `tradehub_core/invoice_documents/service.py:467`: yazıyor (proforma taslağı)
- `tradehub_core/invoice_documents/service.py:576`: yazıyor (yayımlar)
- `tradehub_core/invoice_documents/service.py:631`: yazıyor (geri çeker)
- `tradehub_core/invoice_documents/service.py:75`: siparişi okuyor (`frappe.get_doc("Order")`)
- `tradehub_core/invoice_documents/service.py:94`: mağazayı okuyor (`contracts.service.seller_snapshot` ve `Admin Seller Profile`)
- `tradehub_core/invoice_documents/service.py:223`: siparişi okuyor (`shared_sync.order_view.financial_document`)
- `tradehub_core/api/v1/invoice_documents.py:25`: uç noktalar
- `tradehub_core/shared_sync/seller_records.py:386`: okuyor
- `tradehub_core/media/file_isolation.py:110`: dosya izni için okuyor

### hooks.py kayıtları
- `hooks.py:1580` ve `hooks.py:1581`: liste ve kayıt izni `invoice_documents.permissions` içindedir.

## Bağımlılık sorunları
1. Fatura servisi siparişi ve mağazayı doğrudan okuyor (`invoice_documents/service.py:75`, `invoice_documents/service.py:97`). Okuma kabul edilebilir ama belgeli okuma modeli yok. Sipariş alanı değişince belge anlık görüntüsü bozulur.
2. Servis `shared_sync` iç modülünü çağırıyor (`invoice_documents/service.py:223`).
3. Yeni vergi satırı olan siparişte belge üretilemiyor (`invoice_documents/service.py:229`). Vergi motoru ile fatura belgesi uyumsuz. Bu durum 04-siparis akışında satıcıyı belgesiz bırakır.
4. İyi yanı: bu paket yazımı tek serviste topluyor (`hooks.py:1579` yorumu). Diğer bağlamlar için örnek olabilir.

## Hedef tasarım
- Sahip bağlam: 06-vergi-fatura. Paket yolu: `tradehub_core/tax/invoicing/`. Bugünkü `invoice_documents/` paketi buraya taşınır.
- Dışarıya açılan fonksiyonlar (`tax/api.py`):
  - `create_proforma_draft(order: str, key: str) -> InvoiceDocumentView`
  - `get_order_documents(order: str, viewer: str) -> list[InvoiceDocumentView]`
  - `order_summary_html(order: str) -> str`
- Yayınladığı olaylar:
  - `order.tax_calculated`: veri `order`, `seller`, `currency`, `tax_total_exact`, `grand_total_exact`, `tax_lines_hash`, `invoice_document`.
  - `invoice.published`: veri `document`, `order`, `kind`, `version_no`.
- Dinlediği olaylar:
  - `order.confirmed` (04-siparis): vergi anlık görüntüsü doğrulanır. Proforma taslağı açılır. Sonra `order.tax_calculated` yayınlanır.
  - `order.amended` (04-siparis): eski belge "superseded" olur.
- Başka bağlamlara bağlantılar: `order`, `seller`, `buyer` Link alanları kalır. `seller_snapshot`, `buyer_snapshot`, `lines_snapshot` anlık görüntü alanlarıdır.
- Okuma modelleri: `ordering.api.get_invoice_source(order)` ve `stores.api.get_seller_letterhead(seller)`.
- Denetleyicide kalacak doğrulamalar: kimlik (`order_invoice_document.py:68`), durum geçişi (`order_invoice_document.py:75`), biçim (`order_invoice_document.py:97`), fatura numarası (`order_invoice_document.py:110`).

## Geçiş adımları
1. `ordering.api.get_invoice_source` okuma modelini ekleyin. Bu adım 04-siparis bağlamında yapılır.
2. `invoice_documents/service.py:75` ve `invoice_documents/service.py:223` bu modeli kullansın.
3. `order.confirmed` dinleyicisini ekleyin. Dinleyici proforma taslağını açsın ve `order.tax_calculated` yayınlasın. Bu adım olay altyapısından sonra gelir.
4. Vergi satırlı siparişler için belge şablonunu genişletin. Bu adım ayrı bir iş kararıdır.
5. Paketi `tax/invoicing/` konumuna taşıyın. Eski yolda yönlendirme bırakın.

## Riskler ve testler
- Yayımlı belge değişebilir. Test: yayımlı belgede alan değişince kayıt reddedilmeli.
- Olay iki kez gelince iki taslak açılabilir. Test: aynı olay iki kez işlenince tek taslak kalmalı.
