# Field Help Content

- Bağlam: 09-icerik-vitrin
- Tür: Ana kayıt
- Klasör: `tradehub_core/seo_helper/doctype/field_help_content`
- Denetleyici: `tradehub_core/seo_helper/doctype/field_help_content/field_help_content.py` (145 satır)
- Önerilen sahip bağlam: 09-icerik-vitrin

## Epic

- Epic adı: Field Help Content: 09-icerik-vitrin bağlamına taşıma
- Öncelik: Düşük
- Faz: Faz 4
- Tahmini büyüklük: Orta

### User story

Bir platform yöneticisi olarak, form alanlarına güvenli yardım metni yazmak istiyorum.
Böylece satıcılar alanı doğru doldurur.

### Kabul kriterleri

- [ ] `REGISTRY` sözlüğü `field_help/registry.py` dosyasında duruyor.
- [ ] Denetleyici artık `seo_helper/api/field_help.py` dosyasını içe aktarmıyor.
- [ ] Kayıtlı olmayan ekran ve alan anahtarı reddediliyor.
- [ ] Güvenli olmayan bağlantı reddediliyor.
- [ ] Characterization test: `Field Help Content` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- `screen_key` ve `field_key` alanlarını kayıttan sonra değiştirmeyin. Denetleyici bunu bilerek kilitler.
- Yardım metnine HTML eklemeyin. Alanlar düz metin olmalı.
- Yeni yardım kodunu `seo_helper/` altına eklemeyin. Bu iş içerik bağlamına aittir.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] Değişen davranış için önce başarısız olan bir test yazıldı.
- [ ] Ruff ve uygulama testleri yerelde geçiyor.
- [ ] `import-linter` kontrolü `tradehub_core.content` için geçiyor.
- [ ] `CODEOWNERS` içindeki içerik bağlamı sahibinden inceleme istendi.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?

Bu kayıt panel formlarındaki alan yardım metinlerini tutar. Her kayıt bir ekran ve bir alan anahtarıdır. Metin TR ve EN dillerinde yazılır. Hedef kitle seçimi zorunludur.

## Bugünkü bağımlılıklar

### Bu kaydın bağlandığı kayıtlar

- Bu kaydın başka kayda bağlantısı yok.

### Bu kayda dokunan kod

- `tradehub_core/seo_helper/api/field_help.py:395`: yazıyor
- `tradehub_core/seo_helper/api/field_help.py:287`: okuyor
- `tradehub_core/seo_helper/api/field_help.py:363`: okuyor
- `tradehub_core/seo_helper/api/field_help.py:319`: adını kullanıyor
- `tradehub_core/seo_helper/api/field_help.py:563`: adını kullanıyor
- `tradehub_core/seo_helper/doctype/field_help_version/field_help_version.json:11`: alt tablo ya da Link tanımı
- 4 patch ya da tohum dosyası bu adı kullanıyor. Örnek: `tradehub_core/patches/v15_11_09_field_help_global_metinler.py`.

### hooks.py kayıtları

- `hooks.py` içinde bu DocType için kayıt yok.

## Bağımlılık sorunları

1. Denetleyici API modülünü içe aktarıyor. Kanıt: `field_help_content.py:40` satırı `seo_helper/api/field_help.py` içinden `REGISTRY` alıyor.
2. Kayıt SEO paketinin içinde duruyor ama SEO ile ilgisi yok. Kanıt: klasör `seo_helper/doctype/field_help_content`.

## Hedef tasarım

- Sahip bağlam ve paket yolu: `tradehub_core/content/field_help/` paketi.
- Dışarıya açılan fonksiyonlar: `content/api.py` içinde `get_field_help(screen_key, field_key, lang)`.
- Yayınladığı olaylar: Yok.
- Dinlediği olaylar: Yok.
- Başka bağlamlara bağlantılar: Başka bağlama bağlantı yok. Ekran anahtarları diğer bağlamların ekran adlarıdır. Bu anahtarlar metin olarak kalır.
- Denetleyicide kalacak doğrulamalar: Anahtar kilidi, uzunluk, dil ve güvenli bağlantı kontrolleri kalır.
- Servise taşınacak iş kuralları: `REGISTRY` sözlüğü ayrı bir `field_help/registry.py` dosyasına taşınır.

## Geçiş adımları

1. `REGISTRY` sözlüğünü `registry.py` dosyasına alın. Denetleyici ve API oradan okusun.
2. `seo_helper/api/field_help.py` dosyasını `content/field_help/api.py` olarak taşıyın.
3. DocType'ı `Content` modülüne taşıyın.

## Riskler ve testler

- Kayıtlı olmayan alan için yardım girilebilir. Test: bilinmeyen anahtar reddedilmeli.
