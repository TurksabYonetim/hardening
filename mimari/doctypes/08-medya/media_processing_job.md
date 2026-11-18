# Media Processing Job

- Bağlam: 08-medya
- Tür: Ana kayıt
- Klasör: `tradehub_core/tradehub_core/doctype/media_processing_job`
- Denetleyici: `tradehub_core/tradehub_core/doctype/media_processing_job/media_processing_job.py` (107 satır)
- Önerilen sahip bağlam: 08-medya

## Epic

- Epic adı: Media Processing Job: 08-medya bağlamına taşıma
- Öncelik: Acil
- Faz: Faz 4
- Tahmini büyüklük: Orta

### User story

Bir geliştirici olarak, başarısız medya işlerini yeniden denemek istiyorum.
Böylece aynı çıktı iki kez yazılmaz.

### Kabul kriterleri

- [ ] Aynı iş iki çalışan tarafından alınırsa tek çıktı yazılır.
- [ ] `import-linter` denetimi, dış bağlamın `Media Processing Job` işleyicisini içe aktarmasını engeller.
- [ ] Geçiş testi, mevcut `Media Processing Job` kaydının sahip paket üzerinden okunabildiğini gösterir.
- [ ] Characterization test: `Media Processing Job` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- İşi kilit almadan seçmeyin. İki çalışan aynı işi alabilir.
- Katalogdan iş satırını doğrudan silmeyin. Medya servisi iş durumunu denetler.
- `Media Processing Job` için dış bağlama doğrudan yazma yolu açmayın. Yazım kuralları `media` paketinde kalır.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] `Media Processing Job` için kabul koşullarını otomatik testte doğrulayın.
- [ ] `media` iç dosyalarına dış erişimleri `import-linter` ile kontrol edin.
- [ ] `CODEOWNERS` üzerinden `media` paketinin sahibinden inceleme isteyin.
- [ ] `tradehub_core/listing_purge/media.py:46` bağımlılığının geçiş sonrası çağrı yolunu inceleyin.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?
Medya işinin deneme sayısını, sürelerini ve sonucunu tutar. `tradehub_core/tradehub_core/doctype/media_processing_job/media_processing_job.json:142`
Denetleyici deneme sayısını, süreyi ve hata kodunu doğrular. `tradehub_core/tradehub_core/doctype/media_processing_job/media_processing_job.py:61`

## Bugünkü bağımlılıklar
### Bu kaydın bağlandığı kayıtlar
- `Media Asset` (`asset`): aynı bağlam. `tradehub_core/tradehub_core/doctype/media_processing_job/media_processing_job.json:30`
### Bu kayda dokunan kod
- `tradehub_core/media/pipeline_bridge.py:1311`: okuyor
- `tradehub_core/api/observability.py:366`: okuyor
- `tradehub_core/api/seller_media.py:389`: okuyor
- `tradehub_core/tests/test_media_dedup_endpoint.py:402`: okuyor
- `tradehub_core/tests/test_pipeline_bridge.py:112`: siliyor
### hooks.py kayıtları
- `tradehub_core/hooks.py:1169` Liste sorgusu yetki kancası.
- `tradehub_core/hooks.py:1291` Tekil kayıt yetki kancası.

## Bağımlılık sorunları
1. Katalog temizliği iş kaydının varlık alanını biliyor. Alan değişikliği katalog temizliğini bozabilir. `tradehub_core/listing_purge/media.py:46`

## Hedef tasarım
- `08-medya` bu kayda `tradehub_core/media/` paketinde sahip olsun.
- Dışarıya açılacak fonksiyonlar. `tradehub_core/media/api.py` içinde bu kayıt için ayrı fonksiyon önerilmiyor.
- Olaylar. Bu kayıt için ayrıca bağlamlar arası olay önerilmiyor.
- Bağlantılar. Bu kayıt için yeni bağlamlar arası bağlantı veya anlık görüntü alanı önerilmiyor.
- Doğrulama ve iş akışı. Deneme ve hata bilgisi denetleyicide doğrulansın. Yeniden deneme ve eşzamanlı iş seçimi serviste yürüsün.

## Geçiş adımları
1. Mevcut davranış için aşağıdaki testi ekle. Sahip paket için mevcut davranışı sabitle.
2. İlk adımdan sonra bu kaydı medya silme planında ele al. Katalog tablonun adını kullanmasın.
3. İkinci adımdan sonra modül kaydını taşı. Eski Python girişlerini geçiş süresince yönlendir.

## Riskler ve testler
- Aynı iş iki çalışan tarafından alınırsa tek çıktı yazılır.
