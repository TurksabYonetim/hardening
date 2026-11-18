# CMS Person Profile

- Bağlam: 09-icerik-vitrin
- Tür: Ana kayıt
- Klasör: `tradehub_core/seo_cms/doctype/cms_person_profile`
- Denetleyici: `tradehub_core/seo_cms/doctype/cms_person_profile/cms_person_profile.py` (8 satır)
- Önerilen sahip bağlam: 09-icerik-vitrin

## Epic

- Epic adı: CMS Person Profile: 09-icerik-vitrin bağlamına taşıma
- Öncelik: Düşük
- Faz: Faz 4
- Tahmini büyüklük: Küçük

### User story

Bir geliştirici olarak, yazar bilgisini tek bir fonksiyondan almak istiyorum.
Böylece içerik şeması yazar kaydının içine bakmaz.

### Kabul kriterleri

- [ ] `get_author(person_key)` fonksiyonu `content/api.py` içinde var.
- [ ] `seo_helper/cms/render.py` yazarı bu fonksiyonla okuyor.
- [ ] Yazarı olmayan içerik şema hatası vermiyor.
- [ ] Characterization test: `CMS Person Profile` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- Denetim aracından canlı profil kaydı oluşturmayın. Test kayıtları önekle ayrılmalı ve temizlenmeli.
- `person_key` alanını yayından sonra değiştirmeyin. Kayıt adı bu alandan gelir.
- `user` bağını zorunlu yapmayın. Dış yazarların kullanıcı hesabı olmayabilir.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] Değişen davranış için önce başarısız olan bir test yazıldı.
- [ ] Ruff ve uygulama testleri yerelde geçiyor.
- [ ] `import-linter` kontrolü `tradehub_core.content` için geçiyor.
- [ ] `CODEOWNERS` içindeki içerik bağlamı sahibinden inceleme istendi.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?

Bu kayıt içerik yazarlarının profilini tutar. Profil ad, unvan, fotoğraf ve uzmanlık alanı içerir. Yazar şeması bu kayıttan üretilir.

## Bugünkü bağımlılıklar

### Bu kaydın bağlandığı kayıtlar

- `User` (`user`, Link): başka bağlam (Frappe çekirdeği)

### Bu kayda dokunan kod

- `tradehub_core/seo_helper/audit/schema_f44.py:1050`: okuyor
- `tradehub_core/seo_helper/audit/schema_f44.py:1062`: okuyor
- `tradehub_core/seo_helper/cms/render.py:779`: okuyor
- `tradehub_core/seo_helper/cms/render.py:780`: okuyor
- `tradehub_core/seo_helper/setup/ornek_sayfalar.py:436`: okuyor
- `tradehub_core/seo_helper/setup/ornek_sayfalar.py:718`: okuyor
- `tradehub_core/seo_helper/audit/schema_f44.py:1051`: adını kullanıyor
- `tradehub_core/seo_helper/audit/schema_f44.py:1075`: adını kullanıyor
- `tradehub_core/seo_helper/setup/ornek_sayfalar.py:440`: adını kullanıyor
- `tradehub_core/seo_cms/doctype/cms_content/cms_content.json:124`: alt tablo ya da Link tanımı

### hooks.py kayıtları

- `hooks.py` içinde bu DocType için kayıt yok.

## Bağımlılık sorunları

1. Denetim aracı profil kayıtlarını oluşturuyor ve siliyor. Kanıt: `seo_helper/audit/schema_f44.py:1051` ve `schema_f44.py:1075`.

## Hedef tasarım

- Sahip bağlam ve paket yolu: `tradehub_core/content/cms/` paketi. Bugünkü `SEO CMS` modülü bu bağlama ait sayılır.
- Dışarıya açılan fonksiyonlar: `content/api.py` içinde `get_author(person_key)`.
- Yayınladığı olaylar: Yok.
- Dinlediği olaylar: Yok.
- Başka bağlamlara bağlantılar: `user` Link alanı Frappe `User` kaydına bağlı kalır.
- Denetleyicide kalacak doğrulamalar: Ayrı doğrulama gerekmiyor.
- Servise taşınacak iş kuralları: Taşınacak iş kuralı yok.

## Geçiş adımları

1. Render kodu yazarı `get_author` ile okusun. Kanıt yeri: `seo_helper/cms/render.py:780`.
2. DocType'ı `Content` modülüne taşıyın.

## Riskler ve testler

- Yazar silinince içerik şeması bozulabilir. Test: yazarsız içerik şema hatası vermemeli.
