# SEO Facet Landing Page

- Bağlam: 10-seo
- Tür: Ana kayıt
- Klasör: `tradehub_core/seo_catalog/doctype/seo_facet_landing_page`
- Denetleyici: `tradehub_core/seo_catalog/doctype/seo_facet_landing_page/seo_facet_landing_page.py` (8 satır)
- Önerilen sahip bağlam: 10-seo

## Epic

- Epic adı: SEO Facet Landing Page: 10-seo bağlamına taşıma
- Öncelik: Önemli
- Faz: Faz 4
- Tahmini büyüklük: Küçük

### User story

Bir alıcı olarak, silinen kategori için boş açılış sayfası görmek istemiyorum.
Böylece aramadan gelen ziyaret boşa gitmez.

### Kabul kriterleri

- [ ] `category.deleted` olayı gelince açılış sayfası kaldırılıyor.
- [ ] `services/category_delete.py:40` listesi bir kayıt noktasından okunuyor.
- [ ] `list_facet_pages(category)` fonksiyonu `seo/api.py` içinde var.
- [ ] Characterization test: `SEO Facet Landing Page` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- Kategori silme kodundan bu kayda doğrudan yazmayın. Temizlik olay abonesiyle yapılmalı.
- `facet_key` alanını kayıttan sonra değiştirmeyin. Kayıt adı bu alandan gelir.
- CMS içeriğindeki `auto_rule` bağını kontrol etmeden kaydı silmeyin.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] Değişen davranış için önce başarısız olan bir test yazıldı.
- [ ] Ruff ve uygulama testleri yerelde geçiyor.
- [ ] `import-linter` kontrolü `tradehub_core.seo` için geçiyor.
- [ ] `CODEOWNERS` içindeki SEO bağlamı sahibinden inceleme istendi.
- [ ] Abone aynı olayı iki kez alınca ikinci işlem hiçbir şey değiştirmiyor.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?

Bu kayıt filtreli kategori açılış sayfasını tanımlar. Örnek: bir kategorideki belirli bir marka. Kayıt bir kategoriye ve bir SEO sayfasına bağlıdır.

## Bugünkü bağımlılıklar

### Bu kaydın bağlandığı kayıtlar

- `Product Category` (`category`, Link): başka bağlam (03a-katalog)
- `SEO Page` (`page`, Link): aynı bağlam

### Bu kayda dokunan kod

- `tradehub_core/seo_helper/setup/ornek_sayfalar.py:483`: okuyor
- `tradehub_core/seo_helper/setup/ornek_sayfalar.py:720`: okuyor
- `tradehub_core/seo_helper/setup/ornek_sayfalar.py:487`: adını kullanıyor
- `tradehub_core/services/category_delete.py:40`: adını kullanıyor
- `tradehub_core/seo_cms/doctype/cms_content/cms_content.json:386`: alt tablo ya da Link tanımı

### hooks.py kayıtları

- `hooks.py` içinde bu DocType için kayıt yok.

## Bağımlılık sorunları

1. Kategori silme kodu bu DocType adını biliyor. Kanıt: `services/category_delete.py:40`. Bu bağ 03a bağlamını 10 bağlamına bağlıyor.
2. CMS içeriği bu kayda Link ile bağlı. Kanıt: `cms_content.json` içindeki `auto_rule` alanı.

## Hedef tasarım

- Sahip bağlam ve paket yolu: `tradehub_core/seo/` paketi. Bugünkü `seo_helper/` kodu bu paketin içine taşınır. Mevcut `SEO Core`, `SEO Crawler`, `SEO Catalog`, `SEO Merchant` ve `SEO MCP` modülleri 10 bağlamının alt modülleri olarak kalır.
- Dışarıya açılan fonksiyonlar: `seo/api.py` içinde `list_facet_pages(category)`.
- Yayınladığı olaylar: Yok.
- Dinlediği olaylar: 03a bağlamının `category.deleted` olayı.
- Başka bağlamlara bağlantılar: `category` Link alanı `Product Category` kök kaydına bağlı kalır.
- Denetleyicide kalacak doğrulamalar: Ayrı doğrulama gerekmiyor.
- Servise taşınacak iş kuralları: İş kuralları zaten servis kodunda. Yalnız paket yolu değişir.

## Geçiş adımları

1. `category.deleted` aboneliği ekleyin.
2. `category_delete.py:40` listesini bir kayıt noktasından okuyun.

## Riskler ve testler

- Silinen kategori için açılış sayfası kalabilir. Test: kategori silinince sayfa kaldırılmalı.
