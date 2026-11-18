# Listing Review Image

- Bağlam: 11-degerlendirme
- Tür: Alt tablo
- Klasör: `tradehub_core/tradehub_core/doctype/listing_review_image`
- Denetleyici: `tradehub_core/tradehub_core/doctype/listing_review_image/listing_review_image.py` (5 satır)
- Önerilen sahip bağlam: 11-degerlendirme

## Epic

- Epic adı: Listing Review Image: 11-degerlendirme bağlamına taşıma
- Öncelik: Önemli
- Faz: Faz 4
- Tahmini büyüklük: Orta

### User story

Bir geliştirici olarak, görsel denetiminin medya bağlamında çalışmasını istiyorum.
Böylece yorum kodu medya tablolarına yazmaz.

### Kabul kriterleri

- [ ] `Image Moderation Log` kaydını yalnız 08-medya bağlamı açıyor.
- [ ] Yorum kaydedilince `review.image_added` olayı yayınlanıyor.
- [ ] `media.image_rejected` olayı gelince yorum `reviews` servisiyle gizleniyor. Ürün puanı da yenileniyor.
- [ ] `hooks.py:762` kaydı kaldırıldı.
- [ ] Characterization test: `Listing Review Image` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- `api/moderation.py` içinden yorumu `set_value` ile gizlemeyin. Bu yol puan yenilemesini atlar.
- Yorum kodundan `Image Moderation Log` kaydı açmayın. Bu kayıt medya bağlamına aittir.
- Alt tablo kancasının çalıştığını varsaymayın. Önce testle kanıtlayın.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] Alt tablo kancası için test eklendi.
- [ ] `review.image_added` ve `media.image_rejected` için sözleşme testi eklendi.
- [ ] Görsel reddi sonrası puan testi geçiyor.
- [ ] 08-medya bağlamının `CODEOWNERS` sahibinden inceleme istendi.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?
Alıcı, yorumuna fotoğraf ekleyebilir. Bu alt tablo her fotoğrafı bir satırda tutar. Alt tablo, ana kaydın içinde duran satır listesidir. Ana kayıt `Listing Review` kaydıdır.

## Bugünkü bağımlılıklar
### Bu kaydın bağlandığı kayıtlar
- Link alanı yoktur. `image` alanı bir dosya ekidir (`Attach Image`).
### Bu kayda dokunan kod
- `tradehub_core/api/review.py:451`: okuyor (yorum listesinde görseller)
- `tradehub_core/api/review.py:831`: okuyor (yönetici listesi)
- `tradehub_core/api/moderation.py:135`: doc_event, görseli denetler
### hooks.py kayıtları
- `tradehub_core/hooks.py:762`: `after_insert` kancası `tradehub_core.api.moderation.check_image_content` fonksiyonunu çağırır.

## Bağımlılık sorunları
1. Görsel denetimi başka bağlamın tablosuna yazıyor. `check_image_content` bir `Image Moderation Log` kaydı açar (`tradehub_core/api/moderation.py:172`). Bu DocType 08-medya bağlamındadır.
2. Görsel denetimi yorumu doğrudan gizliyor. `tradehub_core/api/moderation.py:184` durumu `set_value` ile `Hidden` yapar. Bu yol yorum denetleyicisini atlar ve ürün puanı yenilenmez.
3. Alt tablo satırı için `after_insert` kancası çalışması doğrulanmadı. Frappe alt tablo satırlarında bu olayı ana kaydın kaydıyla birlikte çalıştırmayabilir.

## Hedef tasarım
- Sahip bağlam ve paket yolu: `tradehub_core/reviews/`.
- Dışarıya açılan fonksiyon yoktur. Görseller `reviews.api.get_reviews_for_listing` ile döner.
- Yayınladığı olay: `review.image_added` (review, image_url). 08-medya bağlamı bu olayı dinleyip görseli denetler.
- Dinlediği olay: `media.image_rejected` (review, image_url, reason). Değerlendirme bağlamı yorumu kendi servisiyle gizler.
- Link alanı eklenmez.
- Denetleyicide yalnız alan doğrulaması kalır.

## Geçiş adımları
1. Alt tablo kancasının gerçekten çalıştığını sınayan bir test yazın.
2. `review.image_added` olayını yorum kaydedilirken yayınlayın.
3. 08-medya bağlamında olay dinleyicisi yazın. `Image Moderation Log` kaydını orada açın. Bu adım 2. adımdan sonra gelir.
4. `media.image_rejected` olayını dinleyen `reviews` servis fonksiyonunu yazın. Bu fonksiyon yorumu gizlesin ve puanı yenilesin.
5. `hooks.py:762` kaydını kaldırın. Bu adım 3. ve 4. adımlardan sonra gelir.

## Riskler ve testler
- Uygunsuz görsel gizlenmeden yayında kalabilir. Ret olayından sonra yorumun gizlendiğini sınayan test ekleyin.
- Görsel sınırı aşılabilir. `_validate_images_limit` için test ekleyin.
