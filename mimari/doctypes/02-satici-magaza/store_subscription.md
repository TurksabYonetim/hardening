# Store Subscription

- Bağlam: 02-satici-magaza
- Tür: Ana kayıt (mağaza başına tek etkin kayıt)
- Klasör: `tradehub_core/tradehub_core/doctype/store_subscription`
- Denetleyici: `tradehub_core/tradehub_core/doctype/store_subscription/store_subscription.py` (305 satır)
- Önerilen sahip bağlam: 02-satici-magaza

## Epic

- Epic adı: Store Subscription: 02-satici-magaza bağlamına taşıma
- Öncelik: Acil
- Faz: Faz 4
- Tahmini büyüklük: Büyük

### User story

Bir satıcı olarak, aboneliğim kapanınca ürünlerimin gizlenmesini, açılınca geri gelmesini istiyorum.
Böylece vitrin abonelikle hep uyumlu olur.

### Kabul kriterleri

- [ ] `services/storefront_visibility.py` içinde `tabListing` için ham SQL yok. Gizleme `catalog.api.set_store_listings_visible` ile yapılıyor.
- [ ] Denetleyici `_OPERATIONAL_STATUSES` iç sabitini kullanmıyor.
- [ ] `seller.subscription.status_changed` olayı yayınlanıyor. Sözleşme testi geçiyor.
- [ ] Abonelik kapanınca ve açılınca vitrin doğru değişiyor. İki yönlü test geçiyor.
- [ ] Aynı olay iki kez gelince gizleme bir kez yapılıyor. Test geçiyor.
- [ ] Characterization test: `Store Subscription` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- Abonelik kodundan `Listing` tablosuna yazmayın. Ürün görünürlüğünü yalnız katalog bağlamı değiştirir.
- Durum alanını `set_value` ile değiştirmeyin. Durum geçişi kancası atlanır.
- `hooks.py:958` listesine yeni kanca eklemeyin. Olaya abone olun.
- Mağaza başına tek etkin abonelik kuralını kaldırmayın.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] Değişen davranış için önce başarısız olan test yazıldı.
- [ ] Ruff ve ilgili testler yerelde geçiyor.
- [ ] `import-linter` kontrolü yeni ihlal üretmiyor.
- [ ] `CODEOWNERS` içindeki 02-satici-magaza sahibi inceleyici olarak eklendi.
- [ ] Katalog (03a) ve SEO (10) sahipleri inceleyici olarak eklendi.
- [ ] `tradehub_core/tests/test_mogem989_paket_silme.py` geçiyor.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?
Bu kayıt bir mağazanın abonelik durumudur. Hangi plan, hangi dönem ve hangi durumda bilgisini tutar. Durumlar deneme, etkin, gecikmiş, süresi dolmuş, iptal ve askıdır. Abonelik mağazanın yetkilerini ve kotalarını belirler. Abonelik kapanınca mağazanın ürünleri vitrinden gizlenir.

## Bugünkü bağımlılıklar
### Bu kaydın bağlandığı kayıtlar
- `Admin Seller Profile` (`store`): aynı bağlam
- `Subscription Plan` (`plan`, `trial_plan`, `previous_plan`): aynı bağlam
- `User` (`cancel_requested_by`): Frappe çekirdeği
### Bu kayda dokunan kod
Denetleyicinin dokunduğu yerler:
- `store_subscription.py:37`: `entitlement.core._OPERATIONAL_STATUSES` iç sabitini alıyor
- `store_subscription.py:38`: `services.storefront_visibility` içinden gizleme ve geri açma işlerini alıyor
- `store_subscription.py:110`: durum geçişinde işi `frappe.enqueue(..., enqueue_after_commit=True)` ile kuyruğa koyuyor
Başka yerler:
- `tradehub_core/services/subscription_lifecycle.py`: deneme, yenileme, iptal ve gecikme işlerinin tamamı (32 yer)
- `tradehub_core/api/v1/subscription.py:217`, `:221`: oluşturuyor ve güncelliyor
- `tradehub_core/api/v1/subscription_cancellation.py:178`: iptal ediyor
- `tradehub_core/api/v1/identity.py:1960`: hesap silmede iptal ediyor
- `tradehub_core/entitlement/core.py:88`, `:150`, `:171`: yetki için önbellekten okuyor
- `tradehub_core/tradehub_core/doctype/seller_application/seller_application.py:605`: deneme aboneliği açıyor
- `tradehub_core/privacy/account_deletion.py:224`: alanları `set_value` ile temizliyor
- `tradehub_core/services/store_cleanup.py:26`: mağaza silinince siliyor
- `tradehub_core/seo/sitemap_generator.py`, `tradehub_core/seo/hooks_seo.py`: site haritası için okuyor
- `tradehub_core/services/storefront_visibility.py:59-61`, `:112-114`: `tabListing` tablosunu ham SQL `UPDATE` ile yazıyor
### hooks.py kayıtları
- `tradehub_core/hooks.py:958-968`: `on_update` ve `after_insert` olayları `entitlement.sync.on_store_subscription_update` ve `seo.hooks_seo.invalidate_sitemap_for` çağırıyor
- `tradehub_core/hooks.py:1142`: `permission_query_conditions`
- `tradehub_core/hooks.py:1268`: `has_permission`
- `tradehub_core/hooks.py:181`, `:187`: zamanlanmış `subscription_lifecycle` işleri

