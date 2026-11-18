# Media Category Assignment

- Bağlam: 08-medya
- Tür: Ana kayıt
- Klasör: `tradehub_core/tradehub_core/doctype/media_category_assignment`
- Denetleyici: `tradehub_core/tradehub_core/doctype/media_category_assignment/media_category_assignment.py` (81 satır)
- Önerilen sahip bağlam: 08-medya

## Epic

- Epic adı: Media Category Assignment: 08-medya bağlamına taşıma
- Öncelik: Önemli
- Faz: Faz 4
- Tahmini büyüklük: Orta

### User story

Bir satıcı olarak, görsellerimi mağaza kategorilerine atamak istiyorum.
Böylece görsellerimi kolay bulurum.

### Kabul kriterleri

- [ ] Aynı medyaya yinelenen atama tek bağ oluşturur.
- [ ] Sözleşme testi `media/api.py::assign_category` çağrısının mevcut davranışı koruduğunu gösterir.
- [ ] Geçiş testi, mevcut `Media Category Assignment` kaydının sahip paket üzerinden okunabildiğini gösterir.
- [ ] Characterization test: `Media Category Assignment` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- Mağazayı doğrulanmamış istek verisinden almayın. Atama yanlış mağazaya gidebilir.
- Toplu atamada kategori denetimini atlamayın. Her öğe aynı mağazaya ait olmalıdır.
- Dış bağlamdan `media` iç dosyalarını çağırmayın. Geçişte `assign_category` sözleşmesini kullanın.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] `Media Category Assignment` için kabul koşullarını otomatik testte doğrulayın.
- [ ] `media` iç dosyalarına dış erişimleri `import-linter` ile kontrol edin.
- [ ] `CODEOWNERS` üzerinden `media` paketinin sahibinden inceleme isteyin.
- [ ] Mevcut bir `Media Category Assignment` kaydını eski girişten ve sahip paketten okuyup karşılaştırın.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?
Mağaza medyasını medya kategorisine bağlar. `tradehub_core/tradehub_core/doctype/media_category_assignment/media_category_assignment.json:93`
Denetleyici, kayıt yazılmadan önce kayıt kurallarını uygular. `tradehub_core/tradehub_core/doctype/media_category_assignment/media_category_assignment.py:16`

## Bugünkü bağımlılıklar
### Bu kaydın bağlandığı kayıtlar
- `Media Category` (`category`): aynı bağlam. `tradehub_core/tradehub_core/doctype/media_category_assignment/media_category_assignment.json:19`
- `Admin Seller Profile` (`store`): başka bağlam (`02-satici-magaza`). `tradehub_core/tradehub_core/doctype/media_category_assignment/media_category_assignment.json:47`
- `User` (`assigned_by`): başka bağlam (`01-kimlik-erisim`). `tradehub_core/tradehub_core/doctype/media_category_assignment/media_category_assignment.json:80`
### Bu kayda dokunan kod
- `tradehub_core/media/categories.py:123`: okuyor
- `tradehub_core/tests/test_media_categories.py:26`: okuyor
- `tradehub_core/tradehub_core/doctype/media_category/media_category.py:119`: okuyor
### hooks.py kayıtları
- `tradehub_core/hooks.py:1186` Liste sorgusu yetki kancası.
- `tradehub_core/hooks.py:1306` Tekil kayıt yetki kancası.

## Bağımlılık sorunları
Önemli bir bağımlılık sorunu bulunmadı.

## Hedef tasarım
- `08-medya` bu kayda `tradehub_core/media/` paketinde sahip olsun.
- Dışarıya açılacak fonksiyonlar. `tradehub_core/media/api.py::assign_category`
- Olaylar. Bu kayıt için ayrıca bağlamlar arası olay önerilmiyor.
- Bağlantılar. `store` sabit `Admin Seller Profile` kimliğine bağlansın. `assigned_by` sabit `User` kimliğine bağlansın.
- Doğrulama ve iş akışı. Kategori ile mağaza tutarlılığını koru. Birden çok atamanın yazımını kategori servisine al.

## Geçiş adımları
1. Mevcut davranış için aşağıdaki testi ekle. `assign_category` sözleşmesini mevcut uygulama üzerinden geçir.
2. İlk adımdan sonra rapordaki doğrulamayı ve iş akışını sahip pakette topla.
3. İkinci adımdan sonra modül kaydını taşı. Eski Python girişlerini geçiş süresince yönlendir.

## Riskler ve testler
- Aynı medyaya yinelenen atama tek bağ oluşturur.
