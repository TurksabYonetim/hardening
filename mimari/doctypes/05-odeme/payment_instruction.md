# Payment Instruction

- Bağlam: 05-odeme
- Tür: Kayıt defteri (log)
- Klasör: `tradehub_core/tradehub_core/doctype/payment_instruction`
- Denetleyici: `tradehub_core/tradehub_core/doctype/payment_instruction/payment_instruction.py` (57 satır)
- Önerilen sahip bağlam: 05-odeme

## Epic

- Epic adı: Payment Instruction: 05-odeme bağlamına taşıma
- Öncelik: Önemli
- Faz: Faz 3
- Tahmini büyüklük: Küçük

### User story

Bir alıcı olarak, havaleyi sipariş anındaki doğru hesaba yapmak istiyorum.
Böylece param yanlış hesaba gitmez.

### Kabul kriterleri

- [ ] `get_payment_instruction` fonksiyonu var.
- [ ] `api/order.py` talimatı bu fonksiyondan okuyor.
- [ ] Hesap değişikliğinden sonra eski sipariş eski talimatı gösteriyor.
- [ ] Characterization test: `Payment Instruction` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- Etkin talimatı değiştirmeyin. Yeni sürüm açın.
- Sipariş kodundan `payments.manual_instructions` içe aktarmayın.
- Talimatı güncel hesaptan yeniden üretmeyin.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] Talimat sabitlik testi geçiyor.
- [ ] Okuma modeli testi eklendi.
- [ ] `import-linter` kontrolü geçiyor.
- [ ] Sipariş ekibinden inceleme istendi.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?
`Payment Instruction` sipariş anında sabitlenen havale talimatıdır. Talimat alıcının hangi hesaba ne kadar göndereceğini yazar. Satıcı hesabı sonra değişse de talimat değişmez. Yeni talimat açılınca eskisi "Superseded" olur.

## Bugünkü bağımlılıklar
### Bu kaydın bağlandığı kayıtlar
- `Payment Intent` (`payment_intent`): aynı bağlam
- `Order` (`order`): başka bağlam (04-siparis)
- `User` (`buyer`): framework kaydı
- `Admin Seller Profile` (`seller`): başka bağlam (02-satici-magaza)
- `Seller Bank Account Version` (`bank_account_version`): aynı bağlam
- `Currency` (`currency`): framework kaydı
- `User` (`issued_by`): framework kaydı
- `Payment Instruction` (`supersedes`): aynı bağlam
- `Payment Instruction` (`superseded_by`): aynı bağlam

### Bu kayda dokunan kod
- `tradehub_core/payments/manual_instructions.py:93`: yazıyor (talimatı açar)
- `tradehub_core/payments/service.py:627`: sipariş anında `issue_at_order` çağırır
- `tradehub_core/api/order.py:879`: okuyor (alıcıya talimat gösterir)
- `tradehub_core/payments/current_reads.py:24`: kilitli okuyor
- `tradehub_core/shared_sync/contracts.py:148`: dondurma listesinde

### hooks.py kayıtları
- `hooks.py:1568`: liste ve kayıt izni `payments.manual_guard` içindedir.

## Bağımlılık sorunları
1. Sipariş API'si talimatı ödeme iç modülünden okuyor (`api/order.py:879`). `manual_instructions` imzası değişince sipariş ekranı bozulur.

## Hedef tasarım
- Sahip bağlam: 05-odeme.
- Dışarıya açılan fonksiyon: `payments.api.get_payment_instruction(order) -> InstructionView`.
- Olay yoktur. Talimat `open_for_order` içinde açılır.
- Denetleyicide kalacak doğrulama: `manual_guard` yazım kapısı.

## Geçiş adımları
1. `get_payment_instruction` fonksiyonunu ekleyin.
2. `api/order.py:878` fonksiyonu bu çağrıyı kullansın.

## Riskler ve testler
- Alıcı yanlış hesabı görebilir. Test: hesap değişikliğinden sonra eski sipariş eski talimatı göstermeli.
