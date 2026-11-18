# Media Folder Item

- Bağlam: 08-medya
- Tür: Ana kayıt
- Klasör: `tradehub_core/tradehub_core/doctype/media_folder_item`
- Denetleyici: `tradehub_core/tradehub_core/doctype/media_folder_item/media_folder_item.py` (94 satır)
- Önerilen sahip bağlam: 08-medya

## Epic

- Epic adı: Media Folder Item: 08-medya bağlamına taşıma
- Öncelik: Önemli
- Faz: Faz 4
- Tahmini büyüklük: Orta

### User story

Bir satıcı olarak, klasör öğelerini topluca taşımak istiyorum.
Böylece görsellerim yarım taşınmış kalmaz.

### Kabul kriterleri

- [ ] Yarım kalan toplu taşıma üyeliği bozmaz.
- [ ] Sözleşme testi `media/api.py::set_folder_items` çağrısının mevcut davranışı koruduğunu gösterir.
- [ ] Geçiş testi, mevcut `Media Folder Item` kaydının sahip paket üzerinden okunabildiğini gösterir.
- [ ] Characterization test: `Media Folder Item` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- Her öğeden sonra işlemi kesinleştirmeyin. Hata yarım taşıma bırakabilir.
- Mağaza eşleşmesini atlamayın. Öğe ile klasör aynı mağazaya ait olmalıdır.
- Dış bağlamdan `media` iç dosyalarını çağırmayın. Geçişte `set_folder_items` sözleşmesini kullanın.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] `Media Folder Item` için kabul koşullarını otomatik testte doğrulayın.
- [ ] `media` iç dosyalarına dış erişimleri `import-linter` ile kontrol edin.
- [ ] `CODEOWNERS` üzerinden `media` paketinin sahibinden inceleme isteyin.
- [ ] Mevcut bir `Media Folder Item` kaydını eski girişten ve sahip paketten okuyup karşılaştırın.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?
Medyanın mağaza klasöründeki üyeliğini tutar. `tradehub_core/tradehub_core/doctype/media_folder_item/media_folder_item.json:47`
Denetleyici, kayıt yazılmadan önce kayıt kurallarını uygular. `tradehub_core/tradehub_core/doctype/media_folder_item/media_folder_item.py:40`

## Bugünkü bağımlılıklar
### Bu kaydın bağlandığı kayıtlar
- `Media Folder` (`folder`): aynı bağlam. `tradehub_core/tradehub_core/doctype/media_folder_item/media_folder_item.json:14`
- `Admin Seller Profile` (`store`): başka bağlam (`02-satici-magaza`). `tradehub_core/tradehub_core/doctype/media_folder_item/media_folder_item.json:32`
### Bu kayda dokunan kod
- `tradehub_core/api/seller_media.py:1593`: okuyor
- `tradehub_core/tests/test_media_folder.py:51`: okuyor
- `tradehub_core/tradehub_core/doctype/media_folder/media_folder.py:154`: okuyor
### hooks.py kayıtları
- `tradehub_core/hooks.py:1183` Liste sorgusu yetki kancası.
- `tradehub_core/hooks.py:1304` Tekil kayıt yetki kancası.

## Bağımlılık sorunları
Önemli bir bağımlılık sorunu bulunmadı.

## Hedef tasarım
- `08-medya` bu kayda `tradehub_core/media/` paketinde sahip olsun.
- Dışarıya açılacak fonksiyonlar. `tradehub_core/media/api.py::set_folder_items`
- Olaylar. Bu kayıt için ayrıca bağlamlar arası olay önerilmiyor.
- Bağlantılar. `store` sabit `Admin Seller Profile` kimliğine bağlansın.
- Doğrulama ve iş akışı. Öğe ile klasörün mağazası eşleşsin. Toplu taşıma tek işlemde yapılsın.

## Geçiş adımları
1. Mevcut davranış için aşağıdaki testi ekle. `set_folder_items` sözleşmesini mevcut uygulama üzerinden geçir.
2. İlk adımdan sonra rapordaki doğrulamayı ve iş akışını sahip pakette topla.
3. İkinci adımdan sonra modül kaydını taşı. Eski Python girişlerini geçiş süresince yönlendir.

## Riskler ve testler
- Yarım kalan toplu taşıma üyeliği bozmaz.
