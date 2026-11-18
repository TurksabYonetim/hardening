# Coupon

- Bağlam: 04-siparis
- Tür: Ana kayıt
- Klasör: `tradehub_core/tradehub_core/doctype/coupon`
- Denetleyici: `tradehub_core/tradehub_core/doctype/coupon/coupon.py` (5 satır)
- Önerilen sahip bağlam: 04-siparis (ileride 09-icerik-vitrin içinde bir kampanya bağlamı açılırsa oraya gidebilir)

## Epic

- Epic adı: Coupon: 04-siparis bağlamına taşıma
- Öncelik: Önemli
- Faz: Faz 3
- Tahmini büyüklük: Küçük

### User story

Bir geliştirici olarak, kupon kurallarını tek bir dosyada bulmak istiyorum.
Böylece sepet kodunu değiştirirken kuponu bozmam.

### Kabul kriterleri

- [ ] Kupon fonksiyonları `ordering/coupons.py` içinde.
- [ ] Sayaç artışı `frappe.qb` ile yapılıyor ve satır kilidi korunuyor.
- [ ] `tests/test_coupon_race.py` ve `tests/test_cart_price_tampering.py` geçiyor.
- [ ] Yüzde kuponda değer 100'ü geçince kayıt reddediliyor.
- [ ] Characterization test: `Coupon` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- İstemciden gelen `coupon_discount` değerine güvenmeyin. İndirim sunucuda hesaplanır.
- Kupon satırını kilitsiz okumayın. Eşzamanlı siparişler sayacı bozar.
- Kural tutmazsa siparişi sessizce indirimsiz açmayın. Sipariş reddedilir.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] Yarış testi geçiyor.
- [ ] Fiyat oynatma testi geçiyor.
- [ ] Değer doğrulaması için önce başarısız test yazıldı.
- [ ] `ruff` kontrolü geçiyor.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?
`Coupon` sepette kullanılan indirim kodudur. Kod yüzde, sabit tutar ya da kargo indirimi verebilir. Kullanım sayısı `used_count` alanında tutulur. Sipariş anında sayaç bir artar.

## Bugünkü bağımlılıklar
### Bu kaydın bağlandığı kayıtlar
- `Currency` (`currency`): framework kaydı

### Bu kayda dokunan kod
- `tradehub_core/api/cart.py:1451`: okuyor (etkin kuponu kilitli okur)
- `tradehub_core/api/cart.py:1587`: yazıyor (`used_count` alanını ham SQL ile artırır)
- `tradehub_core/api/cart.py:2265`: okuyor (alıcıya kupon listesi)
- `tradehub_core/patches/v15_9_75_kur_bos_para_birimi.py:17`: yazıyor (yama)

### hooks.py kayıtları
- Kayıt yok.

## Bağımlılık sorunları
1. Kupon kuralları ve sayaç artırma `api/cart.py` içinde dağınık duruyor (`api/cart.py:1449`, `api/cart.py:1571`). Kupon ayrı bir modül değil. Sepet dosyası her değiştiğinde kupon mantığı da etkilenir.
2. Sayaç ham SQL ile artırılır (`api/cart.py:1587`). Bu kod kuralı tercih ettiği `frappe.qb` kullanmaz. Davranış doğrudur ama dokunması zordur.
Başka bağlam bu kayda dokunmuyor.

## Hedef tasarım
- Sahip bağlam: 04-siparis. Paket yolu: `tradehub_core/ordering/coupons.py`.
- Dışarıya açılan fonksiyonlar (`ordering/api.py`):
  - `list_buyer_coupons(user: str) -> list[CouponView]`
- İç fonksiyonlar: `reserve_coupon(code, groups, user)` ve `coupon_shares(...)`.
- Yayınladığı olaylar: yok. Kupon kullanımı `order.placed` verisinde `coupon_code` olarak gider.
- Dinlediği olaylar: `order.cancelled`. Kupon iade kuralı varsa sayaç burada geri alınır. Bugün böyle bir kural yok, iş kararı gerekir.
- Başka bağlamlara bağlantılar: yok.
- Denetleyicide kalacak doğrulamalar: `value` sıfırdan büyük olmalı. Yüzde kuponda değer 100'ü geçmemeli. Bu kurallar bugün yok, eklenmesi önerilir.

## Geçiş adımları
1. Kupon fonksiyonlarını `api/cart.py:1445` ile `api/cart.py:1626` arasından `ordering/coupons.py` dosyasına taşıyın. Davranış değişmesin.
2. Sayaç artırmayı `frappe.qb` ile yazın. Kilit davranışını aynı tutun.
3. Denetleyiciye değer doğrulamasını ekleyin. Önce testi yazın.

## Riskler ve testler
- Eşzamanlı kullanım sayacı bozabilir. Var olan test korunmalı: `tests/test_coupon_race.py:111`.
- Fiyat oynatma saldırısı geri gelebilir. Var olan test korunmalı: `tests/test_cart_price_tampering.py:213`.
