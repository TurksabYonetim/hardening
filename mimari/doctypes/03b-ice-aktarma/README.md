# 03b-ice-aktarma: İçe aktarma ve eşleştirme bağlamı

## 1. Bağlamın amacı
Bu bağlam satıcının ürünlerini dışarıdan içeri alır. Excel, CSV, XML dosyası, XML akışı ve ürün API'si giriş yollarıdır. Sütun başlığı ve değer eşleme kuralları buradadır. Aynı barkodlu ürünleri ortak katalog ürününe eşleyen "eşleştirme" servisi de buradadır. Dış sisteme stok olayı gönderen köprü de bu bağlama bağlıdır.

## 2. DocType listesi
Ana kayıtlar:
- `Bulk Import Job` (toplu yükleme işi)
- `Seller XML Feed` (satıcı akış adresi)
- `Regex Pattern Library` (sütun başlığı ve stok kodu desen kütüphanesi)
- `Seller Value Mapping` (değer eşleme)
- `Catalog Product` (ortak katalog ürünü)
- `Product Mapping` (ürün kartı ile katalog ürünü eşlemesi)
- `Seller Product` (eski satıcı ürün taslağı, kaldırma adayı)

Kayıt defterleri:
- `Catalog Outbound Event` (dış sisteme giden stok olayı)

Alt tablolar:
- `Bulk Import Job Error` (iş hataları)
- `Regex Pattern Entry` (desen satırı)
- `Seller Value Mapping Row` (eşleme satırı)

Ayar kaydı yok. Toplam 11 DocType.

## 3. Bağlamın dışa açık API'si
Paket: `tradehub_core/import_pipeline/` (bugünkü `bulk_import/`, `catalog/service.py` ve `integration/outbound.py` birleşir). Dosyalar: `api.py` ve `contracts.py`.

İçe aktarma:
- `start_import(seller_profile, file, options)`: iş açar.
- `get_job_status(job)`: durum ve sayaçlar.
- `list_jobs(seller_profile, source)`: geçmiş.
- `get_job_errors(job)`: hata satırları.
- `open_api_job(seller_profile, products)`: ürün API'si için iş açar.
- `resolve_column_mapping(headers, seller_profile)`: başlık eşlemesi.
- `extract_sku_from_filename(filename, seller_profile)`: görsel adından stok kodu.
- `list_feeds(seller_profile)`, `run_feed_now(feed)`.

Eşleştirme ve buybox:
- `get_catalog_product(code)`, `find_product_by_gtin(gtin)`.
- `get_mapping_for_listing(listing)`, `rematch_listing(listing)`, `decide_mapping(mapping, action, product)`.
- `get_offers_for_listing(listing)`: vitrin "diğer satıcılar" kutusu.
- `get_buybox_winner(product, context_key="global")`.

Giden olay köprüsü:
- `list_outbound_events(seller_profile, status)`, `requeue_outbound_event(name)`.

Sözleşmeler (`contracts.py`): `ImportRow`, `ImportResult`, `MatchDecision`, `BuyboxResult`. Hedef alan listesi `catalog/contracts.py` içindeki `LISTING_IMPORT_FIELDS` sözleşmesinden okunur.

## 4. Yayınlanan ve dinlenen olaylar
Yayınlanan olaylar:
| Olay adı | Veri alanları | Kim dinler |
|---|---|---|
| `import.job_started` | job, seller_profile, source | 12 bildirim |
| `import.job_completed` | job, seller_profile, inserted, updated, errors | 12 bildirim, 03a toplu onay, 02 şablon profili |
| `import.job_failed` | job, seller_profile, error | 12 bildirim |
| `import.feed_failed` | feed, seller_profile, error, consecutive_failures | 12 bildirim |
| `matching.product_created` | product, gtin | vitrin önbelleği |
| `matching.mapping_changed` | listing, product, status | 03c, vitrin önbelleği |
| `matching.buybox_changed` | product, winner_listing, score | vitrin önbelleği, 03c |

