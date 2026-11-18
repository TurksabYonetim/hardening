# Bulk Import Job

- Bağlam: 03b-ice-aktarma
- Tür: Ana kayıt (iş kaydı)
- Klasör: `tradehub_core/tradehub_core/doctype/bulk_import_job`
- Denetleyici: `tradehub_core/tradehub_core/doctype/bulk_import_job/bulk_import_job.py` (36 satır)
- Önerilen sahip bağlam: 03b-ice-aktarma

## Epic

- Epic adı: Bulk Import Job: 03b-ice-aktarma bağlamına taşıma
- Öncelik: Acil
- Faz: Faz 4
- Tahmini büyüklük: Büyük

### User story

Bir satıcı olarak, toplu ürün yüklemesinin katalog kuralı değişince bozulmamasını istiyorum.
Böylece dosyam her seferinde aynı kurallarla işlenir ve hata satırları doğru çıkar.

### Kabul kriterleri

- [ ] `persister.py` ürün kaydını `catalog.api.create_listing` ve `update_listing` ile yazıyor. `frappe.new_doc("Listing")` kalmadı.
- [ ] `Bulk Import Job Row` tablosu var. `Listing.created_by_bulk_job` özel alanı kaldırıldı ve yama idempotent.
- [ ] `api/listing.py` içe aktarma tablosunu okumuyor. Okuma `import_pipeline.api.list_jobs` üzerinden.
- [ ] `import.job_started`, `import.job_completed`, `import.job_failed` olayları yayınlanıyor. Sözleşme testi var.
- [ ] Satıcı başkasının işini görmüyor. Test var.
- [ ] `import-linter` kontrolü `tradehub_core.import_pipeline` için geçiyor.
- [ ] Characterization test: `Bulk Import Job` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- `persister.py` içinden `Listing` kaydını `frappe.new_doc` ya da `frappe.get_doc` ile doğrudan yazmayın. Katalog API'sini çağırın.
- `Listing` tablosuna içe aktarma alanı eklemeyin. Bağ `Bulk Import Job Row` içinde tutulur.
- Katalog vitrin dosyasından (`api/listing.py`) iş tablosunu okumayın.
- Denetleyiciden `utils.seller_store.my_store` çağırmayın. `seller_store.api` fonksiyonunu kullanın.
- Kural motoru (ECA) hata türlerini içe aktarma şemasına sızdırmayın. Genel `rejected_by_rule` kullanın.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] Geçersiz satırın `validation` hatası ürettiği test geçiyor.
- [ ] Takılı iş testi (`detect_stuck_bulk_jobs`) geçiyor.
- [ ] İzin sorgusu çapraz satıcı testi var.
- [ ] `Bulk Import Job Row` yaması test sitesinde iki kez çalıştı.
- [ ] Olay sözleşme testleri eklendi.
- [ ] `import-linter` geçiyor.
- [ ] `CODEOWNERS` içe aktarma ve katalog ekiplerinden inceleme istendi.
- [ ] Ruff lint temiz.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?
Bulk Import Job toplu ürün yükleme işidir. Satıcı Excel, CSV, XML ya da JSON dosyası yükler. İş arka planda satır satır ürün (Listing) oluşturur ya da günceller. Kayıt sayaçları, hataları ve kaynak türünü (dosya, akış, API) tutar.

## Bugünkü bağımlılıklar
### Bu kaydın bağlandığı kayıtlar
- `Admin Seller Profile` (seller_profile): başka bağlam (02-satici-magaza)
- `Seller XML Feed` (source_feed): aynı bağlam
- `Seller Template Profile` (template_profile): başka bağlam (02-satici-magaza)
- Alt tablo `Bulk Import Job Error` (error_details): aynı bağlam
### Bu kayda dokunan kod
- `tradehub_core/tradehub_core/doctype/bulk_import_job/bulk_import_job.py:18-30`: mağaza profilini `utils.seller_store.my_store` ile çözüyor (02 okuması)
- `tradehub_core/bulk_import/api.py:61,109,138,472,563,633,957,1036`: başlatma, durum, geçmiş, hata dosyası, yeniden deneme uç noktaları (yazıyor)
- `tradehub_core/bulk_import/runner.py:159-168`: işi çalıştırıyor, `persister.create_listing` ile `Listing` yazıyor (03a yazma)
- `tradehub_core/bulk_import/persister.py:654-740`: `Listing` kaydını oluşturuyor ve güncelliyor (03a yazma)
- `tradehub_core/bulk_import/tasks.py:19-139`: eski işleri temizliyor, takılı işi "Failed" yapıyor
- `tradehub_core/bulk_import/feed_scheduler.py:71`: XML akışı yeni iş açıyor
- `tradehub_core/api/v1/catalog.py:363`: ürün API'si `source=api` iş açıyor
- `tradehub_core/catalog/service.py:282`: eşleştirme servisi işin kaynağını okuyor
- `tradehub_core/api/listing.py:5368,5586`: vitrin dosyası API kaynaklı işleri okuyor (03a okuması)
- `tradehub_core/media/file_isolation.py:108`: medya dosya izolasyonu bu DocType'ı tanıyor (08)
- `tradehub_core/permissions.py:2042-2060`: satıcı yalnız kendi işini görür
- `Listing.created_by_bulk_job` özel alanı: `patches/v15_bulk_import_init/01_add_listing_created_by_bulk_job.py` ürün tablosuna iş bağı ekliyor
### hooks.py kayıtları
- `tradehub_core/hooks.py:258`: saatlik `detect_stuck_bulk_jobs`
- `tradehub_core/hooks.py:1119,1244`: izin sorgusu ve tek kayıt izni
- `tradehub_core/hooks.py:581`: `Listing.validate` içinde ECA kural motoru "bulk_import bağlamını" tanıyor (yorum)

