# SEO Redirect Rule

- Bağlam: 10-seo
- Tür: Ana kayıt
- Klasör: `tradehub_core/seo_core/doctype/seo_redirect_rule`
- Denetleyici: `tradehub_core/seo_core/doctype/seo_redirect_rule/seo_redirect_rule.py` (8 satır)
- Önerilen sahip bağlam: 10-seo

## Epic

- Epic adı: SEO Redirect Rule: 10-seo bağlamına taşıma
- Öncelik: Düşük
- Faz: Faz 4
- Tahmini büyüklük: Küçük

### User story

Bir geliştirici olarak, tek bir yönlendirme tablosu kullanmak istiyorum.
Böylece hangi tablonun geçerli olduğunu düşünmem.

### Kabul kriterleri

- [ ] Canlı veride satır sayısı ölçüldü.
- [ ] Değişiklik defteri kancası `SEO Redirect` kaydını izliyor.
- [ ] Tablo kaldırıldıysa `bench migrate` test sitesinde hatasız geçti.
- [ ] Characterization test: `SEO Redirect Rule` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- Bu tabloya yeni yazım kodu eklemeyin. Asıl tablo `SEO Redirect` tablosudur.
- Canlı veriyi ölçmeden tabloyu silmeyin.
- `mirrored_redirect` bağını kontrol etmeden satır silmeyin.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] Değişen davranış için önce başarısız olan bir test yazıldı.
- [ ] Ruff ve uygulama testleri yerelde geçiyor.
- [ ] `import-linter` kontrolü `tradehub_core.seo` için geçiyor.
- [ ] `CODEOWNERS` içindeki SEO bağlamı sahibinden inceleme istendi.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?

Bu kayıt alan adına göre yönlendirme kuralıdır. Kural `SEO Redirect` kaydına yansıtılabilir. Bu bağ `mirrored_redirect` alanında durur.

## Bugünkü bağımlılıklar

### Bu kaydın bağlandığı kayıtlar

- `SEO Domain` (`domain`, Link): aynı bağlam
- `SEO Redirect` (`mirrored_redirect`, Link): aynı bağlam

### Bu kayda dokunan kod

- DocType tanımı dışında bu adı kullanan kod bulunmadı.

### hooks.py kayıtları

- `tradehub_core/hooks.py:1411`: `_sh_doc_event("SEO Redirect Rule", "after_insert", f"{_SH}.experiments.changelog.on_redirect_change")`
- `tradehub_core/hooks.py:1412`: `_sh_doc_event("SEO Redirect Rule", "on_trash", f"{_SH}.experiments.changelog.on_redirect_change")`

## Bağımlılık sorunları

1. Bu tabloya yazan kod bulunmadı. Yalnız değişiklik defteri kancası var. Kanıt: `hooks.py:1411` ve `hooks.py:1412`.
2. Asıl kullanılan `SEO Redirect` tablosunun değişiklik defteri kancası yok. Defter yanlış tabloyu izliyor olabilir. Durum doğrulanmadı.

## Hedef tasarım

- Sahip bağlam ve paket yolu: `tradehub_core/seo/` paketi. Bugünkü `seo_helper/` kodu bu paketin içine taşınır. Mevcut `SEO Core`, `SEO Crawler`, `SEO Catalog`, `SEO Merchant` ve `SEO MCP` modülleri 10 bağlamının alt modülleri olarak kalır.
- Dışarıya açılan fonksiyonlar: Yok. `SEO Redirect` ile birleştirilmesi önerilir.
- Yayınladığı olaylar: Yok.
- Dinlediği olaylar: Yok.
- Başka bağlamlara bağlantılar: Başka bağlama bağlantı yok.
- Denetleyicide kalacak doğrulamalar: Ayrı doğrulama gerekmiyor.
- Servise taşınacak iş kuralları: İş kuralları zaten servis kodunda. Yalnız paket yolu değişir.

## Geçiş adımları

1. Canlı veride satır olup olmadığını kontrol edin.
2. Satır yoksa defter kancasını `SEO Redirect` kaydına taşıyın.
3. Bu DocType'ı kaldırmayı ayrı PR ile önerin.

## Riskler ve testler

- Yönlendirme değişiklikleri deneyde görünmeyebilir. Test: yeni yönlendirme sonrası defter satırı yazılmalı.
