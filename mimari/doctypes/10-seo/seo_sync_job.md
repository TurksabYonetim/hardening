# SEO Sync Job

- Bağlam: 10-seo
- Tür: Kayıt defteri (log)
- Klasör: `tradehub_core/seo_core/doctype/seo_sync_job`
- Denetleyici: `tradehub_core/seo_core/doctype/seo_sync_job/seo_sync_job.py` (8 satır)
- Önerilen sahip bağlam: 10-seo

## Epic

- Epic adı: SEO Sync Job: 10-seo bağlamına taşıma
- Öncelik: Düşük
- Faz: Faz 4
- Tahmini büyüklük: Küçük

### User story

Bir geliştirici olarak, SEO iş kuyruğunun genel olay kuyruğundan ayrı rolünü bilmek istiyorum.
Böylece iki kuyruk aynı işi yapmaz.

### Kabul kriterleri

- [ ] Kuyruğun yalnız SEO iç işleri için kaldığı belgelendi.
- [ ] `enqueue_sync(kind, target)` fonksiyonu `seo/api.py` içinde var.
- [ ] Takılan işler izleme kodunda sayılıyor.
- [ ] Characterization test: `SEO Sync Job` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- Başka bağlamın tepkisini bu kuyrukla taşımayın. Bağlamlar arası tepki Outbox olayıyla yapılmalı.
- İş satırını `store` alanı olmadan yazmayın.
- Kuyruk adını sabit metinle çoğaltmayın. `resolve_queue` kullanın.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] Değişen davranış için önce başarısız olan bir test yazıldı.
- [ ] Ruff ve uygulama testleri yerelde geçiyor.
- [ ] `import-linter` kontrolü `tradehub_core.seo` için geçiyor.
- [ ] `CODEOWNERS` içindeki SEO bağlamı sahibinden inceleme istendi.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?

Bu kayıt SEO arka plan işini tutar. İş kuyruğa alınır, çalışır ve sonucu yazılır. İzleme kodu takılan işleri sayar.

## Bugünkü bağımlılıklar

### Bu kaydın bağlandığı kayıtlar

- `Admin Seller Profile` (`store`, Link): başka bağlam (02-satici-magaza)

### Bu kayda dokunan kod

- `tradehub_core/seo_helper/api/panel.py:445`: okuyor
- `tradehub_core/seo_helper/api/panel.py:471`: okuyor
- `tradehub_core/seo_helper/core/monitoring.py:14`: okuyor
- `tradehub_core/seo_helper/core/queue.py:105`: okuyor
- `tradehub_core/seo_helper/core/queue.py:107`: okuyor
- `tradehub_core/seo_helper/api/panel.py:426`: adını kullanıyor
- `tradehub_core/seo_helper/api/panel.py:449`: adını kullanıyor
- `tradehub_core/seo_helper/api/panel662.py:174`: adını kullanıyor
- `tradehub_core/seo_helper/core/monitoring.py:16`: adını kullanıyor
- `tradehub_core/seo_helper/core/queue.py:180`: adını kullanıyor
- `tradehub_core/seo_helper/core/queue.py:194`: adını kullanıyor

### hooks.py kayıtları

- `tradehub_core/hooks.py:1426`: mağaza kapsamlı izin döngüsü. `hooks.py:1437` `store_query_conditions` ve `hooks.py:1438` `store_has_permission` kaydını bağlar.

## Bağımlılık sorunları

1. Bu iş kuyruğu genel Outbox ile örtüşüyor. Outbox kurulunca iki kuyruk yan yana kalabilir.

## Hedef tasarım

- Sahip bağlam ve paket yolu: `tradehub_core/seo/` paketi. Bugünkü `seo_helper/` kodu bu paketin içine taşınır. Mevcut `SEO Core`, `SEO Crawler`, `SEO Catalog`, `SEO Merchant` ve `SEO MCP` modülleri 10 bağlamının alt modülleri olarak kalır.
- Dışarıya açılan fonksiyonlar: `seo/api.py` içinde `enqueue_sync(kind, target)`.
- Yayınladığı olaylar: Yok.
- Dinlediği olaylar: Yok.
- Başka bağlamlara bağlantılar: `store` Link alanı kalır.
- Denetleyicide kalacak doğrulamalar: Ayrı doğrulama gerekmiyor.
- Servise taşınacak iş kuralları: İş kuralları zaten servis kodunda. Yalnız paket yolu değişir.

## Geçiş adımları

1. Ortak Outbox kurulunca bu kuyruğun yalnız SEO iç işleri için kaldığını belgeleyin.

## Riskler ve testler

- Taşıma sırasında içe aktarma yolu kırılabilir. Test: ilgili servis testi yeni yoldan geçmeli.
