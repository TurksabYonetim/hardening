# 11-degerlendirme: Değerlendirme bağlamı

## 1. Bağlamın amacı
Bu bağlam, alıcı yorumlarını, puanları ve ürün sorularını yönetir. Yorum, teslim edilen siparişten sonra yazılır. Bağlam yorumları denetler, puanları hesaplar ve sonucu diğer bağlamlara duyurur. Önerilen paket yolu `tradehub_core/reviews/` olur. Önerilen Frappe modülü `Reviews` olur.

## 2. DocType listesi

Ana kayıtlar:

- `Listing Review`: ürün yorumu
- `Seller Review`: mağaza yorumu
- `Listing Question`: ürün sorusu
- `Listing Question Answer`: soru cevabı
- `Review Helpful Vote`: yorum için faydalı oyu
- `Question Helpful Vote`: soru ve cevap için faydalı oyu
- `Review Abuse Report`: yorum ihbarı
- `Review Risk Score`: yorum risk puanı
- `Review Sentiment Analysis`: yorum duygu analizi
- `Reviewer Reputation`: yorumcu itibarı
- `Trusted Reviewer Invitation`: güvenilir yorumcu daveti
- `Category Review Template`: kategori soru şablonu

Alt tablolar:

- `Listing Review Image`
- `Listing Review Update`
- `Review Risk Factor`
- `Template Question`

Kayıt defterleri (log):

- `Review Translation`: çeviri önbelleği
- `Review Analytics Snapshot`: günlük özet
- `Seller Review Analytics`: kullanılmıyor görünüyor

Ayar (single) DocType bu bağlamda yoktur.

## 3. Bağlamın dışa açık API'si
Önerilen dosya `tradehub_core/reviews/api.py` olur. Veri tipleri `tradehub_core/reviews/contracts.py` dosyasında durur.

- `submit_review(order_item, rating, body, aspects, images)`
- `get_listing_rating_summary(listing)`
- `get_reviews_for_listing(listing, page)`
- `submit_seller_review(seller, rating, comment)`
- `get_seller_reviews(seller, page)`
- `link_dispute(review, dispute)`
- `set_dispute_outcome(review, in_favor_of)`
- `anonymize_reviewer(user)` ve `anonymize_asker(user)`
- `ask_question(listing, question)` ve `answer_question(question, answer)`
- `list_answered_questions(listing, limit)`
- `get_reviewer_tier(user)`
- `get_category_template(category, listing)`

## 4. Yayınlanan ve dinlenen olaylar

Yayınlanan olaylar:

| Olay | Veri alanları | Kim dinler |
|---|---|---|
| `review.submitted` | review, listing, seller, reviewer_user | Bu bağlamın risk ve analiz işleri |
| `review.approved` | review, listing, seller, order_item | 04-siparis (`Order Item.has_review`), 12-bildirim-iletisim |
| `review.hidden` | review, listing, seller, reason | 12-bildirim-iletisim |
| `listing.rating_changed` | listing, average_rating, review_count, weighted_rating | 03a-katalog, 03c-kesif |
| `seller.rating_changed` | seller, average_rating, review_count | 02-satici-magaza |
| `review.image_added` | review, image_url | 08-medya |
| `question.asked` | question, listing, seller | 12-bildirim-iletisim |
| `question.answered` | question, listing, responder_type | 12-bildirim-iletisim, 10-seo |
| `reviewer.invited` | invitation, user, listing | 12-bildirim-iletisim |

Dinlenen olaylar:

| Olay | Sahip bağlam | Bu bağlam ne yapar |
|---|---|---|
| `order.delivered` | 04-siparis | Yorum hakkını açar |
| `dispute.opened` ve `dispute.resolved` | 04-siparis | Yorumdaki itiraz rozetini günceller |
| `media.image_rejected` | 08-medya | Yorumu gizler |
| `user.erased` | 13-uyum-gizlilik | Yazar adını anonim yapar |
| `seller.kyb_verified` | 02-satici-magaza | İtibar puanını yeniler |
| `catalog.listing_deleted` | 03a-katalog | Yorum ve soruları kapatır |

