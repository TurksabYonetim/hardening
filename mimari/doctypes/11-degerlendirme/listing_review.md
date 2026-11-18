# Listing Review

- Bağlam: 11-degerlendirme
- Tür: Ana kayıt
- Klasör: `tradehub_core/tradehub_core/doctype/listing_review`
- Denetleyici: `tradehub_core/tradehub_core/doctype/listing_review/listing_review.py` (591 satır)
- Önerilen sahip bağlam: 11-degerlendirme

## Epic

- Epic adı: Listing Review: 11-degerlendirme bağlamına taşıma
- Öncelik: Acil
- Faz: Faz 4
- Tahmini büyüklük: Büyük

### User story

Bir geliştirici olarak, yorum kodunun sipariş, katalog ve kullanıcı tablolarına yazmamasını istiyorum.
Böylece başka ekiplerin değişiklikleri yorum akışını bozmaz.

### Kabul kriterleri

- [ ] `Order Item.has_review` ve `review` alanlarını yalnız sipariş bağlamı yazıyor. Yorum kodu `review.approved` olayı yayınlıyor.
- [ ] `Listing` puan alanlarını yalnız katalog bağlamı yazıyor. Yorum kodu `listing.rating_changed` olayı yayınlıyor.
- [ ] `api/moderation.py` içinde `User.enabled` alanına yazan kod kalmıyor. Hesap kapatma kimlik bağlamının fonksiyonuyla yapılıyor.
- [ ] Yorum durumu yalnız `reviews` servis fonksiyonuyla değişiyor. Kodda yorum durumu için `frappe.db.set_value` çağrısı kalmıyor.
- [ ] Sipariş zinciri kontrolü `ordering.api` fonksiyonlarıyla yapılıyor. `ORDER_DELIVERED_STATUSES` sabiti kodda kalmıyor.
- [ ] `import-linter` kontrolü `tradehub_core.reviews` için geçiyor.
- [ ] Characterization test: `Listing Review` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- `listing_review.py` içinden `Order Item` alanlarına yazmayın. Bu alanlar sipariş bağlamına aittir.
- `recompute_listing_rating` içinden `Listing` kaydına `set_value` ile yazmayın. Puanı olayla gönderin.
- Yorum durumunu `frappe.db.set_value` ile değiştirmeyin. Bu yol bildirimleri ve puan yenilemesini atlar.
- Sipariş durum adlarını yorum koduna sabit yazmayın. Sipariş ekibi adı değiştirirse yorum yazılamaz.
- `hooks.py` dosyasına doğrudan yeni `doc_events` kaydı eklemeyin. Kancayı `reviews` bağlamının kanca dosyasına yazın.
- Yorum kaydıyla aynı işlemde dış yapay zekâ servisini çağırmayın. Bu işi kuyruğa alın.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] `tradehub_core/tradehub_core/doctype/listing_review/test_listing_review.py` testleri geçiyor.
- [ ] Yorum onayı, gizleme ve silme için olay sözleşme testi eklendi.
- [ ] Puan hesabı için önce ve sonra karşılaştırma testi eklendi.
- [ ] `import-linter` kontrolü geçiyor.
- [ ] Sipariş ve katalog bağlamının `CODEOWNERS` sahiplerinden inceleme istendi.
- [ ] Kodda yeni `frappe.db.commit()` çağrısı yok.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?
Alıcı, teslim aldığı ürün için yorum ve puan yazar. Bu kayıt o yorumu tutar. Yorum onaylanınca ürünün puan ortalamasına katılır. Satıcı yanıtı, risk puanı ve dil bilgisi de bu kayıtta durur.

## Bugünkü bağımlılıklar
### Bu kaydın bağlandığı kayıtlar
- `Listing` (`listing`): başka bağlam (03a-katalog)
- `Admin Seller Profile` (`seller`): başka bağlam (02-satici-magaza)
- `Order` (`order`): başka bağlam (04-siparis)
- `Order Item` (`order_item`): başka bağlam (04-siparis). `Order Item` bir alt tablodur.
- `User Profile` (`reviewer`): başka bağlam (01-kimlik-erisim)
- `User` (`reviewer_user`, `seller_reply_by`): başka bağlam (01-kimlik-erisim)
- `Order Dispute` (`related_dispute`): başka bağlam (04-siparis)
- `Listing Review Image` (`images`): aynı bağlam, alt tablo
- `Listing Review Update` (`updates`): aynı bağlam, alt tablo

