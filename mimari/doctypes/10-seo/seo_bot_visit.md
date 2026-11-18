# SEO Bot Visit

- Bağlam: 10-seo
- Tür: Kayıt defteri (log)
- Klasör: `tradehub_core/seo_crawler/doctype/seo_bot_visit`
- Denetleyici: `tradehub_core/seo_crawler/doctype/seo_bot_visit/seo_bot_visit.py` (8 satır)
- Önerilen sahip bağlam: 10-seo

## Epic

- Epic adı: SEO Bot Visit: 10-seo bağlamına taşıma
- Öncelik: Düşük
- Faz: Faz 4
- Tahmini büyüklük: Küçük

### User story

Bir geliştirici olarak, `SEO Bot Visit` kaydının tek bir SEO paketinden yazılmasını istiyorum.
Böylece bot ziyaret sayıları tek yerden gelir.

### Kabul kriterleri

- [ ] `SEO Bot Visit` kaydını yalnız `seo/crawler/botlog.py` yazıyor.
- [ ] `seo/crawler/botlog.py` dosyası `tradehub_core/seo/` altında duruyor.
- [ ] Eski kayıtların temizliği ya da tekilliği testle kontrol ediliyor.
- [ ] Characterization test: `SEO Bot Visit` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- `SEO Bot Visit` kaydını SEO dışındaki koddan yazmayın. Bu kayıt SEO bağlamının defteridir.
- Tekillik anahtarı (`dedupe_key`) olan tabloda anahtarı atlayan yazım yapmayın. Çift satır oluşur.
- Yeni kodu `seo_helper/` altına eklemeyin. Hedef paket `seo/` paketidir.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] Değişen davranış için önce başarısız olan bir test yazıldı.
- [ ] Ruff ve uygulama testleri yerelde geçiyor.
- [ ] `import-linter` kontrolü `tradehub_core.seo` için geçiyor.
- [ ] `CODEOWNERS` içindeki SEO bağlamı sahibinden inceleme istendi.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?

Bu kayıt arama motoru botlarının günlük ziyaretlerini tutar. Veri sunucu günlüklerinden içe aktarılır. Eski satırlar zamanlanmış görevle silinir.

## Bugünkü bağımlılıklar

### Bu kaydın bağlandığı kayıtlar

- Bu kaydın başka kayda bağlantısı yok.

### Bu kayda dokunan kod

- `tradehub_core/seo_helper/crawler/botlog.py:252`: yazıyor
- `tradehub_core/seo_helper/crawler/botlog.py:254`: yazıyor
- `tradehub_core/seo_helper/board.py:374`: okuyor
- `tradehub_core/seo_helper/board.py:383`: okuyor
- `tradehub_core/seo_helper/crawler/botlog.py:249`: okuyor
- `tradehub_core/seo_helper/api/panel662.py:335`: adını kullanıyor
- `tradehub_core/seo_helper/crawler/botlog.py:286`: adını kullanıyor
- `tradehub_core/seo_helper/crawler/botlog.py:334`: adını kullanıyor

### hooks.py kayıtları

- `hooks.py` içinde bu DocType için kayıt yok.

## Bağımlılık sorunları

Önemli bir bağımlılık sorunu bulunmadı.

## Hedef tasarım

- Sahip bağlam ve paket yolu: `tradehub_core/seo/` paketi. Bugünkü `seo_helper/` kodu bu paketin içine taşınır. Mevcut `SEO Core`, `SEO Crawler`, `SEO Catalog`, `SEO Merchant` ve `SEO MCP` modülleri 10 bağlamının alt modülleri olarak kalır.
- Dışarıya açılan fonksiyonlar: Ayrı fonksiyon gerekmez.
- Yayınladığı olaylar: Yok.
- Dinlediği olaylar: Yok.
- Başka bağlamlara bağlantılar: Başka bağlama bağlantı yok.
- Denetleyicide kalacak doğrulamalar: Ayrı doğrulama gerekmiyor.
- Servise taşınacak iş kuralları: İş kuralları zaten servis kodunda. Yalnız paket yolu değişir.

## Geçiş adımları

1. Kod `seo_helper/` altından `seo/` altına taşınırken bu DocType'ın kullanıcılarını aynı PR içinde güncelleyin.

## Riskler ve testler

- Taşıma sırasında içe aktarma yolu kırılabilir. Test: ilgili servis testi yeni yoldan geçmeli.
