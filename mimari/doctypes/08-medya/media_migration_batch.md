# Media Migration Batch

- Bağlam: 08-medya
- Tür: Alt tablo
- Klasör: `tradehub_core/tradehub_core/doctype/media_migration_batch`
- Denetleyici: `tradehub_core/tradehub_core/doctype/media_migration_batch/media_migration_batch.py` (45 satır)
- Önerilen sahip bağlam: 08-medya

## Epic

- Epic adı: Media Migration Batch: 08-medya bağlamına taşıma
- Öncelik: Önemli
- Faz: Faz 4
- Tahmini büyüklük: Küçük

### User story

Bir geliştirici olarak, yarım kalan taşıma parçasını yeniden başlatmak istiyorum.
Böylece dosyaları iki kez taşımam.

### Kabul kriterleri

- [ ] Yarım kalan iş parçası tekrar başlayınca kayıt çoğaltmaz.
- [ ] `Media Migration Batch` yazımı `Media Migration Run` üzerinden yapılır.
- [ ] Geçiş testi, mevcut `Media Migration Batch` kaydının sahip paket üzerinden okunabildiğini gösterir.
- [ ] Characterization test: `Media Migration Batch` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- Alt satırı üst çalışma kapsamı olmadan yazmayın. Yanlış çalışma etkilenebilir.
- Doğrudan yazımla liste doğrulamasını atlamayın. Yeniden başlatma geçersiz veriye dayanabilir.
- `Media Migration Run` dışındaki bağlamların alt satırı değiştirmesine izin vermeyin. Üst kayıt bütünlüğü bozulabilir.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] `Media Migration Batch` için kabul koşullarını otomatik testte doğrulayın.
- [ ] `media` iç dosyalarına dış erişimleri `import-linter` ile kontrol edin.
- [ ] `CODEOWNERS` üzerinden `media` paketinin sahibinden inceleme isteyin.
- [ ] `Media Migration Run` kaydedilirken alt satır sırasını ve mevcut değerleri karşılaştırın.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?
Medya taşıma çalışmasının iş parçalarını alt satır olarak tutar. `tradehub_core/tradehub_core/doctype/media_migration_batch/media_migration_batch.json:137`
Denetleyici, kayıt yazılmadan önce kayıt kurallarını uygular. `tradehub_core/tradehub_core/doctype/media_migration_batch/media_migration_batch.py:15`

## Bugünkü bağımlılıklar
### Bu kaydın bağlandığı kayıtlar
- Bağlantı alanı bulunmadı. `tradehub_core/tradehub_core/doctype/media_migration_batch/media_migration_batch.json:137`
### Bu kayda dokunan kod
- `tradehub_core/media/migration_runtime.py:501`: yazıyor
- `tradehub_core/tests/test_media_migration_runtime.py:113`: okuyor
### hooks.py kayıtları
- Doğrudan ada göre kanca bulunmadı. Dolaylı kayıtlar doğrulanmadı. `tradehub_core/hooks.py:453`

## Bağımlılık sorunları
1. Çalışan alt satıra doğrudan yazıyor. Doğrulama değişirse medya taşıması tutarsız kayıt bırakabilir. `tradehub_core/media/migration_runtime.py:501`

## Hedef tasarım
- `08-medya` bu kayda `tradehub_core/media/` paketinde sahip olsun.
- Dışarıya açılacak fonksiyonlar. `tradehub_core/media/api.py` içinde bu kayıt için ayrı fonksiyon önerilmiyor.
- Olaylar. Bu kayıt için ayrıca bağlamlar arası olay önerilmiyor.
- Bağlantılar. Bu kayıt için yeni bağlamlar arası bağlantı veya anlık görüntü alanı önerilmiyor.
- Doğrulama ve iş akışı. İş parçası durumunu taşıma servisi yazsın. JSON liste doğrulaması servis yazımında da çalışsın.

## Geçiş adımları
1. Mevcut davranış için aşağıdaki testi ekle. Sahip paket için mevcut davranışı sabitle.
2. İlk adımdan sonra çalışanların yazımını taşıma servisine bağla. Alt satırı üst kayıt kapsamıyla güncelle.
3. İkinci adımdan sonra modül kaydını taşı. Eski Python girişlerini geçiş süresince yönlendir.

## Riskler ve testler
- Yarım kalan iş parçası tekrar başlayınca kayıt çoğaltmaz.
