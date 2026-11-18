# Trial Settings

- Bağlam: 02-satici-magaza
- Tür: Ayar (single)
- Klasör: `tradehub_core/tradehub_core/doctype/trial_settings`
- Denetleyici: `tradehub_core/tradehub_core/doctype/trial_settings/trial_settings.py` (33 satır)
- Önerilen sahip bağlam: 02-satici-magaza

## Epic

- Epic adı: Trial Settings: 02-satici-magaza bağlamına taşıma
- Öncelik: Düşük
- Faz: Faz 4
- Tahmini büyüklük: Küçük

### User story

Bir platform yöneticisi olarak, deneme süresini değiştirdiğimde vitrinin hemen güncellenmesini istiyorum.
Böylece eski süre görünmez.

### Kabul kriterleri

- [ ] `invalidate_pricing_cache` fonksiyonu `seller/subscription/cache.py` içinde duruyor.
- [ ] Denetleyici `api.v1.public_pricing` dosyasını içe aktarmıyor.
- [ ] Kayıt sonrası önbellek testi geçiyor.
- [ ] Characterization test: `Trial Settings` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- Denetleyicide API dosyasını en üstte içe aktarmayın.
- Negatif gün kontrolünü kaldırmayın.
- Deneme planını pasif bir plana bağlamayın.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] Değişen davranış için önce başarısız olan test yazıldı.
- [ ] Ruff ve ilgili testler yerelde geçiyor.
- [ ] `import-linter` kontrolü yeni ihlal üretmiyor.
- [ ] `CODEOWNERS` içindeki 02-satici-magaza sahibi inceleyici olarak eklendi.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?
Bu ayar ücretsiz deneme süresini yönetir. Deneme açık mı, hangi plan ve kaç gün bilgisini tutar. Vitrindeki deneme düğmesinin yazısı da buradadır.

## Bugünkü bağımlılıklar
### Bu kaydın bağlandığı kayıtlar
- `Subscription Plan` (`trial_plan`): aynı bağlam
### Bu kayda dokunan kod
- `tradehub_core/tradehub_core/doctype/trial_settings/trial_settings.py:11`: dosya başında `api.v1.public_pricing.invalidate_pricing_cache` alıyor
- `tradehub_core/tradehub_core/doctype/trial_settings/trial_settings.py:27`: önbellekten okuyor
- `tradehub_core/api/v1/permission_console.py:2378`: okuyor
### hooks.py kayıtları
- Kayıt yok.

## Bağımlılık sorunları
1. Denetleyici API dosyasını en üstte içe aktarıyor. Kanıt: `trial_settings.py:11`. API dosyasında hata olursa ayar kaydı yüklenmez.

## Hedef tasarım
- Sahip bağlam: 02-satici-magaza. Paket yolu: `tradehub_core/seller/subscription/`.
- Dışa açık fonksiyon: `get_trial_settings() -> TrialSettings`.
- Yayınladığı olay yok. Önbellek temizliği aynı bağlamın servis fonksiyonudur.
- Denetleyicide negatif gün kuralı kalır.

## Geçiş adımları
1. `invalidate_pricing_cache` fonksiyonunu `seller/subscription/cache.py` dosyasına taşıyın. API ve denetleyici buradan alsın.

## Riskler ve testler
- Önbellek temizlenmezse vitrin eski deneme süresini gösterir. Kayıt sonrası önbellek testi ekleyin.
