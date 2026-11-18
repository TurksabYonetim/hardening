# Image Moderation Log

- Bağlam: 08-medya
- Tür: Kayıt defteri (log)
- Klasör: `tradehub_core/tradehub_core/doctype/image_moderation_log`
- Denetleyici: `tradehub_core/tradehub_core/doctype/image_moderation_log/image_moderation_log.py` (5 satır)
- Önerilen sahip bağlam: 11-degerlendirme (İnceleme silme akışı günlüğün yaşam döngüsünü yönetiyor. `tradehub_core/tradehub_core/doctype/listing_review/listing_review.py:591`)

## Epic

- Epic adı: Image Moderation Log: 11-degerlendirme bağlamına taşıma
- Öncelik: Önemli
- Faz: Faz 4
- Tahmini büyüklük: Orta

### User story

Bir geliştirici olarak, yorum görseli kararlarını yorumla birlikte yönetmek istiyorum.
Böylece yorum silinince günlük de temizlenir.

### Kabul kriterleri

- [ ] İnceleme silinirken günlük saklama kuralı uygulanır.
- [ ] Sözleşme testi `reviews/api.py::record_review_image_decision` çağrısının mevcut davranışı koruduğunu gösterir.
- [ ] Yorum silme testi yalnız o yoruma ait moderasyon günlüklerinin silindiğini gösterir.
- [ ] Characterization test: `Image Moderation Log` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- Günlüğü genel medya temizliğine bağlamayın. Silme kararını değerlendirme servisi verir.
- Günlüğün `review` bağını kaldırmayın. Bağ ilgili yorumu gösterir.
- Dış bağlamdan `reviews` iç dosyalarını çağırmayın. Geçişte `record_review_image_decision` sözleşmesini kullanın.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] `Image Moderation Log` için kabul koşullarını otomatik testte doğrulayın.
- [ ] `reviews` iç dosyalarına dış erişimleri `import-linter` ile kontrol edin.
- [ ] `CODEOWNERS` üzerinden `reviews` paketinin sahibinden inceleme isteyin.
- [ ] `tradehub_core/tradehub_core/doctype/listing_review/listing_review.py:591` bağımlılığının geçiş sonrası çağrı yolunu inceleyin.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?
İnceleme görsellerine verilen moderasyon kararlarını kaydeder. `tradehub_core/tradehub_core/doctype/image_moderation_log/image_moderation_log.json:31`
Kayıt alanlarını DocType şeması tanımlar. `tradehub_core/tradehub_core/doctype/image_moderation_log/image_moderation_log.json:31`

## Bugünkü bağımlılıklar
### Bu kaydın bağlandığı kayıtlar
- `Listing Review` (`review`): başka bağlam (`11-degerlendirme`). `tradehub_core/tradehub_core/doctype/image_moderation_log/image_moderation_log.json:18`
### Bu kayda dokunan kod
- `tradehub_core/api/moderation.py:172`: yazıyor
- `tradehub_core/tradehub_core/doctype/listing_review/listing_review.py:591`: siliyor
### hooks.py kayıtları
- `tradehub_core/hooks.py:763`: doc_event. İnceleme resmi eklenince moderasyon işleyicisi çalışıyor.
- Doğrudan ada göre kanca bulunmadı. Dolaylı kayıtlar doğrulanmadı. `tradehub_core/hooks.py:453`

## Bağımlılık sorunları
1. Yorum silme işlemi moderasyon günlüğünü doğrudan siliyor. İnceleme bağlamının saklama davranışı etkilenebilir. `tradehub_core/tradehub_core/doctype/listing_review/listing_review.py:591`

## Hedef tasarım
- `11-degerlendirme` bu kayda `tradehub_core/reviews/` paketinde sahip olsun.
- Dışarıya açılacak fonksiyonlar. `tradehub_core/reviews/api.py::record_review_image_decision`
- Olaylar. Bu kayıt için ayrıca bağlamlar arası olay önerilmiyor.
- Bağlantılar. `review` yeni sahip bağlam içinde kalsın.
- Doğrulama ve iş akışı. İnceleme servisi yoruma ait günlüğü yorumla birlikte silsin.

## Geçiş adımları
1. Mevcut davranış için aşağıdaki testi ekle. `record_review_image_decision` sözleşmesini mevcut uygulama üzerinden geçir.
2. İlk adımdan sonra moderasyon kancasını değerlendirme paketindeki işleyiciye bağla. Silme davranışını koru.
3. İkinci adımdan sonra modül kaydını taşı. Eski Python girişlerini geçiş süresince yönlendir.

## Riskler ve testler
- İnceleme silinirken günlük saklama kuralı uygulanır.