Dinlenen olaylar:
| Olay adı | Kaynak bağlam | Ne yapar |
|---|---|---|
| `catalog.listing_created`, `catalog.listing_updated` | 03a | eşleştirme (`match_listing`) |
| `catalog.listing_deleted` | 03a | eşlemeyi "Detached" yapar, buybox yeniden hesaplar, giden olay satırlarını siler |
| `catalog.listing_stock_changed` | 03a | `Catalog Outbound Event` satırı yazar |
| `catalog.attribute_changed` | 03a | desen ve değer eşleme önbelleğini düşürür |
| `seller_store.profile_updated` | 02 | mağazanın ürünleri için buybox yeniden hesaplar |
| `catalog.listing_rejected_by_rule` | 14 ECA | iş hatası satırı yazar |

## 5. Bağlamlar arası en ağır 10 bağımlılık
1. `tradehub_core/bulk_import/persister.py:654-740`: içe aktarma `Listing` kaydını `frappe.new_doc` ve `frappe.get_doc` ile doğrudan yazıyor. Katalog kuralı değişince içe aktarma kırılır.
2. `tradehub_core/hooks.py:1399-1401`: `Listing.on_update`, `Listing.on_trash` ve `Admin Seller Profile.on_update` kancaları eşleştirme servisini eşzamanlı çalıştırıyor (`catalog/hooks.py:7-62`).
3. `tradehub_core/catalog/service.py:59-100`: `_listing_fields` ürün tablosunu doğrudan okuyor. Okuma modeli yok.
4. `tradehub_core/utils/stock.py:734`: stok akışı (04 işi) `integration.outbound.emit_stock_change` fonksiyonunu doğrudan çağırıyor.
5. `tradehub_core/hooks.py:629`: `Listing.on_trash` içinde `outbound.on_listing_trash` kancası.
6. `Listing.created_by_bulk_job` özel alanı (`patches/v15_bulk_import_init/01_add_listing_created_by_bulk_job.py`): katalog şeması içe aktarma kavramı taşıyor. `api/listing.py:5368,5586` bu alanı okuyor.
7. `tradehub_core/bulk_import/regex_lib.py:222,882-884`: hedef alan listesi `Listing` alan adlarına bağlı, `Product Attribute` tam kayıt okunuyor. Sözleşme yok.
8. `tradehub_core/catalog/service.py:1091`, `shared_sync/projections.py:576-593`: `Listing Variant Item` tablosu iki bağlamdan doğrudan yazılıyor.
9. `Catalog Product.winner_listing` ve `Buybox Selection.winner_listing` Link alanları ürün silinmesini kilitliyor (`listing_purge/preview.py:128,23`).
10. `tradehub_core/bulk_import/feed_api.py:30-34` ve `bulk_import_job.py:23`: abonelik özelliği ve mağaza çözümü 02 bağlamının iç yardımcılarıyla yapılıyor (`entitlement.check_feature_or_throw`, `utils.seller_store.my_store`).

## 6. Önerilen geçiş sırası
1. `catalog/api.py` içine `create_listing`, `update_listing`, `get_listing` eklenmesini bekleyin (03a 1. adım). Bu adım 03a ekibinin işidir.
2. `persister.py:654-740` çağrılarını `catalog.api.create_listing` ve `update_listing` ile değiştirin.
3. `Bulk Import Job Row` tablosunu ekleyin. `created_by_bulk_job` okumalarını buraya çevirin. Sonra özel alanı kaldıran yama yazın.
4. `catalog/service.py` ve `catalog/hooks.py` dosyalarını `import_pipeline/matching/` altına taşıyın. Paket adı karışıklığı biter.
5. `utils/gtin.py` dosyasını `shared/gtin.py` olarak taşıyın.
6. `winner_listing` alanlarını `Data` anlık görüntüye çevirin (`Catalog Product`, `Buybox Selection`). Yama değer korur.
7. `hooks.py:1399-1401` ve `629` kancalarını `catalog.listing_*` ve `seller_store.profile_updated` dinleyicilerine taşıyın. Outbox gerekir.
8. `utils/stock.py:734` çağrısını `catalog.listing_stock_changed` dinleyicisine taşıyın.
9. `LISTING_IMPORT_FIELDS` sözleşmesini `regex_lib.py` ve `value_mapping.py` içinde kullanın.
10. `import.job_*` ve `import.feed_failed` olaylarını ekleyin. `feed_scheduler.py:120` bildirimi olaya döner.
11. `Seller XML Feed` için izin sorgusu ekleyin. `Seller Value Mapping` izin sorgusunu `Regex Pattern Library` ile aynı yapın.
12. `Seller Product` kaydını ölçün, taşıyın ve kaldırın.
13. Tohum yamalarını `import_pipeline/setup.py` içine toplayın.
14. Tüm DocType JSON `module` alanlarını "Import Pipeline" yapın. En son adım.

