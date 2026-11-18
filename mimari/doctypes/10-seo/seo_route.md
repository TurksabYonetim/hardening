# SEO Route

- Bağlam: 10-seo
- Tür: Ana kayıt
- Klasör: `tradehub_core/seo_core/doctype/seo_route`
- Denetleyici: `tradehub_core/seo_core/doctype/seo_route/seo_route.py` (8 satır)
- Önerilen sahip bağlam: 10-seo

## Epic

- Epic adı: SEO Route: 10-seo bağlamına taşıma
- Öncelik: Düşük
- Faz: Faz 4
- Tahmini büyüklük: Küçük

### User story

Bir geliştirici olarak, rota tablosunun kullanılıp kullanılmadığını bilmek istiyorum.
Böylece rota bilgisi iki yerde tutulmaz.

### Kabul kriterleri

- [ ] Canlı veride satır sayısı ölçüldü.
- [ ] Tablo kullanılmıyorsa `SEO Page.route` ile birleştirme kararı yazıldı.
- [ ] `seo_helper/cms/bridge.py:201` güncellemesi bu karara göre düzenlendi.
- [ ] Characterization test: `SEO Route` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- Karar verilmeden bu tabloya yeni yazım kodu eklemeyin.
- Rota bilgisini `SEO Page` ve bu tablo arasında ikiye bölmeyin.
- Canlı veriyi ölçmeden tabloyu silmeyin.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] Değişen davranış için önce başarısız olan bir test yazıldı.
- [ ] Ruff ve uygulama testleri yerelde geçiyor.
- [ ] `import-linter` kontrolü `tradehub_core.seo` için geçiyor.
- [ ] `CODEOWNERS` içindeki SEO bağlamı sahibinden inceleme istendi.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?

Bu kayıt bir adresin hangi kayda gittiğini tutar. Kayıt yol, dil, hedef DocType ve durum alanları taşır.

## Bugünkü bağımlılıklar

### Bu kaydın bağlandığı kayıtlar

- `SEO Domain` (`domain`, Link): aynı bağlam
- `DocType` (`target_doctype`, Link): başka bağlam (Frappe çekirdeği)

### Bu kayda dokunan kod

- `tradehub_core/seo_helper/cms/bridge.py:201`: adını kullanıyor

### hooks.py kayıtları

- `hooks.py` içinde bu DocType için kayıt yok.

## Bağımlılık sorunları

1. Bu tabloya satır ekleyen kod bulunmadı. Yalnız bir güncelleme var. Kanıt: `seo_helper/cms/bridge.py:201`. Tablo yarım kalmış olabilir. Durum doğrulanmadı.

## Hedef tasarım

- Sahip bağlam ve paket yolu: `tradehub_core/seo/` paketi. Bugünkü `seo_helper/` kodu bu paketin içine taşınır. Mevcut `SEO Core`, `SEO Crawler`, `SEO Catalog`, `SEO Merchant` ve `SEO MCP` modülleri 10 bağlamının alt modülleri olarak kalır.
- Dışarıya açılan fonksiyonlar: `seo/api.py` içinde `get_route(path, lang)`.
- Yayınladığı olaylar: Yok.
- Dinlediği olaylar: Yok.
- Başka bağlamlara bağlantılar: Başka bağlama bağlantı yok.
- Denetleyicide kalacak doğrulamalar: Ayrı doğrulama gerekmiyor.
- Servise taşınacak iş kuralları: İş kuralları zaten servis kodunda. Yalnız paket yolu değişir.

## Geçiş adımları

1. Canlı veride satır olup olmadığını kontrol edin.
2. Tablo kullanılmıyorsa `SEO Page.route` alanıyla birleştirmeyi değerlendirin.

## Riskler ve testler

- Taşıma sırasında içe aktarma yolu kırılabilir. Test: ilgili servis testi yeni yoldan geçmeli.
