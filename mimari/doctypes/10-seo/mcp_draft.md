# MCP Draft

- Bağlam: 10-seo
- Tür: Ana kayıt
- Klasör: `tradehub_core/seo_mcp/doctype/mcp_draft`
- Denetleyici: `tradehub_core/seo_mcp/doctype/mcp_draft/mcp_draft.py` (8 satır)
- Önerilen sahip bağlam: 10-seo

## Epic

- Epic adı: MCP Draft: 10-seo bağlamına taşıma
- Öncelik: Önemli
- Faz: Faz 4
- Tahmini büyüklük: Orta

### User story

Bir platform yöneticisi olarak, yapay zekâ taslaklarının yalnız onaydan sonra sayfaya uygulanmasını istiyorum.
Böylece onaysız içerik yayına girmez.

### Kabul kriterleri

- [ ] `_apply_draft` Builder sayfasını `content/api.py` içindeki `apply_body_draft` ile yazıyor.
- [ ] `target_doctype` için izinli liste var. Liste dışı DocType reddediliyor.
- [ ] "draft" durumundaki taslak uygulanamıyor.
- [ ] Characterization test: `MCP Draft` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- `seo_helper/mcp/api.py` içinden `Builder Page` kaydına doğrudan `save` çağırmayın. Gövde içerik bağlamına aittir.
- Taslak onayında `for_update` kilidini kaldırmayın. İki onay aynı anda uygulanabilir.
- İzinli listeye bağlamı belirsiz DocType eklemeyin. Taslak başka bağlamın verisini değiştirebilir.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] Değişen davranış için önce başarısız olan bir test yazıldı.
- [ ] Ruff ve uygulama testleri yerelde geçiyor.
- [ ] `import-linter` kontrolü `tradehub_core.seo` için geçiyor.
- [ ] `CODEOWNERS` içindeki SEO bağlamı sahibinden inceleme istendi.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?

Bu kayıt yapay zekâ ajanının önerdiği taslak değişikliği tutar. Bir insan taslağı inceler ve onaylar. Onaylanan taslak bir Builder sayfasına uygulanır.

## Bugünkü bağımlılıklar

### Bu kaydın bağlandığı kayıtlar

- `MCP Client` (`client`, Link): aynı bağlam
- `Admin Seller Profile` (`store`, Link): başka bağlam (02-satici-magaza)
- `DocType` (`target_doctype`, Link): başka bağlam (Frappe çekirdeği)
- `User` (`reviewed_by`, Link): başka bağlam (Frappe çekirdeği)
- `MCP Tool Call` (`tool_call`, Link): aynı bağlam

### Bu kayda dokunan kod

- `tradehub_core/seo_helper/api/panel.py:254`: okuyor
- `tradehub_core/seo_helper/api/panel.py:263`: okuyor
- `tradehub_core/seo_helper/core/monitoring.py:28`: okuyor
- `tradehub_core/seo_helper/mcp/api.py:495`: okuyor
- `tradehub_core/seo_helper/mcp/api.py:496`: okuyor
- `tradehub_core/seo_helper/api/panel.py:224`: adını kullanıyor
- `tradehub_core/seo_helper/mcp/api.py:471`: adını kullanıyor
- `tradehub_core/seo_helper/mcp/api.py:96`: adını kullanıyor
- `tradehub_core/seo_mcp/doctype/mcp_tool_call/mcp_tool_call.json:97`: alt tablo ya da Link tanımı

### hooks.py kayıtları

- `tradehub_core/hooks.py:1430`: mağaza kapsamlı izin döngüsü. `hooks.py:1437` `store_query_conditions` ve `hooks.py:1438` `store_has_permission` kaydını bağlar.

## Bağımlılık sorunları

1. Taslak uygulama kodu Builder sayfasını doğrudan yazıyor. Kanıt: `seo_helper/mcp/api.py:557` ve `seo_helper/mcp/api.py:570` Builder sayfasını açıyor. Builder sayfası içerik gövdesidir ve 09 bağlamının alanıdır.
2. `target_doctype` alanı her DocType'a açık bir Link. Kanıt: `mcp_draft.json`. Bugün yalnız Builder Page işleniyor.

## Hedef tasarım

- Sahip bağlam ve paket yolu: `tradehub_core/seo/` paketi. Bugünkü `seo_helper/` kodu bu paketin içine taşınır. Mevcut `SEO Core`, `SEO Crawler`, `SEO Catalog`, `SEO Merchant` ve `SEO MCP` modülleri 10 bağlamının alt modülleri olarak kalır.
- Dışarıya açılan fonksiyonlar: `seo/api.py` içinde ayrı fonksiyon gerekmez.
- Yayınladığı olaylar: Yok.
- Dinlediği olaylar: Yok.
- Başka bağlamlara bağlantılar: `store` Link alanı kalır. Hedef içerik yazımı 09 bağlamının `content/api.py` fonksiyonuyla yapılır.
- Denetleyicide kalacak doğrulamalar: Ayrı doğrulama gerekmiyor.
- Servise taşınacak iş kuralları: İş kuralları zaten servis kodunda. Yalnız paket yolu değişir.

## Geçiş adımları

1. `content/api.py` içinde `apply_body_draft(builder_page, payload)` fonksiyonunu açın.
2. `_apply_draft` bu fonksiyonu çağırsın.
3. `target_doctype` için izinli liste ekleyin.

## Riskler ve testler

- Onaysız taslak yayına girebilir. Test: "draft" durumundaki taslak uygulanamamalı.
