# SEO Connector Quota

- Bağlam: 10-seo
- Tür: Kayıt defteri (log)
- Klasör: `tradehub_core/seo_core/doctype/seo_connector_quota`
- Denetleyici: `tradehub_core/seo_core/doctype/seo_connector_quota/seo_connector_quota.py` (8 satır)
- Önerilen sahip bağlam: 10-seo

## Epic

- Epic adı: SEO Connector Quota: 10-seo bağlamına taşıma
- Öncelik: Düşük
- Faz: Faz 4
- Tahmini büyüklük: Küçük

### User story

Bir geliştirici olarak, `SEO Connector Quota` kaydının tek bir SEO paketinden yazılmasını istiyorum.
Böylece Search Console kotası doğru sayılır.

### Kabul kriterleri

- [ ] `SEO Connector Quota` kaydını yalnız `seo/connectors/search_console.py` yazıyor.
- [ ] `seo/connectors/search_console.py` dosyası `tradehub_core/seo/` altında duruyor.
- [ ] Eski kayıtların temizliği ya da tekilliği testle kontrol ediliyor.
- [ ] Characterization test: `SEO Connector Quota` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- `SEO Connector Quota` kaydını SEO dışındaki koddan yazmayın. Bu kayıt SEO bağlamının defteridir.
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

Bu kayıt Google Search Console bağlantısının günlük kota kullanımını tutar. Her gün ve kaynak için bir satır vardır.

## Bugünkü bağımlılıklar

### Bu kaydın bağlandığı kayıtlar

- Bu kaydın başka kayda bağlantısı yok.

### Bu kayda dokunan kod

- `tradehub_core/seo_helper/connectors/search_console.py:317`: okuyor
- `tradehub_core/seo_helper/connectors/search_console.py:334`: okuyor
- `tradehub_core/seo_helper/connectors/search_console.py:299`: adını kullanıyor
- `tradehub_core/seo_helper/connectors/search_console.py:322`: adını kullanıyor

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
