# Media Version

- Bağlam: 08-medya
- Tür: Ana kayıt
- Klasör: `tradehub_core/tradehub_core/doctype/media_version`
- Denetleyici: `tradehub_core/tradehub_core/doctype/media_version/media_version.py` (462 satır)
- Önerilen sahip bağlam: 08-medya

## Epic

- Epic adı: Media Version: 08-medya bağlamına taşıma
- Öncelik: Acil
- Faz: Faz 4
- Tahmini büyüklük: Büyük

### User story

Bir geliştirici olarak, etkin medya sürümünü güvenle değiştirmek istiyorum.
Böylece yayını tutarlı biçimde geri alırım.

### Kabul kriterleri

- [ ] Eşzamanlı iki yayın kararından sonra tek etkin sürüm kalır.
- [ ] Sözleşme testi `media/api.py::promote_asset_version` çağrısının mevcut davranışı koruduğunu gösterir.
- [ ] Geçiş testi, mevcut `Media Version` kaydının sahip paket üzerinden okunabildiğini gösterir.
- [ ] Characterization test: `Media Version` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- Varlığın etkin sürümünü tek başına yazmayın. Sürüm durumu da değişmelidir.
- Başka varlığın sürümünü yayınlamayın. Geçmiş aynı varlığa ait olmalıdır.
- Dış bağlamdan `media` iç dosyalarını çağırmayın. Geçişte `promote_asset_version` sözleşmesini kullanın.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] `Media Version` için kabul koşullarını otomatik testte doğrulayın.
- [ ] `media` iç dosyalarına dış erişimleri `import-linter` ile kontrol edin.
- [ ] `CODEOWNERS` üzerinden `media` paketinin sahibinden inceleme isteyin.
- [ ] `tradehub_core/listing_purge/media.py:50` bağımlılığının geçiş sonrası çağrı yolunu inceleyin.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?
Medya varlığının sürümlerini ve etkin sürüm durumunu tutar. `tradehub_core/tradehub_core/doctype/media_version/media_version.json:187`
Denetleyici ekleme sırasında kaynaktan sürüm bilgisi çıkarır. `tradehub_core/tradehub_core/doctype/media_version/media_version.py:63`

## Bugünkü bağımlılıklar
### Bu kaydın bağlandığı kayıtlar
- `Media Asset` (`asset`): aynı bağlam. `tradehub_core/tradehub_core/doctype/media_version/media_version.json:39`
### Bu kayda dokunan kod
- `tradehub_core/media/pipeline_bridge.py:897`: okuyor
- `tradehub_core/tests/test_seller_media_history.py:42`: yazıyor
- `tradehub_core/api/seller_media.py:388`: okuyor
- `tradehub_core/media/kare.py:1011`: okuyor
- `tradehub_core/tests/test_video_preview_ve_listing.py:73`: okuyor
- `tradehub_core/media/pipeline_bridge.py:2432`: denetleyici fonksiyonunu içe aktarıyor
### hooks.py kayıtları
- `tradehub_core/hooks.py:1179` Liste sorgusu yetki kancası.
- `tradehub_core/hooks.py:1302` Tekil kayıt yetki kancası.

## Bağımlılık sorunları
1. Katalog temizliği etkin sürüm bağlantısını biliyor. Sürüm saklama kuralı katalog temizliğini etkileyebilir. `tradehub_core/listing_purge/media.py:50`

## Hedef tasarım
- `08-medya` bu kayda `tradehub_core/media/` paketinde sahip olsun.
- Dışarıya açılacak fonksiyonlar. `tradehub_core/media/api.py::promote_asset_version` `tradehub_core/media/api.py::rollback_asset_version`
- Olaylar. Bu kayıt için ayrıca bağlamlar arası olay önerilmiyor.
- Bağlantılar. Bu kayıt için yeni bağlamlar arası bağlantı veya anlık görüntü alanı önerilmiyor.
- Doğrulama ve iş akışı. Ölçü ve özet doğrulaması denetleyicide kalsın. Sürüm değişimini servis tek işlemde uygulasın.

## Geçiş adımları
1. Mevcut davranış için aşağıdaki testi ekle. `promote_asset_version` sözleşmesini mevcut uygulama üzerinden geçir.
2. İlk adımdan sonra bu kaydı medya silme planında ele al. Katalog tablonun adını kullanmasın.
3. İkinci adımdan sonra modül kaydını taşı. Eski Python girişlerini geçiş süresince yönlendir.

## Riskler ve testler
- Eşzamanlı iki yayın kararından sonra tek etkin sürüm kalır.
