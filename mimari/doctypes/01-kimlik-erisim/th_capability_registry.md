# TH Capability Registry

- Bağlam: 01-kimlik-erisim
- Tür: Ayar (çok kayıtlı katalog)
- Klasör: `tradehub_core/tradehub_core/doctype/th_capability_registry`
- Denetleyici: `tradehub_core/tradehub_core/doctype/th_capability_registry/th_capability_registry.py` (39 satır)
- Önerilen sahip bağlam: 01-kimlik-erisim

## Epic

- Epic adı: TH Capability Registry: 01-kimlik-erisim bağlamına taşıma
- Öncelik: Önemli
- Faz: Faz 4
- Tahmini büyüklük: Orta

### User story

Bir geliştirici olarak, kendi bağlamımın yeteneklerini tek fonksiyonla bildirmek istiyorum.
Böylece kimlik tablosuna doğrudan yazmam gerekmez.

### Kabul kriterleri

- [ ] `register_capabilities` fonksiyonu var.
- [ ] `logistics/shipping_zones.py` içinde `TH Capability Registry` için `get_doc` yazımı yok.
- [ ] Kurulum sonrası `plan_feature_flag` değerleri plan özellikleriyle eşleşiyor. Kontrol testi geçiyor.
- [ ] Önbellek temizliği tek yerde duruyor.
- [ ] Characterization test: `TH Capability Registry` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- Korumalı yeteneği silmeyin.
- `plan_feature_flag` değerini `Feature Catalog` anahtarıyla eşleşmeyen metinle doldurmayın.
- Lojistik ya da fatura kodundan bu tabloya doğrudan yazmayın.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] Değişen davranış için önce başarısız olan test yazıldı.
- [ ] Ruff ve ilgili testler yerelde geçiyor.
- [ ] `import-linter` kontrolü yeni ihlal üretmiyor.
- [ ] `CODEOWNERS` içindeki 01-kimlik-erisim sahibi inceleyici olarak eklendi.
- [ ] Lojistik bağlamı (07) sahibi inceleyici olarak eklendi.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?
Bu kayıt platformdaki tüm yeteneklerin listesidir. Her yeteneğin bir anahtarı, etiketi ve grubu vardır. Bazı yetenekler yalnız mağaza sahibine verilir. Korumalı yetenek silinemez.

## Bugünkü bağımlılıklar
### Bu kaydın bağlandığı kayıtlar
- Link alanı yok. `plan_feature_flag` alanı abonelik özelliğini düz metinle anar.
### Bu kayda dokunan kod
- `tradehub_core/utils/permission_resolver.py:114`: aktif yetenekleri okuyor
- `tradehub_core/utils/seller_capabilities.py:360`, `:541`, `:661`, `:684`: okuyor
- `tradehub_core/api/v1/permission_console.py:1771`, `:1774`: okuyor
- `tradehub_core/logistics/shipping_zones.py:50-54`: lojistik yetenek kayıtlarını oluşturuyor
### hooks.py kayıtları
- `tradehub_core/hooks.py:993-995`: `on_update` ve `after_delete` olayları `permission_resolver.on_capability_registry_change` çağırıyor

## Bağımlılık sorunları
1. Lojistik kodu kimlik tablosuna yazıyor. Kanıt: `tradehub_core/logistics/shipping_zones.py:52`. Bu fonksiyon kurulumda ve patch'te çalışıyor (`tradehub_core/setup/install.py:34`). Kimlik ekibi alanı değiştirirse lojistik kurulumu bozulur.
2. `plan_feature_flag` alanı abonelik planına düz metinle bağlı. Kanıt: `_audit_rbac.py:106`. Satıcı bağlamı özellik adını değiştirirse yetki sessizce kapanır.
3. Önbellek temizliği hem denetleyicide hem `hooks.py` içinde. Kanıt: `th_capability_registry.py:28-35` ve `hooks.py:993`.

## Hedef tasarım
- Sahip bağlam: 01-kimlik-erisim. Paket yolu: `tradehub_core/identity/capabilities/`.
- Dışa açık fonksiyonlar:
  - `register_capabilities(specs: list[CapabilitySpec])`. Lojistik ve fatura bağlamları bunu çağırır.
  - `get_capability_meta(key) -> CapabilityMeta`
- Okuma modeli: `plan_feature_flag` için satıcı bağlamının `seller.api.list_plan_feature_keys()` fonksiyonu.
- Yayınladığı olay: `identity.capability.changed`.
- Denetleyicide anahtar biçimi ve koruma kuralı kalır.

## Geçiş adımları
1. `register_capabilities` fonksiyonunu ekleyin.
2. `logistics/shipping_zones.py:44-60` bölümünü bu fonksiyona bağlayın. Bu iş 07-lojistik ekibiyle ortak PR'dır.
3. Kurulum sırasında `plan_feature_flag` değerlerini plan özellikleriyle karşılaştıran kontrol ekleyin.

## Riskler ve testler
- Yetenek eksik kurulursa ekranlar kapanır. Kurulum sonrası yetenek sayısı testi ekleyin.
- `tradehub_core/tests/test_sprint6_rbac.py` korunmalı.
