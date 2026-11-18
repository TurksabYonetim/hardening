# Shipping Price Rule Tier

- Bağlam: 07-lojistik
- Tür: Alt tablo
- Klasör: `tradehub_core/tradehub_core/doctype/shipping_price_rule_tier`
- Denetleyici: `tradehub_core/tradehub_core/doctype/shipping_price_rule_tier/shipping_price_rule_tier.py` (10 satır)
- Önerilen sahip bağlam: 07-lojistik

## Epic

- Epic adı: Shipping Price Rule Tier: 07-lojistik bağlamına taşıma
- Öncelik: Düşük
- Faz: Faz 5
- Tahmini büyüklük: Küçük

### User story

Bir geliştirici olarak, `Shipping Price Rule Tier` kaydının lojistik modülünde durmasını istiyorum.
Böylece kaydın sahibi açık olur ve başka ekip kaydı yanlışlıkla değiştirmez.

### Kabul kriterleri

- [ ] DocType klasörü `tradehub_core/logistics/doctype/shipping_price_rule_tier/` altında duruyor.
- [ ] JSON dosyasındaki `module` alanı "Logistics" değerinde.
- [ ] `tabDocType` modül değerini güncelleyen yama tekrar çalışınca hata vermiyor.
- [ ] Taşıma üst kayıt `Shipping Price Rule` ile aynı PR içinde yapıldı.
- [ ] Characterization test: `Shipping Price Rule Tier` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- Desi aralığı doğrulamasını kaldırmayın. Çakışan aralık yanlış fiyat verir.
- Taşımayı önce test sitesinde denemeden canlıya göndermeyin. Modül değişikliği veritabanını etkiler.
- Bu tabloyu `Shipping Price Rule` kaydından ayrı taşımayın. Üst kayıt alt tabloyu bulamaz.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] Yama test sitesinde iki kez çalıştırıldı ve hata vermedi.
- [ ] `bench migrate` test sitesinde hatasız bitti.
- [ ] Taşıma sonrası `Shipping Price Rule` kaydı Desk ekranında açıldı.
- [ ] `test_pricing_engine.py` geçiyor.
- [ ] Lojistik ekibinden `CODEOWNERS` incelemesi istendi.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?

`Shipping Price Rule Tier`, `Shipping Price Rule` kaydının `tiers` alt tablosudur. Desi aralığına göre fiyatı tutar. Satırda temel ücret, desi başına ücret ve en düşük ücret vardır.

## Bugünkü bağımlılıklar

### Bu kaydın bağlandığı kayıtlar

- Link alanı yok.

### Bu kayda dokunan kod

- `tradehub_core/logistics/services/pricing_rule_service.py:47`: okuyor ve yazıyor.
- Aralık doğrulaması üst kayıtta yapılır (`tradehub_core/tradehub_core/doctype/shipping_price_rule/shipping_price_rule.py:122`).

### hooks.py kayıtları

- Kayıt yok.

## Bağımlılık sorunları

Önemli bir bağımlılık sorunu bulunmadı.

## Hedef tasarım

- Sahip bağlam ve paket yolu: 07-lojistik, `tradehub_core/logistics/doctype/shipping_price_rule_tier/`.
- Dışarıya açılan fonksiyonlar, olaylar ve bağlantılar: yok.

## Geçiş adımları

1. Üst kayıt `Shipping Price Rule` ile aynı PR içinde "Logistics" modülüne taşıyın.

## Riskler ve testler

- Desi aralıkları çakışabilir. Kademe aralığı testini koruyun.
