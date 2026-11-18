# Question Helpful Vote

- Bağlam: 11-degerlendirme
- Tür: Ana kayıt
- Klasör: `tradehub_core/tradehub_core/doctype/question_helpful_vote`
- Denetleyici: `tradehub_core/tradehub_core/doctype/question_helpful_vote/question_helpful_vote.py` (5 satır)
- Önerilen sahip bağlam: 11-degerlendirme

## Epic

- Epic adı: Question Helpful Vote: 11-degerlendirme bağlamına taşıma
- Öncelik: Düşük
- Faz: Faz 4
- Tahmini büyüklük: Küçük

### User story

Bir alıcı olarak, oyumun bir kez sayılmasını istiyorum.
Böylece faydalı soru sayıları doğru görünür.

### Kabul kriterleri

- [ ] Soru ya da cevap silinince bağlı oylar da siliniyor.
- [ ] Aynı kişi aynı hedefe ikinci oy veremiyor. Kural denetleyicide duruyor.
- [ ] Oy işi `reviews.api.vote_question_helpful` ile yapılıyor.
- [ ] Characterization test: `Question Helpful Vote` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- Soru silerken oyları geride bırakmayın. Sahipsiz oy sayaçları bozar.
- Tekil oy kuralını yalnız API ucuna koymayın. Desk yolu da korunmalı.
- `target_id` alanını başka bağlamın kaydına bağlamayın. Hedef yalnız soru ya da cevaptır.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] Silme sonrası oy temizleme testi eklendi.
- [ ] Tekil oy testi eklendi.
- [ ] `import-linter` kontrolü geçiyor.
- [ ] Mevcut sahipsiz oylar için temizleme yaması tekrar çalıştırılabilir.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?
Bir kullanıcı, bir soruyu ya da cevabı faydalı bulduğunu işaretler. Bu kayıt tek bir oyu tutar. Hedef türü "question" ya da "answer" olur.

## Bugünkü bağımlılıklar
### Bu kaydın bağlandığı kayıtlar
- `User` (`voter`): başka bağlam (01-kimlik-erisim)
- `target_id` bir Link alanı değildir. Bu alan soru ya da cevap adını düz metin olarak tutar.
### Bu kayda dokunan kod
- `tradehub_core/api/qa.py:346`: okuyor (oy sayısı)
- `tradehub_core/api/qa.py:378`: okuyor (önceki oy)
- `tradehub_core/api/qa.py:385`: yazıyor (yeni oy)
- `tradehub_core/api/qa.py:349`: yazıyor (hedefin `helpful_count` alanı)
### hooks.py kayıtları
- Kayıt yoktur.

## Bağımlılık sorunları
1. `target_id` bir Link alanı değil. Soru ya da cevap silinince oy sahipsiz kalır. Yorum silmedeki temizlik burada yoktur. Bu, aynı bağlam içinde bir sorundur.
Başka bağlamla önemli bir bağımlılık sorunu bulunmadı.

## Hedef tasarım
- Sahip bağlam ve paket yolu: `tradehub_core/reviews/qa/`.
- Dışarıya açılan fonksiyon: `reviews.api.vote_question_helpful(target_type, target_id)`.
- Olay yayınlamaz ve dinlemez.
- `voter` Link alanı kalır. `target_type` ile `target_id` birlikte Dynamic Link olabilir. Dynamic Link, hedef türünü başka bir alandan alan bağlantıdır.
- Denetleyiciye tekil oy kontrolü eklenebilir.

## Geçiş adımları
1. Soru ve cevap silinirken bağlı oyları silen temizliği ekleyin.
2. Tekil oy kuralını denetleyiciye taşıyın.

## Riskler ve testler
- Sahipsiz oylar sayacı bozabilir. Silme sonrası oy kalmadığını sınayın.
