# Category Showcase Settings

- Bağlam: 09-icerik-vitrin
- Tür: Ayar (single)
- Klasör: `tradehub_core/tradehub_core/doctype/category_showcase_settings`
- Denetleyici: `tradehub_core/tradehub_core/doctype/category_showcase_settings/category_showcase_settings.py` (5 satır)
- Önerilen sahip bağlam: 09-icerik-vitrin

## Epic

- Epic adı: Category Showcase Settings: 09-icerik-vitrin bağlamına taşıma
- Öncelik: Düşük
- Faz: Faz 4
- Tahmini büyüklük: Küçük

### User story

Bir platform yöneticisi olarak, kategori vitrinini açıp kapattığımda sitenin hemen güncellenmesini istiyorum.
Böylece eski vitrin görünmez.

### Kabul kriterleri

- [ ] `api/category_showcase.py` kodu `content/` paketinde duruyor.
- [ ] Ayar değişince ilk istek yeni ayarı döndürüyor.
- [ ] `hooks.py:885` kaydı yeni paket yolunu gösteriyor.
- [ ] Characterization test: `Category Showcase Settings` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- Önbellek temizliği olmadan yeni ayar alanı eklemeyin. Vitrin 60 saniye eski veri gösterir.
- Bu ayarı başka bağlamın kodundan okumayın. Okuma `get_category_showcase` ile yapılmalı.
- Sütun sayısını sınırsız bırakmayın. Ön yüz yerleşimi bozulur.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] Değişen davranış için önce başarısız olan bir test yazıldı.
- [ ] Ruff ve uygulama testleri yerelde geçiyor.
- [ ] `import-linter` kontrolü `tradehub_core.content` için geçiyor.
- [ ] `CODEOWNERS` içindeki içerik bağlamı sahibinden inceleme istendi.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?

Bu ayar ana sayfadaki kategori vitrini bölümünü yönetir. Bölüm başlığını ve sütun sayısını tutar. Bölüm açılıp kapatılabilir.

## Bugünkü bağımlılıklar

### Bu kaydın bağlandığı kayıtlar

- Bu kaydın başka kayda bağlantısı yok.

### Bu kayda dokunan kod

- `tradehub_core/api/category_showcase.py:45`: okuyor
- 3 patch ya da tohum dosyası bu adı kullanıyor. Örnek: `tradehub_core/patches/v15_9_10_seed_category_showcase.py`.

### hooks.py kayıtları

- `tradehub_core/hooks.py:885`: doc_events kaydı. `on_update` -> `tradehub_core.api.category_showcase.invalidate_cache`

## Bağımlılık sorunları

Önemli bir bağımlılık sorunu bulunmadı.

## Hedef tasarım

- Sahip bağlam ve paket yolu: `tradehub_core/content/` paketi ve `Content` Frappe modülü.
- Dışarıya açılan fonksiyonlar: `content/api.py` içinde `get_category_showcase(lang)`.
- Yayınladığı olaylar: Yok. Önbellek temizliği bağlam içinde kalır.
- Dinlediği olaylar: Yok.
- Başka bağlamlara bağlantılar: Başka bağlama bağlantı yok.
- Denetleyicide kalacak doğrulamalar: Ayrı doğrulama gerekmiyor. Önbellek temizliği kalır.
- Servise taşınacak iş kuralları: Okuma ve önbellek mantığı `api/category_showcase.py` dosyasından `content/` paketine taşınır.

## Geçiş adımları

1. `api/category_showcase.py` dosyasını bağlam paketine taşıyın. Eski yolda yalnız yeniden dışa aktarma bırakın.
2. `hooks.py` içindeki önbellek kancalarının yolunu yeni pakete çevirin.
3. DocType'ı `Content` modülüne taşıyın. JSON `module` alanını ve klasörü birlikte değiştirin.

## Riskler ve testler

- Vitrin eski veriyi gösterebilir. Test: kayıt değişince ilk istek yeni veriyi döndürmeli.
