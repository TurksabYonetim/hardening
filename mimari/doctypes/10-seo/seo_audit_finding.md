# SEO Audit Finding

- Bağlam: 10-seo
- Tür: Ana kayıt
- Klasör: `tradehub_core/seo_core/doctype/seo_audit_finding`
- Denetleyici: `tradehub_core/seo_core/doctype/seo_audit_finding/seo_audit_finding.py` (8 satır)
- Önerilen sahip bağlam: 10-seo

## Epic

- Epic adı: SEO Audit Finding: 10-seo bağlamına taşıma
- Öncelik: Önemli
- Faz: Faz 4
- Tahmini büyüklük: Küçük

### User story

Bir satıcı olarak, mağazamın SEO sorunlarını güncel görmek istiyorum.
Böylece düzelttiğim sorun listede kalmaz.

### Kabul kriterleri

- [ ] Bulguları yalnız `seo/audit/reporter.py` ve `seo/core/policy.py` yazıyor.
- [ ] `seller.deleted` olayı gelince mağazanın bulguları kapanıyor.
- [ ] Satıcı başka mağazanın bulgusunu göremiyor.
- [ ] Characterization test: `SEO Audit Finding` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- Bulguyu SEO dışındaki koddan silmeyin. Pano sayıları bozulur.
- `store` ve `owner_store` alanlarını boş bırakan bulgu yazmayın. Mağaza izni çalışmaz.
- Etkin bulgu anahtarını atlayan yazım yapmayın. Aynı bulgu iki kez açılır.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] Değişen davranış için önce başarısız olan bir test yazıldı.
- [ ] Ruff ve uygulama testleri yerelde geçiyor.
- [ ] `import-linter` kontrolü `tradehub_core.seo` için geçiyor.
- [ ] `CODEOWNERS` içindeki SEO bağlamı sahibinden inceleme istendi.
- [ ] Abone aynı olayı iki kez alınca ikinci işlem hiçbir şey değiştirmiyor.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?

Bu kayıt SEO denetiminin bulduğu bir sorunu tutar. Örnek sorunlar eksik başlık ve kırık bağlantıdır. Bulgu bir tarama koşusuna ve bir SEO sayfasına bağlıdır.

## Bugünkü bağımlılıklar

### Bu kaydın bağlandığı kayıtlar

- `SEO Crawl Run` (`crawl_run`, Link): aynı bağlam
- `SEO Page` (`page`, Link): aynı bağlam
- `Admin Seller Profile` (`store`, Link): başka bağlam (02-satici-magaza)
- `Admin Seller Profile` (`owner_store`, Link): başka bağlam (02-satici-magaza)
- `SEO Crawl Run` (`recrawl_run`, Link): aynı bağlam

### Bu kayda dokunan kod

- `tradehub_core/seo_helper/audit/reporter.py:267`: yazıyor
- `tradehub_core/seo_helper/audit/schema_f44.py:1046`: yazıyor
- `tradehub_core/seo_helper/core/policy.py:294`: yazıyor
- `tradehub_core/seo_helper/api/panel662.py:463`: okuyor
- `tradehub_core/seo_helper/api/panel662.py:474`: okuyor
- `tradehub_core/seo_helper/audit/reporter.py:338`: okuyor
- `tradehub_core/seo_helper/audit/reporter.py:353`: okuyor
- `tradehub_core/seo_helper/board.py:331`: okuyor
- `tradehub_core/seo_helper/core/monitoring.py:27`: okuyor
- `tradehub_core/seo_helper/api/panel.py:360`: adını kullanıyor
- `tradehub_core/seo_helper/api/panel662.py:233`: adını kullanıyor
- `tradehub_core/seo_helper/audit/reporter.py:240`: adını kullanıyor
- Toplam 9 kaynak dosya bu adı kullanıyor. Yukarıda en önemlileri var.
- 1 patch ya da tohum dosyası bu adı kullanıyor. Örnek: `tradehub_core/seo_helper/patches/v0_2/audit_finding_active_key.py`.

### hooks.py kayıtları

- `tradehub_core/hooks.py:1427`: mağaza kapsamlı izin döngüsü. `hooks.py:1437` `store_query_conditions` ve `hooks.py:1438` `store_has_permission` kaydını bağlar.

## Bağımlılık sorunları

1. Politika kodu bulguları doğrudan siliyor. Kanıt: `seo_helper/core/policy.py:294`. Aynı bağlam içinde olduğu için kabul edilebilir.

## Hedef tasarım

- Sahip bağlam ve paket yolu: `tradehub_core/seo/` paketi. Bugünkü `seo_helper/` kodu bu paketin içine taşınır. Mevcut `SEO Core`, `SEO Crawler`, `SEO Catalog`, `SEO Merchant` ve `SEO MCP` modülleri 10 bağlamının alt modülleri olarak kalır.
- Dışarıya açılan fonksiyonlar: `seo/api.py` içinde `count_open_findings(store)`.
- Yayınladığı olaylar: Yok.
- Dinlediği olaylar: 02 bağlamının `seller.deleted` olayı.
- Başka bağlamlara bağlantılar: `store` ve `owner_store` Link alanları `Admin Seller Profile` kök kaydına bağlı kalır.
- Denetleyicide kalacak doğrulamalar: Ayrı doğrulama gerekmiyor.
- Servise taşınacak iş kuralları: İş kuralları zaten servis kodunda. Yalnız paket yolu değişir.

## Geçiş adımları

1. Kod `seo_helper/` altından `seo/` altına taşınırken bu DocType'ın kullanıcılarını aynı PR içinde güncelleyin.

## Riskler ve testler

- Taşıma sırasında içe aktarma yolu kırılabilir. Test: ilgili servis testi yeni yoldan geçmeli.
