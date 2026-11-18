# Media Policy Profile

- Bağlam: 08-medya
- Tür: Alt tablo
- Klasör: `tradehub_core/tradehub_core/doctype/media_policy_profile`
- Denetleyici: `tradehub_core/tradehub_core/doctype/media_policy_profile/media_policy_profile.py` (7 satır)
- Önerilen sahip bağlam: 08-medya

## Epic

- Epic adı: Media Policy Profile: 08-medya bağlamına taşıma
- Öncelik: Önemli
- Faz: Faz 4
- Tahmini büyüklük: Küçük

### User story

Bir geliştirici olarak, politika profillerini sıralı tutmak istiyorum.
Böylece gereksiz çıktı üretilmez.

### Kabul kriterleri

- [ ] Aynı profil iki kez eklenince üretim işi çoğalmaz.
- [ ] `Media Policy Profile` yazımı `Media Policy` üzerinden yapılır.
- [ ] Geçiş testi, mevcut `Media Policy Profile` kaydının sahip paket üzerinden okunabildiğini gösterir.
- [ ] Characterization test: `Media Policy Profile` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- Profil satırını politika dışında yazmayın. Sırayı üst kayıt yönetir.
- Profil sırasını kendiliğinden değiştirmeyin. Üretim sıralamayı kullanabilir.
- `Media Policy` dışındaki bağlamların alt satırı değiştirmesine izin vermeyin. Üst kayıt bütünlüğü bozulabilir.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] `Media Policy Profile` için kabul koşullarını otomatik testte doğrulayın.
- [ ] `media` iç dosyalarına dış erişimleri `import-linter` ile kontrol edin.
- [ ] `CODEOWNERS` üzerinden `media` paketinin sahibinden inceleme isteyin.
- [ ] `Media Policy` kaydedilirken alt satır sırasını ve mevcut değerleri karşılaştırın.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?
Bir medya politikasına bağlı çıktı profilini alt satırda tutar. `tradehub_core/tradehub_core/doctype/media_policy_profile/media_policy_profile.json:19`
Kayıt alanlarını DocType şeması tanımlar. `tradehub_core/tradehub_core/doctype/media_policy_profile/media_policy_profile.json:19`

## Bugünkü bağımlılıklar
### Bu kaydın bağlandığı kayıtlar
- `Media Profile` (`profile`): aynı bağlam. `tradehub_core/tradehub_core/doctype/media_policy_profile/media_policy_profile.json:8`
### Bu kayda dokunan kod
- `tradehub_core/setup/install.py:115`: kurulumda tablo varlığını denetliyor
### hooks.py kayıtları
- Doğrudan ada göre kanca bulunmadı. Dolaylı kayıtlar doğrulanmadı. `tradehub_core/hooks.py:453`

## Bağımlılık sorunları
Önemli bir bağımlılık sorunu bulunmadı.

## Hedef tasarım
- `08-medya` bu kayda `tradehub_core/media/` paketinde sahip olsun.
- Dışarıya açılacak fonksiyonlar. `tradehub_core/media/api.py` içinde bu kayıt için ayrı fonksiyon önerilmiyor.
- Olaylar. Bu kayıt için ayrıca bağlamlar arası olay önerilmiyor.
- Bağlantılar. Bu kayıt için yeni bağlamlar arası bağlantı veya anlık görüntü alanı önerilmiyor.
- Doğrulama ve iş akışı. Profil sırasını ve tekrarları politika üzerinden doğrula.

## Geçiş adımları
1. Mevcut davranış için aşağıdaki testi ekle. Sahip paket için mevcut davranışı sabitle.
2. İlk adımdan sonra üst kayıt kaydederken alt satır kurallarını uygula.
3. İkinci adımdan sonra modül kaydını taşı. Eski Python girişlerini geçiş süresince yönlendir.

## Riskler ve testler
- Aynı profil iki kez eklenince üretim işi çoğalmaz.
