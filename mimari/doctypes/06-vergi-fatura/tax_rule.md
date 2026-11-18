# Tax Rule

- Bağlam: 06-vergi-fatura
- Tür: Ana kayıt
- Klasör: `tradehub_core/tradehub_core/doctype/tax_rule`
- Denetleyici: `tradehub_core/tradehub_core/doctype/tax_rule/tax_rule.py` (223 satır)
- Önerilen sahip bağlam: 06-vergi-fatura

## Epic

- Epic adı: Tax Rule: 06-vergi-fatura bağlamına taşıma
- Öncelik: Kritik
- Faz: Faz 3
- Tahmini büyüklük: Orta

### User story

Bir geliştirici olarak, vergi kuralı kaydının katalog tablolarına bağlı olmamasını istiyorum.
Böylece katalog şeması değişince vergi kuralı kaydedilebilir.

### Kabul kriterleri

- [ ] `tax_rule.py` ilan bilgisini `catalog.api.listings_using_tax_rules` ile alıyor.
- [ ] `tax_rule.changed` olayı yayınlanıyor. Katalog önbelleği bu olayla temizleniyor.
- [ ] `hooks.py:457` kaydı `api.listing` fonksiyonunu doğrudan çağırmıyor.
- [ ] `tax_core` testleri geçiyor.
- [ ] Characterization test: `Tax Rule` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- `tabListing Tax Rule` tablosunu ham SQL ile okumayın. Katalog okuma modelini kullanın.
- Kullanılan kural sürümünü silmeyin. `tax_rule.py:13` bunu engeller.
- Aynı ülke ve kod için çakışan tarih aralığı açmayın.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] Önbellek temizliği test edildi.
- [ ] `tax_core/test_integration.py` geçiyor.
- [ ] `import-linter` kontrolü geçiyor.
- [ ] Katalog ekibinden inceleme istendi.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?
`Tax Rule` tarihli bir vergi kuralıdır. Kural ülkeyi, vergi kodunu ve oranı tutar. Geçerlilik `valid_from` ve `valid_until` alanlarıyla sınırlanır. Kural bütün satıcılara ya da seçili satıcılara açık olabilir.

## Bugünkü bağımlılıklar
### Bu kaydın bağlandığı kayıtlar
- `Country` (`country`): framework kaydı
- `Tax Rule Seller` (`allowed_sellers`, alt tablo): aynı bağlam

### Bu kayda dokunan kod
- `tradehub_core/tax_core/service.py:88`: okuyor (tarihe göre geçerli sürüm)
- `tradehub_core/tax_core/service.py:106`: okuyor (`_rule_data`)
- `tradehub_core/tax_core/service.py:281`: okuyor (satıcıya açık kurallar)
- Yazım Desk formundan yapılır. Kodda yazan servis bulunmadı.

### Denetleyicinin kendi dış okumaları
- `tax_rule.py:23`: `tabListing Tax Rule` ve `tabListing` tablolarını ham SQL ile okur (03a-katalog).
- `tax_rule.py:114`: aynı tabloları ham SQL ile okur (ilan uyumluluğu).

### hooks.py kayıtları
- `hooks.py:457`: `on_update`, `after_insert` ve `on_trash` olayları `api.listing.invalidate_tax_rule_listing_cache` işleyicisini çağırır (03a-katalog).

## Bağımlılık sorunları
1. Vergi denetleyicisi katalog tablolarını ham SQL ile okuyor (`tax_rule.py:23`, `tax_rule.py:114`). Katalog `Listing Tax Rule` şemasını değiştirirse vergi kaydı kaydedilemez.
2. `hooks.py:457` vergi olayını doğrudan katalog fonksiyonuna bağlıyor (`api/listing.py:410`). Katalog bu fonksiyonun adını değiştirirse vergi kuralı kaydı düşer.

## Hedef tasarım
- Sahip bağlam: 06-vergi-fatura. Paket yolu: `tradehub_core/tax/`.
- Dışarıya açılan fonksiyonlar (`tax/api.py`):
  - `get_available_tax_rules(on_date, seller) -> list[TaxRuleView]`
  - `resolve_rule(name: str, on_date, seller) -> TaxRuleData`
- Yayınladığı olaylar: `tax_rule.changed`. Veri `rule`, `country`, `tax_code`, `valid_from`.
- Dinlediği olaylar: yok.
- 03a-katalog `tax_rule.changed` olayını dinler. Vitrin vergi önbelleğini kendisi temizler.
- İlan kontrolü için 03a-katalog bir okuma modeli verir: `catalog.api.listings_using_tax_rules(country, tax_code) -> list[str]`.
- Denetleyicide kalacak doğrulamalar: sürüm kimliği (`tax_rule.py:164`), tarih çakışması (`tax_rule.py:191`).

## Geçiş adımları
1. 03a-katalog `listings_using_tax_rules` okuma modelini eklesin. Bu adım önce gelir.
2. `tax_rule.py:23` ve `tax_rule.py:114` sorguları bu fonksiyonu çağırsın.
3. `tax_rule.changed` olayını yayınlayın. Önbellek temizliği hemen gerekir. Bu yüzden olay işlem içinde yerel dinleyiciye de verilebilir. Dinleyici katalog paketinde durur.
4. `hooks.py:457` kaydını vergi bağlamının kendi yayıncısına çevirin.

## Riskler ve testler
- Vitrin eski vergiyi gösterebilir. Test: kural değişince ilan fiyatı yeni oranla görünmeli.
- Kullanılan kural silinebilir. Var olan test korunmalı: `tax_core/test_integration.py`.
