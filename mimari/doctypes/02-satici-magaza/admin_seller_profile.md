# Admin Seller Profile

- Bağlam: 02-satici-magaza
- Tür: Ana kayıt (mağaza kök kaydı)
- Klasör: `tradehub_core/tradehub_core/doctype/admin_seller_profile`
- Denetleyici: `tradehub_core/tradehub_core/doctype/admin_seller_profile/admin_seller_profile.py` (175 satır)
- Önerilen sahip bağlam: 02-satici-magaza

## Epic

- Epic adı: Admin Seller Profile: 02-satici-magaza bağlamına taşıma
- Öncelik: Kritik
- Faz: Faz 4
- Tahmini büyüklük: Büyük

### User story

Bir geliştirici olarak, mağaza kaydını yalnız satıcı API'si ile okumak ve değiştirmek istiyorum.
Böylece başka ekipler mağaza kancalarını bozmadan kendi işlerini olayla yapar.

### Kabul kriterleri

- [ ] `seller.api` içinde `get_store`, `is_store_active`, `suspend_store` ve `update_store_profile` var.
- [ ] Satıcı paketi dışında `Admin Seller Profile` için `set_value` yok. Arama sonucu boş dönüyor.
- [ ] `hooks.py` içinde bu DocType için yalnız denetleyici kuralları ve olay yayıncısı kalıyor.
- [ ] `seller.store.updated` ve `seller.store.status_changed` olaylarının sözleşme testi geçiyor.
- [ ] `tradehub_core/tests/test_tenant_isolation.py` ve `tradehub_core/payments/tests/test_bank_accounts.py` geçiyor.
- [ ] Characterization test: `Admin Seller Profile` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- `hooks.py` içine bu DocType için yeni `doc_events` kaydı eklemeyin. Olaya abone olun.
- Başka bağlamdan `Admin Seller Profile` alanına `set_value` ile yazmayın. Gerekirse `seller.api` içinde fonksiyon isteyin.
- `shipping_methods` alt tablosunu lojistik kodundan düzenlemeyin. Bağlamlar arası alt tablo düzenlemesi yasak.
- Mağaza durumunu `suspend_store` dışında değiştirmeyin.
- Bu JSON dosyasına başka bağlamın verisini eklemeyin. Veri kendi DocType'ında `store` Link alanıyla durur.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] Değişen davranış için önce başarısız olan test yazıldı.
- [ ] Ruff ve ilgili testler yerelde geçiyor.
- [ ] `import-linter` kontrolü yeni ihlal üretmiyor.
- [ ] `CODEOWNERS` içindeki 02-satici-magaza sahibi inceleyici olarak eklendi.
- [ ] Her bağlam sahibi kendi işleyici PR'ında inceleyici olarak eklendi.
- [ ] Askıya alınan mağazanın ürünleri gizleniyor. Test eklendi.
- [ ] `guard_company_updates` koruması yeni API'de test edildi.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?
Bu kayıt platformdaki her mağazanın ana kaydıdır. Mağaza adı, durumu, logosu ve iletişim bilgisi burada durur. Kayıt şirket, vergi ve banka bilgisini de tutar. Ayrıca puan, SKU (stok kodu) ayarı ve kargo yöntemleri de buradadır. Kiracı (tenant) kimliği olarak 89 DocType bu kayda bağlanır. Kiracı, verisi diğer mağazalardan ayrılan mağazadır.

## Bugünkü bağımlılıklar
### Bu kaydın bağlandığı kayıtlar
- `User` (`user`, `approved_by`): Frappe çekirdeği
- `Country` (`country`): Frappe çekirdeği
- `Seller Gallery Image` (`gallery_images`): aynı bağlam, alt tablo
- `Seller Certification` (`certifications`): aynı bağlam, alt tablo
- `Seller Shipping Method` (`shipping_methods`): başka bağlam (07-lojistik), alt tablo
- `Carrier Account` (`return_carrier_account`): başka bağlam (07-lojistik)
### Bu kayda dokunan kod
Bu kayda 89 DocType bağlanır. Kaynak `mimari/_veri/envanter.json` dosyasıdır. Bağlamlara göre sayılar şöyledir:
- 05-odeme: 16
- 01-kimlik-erisim: 10
- 04-siparis, 07-lojistik ve 10-seo: 9'ar
- 02-satici-magaza ve 08-medya: 7'şer
- 03b-ice-aktarma: 6
- 06-vergi-fatura: 4
- Diğer bağlamlar: 15
 Test ve patch dışında 165 Python dosyası adı anıyor.

