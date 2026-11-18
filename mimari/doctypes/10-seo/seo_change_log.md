# SEO Change Log

- Bağlam: 10-seo
- Tür: Kayıt defteri (log)
- Klasör: `tradehub_core/seo_core/doctype/seo_change_log`
- Denetleyici: `tradehub_core/seo_core/doctype/seo_change_log/seo_change_log.py` (8 satır)
- Önerilen sahip bağlam: 10-seo

## Epic

- Epic adı: SEO Change Log: 10-seo bağlamına taşıma
- Öncelik: Düşük
- Faz: Faz 4
- Tahmini büyüklük: Küçük

### User story

Bir geliştirici olarak, `SEO Change Log` kaydının tek bir SEO paketinden yazılmasını istiyorum.
Böylece deney sonuçları doğru değişikliklerle karşılaştırılır.

### Kabul kriterleri

- [ ] `SEO Change Log` kaydını yalnız `seo/experiments/changelog.py` yazıyor.
- [ ] `seo/experiments/changelog.py` dosyası `tradehub_core/seo/` altında duruyor.
- [ ] Eski kayıtların temizliği ya da tekilliği testle kontrol ediliyor.
- [ ] `seo_helper/cms/publish.py:811` yazımı kaldırıldı. Satırı `content.published` abonesi yazıyor.
- [ ] Characterization test: `SEO Change Log` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- `SEO Change Log` kaydını SEO dışındaki koddan yazmayın. Bu kayıt SEO bağlamının defteridir.
- Tekillik anahtarı (`dedupe_key`) olan tabloda anahtarı atlayan yazım yapmayın. Çift satır oluşur.
- Yeni kodu `seo_helper/` altına eklemeyin. Hedef paket `seo/` paketidir.
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

Bu kayıt SEO ayarlarındaki değişiklikleri tutar. Deney sonuçları bu kayıtlarla karşılaştırılır. Kayıt mağazaya ve deneye bağlanabilir.

## Bugünkü bağımlılıklar

### Bu kaydın bağlandığı kayıtlar

- `Admin Seller Profile` (`store`, Link): başka bağlam (02-satici-magaza)
- `SEO Experiment` (`experiment`, Link): aynı bağlam

### Bu kayda dokunan kod

- `tradehub_core/seo_helper/cms/publish.py:811`: adını kullanıyor
- `tradehub_core/seo_helper/experiments/changelog.py:112`: adını kullanıyor
- `tradehub_core/seo_helper/experiments/changelog.py:28`: adını kullanıyor

### hooks.py kayıtları

- `hooks.py` içinde bu DocType için kayıt yok.

## Bağımlılık sorunları

1. İçerik yayın kodu bu tabloya doğrudan yazıyor. Kanıt: `seo_helper/cms/publish.py:811`. Bu kod 09 bağlamına ait.

## Hedef tasarım

- Sahip bağlam ve paket yolu: `tradehub_core/seo/` paketi. Bugünkü `seo_helper/` kodu bu paketin içine taşınır. Mevcut `SEO Core`, `SEO Crawler`, `SEO Catalog`, `SEO Merchant` ve `SEO MCP` modülleri 10 bağlamının alt modülleri olarak kalır.
- Dışarıya açılan fonksiyonlar: `seo/api.py` içinde `log_change(change_type, scope, route, description)`.
- Yayınladığı olaylar: Yok.
- Dinlediği olaylar: 09 bağlamının `content.published` olayı. Abone değişiklik satırı yazar.
- Başka bağlamlara bağlantılar: `store` Link alanı kalır.
- Denetleyicide kalacak doğrulamalar: Ayrı doğrulama gerekmiyor.
- Servise taşınacak iş kuralları: İş kuralları zaten servis kodunda. Yalnız paket yolu değişir.

## Geçiş adımları

1. `content.published` aboneliğini ekleyin.
2. Abone çalışınca `publish.py:811` yazımını kaldırın.

## Riskler ve testler

- Yayın değişikliği deftere düşmeyebilir. Test: yayın olayı sonrası tek satır yazılmalı.
