# Order Dispute

- Bağlam: 04-siparis
- Tür: Ana kayıt
- Klasör: `tradehub_core/tradehub_core/doctype/order_dispute`
- Denetleyici: `tradehub_core/tradehub_core/doctype/order_dispute/order_dispute.py` (49 satır)
- Önerilen sahip bağlam: 04-siparis. Bugün kayıt yalnız düşük puanlı yorumdan açılır (`api/dispute.py:39`). Yorum bağı 11-degerlendirme ile olaylar üzerinden kurulmalı.

## Epic

- Epic adı: Order Dispute: 04-siparis bağlamına taşıma
- Öncelik: Önemli
- Faz: Faz 3
- Tahmini büyüklük: Orta

### User story

Bir geliştirici olarak, anlaşmazlık sonucunun yorum kaydına olay ile gitmesini istiyorum.
Böylece değerlendirme kodu değişince anlaşmazlık bozulmaz.

### Kabul kriterleri

- [ ] Anlaşmazlık kodu `ordering/disputes.py` içinde.
- [ ] `order.dispute_opened` ve `order.dispute_resolved` olayları yayınlanıyor.
- [ ] `order_dispute.py` ve `api/dispute.py` `Listing Review` kaydına yazmıyor.
- [ ] Desk formunda durum değişince de olay yayınlanıyor.
- [ ] Characterization test: `Order Dispute` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- Anlaşmazlık kodundan `Listing Review` alanına yazmayın. Değerlendirme bağlamı olayı dinler.
- `hooks.py` içine yeni `Order Dispute` olayı eklemeyin. Dinleyiciyi bağlam dosyasına yazın.
- Alıcı lehine sonuçtan otomatik iade başlatmayın. Bu bir iş kararıdır.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] Olay sözleşme testi eklendi.
- [ ] Yorum rozeti testi geçiyor.
- [ ] Kiracı izolasyonu testi geçiyor.
- [ ] Değerlendirme ekibinden inceleme istendi.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?
`Order Dispute` alıcı ile satıcı arasındaki anlaşmazlığı tutar. Kayıt bir siparişe ve gerekirse bir kaleme bağlıdır. Anlaşmazlık türü kalite, yanlış ürün, hasar ya da teslim edilmeme olabilir. Yönetici sonucu alıcı ya da satıcı lehine kapatır.

## Bugünkü bağımlılıklar
### Bu kaydın bağlandığı kayıtlar
- `Order` (`order`): aynı bağlam
- `Order Item` (`order_item`): aynı bağlam
- `Listing Review` (`related_review`): başka bağlam (11-degerlendirme)
- `User` (`buyer`): framework kaydı
- `Admin Seller Profile` (`seller`): başka bağlam (02-satici-magaza)

### Bu kayda dokunan kod
- `tradehub_core/api/dispute.py:64`: yazıyor (kaydı açar)
- `tradehub_core/api/dispute.py:77`: başka bağlamı yazıyor (`Listing Review.related_dispute`)
- `tradehub_core/api/dispute.py:102`: başka bağlamı yazıyor (`Listing Review` sonucu)
- `tradehub_core/api/dispute.py:90`: okuyor
- `tradehub_core/tasks.py:269`: okuyor (alıcı risk puanı)
- `tradehub_core/api/analytics.py:119`: okuyor (açık kayıt sayısı)
- `tradehub_core/tradehub_core/doctype/listing_review/listing_review.py:49`: okuyor

### Denetleyicinin kendi dış yazımı
- `order_dispute.py:43`: `Listing Review.dispute_resolved_in_favor_of` alanını yazar (11-degerlendirme).

### hooks.py kayıtları
- `hooks.py:942`: `before_insert` ve `validate` olaylarında kiracı izolasyonu çalışır.
- `hooks.py:1089` ve `hooks.py:1216`: liste ve kayıt izni `permissions.py` içindedir.

## Bağımlılık sorunları
1. Denetleyici ve API, değerlendirme bağlamının kaydını doğrudan yazıyor (`order_dispute.py:43`, `api/dispute.py:77`, `api/dispute.py:102`). Değerlendirme alanları değişirse anlaşmazlık akışı bozulur. Bu sorun 11-degerlendirme bağlamını etkiler.
2. Anlaşmazlık sonucu para iadesine bağlı değil. Alıcı lehine sonuç iade başlatmaz. Bu bir eksik olabilir, iş kararı gerekir.

## Hedef tasarım
- Sahip bağlam: 04-siparis. Paket yolu: `tradehub_core/ordering/disputes.py`.
- Dışarıya açılan fonksiyonlar (`ordering/api.py`):
  - `open_dispute(order: str, order_item: str | None, dispute_type: str, description: str, related_review: str | None) -> str`
  - `resolve_dispute(dispute: str, in_favor_of: str, note: str) -> None`
  - `count_disputes_for_buyer(user: str) -> int` (risk puanı için)
- Yayınladığı olaylar:
  - `order.dispute_opened`: veri `dispute`, `order`, `related_review`.
  - `order.dispute_resolved`: veri `dispute`, `order`, `in_favor_of`, `related_review`.
- Dinlediği olaylar: yok.
- 11-degerlendirme bağlamı `order.dispute_*` olaylarını dinler. Kendi `Listing Review` alanlarını kendisi yazar.
- Başka bağlamlara bağlantılar: `related_review`, `buyer` ve `seller` Link alanları kalır.
- Denetleyicide kalacak doğrulamalar: `resolved_at` ve `in_favor_of` alanlarının doldurulması (`order_dispute.py:11`).

## Geçiş adımları
1. `ordering/disputes.py` dosyasını açın. `api/dispute.py` mantığını buraya taşıyın.
2. `order.dispute_opened` ve `order.dispute_resolved` olaylarını yayınlayın. Bu adım olay altyapısından sonra gelir.
3. 11-degerlendirme bağlamı bu olayları dinlesin. Sonra `order_dispute.py:43` ve `api/dispute.py:77`, `api/dispute.py:102` yazımlarını kaldırın.
4. `tasks.py:269` sayımı `count_disputes_for_buyer` fonksiyonunu kullansın.

## Riskler ve testler
- Yorum rozeti eksik kalabilir. Test: anlaşmazlık çözülünce yorumda sonuç görünmeli.
- Desk formundan kapatma olay üretmeyebilir. Test: Desk formunda durum değişince de olay yayınlanmalı.
