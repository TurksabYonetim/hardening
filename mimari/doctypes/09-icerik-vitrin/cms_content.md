# CMS Content

- Bağlam: 09-icerik-vitrin
- Tür: Ana kayıt
- Klasör: `tradehub_core/seo_cms/doctype/cms_content`
- Denetleyici: `tradehub_core/seo_cms/doctype/cms_content/cms_content.py` (240 satır)
- Önerilen sahip bağlam: 09-icerik-vitrin

## Epic

- Epic adı: CMS Content: 09-icerik-vitrin bağlamına taşıma
- Öncelik: Acil
- Faz: Faz 4
- Tahmini büyüklük: Büyük

### User story

Bir geliştirici olarak, içerik yayınlarken SEO tablolarına dokunmamak istiyorum.
Böylece SEO ekibi alan değiştirince yayın bozulmaz.

### Kabul kriterleri

- [ ] `seo_helper/cms/publish.py` artık `SEO Page` kaydına doğrudan yazmıyor. SEO kaydını `seo/api.py` fonksiyonu ya da olay abonesi yazıyor.
- [ ] Yayın sonunda Outbox'a tek bir `content.published` olayı yazılıyor.
- [ ] CMS kodu `tradehub_core/content/cms/` altında duruyor. Eski yolda yalnız yeniden dışa aktarma kaldı.
- [ ] Aynı rota ikinci kez yayınlanınca `check_route_available` hata döndürüyor.
- [ ] Satıcı başka mağazanın içeriğini listede ve doğrudan adreste göremiyor.
- [ ] Characterization test: `CMS Content` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- `publish_state` alanını `set_value` ya da `db_set` ile değiştirmeyin. Durumu yalnız `transition` fonksiyonu değiştirir.
- `SEO Page` ve `SEO Change Log` kayıtlarına CMS kodundan yeni yazım eklemeyin. Bu tablolar SEO bağlamına aittir.
- Denetleyicideki yetki kapısını `_set_keys` çağrısından sonraya taşımayın. Editör içerik oluşturamaz hale gelir.
- Kurulum ya da patch kodunda içeriği `set_value` ile yazmayın. Slug ve yetki kapıları atlanır.
- Slug için ikinci bir düzenli ifade yazmayın. Alfabe tek kaynaktadır: `seo_helper/cms/keys.slug_sorunu`.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] Değişen davranış için önce başarısız olan bir test yazıldı.
- [ ] Ruff ve uygulama testleri yerelde geçiyor.
- [ ] `import-linter` kontrolü `tradehub_core.content` için geçiyor.
- [ ] `CODEOWNERS` içindeki içerik bağlamı sahibinden inceleme istendi.
- [ ] Yeni olay için sözleşme testi eklendi. Test olay alanlarını kontrol ediyor.
- [ ] Abone aynı olayı iki kez alınca ikinci işlem hiçbir şey değiştirmiyor.
- [ ] Yayın, geri çekme ve zamanlanmış yayın testleri geçiyor.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?

Bu kayıt bir içerik sayfasıdır. Blog yazısı, yardım makalesi, yasal metin ve koleksiyon sayfası bu türdedir. Kayıt slug, dil, yayın durumu ve gövde bağını tutar. Slug, adresin son parçasıdır. Yayın işi `seo_helper/cms/publish.py` içinde yapılır.

## Bugünkü bağımlılıklar

### Bu kaydın bağlandığı kayıtlar

- `CMS Content Type` (`content_type`, Link): aynı bağlam
- `CMS Person Profile` (`author`, Link): aynı bağlam
- `Builder Page` (`builder_page`, Link): başka bağlam (Frappe Builder uygulaması)
- `SEO Page` (`seo_page`, Link): başka bağlam (10-seo)
- `Admin Seller Profile` (`store`, Link): başka bağlam (02-satici-magaza)
- `CMS Content Category` (`related_categories`, alt tablo): aynı bağlam
- `CMS Help Section` (`help_section`, Link): aynı bağlam
- `CMS FAQ Item` (`faq_items`, alt tablo): aynı bağlam
- `CMS FAQ Attachment` (`faq_attached_to`, alt tablo): aynı bağlam
- `Consent Policy Version` (`consent_policy_version`, Link): başka bağlam (13-uyum-gizlilik)
- `CMS Collection Item` (`items`, alt tablo): aynı bağlam
- `SEO Facet Landing Page` (`auto_rule`, Link): başka bağlam (10-seo)

### Bu kayda dokunan kod

