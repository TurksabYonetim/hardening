# Media Category

- Bağlam: 08-medya
- Tür: Ana kayıt
- Klasör: `tradehub_core/tradehub_core/doctype/media_category`
- Denetleyici: `tradehub_core/tradehub_core/doctype/media_category/media_category.py` (148 satır)
- Önerilen sahip bağlam: 08-medya

## Epic

- Epic adı: Media Category: 08-medya bağlamına taşıma
- Öncelik: Önemli
- Faz: Faz 4
- Tahmini büyüklük: Orta

### User story

Bir satıcı olarak, mağaza kategorilerimi düzenlemek istiyorum.
Böylece kategori ağacım tutarlı kalır.

### Kabul kriterleri

- [ ] Alt ağacı taşımak derinlik sınırını ve mağaza ayrımını korur.
- [ ] Sözleşme testi `media/api.py::list_categories` çağrısının mevcut davranışı koruduğunu gösterir.
- [ ] Geçiş testi, mevcut `Media Category` kaydının sahip paket üzerinden okunabildiğini gösterir.
- [ ] Characterization test: `Media Category` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- Üst kategoriyi mağaza kapsamı dışında aramayın. Ağaç mağazaya aittir.
- Dolu kategoriyi doğrudan silmeyin. Alt dallar bağlantısız kalabilir.
- Dış bağlamdan `media` iç dosyalarını çağırmayın. Geçişte `list_categories` sözleşmesini kullanın.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] `Media Category` için kabul koşullarını otomatik testte doğrulayın.
- [ ] `media` iç dosyalarına dış erişimleri `import-linter` ile kontrol edin.
- [ ] `CODEOWNERS` üzerinden `media` paketinin sahibinden inceleme isteyin.
- [ ] Mevcut bir `Media Category` kaydını eski girişten ve sahip paketten okuyup karşılaştırın.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?
Mağazanın medya kategori ağacını tutar. `tradehub_core/tradehub_core/doctype/media_category/media_category.json:78`
Denetleyici mağazayı, üst kategoriyi ve ağaç derinliğini doğrular. `tradehub_core/tradehub_core/doctype/media_category/media_category.py:32`

## Bugünkü bağımlılıklar
### Bu kaydın bağlandığı kayıtlar
- `Admin Seller Profile` (`store`): başka bağlam (`02-satici-magaza`). `tradehub_core/tradehub_core/doctype/media_category/media_category.json:26`
- `Media Category` (`parent_category`): aynı bağlam. `tradehub_core/tradehub_core/doctype/media_category/media_category.json:36`
### Bu kayda dokunan kod
- `tradehub_core/api/seller_media.py:1744`: okuyor
- `tradehub_core/media/categories.py:78`: okuyor
- `tradehub_core/tests/test_media_categories.py:132`: okuyor
- `tradehub_core/tradehub_core/doctype/media_category_assignment/media_category_assignment.py:28`: okuyor
### hooks.py kayıtları
- `tradehub_core/hooks.py:1185` Liste sorgusu yetki kancası.
- `tradehub_core/hooks.py:1305` Tekil kayıt yetki kancası.

## Bağımlılık sorunları
Önemli bir bağımlılık sorunu bulunmadı.

## Hedef tasarım
- `08-medya` bu kayda `tradehub_core/media/` paketinde sahip olsun.
- Dışarıya açılacak fonksiyonlar. `tradehub_core/media/api.py::list_categories` `tradehub_core/media/api.py::save_category`
- Olaylar. Bu kayıt için ayrıca bağlamlar arası olay önerilmiyor.
- Bağlantılar. `store` sabit `Admin Seller Profile` kimliğine bağlansın.
- Doğrulama ve iş akışı. Ağaç derinliği ve aynı mağazaya ait üst kategori denetleyicide doğrulansın. Silme akışı servise taşınsın.

## Geçiş adımları
1. Mevcut davranış için aşağıdaki testi ekle. `list_categories` sözleşmesini mevcut uygulama üzerinden geçir.
2. İlk adımdan sonra rapordaki doğrulamayı ve iş akışını sahip pakette topla.
3. İkinci adımdan sonra modül kaydını taşı. Eski Python girişlerini geçiş süresince yönlendir.

## Riskler ve testler
- Alt ağacı taşımak derinlik sınırını ve mağaza ayrımını korur.