Doğrudan `set_value` ile yazanlar:
- `tradehub_core/api/seller.py:940`, `:1042`: profil alanlarını yazıyor
- `tradehub_core/api/v1/auth.py:838`: banka alanlarını yazıyor
- `tradehub_core/api/v1/identity.py:2035`: durumu `Suspended` yapıyor
- `tradehub_core/api/v1/seller_shipping.py:150`: `return_carrier_account` yazıyor
- `tradehub_core/api/v1/seller_shipping.py:179-183`: `Seller Shipping Method` satırlarını silip yeniden yazıyor
- `tradehub_core/api/sku.py:77`: SKU ayarlarını yazıyor
- `tradehub_core/tradehub_core/doctype/seller_application/seller_application.py:479`, `:508`, `:653`: yazıyor
- `tradehub_core/services/anomaly_actions.py:119`: durumu `Suspended` yapıyor
- `tradehub_core/services/owner_transfer.py:125`: sahibi yazıyor
- `tradehub_core/shared_sync/projections.py:400`: paylaşım projeksiyonu yazıyor
- `tradehub_core/tasks.py:1323-1343`: performans metriklerini yazıyor

Denetleyicinin dokunduğu yerler:
- `admin_seller_profile.py:62`: `payments.bank_accounts.sync_from_profile` çağırıyor
- `admin_seller_profile.py:95`, `:105`, `:106`: ödeme paketinden IBAN kurallarını alıyor
- `admin_seller_profile.py:74`: `utils.permission_resolver.apply_field_mask` çağırıyor
- `admin_seller_profile.py:44`: `utils.sku.clean_settings` çağırıyor
### hooks.py kayıtları
- `tradehub_core/hooks.py:780-817`: `before_validate`, `on_load`, `validate` (4 işleyici), `after_insert` (2), `on_update` (7), `on_trash` (3)
- `tradehub_core/hooks.py:1401`: `on_update` olayı `catalog.hooks.on_seller_update`
- `tradehub_core/hooks.py:1402-1403`: `on_update` olayı SEO ayna kaydı
- `tradehub_core/hooks.py:1406-1407`: `on_trash` olayı SEO ayna silme
- `tradehub_core/hooks.py:1616`: `on_update` olayı `shared_sync.catalog.company_changed`
- `tradehub_core/hooks.py:1621-1622`: `before_save` olayı `shared_sync.profile_editor.guard_document`
- `tradehub_core/hooks.py:1082`: `permission_query_conditions`
- `tradehub_core/hooks.py:1209`: `has_permission`
- Toplam: tek kayıt kaydında 9 farklı paketten 20'den fazla işleyici var.

## Bağımlılık sorunları
1. Kaydetme zinciri çok ağır. Bu yüzden ekipler kancayı atlıyor. Kanıt: `tradehub_core/api/v1/seller_shipping.py:176` yorumu "on_update zinciri eşli her ürün için buybox hesaplıyor" diyor. Kod bu yüzden `save` yerine doğrudan yazıyor. Kancası atlanan değişiklik SEO, ReBAC ve paylaşım kayıtlarını güncellemez.
2. On bir farklı yer `set_value` ile yazıyor. Kanıt: yukarıdaki liste. Durum (`status`) alanı dört ayrı yerde değişiyor: `identity.py:2035`, `anomaly_actions.py:119`, `seller_application.py:653` ve form. Askıya alma kuralı tek yerde değil.
3. Denetleyici ödeme paketine bağlı. Kanıt: `admin_seller_profile.py:62`, `:95`, `:105`. Ödeme ekibi IBAN kodunu değiştirirse mağaza kaydı bozulur.
4. Lojistik alt tablosu bu kaydın içinde. Kanıt: `shipping_methods` alanı ve `seller_shipping.py:179`. Lojistik ekibi bu JSON dosyasını değiştirmek zorunda kalıyor. Kurala göre bağlamlar arası alt tablo düzenlemesi yasak.
5. Değerlendirme alanları bu kayıtta. Kanıt: `health_score`, `rating`, `review_count`, `on_time_delivery` alanları. Yazan kod `tasks.py:1323`. Okuyan kod `catalog/service.py:703`.
6. Banka alanları bu kayıtta ve `User Profile` içinde ikinci kez var. Kanıt: `auth.py:832` yorumu iki farklı alan adını anlatıyor.
7. `subscription_plan` alanı düz bir seçim listesi. Asıl abonelik `Store Subscription` kaydında. İki kaynak çelişebilir (doğrulanmadı: alanın hâlâ okunup okunmadığı).
8. Mağaza silme başka bağlamların tablolarını siliyor. Kanıt: `tradehub_core/services/store_cleanup.py:26-31`. Bu kod abonelik, ödeme, vitrin, sohbet ve adres tablolarına yazıyor.

