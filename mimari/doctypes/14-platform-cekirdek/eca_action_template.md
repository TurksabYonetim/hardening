# ECA Action Template

- Bağlam: 14-platform-cekirdek
- Tür: Ayar (çok kayıtlı katalog)
- Klasör: `tradehub_core/tradehub_core/doctype/eca_action_template`
- Denetleyici: `tradehub_core/tradehub_core/doctype/eca_action_template/eca_action_template.py` (30 satır)
- Önerilen sahip bağlam: 14-platform-cekirdek

## Epic

- Epic adı: ECA Action Template: 14-platform-cekirdek bağlamına taşıma
- Öncelik: Düşük
- Faz: Faz 4
- Tahmini büyüklük: Küçük

### User story

Bir geliştirici olarak, kural eylem kalıbını değiştirdiğimde önbelleğin temizlenmesini istiyorum.
Böylece eski e-posta alıcılarına yazılmaz.

### Kabul kriterleri

- [ ] `hooks.py` içinde kalıp için önbellek temizleme kaydı var.
- [ ] `register_action_templates` fonksiyonu var.
- [ ] Kalıp değişince önbellek testi geçiyor.
- [ ] Characterization test: `ECA Action Template` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- Satıcıya `custom_script` ve `create_document` eylemlerini açmayın.
- Kalıbı yalnız patch dışında bir yerden toplu yazmayın.
- Saatlik çalışma sınırını kaldırmayın.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] Değişen davranış için önce başarısız olan test yazıldı.
- [ ] Ruff ve ilgili testler yerelde geçiyor.
- [ ] `import-linter` kontrolü yeni ihlal üretmiyor.
- [ ] `CODEOWNERS` içindeki 14-platform-cekirdek sahibi inceleyici olarak eklendi.
- [ ] `test_eca_action_template.py` geçiyor.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?
Bu kayıt bir kural eyleminin kalıbıdır. Eylem türleri alan güncelleme, e-posta, webhook, kayıt oluşturma, satır reddi ve özel betiktir. Kalıp bir saatlik çalışma sınırı da tutar.

## Bugünkü bağımlılıklar
### Bu kaydın bağlandığı kayıtlar
- `DocType` (`create_doctype`): Frappe çekirdeği
### Bu kayda dokunan kod
- `tradehub_core/tradehub_core/doctype/eca_action_template/eca_action_template.py:16`: satıcı için yasak eylemleri engelliyor
- `tradehub_core/eca/dispatcher.py:251`, `:291`, `:372`, `:471`: önbellekten okuyor
- `tradehub_core/eca/dispatcher.py:838`: okuyor
- `tradehub_core/eca/api.py:1265`, `:1268`, `:1435`: oluşturuyor ve güncelliyor
### hooks.py kayıtları
- Kayıt yok. Önbellek kuraldan temizleniyor. Kalıp değişince önbellek temizlenmiyor olabilir (doğrulanmadı).

## Bağımlılık sorunları
1. Kalıp değişince kural önbelleği temizlenmeyebilir. Kanıt: `hooks.py:898` yalnız `ECA Rule` için var. `dispatcher.py:251` kalıbı `get_cached_doc` ile okuyor. Frappe kendi belge önbelleğini kayıtta temizler. Kural önbelleği ayrıdır.
2. Toplu yükleme kurulumu kalıp oluşturuyor. Kanıt: `patches/v15_bulk_import_init/04_seed_eca_action_templates.py`. İçe aktarma ekibi çekirdek tablosuna yazıyor. Bu kurulum verisi için kabul edilebilir.

## Hedef tasarım
- Sahip bağlam: 14-platform-cekirdek. `ECA Rule` ile aynı paket.
- Dışa açık fonksiyon: `register_action_templates(specs)`. Diğer bağlamlar kurulumda bunu çağırır.
- Olay yoktur.
- Denetleyicide satıcı eylem sınırı kalır.

## Geçiş adımları
1. `hooks.py` içine kalıp için önbellek temizleme kaydı ekleyin.
2. `register_action_templates` fonksiyonunu ekleyin. Yeni kurulum patch'leri bunu kullansın.

## Riskler ve testler
- Bayat kalıp eski e-posta alıcılarına yazar. Kalıp değişince önbellek testi ekleyin.
- `test_eca_action_template.py` korunmalı.
