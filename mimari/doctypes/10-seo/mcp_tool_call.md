# MCP Tool Call

- Bağlam: 10-seo
- Tür: Kayıt defteri (log)
- Klasör: `tradehub_core/seo_mcp/doctype/mcp_tool_call`
- Denetleyici: `tradehub_core/seo_mcp/doctype/mcp_tool_call/mcp_tool_call.py` (8 satır)
- Önerilen sahip bağlam: 10-seo

## Epic

- Epic adı: MCP Tool Call: 10-seo bağlamına taşıma
- Öncelik: Düşük
- Faz: Faz 4
- Tahmini büyüklük: Küçük

### User story

Bir platform yöneticisi olarak, yapay zekâ araç çağrılarını izlemek istiyorum.
Böylece hatalı ya da kötüye kullanılan çağrıyı bulabilirim.

### Kabul kriterleri

- [ ] Her araç çağrısı bir satır yazıyor.
- [ ] Eşikten eski satırlar temizlik görevinden sonra kalmıyor.
- [ ] Satıcı yalnız kendi mağazasının çağrılarını görüyor.
- [ ] Characterization test: `MCP Tool Call` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- Çağrı satırına gizli anahtar ya da parola yazmayın. Defter herkese açık değil ama kalıcıdır.
- Temizlik görevinde `ignore_permissions` kullanımını kullanıcı akışına taşımayın.
- Satırı düzenlenebilir yapmayın. Defter değişmez olmalı.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] Değişen davranış için önce başarısız olan bir test yazıldı.
- [ ] Ruff ve uygulama testleri yerelde geçiyor.
- [ ] `import-linter` kontrolü `tradehub_core.seo` için geçiyor.
- [ ] `CODEOWNERS` içindeki SEO bağlamı sahibinden inceleme istendi.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?

Bu kayıt yapay zekâ ajanının her araç çağrısını kaydeder. Kayıt istemciyi, mağazayı ve oluşan taslağı tutar. Eski kayıtlar zamanlanmış görevle silinir.

## Bugünkü bağımlılıklar

### Bu kaydın bağlandığı kayıtlar

- `MCP Client` (`client`, Link): aynı bağlam
- `Admin Seller Profile` (`store`, Link): başka bağlam (02-satici-magaza)
- `MCP Draft` (`draft`, Link): aynı bağlam

### Bu kayda dokunan kod

- `tradehub_core/seo_helper/mcp/ops.py:154`: yazıyor
- `tradehub_core/seo_helper/api/panel.py:277`: adını kullanıyor
- `tradehub_core/seo_helper/api/panel.py:526`: adını kullanıyor
- `tradehub_core/seo_helper/core/permissions.py:115`: adını kullanıyor
- `tradehub_core/seo_helper/mcp/api.py:62`: adını kullanıyor
- `tradehub_core/seo_helper/mcp/ops.py:131`: adını kullanıyor
- `tradehub_core/seo_helper/mcp/ops.py:151`: adını kullanıyor
- `tradehub_core/seo_mcp/doctype/mcp_draft/mcp_draft.json:107`: alt tablo ya da Link tanımı

### hooks.py kayıtları

- `tradehub_core/hooks.py:1429`: mağaza kapsamlı izin döngüsü. `hooks.py:1437` `store_query_conditions` ve `hooks.py:1438` `store_has_permission` kaydını bağlar.

## Bağımlılık sorunları

Önemli bir bağımlılık sorunu bulunmadı.

## Hedef tasarım

- Sahip bağlam ve paket yolu: `tradehub_core/seo/` paketi. Bugünkü `seo_helper/` kodu bu paketin içine taşınır. Mevcut `SEO Core`, `SEO Crawler`, `SEO Catalog`, `SEO Merchant` ve `SEO MCP` modülleri 10 bağlamının alt modülleri olarak kalır.
- Dışarıya açılan fonksiyonlar: Ayrı fonksiyon gerekmez.
- Yayınladığı olaylar: Yok.
- Dinlediği olaylar: Yok.
- Başka bağlamlara bağlantılar: `store` Link alanı kalır.
- Denetleyicide kalacak doğrulamalar: Ayrı doğrulama gerekmiyor.
- Servise taşınacak iş kuralları: İş kuralları zaten servis kodunda. Yalnız paket yolu değişir.

## Geçiş adımları

1. Kod `seo_helper/` altından `seo/` altına taşınırken bu DocType'ın kullanıcılarını aynı PR içinde güncelleyin.

## Riskler ve testler

- Eski kayıtlar silinmeyebilir. Test: eşikten eski kayıtlar temizlik sonrası kalmamalı.
