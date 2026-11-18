# CMS Content Category

- Bağlam: 09-icerik-vitrin
- Tür: Alt tablo
- Klasör: `tradehub_core/seo_cms/doctype/cms_content_category`
- Denetleyici: `tradehub_core/seo_cms/doctype/cms_content_category/cms_content_category.py` (8 satır)
- Önerilen sahip bağlam: 09-icerik-vitrin

## Epic

- Epic adı: CMS Content Category: 09-icerik-vitrin bağlamına taşıma
- Öncelik: Düşük
- Faz: Faz 5
- Tahmini büyüklük: Küçük

### User story

Bir geliştirici olarak, `CMS Content Category` tablosunun ebeveyni `CMS Content` ile aynı modülde durmasını istiyorum.
Böylece tabloyu kimin değiştireceği açık olur.

### Kabul kriterleri

- [ ] `CMS Content Category` ve `CMS Content` aynı Frappe modülünde duruyor.
- [ ] `CMS Content` kaydı açılınca `CMS Content Category` satırları eksiksiz görünüyor.
- [ ] `CMS Content Category` satırlarını yalnız `tradehub_core.content` paketi yazıyor.
- [ ] Characterization test: `CMS Content Category` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- `CMS Content Category` modülünü ebeveynden ayrı bir PR ile taşımayın. Alt tablo bağı kopar.
- Başka bağlamın kodundan `CMS Content Category` satırı eklemeyin ya da silmeyin. Bu tabloyu yalnız `CMS Content` sahibi değiştirir.
- Alan adlarını taşıma PR'ı içinde değiştirmeyin. Taşıma ile alan değişikliği ayrı PR olmalı.
- Kategori silme kodundan bu tabloya doğrudan yazmayın. Temizlik `category.deleted` olayıyla yapılmalı.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] Değişen davranış için önce başarısız olan bir test yazıldı.
- [ ] Ruff ve uygulama testleri yerelde geçiyor.
- [ ] `import-linter` kontrolü `tradehub_core.content` için geçiyor.
- [ ] `CODEOWNERS` içindeki içerik bağlamı sahibinden inceleme istendi.
- [ ] DocType modülü taşınırsa patch iki kez çalışınca hata vermiyor.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?

Bu alt tablo içeriğin ilgili ürün kategorilerini listeler. Her satır bir `Product Category` bağıdır.

## Bugünkü bağımlılıklar

### Bu kaydın bağlandığı kayıtlar

- `Product Category` (`category`, Link): başka bağlam (03a-katalog)

### Bu kayda dokunan kod

- `tradehub_core/seo_cms/doctype/cms_content/cms_content.json:231`: alt tablo ya da Link tanımı

### hooks.py kayıtları

- `hooks.py` içinde bu DocType için kayıt yok.

## Bağımlılık sorunları

1. Kategori silinince satır yetim kalabilir. Kategori silme kodu bu tabloyu bilmiyor. Durum doğrulanmadı.

## Hedef tasarım

- Sahip bağlam ve paket yolu: `tradehub_core/content/cms/` paketi. Bugünkü `SEO CMS` modülü bu bağlama ait sayılır.
- Dışarıya açılan fonksiyonlar: Ayrı fonksiyon gerekmez.
- Yayınladığı olaylar: Yok.
- Dinlediği olaylar: 03a bağlamının `category.deleted` olayı.
- Başka bağlamlara bağlantılar: `category` Link alanı kalır. `Product Category` kararlı bir kök kayıttır.
- Denetleyicide kalacak doğrulamalar: Doğrulama gerekmiyor.
- Servise taşınacak iş kuralları: Taşınacak iş kuralı yok.

## Geçiş adımları

1. `category.deleted` olayına abone olan temizlik işleyicisi ekleyin.
2. Ebeveyn ile aynı PR içinde `Content` modülüne taşıyın.

## Riskler ve testler

- Silinen kategori içerikte kırık bağ bırakır. Test: kategori silinince satır kalkmalı.
