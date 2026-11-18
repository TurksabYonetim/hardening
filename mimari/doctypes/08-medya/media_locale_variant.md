# Media Locale Variant

- Bağlam: 08-medya
- Tür: Ana kayıt
- Klasör: `tradehub_core/tradehub_core/doctype/media_locale_variant`
- Denetleyici: `tradehub_core/tradehub_core/doctype/media_locale_variant/media_locale_variant.py` (95 satır)
- Önerilen sahip bağlam: 08-medya

## Epic

- Epic adı: Media Locale Variant: 08-medya bağlamına taşıma
- Öncelik: Önemli
- Faz: Faz 4
- Tahmini büyüklük: Orta

### User story

Bir geliştirici olarak, dile uygun görseli seçmek istiyorum.
Böylece müşteri kendi diline uygun görseli görür.

### Kabul kriterleri

- [ ] Dil sürümü yoksa temel görsel seçilir.
- [ ] Sözleşme testi `media/api.py::resolve_localized_asset` çağrısının mevcut davranışı koruduğunu gösterir.
- [ ] Geçiş testi, mevcut `Media Locale Variant` kaydının sahip paket üzerinden okunabildiğini gösterir.
- [ ] Characterization test: `Media Locale Variant` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- Dil sürümü yokken boş görsel döndürmeyin. Temel görsel kullanılabilir.
- Mağaza kapsamını kaldırmayın. Başka mağazanın görseli seçilebilir.
- Dış bağlamdan `media` iç dosyalarını çağırmayın. Geçişte `resolve_localized_asset` sözleşmesini kullanın.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] `Media Locale Variant` için kabul koşullarını otomatik testte doğrulayın.
- [ ] `media` iç dosyalarına dış erişimleri `import-linter` ile kontrol edin.
- [ ] `CODEOWNERS` üzerinden `media` paketinin sahibinden inceleme isteyin.
- [ ] Mevcut bir `Media Locale Variant` kaydını eski girişten ve sahip paketten okuyup karşılaştırın.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?
Görselin dile özel sürümünü seçmek için kayıt tutar. `tradehub_core/tradehub_core/doctype/media_locale_variant/media_locale_variant.json:72`
Denetleyici, kayıt yazılmadan önce kayıt kurallarını uygular. `tradehub_core/tradehub_core/doctype/media_locale_variant/media_locale_variant.py:43`

## Bugünkü bağımlılıklar
### Bu kaydın bağlandığı kayıtlar
- `Admin Seller Profile` (`store`): başka bağlam (`02-satici-magaza`). `tradehub_core/tradehub_core/doctype/media_locale_variant/media_locale_variant.json:37`
### Bu kayda dokunan kod
- `tradehub_core/media/seo.py:778`: okuyor
### hooks.py kayıtları
- Doğrudan ada göre kanca bulunmadı. Dolaylı kayıtlar doğrulanmadı. `tradehub_core/hooks.py:453`

## Bağımlılık sorunları
Önemli bir bağımlılık sorunu bulunmadı.

## Hedef tasarım
- `08-medya` bu kayda `tradehub_core/media/` paketinde sahip olsun.
- Dışarıya açılacak fonksiyonlar. `tradehub_core/media/api.py::resolve_localized_asset`
- Olaylar. Bu kayıt için ayrıca bağlamlar arası olay önerilmiyor.
- Bağlantılar. `store` sabit `Admin Seller Profile` kimliğine bağlansın.
- Doğrulama ve iş akışı. Dil seçimi ve varsayılana dönüş medya okuma servisinde toplansın. Tekillik denetleyicide kalsın.

## Geçiş adımları
1. Mevcut davranış için aşağıdaki testi ekle. `resolve_localized_asset` sözleşmesini mevcut uygulama üzerinden geçir.
2. İlk adımdan sonra rapordaki doğrulamayı ve iş akışını sahip pakette topla.
3. İkinci adımdan sonra modül kaydını taşı. Eski Python girişlerini geçiş süresince yönlendir.

## Riskler ve testler
- Dil sürümü yoksa temel görsel seçilir.
