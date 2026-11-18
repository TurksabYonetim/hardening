# Brand

- Bağlam: 03a-katalog
- Tür: Ana kayıt
- Klasör: `tradehub_core/tradehub_core/doctype/brand`
- Denetleyici: `tradehub_core/tradehub_core/doctype/brand/brand.py` (138 satır)
- Önerilen sahip bağlam: 03a-katalog

## Epic

- Epic adı: Brand: 03a-katalog bağlamına taşıma
- Öncelik: Acil
- Faz: Faz 4
- Tahmini büyüklük: Büyük

### User story

Bir satıcı olarak, marka önerimin SEO ya da paylaşım kodu hata verince kaybolmamasını istiyorum.
Böylece marka kaydı yalnız kendi kurallarıyla kaydedilir ve diğer işler arkada olayla yapılır.

### Kabul kriterleri

- [ ] `brand.py` denetleyicisi `shared_sync` paketinden içe aktarma yapmıyor.
- [ ] `hooks.py` içinde `Brand` için SEO ve shared_sync kancası kalmadı. Bu işler `catalog.brand_*` olay dinleyicilerinde.
- [ ] `catalog/api.py` içinde `get_brand`, `list_public_brands`, `approve_brand`, `reject_brand` var. `api/brand.py` bunları çağırıyor.
- [ ] Marka izinleri `catalog/permissions.py` içinde. Satıcı başka satıcının markasını görmüyor. Test var.
- [ ] Slug değişiminde 301 yönlendirmesi olay üzerinden oluşuyor. Sözleşme testi var.
- [ ] `import-linter` kontrolü geçiyor.
- [ ] Characterization test: `Brand` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- `brand.py` içinden `shared_sync.projections.is_applying` çağırmayın. Paylaşım kaynaklı marka `sharing.brand_imported` dinleyicisinde işlenir.
- `hooks.py` içine `Brand` için yeni `doc_events` eklemeyin. Olay dinleyicisi yazın.
- `SEO Entity` tablosunu katalog kodundan yazmayın. O tablo SEO bağlamının.
- Satıcı rolüne `brand_owner` ya da `official_status` yazma izni vermeyin. Bu alanları yalnız yönetici değiştirir.
- Ret gerekçesi zorunluluğunu kaldırmayın.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] Durum geçişi ve ret gerekçesi testleri geçiyor.
- [ ] İzin sorgusu için çapraz satıcı testi eklendi.
- [ ] `catalog.brand_*` olayları için sözleşme testi eklendi.
- [ ] Olay dinleyicisi tekrar çalışınca aynı sonucu veriyor. Test var.
- [ ] `import-linter` geçiyor.
- [ ] `CODEOWNERS` katalog, SEO ve paylaşım ekiplerinden inceleme istendi.
- [ ] Ruff lint temiz.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?
Brand marka kaydıdır. Satıcı yeni marka önerir. Yönetici markayı onaylar ya da reddeder. Marka sayfası vitrinde `slug` adresiyle açılır. Marka sahibi bir mağaza (`Admin Seller Profile`) olabilir.

## Bugünkü bağımlılıklar
### Bu kaydın bağlandığı kayıtlar
- `Brand` (parent_brand): aynı bağlam
- `Admin Seller Profile` (brand_owner): başka bağlam (02-satici-magaza)
- `User` (suggested_by, reviewed_by, verified_by): başka bağlam (01-kimlik-erisim)
- `Country` (country): Frappe çekirdek kaydı
- Alt tablo `Brand Featured Listing` (featured_listings): aynı bağlam
### Bu kayda dokunan kod
- `tradehub_core/tradehub_core/doctype/brand/brand.py:18-28`: `before_insert` içinde `shared_sync.projections.is_applying` çağırıyor (başka bağlam okuması)
- `tradehub_core/tradehub_core/doctype/brand/brand.py:67-92`: onay durumu geçişini denetliyor
- `tradehub_core/api/brand.py:21,36`: `approve` ve `reject` uç noktaları yazıyor
- `tradehub_core/api/brand.py:59`: `get_brand_detail` vitrin için okuyor
- `tradehub_core/api/listing.py:1195-1196,1972-1975`: vitrin kartı ve detay için okuyor
- `tradehub_core/permissions.py:1438-1478`: satıcı yalnız kendi markasını görür (izin)
- `tradehub_core/shared_sync/seller_records.py:435`: paylaşım bağlamı marka durumunu okuyor
- `tradehub_core/shared_sync/metadata_projection.py:127`: marka için `SEO Entity` satırını yazıyor
- `tradehub_core/seo_helper/core/catalog.py:96-98,178-179`: SEO karar motoru okuyor
- `tradehub_core/eca/api.py:70`: kural motoru alan listesinde okuyor
- `tradehub_core/bulk_import/persister.py:290`: içe aktarma Link değerini çözüyor
### hooks.py kayıtları
- `tradehub_core/hooks.py:658-668`: `before_validate` slug üretir, `validate` SEO uzunluğu denetler, `on_update` ve `on_trash` SEO önbelleğini düşürür (10-seo kodu)
- `tradehub_core/hooks.py:1105,1229`: izin sorgusu ve tek kayıt izni
- `tradehub_core/hooks.py:1402-1407`: `on_update` ve `on_trash` SEO ayna kaydını günceller (10-seo kodu)
- `tradehub_core/hooks.py:1623-1627`: `before_save`, `on_trash`, `on_update` paylaşım bağlamı (shared_sync) kancaları

