# Product Attribute

- Bağlam: 03a-katalog
- Tür: Ana kayıt
- Klasör: `tradehub_core/tradehub_core/doctype/product_attribute`
- Denetleyici: `tradehub_core/tradehub_core/doctype/product_attribute/product_attribute.py` (41 satır)
- Önerilen sahip bağlam: 03a-katalog

## Epic

- Epic adı: Product Attribute: 03a-katalog bağlamına taşıma
- Öncelik: Önemli
- Faz: Faz 4
- Tahmini büyüklük: Orta

### User story

Bir geliştirici olarak, özellik sözlüğünü `get_attribute` ile okumak ve etiketi `resolve_or_create_attribute` ile çözmek istiyorum.
Böylece ürün denetleyicisi sözlük kaydı oluşturmaz ve içe aktarma sözlük şemasına bağlı kalmaz.

### Kabul kriterleri

- [ ] `listing.py` içindeki otomatik oluşturma döngüsü `resolve_or_create_attribute` çağırıyor.
- [ ] `bulk_import/regex_lib.py` ve `shared_sync/projections.py` `get_attribute` ile okuyor.
- [ ] İzin kuralı netleşti: `permissions.py` ve `tenant.py` çelişmiyor. Karar raporda.
- [ ] "Renk" ve "renk" aynı koda çözülüyor. Test var.
- [ ] `module` alanı "Catalog" oldu.
- [ ] Characterization test: `Product Attribute` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- `listing.py` içinden `frappe.new_doc("Product Attribute")` ile yetki atlayarak kayıt açmayın.
- İçe aktarma ya da paylaşım kodundan `frappe.get_doc("Product Attribute")` ile tam kayıt okumayın.
- Seçimli tür için boş seçenek listesine izin vermeyin.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] Seçenek, sayısal sınır, regex ve varyant ekseni testleri geçiyor.
- [ ] Etiket çözüm testi eklendi.
- [ ] İzin kararı için çapraz kullanıcı testi eklendi.
- [ ] `import-linter` geçiyor.
- [ ] `CODEOWNERS` katalog ekibinden inceleme istendi.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?
Product Attribute bir ürün özelliğinin tanımıdır. Örneğin "Renk" ya da "Güç (W)". Kayıt veri türünü, seçenek listesini ve filtre ayarını tutar. Ürün kartındaki özellik satırları bu kayda bağlanır.

## Bugünkü bağımlılıklar
### Bu kaydın bağlandığı kayıtlar
- Alt tablo `Product Attribute Value Option` (value_options): aynı bağlam
- Bu kayda bağlanan satırlar: `Listing Attribute Value`, `Attribute Set Item`, `Product Family Attribute` (hepsi 03a)
### Bu kayda dokunan kod
- `tradehub_core/tradehub_core/doctype/product_attribute/product_attribute.py:12-41`: seçenek, sayısal sınır, regex ve varyant ekseni kontrolleri
- `tradehub_core/tradehub_core/doctype/listing/listing.py:276-282`: ürün kaydı sırasında eksik özelliği otomatik oluşturuyor (yazıyor, `ignore_permissions=True`)
- `tradehub_core/bulk_import/regex_lib.py:882-884`: içe aktarma regex kütüphanesi kaydı okuyor (03b)
- `tradehub_core/bulk_import/ingestion/resolver.py:61` ve `persister.py:624`: içe aktarma okuyor (03b)
- `tradehub_core/shared_sync/operations.py:343` ve `projections.py:476`: paylaşım bağlamı okuyor
- `tradehub_core/api/listing.py:3026`: vitrin filtresi seçenek etiketlerini okuyor
- `tradehub_core/permissions.py:1417-1435`: satıcı yalnız kendi oluşturduğu özelliği görür
- `tradehub_core/utils/tenant.py:72`: satıcı izolasyonundan muaf
### hooks.py kayıtları
- `tradehub_core/hooks.py:1107`: izin sorgusu
- `tradehub_core/hooks.py:1231`: tek kayıt izni

## Bağımlılık sorunları
1. `tradehub_core/tradehub_core/doctype/listing/listing.py:276-282` ürün denetleyicisi sözlük kaydını yetki atlayarak oluşturuyor. Bu, aynı bağlam içinde olsa da denetleyiciyi şişirir. Yanlış yazılmış etiket yeni sözlük kaydı üretir.
2. `tradehub_core/permissions.py:1417-1425` izin "oluşturan kullanıcı" ile sınırlı. `tenant.py:72` ise kaydı "herkese açık katalog" sayıyor. İki kural birbiriyle çelişiyor. Satıcı başkasının oluşturduğu "Renk" özelliğini listede göremez.
3. `tradehub_core/bulk_import/regex_lib.py:884` içe aktarma bağlamı `frappe.get_doc` ile tam kaydı okuyor. Sözleşme yok.

## Hedef tasarım
- Sahip bağlam `03a-katalog`, paket yolu `tradehub_core/catalog/`.
- Dışarıya açılan fonksiyonlar (`catalog/api.py`): `get_attribute(code)` tür, seçenekler ve etiketi verir. `resolve_or_create_attribute(label)` etiketi koda çevirir, yoksa oluşturur. `list_filterable_attributes()` vitrin filtresi için listeler.
- Yayınladığı olay: `catalog.attribute_changed` (attribute_code). Paylaşım ve içe aktarma önbelleklerini düşürmek için. Dinlediği olay yok.
- Başka bağlamlara bağlantılar: Bu kayda dışarıdan Link yok. İçe aktarma ve paylaşım `get_attribute` ile okur.
- Denetleyicide kalacak doğrulamalar: dört kontrol de kalır. Servise taşınacak iş kuralı: `listing.py:261-284` otomatik oluşturma `resolve_or_create_attribute` fonksiyonuna taşınır.

## Geçiş adımları
1. `catalog/api.py` içine `get_attribute` ve `resolve_or_create_attribute` ekleyin.
2. `listing.py:261-284` içindeki döngü 1. adımdaki fonksiyonu çağırır. 1. adımdan sonra gelir.
3. `bulk_import/regex_lib.py:884` ve `shared_sync/projections.py:476` okumalarını `get_attribute` ile değiştirin. 1. adımdan sonra gelir.
4. İzin kuralını netleştirin: sözlük herkese açık mı, sahibine mi özel? Karar sonrası `permissions.py:1417` ya da `tenant.py:72` düzeltilir.
5. `module` alanını "Catalog" yapın. 3. adımdan sonra gelir.

## Riskler ve testler
- Seçimli özellik seçeneksiz kaydedilememeli. Test: `data_type="Select"` ve boş seçenek listesi reddedilir.
- Serbest metin etiketi aynı koda çözülmeli. Test: "Renk" ve "renk" aynı `attribute_code` verir.
- Satıcının göremediği özellik ürün kaydını engellememeli. Test: başka kullanıcının özelliğiyle ürün kaydedilir.
