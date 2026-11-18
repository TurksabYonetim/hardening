# Platform Invoice

- Bağlam: 06-vergi-fatura
- Tür: Ana kayıt
- Klasör: `tradehub_core/tradehub_core/doctype/platform_invoice`
- Denetleyici: `tradehub_core/tradehub_core/doctype/platform_invoice/platform_invoice.py` (125 satır)
- Önerilen sahip bağlam: 06-vergi-fatura

## Epic

- Epic adı: Platform Invoice: 06-vergi-fatura bağlamına taşıma
- Öncelik: Önemli
- Faz: Faz 3
- Tahmini büyüklük: Orta

### User story

Bir geliştirici olarak, eski fatura kodunun sipariş denetleyicisine bağlı olmamasını istiyorum.
Böylece sipariş kodu değişince fatura modülü açılır.

### Kabul kriterleri

- [ ] `kalem_vergileri` fonksiyonu `tax/api.py` içinde.
- [ ] `platform_invoice.py` sipariş denetleyicisinden içe aktarım yapmıyor.
- [ ] Fatura toplamı siparişin `grand_total` değerine eşit.
- [ ] Eski modelin kapanış kararı yazılı.
- [ ] Characterization test: `Platform Invoice` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- `tradehub_core.tradehub_core.doctype.order.order` modülünden içe aktarım yapmayın.
- Sahte e-fatura onayı yazmayın. Entegrasyon bağlı değil (`api/invoice.py:21`).
- Bu uç noktaları satıcıya açmayın. Yalnız platform yöneticisi kullanır.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] Toplam eşitlik testi eklendi.
- [ ] Yetki testi geçiyor.
- [ ] `import-linter` kontrolü geçiyor.
- [ ] Sipariş ekibinden inceleme istendi.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?
`Platform Invoice` eski fatura kaydıdır. Kayıt bir siparişten tek oranlı KDV ile üretilir. Uç noktalar yalnız platform yöneticisine açıktır (`api/invoice.py:8`). e-Fatura entegrasyonu bağlı değildir (`api/invoice.py:21`).

## Bugünkü bağımlılıklar
### Bu kaydın bağlandığı kayıtlar
- `Order` (`order`): başka bağlam (04-siparis)
- `User` (`buyer`): framework kaydı
- `Admin Seller Profile` (`seller`): başka bağlam (02-satici-magaza)
- `Currency` (`currency`): framework kaydı
- `Platform Invoice Item` (`items`, alt tablo): aynı bağlam

### Bu kayda dokunan kod
- `tradehub_core/api/invoice.py:81`: yazıyor (siparişten fatura üretir)
- `tradehub_core/api/invoice.py:77`: okuyor
- `tradehub_core/api/invoice.py:138`: okuyor (elle fatura yükleme)
- `tradehub_core/patches/v15_9_84_mogem654_fatura_tutar_yuvarlama.py:69`: yazıyor (yama)

### Denetleyicinin kendi dış çağrıları
- `platform_invoice.py:44`: sipariş denetleyicisinden `kalem_vergileri` fonksiyonunu içe aktarır (04-siparis).
- `platform_invoice.py:51`: `tax_core.service.ensure_legacy_invoice_compatible` çağırır.
- `platform_invoice.py:53`: `frappe.get_doc("Order", ...)` okur.

### hooks.py kayıtları
- Kayıt yok.

## Bağımlılık sorunları
1. Fatura denetleyicisi sipariş denetleyicisinin içinden fonksiyon alıyor (`platform_invoice.py:44`). Sipariş geliştiricisi `kalem_vergileri` imzasını değiştirirse fatura modülü açılmaz. Bu sorun 04-siparis bağlamını bağlar.
2. İki fatura modeli yan yana duruyor. `Platform Invoice` ve `Order Invoice Document` aynı işi farklı kurallarla yapar. Hangisinin kalacağı belirsiz.

## Hedef tasarım
- Sahip bağlam: 06-vergi-fatura. Paket yolu: `tradehub_core/tax/invoicing/legacy.py`.
- `kalem_vergileri` vergi bağlamına taşınır: `tax.api.split_line_taxes(...)`. Sipariş denetleyicisi de bu fonksiyonu kullanır.
- Dışarıya açılan fonksiyonlar: `tax.api.generate_legacy_invoice(order)`. Yalnız platform yöneticisi çağırır.
- Olay yoktur.
- Sipariş verisi `ordering.api.get_invoice_source(order)` ile okunur.
- Uzun vadede kayıt salt okunur yapılır. Yeni belge `Order Invoice Document` ile üretilir. Bu bir öneridir, iş kararı gerekir.

## Geçiş adımları
1. `kalem_vergileri` fonksiyonunu `tax/api.py` içine taşıyın. `order.py` içinde yönlendirme bırakın. Bu adım önce gelir.
2. `platform_invoice.py:44` içe aktarımını yeni yola çevirin.
3. `platform_invoice.py:53` okumasını okuma modeline çevirin.
4. Eski modelin kapanış kararını ürün sahibiyle verin.

## Riskler ve testler
- Fatura tutarı siparişle ayrışabilir. Test: aynı siparişten üretilen faturanın toplamı `grand_total` ile aynı olmalı.
