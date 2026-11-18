# Media Profile

- Bağlam: 08-medya
- Tür: Ana kayıt
- Klasör: `tradehub_core/tradehub_core/doctype/media_profile`
- Denetleyici: `tradehub_core/tradehub_core/doctype/media_profile/media_profile.py` (121 satır)
- Önerilen sahip bağlam: 08-medya

## Epic

- Epic adı: Media Profile: 08-medya bağlamına taşıma
- Öncelik: Önemli
- Faz: Faz 4
- Tahmini büyüklük: Orta

### User story

Bir geliştirici olarak, çıktı boyutunu ve biçimini ayarlamak istiyorum.
Böylece geçersiz profil üretime girmez.

### Kabul kriterleri

- [ ] Hedef oranı olmayan kırpma profili reddedilir.
- [ ] `import-linter` denetimi, dış bağlamın `Media Profile` işleyicisini içe aktarmasını engeller.
- [ ] Geçiş testi, mevcut `Media Profile` kaydının sahip paket üzerinden okunabildiğini gösterir.
- [ ] Characterization test: `Media Profile` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- Oransız kırpma profili açmayın. Kırpma hedefi belirsiz kalır.
- Üretim seçimini denetleyiciye eklemeyin. Denetleyici profil değerlerini doğrular.
- `Media Profile` için dış bağlama doğrudan yazma yolu açmayın. Yazım kuralları `media` paketinde kalır.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] `Media Profile` için kabul koşullarını otomatik testte doğrulayın.
- [ ] `media` iç dosyalarına dış erişimleri `import-linter` ile kontrol edin.
- [ ] `CODEOWNERS` üzerinden `media` paketinin sahibinden inceleme isteyin.
- [ ] Mevcut bir `Media Profile` kaydını eski girişten ve sahip paketten okuyup karşılaştırın.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?
Medya çıktısının boyut, biçim ve hedef oranını tanımlar. `tradehub_core/tradehub_core/doctype/media_profile/media_profile.json:140`
Denetleyici genişlikleri, biçimleri ve hedef oranı doğrular. `tradehub_core/tradehub_core/doctype/media_profile/media_profile.py:35`

## Bugünkü bağımlılıklar
### Bu kaydın bağlandığı kayıtlar
- Bağlantı alanı bulunmadı. `tradehub_core/tradehub_core/doctype/media_profile/media_profile.json:140`
### Bu kayda dokunan kod
- `tradehub_core/media/urun_gorseli_optimize.py:190`: okuyor
- `tradehub_core/media/pipeline_bridge.py:2067`: okuyor
- `tradehub_core/tests/test_urun_gorseli_optimize.py:166`: okuyor
- `tradehub_core/tests/test_media_webp_merdiveni.py:140`: okuyor
- `tradehub_core/tests/test_pipeline_bridge.py:131`: yazıyor
### hooks.py kayıtları
- `tradehub_core/hooks.py:1171` Liste sorgusu yetki kancası.
- `tradehub_core/hooks.py:1293` Tekil kayıt yetki kancası.

## Bağımlılık sorunları
Önemli bir bağımlılık sorunu bulunmadı.

## Hedef tasarım
- `08-medya` bu kayda `tradehub_core/media/` paketinde sahip olsun.
- Dışarıya açılacak fonksiyonlar. `tradehub_core/media/api.py` içinde bu kayıt için ayrı fonksiyon önerilmiyor.
- Olaylar. Bu kayıt için ayrıca bağlamlar arası olay önerilmiyor.
- Bağlantılar. Bu kayıt için yeni bağlamlar arası bağlantı veya anlık görüntü alanı önerilmiyor.
- Doğrulama ve iş akışı. Biçim, genişlik ve oran doğrulaması denetleyicide kalsın. Profil seçimi üretim servisinde yapılsın.

## Geçiş adımları
1. Mevcut davranış için aşağıdaki testi ekle. Sahip paket için mevcut davranışı sabitle.
2. İlk adımdan sonra rapordaki doğrulamayı ve iş akışını sahip pakette topla.
3. İkinci adımdan sonra modül kaydını taşı. Eski Python girişlerini geçiş süresince yönlendir.

## Riskler ve testler
- Hedef oranı olmayan kırpma profili reddedilir.
