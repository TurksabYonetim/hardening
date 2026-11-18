# CMS Help Section

- Bağlam: 09-icerik-vitrin
- Tür: Ana kayıt
- Klasör: `tradehub_core/seo_cms/doctype/cms_help_section`
- Denetleyici: `tradehub_core/seo_cms/doctype/cms_help_section/cms_help_section.py` (8 satır)
- Önerilen sahip bağlam: 09-icerik-vitrin

## Epic

- Epic adı: CMS Help Section: 09-icerik-vitrin bağlamına taşıma
- Öncelik: Düşük
- Faz: Faz 4
- Tahmini büyüklük: Küçük

### User story

Bir platform yöneticisi olarak, yardım bölümlerini ağaç biçiminde güvenle düzenlemek istiyorum.
Böylece yardım merkezinde kayıp bölüm olmaz.

### Kabul kriterleri

- [ ] Örnek sayfa kurulumu `content/setup.py` içinden çalışıyor.
- [ ] Bir bölüm kendi alt bölümüne bağlanınca kayıt reddediliyor.
- [ ] `list_help_sections()` fonksiyonu sıralı listeyi döndürüyor.
- [ ] Characterization test: `CMS Help Section` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- `section_key` değerini yayından sonra değiştirmeyin. Kayıt adı bu alandan gelir.
- Kurulum kodunu `seo_helper/setup/` altına yeni dosya olarak eklemeyin. İçerik kurulumu `content/` paketine aittir.
- Üst bölüm kontrolünü yalnız ön yüzde yapmayın. Denetleyici de reddetmeli.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] Değişen davranış için önce başarısız olan bir test yazıldı.
- [ ] Ruff ve uygulama testleri yerelde geçiyor.
- [ ] `import-linter` kontrolü `tradehub_core.content` için geçiyor.
- [ ] `CODEOWNERS` içindeki içerik bağlamı sahibinden inceleme istendi.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?

Bu kayıt yardım merkezindeki bölümleri tanımlar. Bölümler ağaç yapısındadır. Her bölüm bir üst bölüme bağlanabilir.

## Bugünkü bağımlılıklar

### Bu kaydın bağlandığı kayıtlar

- `CMS Help Section` (`parent_section`, Link): aynı bağlam

### Bu kayda dokunan kod

- `tradehub_core/seo_helper/setup/ornek_sayfalar.py:459`: okuyor
- `tradehub_core/seo_helper/setup/ornek_sayfalar.py:719`: okuyor
- `tradehub_core/seo_helper/setup/ornek_sayfalar.py:463`: adını kullanıyor
- `tradehub_core/seo_cms/doctype/cms_content/cms_content.json:244`: alt tablo ya da Link tanımı

### hooks.py kayıtları

- `hooks.py` içinde bu DocType için kayıt yok.

## Bağımlılık sorunları

1. Örnek sayfa kurulumu tabloyu doğrudan yazıyor. Kanıt: `seo_helper/setup/ornek_sayfalar.py:463`. Kurulum kodu SEO paketinde duruyor.

## Hedef tasarım

- Sahip bağlam ve paket yolu: `tradehub_core/content/cms/` paketi. Bugünkü `SEO CMS` modülü bu bağlama ait sayılır.
- Dışarıya açılan fonksiyonlar: `content/api.py` içinde `list_help_sections()`.
- Yayınladığı olaylar: Yok.
- Dinlediği olaylar: Yok.
- Başka bağlamlara bağlantılar: Yalnız kendi üst bölümüne bağlıdır.
- Denetleyicide kalacak doğrulamalar: Döngüsel üst bölüm kontrolü eklenebilir. Bugün yok.
- Servise taşınacak iş kuralları: Taşınacak iş kuralı yok.

## Geçiş adımları

1. Örnek sayfa kurulumunu `content/setup.py` içine taşıyın.
2. DocType'ı `Content` modülüne taşıyın.

## Riskler ve testler

- Bir bölüm kendi altına bağlanabilir. Test: döngü oluşturan kayıt reddedilmeli.
