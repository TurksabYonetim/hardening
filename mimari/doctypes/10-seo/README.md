# 10 SEO bağlamı

## 1. Bağlamın amacı

Bu bağlam sitenin arama motorlarında doğru görünmesini sağlar. SEO, arama motoru için sayfa düzenleme işidir. Bağlam sayfa başlıklarını, site haritasını ve yönlendirmeleri yönetir. Site taraması, SEO denetimi, Search Console bağlantısı ve yapay zekâ araçları da buradadır.

Bugün SEO kodu iki ayrı pakette duruyor:

- Eski paket `tradehub_core/seo/`. Yönlendirme, site haritası ve meta etiket kodu buradadır.
- Yeni paket `tradehub_core/seo_helper/`. Tarama, denetim, MCP ve CMS köprüsü buradadır.

DocType'lar altı Frappe modülüne dağılmış. Bunlar `SEO Core`, `SEO Crawler`, `SEO Catalog`, `SEO Merchant`, `SEO MCP` ve `Tradehub Core` modülleridir.

Hedef paket `tradehub_core/seo/` olur. `seo_helper/` bu paketin içine taşınır. `SEO *` modülleri 10 bağlamının alt modülleri olarak kalır. `Tradehub Core` modülündeki üç SEO DocType'ı `SEO Core` modülüne geçer.

## 2. DocType listesi

Ana kayıtlar (18):

- `MCP Client`
- `MCP Draft`
- `SEO Audit Finding`
- `SEO Crawl Run`
- `SEO Domain`
- `SEO Entity`
- `SEO Experiment`
- `SEO Facet Landing Page`
- `SEO Helper Rule` (kullanılmıyor olabilir)
- `SEO Locale Cluster`
- `SEO Merchant Map`
- `SEO Page`
- `SEO Policy`
- `SEO Profile`
- `SEO Redirect`
- `SEO Redirect Rule` (kullanılmıyor olabilir)
- `SEO Route` (yarım kalmış olabilir)
- `Static Page SEO`

Kayıt defterleri (8):

- `MCP Tool Call`
- `SEO 404 Log`
- `SEO Bot Visit`
- `SEO Change Log`
- `SEO Connector Quota`
- `SEO Crawl Page`
- `SEO Metric Snapshot`
- `SEO Sync Job`

Ayar (1):

- `SEO Helper Settings`

Alt tablo yok. Toplam 27 DocType vardır. Her biri için ayrı rapor bu klasörde durur.

## 3. Bağlamın dışa açık API'si

Önerilen dosya `tradehub_core/seo/api.py` dosyasıdır.

Sayfa fonksiyonları:

- `check_route_available(route, lang)` fonksiyonu rota boş mu diye bakar.
- `get_page_for_route(route, lang)` fonksiyonu rotadaki SEO kaydını döndürür.
- `get_decision(doctype, name)` fonksiyonu dizinleme kararını ve nedenlerini döndürür.
- `get_static_page_meta(path, lang)` ve `upsert_static_page(path, values)`

Katalog aynası fonksiyonları:

- `get_entity(ref_doctype, ref_name)`
- `set_indexable(ref_doctype, ref_name, value)`

Yönlendirme fonksiyonları:

- `create_redirect(source, target, code)`
- `resolve(path)`
- `list_404s()`

Ayar fonksiyonları:

- `get_public_site_url()`
- `get_primary_domain()`

## 4. Yayınlanan ve dinlenen olaylar

Bu bağlamın yayınladığı olaylar:

- `seo.page_indexability_changed`. Olay şu alanları taşır: `page`, `route`, `indexable`, `robots`. Site haritası ve önbellek tutan bağlamlar dinler.
- `seo.entity_indexability_changed`. Olay şu alanları taşır: `ref_doctype`, `ref_name`, `indexable`.
- `seo.redirect_created`. Olay şu alanları taşır: `source_path`, `target_path`, `status_code`.
- `seo.policy_changed`. Olay `policy_key` alanını taşır.

Bu bağlamın dinlediği olaylar:

- 03a katalog bağlamının `listing.updated`, `listing.deleted` ve `listing.slug_changed` olayları.
- 03a katalog bağlamının `category.*` ve `brand.*` olayları. Yıldız, aynı önekli bütün olaylar demektir.
- 02 mağaza bağlamının `seller.updated` ve `seller.deleted` olayları.
- 09 içerik bağlamının `content.published`, `content.unpublished` ve `content.route_changed` olayları.
- 04 sipariş bağlamının `order.created` olayı. RFQ ve satıcı sorusu oluşma olayları da dinlenir. Bu olaylar organik trafik atfı için kullanılır.

## 5. Bağlamlar arası en ağır 10 bağımlılık

1. SEO doğrulaması ilan, kategori ve marka kaydını durdurabiliyor. Kanıt: `hooks.py:569`, `hooks.py:578`, `hooks.py:643`, `hooks.py:644`, `hooks.py:659` ve `hooks.py:660`. SEO kodu hata verirse katalog kaydı düşer.
2. Slug değişimi katalog kancasından yönlendirme yazıyor. Kanıt: `hooks.py:590`, `hooks.py:651` ve `hooks.py:665`.
3. Katalog ve mağaza kancaları SEO aynasını doğrudan çağırıyor. Kanıt: `hooks.py:1398`, `hooks.py:1403` ve `hooks.py:1407`.
4. Sipariş, RFQ ve satıcı sorusu kancaları SEO atıf kodunu çağırıyor. Kanıt: `hooks.py:1408` ve `hooks.py:1409`.
5. Paylaşılan senkron kodu SEO aynasına doğrudan yazıyor. Kanıt: `shared_sync/projections.py:332` ve `shared_sync/metadata_projection.py:127`.
6. 09 içerik kodu `SEO Page` tablosuna yazıyor. Kanıt: `seo_helper/cms/publish.py:775` ve `seo_helper/cms/bridge.py:63`.
7. Builder sayfa kancaları SEO köprüsünü çağırıyor. Kanıt: `hooks.py:1395`, `hooks.py:1396` ve `hooks.py:1397`.
8. MCP taslağı Builder sayfasını doğrudan yazıyor. Kanıt: `seo_helper/mcp/api.py:557` ve `seo_helper/mcp/api.py:570`.
9. Kategori silme kodu SEO DocType adını biliyor. Kanıt: `services/category_delete.py:40`.
10. Kurulum kodu başka DocType'lara SEO özel alanları ekliyor. Kanıt: `seo_helper/setup/install.py:46`.

