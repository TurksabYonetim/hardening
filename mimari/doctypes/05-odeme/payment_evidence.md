# Payment Evidence

- Bağlam: 05-odeme
- Tür: Kayıt defteri (log)
- Klasör: `tradehub_core/tradehub_core/doctype/payment_evidence`
- Denetleyici: `tradehub_core/tradehub_core/doctype/payment_evidence/payment_evidence.py` (48 satır)
- Önerilen sahip bağlam: 05-odeme

## Epic

- Epic adı: Payment Evidence: 05-odeme bağlamına taşıma
- Öncelik: Önemli
- Faz: Faz 3
- Tahmini büyüklük: Orta

### User story

Bir alıcı olarak, yüklediğim dekontu sipariş ekranında görmek istiyorum.
Böylece ödememin alındığından emin olurum.

### Kabul kriterleri

- [ ] `get_latest_evidence` fonksiyonu var.
- [ ] Sipariş ekranı belgeyi bu fonksiyondan okuyor.
- [ ] `manual_evidence.py` `Order.receipt_url` alanına yazmıyor.
- [ ] `payment.evidence_submitted` olayı yayınlanıyor.
- [ ] Characterization test: `Payment Evidence` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- Ödeme kodundan `Order` alanına yazmayın.
- Eski belge sürümünü silmeyin. Sürüm "Superseded" olur.
- Belge dosyasını herkese açık klasöre koymayın.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] Yükleme sonrası görünürlük testi eklendi.
- [ ] Olay sözleşme testi eklendi.
- [ ] Dosya izni testi geçiyor.
- [ ] Sipariş ekibinden inceleme istendi.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?
`Payment Evidence` elle yapılan ödemenin belgesidir. Belge dekont, çek, senet ya da tahsilat makbuzu olabilir. Her yeni yükleme yeni sürüm açar. Satıcı ya da finans ekibi belgeyi kabul eder ya da yeniden ister.

## Bugünkü bağımlılıklar
### Bu kaydın bağlandığı kayıtlar
- `Payment Intent` (`payment_intent`): aynı bağlam
- `Order` (`order`): başka bağlam (04-siparis)
- `User` (`buyer`): framework kaydı
- `Admin Seller Profile` (`seller`): başka bağlam (02-satici-magaza)
- `Payment Attempt` (`payment_attempt`): aynı bağlam
- `Payment Evidence` (`supersedes`): aynı bağlam
- `User` (`uploaded_by`): framework kaydı
- `User` (`reviewed_by`): framework kaydı
- `Payment Collection` (`basis_for_collection`): aynı bağlam
- `User` (`original_received_by`): framework kaydı

### Bu kayda dokunan kod
- `tradehub_core/payments/manual_evidence.py:44`: yazıyor (belgeyi açar)
- `tradehub_core/payments/manual_evidence.py:174`: siparişi yazıyor (`Order.receipt_url`)
- `tradehub_core/payments/service.py:935`: kilitli okuyor (iptalde belge kapatma)
- `tradehub_core/payments/payment_summary.py:43`: okuyor
- `tradehub_core/api/v1/manual_payments.py:117`: okuyor
- `tradehub_core/shared_sync/contracts.py:147`: dondurma listesinde

### hooks.py kayıtları
- `hooks.py:1569`: liste ve kayıt izni `payments.manual_guard` içindedir.

## Bağımlılık sorunları
1. Ödeme kodu siparişin `receipt_url` alanını yazıyor (`payments/manual_evidence.py:174`). Sipariş bu alanı kendi sahiplenmiyor. Sipariş geliştiricisi alanı kaldırırsa ödeme belgesi yüklemesi düşer. Bu sorun 04-siparis bağlamını bağlar.

## Hedef tasarım
- Sahip bağlam: 05-odeme.
- Dışarıya açılan fonksiyonlar: `payments.api.submit_manual_evidence(order, file, kind)` ve `payments.api.get_latest_evidence(order)`.
- Yayınladığı olaylar: `payment.evidence_submitted`. Veri `intent`, `order`, `evidence`, `version_no`.
- Dinlediği olaylar: yok.
- `Order.receipt_url` alanı kaldırılır. Sipariş ekranı belgeyi `get_latest_evidence` ile okur. Geçiş süresince sipariş bağlamı `payment.evidence_submitted` olayını dinleyip alanı kendisi yazar.

## Geçiş adımları
1. `get_latest_evidence` okuma fonksiyonunu ekleyin.
2. Sipariş ekranı ve API alanı bu fonksiyondan okusun.
3. `manual_evidence.py:174` yazımını olay yayınına çevirin.
4. `Order.receipt_url` alanını kaldırma kararını sipariş sahibiyle verin.

## Riskler ve testler
- Alıcı yüklediği dekontu göremeyebilir. Test: yükleme sonrası sipariş detayı son belgeyi göstermeli.