### Bu kayda dokunan kod
- `tradehub_core/api/review.py:310`: yazıyor (yeni yorum, `insert`)
- `tradehub_core/api/review.py:351`: yazıyor (yorum düzenleme)
- `tradehub_core/api/review.py:992`: yazıyor (yönetici onayı ve gizleme)
- `tradehub_core/api/review.py:1053`: yazıyor (`helpful_count` sayaçları, `set_value`)
- `tradehub_core/api/review.py:1157`: yazıyor (ihbar eşiğinde `status = Hidden`, `set_value`)
- `tradehub_core/api/review.py:1251`: yazıyor (satıcı yanıtı)
- `tradehub_core/api/risk.py:317`: yazıyor (`risk_score`, `set_value`)
- `tradehub_core/api/moderation.py:72`: yazıyor (otomatik ret ve gizleme, `set_value`)
- `tradehub_core/api/translation.py:288`: yazıyor (`detected_language`)
- `tradehub_core/api/templates.py:91`: yazıyor (`category_template_answers`)
- `tradehub_core/api/timeline.py:115`: yazıyor (`updates` alt tablosu)
- `tradehub_core/api/timeline.py:141`: yazıyor (`long_term_score`)
- `tradehub_core/api/dispute.py:77`: yazıyor (`related_dispute`). Bu kod 04-siparis bağlamındadır.
- `tradehub_core/api/dispute.py:102`: yazıyor (`dispute_resolved_in_favor_of`). Bu kod 04-siparis bağlamındadır.
- `tradehub_core/tradehub_core/doctype/order_dispute/order_dispute.py:44`: yazıyor. Bu denetleyici 04-siparis bağlamındadır.
- `tradehub_core/privacy/account_deletion.py:300`: yazıyor (yazar adını anonim yapar). Bu kod 13-uyum-gizlilik bağlamındadır.
- `tradehub_core/tasks.py:1264`: okuyor (satıcı yanıt oranı, 02-satici-magaza işi)
- `tradehub_core/api/storefront_api.py:86`, `tradehub_core/api/mobile_api.py:191`, `tradehub_core/api/seo.py:131`: okuyor
- `tradehub_core/api/analytics.py:69`, `tradehub_core/api/ab_testing.py:42`: okuyor
- `tradehub_core/listing_purge/preview.py:21`: okuyor (ürün kalıcı silme planı)

### hooks.py kayıtları
- `tradehub_core/hooks.py:745`: `before_insert` ve `validate` kiracı (tenant) kancaları. Kiracı, kaydın hangi satıcıya ait olduğunu belirtir.
- `tradehub_core/hooks.py:748`: `after_insert` beş kancası. Bunlar `api.review`, `api.risk`, `api.webhooks`, `api.moderation` ve `api.sentiment` fonksiyonlarıdır.
- `tradehub_core/hooks.py:755`: `on_update` üç kancası. Bunlar `api.review`, `api.reputation` ve `api.push` fonksiyonlarıdır.
- `tradehub_core/hooks.py:760`: `on_trash` kancası.
- `tradehub_core/hooks.py:1085` ve `tradehub_core/hooks.py:1212`: okuma izni kuralları (`tradehub_core/permissions.py:921`, `tradehub_core/permissions.py:936`).
- `tradehub_core/utils/tenant.py:105`: kayıt `COUNTERPARTY_SELLER_DOCTYPES` listesindedir. Kiracı kancası bu yüzden erken döner.

## Bağımlılık sorunları
1. Denetleyici sipariş tablosuna yazıyor. `Order Item.has_review` ve `review` alanları değişiyor (`listing_review.py:127`, `listing_review.py:366`). Sipariş ekibi `Order Item` şemasını değiştirirse yorum onayı bozulur.
2. Puan hesabı katalog tablosuna yazıyor. `recompute_listing_rating` `Listing` kaydını `set_value` ile günceller (`tradehub_core/api/review.py:148`). Ayrıca ham SQL ile `tabListing Review` okur (`tradehub_core/api/review.py:84`). Katalog ekibi puan alanlarını değiştirirse yorumlar bozulur.
3. Ağırlıklı puan da katalog tablosuna yazıyor (`tradehub_core/api/rating_engine.py:202`).
4. Sipariş bağlamı yorum tablosuna yazıyor. `api/dispute.py:77`, `api/dispute.py:102` ve `order_dispute.py:44` bu alanları doğrudan değiştirir.
5. Otomatik kural kullanıcı hesabını kapatıyor. `tradehub_core/api/moderation.py:85` `User.enabled` alanını 0 yapar. Bu iş 01-kimlik-erisim bağlamına aittir.
6. Doğrulama başka bağlamların tablolarını okuyor. `Order`, `Order Item` (`listing_review.py:194`, `listing_review.py:207`), `Listing` (`listing_review.py:228`), `User Profile` (`listing_review.py:235`), `Admin Seller Profile` (`listing_review.py:260`) ve `KYB Verification` (`listing_review.py:280`) okunur.
7. Yorum, sipariş durumu metnine bağlı. `ORDER_DELIVERED_STATUSES` değeri `{"Tamamlandı", "Kargoda"}` olarak sabit yazılmış (`listing_review.py:22`). Sipariş ekibi durum adını değiştirirse yorum yazılamaz.
8. Durum değişiklikleri denetleyiciyi atlıyor. `moderation.py:79` ve `review.py:1157` durumu `set_value` ile yazar. Bu yolda `on_update` çalışmaz ve bildirim gitmez.
9. Silme sırasında başka bağlamın kayıtları siliniyor. `release_review_links` `Image Moderation Log` (08-medya) kayıtlarını siler (`listing_review.py:43`, `listing_review.py:590`).
10. `after_insert` kancaları aynı işlemde dış servis çağırabilir. `sentiment.queue_analysis` analizi eşzamanlı yapar (`tradehub_core/api/sentiment.py:208`). Dış servis yavaşsa yorum kaydı da yavaşlar.

