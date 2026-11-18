# UOM

- Bağlam: 03a-katalog
- Tür: Ana kayıt (sözlük)
- Klasör: `tradehub_core/tradehub_core/doctype/uom`
- Denetleyici: `tradehub_core/tradehub_core/doctype/uom/uom.py` (12 satır)
- Önerilen sahip bağlam: 03a-katalog

## Epic

- Epic adı: UOM: 03a-katalog bağlamına taşıma
- Öncelik: Önemli
- Faz: Faz 4
- Tahmini büyüklük: Küçük

### User story

Bir geliştirici olarak, ölçü birimini `shared/uom.py` içindeki `resolve_uom` ile çözmek istiyorum.
Böylece ürün API'si içe aktarmanın özel fonksiyonunu çağırmaz ve teklif isteği aynı sözlüğü kullanır.

### Kabul kriterleri

- [ ] `shared/uom.py` içinde `resolve_uom` ve `list_uoms` var. `_TR_UOM_ALIASES` sözlüğü oraya taşındı.
- [ ] `api/v1/catalog.py` ve `persister.py` `persister._resolve_link("UOM", ...)` çağırmıyor.
- [ ] `api/rfq.py` birim listesini `list_uoms` ile okuyor.
- [ ] Türkçe takma ad testi (`test_mogem665_0_duzeltmeler.py`) yeni fonksiyonda geçiyor.
- [ ] Pasif birim listede çıkmıyor. Test var.
- [ ] Characterization test: `UOM` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- Başka modülden `persister._resolve_link` gibi alt çizgili özel fonksiyon çağırmayın.
- ERPNext `UOM` şemasıyla uyumu bozmayın. 239 kayıt ve Link alanları buna bağlı.
- Birim sözlüğünü iki bağlamda kopyalamayın.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] Takma ad testi taşındı ve geçiyor.
- [ ] Teklif isteği birim testi geçiyor.
- [ ] `import-linter` geçiyor.
- [ ] `CODEOWNERS` katalog ve sipariş ekiplerinden inceleme istendi.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?
UOM ölçü birimi kaydıdır. Örneğin "Adet", "Metre", "Kg". Ürün stok birimi ve teklif isteği birimi bu kayda bağlanır. Kayıt ERPNext'ten devralındı. Şema ERPNext ile aynı tutuldu.

## Bugünkü bağımlılıklar
### Bu kaydın bağlandığı kayıtlar
- Link alanı yok.
- Bu kayda bağlanan alanlar: `Listing.stock_uom` (03a), `RFQ.unit` (04-siparis, `rfq.json:89`)
### Bu kayda dokunan kod
- `tradehub_core/bulk_import/persister.py:289,493`: içe aktarma Türkçe birim adlarını çözüyor (03b okuyor)
- `tradehub_core/api/v1/catalog.py:312`: ürün API'si birimi `persister._resolve_link` ile doğruluyor
- `tradehub_core/shared_sync/projections.py:420`: paylaşım bağlamı birim varlığını okuyor
- `tradehub_core/api/rfq.py:779`: teklif isteği birim listesini okuyor
- `tradehub_core/setup/install.py:82`: kurulum kontrolü
- Yamalar: `localize_uom_tr.py`, `v15_faz4_uom_takeover_erpnext_decouple.py`
### hooks.py kayıtları
- Kayıt yok.

## Bağımlılık sorunları
1. `tradehub_core/api/v1/catalog.py:312` ürün API'si içe aktarma paketinin iç fonksiyonunu (`persister._resolve_link`) çağırıyor. Alt çizgili özel fonksiyon başka modülden kullanılıyor.
2. `tradehub_core/api/rfq.py:779` teklif bağlamı birim listesini doğrudan okuyor. Birim sözlüğü paylaşılan çekirdek olabilir.

## Hedef tasarım
- Sahip bağlam `03a-katalog`. Alternatif: `tradehub_core/shared/` paylaşılan çekirdek. Birim para gibi ortak kavramdır. Öneri: `shared/uom.py` içinde `resolve_uom(label)` ve `list_uoms()`. DocType katalogda kalır.
- Dışarıya açılan fonksiyonlar: `resolve_uom(label)` Türkçe takma adları çözer. `list_uoms(enabled_only=True)` listeler.
- Olay yok.
- Başka bağlamlara bağlantılar: `RFQ.unit` Link alanı kalır. Birim adı kararlı kimliktir.
- Denetleyicide doğrulama yok. Servise taşınacak iş kuralı: `persister.py:493` takma ad çözümü `resolve_uom` olur.

## Geçiş adımları
1. `shared/uom.py` oluşturun. `_TR_UOM_ALIASES` sözlüğünü `persister.py` dosyasından buraya taşıyın.
2. `api/v1/catalog.py:312` ve `persister.py:493` çağrılarını `resolve_uom` ile değiştirin. 1. adımdan sonra gelir.
3. `api/rfq.py:779` okumasını `list_uoms` ile değiştirin. 1. adımdan sonra gelir.

## Riskler ve testler
- Türkçe takma ad doğru birime çözülmeli. Test: `test_mogem665_0_duzeltmeler.py:101-107` zaten var. Yeni fonksiyona taşınır.
- Pasif birim yeni ürüne seçilememeli. Test: `enabled=0` birim `list_uoms` çıktısında yok.
