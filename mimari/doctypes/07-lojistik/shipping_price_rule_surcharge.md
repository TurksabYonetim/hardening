# Shipping Price Rule Surcharge

- Bağlam: 07-lojistik
- Tür: Alt tablo
- Klasör: `tradehub_core/tradehub_core/doctype/shipping_price_rule_surcharge`
- Denetleyici: `tradehub_core/tradehub_core/doctype/shipping_price_rule_surcharge/shipping_price_rule_surcharge.py` (10 satır)
- Önerilen sahip bağlam: 07-lojistik

## Epic

- Epic adı: Shipping Price Rule Surcharge: 07-lojistik bağlamına taşıma
- Öncelik: Düşük
- Faz: Faz 5
- Tahmini büyüklük: Küçük

### User story

Bir geliştirici olarak, `Shipping Price Rule Surcharge` kaydının lojistik modülünde durmasını istiyorum.
Böylece kaydın sahibi açık olur ve başka ekip kaydı yanlışlıkla değiştirmez.

### Kabul kriterleri

- [ ] DocType klasörü `tradehub_core/logistics/doctype/shipping_price_rule_surcharge/` altında duruyor.
- [ ] JSON dosyasındaki `module` alanı "Logistics" değerinde.
- [ ] `tabDocType` modül değerini güncelleyen yama tekrar çalışınca hata vermiyor.
- [ ] Taşıma üst kayıt `Shipping Price Rule` ile aynı PR içinde yapıldı.
- [ ] Characterization test: `Shipping Price Rule Surcharge` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- Ek ücret doğrulamasını alt tabloya taşımayın. Doğrulama üst kayıtta durur.
- Taşımayı önce test sitesinde denemeden canlıya göndermeyin. Modül değişikliği veritabanını etkiler.
- Bu tabloyu `Shipping Price Rule` kaydından ayrı taşımayın. Üst kayıt alt tabloyu bulamaz.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] Yama test sitesinde iki kez çalıştırıldı ve hata vermedi.
- [ ] `bench migrate` test sitesinde hatasız bitti.
- [ ] Taşıma sonrası `Shipping Price Rule` kaydı Desk ekranında açıldı.
- [ ] `test_pricing_rules_api.py` geçiyor.
- [ ] Lojistik ekibinden `CODEOWNERS` incelemesi istendi.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?

`Shipping Price Rule Surcharge`, `Shipping Price Rule` kaydının `surcharges` alt tablosudur. Kurala eklenen ek ücreti tutar. Örneğin yakıt farkı bir ek ücrettir. Ücret sabit tutar ya da yüzde olabilir.

## Bugünkü bağımlılıklar

### Bu kaydın bağlandığı kayıtlar

- Link alanı yok.

### Bu kayda dokunan kod

- `tradehub_core/logistics/services/pricing_rule_service.py:48`: okuyor ve yazıyor.
- Doğrulama üst kayıtta yapılır (`tradehub_core/tradehub_core/doctype/shipping_price_rule/shipping_price_rule.py:147`).

### hooks.py kayıtları

- Kayıt yok.

## Bağımlılık sorunları

Önemli bir bağımlılık sorunu bulunmadı.

## Hedef tasarım

- Sahip bağlam ve paket yolu: 07-lojistik, `tradehub_core/logistics/doctype/shipping_price_rule_surcharge/`.
- Dışarıya açılan fonksiyonlar, olaylar ve bağlantılar: yok.

## Geçiş adımları

1. Üst kayıt `Shipping Price Rule` ile aynı PR içinde "Logistics" modülüne taşıyın.

## Riskler ve testler

- Eksi ek ücret yanlışlıkla kabul edilebilir. Ek ücret doğrulama testini koruyun.
