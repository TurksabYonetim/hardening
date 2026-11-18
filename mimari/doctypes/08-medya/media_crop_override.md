# Media Crop Override

- Bağlam: 08-medya
- Tür: Alt tablo
- Klasör: `tradehub_core/tradehub_core/doctype/media_crop_override`
- Denetleyici: `tradehub_core/tradehub_core/doctype/media_crop_override/media_crop_override.py` (62 satır)
- Önerilen sahip bağlam: 08-medya

## Epic

- Epic adı: Media Crop Override: 08-medya bağlamına taşıma
- Öncelik: Önemli
- Faz: Faz 4
- Tahmini büyüklük: Küçük

### User story

Bir satıcı olarak, profile özel kırpma ayarlamak istiyorum.
Böylece görselim farklı alanlara sığar.

### Kabul kriterleri

- [ ] Aynı profil için iki düzeltme reddedilir.
- [ ] `Media Crop Override` yazımı `Media Crop Intent` üzerinden yapılır.
- [ ] Geçiş testi, mevcut `Media Crop Override` kaydının sahip paket üzerinden okunabildiğini gösterir.
- [ ] Characterization test: `Media Crop Override` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- Alt satırı kırpma isteği dışında yazmayın. Onay üst kayıttadır.
- Kutu ölçülerini piksel olarak yazmayın. Denetim birim aralığını kullanır.
- `Media Crop Intent` dışındaki bağlamların alt satırı değiştirmesine izin vermeyin. Üst kayıt bütünlüğü bozulabilir.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] `Media Crop Override` için kabul koşullarını otomatik testte doğrulayın.
- [ ] `media` iç dosyalarına dış erişimleri `import-linter` ile kontrol edin.
- [ ] `CODEOWNERS` üzerinden `media` paketinin sahibinden inceleme isteyin.
- [ ] `Media Crop Intent` kaydedilirken alt satır sırasını ve mevcut değerleri karşılaştırın.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?
Kırpma isteğinin profile özel değerlerini tutar. `tradehub_core/tradehub_core/doctype/media_crop_override/media_crop_override.json:75`
Denetleyici, kayıt yazılmadan önce kayıt kurallarını uygular. `tradehub_core/tradehub_core/doctype/media_crop_override/media_crop_override.py:31`

## Bugünkü bağımlılıklar
### Bu kaydın bağlandığı kayıtlar
- Bağlantı alanı bulunmadı. `tradehub_core/tradehub_core/doctype/media_crop_override/media_crop_override.json:75`
### Bu kayda dokunan kod
- `tradehub_core/tests/test_serit_a_kablolama.py:120`: yazıyor
### hooks.py kayıtları
- Doğrudan ada göre kanca bulunmadı. Dolaylı kayıtlar doğrulanmadı. `tradehub_core/hooks.py:453`

## Bağımlılık sorunları
Önemli bir bağımlılık sorunu bulunmadı.

## Hedef tasarım
- `08-medya` bu kayda `tradehub_core/media/` paketinde sahip olsun.
- Dışarıya açılacak fonksiyonlar. `tradehub_core/media/api.py` içinde bu kayıt için ayrı fonksiyon önerilmiyor.
- Olaylar. Bu kayıt için ayrıca bağlamlar arası olay önerilmiyor.
- Bağlantılar. Bu kayıt için yeni bağlamlar arası bağlantı veya anlık görüntü alanı önerilmiyor.
- Doğrulama ve iş akışı. Aralık ve kutu doğrulamasını koru. Alt satırı yalnız kırpma isteğiyle güncelle.

## Geçiş adımları
1. Mevcut davranış için aşağıdaki testi ekle. Sahip paket için mevcut davranışı sabitle.
2. İlk adımdan sonra üst kayıt kaydederken alt satır kurallarını uygula.
3. İkinci adımdan sonra modül kaydını taşı. Eski Python girişlerini geçiş süresince yönlendir.

## Riskler ve testler
- Aynı profil için iki düzeltme reddedilir.
