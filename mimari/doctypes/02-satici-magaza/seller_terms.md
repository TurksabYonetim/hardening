# Seller Terms

- Bağlam: 02-satici-magaza
- Tür: Ana kayıt (mağaza başına tek kayıt)
- Klasör: `tradehub_core/tradehub_core/doctype/seller_terms`
- Denetleyici: `tradehub_core/tradehub_core/doctype/seller_terms/seller_terms.py` (71 satır)
- Önerilen sahip bağlam: 02-satici-magaza

## Epic

- Epic adı: Seller Terms: 02-satici-magaza bağlamına taşıma
- Öncelik: Önemli
- Faz: Faz 4
- Tahmini büyüklük: Orta

### User story

Bir satıcı olarak, satış koşullarımı yayımladığımda siparişlerin bu koşulu kullanmasını istiyorum.
Böylece alıcıyla anlaşmazlık çıkmaz.

### Kabul kriterleri

- [ ] `get_published_terms` fonksiyonu var. `api/cart.py` bu fonksiyonu kullanıyor.
- [ ] Denetleyici ödeme kuralını `payments.api.validate_payment_terms` ile doğruluyor.
- [ ] `contracts/tests/test_service.py` ve `test_seller_terms_api.py` geçiyor.
- [ ] Characterization test: `Seller Terms` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- Sepet kodundan `Seller Terms` tablosunu doğrudan okumayın.
- Denetleyiciden ödeme paketinin iç modülünü çağırmayın.
- Kapora ödeme modelini geri eklemeyin. Model kaldırıldı.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] Değişen davranış için önce başarısız olan test yazıldı.
- [ ] Ruff ve ilgili testler yerelde geçiyor.
- [ ] `import-linter` kontrolü yeni ihlal üretmiyor.
- [ ] `CODEOWNERS` içindeki 02-satici-magaza sahibi inceleyici olarak eklendi.
- [ ] Ödeme bağlamı (05) sahibi inceleyici olarak eklendi.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?
Bu kayıt mağazanın satış koşullarının taslağıdır. Ödeme modeli, ödeme yöntemleri, teslim şartı (Incoterms) ve iade süresi burada durur. Satıcı koşulları yayımlayınca değişmez bir sürüm oluşur. Sürüm `Seller Terms Version` kaydıdır.

## Bugünkü bağımlılıklar
### Bu kaydın bağlandığı kayıtlar
- `Admin Seller Profile` (`seller`): aynı bağlam
- `Seller Terms Version` (`current_version`): aynı bağlam
- `Currency` (`settlement_currency`): Frappe çekirdeği
### Bu kayda dokunan kod
- `tradehub_core/tradehub_core/doctype/seller_terms/seller_terms.py:58`: `payments.checkout_rules.validate_terms` çağırıyor
- `tradehub_core/contracts/service.py:215`, `:281`: kaydı açıyor ve güncel sürümü okuyor
- `tradehub_core/api/seller_terms.py:176`, `:210`: kaydı açıp güncelliyor
- `tradehub_core/api/cart.py:724`: yayımlanmış koşul var mı diye okuyor
- `tradehub_core/listing_purge/plan.py`: kalıcı silmede tabloyu biliyor
### hooks.py kayıtları
- Kayıt yok.

## Bağımlılık sorunları
1. Denetleyici ödeme kurallarına bağlı. Kanıt: `seller_terms.py:58`. Ödeme ekibi kuralı değiştirirse satıcı koşulları kaydedilmez. Bu bağ beklenen bir sözleşmedir. Ama açık bir API değil, iç modül.
2. Sepet kodu tabloyu doğrudan okuyor. Kanıt: `api/cart.py:724`. Sipariş bağlamı (04) satıcı tablosunu biliyor.
3. Olumlu nokta: iş kuralı `tradehub_core/contracts/service.py` içinde toplanmış. Bu dosya hedef paketin çekirdeği olabilir.

## Hedef tasarım
- Sahip bağlam: 02-satici-magaza. Paket yolu: `tradehub_core/seller/terms/`. Mevcut `tradehub_core/contracts/` paketi buraya taşınabilir.
- Dışa açık fonksiyonlar: `get_published_terms(store) -> TermsVersionRef | None`, `publish_terms(store)`.
- Ödeme bağlamı `payments.api.validate_payment_terms(terms) -> list[str]` fonksiyonunu açar. Denetleyici bunu çağırır.
- Yayınladığı olay: `seller.terms.published` (alan: `store`, `version`, `version_no`).
- Kalacak Link alanları: `seller`, `current_version`.
- Denetleyicide süre, teslim yeri ve ödeme modeli kuralları kalır.

## Geçiş adımları
1. `get_published_terms` fonksiyonunu ekleyin. `api/cart.py:724` satırını buna bağlayın.
2. Ödeme bağlamında `validate_payment_terms` açık fonksiyonunu tanımlayın. Denetleyiciyi buna bağlayın. Bu iş 05 ekibiyle ortak PR'dır.
3. `contracts/` paketini satıcı bağlamına taşıyın. Eski yolda yönlendirme bırakın.

## Riskler ve testler
- Yayımlanmamış koşulla sipariş verilmemeli. `tradehub_core/contracts/tests/test_service.py` korunmalı.
- API testi `tradehub_core/contracts/tests/test_seller_terms_api.py` korunmalı.
