# Review Translation

- Bağlam: 11-degerlendirme
- Tür: Kayıt defteri (log)
- Klasör: `tradehub_core/tradehub_core/doctype/review_translation`
- Denetleyici: `tradehub_core/tradehub_core/doctype/review_translation/review_translation.py` (12 satır)
- Önerilen sahip bağlam: 11-degerlendirme

## Epic

- Epic adı: Review Translation: 11-degerlendirme bağlamına taşıma
- Öncelik: Önemli
- Faz: Faz 4
- Tahmini büyüklük: Orta

### User story

Bir geliştirici olarak, yorum çevirisinin içerik bağlamının tablolarına yazmamasını istiyorum.
Böylece çeviri kullanım kaydı tek sahiple kalır.

### Kabul kriterleri

- [ ] `api/translation.py` içinde `frappe.db.commit()` çağrısı kalmıyor.
- [ ] Çeviri `content.api.translate` fonksiyonuyla yapılıyor. Kullanım günlüğünü o fonksiyon yazıyor.
- [ ] `review_translation.py` içinde `Translation Usage Log` yazımı kalmıyor.
- [ ] Yorum metni değişince çeviriyi `review.updated` dinleyicisi siliyor.
- [ ] Characterization test: `Review Translation` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- `Translation Usage Log` tablosuna yorum kodundan yazmayın. Bu kayıt 09-icerik-vitrin bağlamına aittir.
- İsteğin ortasında `frappe.db.commit()` çağırmayın. İşlem yarıda kalabilir.
- Çeviri silmeyi yorum denetleyicisine koymayın. Olay dinleyicisi kullanın.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] Çeviri alma testi geçiyor.
- [ ] Yorum düzenlenince çevirinin silindiğini kanıtlayan test eklendi.
- [ ] `review.translation_deleted` için sözleşme testi eklendi.
- [ ] 09-icerik-vitrin bağlamının `CODEOWNERS` sahibinden inceleme istendi.
- [ ] `import-linter` kontrolü geçiyor.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?
Sistem, yorumu başka bir dile çevirir. Bu kayıt çeviriyi önbellekte tutar. Önbellek, aynı işi tekrar yapmamak için saklanan sonuçtur. Yorum değişince çeviri silinir.

## Bugünkü bağımlılıklar
### Bu kaydın bağlandığı kayıtlar
- `Listing Review` (`review`): aynı bağlam
### Bu kayda dokunan kod
- `tradehub_core/api/translation.py:240`: okuyor
- `tradehub_core/api/translation.py:273`: yazıyor (yeni çeviri)
- `tradehub_core/api/translation.py:288`: yazıyor (yorumun dil alanları)
- `tradehub_core/api/translation.py:333`: siliyor (gece temizliği)
- `tradehub_core/tradehub_core/doctype/listing_review/listing_review.py:99`: siliyor (yorum metni değişince)
- `tradehub_core/listing_purge/preview.py:21`: okuyor
### hooks.py kayıtları
- `tradehub_core/hooks.py:351`: zamanlanmış iş `tradehub_core.api.translation.cleanup_old_cache`.
- `tradehub_core/hooks.py:353`: zamanlanmış iş `tradehub_core.api.translation.daily_reset_usage`.

## Bağımlılık sorunları
1. Denetleyici başka bağlamın tablosuna yazıyor. `on_trash` `Translation Usage Log` bağını boşaltır (`review_translation.py:10`). Bu DocType 09-icerik-vitrin bağlamındadır.
2. Çeviri servisi de aynı tabloya yazıyor (`tradehub_core/api/translation.py:116`).
3. `get_review_translation` içinde `frappe.db.commit()` çağrısı vardır (`tradehub_core/api/translation.py:294`). Bu, isteğin ortasında işlemi bitirir.

## Hedef tasarım
- Sahip bağlam ve paket yolu: `tradehub_core/reviews/translation/`.
- Dışarıya açılan fonksiyonlar: `reviews.api.get_review_translation(review, target_lang)`.
- Çeviri motoru ortak bir servis olabilir. Öneri: 09-icerik-vitrin bağlamı `content.api.translate(text, source, target)` fonksiyonunu açsın.
- Yayınladığı olay: `review.translation_deleted` (translation). Kullanım günlüğünü 09-icerik-vitrin kendi dinleyicisiyle günceller.
- Dinlediği olay: `review.updated`. Bu olay çeviriyi siler.
- `Translation Usage Log` tablosuna doğrudan yazım kalkar.
- Denetleyicide iş kuralı kalmaz.

## Geçiş adımları
1. `frappe.db.commit()` çağrısını kaldırın.
2. 09-icerik-vitrin bağlamından `translate` fonksiyonunu isteyin. Kullanım günlüğü o fonksiyonun içinde yazılsın.
3. `on_trash` içindeki `Translation Usage Log` yazımını olaya çevirin. Bu adım 2. adımdan sonra gelir.
4. Yorumun `on_update` içindeki çeviri silme işini `review.updated` dinleyicisine taşıyın.

## Riskler ve testler
- Silinen çeviri günlükte bağlı kalabilir. Silme sonrası bağın boşaldığını sınayın.
- Kota sayacı yanlış artabilir. Günlük sıfırlama testi ekleyin.