## 6. Önerilen geçiş sırası

Her madde bir PR boyutundadır.

1. `tradehub_core/seo/api.py` dosyasını açın. Fonksiyonlar önce bugünkü kodu çağırsın.
2. SEO doğrulama kancalarını yumuşatın. Kanca hata verirse kaydı durdurmasın, hata kaydı yazsın. Slug üretimi katalog bağlamına geçsin.
3. 09 içerik bağlamı yayında `check_route_available` ve `upsert_page_for_content` fonksiyonlarını çağırsın.
4. Ortak Outbox hazır olunca 03a ve 02 bağlamları olaylarını yayınlasın.
5. Katalog aynası işleyicilerini olay abonesi yapın. Kancalar geçiş süresince kalsın.
6. Abone sağlıklı çalışınca `hooks.py:1398`, `:1403` ve `:1407` kancalarını kaldırın.
7. Slug değişimini `*.slug_changed` olayına bağlayın. `hooks.py:590`, `:651` ve `:665` kancalarını kaldırın.
8. Sipariş atfını `order.created` olayına bağlayın. `hooks.py:1408` döngüsünü kaldırın.
9. `shared_sync` yazımlarını `set_indexable` çağrısına çevirin.
10. `seo_helper/` paketini `seo/` altına taşıyın. Her alt klasör ayrı PR olsun.
11. `SEO Redirect` ile `SEO Redirect Rule` için tek tablo kararı verin.
12. Kullanılmayan DocType'lar için canlı veriyi kontrol edin. Bunlar `SEO Helper Rule`, `SEO Redirect Rule` ve `SEO Route` kayıtlarıdır.

## 7. Başka bağlama taşınması gereken DocType'lar

Bu bağlamdaki bütün DocType'lar doğru bağlamda.

Ters yönde bir not vardır. CMS DocType'ları `SEO CMS` modülünde duruyor. Bağlam haritası onları 09 içerik bağlamına koyuyor. Bu karar doğrudur. CMS kodunun `seo_helper/cms/` klasöründen 09 paketine taşınması gerekir.

## 8. Paralel çalışan geliştiriciler için kurallar

1. Katalog ya da sipariş kancasına SEO işleyicisi eklemeyin. Olaya abone olun.
2. SEO işleyicisi başka bağlamın kaydını durdurmasın. Hata olursa yalnız hata kaydı yazsın.
3. `SEO Page` ve `SEO Entity` kayıtlarını yalnız SEO kodu yazar.
4. Başka bağlam SEO bilgisini `seo/api.py` üzerinden okusun.
5. Yeni kod `seo_helper/` altına değil, hedef `seo/` yapısına yazılsın.
6. Başka DocType'a özel alan eklemeden önce sahip bağlamın onayını alın.
7. Yeni yönlendirme yalnız `SEO Redirect` tablosuna yazılsın.
8. Testleri `tradehub_core/seo/tests/` altına yazın.

Gerçek okurla denenmedi.

## Epic özeti

Bu bağlamda 27 epic vardır. Her epic bir DocType raporunun başındadır.

- MCP Client: Önemli, Faz 4, Küçük
- MCP Draft: Önemli, Faz 4, Orta
- MCP Tool Call: Düşük, Faz 4, Küçük
- SEO 404 Log: Düşük, Faz 4, Küçük
- SEO Audit Finding: Önemli, Faz 4, Küçük
- SEO Bot Visit: Düşük, Faz 4, Küçük
- SEO Change Log: Düşük, Faz 4, Küçük
- SEO Connector Quota: Düşük, Faz 4, Küçük
- SEO Crawl Page: Düşük, Faz 4, Küçük
- SEO Crawl Run: Düşük, Faz 4, Küçük
- SEO Domain: Düşük, Faz 4, Küçük
- SEO Entity: Acil, Faz 4, Büyük
- SEO Experiment: Acil, Faz 4, Orta
- SEO Facet Landing Page: Önemli, Faz 4, Küçük
- SEO Helper Rule: Düşük, Faz 4, Küçük
- SEO Helper Settings: Önemli, Faz 4, Orta
- SEO Locale Cluster: Düşük, Faz 4, Küçük
- SEO Merchant Map: Düşük, Faz 4, Küçük
- SEO Metric Snapshot: Düşük, Faz 4, Küçük
- SEO Page: Acil, Faz 4, Büyük
- SEO Policy: Düşük, Faz 4, Küçük
- SEO Profile: Düşük, Faz 4, Küçük
- SEO Redirect: Acil, Faz 4, Orta
- SEO Redirect Rule: Düşük, Faz 4, Küçük
- SEO Route: Düşük, Faz 4, Küçük
- SEO Sync Job: Düşük, Faz 4, Küçük
- Static Page SEO: Önemli, Faz 4, Orta
