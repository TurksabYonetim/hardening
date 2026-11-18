# 05-odeme bağlamı

Bu belge ödeme bağlamının hedef tasarımını anlatır. Satır numaraları `origin/version-15` dalının `08e51e53` işlemine göredir. Terimlerin açıklaması ve olay altyapısı `04-siparis/README.md` belgesinin 4.1 bölümündedir.

## 1. Bağlamın amacı

Ödeme bağlamı paranın kimden kime ne kadar gittiğini kaydeder. Bağlam ödeme talebini açar, denemeleri izler ve tahsilatı kanıtlar. İade, taksit, havale talimatı ve banka ekstresi eşleştirmesi de bu bağlamdadır.

Bugün bu bağlamın çekirdeği iyi ayrılmış durumda. Yazımlar çoğunlukla `payments/` paketindedir. Yazım kapıları vardır, örneğin `payments/write_guard.py` ve `payments/manual_guard.py`. Kalıcı iş kuyruğu vardır (`payments/jobs.py:1`). Sorun, bağlamın kenarlarındadır. Ödeme siparişi ve stoğu yazar. Diğer bağlamlar da ödeme iç modüllerini çağırır.

## 2. DocType listesi

Ana kayıtlar:

- `Payment Intent`
- `Payment Attempt`
- `Payment Operation`
- `Payment Installment Plan`
- `Payment Transaction` (eski kayıt, okuma modeli olacak)
- `Buyer Bank Interaction` (eski kayıt, okuma modeli olacak)
- `Seller Balance`
- `Subscription Payment` (02-satici-magaza bağlamına taşınmalı)
- `Field Commission` (02-satici-magaza bağlamına taşınmalı)
- `Currency Rate Pair` (paylaşılan çekirdeğe taşınmalı)
- `Supported Currency` (paylaşılan çekirdeğe taşınmalı)

Kayıt defterleri (log):

- `Payment Collection`
- `Payment Approval`
- `Payment Audit Event`
- `Payment Job` ve `Payment Job Event`
- `Payment Idempotency Record`
- `Manual Payment Command`
- `Payment Instruction`
- `Payment Evidence` ve `Payment Evidence Cleanup`
- `Payment Refund Record`
- `Payment Installment Allocation`
- `Bank Statement Line`
- `Seller Bank Account Version`

Alt tablolar:

- `Payment Intent Charge`
- `Payment Installment`
- `Field Commission Quota Tier`

Ayarlar:

- `Payment Provider Credential` (sağlayıcı başına kayıt)
- `Field Commission Settings` (single)

## 3. Bağlamın dışa açık API'si

Diğer bağlamlar yalnız `tradehub_core/payments/api.py` içindeki fonksiyonları çağırır. Tipler `tradehub_core/payments/contracts.py` dosyasındadır.

Komutlar:

1. `open_for_order(order: PayableOrder, method: str, instant: bool, accepted: AcceptedTerms) -> PaymentChain`
2. `cancel_for_order(order: str, reason: str) -> CancelResult`
3. `start_attempt(intent: str, method: AttemptInput) -> str`
4. `record_attempt_result(attempt: str, outcome: str, evidence: ProviderEvidence) -> AttemptResult`
5. `submit_manual_evidence(order: str, file, kind: str) -> str`
6. `request_refund(order: str, amount, reason: str) -> str`
7. `approve_operation(operation: str, decision: str) -> OperationView`
8. `report_refund_sent(operation: str, data) -> str`
9. `propose_installment_plan(order: str, rows, currency: str, terms: str) -> PlanView`
10. `accept_installment_plan(plan: str, content_hash: str) -> PlanView`
11. `ensure_subscription_intent(payment: str, period_start, period_end) -> str`
12. `register_seller_account(seller: str, iban: str, holder: str, bank_name: str, source: str) -> str`

Okuma modelleri:

1. `get_payment_status(source_doctype: str, source_name: str) -> PaymentStatusView`
2. `get_payment_instruction(order: str) -> InstructionView`
3. `get_latest_evidence(order: str) -> EvidenceView | None`
4. `get_active_plan(order: str) -> PlanView | None`
5. `get_refund_totals(intent: str) -> RefundTotals`
6. `get_payment_target(seller: str, readonly: bool) -> PaymentTarget`
7. `get_account_status(seller: str) -> AccountStatus`
8. `get_seller_balance(seller: str) -> SellerBalanceView`
9. `list_buyer_payments(user: str, filters) -> Page[PaymentRow]`

## 4. Yayınlanan ve dinlenen olaylar

Bu bağlamın sipariş zincirindeki yeri `04-siparis/README.md` belgesinin 4.2 bölümündedir. Kısaca şöyledir:

1. Sipariş bağlamı sepet onayında `open_for_order` çağırır. Bu çağrı eşzamanlıdır.
2. Ödeme bağlamı tahsilatı doğrular ve `payment.collected` yayınlar.
3. Sipariş bağlamı bu olayla siparişi kesinleştirir.

Yayınlanan olaylar:

