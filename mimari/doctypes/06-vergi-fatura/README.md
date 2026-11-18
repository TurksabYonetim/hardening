# 06-vergi-fatura bağlamı

Bu belge vergi ve fatura bağlamının hedef tasarımını anlatır. Satır numaraları `origin/version-15` dalının `08e51e53` işlemine göredir. Terimlerin açıklaması ve olay altyapısı `04-siparis/README.md` belgesinin 4.1 bölümündedir.

## 1. Bağlamın amacı

Vergi bağlamı iki işi yapar. Birinci iş vergi kurallarını tutmak ve vergiyi hesaplamaktır. İkinci iş siparişin fatura belgesini üretmektir.

Bugün vergi motoru temiz bir çekirdektir. Hesap fonksiyonu yazımsızdır (`tax_core/engine.py:195`). Sorun, motorun başka bağlamların içinden çağrılmasıdır. Sipariş denetleyicisi, katalog ve sepet motorun iç fonksiyonlarını doğrudan çağırır.

## 2. DocType listesi

Ana kayıtlar:

- `Tax Rule`
- `Order Invoice Document`
- `Platform Invoice` (eski fatura modeli)
- `Seller Invoice Profile`

Kayıt defteri (log):

- `Invoice Document Operation`

Alt tablolar:

- `Tax Rule Seller`
- `Platform Invoice Item`
- `Listing Tax Rule` (03a-katalog bağlamına taşınmalı)
- `Order Tax Line` (04-siparis bağlamına taşınmalı)

Ayar kaydı: yok.

## 3. Bağlamın dışa açık API'si

Diğer bağlamlar yalnız `tradehub_core/tax/api.py` içindeki fonksiyonları çağırır. Tipler `tradehub_core/tax/contracts.py` dosyasındadır.

Hesap fonksiyonları (yazımsız):

1. `quote_order_taxes(input: OrderTaxInput) -> OrderTaxQuote`. Sipariş bağlamı sepet onayında çağırır.
2. `quote_listing_price(input: TaxProfileInput, amount, on_date) -> ListingTaxQuote`. Katalog vitrin fiyatı için çağırır.
3. `split_line_taxes(...) -> list[LineTax]`. Bugünkü `order.py:99` içindeki `kalem_vergileri` buraya taşınır.
4. `validate_listing_tax_configuration(input: TaxProfileInput) -> None`. Katalog ilan kaydında çağırır.

Kural okuma fonksiyonları:

1. `get_available_tax_rules(on_date, seller) -> list[TaxRuleView]`
2. `resolve_rule(name: str, on_date, seller) -> TaxRuleData`

Fatura fonksiyonları:

1. `create_proforma_draft(order: str, key: str) -> InvoiceDocumentView`
2. `get_order_documents(order: str, viewer: str) -> list[InvoiceDocumentView]`
3. `order_summary_html(order: str) -> str`
4. `get_invoice_profile(seller: str) -> InvoiceProfileView`
5. `save_invoice_profile(seller: str, data) -> InvoiceProfileView`
6. `generate_legacy_invoice(order: str) -> str`. Yalnız platform yöneticisi çağırır.

`OrderTaxInput` alanları:

- `order_date`, `currency`, `shipping_fee`, `coupon_discount`
- `lines`: her satır için `ref`, `listing`, `seller`, `entered_total`, `tax_profile`
- `tax_profile` alanını katalog hazırlar: `mode`, `behavior`, `exemption_reason`, `rules`

`OrderTaxQuote` alanları:

- `lines`: `order_item_ref`, `listing`, `tax_rule`, `tax_name`, `tax_code`, `country`, `rate_exact`, `sequence`, `base_mode`, `selected_tax_codes`, `taxable_base_exact`, `tax_amount_exact`
- `item_totals`: her kalem için `taxable_base_exact`, `tax_amount_exact`, `gross_total_exact`, `vat_rate`
- `subtotal_net`, `shipping_net`, `discount_net`, `tax_total`, `gross_total`

## 4. Yayınlanan ve dinlenen olaylar

Bu bağlamın sipariş zincirindeki yeri `04-siparis/README.md` belgesinin 4.2 bölümündedir. Kısaca şöyledir:

1. Sepet onayında sipariş bağlamı `quote_order_taxes` çağırır. Vergi tutarı burada hesaplanır. Çünkü alıcı vergili tutarı öder.
2. Sipariş kesinleşince vergi bağlamı `order.confirmed` olayını alır.
3. Vergi bağlamı anlık görüntüyü yeniden doğrular ve proforma taslağını açar.
4. Vergi bağlamı `order.tax_calculated` yayınlar.
5. Lojistik bağlamı bu olayla sevkiyat taslağını açar.

Yayınlanan olaylar:

- `order.tax_calculated`. Veri: `order`, `seller`, `currency`, `tax_total_exact`, `grand_total_exact`, `tax_lines_hash`, `invoice_document`. Dinleyenler: 07-lojistik, 04-siparis.
- `order.tax_mismatch`. Veri: `order`, `expected_tax_exact`, `stored_tax_exact`. Dinleyenler: 04-siparis, 12-bildirim-iletisim (finans uyarısı).
- `invoice.published`. Veri: `document`, `order`, `kind`, `version_no`. Dinleyenler: 12-bildirim-iletisim, 04-siparis.
- `tax_rule.changed`. Veri: `rule`, `country`, `tax_code`, `valid_from`. Dinleyen: 03a-katalog (vitrin önbelleği).

Dinlenen olaylar:

- `order.confirmed` (04-siparis): vergi doğrulaması ve proforma taslağı.
- `order.cancelled` (04-siparis): proforma taslağı geri çekilir.
- `order.amended` (04-siparis): eski belge "superseded" olur.
- `store.deleted` (02-satici-magaza): `Seller Invoice Profile` ve `Tax Rule Seller` satırları temizlenir.

## 5. Bağlamlar arası en ağır 10 bağımlılık

1. Sipariş denetleyicisi vergi motorunun iç fonksiyonlarını çağırıyor. Kanıt: `order.py:141`, `order.py:142`. Vergi motoru imzası değişirse her sipariş kaydı düşer. Etkilenen bağlam 04-siparis.
2. Vergi motoru ilan belgesinin tamamını okuyor. Kanıt: `tax_core/service.py:141`, `tax_core/service.py:161`. Katalog alan adını değiştirirse vergi hesabı bozulur. Etkilenen bağlam 03a-katalog.
3. `Order Tax Line` vergi bağlamında görünüyor ama `Order` kaydının alt tablosu. Kanıt: `order.json:258`, `order.py:231`.
4. `Listing Tax Rule` vergi bağlamında görünüyor ama `Listing` kaydının alt tablosu. Kanıt: `listing.json:452`.
5. Vergi kuralı denetleyicisi katalog tablolarını ham SQL ile okuyor. Kanıt: `tax_rule.py:23`, `tax_rule.py:114`.
6. Vergi kuralı olayı doğrudan katalog fonksiyonuna bağlı. Kanıt: `hooks.py:457`, `api/listing.py:410`.
7. Eski fatura denetleyicisi sipariş denetleyicisinden fonksiyon alıyor. Kanıt: `platform_invoice.py:44`.
8. Fatura servisi siparişi ve `shared_sync` iç modülünü okuyor. Kanıt: `invoice_documents/service.py:75`, `invoice_documents/service.py:223`.
9. Fatura servisi mağaza kaydını ve sözleşme paketini okuyor. Kanıt: `invoice_documents/service.py:94`, `invoice_documents/service.py:97`. Etkilenen bağlam 02-satici-magaza.
10. Vergi motoru dışarıdan beş ayrı yerde iç yoldan çağrılıyor. Kanıt: `api/listing.py:91`, `api/listing.py:1851`, `api/cart_summary.py:196`, `utils/listing_gross_price.py:339`, `listing.py:74`.

Ek bir iş eksiği var. Yeni vergi satırı olan siparişte fatura belgesi üretilemiyor. Kanıt: `invoice_documents/service.py:229`, `tax_core/service.py:267`. Bu eksik doğrulanmadı. Ürün sahibiyle konuşulmalı.

## 6. Önerilen geçiş sırası