## Bağımlılık sorunları
1. `tradehub_core/tradehub_core/doctype/brand/brand.py:19` denetleyici `shared_sync` paketinin iç fonksiyonunu içe aktarıyor. Paylaşım bağlamı değişirse marka kaydı kırılır.
2. `tradehub_core/hooks.py:1623-1627` üç ayrı shared_sync kancası marka kaydına bağlı. `before_save` kancası kaydı durdurabilir. Bu kancalar başka bağlamın kodudur.
3. `tradehub_core/hooks.py:658-668` ve `1402-1407` SEO bağlamı (10-seo) marka kaydına dört kanca bağlamış. SEO kodu hata verirse marka kaydedilemez.
4. `tradehub_core/shared_sync/metadata_projection.py:127` başka bağlam marka için `SEO Entity` tablosunu doğrudan yazıyor. Üç bağlam (katalog, SEO, paylaşım) aynı tabloya dokunuyor.
5. `tradehub_core/permissions.py:1438-1456` marka izni mağaza profilini (02) okuyor. Bu okuma kimlik bağlamına ait bir yardımcıya taşınmalı.

## Hedef tasarım
- Sahip bağlam `03a-katalog`, paket yolu `tradehub_core/catalog/`.
- Dışarıya açılan fonksiyonlar (`catalog/api.py`): `get_brand(code_or_slug)` vitrin ve SEO için okuma modeli verir. `list_public_brands(filters)` onaylı ve etkin markaları verir. `approve_brand(name, user)` ve `reject_brand(name, reason, user)` yönetici işlemidir. `suggest_brand(name, seller_profile)` satıcı önerisidir.
- Yayınladığı olaylar: `catalog.brand_created`, `catalog.brand_approved`, `catalog.brand_rejected`, `catalog.brand_updated` (brand_code, slug, status, is_active), `catalog.brand_deleted`. Dinlediği olaylar: `sharing.brand_imported` (paylaşım bağlamından gelen marka). Bu olay geldiğinde marka "Pending Approval" olur. Bugün bu iş `brand.py:19-27` içinde yapılıyor.
- Başka bağlamlara bağlantılar: `brand_owner` Link alanı kalır. `Admin Seller Profile` kararlı bir kök kayıttır. `suggested_by`, `reviewed_by`, `verified_by` Link alanları kalır. SEO bağlamı markayı `catalog.brand_updated` olayıyla izler. SEO ayna kaydını kendi tarafında günceller. Paylaşım bağlamı da aynı olayı dinler.
- Denetleyicide kalacak doğrulamalar: slug normalizasyonu, üst marka döngüsü, kuruluş yılı, durum geçişi, marka sahibi politikası, en çok 8 öne çıkan ürün. Servise taşınacak iş kuralı: paylaşım kaynaklı kayıtta durum sıfırlama (`brand.py:19-27`). Bu kural olay dinleyicisine gider.

## Geçiş adımları
1. `catalog/api.py` içine `get_brand`, `list_public_brands`, `approve_brand`, `reject_brand` ekleyin. `api/brand.py` bu fonksiyonları çağırır. Tek başına birleştirilir.
2. Outbox tablosu ve `catalog.brand_*` olaylarını ekleyin. Olay yayını `on_update` ve `on_trash` içinde yapılır. 1. adımdan bağımsızdır.
3. SEO kancalarını (`hooks.py:658-668`, `1402-1407`) `catalog.brand_updated` olayına taşıyın. Slug üretimi katalogda kalır. 2. adımdan sonra gelir.
4. Shared sync kancalarını (`hooks.py:1623-1627`) olay dinleyicisine taşıyın. `brand.py:19-27` kuralı `sharing.brand_imported` dinleyicisine gider. 2. adımdan sonra gelir.
5. `permissions.py:1438-1478` marka izinlerini `catalog/permissions.py` altına taşıyın. Mağaza profili okuması `seller_store/api.get_profile_for_user` ile yapılır. Bağımsızdır.
6. DocType `module` alanını "Catalog" yapın. 3. ve 4. adımdan sonra gelir.

## Riskler ve testler
- Slug değişince eski adres 301 yönlendirmesi çalışmalı. Test: slug değişiminde `SEO Redirect` kaydı oluşur (olay üzerinden).
- Paylaşımdan gelen marka "Pending Approval" kalmalı. Test: `sharing.brand_imported` dinleyicisi durumu sıfırlar.
- Satıcı başka satıcının markasını görmemeli. Test: izin sorgusu `brand_owner` ve `suggested_by` dışındaki markaları gizler.
- Marka reddinde gerekçe zorunlu. Test: boş gerekçeyle ret `ValidationError` verir.
