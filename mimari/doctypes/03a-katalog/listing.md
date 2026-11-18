# Listing

- Bağlam: 03a-katalog
- Tür: Ana kayıt
- Klasör: `tradehub_core/tradehub_core/doctype/listing`
- Denetleyici: `tradehub_core/tradehub_core/doctype/listing/listing.py` (726 satır)
- Önerilen sahip bağlam: 03a-katalog

## Epic

- Epic adı: Listing: 03a-katalog bağlamına taşıma
- Öncelik: Kritik
- Faz: Faz 4
- Tahmini büyüklük: Büyük

### User story

Bir geliştirici olarak, ürün kaydını yalnız `catalog` paketinin yazmasını ve diğer bağlamların olay dinlemesini istiyorum.
Böylece bir bağlamdaki değişiklik ürün kaydını kırmaz ve dört geliştirici aynı tabloda çakışmaz.

### Kabul kriterleri

- [ ] `Listing` tablosuna `catalog/` dışından `frappe.db.set_value`, ham SQL ya da `get_doc().save()` çağrısı yok. `grep` sonucu boş.
- [ ] Stok işlemleri `catalog.api.reserve_stock`, `deduct_stock`, `release_stock`, `restore_stock` üzerinden. Sipariş olayları dinleyiciden geliyor.
- [ ] Anlık görüntü alanları yalnız `set_rating_snapshot`, `set_price_tier`, `set_storefront_visibility`, `refresh_base_prices` ile yazılıyor.
- [ ] `hooks.py` içinde `Listing` için yalnız katalog işleyicileri kaldı. SEO, medya, öneri, ECA, ReBAC ve bildirim olay dinleyicisinde.
- [ ] Denetleyici 06, 07, 02 ve 12 bağlamlarından içe aktarma yapmıyor.
- [ ] `import-linter` kontrolü `tradehub_core.catalog` için PR'ı durduruyor ve geçiyor.
- [ ] Characterization test: `Listing` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- `utils/stock.py` ya da sipariş kodundan `tabListing` tablosuna ham `UPDATE` yazmayın. Denetleyici kuralı atlanır ve stok tutarsız kalır.
- `api/review.py`, `services/tcmb.py`, `services/storefront_visibility.py`, `recommendations/price_tier.py` içinden `Listing` kolonu yazmayın. İlgili `set_*` fonksiyonunu çağırın.
- `hooks.py` içine `Listing` için yeni `doc_events` eklemeyin. Olay dinleyicisi yazın.
- `Listing` tablosuna yeni özel alan eklemeyin. Kendi bağlamınızda `listing` Link alanı taşıyan kayıt açın.
- Denetleyiciye vergi, kargo, abonelik ya da bildirim kuralı eklemeyin. O bağlamın API'sine sorun.
- `api/v1/catalog.py` gibi yollarla `validate` atlayarak fiyat yazmayın. Vergili fiyat kolonu bayat kalır.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] Stok fonksiyonları için birim testleri eklendi. Varyant stok sapma testi geçiyor.
- [ ] Her taşınan kanca için olay sözleşme testi eklendi.
- [ ] Olay dinleyicileri aynı `event_id` ile iki kez çalışınca sonuç değişmiyor. Test var.
- [ ] Durum geçişi ve fiyat kuralı testleri geçiyor.
- [ ] `import-linter` yerelde geçiyor.
- [ ] `CODEOWNERS` katalog ekibinden ve etkilenen bağlam ekiplerinden inceleme istendi.
- [ ] Yama varsa idempotent ve test sitesinde denendi.
- [ ] Ruff lint temiz.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?
Listing ürün kartıdır. Satıcı ürünü bu kayıtla yayınlar. Kayıt fiyat, stok, görsel, özellik, varyant, sertifika, vergi ve kargo bilgisini taşır. 145 alanı ve 10 alt tablosu vardır. Vitrin, sepet, sipariş, vergi, lojistik, SEO, medya, öneri ve paylaşım bağlamları bu kayda bağlıdır.

