# SEO Helper Settings

- Bağlam: 10-seo
- Tür: Ayar (single)
- Klasör: `tradehub_core/seo_core/doctype/seo_helper_settings`
- Denetleyici: `tradehub_core/seo_core/doctype/seo_helper_settings/seo_helper_settings.py` (19 satır)
- Önerilen sahip bağlam: 10-seo

## Epic

- Epic adı: SEO Helper Settings: 10-seo bağlamına taşıma
- Öncelik: Önemli
- Faz: Faz 4
- Tahmini büyüklük: Orta

### User story

Bir geliştirici olarak, site adresini tek fonksiyondan almak istiyorum.
Böylece iki SEO paketi farklı adres kullanmaz.

### Kabul kriterleri

- [ ] `get_public_site_url()` fonksiyonu `seo/api.py` içinde var.
- [ ] `seo/site_url.py` ve `seo/page_resolver.py` bu fonksiyonu kullanıyor.
- [ ] Site adresi ve tarama adresi doğrulaması geçiyor.
- [ ] Characterization test: `SEO Helper Settings` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- Son çalışma zamanı gibi durum alanlarını bu ayara yeni eklemeyin. Durum ayrı kayıtta tutulmalı.
- Ayarı SEO dışındaki koddan okumayın. `seo/api.py` kullanılmalı.
- Gizli anahtar alanlarını düz metin alana çevirmeyin.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] Değişen davranış için önce başarısız olan bir test yazıldı.
- [ ] Ruff ve uygulama testleri yerelde geçiyor.
- [ ] `import-linter` kontrolü `tradehub_core.seo` için geçiyor.
- [ ] `CODEOWNERS` içindeki SEO bağlamı sahibinden inceleme istendi.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?

Bu ayar SEO yardımcısının tüm ayarlarını tutar. Ayar site adresini, tarama ayarlarını ve Search Console bağlantısını içerir. 50 alanı vardır.

## Bugünkü bağımlılıklar

### Bu kaydın bağlandığı kayıtlar

- Bu kaydın başka kayda bağlantısı yok.

### Bu kayda dokunan kod

- `tradehub_core/seo_helper/connectors/search_console.py:398`: yazıyor
- `tradehub_core/seo_helper/crawler/botlog.py:256`: yazıyor
- `tradehub_core/seo/page_resolver.py:253`: okuyor
- `tradehub_core/seo/site_url.py:46`: okuyor
- `tradehub_core/seo_helper/api/panel.py:109`: okuyor
- `tradehub_core/seo_helper/api/panel.py:197`: okuyor
- `tradehub_core/seo_helper/api/panel662.py:520`: okuyor
- `tradehub_core/seo_helper/api/panel662.py:544`: okuyor
- `tradehub_core/seo_helper/audit/reporter.py:307`: okuyor
- `tradehub_core/seo_helper/board.py:19`: okuyor
- `tradehub_core/seo_helper/connectors/search_console.py:255`: okuyor
- `tradehub_core/seo_helper/connectors/search_console.py:274`: okuyor
- Toplam 15 kaynak dosya bu adı kullanıyor. Yukarıda en önemlileri var.

### hooks.py kayıtları

- `hooks.py` içinde bu DocType için kayıt yok.

## Bağımlılık sorunları

1. İki SEO paketi aynı ayarı okuyor. Kanıt: `seo/site_url.py` ve `seo/page_resolver.py` eski pakette. Diğer okuyucular `seo_helper/` içinde.
2. Görevler ayarı `set_value` ile güncelliyor. Kanıt: `seo_helper/connectors/search_console.py:398` ve `seo_helper/crawler/botlog.py:256`. Durum alanları ayar kaydını kirletiyor.

## Hedef tasarım

- Sahip bağlam ve paket yolu: `tradehub_core/seo/` paketi. Bugünkü `seo_helper/` kodu bu paketin içine taşınır. Mevcut `SEO Core`, `SEO Crawler`, `SEO Catalog`, `SEO Merchant` ve `SEO MCP` modülleri 10 bağlamının alt modülleri olarak kalır.
- Dışarıya açılan fonksiyonlar: `seo/api.py` içinde `get_public_site_url()` ve `get_settings()`.
- Yayınladığı olaylar: Yok.
- Dinlediği olaylar: Yok.
- Başka bağlamlara bağlantılar: Başka bağlama bağlantı yok.
- Denetleyicide kalacak doğrulamalar: Site adresi ve tarama adresi doğrulaması kalır.
- Servise taşınacak iş kuralları: İş kuralları zaten servis kodunda. Yalnız paket yolu değişir.

## Geçiş adımları

1. `get_public_site_url()` fonksiyonunu açın. Eski paket bu fonksiyonu kullansın.
2. Son çalışma zamanlarını ayrı bir durum kaydına almayı değerlendirin.

## Riskler ve testler

- Taşıma sırasında içe aktarma yolu kırılabilir. Test: ilgili servis testi yeni yoldan geçmeli.
