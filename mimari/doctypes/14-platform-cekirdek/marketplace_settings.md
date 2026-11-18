# Marketplace Settings

- Bağlam: 14-platform-cekirdek
- Tür: Ayar (single)
- Klasör: `tradehub_core/tradehub_core/doctype/marketplace_settings`
- Denetleyici: `tradehub_core/tradehub_core/doctype/marketplace_settings/marketplace_settings.py` (30 satır)
- Önerilen sahip bağlam: 14-platform-cekirdek. Ama alanların çoğu başka bağlamlara ait. Ayar bağlamlara bölünmeli.

## Epic

- Epic adı: Marketplace Settings: 14-platform-cekirdek bağlamına taşıma
- Öncelik: Önemli
- Faz: Faz 4
- Tahmini büyüklük: Orta

### User story

Bir geliştirici olarak, kendi bağlamımın ayarlarını kendi ayar kaydımda tutmak istiyorum.
Böylece altı ekip aynı JSON dosyasında çakışmaz.

### Kabul kriterleri

- [ ] Her ayar okuması için bir fonksiyon var. Örnek: `catalog.api.hide_empty_categories`.
- [ ] Katalog, fatura, adres, banka ve bayi ayarları kendi kayıtlarına taşındı.
- [ ] Bu kayıtta yalnız `context_*` alanları kaldı.
- [ ] Patch sonrası ayar değerleri eskisiyle aynı. Karşılaştırma testi geçiyor.
- [ ] Characterization test: `Marketplace Settings` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- Bu kayda yeni alan eklemeyin. Bağlamınızın kendi ayar kaydını açın.
- Ayarı yeni kodda `get_single_value("Marketplace Settings", ...)` ile okumayın. Bağlamın fonksiyonunu kullanın.
- Banka bilgisini bu genel ayarda tutmaya devam etmeyin.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] Değişen davranış için önce başarısız olan test yazıldı.
- [ ] Ruff ve ilgili testler yerelde geçiyor.
- [ ] `import-linter` kontrolü yeni ihlal üretmiyor.
- [ ] `CODEOWNERS` içindeki 14-platform-cekirdek sahibi inceleyici olarak eklendi.
- [ ] İlgili bağlam sahipleri inceleyici olarak eklendi.
- [ ] `test_marketplace_settings.py` ve `test_reseller.py` geçiyor.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?
Bu kayıt platform genel ayarlarıdır. Tek bir kayıt vardır. İçinde birbirinden bağımsız ayar grupları durur:
- Adres ayarları: `default_address_type`, `require_tax_id_business`, `require_tax_id_individual`
- Fatura ayarı: `invoice_generation_mode`
- Katalog ayarı: `hide_empty_categories`
- Abonelik ödeme banka bilgisi: `subscription_bank_name`, `subscription_iban`
- Bayi ayarı: `thoptan_reseller_enabled`, `thoptan_seller`
- Bağlam varsayılanları: `context_default_language`, `context_default_currency`

## Bugünkü bağımlılıklar
### Bu kaydın bağlandığı kayıtlar
- `Admin Seller Profile` (`thoptan_seller`): başka bağlam (02-satici-magaza)
### Bu kayda dokunan kod
- `tradehub_core/tradehub_core/doctype/marketplace_settings/marketplace_settings.py:21`: adres ve fatura ayarlarını döndürüyor
- `tradehub_core/context/settings.py:63`: dil ve para birimi varsayılanlarını okuyor
- `tradehub_core/contracts/reseller.py:17`, `:18`: bayi ayarını okuyor
- `tradehub_core/api/v1/subscription_payment.py:41`: banka bilgisini okuyor
- `tradehub_core/api/listing.py:392`: boş kategori ayarını okuyor
- `tradehub_core/api/category.py:67`, `:226`, `:237`: boş kategori ayarını okuyor
- `tradehub_core/utils/tenant.py:76`: kiracı filtresinden muaf listesinde
### hooks.py kayıtları
- `tradehub_core/hooks.py:557-559`: `on_update` olayı `context.settings.invalidate_context_settings_cache` çağırıyor

## Bağımlılık sorunları
1. Altı bağlam aynı JSON dosyasını değiştiriyor. Kanıt: alan listesi. Kimlik, fatura, katalog, ödeme ve satıcı ekipleri bu dosyaya alan ekliyor. Paralel çalışmada birleştirme çakışması kaçınılmaz.
2. Önbellek yalnız bağlam ayarları için temizleniyor. Kanıt: `hooks.py:558`. Diğer okuyucular `get_cached_doc` ya da `get_single_value` kullanıyor. Frappe belge önbelleğini kendisi temizler. Ama özel önbellekler temizlenmez (doğrulanmadı: diğer okuyucuların özel önbelleği var mı).
3. Banka bilgisi genel ayarda duruyor. Kanıt: `subscription_iban` alanı. Ödeme bağlamı (05) bu bilgiyi kendi ayarında tutmalı.

## Hedef tasarım
- Sahip bağlam: 14-platform-cekirdek. Yalnız gerçekten ortak ayarlar kalır: `context_default_language`, `context_default_currency`, `context_rule_version`, `context_prompt_cooldown_days`.
- Diğer alanlar bağlamların kendi ayar kayıtlarına taşınır:
  - Adres ayarları 01-kimlik-erisim: `Identity Settings`
  - Fatura ayarı 06-vergi-fatura: `Invoice Settings`
  - Katalog ayarı 03a-katalog: `Catalog Settings`
  - Abonelik banka bilgisi ve bayi ayarı 02-satici-magaza ya da 05-odeme: `Subscription Settings`
- Dışa açık fonksiyon: `shared.settings.get_platform_defaults() -> PlatformDefaults`.
- Olay yoktur. Her ayar kendi önbelleğini kendi kancasıyla temizler.
- Denetleyici boş kalabilir.

## Geçiş adımları
1. Her okuma için bir fonksiyon yazın. Örneğin `catalog.api.hide_empty_categories() -> bool`. Önce fonksiyon eski alanı okusun.
2. Yeni ayar kaydını açın. Değeri bir patch ile kopyalayın. Fonksiyonu yeni kayda çevirin.
3. Eski alanı kaldırın. Her ayar grubu ayrı PR olsun. Sıra: katalog, fatura, adres, banka, bayi.

## Riskler ve testler
- Taşımada ayar değeri kaybolursa varsayılan devreye girer. Patch sonrası değer karşılaştırma testi ekleyin.
- `tradehub_core/tests/test_marketplace_settings.py` ve `tradehub_core/contracts/tests/test_reseller.py` korunmalı.