## Bugünkü bağımlılıklar
### Bu kaydın bağlandığı kayıtlar
- `Admin Seller Profile` (seller_profile): başka bağlam (02-satici-magaza)
- `Seller Category` (category): başka bağlam (02-satici-magaza)
- `Product Category`, `Brand`, `Product Type`, `Product Family`, `Attribute Set`, `UOM`: aynı bağlam
- `Currency`, `Country` (ships_from_country, country_of_origin): Frappe çekirdek kaydı
- Alt tablo `Listing Tax Rule` (tax_rules): başka bağlam (06-vergi-fatura)
- Alt tablo `Shipping Method Item` (shipping_methods): başka bağlam (07-lojistik)
- Alt tablolar `Listing Bulk Pricing Tier`, `Listing Image`, `Listing Document`, `Listing Attribute Value`, `Listing Certification`, `Listing Variant Item`, `Listing Customization Option`, `Listing Lead Time Range`: aynı bağlam
### Bu kayda dokunan kod
Denetleyici içindeki başka bağlam çağrıları:
- `listing.py:9-12`: bildirim (12), çeviri, vergili fiyat ve bildirim yardımcılarını içe aktarıyor
- `listing.py:44-46`: `utils.sku.assign_product_sku` çağırıyor (03a)
- `listing.py:72-76`: `tax_core.service.validate_listing_tax_configuration` çağırıyor (06 yazıyor denetim)
- `listing.py:78-93`: kargo yöntemi satırlarını denetliyor (07 kuralı denetleyicide)
- `listing.py:181-216`: `shared_sync.projections.is_applying` ve `utils.seo_content` okuyor
- `listing.py:229-259`: `api.listing.STOREFRONT_VISIBLE_STATUSES`, `entitlement.core.get_subscription_status` (02) ve `shared_sync.visibility.allowed` çağırıyor
- `listing.py:381-422`: durum değişiminde `notify` ile satıcıya bildirim gönderiyor (12)
- `listing.py:424-441`: `utils.stock._send_stock_alert_if_needed` özel fonksiyonunu çağırıyor
- `listing.py:659-678`: `api.currency.taban_try_oranli` ile kur çeviriyor (14)
Dışarıdan bu tabloya yazanlar:
- `tradehub_core/utils/stock.py:432,441,500,554,619,625`: sipariş akışı (04) `reserved_qty` ve `stock_qty` alanlarını ham SQL ile yazıyor
- `tradehub_core/utils/stock.py:183,354,725`: `set_value` ile `variant_reserve_debt`, `stock_qty`, `available_qty` yazıyor
- `tradehub_core/api/review.py:148`: yorum bağlamı (11) puan alanlarını `set_value` ile yazıyor
- `tradehub_core/services/tcmb.py:204-208`: kur servisi (14) `selling_price_base` kolonunu ham SQL ile yazıyor
- `tradehub_core/services/storefront_visibility.py:61,114,188`: abonelik (02) `storefront_visible` kolonunu ham SQL ile yazıyor
- `tradehub_core/recommendations/price_tier.py:82,89`: öneri (03c) `price_tier` alanını yazıyor
- `tradehub_core/shared_sync/` altında 30'dan fazla `set_value` (örn. `projections.py:316,340,445,507`, `catalog.py:251,522`, `onboarding.py:258`)
- `tradehub_core/api/v1/catalog.py:659`: ürün API'si `validate` atlayarak `set_value` ile yazıyor
- `tradehub_core/api/listing.py:532,5755`: vitrin dosyası ham SQL ile yazıyor
- `tradehub_core/utils/internal_barcode.py:303`: iç barkod yazıyor (03a)
Dışarıdan okuyanlar (`frappe.get_doc`):
- `tradehub_core/tradehub_core/doctype/order/order.py:155`: sipariş vergi profili için tam kaydı yüklüyor (04)
- `tradehub_core/api/cart.py:472`: sepet güncel fiyat ve stok için yüklüyor (04)
- `tradehub_core/tax_core/service.py:141,149,319`: vergi profili için yüklüyor (06)
- `tradehub_core/logistics/order_shipping.py:57`, `shipping_methods.py:107`, `hooks.py:153`, `services/pricing_engine.py:504`: lojistik okuyor (07)
- `tradehub_core/api/seller_certifications.py:830,944`: ürüne sertifika yazıyor (02 kodu)
- `tradehub_core/eca/api.py:976,1067`: kural motoru yüklüyor (14)
- `tradehub_core/permissions.py:795-830`: satıcı yalnız kendi ürününü görür
### hooks.py kayıtları
- `hooks.py:564-567` `before_insert`: satıcı izolasyonu (`utils/tenant`), ürün kotası (`entitlement`, 02)
- `hooks.py:569` `before_validate`: SEO slug (10)
- `hooks.py:570-585` `validate`: sertifika (03a), izolasyon, abonelik özellikleri ve bölge (02), SEO uzunluk (10), ECA kural motoru (14), medya görsel eşleme (08)
- `hooks.py:586-609` `on_update`: SEO önbellek ve 301 (10), medya alt metin ve kare (08), vitrin önbelleği, öneri önbelleği (03c), ECA (14), ReBAC tuple (01), medya adres önbelleği
- `hooks.py:610-618` `after_insert`: vitrin önbelleği, medya, öneri, ECA, ReBAC
- `hooks.py:619-631` `on_trash`: vitrin önbelleği, sitemap (10, satır 622), öneri (03c), ReBAC, giden stok olayı (`integration.outbound`), medya
- `hooks.py:1398-1400`: SEO ayna (10) ve `catalog.hooks.on_listing_update`, `on_listing_trash` (03b eşleme)
- `hooks.py:1406-1407`: SEO ayna silme
- `hooks.py:1614-1615`: paylaşım `before_save` guard ve `on_update` değişim bildirimi
- `hooks.py:1081,1208`: izin sorgusu ve tek kayıt izni

