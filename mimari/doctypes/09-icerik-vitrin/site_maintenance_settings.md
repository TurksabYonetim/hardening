# Site Maintenance Settings

- Bağlam: 09-icerik-vitrin
- Tür: Ayar (single)
- Klasör: `tradehub_core/tradehub_core/doctype/site_maintenance_settings`
- Denetleyici: `tradehub_core/tradehub_core/doctype/site_maintenance_settings/site_maintenance_settings.py` (15 satır)
- Önerilen sahip bağlam: 14-platform-cekirdek. Bakım modu bütün siteyi etkiler. Yalnız vitrinle sınırlı değildir.

## Epic

- Epic adı: Site Maintenance Settings: 14-platform-cekirdek bağlamına taşıma
- Öncelik: Önemli
- Faz: Faz 4
- Tahmini büyüklük: Küçük

### User story

Bir platform yöneticisi olarak, bakım modunu açıp kapatınca bütün sitenin hemen tepki vermesini istiyorum.
Böylece site gereksiz yere kapalı kalmaz.

### Kabul kriterleri

- [ ] Önbellek anahtarı tek yerde tanımlı. Denetleyici ve API aynı sabiti kullanıyor.
- [ ] Ayar değişince ilk istek yeni durumu döndürüyor.
- [ ] Ayar 14-platform-cekirdek bağlamının `platform/` paketinde duruyor.
- [ ] Characterization test: `Site Maintenance Settings` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- `CACHE_KEY` değerini yalnız bir dosyada değiştirmeyin. Bugün iki kopya var: `site_maintenance_settings.py:4` ve `api/site_maintenance.py:12`.
- `after_commit` temizliğini kaldırmayın. Eski değer önbellekte kalır.
- Bakım modunu yönetici dışındaki rollere açmayın. Uç nokta yalnız `System Manager` içindir.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] Değişen davranış için önce başarısız olan bir test yazıldı.
- [ ] Ruff ve uygulama testleri yerelde geçiyor.
- [ ] `import-linter` kontrolü `tradehub_core.platform` için geçiyor.
- [ ] `CODEOWNERS` içindeki platform çekirdeği bağlamı sahibinden inceleme istendi.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?

Bu ayar sitenin bakım modunu yönetir. Bakım açılınca ziyaretçi bakım mesajını görür. Ayar başlık, mesaj ve tahmini bitiş saatini tutar.

## Bugünkü bağımlılıklar

### Bu kaydın bağlandığı kayıtlar

- `User` (`changed_by`, Link): başka bağlam (Frappe çekirdeği)

### Bu kayda dokunan kod

- `tradehub_core/api/site_maintenance.py:14`: adını kullanıyor

### hooks.py kayıtları

- `hooks.py` içinde bu DocType için kayıt yok.

## Bağımlılık sorunları

1. Önbellek anahtarı iki yerde tanımlı. Kanıt: `site_maintenance_settings.py:4` ve `api/site_maintenance.py:12`. Biri değişirse önbellek temizliği çalışmaz.

## Hedef tasarım

- Sahip bağlam ve paket yolu: `tradehub_core/platform/` paketi. 14-platform-cekirdek bağlamına taşınır.
- Dışarıya açılan fonksiyonlar: `platform/api.py` içinde `get_maintenance_status()`.
- Yayınladığı olaylar: Yok. Önbellek temizliği bağlam içinde kalır.
- Dinlediği olaylar: Yok.
- Başka bağlamlara bağlantılar: Başka bağlama bağlantı yok.
- Denetleyicide kalacak doğrulamalar: Ayrı doğrulama gerekmiyor. Önbellek temizliği kalır.
- Servise taşınacak iş kuralları: Okuma ve önbellek mantığı `api/site_maintenance.py` dosyasından `content/` paketine taşınır.

## Geçiş adımları

1. `api/site_maintenance.py` dosyasını bağlam paketine taşıyın. Eski yolda yalnız yeniden dışa aktarma bırakın.
2. `hooks.py` içindeki önbellek kancalarının yolunu yeni pakete çevirin.
3. DocType'ı `Content` modülüne taşıyın. JSON `module` alanını ve klasörü birlikte değiştirin.

## Riskler ve testler

- Bakım kapatılınca site açılmayabilir. Test: ayar değişince ilk istek yeni durumu döndürmeli.
