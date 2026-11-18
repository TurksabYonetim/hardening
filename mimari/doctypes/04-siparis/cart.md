# Cart

- Bağlam: 04-siparis
- Tür: Ana kayıt
- Klasör: `tradehub_core/tradehub_core/doctype/cart`
- Denetleyici: `tradehub_core/tradehub_core/doctype/cart/cart.py` (5 satır)
- Önerilen sahip bağlam: 04-siparis

## Epic

- Epic adı: Cart: 04-siparis bağlamına taşıma
- Öncelik: Önemli
- Faz: Faz 3
- Tahmini büyüklük: Küçük

### User story

Bir alıcı olarak, sepetimde yalnız satın alınabilir ürünleri görmek istiyorum.
Böylece sipariş anında "ürün bulunamadı" hatası almam.

### Kabul kriterleri

- [ ] Sepet okuma ve silme kodu `ordering/cart/service.py` içinde.
- [ ] İlan arşivlenince `listing.archived` olayı sepet satırını siliyor.
- [ ] Mağaza silinince `store.deleted` olayı sepet satırını siliyor.
- [ ] `services/store_cleanup.py` ve `api/listing.py` sepet tablosuna yazmıyor.
- [ ] Characterization test: `Cart` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- Katalog kodundan `Cart Item` silmeyin. Sepet bağlamı `listing.archived` olayını dinler.
- Sepeti `Cart.save` ile kaydetmeyin. Silinmiş alıcı hesabı kaydı düşürür (`services/store_cleanup.py:43`).
- Bir alıcıya ikinci etkin sepet açmayın. `buyer` alanı benzersizdir.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] Arşivlenen ilan testi eklendi.
- [ ] Mağaza silme testi eklendi.
- [ ] Olay dinleyicisi iki kez çalıştı ve hata vermedi.
- [ ] `CODEOWNERS` sahibinden inceleme istendi.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?
`Cart` her alıcının kalıcı alışveriş sepetidir. Alıcı ilk ürünü ekleyince sepet açılır. Ürün satırları `Cart Item` alt tablosundadır. Sipariş verilince satırlar sepetten silinir.

## Bugünkü bağımlılıklar
### Bu kaydın bağlandığı kayıtlar
- `User` (`buyer`): framework kaydı, kimlik bağlamı (01-kimlik-erisim)
- `Cart Item` (`items`, alt tablo): aynı bağlam

### Bu kayda dokunan kod
- `tradehub_core/api/cart.py:215`: yazıyor (sepeti açar)
- `tradehub_core/api/cart.py:212`: okuyor (etkin sepeti bulur)
- `tradehub_core/api/cart_summary.py:627`: okuyor
- `tradehub_core/shared_sync/checkout.py:385`: okuyor (sonra satır siler)
- `tradehub_core/services/store_cleanup.py:47`: yazıyor (mağaza silinince satır siler)
- `tradehub_core/privacy/data_export.py:157`: okuyor (kişisel veri dışa aktarımı)
- `tradehub_core/tradehub_core/doctype/user_profile/user_profile_dashboard.py:9`: okuyor (pano bağlantısı)

### hooks.py kayıtları
- Kayıt yok.

## Bağımlılık sorunları
1. Başka bağlamlar sepetin satırlarını doğrudan siliyor. Mağaza temizliği satır siler (`services/store_cleanup.py:47`). Katalog satır siler (`api/listing.py:5748`). Sepet kuralı değişirse bu yollar haberdar olmaz. Bu sorun 02-satici-magaza ve 03a-katalog bağlamlarını ilgilendirir.
2. `shared_sync` sepeti kendi bulur ve satır siler (`shared_sync/checkout.py:385`). Sepet silme kuralı iki yerde yazılı durur.

## Hedef tasarım
- Sahip bağlam: 04-siparis. Paket yolu: `tradehub_core/ordering/cart/`.
- Dışarıya açılan fonksiyonlar (`ordering/api.py`):
  - `get_active_cart(user: str) -> CartView`
  - `remove_ordered_lines(user: str, lines: list[CartLineKey])`
- Yayınladığı olaylar: yok. Sepet geçici veridir.
- Dinlediği olaylar:
  - `listing.archived` (03a-katalog): ilanın sepet satırları silinir.
  - `store.deleted` (02-satici-magaza): mağazanın sepet satırları silinir.
  - `user.erased` (13-uyum-gizlilik): sepet silinir.
- Başka bağlamlara bağlantılar: `buyer` Link alanı kalır.
- Denetleyicide kalacak doğrulamalar: alıcı başına tek etkin sepet. Bu kural bugün koda yazılı değil, `buyer` alanı benzersizdir.

## Geçiş adımları
1. `ordering/cart/service.py` dosyasını açın. Sepet okuma ve silme işlerini `api/cart.py` içinden buraya taşıyın.
2. `listing.archived` olayını dinleyen işleyiciyi ekleyin. Sonra `api/listing.py:5748` silme satırını kaldırın. Bu adım olay altyapısından sonra gelir.
3. `store.deleted` olayını dinleyen işleyiciyi ekleyin. Sonra `services/store_cleanup.py:47` satırını kaldırın.
4. `shared_sync/checkout.py:385` yolu `remove_ordered_lines` fonksiyonunu çağırsın.

## Riskler ve testler
- Arşivlenen ilan sepette kalabilir. Test: ilan arşivlenince sepet satırı silinmeli.
- Mağaza silme işlemi düşebilir. Test: sepet sahibinin hesabı silinmişken mağaza silme başarılı olmalı.
