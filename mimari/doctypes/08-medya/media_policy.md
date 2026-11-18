# Media Policy

- Bağlam: 08-medya
- Tür: Ana kayıt
- Klasör: `tradehub_core/tradehub_core/doctype/media_policy`
- Denetleyici: `tradehub_core/tradehub_core/doctype/media_policy/media_policy.py` (25 satır)
- Önerilen sahip bağlam: 08-medya

## Epic

- Epic adı: Media Policy: 08-medya bağlamına taşıma
- Öncelik: Önemli
- Faz: Faz 4
- Tahmini büyüklük: Orta

### User story

Bir geliştirici olarak, profil ve içerik kurallarını birlikte değiştirmek istiyorum.
Böylece üretim tutarlı kurallarla ilerler.

### Kabul kriterleri

- [ ] Politika değişikliği yeni işleri etkiler.
- [ ] Önceki çıktılar erişilebilir kalır.
- [ ] `import-linter` denetimi, dış bağlamın `Media Policy` işleyicisini içe aktarmasını engeller.
- [ ] Characterization test: `Media Policy` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- Profil ve kural satırlarını ayrı işlemlerde yazmayın. Politika yarım kalabilir.
- Politika değişince eski çıktıları silmeyin. Yayındaki sürümler onları kullanabilir.
- `Media Policy` için dış bağlama doğrudan yazma yolu açmayın. Yazım kuralları `media` paketinde kalır.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] `Media Policy` için kabul koşullarını otomatik testte doğrulayın.
- [ ] `media` iç dosyalarına dış erişimleri `import-linter` ile kontrol edin.
- [ ] `CODEOWNERS` üzerinden `media` paketinin sahibinden inceleme isteyin.
- [ ] Mevcut bir `Media Policy` kaydını eski girişten ve sahip paketten okuyup karşılaştırın.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?
Medya kullanımına göre profil ve içerik kuralları tutar. `tradehub_core/tradehub_core/doctype/media_policy/media_policy.json:34`
Denetleyici, kayıt yazılmadan önce kayıt kurallarını uygular. `tradehub_core/tradehub_core/doctype/media_policy/media_policy.py:15`

## Bugünkü bağımlılıklar
### Bu kaydın bağlandığı kayıtlar
- `Media Policy Profile` (`profiles`) alt tablosu. `tradehub_core/tradehub_core/doctype/media_policy/media_policy.json:20`
- `Media Content Rule` (`content_rules`) alt tablosu. `tradehub_core/tradehub_core/doctype/media_policy/media_policy.json:21`
### Bu kayda dokunan kod
- `tradehub_core/tests/test_media_guest_access.py:91`: okuyor
### hooks.py kayıtları
- Doğrudan ada göre kanca bulunmadı. Dolaylı kayıtlar doğrulanmadı. `tradehub_core/hooks.py:453`

## Bağımlılık sorunları
Önemli bir bağımlılık sorunu bulunmadı.

## Hedef tasarım
- `08-medya` bu kayda `tradehub_core/media/` paketinde sahip olsun.
- Dışarıya açılacak fonksiyonlar. `tradehub_core/media/api.py` içinde bu kayıt için ayrı fonksiyon önerilmiyor.
- Olaylar. Bu kayıt için ayrıca bağlamlar arası olay önerilmiyor.
- Bağlantılar. Bu kayıt için yeni bağlamlar arası bağlantı veya anlık görüntü alanı önerilmiyor.
- Doğrulama ve iş akışı. Profil sırasını ve kural tutarlılığını üst kayıtta doğrula. Üretim kararını medya servisi versin.

## Geçiş adımları
1. Mevcut davranış için aşağıdaki testi ekle. Sahip paket için mevcut davranışı sabitle.
2. İlk adımdan sonra rapordaki doğrulamayı ve iş akışını sahip pakette topla.
3. İkinci adımdan sonra modül kaydını taşı. Eski Python girişlerini geçiş süresince yönlendir.

## Riskler ve testler
- Politika değişikliği yeni işleri etkiler. Önceki çıktılar erişilebilir kalır.
