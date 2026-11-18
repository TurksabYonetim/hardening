# Buyer Favorite List

- Bağlam: 03c-kesif
- Tür: Ana kayıt
- Klasör: `tradehub_core/tradehub_core/doctype/buyer_favorite_list`
- Denetleyici: `tradehub_core/tradehub_core/doctype/buyer_favorite_list/buyer_favorite_list.py` (5 satır)
- Önerilen sahip bağlam: 03c-kesif

## Epic

- Epic adı: Buyer Favorite List: 03c-kesif bağlamına taşıma
- Öncelik: Acil
- Faz: Faz 4
- Tahmini büyüklük: Küçük

### User story

Bir alıcı olarak, özel listelerimi yalnız benim görmemi ve hesabım silinince listelerin de silinmesini istiyorum.
Böylece verim gizli kalır ve geride kişisel veri kalmaz.

### Kabul kriterleri

- [ ] `permission_query_conditions` ve `has_permission` var. Test var.
- [ ] Teklik ve liste sayısı sınırı denetleyicide. Test var.
- [ ] `export_user_favorites` ve `purge_user_favorites` var. `privacy/account_deletion.py` ve `data_export.py` bunları çağırıyor.
- [ ] `purge_user_favorites` sonrası kayıt sayısı 0. Test var.
- [ ] Characterization test: `Buyer Favorite List` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- Uyum bağlamından bu tabloyu `frappe.delete_doc` ile doğrudan silmeyin. `purge_user_favorites` çağırın.
- Liste sınırını uç noktada bırakmayın. Denetleyiciye alın.
- `list_id` değerini başka tabloya Link yapmadan JSON metin bağıyla çoğaltmayın.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] İzin, teklik ve silme testleri geçiyor.
- [ ] Uyum çağrıları değişti ve testleri geçiyor.
- [ ] `CODEOWNERS` keşif ve uyum ekiplerinden inceleme istendi.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?
Buyer Favorite List alıcının özel favori listesidir. Örneğin "Yaz Siparişi" listesi. Kullanıcı liste açar, ad verir ve ürün ekler. `list_id` tarayıcı tarafından üretilen kimliktir.

## Bugünkü bağımlılıklar
### Bu kaydın bağlandığı kayıtlar
- `User` (user): başka bağlam (01-kimlik-erisim)
### Bu kayda dokunan kod
- `tradehub_core/api/favorites.py:59,179,337,402-489,526-530`: liste okuma, açma, silme, yeniden adlandırma, eşitleme (yazıyor)
- `tradehub_core/privacy/account_deletion.py:341-345`: hesap silme listeleri `frappe.delete_doc` ile siliyor (13 kodu yazıyor)
- `tradehub_core/privacy/data_export.py:209`: veri dışa aktarma okuyor (13)
- `tradehub_core/tradehub_core/doctype/user_profile/user_profile_dashboard.py:15,33`: kullanıcı profili panosu bağlı kayıt gösteriyor (01)
### hooks.py kayıtları
- Kayıt yok. Rol izni `All(rwcd)`. İzin sorgusu yok.

## Bağımlılık sorunları
1. `tradehub_core/privacy/account_deletion.py:343-345` uyum bağlamı (13) keşif tablosunu doğrudan siliyor. Her kişisel veri tablosu için bu dosyaya satır ekleniyor. Yeni tablo unutulursa veri kalır.
2. İzin sorgusu yok. `Buyer Favorite Item` ile aynı sorun.
3. `Buyer Favorite Item.list_ids` bu kaydın `list_id` değerini JSON metin olarak tutuyor. Veri tabanı bütünlüğü yok.

## Hedef tasarım
- Sahip bağlam `03c-kesif`, paket yolu `tradehub_core/discovery/favorites/`.
- Dışarıya açılan fonksiyonlar (`discovery/api.py`): `export_user_favorites(user)` (13 için okuma modeli) ve `purge_user_favorites(user)` (13 için silme).
- Olay yok. Dinlediği olay: `identity.user_deletion_requested` (user). Dinleyici `purge_user_favorites` çağırır.
- Başka bağlamlara bağlantı: `user` Link kalır.
- Denetleyicide kalacak doğrulamalar: aynı kullanıcı için `list_id` tek olmalı. En çok liste sayısı sınırı (`favorites.py:425` uç noktada). Bu kural denetleyiciye alınır.

## Geçiş adımları
1. `permission_query_conditions` ve `has_permission` ekleyin. Bağımsızdır.
2. Teklik ve sınır kuralını denetleyiciye taşıyın.
3. `discovery/api.py` içine `export_user_favorites` ve `purge_user_favorites` ekleyin. `privacy/account_deletion.py:341` ve `data_export.py:209` bunları çağırır.
4. `module` alanını "Discovery" yapın.

## Riskler ve testler
- Hesap silinince listeler silinmeli. Test: `purge_user_favorites` sonrası kayıt sayısı 0.
- Aynı `list_id` ikinci kez açılamamalı. Test: tekrar kayıt reddedilir.
