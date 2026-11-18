# Media Maintenance Report

- Bağlam: 08-medya
- Tür: Kayıt defteri (log)
- Klasör: `tradehub_core/tradehub_core/doctype/media_maintenance_report`
- Denetleyici: `tradehub_core/tradehub_core/doctype/media_maintenance_report/media_maintenance_report.py` (50 satır)
- Önerilen sahip bağlam: 08-medya

## Epic

- Epic adı: Media Maintenance Report: 08-medya bağlamına taşıma
- Öncelik: Önemli
- Faz: Faz 4
- Tahmini büyüklük: Orta

### User story

Bir platform yöneticisi olarak, temizlik çalışmasını onaylamak istiyorum.
Böylece hangi silme kararının uygulandığını görürüm.

### Kabul kriterleri

- [ ] Onaysız deneme raporu silme izni vermez.
- [ ] `import-linter` denetimi, dış bağlamın `Media Maintenance Report` işleyicisini içe aktarmasını engeller.
- [ ] Geçiş testi, mevcut `Media Maintenance Report` kaydının sahip paket üzerinden okunabildiğini gösterir.
- [ ] Characterization test: `Media Maintenance Report` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- Deneme raporunu silme izni saymayın. Uygulama ayrıca onay ister.
- Onay kontrolünü çalıştırıcıdan çıkarmayın. Onaysız kayıt silinebilir.
- `Media Maintenance Report` için dış bağlama doğrudan yazma yolu açmayın. Yazım kuralları `media` paketinde kalır.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] `Media Maintenance Report` için kabul koşullarını otomatik testte doğrulayın.
- [ ] `media` iç dosyalarına dış erişimleri `import-linter` ile kontrol edin.
- [ ] `CODEOWNERS` üzerinden `media` paketinin sahibinden inceleme isteyin.
- [ ] Mevcut bir `Media Maintenance Report` kaydını eski girişten ve sahip paketten okuyup karşılaştırın.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?
Medya saklama ve temizlik çalışmalarının durumunu kaydeder. `tradehub_core/tradehub_core/doctype/media_maintenance_report/media_maintenance_report.json:48`
Denetleyici, kayıt yazılmadan önce kayıt kurallarını uygular. `tradehub_core/tradehub_core/doctype/media_maintenance_report/media_maintenance_report.py:36`

## Bugünkü bağımlılıklar
### Bu kaydın bağlandığı kayıtlar
- `User` (`approved_by`): başka bağlam (`01-kimlik-erisim`). `tradehub_core/tradehub_core/doctype/media_maintenance_report/media_maintenance_report.json:21`
### Bu kayda dokunan kod
- `tradehub_core/media/pipeline/storage/retention.py:984`: yazıyor
### hooks.py kayıtları
- Doğrudan ada göre kanca bulunmadı. Dolaylı kayıtlar doğrulanmadı. `tradehub_core/hooks.py:453`

## Bağımlılık sorunları
Önemli bir bağımlılık sorunu bulunmadı.

## Hedef tasarım
- `08-medya` bu kayda `tradehub_core/media/` paketinde sahip olsun.
- Dışarıya açılacak fonksiyonlar. `tradehub_core/media/api.py` içinde bu kayıt için ayrı fonksiyon önerilmiyor.
- Olaylar. Bu kayıt için ayrıca bağlamlar arası olay önerilmiyor.
- Bağlantılar. `approved_by` sabit `User` kimliğine bağlansın.
- Doğrulama ve iş akışı. Onay ve temizlik uygulaması servis üzerinden yürüsün. Rapor hatalı durum geçişini reddetsin.

## Geçiş adımları
1. Mevcut davranış için aşağıdaki testi ekle. Sahip paket için mevcut davranışı sabitle.
2. İlk adımdan sonra rapordaki doğrulamayı ve iş akışını sahip pakette topla.
3. İkinci adımdan sonra modül kaydını taşı. Eski Python girişlerini geçiş süresince yönlendir.

## Riskler ve testler
- Onaysız deneme raporu silme izni vermez.
