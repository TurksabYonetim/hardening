# 09 İçerik ve vitrin bağlamı

## 1. Bağlamın amacı

Bu bağlam sitede görünen içeriği ve vitrin ayarlarını yönetir. Blog, yardım ve yasal sayfalar bu bağlamdadır. Ana sayfa slaytları, duyuru şeridi ve kategori vitrini de buradadır. Satıcı mağaza sayfasının düzeni de bu bağlama aittir.

Bugün kod üç yere dağılmış durumda:

- CMS DocType'ları `tradehub_core/seo_cms/doctype/` altında. CMS, içerik yönetim sistemi demektir.
- CMS iş kodu SEO paketinde, `tradehub_core/seo_helper/cms/` altında.
- Vitrin ayarlarının kodu `tradehub_core/api/` altında ayrı dosyalarda.

Hedef paket `tradehub_core/content/` olur. Hedef Frappe modülü `Content` olur.

## 2. DocType listesi

Ana kayıtlar (14):

- `CMS Content`
- `CMS Content Type`
- `CMS Content Version` (kayıt defteri)
- `CMS Help Section`
- `CMS Person Profile`
- `Category Showcase Tile`
- `Dashboard Banner` (14 bağlamına taşınmalı)
- `Dashboard Widget` (14 bağlamına taşınmalı)
- `Field Help Content`
- `Field Help Version` (kayıt defteri)
- `Header Notice`
- `Hero Slide`
- `Storefront Layout`
- `Translation Usage Log` (kayıt defteri, 11 bağlamına taşınmalı)

Alt tablolar (5):

- `CMS Collection Item`
- `CMS Content Category`
- `CMS FAQ Attachment`
- `CMS FAQ Item`
- `Dashboard Widget Role` (14 bağlamına taşınmalı)

Ayarlar (7):

- `Category Showcase Settings`
- `Header Notice Settings`
- `Site Maintenance Settings` (14 bağlamına taşınmalı)
- `Social Proof Settings`
- `Teamslike Settings` (12 bağlamına taşınmalı)
- `Tradehub Theme Settings`
- `Translation Settings` (11 bağlamına taşınmalı)

Toplam 26 DocType vardır. Her biri için ayrı rapor bu klasörde durur.

## 3. Bağlamın dışa açık API'si

Önerilen dosya `tradehub_core/content/api.py` dosyasıdır. Diğer bağlamlar yalnız bu fonksiyonları çağırır.

İçerik fonksiyonları:

- `get_content(name)` fonksiyonu tek içeriği döndürür.
- `get_published_by_route(route, lang)` fonksiyonu yayındaki içeriği adresten bulur.
- `list_published(content_type, lang)` fonksiyonu yayındaki içerikleri listeler.
- `transition(name, target_state)` fonksiyonu yayın durumunu değiştirir.
- `list_content_types()` ve `get_route_prefixes()` fonksiyonları içerik türlerini döndürür.
- `apply_body_draft(builder_page, payload)` fonksiyonu onaylı yapay zekâ taslağını gövdeye uygular.

Vitrin fonksiyonları:

- `get_hero_slides(lang)`
- `get_header_notices(lang)`
- `get_category_showcase(lang)`
- `get_public_theme()`
- `get_social_proof_signals(listing)`

Mağaza sayfası fonksiyonları:

- `get_storefront_layout(seller)`
- `save_storefront_layout(seller, sections, theme)`
- `list_layout_image_urls(seller)`

Yardım metni fonksiyonu:

- `get_field_help(screen_key, field_key, lang)`

## 4. Yayınlanan ve dinlenen olaylar

Bu bağlamın yayınladığı olaylar:

- `content.published`. Olay şu alanları taşır: `content_id`, `cms_key`, `route`, `lang`, `store`, `content_type`, `published_at`. 10 SEO bağlamı dinler.
- `content.unpublished`. Alanlar aynıdır. 10 SEO bağlamı dinler.
- `content.route_changed`. Olay eski ve yeni rotayı taşır. 10 SEO bağlamı yönlendirme için dinler.
- `content_type.changed`. Olay `type_key` ve `route_prefix` alanlarını taşır. 10 SEO bağlamı site haritası için dinler.
- `storefront.layout_changed`. Olay `seller` ve `image_urls` alanlarını taşır. 08 medya bağlamı dinler.

Bu bağlamın dinlediği olaylar:

- 03a katalog bağlamının `listing.deleted` olayı. Koleksiyon satırları temizlenir.
- 03a katalog bağlamının `category.deleted` ve `category.slug_changed` olayları.
- 02 mağaza bağlamının `seller.deleted` olayı. Mağaza düzeni ve mağaza içeriği temizlenir.
- 04 sipariş bağlamının `order.status_changed` olayı. Sosyal kanıt önbelleği temizlenir.
- 08 medya bağlamının `media.url_redirected` olayı. Mağaza düzenindeki görsel adresi güncellenir.

## 5. Bağlamlar arası en ağır 10 bağımlılık

1. CMS yayın kodu SEO tablosuna doğrudan yazıyor. Kanıt: `seo_helper/cms/publish.py:775` ve `seo_helper/cms/bridge.py:63`. SEO alanı değişirse yayın bozulur.
2. CMS kodu SEO paketinin içinde duruyor. Kanıt: `seo_cms/doctype/cms_content/cms_content.py:61` satırı `seo_helper.cms` içe aktarıyor.
3. Sosyal kanıt kodu sipariş tablolarını ham SQL ile okuyor. Kanıt: `api/social_proof.py:115` ve `api/social_proof.py:116`.
4. Sipariş kancası vitrin kodunu çağırıyor. Kanıt: `hooks.py:711`.
5. Satıcı API'si mağaza düzenini doğrudan yazıyor. Kanıt: `api/seller.py:1778` ve `api/seller.py:1836`.
6. Medya kodu mağaza düzeninin kaydetme akışına giriyor. Kanıt: `hooks.py:819`.
7. Medya kodu düzen JSON'unda `LIKE` ile arama yapıyor. Kanıt: `media/pipeline_bridge.py:620` ve `media/magaza_gorseli.py:257`.
8. Mağaza silme kodu düzeni siliyor. Kanıt: `services/store_cleanup.py:28`.
9. Pano motoru her bağlamın tablosunu ham SQL ile okuyor. Kanıt: `tradehub_core/api/dashboard_engine.py:389` ve `:440`.
10. CMS yayın kodu SEO değişiklik defterine yazıyor. Kanıt: `seo_helper/cms/publish.py:811`.

## 6. Önerilen geçiş sırası

Her madde bir PR boyutundadır.

1. Yanlış bağlamdaki DocType'ları sahiplerine devredin. Bunlar `Teamslike Settings`, `Translation Settings`, `Translation Usage Log`, `Dashboard *` ve `Site Maintenance Settings` kayıtlarıdır. Bu işlem diğer adımlardan bağımsızdır.
2. `tradehub_core/content/` paketini ve `api.py` dosyasını açın. İçi önce eski kodu çağırsın.
3. Vitrin API dosyalarını (`hero_slider`, `header_notice`, `category_showcase`, `theme`) pakete taşıyın. Her dosya ayrı PR olsun.
4. `save_storefront_layout` fonksiyonunu açın. `api/seller.py` bu fonksiyonu çağırsın.
5. `list_layout_image_urls` fonksiyonunu açın. Medya kodu `LIKE` yerine bunu kullansın.
6. 10 SEO bağlamı `check_route_available` ve `upsert_page_for_content` fonksiyonlarını açsın. CMS yayın kodu bunları çağırsın.
7. Ortak Outbox hazır olunca `content.published` olayını yayınlayın.
8. SEO aboneliği çalışınca CMS içindeki SEO yazımlarını kaldırın.
9. `seo_helper/cms/` klasörünü `content/cms/` altına taşıyın.
10. Sipariş bağlamının okuma modeli hazır olunca sosyal kanıt SQL'ini değiştirin.
11. DocType'ları `Content` modülüne taşıyın. Her küçük grup ayrı PR olsun.