- `payment.collected`. Veri: `intent`, `source_doctype`, `source_name`, `order`, `amount_exact`, `currency`, `collected_at`. Dinleyenler: 04-siparis, 02-satici-magaza (abonelik), 05-odeme (satıcı bakiyesi).
- `payment.partially_collected`. Veri: aynı alanlar ve `collected_amount_exact`. Dinleyen: 12-bildirim-iletisim.
- `payment.attempt_failed`. Veri: `intent`, `attempt`, `failure_code`. Dinleyen: 12-bildirim-iletisim.
- `payment.cancelled`. Veri: `intent`, `order`, `reason`. Dinleyen: 04-siparis.
- `payment.evidence_submitted`. Veri: `intent`, `order`, `evidence`, `version_no`. Dinleyenler: 04-siparis, 12-bildirim-iletisim.
- `payment.refund_approved` ve `payment.refunded`. Veri: `intent`, `order`, `operation`, `refund`, `amount_exact`, `currency`. Dinleyenler: 04-siparis, 03a-katalog (iade stoğu).
- `payment.plan_accepted` ve `payment.installment_overdue`. Veri: `intent`, `order`, `plan`, `installment_no`. Dinleyen: 12-bildirim-iletisim.
- `seller_account.changed`. Veri: `seller`, `version`, `ownership_status`. Dinleyen: 02-satici-magaza.

Dinlenen olaylar:

- `order.cancelled` (04-siparis): talep kapatılır ya da iade başlar.
- `order.refund_requested` (04-siparis): iade isteği açılır.
- `order.amended` (04-siparis): taksit planı gözden geçirilir.
- `store.bank_details_submitted` (02-satici-magaza): yeni hesap sürümü açılır.

## 5. Bağlamlar arası en ağır 10 bağımlılık

1. Ödeme sipariş durumunu yazıyor. Kanıt: `payments/service.py:453`. Etkilenen bağlam 04-siparis.
2. Ödeme stoğu düşüyor. Kanıt: `payments/service.py:454` (`utils.stock.deduct_stock_for_order`). Etkilenen bağlam 03a-katalog.
3. Lojistik ödeme iç modülünü içe aktarıyor ve talep durumunu okuyor. Kanıt: `logistics/hooks.py:444`, `logistics/hooks.py:448`. Etkilenen bağlam 07-lojistik.
4. Mağaza denetleyicisi ödeme iç modülünü çağırıyor. Ödeme de mağaza tablosunu okuyor. Kanıt: `admin_seller_profile.py:62`, `payments/bank_accounts.py:130`. Etkilenen bağlam 02-satici-magaza.
5. Ödeme çekirdeği API katmanından fonksiyon alıyor. Bağımlılık yönü ters. Kanıt: `payments/service.py:542`.
6. Ödeme siparişin `receipt_url` alanını yazıyor. Kanıt: `payments/manual_evidence.py:174`. Etkilenen bağlam 04-siparis.
7. `shared_sync` paketi ödeme kaydı üretiyor ve ödeme tablolarına tetikleyici kuruyor. Kanıt: `shared_sync/decision_recovery.py:214`, `shared_sync/decision_recovery.py:211`, `shared_sync/schema.py:299`.
8. Ödeme `shared_sync` iç modülünü çağırıyor. Kanıt: `payments/service.py:286`, `payments/service.py:441`.
9. Ödeme denetleyicileri `listing_purge` paketine bağlı. Örnek: `payment_collection.py:14`, `payment_attempt.py:35`, `payment_intent.py:59`. Temizlik paketi değişince ödeme kayıtları silinemez ya da yazılamaz.
10. Sipariş API'si eski ödeme tablolarını API dosyası üzerinden yazıyor. Kanıt: `api/order.py:1083`, `api/order.py:1414`, `api/order.py:1690`, `api/order.py:1800`.

Ek not: kur servisi katalog tablosunu ham SQL ile güncelliyor (`services/tcmb.py:205`). Bu kayıt paylaşılan çekirdeğe taşınınca sorun orada çözülür.

## 6. Önerilen geçiş sırası

1. `payments/api.py` ve `payments/contracts.py` dosyalarını açın. Bugünkü fonksiyonları buradan dışarı verin. Davranış değişmez.
2. `logistics/hooks.py:444` okumasını `get_payment_status` çağrısına çevirin.
3. `api/payment.py` içindeki `create_payment_transaction` ve `update_transaction_status` fonksiyonlarını `payments/legacy_view.py` içine taşıyın. `payments/service.py:542` yeni yolu kullansın.
4. `listing_purge.guards.planned_delete` kapısını `shared/retention.py` içine taşıyın. Bütün ödeme denetleyicileri yeni yolu kullansın.
5. `payments/ports.py` ile hazır olma kontrol listesini açın. `shared_sync` kendi kontrolünü kaydetsin. `payments/service.py:286` içe aktarımını silin.
6. Olay altyapısı hazır olunca `payment.collected` olayını yayınlayın. Bu adım `04-siparis/README.md` 6. bölümün 5. adımıyla birlikte yapılır.
7. Bayrağı açın ve `payments/service.py:434` içindeki sipariş ve stok yazımını silin.
8. `manual_evidence.py:174` yazımını `payment.evidence_submitted` olayına çevirin.
9. Banka hesabı girişini tek yola indirin. `admin_seller_profile.py:62` çağrısını olaya çevirin.
10. `Seller Balance` için bakiye kuralını yazın. Ölü kod olan `utils/seller_payout.py` dosyasını silin.
11. `Currency Rate Pair` ve `Supported Currency` kayıtlarını paylaşılan çekirdeğe taşıyın.
12. `Subscription Payment` ve `Field Commission` kayıtlarını 02-satici-magaza bağlamına devredin.
13. `modules.txt` dosyasına "Payments" modülünü ekleyin. DocType JSON `module` alanlarını değiştirin.

