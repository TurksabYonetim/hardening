# MCP Client

- Bağlam: 10-seo
- Tür: Ana kayıt
- Klasör: `tradehub_core/seo_mcp/doctype/mcp_client`
- Denetleyici: `tradehub_core/seo_mcp/doctype/mcp_client/mcp_client.py` (8 satır)
- Önerilen sahip bağlam: 10-seo

## Epic

- Epic adı: MCP Client: 10-seo bağlamına taşıma
- Öncelik: Önemli
- Faz: Faz 4
- Tahmini büyüklük: Küçük

### User story

Bir platform yöneticisi olarak, silinen mağazanın yapay zekâ istemcisinin çalışmamasını istiyorum.
Böylece eski mağaza adına işlem yapılamaz.

### Kabul kriterleri

- [ ] `seller.deleted` olayı gelince istemci devre dışı kalıyor.
- [ ] MCP kodu `tradehub_core/seo/mcp/` altında duruyor.
- [ ] Kimlik kancası yalnız MCP yolunda kimlik doğruluyor. Diğer isteklerde hiçbir şey yapmıyor.
- [ ] Characterization test: `MCP Client` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- `auth_hooks` içine MCP dışı yollarda çalışan kod eklemeyin. Her istek yavaşlar ya da bozulur.
- İstemciyi `store` alanı olmadan oluşturmayın. Mağaza kapsamlı izin çalışmaz.
- `last_used_at` dışında bir alanı `set_value` ile yazmayın. Denetleyici atlanır.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] Değişen davranış için önce başarısız olan bir test yazıldı.
- [ ] Ruff ve uygulama testleri yerelde geçiyor.
- [ ] `import-linter` kontrolü `tradehub_core.seo` için geçiyor.
- [ ] `CODEOWNERS` içindeki SEO bağlamı sahibinden inceleme istendi.
- [ ] Abone aynı olayı iki kez alınca ikinci işlem hiçbir şey değiştirmiyor.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?

Bu kayıt SEO yapay zekâ araçlarına bağlanan istemciyi tanımlar. MCP, yapay zekâ ajanlarının araç çağırma protokolüdür. Kayıt istemcinin mağazasını ve son kullanım zamanını tutar.

## Bugünkü bağımlılıklar

### Bu kaydın bağlandığı kayıtlar

- `Admin Seller Profile` (`store`, Link): başka bağlam (02-satici-magaza)

### Bu kayda dokunan kod

- `tradehub_core/seo_helper/mcp/auth.py:98`: yazıyor
- `tradehub_core/seo_helper/api/panel.py:246`: okuyor
- `tradehub_core/seo_helper/api/panel.py:287`: okuyor
- `tradehub_core/seo_helper/mcp/ops.py:100`: okuyor
- `tradehub_core/seo_helper/mcp/ops.py:111`: okuyor
- `tradehub_core/seo_helper/api/panel.py:482`: adını kullanıyor
- `tradehub_core/seo_helper/core/permissions.py:115`: adını kullanıyor
- `tradehub_core/seo_helper/mcp/auth.py:42`: adını kullanıyor
- `tradehub_core/seo_helper/mcp/ops.py:165`: adını kullanıyor
- `tradehub_core/seo_helper/mcp/ops.py:82`: adını kullanıyor
- `tradehub_core/seo_mcp/doctype/mcp_draft/mcp_draft.json:29`: alt tablo ya da Link tanımı
- `tradehub_core/seo_mcp/doctype/mcp_tool_call/mcp_tool_call.json:28`: alt tablo ya da Link tanımı

### hooks.py kayıtları

- `tradehub_core/hooks.py:1428`: mağaza kapsamlı izin döngüsü. `hooks.py:1437` `store_query_conditions` ve `hooks.py:1438` `store_has_permission` kaydını bağlar.

## Bağımlılık sorunları

1. Kimlik doğrulama kancası bütün uygulamaya ekleniyor. Kanıt: `hooks.py:1449`. Kanca yalnız MCP yolunda çalışıyor ama her isteğe giriyor.
2. İzin kuralı mağaza kapsamlı ortak döngüde. Kanıt: `hooks.py:1428`.

## Hedef tasarım

- Sahip bağlam ve paket yolu: `tradehub_core/seo/` paketi. Bugünkü `seo_helper/` kodu bu paketin içine taşınır. Mevcut `SEO Core`, `SEO Crawler`, `SEO Catalog`, `SEO Merchant` ve `SEO MCP` modülleri 10 bağlamının alt modülleri olarak kalır.
- Dışarıya açılan fonksiyonlar: `seo/api.py` içinde ayrı fonksiyon gerekmez. İstemci yönetimi panel uçlarında kalır.
- Yayınladığı olaylar: Yok.
- Dinlediği olaylar: 02 bağlamının `seller.deleted` olayı. Abone, istemciyi devre dışı bırakır.
- Başka bağlamlara bağlantılar: `store` Link alanı `Admin Seller Profile` kök kaydına bağlı kalır.
- Denetleyicide kalacak doğrulamalar: Ayrı doğrulama gerekmiyor.
- Servise taşınacak iş kuralları: İş kuralları zaten servis kodunda. Yalnız paket yolu değişir.

## Geçiş adımları

1. `seller.deleted` aboneliği ekleyin.
2. `seo_helper/mcp/` klasörünü `seo/mcp/` altına taşıyın.

## Riskler ve testler

- Silinen mağazanın istemcisi çalışmaya devam edebilir. Test: mağaza silinince istemci reddedilmeli.
