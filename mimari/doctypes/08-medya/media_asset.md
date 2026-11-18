# Media Asset

- Bağlam: 08-medya
- Tür: Ana kayıt
- Klasör: `tradehub_core/tradehub_core/doctype/media_asset`
- Denetleyici: `tradehub_core/tradehub_core/doctype/media_asset/media_asset.py` (105 satır)
- Önerilen sahip bağlam: 08-medya

## Epic

- Epic adı: Media Asset: 08-medya bağlamına taşıma
- Öncelik: Acil
- Faz: Faz 4
- Tahmini büyüklük: Büyük

### User story

Bir geliştirici olarak, medya varlığını tek yerden yönetmek istiyorum.
Böylece katalog temizliği medya şeması değiştiğinde çalışır.

### Kabul kriterleri

- [ ] Paylaşılan kaynak veya saklama kilidi silmeyi engeller.
- [ ] Sözleşme testi `media/api.py::get_asset` çağrısının mevcut davranışı koruduğunu gösterir.
- [ ] Katalog temizliği planlama ve silme işlevlerini medya API’sinden çağırır.
- [ ] Aynı olay kimliği yeniden işlendiğinde ikinci sonuç kaydı oluşmaz.
- [ ] Characterization test: `Media Asset` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- Katalogdan varlık alanlarını doğrudan sorgulamayın. Alanları medya yönetir.
- Silme planını tekrar denetlemeden uygulamayın. Saklama kilidi değişmiş olabilir.
- Dış bağlamdan `media` iç dosyalarını çağırmayın. Geçişte `get_asset` sözleşmesini kullanın.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] `Media Asset` için kabul koşullarını otomatik testte doğrulayın.
- [ ] `media` iç dosyalarına dış erişimleri `import-linter` ile kontrol edin.
- [ ] `CODEOWNERS` üzerinden `media` paketinin sahibinden inceleme isteyin.
- [ ] `tradehub_core/listing_purge/media.py:141` bağımlılığının geçiş sonrası çağrı yolunu inceleyin.
- [ ] Olay verisini ve yeniden teslimi sözleşme testiyle doğrulayın.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?
Medya varlığının kaynağını, yayın durumunu ve etkin sürümünü tutar. `tradehub_core/tradehub_core/doctype/media_asset/media_asset.json:199`
Denetleyici özetleri düzenler ve varlık anahtarını türetir. `tradehub_core/tradehub_core/doctype/media_asset/media_asset.py:53`

## Bugünkü bağımlılıklar
### Bu kaydın bağlandığı kayıtlar
- `Media Policy` (`slot_key`): aynı bağlam. `tradehub_core/tradehub_core/doctype/media_asset/media_asset.json:34`
- `Admin Seller Profile` (`owner_seller`): başka bağlam (`02-satici-magaza`). `tradehub_core/tradehub_core/doctype/media_asset/media_asset.json:71`
- `File` (`source_file`): başka bağlam (`14-platform-cekirdek`). `tradehub_core/tradehub_core/doctype/media_asset/media_asset.json:82`
- `Media Source` (`source`): aynı bağlam. `tradehub_core/tradehub_core/doctype/media_asset/media_asset.json:92`
- `Media Version` (`active_version`): aynı bağlam. `tradehub_core/tradehub_core/doctype/media_asset/media_asset.json:150`
### Bu kayda dokunan kod
- `tradehub_core/media/pipeline_bridge.py:363`: okuyor
- `tradehub_core/api/media_manifest.py:576`: okuyor
- `tradehub_core/media/files.py:320`: okuyor
- `tradehub_core/api/media_public.py:30`: okuyor
- `tradehub_core/tests/test_media_preview.py:74`: yazıyor
### hooks.py kayıtları
- `tradehub_core/hooks.py:1166` Liste sorgusu yetki kancası.
- `tradehub_core/hooks.py:1288` Tekil kayıt yetki kancası.
- `tradehub_core/hooks.py:504` İlgili kayıt dışı tetikleyici. `"tradehub_core.media.pipeline_bridge.maybe_generate_renditions",`
- `tradehub_core/hooks.py:540` İlgili kayıt dışı tetikleyici. `"tradehub_core.media.pipeline_bridge.cleanup_on_file_trash",`
- `tradehub_core/hooks.py:608` İlgili kayıt dışı tetikleyici. `"tradehub_core.media.kare.on_listing_update",`
- `tradehub_core/hooks.py:809` İlgili kayıt dışı tetikleyici. `"tradehub_core.media.magaza_gorseli.on_seller_profile_update",`

## Bağımlılık sorunları
1. Katalog temizliği medya varlığının alanlarını doğrudan okuyor. Alan değişiklikleri katalog temizliğini bozabilir. `tradehub_core/listing_purge/media.py:141`

## Hedef tasarım
- `08-medya` bu kayda `tradehub_core/media/` paketinde sahip olsun.
- Dışarıya açılacak fonksiyonlar. `tradehub_core/media/api.py::get_asset` `tradehub_core/media/api.py::plan_asset_purge` `tradehub_core/media/api.py::purge_asset`
- Olaylar. Yayın onayında: `media.asset_published`. Veri: `event_id`, `asset_id`, `version_id`. `03a-katalog` dinler. Olay, değişiklikle aynı işlemde olay kuyruğuna yazılsın. Dinleyici olay kimliğini tek kez işlesin. Dosya eklemede `platform.file_registered` olayını dinlesin.
- Bağlantılar. `owner_seller` sabit `Admin Seller Profile` kimliğine bağlansın. `source_file` sabit `File` kimliğine bağlansın.
- Doğrulama ve iş akışı. Katalog temizliğini medya sahipliğindeki silme planına bağla. Varlık anahtarı ve yayın doğrulaması denetleyicide kalsın.

## Geçiş adımları
1. Mevcut davranış için aşağıdaki testi ekle. `get_asset` sözleşmesini mevcut uygulama üzerinden geçir.
2. İlk adımdan sonra katalog temizliğini `plan_asset_purge` ve `purge_asset` işlevlerine bağla.
3. İkinci adımdan sonra olay kuyruğunu yeni ve eski girişleri tekilleştirerek devreye al.
4. Üçüncü adımdan sonra modül kaydını taşı ve eski girişleri uyum katmanına bağla.

## Riskler ve testler
- Paylaşılan kaynak veya saklama kilidi silmeyi engeller.