- `tradehub_core/seo_helper/setup/statik_guncelle.py:176`: yazıyor
- `tradehub_core/seo_helper/api/cms.py:166`: okuyor
- `tradehub_core/seo_helper/api/cms.py:174`: okuyor
- `tradehub_core/seo_helper/audit/schema_f44.py:1033`: okuyor
- `tradehub_core/seo_helper/audit/schema_f44.py:1034`: okuyor
- `tradehub_core/seo_helper/audit/signals.py:237`: okuyor
- `tradehub_core/seo_helper/cms/binding.py:84`: okuyor
- `tradehub_core/seo_helper/cms/bridge.py:40`: okuyor
- `tradehub_core/seo_helper/cms/bridge.py:42`: okuyor
- `tradehub_core/seo_helper/cms/fields.py:163`: okuyor
- `tradehub_core/seo_helper/cms/govde.py:35`: okuyor
- `tradehub_core/seo_helper/cms/govde.py:86`: okuyor
- Toplam 23 kaynak dosya bu adı kullanıyor. Yukarıda en önemlileri var.
- 5 patch ya da tohum dosyası bu adı kullanıyor. Örnek: `tradehub_core/patches/v15_10_09_gizlilik_uk_gdpr.py`.

### hooks.py kayıtları

- `tradehub_core/hooks.py:1435`: mağaza kapsamlı izin döngüsü. `hooks.py:1437` `store_query_conditions` ve `hooks.py:1438` `store_has_permission` kaydını bağlar.

## Bağımlılık sorunları

1. İçerik kodu SEO paketinin içinde duruyor. Kanıt: denetleyici `seo_helper/cms` modüllerini içe aktarıyor (`cms_content.py:61`, `cms_content.py:101`, `cms_content.py:137`). İçerik ekibi ile SEO ekibi aynı klasörde çalışıyor.
2. Yayın kodu SEO tablosuna doğrudan yazıyor. Kanıt: `seo_helper/cms/publish.py:775` `SEO Page` kaydını açıyor ya da oluşturuyor. `publish.py:364`, `publish.py:415` ve `publish.py:493` alanları `set_value` ile değiştiriyor. SEO ekibi alanı değiştirirse yayın bozulur.
3. Yayın kodu SEO değişiklik defterine de yazıyor. Kanıt: `seo_helper/cms/publish.py:811` `SEO Change Log` kaydı açıyor.
4. Kurulum ve patch kodu içeriği `set_value` ile yazıyor. Kanıt: `seo_helper/setup/statik_guncelle.py:176`. Bu yazım denetleyicideki yetki ve slug kapılarını atlar.
5. Kayıt dört bağlama Link ile bağlı. Bağlar `SEO Page`, `SEO Facet Landing Page`, `Admin Seller Profile` ve `Consent Policy Version` kayıtlarına gidiyor.

## Hedef tasarım

- Sahip bağlam ve paket yolu: `tradehub_core/content/cms/` paketi. Bugünkü `SEO CMS` modülü bu bağlama ait sayılır.
- Dışarıya açılan fonksiyonlar: `content/api.py` içinde `get_content(name)`, `get_published_by_route(route, lang)`, `list_published(content_type, lang)` ve `transition(name, target_state)`.
- Yayınladığı olaylar: `content.published`, `content.unpublished` ve `content.route_changed`. Olay şu alanları taşır: `content_id`, `cms_key`, `route`, `lang`, `store`, `content_type`, `published_at`.
- Dinlediği olaylar: 03a bağlamının `listing.deleted` olayı ve 02 bağlamının `seller.deleted` olayı.
- Başka bağlamlara bağlantılar: `store`, `consent_policy_version` ve `builder_page` Link alanları kalır. `seo_page` alanı yalnız okuma bağı olur. SEO bağlamı ayna kaydını olayla kendisi yazar. Rota uygunluğu `seo/api.py` içindeki `check_route_available()` ile eşzamanlı sorulur.
- Denetleyicide kalacak doğrulamalar: Yetki kapısı, slug alfabesi, durum geçişi, tarih ve katalog kaynaklı alan kontrolleri kalır.
- Servise taşınacak iş kuralları: SEO Page yazımı `publish.py` içinden çıkar. SEO bağlamındaki bir abone bu işi yapar.

## Geçiş adımları

1. `seo/api.py` içinde `check_route_available()` ve `upsert_page_for_content()` fonksiyonlarını açın. Bu adım önce gelir.
2. `publish.py` içindeki `SEO Page` yazımlarını bu fonksiyonlara yönlendirin. Davranış değişmesin.
3. Yayın sonunda `content.published` olayını Outbox'a yazın.
4. SEO bağlamı olaya abone olunca `upsert_page_for_content` çağrısını kaldırın.
5. `seo_helper/cms/` klasörünü `content/cms/` altına taşıyın. Eski yolda yeniden dışa aktarma bırakın.
6. `statik_guncelle.py:176` yazımını `content/api.py` üzerinden yapın.
7. DocType'ı `Content` modülüne taşıyın.

## Riskler ve testler

- Yayınlanan sayfa site haritasına girmeyebilir. Test: yayın sonrası olay işlenince `SEO Page` yayında olmalı.
- Rota çakışması yakalanmayabilir. Test: aynı rota ikinci kez yayınlanınca hata dönmeli.
- Satıcı başka mağazanın içeriğini görebilir. Test: `store_has_permission` yabancı mağaza için hayır demeli.
