# 03a-katalog: Katalog bağlamı

## 1. Bağlamın amacı
Katalog bağlamı ürünün kendisini tanımlar. Ürün kartı (`Listing`), kategori ağacı ve marka buradadır. Ürün tipi, ürün ailesi, özellik sözlüğü, sertifika türü ve ölçü birimi de buradadır. Katalog ürünün fiyatını, stoğunu ve görünürlüğünü tek yerden yönetir. Diğer bağlamlar ürünü yalnız bu bağlamın API'si ile okur ve değiştirir.

## 2. DocType listesi
Ana kayıtlar:
- `Listing` (ürün kartı, 145 alan, 726 satır denetleyici)
- `Product Category` (kategori ağacı)
- `Brand` (marka)
- `Product Type` (ürün tipi)
- `Product Family` (ürün ailesi)
- `Product Attribute` (özellik sözlüğü)
- `Attribute Set` (özellik seti)
- `Certification Type` (sertifika türü)
- `UOM` (ölçü birimi)
- `Moderation Rule` (yorum moderasyon kuralı, yanlış bağlamda, bkz. 7. bölüm)

Alt tablolar:
- `Listing` altı: `Listing Image`, `Listing Document`, `Listing Attribute Value`, `Listing Certification`, `Listing Variant Item`, `Listing Bulk Pricing Tier`, `Listing Customization Option`, `Listing Lead Time Range`
- `Attribute Set` altı: `Attribute Set Group`, `Attribute Set Item`, `Attribute Set Category Map`
- `Product Attribute` altı: `Product Attribute Value Option`
- `Product Family` altı: `Product Family Attribute`
- `Product Category` altı: `Product Category Required Certification`
- `Brand` altı: `Brand Featured Listing`

Ayar kaydı yok. Toplam 25 DocType.

## 3. Bağlamın dışa açık API'si
Paket: `tradehub_core/catalog/`. Dosyalar: `api.py` ve `contracts.py`.

Okuma fonksiyonları:
- `get_listing(name)`: tam ürün okuma modeli.
- `get_listing_card(name)` ve `get_listing_cards(names)`: vitrin kartı.
- `get_offer(listing, qty, variant_row=None)`: fiyat, stok, birim ve basamak fiyatı.
- `get_listing_owner(listing)`: satıcı profili adı.
- `is_storefront_visible(listing)`: vitrinde görünür mü.
- `get_variants(listing)`, `get_listing_images_bulk(listings)`, `get_listing_attributes(listing, lang)`, `get_listing_documents(listing)`.
- `get_category(name)`, `get_category_descendants(name)`, `get_category_ancestors(name)`, `get_category_tree(parent, lang)`.
- `get_brand(code_or_slug)`, `list_public_brands(filters)`.
- `get_product_type(code)`, `get_product_family(code)`, `get_attribute(code)`, `get_attribute_set(set_code)`, `list_required_attributes(set_code)`.
- `get_certification_type(name)`, `list_certification_types(category, status)`.
- `resolve_uom(label)` ve `list_uoms()` (`shared/uom.py` içinde).

Yazma fonksiyonları:
- `create_listing(seller_profile, data)`, `update_listing(name, data)`, `change_status(name, status, reason, actor)`.
- `reserve_stock(listing, variant_row, qty, ref)`, `release_stock(...)`, `deduct_stock(...)`, `restore_stock(...)`.
- `upsert_variants(listing, rows)`, `replace_listing_images(listing, rows)`, `replace_listing_attributes(listing, rows)`, `replace_pricing_tiers(listing, rows)`.
- `assign_listing_certification(listing, cert_type, data)`, `remove_listing_certification(listing, cert_type)`, `remove_certifications_for_seller(seller_profile, cert_type)`.
- `approve_brand(name, user)`, `reject_brand(name, reason, user)`, `suggest_brand(...)`.
- `resolve_or_create_attribute(label)`, `resolve_attribute_set_code(label)`, `resolve_product_family_code(label)`.

Anlık görüntü yazma fonksiyonları (başka bağlamın hesapladığı kopyayı yazar):
- `set_rating_snapshot(listing, payload)` (11 için).
- `set_price_tier(listing, tier)` (03c için).
- `set_storefront_visibility(seller_profile, visible)` (02 için).
- `refresh_base_prices(currency, rate)` (14 için).

