# RFQ Quote

- Bağlam: 04-siparis
- Tür: Ana kayıt
- Klasör: `tradehub_core/tradehub_core/doctype/rfq_quote`
- Denetleyici: `tradehub_core/tradehub_core/doctype/rfq_quote/rfq_quote.py` (127 satır)
- Önerilen sahip bağlam: 04-siparis, `ordering/sourcing/` alt paketi

## Epic

- Epic adı: RFQ Quote: 04-siparis bağlamına taşıma
- Öncelik: Önemli
- Faz: Faz 3
- Tahmini büyüklük: Küçük

### User story

Bir satıcı olarak, teklifimin alıcıya güvenilir şekilde ulaşmasını istiyorum.
Böylece satış fırsatını kaçırmam.

### Kabul kriterleri

- [ ] Teklif bildirimleri `rfq.quote_*` olaylarıyla gidiyor.
- [ ] Teklif denetleyicisi `RFQ` kaydına yazmıyor.
- [ ] Toplam fiyat birim fiyat çarpı adetle uyuşmazsa kayıt reddediliyor.
- [ ] Characterization test: `RFQ Quote` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- Teklif denetleyicisinden `RFQ.quote_count` alanına yazmayın.
- Teklifi siparişe çevirmeyi karar verilmeden eklemeyin.
- Başka satıcının teklifini satıcı kimliğiyle değiştirmeyin.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] Toplam fiyat testi geçiyor.
- [ ] Bildirim olayı testi eklendi.
- [ ] Yetki testi geçiyor.
- [ ] `ruff` kontrolü geçiyor.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?
`RFQ Quote` satıcının bir teklif isteğine verdiği cevaptır. Teklif birim fiyatı, toplam fiyatı ve teslim süresini tutar. Teklif bir ilana bağlanabilir. Alıcı teklifi kabul eder ya da reddeder.

## Bugünkü bağımlılıklar
### Bu kaydın bağlandığı kayıtlar
- `RFQ` (`rfq`): aynı bağlam
- `User` (`seller`): framework kaydı
- `Admin Seller Profile` (`seller_profile`): başka bağlam (02-satici-magaza)
- `Currency` (`currency`): framework kaydı
- `Listing` (`listing`): başka bağlam (03a-katalog)

### Bu kayda dokunan kod
- `tradehub_core/api/rfq.py:457`: yazıyor (teklif açar)
- `tradehub_core/api/rfq.py:722`: yazıyor (diğer teklifleri "Rejected" yapar)
- `tradehub_core/api/rfq.py:328`: yazıyor (`is_seen_by_buyer`)
- `tradehub_core/api/v1/dashboard.py:106`: okuyor
- `tradehub_core/permissions.py:1896`: okuyor
- `tradehub_core/tradehub_core/doctype/rfq/rfq.py:148`: okuyor

### Denetleyicinin kendi dış çağrıları
- `rfq_quote.py:16`: `utils.seller_store.my_store` ile satıcı mağazasını bulur.
- `rfq_quote.py:36`: `RFQ.quantity` okur.
- `rfq_quote.py:127`: `RFQ.quote_count` yazar.

### hooks.py kayıtları
- `hooks.py:1100` ve `hooks.py:1242`: liste ve kayıt izni `permissions.py` içindedir.

## Bağımlılık sorunları
1. Denetleyici bildirimleri doğrudan gönderir (`rfq_quote.py:64`, `rfq_quote.py:93`). Bu sorun 12-bildirim-iletisim bağlamını etkiler.
2. Kabul edilen teklif siparişe dönmüyor. Teklif ile sipariş arasında bağ yok. Bu bir eksik olabilir, iş kararı gerekir.

## Hedef tasarım
- Sahip bağlam: 04-siparis. Paket yolu: `tradehub_core/ordering/sourcing/`.
- Dışarıya açılan fonksiyonlar (`ordering/api.py`):
  - `submit_quote(rfq: str, data: QuoteInput) -> str`
  - `accept_quote(quote: str) -> None`
- Yayınladığı olaylar: `rfq.quote_submitted`, `rfq.quote_accepted`, `rfq.quote_rejected`. Veri `quote`, `rfq`, `seller_profile`, `buyer`.
- Dinlediği olaylar: yok.
- Başka bağlamlara bağlantılar: `seller_profile` ve `listing` Link alanları kalır. `listing_title` ve `listing_image` anlık görüntüdür.
- Denetleyicide kalacak doğrulamalar: toplam fiyat kuralı (`rfq_quote.py:24`).

## Geçiş adımları
1. Bildirimleri olaya çevirin. `RFQ` raporundaki 2. adımla birlikte yapılabilir.
2. `RFQ.quote_count` yazımını `RFQ` servisine bırakın.
3. Teklif kabulü için siparişe dönüşüm kararını ürün sahibiyle netleştirin.

## Riskler ve testler
- Toplam fiyat hatası geri gelebilir. Test: birim fiyat çarpı adet toplamla uyuşmazsa kayıt reddedilmeli.
- Alıcı yeni teklifi görmeyebilir. Test: teklif açılınca alıcıya bildirim gitmeli.
