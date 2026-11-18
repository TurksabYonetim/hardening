# Listing Review Update

- Bağlam: 11-degerlendirme
- Tür: Alt tablo
- Klasör: `tradehub_core/tradehub_core/doctype/listing_review_update`
- Denetleyici: `tradehub_core/tradehub_core/doctype/listing_review_update/listing_review_update.py` (5 satır)
- Önerilen sahip bağlam: 11-degerlendirme

## Epic

- Epic adı: Listing Review Update: 11-degerlendirme bağlamına taşıma
- Öncelik: Düşük
- Faz: Faz 4
- Tahmini büyüklük: Küçük

### User story

Bir geliştirici olarak, yorum güncelleme kodunun `reviews` paketinde durmasını istiyorum.
Böylece uzun dönem puanı tek bir yerden yazılır.

### Kabul kriterleri

- [ ] `api/timeline.py` içindeki iş `reviews/services/timeline.py` dosyasında duruyor.
- [ ] `long_term_score` alanı yalnız ana kaydın servis fonksiyonuyla yazılıyor.
- [ ] Hatırlatma işlerinin `hooks.py` yolları yeni pakete bakıyor.
- [ ] Characterization test: `Listing Review Update` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- `long_term_score` alanını `set_value` ile yazmayın. Servis fonksiyonunu kullanın.
- Alt tabloyu ana kayıt dışından düzenlemeyin. Satırları `submit_review_update` ile ekleyin.
- Zamanlanmış iş yolunu değiştirip eskisini bırakmayın. İş iki kez çalışabilir.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] Güncelleme ekleme testi geçiyor.
- [ ] Hatırlatma işleri için yol testi eklendi.
- [ ] `import-linter` kontrolü geçiyor.
- [ ] Zamanlanmış iş listesinde aynı işin iki kez olmadığı kontrol edildi.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?
Alıcı, yorumunu 30 gün ve 90 gün sonra güncelleyebilir. Bu alt tablo her güncellemeyi bir satırda tutar. Satır, aşamayı, puanı ve metni saklar.

## Bugünkü bağımlılıklar
### Bu kaydın bağlandığı kayıtlar
- Link alanı yoktur. Ana kayıt `Listing Review` kaydıdır (`updates` alanı).
### Bu kayda dokunan kod
- `tradehub_core/api/timeline.py:97`: okuyor ve satır siliyor
- `tradehub_core/api/timeline.py:115`: yazıyor (ana kaydı kaydeder)
- `tradehub_core/api/timeline.py:134`: okuyor (uzun dönem puanı)
### hooks.py kayıtları
- Doğrudan kayıt yoktur. Hatırlatma işleri `tradehub_core/hooks.py:348`, `tradehub_core/hooks.py:349` ve `tradehub_core/hooks.py:350` satırlarındadır.

## Bağımlılık sorunları
1. Uzun dönem puanı denetleyiciyi atlayarak yazılıyor. `tradehub_core/api/timeline.py:141` `set_value` kullanır. Bu, aynı bağlam içinde bir sorundur.
Başka bağlamla önemli bir bağımlılık sorunu bulunmadı.

## Hedef tasarım
- Sahip bağlam ve paket yolu: `tradehub_core/reviews/`.
- Dışarıya açılan fonksiyon: `reviews.api.submit_review_update(review, stage, rating, body)`.
- Yayınladığı olay: `review.updated` (review, listing, stage). Puan hesabı bu olayla yenilenebilir.
- Dinlediği olay yoktur.
- Link alanı eklenmez.
- Denetleyicide aşama değeri ve metin zorunluluğu kalır.

## Geçiş adımları
1. `api/timeline.py` içindeki işi `reviews/services/timeline.py` dosyasına taşıyın.
2. `long_term_score` yazımını ana kaydın servis fonksiyonuna alın.
3. Hatırlatma işlerini `reviews` paketine taşıyın ve `hooks.py` yolunu güncelleyin. Bu adım 1. adımdan sonra gelir.

## Riskler ve testler
- Aynı aşama iki kez eklenebilir. Aynı aşamanın yerine yeni satırın geldiğini sınayan test ekleyin.
- Hatırlatma yanlış güne düşebilir. `_determine_stage` için gün sınırı testleri ekleyin.
