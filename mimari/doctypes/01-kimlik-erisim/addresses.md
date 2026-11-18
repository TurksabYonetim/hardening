# Addresses

- Bağlam: 01-kimlik-erisim
- Tür: Ana kayıt
- Klasör: `tradehub_core/tradehub_core/doctype/addresses`
- Denetleyici: `tradehub_core/tradehub_core/doctype/addresses/addresses.py` (220 satır)
- Önerilen sahip bağlam: 01-kimlik-erisim

## Epic

- Epic adı: Addresses: 01-kimlik-erisim bağlamına taşıma
- Öncelik: Acil
- Faz: Faz 4
- Tahmini büyüklük: Büyük

### User story

Bir geliştirici olarak, sipariş, lojistik ve fatura kodunun adresi tek bir fonksiyondan okumasını istiyorum.
Böylece adres tablosu değişince bu akışlar bozulmaz.

### Kabul kriterleri

- [ ] `identity.api.get_address_snapshot` fonksiyonu var. `logistics/hooks.py`, `pricing_engine.py`, `invoice_documents/service.py` ve `api/order.py` bu fonksiyonu kullanıyor.
- [ ] `api/cart.py` içinde `Addresses` tablosuna `set_value` yok. İşaret `mark_address_used_by_order` ile konuyor.
- [ ] Adres denetleyicisi `api.buyer` dosyasını içe aktarmıyor.
- [ ] `test_p1_address_history.py`, `test_p2_address_boundary.py` ve `test_mogem1053_satici_adres.py` geçiyor.
- [ ] Anlık görüntü ile canlı adres aynı değeri veriyor. Karşılaştırma testi geçiyor.
- [ ] Characterization test: `Addresses` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- Siparişte kullanılmış adres satırını yerinde değiştirmeyin. Değişiklik yeni satır açar. Eski siparişin adresi korunmalı.
- `api/cart.py` ya da `logistics/` içinden `Addresses` tablosuna yazmayın. Adresi yalnız kimlik bağlamı yazar.
- Adres denetleyicisinden `api/` dosyalarının alt çizgili fonksiyonlarını çağırmayın.
- Paylaşım koruması `blocks_native_insert` kontrolünü kaldırmayın. Paylaşılan adres yalnız adres ekranından değişir.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] Değişen davranış için önce başarısız olan test yazıldı.
- [ ] Ruff ve ilgili testler yerelde geçiyor.
- [ ] `import-linter` kontrolü yeni ihlal üretmiyor.
- [ ] `CODEOWNERS` içindeki 01-kimlik-erisim sahibi inceleyici olarak eklendi.
- [ ] Adres geçmişi testleri her PR'da çalıştırıldı.
- [ ] Sipariş bağlamı (04) sahibi inceleyici olarak eklendi.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?
Bu kayıt alıcı ve satıcı adreslerini tutar. `kind` alanı adresin alıcıya mı satıcıya mı ait olduğunu söyler. Adres teslimat, alış ya da fatura amaçlı olabilir. Siparişte kullanılan adres değişmez. Değişiklik yeni bir satır açar. Böylece eski siparişin adresi korunur.

## Bugünkü bağımlılıklar
### Bu kaydın bağlandığı kayıtlar
- `User` (`user`): Frappe çekirdeği
- `Admin Seller Profile` (`seller`): başka bağlam (02-satici-magaza)
### Bu kayda dokunan kod
- `tradehub_core/tradehub_core/doctype/addresses/addresses.py:111`: `api.buyer` içinden `MAX_ADDRESSES` ve `_lock_user_addresses` alıyor
- `tradehub_core/tradehub_core/doctype/addresses/addresses.py:117`: `shared_sync.addressbook.blocks_native_insert` çağırıyor
- `tradehub_core/tradehub_core/doctype/addresses/addresses.py:172`, `:202`: mağaza sahibini `Admin Seller Profile` tablosundan okuyor
- `tradehub_core/api/buyer.py:198`, `:202`, `:416`: işaretleri `set_value` ile yazıyor
- `tradehub_core/api/seller_addresses.py:177`, `:181`, `:326`, `:331`: yazıyor
- `tradehub_core/api/cart.py:1664`, `:1695`, `:1847`: okuyor
- `tradehub_core/api/cart.py:2206`: `order_referenced` alanını `set_value` ile yazıyor
- `tradehub_core/api/order.py:1552`: sipariş adresini okuyor
- `tradehub_core/logistics/hooks.py:584`, `:599`: adres kaydını `get_doc` ile açıyor
- `tradehub_core/logistics/services/pricing_engine.py:482`: il ve ilçeyi okuyor
- `tradehub_core/invoice_documents/service.py:195`: fatura için okuyor
- `tradehub_core/shared_sync/addressbook.py:924`, `:930`: yazıyor
- `tradehub_core/privacy/account_deletion.py:249`: siliyor
- `tradehub_core/services/store_cleanup.py:31`: mağaza silinince satıcı adreslerini siliyor
### hooks.py kayıtları
- Bu DocType için `doc_events` ya da izin kaydı yok. İzin kontrolü denetleyicide yapılıyor (`addresses.py:178-217`).

