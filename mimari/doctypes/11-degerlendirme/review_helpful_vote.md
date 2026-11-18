# Review Helpful Vote

- Bağlam: 11-degerlendirme
- Tür: Ana kayıt
- Klasör: `tradehub_core/tradehub_core/doctype/review_helpful_vote`
- Denetleyici: `tradehub_core/tradehub_core/doctype/review_helpful_vote/review_helpful_vote.py` (41 satır)
- Önerilen sahip bağlam: 11-degerlendirme

## Epic

- Epic adı: Review Helpful Vote: 11-degerlendirme bağlamına taşıma
- Öncelik: Önemli
- Faz: Faz 4
- Tahmini büyüklük: Küçük

### User story

Bir alıcı olarak, yoruma oy verdiğimde işlemin hızlı bitmesini istiyorum.
Böylece oy düğmesi beklemeden çalışır.

### Kabul kriterleri

- [ ] Sayaç ve itibar hesabı tek bir servis fonksiyonunda duruyor.
- [ ] İtibar hesabı `frappe.enqueue` ile işlem sonrasında çalışıyor.
- [ ] `hooks.py:766` kaydındaki gereksiz kiracı kancaları kaldırıldı.
- [ ] `review.voted` olayı yayınlanıyor.
- [ ] Characterization test: `Review Helpful Vote` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- Oy kaydından itibar puanını aynı işlemde hesaplamayın. Kayıt yavaşlar.
- Sayaçları iki ayrı yerden güncellemeyin. Değerler birbirini ezebilir.
- Satıcı alanı olmayan bu kayda kiracı kancası eklemeyin.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] Oy verme ve geri alma testleri geçiyor.
- [ ] Sayaç doğruluğu testi eklendi.
- [ ] Kuyruk işinin tekrar çalışmaya dayanıklı olduğu test edildi.
- [ ] `import-linter` kontrolü geçiyor.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?
Bir kullanıcı, yorumun faydalı olup olmadığını oylar. Bu kayıt tek bir oyu tutar. Bir kullanıcı bir yoruma yalnız bir oy verir.

## Bugünkü bağımlılıklar
### Bu kaydın bağlandığı kayıtlar
- `Listing Review` (`review`): aynı bağlam
- `User` (`voter`): başka bağlam (01-kimlik-erisim)
### Bu kayda dokunan kod
- `tradehub_core/api/review.py:1085`: okuyor ve yazıyor (oy verme)
- `tradehub_core/api/review.py:1053`: yazıyor (yorumun sayaçları)
- `tradehub_core/api/analytics.py:105`: okuyor
- `tradehub_core/tradehub_core/doctype/listing_review/listing_review.py:41`: siliyor (yorum silinince)
- `tradehub_core/listing_purge/preview.py:21`: okuyor
### hooks.py kayıtları
- `tradehub_core/hooks.py:766`: `before_insert` ve `validate` kiracı kancaları.
- `tradehub_core/hooks.py:769`: `after_insert` ve `on_trash` kancası `tradehub_core.api.reputation.recompute_on_helpful_vote` fonksiyonunu çağırır.
- `tradehub_core/hooks.py:1086` ve `tradehub_core/hooks.py:1213`: okuma izni kuralları.

## Bağımlılık sorunları
1. Kiracı kancaları bu kayıtta iş yapmaz. Kayıtta satıcı alanı yoktur. `tradehub_core/utils/tenant.py:237` bu yüzden erken döner. Kanca boşuna bağlıdır.
2. Sayaçlar iki yerden güncelleniyor. Denetleyici `recompute_review_helpful_counts` çağırır (`review_helpful_vote.py:36`). `hooks.py:769` de itibar puanını hesaplar. İkisi aynı işlemde zincir oluşturur.
Başka bağlamla önemli bir bağımlılık sorunu bulunmadı.

## Hedef tasarım
- Sahip bağlam ve paket yolu: `tradehub_core/reviews/`.
- Dışarıya açılan fonksiyonlar: `reviews.api.vote_review(review, vote)` ve `reviews.api.unvote_review(review)`.
- Yayınladığı olay: `review.voted` (review, voter, vote). İtibar hesabı bu olayı dinler.
- Dinlediği olay yoktur.
- `voter` Link alanı `User` kaydına kalır.
- Denetleyicide oy değeri ve tekil oy kontrolü kalır.

## Geçiş adımları
1. Gereksiz kiracı kancalarını `hooks.py:766` kaydından kaldırın.
2. Sayaç ve itibar hesabını tek bir servis fonksiyonuna toplayın.
3. İtibar hesabını `frappe.enqueue` ile işlem sonrasına alın. Bu adım 2. adımdan sonra gelir.

## Riskler ve testler
- Sayaç çift artabilir. Oy değişikliği ve silme için sayaç testi ekleyin.
- Kiracı kancası kaldırılınca izin değişmemeli. Okuma izni testini koruyun.
