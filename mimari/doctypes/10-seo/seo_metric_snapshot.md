# SEO Metric Snapshot

- Bağlam: 10-seo
- Tür: Kayıt defteri (log)
- Klasör: `tradehub_core/seo_core/doctype/seo_metric_snapshot`
- Denetleyici: `tradehub_core/seo_core/doctype/seo_metric_snapshot/seo_metric_snapshot.py` (8 satır)
- Önerilen sahip bağlam: 10-seo

## Epic

- Epic adı: SEO Metric Snapshot: 10-seo bağlamına taşıma
- Öncelik: Düşük
- Faz: Faz 4
- Tahmini büyüklük: Küçük

### User story

Bir platform yöneticisi olarak, SEO grafiklerinin doğru günlük veriyle çizilmesini istiyorum.
Böylece trendi doğru okurum.

### Kabul kriterleri

- [ ] `get_metric_series(metric, days)` fonksiyonu `seo/api.py` içinde var.
- [ ] Aynı gün ve ölçüm için ikinci satır açılmıyor.
- [ ] Pano kodu `seo/` altında duruyor.
- [ ] Characterization test: `SEO Metric Snapshot` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- `dedupe_key` alanını atlayan yazım yapmayın. Çift satır grafiği bozar.
- Ölçüm satırını elle düzenlemeyin.
- Pano dışından bu tabloya yazmayın.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] Değişen davranış için önce başarısız olan bir test yazıldı.
- [ ] Ruff ve uygulama testleri yerelde geçiyor.
- [ ] `import-linter` kontrolü `tradehub_core.seo` için geçiyor.
- [ ] `CODEOWNERS` içindeki SEO bağlamı sahibinden inceleme istendi.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?

Bu kayıt günlük SEO ölçümlerini tutar. Pano grafikleri bu satırlardan çizilir. Her gün ve ölçüm için tek satır vardır.

## Bugünkü bağımlılıklar

### Bu kaydın bağlandığı kayıtlar

- Bu kaydın başka kayda bağlantısı yok.

### Bu kayda dokunan kod

- `tradehub_core/seo_helper/board.py:107`: yazıyor
- `tradehub_core/seo_helper/board.py:109`: yazıyor
- `tradehub_core/seo_helper/board.py:50`: okuyor
- `tradehub_core/seo_helper/board.py:95`: okuyor
- `tradehub_core/seo_helper/board.py:130`: adını kullanıyor
- `tradehub_core/seo_helper/board.py:171`: adını kullanıyor

### hooks.py kayıtları

- `hooks.py` içinde bu DocType için kayıt yok.

## Bağımlılık sorunları

Önemli bir bağımlılık sorunu bulunmadı.

## Hedef tasarım

- Sahip bağlam ve paket yolu: `tradehub_core/seo/` paketi. Bugünkü `seo_helper/` kodu bu paketin içine taşınır. Mevcut `SEO Core`, `SEO Crawler`, `SEO Catalog`, `SEO Merchant` ve `SEO MCP` modülleri 10 bağlamının alt modülleri olarak kalır.
- Dışarıya açılan fonksiyonlar: `seo/api.py` içinde `get_metric_series(metric, days)`.
- Yayınladığı olaylar: Yok.
- Dinlediği olaylar: Yok.
- Başka bağlamlara bağlantılar: Başka bağlama bağlantı yok.
- Denetleyicide kalacak doğrulamalar: Ayrı doğrulama gerekmiyor.
- Servise taşınacak iş kuralları: İş kuralları zaten servis kodunda. Yalnız paket yolu değişir.

## Geçiş adımları

1. Kod `seo_helper/` altından `seo/` altına taşınırken bu DocType'ın kullanıcılarını aynı PR içinde güncelleyin.

## Riskler ve testler

- Taşıma sırasında içe aktarma yolu kırılabilir. Test: ilgili servis testi yeni yoldan geçmeli.
