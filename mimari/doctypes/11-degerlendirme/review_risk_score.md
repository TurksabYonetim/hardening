# Review Risk Score

- Bağlam: 11-degerlendirme
- Tür: Ana kayıt
- Klasör: `tradehub_core/tradehub_core/doctype/review_risk_score`
- Denetleyici: `tradehub_core/tradehub_core/doctype/review_risk_score/review_risk_score.py` (5 satır)
- Önerilen sahip bağlam: 11-degerlendirme

## Epic

- Epic adı: Review Risk Score: 11-degerlendirme bağlamına taşıma
- Öncelik: Önemli
- Faz: Faz 4
- Tahmini büyüklük: Orta

### User story

Bir platform yöneticisi olarak, risk puanının yorum kaydını yavaşlatmadan hesaplanmasını istiyorum.
Böylece risk hesabı hata verse de yorum kaydedilir.

### Kabul kriterleri

- [ ] `api/risk.py` dosyası `reviews/risk/` paketinde duruyor.
- [ ] Risk hesabı `review.submitted` olayıyla çalışıyor. Yorum kaydıyla aynı işlemde çalışmıyor.
- [ ] Sipariş ve kimlik verisi okuma modeli fonksiyonlarından geliyor.
- [ ] `review.risk_scored` olayı yayınlanıyor.
- [ ] Characterization test: `Review Risk Score` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- Risk hesabını yorumun `after_insert` kancasında çalıştırmayın. Hata yorumu da etkiler.
- Sipariş ve kimlik tablolarını doğrudan okumayın. Okuma fonksiyonu kullanın.
- Risk sonucunu yorum kaydına `set_value` ile yazmayın. Servis fonksiyonunu kullanın.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] Risk hesabı testleri geçiyor.
- [ ] Risk hesabı hata verince yorumun kaydedildiğini kanıtlayan test eklendi.
- [ ] `review.risk_scored` için sözleşme testi eklendi.
- [ ] `import-linter` kontrolü geçiyor.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?
Sistem, her yorum için sahte olma riskini hesaplar. Bu kayıt toplam puanı ve risk etkenlerini tutar. Her yorumun en çok bir risk kaydı vardır.

## Bugünkü bağımlılıklar
### Bu kaydın bağlandığı kayıtlar
- `Listing Review` (`review`): aynı bağlam
- `Review Risk Factor` (`factors`): aynı bağlam, alt tablo
### Bu kayda dokunan kod
- `tradehub_core/api/risk.py:293`: okuyor ve yazıyor (yeni kayıt ya da güncelleme)
- `tradehub_core/api/risk.py:317`: yazıyor (yorumdaki önbellek alanları)
- `tradehub_core/api/analytics.py:151`: okuyor
- `tradehub_core/tradehub_core/doctype/listing_review/listing_review.py:40`: siliyor
### hooks.py kayıtları
- Doğrudan kayıt yoktur. Hesap, `tradehub_core/hooks.py:750` satırındaki yorum kancasıyla başlar.

## Bağımlılık sorunları
1. Risk hesabı başka bağlamların verisini okuyor. Örneğin doğrulanmamış alım ve ilk alım kontrolleri yapılır (`tradehub_core/api/risk.py:201`, `tradehub_core/api/risk.py:213`). Okunan tabloların tam listesi doğrulanmadı.
2. Hesap yorum kaydıyla aynı işlemde çalışıyor. Hesap hata verirse yorum kaydı da etkilenebilir.

## Hedef tasarım
- Sahip bağlam ve paket yolu: `tradehub_core/reviews/risk/`.
- Dışarıya açılan fonksiyon: `reviews.api.get_review_risk(review)`. Bu fonksiyonu yalnız yönetici ekranı kullanır.
- Yayınladığı olay: `review.risk_scored` (review, total_score, is_high_risk). Otomatik moderasyon bu olayı dinler.
- Dinlediği olay: `review.submitted`.
- Başka bağlam verisi okuma modeliyle gelir. Okuma modeli, başka bağlamın yalnız okuma için açtığı veridir.
- Denetleyici boş kalabilir.

## Geçiş adımları
1. `api/risk.py` dosyasını `reviews/risk/` paketine taşıyın.
2. Risk hesabını `review.submitted` olayına bağlayın.
3. Sipariş ve kimlik okumalarını okuma modeli fonksiyonlarına çevirin. Bu adım 1. adımdan sonra gelir.

## Riskler ve testler
- Otomatik moderasyon risk puanını eski okuyabilir. Sıra testi ekleyin. Risk hesabı moderasyondan önce bitmelidir.
- `review` alanı tekildir. Yeniden hesapta ikinci kayıt açılmadığını sınayın.
