# Order Item

- Bağlam: 04-siparis
- Tür: Alt tablo
- Klasör: `tradehub_core/tradehub_core/doctype/order_item`
- Denetleyici: `tradehub_core/tradehub_core/doctype/order_item/order_item.py` (27 satır)
- Önerilen sahip bağlam: 04-siparis

## Epic

- Epic adı: Order Item: 04-siparis bağlamına taşıma
- Öncelik: Kritik
- Faz: Faz 3
- Tahmini büyüklük: Orta

### User story

Bir geliştirici olarak, sipariş kalemine yalnız sipariş kodunun yazmasını istiyorum.
Böylece iptal, yorum ve stok akışları kalemi bozmaz.

### Kabul kriterleri

- [ ] `cancelled_qty` alanını yalnız `ordering.api.record_cancelled_quantity` yazıyor.
- [ ] `has_review` alanı `review.published` ve `review.removed` olaylarıyla güncelleniyor.
- [ ] Lojistik kalem verisini `ordering.api.get_order_lines` ile okuyor.
- [ ] Kısmi iptal sonrası sipariş "Fulfilled" durumuna geçebiliyor.
- [ ] Characterization test: `Order Item` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- `logistics/services/order_cancellation.py` içinden `Order Item` tablosuna yazmayın. İptal adedini sipariş servisi yazar.
- `listing_review.py` içinden `has_review` alanına yazmayın. Değerlendirme bağlamı olay yayınlar.
- `tabOrder Item` tablosunu başka bağlamda ham SQL ile okumayın. Okuma modelini kullanın.
- Stok kaydı alanlarını (`stock_state`, `stock_variant_row`) REST ile değiştirmeyin.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] Kısmi iptal testi eklendi.
- [ ] Yorum yayınlama ve silme testi eklendi.
- [ ] İade sonrası stok bir kez geri verildi.
- [ ] `import-linter` kontrolü geçiyor.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?
`Order Item` siparişin kalem satırıdır. Her satır bir ilanı, adedi ve fiyatı tutar. Satır vergi anlık görüntüsünü de tutar. Örneğin `taxable_base_exact` ve `tax_amount_exact` alanları buradadır. Stok kaydı alanları (`stock_state`, `stock_variant_row`) da buradadır.

## Bugünkü bağımlılıklar
### Bu kaydın bağlandığı kayıtlar
- `Listing` (`listing`): başka bağlam (03a-katalog)
- `Admin Seller Profile` (`supplier`): başka bağlam (02-satici-magaza)
- `Listing Review` (`review`): başka bağlam (11-degerlendirme)

### Bu kayda dokunan kod
- `tradehub_core/tradehub_core/doctype/order/order.py:348`: yazıyor (stok kaydını korur)
- `tradehub_core/tradehub_core/doctype/order/order.py:218`: yazıyor (vergi alanları)
- `tradehub_core/utils/stock.py:210`: yazıyor (stok kaydı alanları, `db.set_value`)
- `tradehub_core/logistics/services/order_cancellation.py:264`: yazıyor (`cancelled_qty`, `db.set_value`)
- `tradehub_core/tradehub_core/doctype/listing_review/listing_review.py:128`: yazıyor (`has_review`, `review`)
- `tradehub_core/tradehub_core/doctype/listing_review/listing_review.py:367`: yazıyor (`has_review`, `review`)
- `tradehub_core/shared_sync/cutover.py:511`: yazıyor (`shared_sync_*` özel alanları)
- `tradehub_core/logistics/hooks.py:257`: okuyor (sevk edilen adet hesabı)
- `tradehub_core/logistics/services/split_engine.py:75`: okuyor (kalan adet)
- `tradehub_core/payments/service.py:129`: okuyor (`supplier`)
- `tradehub_core/tradehub_core/doctype/payment_intent/payment_intent.py:64`: okuyor
- `tradehub_core/api/review.py:254`: okuyor
- `tradehub_core/notifications/jobs.py:202`: okuyor

### hooks.py kayıtları
- Doğrudan kayıt yok. Alt tablo olduğu için `Order` olayları geçerlidir (`hooks.py:694`).

## Bağımlılık sorunları
1. Dört bağlam bu alt tabloya doğrudan yazıyor. Lojistik `cancelled_qty` yazar (`logistics/services/order_cancellation.py:264`). Değerlendirme `has_review` yazar (`listing_review.py:128`). Katalog stoğu `utils/stock.py:210` ile yazılır. `shared_sync` kendi alanlarını yazar (`shared_sync/cutover.py:511`). Bir alanın anlamı değişirse diğer bağlamlar bozulur.
2. Yazımlar `frappe.db.set_value` ile yapılır. Bu yüzden `Order` doğrulaması çalışmaz. Kod yorumu bunu bilinçli yaptığını söyler (`logistics/services/order_cancellation.py:260`).
3. Lojistik bu tabloyu SQL ve `frappe.qb` ile doğrudan okur (`logistics/hooks.py:257`). Tablo şeması değişirse lojistik hesabı bozulur.

## Hedef tasarım
- Sahip bağlam: 04-siparis. Paket yolu: `tradehub_core/ordering/`.
- Dışarıya açılan fonksiyonlar (`ordering/api.py`):
  - `get_order_lines(order: str) -> list[OrderLine]` (okuma modeli)
  - `record_cancelled_quantity(order: str, quantities: dict[str, int], reason: str)`
- Yayınladığı olaylar: kalem için ayrı olay yoktur. Kalemler `order.placed` ve `order.confirmed` verisinde gider.
- Dinlediği olaylar:
  - `review.published` ve `review.removed` (11-degerlendirme): `has_review` alanı güncellenir.
  - `shipment.cancelled_before_handover` (07-lojistik): iptal adedi sipariş servisinde yazılır.
  - `stock.reserved` ve `stock.deducted` (03a-katalog): stok kaydı alanları güncellenir.
- Başka bağlamlara bağlantılar: `listing` ve `supplier` Link olarak kalır. `listing_title`, `unit_price`, `image` anlık görüntü alanıdır. `review` Link alanı kalır ama yalnız olay işleyicisi yazar.
- Denetleyicide kalacak doğrulamalar: stok kaydı alanlarının korunması (`order_item.py:6`).

## Geçiş adımları
1. `ordering/api.py` içine `get_order_lines` okuma modelini ekleyin. Lojistik ve ödeme bu fonksiyonu okusun.
2. `record_cancelled_quantity` fonksiyonunu ekleyin. `order_cancellation.py:264` bu fonksiyonu çağırsın. Bu adım 1. adımdan bağımsızdır.
3. Değerlendirme bağlamı `review.published` olayını yayınlasın. `listing_review.py:128` ve `listing_review.py:367` doğrudan yazmayı bıraksın. Bu adım olay altyapısından sonra gelir.
4. Stok kaydını katalog stok servisi döndürsün. Sipariş bağlamı alanı kendisi yazsın.

## Riskler ve testler
- Kısmi iptal sonrası `fulfillment_status` bozulabilir. Test: iptal adedi yazılınca sipariş "Fulfilled" durumuna geçebilmeli.
- Değerlendirme bağlantısı kaybolabilir. Test: yorum yayınlanınca `has_review` 1, silinince 0 olmalı.
- Stok geri verme hatalı olabilir. Test: iade sonrası stok kaydı bir kez geri verilmeli.
