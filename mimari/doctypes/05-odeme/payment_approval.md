# Payment Approval

- Bağlam: 05-odeme
- Tür: Kayıt defteri (log)
- Klasör: `tradehub_core/tradehub_core/doctype/payment_approval`
- Denetleyici: `tradehub_core/tradehub_core/doctype/payment_approval/payment_approval.py` (14 satır)
- Önerilen sahip bağlam: 05-odeme

## Epic

- Epic adı: Payment Approval: 05-odeme bağlamına taşıma
- Öncelik: Düşük
- Faz: Faz 3
- Tahmini büyüklük: Küçük

### User story

Bir platform yöneticisi olarak, süresi dolan onayın kullanılmamasını istiyorum.
Böylece eski karar yanlış iade başlatmaz.

### Kabul kriterleri

- [ ] `expires_at` geçince işlem reddediliyor.
- [ ] Karar `payment.refund_approved` olayına veri veriyor.
- [ ] Kayıt `Payment Operation` ile aynı pakette.
- [ ] Characterization test: `Payment Approval` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- Kararı sonradan değiştirmeyin.
- Onayı istek sahibine verdirmeyin.
- `guard_write` kapısını atlamayın.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] Süre aşımı testi eklendi.
- [ ] Denetim satırı testi geçiyor.
- [ ] `ruff` kontrolü geçiyor.
- [ ] `CODEOWNERS` sahibinden inceleme istendi.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?
`Payment Approval` bir para çıkışı isteğinin onay kararıdır. Karar onay ya da ret olur. Kayıt kararın hangi sürüme ve hangi içerik özetine verildiğini tutar. Onayın bir son geçerlilik zamanı vardır.

## Bugünkü bağımlılıklar
### Bu kaydın bağlandığı kayıtlar
- `Payment Operation` (`payment_operation`): aynı bağlam
- `User` (`approver`): framework kaydı
- `User` (`buyer`): framework kaydı
- `Admin Seller Profile` (`seller`): başka bağlam (02-satici-magaza)

### Bu kayda dokunan kod
- `tradehub_core/payments/operations.py:259`: yazıyor (kararı kaydeder)
- `tradehub_core/payments/audit.py:76`: denetim satırı üretir
- `tradehub_core/permissions.py:3353`: izin sorgusu

### hooks.py kayıtları
- `hooks.py:1078` ve `hooks.py:1202`: liste ve kayıt izni.
- `hooks.py:1518`: `on_update` olayına denetim işleyicisi eklenir.

## Bağımlılık sorunları
Önemli bir bağımlılık sorunu bulunmadı.

## Hedef tasarım
- Sahip bağlam: 05-odeme.
- Dışarıya açılan fonksiyon: `payments.api.approve_operation`.
- Olay: karar `payment.refund_approved` olayına veri verir.
- Denetleyicide kalacak doğrulama: `guard_write` yazım kapısı.

## Geçiş adımları
1. Değişiklik gerekmez. `Payment Operation` ile aynı pakette kalır.

## Riskler ve testler
- Süresi dolmuş onay kullanılabilir. Test: `expires_at` geçince işlem reddedilmeli.
