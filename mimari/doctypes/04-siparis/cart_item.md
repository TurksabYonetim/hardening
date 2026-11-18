# Cart Item

- Bağlam: 04-siparis
- Tür: Alt tablo
- Klasör: `tradehub_core/tradehub_core/doctype/cart_item`
- Denetleyici: `tradehub_core/tradehub_core/doctype/cart_item/cart_item.py` (48 satır)
- Önerilen sahip bağlam: 04-siparis

## Epic

- Epic adı: Cart Item: 04-siparis bağlamına taşıma
- Öncelik: Önemli
- Faz: Faz 3
- Tahmini büyüklük: Küçük

### User story

Bir geliştirici olarak, sepet satırı doğrulamasının katalog alan adlarına bağlı olmamasını istiyorum.
Böylece katalog değişince sepet bozulmaz.

### Kabul kriterleri

- [ ] `cart_item.py` stok ve durum bilgisini `catalog.api.get_purchasable` ile alıyor.
- [ ] Katalog ve mağaza kodu bu tabloya yazmıyor.
- [ ] Stok yetmezse satır eklenmiyor. Test geçiyor.
- [ ] Numune adedi 2 olunca kayıt reddediliyor.
- [ ] Characterization test: `Cart Item` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- Denetleyicide `frappe.db.get_value("Listing", ...)` ile yeni alan okumayın. Okuma modelini kullanın.
- Başka bağlamdan `Cart Item` silmeyin. Silme olay ile yapılır.
- `snapshot_*` alanlarını güncel fiyat gibi kullanmayın. Bunlar anlık görüntüdür.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] Stok ve numune testleri geçiyor.
- [ ] `catalog.api.get_purchasable` için sözleşme testi var.
- [ ] `import-linter` kontrolü geçiyor.
- [ ] Katalog ekibinden inceleme istendi.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?
`Cart Item` sepetteki tek ürün satırıdır. Satır ilanı, varyantı, adedi ve satıcıyı tutar. Başlık, görsel ve fiyat anlık görüntü olarak saklanır. Numune satırı `is_sample` alanıyla işaretlenir.

## Bugünkü bağımlılıklar
### Bu kaydın bağlandığı kayıtlar
- `Listing` (`listing`): başka bağlam (03a-katalog)
- `Admin Seller Profile` (`seller`): başka bağlam (02-satici-magaza)

### Bu kayda dokunan kod
- `tradehub_core/api/cart.py:1182`: yazıyor (satır ekler)
- `tradehub_core/api/cart.py:1256`: yazıyor (adet, `db.set_value`)
- `tradehub_core/api/cart.py:1270`: yazıyor (satır siler)
- `tradehub_core/api/cart.py:2233`: yazıyor (sipariş sonrası siler)
- `tradehub_core/api/listing.py:5748`: yazıyor (ilan arşivlenince siler)
- `tradehub_core/services/store_cleanup.py:47`: yazıyor (mağaza silinince siler)
- `tradehub_core/shared_sync/checkout.py:391`: yazıyor (siler)
- `tradehub_core/api/cart_summary.py:637`: okuyor
- `tradehub_core/media/seo_cikti.py:197`: okuyor (`snapshot_image` görsel adresi)

### Denetleyicinin kendi dış çağrıları
- `cart_item.py:15`: `Listing` durumunu, stoğunu ve numune fiyatını okur (03a-katalog).

### hooks.py kayıtları
- Kayıt yok.

## Bağımlılık sorunları
1. Katalog ve mağaza bağlamı satırı doğrudan siler (`api/listing.py:5748`, `services/store_cleanup.py:47`). Sepet sahibi bağlam bu silmeyi göremez.
2. Denetleyici `Listing` alanlarını doğrudan okur (`cart_item.py:15`). Katalog `stock_qty` veya `status` alanını değiştirirse sepet doğrulaması bozulur.

## Hedef tasarım
- Sahip bağlam: 04-siparis. Paket yolu: `tradehub_core/ordering/cart/`.
- Dışarıya açılan fonksiyonlar: `ordering.api.get_active_cart`. Satıra özel ayrı fonksiyon gerekmez.
- Yayınladığı olaylar: yok.
- Dinlediği olaylar: `listing.archived` (03a-katalog) ve `store.deleted` (02-satici-magaza).
- Başka bağlamlara bağlantılar: `listing` ve `seller` Link olarak kalır. `snapshot_*` alanları anlık görüntüdür.
- Denetleyicide kalacak doğrulamalar: adet sıfırdan büyük olmalı, numune adedi en çok 1 olmalı. İlan durumu ve stok bilgisi `catalog.api.get_purchasable(listing)` çağrısından gelmeli.

## Geçiş adımları
1. 03a-katalog bağlamı `catalog.api.get_purchasable` fonksiyonunu açsın. Bu adım önce gelir.
2. `cart_item.py:15` okuması bu fonksiyona geçsin.
3. Silme yollarını `Cart` raporundaki 2. ve 3. adımla birlikte olaylara taşıyın.

## Riskler ve testler
- Stok kontrolü gevşeyebilir. Test: stok yetmezse satır eklenmemeli.
- Numune kuralı bozulabilir. Test: numune adedi 2 olunca hata vermeli.
