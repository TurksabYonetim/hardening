# SEO Profile

- Bağlam: 10-seo
- Tür: Ana kayıt
- Klasör: `tradehub_core/seo_core/doctype/seo_profile`
- Denetleyici: `tradehub_core/seo_core/doctype/seo_profile/seo_profile.py` (8 satır)
- Önerilen sahip bağlam: 10-seo

## Epic

- Epic adı: SEO Profile: 10-seo bağlamına taşıma
- Öncelik: Düşük
- Faz: Faz 4
- Tahmini büyüklük: Küçük

### User story

Bir geliştirici olarak, SEO şablonlarının gerçekten uygulandığını bilmek istiyorum.
Böylece boş ayar tutmam.

### Kabul kriterleri

- [ ] Şablonun uygulandığı yer belgelendi ya da kullanılmadığı yazıldı.
- [ ] `get_profile(profile_key)` fonksiyonu `seo/api.py` içinde var.
- [ ] `CMS Content Type.default_profile` bağı geçerli kalıyor.
- [ ] Characterization test: `SEO Profile` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- Profili silmeden önce `CMS Content Type` ve `SEO Page` bağlarını kontrol edin.
- `profile_key` alanını kayıttan sonra değiştirmeyin.
- Şablon alanına HTML eklemeyin. Başlık etiketi bozulur.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] Değişen davranış için önce başarısız olan bir test yazıldı.
- [ ] Ruff ve uygulama testleri yerelde geçiyor.
- [ ] `import-linter` kontrolü `tradehub_core.seo` için geçiyor.
- [ ] `CODEOWNERS` içindeki SEO bağlamı sahibinden inceleme istendi.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?

Bu kayıt başlık ve açıklama şablonu tutar. Şablon dil ve şema türüne göre seçilir.

## Bugünkü bağımlılıklar

### Bu kaydın bağlandığı kayıtlar

- Bu kaydın başka kayda bağlantısı yok.

### Bu kayda dokunan kod

- `tradehub_core/seo_cms/doctype/cms_content_type/cms_content_type.json:72`: alt tablo ya da Link tanımı
- `tradehub_core/seo_core/doctype/seo_page/seo_page.json:157`: alt tablo ya da Link tanımı

### hooks.py kayıtları

- `hooks.py` içinde bu DocType için kayıt yok.

## Bağımlılık sorunları

1. Kodda bu DocType'ı adıyla okuyan yer bulunmadı. Yalnız Link alanlarından kullanılıyor. Kanıt: `SEO Page.profile` ve `CMS Content Type.default_profile`. Şablonun gerçekten uygulandığı doğrulanmadı.

## Hedef tasarım

- Sahip bağlam ve paket yolu: `tradehub_core/seo/` paketi. Bugünkü `seo_helper/` kodu bu paketin içine taşınır. Mevcut `SEO Core`, `SEO Crawler`, `SEO Catalog`, `SEO Merchant` ve `SEO MCP` modülleri 10 bağlamının alt modülleri olarak kalır.
- Dışarıya açılan fonksiyonlar: `seo/api.py` içinde `get_profile(profile_key)`.
- Yayınladığı olaylar: Yok.
- Dinlediği olaylar: Yok.
- Başka bağlamlara bağlantılar: 09 bağlamındaki `CMS Content Type` bu kayda Link ile bağlı. Bağ kalabilir.
- Denetleyicide kalacak doğrulamalar: Ayrı doğrulama gerekmiyor.
- Servise taşınacak iş kuralları: İş kuralları zaten servis kodunda. Yalnız paket yolu değişir.

## Geçiş adımları

1. Kod `seo_helper/` altından `seo/` altına taşınırken bu DocType'ın kullanıcılarını aynı PR içinde güncelleyin.

## Riskler ve testler

- Taşıma sırasında içe aktarma yolu kırılabilir. Test: ilgili servis testi yeni yoldan geçmeli.
