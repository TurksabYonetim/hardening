# Feature Catalog

- Bağlam: 02-satici-magaza
- Tür: Ayar (çok kayıtlı katalog)
- Klasör: `tradehub_core/tradehub_core/doctype/feature_catalog`
- Denetleyici: `tradehub_core/tradehub_core/doctype/feature_catalog/feature_catalog.py` (66 satır)
- Önerilen sahip bağlam: 02-satici-magaza

## Epic

- Epic adı: Feature Catalog: 02-satici-magaza bağlamına taşıma
- Öncelik: Önemli
- Faz: Faz 4
- Tahmini büyüklük: Küçük

### User story

Bir platform yöneticisi olarak, plan özelliklerinin tek kaynaktan gelmesini istiyorum.
Böylece güncellemeler birbirini ezmez.

### Kabul kriterleri

- [ ] Kayıtlar tek kaynaktan yükleniyor. Fixture ya da seed betiğinden biri kaldırıldı.
- [ ] `list_plan_feature_keys` fonksiyonu var. Kimlik bağlamının denetim kodu bunu kullanıyor.
- [ ] Kalıcı silme sonrası plan önbelleği temizleniyor. Test geçiyor.
- [ ] Characterization test: `Feature Catalog` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- Özellik anahtarını yeniden adlandırmayın. `plan_feature_flag` bağı sessizce kopar.
- Alt tablo satırlarını `frappe.db.delete` ile silmeyin.
- Aynı kaydı hem fixture hem patch ile yazmayın.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] Değişen davranış için önce başarısız olan test yazıldı.
- [ ] Ruff ve ilgili testler yerelde geçiyor.
- [ ] `import-linter` kontrolü yeni ihlal üretmiyor.
- [ ] `CODEOWNERS` içindeki 02-satici-magaza sahibi inceleyici olarak eklendi.
- [ ] Kimlik bağlamı (01) sahibi inceleyici olarak eklendi.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?
Bu kayıt abonelik planlarında kullanılan özelliklerin listesidir. Özellik iki türlü olur. Yetenek (Capability) açık ya da kapalıdır. Kota (Quota) bir sayıdır. Örneğin `quota.max_products` en çok ürün sayısıdır. Planlar bu listedeki anahtarları kullanır.

## Bugünkü bağımlılıklar
### Bu kaydın bağlandığı kayıtlar
- Link alanı yok.
### Bu kayda dokunan kod
- `tradehub_core/api/v1/feature_catalog.py:187`, `:243`: oluşturuyor ve güncelliyor
- `tradehub_core/api/v1/feature_catalog.py:303`: kalıcı silmede plan satırlarını `frappe.db.delete` ile siliyor
- `tradehub_core/entitlement/core.py:249`, `:299`: görünen adı okuyor
- `tradehub_core/tradehub_core/doctype/subscription_plan/subscription_plan.py:101`, `:182`: plan doğrulamasında okuyor
- `tradehub_core/api/v1/public_pricing.py:133`: vitrin fiyat sayfası için okuyor
- `tradehub_core/setup/seed_features.py:35`: kurulumda oluşturuyor
### hooks.py kayıtları
- `tradehub_core/hooks.py:129`: `fixtures` listesinde. Kayıtlar dosyadan yüklenir.

## Bağımlılık sorunları
1. Kayıtlar hem fixture hem seed betiği hem patch ile yazılıyor. Kanıt: `hooks.py:129`, `setup/seed_features.py:35`, `patches/v15_6_11_resync_feature_catalog.py`. Üç kaynak birbirini ezebilir.
2. `TH Capability Registry.plan_feature_flag` alanı bu anahtarları düz metinle anıyor. Kanıt: `tradehub_core/_audit_rbac.py:106`. Anahtar değişirse yetki sessizce kapanır.
3. Kalıcı silme alt tablo satırlarını doğrudan siliyor. Kanıt: `api/v1/feature_catalog.py:303`. Plan önbelleği temizlenmeyebilir (doğrulanmadı).

## Hedef tasarım
- Sahip bağlam: 02-satici-magaza. Paket yolu: `tradehub_core/seller/entitlement/`.
- Dışa açık fonksiyonlar: `list_plan_feature_keys() -> list[str]`, `get_feature_meta(key) -> FeatureMeta`.
- Yayınladığı olay: `seller.feature_catalog.changed` (alan: `feature_key`, `change`).
- Kimlik bağlamı bu olayla yetenek bağlarını kontrol eder.
- Denetleyicide anahtar biçimi, tür uyumu ve varsayılan değer kuralı kalır.

## Geçiş adımları
1. Tek kaynak seçin. Fixture ya da seed betiğinden biri kalsın. Diğerini kaldırın.
2. `list_plan_feature_keys` fonksiyonunu ekleyin. Kimlik bağlamının denetim kodu bunu kullansın.
3. Kalıcı silmeyi bir servis fonksiyonuna taşıyın. Silme sonrası plan önbelleğini temizleyin.

## Riskler ve testler
- Anahtar silinirse plan kotası kaybolur. Silme sonrası plan doğrulama testi ekleyin.
