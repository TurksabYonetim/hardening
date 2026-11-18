# SEO Page

- Bağlam: 10-seo
- Tür: Ana kayıt
- Klasör: `tradehub_core/seo_core/doctype/seo_page`
- Denetleyici: `tradehub_core/seo_core/doctype/seo_page/seo_page.py` (8 satır)
- Önerilen sahip bağlam: 10-seo

## Epic

- Epic adı: SEO Page: 10-seo bağlamına taşıma
- Öncelik: Acil
- Faz: Faz 4
- Tahmini büyüklük: Büyük

### User story

Bir geliştirici olarak, SEO sayfa kaydını yalnız SEO kodunun yazmasını istiyorum.
Böylece içerik ve SEO ekipleri aynı tabloda çakışmaz.

### Kabul kriterleri

- [ ] `SEO Page` kaydını yalnız `tradehub_core.seo` paketi yazıyor. `import-linter` kontrolü geçiyor.
- [ ] `check_route_available` ve `get_page_for_route` fonksiyonları `seo/api.py` içinde var.
- [ ] `content.published` olayı sonrası sayfa `published` ve `indexable` oluyor.
- [ ] İkinci içerik aynı rotayı alamıyor.
- [ ] Builder köprüsü `seo/` paketinde olay işleyicisi olarak çalışıyor.
- [ ] Characterization test: `SEO Page` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- İçerik kodundan `frappe.new_doc("SEO Page")` çağırmayın. Fonksiyonu ya da olayı kullanın.
- `robots` ve `canonical_url` alanlarını SEO dışından `set_value` ile yazmayın.
- Rota kontrolünü atlayan bir yayın yolu eklemeyin. Aynı adres iki sayfaya gider.
- `hooks.py` içine doğrudan yeni `doc_events` kaydı eklenmedi.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] Değişen davranış için önce başarısız olan bir test yazıldı.
- [ ] Ruff ve uygulama testleri yerelde geçiyor.
- [ ] `import-linter` kontrolü `tradehub_core.seo` için geçiyor.
- [ ] `CODEOWNERS` içindeki SEO bağlamı sahibinden inceleme istendi.
- [ ] Yeni olay için sözleşme testi eklendi. Test olay alanlarını kontrol ediyor.
- [ ] Abone aynı olayı iki kez alınca ikinci işlem hiçbir şey değiştirmiyor.
- [ ] Site haritası testi yayın ve geri çekme için geçiyor.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?

Bu kayıt sitede yayınlanan her sayfanın SEO kaydıdır. Kayıt rota, başlık, açıklama, robots ve kanonik adres tutar. Robots, arama motoruna dizinleme iznini söyleyen etikettir. Site haritası ve sayfa başlığı bu kayıttan üretilir.

## Bugünkü bağımlılıklar

### Bu kaydın bağlandığı kayıtlar

- `Builder Page` (`builder_page`, Link): başka bağlam (Frappe Builder uygulaması)
- `SEO Entity` (`entity`, Link): aynı bağlam
- `Admin Seller Profile` (`store`, Link): başka bağlam (02-satici-magaza)
- `SEO Domain` (`domain`, Link): aynı bağlam
- `SEO Locale Cluster` (`locale_cluster`, Link): aynı bağlam
- `SEO Policy` (`policy`, Link): aynı bağlam
- `SEO Profile` (`profile`, Link): aynı bağlam

### Bu kayda dokunan kod

