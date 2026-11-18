# Field Help Version

- Bağlam: 09-icerik-vitrin
- Tür: Kayıt defteri (log)
- Klasör: `tradehub_core/seo_helper/doctype/field_help_version`
- Denetleyici: `tradehub_core/seo_helper/doctype/field_help_version/field_help_version.py` (5 satır)
- Önerilen sahip bağlam: 09-icerik-vitrin

## Epic

- Epic adı: Field Help Version: 09-icerik-vitrin bağlamına taşıma
- Öncelik: Düşük
- Faz: Faz 5
- Tahmini büyüklük: Küçük

### User story

Bir geliştirici olarak, yardım metni sürümlerinin ebeveyniyle aynı modülde durmasını istiyorum.
Böylece geri alma akışı tek yerde kalır.

### Kabul kriterleri

- [ ] `Field Help Version` ve `Field Help Content` aynı modülde duruyor.
- [ ] Her yardım metni kaydı bir sürüm satırı üretiyor.
- [ ] Geri alma işlemi seçilen sürümü geri yüklüyor.
- [ ] Characterization test: `Field Help Version` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- Sürüm satırını elle düzenlemeyin. Defter değişmez olmalı.
- Sürüm yazımını API dışında bir yere kopyalamayın. Yazım tek fonksiyonda kalmalı: `_write_version`.
- Ebeveyn taşımasından ayrı bir PR ile taşımayın. Link bağı kopar.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] Değişen davranış için önce başarısız olan bir test yazıldı.
- [ ] Ruff ve uygulama testleri yerelde geçiyor.
- [ ] `import-linter` kontrolü `tradehub_core.content` için geçiyor.
- [ ] `CODEOWNERS` içindeki içerik bağlamı sahibinden inceleme istendi.
- [ ] DocType modülü taşınırsa patch iki kez çalışınca hata vermiyor.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?

Bu kayıt alan yardım metninin sürüm defteridir. Her değişiklik bir anlık görüntü satırı üretir. Geri alma bu satırları kullanır.

## Bugünkü bağımlılıklar

### Bu kaydın bağlandığı kayıtlar

- `Field Help Content` (`content`, Link): aynı bağlam
- `User` (`created_by`, Link): başka bağlam (Frappe çekirdeği)

### Bu kayda dokunan kod

- `tradehub_core/seo_helper/api/field_help.py:455`: okuyor
- `tradehub_core/seo_helper/api/field_help.py:264`: adını kullanıyor
- `tradehub_core/seo_helper/api/field_help.py:436`: adını kullanıyor
- 3 patch ya da tohum dosyası bu adı kullanıyor. Örnek: `tradehub_core/patches/v15_9_96_field_help_seed.py`.

### hooks.py kayıtları

- `hooks.py` içinde bu DocType için kayıt yok.

## Bağımlılık sorunları

Önemli bir bağımlılık sorunu bulunmadı.

## Hedef tasarım

- Sahip bağlam ve paket yolu: `tradehub_core/content/field_help/` paketi.
- Dışarıya açılan fonksiyonlar: `content/api.py` içinde `list_field_help_versions(help_key)`.
- Yayınladığı olaylar: Yok.
- Dinlediği olaylar: Yok.
- Başka bağlamlara bağlantılar: `content` Link alanı aynı bağlamda kalır. `created_by` Frappe `User` kaydına bağlıdır.
- Denetleyicide kalacak doğrulamalar: Doğrulama gerekmiyor.
- Servise taşınacak iş kuralları: Taşınacak iş kuralı yok.

## Geçiş adımları

1. Ebeveyn ile aynı PR içinde taşıyın.

## Riskler ve testler

- Sürüm yazılmadan değişiklik kaydedilebilir. Test: her kayıt bir sürüm satırı üretmeli.
