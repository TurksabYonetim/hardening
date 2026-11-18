# Listing Question Answer

- Bağlam: 11-degerlendirme
- Tür: Ana kayıt
- Klasör: `tradehub_core/tradehub_core/doctype/listing_question_answer`
- Denetleyici: `tradehub_core/tradehub_core/doctype/listing_question_answer/listing_question_answer.py` (55 satır)
- Önerilen sahip bağlam: 11-degerlendirme

## Epic

- Epic adı: Listing Question Answer: 11-degerlendirme bağlamına taşıma
- Öncelik: Önemli
- Faz: Faz 4
- Tahmini büyüklük: Küçük

### User story

Bir geliştirici olarak, cevap kaydının iç API fonksiyonlarına bağlı olmamasını istiyorum.
Böylece `api/qa.py` değişince cevap kaydı bozulmaz.

### Kabul kriterleri

- [ ] Cevap sayısı hesabı `reviews/qa/services.py` içinde duruyor. Denetleyici bu servisi çağırıyor.
- [ ] Denetleyici `tradehub_core.api.qa` modülünü içe aktarmıyor.
- [ ] Satıcı kullanıcısı 02-satici-magaza okuma fonksiyonuyla bulunuyor.
- [ ] Olay yayınlayıcısı hazırsa `question.answered` olayı yayınlanıyor.
- [ ] Characterization test: `Listing Question Answer` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- Denetleyiciden alt çizgili iç API fonksiyonlarını çağırmayın. Servis fonksiyonu kullanın.
- `Listing` ve `Admin Seller Profile` tablolarını doğrudan okumayın. Okuma fonksiyonu kullanın.
- Alıcıya bildirim göndermek için bildirim kodunu doğrudan çağırmayın. Olay yayınlayın.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] Cevap ekleme ve silme sonrası sayaç testi eklendi.
- [ ] Cevap türü (satıcı, alıcı, yönetici) testi geçiyor.
- [ ] `import-linter` kontrolü geçiyor.
- [ ] `question.answered` olayı için sözleşme testi eklendi.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?
Satıcı, alıcı ya da yönetici bir soruya cevap yazar. Bu kayıt tek bir cevabı tutar. Sistem cevaplayanın türünü kendisi bulur.

## Bugünkü bağımlılıklar
### Bu kaydın bağlandığı kayıtlar
- `Listing Question` (`question`): aynı bağlam
- `User` (`responder`): başka bağlam (01-kimlik-erisim)
### Bu kayda dokunan kod
- `tradehub_core/api/qa.py:203`: okuyor
- `tradehub_core/api/qa.py:320`: yazıyor (yeni cevap)
- `tradehub_core/api/qa.py:289`: okuyor (satıcı cevabı var mı)
- `tradehub_core/listing_purge/preview.py:22`: okuyor
### hooks.py kayıtları
- Kayıt yoktur.

## Bağımlılık sorunları
1. Denetleyici iki başka bağlamı okuyor. `_auto_set_responder_type` `Listing.seller_profile` (03a-katalog) ve `Admin Seller Profile.user` (02-satici-magaza) alanlarını okur (`listing_question_answer.py:41`, `listing_question_answer.py:43`).
2. Denetleyici API modülünü içe aktarıyor. `after_insert` `tradehub_core.api.qa._recompute_question_answer_count` çağırır (`listing_question_answer.py:23`). Alt çizgili bir iç fonksiyon dışarıdan kullanılıyor.

## Hedef tasarım
- Sahip bağlam ve paket yolu: `tradehub_core/reviews/qa/`.
- Dışarıya açılan fonksiyon: `reviews.api.answer_question(question, answer)`.
- Yayınladığı olay: `question.answered` (question, listing, responder_type). Bildirim bağlamı bu olayla alıcıya haber verir.
- Dinlediği olay yoktur.
- `question` ve `responder` Link alanları kalır.
- Satıcı kullanıcısı 02-satici-magaza okuma fonksiyonuyla bulunur. Örneğin `seller.api.get_listing_owner_user(listing)`.

## Geçiş adımları
1. Cevap sayısı hesabını `reviews/qa/services.py` içine taşıyın. Denetleyici bu servisi çağırsın.
2. Satıcı kullanıcısı okumasını okuma fonksiyonuna çevirin.
3. `question.answered` olayını yayınlayın. Bu adım olay yayınlayıcısı hazır olunca yapılır.

## Riskler ve testler
- Satıcı cevabı yanlışlıkla alıcı cevabı sayılabilir. Üç cevaplayan türü için test ekleyin.
- Sorunun durumu "Answered" olmayabilir. Cevap silme ve ekleme sonrası durumu sınayın.
