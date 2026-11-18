# Payment Transaction

- Bağlam: 05-odeme
- Tür: Ana kayıt
- Klasör: `tradehub_core/tradehub_core/doctype/payment_transaction`
- Denetleyici: `tradehub_core/tradehub_core/doctype/payment_transaction/payment_transaction.py` (52 satır)
- Önerilen sahip bağlam: 05-odeme

## Epic

- Epic adı: Payment Transaction: 05-odeme bağlamına taşıma
- Öncelik: Acil
- Faz: Faz 3
- Tahmini büyüklük: Orta

### User story

Bir geliştirici olarak, eski ödeme kaydını tek bir yerden yazmak istiyorum.
Böylece alıcının ödeme geçmişi tutarlı görünür.

### Kabul kriterleri

- [ ] `create_payment_transaction` ve `update_transaction_status` `payments/legacy_view.py` içinde.
- [ ] `payments/service.py` `api.payment` modülünü içe aktarmıyor.
- [ ] `api/order.py` iade için `payments.api.request_refund` çağırıyor.
- [ ] Yeni sipariş sonrası alıcı listesinde bir satır var.
- [ ] Characterization test: `Payment Transaction` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- Ödeme çekirdeğinden `api/` katmanını içe aktarmayın. Bağımlılık yönü ters olur.
- Bu tabloya `api/order.py` ya da `shared_sync` içinden yazmayın.
- Bu kaydı yeni ödeme kanıtı gibi kullanmayın. Kanıt `Payment Collection` kaydıdır.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] Alıcı ödeme listesi testi geçiyor.
- [ ] Eski kayıt bağlama testi geçiyor.
- [ ] `import-linter` kontrolü geçiyor.
- [ ] Sipariş ekibinden inceleme istendi.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?
`Payment Transaction` eski ödeme kaydıdır. Bugün yeni ödeme zincirinin uyumluluk görünümü olarak yaşar. Zincir `Payment Intent`, `Payment Attempt` ve `Payment Collection` kayıtlarıdır. Alıcı ve satıcı ekranları ödeme geçmişini bu tablodan okur.

## Bugünkü bağımlılıklar
### Bu kaydın bağlandığı kayıtlar
- `Payment Intent` (`payment_intent`): aynı bağlam
- `Payment Attempt` (`payment_attempt`): aynı bağlam
- `Payment Collection` (`payment_collection`): aynı bağlam
- `Order` (`order`): başka bağlam (04-siparis)
- `User` (`buyer`): framework kaydı
- `Currency` (`currency`): framework kaydı
- `Seller Bank Account Version` (`seller_bank_account_version`): aynı bağlam
- `User` (`confirmed_by`): framework kaydı

### Bu kayda dokunan kod
- `tradehub_core/api/payment.py:788`: yazıyor (`create_payment_transaction`)
- `tradehub_core/api/payment.py:841`: yazıyor (`update_transaction_status`)
- `tradehub_core/payments/service.py:514`: yazıyor (uyumluluk eşitlemesi)
- `tradehub_core/payments/service.py:542`: `api.payment.create_payment_transaction` fonksiyonunu içe aktarır
- `tradehub_core/api/order.py:1690`: yazıyor (iade isteği)
- `tradehub_core/api/order.py:1800`: yazıyor (iade kararı)
- `tradehub_core/payments/manual_refunds.py:321`: yazıyor
- `tradehub_core/shared_sync/refund_links.py:151`: yazıyor
- `tradehub_core/api/payment.py:152`: okuyor (alıcı ödeme listesi)
- `tradehub_core/api/accounting.py:45`: okuyor

### Denetleyicinin kendi dış çağrıları
- `payment_transaction.py:18`: `payments.bank_accounts.validate_version_link` çağırır.
- `payment_transaction.py:40`: `Payment Attempt` okur.

### hooks.py kayıtları
- `hooks.py:691`: `after_insert` olayı `payments.service.link_legacy_transaction` işleyicisini çağırır.
- `hooks.py:1192` ve `hooks.py:1324`: liste ve kayıt izni.

## Bağımlılık sorunları
1. Ödeme çekirdeği API katmanından fonksiyon alıyor (`payments/service.py:542`). Bağımlılık yönü ters. API dosyası değişince ödeme çekirdeği bozulur.
2. Sipariş API'si ve `shared_sync` bu tabloya doğrudan yazıyor (`api/order.py:1690`, `shared_sync/refund_links.py:151`). Uyumluluk görünümünü dört ayrı yer yazar.

## Hedef tasarım
- Sahip bağlam: 05-odeme. Paket yolu: `tradehub_core/payments/legacy_view.py`.
- Kayıt bir okuma modeli olur. Yalnız ödeme bağlamı yazar.
- Dışarıya açılan fonksiyonlar (`payments/api.py`):
  - `list_buyer_payments(user, filters) -> Page[PaymentRow]`
  - `request_refund(order: str, amount, reason) -> str`
- Yayınladığı olaylar: yok.
- Dinlediği olaylar: yok. Eşitleme ödeme zincirinin kendi kodunda kalır.
- Denetleyicide kalacak doğrulamalar: alıcı hesabı anlık görüntüsü (`payment_transaction.py:12`) ve zincir bağlantıları (`payment_transaction.py:32`).

## Geçiş adımları
1. `create_payment_transaction` ve `update_transaction_status` fonksiyonlarını `payments/legacy_view.py` içine taşıyın. `api/payment.py` yeni yolu çağırsın.
2. `payments/service.py:542` içe aktarımını yeni yola çevirin.
3. `api/order.py:1690` ve `api/order.py:1800` yazımlarını `payments.api.request_refund` çağrısına çevirin.
4. `shared_sync/refund_links.py:151` yazımını aynı fonksiyona çevirin.

## Riskler ve testler
- Alıcı ödeme geçmişi boş görünebilir. Test: yeni sipariş sonrası listede bir satır olmalı.
- Eski kayıt bağlanmayabilir. Test: zincire bağlı olmayan eski satır "Legacy Unverified" denemeye bağlanmalı.
