# SEO Policy

- Bağlam: 10-seo
- Tür: Ana kayıt
- Klasör: `tradehub_core/seo_core/doctype/seo_policy`
- Denetleyici: `tradehub_core/seo_core/doctype/seo_policy/seo_policy.py` (8 satır)
- Önerilen sahip bağlam: 10-seo

## Epic

- Epic adı: SEO Policy: 10-seo bağlamına taşıma
- Öncelik: Düşük
- Faz: Faz 4
- Tahmini büyüklük: Küçük

### User story

Bir platform yöneticisi olarak, SEO politikasını değiştirince site haritasının yenilenmesini istiyorum.
Böylece arama motoru güncel kuralı görür.

### Kabul kriterleri

- [ ] Politika değişince `seo.policy_changed` olayı yazılıyor.
- [ ] Politika önbelleği değişiklikten sonra temizleniyor.
- [ ] `default` politikası kurulumda oluşuyor.
- [ ] Characterization test: `SEO Policy` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- `default` politikasını silmeyin. Karar motoru bu kayda dayanır.
- Politika kancasını SEO dışındaki bir pakete taşımayın.
- `policy_key` alanını kayıttan sonra değiştirmeyin.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] Değişen davranış için önce başarısız olan bir test yazıldı.
- [ ] Ruff ve uygulama testleri yerelde geçiyor.
- [ ] `import-linter` kontrolü `tradehub_core.seo` için geçiyor.
- [ ] `CODEOWNERS` içindeki SEO bağlamı sahibinden inceleme istendi.
- [ ] Yeni olay için sözleşme testi eklendi. Test olay alanlarını kontrol ediyor.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?

Bu kayıt SEO karar motorunun politikasıdır. Politika robots ve dizinleme varsayılanlarını tutar. Kurulum `default` adlı politikayı oluşturur.

## Bugünkü bağımlılıklar

### Bu kaydın bağlandığı kayıtlar

- Bu kaydın başka kayda bağlantısı yok.

### Bu kayda dokunan kod

- `tradehub_core/seo_helper/core/policy.py:186`: okuyor
- `tradehub_core/seo_helper/core/policy.py:278`: okuyor
- `tradehub_core/seo_helper/mcp/api.py:129`: okuyor
- `tradehub_core/seo_helper/setup/install.py:264`: okuyor
- `tradehub_core/seo_helper/core/catalog.py:198`: adını kullanıyor
- `tradehub_core/seo_helper/core/decision.py:319`: adını kullanıyor
- `tradehub_core/seo_helper/core/decision.py:325`: adını kullanıyor
- `tradehub_core/seo_helper/setup/install.py:267`: adını kullanıyor
- `tradehub_core/seo_core/doctype/seo_page/seo_page.json:151`: alt tablo ya da Link tanımı

### hooks.py kayıtları

- `tradehub_core/hooks.py:1410`: `_sh_doc_event("SEO Policy", "on_update", f"{_SH}.experiments.changelog.on_seo_policy_update")`
- `tradehub_core/hooks.py:1415`: `_sh_doc_event("SEO Policy", _ev, f"{_SH}.core.catalog.clear_policy_cache")`

## Bağımlılık sorunları

1. Politika değişince iki ayrı kanca çalışıyor. Kanıt: `hooks.py:1410` ve `hooks.py:1415`. Aynı bağlam içinde olduğu için kabul edilebilir.

## Hedef tasarım

- Sahip bağlam ve paket yolu: `tradehub_core/seo/` paketi. Bugünkü `seo_helper/` kodu bu paketin içine taşınır. Mevcut `SEO Core`, `SEO Crawler`, `SEO Catalog`, `SEO Merchant` ve `SEO MCP` modülleri 10 bağlamının alt modülleri olarak kalır.
- Dışarıya açılan fonksiyonlar: `seo/api.py` içinde `get_policy(name)`.
- Yayınladığı olaylar: `seo.policy_changed`. Olay şu alanları taşır: `policy_key`. Site haritası bu olayla yenilenir.
- Dinlediği olaylar: Yok.
- Başka bağlamlara bağlantılar: Başka bağlama bağlantı yok.
- Denetleyicide kalacak doğrulamalar: Ayrı doğrulama gerekmiyor.
- Servise taşınacak iş kuralları: İş kuralları zaten servis kodunda. Yalnız paket yolu değişir.

## Geçiş adımları

1. Kod `seo_helper/` altından `seo/` altına taşınırken bu DocType'ın kullanıcılarını aynı PR içinde güncelleyin.

## Riskler ve testler

- Taşıma sırasında içe aktarma yolu kırılabilir. Test: ilgili servis testi yeni yoldan geçmeli.
