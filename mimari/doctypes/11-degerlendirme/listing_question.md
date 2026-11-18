# Listing Question

- Bağlam: 11-degerlendirme
- Tür: Ana kayıt
- Klasör: `tradehub_core/tradehub_core/doctype/listing_question`
- Denetleyici: `tradehub_core/tradehub_core/doctype/listing_question/listing_question.py` (31 satır)
- Önerilen sahip bağlam: 11-degerlendirme

## Epic

- Epic adı: Listing Question: 11-degerlendirme bağlamına taşıma
- Öncelik: Önemli
- Faz: Faz 4
- Tahmini büyüklük: Orta

### User story

Bir geliştirici olarak, soru kodunun başka bağlamların tablolarını doğrudan okumamasını istiyorum.
Böylece satıcı ve katalog değişiklikleri soru akışını bozmaz.

### Kabul kriterleri

- [ ] SEO kodu soruları yalnız `reviews.api.list_answered_questions` ile okuyor.
- [ ] KYB bilgisi 02-satici-magaza bağlamının `is_kyb_verified(user)` fonksiyonundan geliyor.
- [ ] `Listing.seller_profile` okuması katalog okuma fonksiyonuyla yapılıyor.
- [ ] `api/qa.py` içinde `frappe.db.commit()` çağrısı kalmıyor.
- [ ] Gereksiz kiracı kancaları `hooks.py` kaydından kaldırıldı.
- [ ] Characterization test: `Listing Question` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- `KYB Verification` tablosunu doğrudan okumayın. Satıcı bağlamının fonksiyonunu kullanın.
- SEO kodunun soru tablosunu doğrudan okumasına izin vermeyin. Okuma fonksiyonu açın.
- API uçlarına yeni `frappe.db.commit()` eklemeyin. Bu çağrı Outbox desenini bozar.
- Satıcı alanı olmayan bu kayda kiracı kancası eklemeyin. Kanca burada iş yapmaz.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] Soru sorma ve listeleme testleri geçiyor.
- [ ] SEO çıktısı için önce ve sonra karşılaştırma testi eklendi.
- [ ] `import-linter` kontrolü geçiyor.
- [ ] Kaldırılan kiracı kancası için izin testi çalıştırıldı.
- [ ] SEO bağlamının `CODEOWNERS` sahibinden inceleme istendi.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?
Alıcı, ürün sayfasında satıcıya soru sorar. Bu kayıt soruyu tutar. Cevap gelince durum "Answered" olur. Satıcı soruyu kendi panelinden gizleyebilir.

## Bugünkü bağımlılıklar
### Bu kaydın bağlandığı kayıtlar
- `Listing` (`listing`): başka bağlam (03a-katalog)
- `User` (`asker`): başka bağlam (01-kimlik-erisim)
### Bu kayda dokunan kod
- `tradehub_core/api/qa.py:71`: yazıyor (yeni soru)
- `tradehub_core/api/qa.py:107`: yazıyor (soru düzenleme)
- `tradehub_core/api/qa.py:247`: yazıyor (`answer_count` ve `status`)
- `tradehub_core/api/qa.py:423` ve `tradehub_core/api/qa.py:450`: yazıyor (satıcı gizleme bayrağı)
- `tradehub_core/api/qa.py:768`: yazıyor (`status = Hidden`)
- `tradehub_core/privacy/account_deletion.py:316`: yazıyor (soran adını anonim yapar). Bu kod 13-uyum-gizlilik bağlamındadır.
- `tradehub_core/privacy/data_export.py:184`: okuyor
- `tradehub_core/seo/schema_builder.py:1289`: okuyor (SSS yapısal verisi). Bu kod 10-seo bağlamındadır.
- `tradehub_core/api/storefront_api.py:77`: okuyor
- `tradehub_core/media/file_isolation.py:124`: okuyor
### hooks.py kayıtları
- `tradehub_core/hooks.py:938`: `before_insert` ve `validate` kiracı kancaları.
- `tradehub_core/hooks.py:1088` ve `tradehub_core/hooks.py:1215`: okuma izni kuralları (`tradehub_core/permissions.py:1014`, `tradehub_core/permissions.py:1032`).

## Bağımlılık sorunları
1. Denetleyici satıcı bağlamının tablosunu okuyor. `_populate_kyb_flag` `KYB Verification` kaydını okur (`listing_question.py:30`). Aynı okuma `tradehub_core/api/qa.py:51` satırında da vardır.
2. Satıcı yetkisi katalog tablosundan bulunuyor. `tradehub_core/api/qa.py:93` `Listing.seller_profile` alanını okur.
3. Kiracı kancaları iş yapmaz. Kayıtta satıcı alanı yoktur (`tradehub_core/utils/tenant.py:237`).
4. SEO kodu bu tabloyu doğrudan okuyor (`tradehub_core/seo/schema_builder.py:1289`). Soru alanları değişirse SEO çıktısı bozulur.
5. API uçları işlemi kendisi bitiriyor. `tradehub_core/api/qa.py:80` ve diğer yedi yerde `frappe.db.commit()` vardır.

## Hedef tasarım
- Sahip bağlam ve paket yolu: `tradehub_core/reviews/qa/`.
- Dışarıya açılan fonksiyonlar:
  - `reviews.api.ask_question(listing, question)`
  - `reviews.api.list_answered_questions(listing, limit)`. SEO bu fonksiyonu okur.
  - `reviews.api.anonymize_asker(user)`
- Yayınladığı olaylar: `question.asked` (question, listing, seller) ve `question.answered` (question, listing).
- Dinlediği olaylar: `user.erased` (user) ve `catalog.listing_deleted` (listing).
- `listing` ve `asker` Link alanları kalır. `asker_display_name` ve `is_kyb_verified` anlık görüntü alanlarıdır.
- Denetleyicide durum varsayılanı kalır. KYB okuması servise taşınır.

## Geçiş adımları
1. `reviews.api.list_answered_questions` fonksiyonunu ekleyin. SEO kodunu bu fonksiyona çevirin.
2. KYB okumasını 02-satici-magaza bağlamının `is_kyb_verified(user)` fonksiyonuna çevirin.
3. `Listing.seller_profile` okumasını katalog okuma fonksiyonuna çevirin.
4. Gereksiz kiracı kancalarını kaldırın.
5. `frappe.db.commit()` çağrılarını kaldırın. Bu adım Outbox kurulmadan önce yapılmalıdır.

## Riskler ve testler
- SEO sayfasında SSS kaybolabilir. Cevaplı sorunun SEO verisinde göründüğünü sınayın.
- Satıcı başka satıcının sorusunu görebilir. Okuma izni testini koruyun.
