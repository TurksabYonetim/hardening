# Seller Review

- Bağlam: 11-degerlendirme
- Tür: Ana kayıt
- Klasör: `tradehub_core/tradehub_core/doctype/seller_review`
- Denetleyici: `tradehub_core/tradehub_core/doctype/seller_review/seller_review.py` (73 satır)
- Önerilen sahip bağlam: 11-degerlendirme. Kayıt satıcı mağazasını anlatır. Ama yorum kuralları bu bağlamdadır. 02-satici-magaza bağlamı yalnız özet puanı okumalıdır.

## Epic

- Epic adı: Seller Review: 11-degerlendirme bağlamına taşıma
- Öncelik: Acil
- Faz: Faz 4
- Tahmini büyüklük: Orta

### User story

Bir satıcı olarak, mağaza puanımın tek ve doğru bir hesapla gösterilmesini istiyorum.
Böylece alıcılar mağazamı yanlış puanla görmez.

### Kabul kriterleri

- [ ] Mağaza puanını tek bir `reviews` fonksiyonu hesaplıyor. `api/listing.py:596` ve `api/seller.py:1659` hesapları kaldırıldı.
- [ ] `recompute_seller_rating_proxy` fonksiyonu `api/listing.py` dosyasında kalmıyor.
- [ ] `Admin Seller Profile.rating` alanını yalnız 02-satici-magaza bağlamı yazıyor. Yorum kodu `seller.rating_changed` olayı yayınlıyor.
- [ ] Aynı yorum kümesi için eski ve yeni hesap aynı puanı veriyor. Bunu bir test kanıtlıyor.
- [ ] Characterization test: `Seller Review` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- `Admin Seller Profile` kaydına `set_value` ile yazmayın. Puanı olayla gönderin.
- Mağaza puanı hesabını katalog dosyasına koymayın. Hesap `reviews` paketinde durur.
- İki puan hesabından birini sessizce silmeyin. Önce ürün sahibine hangisinin doğru olduğunu sorun.
- `hooks.py` dosyasına doğrudan yeni `doc_events` kaydı eklemeyin.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] Puan hesabı için test eklendi.
- [ ] `seller.rating_changed` olayı için sözleşme testi eklendi.
- [ ] `import-linter` kontrolü geçiyor.
- [ ] 02-satici-magaza bağlamının `CODEOWNERS` sahibinden inceleme istendi.
- [ ] Ürün sahibinin puan kararı PR açıklamasına yazıldı.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?
Alıcı, satıcı mağazası için puan ve yorum yazar. Bu kayıt o yorumu tutar. Yayında olan yorumlar mağazanın puan ortalamasına katılır. Kayıt siparişe bağlı değildir.

## Bugünkü bağımlılıklar
### Bu kaydın bağlandığı kayıtlar
- `Admin Seller Profile` (`seller`): başka bağlam (02-satici-magaza)
### Bu kayda dokunan kod
- `tradehub_core/api/seller.py:1689`: yazıyor (`submit_review`, `insert`)
- `tradehub_core/api/seller.py:1638`: okuyor (mağaza yorum listesi)
- `tradehub_core/api/seller.py:1659`: yazıyor (`Admin Seller Profile` puanı)
- `tradehub_core/api/listing.py:596`: yazıyor (`Admin Seller Profile` puanı)
- `tradehub_core/tradehub_core/api/dashboard_engine.py:193`: okuyor
- `tradehub_core/seed_demo_data.py:3317`: yazıyor (deneme verisi)
### hooks.py kayıtları
- `tradehub_core/hooks.py:728`: `before_insert` ve `validate` kiracı kancaları.
- `tradehub_core/hooks.py:736`: `after_insert`, `on_update` ve `on_trash` kancaları `tradehub_core.api.listing.recompute_seller_rating_proxy` fonksiyonunu çağırır.
- `tradehub_core/hooks.py:1084` ve `tradehub_core/hooks.py:1211`: okuma izni kuralları.
- `tradehub_core/utils/tenant.py:104`: kayıt `COUNTERPARTY_SELLER_DOCTYPES` listesindedir.

## Bağımlılık sorunları
1. Yorum hesabı katalog kodunda duruyor. `recompute_seller_rating_proxy` `tradehub_core/api/listing.py:559` içindedir. Katalog dosyası değişince satıcı puanı bozulabilir.
2. Satıcı puanını iki ayrı yer yazıyor. `tradehub_core/api/listing.py:596` ve `tradehub_core/api/seller.py:1659` aynı alanları günceller. İki hesap farklı sonuç verebilir.
3. Puan, satıcı tablosuna `set_value` ile yazılıyor. Satıcı ekibi `rating` alanını değiştirirse yorum akışı bozulur.
4. Kayıt siparişe bağlı değil. `reviewer_name` kullanıcının adından dolar ama Link alanı değildir. Aynı ada ikinci yorum engellenir (`tradehub_core/api/seller.py:1687`). Gerçek alım kontrolü bulunmadı. Bu bir iş kuralı açığıdır.

## Hedef tasarım
- Sahip bağlam ve paket yolu: `tradehub_core/reviews/`.
- Dışarıya açılan fonksiyonlar: `reviews.api.submit_seller_review(seller, rating, comment)` ve `reviews.api.get_seller_reviews(seller, page)`.
- Yayınladığı olay: `seller.rating_changed` (seller, average_rating, review_count). 02-satici-magaza bağlamı bu olayla kendi alanını yazar.
- Dinlediği olay yoktur.
- `seller` Link alanı kalır.
- Denetleyicide puan aralığı kalır. Bildirim servise taşınır.

## Geçiş adımları
1. İki puan hesabını tek bir `reviews` fonksiyonunda birleştirin. Hangi hesabın doğru olduğunu ürün sahibine sorun.
2. `recompute_seller_rating_proxy` fonksiyonunu `api/listing.py` dosyasından `reviews` paketine taşıyın. `hooks.py:736` yolunu güncelleyin.
3. `seller.rating_changed` olayını yayınlayın. Bu adım olay yayınlayıcısı hazır olunca yapılır.
4. `Admin Seller Profile` yazımını 02-satici-magaza dinleyicisine taşıyın. Bu adım 3. adımdan sonra gelir.

## Riskler ve testler
- Mağaza puanı eski kalabilir. Yayınlama, gizleme ve silme sonrası puanı sınayan test ekleyin.
- İki hesap birleşince puan değişebilir. Birleşmeden önce iki hesabın sonucunu karşılaştıran test yazın.
