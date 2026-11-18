# 03c-kesif: Keşif bağlamı

## 1. Bağlamın amacı
Keşif bağlamı alıcının ürün bulmasına yardım eder. Benzer ürün önerisi, kişiye özel seçimler, favoriler, arama geçmişi, görüntüleme sayacı ve AB testi buradadır. Bu bağlam kataloğu değiştirmez. Kataloğu okur ve kullanıcı davranışından sinyal üretir. Tablolarının çoğu hesaplanmış önbellek ya da log kaydıdır.

## 2. DocType listesi
Ana kayıtlar:
- `Buyer Favorite Item` (favori ürün)
- `Buyer Favorite List` (özel favori listesi)
- `Listing AB Test` (AB testi)

Alt tablolar:
- `AB Test Variant` (`Listing AB Test` altı)

Ayar kaydı:
- `Related Products Settings` (öneri ağırlıkları, tek kayıt)

Kayıt defterleri ve önbellekler:
- `Related Listing Cache` (ürün önerileri)
- `Category Embedding` (kategori vektörü)
- `Category Neighbour Cache` (kategori benzerliği)
- `Listing View Counter` (24 saatlik görüntüleme sayacı)
- `User Product View` (görüntüleme logu)
- `Search History` (arama logu)
- `Buybox Selection` (kazanan teklif, yanlış bağlamda, bkz. 7. bölüm)

Toplam 12 DocType.

## 3. Bağlamın dışa açık API'si
Paket: `tradehub_core/discovery/`. Alt paketler: `recommendations/`, `favorites/`, `search/`, `signals/`, `tailored/`, `experiments/`. Dosyalar: `api.py` ve `contracts.py`.

- `get_related_listings(listing, relation_type=None, limit=8)`: önerilen ürünler (vitrin).
- `get_tailored_selections(user, limit)`: kişiye özel seçimler (vitrin).
- `record_view(listing, user, session)`: görüntüleme kaydı (vitrin).
- `get_views_24h(listings)`: son 24 saat sayısı (sosyal kanıt).
- `get_favorite_counts(listings)`: beğeni sayısı (sosyal kanıt, 03a `wishlist_count` için).
- `record_search(user, query, category)`, `get_search_suggestions(user, limit)`.
- `export_user_favorites(user)`, `export_user_search_history(user)`, `export_user_views(user)` (13 uyum için okuma modeli).
- `purge_user_favorites(user)`, `purge_user_search_history(user)`, `purge_user_views(user)` (13 uyum için silme).
- `trigger_rebuild()`: öneri tablosunu yeniden kurar (yönetici).

Sözleşmeler (`contracts.py`): `RelatedListing`, `TailoredGroup`, `UserDataExport`.

## 4. Yayınlanan ve dinlenen olaylar
Yayınlanan olaylar:
| Olay adı | Veri alanları | Kim dinler |
|---|---|---|
| `discovery.favorite_added` ve `discovery.favorite_removed` | user, listing | 03a `wishlist_count` anlık görüntüsü (isteğe bağlı) |
| `discovery.ab_test_completed` | test, seller, winner | 12 bildirim |

Dinlenen olaylar:
| Olay adı | Kaynak bağlam | Ne yapar |
|---|---|---|
| `catalog.listing_updated` | 03a | öneri yeniden hesabını kuyruğa alır |
| `catalog.listing_status_changed` | 03a | pasif ürünü öneri tablosundan düşürür |
| `catalog.listing_deleted` ve `catalog.listing_archived` | 03a | önbellek, sayaç, log ve favori satırlarını siler, AB testini iptal eder |
| `catalog.category_deleted` | 03a | vektör, komşu ve öneri satırlarını siler |
| `catalog.category_updated` | 03a | kategori adı değişince vektörü yeniden hesaplar |
| `order.confirmed` | 04 | kişisel öneri önbelleğini düşürür, birlikte satın alma verisi toplar |
| `matching.buybox_changed` | 03b | vitrin önbelleğini düşürür |
| `identity.user_deletion_requested` | 01 veya 13 | kullanıcı verisini siler |
| `review.aggregates_changed` | 11 | AB testi ölçütünü günceller (isteğe bağlı) |

## 5. Bağlamlar arası en ağır 10 bağımlılık
1. `tradehub_core/hooks.py:597,600,613,625`: `Listing` kaydına dört öneri kancası bağlı. Her ürün kaydı `schedule_recompute_on_listing_update` ile kuyruğa iş atıyor.
2. `tradehub_core/api/listing.py:107-116`: katalog kodu keşif tablolarını (`Listing View Counter`, `User Product View`, `Related Listing Cache`) adıyla tanıyor ve ürün silinirken siliyor. Katalog keşif şemasını bilmek zorunda.
3. `tradehub_core/api/listing.py:3714-3728`: vitrin `Related Listing Cache` tablosunu ham SQL ile okuyor.
4. `tradehub_core/api/listing.py:3820-3935`: `Search History` tüm kodu katalog vitrin dosyasında duruyor. `hooks.py:342` günlük görevi oradan çağırıyor.
5. `tradehub_core/services/category_delete.py:29,305-311`: katalog servisi `Category Embedding`, `Category Neighbour Cache`, `Related Listing Cache` satırlarını doğrudan siliyor. Aynı iş `recommendations/cleanup.py` içinde de var.
6. `tradehub_core/hooks.py:638`: `Product Category.on_trash` keşif temizliğine bağlı.
7. `tradehub_core/hooks.py:719`: `Order.on_update` içinde `tailored.invalidate_tailored_user_cache`. Sipariş kaydı (04) keşif koduna bağlı.
8. `tradehub_core/privacy/account_deletion.py:331,341-345` ve `data_export.py:194-209`: uyum bağlamı (13) `Search History`, `User Product View`, `Buyer Favorite List` tablolarını doğrudan siliyor ve okuyor.
9. `tradehub_core/api/listing.py:5751`: katalog kodu `Buyer Favorite Item` satırlarını ürün arşivlenince siliyor.
10. `tradehub_core/api/ab_testing.py:14-47,127`: AB testi ölçütü `Listing` tablosundaki yorum puanı anlık görüntüsünden (11) okunuyor. Yetki için `api.review._is_admin` özel fonksiyonu çağrılıyor.
Ek: `tradehub_core/recommendations/price_tier.py:82,89` keşif bağlamı `Listing.price_tier` kolonunu yazıyor. Bu yazma 03a raporunda ele alındı.

