# Tradehub Theme Settings

- Bağlam: 09-icerik-vitrin
- Tür: Ayar (single)
- Klasör: `tradehub_core/tradehub_core/doctype/tradehub_theme_settings`
- Denetleyici: `tradehub_core/tradehub_core/doctype/tradehub_theme_settings/tradehub_theme_settings.py` (426 satır)
- Önerilen sahip bağlam: 09-icerik-vitrin

## Epic

- Epic adı: Tradehub Theme Settings: 09-icerik-vitrin bağlamına taşıma
- Öncelik: Düşük
- Faz: Faz 4
- Tahmini büyüklük: Küçük

### User story

Bir platform yöneticisi olarak, tema renklerini güvenle değiştirmek istiyorum.
Böylece zararlı CSS siteye giremez.

### Kabul kriterleri

- [ ] Tema anahtar listesi `content/theme_keys.py` dosyasında duruyor.
- [ ] `url(` içeren değer reddediliyor.
- [ ] Tema kaydedilince genel tema önbelleği temizleniyor.
- [ ] Characterization test: `Tradehub Theme Settings` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- CSS değer doğrulamasını gevşetmeyin. CSS enjeksiyonu açılır.
- Yeni anahtarı listeye eklemeden ön yüzde kullanmayın. Değer kaydedilmez.
- `tradehub_core/utils/tenant.py:85` muafiyetini kaldırmayın. Tema bütün site için tek kayıttır.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] Değişen davranış için önce başarısız olan bir test yazıldı.
- [ ] Ruff ve uygulama testleri yerelde geçiyor.
- [ ] `import-linter` kontrolü `tradehub_core.content` için geçiyor.
- [ ] `CODEOWNERS` içindeki içerik bağlamı sahibinden inceleme istendi.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?

Bu ayar sitenin tema renklerini ve CSS değişkenlerini tutar. Değerler `overrides` JSON alanında durur. Denetleyici izinli anahtarları ve güvenli değerleri doğrular. CSS enjeksiyonu bu doğrulamayla engellenir.

## Bugünkü bağımlılıklar

### Bu kaydın bağlandığı kayıtlar

- `User` (`last_updated_by`, Link): başka bağlam (Frappe çekirdeği)

### Bu kayda dokunan kod

- `tradehub_core/api/theme.py:26`: adını kullanıyor
- `tradehub_core/tradehub_core/utils/tenant.py:85`: adını kullanıyor
- 2 patch ya da tohum dosyası bu adı kullanıyor. Örnek: `tradehub_core/patches/v15_8_8_theme_strip_inset_shadow.py`.

### hooks.py kayıtları

- `hooks.py` içinde bu DocType için kayıt yok.

## Bağımlılık sorunları

1. Kiracı yardımcı kodu bu ayarın adını biliyor. Kanıt: `tradehub_core/utils/tenant.py:85`. Bu bilgi kiracı filtresinden muafiyet içindir. Kabul edilebilir.

## Hedef tasarım

- Sahip bağlam ve paket yolu: `tradehub_core/content/` paketi ve `Content` Frappe modülü.
- Dışarıya açılan fonksiyonlar: `content/api.py` içinde `get_public_theme()`.
- Yayınladığı olaylar: Yok.
- Dinlediği olaylar: Yok.
- Başka bağlamlara bağlantılar: `last_updated_by` Frappe `User` kaydına bağlıdır.
- Denetleyicide kalacak doğrulamalar: Anahtar listesi ve CSS değer doğrulaması kalır. Kanıt: `tradehub_theme_settings.py:361` ve `:393`.
- Servise taşınacak iş kuralları: Anahtar listesi 426 satırlık denetleyiciden `content/theme_keys.py` dosyasına alınabilir.

## Geçiş adımları

1. Anahtar listesini ayrı dosyaya alın. Denetleyici ve `api/theme.py` oradan okusun.
2. `api/theme.py` dosyasını `content/` paketine taşıyın.
3. DocType'ı `Content` modülüne taşıyın.

## Riskler ve testler

- Zararlı CSS değeri kaydedilebilir. Test: `url(` içeren değer reddedilmeli.