## Bağımlılık sorunları
1. Denetleyici API dosyasının iç fonksiyonunu çağırıyor. Kanıt: `addresses.py:111` `api.buyer._lock_user_addresses` alıyor. API dosyası değişirse adres kaydı bozulur.
2. Denetleyici paylaşım modülüne bağlı. Kanıt: `addresses.py:117`. Paylaşım kodu değişirse adres eklenemez.
3. Sipariş kodu adres tablosunu doğrudan yazıyor. Kanıt: `tradehub_core/api/cart.py:2206`. Sipariş bağlamı (04) kimlik tablosuna yazıyor.
4. Lojistik, fatura ve sipariş kodu canlı adres satırını okuyor. Kanıt: `logistics/hooks.py:599`, `invoice_documents/service.py:195`, `api/order.py:1552`. `Order.shipping_address` düz metin alandır. Bu alan adres adını tutar (`logistics/hooks.py:31`). Adres satırı silinirse sipariş adresi kaybolur.
5. Yedi farklı paket bu tabloya yazıyor. Kanıt: yukarıdaki yazma listesi. Kurallar tek yerde değil.

## Hedef tasarım
- Sahip bağlam: 01-kimlik-erisim. Paket yolu: `tradehub_core/identity/addresses/`.
- Dışa açık fonksiyonlar (`tradehub_core/identity/api.py`):
  - `get_address_snapshot(address_name) -> AddressSnapshot` (alan: sokak, il, ilçe, posta kodu, ülke, vergi no)
  - `mark_address_used_by_order(address_name)`
  - `list_addresses(owner_kind, owner) -> list[AddressSnapshot]`
  - `delete_owner_addresses(owner_kind, owner)`
- Dinlediği olaylar: `order.placed` gelince `order_referenced` işaretini kendisi koyar. `seller.store.deleted` gelince satıcı adreslerini siler. `privacy.account_deletion_requested` gelince alıcı adreslerini siler.
- Sipariş anlık görüntü tutmalı. Sipariş, adresin bir kopyasını kendi alanlarında saklar. Lojistik ve fatura bu kopyayı okur.
- Kalacak Link: `seller` alanı `Admin Seller Profile` kök kaydına bağlı kalır.
- Denetleyicide sahiplik, tür değişmezliği ve en çok adres sayısı kalır. Kilit fonksiyonu kimlik paketine taşınır.

## Geçiş adımları
1. `MAX_ADDRESSES` ve `_lock_user_addresses` kodunu `tradehub_core/identity/addresses/service.py` dosyasına taşıyın. `api/buyer.py` ve denetleyici buradan alsın.
2. `get_address_snapshot` fonksiyonunu ekleyin. Lojistik, fatura ve `api/order.py:1552` okumalarını buna bağlayın. Her bağlam ayrı PR olsun.
3. `mark_address_used_by_order` fonksiyonunu ekleyin. `cart.py:2206` satırını buna çevirin.
4. Siparişe adres anlık görüntü alanları ekleyin. Bu iş 04-siparis ekibinin PR'ıdır. 2. adımdan sonra gelir.
5. Silme işlerini olay işleyicilerine çevirin. Bu adım olay altyapısından sonra gelir.

## Riskler ve testler
- Adres geçmişi kuralı bozulursa eski siparişin adresi değişir. `tradehub_core/tests/test_p1_address_history.py` her adımda geçmeli.
- Paylaşım sınırı testi `tradehub_core/tests/test_p2_address_boundary.py` korunmalı.
- Satıcı adres testi `tradehub_core/tests/test_mogem1053_satici_adres.py` korunmalı.
- Anlık görüntü ile canlı adres aynı değeri vermeli. Karşılaştırma testi ekleyin.
