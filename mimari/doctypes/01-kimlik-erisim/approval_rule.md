# Approval Rule

- Bağlam: 01-kimlik-erisim
- Tür: Ana kayıt
- Klasör: `tradehub_core/tradehub_core/doctype/approval_rule`
- Denetleyici: `tradehub_core/tradehub_core/doctype/approval_rule/approval_rule.py` (105 satır)
- Önerilen sahip bağlam: 04-siparis. Kural yalnız sipariş onay akışında kullanılır. `Order Approval` kaydı 04-siparis bağlamındadır.

## Epic

- Epic adı: Approval Rule: 04-siparis bağlamına taşıma
- Öncelik: Önemli
- Faz: Faz 3
- Tahmini büyüklük: Orta

### User story

Bir geliştirici olarak, satın alma onay kuralını sipariş bağlamında toplamak istiyorum.
Böylece onay kodu bozulunca sipariş kaydı durmaz.

### Kabul kriterleri

- [ ] `services/approval_workflow.py` kodu `tradehub_core/ordering/approval/` altında duruyor.
- [ ] Onay süreci `order.created` olayıyla başlıyor. `hooks.py` içinde `Order.after_insert` onay kaydı yok.
- [ ] `services/category_delete.py` içinde `Approval Rule` adı geçmiyor.
- [ ] Denetleyici kurum bilgisini `identity.api.get_org_ancestors` ile okuyor.
- [ ] `tradehub_core/tests/test_approval_workflow.py` geçiyor.
- [ ] Characterization test: `Approval Rule` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- `Order` kaydına onay servisinden `set_value` ile yazmayın. Sipariş durumunu yalnız sipariş bağlamı değiştirir.
- `hooks.py` içine yeni `Order` kancası eklemeyin. Olaya abone olun.
- Denetleyicide `User.tradehub_parent_organization` alanını doğrudan okumayın. Kimlik API'sini kullanın.
- Onay kuralını kurum dışına açan kodu kaldırmayın. Kurum kontrolü `approval_rule.py:30` içinde kalmalı.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] Değişen davranış için önce başarısız olan test yazıldı.
- [ ] Ruff ve ilgili testler yerelde geçiyor.
- [ ] `import-linter` kontrolü yeni ihlal üretmiyor.
- [ ] `CODEOWNERS` içindeki 04-siparis sahibi inceleyici olarak eklendi.
- [ ] Olay için sözleşme testi eklendi.
- [ ] Onay olayı iki kez gelince tek `Order Approval` oluştuğu test edildi.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?
Bu kayıt alıcı şirketin satın alma onay kuralıdır. Tutar aralığı, kategori ve tedarikçi koşulu tutar. Onaylayacak kişiler `approvers` alt tablosundadır. Sipariş oluşunca uygun kural seçilir ve onay süreci başlar.

## Bugünkü bağımlılıklar
### Bu kaydın bağlandığı kayıtlar
- `CRM Organization` (`organization`): dış uygulama (Frappe CRM)
- `Currency` (`currency`): Frappe çekirdeği
- `Product Category` (`category_filter`): başka bağlam (03a-katalog)
- `Admin Seller Profile` (`supplier_filter`): başka bağlam (02-satici-magaza)
- `Approval Rule Approver` (`approvers`): aynı bağlam, alt tablo
### Bu kayda dokunan kod
- `tradehub_core/tradehub_core/doctype/approval_rule/approval_rule.py:30`: kullanıcının kurum yetkisini kontrol ediyor
- `tradehub_core/tradehub_core/doctype/approval_rule/approval_rule.py:61`: `User.tradehub_parent_organization` alanını okuyor
- `tradehub_core/services/approval_workflow.py:67`: uygun kuralı arıyor
- `tradehub_core/services/approval_workflow.py:123`, `:203`, `:338`: kuralı okuyor
- `tradehub_core/api/v1/order_approval.py:102`, `:201`: kuralı okuyor
- `tradehub_core/services/category_delete.py:38`: kategori silmeden önce bu kaydı sayıyor
### hooks.py kayıtları
- `tradehub_core/hooks.py:1129`: `permission_query_conditions`
- `tradehub_core/hooks.py:1252`: `has_permission`
- `tradehub_core/hooks.py:716`: `Order.after_insert` olayı `order_approval_hooks.on_order_after_insert` çağırıyor. Bu işleyici kuralı arıyor.

## Bağımlılık sorunları
1. Sipariş oluşturma doğrudan onay servisini çağırıyor. Kanıt: `tradehub_core/hooks.py:716` ve `tradehub_core/services/approval_workflow.py:122`. Onay kodu bozulursa sipariş kaydı da bozulabilir.
2. Onay servisi `Order` kaydını doğrudan açıyor. Kanıt: `tradehub_core/services/approval_workflow.py:122`. Sipariş bağlamı alan adını değiştirirse onay akışı kırılır.
3. Kategori silme kodu bu kaydı biliyor. Kanıt: `tradehub_core/services/category_delete.py:38`. Katalog ekibi kimlik bağlamının tablosunu tanımak zorunda kalıyor.
4. Denetleyici `User` üzerindeki özel alanı okuyor. Kanıt: `approval_rule.py:61`. Bu alanın sahibi belli değil.

## Hedef tasarım
- Sahip bağlam: 04-siparis. Paket yolu: `tradehub_core/ordering/approval/`.
- Dışa açık fonksiyonlar (`tradehub_core/ordering/api.py`):
  - `find_approval_rule(organization, amount, currency, category, supplier) -> str | None`
  - `get_rule_approvers(rule, level) -> list[str]`
- Dinlediği olay: `order.created`. Uygun kural varsa `Order Approval` taslağı oluşturur.
- Yayınladığı olaylar: `order.approval_started`, `order.approved`, `order.rejected`.
- Kalacak Link alanları: `organization`, `currency`, `supplier_filter`, `category_filter`. Hepsi kök kayıtlara bağlı.
- Okuma modeli: kurum ağacı kimlik bağlamından `identity.api.get_org_ancestors(org)` ile okunur.
- Denetleyicide kalacak kurallar: tutar aralığı, en az bir onaylayıcı, kurum yetkisi.
- Servise taşınacak kural: kural eşleştirme ve onay başlatma.

## Geçiş adımları
1. `identity.api.get_user_organization(user)` ve `get_org_ancestors(org)` fonksiyonlarını ekleyin. Denetleyiciyi bunlara bağlayın.
2. `category_delete.py:38` satırını kaldırın. Yerine `catalog.category_delete_requested` kontrol kancası tanımlayın. Bu adım 1. adımdan bağımsızdır.
3. `services/approval_workflow.py` dosyasını `tradehub_core/ordering/approval/` altına taşıyın. Eski yolda yönlendirme bırakın.
4. `Order.after_insert` kancasını `order.created` olayına çevirin. Bu adım olay altyapısı kurulduktan sonra gelir.
5. DocType JSON `module` alanını sipariş modülüne taşıyın. Bu adım 3. adımdan sonra gelir.

## Riskler ve testler
- Olaya geçişte onay gecikmeli başlar. Bu arada sipariş onaysız ilerleyebilir. Sipariş durumunu "Onay bekliyor" ile başlatan test ekleyin.
- `tradehub_core/tests/test_approval_workflow.py` testleri her adımda geçmeli.
- Kurum dışı kural oluşturma testi ekleyin.