## 7. Başka bağlama taşınması gereken DocType'lar

- `Dashboard Widget`, `Dashboard Widget Role` ve `Dashboard Banner` 14-platform-cekirdek bağlamına taşınmalı. Bunlar yönetim panosunun parçasıdır.
- `Site Maintenance Settings` 14-platform-cekirdek bağlamına taşınmalı. Bakım modu bütün siteyi etkiler.
- `Teamslike Settings` 12-bildirim-iletisim bağlamına taşınmalı. Tek kullanıcısı sohbet kodudur (`api/chat.py:71`).
- `Translation Settings` ve `Translation Usage Log` 11-degerlendirme bağlamına taşınmalı. Yorum çevirisine bağlıdırlar (`review_translation.py:11`).

Bağlam haritası değiştirilmedi. Bu öneriler yalnız raporlarda yazılıdır.

## 8. Paralel çalışan geliştiriciler için kurallar

1. Başka bağlamın tablosuna yazmayın. Örneğin `SEO Page` kaydını yalnız SEO kodu yazar.
2. Başka bağlamdan veri gerekiyorsa o bağlamın `api.py` dosyasını kullanın.
3. Başka bağlamın tepki vermesi gerekiyorsa olay yayınlayın. Doğrudan fonksiyon çağırmayın.
4. `hooks.py` içine yalnız bu bağlamın kendi işleyicisini ekleyin.
5. Yeni vitrin ayarı eklerken önbellek temizliğini aynı PR içinde yazın.
6. Mağaza düzeninin JSON biçimini değiştirirseniz `list_layout_image_urls` testini güncelleyin.
7. CMS yayın durumunu `set_value` ile değiştirmeyin. Durumu yalnız `transition` fonksiyonu değiştirir.
8. Testleri `tradehub_core/content/tests/` altına yazın.

Gerçek okurla denenmedi.

## Epic özeti

Bu bağlamda 26 epic vardır. Her epic bir DocType raporunun başındadır.

- CMS Collection Item: Düşük, Faz 4, Küçük
- CMS Content: Acil, Faz 4, Büyük
- CMS Content Category: Düşük, Faz 5, Küçük
- CMS Content Type: Önemli, Faz 4, Orta
- CMS Content Version: Önemli, Faz 4, Küçük
- CMS FAQ Attachment: Düşük, Faz 5, Küçük
- CMS FAQ Item: Düşük, Faz 5, Küçük
- CMS Help Section: Düşük, Faz 4, Küçük
- CMS Person Profile: Düşük, Faz 4, Küçük
- Category Showcase Settings: Düşük, Faz 4, Küçük
- Category Showcase Tile: Önemli, Faz 4, Küçük
- Dashboard Banner: Düşük, Faz 4, Küçük
- Dashboard Widget: Önemli, Faz 4, Büyük
- Dashboard Widget Role: Düşük, Faz 5, Küçük
- Field Help Content: Düşük, Faz 4, Orta
- Field Help Version: Düşük, Faz 5, Küçük
- Header Notice: Düşük, Faz 4, Küçük
- Header Notice Settings: Düşük, Faz 5, Küçük
- Hero Slide: Düşük, Faz 4, Küçük
- Site Maintenance Settings: Önemli, Faz 4, Küçük
- Social Proof Settings: Önemli, Faz 4, Orta
- Storefront Layout: Önemli, Faz 4, Orta
- Teamslike Settings: Önemli, Faz 4, Küçük
- Tradehub Theme Settings: Düşük, Faz 4, Küçük
- Translation Settings: Önemli, Faz 4, Orta
- Translation Usage Log: Düşük, Faz 4, Küçük
