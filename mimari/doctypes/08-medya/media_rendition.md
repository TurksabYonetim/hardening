# Media Rendition

- Bağlam: 08-medya
- Tür: Ana kayıt
- Klasör: `tradehub_core/tradehub_core/doctype/media_rendition`
- Denetleyici: `tradehub_core/tradehub_core/doctype/media_rendition/media_rendition.py` (121 satır)
- Önerilen sahip bağlam: 08-medya

## Epic

- Epic adı: Media Rendition: 08-medya bağlamına taşıma
- Öncelik: Acil
- Faz: Faz 4
- Tahmini büyüklük: Orta

### User story

Bir geliştirici olarak, yayına uygun medya çıktısını seçmek istiyorum.
Böylece kullanıcı etkin görseli görür.

### Kabul kriterleri

- [ ] Etkin olmayan sürümün çıktısı halka sunulmaz.
- [ ] Sözleşme testi `media/api.py::list_renditions` çağrısının mevcut davranışı koruduğunu gösterir.
- [ ] Geçiş testi, mevcut `Media Rendition` kaydının sahip paket üzerinden okunabildiğini gösterir.
- [ ] Characterization test: `Media Rendition` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- Yalnız dosya adresine bakarak yayın yapmayın. Sürüm ve durum da geçerli olmalıdır.
- Katalogdan türevleri doğrudan silmeyin. Türevleri medya servisi yönetir.
- Dış bağlamdan `media` iç dosyalarını çağırmayın. Geçişte `list_renditions` sözleşmesini kullanın.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] `Media Rendition` için kabul koşullarını otomatik testte doğrulayın.
- [ ] `media` iç dosyalarına dış erişimleri `import-linter` ile kontrol edin.
- [ ] `CODEOWNERS` üzerinden `media` paketinin sahibinden inceleme isteyin.
- [ ] `tradehub_core/listing_purge/media.py:43` bağımlılığının geçiş sonrası çağrı yolunu inceleyin.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?
Bir medya sürümünden üretilen çıktı dosyasını ve ölçülerini tutar. `tradehub_core/tradehub_core/doctype/media_rendition/media_rendition.json:266`
Denetleyici çıktı ölçülerini ve yayın durumunu doğrular. `tradehub_core/tradehub_core/doctype/media_rendition/media_rendition.py:36`

## Bugünkü bağımlılıklar
### Bu kaydın bağlandığı kayıtlar
- `Media Asset` (`asset`): aynı bağlam. `tradehub_core/tradehub_core/doctype/media_rendition/media_rendition.json:44`
- `Media Version` (`version_hash`): aynı bağlam. `tradehub_core/tradehub_core/doctype/media_rendition/media_rendition.json:54`
### Bu kayda dokunan kod
- `tradehub_core/media/pipeline_bridge.py:386`: okuyor
- `tradehub_core/api/media_public.py:60`: okuyor
- `tradehub_core/media/seo_audit.py:723`: okuyor
- `tradehub_core/media/trash.py:233`: okuyor
- `tradehub_core/media/image_facts.py:227`: okuyor
### hooks.py kayıtları
- `tradehub_core/hooks.py:1168` Liste sorgusu yetki kancası.
- `tradehub_core/hooks.py:1290` Tekil kayıt yetki kancası.

## Bağımlılık sorunları
1. Katalog temizliği türev tablosunun varlık alanına bağlı. Türev şeması katalog temizliğini etkileyebilir. `tradehub_core/listing_purge/media.py:43`

## Hedef tasarım
- `08-medya` bu kayda `tradehub_core/media/` paketinde sahip olsun.
- Dışarıya açılacak fonksiyonlar. `tradehub_core/media/api.py::list_renditions`
- Olaylar. Bu kayıt için ayrıca bağlamlar arası olay önerilmiyor.
- Bağlantılar. Bu kayıt için yeni bağlamlar arası bağlantı veya anlık görüntü alanı önerilmiyor.
- Doğrulama ve iş akışı. Ölçü ve durum ölçütleri denetleyicide kalsın. Çıktı yazımı ve yayın seçimi serviste yapılsın.

## Geçiş adımları
1. Mevcut davranış için aşağıdaki testi ekle. `list_renditions` sözleşmesini mevcut uygulama üzerinden geçir.
2. İlk adımdan sonra bu kaydı medya silme planında ele al. Katalog tablonun adını kullanmasın.
3. İkinci adımdan sonra modül kaydını taşı. Eski Python girişlerini geçiş süresince yönlendir.

## Riskler ve testler
- Etkin olmayan sürümün çıktısı halka sunulmaz.
