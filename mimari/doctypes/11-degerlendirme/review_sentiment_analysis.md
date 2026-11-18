# Review Sentiment Analysis

- Bağlam: 11-degerlendirme
- Tür: Ana kayıt
- Klasör: `tradehub_core/tradehub_core/doctype/review_sentiment_analysis`
- Denetleyici: `tradehub_core/tradehub_core/doctype/review_sentiment_analysis/review_sentiment_analysis.py` (5 satır)
- Önerilen sahip bağlam: 11-degerlendirme

## Epic

- Epic adı: Review Sentiment Analysis: 11-degerlendirme bağlamına taşıma
- Öncelik: Önemli
- Faz: Faz 4
- Tahmini büyüklük: Küçük

### User story

Bir alıcı olarak, yorumumu gönderdiğimde beklemek istemiyorum.
Böylece dış yapay zekâ servisi yavaş olsa da yorum hemen kaydedilir.

### Kabul kriterleri

- [ ] `queue_analysis` analizi `frappe.enqueue` ile işlem sonrasında çalıştırıyor.
- [ ] Analiz `review.approved` olayıyla başlıyor.
- [ ] `api/sentiment.py` dosyası `reviews/insights/` paketinde duruyor.
- [ ] `hooks.py:248` ve `hooks.py:753` yolları yeni pakete bakıyor.
- [ ] Characterization test: `Review Sentiment Analysis` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- Dış servisi yorum kaydıyla aynı işlemde çağırmayın. Yorum kaydı bekler.
- Analiz sonucunu yorum kaydına yazmayın. Sonuç kendi kaydında durur.
- Zamanlanmış iş yolunu değiştirip eskisini bırakmayın.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] Kuyruk işi testi eklendi.
- [ ] Dış servis hata verince yorumun kaydedildiğini kanıtlayan test eklendi.
- [ ] `import-linter` kontrolü geçiyor.
- [ ] Zamanlanmış iş listesi kontrol edildi.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?
Sistem, yorumun olumlu ya da olumsuz olduğunu çıkarır. Buna duygu analizi denir. Bu kayıt sonucu, güven değerini ve konuları tutar. Her yorumun en çok bir analiz kaydı vardır.

## Bugünkü bağımlılıklar
### Bu kaydın bağlandığı kayıtlar
- `Listing Review` (`review`): aynı bağlam
### Bu kayda dokunan kod
- `tradehub_core/api/sentiment.py:174`: okuyor ve yazıyor (`sentiment.py:195`, `sentiment.py:197`)
- `tradehub_core/api/seller_analytics.py:94`: okuyor
- `tradehub_core/tradehub_core/doctype/listing_review/listing_review.py:43`: siliyor
### hooks.py kayıtları
- `tradehub_core/hooks.py:753`: yorum `after_insert` kancası `tradehub_core.api.sentiment.queue_analysis` fonksiyonunu çağırır.
- `tradehub_core/hooks.py:248`: zamanlanmış iş `tradehub_core.api.sentiment.batch_analyze_pending` bekleyen yorumları işler.

## Bağımlılık sorunları
1. Analiz yorum kaydıyla aynı işlemde çalışıyor. `queue_analysis` adı kuyruk dese de işi hemen yapar (`tradehub_core/api/sentiment.py:208`). Dış yapay zekâ servisi yavaşsa yorum kaydı da bekler (`tradehub_core/api/sentiment.py:160`).
Başka bağlamla önemli bir bağımlılık sorunu bulunmadı.

## Hedef tasarım
- Sahip bağlam ve paket yolu: `tradehub_core/reviews/insights/`.
- Dışarıya açılan fonksiyon: `reviews.api.get_listing_sentiment_summary(listing)`.
- Yayınladığı olay yoktur.
- Dinlediği olay: `review.approved`. İş `frappe.enqueue` ile kuyrukta çalışır.
- Başka bağlama bağlantısı yoktur.
- Denetleyici boş kalır.

## Geçiş adımları
1. `queue_analysis` içinde analizi `frappe.enqueue` ile işlem sonrasına alın.
2. `api/sentiment.py` dosyasını `reviews/insights/` paketine taşıyın.
3. `hooks.py:248` ve `hooks.py:753` yollarını güncelleyin. Bu adım 2. adımdan sonra gelir.

## Riskler ve testler
- Kuyruk işi iki kez çalışabilir. Aynı yorum için ikinci kayıt açılmadığını sınayın.
- Dış servis hatasında yedek analiz çalışmalı. Hata durumunu sınayan test ekleyin.
