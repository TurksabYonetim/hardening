# Tracking Settings

- Bağlam: 14-platform-cekirdek
- Tür: Ayar (single)
- Klasör: `tradehub_core/tradehub_core/doctype/tracking_settings`
- Denetleyici: `tradehub_core/tradehub_core/doctype/tracking_settings/tracking_settings.py` (37 satır)
- Önerilen sahip bağlam: 09-icerik-vitrin. Ayar yalnız vitrinde izleme kodlarını yükler. Pazarlama ve vitrin işine daha yakın.

## Epic

- Epic adı: Tracking Settings: 09-icerik-vitrin bağlamına taşıma
- Öncelik: Düşük
- Faz: Faz 5
- Tahmini büyüklük: Küçük

### User story

Bir geliştirici olarak, izleme ayarının sahibini vitrin ekibi yapmak istiyorum.
Böylece kaydı kullanan ekip kaydın sahibi olur.

### Kabul kriterleri

- [ ] Önbellek anahtarı tek sabitte duruyor.
- [ ] JSON `module` alanı vitrin modülünü gösteriyor.
- [ ] Kimlik biçimi doğrulama testi geçiyor.
- [ ] Characterization test: `Tracking Settings` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- Önbellek anahtarını iki ayrı yerde yazmayın.
- İzleme kimliğini doğrulamadan kaydetmeyin.
- Bu ayara izleme dışı alan eklemeyin.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] Değişen davranış için önce başarısız olan test yazıldı.
- [ ] Ruff ve ilgili testler yerelde geçiyor.
- [ ] `import-linter` kontrolü yeni ihlal üretmiyor.
- [ ] `CODEOWNERS` içindeki 09-icerik-vitrin sahibi inceleyici olarak eklendi.
- [ ] `tabDocType` modül değerini güncelleyen patch test sitesinde denendi.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?
Bu ayar vitrinde çalışan izleme araçlarını yönetir. Google Tag Manager, Yandex Metrica, Facebook Pixel ve Criteo kimliklerini tutar. Her araç ayrı açılıp kapanır.

## Bugünkü bağımlılıklar
### Bu kaydın bağlandığı kayıtlar
- Link alanı yok.
### Bu kayda dokunan kod
- `tradehub_core/api/tracking.py:19`: DocType adını sabit olarak tutuyor. Okuma ve yazma bu dosyada.
- `tradehub_core/tradehub_core/doctype/tracking_settings/tracking_settings.py:18`, `:27`: kimlik biçimini doğruluyor
- `tradehub_core/tradehub_core/doctype/tracking_settings/tracking_settings.py:37`: `tradehub_tracking_config` önbelleğini siliyor
### hooks.py kayıtları
- Kayıt yok.

## Bağımlılık sorunları
1. Önemli bir bağımlılık sorunu bulunmadı.
2. Önbellek anahtarı iki yerde yazılı. Kanıt: `tracking_settings.py:37` ve `api/tracking.py:18`. Biri değişirse önbellek bayat kalır.

## Hedef tasarım
- Sahip bağlam: 09-icerik-vitrin. Paket yolu: `tradehub_core/storefront/tracking/`.
- Dışa açık fonksiyon: `get_public_tracking() -> TrackingConfig`.
- Olay yoktur.
- Denetleyicide kimlik biçimi kontrolü kalır.

## Geçiş adımları
1. Önbellek anahtarını tek sabitte toplayın. Denetleyici bu sabiti kullansın.
2. JSON `module` alanını vitrin modülüne çevirin. `api/tracking.py` dosyasını vitrin paketine taşıyın.

## Riskler ve testler
- Yanlış kimlik vitrini bozmamalı. Biçim doğrulama testi ekleyin. Bugün bu ayar için test dosyası bulunamadı.