Sözleşmeler (`contracts.py`): `ListingCard`, `Offer`, `ListingInput`, `LISTING_IMPORT_FIELDS` (içe aktarma hedef alan listesi).

## 4. Yayınlanan ve dinlenen olaylar
Yayınlanan olaylar:
| Olay adı | Veri alanları | Kim dinler |
|---|---|---|
| `catalog.listing_created` | name, seller_profile | 03b eşleştirme, 10 SEO, 03c öneri, 14 ECA, 01 ReBAC |
| `catalog.listing_updated` | name, changed_fields | 10 SEO, 08 medya, 03b eşleştirme, 03c öneri, shared_sync |
| `catalog.listing_status_changed` | name, old, new, reason | 12 bildirim, 03c öneri, 10 sitemap |
| `catalog.listing_stock_changed` | name, variant_row, old, new, reason | 03b giden olay, 03c, vitrin önbelleği |
| `catalog.listing_deleted` | name, seller_profile | 10, 03b, 03c, 01, shared_sync, favoriler |
| `catalog.listing_images_changed` | listing | 08 medya, 10 SEO |
| `catalog.category_created` | name, slug, parent | 10 SEO, 03c, vitrin önbelleği |
| `catalog.category_updated` | name, slug, parent, vat_rate, changed_fields | 10 SEO, 06 vergi (vat_rate), 03c, vitrin önbelleği |
| `catalog.category_deleted` | name, moved_to | 10, 03c, 04 RFQ, 02, her Link taşıyan bağlam |
| `catalog.brand_created` | brand_code, slug | 10 SEO, shared_sync |
| `catalog.brand_approved` ve `catalog.brand_rejected` | brand_code, status, reason | 12 bildirim, shared_sync |
| `catalog.brand_updated` | brand_code, slug, is_active, changed_fields | 10 SEO, shared_sync |
| `catalog.brand_deleted` | brand_code | 10 SEO, shared_sync |
| `catalog.certification_type_approved` ve `catalog.certification_type_rejected` | name, category | 02 mağaza sertifikası, 12 bildirim |
| `catalog.attribute_changed` ve `catalog.attribute_set_changed` | code | 03b içe aktarma önbelleği, shared_sync |

Dinlenen olaylar:
| Olay adı | Kaynak bağlam | Ne yapar |
|---|---|---|
| `order.confirmed`, `order.cancelled`, `order.refunded` | 04 | stok rezerv, düşüm, geri alma |
| `seller_store.subscription_changed` | 02 | vitrin görünürlüğü |
| `seller_store.certification_removed` | 02 | ürün sertifikası kaldırma |
| `review.aggregates_changed` | 11 | puan anlık görüntüsü |
| `fx.rates_refreshed` | 14 | baz fiyat yenileme |
| `tax.rules_changed` | 06 | vergili baz fiyat |
| `sharing.brand_imported` | shared_sync | marka durumu sıfırlama |
| `media.image_redirected` | 08 | eski görsel adresi eşleme |

