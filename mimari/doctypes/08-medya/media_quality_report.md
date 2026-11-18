# Media Quality Report

- Bağlam: 08-medya
- Tür: Kayıt defteri (log)
- Klasör: `tradehub_core/tradehub_core/doctype/media_quality_report`
- Denetleyici: `tradehub_core/tradehub_core/doctype/media_quality_report/media_quality_report.py` (83 satır)
- Önerilen sahip bağlam: 08-medya

## Epic

- Epic adı: Media Quality Report: 08-medya bağlamına taşıma
- Öncelik: Önemli
- Faz: Faz 4
- Tahmini büyüklük: Orta

### User story

Bir geliştirici olarak, aylık kalite ölçümlerini yeniden hesaplamak istiyorum.
Böylece aynı ölçüm iki kez sayılmaz.

### Kabul kriterleri

- [ ] Aylık rapor ikinci kez üretildiğinde değerler katlanmaz.
- [ ] `import-linter` denetimi, dış bağlamın `Media Quality Report` işleyicisini içe aktarmasını engeller.
- [ ] Geçiş testi, mevcut `Media Quality Report` kaydının sahip paket üzerinden okunabildiğini gösterir.
- [ ] Characterization test: `Media Quality Report` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- Aylık sonucu varlık raporuna yazmayın. Raporların kapsamı farklıdır.
- Katalog temizliğinde ölçüm tablosuna yazmayın. Saklama kararı medyaya aittir.
- `Media Quality Report` için dış bağlama doğrudan yazma yolu açmayın. Yazım kuralları `media` paketinde kalır.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] `Media Quality Report` için kabul koşullarını otomatik testte doğrulayın.
- [ ] `media` iç dosyalarına dış erişimleri `import-linter` ile kontrol edin.
- [ ] `CODEOWNERS` üzerinden `media` paketinin sahibinden inceleme isteyin.
- [ ] `tradehub_core/listing_purge/media.py:47` bağımlılığının geçiş sonrası çağrı yolunu inceleyin.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?
Varlık ve dönem bazında medya kalitesi ölçümlerini tutar. `tradehub_core/tradehub_core/doctype/media_quality_report/media_quality_report.json:89`
Denetleyici, kayıt yazılmadan önce kayıt kurallarını uygular. `tradehub_core/tradehub_core/doctype/media_quality_report/media_quality_report.py:22`

## Bugünkü bağımlılıklar
### Bu kaydın bağlandığı kayıtlar
- `Media Asset` (`asset`): aynı bağlam. `tradehub_core/tradehub_core/doctype/media_quality_report/media_quality_report.json:47`
- `Media Version` (`version`): aynı bağlam. `tradehub_core/tradehub_core/doctype/media_quality_report/media_quality_report.json:48`
### Bu kayda dokunan kod
- `tradehub_core/media/pipeline_bridge.py:2688`: okuyor
- `tradehub_core/media/pipeline/image/report.py:832`: yazıyor
- `tradehub_core/media/rendition_backfill.py:130`: okuyor
- `tradehub_core/tests/test_media_quality_report_doctype.py:56`: siliyor
- `tradehub_core/tests/test_pipeline_bridge.py:109`: siliyor
### hooks.py kayıtları
- `tradehub_core/hooks.py:1170` Liste sorgusu yetki kancası.
- `tradehub_core/hooks.py:1292` Tekil kayıt yetki kancası.
- `tradehub_core/hooks.py:226` İlgili kayıt dışı tetikleyici. `"tradehub_core.media.pipeline.image.report.run_previous_month_report",`

## Bağımlılık sorunları
1. Katalog temizliği kalite raporunun varlık alanını biliyor. Rapor ilişkisi katalog temizliğini etkileyebilir. `tradehub_core/listing_purge/media.py:47`

## Hedef tasarım
- `08-medya` bu kayda `tradehub_core/media/` paketinde sahip olsun.
- Dışarıya açılacak fonksiyonlar. `tradehub_core/media/api.py` içinde bu kayıt için ayrı fonksiyon önerilmiyor.
- Olaylar. Bu kayıt için ayrıca bağlamlar arası olay önerilmiyor.
- Bağlantılar. Bu kayıt için yeni bağlamlar arası bağlantı veya anlık görüntü alanı önerilmiyor.
- Doğrulama ve iş akışı. Ölçüm kapsamı ve negatif değerler denetleyicide doğrulansın. Dönem birleştirmesi rapor servisinde yapılsın.

## Geçiş adımları
1. Mevcut davranış için aşağıdaki testi ekle. Sahip paket için mevcut davranışı sabitle.
2. İlk adımdan sonra bu kaydı medya silme planında ele al. Katalog tablonun adını kullanmasın.
3. İkinci adımdan sonra modül kaydını taşı. Eski Python girişlerini geçiş süresince yönlendir.

## Riskler ve testler
- Aylık rapor ikinci kez üretildiğinde değerler katlanmaz.