## 7. Başka bağlama taşınması gereken DocType'lar
- `Buybox Selection` (haritada 03c-kesif): bu bağlama taşınmalı. Tek yazıcı `catalog/service.py:809-841` eşleştirme servisidir.
- `Catalog Product` ve `Product Mapping`: bu bağlamda kalır. Ancak kavram olarak "ortak katalog" kataloğa (03a) yakındır. İleride ayrı "ürün eşleştirme" bağlamı açılabilir.
- `Catalog Outbound Event`: bu bağlamda kalır. Alternatif: ayrı "dış entegrasyon" alt paketi.
- `Seller Product`: hiçbir bağlama taşınmaz. Kaldırılır.
- Harita bu analizde değiştirilmedi.

## 8. Bu bağlamda paralel çalışacak geliştiriciler için kurallar
1. `Listing` ve alt tablolarına doğrudan yazmayın. `catalog.api.create_listing`, `update_listing`, `upsert_variants` çağırın.
2. Katalog alan adlarını kodda sabit yazmayın. `LISTING_IMPORT_FIELDS` sözleşmesinden okuyun.
3. `hooks.py` içinde `Listing` ya da `Admin Seller Profile` kaydına yeni kanca eklemeyin. Olay dinleyicisi yazın.
4. Eşleştirme servisi `catalog/` klasörünü kullanmaz. `import_pipeline/matching/` altında çalışır. Katalog ekibi ile klasör çakışması olmaz.
5. Bu bağlamın tabloları başka bağlamın ürününü Link ile kilitlemez. Hesaplanmış sonuçlar (`winner_listing`) `Data` anlık görüntü tutar.
6. Dış sisteme giden olay yalnız `catalog.listing_stock_changed` dinleyicisinden yazılır. Stok kodu entegrasyonu bilmez.
7. `import_pipeline/` paketi `order`, `tax`, `logistics`, `seo`, `media` paketlerinden içe aktarma yapmaz. `shared_sync` ile ilişki yalnız olay üzerinden kurulur. `import-linter` sözleşmesi CI'da denetler.
8. `CODEOWNERS` girdisi `tradehub_core/import_pipeline/` ve `tradehub_core/import_pipeline/tests/` klasörlerini kapsar.
9. Satıcıya ait her kayıt `permission_query_conditions` ile korunur. Yeni DocType bu kural olmadan birleştirilmez.
10. Her PR tek adımı kapsar.

## Epic özeti

- Bulk Import Job: Acil, Faz 4, Büyük
- Bulk Import Job Error: Düşük, Faz 4, Küçük
- Catalog Outbound Event: Önemli, Faz 4, Orta
- Catalog Product: Önemli, Faz 4, Büyük
- Product Mapping: Önemli, Faz 4, Orta
- Regex Pattern Entry: Düşük, Faz 5, Küçük
- Regex Pattern Library: Önemli, Faz 4, Orta
- Seller Product: Düşük, Faz 4, Küçük
- Seller Value Mapping: Önemli, Faz 4, Küçük
- Seller Value Mapping Row: Düşük, Faz 5, Küçük
- Seller XML Feed: Önemli, Faz 4, Orta