## 5. Bağlamlar arası en ağır 10 bağımlılık
1. `tradehub_core/hooks.py:560-631` ve `1398-1615`: `Listing` kaydına 9 bağlamdan 30'dan fazla kanca bağlı. Biri hata verirse ürün kaydedilemez.
2. `tradehub_core/utils/stock.py:432-625`: sipariş akışı (04) ürün ve varyant stoğunu ham SQL ile yazıyor. Denetleyici kuralı atlanır.
3. `tradehub_core/shared_sync/` paketi: 30'dan fazla `set_value` ile `Listing`, `Listing Variant Item`, `Listing Image`, `Listing Attribute Value`, `Listing Bulk Pricing Tier` tablolarını yazıyor (örn. `projections.py:316-593`, `media.py:445-465`).
4. `tradehub_core/api/review.py:148`, `services/tcmb.py:204`, `services/storefront_visibility.py:61,114,188`, `recommendations/price_tier.py:82,89`: dört bağlam `Listing` kolonlarını doğrudan yazıyor.
5. `tradehub_core/tradehub_core/doctype/listing/listing.py:72-76,78-93,238-247,381-422`: denetleyici vergi (06), kargo (07), abonelik (02) ve bildirim (12) kurallarını içinde taşıyor.
6. `tradehub_core/bulk_import/persister.py:654-740`: içe aktarma (03b) `Listing` kaydını `new_doc` ve `get_doc` ile doğrudan yazıyor.
7. `tradehub_core/api/seller_certifications.py:736,998,1029`: mağaza bağlamı (02) `Listing Certification` alt tablosunu doğrudan siliyor. `utils/cert_validate.py:55` katalog da `Seller Certification` tablosunu okuyor. İki yönlü bağ.
8. `tradehub_core/hooks.py:636-655,1402-1407,1497`: `Product Category` kaydına SEO (10), öneri (03c), vergi fiyatı ve vitrin önbelleği kancaları bağlı.
9. `tradehub_core/services/category_delete.py:85-103,258-311`: kategori silme servisi `Link` taşıyan her tabloyu tarayıp başka bağlamların satırlarını taşıyor ve siliyor.
10. `tradehub_core/hooks.py:658-668,1402-1407,1623-1627`: `Brand` kaydına SEO ve shared_sync yedi kanca bağlamış. `brand.py:19` denetleyici shared_sync iç fonksiyonu içe aktarıyor.

## 6. Önerilen geçiş sırası
1. `catalog/api.py` ve `catalog/contracts.py` iskeleti. Okuma fonksiyonları yazılır. Hiçbir çağrı değişmez.
2. Outbox DocType, olay yayıncısı ve `frappe.enqueue` dağıtıcısı (`shared/events.py`). Bu adım tüm bağlamların ortak işidir.
3. `Listing` olay yayını: `on_update`, `after_insert`, `on_trash` içinde `catalog.listing_*`.
4. Anlık görüntü fonksiyonları: `set_rating_snapshot`, `set_price_tier`, `set_storefront_visibility`, `refresh_base_prices`. Dört ayrı PR. Her biri tek dosyayı çevirir.
5. `utils/stock.py` dosyasını `catalog/stock_service.py` olarak taşıma. Dış adlar korunur.
6. Sepet ve sipariş okumalarını `get_offer` ve `get_listing` ile değiştirme (`api/cart.py:472,736`, `order.py:155`, `tax_core/service.py:141,319`).
7. Lojistik okumalarını `get_listing_owner` ve `get_listing_cards` ile değiştirme.
8. Bildirim yan etkisini `catalog.listing_status_changed` olayına taşıma.
9. SEO kancalarını olay dinleyicisine taşıma (Listing, Product Category, Brand birlikte).
10. Medya kancalarını olay dinleyicisine taşıma.
11. Öneri kancalarını olay dinleyicisine taşıma (Listing ve Product Category).
12. ECA ve ReBAC kancalarını olay dinleyicisine taşıma.
13. `order.*` olaylarını dinleyen `catalog/listeners.py`. Stok akışı olaydan gelir.
14. Sertifika çift yönlü bağını kesme: `seller_store.api.has_verified_certification` ve `seller_store.certification_removed` olayı.
15. `category_delete.py` taşıma işini bağlam başına ayırma. Katalog yalnız kendi tablolarını taşır.
16. shared_sync yazmalarını `catalog.api` fonksiyonlarına çevirme. Dosya dosya ayrı PR.
17. `Listing Tax Rule` ve `Shipping Method Item` alt tablolarını 06 ve 07 kayıtlarına ayırma. Veri yaması gerekir.
18. `api/listing.py` dosyasını bölme: `storefront_read.py`, `seller_write.py`, `cache.py`, arama geçmişi `discovery/` paketine.
19. Sözlük izin tutarsızlığını giderme (`Product Attribute`, `Product Family`: `permissions.py:1396-1435` ile `tenant.py:70-74`).
20. Tüm DocType JSON `module` alanlarını "Catalog" yapma ve klasörleri `tradehub_core/catalog/doctype/` altına taşıma. En son adım.

