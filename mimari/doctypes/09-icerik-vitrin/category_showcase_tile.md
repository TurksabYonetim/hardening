# Category Showcase Tile

- Bağlam: 09-icerik-vitrin
- Tür: Ana kayıt
- Klasör: `tradehub_core/tradehub_core/doctype/category_showcase_tile`
- Denetleyici: `tradehub_core/tradehub_core/doctype/category_showcase_tile/category_showcase_tile.py` (5 satır)
- Önerilen sahip bağlam: 09-icerik-vitrin

## Epic

- Epic adı: Category Showcase Tile: 09-icerik-vitrin bağlamına taşıma
- Öncelik: Önemli
- Faz: Faz 4
- Tahmini büyüklük: Küçük

### User story

Bir platform yöneticisi olarak, kategori adresi değişince vitrin kutusunun kırık bağlantı göstermemesini istiyorum.
Böylece alıcılar boş sayfaya düşmez.

### Kabul kriterleri

- [ ] `get_category_showcase(lang)` fonksiyonu `content/api.py` içinde var.
- [ ] `category.slug_changed` olayı gelince eşleşen `link_href` değeri güncelleniyor.
- [ ] Kutu kaydedilince ilk istek yeni kutuyu döndürüyor.
- [ ] Characterization test: `Category Showcase Tile` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- `link_href` alanını katalog kodundan doğrudan güncellemeyin. Güncelleme olay abonesiyle yapılmalı.
- Medya kural dosyasındaki DocType adını tek başına değiştirmeyin. `media/pipeline/policy/slots/category-banner.json` ile birlikte değişmeli.
- Yayın tarihi kontrolünü yalnız ön yüze bırakmayın. API süresi geçmiş kutuyu döndürmemeli.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] Değişen davranış için önce başarısız olan bir test yazıldı.
- [ ] Ruff ve uygulama testleri yerelde geçiyor.
- [ ] `import-linter` kontrolü `tradehub_core.content` için geçiyor.
- [ ] `CODEOWNERS` içindeki içerik bağlamı sahibinden inceleme istendi.
- [ ] Abone aynı olayı iki kez alınca ikinci işlem hiçbir şey değiştirmiyor.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?

Bu kayıt kategori vitrinindeki tek bir kutudur. Kutu kategori ya da kampanya türünde olabilir. Kutu görsel, metin, bağlantı ve yayın tarihleri taşır.

## Bugünkü bağımlılıklar

### Bu kaydın bağlandığı kayıtlar

- Bu kaydın başka kayda bağlantısı yok.

### Bu kayda dokunan kod

- `tradehub_core/api/category_showcase.py:63`: adını kullanıyor
- `tradehub_core/media/pipeline/policy/slots/category-banner.json:13`: adını kullanıyor
- 5 patch ya da tohum dosyası bu adı kullanıyor. Örnek: `tradehub_core/patches/v15_11_09_vaat_metinleri.py`.

### hooks.py kayıtları

- `tradehub_core/hooks.py:879`: doc_events kaydı. `after_insert` -> `tradehub_core.api.category_showcase.invalidate_cache`, `on_update` -> `tradehub_core.api.category_showcase.invalidate_cache`, `on_trash` -> `tradehub_core.api.category_showcase.invalidate_cache`

## Bağımlılık sorunları

1. Kutu kategoriye Link ile değil, metin bağlantıyla bağlı. Kanıt: `link_href` alanı. Kategori slug'ı değişince kutu kırık bağlantı gösterir.
2. Medya kuralları bu DocType adını biliyor. Kanıt: `media/pipeline/policy/slots/category-banner.json:13`.

## Hedef tasarım

- Sahip bağlam ve paket yolu: `tradehub_core/content/` paketi ve `Content` Frappe modülü.
- Dışarıya açılan fonksiyonlar: `content/api.py` içinde `get_category_showcase(lang)`.
- Yayınladığı olaylar: Yok. Önbellek temizliği bağlam içinde kalır.
- Dinlediği olaylar: 03a bağlamının `category.slug_changed` olayı. Abone, eski bağlantıyı yeni adrese çevirir.
- Başka bağlamlara bağlantılar: Başka bağlama bağlantı yok.
- Denetleyicide kalacak doğrulamalar: Ayrı doğrulama gerekmiyor. Önbellek temizliği kalır.
- Servise taşınacak iş kuralları: Okuma ve önbellek mantığı `api/category_showcase.py` dosyasından `content/` paketine taşınır.

## Geçiş adımları

1. `api/category_showcase.py` dosyasını bağlam paketine taşıyın. Eski yolda yalnız yeniden dışa aktarma bırakın.
2. `hooks.py` içindeki önbellek kancalarının yolunu yeni pakete çevirin.
3. İsterseniz `category.slug_changed` olayına abone olun. Abone eşleşen `link_href` değerlerini güncellesin.
4. DocType'ı `Content` modülüne taşıyın. JSON `module` alanını ve klasörü birlikte değiştirin.

## Riskler ve testler

- Vitrin eski veriyi gösterebilir. Test: kutu değişince ilk istek yeni veriyi döndürmeli.
- Kategori adresi değişince kutu 404 verebilir. Test: slug değişimi sonrası bağlantı yeni adresi göstermeli.
