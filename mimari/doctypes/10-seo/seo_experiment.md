# SEO Experiment

- Bağlam: 10-seo
- Tür: Ana kayıt
- Klasör: `tradehub_core/seo_core/doctype/seo_experiment`
- Denetleyici: `tradehub_core/seo_core/doctype/seo_experiment/seo_experiment.py` (8 satır)
- Önerilen sahip bağlam: 10-seo

## Epic

- Epic adı: SEO Experiment: 10-seo bağlamına taşıma
- Öncelik: Acil
- Faz: Faz 4
- Tahmini büyüklük: Orta

### User story

Bir geliştirici olarak, sipariş oluşturulurken SEO deney kodunun siparişi durdurmamasını istiyorum.
Böylece SEO hatası satış kaybına yol açmaz.

### Kabul kriterleri

- [ ] `hooks.py:1408` döngüsü kaldırıldı. Atıf `order.created` olayıyla yapılıyor.
- [ ] Atıf işleyicisi hata verince sipariş yine oluşuyor.
- [ ] Deney kodu `seo/experiments/` altında duruyor.
- [ ] Characterization test: `SEO Experiment` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- `Order`, `RFQ` ya da `Seller Inquiry` kancalarına yeni SEO işleyicisi eklemeyin. Olaya abone olun.
- Atıf işleyicisinde sipariş kaydına yazmayın. Sipariş kaydını yalnız sipariş bağlamı değiştirir.
- Deney anahtarını kayıttan sonra değiştirmeyin. Kayıt adı bu alandan gelir.
- `hooks.py` içine doğrudan yeni `doc_events` kaydı eklenmedi.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] Değişen davranış için önce başarısız olan bir test yazıldı.
- [ ] Ruff ve uygulama testleri yerelde geçiyor.
- [ ] `import-linter` kontrolü `tradehub_core.seo` için geçiyor.
- [ ] `CODEOWNERS` içindeki SEO bağlamı sahibinden inceleme istendi.
- [ ] Yeni olay için sözleşme testi eklendi. Test olay alanlarını kontrol ediyor.
- [ ] Abone aynı olayı iki kez alınca ikinci işlem hiçbir şey değiştirmiyor.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?

Bu kayıt bir SEO deneyini tanımlar. Deney bir değişikliğin trafiğe etkisini ölçer. Deney, değişiklik defteriyle birlikte çalışır.

## Bugünkü bağımlılıklar

### Bu kaydın bağlandığı kayıtlar

- Bu kaydın başka kayda bağlantısı yok.

### Bu kayda dokunan kod

- `tradehub_core/seo_helper/api/panel662.py:736`: okuyor
- `tradehub_core/seo_helper/experiments/experiments.py:116`: okuyor
- `tradehub_core/seo_helper/experiments/experiments.py:184`: adını kullanıyor
- `tradehub_core/seo_helper/experiments/experiments.py:53`: adını kullanıyor
- `tradehub_core/seo_core/doctype/seo_change_log/seo_change_log.json:88`: alt tablo ya da Link tanımı

### hooks.py kayıtları

- `tradehub_core/hooks.py:1408`: `RFQ`, `Seller Inquiry` ve `Order` `after_insert` kaydı `experiments.attribution.on_conversion_insert` fonksiyonunu çağırıyor.

## Bağımlılık sorunları

1. Deney atıf kancası sipariş, RFQ ve satıcı sorusu kayıtlarına bağlı. Kanıt: `hooks.py:1408` ve `hooks.py:1409`. SEO kodu hata verirse sipariş oluşturma düşebilir.

## Hedef tasarım

- Sahip bağlam ve paket yolu: `tradehub_core/seo/` paketi. Bugünkü `seo_helper/` kodu bu paketin içine taşınır. Mevcut `SEO Core`, `SEO Crawler`, `SEO Catalog`, `SEO Merchant` ve `SEO MCP` modülleri 10 bağlamının alt modülleri olarak kalır.
- Dışarıya açılan fonksiyonlar: `seo/api.py` içinde ayrı fonksiyon gerekmez.
- Yayınladığı olaylar: Yok.
- Dinlediği olaylar: 04 bağlamının `order.created` olayı ve RFQ bağlamının `rfq.created` olayı.
- Başka bağlamlara bağlantılar: Başka bağlama bağlantı yok.
- Denetleyicide kalacak doğrulamalar: Ayrı doğrulama gerekmiyor.
- Servise taşınacak iş kuralları: İş kuralları zaten servis kodunda. Yalnız paket yolu değişir.

## Geçiş adımları

1. Atıf işleyicisini `order.created` olayına abone yapın.
2. Abone çalışınca `hooks.py:1408` döngüsünü kaldırın.

## Riskler ve testler

- Sipariş akışı SEO hatasıyla düşebilir. Test: atıf işleyicisi hata verince sipariş yine oluşmalı.
