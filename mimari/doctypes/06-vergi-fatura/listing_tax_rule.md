# Listing Tax Rule

- Bağlam: 06-vergi-fatura
- Tür: Alt tablo
- Klasör: `tradehub_core/tradehub_core/doctype/listing_tax_rule`
- Denetleyici: `tradehub_core/tradehub_core/doctype/listing_tax_rule/listing_tax_rule.py` (5 satır)
- Önerilen sahip bağlam: 03a-katalog. Bu tablo `Listing` kaydının alt tablosudur (`listing.json:452`). Satırı katalog yazar. Bağlamlar arası alt tablo yazımı yasak olduğu için sahibi `Listing` sahibi olmalıdır.

## Epic

- Epic adı: Listing Tax Rule: 03a-katalog bağlamına taşıma
- Öncelik: Kritik
- Faz: Faz 3
- Tahmini büyüklük: Orta

### User story

Bir geliştirici olarak, ilanın vergi satırlarının tek bir sahibi olmasını istiyorum.
Böylece katalog ve vergi geliştiricisi aynı alanı bozmaz.

### Kabul kriterleri

- [ ] Satırları yalnız katalog yazıyor.
- [ ] `profile_from_listing` ilan belgesi yerine `TaxProfileInput` alıyor.
- [ ] Aynı ilan eski ve yeni girdiyle aynı vergiyi üretiyor.
- [ ] Vergi kodu bu tabloyu ham SQL ile okumuyor.
- [ ] Characterization test: `Listing Tax Rule` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- Vergi kodundan bu alt tabloya yazmayın. Tablo `Listing` kaydının parçasıdır.
- Bir sürüm kimliğini elle başka sürüme çevirmeyin. Kural sürümü tarihle çözülür.
- `module` alanını Faz 5 öncesinde değiştirmeyin.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] Vergi eşitlik testi eklendi.
- [ ] `tax_core/test_exhaustive_matrix.py` geçiyor.
- [ ] Katalog ve vergi ekibinden inceleme istendi.
- [ ] `import-linter` kontrolü geçiyor.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?
`Listing Tax Rule` bir ilana atanmış vergi kuralını tutar. Satır kuralı, sırasını ve vergi matrahı biçimini tutar. Matrah biçimi "Base Price", "Cumulative" ya da "Selected Previous" olabilir.

## Bugünkü bağımlılıklar
### Bu kaydın bağlandığı kayıtlar
- `Tax Rule` (`tax_rule`): başka bağlam (06-vergi-fatura)

### Bu kayda dokunan kod
- `tradehub_core/tax_core/service.py:161`: okuyor (`listing.tax_rules` alanından profil kurar)
- `tradehub_core/tradehub_core/doctype/tax_rule/tax_rule.py:23`: okuyor (ham SQL)
- `tradehub_core/tradehub_core/doctype/tax_rule/tax_rule.py:114`: okuyor (ham SQL)
- `tradehub_core/tradehub_core/doctype/listing/listing.py:74`: okuyor (`validate_listing_tax_configuration` çağrısı)
- Ad ile doğrudan yazım bulunmadı. Satırlar `Listing` kaydıyla birlikte yazılır.

### hooks.py kayıtları
- Kayıt yok.

## Bağımlılık sorunları
1. Tablo vergi bağlamında görünüyor ama `Listing` kaydının parçası. Katalog geliştiricisi ile vergi geliştiricisi aynı alanı değiştirir. Kanıt: `listing.json:452` ve `tax_rule.py:114`.
2. Vergi denetleyicisi bu tabloyu ham SQL ile okuyor (`tax_rule.py:23`).

## Hedef tasarım
- Sahip bağlam: 03a-katalog. Paket yolu: `tradehub_core/catalog/`.
- 06-vergi-fatura bu satırı yazmaz. Vergi bağlamı yalnız doğrulama fonksiyonunu verir: `tax.api.validate_listing_tax_configuration(listing_tax_input)`.
- Katalog vergi bağlamına bir okuma modeli verir: `catalog.api.listings_using_tax_rules(...)`.
- `tax_rule` Link alanı kalır. `Tax Rule` kararlı bir ana kayıttır.
- Olay yoktur.

## Geçiş adımları
1. DocType JSON `module` alanını katalog modülüne çevirin. Bu adım 03a-katalog sahibiyle yapılır.
2. `tax_core.service.profile_from_listing` fonksiyonu ilan belgesi yerine sade bir girdi alsın. Örnek: `TaxProfileInput(seller, tax_mode, tax_behavior, rules)`. Katalog bu girdiyi kendisi hazırlar.
3. `Tax Rule` raporundaki 1. ve 2. adımı uygulayın.

## Riskler ve testler
- İlan vergisi yanlış hesaplanabilir. Test: aynı ilan eski ve yeni girdiyle aynı vergiyi üretmeli.
