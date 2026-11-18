# Order Tax Line

- Bağlam: 06-vergi-fatura
- Tür: Alt tablo
- Klasör: `tradehub_core/tradehub_core/doctype/order_tax_line`
- Denetleyici: `tradehub_core/tradehub_core/doctype/order_tax_line/order_tax_line.py` (5 satır)
- Önerilen sahip bağlam: 04-siparis. Bu tablo `Order` kaydının alt tablosudur (`order.json:258`). Satırları sipariş denetleyicisi yazar (`order.py:231`). Tablo bir vergi anlık görüntüsüdür. Anlık görüntü, sipariş anındaki değerin donmuş kopyası demektir.

## Epic

- Epic adı: Order Tax Line: 04-siparis bağlamına taşıma
- Öncelik: Kritik
- Faz: Faz 3
- Tahmini büyüklük: Orta

### User story

Bir geliştirici olarak, vergi satırlarını vergi motorunun sözleşmesinden yazmak istiyorum.
Böylece motor değişince sipariş kaydı düşmez.

### Kabul kriterleri

- [ ] `tax.api.quote_order_taxes` fonksiyonu var ve sözleşme testi geçiyor.
- [ ] `order.py` vergi satırlarını yalnız bu fonksiyonun sonucundan yazıyor.
- [ ] Kesinleşmiş siparişte vergi satırı değişince kayıt reddediliyor.
- [ ] Tutarlar kuruş farkı olmadan eski hesapla aynı.
- [ ] Characterization test: `Order Tax Line` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- Kesinleşmiş siparişin vergi satırını değiştirmeyin. `order.py:372` bunu engeller.
- Vergi kodundan bu alt tabloya yazmayın. Tablo siparişin anlık görüntüsüdür.
- Tutarı ondalık metin yerine `float` olarak taşımayın. Kuruş farkı oluşur.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] `tax_core/test_exhaustive_matrix.py` geçiyor.
- [ ] Değişmezlik testi geçiyor.
- [ ] Sipariş ve vergi ekibinden inceleme istendi.
- [ ] `import-linter` kontrolü geçiyor.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?
`Order Tax Line` sipariş anında hesaplanan her vergi satırını tutar. Satır kuralı, oranı, matrahı ve tutarı kesin ondalık metin olarak saklar. Satır bir sipariş kalemine `order_item_ref` alanıyla bağlanır. Sipariş kesinleşince satırlar değiştirilemez (`order.py:372`).

## Bugünkü bağımlılıklar
### Bu kaydın bağlandığı kayıtlar
- `Listing` (`listing`): başka bağlam (03a-katalog)
- `Currency` (`currency`): framework kaydı
- `tax_rule` alanı Link değil, düz metindir. Bu alan kural adının anlık görüntüsüdür.

### Bu kayda dokunan kod
- `tradehub_core/tradehub_core/doctype/order/order.py:161`: yazıyor (satırları sıfırlar)
- `tradehub_core/tradehub_core/doctype/order/order.py:231`: yazıyor (satır ekler)
- `tradehub_core/tradehub_core/doctype/order/order.py:423`: okuyor (değişmezlik denetimi)
- `tradehub_core/api/order.py:377`: okuyor (sipariş detayı)
- `tradehub_core/invoice_documents/service.py:229`: okuyor (satır varsa belge üretimini reddeder)
- `tradehub_core/tax_core/service.py:267`: okuyor (satır varsa eski faturayı reddeder)

### hooks.py kayıtları
- Kayıt yok. `Order` olayları geçerlidir.

## Bağımlılık sorunları
1. Tablo vergi bağlamına yazılmış ama siparişin içinde. Vergi motoru değişince sipariş denetleyicisi de değişmeli (`order.py:139`).
2. Satır içeren siparişler için fatura üretilemiyor (`invoice_documents/service.py:229`, `tax_core/service.py:267`). Yeni vergi yolu açılınca satıcı belge alamaz. Bu bir iş eksiği olarak görünür, doğrulanmadı.

## Hedef tasarım
- Sahip bağlam: 04-siparis. Tablo sipariş içinde anlık görüntü olarak kalır.
- Satırları yalnız sipariş bağlamı yazar. Kaynak, vergi bağlamının saf hesap fonksiyonudur: `tax.api.quote_order_taxes(input: OrderTaxInput) -> OrderTaxQuote`.
- `OrderTaxQuote` sözleşmesi `tax/contracts.py` içindedir. Alanlar şunlardır: `lines` (`order_item_ref`, `listing`, `tax_rule`, `tax_name`, `tax_code`, `country`, `rate_exact`, `sequence`, `base_mode`, `selected_tax_codes`, `taxable_base_exact`, `tax_amount_exact`), `item_totals`, `subtotal_net`, `tax_total`, `gross_total`.
- Vergi bağlamı satırları `ordering.api.get_order_tax_snapshot(order)` ile okur. Bu okuma `order.confirmed` işleyicisinde yapılır.
- Olay: vergi bağlamı `order.confirmed` olayını dinler. Anlık görüntüyü kurallarla yeniden doğrular. Sonra `order.tax_calculated` yayınlar.

## Geçiş adımları
1. `tax/contracts.py` dosyasını açın. `OrderTaxInput` ve `OrderTaxQuote` sözleşmelerini yazın.
2. `order.py:139` içindeki hesabı `tax.api.quote_order_taxes` fonksiyonuna taşıyın. Sipariş denetleyicisi yalnız sonucu yazsın. Bu adım 1. adımdan sonra gelir.
3. DocType JSON `module` alanını sipariş modülüne çevirin.
4. Fatura belgesinin vergi satırlarını desteklemesi ayrı bir iş kalemidir. `Order Invoice Document` raporuna bakın.

## Riskler ve testler
- Vergi tutarı kuruş düzeyinde kayabilir. Var olan testler korunmalı: `tax_core/test_exhaustive_matrix.py` ve `tax_core/test_integration.py`.
- Değişmezlik kuralı kaybolabilir. Test: kesinleşmiş siparişte vergi satırı değişince kayıt reddedilmeli.
