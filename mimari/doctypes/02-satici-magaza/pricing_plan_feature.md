# Pricing Plan Feature

- Bağlam: 02-satici-magaza
- Tür: Alt tablo
- Klasör: `tradehub_core/tradehub_core/doctype/pricing_plan_feature`
- Denetleyici: `tradehub_core/tradehub_core/doctype/pricing_plan_feature/pricing_plan_feature.py` (8 satır)
- Önerilen sahip bağlam: 02-satici-magaza

## Epic

- Epic adı: Pricing Plan Feature: 02-satici-magaza bağlamına taşıma
- Öncelik: Düşük
- Faz: Faz 4
- Tahmini büyüklük: Küçük

### User story

Bir platform yöneticisi olarak, özellik silinince fiyat kartının hemen güncellenmesini istiyorum.
Böylece vitrinde eski satır kalmaz.

### Kabul kriterleri

- [ ] `feature_catalog.py` içinde `Pricing Plan Feature` için `frappe.db.delete` yok.
- [ ] Silme sonrası vitrin fiyat kartı güncel. Test geçiyor.
- [ ] Okuma `seller.api.get_plan_card` ile yapılıyor.
- [ ] Characterization test: `Pricing Plan Feature` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- Alt tablo satırını üst plan kaydedilmeden silmeyin.
- Bu tabloyu `Subscription Plan` dışındaki bir kayda bağlamayın.
- Vitrin kodundan bu tabloya yazmayın.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] Değişen davranış için önce başarısız olan test yazıldı.
- [ ] Ruff ve ilgili testler yerelde geçiyor.
- [ ] `import-linter` kontrolü yeni ihlal üretmiyor.
- [ ] `CODEOWNERS` içindeki 02-satici-magaza sahibi inceleyici olarak eklendi.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?
Bu tablo bir abonelik planının fiyat kartındaki satırlardır. Her satır bir özelliği ve değerini gösterir. Satır kartta görünür ya da gizlenir. Üst kayıt `Subscription Plan` kaydıdır (`subscription_plan.json:244`).

## Bugünkü bağımlılıklar
### Bu kaydın bağlandığı kayıtlar
- `Feature Catalog` (`feature_key`): aynı bağlam
### Bu kayda dokunan kod
- `tradehub_core/api/v1/plan_features.py:185`: okuyor
- `tradehub_core/api/v1/public_pricing.py:112`: vitrin için okuyor
- `tradehub_core/api/v1/feature_catalog.py:275`: okuyor
- `tradehub_core/api/v1/feature_catalog.py:303`: `frappe.db.delete` ile siliyor
### hooks.py kayıtları
- Kayıt yok.

## Bağımlılık sorunları
1. Alt tablo üst kayıt kaydedilmeden siliniyor. Kanıt: `api/v1/feature_catalog.py:303`. Üst planın `on_update` kancası çalışmaz.
2. Önemli başka bir bağımlılık sorunu bulunmadı. Tüm kullanıcılar aynı bağlamda.

## Hedef tasarım
- Sahip bağlam: 02-satici-magaza. `Subscription Plan` ile aynı paket.
- Dışa açık fonksiyon gerekmez. Okuma `seller.api.get_plan_card(plan)` ile yapılır.
- Olay yoktur.

## Geçiş adımları
1. Kalıcı silmede planları açıp satırı kaldırın. Sonra planı kaydedin. Ya da önbelleği açıkça temizleyin.

## Riskler ve testler
- Vitrin fiyat kartı bayat kalabilir. Silme sonrası kart testi ekleyin.