## Bağımlılık sorunları
1. `tradehub_core/hooks.py:560-631` ve `1398-1615` Listing kaydına 30'dan fazla kanca bağlı. Kancalar 9 farklı bağlamdan geliyor. Herhangi biri hata verirse ürün kaydedilemez. Bu, "bir geliştirici değiştirir, diğerinin işi kırılır" sorununun merkezidir.
2. `tradehub_core/utils/stock.py:432-625` sipariş bağlamı ürün stoğunu ham SQL ile yazıyor. Denetleyici kuralı atlanır. Sipariş kodu değişirse katalog stoğu bozulur.
3. `tradehub_core/api/review.py:148`, `services/tcmb.py:204`, `services/storefront_visibility.py:61`, `recommendations/price_tier.py:82` dört bağlam Listing kolonlarını doğrudan yazıyor. Katalog hangi kolonun kime ait olduğunu bilmiyor.
4. `tradehub_core/shared_sync/` paketi 30'dan fazla noktada Listing yazıyor. Paylaşım bağlamı kataloğun ikinci sahibi gibi davranıyor.
5. `listing.py:72-76` denetleyici vergi bağlamını (06) çağırıyor. `listing.py:78-93` kargo kuralını (07) kendi içinde tutuyor. `listing.py:238-247` abonelik durumunu (02) okuyor. Denetleyici dört bağlamın kuralını birden taşıyor.
6. `listing.py:381-422` denetleyici durum değişiminde bildirim gönderiyor (12). Yan etki denetleyicide.
7. `listing.py:229-259` `storefront_visible` üç kaynaktan hesaplanıyor: denetleyici, `services/storefront_visibility.py:61` ham SQL ve `shared_sync` yazmaları. Üç yazıcı aynı kolona dokunuyor.
8. `tradehub_core/api/listing.py` 5700'den fazla satır. Vitrin okuma, satıcı yazma, önbellek ve arama tek dosyada. `listing.py:230` denetleyici bu dosyadan sabit içe aktarıyor (döngüsel bağımlılık riski).
9. `tradehub_core/api/v1/catalog.py:659` ürün API'si `validate` atlayarak yazıyor. Vergili fiyat kolonu için elle düzeltme gerekiyor (`:660-662`).
10. İki alt tablo başka bağlamın DocType'ı: `Listing Tax Rule` (06) ve `Shipping Method Item` (07). Alt tablo sahibi ile ana kayıt sahibi farklı.

