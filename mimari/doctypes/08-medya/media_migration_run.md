# Media Migration Run

- Bağlam: 08-medya
- Tür: Ana kayıt
- Klasör: `tradehub_core/tradehub_core/doctype/media_migration_run`
- Denetleyici: `tradehub_core/tradehub_core/doctype/media_migration_run/media_migration_run.py` (64 satır)
- Önerilen sahip bağlam: 08-medya

## Epic

- Epic adı: Media Migration Run: 08-medya bağlamına taşıma
- Öncelik: Önemli
- Faz: Faz 4
- Tahmini büyüklük: Büyük

### User story

Bir geliştirici olarak, taşıma denemesi ile uygulama kapsamını eşleştirmek istiyorum.
Böylece yalnız onayladığım dosyalar taşınır.

### Kabul kriterleri

- [ ] Onaylanan deneme kapsamı uygulamada genişletilemez.
- [ ] `import-linter` denetimi, dış bağlamın `Media Migration Run` işleyicisini içe aktarmasını engeller.
- [ ] Geçiş testi, mevcut `Media Migration Run` kaydının sahip paket üzerinden okunabildiğini gösterir.
- [ ] Characterization test: `Media Migration Run` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- Onaysız denemeyi uygulamada kullanmayın. Uygulama onay ister.
- Çalıştırma kilidini atlamayın. Aynı dosyalar eşzamanlı taşınabilir.
- `Media Migration Run` için dış bağlama doğrudan yazma yolu açmayın. Yazım kuralları `media` paketinde kalır.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] `Media Migration Run` için kabul koşullarını otomatik testte doğrulayın.
- [ ] `media` iç dosyalarına dış erişimleri `import-linter` ile kontrol edin.
- [ ] `CODEOWNERS` üzerinden `media` paketinin sahibinden inceleme isteyin.
- [ ] Mevcut bir `Media Migration Run` kaydını eski girişten ve sahip paketten okuyup karşılaştırın.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?
Medya taşıma çalışmasını ve deneme onayının kaydını tutar. `tradehub_core/tradehub_core/doctype/media_migration_run/media_migration_run.json:358`
Denetleyici, kayıt yazılmadan önce kayıt kurallarını uygular. `tradehub_core/tradehub_core/doctype/media_migration_run/media_migration_run.py:33`

## Bugünkü bağımlılıklar
### Bu kaydın bağlandığı kayıtlar
- `Media Migration Run` (`approved_dry_run`): aynı bağlam. `tradehub_core/tradehub_core/doctype/media_migration_run/media_migration_run.json:86`
- `User` (`requested_by`): başka bağlam (`01-kimlik-erisim`). `tradehub_core/tradehub_core/doctype/media_migration_run/media_migration_run.json:93`
- `Media Migration Batch` (`batches`) alt tablosu. `tradehub_core/tradehub_core/doctype/media_migration_run/media_migration_run.json:346`
### Bu kayda dokunan kod
- `tradehub_core/media/migration_runtime.py:497`: yazıyor
- `tradehub_core/tests/test_media_migration_runtime.py:33`: okuyor
### hooks.py kayıtları
- Doğrudan ada göre kanca bulunmadı. Dolaylı kayıtlar doğrulanmadı. `tradehub_core/hooks.py:453`

## Bağımlılık sorunları
Önemli bir bağımlılık sorunu bulunmadı.

## Hedef tasarım
- `08-medya` bu kayda `tradehub_core/media/` paketinde sahip olsun.
- Dışarıya açılacak fonksiyonlar. `tradehub_core/media/api.py` içinde bu kayıt için ayrı fonksiyon önerilmiyor.
- Olaylar. Bu kayıt için ayrıca bağlamlar arası olay önerilmiyor.
- Bağlantılar. `requested_by` sabit `User` kimliğine bağlansın.
- Doğrulama ve iş akışı. Deneme onayı ve çalıştırma kilidi taşıma servisinde kalsın. Durum kuralları denetleyicide korunsun.

## Geçiş adımları
1. Mevcut davranış için aşağıdaki testi ekle. Sahip paket için mevcut davranışı sabitle.
2. İlk adımdan sonra rapordaki doğrulamayı ve iş akışını sahip pakette topla.
3. İkinci adımdan sonra modül kaydını taşı. Eski Python girişlerini geçiş süresince yönlendir.

## Riskler ve testler
- Onaylanan deneme kapsamı uygulamada genişletilemez.
