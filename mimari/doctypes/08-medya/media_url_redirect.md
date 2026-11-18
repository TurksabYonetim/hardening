# Media URL Redirect

- Bağlam: 08-medya
- Tür: Ana kayıt
- Klasör: `tradehub_core/tradehub_core/doctype/media_url_redirect`
- Denetleyici: `tradehub_core/tradehub_core/doctype/media_url_redirect/media_url_redirect.py` (46 satır)
- Önerilen sahip bağlam: 08-medya

## Epic

- Epic adı: Media URL Redirect: 08-medya bağlamına taşıma
- Öncelik: Önemli
- Faz: Faz 4
- Tahmini büyüklük: Orta

### User story

Bir geliştirici olarak, eski medya adreslerini tek yerden çözmek istiyorum.
Böylece eski bağlantılar geçerli hedefe ulaşır.

### Kabul kriterleri

- [ ] Süresi bitmiş kayıt yönlendirme üretmez.
- [ ] Sözleşme testi `media/api.py::resolve_media_redirect` çağrısının mevcut davranışı koruduğunu gösterir.
- [ ] SEO çözümleyicisi hedef adresi `resolve_media_redirect` üzerinden alır.
- [ ] Characterization test: `Media URL Redirect` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- SEO paketinden yönlendirme tablosunu sorgulamayın. Bu alanları medya yönetir.
- Doğrulanmamış hedef döndürmeyin. Hedef adres kurallarına uymalıdır.
- Dış bağlamdan `media` iç dosyalarını çağırmayın. Geçişte `resolve_media_redirect` sözleşmesini kullanın.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] `Media URL Redirect` için kabul koşullarını otomatik testte doğrulayın.
- [ ] `media` iç dosyalarına dış erişimleri `import-linter` ile kontrol edin.
- [ ] `CODEOWNERS` üzerinden `media` paketinin sahibinden inceleme isteyin.
- [ ] `tradehub_core/seo/page_resolver.py:643` bağımlılığının geçiş sonrası çağrı yolunu inceleyin.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?
Eski medya adresini güncel adrese bağlar. `tradehub_core/tradehub_core/doctype/media_url_redirect/media_url_redirect.json:27`
Denetleyici, kayıt yazılmadan önce kayıt kurallarını uygular. `tradehub_core/tradehub_core/doctype/media_url_redirect/media_url_redirect.py:22`

## Bugünkü bağımlılıklar
### Bu kaydın bağlandığı kayıtlar
- Bağlantı alanı bulunmadı. `tradehub_core/tradehub_core/doctype/media_url_redirect/media_url_redirect.json:27`
### Bu kayda dokunan kod
- `tradehub_core/api/media_preview.py:100`: okuyor
- `tradehub_core/api/media_admin.py:1335`: okuyor
- `tradehub_core/media/kare.py:366`: yazıyor
- `tradehub_core/media/seo_url.py:391`: okuyor
- `tradehub_core/media/redirect_renderer.py:27`: okuyor
### hooks.py kayıtları
- `tradehub_core/hooks.py:280` İlgili kayıt dışı tetikleyici. `"tradehub_core.media.retro_rename.purge_expired_redirects",`
- `tradehub_core/hooks.py:450` İlgili kayıt dışı tetikleyici. `"tradehub_core.media.redirect_renderer.MediaRedirectRenderer",`

## Bağımlılık sorunları
1. SEO çözümleyicisi medya yönlendirme tablosunu doğrudan okuyor. Adres alanı değişirse SEO çözümlemesi bozulabilir. `tradehub_core/seo/page_resolver.py:643`

## Hedef tasarım
- `08-medya` bu kayda `tradehub_core/media/` paketinde sahip olsun.
- Dışarıya açılacak fonksiyonlar. `tradehub_core/media/api.py::resolve_media_redirect`
- Olaylar. Bu kayıt için ayrıca bağlamlar arası olay önerilmiyor.
- Bağlantılar. Bu kayıt için yeni bağlamlar arası bağlantı veya anlık görüntü alanı önerilmiyor.
- Doğrulama ve iş akışı. Yönlendirme hedefini denetleyicide doğrula. Süre dolumu ve adres çözümü medya servisinde yürüsün.

## Geçiş adımları
1. Mevcut davranış için aşağıdaki testi ekle. `resolve_media_redirect` sözleşmesini mevcut uygulama üzerinden geçir.
2. İlk adımdan sonra SEO çözümleyicisini `resolve_media_redirect` işlevine geçir.
3. İkinci adımdan sonra modül kaydını taşı. Eski Python girişlerini geçiş süresince yönlendir.

## Riskler ve testler
- Süresi bitmiş kayıt yönlendirme üretmez.
