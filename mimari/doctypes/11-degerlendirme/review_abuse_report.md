# Review Abuse Report

- Bağlam: 11-degerlendirme
- Tür: Ana kayıt
- Klasör: `tradehub_core/tradehub_core/doctype/review_abuse_report`
- Denetleyici: `tradehub_core/tradehub_core/doctype/review_abuse_report/review_abuse_report.py` (51 satır)
- Önerilen sahip bağlam: 11-degerlendirme

## Epic

- Epic adı: Review Abuse Report: 11-degerlendirme bağlamına taşıma
- Öncelik: Önemli
- Faz: Faz 4
- Tahmini büyüklük: Küçük

### User story

Bir platform yöneticisi olarak, ihbar eşiği aşılınca yorumun doğru yoldan gizlenmesini istiyorum.
Böylece bildirimler ve puan hesabı eksik kalmaz.

### Kabul kriterleri

- [ ] Eşik aşılınca yorum `change_review_status` servisiyle gizleniyor.
- [ ] `api/review.py:1157` içindeki `set_value` çağrısı kaldırıldı.
- [ ] Gereksiz kiracı kancaları `hooks.py` kaydından kaldırıldı.
- [ ] İtibar hesabı `review.reported` olayıyla çalışıyor.
- [ ] Characterization test: `Review Abuse Report` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- Yorum durumunu `set_value` ile değiştirmeyin. Bildirim ve puan yenilemesi atlanır.
- İhbar kaydından itibar puanını aynı işlemde hesaplamayın. Olay ya da kuyruk kullanın.
- Satıcı alanı olmayan bu kayda kiracı kancası eklemeyin.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] Eşik testi geçiyor.
- [ ] Eşik sonrası bildirim gittiğini kanıtlayan test eklendi.
- [ ] `review.reported` için sözleşme testi eklendi.
- [ ] `import-linter` kontrolü geçiyor.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?
Bir kullanıcı, uygunsuz bir yorumu ihbar eder. Bu kayıt ihbarı ve nedenini tutar. İhbar sayısı eşiği geçerse yorum otomatik gizlenir.

## Bugünkü bağımlılıklar
### Bu kaydın bağlandığı kayıtlar
- `Listing Review` (`review`): aynı bağlam
- `User` (`reporter`): başka bağlam (01-kimlik-erisim)
### Bu kayda dokunan kod
- `tradehub_core/api/review.py:1229`: yazıyor (ihbar açma)
- `tradehub_core/api/review.py:918`: okuyor ve yazıyor (yönetici ihbarı kapatır)
- `tradehub_core/api/review.py:1142`: yazıyor (yorumun `abuse_report_count` alanı)
- `tradehub_core/api/analytics.py:106`: okuyor
- `tradehub_core/tradehub_core/doctype/listing_review/listing_review.py:42`: siliyor
### hooks.py kayıtları
- `tradehub_core/hooks.py:772`: `before_insert` ve `validate` kiracı kancaları.
- `tradehub_core/hooks.py:775`: `after_insert` kancası `tradehub_core.api.reputation.recompute_on_abuse_report` fonksiyonunu çağırır.
- `tradehub_core/hooks.py:1087` ve `tradehub_core/hooks.py:1214`: okuma izni kuralları.

## Bağımlılık sorunları
1. Eşik aşılınca yorum denetleyici atlanarak gizleniyor. `tradehub_core/api/review.py:1157` `set_value` kullanır. Yorumun bildirimleri bu yolda çalışmaz.
2. Kiracı kancaları iş yapmaz. Kayıtta satıcı alanı yoktur (`tradehub_core/utils/tenant.py:237`).
Başka bağlamla önemli bir bağımlılık sorunu bulunmadı.

## Hedef tasarım
- Sahip bağlam ve paket yolu: `tradehub_core/reviews/`.
- Dışarıya açılan fonksiyonlar: `reviews.api.report_review(review, reason, note)` ve `reviews.api.dismiss_report(name, note)`.
- Yayınladığı olaylar: `review.reported` (review, reporter, reason) ve `review.hidden`.
- Dinlediği olay yoktur.
- `reporter` Link alanı `User` kaydına kalır.
- Denetleyicide tekil ihbar kontrolü kalır. Eşik kuralı servise taşınır.

## Geçiş adımları
1. Gizleme işini `reviews` içindeki `change_review_status` servisine bağlayın.
2. Gereksiz kiracı kancalarını kaldırın.
3. İtibar hesabını `review.reported` olayına bağlayın. Bu adım olay yayınlayıcısı hazır olunca yapılır.

## Riskler ve testler
- Eşikte yorum gizlenmeyebilir. Üçüncü ihbarda yorumun gizlendiğini sınayan test ekleyin.
- Aynı kişi iki kez ihbar edebilir. Tekil ihbar testi ekleyin.
