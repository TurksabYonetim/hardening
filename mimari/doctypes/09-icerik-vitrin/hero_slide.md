# Hero Slide

- Bağlam: 09-icerik-vitrin
- Tür: Ana kayıt
- Klasör: `tradehub_core/tradehub_core/doctype/hero_slide`
- Denetleyici: `tradehub_core/tradehub_core/doctype/hero_slide/hero_slide.py` (13 satır)
- Önerilen sahip bağlam: 09-icerik-vitrin

## Epic

- Epic adı: Hero Slide: 09-icerik-vitrin bağlamına taşıma
- Öncelik: Düşük
- Faz: Faz 4
- Tahmini büyüklük: Küçük

### User story

Bir platform yöneticisi olarak, ana sayfa slaytını değiştirince sitenin hemen güncellenmesini istiyorum.
Böylece kampanyalar zamanında görünür.

### Kabul kriterleri

- [ ] `api/hero_slider.py` kodu `content/` paketinde duruyor.
- [ ] Görsel türündeki slayt görselsiz kaydedilemiyor.
- [ ] Slayt kaydedilince ilk istek yeni slaytı döndürüyor.
- [ ] Characterization test: `Hero Slide` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- Arka plan türü doğrulamasını denetleyiciden çıkarmayın. Boş slayt yayına girer.
- Slayt görselini medya sürecini atlayarak yüklemeyin. Görsel WebP'ye çevrilmez.
- Önbellek temizleme kancasını kaldırmayın.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] Değişen davranış için önce başarısız olan bir test yazıldı.
- [ ] Ruff ve uygulama testleri yerelde geçiyor.
- [ ] `import-linter` kontrolü `tradehub_core.content` için geçiyor.
- [ ] `CODEOWNERS` içindeki içerik bağlamı sahibinden inceleme istendi.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?

Bu kayıt ana sayfadaki büyük kayan görsel alanının bir slaytıdır. Slayt metin, düğme, arka plan ve yayın tarihleri taşır.

## Bugünkü bağımlılıklar

### Bu kaydın bağlandığı kayıtlar

- Bu kaydın başka kayda bağlantısı yok.

### Bu kayda dokunan kod

- `tradehub_core/api/hero_slider.py:31`: adını kullanıyor

### hooks.py kayıtları

- `tradehub_core/hooks.py:890`: doc_events kaydı. `after_insert` -> `tradehub_core.api.hero_slider.invalidate_cache`, `on_update` -> `tradehub_core.api.hero_slider.invalidate_cache`, `on_trash` -> `tradehub_core.api.hero_slider.invalidate_cache`

## Bağımlılık sorunları

Önemli bir bağımlılık sorunu bulunmadı.

## Hedef tasarım

- Sahip bağlam ve paket yolu: `tradehub_core/content/` paketi ve `Content` Frappe modülü.
- Dışarıya açılan fonksiyonlar: `content/api.py` içinde `get_hero_slides(lang)`.
- Yayınladığı olaylar: Yok. Önbellek temizliği bağlam içinde kalır.
- Dinlediği olaylar: Yok.
- Başka bağlamlara bağlantılar: Başka bağlama bağlantı yok.
- Denetleyicide kalacak doğrulamalar: Arka plan türüne göre görsel ve renk zorunluluğu kalır. Kanıt: `hero_slide.py:8`.
- Servise taşınacak iş kuralları: Okuma ve önbellek mantığı `api/hero_slider.py` dosyasından `content/` paketine taşınır.

## Geçiş adımları

1. `api/hero_slider.py` dosyasını bağlam paketine taşıyın. Eski yolda yalnız yeniden dışa aktarma bırakın.
2. `hooks.py` içindeki önbellek kancalarının yolunu yeni pakete çevirin.
3. DocType'ı `Content` modülüne taşıyın. JSON `module` alanını ve klasörü birlikte değiştirin.

## Riskler ve testler

- Vitrin eski veriyi gösterebilir. Test: kayıt değişince ilk istek yeni veriyi döndürmeli.
