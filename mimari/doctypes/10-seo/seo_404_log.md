# SEO 404 Log

- Bağlam: 10-seo
- Tür: Kayıt defteri (log)
- Klasör: `tradehub_core/tradehub_core/doctype/seo_404_log`
- Denetleyici: `tradehub_core/tradehub_core/doctype/seo_404_log/seo_404_log.py` (7 satır)
- Önerilen sahip bağlam: 10-seo

## Epic

- Epic adı: SEO 404 Log: 10-seo bağlamına taşıma
- Öncelik: Düşük
- Faz: Faz 4
- Tahmini büyüklük: Küçük

### User story

Bir geliştirici olarak, `SEO 404 Log` kaydının tek bir SEO paketinden yazılmasını istiyorum.
Böylece bulunamayan adres kayıtları iki pakete bölünmez.

### Kabul kriterleri

- [ ] `SEO 404 Log` kaydını yalnız `seo/redirect_resolver.py` yazıyor.
- [ ] `seo/redirect_resolver.py` dosyası `tradehub_core/seo/` altında duruyor.
- [ ] Eski kayıtların temizliği ya da tekilliği testle kontrol ediliyor.
- [ ] Aynı adres ikinci kez gelince yeni satır açılmıyor. Sayaç artıyor.
- [ ] Characterization test: `SEO 404 Log` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- `SEO 404 Log` kaydını SEO dışındaki koddan yazmayın. Bu kayıt SEO bağlamının defteridir.
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

Bu kayıt sitede bulunamayan adres isteklerini tutar. Her adres için tek satır vardır. Satır istek sayısını ve son görülme zamanını saklar. Yönetici bu satırdan yönlendirme oluşturabilir.

## Bugünkü bağımlılıklar

### Bu kaydın bağlandığı kayıtlar

- Bu kaydın başka kayda bağlantısı yok.

### Bu kayda dokunan kod

- `tradehub_core/seo/redirect_resolver.py:188`: yazıyor
- `tradehub_core/api/seo_admin.py:339`: okuyor
- `tradehub_core/seo/redirect_resolver.py:174`: okuyor
- `tradehub_core/seo/redirect_resolver.py:177`: okuyor
- `tradehub_core/seo_helper/audit/signals.py:30`: okuyor
- `tradehub_core/api/seo_admin.py:324`: adını kullanıyor
- `tradehub_core/seo_helper/audit/signals.py:34`: adını kullanıyor

### hooks.py kayıtları

- `hooks.py` içinde bu DocType için kayıt yok.

## Bağımlılık sorunları

1. İki SEO paketi bu tabloyu kullanıyor. Kanıt: `seo/redirect_resolver.py:188` yazıyor. `seo_helper/audit/signals.py:34` okuyor. Paketler birleşmeden sahiplik belirsiz kalır.

## Hedef tasarım

- Sahip bağlam ve paket yolu: `tradehub_core/seo/` paketi. Bugünkü `seo_helper/` kodu bu paketin içine taşınır. Mevcut `SEO Core`, `SEO Crawler`, `SEO Catalog`, `SEO Merchant` ve `SEO MCP` modülleri 10 bağlamının alt modülleri olarak kalır. DocType `Tradehub Core` modülünden `SEO Core` modülüne taşınır.
- Dışarıya açılan fonksiyonlar: `seo/api.py` içinde `list_404s()` ve `resolve_404(log, target)`.
- Yayınladığı olaylar: Yok.
- Dinlediği olaylar: Yok.
- Başka bağlamlara bağlantılar: Başka bağlama bağlantı yok.
- Denetleyicide kalacak doğrulamalar: Ayrı doğrulama gerekmiyor.
- Servise taşınacak iş kuralları: İş kuralları zaten servis kodunda. Yalnız paket yolu değişir.

## Geçiş adımları

1. `seo/` ve `seo_helper/` paketlerini birleştirme planına bu DocType'ı ekleyin.
2. DocType'ı `SEO Core` modülüne taşıyın.

## Riskler ve testler

- Taşıma sırasında içe aktarma yolu kırılabilir. Test: ilgili servis testi yeni yoldan geçmeli.
