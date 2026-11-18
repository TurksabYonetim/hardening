# Header Notice Settings

- Bağlam: 09-icerik-vitrin
- Tür: Ayar (single)
- Klasör: `tradehub_core/tradehub_core/doctype/header_notice_settings`
- Denetleyici: `tradehub_core/tradehub_core/doctype/header_notice_settings/header_notice_settings.py` (5 satır)
- Önerilen sahip bağlam: 09-icerik-vitrin

## Epic

- Epic adı: Header Notice Settings: 09-icerik-vitrin bağlamına taşıma
- Öncelik: Düşük
- Faz: Faz 5
- Tahmini büyüklük: Küçük

### User story

Bir platform yöneticisi olarak, duyuru gösterim biçimini değiştirince sitenin hemen güncellenmesini istiyorum.
Böylece ziyaretçi doğru şeridi görür.

### Kabul kriterleri

- [ ] Ayar `Content` modülünde duruyor.
- [ ] `display_mode` değişince ilk istek yeni biçimi döndürüyor.
- [ ] `hooks.py:874` kaydı yeni paket yolunu gösteriyor.
- [ ] Characterization test: `Header Notice Settings` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- `display_mode` için ön yüzün bilmediği bir değer eklemeyin. Şerit görünmez olur.
- Önbellek temizleme kancasını kaldırmayın.
- Bu ayarı `Header Notice` taşımasından ayrı bir PR ile taşımayın. İki kayıt aynı API'yi kullanıyor.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] Değişen davranış için önce başarısız olan bir test yazıldı.
- [ ] Ruff ve uygulama testleri yerelde geçiyor.
- [ ] `import-linter` kontrolü `tradehub_core.content` için geçiyor.
- [ ] `CODEOWNERS` içindeki içerik bağlamı sahibinden inceleme istendi.
- [ ] DocType modülü taşınırsa patch iki kez çalışınca hata vermiyor.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?

Bu ayar üst şerit duyurularının gösterim biçimini tutar. Tek alanı `display_mode` alanıdır.

## Bugünkü bağımlılıklar

### Bu kaydın bağlandığı kayıtlar

- Bu kaydın başka kayda bağlantısı yok.

### Bu kayda dokunan kod

- `tradehub_core/api/header_notice.py:44`: okuyor
- 1 patch ya da tohum dosyası bu adı kullanıyor. Örnek: `tradehub_core/scripts/patch_specs/spec02.json`.

### hooks.py kayıtları

- `tradehub_core/hooks.py:874`: doc_events kaydı. `on_update` -> `tradehub_core.api.header_notice.invalidate_cache`

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
