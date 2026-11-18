# CMS Content Type

- Bağlam: 09-icerik-vitrin
- Tür: Ana kayıt
- Klasör: `tradehub_core/seo_cms/doctype/cms_content_type`
- Denetleyici: `tradehub_core/seo_cms/doctype/cms_content_type/cms_content_type.py` (8 satır)
- Önerilen sahip bağlam: 09-icerik-vitrin

## Epic

- Epic adı: CMS Content Type: 09-icerik-vitrin bağlamına taşıma
- Öncelik: Önemli
- Faz: Faz 4
- Tahmini büyüklük: Orta

### User story

Bir geliştirici olarak, içerik türlerini tek bir fonksiyondan okumak istiyorum.
Böylece SEO kodu tür tablosunun içine bakmaz.

### Kabul kriterleri

- [ ] `get_route_prefixes()` fonksiyonu `content/api.py` içinde var ve test ediliyor.
- [ ] `seo/sitemap_generator.py` ve `seo_helper/audit/signals.py` türleri bu fonksiyonla okuyor.
- [ ] Tür tohumlama kodu `content/setup.py` içinde duruyor.
- [ ] Rota önek listesi nginx şablonuyla eşit. Nöbetçi test geçiyor.
- [ ] Characterization test: `CMS Content Type` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- `route_prefix` değerini nginx şablonunu güncellemeden değiştirmeyin. Yayındaki sayfa 404 verir.
- `publish_langs` alanını kurulum kodundan `set_value` ile yazmayın. Değişiklik izlenmez.
- Tür davranışını `type_key` değerine göre kodlamayın. Bayrak alanlarını kullanın, örneğin `is_catalog_sourced`.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] Değişen davranış için önce başarısız olan bir test yazıldı.
- [ ] Ruff ve uygulama testleri yerelde geçiyor.
- [ ] `import-linter` kontrolü `tradehub_core.content` için geçiyor.
- [ ] `CODEOWNERS` içindeki içerik bağlamı sahibinden inceleme istendi.
- [ ] `CMS Content Type` değişince site haritası testi geçiyor.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?

Bu kayıt içerik türlerini tanımlar. Örnekler blog, yardım ve etkinliktir. Kayıt rota önekini, şema türünü ve onay kuralını tutar. Kurulum kodu türleri `after_migrate` sırasında oluşturur.

## Bugünkü bağımlılıklar

### Bu kaydın bağlandığı kayıtlar

- `SEO Profile` (`default_profile`, Link): başka bağlam (10-seo)

### Bu kayda dokunan kod

- `tradehub_core/seo_helper/setup/install.py:420`: yazıyor
- `tradehub_core/seo_helper/setup/statik_sayfalar.py:47`: yazıyor
- `tradehub_core/seo_cms/doctype/cms_content/cms_content.py:103`: okuyor
- `tradehub_core/seo_cms/doctype/cms_content/cms_content.py:124`: okuyor
- `tradehub_core/seo_helper/api/cms.py:177`: okuyor
- `tradehub_core/seo_helper/api/cms.py:320`: okuyor
- `tradehub_core/seo_helper/audit/signals.py:200`: okuyor
- `tradehub_core/seo_helper/cms/govde.py:89`: okuyor
- `tradehub_core/seo_helper/cms/publish.py:489`: okuyor
- `tradehub_core/seo_helper/cms/publish.py:514`: okuyor
- `tradehub_core/seo_helper/cms/render.py:200`: okuyor
- `tradehub_core/seo_helper/cms/routes.py:192`: okuyor
- Toplam 17 kaynak dosya bu adı kullanıyor. Yukarıda en önemlileri var.
- 5 patch ya da tohum dosyası bu adı kullanıyor. Örnek: `tradehub_core/patches/v15_10_09_gizlilik_uk_gdpr.py`.

### hooks.py kayıtları

- `hooks.py` içinde bu DocType için kayıt yok.

## Bağımlılık sorunları

1. Tür, SEO bağlamındaki `SEO Profile` kaydına bağlı. Kanıt: `default_profile` alanı.
2. SEO site haritası bu tabloyu doğrudan okuyor. Kanıt: `seo/sitemap_generator.py:443`. SEO denetim kodu da okuyor: `seo_helper/audit/signals.py:200`.
3. Kurulum kodu `publish_langs` alanını `set_value` ile yazıyor. Kanıt: `seo_helper/setup/statik_sayfalar.py:47`.

## Hedef tasarım

- Sahip bağlam ve paket yolu: `tradehub_core/content/cms/` paketi. Bugünkü `SEO CMS` modülü bu bağlama ait sayılır.
- Dışarıya açılan fonksiyonlar: `content/api.py` içinde `list_content_types()` ve `get_route_prefixes()`.
- Yayınladığı olaylar: `content_type.changed`. Olay şu alanları taşır: `type_key`, `route_prefix`. SEO bağlamı site haritası için dinler.
- Dinlediği olaylar: Yok.
- Başka bağlamlara bağlantılar: `default_profile` Link alanı kalır. SEO bağlamı rota öneklerini `get_route_prefixes()` ile okur.
- Denetleyicide kalacak doğrulamalar: Ayrı doğrulama gerekmiyor.
- Servise taşınacak iş kuralları: Tür tohumlama `content/setup.py` içine taşınır.

## Geçiş adımları

1. `get_route_prefixes()` fonksiyonunu açın.
2. `sitemap_generator.py:443` ve `signals.py:200` okumalarını bu fonksiyona çevirin.
3. Tohumlama kodunu `seo_helper/setup/install.py:415` içinden `content/setup.py` içine taşıyın.

## Riskler ve testler

- Rota öneki değişince nginx ve site haritası uyuşmayabilir. Test: önek listesi nginx şablonuyla eşit olmalı.
