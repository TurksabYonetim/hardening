# Media Usage

- Bağlam: 08-medya
- Tür: Ana kayıt
- Klasör: `tradehub_core/tradehub_core/doctype/media_usage`
- Denetleyici: `tradehub_core/tradehub_core/doctype/media_usage/media_usage.py` (80 satır)
- Önerilen sahip bağlam: 08-medya

## Epic

- Epic adı: Media Usage: 08-medya bağlamına taşıma
- Öncelik: Acil
- Faz: Faz 4
- Tahmini büyüklük: Orta

### User story

Bir geliştirici olarak, açık medya kullanımlarını izlemek istiyorum.
Böylece kullanılan dosyayı yanlışlıkla silmem.

### Kabul kriterleri

- [ ] Açık kullanım varken katalog temizliği varlığı silemez.
- [ ] Sözleşme testi `media/api.py::set_asset_usage` çağrısının mevcut davranışı koruduğunu gösterir.
- [ ] Katalog temizliği açık kullanım durumunu medya servisi üzerinden öğrenir.
- [ ] Aynı olay kimliği yeniden işlendiğinde ikinci sonuç kaydı oluşmaz.
- [ ] Characterization test: `Media Usage` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- Katalogdan kullanım durumunu yazmayın. Kimlik ve durumu medya yönetir.
- Yalnız referans adına göre eşleştirmeyin. Tür ve alan farklı kullanımları ayırır.
- Dış bağlamdan `media` iç dosyalarını çağırmayın. Geçişte `set_asset_usage` sözleşmesini kullanın.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] `Media Usage` için kabul koşullarını otomatik testte doğrulayın.
- [ ] `media` iç dosyalarına dış erişimleri `import-linter` ile kontrol edin.
- [ ] `CODEOWNERS` üzerinden `media` paketinin sahibinden inceleme isteyin.
- [ ] `tradehub_core/listing_purge/media.py:186` bağımlılığının geçiş sonrası çağrı yolunu inceleyin.
- [ ] Olay verisini ve yeniden teslimi sözleşme testiyle doğrulayın.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?
Bir medya varlığının hangi iş kaydında kullanıldığını tutar. `tradehub_core/tradehub_core/doctype/media_usage/media_usage.json:101`
Denetleyici, kayıt yazılmadan önce kayıt kurallarını uygular. `tradehub_core/tradehub_core/doctype/media_usage/media_usage.py:45`

## Bugünkü bağımlılıklar
### Bu kaydın bağlandığı kayıtlar
- `Media Asset` (`asset`): aynı bağlam. `tradehub_core/tradehub_core/doctype/media_usage/media_usage.json:23`
### Bu kayda dokunan kod
- `tradehub_core/listing_purge/media.py:186`: okuyor
- `tradehub_core/media/pipeline/core/usage.py:383`: okuyor
- `tradehub_core/media/meter.py:93`: yazıyor
- `tradehub_core/tests/test_serit_a_kablolama.py:37`: okuyor
### hooks.py kayıtları
- `tradehub_core/hooks.py:1178` Liste sorgusu yetki kancası.
- `tradehub_core/hooks.py:1301` Tekil kayıt yetki kancası.

## Bağımlılık sorunları
1. Katalog temizliği açık medya kullanımını doğrudan sorguluyor. Kullanım durumu değişirse katalog temizliği etkilenebilir. `tradehub_core/listing_purge/media.py:186`

## Hedef tasarım
- `08-medya` bu kayda `tradehub_core/media/` paketinde sahip olsun.
- Dışarıya açılacak fonksiyonlar. `tradehub_core/media/api.py::set_asset_usage`
- Olaylar. Katalog yayınlar: `catalog.listing_media_changed`. Veri: `event_id`, `listing_id`, `asset_ids`. `08-medya` dinler. Olay, değişiklikle aynı işlemde olay kuyruğuna yazılsın. Dinleyici olay kimliğini tek kez işlesin.
- Bağlantılar. Katalog kaydı kimliğini referans olarak sakla. Katalog tablosuna medya servisi yazmasın.
- Doğrulama ve iş akışı. Kullanım kimliği ve referans şekli doğrulansın. Açma ve kapama medya servisinde yürüsün.

## Geçiş adımları
1. Mevcut davranış için aşağıdaki testi ekle. `set_asset_usage` sözleşmesini mevcut uygulama üzerinden geçir.
2. İlk adımdan sonra katalog temizliği açık kullanımı medya API’sinden sorgulasın.
3. İkinci adımdan sonra olay kuyruğunu yeni ve eski girişleri tekilleştirerek devreye al.
4. Üçüncü adımdan sonra modül kaydını taşı ve eski girişleri uyum katmanına bağla.

## Riskler ve testler
- Açık kullanım varken katalog temizliği varlığı silemez.
