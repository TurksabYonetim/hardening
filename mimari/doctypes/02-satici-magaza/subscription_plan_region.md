# Subscription Plan Region

- Bağlam: 02-satici-magaza
- Tür: Alt tablo
- Klasör: `tradehub_core/tradehub_core/doctype/subscription_plan_region`
- Denetleyici: `tradehub_core/tradehub_core/doctype/subscription_plan_region/subscription_plan_region.py` (8 satır)
- Önerilen sahip bağlam: 02-satici-magaza

## Epic

- Epic adı: Subscription Plan Region: 02-satici-magaza bağlamına taşıma
- Öncelik: Önemli
- Faz: Faz 4
- Tahmini büyüklük: Küçük

### User story

Bir satıcı olarak, yalnız izinli bölgelere satış yapabilmek istiyorum.
Böylece bölge kuralı tek yerden yönetilir.

### Kabul kriterleri

- [ ] `get_store_regions` ve `get_plan_regions` fonksiyonları var. Dört okuyucu bunları kullanıyor.
- [ ] Mağaza bölgeleri ayrı bir alt tabloda duruyor.
- [ ] `tradehub_core/tests/test_abac_context.py` geçiyor.
- [ ] Characterization test: `Subscription Plan Region` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- Aynı alt tabloyu iki farklı üst kayıtta kullanmaya devam etmeyin.
- Alt tabloyu üst kayıt olmadan doğrudan sorgulamayın.
- `Region` kaydının yeri kararlaşmadan yeni bağ eklemeyin.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] Değişen davranış için önce başarısız olan test yazıldı.
- [ ] Ruff ve ilgili testler yerelde geçiyor.
- [ ] `import-linter` kontrolü yeni ihlal üretmiyor.
- [ ] `CODEOWNERS` içindeki 02-satici-magaza sahibi inceleyici olarak eklendi.
- [ ] Patch iki kez çalışınca veri çoğalmıyor.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?
Bu tablo bölge listesi tutar. Her satırda bir `Region` vardır. Tablo iki yerde kullanılır. Abonelik planında izinli bölgeleri tutar (`subscription_plan.json:263`). Mağaza kaydında satıcının bölgelerini tutar (`entitlement/checks.py:118`).

## Bugünkü bağımlılıklar
### Bu kaydın bağlandığı kayıtlar
- `Region` (`region`): başka bağlam (07-lojistik)
### Bu kayda dokunan kod
- `tradehub_core/entitlement/checks.py:118`: `parenttype = "Admin Seller Profile"` satırlarını okuyor
- `tradehub_core/entitlement/checks.py:132`: plan satırlarını okuyor
- `tradehub_core/services/abac_context.py:202`, `:215`: okuyor
- `tradehub_core/services/authorization_simulator.py:653`: okuyor
- `tradehub_core/utils/pii_compliance.py:316`: okuyor
### hooks.py kayıtları
- Kayıt yok.

## Bağımlılık sorunları
1. Aynı alt tablo iki farklı üst kayıtta kullanılıyor. Kanıt: `entitlement/checks.py:118` ve `:132`. Mağaza alanı bir patch ile özel alan olarak eklenmiş (`patches/v15_1_2_add_entitlement_custom_fields.py`). Plan ekibi tabloyu değiştirirse mağaza bölgesi bozulur.
2. Alt tablo üst kayıt olmadan doğrudan sorgulanıyor. Kanıt: dört farklı dosya.
3. `Region` lojistik bağlamında. Bölge aslında ortak kavram. Paylaşılan çekirdekte olabilir.

## Hedef tasarım
- Sahip bağlam: 02-satici-magaza. Paket yolu: `tradehub_core/seller/entitlement/`.
- Dışa açık fonksiyonlar: `get_store_regions(store) -> set[str]`, `get_plan_regions(plan) -> set[str]`.
- Olay yoktur.
- `region` Link alanı kalır. `Region` kararlı kök kayıt sayılır.

## Geçiş adımları
1. İki okuma fonksiyonunu ekleyin. Dört okuyucuyu bunlara bağlayın.
2. Mağaza bölgeleri için ayrı bir alt tablo açın. Örneğin `Store Region`. Veriyi taşıyın. Bu adım 1. adımdan sonra gelir.
3. `Region` kaydının yerini kararlaştırın. Paylaşılan çekirdek önerilir.

## Riskler ve testler
- Bölge kontrolü yanlış olursa satıcı yanlış bölgeye satış yapar. `tradehub_core/tests/test_abac_context.py` korunmalı.
