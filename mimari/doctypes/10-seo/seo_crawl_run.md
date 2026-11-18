# SEO Crawl Run

- Bağlam: 10-seo
- Tür: Ana kayıt
- Klasör: `tradehub_core/seo_crawler/doctype/seo_crawl_run`
- Denetleyici: `tradehub_core/seo_crawler/doctype/seo_crawl_run/seo_crawl_run.py` (8 satır)
- Önerilen sahip bağlam: 10-seo

## Epic

- Epic adı: SEO Crawl Run: 10-seo bağlamına taşıma
- Öncelik: Düşük
- Faz: Faz 4
- Tahmini büyüklük: Küçük

### User story

Bir platform yöneticisi olarak, site taramasını başlatıp durdurmak istiyorum.
Böylece sitedeki teknik sorunları görebilirim.

### Kabul kriterleri

- [ ] `start_crawl` ve `get_crawl_status` fonksiyonları `seo/api.py` içinde var.
- [ ] Durdurulan koşu imlecinden devam ediyor.
- [ ] Tarama kodu `seo/crawler/` altında duruyor.
- [ ] Characterization test: `SEO Crawl Run` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- Koşu durumunu `set_value` ile yönetici ekranından değiştirmeyin. Durum yalnız tarama yöneticisinde değişir.
- Tarama kapsamına site dışı adres eklemeyin. Bağlantı doğrulaması atlanmamalı.
- Eski koşuların sayfalarını koşu silinmeden silmeyin. Denetim bulguları yetim kalır.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] Değişen davranış için önce başarısız olan bir test yazıldı.
- [ ] Ruff ve uygulama testleri yerelde geçiyor.
- [ ] `import-linter` kontrolü `tradehub_core.seo` için geçiyor.
- [ ] `CODEOWNERS` içindeki SEO bağlamı sahibinden inceleme istendi.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?

Bu kayıt sitenin bir tarama koşusudur. Koşu kuyruğa alınır, durdurulur ve devam ettirilir. Kayıt imleci, kapsamı ve sonucu tutar.

## Bugünkü bağımlılıklar

### Bu kaydın bağlandığı kayıtlar

- `SEO Crawl Run` (`resumed_from`, Link): aynı bağlam

### Bu kayda dokunan kod

- `tradehub_core/seo_helper/api/panel662.py:497`: okuyor
- `tradehub_core/seo_helper/board.py:444`: okuyor
- `tradehub_core/seo_helper/board.py:57`: okuyor
- `tradehub_core/seo_helper/crawler/manager.py:223`: okuyor
- `tradehub_core/seo_helper/crawler/manager.py:238`: okuyor
- `tradehub_core/seo_helper/mcp/jobs.py:21`: okuyor
- `tradehub_core/seo_helper/api/panel.py:372`: adını kullanıyor
- `tradehub_core/seo_helper/api/panel.py:405`: adını kullanıyor
- `tradehub_core/seo_helper/api/panel662.py:131`: adını kullanıyor
- `tradehub_core/seo_helper/api/panel662.py:206`: adını kullanıyor
- `tradehub_core/seo_helper/audit/reporter.py:335`: adını kullanıyor
- `tradehub_core/seo_helper/board.py:146`: adını kullanıyor
- Toplam 9 kaynak dosya bu adı kullanıyor. Yukarıda en önemlileri var.

### hooks.py kayıtları

- `hooks.py` içinde bu DocType için kayıt yok.

## Bağımlılık sorunları

1. MCP kodu tarama koşusunu doğrudan okuyor. Kanıt: `seo_helper/mcp/api.py`. Aynı bağlam içinde olduğu için kabul edilebilir.

## Hedef tasarım

- Sahip bağlam ve paket yolu: `tradehub_core/seo/` paketi. Bugünkü `seo_helper/` kodu bu paketin içine taşınır. Mevcut `SEO Core`, `SEO Crawler`, `SEO Catalog`, `SEO Merchant` ve `SEO MCP` modülleri 10 bağlamının alt modülleri olarak kalır.
- Dışarıya açılan fonksiyonlar: `seo/api.py` içinde `start_crawl(scope)` ve `get_crawl_status(run)`.
- Yayınladığı olaylar: Yok.
- Dinlediği olaylar: Yok.
- Başka bağlamlara bağlantılar: Başka bağlama bağlantı yok.
- Denetleyicide kalacak doğrulamalar: Ayrı doğrulama gerekmiyor.
- Servise taşınacak iş kuralları: İş kuralları zaten servis kodunda. Yalnız paket yolu değişir.

## Geçiş adımları

1. Kod `seo_helper/` altından `seo/` altına taşınırken bu DocType'ın kullanıcılarını aynı PR içinde güncelleyin.

## Riskler ve testler

- Taşıma sırasında içe aktarma yolu kırılabilir. Test: ilgili servis testi yeni yoldan geçmeli.
