# Seller Shipping Charge

- Bağlam: 07-lojistik
- Tür: Kayıt defteri (log)
- Klasör: `tradehub_core/tradehub_core/doctype/seller_shipping_charge`
- Denetleyici: `tradehub_core/tradehub_core/doctype/seller_shipping_charge/seller_shipping_charge.py` (15 satır)
- Önerilen sahip bağlam: 07-lojistik yazar. 05-odeme bu kaydı olay yoluyla almalıdır. Kayıt bir para alacağıdır.

## Epic

- Epic adı: Seller Shipping Charge: 07-lojistik bağlamına taşıma
- Öncelik: Acil
- Faz: Faz 3
- Tahmini büyüklük: Orta

### User story

Bir platform yöneticisi olarak, satıcının kargo borcunun ödeme tarafına ulaşmasını istiyorum.
Böylece açık kalan borç gözden kaçmaz.

### Kabul kriterleri

- [ ] Kalemin nasıl kapanacağı ödeme ekibiyle yazılı karar olarak kaydedildi.
- [ ] Yeni kalem açılınca `logistics.charge_recorded` olayı yayınlanıyor.
- [ ] Kalem iptal edilince `logistics.charge_cancelled` olayı yayınlanıyor.
- [ ] `payment.seller_charge_settled` olayı gelince kalem "Settled" oluyor.
- [ ] Aynı `source_key` için ikinci kalem açılmıyor. Bunu bir test gösteriyor.
- [ ] Characterization test: `Seller Shipping Charge` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- Ödeme kodundan bu tabloya doğrudan yazmayın. Ödeme bağlamı olayı dinlemeli.
- `source_key` tekilliğini kaldırmayın. Aynı ücret iki kez borç yazılır.
- Kalemi silmeyin. İptal edilen kalem iz olarak kalmalıdır.
- Satıcının kendi taşıyıcı hesabı için kalem açmayın. Bu durumda platform alacağı yoktur.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] Olay tekrar testi ve `source_key` tekillik testi eklendi.
- [ ] Sevkiyat iptali sonrası kalem durumu testi geçiyor.
- [ ] İki olay için sözleşme testi eklendi.
- [ ] Ödeme ekibinden `CODEOWNERS` incelemesi istendi.
- [ ] `import-linter` kontrolü geçiyor.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?

`Seller Shipping Charge` satıcının platforma borçlu olduğu kargo ücretini tutar. Satıcı platformun taşıyıcı hesabını kullanırsa bu kayıt açılır. Ücret türü kargo, iade kargosu ya da ağırlık farkı olabilir. Kayıt "Open", "Settled" ya da "Cancelled" durumunda olur.

## Bugünkü bağımlılıklar

### Bu kaydın bağlandığı kayıtlar

- `Admin Seller Profile` (`seller_profile`, zorunlu): başka bağlam (02-satici-magaza)
- `Shipment` (`shipment`, zorunlu): aynı bağlam
- `Order` (`order`): başka bağlam (04-siparis)
- `Carrier Account` (`carrier_account`): aynı bağlam
- `Currency` (`currency`, zorunlu): çekirdek Frappe kaydı

### Bu kayda dokunan kod

- `tradehub_core/logistics/services/shipment_money.py:70`: yazıyor. Yeni kalem açıyor.
- `tradehub_core/logistics/services/shipment_money.py:64`: yazıyor. Kapalı kalemi yeniden açıyor.
- `tradehub_core/logistics/services/shipment_money.py:90`: yazıyor. Sevkiyat iptal olunca kalemi iptal ediyor.
- `tradehub_core/logistics/return_shipping.py:192`: iade kargosu kalemi açıyor.
- `tradehub_core/listing_purge/executor.py:38`: siliyor.

### hooks.py kayıtları

- Kayıt yok. İptal çağrısı `Shipment` kaydının `on_update` kancasından gelir (`tradehub_core/logistics/hooks.py:220`).

## Bağımlılık sorunları

1. Kalemi okuyan bir ödeme ya da hesap kesim kodu bulunamadı. Arama yalnız lojistik ve ürün silme kodunu gösterdi. "Settled" durumuna geçiren kod da bulunamadı. Bu nokta doğrulanmadı. Para bağlamı bu borçtan habersiz olabilir (05-odeme).
2. Kayıt `frappe.db.set_value` ile güncelleniyor. Kanıt: `tradehub_core/logistics/services/shipment_money.py:90`. Denetleyici kuralları bu yolda çalışmaz. Bugün denetleyicide kural yok, bu yüzden etkisi küçüktür.

## Hedef tasarım

- Sahip bağlam ve paket yolu: 07-lojistik, `tradehub_core/logistics/doctype/seller_shipping_charge/`.
- Dışarıya açılan fonksiyonlar: `list_open_charges(seller_profile: str) -> list[ChargeLine]`. Ödeme bağlamı mutabakatta bunu okur.
- Yayınladığı olaylar:
  - `logistics.charge_recorded`: `charge`, `seller_profile`, `shipment`, `order`, `charge_type`, `amount`, `currency`, `source_key`.
  - `logistics.charge_cancelled`: `charge`, `source_key`.
  - 05-odeme bu olayları dinler. Satıcı bakiyesine yazar.
- Dinlediği olaylar: `payment.seller_charge_settled`. Lojistik kalemi "Settled" yapar.
- Başka bağlamlara bağlantılar: `order` ve `seller_profile` Link alanları kalır.
- Denetleyicide kalacak doğrulamalar: tutar sıfırdan büyük olmalı, `source_key` tekil olmalı.

## Geçiş adımları

1. Ödeme ekibiyle bu kalemin nasıl kapanacağını netleştirin. Karar yazılı olsun.
2. `logistics.charge_recorded` ve `logistics.charge_cancelled` olaylarını yayınlayın. Outbox hazır olduktan sonra yapılır.
3. 05-odeme bağlamında dinleyiciyi yazın.
4. `payment.seller_charge_settled` dinleyicisini lojistikte yazın.
5. DocType klasörünü "Logistics" modülüne taşıyın.

## Riskler ve testler

- Aynı ücret iki kez borç yazılabilir. `source_key` tekillik testini ve olay tekrar testini ekleyin.
- Sevkiyat iptalinde borç açık kalabilir. İptal sonrası kalem durumu testini koruyun.