## 7. Başka bağlama taşınması gereken DocType'lar
- `Moderation Rule`: 11-degerlendirme bağlamına taşınmalı. Tek okuyucu `api/moderation.py:18` yorum moderasyonudur. Kurallar yorum risk puanı içindir.
- `UOM`: Katalogda kalabilir. Ancak `resolve_uom` ve `list_uoms` fonksiyonları `shared/uom.py` paylaşılan çekirdeğe gider. Teklif isteği (04) de birimi kullanır.
- `Listing Tax Rule` (06) ve `Shipping Method Item` (07): Bu iki alt tablo başka bağlamın DocType'ı ancak `Listing` içinde duruyor. Kendi bağlamlarının kaydına ayrılmaları önerilir.
- Harita bu analizde değiştirilmedi.

## 8. Bu bağlamda paralel çalışacak geliştiriciler için kurallar
1. `Listing` tablosuna başka bağlamdan `frappe.db.set_value`, ham SQL ya da `get_doc().save()` ile yazmayın. `catalog.api` fonksiyonunu çağırın. Fonksiyon yoksa katalog ekibinden isteyin.
2. `hooks.py` içinde `Listing`, `Product Category` ya da `Brand` kaydına yeni kanca eklemeyin. Olay dinleyicisi yazın. Olay yoksa katalog ekibi olayı ekler.
3. `Listing` tablosuna yeni özel alan (custom field) eklemeyin. Kendi bağlamınızda `listing` Link alanı taşıyan yeni kayıt açın.
4. Anlık görüntü alanlarını (`average_rating`, `price_tier`, `storefront_visible`, `selling_price_base`) yalnız ilgili `set_*` fonksiyonu yazar. Alan sahibi belgelenir.
5. Ürün denetleyicisine yeni iş kuralı eklemeyin. Kural katalog kuralıysa `catalog/` içinde servis fonksiyonu yazın. Başka bağlam kuralıysa o bağlamın API'sine sorun.
6. `catalog/` paketi `order`, `tax`, `logistics`, `shared_sync`, `seo`, `media`, `recommendations` paketlerinden içe aktarma yapmaz. `import-linter` sözleşmesi CI'da bu kuralı denetler.
7. Kataloğun `CODEOWNERS` girdisi `tradehub_core/catalog/` ve `tradehub_core/catalog/tests/` klasörlarını kapsar. Katalog PR'ını katalog ekibi onaylar.
8. Yeni DocType JSON `module` alanı "Catalog" olur. Yamalar `tradehub_core/catalog/patches/` altına yazılır.
9. Her olay dinleyicisi tekrar çalışınca aynı sonucu verir. Olay kimliği saklanır.
10. Her PR tek adımı kapsar. Taşıma ve davranış değişikliği aynı PR'da olmaz.

## Epic özeti

- Attribute Set: Önemli, Faz 4, Küçük
- Attribute Set Category Map: Düşük, Faz 5, Küçük
- Attribute Set Group: Düşük, Faz 4, Küçük
- Attribute Set Item: Düşük, Faz 4, Küçük
- Brand: Acil, Faz 4, Büyük
- Brand Featured Listing: Düşük, Faz 5, Küçük
- Certification Type: Önemli, Faz 4, Orta
- Listing: Kritik, Faz 4, Büyük
- Listing Attribute Value: Önemli, Faz 4, Küçük
- Listing Bulk Pricing Tier: Önemli, Faz 4, Küçük
- Listing Certification: Önemli, Faz 4, Orta
- Listing Customization Option: Düşük, Faz 5, Küçük
- Listing Document: Düşük, Faz 4, Küçük
- Listing Image: Önemli, Faz 4, Orta
- Listing Lead Time Range: Düşük, Faz 5, Küçük
- Listing Variant Item: Kritik, Faz 4, Büyük
- Moderation Rule: Önemli, Faz 4, Küçük
- Product Attribute: Önemli, Faz 4, Orta
- Product Attribute Value Option: Düşük, Faz 4, Küçük
- Product Category: Acil, Faz 4, Büyük
- Product Category Required Certification: Düşük, Faz 5, Küçük
- Product Family: Önemli, Faz 4, Küçük
- Product Family Attribute: Düşük, Faz 5, Küçük
- Product Type: Önemli, Faz 4, Küçük
- UOM: Önemli, Faz 4, Küçük
