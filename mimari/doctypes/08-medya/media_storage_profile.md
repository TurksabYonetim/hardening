# Media Storage Profile

- Bağlam: 08-medya
- Tür: Alt tablo
- Klasör: `tradehub_core/tradehub_core/doctype/media_storage_profile`
- Denetleyici: `tradehub_core/tradehub_core/doctype/media_storage_profile/media_storage_profile.py` (5 satır)
- Önerilen sahip bağlam: 08-medya

## Epic

- Epic adı: Media Storage Profile: 08-medya bağlamına taşıma
- Öncelik: Önemli
- Faz: Faz 4
- Tahmini büyüklük: Küçük

### User story

Bir geliştirici olarak, saklanacak profilleri seçmek istiyorum.
Böylece temizlik gerekli çıktıları korur.

### Kabul kriterleri

- [ ] Korunacak profil temizlik adaylarına girmez.
- [ ] `Media Storage Profile` yazımı `Media Storage Settings` üzerinden yapılır.
- [ ] Geçiş testi, mevcut `Media Storage Profile` kaydının sahip paket üzerinden okunabildiğini gösterir.
- [ ] Characterization test: `Media Storage Profile` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- Alt profil satırını tek başına yazmayın. Listeyi depolama ayarı yönetir.
- Koruma listesini silmeden sonra uygulamayın. Gerekli çıktı çoktan silinebilir.
- `Media Storage Settings` dışındaki bağlamların alt satırı değiştirmesine izin vermeyin. Üst kayıt bütünlüğü bozulabilir.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] `Media Storage Profile` için kabul koşullarını otomatik testte doğrulayın.
- [ ] `media` iç dosyalarına dış erişimleri `import-linter` ile kontrol edin.
- [ ] `CODEOWNERS` üzerinden `media` paketinin sahibinden inceleme isteyin.
- [ ] `Media Storage Settings` kaydedilirken alt satır sırasını ve mevcut değerleri karşılaştırın.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?
Depolama ayarlarında kullanılan profil satırını tutar. `tradehub_core/tradehub_core/doctype/media_storage_profile/media_storage_profile.json:16`
Kayıt alanlarını DocType şeması tanımlar. `tradehub_core/tradehub_core/doctype/media_storage_profile/media_storage_profile.json:16`

## Bugünkü bağımlılıklar
### Bu kaydın bağlandığı kayıtlar
- Bağlantı alanı bulunmadı. `tradehub_core/tradehub_core/doctype/media_storage_profile/media_storage_profile.json:16`
### Bu kayda dokunan kod
- `tradehub_core/setup/install.py:132`: kurulumda tablo varlığını denetliyor
### hooks.py kayıtları
- Doğrudan ada göre kanca bulunmadı. Dolaylı kayıtlar doğrulanmadı. `tradehub_core/hooks.py:453`

## Bağımlılık sorunları
Önemli bir bağımlılık sorunu bulunmadı.

## Hedef tasarım
- `08-medya` bu kayda `tradehub_core/media/` paketinde sahip olsun.
- Dışarıya açılacak fonksiyonlar. `tradehub_core/media/api.py` içinde bu kayıt için ayrı fonksiyon önerilmiyor.
- Olaylar. Bu kayıt için ayrıca bağlamlar arası olay önerilmiyor.
- Bağlantılar. Bu kayıt için yeni bağlamlar arası bağlantı veya anlık görüntü alanı önerilmiyor.
- Doğrulama ve iş akışı. Profil seçimini depolama ayarları üzerinden değiştir.

## Geçiş adımları
1. Mevcut davranış için aşağıdaki testi ekle. Sahip paket için mevcut davranışı sabitle.
2. İlk adımdan sonra üst kayıt kaydederken alt satır kurallarını uygula.
3. İkinci adımdan sonra modül kaydını taşı. Eski Python girişlerini geçiş süresince yönlendir.

## Riskler ve testler
- Korunacak profil temizlik adaylarına girmez.
