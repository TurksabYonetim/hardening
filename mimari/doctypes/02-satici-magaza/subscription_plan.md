# Subscription Plan

- Bağlam: 02-satici-magaza
- Tür: Ana kayıt (katalog)
- Klasör: `tradehub_core/tradehub_core/doctype/subscription_plan`
- Denetleyici: `tradehub_core/tradehub_core/doctype/subscription_plan/subscription_plan.py` (291 satır)
- Önerilen sahip bağlam: 02-satici-magaza

## Epic

- Epic adı: Subscription Plan: 02-satici-magaza bağlamına taşıma
- Öncelik: Önemli
- Faz: Faz 4
- Tahmini büyüklük: Orta

### User story

Bir platform yöneticisi olarak, plan değiştirdiğimde mağaza yetkilerinin hemen güncellenmesini istiyorum.
Böylece ödeme ve komisyon eski planla hesaplanmaz.

### Kabul kriterleri

- [ ] `get_plan` ve `get_plan_entitlements` fonksiyonları var. Ödeme ve komisyon kodu bunları kullanıyor.
- [ ] Plan yönetimi `api/v1/subscription_admin.py` içinde duruyor.
- [ ] Komisyon eşikleri ödeme bağlamının kendi kaydında duruyor. `quota_tiers` alt tablosu kaldırıldı.
- [ ] Plan değişince yetki önbelleği temizleniyor. Test geçiyor.
- [ ] Characterization test: `Subscription Plan` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- `Field Commission Quota Tier` satırlarını bu plandan düzenlemeyin. Bağlamlar arası alt tablo yasak.
- `permission_console.py` dosyasına yeni plan kodu eklemeyin.
- Fixture ile konsol değişikliğini ezen bir yükleme eklemeyin.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] Değişen davranış için önce başarısız olan test yazıldı.
- [ ] Ruff ve ilgili testler yerelde geçiyor.
- [ ] `import-linter` kontrolü yeni ihlal üretmiyor.
- [ ] `CODEOWNERS` içindeki 02-satici-magaza sahibi inceleyici olarak eklendi.
- [ ] Ödeme bağlamı (05) sahibi inceleyici olarak eklendi.
- [ ] Komisyon taşıması öncesi ve sonrası bonus aynı.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?
Bu kayıt mağazaların seçebileceği abonelik paketidir. Fiyat, deneme süresi, yetenekler ve kotalar burada durur. Yetenek ve kota değerleri JSON alanlarındadır. Fiyat kartı satırları `pricing_features` alt tablosundadır. İzinli bölgeler `allowed_regions` alt tablosundadır.

## Bugünkü bağımlılıklar
### Bu kaydın bağlandığı kayıtlar
- `Currency` (`currency`): Frappe çekirdeği
- `Pricing Plan Feature` (`pricing_features`): aynı bağlam, alt tablo
- `Subscription Plan Region` (`allowed_regions`): aynı bağlam, alt tablo
- `Field Commission Quota Tier` (`quota_tiers`): başka bağlam (05-odeme), alt tablo
- Bu kayda bağlananlar: `Store Subscription`, `Seller Application`, `Trial Settings` (02), `Payment Intent`, `Subscription Payment`, `Field Commission` (05-odeme)
### Bu kayda dokunan kod
- `tradehub_core/tradehub_core/doctype/subscription_plan/subscription_plan.py:101`, `:182`: `Feature Catalog` okuyor
- `tradehub_core/tradehub_core/doctype/subscription_plan/subscription_plan.py:265-279`: tüm planları yeniden kaydeden bakım fonksiyonu
- `tradehub_core/api/v1/permission_console.py:868`: plan oluşturuyor (25 yer)
- `tradehub_core/api/v1/plan_features.py:355`: planı açıp güncelliyor
- `tradehub_core/api/v1/subscription.py:97`: plan değişiminde okuyor
- `tradehub_core/api/v1/subscription_payment.py` (3 yer): ödeme için okuyor
- `tradehub_core/tradehub_core/utils/field_commission.py:52`: komisyon kota eşiklerini okuyor
- `tradehub_core/services/subscription_downgrade.py`: düşürmede okuyor
- `tradehub_core/entitlement/checks.py`: kota için okuyor
### hooks.py kayıtları
- `tradehub_core/hooks.py:132`: `fixtures` listesinde
- `tradehub_core/hooks.py:969-971`: `on_update` olayı `entitlement.sync.on_subscription_plan_update` çağırıyor

## Bağımlılık sorunları
1. Ödeme bağlamının alt tablosu bu kayıtta. Kanıt: `quota_tiers` alanı `Field Commission Quota Tier` tablosuna bağlı. Komisyon ekibi eşik yapısını değiştirirse plan JSON dosyası değişir. Kurala göre bağlamlar arası alt tablo yasak.
2. Plan değişikliği ödeme kayıtlarını etkileyebilir. Kanıt: `Payment Intent` ve `Subscription Payment` bu kayda Link veriyor. Fiyat değişirse açık ödeme niyeti eski fiyatı mı yeni fiyatı mı kullanır, belli değil (doğrulanmadı).
3. Yönetim konsolu dosyası 25 yerde planı yönetiyor. Kanıt: `api/v1/permission_console.py`. Bu dosya 2391 satır. Yetki ve abonelik ekipleri aynı dosyada çakışır.
4. Plan kayıtları fixture ile de yükleniyor. Kanıt: `hooks.py:132`. Konsoldaki değişiklik bir sonraki `migrate` ile ezilebilir (doğrulanmadı: fixture yükleme davranışı).

## Hedef tasarım
- Sahip bağlam: 02-satici-magaza. Paket yolu: `tradehub_core/seller/subscription/`.
- Dışa açık fonksiyonlar: `get_plan(plan) -> PlanView` (alan: fiyat, para birimi, deneme günü), `get_plan_entitlements(plan) -> Entitlements`, `list_public_plans()`.
- Yayınladığı olay: `seller.plan.changed` (alan: `plan`, `changed_fields`).
- Dinleyenler: kimlik (01) yetki önbelleği, ödeme (05) fiyat önbelleği.
- Komisyon eşikleri 05-odeme bağlamında ayrı bir kayda taşınır. Örneğin `Commission Plan Tier`. Link: `subscription_plan`.
- Ödeme kayıtları anlık görüntü tutmalı. Örneğin `Subscription Payment.amount` ve `currency` ödeme anında kopyalanır.
- Kalacak Link alanları: diğer bağlamlardan gelen `plan` linkleri kalır.
- Denetleyicide yetenek ve kota JSON kuralları, fiyat kuralları kalır.

## Geçiş adımları
1. `get_plan` ve `get_plan_entitlements` fonksiyonlarını ekleyin. Ödeme ve komisyon okumalarını bunlara bağlayın.
2. Plan yönetimini `permission_console.py` dosyasından `api/v1/subscription_admin.py` dosyasına taşıyın.
3. Komisyon eşiklerini yeni kayda taşıyın. Önce iki yere yazın. Sonra okumayı çevirin. Sonra alt tabloyu kaldırın. Bu iş 05 ekibiyle ortak yürür.
4. Fixture ve konsol çakışmasını kararlaştırın. Fixture yalnız ilk kurulumda yüklensin.

## Riskler ve testler
- Plan değişince mağaza yetkisi hemen güncellenmeli. Önbellek temizliği testi ekleyin.
- Komisyon taşıması sırasında bonus hesabı değişmemeli. Önce ve sonra karşılaştırma testi ekleyin.
- `tradehub_core/tests/test_sprint6_rbac.py` plan testleri korunmalı.
