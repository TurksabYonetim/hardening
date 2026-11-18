# Buyer Favorite Item

- Bağlam: 03c-kesif
- Tür: Ana kayıt
- Klasör: `tradehub_core/tradehub_core/doctype/buyer_favorite_item`
- Denetleyici: `tradehub_core/tradehub_core/doctype/buyer_favorite_item/buyer_favorite_item.py` (5 satır)
- Önerilen sahip bağlam: 03c-kesif

## Epic

- Epic adı: Buyer Favorite Item: 03c-kesif bağlamına taşıma
- Öncelik: Acil
- Faz: Faz 4
- Tahmini büyüklük: Orta

### User story

Bir alıcı olarak, favorilerimi yalnız benim görmemi ve ürün kaldırılınca listemin bozulmamasını istiyorum.
Böylece verim gizli kalır ve favori sayfam her zaman açılır.

### Kabul kriterleri

- [ ] `permission_query_conditions` ve `has_permission` var. Kullanıcı yalnız kendi kaydını görüyor. Test var.
- [ ] `discovery/api.py` içinde `get_favorite_counts` var. `social_proof.py` bunu çağırıyor.
- [ ] `api/listing.py:5751` silmesi `catalog.listing_archived` dinleyicisinde.
- [ ] `Listing.wishlist_count` kararı yazılı: olayla güncellenir ya da kaldırılır.
- [ ] `list_ids` geçerli JSON listesi kontrolü denetleyicide. Test var.
- [ ] Characterization test: `Buyer Favorite Item` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- Katalog kodundan `Buyer Favorite Item` satırlarını silmeyin. Olay dinleyicisi siler.
- `All` rolüne izin sorgusu olmadan okuma bırakmayın. Başka kullanıcının favorisi görünür.
- Anlık görüntü alanlarını kaldırmayın. Ürün silinse bile liste okunur.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] Çapraz kullanıcı izin testi eklendi.
- [ ] Olay dinleyici testi eklendi.
- [ ] Anlık görüntü okuma testi geçiyor.
- [ ] `import-linter` geçiyor.
- [ ] `CODEOWNERS` keşif ve katalog ekiplerinden inceleme istendi.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?
Buyer Favorite Item alıcının beğendiği ürünü tutar. Her kullanıcı ve ürün için tek kayıt vardır. Kayıt ürünün başlığını, görselini ve fiyatını anlık görüntü olarak saklar. Ürün silinse bile liste okunur. `list_ids` alanı ürünün hangi özel listelerde olduğunu JSON olarak tutar.

## Bugünkü bağımlılıklar
### Bu kaydın bağlandığı kayıtlar
- `User` (user): başka bağlam (01-kimlik-erisim)
- `Listing` (listing): başka bağlam (03a-katalog)
### Bu kayda dokunan kod
- `tradehub_core/api/favorites.py:65-70,171,245,303,317,498`: listeleme, ekleme, silme, listeye alma, eşitleme uç noktaları (yazıyor)
- `tradehub_core/api/favorites.py:73-168`: `_get_listing_summary` ürün tablosunu okuyor (03a okuması)
- `tradehub_core/api/social_proof.py:129,292`: "X kişi beğendi" sayısını okuyor (aynı bağlam)
- `tradehub_core/api/listing.py:5751`: ürün arşivlenince favorileri `frappe.db.delete` ile siliyor (03a kodu yazıyor)
- `tradehub_core/api/listing.py:5848` ve `api/listing_stats.py:47,60`: `Listing.wishlist_count` alanını okuyor. Bu alanı yazan kod bulunmadı (grep ile doğrulandı). Alan güncellenmiyor olabilir.
- `tradehub_core/media/seo_cikti.py:196` ve `media/usage.py:152`: medya kullanım taraması `snapshot_image` alanını okuyor (08)
- `tradehub_core/listing_purge/preview.py:20`: ürün silme aracı bağı sayıyor
### hooks.py kayıtları
- Kayıt yok. Rol izni `All(rwcd)`. İzin sorgusu yok.

## Bağımlılık sorunları
1. `tradehub_core/api/listing.py:5751` katalog kodu keşif tablosunu doğrudan siliyor. Yön ters. Katalog favoriyi bilmemeli.
2. İzin sorgusu yok. `All` rolü okuma, yazma, silme yetkisine sahip. Uç noktalar `user == session` kontrolü yapıyor (`favorites.py:31`). Frappe liste görünümü başka kullanıcının favorisini gösterebilir. Doğrulanmadı: liste görünümü kapatılmış olabilir.
3. `Listing.wishlist_count` alanı okunuyor ancak yazılmıyor. Ölü anlık görüntü. Vitrin yanlış sayı gösterebilir.
4. `list_ids` JSON alanı `Buyer Favorite List` ile Link değil metin bağı kuruyor. Liste silinince `favorites.py:460-472` elle temizliyor.

## Hedef tasarım
- Sahip bağlam `03c-kesif`, paket yolu `tradehub_core/discovery/favorites/`.
- Dışarıya açılan fonksiyonlar (`discovery/api.py`): `get_favorite_count(listing)` ve `get_favorite_counts(listings)` (vitrin ve sosyal kanıt için). `remove_favorites_for_listing(listing)` iç kullanım.
- Yayınladığı olay: `discovery.favorite_added` ve `discovery.favorite_removed` (user, listing). Dinleyen: 03a `wishlist_count` anlık görüntüsü (isteğe bağlı). Dinlediği olaylar: `catalog.listing_deleted` ve `catalog.listing_archived` (favorileri temizler). `identity.user_deleted` (kullanıcı silinince temizler, bugün `privacy/account_deletion.py` doğrudan yapıyor).
- Başka bağlamlara bağlantılar: `user` ve `listing` Link alanları kalır. Anlık görüntü alanları belgelenir: `snapshot_title`, `snapshot_image`, `snapshot_price`, `snapshot_currency`, `snapshot_min_order`, `snapshot_price_range`.
- Denetleyicide kalacak doğrulama: `list_ids` geçerli JSON listesi olmalı. Bugün bu kontrol yok.

## Geçiş adımları
1. `permission_query_conditions` ve `has_permission` ekleyin: kullanıcı yalnız kendi kaydını görür. Bağımsızdır.
2. `discovery/api.py` içine `get_favorite_counts` ekleyin. `social_proof.py:129,292` bunu çağırır.
3. `api/listing.py:5751` silmesini `catalog.listing_archived` olay dinleyicisine taşıyın. Outbox gerekir.
4. `wishlist_count` kararı: ya olayla güncellenir ya alan kaldırılır. 03a ekibi karar verir.
5. `module` alanını "Discovery" yapın.

## Riskler ve testler
- Kullanıcı başkasının favorisini görememeli. Test: izin sorgusu yabancı kaydı gizler.
- Ürün arşivlenince favori silinmeli. Test: `catalog.listing_archived` dinleyicisi kaydı siler.
- Ürün silinse bile anlık görüntü okunmalı. Test: `snapshot_title` dolu kayıt listelenir.
