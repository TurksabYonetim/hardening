# User Product View

- Bağlam: 03c-kesif
- Tür: Kayıt defteri (log)
- Klasör: `tradehub_core/tradehub_core/doctype/user_product_view`
- Denetleyici: `tradehub_core/tradehub_core/doctype/user_product_view/user_product_view.py` (5 satır)
- Önerilen sahip bağlam: 03c-kesif

## Epic

- Epic adı: User Product View: 03c-kesif bağlamına taşıma
- Öncelik: Önemli
- Faz: Faz 4
- Tahmini büyüklük: Orta

### User story

Bir geliştirici olarak, görüntüleme logunun ürün silmeyi kilitlememesini ve sipariş kancasından kurtulmasını istiyorum.
Böylece sipariş kaydı keşif koduna bağlı kalmaz.

### Kabul kriterleri

- [ ] `listing` alanı `Data`. `api/listing.py:113` satırı kaldırıldı. Yama değer koruyor.
- [ ] `hooks.py:719` kancası `order.confirmed` dinleyicisinde. Sipariş sonrası kullanıcı önbelleği düşüyor. Test var.
- [ ] `export_user_views` ve `purge_user_views` var. `privacy/*` bunları çağırıyor.
- [ ] `api/tailored.py` `discovery/tailored/` altında.
- [ ] `module` alanı "Discovery" oldu.
- [ ] Characterization test: `User Product View` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- `Order` kaydına keşif kancası eklemeyin. Olay dinleyin.
- `listing` alanını Link bırakmayın.
- Uyum bağlamından tabloyu doğrudan silmeyin.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] Olay dinleyici testi eklendi.
- [ ] Tür değişimi yaması idempotent.
- [ ] Günlük temizlik testi geçiyor.
- [ ] `import-linter` geçiyor.
- [ ] `CODEOWNERS` keşif, sipariş ve uyum ekiplerinden inceleme istendi.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?
User Product View kullanıcının baktığı ürünleri tutar. Her görüntüleme bir satırdır. "Size özel seçimler" bu veriden kategori ilgisi hesaplar. Eski kayıtlar günlük görevle silinir.

## Bugünkü bağımlılıklar
### Bu kaydın bağlandığı kayıtlar
- `User` (user): başka bağlam (01-kimlik-erisim)
- `Listing` (listing): başka bağlam (03a-katalog)
### Bu kayda dokunan kod
- `tradehub_core/api/tailored.py:123-171`: `log_product_view` yazıyor, `cleanup_old_user_product_views` siliyor
- `tradehub_core/api/tailored.py:203-307`: kategori ilgisi hesaplıyor (okuyor)
- `tradehub_core/api/tailored.py:179`: `invalidate_tailored_user_cache` sipariş kancası
- `tradehub_core/api/listing.py:113`: ürün silinirken temizlenecek listede (03a kodu siliyor)
- `tradehub_core/privacy/account_deletion.py:331` ve `data_export.py:199`: uyum bağlamı (13) siliyor ve okuyor
- `tradehub_core/listing_purge/preview.py:19`: ürün silme aracı bağı sayıyor
### hooks.py kayıtları
- `tradehub_core/hooks.py:343`: günlük `tailored.cleanup_old_user_product_views`
- `tradehub_core/hooks.py:719`: `Order.on_update` içinde `tailored.invalidate_tailored_user_cache` (04 kaydına kanca)

## Bağımlılık sorunları
1. `tradehub_core/hooks.py:719` sipariş kaydı (04) keşif koduna kanca ile bağlı. Sipariş kaydedilince keşif önbelleği düşürülüyor. Sipariş ekibi bu kancayı bilmiyor olabilir.
2. `tradehub_core/api/listing.py:113` katalog kodu bu tabloyu siliyor. `listing` Link alanı silmeyi kilitliyor.
3. İzin sorgusu yok. Rol yalnız `System Manager`. Uç nokta `allow_guest` ile yazıyor (`tailored.py:585`). Kabul edilebilir. Ancak `has_permission` yok.
4. `tradehub_core/privacy/account_deletion.py:331` uyum bağlamı tabloyu doğrudan siliyor.

## Hedef tasarım
- Sahip bağlam `03c-kesif`, paket yolu `tradehub_core/discovery/signals/`.
- Dışarıya açılan fonksiyonlar (`discovery/api.py`): `log_product_view(user, listing, session)`, `get_tailored_selections(user, limit)`, `export_user_views(user)`, `purge_user_views(user)`.
- Olay yok. Dinlediği olaylar: `order.confirmed` (kullanıcı önbelleği düşer, bugün `hooks.py:719`), `catalog.listing_deleted` (satır silinir), `identity.user_deletion_requested`.
- Başka bağlamlara bağlantılar: `user` Link kalır. `listing` `Data` olmalı. Log kaydı ürün silmeyi kilitlememeli.
- Denetleyicide doğrulama yok.

## Geçiş adımları
1. `listing` alanını `Data` yapın. `api/listing.py:113` satırı kalkar. Yama gerekir.
2. `hooks.py:719` kancasını `order.confirmed` dinleyicisine taşıyın. Outbox gerekir.
3. `privacy/*` çağrılarını `export_user_views` ve `purge_user_views` ile değiştirin.
4. `api/tailored.py` dosyasını `discovery/tailored/` altına taşıyın. `module` alanını "Discovery" yapın.

## Riskler ve testler
- Sipariş sonrası kişisel öneri yenilenmeli. Test: `order.confirmed` dinleyicisi kullanıcı önbelleğini siler.
- Hesap silinince görüntüleme kayıtları silinmeli. Test: `purge_user_views` sonrası satır 0.
- Eski kayıt günlük görevde silinmeli. Test: eşik üstü satır silinir.
