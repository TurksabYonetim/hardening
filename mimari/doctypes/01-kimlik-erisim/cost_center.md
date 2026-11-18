# Cost Center

- Bağlam: 01-kimlik-erisim
- Tür: Ana kayıt (ağaç yapısı)
- Klasör: `tradehub_core/tradehub_core/doctype/cost_center`
- Denetleyici: `tradehub_core/tradehub_core/doctype/cost_center/cost_center.py` (39 satır)
- Önerilen sahip bağlam: 04-siparis. Kayıt alıcının satın alma bütçesini tutar. Tek kullanıcısı sipariş oluşturma kapısıdır.

## Epic

- Epic adı: Cost Center: 04-siparis bağlamına taşıma
- Öncelik: Önemli
- Faz: Faz 3
- Tahmini büyüklük: Orta

### User story

Bir geliştirici olarak, bütçe kontrolünü sipariş bağlamında toplamak istiyorum.
Böylece bütçe kodu siparişi beklenmedik yerden durdurmaz.

### Kabul kriterleri

- [ ] `services/cost_center.py` kodu `tradehub_core/ordering/procurement/` altında duruyor.
- [ ] Aylık harcama ayrı bir özet tablosunda tutuluyor. Özet `order.confirmed` ve `order.cancelled` olaylarıyla güncelleniyor.
- [ ] İptal edilen sipariş bütçeden düşüyor. Test geçiyor.
- [ ] `tradehub_core/tests/test_procurement.py` geçiyor.
- [ ] Characterization test: `Cost Center` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- Bütçe kodunda sipariş durum adlarını düz metin olarak yazmayın. Durumları sipariş sözleşmesinden alın.
- ERPNext `Cost Center` kaydıyla aynı adı kullanan yeni kod eklemeyin. Ad çakışması kararı önce verilmeli.
- `Order.before_insert` için `hooks.py` içine yeni kayıt eklemeyin.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] Değişen davranış için önce başarısız olan test yazıldı.
- [ ] Ruff ve ilgili testler yerelde geçiyor.
- [ ] `import-linter` kontrolü yeni ihlal üretmiyor.
- [ ] `CODEOWNERS` içindeki 04-siparis sahibi inceleyici olarak eklendi.
- [ ] ERPNext kurulu test sitesinde ad çakışması denendi.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?
Bu kayıt alıcı şirketin masraf merkezidir. Departman bazında aylık bütçe tutar. Kayıtlar ağaç yapısındadır (`NestedSet`). Sipariş oluşunca bütçe aşımı kontrol edilir.

## Bugünkü bağımlılıklar
### Bu kaydın bağlandığı kayıtlar
- `Admin Seller Profile` (`tenant`): başka bağlam (02-satici-magaza)
- `Cost Center` (`parent_cost_center`): aynı kayıt
- `CRM Organization` (`linked_organization`): dış uygulama
- `Currency` (`currency`): Frappe çekirdeği
### Bu kayda dokunan kod
- `tradehub_core/tradehub_core/doctype/cost_center/cost_center.py:22`, `:32`: üst kaydın kiracı ve para birimini okuyor
- `tradehub_core/services/cost_center.py:48`, `:108`, `:194`: okuyor
- `tradehub_core/services/cost_center.py:84`: aylık harcama için `Order` tablosunu okuyor
- `tradehub_core/api/v1/procurement.py:126`, `:128`, `:150`: oluşturuyor, güncelliyor, siliyor
### hooks.py kayıtları
- `tradehub_core/hooks.py:1130`: `permission_query_conditions`
- `tradehub_core/hooks.py:1253`: `has_permission`
- `tradehub_core/hooks.py:705`: `Order.before_insert` olayı `services.cost_center.validate_order_cost_center` çağırıyor

## Bağımlılık sorunları
1. Sipariş kaydı bütçe servisine doğrudan bağlı. Kanıt: `tradehub_core/hooks.py:705`. Bütçe kodu hata verirse sipariş oluşmaz.
2. Bütçe servisi `Order` tablosunu doğrudan okuyor. Kanıt: `tradehub_core/services/cost_center.py:84`. Sipariş durum adları değişirse harcama yanlış hesaplanır. Kod açıklaması durumların Türkçe olduğunu söylüyor (`cost_center.py:80`).
3. Alıcı bütçesi `Admin Seller Profile` ile kiracıya bağlanıyor. Kanıt: alan `tenant` (JSON). Alıcının kurum kaydı yerine satıcı mağazası kullanılıyor. Model karışıklığı riski var (doğrulanmadı: alıcılar için mağaza kaydı mı açılıyor).
4. Kayıt adı ERPNext içindeki `Cost Center` adıyla aynı. ERPNext kurulu sitede ad çakışması olabilir (doğrulanmadı).

## Hedef tasarım
- Sahip bağlam: 04-siparis. Paket yolu: `tradehub_core/ordering/procurement/`.
- Dışa açık fonksiyonlar: `get_cost_center_tree(tenant)`, `check_budget(cost_center, amount, currency) -> BudgetDecision`.
- Sipariş bağlamının içinde olduğu için `Order` okuması iç okumadır.
- Dinlediği olaylar: `order.confirmed` ve `order.cancelled` gelince aylık harcama özetini günceller.
- Kalacak Link: `tenant` ve `currency`.
- Denetleyicide üst kayıtla kiracı ve para birimi uyumu kalır.

## Geçiş adımları
1. `services/cost_center.py` dosyasını `tradehub_core/ordering/procurement/` altına taşıyın.
2. Aylık harcamayı ayrı bir özet tablosunda tutun. Olay gelince güncelleyin. Bu adım olay altyapısından sonra gelir.
3. JSON `module` alanını sipariş modülüne taşıyın.
4. ERPNext ad çakışmasını kontrol edin. Gerekirse adı `Buyer Cost Center` yapın. Bu adım ayrı bir karar ister.

## Riskler ve testler
- Bütçe kontrolü siparişi engelleyebilir. `tradehub_core/tests/test_procurement.py` testleri korunmalı.
- İptal edilen sipariş bütçeden düşmeli. İptal testi ekleyin.