## Hedef tasarım
- Sahip bağlam: 02-satici-magaza. Paket yolu: `tradehub_core/seller/store/`.
- Dışa açık fonksiyonlar (`tradehub_core/seller/api.py`):
  - `get_store(store) -> StoreView` (alan: `name`, `seller_name`, `status`, `user`, `slug`, `logo`, `country`)
  - `get_store_for_user(user) -> str | None`
  - `is_store_active(store) -> bool`
  - `update_store_profile(store, changes)`
  - `suspend_store(store, reason, actor)` ve `reactivate_store(store, actor)`
  - `get_sku_settings(store) -> SkuSettings` ve `update_sku_settings(store, settings)`
- Yayınladığı olaylar:
  - `seller.store.created` (alan: `store`, `user`)
  - `seller.store.updated` (alan: `store`, `changed_fields`)
  - `seller.store.status_changed` (alan: `store`, `old`, `new`, `reason`)
  - `seller.store.owner_changed`
  - `seller.store.deleted` (alan: `store`)
- Bu olayları şu bağlamlar dinler. Her biri kendi işleyicisini olaya bağlar.
  - SEO (10): ayna kaydı ve site haritası
  - Katalog (03a): buybox hesabı
  - Medya (08): görsel işleme
  - Kimlik (01): ReBAC ve rol
  - Paylaşım senkronu: şirket projeksiyonu
  - Ödeme (05): banka hesabı sürümü
- `hooks.py` içinde yalnız iki kayıt kalır: kendi denetleyici kuralları ve olay yayıncısı.
- Alan ayrımı:
  - Banka alanları 05-odeme bağlamında satıcı banka hesabı kaydına taşınır. `payments.bank_accounts` zaten sürüm tutuyor (`admin_seller_profile.py:61` yorumu).
  - `shipping_methods` ve `return_carrier_account` 07-lojistik bağlamına taşınır. Örneğin `Store Shipping Settings` kaydı açılır. Link: `store`.
  - Puan alanları 11-degerlendirme bağlamında `Store Performance` kaydına taşınır. Okuyanlar okuma modelini kullanır.
- Kalan Link alanları: diğer bağlamlardaki tüm `store` ve `seller_profile` Link alanları kalır. Bu kayıt kararlı kök kayıttır.
- Denetleyicide kalacak kurallar: durum geçişi, SKU ayar biçimi, sahip alanının değişmezliği.

## Geçiş adımları
1. `seller/api.py` içine `get_store`, `is_store_active` ve `get_store_for_user` ekleyin. Yeni kod yalnız bunları kullansın.
2. `suspend_store` fonksiyonunu ekleyin. Dört askıya alma noktasını buna bağlayın. Her nokta ayrı PR olabilir.
3. Olay yayıncısını ekleyin. `on_update` içinde `seller.store.updated` yayınlayın. Önce mevcut kancalar da çalışmaya devam etsin.
4. SEO, katalog ve medya işleyicilerini tek tek olaya taşıyın. Her taşımada `hooks.py:799-810` listesinden bir satır silinir. Her bağlam ayrı PR olsun.
5. Kancalar hafiflediğinde `set_value` yazımlarını `update_store_profile` çağrısına çevirin. Bu adım 4. adımdan sonra gelir.
6. Lojistik alanlarını yeni kayda taşıyın. Önce iki yere birden yazın. Sonra okumaları yeni kayda çevirin. En son eski alanı kaldırın.
7. Banka alanlarını ödeme kaydına taşıyın. Aynı üç aşamalı yöntemi kullanın.
8. Puan alanlarını değerlendirme kaydına taşıyın.
9. `store_cleanup.py` silmelerini `seller.store.deleted` olayının işleyicilerine dağıtın.

## Riskler ve testler
- Olaya geçişte SEO ve arama güncellemesi gecikir. Site haritası testi ekleyin.
- Askıya alınan mağazanın ürünleri görünmemeli. Askıya alma sonrası liste testi ekleyin.
- Banka alanı taşımasında ödeme kesilmemeli. `tradehub_core/payments/tests/test_bank_accounts.py` her adımda geçmeli.
- Kiracı izolasyonu bozulmamalı. `tradehub_core/tests/test_tenant_isolation.py` korunmalı.
- Paylaşım koruması `guard_company_updates` her yazmada çalışmalı. Yeni API için koruma testi ekleyin.