## Bağımlılık sorunları
1. Abonelik kodu ürün tablosunu ham SQL ile yazıyor. Kanıt: `services/storefront_visibility.py:59-61`. Katalog (03a) `Listing.storefront_visible` alanını değiştirirse vitrin bozulur. Katalog kancaları da çalışmaz.
2. Denetleyici başka modülün iç sabitini kullanıyor. Kanıt: `store_subscription.py:37`. Alt çizgili ad iç ayrıntıdır.
3. Durum yazıcıları için kural belgede var ama her yerde yok. Kanıt: `store_subscription.py:76-82` yorumu "tüm status yazıcıları doc.save kullanır" diyor. `privacy/account_deletion.py:224` ise `set_value` kullanıyor. Bu yazma durum alanına dokunmuyor. Yine de kural açıkça zorlanmıyor.
4. Olumlu nokta: denetleyici zaten "commit sonrası kuyruk" kullanıyor (`store_subscription.py:110`). Bu, Outbox desenine yakın bir yapıdır.

## Hedef tasarım
- Sahip bağlam: 02-satici-magaza. Paket yolu: `tradehub_core/seller/subscription/`.
- Dışa açık fonksiyonlar (`tradehub_core/seller/api.py`):
  - `get_active_subscription(store) -> SubscriptionView | None`
  - `get_entitlements(store) -> Entitlements` (alan: `capabilities`, `quotas`, `regions`)
  - `start_trial(store, plan)`, `change_plan(store, plan)`, `request_cancellation(store, user, note)`
- Yayınladığı olay: `seller.subscription.status_changed` (alan: `store`, `old_status`, `new_status`, `operational: bool`).
- Dinleyenler:
  - Katalog (03a): `operational=false` gelince mağaza ürünlerini gizler. `true` gelince geri açar.
  - SEO (10): site haritasını kirli işaretler.
  - Kimlik (01): yetki önbelleğini temizler.
- Dinlediği olaylar: `payments.subscription_payment.succeeded` ve `payments.subscription_payment.failed`. Ödeme bağlamı (05) bunları yayınlar.
- Kalacak Link alanları: `store`, `plan`.
- Denetleyicide kalacak kurallar: durum geçişi, dönem tutarlılığı, mağaza başına tek etkin abonelik, JSON biçimi.

## Geçiş adımları
1. `_OPERATIONAL_STATUSES` sabitini `seller/contracts.py` içinde açık ad ile tanımlayın. Denetleyici ve yetki kodu buradan alsın.
2. Katalog bağlamında `catalog.api.set_store_listings_visible(store, visible)` fonksiyonunu açın. `storefront_visibility.py` kodunu oraya taşıyın. Bu iş 03a ekibinin PR'ıdır.
3. Olay altyapısı gelince `enqueue` çağrısını `seller.subscription.status_changed` yayınına çevirin.
4. SEO ve yetki önbelleği kancalarını `hooks.py:958` listesinden olay işleyicilerine taşıyın.
5. `services/subscription_lifecycle.py` dosyasını abonelik paketine taşıyın.

## Riskler ve testler
- Abonelik kapanınca ürünler gizlenmeli. Abonelik açılınca geri gelmeli. İki yönlü geçiş testi ekleyin.
- Kota kırpması (`_apply_quota_trim`) geri açmada doğru çalışmalı. Kota testi ekleyin.
- Aynı olay iki kez gelirse gizleme bir kez yapılmalı. Tekrar testi ekleyin.
- Paket silme testi `tradehub_core/tests/test_mogem989_paket_silme.py` korunmalı.
