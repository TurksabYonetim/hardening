# SEO Redirect

- Bağlam: 10-seo
- Tür: Ana kayıt
- Klasör: `tradehub_core/tradehub_core/doctype/seo_redirect`
- Denetleyici: `tradehub_core/tradehub_core/doctype/seo_redirect/seo_redirect.py` (53 satır)
- Önerilen sahip bağlam: 10-seo

## Epic

- Epic adı: SEO Redirect: 10-seo bağlamına taşıma
- Öncelik: Acil
- Faz: Faz 4
- Tahmini büyüklük: Orta

### User story

Bir alıcı olarak, eski ürün adresine tıklayınca yeni adrese gitmek istiyorum.
Böylece eski bağlantılar 404 vermez.

### Kabul kriterleri

- [ ] `hooks.py:590`, `hooks.py:651` ve `hooks.py:665` kancaları kaldırıldı. Yönlendirme `*.slug_changed` olayıyla yazılıyor.
- [ ] Slug değişimi sonrası eski adres 301 dönüyor.
- [ ] A'dan B'ye ve B'den A'ya döngü kaydı reddediliyor.
- [ ] `SEO Redirect Rule` ile tek tablo kararı yazıldı.
- [ ] Characterization test: `SEO Redirect` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- Katalog kancasına yeni yönlendirme kodu eklemeyin. Olaya abone olun.
- `source_path` alanına CR ya da LF karakteri bırakmayın. Başlık enjeksiyonu açılır.
- Yeni yönlendirmeyi `SEO Redirect Rule` tablosuna yazmayın. Asıl tablo `SEO Redirect` tablosudur.
- Önbellek temizleme kancasını kaldırmayın. Eski yönlendirme çalışmaya devam eder.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] Değişen davranış için önce başarısız olan bir test yazıldı.
- [ ] Ruff ve uygulama testleri yerelde geçiyor.
- [ ] `import-linter` kontrolü `tradehub_core.seo` için geçiyor.
- [ ] `CODEOWNERS` içindeki SEO bağlamı sahibinden inceleme istendi.
- [ ] Yeni olay için sözleşme testi eklendi. Test olay alanlarını kontrol ediyor.
- [ ] Abone aynı olayı iki kez alınca ikinci işlem hiçbir şey değiştirmiyor.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?

Bu kayıt bir adres yönlendirmesidir. Eski adres yeni adrese 301 ile gider. Kayıt tam eşleşme, önek ve düzenli ifade türlerini destekler. Slug değişince sistem bu kaydı kendisi oluşturur.

## Bugünkü bağımlılıklar

### Bu kaydın bağlandığı kayıtlar

- `DocType` (`ref_doctype`, Link): başka bağlam (Frappe çekirdeği)
- `ref_name` (dinamik bağlantı, hedefi `ref_doctype` alanı seçer): hedef bağlam sabit değil

### Bu kayda dokunan kod

- `tradehub_core/api/seo_admin.py:358`: yazıyor
- `tradehub_core/seo/url_lifecycle.py:85`: yazıyor
- `tradehub_core/seo/url_lifecycle.py:95`: yazıyor
- `tradehub_core/seo_helper/adapters/tradehub/redirects.py:24`: yazıyor
- `tradehub_core/seo_helper/adapters/tradehub/redirects.py:41`: yazıyor
- `tradehub_core/api/seo_admin.py:345`: okuyor
- `tradehub_core/api/seo_admin.py:347`: okuyor
- `tradehub_core/seo/redirect_resolver.py:153`: okuyor
- `tradehub_core/seo/redirect_resolver.py:160`: okuyor
- `tradehub_core/seo/url_lifecycle.py:87`: okuyor
- `tradehub_core/seo_helper/adapters/tradehub/redirects.py:20`: okuyor
- `tradehub_core/seo_helper/adapters/tradehub/redirects.py:22`: okuyor
- Toplam 5 kaynak dosya bu adı kullanıyor. Yukarıda en önemlileri var.

### hooks.py kayıtları

- `tradehub_core/hooks.py:678`: doc_events kaydı. `on_update` -> `tradehub_core.seo.redirect_cache.invalidate_redirect_cache`, `on_trash` -> `tradehub_core.seo.redirect_cache.invalidate_redirect_cache`
- `tradehub_core/hooks.py:590`, `:651` ve `:665`: `Listing`, `Product Category` ve `Brand` `on_update` kaydı `seo.url_lifecycle.on_slug_change` fonksiyonunu çağırıyor.

## Bağımlılık sorunları

1. İki yönlendirme tablosu var. `SEO Redirect Rule` aynı alanları taşıyor ve `mirrored_redirect` ile bu kayda bağlı. Kanıt: `seo_redirect_rule.json`. Hangisinin asıl olduğu belirsiz.
2. Katalog kancaları slug değişiminde bu tabloyu yazıyor. Kanıt: `hooks.py:590`, `hooks.py:651` ve `hooks.py:665` satırlarında `url_lifecycle.on_slug_change` var. SEO kodu hata verirse ilan kaydı düşer.
3. Denetleyici `super().validate()` çağrısını koşullu yapıyor. Kanıt: `seo_redirect.py` içindeki `hasattr` satırı. Zararsız ama gereksiz.

## Hedef tasarım

- Sahip bağlam ve paket yolu: `tradehub_core/seo/` paketi. Bugünkü `seo_helper/` kodu bu paketin içine taşınır. Mevcut `SEO Core`, `SEO Crawler`, `SEO Catalog`, `SEO Merchant` ve `SEO MCP` modülleri 10 bağlamının alt modülleri olarak kalır. DocType `Tradehub Core` modülünden `SEO Core` modülüne taşınır.
- Dışarıya açılan fonksiyonlar: `seo/api.py` içinde `create_redirect(source, target, code)` ve `resolve(path)`.
- Yayınladığı olaylar: `seo.redirect_created`. Olay şu alanları taşır: `source_path`, `target_path`, `status_code`.
- Dinlediği olaylar: 03a bağlamının `listing.slug_changed`, `category.slug_changed` ve `brand.slug_changed` olayları. Olay şu alanları taşır: `ref_doctype`, `ref_name`, `old_path`, `new_path`.
- Başka bağlamlara bağlantılar: `ref_doctype` ve `ref_name` dinamik bağ olarak kalır.
- Denetleyicide kalacak doğrulamalar: Adres biçimi, döngü ve düzenli ifade kontrolleri kalır.
- Servise taşınacak iş kuralları: Slug değişim mantığı `seo/url_lifecycle.py` içinde olay işleyicisi olur.

## Geçiş adımları

1. 03a bağlamı `*.slug_changed` olaylarını yayınlasın. Bu adım önce gelir.
2. `on_slug_change` fonksiyonunu olay abonesi yapın.
3. `hooks.py:590`, `:651` ve `:665` kancalarını kaldırın.
4. `SEO Redirect Rule` ile birleştirme kararını verin.

## Riskler ve testler

- Eski adres 404 verebilir. Test: slug değişimi olayı sonrası eski adres 301 dönmeli.
- Yönlendirme zinciri döngüye girebilir. Test: A'dan B'ye ve B'den A'ya kayıt reddedilmeli.
