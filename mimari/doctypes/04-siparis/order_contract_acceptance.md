# Order Contract Acceptance

- Bağlam: 04-siparis
- Tür: Kayıt defteri (log)
- Klasör: `tradehub_core/tradehub_core/doctype/order_contract_acceptance`
- Denetleyici: `tradehub_core/tradehub_core/doctype/order_contract_acceptance/order_contract_acceptance.py` (20 satır)
- Önerilen sahip bağlam: 04-siparis

## Epic

- Epic adı: Order Contract Acceptance: 04-siparis bağlamına taşıma
- Öncelik: Önemli
- Faz: Faz 3
- Tahmini büyüklük: Orta

### User story

Bir geliştirici olarak, sözleşme kabulünü belgeli bir okuma modelinden okumak istiyorum.
Böylece ödeme ve lojistik alan adlarına bağlı kalmaz.

### Kabul kriterleri

- [ ] `ordering.api.get_accepted_terms` fonksiyonu var ve sözleşme testi geçiyor.
- [ ] `payments/checkout_plans.py`, `payments/terms_plan.py` ve `logistics/return_shipping.py` bu fonksiyonu kullanıyor.
- [ ] `contracts/` paketi `ordering/contracts/` konumunda. Eski yol yönlendirme ile çalışıyor.
- [ ] Kabul kaydı güncellenmek ya da silinmek istenince hata veriliyor.
- [ ] Characterization test: `Order Contract Acceptance` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- Kabul kaydını değiştirmeyin ya da silmeyin. Kayıt hukuki kanıttır.
- Başka bağlamdan `frappe.get_doc("Order Contract Acceptance")` ile yeni okuma eklemeyin. Okuma modelini kullanın.
- Sözleşme kodundan ödeme iç modülünü çağırmayın. `payments.api` kullanın.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] Okuma modeli sözleşme testi eklendi.
- [ ] İade kargo hesabı test edildi.
- [ ] Eski yol yönlendirmesi test edildi.
- [ ] Ödeme ve lojistik ekibinden inceleme istendi.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?
`Order Contract Acceptance` alıcının sipariş anında kabul ettiği sözleşmeyi kanıtlar. Kayıt satıcı şartlarının sürümünü ve özet değerini tutar. Ödeme modeli, kabul edilen tutar ve banka hesabı sürümü de saklanır. Kayıt sonradan değiştirilemez ve silinemez.

## Bugünkü bağımlılıklar
### Bu kaydın bağlandığı kayıtlar
- `Order` (`order`): aynı bağlam
- `User` (`buyer_user`): framework kaydı
- `Admin Seller Profile` (`seller`): başka bağlam (02-satici-magaza)
- `Seller Terms Version` (`seller_terms_version`): başka bağlam (02-satici-magaza)
- `Currency` (`currency`): framework kaydı
- `Seller Bank Account Version` (`bank_account_version`): başka bağlam (05-odeme)

### Bu kayda dokunan kod
- `tradehub_core/contracts/service.py:487`: yazıyor (`record_acceptance`)
- `tradehub_core/api/cart.py:2163`: siparişe bağlantıyı yazıyor
- `tradehub_core/payments/checkout_plans.py:66`: okuyor (taksit seçimi)
- `tradehub_core/payments/terms_plan.py:40`: okuyor (şart sürümü)
- `tradehub_core/logistics/return_shipping.py:55`: okuyor (iade şartı)
- `tradehub_core/api/contracts.py:185`: okuyor
- `tradehub_core/shared_sync/customer_documents.py:56`: okuyor

### Denetleyicinin kendi kuralları
- `order_contract_acceptance.py:15`: kayıt değiştirilemez.
- `order_contract_acceptance.py:19`: kayıt silinemez.

### hooks.py kayıtları
- Kayıt yok.

## Bağımlılık sorunları
1. Ödeme ve lojistik bu kaydı doğrudan okuyor (`payments/checkout_plans.py:66`, `logistics/return_shipping.py:55`). Alan adları değişirse iki bağlam bozulur. Okuma kabul edilebilir ama belgeli bir okuma modeli gerekir.
2. Yazan kod `contracts/` paketinde (`contracts/service.py:487`). Bu paket ödeme iç modülünü çağırır (`contracts/service.py:481`). Sözleşme ile ödeme arasında gizli bir bağ var.

## Hedef tasarım
- Sahip bağlam: 04-siparis. Paket yolu: `tradehub_core/ordering/contracts/`. `contracts/` paketi buraya taşınır.
- Dışarıya açılan fonksiyonlar (`ordering/api.py`):
  - `get_accepted_terms(order: str) -> AcceptedTerms` (okuma modeli). Veri `seller_terms_version`, `payment_model`, `installment_selection`, `bank_account_version`, `incoterm`.
- Yayınladığı olaylar: yok. Kabul bilgisi `order.placed` verisine eklenir.
- Dinlediği olaylar: yok.
- Başka bağlamlara bağlantılar: bütün Link alanları kalır. Kayıt bir kanıt kaydıdır, değerler anlık görüntüdür.
- Denetleyicide kalacak doğrulamalar: değiştirme ve silme yasağı.
- Taksit doğrulaması (`payments.checkout_plans.validate_order`) ödeme bağlamının public API fonksiyonu olur.

## Geçiş adımları
1. `get_accepted_terms` okuma modelini ekleyin.
2. `payments/checkout_plans.py:66`, `payments/terms_plan.py:40` ve `logistics/return_shipping.py:55` bu fonksiyonu kullansın. Her bağlam ayrı PR açabilir.
3. `contracts/` paketini `ordering/contracts/` konumuna taşıyın. Eski yolda yönlendirme bırakın.

## Riskler ve testler
- Kanıt kaydı değiştirilebilir. Test: kayıt güncellenmek istenince hata vermeli.
- İade şartı yanlış okunabilir. Test: iade kargo hesabı okuma modeli ile aynı sürümü bulmalı.
