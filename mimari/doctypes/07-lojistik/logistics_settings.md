# Logistics Settings

- Bağlam: 07-lojistik
- Tür: Ayar (single)
- Klasör: `tradehub_core/tradehub_core/doctype/logistics_settings`
- Denetleyici: `tradehub_core/tradehub_core/doctype/logistics_settings/logistics_settings.py` (92 satır)
- Önerilen sahip bağlam: 07-lojistik

## Epic

- Epic adı: Logistics Settings: 07-lojistik bağlamına taşıma
- Öncelik: Önemli
- Faz: Faz 3
- Tahmini büyüklük: Küçük

### User story

Bir geliştirici olarak, lojistiğin açık olup olmadığını tek bir genel fonksiyonla okumak istiyorum.
Böylece başka bağlamlar ayar kaydına doğrudan bakmaz.

### Kabul kriterleri

- [ ] `logistics/api.py` içinde `is_logistics_enabled` fonksiyonu var.
- [ ] Lojistik dışındaki kod `Logistics Settings` kaydını doğrudan okumuyor.
- [ ] İş durum alanlarını ayrı kayda taşıma kararı yazılı olarak verildi.
- [ ] Ayar doğrulama testleri geçiyor.
- [ ] Characterization test: `Logistics Settings` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- Ayar kaydına başka bağlamdan yazmayın.
- Saklama süresi alt sınırını kaldırmayın. Kayıtlar erken silinir.
- Modül anahtarını `site_config` ile ayar kaydı arasında farklı sıraya koymayın.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] Modül anahtarı okuma testi geçiyor.
- [ ] Eşzamanlı kayıt testi eklendi.
- [ ] `import-linter` kontrolü geçiyor.
- [ ] Lojistik ekibinden `CODEOWNERS` incelemesi istendi.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?

`Logistics Settings` lojistik modülünün tek ayar kaydıdır. Modülün açık olup olmadığını `logistics_enabled` alanı belirler. Takip sorgusu, gecikme denetimi ve kayıt saklama süreleri de buradadır. Zamanlanmış işler son çalışma durumlarını da bu kayda yazar.

## Bugünkü bağımlılıklar

### Bu kaydın bağlandığı kayıtlar

- `Currency` (`default_currency`): çekirdek Frappe kaydı
- `Logistics Provider` (`default_logistics_provider`): aynı bağlam
- `Package Type` (`default_package_type`): aynı bağlam
- `Vehicle Type` (`default_vehicle_type`): aynı bağlam

### Bu kayda dokunan kod

- `tradehub_core/logistics/__init__.py:35`: okuyor. Modül anahtarını okuyor.
- `tradehub_core/logistics/jobs/tracking_poll.py:438`: yazıyor. Son çalışma durumunu yazıyor.
- `tradehub_core/logistics/jobs/sla_monitor.py:410`: yazıyor. Son çalışma durumunu yazıyor.
- `tradehub_core/logistics/jobs/integration_log_retention.py:89`: okuyor.
- `tradehub_core/logistics/services/desi.py:28`: okuyor. Desi bölenini okuyor.
- `tradehub_core/logistics/services/tracking_health.py:58`: okuyor.
- `tradehub_core/api/v1/logistics_admin.py:407`: okuyor ve yazıyor. Yönetim ucu.
- `tradehub_core/logistics/cache.py:72`: önbelleği temizliyor.

### hooks.py kayıtları

- `tradehub_core/hooks.py:1014`: `on_update` olarak pano önbelleği temizleniyor.
- `tradehub_core/hooks.py:1272`: kayıt izni `logistics_settings_has_permission`.

## Bağımlılık sorunları

1. Ayar kaydı aynı zamanda iş durum defteri olarak kullanılıyor. Kanıt: `tradehub_core/logistics/jobs/tracking_poll.py:438` ve `tradehub_core/logistics/jobs/sla_monitor.py:410`. Bir yönetici ayarı kaydederken iş de yazarsa değerler birbirini ezebilir. Sorun aynı bağlamda kalıyor.

Başka bağlamı bozan önemli bir sorun bulunmadı.

## Hedef tasarım

- Sahip bağlam ve paket yolu: 07-lojistik, `tradehub_core/logistics/doctype/logistics_settings/`.
- Dışarıya açılan fonksiyonlar: `is_logistics_enabled() -> bool`. Sepet ve sipariş bu fonksiyonu okuyabilir.
- Yayınladığı ve dinlediği olaylar: yok.
- Denetleyicide kalacak doğrulamalar: sorgu sınırları, desi böleni, saklama süresi alt sınırı.
- Servise taşınacak iş kuralları: iş durum alanları ayrı bir kayıt defterine taşınabilir. Bu bir öneridir.

## Geçiş adımları

1. `is_logistics_enabled` fonksiyonunu `tradehub_core/logistics/api.py` içine koyun. Bugünkü `logistics/__init__.py` mantığını çağırsın.
2. İş durum alanlarını ayrı bir kayıt defterine taşımayı değerlendirin. Bu adım isteğe bağlıdır.
3. DocType klasörünü "Logistics" modülüne taşıyın.

## Riskler ve testler

- Modül anahtarı yanlış okunursa bütün lojistik uçları kapanır. Anahtar okuma testini koruyun.
- Ayar kaydı ile iş yazması çakışabilir. Eşzamanlı kayıt testini ekleyin.
