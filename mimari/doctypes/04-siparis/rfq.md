# RFQ

- Bağlam: 04-siparis
- Tür: Ana kayıt
- Klasör: `tradehub_core/tradehub_core/doctype/rfq`
- Denetleyici: `tradehub_core/tradehub_core/doctype/rfq/rfq.py` (199 satır)
- Önerilen sahip bağlam: 04-siparis, `ordering/sourcing/` alt paketi

## Epic

- Epic adı: RFQ: 04-siparis bağlamına taşıma
- Öncelik: Önemli
- Faz: Faz 3
- Tahmini büyüklük: Orta

### User story

Bir alıcı olarak, teklif isteğim onaylanınca uygun satıcıların haber almasını istiyorum.
Böylece hızlı teklif alırım.

### Kabul kriterleri

- [ ] Bildirimler `rfq.*` olaylarıyla gidiyor. Denetleyici doğrudan bildirim göndermiyor.
- [ ] Satıcı eşleşmesi `ordering/sourcing/matching.py` içinde.
- [ ] `quote_count` alanını tek fonksiyon yazıyor.
- [ ] Eski uç nokta adresleri çalışıyor.
- [ ] Characterization test: `RFQ` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- Denetleyiciden `utils.notify` çağırmayın. Bildirim bağlamı olayı dinler.
- İş kuralını `permissions.py` içine yazmayın. Eşleşme kuralı sourcing paketindedir.
- `quote_count` alanını teklif denetleyicisinden yazmayın.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] Bildirim olayı testi eklendi.
- [ ] Teklif sayısı testi eklendi.
- [ ] Yetki testleri geçiyor.
- [ ] Bildirim ekibinden inceleme istendi.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?
`RFQ` alıcının teklif isteğidir. RFQ, "fiyat teklifi isteği" demektir. Alıcı ürünü, kategoriyi ve adedi yazar. Yönetici isteği onaylar. Sonra kategoriye uygun satıcılar teklif verir.

## Bugünkü bağımlılıklar
### Bu kaydın bağlandığı kayıtlar
- `User` (`buyer`): framework kaydı
- `Product Category` (`category`): başka bağlam (03a-katalog)
- `UOM` (`unit`): başka bağlam (03a-katalog)

### Bu kayda dokunan kod
- `tradehub_core/api/rfq.py:67`: yazıyor (isteği açar)
- `tradehub_core/tradehub_core/doctype/rfq_quote/rfq_quote.py:127`: yazıyor (`quote_count`)
- `tradehub_core/api/seller_crm.py:214`: okuyor (isteği CRM adayına çevirir)
- `tradehub_core/api/v1/dashboard.py:116`: okuyor
- `tradehub_core/permissions.py:1938`: okuyor (ek dosya izni)
- `tradehub_core/api/public.py:533`: okuyor
- `tradehub_core/seo_helper/setup/install.py:133`: özel alan kurar (SEO atfı)
- `tradehub_core/privacy/data_export.py:162`: okuyor

### Denetleyicinin kendi dış çağrıları
- `rfq.py:13`: `shared_sync.verification_gate.require` ile alıcı KYC denetimi.
- `rfq.py:100`: `permissions.rfq_category_stores` ile eşleşen mağazaları bulur.
- `rfq.py:5`: `utils.notify` ile bildirim gönderir.

### hooks.py kayıtları
- `hooks.py:1241`: kayıt izni `permissions.rfq_has_permission`.
- `hooks.py:1408`: SEO atıf işleyicisi `after_insert` olayına eklenir.

## Bağımlılık sorunları
1. Denetleyici bildirimleri doğrudan gönderir (`rfq.py:22`, `rfq.py:25`). Bildirim kuralı değişince bu dosya da değişir. Bu sorun 12-bildirim-iletisim bağlamını etkiler.
2. Satıcı eşleşmesi yetki dosyasında duruyor (`rfq.py:100`). İş kuralı ile yetki kuralı karışıyor.
3. `quote_count` alanını iki yer yazar (`rfq.py:196`, `rfq_quote.py:127`).

## Hedef tasarım
- Sahip bağlam: 04-siparis. Paket yolu: `tradehub_core/ordering/sourcing/`.
- Dışarıya açılan fonksiyonlar (`ordering/api.py`):
  - `create_rfq(data: RfqInput) -> str`
  - `get_rfq_for_seller(rfq: str) -> RfqView` (CRM için okuma modeli)
- Yayınladığı olaylar:
  - `rfq.submitted`, `rfq.approved`, `rfq.closed`. Veri `rfq`, `buyer`, `category`, `status`.
- Dinlediği olaylar: `rfq.quote_submitted` ve `rfq.quote_withdrawn` (aynı bağlam). `quote_count` tek yerde güncellenir.
- 12-bildirim-iletisim bağlamı `rfq.*` olaylarını dinler ve bildirimi o gönderir.
- Başka bağlamlara bağlantılar: `category` ve `unit` Link alanları kalır.
- Denetleyicide kalacak doğrulamalar: durum geçişi (`rfq.py:174`). KYC kapısı `identity.api.require_verified` üzerinden çalışır.

## Geçiş adımları
1. `rfq_category_stores` fonksiyonunu `ordering/sourcing/matching.py` içine taşıyın. `permissions.py` bu fonksiyonu çağırsın.
2. Bildirimleri olaya çevirin. Bu adım olay altyapısından sonra gelir.
3. `quote_count` güncellemesini tek fonksiyona indirin.
4. `api/rfq.py` uç noktalarını `ordering/sourcing/endpoints.py` içine taşıyın. Eski adres korunmalı.

## Riskler ve testler
- Satıcılar yeni isteği duymayabilir. Test: istek onaylanınca kategori satıcılarına bildirim gitmeli.
- Teklif sayısı yanlış görünebilir. Test: teklif silinince sayı azalmalı.
