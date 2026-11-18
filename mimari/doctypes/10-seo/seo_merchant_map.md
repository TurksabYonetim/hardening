# SEO Merchant Map

- Bağlam: 10-seo
- Tür: Ana kayıt
- Klasör: `tradehub_core/seo_merchant/doctype/seo_merchant_map`
- Denetleyici: `tradehub_core/seo_merchant/doctype/seo_merchant_map/seo_merchant_map.py` (8 satır)
- Önerilen sahip bağlam: 10-seo

## Epic

- Epic adı: SEO Merchant Map: 10-seo bağlamına taşıma
- Öncelik: Düşük
- Faz: Faz 4
- Tahmini büyüklük: Küçük

### User story

Bir satıcı olarak, Google Merchant eşlememin doğru durumunu görmek istiyorum.
Böylece ürün beslemem kopmaz.

### Kabul kriterleri

- [ ] Kaydı kimin yazdığı belgelendi. Elle giriliyorsa bu yazıldı.
- [ ] `seller.deleted` olayı gelince eşleme pasif oluyor.
- [ ] Pano yalnız etkin eşlemeleri sayıyor.
- [ ] Characterization test: `SEO Merchant Map` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- Besleme adresini doğrulamadan kaydetmeyin.
- Eşlemeyi `store` alanı olmadan kaydetmeyin.
- Bu tabloyu mağaza bağlamının kodundan yazmayın.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] Değişen davranış için önce başarısız olan bir test yazıldı.
- [ ] Ruff ve uygulama testleri yerelde geçiyor.
- [ ] `import-linter` kontrolü `tradehub_core.seo` için geçiyor.
- [ ] `CODEOWNERS` içindeki SEO bağlamı sahibinden inceleme istendi.
- [ ] Abone aynı olayı iki kez alınca ikinci işlem hiçbir şey değiştirmiyor.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?

Bu kayıt bir mağazanın Google Merchant hesabı eşlemesini tutar. Kayıt besleme adresini ve alan eşlemesini saklar.

## Bugünkü bağımlılıklar

### Bu kaydın bağlandığı kayıtlar

- `Admin Seller Profile` (`store`, Link): başka bağlam (02-satici-magaza)

### Bu kayda dokunan kod

- `tradehub_core/seo_helper/board.py:72`: okuyor
- `tradehub_core/seo_helper/board.py:76`: okuyor
- `tradehub_core/seo_helper/audit/reporter.py:151`: adını kullanıyor

### hooks.py kayıtları

- `hooks.py` içinde bu DocType için kayıt yok.

## Bağımlılık sorunları

1. Kodda bu tabloya yazan yer bulunmadı. Yalnız okuma var. Kanıt: `seo_helper/board.py:72` ve `seo_helper/audit/reporter.py:151`. Kayıtlar elle giriliyor olabilir. Durum doğrulanmadı.

## Hedef tasarım

- Sahip bağlam ve paket yolu: `tradehub_core/seo/` paketi. Bugünkü `seo_helper/` kodu bu paketin içine taşınır. Mevcut `SEO Core`, `SEO Crawler`, `SEO Catalog`, `SEO Merchant` ve `SEO MCP` modülleri 10 bağlamının alt modülleri olarak kalır.
- Dışarıya açılan fonksiyonlar: Ayrı fonksiyon gerekmez.
- Yayınladığı olaylar: Yok.
- Dinlediği olaylar: 02 bağlamının `seller.deleted` olayı.
- Başka bağlamlara bağlantılar: `store` Link alanı kalır.
- Denetleyicide kalacak doğrulamalar: Ayrı doğrulama gerekmiyor.
- Servise taşınacak iş kuralları: İş kuralları zaten servis kodunda. Yalnız paket yolu değişir.

## Geçiş adımları

1. Kod `seo_helper/` altından `seo/` altına taşınırken bu DocType'ın kullanıcılarını aynı PR içinde güncelleyin.

## Riskler ve testler

- Taşıma sırasında içe aktarma yolu kırılabilir. Test: ilgili servis testi yeni yoldan geçmeli.
