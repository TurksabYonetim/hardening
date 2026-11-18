# Search History

- Bağlam: 03c-kesif
- Tür: Kayıt defteri (log)
- Klasör: `tradehub_core/tradehub_core/doctype/search_history`
- Denetleyici: `tradehub_core/tradehub_core/doctype/search_history/search_history.py` (5 satır)
- Önerilen sahip bağlam: 03c-kesif

## Epic

- Epic adı: Search History: 03c-kesif bağlamına taşıma
- Öncelik: Önemli
- Faz: Faz 4
- Tahmini büyüklük: Küçük

### User story

Bir geliştirici olarak, arama geçmişi kodunun katalog vitrin dosyasından çıkıp keşif paketine girmesini istiyorum.
Böylece arama geçmişi değişikliği katalog PR'ına karışmaz.

### Kabul kriterleri

- [ ] `api/listing.py:3820-3935` bloğu `discovery/search/history.py` içinde. `hooks.py:342` yolu güncel.
- [ ] `export_user_search_history` ve `purge_user_search_history` var. `privacy/*` bunları çağırıyor.
- [ ] `query` boş olamaz kuralı denetleyicide. Test var.
- [ ] Kullanıcı başkasının geçmişini görmüyor. Test geçiyor.
- [ ] `module` alanı "Discovery" oldu.
- [ ] Characterization test: `Search History` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- Arama geçmişi kodunu `api/listing.py` içinde tutmayın.
- Uyum bağlamından tabloyu doğrudan silmeyin. `purge_user_search_history` çağırın.
- İzin sorgusunu kaldırmayın.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] Taşıma sonrası arama öneri testi geçiyor.
- [ ] Günlük temizlik testi geçiyor.
- [ ] Uyum çağrıları değişti.
- [ ] `CODEOWNERS` keşif ve uyum ekiplerinden inceleme istendi.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?
Search History kullanıcının arama geçmişini tutar. Her arama bir satırdır. Vitrin "son aramalarınız" önerisini buradan okur. Eski kayıtlar günlük görevle silinir.

## Bugünkü bağımlılıklar
### Bu kaydın bağlandığı kayıtlar
- `User` (user): başka bağlam (01-kimlik-erisim)
### Bu kayda dokunan kod
- `tradehub_core/api/listing.py:3827-3867`: arama kaydediyor ve eski satırı siliyor (03a dosyası yazıyor)
- `tradehub_core/api/listing.py:3877-3887`: `cleanup_old_search_history` günlük temizlik
- `tradehub_core/api/listing.py:3893-3931`: `get_search_suggestions` okuyor
- `tradehub_core/privacy/account_deletion.py:331`: hesap silme satırları siliyor (13)
- `tradehub_core/privacy/data_export.py:194`: veri dışa aktarma okuyor (13)
- `tradehub_core/permissions.py:1359-1368`: kullanıcı yalnız kendi geçmişini görür
### hooks.py kayıtları
- `tradehub_core/hooks.py:342`: günlük `api.listing.cleanup_old_search_history`
- `tradehub_core/hooks.py:1102,1227`: izin sorgusu ve tek kayıt izni

## Bağımlılık sorunları
1. Tüm kod `tradehub_core/api/listing.py` içinde. Keşif tablosu katalog vitrin dosyasında yönetiliyor. Dosya 5700 satır. Arama geçmişi değişikliği katalog PR'ına karışır.
2. `tradehub_core/privacy/account_deletion.py:331` uyum bağlamı tabloyu doğrudan siliyor. `Buyer Favorite List` ile aynı sorun.

## Hedef tasarım
- Sahip bağlam `03c-kesif`, paket yolu `tradehub_core/discovery/search/`.
- Dışarıya açılan fonksiyonlar (`discovery/api.py`): `record_search(user, query, category)`, `get_search_suggestions(user, limit)`, `export_user_search_history(user)`, `purge_user_search_history(user)`.
- Olay yok. Dinlediği olay: `identity.user_deletion_requested`.
- Başka bağlamlara bağlantı: `user` Link kalır.
- Denetleyicide kalacak doğrulama: `query` boş olamaz ve kırpılır. Bugün uç noktada.

## Geçiş adımları
1. `api/listing.py:3820-3935` bloğunu `discovery/search/history.py` dosyasına taşıyın. `hooks.py:342` yolu güncellenir. Bağımsızdır.
2. `privacy/*` çağrılarını `export_user_search_history` ve `purge_user_search_history` ile değiştirin.
3. `module` alanını "Discovery" yapın.

## Riskler ve testler
- Kullanıcı başkasının geçmişini görememeli. Test: izin sorgusu yabancı satırı gizler (mevcut).
- Eski kayıt günlük görevde silinmeli. Test: eşik üstü satır sayısı eşiğe iner.
