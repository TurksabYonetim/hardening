# Certification Type

- Bağlam: 03a-katalog
- Tür: Ana kayıt
- Klasör: `tradehub_core/tradehub_core/doctype/certification_type`
- Denetleyici: `tradehub_core/tradehub_core/doctype/certification_type/certification_type.py` (5 satır)
- Önerilen sahip bağlam: 03a-katalog (not: 02-satici-magaza ile ortak kullanım var, aşağıda açıklandı)

## Epic

- Epic adı: Certification Type: 03a-katalog bağlamına taşıma
- Öncelik: Önemli
- Faz: Faz 4
- Tahmini büyüklük: Orta

### User story

Bir geliştirici olarak, sertifika türü durumunu `catalog.api.get_certification_type` ile okumak istiyorum.
Böylece mağaza sertifikası kodu katalog tablosunu doğrudan okumaz ve alan değişikliği onu kırmaz.

### Kabul kriterleri

- [ ] `api/seller_certifications.py` ve `seller_certification.py` tür durumunu `get_certification_type` ile okuyor.
- [ ] Onay ve ret kuralı denetleyicide. `api/certification.py` ince.
- [ ] "Pending" tür ürüne atanamıyor. Test var.
- [ ] Satıcı yalnız onaylı türleri ve kendi önerisini görüyor. Test var.
- [ ] `import-linter` geçiyor.
- [ ] Characterization test: `Certification Type` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- 02 bağlamından `Certification Type` tablosunu `frappe.db.get_value` ile okumayın. API kullanın.
- Durum geçişini uç noktada yazmayın. Denetleyici karar verir.
- Sertifika sözlüğünü iki bağlamda kopyalamayın. Tek sözlük katalogda kalır.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] Denetleyici durum testleri eklendi.
- [ ] 02 çağrıları değişti ve testleri geçiyor.
- [ ] İzin sorgusu testi var.
- [ ] `CODEOWNERS` katalog ve mağaza ekiplerinden inceleme istendi.
- [ ] Ruff lint temiz.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?
Certification Type sertifika türü kaydıdır. Örneğin "ISO 9001" ya da "CE". İki kategorisi vardır. "Management" mağaza sertifikasıdır. "Product" ürün sertifikasıdır. Satıcı yeni tür önerir, yönetici onaylar.

## Bugünkü bağımlılıklar
### Bu kaydın bağlandığı kayıtlar
- `User` (suggested_by): başka bağlam (01-kimlik-erisim)
- Bu kayda bağlanan alt tablolar: `Listing Certification` (03a), `Product Category Required Certification` (03a), `Seller Certification` (02-satici-magaza)
### Bu kayda dokunan kod
- `tradehub_core/api/certification.py:44,62,130,186`: listeleme, öneri, onay ve ret uç noktaları (okuyor ve yazıyor)
- `tradehub_core/api/seller_certifications.py:521,769`: mağaza sertifikası akışı tür durumunu okuyor (02 kodu)
- `tradehub_core/utils/cert_validate.py:39`: ürün sertifika doğrulaması okuyor
- `tradehub_core/tradehub_core/doctype/listing_certification/listing_certification.py:16-21`: okuyor
- `tradehub_core/tradehub_core/doctype/seller_certification/seller_certification.py:17`: 02 bağlamı okuyor
- `tradehub_core/permissions.py:1332-1352`: satıcı yalnız onaylı türleri ve kendi önerisini görür
### hooks.py kayıtları
- `tradehub_core/hooks.py:1101`: izin sorgusu
- `tradehub_core/hooks.py:1226`: tek kayıt izni

## Bağımlılık sorunları
1. `tradehub_core/api/seller_certifications.py:521,769` mağaza bağlamı (02) tür durumunu doğrudan tablodan okuyor. Sözleşme yok. Alan adı değişirse mağaza sertifikası kırılır.
2. `tradehub_core/tradehub_core/doctype/seller_certification/seller_certification.py:17` başka bağlamın denetleyicisi bu tabloyu doğrudan okuyor.
3. Onay durumu denetleyicide değil, `api/certification.py:130-186` içinde yazılıyor. İş kuralı uç noktada kalmış.

## Hedef tasarım
- Sahip bağlam `03a-katalog`, paket yolu `tradehub_core/catalog/`. Ürün sertifikası katalog işidir. Mağaza sertifikası aynı sözlüğü kullanır. Sözlük tek yerde kalır.
- Dışarıya açılan fonksiyonlar (`catalog/api.py`): `get_certification_type(name)` durum ve kategori verir. `list_certification_types(category, status)` listeler. `suggest_certification_type(...)`, `approve_certification_type(...)`, `reject_certification_type(...)` yönetim işlemleridir.
- Yayınladığı olaylar: `catalog.certification_type_approved`, `catalog.certification_type_rejected` (name, category). Dinleyen: 02-satici-magaza bildirim için. Dinlediği olay yok.
- Başka bağlamlara bağlantılar: `Seller Certification.certification_type` Link alanı kalır. Sertifika türü kararlı bir sözlük kaydıdır. 02 bağlamı durum okumasını `get_certification_type` ile yapar.
- Denetleyicide kalacak doğrulamalar: durum geçişi ve ret gerekçesi denetleyiciye alınmalı. Bugün bu kurallar `api/certification.py:130-220` içinde.

## Geçiş adımları
1. `catalog/api.py` içine `get_certification_type` ve `list_certification_types` ekleyin.
2. `api/seller_certifications.py:521,769` ve `seller_certification.py:17` okumalarını 1. adımdaki fonksiyona çevirin. 1. adımdan sonra gelir.
3. Onay ve ret kuralını `certification_type.py` denetleyicisine taşıyın. `api/certification.py` ince kalır. Bağımsızdır.
4. `module` alanını "Catalog" yapın. 2. adımdan sonra gelir.

## Riskler ve testler
- Onaylanmamış tür ürüne atanamamalı. Test: "Pending" tür ile `Listing Certification` kaydı reddedilir.
- Satıcı başkasının bekleyen önerisini görmemeli. Test: izin sorgusu yalnız "Approved" ve kendi önerisini döndürür.