## Hedef tasarım
- Sahip bağlam `03a-katalog`, paket yolu `tradehub_core/catalog/`. DocType `module` alanı "Catalog" olur.
- Dışarıya açılan fonksiyonlar (`catalog/api.py`):
  - Okuma: `get_listing(name)` tam okuma modeli. `get_listing_card(name)` ve `get_listing_cards(names)` vitrin kartı. `get_offer(listing, qty, variant_row)` fiyat, stok ve birim. `get_listing_owner(listing)` satıcı profili. `is_storefront_visible(listing)`.
  - Stok: `reserve_stock(listing, variant_row, qty, ref)`, `release_stock(...)`, `deduct_stock(...)`, `restore_stock(...)`. Bugünkü `utils/stock.py` bu fonksiyonların arkasına geçer.
  - Türetilmiş kolon yazma: `set_rating_snapshot(listing, payload)` (11 için), `set_price_tier(listing, tier)` (03c için), `set_storefront_visibility(seller_profile, visible)` (02 için), `refresh_base_prices(currency, rate)` (14 için).
  - Yazma: `create_listing(seller_profile, data)`, `update_listing(name, data)`, `change_status(name, status, reason, actor)`.
- Yayınladığı olaylar: `catalog.listing_created`, `catalog.listing_updated` (name, changed_fields), `catalog.listing_status_changed` (name, old, new), `catalog.listing_stock_changed` (name, variant_row, old, new), `catalog.listing_deleted`. Dinleyenler: 10-seo (önbellek, ayna, sitemap), 08-medya (kare, alt metin), 03c-kesif (öneri önbelleği), 12-bildirim (onay ve ret bildirimi), 14-platform (ECA), 01-kimlik (ReBAC tuple), shared_sync.
- Dinlediği olaylar: `order.confirmed`, `order.cancelled`, `order.refunded` (stok için). `seller_store.subscription_changed` (vitrin görünürlüğü için). `review.aggregates_changed` (puan anlık görüntüsü için). `fx.rates_refreshed` (baz fiyat için). `tax.rules_changed` (vergili fiyat için).
- Başka bağlamlara bağlantılar: `seller_profile` ve `category` Link alanları kalır. İkisi de kararlı kök kayıttır. Anlık görüntü alanları belgelenir: `supplier_display_name`, `average_rating`, `review_count`, `rating_distribution`, `*_avg`, `order_count`, `wishlist_count`, `view_count`, `price_tier`, `selling_price_base`, `selling_price_base_with_tax`. Bu alanlar başka bağlamın hesapladığı kopyadır. Yalnız ilgili `set_*` fonksiyonu yazar.
- `Listing Tax Rule` ve `Shipping Method Item` alt tabloları: İki seçenek var. Birincisi, tablolar katalog içinde kalır ve doğrulama servisi 06 ve 07 API'sine sorar. İkincisi, 06 ve 07 kendi `Listing Tax Profile` ve `Listing Shipping Profile` kaydını açar ve `listing` Link alanıyla bağlanır. İkinci seçenek önerilir. Ürün kaydı küçülür.
- Denetleyicide kalacak doğrulamalar: fiyat eksi olamaz, satış fiyatı liste fiyatını geçemez, stok eksi olamaz, varyant varsayılanı tek olmalı, `has_variants` eşlemesi, SKU ve GTIN benzersizliği, ana görsel seçimi, tamlık puanı, durum geçişi, SEO içerik asgarisi.
- Servise taşınacak iş kuralları: stok türetme (`listing.py:468-612`) `catalog/stock_service.py` içine. Bildirim gönderme (`:381-422`) olaya. Vergi doğrulaması (`:72-76`) 06 API çağrısına. Kargo satırı kuralı (`:78-93`) 07 API çağrısına. Abonelik görünürlüğü (`:238-247`) `seller_store.subscription_changed` olayına.

