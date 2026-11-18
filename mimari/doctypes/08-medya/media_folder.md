# Media Folder

- Bağlam: 08-medya
- Tür: Ana kayıt
- Klasör: `tradehub_core/tradehub_core/doctype/media_folder`
- Denetleyici: `tradehub_core/tradehub_core/doctype/media_folder/media_folder.py` (197 satır)
- Önerilen sahip bağlam: 08-medya

## Epic

- Epic adı: Media Folder: 08-medya bağlamına taşıma
- Öncelik: Önemli
- Faz: Faz 4
- Tahmini büyüklük: Orta

### User story

Bir satıcı olarak, mağaza klasörlerimi düzenlemek istiyorum.
Böylece görsellerimi kolay bulurum.

### Kabul kriterleri

- [ ] Başka mağaza üst klasör olarak seçilemez.
- [ ] Sözleşme testi `media/api.py::list_folders` çağrısının mevcut davranışı koruduğunu gösterir.
- [ ] Geçiş testi, mevcut `Media Folder` kaydının sahip paket üzerinden okunabildiğini gösterir.
- [ ] Characterization test: `Media Folder` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- Üst klasörü mağaza denetimi olmadan seçmeyin. Ağaç mağazaya aittir.
- Dolu klasörü tablodan silmeyin. Üyelikler bağlantısız kalabilir.
- Dış bağlamdan `media` iç dosyalarını çağırmayın. Geçişte `list_folders` sözleşmesini kullanın.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] `Media Folder` için kabul koşullarını otomatik testte doğrulayın.
- [ ] `media` iç dosyalarına dış erişimleri `import-linter` ile kontrol edin.
- [ ] `CODEOWNERS` üzerinden `media` paketinin sahibinden inceleme isteyin.
- [ ] Mevcut bir `Media Folder` kaydını eski girişten ve sahip paketten okuyup karşılaştırın.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?
Mağaza medyası için klasör hiyerarşisi tutar. `tradehub_core/tradehub_core/doctype/media_folder/media_folder.json:45`
Denetleyici, kayıt yazılmadan önce kayıt kurallarını uygular. `tradehub_core/tradehub_core/doctype/media_folder/media_folder.py:50`

## Bugünkü bağımlılıklar
### Bu kaydın bağlandığı kayıtlar
- `Admin Seller Profile` (`store`): başka bağlam (`02-satici-magaza`). `tradehub_core/tradehub_core/doctype/media_folder/media_folder.json:22`
- `Media Folder` (`parent_folder`): aynı bağlam. `tradehub_core/tradehub_core/doctype/media_folder/media_folder.json:32`
### Bu kayda dokunan kod
- `tradehub_core/tests/test_role_escalation.py:267`: yazıyor
- `tradehub_core/tests/test_media_folder.py:155`: okuyor
- `tradehub_core/api/seller_media.py:1567`: okuyor
- `tradehub_core/tradehub_core/doctype/media_folder_item/media_folder_item.py:44`: okuyor
### hooks.py kayıtları
- `tradehub_core/hooks.py:1182` Liste sorgusu yetki kancası.
- `tradehub_core/hooks.py:1303` Tekil kayıt yetki kancası.

## Bağımlılık sorunları
Önemli bir bağımlılık sorunu bulunmadı.

## Hedef tasarım
- `08-medya` bu kayda `tradehub_core/media/` paketinde sahip olsun.
- Dışarıya açılacak fonksiyonlar. `tradehub_core/media/api.py::list_folders` `tradehub_core/media/api.py::save_folder`
- Olaylar. Bu kayıt için ayrıca bağlamlar arası olay önerilmiyor.
- Bağlantılar. `store` sabit `Admin Seller Profile` kimliğine bağlansın.
- Doğrulama ve iş akışı. Üst klasör sahipliği ve derinlik denetleyicide kalsın. Dolu klasörün silme kararını servis versin.

## Geçiş adımları
1. Mevcut davranış için aşağıdaki testi ekle. `list_folders` sözleşmesini mevcut uygulama üzerinden geçir.
2. İlk adımdan sonra rapordaki doğrulamayı ve iş akışını sahip pakette topla.
3. İkinci adımdan sonra modül kaydını taşı. Eski Python girişlerini geçiş süresince yönlendir.

## Riskler ve testler
- Başka mağaza üst klasör olarak seçilemez.
