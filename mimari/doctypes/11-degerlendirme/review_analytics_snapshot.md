# Review Analytics Snapshot

- Bağlam: 11-degerlendirme
- Tür: Kayıt defteri (log)
- Klasör: `tradehub_core/tradehub_core/doctype/review_analytics_snapshot`
- Denetleyici: `tradehub_core/tradehub_core/doctype/review_analytics_snapshot/review_analytics_snapshot.py` (5 satır)
- Önerilen sahip bağlam: 11-degerlendirme

## Epic

- Epic adı: Review Analytics Snapshot: 11-degerlendirme bağlamına taşıma
- Öncelik: Düşük
- Faz: Faz 4
- Tahmini büyüklük: Küçük

### User story

Bir platform yöneticisi olarak, günlük yorum özetinin başka bağlamların tablolarını saymadan hazırlanmasını istiyorum.
Böylece sipariş ve katalog değişiklikleri raporu bozmaz.

### Kabul kriterleri

- [ ] `analytics.py` içinde `Order`, `Listing` ve `Order Dispute` tablolarına doğrudan sayım kalmıyor.
- [ ] Bu sayılar okuma modeli fonksiyonlarından geliyor. Örneğin `ordering.api.count_open_disputes()`.
- [ ] Dosya `reviews/insights/` paketinde duruyor. `hooks.py:354` yolu güncellendi.
- [ ] Characterization test: `Review Analytics Snapshot` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- Başka bağlamın tablosunu `_safe_count` ile saymayın. Okuma fonksiyonu isteyin.
- Zamanlanmış iş yolunu değiştirip eskisini bırakmayın. Özet iki kez yazılabilir.
- Özet kaydına elle yazmayın. Kayıt yalnız günlük işten yazılır.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] Özet hesabı için önce ve sonra karşılaştırma testi eklendi.
- [ ] Zamanlanmış iş yolu testi geçiyor.
- [ ] `import-linter` kontrolü geçiyor.
- [ ] Sipariş bağlamının `CODEOWNERS` sahibinden okuma fonksiyonu için inceleme istendi.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?
Sistem, her gün yorum sayılarının özetini çıkarır. Bu kayıt o günün özetini tutar. Yönetici paneli bu kayıtları grafik için okur. Kayıt adı tarihtir.

## Bugünkü bağımlılıklar
### Bu kaydın bağlandığı kayıtlar
- Link alanı yoktur.
### Bu kayda dokunan kod
- `tradehub_core/api/analytics.py:61`: okuyor ve yazıyor (`analytics.py:133`, `analytics.py:135`)
- `tradehub_core/api/analytics.py:165`: okuyor (geçmiş listesi)
### hooks.py kayıtları
- `tradehub_core/hooks.py:354`: zamanlanmış iş `tradehub_core.api.analytics.daily_snapshot`.

## Bağımlılık sorunları
1. Özet, başka bağlamların tablolarını sayıyor. `tradehub_core/api/analytics.py:21` listesinde `Order` ve `Listing` vardır. `Order Dispute` sayısı da okunur (`tradehub_core/api/analytics.py:119`). Bu okumalar 03a-katalog ve 04-siparis bağlamına bağlıdır.

## Hedef tasarım
- Sahip bağlam ve paket yolu: `tradehub_core/reviews/insights/`.
- Dışarıya açılan fonksiyon: `reviews.api.get_snapshot_history(days)`.
- Olay yayınlamaz ve dinlemez.
- Başka bağlam sayıları okuma modelinden gelir. Örneğin `ordering.api.count_open_disputes()`.
- Denetleyici boş kalır.

## Geçiş adımları
1. `analytics.py` içindeki başka bağlam sayımlarını okuma modeli fonksiyonlarına çevirin.
2. Dosyayı `reviews/insights/` paketine taşıyın ve `hooks.py:354` yolunu güncelleyin.

## Riskler ve testler
- Aynı gün iki kayıt açılabilir. `snapshot_date` tekildir. Aynı gün ikinci çalışmanın güncelleme yaptığını sınayın.
