# SEO Locale Cluster

- Bağlam: 10-seo
- Tür: Ana kayıt
- Klasör: `tradehub_core/seo_core/doctype/seo_locale_cluster`
- Denetleyici: `tradehub_core/seo_core/doctype/seo_locale_cluster/seo_locale_cluster.py` (8 satır)
- Önerilen sahip bağlam: 10-seo

## Epic

- Epic adı: SEO Locale Cluster: 10-seo bağlamına taşıma
- Öncelik: Düşük
- Faz: Faz 4
- Tahmini büyüklük: Küçük

### User story

Bir geliştirici olarak, başka DocType'lara eklenen SEO alanlarını bilmek istiyorum.
Böylece kendi DocType'ımda beklenmedik alan görmem.

### Kabul kriterleri

- [ ] `seo_helper/setup/install.py:46` ile eklenen özel alanların listesi belgelendi.
- [ ] Her özel alan için sahip bağlamın onayı kayıtlı.
- [ ] Hreflang kümesi olmayan sayfa hata vermiyor.
- [ ] Characterization test: `SEO Locale Cluster` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- Sahip bağlamın onayı olmadan başka DocType'a özel alan eklemeyin.
- `cluster_key` alanını kayıttan sonra değiştirmeyin. Kayıt adı bu alandan gelir.
- Özel alanı silmeden önce kullanan kodu aramadan geçmeyin.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] Değişen davranış için önce başarısız olan bir test yazıldı.
- [ ] Ruff ve uygulama testleri yerelde geçiyor.
- [ ] `import-linter` kontrolü `tradehub_core.seo` için geçiyor.
- [ ] `CODEOWNERS` içindeki SEO bağlamı sahibinden inceleme istendi.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?

Bu kayıt aynı sayfanın farklı dil sürümlerini gruplar. Bu gruplar hreflang etiketleri için kullanılır. Hreflang, arama motoruna dil sürümlerini söyleyen etikettir.

## Bugünkü bağımlılıklar

### Bu kaydın bağlandığı kayıtlar

- Bu kaydın başka kayda bağlantısı yok.

### Bu kayda dokunan kod

- `tradehub_core/seo_helper/setup/install.py:46`: adını kullanıyor
- `tradehub_core/seo_core/doctype/seo_page/seo_page.json:145`: alt tablo ya da Link tanımı

### hooks.py kayıtları

- `hooks.py` içinde bu DocType için kayıt yok.

## Bağımlılık sorunları

1. Kurulum kodu başka DocType'lara bu kayda bağlı özel alan ekliyor. Kanıt: `seo_helper/setup/install.py:46`. Bu alanlar başka bağlamların tablolarına giriyor.

## Hedef tasarım

- Sahip bağlam ve paket yolu: `tradehub_core/seo/` paketi. Bugünkü `seo_helper/` kodu bu paketin içine taşınır. Mevcut `SEO Core`, `SEO Crawler`, `SEO Catalog`, `SEO Merchant` ve `SEO MCP` modülleri 10 bağlamının alt modülleri olarak kalır.
- Dışarıya açılan fonksiyonlar: Ayrı fonksiyon gerekmez.
- Yayınladığı olaylar: Yok.
- Dinlediği olaylar: Yok.
- Başka bağlamlara bağlantılar: Başka bağlama bağlantı yok.
- Denetleyicide kalacak doğrulamalar: Ayrı doğrulama gerekmiyor.
- Servise taşınacak iş kuralları: İş kuralları zaten servis kodunda. Yalnız paket yolu değişir.

## Geçiş adımları

1. Özel alanların hangi DocType'lara eklendiğini belgeleyin.
2. Bu alanları sahip bağlamın onayıyla yönetin.

## Riskler ve testler

- Taşıma sırasında içe aktarma yolu kırılabilir. Test: ilgili servis testi yeni yoldan geçmeli.