## 5. Bağlamlar arası en ağır 10 bağımlılık
1. Yorum puanı katalog tablosuna yazılıyor. `tradehub_core/api/review.py:148` `Listing` alanlarını `set_value` ile yazar.
2. Ağırlıklı puan da katalog tablosuna yazılıyor (`tradehub_core/api/rating_engine.py:202`).
3. Yorum denetleyicisi sipariş alt tablosuna yazıyor. `Order Item.has_review` alanı `listing_review.py:127` ve `listing_review.py:366` satırlarında değişir.
4. Sipariş kodu yorum tablosuna yazıyor. `tradehub_core/api/dispute.py:77`, `tradehub_core/api/dispute.py:102` ve `order_dispute.py:44` bu satırlardır.
5. Yorum silme, sipariş itirazının bağını boşaltıyor (`listing_review.py:585`).
6. Mağaza puanı satıcı tablosuna iki yerden yazılıyor. Bunlar `tradehub_core/api/listing.py:596` ve `tradehub_core/api/seller.py:1659` satırlarıdır.
7. Otomatik moderasyon kullanıcı hesabını kapatıyor. `tradehub_core/api/moderation.py:85` `User.enabled` alanını 0 yapar.
8. Yorum doğrulaması sipariş durum metnine bağlı. `listing_review.py:22` `{"Tamamlandı", "Kargoda"}` değerini sabit tutar.
9. Yorum ve soru kodu `KYB Verification` tablosunu okuyor. Bunlar `listing_review.py:280`, `listing_question.py:30`, `tradehub_core/api/qa.py:51` ve `tradehub_core/api/reputation.py:64` satırlarıdır.
10. Görsel denetimi medya tablosuna yazıyor. `tradehub_core/api/moderation.py:172` bir `Image Moderation Log` kaydı açar. Yorum silme de bu kayıtları siler (`listing_review.py:43`).

Ek gözlemler:

- Bu bağlamda 11 zamanlanmış iş vardır. Bunlar `tradehub_core/hooks.py:248`, `tradehub_core/hooks.py:345` ile `tradehub_core/hooks.py:357` arası ve `tradehub_core/hooks.py:424` satırlarındadır.
- API kodu işlemi sık sık kendisi bitiriyor. `frappe.db.commit()` `api/review.py` içinde 11, `api/qa.py` içinde 8 kez geçer. `tradehub_core/api/reputation.py:138` bunu bir `doc_event` kancası içinde yapar. Outbox deseni, olayın kayıtla aynı işlemde saklanmasını ister. Bu çağrılar o deseni bozar.
- Birçok kiracı kancası boşuna bağlı. Örneğin `Review Helpful Vote` kaydında satıcı alanı yoktur. `tradehub_core/utils/tenant.py:237` bu yüzden erken döner.
- `Listing Review` ve `Seller Review` `COUNTERPARTY_SELLER_DOCTYPES` listesindedir (`tradehub_core/utils/tenant.py:100`). Bu kayıtlarda satıcı alanı karşı tarafı gösterir.

## 6. Önerilen geçiş sırası
1. `Reviews` modülünü `modules.txt` dosyasına ekleyin. `tradehub_core/reviews/` paketini boş `api.py` ve `contracts.py` ile açın.
2. 19 DocType JSON dosyasının `module` alanını `Reviews` yapın. DocType klasörleri `tradehub_core/reviews/doctype/` altına taşınır. Bu adım tek PR olur ve iş kuralı değiştirmez.
3. Gereksiz kiracı kancalarını `hooks.py` içinden kaldırın.
4. `frappe.db.commit()` çağrılarını kaldırın. Önce `reputation.py:138` satırını düzeltin.
5. `seller.rating_changed` hesabını tek fonksiyonda birleştirin. `recompute_seller_rating_proxy` fonksiyonunu `api/listing.py` dosyasından taşıyın.
6. Başka bağlamlardan okuma fonksiyonları isteyin. Bunlar `ordering.api.get_order_item_for_review`, `ordering.api.is_delivered`, `seller.api.is_kyb_verified` ve `catalog.api.get_listing_owner` fonksiyonlarıdır.
7. Yorum ve soru doğrulamalarını bu okuma fonksiyonlarına çevirin. Bu adım 6. adımdan sonra gelir.
8. `api/review.py`, `api/qa.py`, `api/risk.py` ve diğer yorum dosyalarını `reviews/services/` altına taşıyın. Eski yollar bir süre yönlendirme olarak kalsın.
9. Ortak Outbox hazır olunca `review.approved` ve `listing.rating_changed` olaylarını yayınlayın.
10. `Listing` ve `Order Item` yazımlarını sahip bağlamların dinleyicilerine taşıyın. Bu adım 9. adımdan sonra gelir.
11. `dispute.py` ve `order_dispute.py` içindeki yorum yazımını `reviews.api.set_dispute_outcome` çağrısına çevirin.
12. `moderation.py:85` kullanıcı kapatma işini kimlik bağlamının fonksiyonuna verin.
13. Analiz ve çeviri kancalarını `frappe.enqueue` ile işlem sonrasına alın.
14. `Seller Review Analytics` için ürün kararını alın. Karar kaldırmaksa DocType ve zamanlanmış işi kaldırın.

