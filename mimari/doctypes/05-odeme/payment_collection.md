# Payment Collection

- Bağlam: 05-odeme
- Tür: Kayıt defteri (log)
- Klasör: `tradehub_core/tradehub_core/doctype/payment_collection`
- Denetleyici: `tradehub_core/tradehub_core/doctype/payment_collection/payment_collection.py` (81 satır)
- Önerilen sahip bağlam: 05-odeme

## Epic

- Epic adı: Payment Collection: 05-odeme bağlamına taşıma
- Öncelik: Kritik
- Faz: Faz 3
- Tahmini büyüklük: Orta

### User story

Bir geliştirici olarak, tahsilatın sipariş durumunu olay ile değiştirmesini istiyorum.
Böylece ödeme ve sipariş ekipleri birbirini beklemeden çalışır.

### Kabul kriterleri

- [ ] `payment.collected` olayı tahsilatla aynı işlemde Outbox kaydına yazılıyor.
- [ ] `payments/service.py` `Order` tablosuna yazmıyor.
- [ ] Aynı olay iki kez gelince stok bir kez düşüyor.
- [ ] Geçiş bayrağı kapalıyken eski yol çalışıyor.
- [ ] Characterization test: `Payment Collection` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- Tahsilat kaydını silmeyin. Yanlış kayıt "Reversed" yapılır.
- Aynı denemeye ikinci tahsilat açmayın. `payment_attempt` alanı benzersizdir.
- Sipariş durumunu ödeme kodundan yazmayın.
- Bayrağı test etmeden eski yolu silmeyin.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] Olay sözleşme testi eklendi.
- [ ] Kurtarma işi testi eklendi.
- [ ] Bayrak açık ve kapalı iki durumda test edildi.
- [ ] Sipariş ve katalog ekibinden inceleme istendi.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?
`Payment Collection` doğrulanmış bir tahsilattır. Tahsilat, paranın gerçekten alındığı demektir. Her başarılı deneme en çok bir tahsilat üretir (`payment_attempt` alanı benzersizdir). Kayıt para hareketinin kanıtıdır. Durum yalnız "Verified" ya da "Reversed" olur.

## Bugünkü bağımlılıklar
### Bu kaydın bağlandığı kayıtlar
- `Payment Intent` (`payment_intent`): aynı bağlam
- `Payment Attempt` (`payment_attempt`): aynı bağlam
- `Order` (`order`): başka bağlam (04-siparis)
- `User` (`buyer`): framework kaydı
- `Admin Seller Profile` (`seller`): başka bağlam (02-satici-magaza)
- `Currency` (`currency`): framework kaydı
- `User` (`verified_by`): framework kaydı
- `Payment Transaction` (`payment_transaction`): aynı bağlam

### Bu kayda dokunan kod
- `tradehub_core/payments/service.py:389`: yazıyor (`_create_collection`)
- `tradehub_core/payments/service.py:510`: yazıyor (eski işlem bağlantısı)
- `tradehub_core/payments/service.py:372`: tahsilat sonrası siparişi ve stoğu değiştirir (`_apply_order_side_effects`)
- `tradehub_core/payments/installments.py:229`: kilitli okuyor (taksit dağıtımı)
- `tradehub_core/payments/bank_statements.py:521`: okuyor (banka satırı eşleştirme)
- `tradehub_core/shared_sync/late_collections.py:44`: kilitli okuyor
- `tradehub_core/shared_sync/seller_records.py:246`: okuyor
- `tradehub_core/shared_sync/contracts.py:149`: değişiklik tetikleyici listesinde

### Denetleyicinin kendi dış çağrıları
- `payment_collection.py:14`: `listing_purge.guards.planned_delete` içe aktarır.
- `payment_collection.py:75`: `payments.write_guard.require_verified_write` çağırır.

### hooks.py kayıtları
- `hooks.py:1197` ve `hooks.py:1328`: liste ve kayıt izni.
- `hooks.py:1516`: `on_update` olayına denetim işleyicisi eklenir.

## Bağımlılık sorunları
1. Tahsilat aynı işlemde sipariş durumunu ve stoğu değiştirir (`payments/service.py:434`). Kanıt: `payments/service.py:453` siparişi yazar, `payments/service.py:454` stoğu düşer. Sipariş geliştiricisi durum adını değiştirirse ödeme kodu da değişmeli. Bu sorun 04-siparis ve 03a-katalog bağlamlarını bağlar.
2. Aynı yol `shared_sync.checkout.record_late_collection` çağırır (`payments/service.py:441`). Geç tahsilat kuralı ödeme kodunun içinde duruyor.

## Hedef tasarım
- Sahip bağlam: 05-odeme.
- Dışarıya açılan fonksiyon: `payments.api.get_payment_status` tahsil edilen tutarı verir.
- Yayınladığı olaylar:
  - `payment.collected`: talep tamamen tahsil edilince yayınlanır. Veri `event_id`, `intent`, `order`, `source_doctype`, `source_name`, `amount_exact`, `currency`, `collected_at`.
  - `payment.collection_reversed`: veri `intent`, `collection`, `amount_exact`.
- Dinlediği olaylar: yok.
- Kural: `_apply_order_side_effects` kaldırılır. Bunun yerine `payment.collected` Outbox kaydına yazılır. Kayıt tahsilatla aynı işlemdedir. Sipariş bağlamı olayı işler. Sonra stok için `order.confirmed` yayınlar.
- Denetleyicide kalacak doğrulamalar: para birimi uyumu ve doğrulanmış yazım (`payment_collection.py:20`).

## Geçiş adımları
1. Olay altyapısını kurun. Bu adım önce gelir.
2. `payments/service.py:434` fonksiyonunu ikiye bölün. Ödeme tarafı yalnız `payment.collected` yayınlasın. Sipariş tarafı `ordering/handlers.py:on_payment_collected` içinde olsun.
3. Geçiş süresince iki yol bir bayrakla seçilsin. Örnek: `Marketplace Settings.use_payment_events`. Bayrak kapalıysa eski yol çalışır.
4. `record_late_collection` kontrolünü sipariş işleyicisine taşıyın.
5. Bayrağı açın ve eski yolu silin.

## Riskler ve testler
- Ödeme ile sipariş arasında kısa bir gecikme olur. Test: ödeme sonrası birkaç saniye içinde sipariş "Onaylanıyor" olmalı.
- Olay kaybolabilir. Test: işçi düşerse zamanlanmış kurtarma olayı yeniden göndermeli.
- Stok iki kez düşebilir. Test: aynı olay iki kez gelince stok bir kez düşmeli.
