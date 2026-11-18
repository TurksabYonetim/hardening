# SEO Helper Rule

- Bağlam: 10-seo
- Tür: Ana kayıt
- Klasör: `tradehub_core/seo_helper/doctype/seo_helper_rule`
- Denetleyici: `tradehub_core/seo_helper/doctype/seo_helper_rule/seo_helper_rule.py` (8 satır)
- Önerilen sahip bağlam: 10-seo

## Epic

- Epic adı: SEO Helper Rule: 10-seo bağlamına taşıma
- Öncelik: Düşük
- Faz: Faz 4
- Tahmini büyüklük: Küçük

### User story

Bir geliştirici olarak, kullanılmayan DocType'ları bilmek istiyorum.
Böylece boşuna bakım yapmam.

### Kabul kriterleri

- [ ] Canlı veride satır sayısı ölçüldü ve rapora yazıldı.
- [ ] Satır yoksa DocType'ı kaldıran ayrı bir PR açıldı.
- [ ] Kaldırma sonrası `bench migrate` test sitesinde hatasız geçti.
- [ ] Characterization test: `SEO Helper Rule` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- Canlı veriyi ölçmeden DocType'ı silmeyin. Belgelenmemiş bir kullanım bozulabilir.
- Bu DocType'a yeni kod bağlamayın. Önce kullanım kararı verilmeli.
- Kaldırmayı başka bir değişiklikle aynı PR içinde yapmayın.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] Değişen davranış için önce başarısız olan bir test yazıldı.
- [ ] Ruff ve uygulama testleri yerelde geçiyor.
- [ ] `import-linter` kontrolü `tradehub_core.seo` için geçiyor.
- [ ] `CODEOWNERS` içindeki SEO bağlamı sahibinden inceleme istendi.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?

Bu kayıt SEO kural motoru için kural tanımı tutar. Kural kapsam, koşul ve eylem alanları taşır.

## Bugünkü bağımlılıklar

### Bu kaydın bağlandığı kayıtlar

- Bu kaydın başka kayda bağlantısı yok.

### Bu kayda dokunan kod

- DocType tanımı dışında bu adı kullanan kod bulunmadı.

### hooks.py kayıtları

- `hooks.py` içinde bu DocType için kayıt yok.

## Bağımlılık sorunları

1. Kodda bu DocType'ı kullanan yer bulunmadı. Kanıt: DocType adıyla yapılan aramada yalnız kendi tanımı çıktı. Kullanılmayan bir kayıt olabilir. Durum doğrulanmadı.

## Hedef tasarım

- Sahip bağlam ve paket yolu: `tradehub_core/seo/` paketi. Bugünkü `seo_helper/` kodu bu paketin içine taşınır. Mevcut `SEO Core`, `SEO Crawler`, `SEO Catalog`, `SEO Merchant` ve `SEO MCP` modülleri 10 bağlamının alt modülleri olarak kalır.
- Dışarıya açılan fonksiyonlar: Yok.
- Yayınladığı olaylar: Yok.
- Dinlediği olaylar: Yok.
- Başka bağlamlara bağlantılar: Başka bağlama bağlantı yok.
- Denetleyicide kalacak doğrulamalar: Ayrı doğrulama gerekmiyor.
- Servise taşınacak iş kuralları: İş kuralları zaten servis kodunda. Yalnız paket yolu değişir.

## Geçiş adımları

1. Canlı veride satır olup olmadığını kontrol edin.
2. Satır yoksa DocType'ı kaldırmayı ayrı PR ile önerin.

## Riskler ve testler

- Kaldırma, belgelenmemiş bir kullanımı bozabilir. Test: canlı veride satır sayısı sıfır olmalı.