## 7. Başka bağlama taşınması gereken DocType'lar
- Bu listedeki DocType'ların hepsi bu bağlamda kalmalıdır.
- `Seller Review` mağazayı anlatır. Ama yorum kuralları burada olduğu için bu bağlamda kalır. 02-satici-magaza yalnız özet puanı alır.
- `Moderation Rule` haritada 03a-katalog bağlamındadır. Ancak yorum moderasyonu bu kuralları okur (`tradehub_core/api/moderation.py:22`). Bu DocType'ın yorum için de kullanıldığı açıktır. Katalogda da kullanılıp kullanılmadığı doğrulanmadı. Yalnız yorum için kullanılıyorsa 11-degerlendirme bağlamına alınmalıdır.
- `Translation Usage Log` 09-icerik-vitrin bağlamındadır. Yorum çevirisi bu tabloya yazar (`tradehub_core/api/translation.py:116`). Çeviri motoru o bağlamın API'si olmalıdır.

## 8. Bu bağlamda paralel çalışacak geliştiriciler için kurallar
1. Başka bağlamın tablosuna `frappe.db.set_value` ile yazmayın. Örneğin `Listing` puanını olay ile duyurun.
2. Başka bağlamı yalnız onun `api.py` fonksiyonlarıyla okuyun.
3. Yorum durumunu yalnız `change_review_status` servisiyle değiştirin. `set_value` ile durum yazmayın.
4. API uçlarında `frappe.db.commit()` kullanmayın. İşlemi Frappe bitirir.
5. Yeni zamanlanmış işi `reviews` paketine yazın. `hooks.py` içine yalnız yol ekleyin.
6. Ağır işleri (yapay zekâ, çeviri, toplu hesap) `frappe.enqueue` ile kuyruğa atın.
7. Yoruma bağlı yeni bir DocType eklerseniz `release_review_links` listesine de ekleyin (`listing_review.py:39`).
8. Hata mesajlarını `_()` ile yazın.
9. Her olay dinleyicisi aynı olayı iki kez alırsa da doğru çalışmalıdır. Olay kimliğini saklayın.
10. Değişikliğinize test ekleyin. Testleri `tradehub_core/reviews/tests/` altında tutun.

## Epic özeti

Bu bağlamdaki her DocType bir epic olur. Liste öncelik, faz ve büyüklüğü gösterir.

- Category Review Template: Düşük, Faz 4, Küçük
- Listing Question Answer: Önemli, Faz 4, Küçük
- Listing Question: Önemli, Faz 4, Orta
- Listing Review Image: Önemli, Faz 4, Orta
- Listing Review Update: Düşük, Faz 4, Küçük
- Listing Review: Acil, Faz 4, Büyük
- Question Helpful Vote: Düşük, Faz 4, Küçük
- Review Abuse Report: Önemli, Faz 4, Küçük
- Review Analytics Snapshot: Düşük, Faz 4, Küçük
- Review Helpful Vote: Önemli, Faz 4, Küçük
- Review Risk Factor: Düşük, Faz 5, Küçük
- Review Risk Score: Önemli, Faz 4, Orta
- Review Sentiment Analysis: Önemli, Faz 4, Küçük
- Review Translation: Önemli, Faz 4, Orta
- Reviewer Reputation: Acil, Faz 4, Orta
- Seller Review Analytics: Düşük, Faz 4, Küçük
- Seller Review: Acil, Faz 4, Orta
- Template Question: Düşük, Faz 5, Küçük
- Trusted Reviewer Invitation: Önemli, Faz 4, Orta
