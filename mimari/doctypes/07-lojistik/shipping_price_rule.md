# Shipping Price Rule

- Bağlam: 07-lojistik
- Tür: Ana kayıt
- Klasör: `tradehub_core/tradehub_core/doctype/shipping_price_rule`
- Denetleyici: `tradehub_core/tradehub_core/doctype/shipping_price_rule/shipping_price_rule.py` (159 satır)
- Önerilen sahip bağlam: 07-lojistik

## Epic

- Epic adı: Shipping Price Rule: 07-lojistik bağlamına taşıma
- Öncelik: Önemli
- Faz: Faz 3
- Tahmini büyüklük: Orta

### User story

Bir geliştirici olarak, kargo fiyatının KDV oranını vergi bağlamından almasını istiyorum.
Böylece vergi kuralı tek yerde durur.

### Kabul kriterleri

- [ ] Vergi bağlamında `rate_for_listing` fonksiyonu var.
- [ ] `pricing_engine.py` artık `utils.pricing_rates` modülünü içe aktarmıyor.
- [ ] `tax_rate` alanının kalıp kalmayacağı ürün sahibiyle yazılı karar olarak kaydedildi.
- [ ] `test_pricing_engine.py` ve `test_pricing_rules_api.py` geçiyor. Kargo fiyatları değişmedi.
- [ ] Characterization test: `Shipping Price Rule` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- KDV oranını lojistik kodunda yeniden hesaplamayın. Oran vergi bağlamından gelir.
- Kademe aralığı doğrulamasını kaldırmayın. Çakışan aralık yanlış fiyat verir.
- Kuralı kullanan sevkiyat varken kuralı silmeyin.
- Kural alanı ekleyince `pricing_rule_service.py` alan listesini unutmayın.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] Fiyat testleri geçiyor.
- [ ] Vergi ekibinden `CODEOWNERS` incelemesi istendi.
- [ ] `import-linter` kontrolü geçiyor.
- [ ] Örnek bir sepet için fiyat önce ve sonra karşılaştırıldı.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?

`Shipping Price Rule` kargo fiyat kuralını tutar. Kural bir tarife ya da bir düzeltme olabilir. Kural taşıyıcıya, yönteme, bölgeye ve ağırlığa göre seçilir. Desi kademeleri ve ek ücretler alt tablolardadır.

## Bugünkü bağımlılıklar

### Bu kaydın bağlandığı kayıtlar

- `Admin Seller Profile` (`seller_profile`): başka bağlam (02-satici-magaza)
- `Currency` (`currency`): çekirdek Frappe kaydı
- `Carrier Account` (`carrier_account`): aynı bağlam
- `Logistics Provider` (`carrier`): aynı bağlam
- `Carrier Service` (`carrier_service`): aynı bağlam
- `Shipping Method` (`shipping_method`): aynı bağlam
- `Shipping Zone` (`zone`): aynı bağlam
- `Shipping Price Rule Tier` (`tiers`, alt tablo): aynı bağlam
- `Shipping Price Rule Surcharge` (`surcharges`, alt tablo): aynı bağlam

### Bu kayda dokunan kod

- `tradehub_core/logistics/services/pricing_rule_service.py:46`: okuyor ve yazıyor. Kural yönetim servisi.
- `tradehub_core/logistics/services/pricing_engine.py:59`: okuyor. Fiyat hesabında kuralları kullanıyor.
- `tradehub_core/logistics/services/pricing_rule_service.py:615`: okuyor. Kuralı kullanan sevkiyat sayısını buluyor.
- `tradehub_core/api/v1/seller_shipping.py:54`: okuyor.

### hooks.py kayıtları

- Kayıt yok.

## Bağımlılık sorunları

1. Kural kendi `tax_rate` alanını taşıyor. Fiyat motoru ayrıca katalogdaki KDV oranını okuyor. Kanıt: `tradehub_core/logistics/services/pricing_engine.py:311`. Vergi kuralı iki yerde duruyor. Vergi ekibi bir oranı değiştirirse kargo fiyatı farklı sonuç verebilir (06-vergi-fatura).
2. Fiyat motoru `utils.pricing` ve `utils.pricing_rates` modüllerine bağlı. Kanıt: `tradehub_core/logistics/services/pricing_engine.py:53`. Bu modüllerin sahibi belirsiz.

## Hedef tasarım

- Sahip bağlam ve paket yolu: 07-lojistik, `tradehub_core/logistics/doctype/shipping_price_rule/`.
- Dışarıya açılan fonksiyonlar: `quote_order(lines, method, address) -> ShippingQuote`. Fonksiyon `Shipping Method` raporunda da geçer.
- Yayınladığı olaylar: `logistics.pricing_changed`. Sepet önbelleği bu olayı dinleyebilir.
- Dinlediği olaylar: yok.
- Başka bağlamlara bağlantılar: KDV oranı vergi bağlamının genel fonksiyonundan okunur. Örneğin `tax.api.rate_for_listing(listing)`.
- Denetleyicide kalacak doğrulamalar: temel alanlar, ölçüt, kademe aralıkları, ek ücret satırları.

## Geçiş adımları

1. Vergi bağlamı `rate_for_listing` fonksiyonunu açsın.
2. `pricing_engine.py:54` içe aktarmasını bu fonksiyona çevirin.
3. Ürün sahibiyle `tax_rate` alanının hâlâ gerekli olup olmadığına karar verin.
4. DocType klasörünü "Logistics" modülüne taşıyın.

## Riskler ve testler

- Kargo fiyatı değişebilir. `tradehub_core/logistics/tests/test_pricing_engine.py` testlerini her adımda çalıştırın.