## Hedef tasarım
- Sahip bağlam ve paket yolu: `tradehub_core/reviews/`. Frappe modülü `Reviews` olur.
- Dışarıya açılan fonksiyonlar (`reviews/api.py`):
  - `submit_review(order_item, rating, body, ...)`
  - `get_listing_rating_summary(listing)`
  - `get_reviews_for_listing(listing, page)`
  - `link_dispute(review, dispute)` ve `set_dispute_outcome(review, in_favor_of)`
  - `anonymize_reviewer(user)`
- Yayınladığı olaylar:
  - `review.submitted` (review, listing, seller, reviewer_user)
  - `review.approved` ve `review.hidden` (review, listing, seller, order_item)
  - `listing.rating_changed` (listing, average_rating, review_count, weighted_rating)
- Dinlediği olaylar:
  - `order.delivered` (order, order_items, buyer). Bu olay yorum hakkı açar.
  - `dispute.opened` ve `dispute.resolved` (dispute, review, in_favor_of)
  - `user.erased` (user). Bu olay anonimleştirmeyi başlatır.
- Başka bağlamlara bağlantılar:
  - `listing`, `order`, `seller`, `reviewer_user` Link alanları kalır. Bunlar kararlı ana kayıtlardır.
  - `order_item` Link alanı kalabilir. Ama yorum bu alt tabloya yazmaz.
  - `Order Item.has_review` alanını sipariş bağlamı `review.approved` olayıyla günceller.
  - `Listing` puan alanlarını katalog bağlamı `listing.rating_changed` olayıyla günceller.
  - `reviewer_display_name` ve `is_kyb_verified` anlık görüntü (snapshot) alanıdır. Anlık görüntü, o andaki değerin kopyasıdır.
- Denetleyicide kalacak doğrulamalar: puan aralığı, metin uzunluğu, görsel sınırı, düzenleme süresi.
- Servise taşınacak iş kuralları: sipariş zinciri kontrolü, kendi ürününe yorum yasağı, KYB bayrağı, puan hesabı, bildirimler.

## Geçiş adımları
1. `reviews/contracts.py` dosyasını ekleyin. Olay veri tiplerini burada tanımlayın.
2. Sipariş bağlamından `ordering.api.get_order_item_for_review(order_item)` fonksiyonunu isteyin. Bu adım 1. adımdan sonra gelir.
3. `_validate_order_chain` içindeki doğrudan okumaları bu fonksiyonla değiştirin. Bu adım 2. adımdan sonra gelir.
4. Sabit `ORDER_DELIVERED_STATUSES` yerine sipariş bağlamının `is_delivered(order)` fonksiyonunu kullanın.
5. Olay yayınlayıcısı (Outbox) hazır olunca `review.approved` olayını yayınlayın. Outbox, olayın aynı işlemde saklandığı tablodur.
6. `Order Item` yazımını (`listing_review.py:127`, `listing_review.py:366`) sipariş bağlamındaki bir dinleyiciye taşıyın. Bu adım 5. adımdan sonra gelir.
7. `listing.rating_changed` olayını yayınlayın. Katalog bağlamı `Listing` alanlarını kendi dinleyicisiyle yazsın.
8. `api/review.py:148` ve `rating_engine.py:202` içindeki `Listing` yazımını kaldırın. Bu adım 7. adımdan sonra gelir.
9. `dispute.py` ve `order_dispute.py` içindeki yorum yazımını `reviews.api.set_dispute_outcome` çağrısına çevirin.
10. `moderation.py:85` kullanıcı kapatma işini `identity.api.suspend_user` çağrısına çevirin.
11. `set_value` ile yapılan durum değişikliklerini tek bir `change_review_status` servis fonksiyonuna toplayın.
12. `sentiment.queue_analysis` işini `frappe.enqueue` ile işlem sonrasına alın.

## Riskler ve testler
- Yorum onayında `Order Item.has_review` gecikmeli dolabilir. Olay işlendikten sonra alanın dolduğunu sınayan test ekleyin.
- Ürün puanı olay gelene kadar eski kalabilir. Onay, gizleme ve silmeden sonra puanı sınayan test ekleyin.
- İtiraz sonucu rozeti kaybolabilir. `resolve_dispute` sonrası yorum alanını sınayan test ekleyin.
- Mevcut test `tradehub_core/tradehub_core/doctype/listing_review/test_listing_review.py` korunmalı.