## 6. Önerilen geçiş sırası
1. `discovery/api.py` iskeleti ve `get_related_listings`, `get_views_24h`, `get_favorite_counts` okuma fonksiyonları. `api/listing.py:3714` ve `social_proof.py:129,152` bunları çağırır.
2. `Search History` kodunu `api/listing.py:3820-3935` içinden `discovery/search/history.py` dosyasına taşıma. `hooks.py:342` yolu güncellenir.
3. `api/tailored.py`, `api/favorites.py`, `api/social_proof.py`, `api/ab_testing.py` ve `recommendations/` paketini `discovery/` altına taşıma. Dış adlar `hooks.py` içinde güncellenir. Davranış değişmez.
4. `Buyer Favorite Item`, `Buyer Favorite List`, `Listing AB Test`, `Seller XML Feed` benzeri için `permission_query_conditions` ekleme.
5. `export_user_*` ve `purge_user_*` fonksiyonları. `privacy/account_deletion.py` ve `data_export.py` bunları çağırır.
6. Önbellek ve log tablolarındaki `listing` Link alanlarını `Data` yapma (`Related Listing Cache`, `Listing View Counter`, `User Product View`). Yama değer korur. `api/listing.py:107-116` listesi kalkar.
7. Outbox gelince `hooks.py:597,600,613,625,638,719` kancalarını olay dinleyicilerine taşıma.
8. `api/listing.py:5751` favori silmesini `catalog.listing_archived` dinleyicisine taşıma.
9. `category_delete.py:305-311` satırlarını kaldırma. Temizlik yalnız `catalog.category_deleted` dinleyicisinde kalır.
10. Sipariş verisi okumasını (`complementary.py:92-159`) `order.api.get_copurchase_pairs` okuma modeline çevirme.
11. `Buybox Selection` haritasını 03b olarak güncelleme.
12. Tüm DocType JSON `module` alanlarını "Discovery" yapma. En son adım.

## 7. Başka bağlama taşınması gereken DocType'lar
- `Buybox Selection`: 03b-ice-aktarma bağlamına taşınmalı. Tek yazıcı `catalog/service.py:809-841` eşleştirme servisidir. Keşif yalnız sonucu okur.
- `Listing AB Test` ve `AB Test Variant`: Keşifte kalabilir. Ölçütler yorum puanı olduğu için 11-degerlendirme de sahip olabilir. Keşifte kalması önerilir. Çünkü amaç vitrin denemesidir.
- Harita bu analizde değiştirilmedi.

## 8. Bu bağlamda paralel çalışacak geliştiriciler için kurallar
1. Kataloğu değiştirmeyin. `Listing` tablosuna yazmayın. `price_tier` gibi anlık görüntü için `catalog.api.set_price_tier` çağırın.
2. Ürün verisini `catalog.api.get_listing_cards` ve `get_category` ile okuyun. `frappe.get_all("Listing")` çağrısı yalnız toplu hesap görevlerinde ve belgelenmiş okuma modeliyle yapılır.
3. `hooks.py` içinde `Listing`, `Product Category` ya da `Order` kaydına yeni kanca eklemeyin. Olay dinleyicisi yazın.
4. Önbellek ve log tabloları başka bağlamın kaydını Link ile kilitlemez. `listing` alanı `Data` olur. Silme olayı dinlenir.
5. Kişisel veri taşıyan her tablo (`Buyer Favorite *`, `Search History`, `User Product View`) `permission_query_conditions` ile korunur. `export_user_*` ve `purge_user_*` fonksiyonu olmadan yeni kişisel tablo birleştirilmez.
6. Vitrin kodu keşif tablolarını ham SQL ile okumaz. `discovery.api` fonksiyonunu çağırır.
7. `discovery/` paketi `order`, `tax`, `logistics`, `seo`, `media`, `shared_sync` paketlerinden içe aktarma yapmaz. `import-linter` sözleşmesi CI'da denetler.
8. `CODEOWNERS` girdisi `tradehub_core/discovery/` ve `tradehub_core/discovery/tests/` klasörlerini kapsar.
9. Ağır hesaplar (`rebuild_related_matrix`, `build_category_embeddings`) `long` kuyruğunda kalır. Olay dinleyicisi yalnız kuyruğa iş atar.
10. Her PR tek adımı kapsar.

## Epic özeti

- AB Test Variant: Düşük, Faz 5, Küçük
- Buybox Selection: Önemli, Faz 4, Küçük
- Buyer Favorite Item: Acil, Faz 4, Orta
- Buyer Favorite List: Acil, Faz 4, Küçük
- Category Embedding: Düşük, Faz 4, Küçük
- Category Neighbour Cache: Düşük, Faz 4, Küçük
- Listing AB Test: Önemli, Faz 4, Orta
- Listing View Counter: Önemli, Faz 4, Küçük
- Related Listing Cache: Önemli, Faz 4, Büyük
- Related Products Settings: Düşük, Faz 4, Küçük
- Search History: Önemli, Faz 4, Küçük
- User Product View: Önemli, Faz 4, Orta
