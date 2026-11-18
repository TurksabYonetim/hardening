# Media SEO Override

- Bağlam: 08-medya
- Tür: Ana kayıt
- Klasör: `tradehub_core/tradehub_core/doctype/media_seo_override`
- Denetleyici: `tradehub_core/tradehub_core/doctype/media_seo_override/media_seo_override.py` (41 satır)
- Önerilen sahip bağlam: 08-medya

## Epic

- Epic adı: Media SEO Override: 08-medya bağlamına taşıma
- Öncelik: Önemli
- Faz: Faz 4
- Tahmini büyüklük: Orta

### User story

Bir geliştirici olarak, görsel arama metnini kapsamına göre ayarlamak istiyorum.
Böylece düzenlemem başka mağazayı etkilemez.

### Kabul kriterleri

- [ ] Kapsamlı düzenleme ilgisiz mağazanın görsel metnini değiştirmez.
- [ ] Sözleşme testi `media/api.py::get_image_seo` çağrısının mevcut davranışı koruduğunu gösterir.
- [ ] Geçiş testi, mevcut `Media SEO Override` kaydının sahip paket üzerinden okunabildiğini gösterir.
- [ ] Characterization test: `Media SEO Override` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- Katalog başlığını iç tablodan çekmeyin. Okuma modeli alanları tanımlar.
- Kapsamsız metin güncellemesi yapmayın. Bir adresi birden fazla kayıt kullanabilir.
- Dış bağlamdan `media` iç dosyalarını çağırmayın. Geçişte `get_image_seo` sözleşmesini kullanın.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] `Media SEO Override` için kabul koşullarını otomatik testte doğrulayın.
- [ ] `media` iç dosyalarına dış erişimleri `import-linter` ile kontrol edin.
- [ ] `CODEOWNERS` üzerinden `media` paketinin sahibinden inceleme isteyin.
- [ ] `tradehub_core/media/seo.py:488` bağımlılığının geçiş sonrası çağrı yolunu inceleyin.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?
Görselin arama motoru alanları için elle verilen değerleri tutar. `tradehub_core/tradehub_core/doctype/media_seo_override/media_seo_override.json:140`
Denetleyici, kayıt yazılmadan önce kayıt kurallarını uygular. `tradehub_core/tradehub_core/doctype/media_seo_override/media_seo_override.py:20`

## Bugünkü bağımlılıklar
### Bu kaydın bağlandığı kayıtlar
- Bağlantı alanı bulunmadı. `tradehub_core/tradehub_core/doctype/media_seo_override/media_seo_override.json:140`
### Bu kayda dokunan kod
- `tradehub_core/media/seo.py:756`: siliyor
### hooks.py kayıtları
- Doğrudan ada göre kanca bulunmadı. Dolaylı kayıtlar doğrulanmadı. `tradehub_core/hooks.py:453`

## Bağımlılık sorunları
1. Görsel metni katalog başlığını ve adres anahtarını doğrudan okuyor. Katalog alanları değişirse medya metni etkilenebilir. `tradehub_core/media/seo.py:488`

## Hedef tasarım
- `08-medya` bu kayda `tradehub_core/media/` paketinde sahip olsun.
- Dışarıya açılacak fonksiyonlar. `tradehub_core/media/api.py::get_image_seo`
- Olaylar. Bu kayıt için ayrıca bağlamlar arası olay önerilmiyor.
- Bağlantılar. Bu kayıt için yeni bağlamlar arası bağlantı veya anlık görüntü alanı önerilmiyor.
- Doğrulama ve iş akışı. Yayın görünümünü medya okuma servisinden sun. Elle verilen değerlerle varsayılanları medya servisi birleştirsin.

## Geçiş adımları
1. Mevcut davranış için aşağıdaki testi ekle. `get_image_seo` sözleşmesini mevcut uygulama üzerinden geçir.
2. İlk adımdan sonra katalog başlığı için belgelenmiş okuma modeli kullan.
3. İkinci adımdan sonra modül kaydını taşı. Eski Python girişlerini geçiş süresince yönlendir.

## Riskler ve testler
- Kapsamlı düzenleme ilgisiz mağazanın görsel metnini değiştirmez.