## Geçiş adımları
1. `catalog/api.py` ve `catalog/contracts.py` iskeletini açın. `get_listing_card`, `get_offer`, `get_listing_owner` okuma fonksiyonlarını yazın. Hiçbir çağrıyı değiştirmeyin.
2. Outbox DocType ve `catalog.listing_*` olay yayınını ekleyin. `on_update`, `after_insert`, `on_trash` içinde yayınlanır. 1. adımdan bağımsızdır.
3. `set_rating_snapshot` ekleyin. `api/review.py:148` bunu çağırır. 1. adımdan sonra gelir.
4. `set_price_tier` ekleyin. `recommendations/price_tier.py:82,89` bunu çağırır.
5. `set_storefront_visibility` ekleyin. `services/storefront_visibility.py:61,114,188` bunu çağırır.
6. `refresh_base_prices` ekleyin. `services/tcmb.py:204` bunu çağırır.
7. `utils/stock.py` dosyasını `catalog/stock_service.py` olarak taşıyın. Dış adlar korunur. Ham SQL fonksiyon içinde kalır.
8. Sepet (`api/cart.py:472,736`) okumalarını `get_offer` ile değiştirin. 1. adımdan sonra gelir.
9. Lojistik okumalarını (`logistics/*`) `get_listing_owner` ve `get_listing_cards` ile değiştirin.
10. Vergi (`tax_core/service.py:141,319`) ve sipariş (`order.py:155`) okumalarını `get_listing` okuma modeliyle değiştirin.
11. Bildirim yan etkisini (`listing.py:381-422`) `catalog.listing_status_changed` olayına taşıyın. 12 ekibi dinleyici yazar. 2. adımdan sonra gelir.
12. SEO kancalarını (`hooks.py:569,578,587-590,622,1398,1406`) olay dinleyicisine taşıyın. Slug üretimi katalogda kalır. 2. adımdan sonra gelir.
13. Medya kancalarını (`hooks.py:584,594,606,608,612,630`) olay dinleyicisine taşıyın. 2. adımdan sonra gelir.
14. Öneri kancalarını (`hooks.py:597,600,613,625`) olay dinleyicisine taşıyın. 2. adımdan sonra gelir.
15. ECA ve ReBAC kancalarını (`hooks.py:582,602,604,615,617,627`) olay dinleyicisine taşıyın. ECA "stok ata" aksiyonu `catalog.api` yazma fonksiyonunu çağırır.
16. `order.*` olaylarını dinleyen `catalog/listeners.py` yazın. `utils/stock.py` çağrıları olaydan gelir. 7. adımdan sonra gelir.
17. `shared_sync` yazmalarını `catalog.api` fonksiyonlarına çevirin. Bu en uzun adımdır. Dosya dosya ayrı PR açılır.
18. `Listing Tax Rule` ve `Shipping Method Item` alt tablolarını 06 ve 07 kayıtlarına ayırın. Veri yaması gerekir. 10. adımdan sonra gelir.
19. `api/listing.py` dosyasını bölün: `catalog/storefront_read.py`, `catalog/seller_write.py`, `catalog/cache.py`. 1. adımdan sonra her zaman yapılabilir.
20. DocType `module` alanını "Catalog" yapın. Kalan kancalar yalnız katalog işleyicileri olmalı.

## Riskler ve testler
- Sipariş sonrası stok ve rezerv doğru değişmeli. Test: `reserve_stock`, `deduct_stock`, `release_stock` için birim testleri. Mevcut varyant stok testleri korunur.
- Yorum puanı Listing anlık görüntüsüne yazılmalı. Test: `review.aggregates_changed` dinleyicisi `average_rating` günceller.
- Durum "Pending" iken satıcı durumu değiştirememeli. Test: satıcı kaydı reddedilir.
- Abonelik askıya alınınca ürün vitrinden düşmeli. Test: `set_storefront_visibility(seller, 0)` sonrası kayıt `storefront_visible=0` kalır.
- Kur güncellenince baz fiyat ve vergili baz fiyat birlikte güncellenmeli. Test: `refresh_base_prices` iki kolonu yazar.
- Kanca taşınırken SEO 301, medya kare ve öneri önbelleği çalışmaya devam etmeli. Test: her dinleyici için olay verildiğinde beklenen yan etki oluşur.
- Olay dinleyicileri tekrar çalışınca aynı sonucu vermeli. Test: aynı `event_id` iki kez işlenmez.
- Import kuralı: `tradehub_core.catalog` paketi `order`, `tax`, `logistics`, `shared_sync` paketlerinden içe aktarma yapmaz. `import-linter` sözleşmesi CI'da çalışır.
