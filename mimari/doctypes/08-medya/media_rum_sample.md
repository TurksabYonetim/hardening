# Media RUM Sample

- Bağlam: 08-medya
- Tür: Kayıt defteri (log)
- Klasör: `tradehub_core/tradehub_core/doctype/media_rum_sample`
- Denetleyici: `tradehub_core/tradehub_core/doctype/media_rum_sample/media_rum_sample.py` (37 satır)
- Önerilen sahip bağlam: 08-medya

## Epic

- Epic adı: Media RUM Sample: 08-medya bağlamına taşıma
- Öncelik: Önemli
- Faz: Faz 4
- Tahmini büyüklük: Orta

### User story

Bir geliştirici olarak, tarayıcı ölçümlerini kontrollü toplamak istiyorum.
Böylece medya performansını tutarlı ölçerim.

### Kabul kriterleri

- [ ] Aşırı büyük gönderim rapor hesaplarını bozmaz.
- [ ] `import-linter` denetimi, dış bağlamın `Media RUM Sample` işleyicisini içe aktarmasını engeller.
- [ ] Geçiş testi, mevcut `Media RUM Sample` kaydının sahip paket üzerinden okunabildiğini gösterir.
- [ ] Characterization test: `Media RUM Sample` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- Sınırsız istemci yükü kaydetmeyin. Rapor hesapları etkilenebilir.
- Örnek toplamayı denetleyiciye koymayın. Alımı medya servisi yönetir.
- `Media RUM Sample` için dış bağlama doğrudan yazma yolu açmayın. Yazım kuralları `media` paketinde kalır.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] `Media RUM Sample` için kabul koşullarını otomatik testte doğrulayın.
- [ ] `media` iç dosyalarına dış erişimleri `import-linter` ile kontrol edin.
- [ ] `CODEOWNERS` üzerinden `media` paketinin sahibinden inceleme isteyin.
- [ ] Mevcut bir `Media RUM Sample` kaydını eski girişten ve sahip paketten okuyup karşılaştırın.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?
Gerçek tarayıcılardan gelen medya performans örneklerini tutar. `tradehub_core/tradehub_core/doctype/media_rum_sample/media_rum_sample.json:2`
Kayıt alanlarını DocType şeması tanımlar. `tradehub_core/tradehub_core/doctype/media_rum_sample/media_rum_sample.json:2`

## Bugünkü bağımlılıklar
### Bu kaydın bağlandığı kayıtlar
- Bağlantı alanı bulunmadı. `tradehub_core/tradehub_core/doctype/media_rum_sample/media_rum_sample.json:2`
### Bu kayda dokunan kod
- `tradehub_core/api/rum.py:368`: okuyor
- `tradehub_core/api/rum.py:209`: yazıyor
- `tradehub_core/media/pipeline/image/report.py:1079`: okuyor
### hooks.py kayıtları
- Doğrudan ada göre kanca bulunmadı. Dolaylı kayıtlar doğrulanmadı. `tradehub_core/hooks.py:453`

## Bağımlılık sorunları
Önemli bir bağımlılık sorunu bulunmadı.

## Hedef tasarım
- `08-medya` bu kayda `tradehub_core/media/` paketinde sahip olsun.
- Dışarıya açılacak fonksiyonlar. `tradehub_core/media/api.py` içinde bu kayıt için ayrı fonksiyon önerilmiyor.
- Olaylar. Bu kayıt için ayrıca bağlamlar arası olay önerilmiyor.
- Bağlantılar. Bu kayıt için yeni bağlamlar arası bağlantı veya anlık görüntü alanı önerilmiyor.
- Doğrulama ve iş akışı. Ölçüm alımı ve saklama süresi medya servisine ait olsun. İstemci girdileri alınırken sınırlandırılsın.

## Geçiş adımları
1. Mevcut davranış için aşağıdaki testi ekle. Sahip paket için mevcut davranışı sabitle.
2. İlk adımdan sonra rapordaki doğrulamayı ve iş akışını sahip pakette topla.
3. İkinci adımdan sonra modül kaydını taşı. Eski Python girişlerini geçiş süresince yönlendir.

## Riskler ve testler
- Aşırı büyük gönderim rapor hesaplarını bozmaz.