## 7. Başka bağlama taşınması gereken DocType'lar

- `Currency Rate Pair` ve `Supported Currency` paylaşılan çekirdeğe gitmeli (14-platform-cekirdek, `shared/money/`). Kur bilgisini sepet, lojistik ve masraf merkezi de okur.
- `Subscription Payment` 02-satici-magaza bağlamına gitmeli. Kayıt bir abonelik isteğidir. Para hareketi yine `Payment Intent` ile ödeme bağlamında kalır.
- `Field Commission`, `Field Commission Quota Tier` ve `Field Commission Settings` 02-satici-magaza bağlamına gitmeli. Bu kayıtlar saha satış hakedişidir. Pazar yeri ödeme zinciriyle bağı yoktur.

## 8. Paralel çalışacak geliştiriciler için kurallar

1. Ödeme kodunu yalnız `tradehub_core/payments/` paketinde yazın.
2. Para hareketini yalnız `record_attempt_result` yazar. Bu kural bugün de geçerlidir (`payments/jobs.py:29`). Bu kuralı korumak zorunludur.
3. Ödeme kodu başka bağlamın tablosuna yazmaz. Siparişe, stoğa ve mağazaya etki olay ile gider.
4. Başka bağlamlar ödemenin yalnız `api.py` ve `contracts.py` dosyasını içe aktarır. Örneğin `payments.service` ve `payments.bank_accounts` içe aktarımı yasaktır.
5. Durum adları `payments/contracts.py` içinde sabittir. Başka bağlam "Collected" gibi bir metni koda yazmaz.
6. Kilit sırası belgelidir: önce `Payment Intent`, sonra `Order`, sonra `Payment Job` (`payments/jobs.py:30`). Yeni kod bu sırayı bozmaz.
7. Yeni ödeme kaydı eklenirse izin kancası ve denetim kancası aynı PR içinde eklenir. Örnek: `hooks.py:1513` döngüsü.
8. Olay verisinde tutarlar kesin ondalık metin olarak taşınır. Örnek alan adı: `amount_exact`.
9. Her API fonksiyonu için sözleşme testi `tradehub_core/payments/tests/` klasöründe durur.
10. `CODEOWNERS` dosyasında `tradehub_core/payments/` yolunun sahibi ödeme ekibidir.

Bu belge gerçek okurla denenmedi.

## Epic özeti

Bu bağlamdaki her DocType bir epic olur. Liste öncelik, faz ve büyüklüğü verir.

- Bank Statement Line: Düşük, Faz 3, Küçük
- Buyer Bank Interaction: Önemli, Faz 3, Küçük
- Currency Rate Pair: Önemli, Faz 4, Orta
- Field Commission: Düşük, Faz 4, Orta
- Field Commission Quota Tier: Düşük, Faz 4, Küçük
- Field Commission Settings: Düşük, Faz 4, Küçük
- Manual Payment Command: Düşük, Faz 3, Küçük
- Payment Approval: Düşük, Faz 3, Küçük
- Payment Attempt: Kritik, Faz 3, Orta
- Payment Audit Event: Düşük, Faz 3, Küçük
- Payment Collection: Kritik, Faz 3, Orta
- Payment Evidence: Önemli, Faz 3, Orta
- Payment Evidence Cleanup: Düşük, Faz 3, Küçük
- Payment Idempotency Record: Düşük, Faz 3, Küçük
- Payment Installment: Düşük, Faz 3, Küçük
- Payment Installment Allocation: Düşük, Faz 3, Küçük
- Payment Installment Plan: Önemli, Faz 3, Orta
- Payment Instruction: Önemli, Faz 3, Küçük
- Payment Intent: Kritik, Faz 3, Büyük
- Payment Intent Charge: Düşük, Faz 3, Küçük
- Payment Job: Düşük, Faz 3, Küçük
- Payment Job Event: Düşük, Faz 3, Küçük
- Payment Operation: Acil, Faz 3, Orta
- Payment Provider Credential: Düşük, Faz 3, Küçük
- Payment Refund Record: Acil, Faz 3, Orta
- Payment Transaction: Acil, Faz 3, Orta
- Seller Balance: Acil, Faz 3, Orta
- Seller Bank Account Version: Acil, Faz 3, Orta
- Subscription Payment: Önemli, Faz 4, Orta
- Supported Currency: Düşük, Faz 4, Küçük
