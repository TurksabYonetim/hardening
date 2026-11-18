# Header Notice

- Bağlam: 09-icerik-vitrin
- Tür: Ana kayıt
- Klasör: `tradehub_core/tradehub_core/doctype/header_notice`
- Denetleyici: `tradehub_core/tradehub_core/doctype/header_notice/header_notice.py` (5 satır)
- Önerilen sahip bağlam: 09-icerik-vitrin

## Epic

- Epic adı: Header Notice: 09-icerik-vitrin bağlamına taşıma
- Öncelik: Düşük
- Faz: Faz 4
- Tahmini büyüklük: Küçük

### User story

Bir platform yöneticisi olarak, duyuru şeridini değiştirince sitenin hemen güncellenmesini istiyorum.
Böylece eski duyuru görünmez.

### Kabul kriterleri

- [ ] `api/header_notice.py` kodu `content/` paketinde duruyor.
- [ ] `hooks.py:868` kaydı yeni paket yolunu gösteriyor.
- [ ] Bitiş tarihi geçmiş duyuru API yanıtında yok.
- [ ] Characterization test: `Header Notice` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- Önbellek temizliğini kaldırmayın. Site 60 saniye eski duyuru gösterir.
- Dört dil alanından birini silmeyin. Ön yüz dört dili bekliyor.
- Duyuruyu başka bağlamın kodundan yazmayın. Yazım yalnız yönetim ekranından yapılmalı.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] Değişen davranış için önce başarısız olan bir test yazıldı.
- [ ] Ruff ve uygulama testleri yerelde geçiyor.
- [ ] `import-linter` kontrolü `tradehub_core.content` için geçiyor.
- [ ] `CODEOWNERS` içindeki içerik bağlamı sahibinden inceleme istendi.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?

Bu kayıt mağaza sitesinin üst şeridindeki duyuruyu tutar. Duyuru dört dilde metin, bağlantı ve renk taşır. Duyuru başlangıç ve bitiş tarihine göre görünür.

## Bugünkü bağımlılıklar

### Bu kaydın bağlandığı kayıtlar

- Bu kaydın başka kayda bağlantısı yok.

### Bu kayda dokunan kod

- `tradehub_core/api/header_notice.py:49`: adını kullanıyor
- 1 patch ya da tohum dosyası bu adı kullanıyor. Örnek: `tradehub_core/scripts/patch_specs/spec02.json`.

### hooks.py kayıtları

- `tradehub_core/hooks.py:868`: doc_events kaydı. `after_insert` -> `tradehub_core.api.header_notice.invalidate_cache`, `on_update` -> `tradehub_core.api.header_notice.invalidate_cache`, `on_trash` -> `tradehub_core.api.header_notice.invalidate_cache`

## Bağımlılık sorunları

Önemli bir bağımlılık sorunu bulunmadı.

## Hedef tasarım

- Sahip bağlam ve paket yolu: `tradehub_core/content/` paketi ve `Content` Frappe modülü.
- Dışarıya açılan fonksiyonlar: `content/api.py` içinde `get_header_notices(lang)`.
- Yayınladığı olaylar: Yok. Önbellek temizliği bağlam içinde kalır.
- Dinlediği olaylar: Yok.
- Başka bağlamlara bağlantılar: Başka bağlama bağlantı yok.
- Denetleyicide kalacak doğrulamalar: Ayrı doğrulama gerekmiyor. Önbellek temizliği kalır.
- Servise taşınacak iş kuralları: Okuma ve önbellek mantığı `api/header_notice.py` dosyasından `content/` paketine taşınır.

## Geçiş adımları

1. `api/header_notice.py` dosyasını bağlam paketine taşıyın. Eski yolda yalnız yeniden dışa aktarma bırakın.
2. `hooks.py` içindeki önbellek kancalarının yolunu yeni pakete çevirin.
3. DocType'ı `Content` modülüne taşıyın. JSON `module` alanını ve klasörü birlikte değiştirin.

## Riskler ve testler

- Vitrin eski veriyi gösterebilir. Test: kayıt değişince ilk istek yeni veriyi döndürmeli.