1. `tax/contracts.py` dosyasını açın. `OrderTaxInput`, `OrderTaxQuote` ve `TaxProfileInput` sözleşmelerini yazın.
2. `tax/api.py` dosyasını açın. Bugünkü `tax_core.service` fonksiyonlarını buradan dışarı verin. Davranış değişmez.
3. Katalog, sepet ve vitrin çağrılarını `tax/api.py` yoluna çevirin. Her çağrı yeri ayrı PR olabilir.
4. `profile_from_listing` fonksiyonu ilan belgesi yerine `TaxProfileInput` alsın. Katalog bu girdiyi kendisi hazırlasın.
5. `kalem_vergileri` fonksiyonunu `tax/api.py` içine taşıyın. `platform_invoice.py:44` yeni yolu kullansın.
6. Sipariş vergi hesabını `quote_order_taxes` fonksiyonuna taşıyın. Sipariş denetleyicisi yalnız sonucu yazsın. Bu adım 04-siparis ekibiyle yapılır.
7. 03a-katalog `listings_using_tax_rules` okuma modelini versin. `tax_rule.py:23` ve `tax_rule.py:114` bu modeli kullansın.
8. `tax_rule.changed` olayını yayınlayın. `hooks.py:457` kaydını kaldırın.
9. Olay altyapısı hazır olunca `order.confirmed` dinleyicisini ekleyin. Dinleyici proforma taslağını açsın ve `order.tax_calculated` yayınlasın.
10. `invoice_documents/` paketini `tax/invoicing/` konumuna taşıyın. Eski yolda yönlendirme bırakın.
11. `Order Tax Line` ve `Listing Tax Rule` kayıtlarının `module` alanını sahip bağlama çevirin.
12. Vergi satırlı siparişler için belge şablonunu genişletin. Bu adım ayrı bir iş kararıdır.

## 7. Başka bağlama taşınması gereken DocType'lar

- `Order Tax Line` 04-siparis bağlamına gitmeli. Tablo siparişin vergi anlık görüntüsüdür. Satırları sipariş yazar. Değerleri vergi bağlamının `quote_order_taxes` sonucundan gelir.
- `Listing Tax Rule` 03a-katalog bağlamına gitmeli. Tablo ilanın parçasıdır. Satırları katalog yazar. Doğrulamayı vergi bağlamı yapar.

## 8. Paralel çalışacak geliştiriciler için kurallar

1. Vergi kodunu yalnız `tradehub_core/tax/` paketinde yazın. Bugünkü `tax_core/` ve `invoice_documents/` paketleri buraya taşınır.
2. Hesap fonksiyonları veritabanına yazmaz. Girdi sözleşmeyle gelir. Çıktı sözleşmeyle döner.
3. Vergi kodu `Listing` ya da `Order` belgesini doğrudan açmaz. Gerekli veri okuma modelinden gelir.
4. Tutarlar kesin ondalık metin olarak taşınır. Örnek: `tax_amount_exact`. Yuvarlama kuralı `utils/pricing.py` dosyasındaki kuraldır (`order.py:28`).
5. Sipariş anındaki vergi sonradan değişmez. Bu kural bugün `order.py:372` içinde korunur. Yeni kod bu kuralı bozmaz.
6. Sözleşmeye yalnız alan ekleyin. Alan silmek için `schema_version` değerini artırın.
7. Var olan vergi testleri korunur: `tax_core/test_engine.py`, `tax_core/test_exhaustive_matrix.py`, `tax_core/test_integration.py`.
8. Fatura belgesine yalnız fatura servisi yazar. Bu kural bugün `hooks.py:1579` yorumunda yazılıdır.
9. CI şu kuralı denetler: başka bağlam `tradehub_core.tax` paketinden yalnız `api` ve `contracts` modülünü içe aktarabilir.
10. `CODEOWNERS` dosyasında `tradehub_core/tax/` yolunun sahibi vergi ekibidir.

Bu belge gerçek okurla denenmedi.

## Epic özeti

Bu bağlamdaki her DocType bir epic olur. Liste öncelik, faz ve büyüklüğü verir.

- Invoice Document Operation: Düşük, Faz 3, Küçük
- Listing Tax Rule: Kritik, Faz 3, Orta
- Order Invoice Document: Kritik, Faz 3, Büyük
- Order Tax Line: Kritik, Faz 3, Orta
- Platform Invoice: Önemli, Faz 3, Orta
- Platform Invoice Item: Düşük, Faz 3, Küçük
- Seller Invoice Profile: Önemli, Faz 3, Küçük
- Tax Rule: Kritik, Faz 3, Orta
- Tax Rule Seller: Düşük, Faz 3, Küçük
