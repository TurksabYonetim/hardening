# Static Page SEO

- Bağlam: 10-seo
- Tür: Ana kayıt
- Klasör: `tradehub_core/tradehub_core/doctype/static_page_seo`
- Denetleyici: `tradehub_core/tradehub_core/doctype/static_page_seo/static_page_seo.py` (18 satır)
- Önerilen sahip bağlam: 10-seo

## Epic

- Epic adı: Static Page SEO: 10-seo bağlamına taşıma
- Öncelik: Önemli
- Faz: Faz 4
- Tahmini büyüklük: Orta

### User story

Bir platform yöneticisi olarak, sabit sayfaların SEO bilgisini güvenle değiştirmek istiyorum.
Böylece yasal sayfalar yanlışlıkla dizine girmez.

### Kabul kriterleri

- [ ] `upsert_static_page` fonksiyonu `seo/api.py` içinde var. Yeni patch'ler bu fonksiyonu kullanıyor.
- [ ] `media/usage.py` bu DocType adını doğrudan kullanmıyor.
- [ ] Noindex yasal sayfa site haritasında yok.
- [ ] DocType `SEO Core` modülünde duruyor.
- [ ] Characterization test: `Static Page SEO` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- Yeni patch içinde bu tabloya `set_value` ile yazmayın. Önbellek ve site haritası temizlenmez.
- `page_path` alanını sonunda `/` ile kaydetmeyin. Denetleyici yolu düzeltir, kodu ona güvenin.
- Yasal sayfanın `robots` değerini `index` yapmayın. Yasal sayfalar dizine girmemeli.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] Değişen davranış için önce başarısız olan bir test yazıldı.
- [ ] Ruff ve uygulama testleri yerelde geçiyor.
- [ ] `import-linter` kontrolü `tradehub_core.seo` için geçiyor.
- [ ] `CODEOWNERS` içindeki SEO bağlamı sahibinden inceleme istendi.
- [ ] DocType modülü taşınırsa patch iki kez çalışınca hata vermiyor.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?

Bu kayıt sabit sayfaların SEO bilgisini tutar. Örnek sayfalar ana sayfa ve yasal sayfalardır. Kayıt başlık, açıklama ve robots değerlerini saklar. Kayıt adı sayfa yoludur.

## Bugünkü bağımlılıklar

### Bu kaydın bağlandığı kayıtlar

- Bu kaydın başka kayda bağlantısı yok.

### Bu kayda dokunan kod

- `tradehub_core/api/seo_admin.py:186`: yazıyor
- `tradehub_core/setup/seed_static_pages.py:22`: yazıyor
- `tradehub_core/setup/seed_static_pages.py:63`: yazıyor
- `tradehub_core/seo/page_resolver.py:785`: okuyor
- `tradehub_core/seo/page_resolver.py:786`: okuyor
- `tradehub_core/seo/url_preview.py:315`: okuyor
- `tradehub_core/seo/url_preview.py:317`: okuyor
- `tradehub_core/setup/seed_static_pages.py:19`: okuyor
- `tradehub_core/setup/seed_static_pages.py:51`: okuyor
- `tradehub_core/api/seo_admin.py:239`: adını kullanıyor
- `tradehub_core/api/seo_admin.py:259`: adını kullanıyor
- `tradehub_core/media/usage.py:146`: adını kullanıyor
- Toplam 11 kaynak dosya bu adı kullanıyor. Yukarıda en önemlileri var.
- 8 patch ya da tohum dosyası bu adı kullanıyor. Örnek: `tradehub_core/patches/v15_11_09_global_marka_metinleri.py`.

### hooks.py kayıtları

- `tradehub_core/hooks.py:670`: doc_events kaydı. `on_update` -> `liste`, `on_trash` -> `tradehub_core.seo.hooks_seo.invalidate_sitemap_for`

## Bağımlılık sorunları

1. Birçok patch bu tabloyu yazıyor. Örnek: `patches/v15_seo_static_pages_cleanup.py`. Yasal metin patch'leri de bu tabloya dokunuyor.
2. Medya kodu bu DocType adını biliyor. Kanıt: `media/usage.py`. Bu bağ 08 bağlamını 10 bağlamına bağlıyor.
3. İki SEO paketi bu tabloyu okuyor. Kanıt: `seo/meta_builder.py` ve `seo_helper/core/catalog.py:288`.

## Hedef tasarım

- Sahip bağlam ve paket yolu: `tradehub_core/seo/` paketi. Bugünkü `seo_helper/` kodu bu paketin içine taşınır. Mevcut `SEO Core`, `SEO Crawler`, `SEO Catalog`, `SEO Merchant` ve `SEO MCP` modülleri 10 bağlamının alt modülleri olarak kalır. DocType `Tradehub Core` modülünden `SEO Core` modülüne taşınır.
- Dışarıya açılan fonksiyonlar: `seo/api.py` içinde `get_static_page_meta(path, lang)` ve `upsert_static_page(path, values)`.
- Yayınladığı olaylar: Yok. Önbellek temizliği bağlam içinde kalır.
- Dinlediği olaylar: Yok.
- Başka bağlamlara bağlantılar: Başka bağlama Link yok.
- Denetleyicide kalacak doğrulamalar: Yol biçimi düzeltme ve başlık yedeği kalır.
- Servise taşınacak iş kuralları: Tohumlama `setup/seed_static_pages.py` içinden `seo/setup.py` içine taşınır.

## Geçiş adımları

1. `upsert_static_page` fonksiyonunu açın. Yeni patch'ler bu fonksiyonu kullansın.
2. `media/usage.py` okumasını medya kullanım kayıt noktasına çevirin.
3. DocType'ı `SEO Core` modülüne taşıyın.

## Riskler ve testler

- Yasal sayfa yanlışlıkla dizine girebilir. Test: noindex yasal sayfa site haritasında olmamalı.
