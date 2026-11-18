# Seller Terms Version

- Bağlam: 02-satici-magaza
- Tür: Kayıt defteri (değişmez sürüm)
- Klasör: `tradehub_core/tradehub_core/doctype/seller_terms_version`
- Denetleyici: `tradehub_core/tradehub_core/doctype/seller_terms_version/seller_terms_version.py` (13 satır)
- Önerilen sahip bağlam: 02-satici-magaza

## Epic

- Epic adı: Seller Terms Version: 02-satici-magaza bağlamına taşıma
- Öncelik: Önemli
- Faz: Faz 4
- Tahmini büyüklük: Küçük

### User story

Bir geliştirici olarak, satış koşulu sürümünü tipli bir fonksiyonla okumak istiyorum.
Böylece JSON biçimi değişince iade ve ödeme bozulmaz.

### Kabul kriterleri

- [ ] `TermsSnapshot` tipi ve `get_terms_snapshot` fonksiyonu var.
- [ ] `payments/` ve `logistics/` içinde `terms_snapshot_json` doğrudan okunmuyor.
- [ ] Eski sürüm JSON ile geriye uyum testi geçiyor.
- [ ] Characterization test: `Seller Terms Version` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- Yayımlanmış sürümü değiştirmeyin ve silmeyin.
- JSON içindeki anahtarı silmeyin. Yeni anahtar eklenebilir.
- Başka bağlamdan bu kaydı `get_doc` ile açıp yazmayın.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] Değişen davranış için önce başarısız olan test yazıldı.
- [ ] Ruff ve ilgili testler yerelde geçiyor.
- [ ] `import-linter` kontrolü yeni ihlal üretmiyor.
- [ ] `CODEOWNERS` içindeki 02-satici-magaza sahibi inceleyici olarak eklendi.
- [ ] Ödeme (05) ve lojistik (07) sahipleri inceleyici olarak eklendi.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?
Bu kayıt yayımlanmış satış koşullarının değişmez kopyasıdır. Koşulların metni ve özeti (hash) saklanır. `terms_snapshot_json` alanı koşulların anlık görüntüsüdür. Sipariş bu sürümü kabul eder. Kayıt değiştirilemez ve silinemez.

## Bugünkü bağımlılıklar
### Bu kaydın bağlandığı kayıtlar
- `Admin Seller Profile` (`seller`): aynı bağlam
- `User` (`published_by`): Frappe çekirdeği
- Bu kayda bağlananlar: `Seller Terms` (02), `Order Contract Acceptance` (04-siparis), `Payment Installment Plan` (05-odeme)
### Bu kayda dokunan kod
- `tradehub_core/contracts/service.py:241`, `:284`: sürüm numarasını ve alanları okuyor
- `tradehub_core/payments/terms_plan.py:43`: `terms_snapshot_json` okuyor
- `tradehub_core/payments/checkout_plans.py:40`, `:85`: sürümü `get_doc` ile açıyor
- `tradehub_core/logistics/return_shipping.py:56`: iade kuralları için `terms_snapshot_json` okuyor
- `tradehub_core/shared_sync/customer_documents.py:61`: okuyor
- `tradehub_core/api/contracts.py:186`: okuyor
### hooks.py kayıtları
- Kayıt yok.

## Bağımlılık sorunları
1. Üç bağlam JSON alanını doğrudan okuyor. Kanıt: `payments/terms_plan.py:43`, `logistics/return_shipping.py:56`, `payments/checkout_plans.py:40`. JSON içindeki anahtar adları sözleşme sayılmalı. Bugün bu sözleşme yazılı değil.
2. Önemli başka bir sorun yok. Kayıt değişmez olduğu için okumak güvenli.

## Hedef tasarım
- Sahip bağlam: 02-satici-magaza. Paket yolu: `tradehub_core/seller/terms/`.
- Dışa açık fonksiyon: `get_terms_snapshot(version) -> TermsSnapshot`. `TermsSnapshot` tipi `seller/contracts.py` içinde tanımlanır. Alanlar: ödeme modeli, iade süresi, teslim şartı.
- Bu kayıt belgelenmiş bir okuma modelidir. Diğer bağlamlar yalnız `get_terms_snapshot` üzerinden okur.
- Kalacak Link alanları: diğer bağlamlardan gelen `seller_terms_version` linkleri kalır. Sürüm değişmediği için bağ güvenlidir.
- Denetleyicide değişmezlik ve silme yasağı kalır.

## Geçiş adımları
1. `TermsSnapshot` tipini ve `get_terms_snapshot` fonksiyonunu ekleyin.
2. Ödeme ve lojistik okumalarını buna bağlayın. Her bağlam ayrı PR olsun.
3. JSON anahtarları için sürüm alanı ekleyin. Örneğin `schema_version`.

## Riskler ve testler
- JSON biçimi değişirse eski siparişlerin iadesi bozulur. Eski sürüm JSON ile geriye uyum testi ekleyin.
