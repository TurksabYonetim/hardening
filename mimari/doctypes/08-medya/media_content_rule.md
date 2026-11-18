# Media Content Rule

- Bağlam: 08-medya
- Tür: Alt tablo
- Klasör: `tradehub_core/tradehub_core/doctype/media_content_rule`
- Denetleyici: `tradehub_core/tradehub_core/doctype/media_content_rule/media_content_rule.py` (7 satır)
- Önerilen sahip bağlam: 08-medya

## Epic

- Epic adı: Media Content Rule: 08-medya bağlamına taşıma
- Öncelik: Önemli
- Faz: Faz 4
- Tahmini büyüklük: Küçük

### User story

Bir geliştirici olarak, içerik kurallarını politika üzerinden düzenlemek istiyorum.
Böylece kural sırasını korurum.

### Kabul kriterleri

- [ ] Politika kaydı kural sırasını korur.
- [ ] `Media Content Rule` yazımı `Media Policy` üzerinden yapılır.
- [ ] Geçiş testi, mevcut `Media Content Rule` kaydının sahip paket üzerinden okunabildiğini gösterir.
- [ ] Characterization test: `Media Content Rule` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- Alt satırı tek başına yazmayın. Kuralı üst politika yönetir.
- Kuralları kendiliğinden sıralamayın. Üretim kararı sıraya bağlı olabilir.
- `Media Policy` dışındaki bağlamların alt satırı değiştirmesine izin vermeyin. Üst kayıt bütünlüğü bozulabilir.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] `Media Content Rule` için kabul koşullarını otomatik testte doğrulayın.
- [ ] `media` iç dosyalarına dış erişimleri `import-linter` ile kontrol edin.
- [ ] `CODEOWNERS` üzerinden `media` paketinin sahibinden inceleme isteyin.
- [ ] `Media Policy` kaydedilirken alt satır sırasını ve mevcut değerleri karşılaştırın.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?
Medya politikasının içerik kurallarını alt satır olarak tutar. `tradehub_core/tradehub_core/doctype/media_content_rule/media_content_rule.json:22`
Kayıt alanlarını DocType şeması tanımlar. `tradehub_core/tradehub_core/doctype/media_content_rule/media_content_rule.json:22`

## Bugünkü bağımlılıklar
### Bu kaydın bağlandığı kayıtlar
- Bağlantı alanı bulunmadı. `tradehub_core/tradehub_core/doctype/media_content_rule/media_content_rule.json:22`
### Bu kayda dokunan kod
- `tradehub_core/setup/install.py:116`: kurulumda tablo varlığını denetliyor
### hooks.py kayıtları
- Doğrudan ada göre kanca bulunmadı. Dolaylı kayıtlar doğrulanmadı. `tradehub_core/hooks.py:453`

## Bağımlılık sorunları
Önemli bir bağımlılık sorunu bulunmadı.

## Hedef tasarım
- `08-medya` bu kayda `tradehub_core/media/` paketinde sahip olsun.
- Dışarıya açılacak fonksiyonlar. `tradehub_core/media/api.py` içinde bu kayıt için ayrı fonksiyon önerilmiyor.
- Olaylar. Bu kayıt için ayrıca bağlamlar arası olay önerilmiyor.
- Bağlantılar. Bu kayıt için yeni bağlamlar arası bağlantı veya anlık görüntü alanı önerilmiyor.
- Doğrulama ve iş akışı. Kuralları yalnız politika güncellemesiyle yaz. Birbiriyle çelişen satırları üst kayıtta doğrula.

## Geçiş adımları
1. Mevcut davranış için aşağıdaki testi ekle. Sahip paket için mevcut davranışı sabitle.
2. İlk adımdan sonra üst kayıt kaydederken alt satır kurallarını uygula.
3. İkinci adımdan sonra modül kaydını taşı. Eski Python girişlerini geçiş süresince yönlendir.

## Riskler ve testler
- Politika kaydı kural sırasını korur.
