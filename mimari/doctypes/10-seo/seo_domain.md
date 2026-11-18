# SEO Domain

- Bağlam: 10-seo
- Tür: Ana kayıt
- Klasör: `tradehub_core/seo_core/doctype/seo_domain`
- Denetleyici: `tradehub_core/seo_core/doctype/seo_domain/seo_domain.py` (8 satır)
- Önerilen sahip bağlam: 10-seo

## Epic

- Epic adı: SEO Domain: 10-seo bağlamına taşıma
- Öncelik: Düşük
- Faz: Faz 4
- Tahmini büyüklük: Küçük

### User story

Bir geliştirici olarak, birincil alan adını tek fonksiyondan almak istiyorum.
Böylece dört farklı sorgu birbirinden ayrışmaz.

### Kabul kriterleri

- [ ] `get_primary_domain()` fonksiyonu `seo/api.py` içinde var.
- [ ] `mirror.py:36`, `bridge.py:119`, `publish.py:793` ve `install.py:249` bu fonksiyonu kullanıyor.
- [ ] Birden çok birincil alan adı kaydedilemiyor.
- [ ] Characterization test: `SEO Domain` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- Birincil alan adı için yeni bir `get_value` sorgusu yazmayın. Ortak fonksiyonu kullanın.
- `host` alanını kayıttan sonra değiştirmeyin. Kayıt adı bu alandan gelir.
- Alan adını `http` ile kaydetmeyin. Kanonik adresler bozulur.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] Değişen davranış için önce başarısız olan bir test yazıldı.
- [ ] Ruff ve uygulama testleri yerelde geçiyor.
- [ ] `import-linter` kontrolü `tradehub_core.seo` için geçiyor.
- [ ] `CODEOWNERS` içindeki SEO bağlamı sahibinden inceleme istendi.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?

Bu kayıt sitenin alan adlarını tutar. Bir alan adı birincil olarak işaretlenir. Yeni SEO sayfaları birincil alan adını alır.

## Bugünkü bağımlılıklar

### Bu kaydın bağlandığı kayıtlar

- Bu kaydın başka kayda bağlantısı yok.

### Bu kayda dokunan kod

- `tradehub_core/seo_helper/catalog/mirror.py:36`: okuyor
- `tradehub_core/seo_helper/cms/bridge.py:119`: okuyor
- `tradehub_core/seo_helper/cms/publish.py:793`: okuyor
- `tradehub_core/seo_helper/crawler/manager.py:62`: okuyor
- `tradehub_core/seo_helper/setup/install.py:249`: okuyor
- `tradehub_core/seo_helper/setup/install.py:253`: okuyor
- `tradehub_core/seo_helper/setup/install.py:256`: adını kullanıyor
- `tradehub_core/seo_core/doctype/seo_entity/seo_entity.json:57`: alt tablo ya da Link tanımı
- `tradehub_core/seo_core/doctype/seo_page/seo_page.json:84`: alt tablo ya da Link tanımı
- `tradehub_core/seo_core/doctype/seo_redirect_rule/seo_redirect_rule.json:52`: alt tablo ya da Link tanımı
- `tradehub_core/seo_core/doctype/seo_route/seo_route.json:31`: alt tablo ya da Link tanımı

### hooks.py kayıtları

- `hooks.py` içinde bu DocType için kayıt yok.

## Bağımlılık sorunları

1. Birincil alan adı sorgusu dört yerde tekrar ediyor. Kanıt: `seo_helper/catalog/mirror.py:36`, `seo_helper/cms/bridge.py:119`, `seo_helper/cms/publish.py:793`, `seo_helper/setup/install.py:249`.

## Hedef tasarım

- Sahip bağlam ve paket yolu: `tradehub_core/seo/` paketi. Bugünkü `seo_helper/` kodu bu paketin içine taşınır. Mevcut `SEO Core`, `SEO Crawler`, `SEO Catalog`, `SEO Merchant` ve `SEO MCP` modülleri 10 bağlamının alt modülleri olarak kalır.
- Dışarıya açılan fonksiyonlar: `seo/api.py` içinde `get_primary_domain()`.
- Yayınladığı olaylar: Yok.
- Dinlediği olaylar: Yok.
- Başka bağlamlara bağlantılar: Başka bağlama bağlantı yok.
- Denetleyicide kalacak doğrulamalar: Ayrı doğrulama gerekmiyor.
- Servise taşınacak iş kuralları: İş kuralları zaten servis kodunda. Yalnız paket yolu değişir.

## Geçiş adımları

1. `get_primary_domain()` fonksiyonunu açın.
2. Dört sorguyu bu fonksiyona çevirin.

## Riskler ve testler

- Taşıma sırasında içe aktarma yolu kırılabilir. Test: ilgili servis testi yeni yoldan geçmeli.
