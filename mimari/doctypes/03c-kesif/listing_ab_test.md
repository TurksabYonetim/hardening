# Listing AB Test

- Bağlam: 03c-kesif
- Tür: Ana kayıt
- Klasör: `tradehub_core/tradehub_core/doctype/listing_ab_test`
- Denetleyici: `tradehub_core/tradehub_core/doctype/listing_ab_test/listing_ab_test.py` (5 satır)
- Önerilen sahip bağlam: 03c-kesif. Not: Ölçütlerin hepsi yorum puanıdır (`weighted_rating`, `review_count`, `helpful_ratio`, `dispute_rate`). 11-degerlendirme de sahip olabilir. Keşif bağlamında kalması önerilir. Çünkü amaç vitrin denemesidir.

## Epic

- Epic adı: Listing AB Test: 03c-kesif bağlamına taşıma
- Öncelik: Önemli
- Faz: Faz 4
- Tahmini büyüklük: Orta

### User story

Bir satıcı olarak, ürün kartı denememi yalnız benim görmemi istiyorum. Deneme doğru ölçütle bitsin.
Böylece rakip satıcı verimi görmez ve kazananı güvenle seçerim.

### Kabul kriterleri

- [ ] Denetleyici tarih sırası, en az iki varyant ve satıcı eşitliğini kontrol ediyor. Test var.
- [ ] `permission_query_conditions` var. Satıcı yalnız kendi testini görüyor. Test var.
- [ ] Yetki kontrolü `api.review._is_admin` yerine ortak `shared/authz.py` yardımcısıyla.
- [ ] Ölçüt değeri `reviews.api.get_listing_metrics` ile okunuyor.
- [ ] Biten test günlük görevde "Completed" oluyor ve kazanan dolu. Test geçiyor.
- [ ] Characterization test: `Listing AB Test` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- Başka modülün alt çizgili fonksiyonunu (`_is_admin`) çağırmayın.
- Ölçüt değerini `Listing` tablosundaki yorum anlık görüntüsünden doğrudan okumayın. 11 API'sini kullanın.
- Denetleyiciyi boş bırakmayın. Tarih ve varyant kuralı denetleyicide olur.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] Denetleyici testleri eklendi.
- [ ] Çapraz satıcı rapor testi geçiyor.
- [ ] Günlük görev testi geçiyor.
- [ ] `CODEOWNERS` keşif ve değerlendirme ekiplerinden inceleme istendi.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?
Listing AB Test satıcının iki ürün kartını karşılaştırdığı denemedir. Test başlar, biter ve kazanan seçilir. Kazanan seçimi yorum puanı gibi bir ölçüte göre yapılır.

## Bugünkü bağımlılıklar
### Bu kaydın bağlandığı kayıtlar
- `Admin Seller Profile` (seller): başka bağlam (02-satici-magaza)
- `Listing` (winner): başka bağlam (03a-katalog)
- Alt tablo `AB Test Variant` (variants): aynı bağlam
### Bu kayda dokunan kod
- `tradehub_core/api/ab_testing.py:14-47`: `_metric_value` ürün puan alanlarını okuyor (03a tablosundaki 11 anlık görüntüsü)
- `tradehub_core/api/ab_testing.py:50,90,125`: başlatma, değerlendirme ve rapor uç noktaları (yazıyor)
- `tradehub_core/api/ab_testing.py:105-121`: günlük görev biten testleri tamamlıyor (`save(ignore_permissions=True)`)
- `tradehub_core/api/ab_testing.py:127-133`: rapor izni `api.review._is_admin` ve `utils.seller_store.is_my_store` çağırıyor (11 ve 02 yardımcıları)
- `tradehub_core/listing_purge/preview.py:23`: ürün silme aracı bağı sayıyor
### hooks.py kayıtları
- `tradehub_core/hooks.py:356`: günlük `ab_testing.evaluate_finished_tests`

## Bağımlılık sorunları
1. `tradehub_core/api/ab_testing.py:14-47` ölçüt değerini ürün tablosundan okuyor. Puan alanları yorum bağlamının (11) anlık görüntüsüdür. Üç bağlam zincirleniyor.
2. `tradehub_core/api/ab_testing.py:127` yetki için yorum modülünün özel fonksiyonunu (`_is_admin`) kullanıyor. Alt çizgili fonksiyon başka modülden çağrılıyor.
3. İzin sorgusu yok. `Marketplace Seller` tüm testleri listeleyebilir. Uç nokta içi kontrol var (`:127-133`) ancak Frappe liste görünümü korumasız olabilir.
4. Denetleyici boş. Tarih sırası ve en az iki varyant kuralı yok.

## Hedef tasarım
- Sahip bağlam `03c-kesif`, paket yolu `tradehub_core/discovery/experiments/`.
- Dışarıya açılan fonksiyonlar (`discovery/api.py`): `start_ab_test(test)`, `get_ab_test_report(test)`. Dış bağlam çağırmaz. Yalnız arayüz.
- Yayınladığı olay: `discovery.ab_test_completed` (test, seller, winner). Dinleyen: 12-bildirim. Dinlediği olaylar: `catalog.listing_deleted` (varyant ürün silinince test iptal). Ölçüt değeri `reviews.api.get_listing_metrics(listing)` ile okunur.
- Başka bağlamlara bağlantılar: `seller` ve `winner` Link alanları kalır.
- Denetleyicide kalacak doğrulamalar: `end_date` `start_date` sonrası olmalı. En az iki varyant olmalı. Varyant ürünleri aynı satıcıya ait olmalı.

## Geçiş adımları
1. Denetleyiciye tarih, varyant sayısı ve satıcı eşitliği kontrollerini ekleyin. Bağımsızdır.
2. `permission_query_conditions` ekleyin: satıcı yalnız kendi testini görür.
3. `_is_admin` ve `is_my_store` çağrılarını ortak `shared/authz.py` yardımcılarına çevirin.
4. Ölçüt okumasını `reviews.api.get_listing_metrics` ile değiştirin (11 ekibi fonksiyonu yazar).
5. `module` alanını "Discovery" yapın.

## Riskler ve testler
- Biten test günlük görevde tamamlanmalı. Test: `end_date` geçmiş "Running" test "Completed" olur ve kazanan dolu olur.
- Rakip satıcı raporu görememeli. Test: yabancı satıcı `get_ab_test_report` çağrısında `PermissionError` alır.
