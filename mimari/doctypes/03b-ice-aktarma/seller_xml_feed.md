# Seller XML Feed

- Bağlam: 03b-ice-aktarma
- Tür: Ana kayıt (ayar)
- Klasör: `tradehub_core/tradehub_core/doctype/seller_xml_feed`
- Denetleyici: `tradehub_core/tradehub_core/doctype/seller_xml_feed/seller_xml_feed.py` (11 satır)
- Önerilen sahip bağlam: 03b-ice-aktarma

## Epic

- Epic adı: Seller XML Feed: 03b-ice-aktarma bağlamına taşıma
- Öncelik: Önemli
- Faz: Faz 4
- Tahmini büyüklük: Orta

### User story

Bir satıcı olarak, akış adresimin yalnız benim görmemi ve hata olunca haber almamı istiyorum.
Böylece verim başka satıcıya görünmez ve akış durunca hızlı müdahale ederim.

### Kabul kriterleri

- [ ] `permission_query_conditions` ve `has_permission` var. Satıcı başkasının akışını görmüyor. Test var.
- [ ] `import.feed_failed` olayı yayınlanıyor. `feed_scheduler.py:120` doğrudan bildirim çağrısı kalmadı.
- [ ] Abonelik özelliği `seller_store.api.has_feature` ile okunuyor.
- [ ] `feed_url` `https` zorunluluğu denetleyicide. Test var.
- [ ] Vadesi gelen akış saatinde işe alınıyor. Test geçiyor.
- [ ] Characterization test: `Seller XML Feed` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- Akış kodundan bildirim yardımcısını doğrudan çağırmayın. Olay yayınlayın.
- `entitlement` paketinin iç fonksiyonunu içe aktarmayın. 02 API'sini kullanın.
- İzin sorgusu olmadan yeni satıcı tablosu birleştirmeyin.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] İzin, olay ve saat testleri geçiyor.
- [ ] `https` doğrulama testi eklendi.
- [ ] `import-linter` geçiyor.
- [ ] `CODEOWNERS` içe aktarma ve mağaza ekiplerinden inceleme istendi.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?
Seller XML Feed satıcının ürün akış adresidir. Sistem her gün belirlenen saatte adresi çeker. Çekilen dosya yeni bir toplu yükleme işi açar. Kayıt son çekme sonucunu ve arka arkaya hata sayısını tutar.

## Bugünkü bağımlılıklar
### Bu kaydın bağlandığı kayıtlar
- `Admin Seller Profile` (seller_profile): başka bağlam (02-satici-magaza)
- Bu kayda bağlanan: `Bulk Import Job.source_feed` (03b)
### Bu kayda dokunan kod
- `tradehub_core/tradehub_core/doctype/seller_xml_feed/seller_xml_feed.py:7-11`: saat aralığı kontrolü
- `tradehub_core/bulk_import/feed_api.py:80-318`: test, kaydet, listele, sil, önizle, çalıştır uç noktaları (yazıyor)
- `tradehub_core/bulk_import/feed_api.py:30`: `_require_xml_feed_feature` abonelik özelliğini kontrol ediyor (02 okuması)
- `tradehub_core/bulk_import/feed_scheduler.py:24-141`: vadesi gelen akışı çekiyor, iş açıyor, hata bildiriyor
- `tradehub_core/bulk_import/feed_scheduler.py:120`: bildirim gönderiyor (12)
### hooks.py kayıtları
- `tradehub_core/hooks.py:265`: saatlik `feed_scheduler.process_due_feeds`

## Bağımlılık sorunları
1. `tradehub_core/bulk_import/feed_api.py:30` akış özelliği abonelik (02) kontrolüne bağlı. Sözleşme yok. Doğrulanmadı: fonksiyonun içi okunmadı.
2. `tradehub_core/bulk_import/feed_scheduler.py:120` hata bildirimi doğrudan bildirim yardımcısını çağırıyor (12). Olay olmalı.
3. İzin sorgusu yok (`hooks.py` içinde kayıt bulunmadı). `Marketplace Seller` rolü tüm akışları listeleyebilir. `feed_api.py:45` `_get_own_feed` uç nokta içinde kontrol ediyor. Frappe liste görünümü korumasız olabilir.

## Hedef tasarım
- Sahip bağlam `03b-ice-aktarma`, paket yolu `tradehub_core/import_pipeline/feeds/`.
- Dışarıya açılan fonksiyonlar: `list_feeds(seller_profile)`, `run_feed_now(feed)`. Diğerleri iç kullanım.
- Yayınladığı olaylar: `import.feed_failed` (feed, seller_profile, error, consecutive_failures). Dinleyen: 12-bildirim. `import.job_started` zaten iş kaydından çıkar. Dinlediği olay yok. Abonelik özelliği `seller_store.api.has_feature(seller_profile, "xml_feed")` ile okunur.
- Başka bağlamlara bağlantılar: `seller_profile` Link kalır.
- Denetleyicide kalacak doğrulamalar: saat aralığı. Eklenmeli: `feed_url` biçimi ve `https` zorunluluğu.

## Geçiş adımları
1. `permission_query_conditions` ve `has_permission` ekleyin. `Bulk Import Job` deseni kullanılır. Bağımsızdır.
2. `feed_scheduler.py:120` bildirimi `import.feed_failed` olayına taşıyın. Outbox gerekir.
3. `feed_api.py:30` kontrolünü `seller_store.api.has_feature` ile değiştirin.
4. `module` alanını "Import Pipeline" yapın.

## Riskler ve testler
- Vadesi gelen akış saatinde çalışmalı. Test: `fetch_hour` şu anki saat olan akış işe alınır.
- Üç başarısız çekimden sonra bildirim gitmeli. Test: `consecutive_failures` artar ve olay yayınlanır.
- Satıcı başkasının akışını görmemeli. Test: izin sorgusu yabancı akışı gizler.
