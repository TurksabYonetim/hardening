# Seller Review Analytics

- Bağlam: 11-degerlendirme
- Tür: Kayıt defteri (log)
- Klasör: `tradehub_core/tradehub_core/doctype/seller_review_analytics`
- Denetleyici: `tradehub_core/tradehub_core/doctype/seller_review_analytics/seller_review_analytics.py` (5 satır)
- Önerilen sahip bağlam: 11-degerlendirme

## Epic

- Epic adı: Seller Review Analytics: 11-degerlendirme bağlamına taşıma
- Öncelik: Düşük
- Faz: Faz 4
- Tahmini büyüklük: Küçük

### User story

Bir platform yöneticisi olarak, kullanılmayan bir hesabın her gün boşuna çalışmamasını istiyorum.
Böylece sistem gereksiz yük taşımaz.

### Kabul kriterleri

- [ ] Ürün sahibinin kararı (kullan ya da kaldır) yazılı olarak var.
- [ ] Kaldırma seçildiyse `hooks.py:357` kaydı silindi ve kaldırma yaması yazıldı.
- [ ] Kullanma seçildiyse hesap kayda yazılıyor ve satıcı paneli `reviews.api.get_seller_review_analytics` ile okuyor.
- [ ] Characterization test: `Seller Review Analytics` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- Karar almadan DocType'ı silmeyin. Ürün sahibi bu kaydı kullanmak isteyebilir.
- Önce DocType'ı silip zamanlanmış işi bırakmayın. İş hata verir.
- Hesaba yeni başka bağlam tablosu okuması eklemeyin.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] Ürün sahibinin kararı PR açıklamasına yazıldı.
- [ ] Kaldırma yaması tekrar çalıştırılabilir.
- [ ] Zamanlanmış iş listesi kontrol edildi.
- [ ] `import-linter` kontrolü geçiyor.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?
Bu kayıt, bir satıcının yorum özetini dönem dönem tutmak için tasarlanmış. Dönemler 7, 30, 90 gün ve 1 yıldır. Ancak bugün hiçbir kod bu kayda yazmıyor.

## Bugünkü bağımlılıklar
### Bu kaydın bağlandığı kayıtlar
- `Admin Seller Profile` (`seller`): başka bağlam (02-satici-magaza)
### Bu kayda dokunan kod
- DocType adını içeren kod yoktur. Arama yalnız `tradehub_core/api/seller_analytics.py:1` belge metnini buldu.
- `tradehub_core/api/seller_analytics.py:138`: `compute_all_sellers` her satıcı için özeti hesaplar. Sonuç bir yere yazılmıyor. Bu durum yalnız arama ile görüldü, çalışma zamanında doğrulanmadı.
### hooks.py kayıtları
- `tradehub_core/hooks.py:357`: zamanlanmış iş `tradehub_core.api.seller_analytics.compute_all_sellers` her gün çalışır.

## Bağımlılık sorunları
1. DocType ölü görünüyor. Zamanlanmış iş her gün boşuna hesap yapar. Bu iş `Listing`, `Listing Review` ve diğer tabloları okur (`tradehub_core/api/seller_analytics.py:29`).
2. Hesap en çok 500 satıcıyı işler (`tradehub_core/api/seller_analytics.py:140`).

## Hedef tasarım
- Sahip bağlam ve paket yolu: `tradehub_core/reviews/insights/`.
- Ürün sahibi iki yoldan birini seçmelidir:
  1. Özet kayda yazılsın ve satıcı paneli `reviews.api.get_seller_review_analytics(seller, period)` ile okusun.
  2. DocType ve zamanlanmış iş kaldırılsın.
- Olay yayınlamaz. Kayda yazılırsa `review.approved` olayını dinleyebilir.
- `seller` Link alanı kalır.

## Geçiş adımları
1. Ürün sahibinden karar alın.
2. Kaldırma seçilirse önce `hooks.py:357` kaydını silin. Sonra DocType için bir kaldırma yaması (patch) yazın. Yama, veritabanı değişikliğini yapan betiktir.
3. Kullanma seçilirse hesabı kayda yazın ve satıcı paneli ucunu ekleyin.

## Riskler ve testler
- Kaldırma, rapor ya da panel kodunu bozabilir. Kaldırmadan önce ön yüz depolarında DocType adını arayın. Bu arama yapılmadı.
