# CMS Collection Item

- Bağlam: 09-icerik-vitrin
- Tür: Alt tablo
- Klasör: `tradehub_core/seo_cms/doctype/cms_collection_item`
- Denetleyici: `tradehub_core/seo_cms/doctype/cms_collection_item/cms_collection_item.py` (8 satır)
- Önerilen sahip bağlam: 09-icerik-vitrin

## Epic

- Epic adı: CMS Collection Item: 09-icerik-vitrin bağlamına taşıma
- Öncelik: Düşük
- Faz: Faz 4
- Tahmini büyüklük: Küçük

### User story

Bir geliştirici olarak, `CMS Collection Item` tablosunun ebeveyni `CMS Content` ile aynı modülde durmasını istiyorum.
Böylece tabloyu kimin değiştireceği açık olur.

### Kabul kriterleri

- [ ] `CMS Collection Item` ve `CMS Content` aynı Frappe modülünde duruyor.
- [ ] `CMS Content` kaydı açılınca `CMS Collection Item` satırları eksiksiz görünüyor.
- [ ] `CMS Collection Item` satırlarını yalnız `tradehub_core.content` paketi yazıyor.
- [ ] `listing.deleted` olayı gelince ilgili koleksiyon satırı siliniyor.
- [ ] Characterization test: `CMS Collection Item` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- `CMS Collection Item` modülünü ebeveynden ayrı bir PR ile taşımayın. Alt tablo bağı kopar.
- Başka bağlamın kodundan `CMS Collection Item` satırı eklemeyin ya da silmeyin. Bu tabloyu yalnız `CMS Content` sahibi değiştirir.
- Alan adlarını taşıma PR'ı içinde değiştirmeyin. Taşıma ile alan değişikliği ayrı PR olmalı.
- `listing_purge/preview.py` içine yeni CMS tablo adı eklemeyin. Yetim satır temizliği `listing.deleted` olayıyla yapılmalı.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] Değişen davranış için önce başarısız olan bir test yazıldı.
- [ ] Ruff ve uygulama testleri yerelde geçiyor.
- [ ] `import-linter` kontrolü `tradehub_core.content` için geçiyor.
- [ ] `CODEOWNERS` içindeki içerik bağlamı sahibinden inceleme istendi.
- [ ] DocType modülü taşınırsa patch iki kez çalışınca hata vermiyor.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?

Bu alt tablo bir koleksiyon sayfasındaki ilanları listeler. Her satır bir ilan ve sıra numarasıdır. Tablo `CMS Content` içinde `items` alanında kullanılır.

## Bugünkü bağımlılıklar

### Bu kaydın bağlandığı kayıtlar

- `Listing` (`listing`, Link): başka bağlam (03a-katalog)

### Bu kayda dokunan kod

- `tradehub_core/listing_purge/preview.py:39`: adını kullanıyor
- `tradehub_core/seo_cms/doctype/cms_content/cms_content.json:379`: alt tablo ya da Link tanımı

### hooks.py kayıtları

- `hooks.py` içinde bu DocType için kayıt yok.

## Bağımlılık sorunları

1. Alt tablo katalog bağlamındaki `Listing` kaydına bağlı. İlan silinince satır yetim kalabilir. Bu bağ kabul edilebilir çünkü `Listing` kararlı bir kök kayıttır.
2. İlan temizleme kodu bu tabloyu adıyla biliyor. Kanıt: `listing_purge/preview.py:39`. Bu bağ 03a bağlamını 09 bağlamına bağlıyor.

## Hedef tasarım

- Sahip bağlam ve paket yolu: `tradehub_core/content/cms/` paketi. Bugünkü `SEO CMS` modülü bu bağlama ait sayılır.
- Dışarıya açılan fonksiyonlar: Ayrı fonksiyon gerekmez. Koleksiyon okuma `content/api.py` içindeki `get_content` ile yapılır.
- Yayınladığı olaylar: Yok.
- Dinlediği olaylar: 03a bağlamının `listing.deleted` olayı. Abone, satırı siler ya da işaretler.
- Başka bağlamlara bağlantılar: `listing` Link alanı kalır. İlan başlığı gerekirse anlık görüntü olarak saklanır.
- Denetleyicide kalacak doğrulamalar: Doğrulama gerekmiyor.
- Servise taşınacak iş kuralları: Taşınacak iş kuralı yok.

## Geçiş adımları

1. `listing.deleted` olayına abone olan bir işleyici ekleyin. Bu işleyici yetim satırları temizlesin.
2. `listing_purge/preview.py:39` listesini `content/api.py` içindeki bir kayıt noktasından okuyun.

## Riskler ve testler

- Silinen ilan koleksiyonda kırık kart üretebilir. Test: ilan silinince koleksiyon satırı kalkmalı.