## Bağımlılık sorunları
1. `tradehub_core/bulk_import/persister.py:654-740` içe aktarma kataloğun ana kaydını `frappe.new_doc("Listing")` ve `frappe.get_doc("Listing")` ile doğrudan yazıyor. Katalog kuralı değişince içe aktarma kırılır. Bu, "iki geliştirici aynı tabloya yazıyor" sorununun örneğidir.
2. `tradehub_core/api/listing.py:5368,5586` katalog vitrin dosyası içe aktarma tablosunu okuyor. Yön ters. Katalog içe aktarmayı bilmemeli.
3. `Listing.created_by_bulk_job` özel alanı başka bağlamın tablosuna eklenmiş. Katalog şeması içe aktarma kavramı taşıyor.
4. `bulk_import_job.py:23` denetleyici `utils.seller_store.my_store` çağırıyor. Bu, 02 bağlamının yardımcısıdır. Sözleşme yok.
5. `tradehub_core/bulk_import/runner.py` ECA kural motorunu (14) `Listing.validate` üzerinden dolaylı tetikliyor. Hata türü `eca_rejected` içe aktarma hatasına sızmış (`bulk_import_job_error.json` seçenekleri).

## Hedef tasarım
- Sahip bağlam `03b-ice-aktarma`, paket yolu `tradehub_core/import_pipeline/` (bugünkü `bulk_import/` adı korunabilir).
- Dışarıya açılan fonksiyonlar (`import_pipeline/api.py`): `start_import(seller_profile, file, options)` iş açar. `get_job_status(job)` durum verir. `list_jobs(seller_profile, source)` geçmiş verir. `open_api_job(seller_profile, products)` ürün API'si için iş açar.
- Yayınladığı olaylar: `import.job_started`, `import.job_completed` (job, seller_profile, inserted, updated, errors), `import.job_failed`. Dinleyenler: 12-bildirim (satıcıya özet), 03a-katalog (toplu onay), 02-satici (şablon profili güncelleme).
- Dinlediği olaylar: `catalog.listing_rejected_by_rule` (ECA kuralından gelen ret). Bugün bu bilgi `eca_rejected` hata satırı olarak doğrudan yazılıyor.
- Başka bağlamlara bağlantılar: `seller_profile` ve `template_profile` Link alanları kalır. İkisi de kararlı kayıt. `Listing.created_by_bulk_job` kaldırılır. Yerine içe aktarma kendi tablosunda `Bulk Import Job Row` (job, listing, row_number) tutar. Katalog bu bağı bilmez.
- Katalog yazması: `persister.create_listing` ve `update_listing` yerine `catalog.api.create_listing(seller_profile, data)` ve `catalog.api.update_listing(name, data)` çağrılır. Katalog doğrulama hatasını yapılandırılmış hata olarak döner.
- Denetleyicide kalacak doğrulamalar: dosya biçimi ve güncelleme modu. Mağaza çözümü (`:18-30`) `seller_store.api.get_store_for_user` çağrısı olur.

## Geçiş adımları
1. `catalog/api.py` içine `create_listing` ve `update_listing` ekleyin (03a ekibi). Giriş sözlüğü `catalog/contracts.py` içinde tanımlanır.
2. `persister.py:654-740` bu fonksiyonları çağırır. 1. adımdan sonra gelir.
3. `Bulk Import Job Row` tablosunu ekleyin. `created_by_bulk_job` okumaları (`api/listing.py:5368,5586`, `bulk_import/api.py:1036`) buraya döner. Bağımsızdır.
4. `created_by_bulk_job` özel alanını kaldıran yama yazın. 3. adımdan sonra gelir.
5. `import.job_*` olaylarını ekleyin. Outbox gerekir.
6. `bulk_import_job.py:23` çağrısını `seller_store.api` fonksiyonuna çevirin.
7. `module` alanını "Import Pipeline" yapın. 2. ve 4. adımdan sonra gelir.

## Riskler ve testler
- Satırdaki katalog hatası iş hatasına doğru yazılmalı. Test: geçersiz fiyatlı satır `validation` hatası üretir.
- Takılı iş bir saat sonra "Failed" olmalı. Test: `detect_stuck_bulk_jobs` eski "Running" işi kapatır.
- Satıcı başkasının işini görmemeli. Test: izin sorgusu yabancı işi gizler.
- API kaynaklı iş geçmişte doğru listelenmeli. Test: `source=api` iş `Bulk Import Job Row` ile ürünlere bağlanır.