- `tradehub_core/seo_helper/cms/bridge.py:63`: yazıyor
- `tradehub_core/seo_helper/cms/publish.py:364`: yazıyor
- `tradehub_core/seo_helper/cms/publish.py:415`: yazıyor
- `tradehub_core/seo_helper/mcp/api.py:601`: yazıyor
- `tradehub_core/seo_helper/setup/statik_sayfalar.py:111`: yazıyor
- `tradehub_core/seo_helper/api/cms.py:223`: okuyor
- `tradehub_core/seo_helper/api/panel.py:346`: okuyor
- `tradehub_core/seo_helper/audit/reporter.py:208`: okuyor
- `tradehub_core/seo_helper/audit/schema_f44.py:1043`: okuyor
- `tradehub_core/seo_helper/audit/schema_f44.py:1045`: okuyor
- `tradehub_core/seo_helper/board.py:316`: okuyor
- `tradehub_core/seo_helper/board.py:323`: okuyor
- Toplam 23 kaynak dosya bu adı kullanıyor. Yukarıda en önemlileri var.
- 3 patch ya da tohum dosyası bu adı kullanıyor. Örnek: `tradehub_core/scripts/patch_specs/spec10.json`.

### hooks.py kayıtları

- `tradehub_core/hooks.py:1425`: mağaza kapsamlı izin döngüsü. `hooks.py:1437` `store_query_conditions` ve `hooks.py:1438` `store_has_permission` kaydını bağlar.
- `tradehub_core/hooks.py:1395`: `Builder Page` `validate` kaydı `cms.govde.on_builder_page_validate` fonksiyonunu çağırıyor.
- `tradehub_core/hooks.py:1396`: `Builder Page` `on_update` kaydı `cms.bridge.on_builder_page_update` fonksiyonunu çağırıyor.
- `tradehub_core/hooks.py:1397`: `Builder Page` `on_trash` kaydı `cms.bridge.on_builder_page_trash` fonksiyonunu çağırıyor.

## Bağımlılık sorunları

1. İçerik yayın kodu bu tabloya doğrudan yazıyor. Kanıt: `seo_helper/cms/publish.py:775`, `:364`, `:415` ve `:493`. Bu kod 09 bağlamına ait.
2. Builder kancaları bu tabloyu yazıyor. Kanıt: `hooks.py:1396` ve `seo_helper/cms/bridge.py:63`.
3. Kayıt yedi DocType'a bağlı. İkisi başka bağlamda. Bunlar `Builder Page` ve `Admin Seller Profile` kayıtlarıdır.

## Hedef tasarım

- Sahip bağlam ve paket yolu: `tradehub_core/seo/` paketi. Bugünkü `seo_helper/` kodu bu paketin içine taşınır. Mevcut `SEO Core`, `SEO Crawler`, `SEO Catalog`, `SEO Merchant` ve `SEO MCP` modülleri 10 bağlamının alt modülleri olarak kalır.
- Dışarıya açılan fonksiyonlar: `seo/api.py` içinde `check_route_available(route, lang)`, `get_page_for_route(route, lang)` ve `get_decision(doctype, name)`.
- Yayınladığı olaylar: `seo.page_indexability_changed`. Olay şu alanları taşır: `page`, `route`, `indexable`, `robots`.
- Dinlediği olaylar: 09 bağlamının `content.published`, `content.unpublished` ve `content.route_changed` olayları. Abone sayfayı açar, günceller ya da kaldırır.
- Başka bağlamlara bağlantılar: `store` Link alanı kalır. `builder_page` Link alanı kalır. İçerik başlığı ve özeti anlık görüntü alanıdır.
- Denetleyicide kalacak doğrulamalar: Ayrı doğrulama gerekmiyor.
- Servise taşınacak iş kuralları: CMS köprüsü (`bridge.py`) SEO paketinde olay işleyicisi olur.

## Geçiş adımları

1. `check_route_available` ve `upsert_page_for_content` fonksiyonlarını açın.
2. 09 bağlamı bu fonksiyonları kullansın. Davranış aynı kalsın.
3. `content.published` aboneliği eklensin. Sonra doğrudan çağrı kaldırılsın.
4. `seo_helper/` kodunu `seo/` altına taşıyın.

## Riskler ve testler

- Yayınlanan sayfa dizine girmeyebilir. Test: yayın olayı sonrası sayfa `published` ve `indexable` olmalı.
- İki içerik aynı rotayı alabilir. Test: rota kontrolü ikinci kaydı reddetmeli.
