# Order Approval

- Bağlam: 04-siparis
- Tür: Ana kayıt
- Klasör: `tradehub_core/tradehub_core/doctype/order_approval`
- Denetleyici: `tradehub_core/tradehub_core/doctype/order_approval/order_approval.py` (57 satır)
- Önerilen sahip bağlam: 04-siparis, `ordering/procurement/` alt paketi

## Epic

- Epic adı: Order Approval: 04-siparis bağlamına taşıma
- Öncelik: Acil
- Faz: Faz 3
- Tahmini büyüklük: Orta

### User story

Bir alıcı şirket yöneticisi olarak, onay bekleyen siparişin ödenmiş gibi görünmemesini istiyorum.
Böylece satıcı onaysız siparişi kargolamaz.

### Kabul kriterleri

- [ ] Onay bekleyen sipariş ayrı bir durum değeri taşıyor. Örnek: "Onay Bekliyor".
- [ ] `order_approval_hooks.py` `doc.seller` alanını okuyor. Test geçiyor.
- [ ] Onay reddi normal iptal servisini çağırıyor. Ayrılmış stok geri dönüyor.
- [ ] Onay sonucu `order.approved` ya da `order.approval_rejected` olayı ile gidiyor.
- [ ] Onay kodu `Order` kaydına doğrudan yazmıyor.
- [ ] Characterization test: `Order Approval` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- Siparişe "Onaylanıyor" değerini onay için yazmayın. Bu değer ödeme için "ödendi" anlamındadır.
- Onay hatasını `except Exception` ile sessizce yutmayın. Hata kaydı ve test gerekir.
- Reddedilen siparişi yalnız `status` alanıyla iptal etmeyin. Stok ve ödeme de kapanmalı.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] `seller_profile` hatası için önce başarısız test yazıldı.
- [ ] Ret sonrası stok testi eklendi.
- [ ] Yönetici bypass kaydının yazıldığı test edildi.
- [ ] Ödeme ekibinden inceleme istendi.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?
`Order Approval` alıcı şirketin iç onay sürecini tutar. Kural tutarı aşan sipariş önce onaycıya gider. Onay bir ya da iki seviyeli olabilir. Her adım `Order Approval Log` satırına yazılır.

## Bugünkü bağımlılıklar
### Bu kaydın bağlandığı kayıtlar
- `Order` (`order`): aynı bağlam
- `Approval Rule` (`approval_rule`): başka bağlam (01-kimlik-erisim)
- `CRM Organization` (`organization`): dış uygulama kaydı (Frappe CRM)
- `Currency` (`currency`): framework kaydı
- `User` (`requisitioner`): framework kaydı
- `Order Approval Log` (`approval_log`, alt tablo): aynı bağlam

### Bu kayda dokunan kod
- `tradehub_core/services/approval_workflow.py:152`: yazıyor (onayı başlatır)
- `tradehub_core/services/approval_workflow.py:289`: yazıyor (onaylar)
- `tradehub_core/services/approval_workflow.py:358`: yazıyor (reddeder)
- `tradehub_core/services/approval_workflow.py:509`: siparişi yazıyor (onay sonucunu siparişe aktarır)
- `tradehub_core/services/order_approval_hooks.py:72`: siparişi yazıyor (`db_set("status", "Onaylanıyor")`)
- `tradehub_core/api/v1/order_approval.py:93`: okuyor
- `tradehub_core/authz/registry.py:65`: okuyor (yetki eşlemesi)
- `tradehub_core/services/authorization_simulator.py:415`: okuyor
- `tradehub_core/services/rebac_drift_detection.py:285`: okuyor

### hooks.py kayıtları
- `hooks.py:715`: `Order.after_insert` olayı `order_approval_hooks.on_order_after_insert` işleyicisini çağırır.
- `hooks.py:1128` ve `hooks.py:1251`: liste ve kayıt izni `permissions.py` içindedir.

## Bağımlılık sorunları
1. Onay akışı siparişin durumunu iki yerden yazıyor (`order_approval_hooks.py:72`, `approval_workflow.py:509`). Ödeme ve lojistik de aynı alanı yazar. "Onaylanıyor" değeri ödeme için "ödendi" demektir (`payments/service.py:50`). Bu çakışma 05-odeme bağlamını bozar.
2. Ret durumu siparişi yalnız "İptal Edildi" yapar (`approval_workflow.py:511`). Stok rezervasyonu ve ödeme talebi kapanmaz. Normal iptal bunları yapar (`api/order.py:536`, `api/order.py:579`). Bu nokta doğrulanmadı.
3. Başlatıcı `doc.seller_profile` okur (`order_approval_hooks.py:54`). `Order` kaydında bu alan yok. Hata `except Exception` ile yutulur (`order_approval_hooks.py:77`). Onay akışı sessizce hiç başlamayabilir. Bu nokta doğrulanmadı.
4. Onay tutarı KDV hariç `total` alanından alınır (`order_approval_hooks.py:59`). Alıcının ödediği tutar `grand_total` alanındadır. Bu bir iş kararı olabilir, doğrulanmadı.

## Hedef tasarım
- Sahip bağlam: 04-siparis. Paket yolu: `tradehub_core/ordering/procurement/approval.py`.
- Dışarıya açılan fonksiyonlar (`ordering/api.py`):
  - `approve(approval: str, comment: str) -> ApprovalState`
  - `reject(approval: str, reason: str) -> ApprovalState`
- Yayınladığı olaylar:
  - `order.approval_required`: veri `order`, `approval`, `level`.
  - `order.approved`: veri `order`, `approval`.
  - `order.approval_rejected`: veri `order`, `approval`, `reason`.
- Dinlediği olaylar: `order.placed`. Kural eşleşirse onay kaydı açılır.
- Sipariş durumu yalnız `ordering.state.transition` ile değişir. Onay reddi normal iptal yolunu kullanır. Böylece stok ve ödeme de kapanır.
- Başka bağlamlara bağlantılar: `approval_rule` Link alanı kalır. Kural bu pakete taşınırsa Link aynı bağlama döner. `organization` Link alanı kalır.
- Denetleyicide kalacak doğrulamalar: durum geçişi (`order_approval.py:37`) ve en çok iki seviye kuralı (`order_approval.py:51`).

## Geçiş adımları
1. `doc.seller_profile` okumasını `doc.seller` yapın. Önce bu davranışı gösteren testi yazın. Bu adım bağımsızdır.
2. Siparişin onay durumu için ayrı bir değer açın. Örnek: "Onay Bekliyor". `Order.status` seçeneklerine ekleyin. Bu adım `ordering/state.py` adımından sonra gelir.
3. Onay reddini normal iptal servisine bağlayın.
4. `services/approval_workflow.py` ve `services/order_approval_hooks.py` dosyalarını `ordering/procurement/` içine taşıyın.
5. Başlatmayı `order.placed` olayına bağlayın. Sonra `hooks.py:715` kaydını kaldırın.

## Riskler ve testler
- Onay bekleyen sipariş ödenmiş görünebilir. Test: onay başlayınca sipariş satıcı listesinde "ödendi" görünmemeli.
- Ret sonrası stok kilitli kalabilir. Test: onay reddedilince ilanın ayrılmış stoğu geri dönmeli.
- Yönetici siparişi onaysız geçer (`order_approval_hooks.py:38`). Test: bu durum denetim kaydına yazılmalı.
