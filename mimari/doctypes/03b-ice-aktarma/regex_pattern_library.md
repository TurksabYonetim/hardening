# Regex Pattern Library

- Bağlam: 03b-ice-aktarma
- Tür: Ana kayıt (ayar)
- Klasör: `tradehub_core/tradehub_core/doctype/regex_pattern_library`
- Denetleyici: `tradehub_core/tradehub_core/doctype/regex_pattern_library/regex_pattern_library.py` (47 satır)
- Önerilen sahip bağlam: 03b-ice-aktarma

## Epic

- Epic adı: Regex Pattern Library: 03b-ice-aktarma bağlamına taşıma
- Öncelik: Önemli
- Faz: Faz 4
- Tahmini büyüklük: Orta

### User story

Bir satıcı olarak, dosyamdaki sütun başlıklarının her yüklemede doğru alana gitmesini istiyorum.
Böylece katalog alan adı değişince kurallarım sessizce yanlış alana yazmaz.

### Kabul kriterleri

- [ ] `get_canonical_fields` hedef alanları `catalog/contracts.py` içindeki `LISTING_IMPORT_FIELDS` listesinden okuyor.
- [ ] Sözleşme dışı `target_field` doğrulamada reddediliyor. Test var.
- [ ] `hooks.py:905-909` kancaları denetleyici metotlarına taşındı.
- [ ] Tohum kuralları `import_pipeline/setup.py` içinde tek fonksiyon.
- [ ] `regex_lib.py` `Product Attribute` kaydını `catalog.api.get_attribute` ile okuyor.
- [ ] Characterization test: `Regex Pattern Library` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- Katalog alan adlarını kodda sabit yazmayın. Sözleşmeden okuyun.
- Tehlikeli desen kontrolünü (`(.+)+`) kaldırmayın. Sunucu kilitlenir.
- Yeni sistem kuralını ayrı yama dosyasıyla eklemeyin. `setup.py` tek kaynak.
- Satıcı rolüne sistem kuralı yazma izni vermeyin.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] Satıcı kuralı önceliği testi geçiyor.
- [ ] Sözleşme dışı alan testi eklendi.
- [ ] Tehlikeli regex testi geçiyor.
- [ ] Önbellek düşürme denetleyici testi var.
- [ ] `CODEOWNERS` içe aktarma ve katalog ekiplerinden inceleme istendi.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?
Regex Pattern Library toplu yüklemede sütun başlığı tanıma kurallarını tutar. Örneğin "Ürün Adı" başlığını `title` alanına eşler. Sistem kuralı herkes için geçerlidir. Satıcı kendi kuralını da ekler. Dosya adından stok kodu çıkarma ve fiyat biçimi kuralları da buradadır.

## Bugünkü bağımlılıklar
### Bu kaydın bağlandığı kayıtlar
- `DocType` (target_doctype, varsayılan "Listing"): Frappe çekirdek kaydı
- `Admin Seller Profile` (seller_profile): başka bağlam (02-satici-magaza)
- `User` (last_modified_by): başka bağlam (01-kimlik-erisim)
- Alt tablo `Regex Pattern Entry` (patterns): aynı bağlam
### Bu kayda dokunan kod
- `tradehub_core/tradehub_core/doctype/regex_pattern_library/regex_pattern_library.py:19-47`: kapsam bağı ve tehlikeli desen kontrolü
- `tradehub_core/bulk_import/regex_lib.py:11,64,135,187`: desen çözümü ve önbellek
- `tradehub_core/bulk_import/regex_lib.py:267,343,480,590,678`: satıcı ve sistem kuralı kaydetme ve silme uç noktaları
- `tradehub_core/bulk_import/regex_lib.py:882-884`: hedef alan değerleri için `Product Attribute` okuyor (03a)
- `tradehub_core/permissions.py:2106-2131`: satıcı sistem kuralını okur, kendi kuralını yazar
- Yamalar: `03_seed_regex_patterns.py`, `08_seed_regex_patterns_extended.py`, `09_seed_variant_regex_patterns.py`, `v15_9_80_mogem654_gtin_kanonik_alan.py`, `v15_9_100_mogem1086_ic_barkod.py` sistem kurallarını tohumluyor
### hooks.py kayıtları
- `tradehub_core/hooks.py:905-909`: `on_update`, `on_trash`, `after_insert` desen önbelleğini düşürür
- `tradehub_core/hooks.py:1124,1247`: izin sorgusu ve tek kayıt izni

## Bağımlılık sorunları
1. `target_field` değerleri `Listing` alan adlarıdır (`regex_lib.py:222` `get_canonical_fields`). Katalog alan adı değişirse sistem kuralı sessizce yanlış alana yazar. Sözleşme yok.
2. `tradehub_core/bulk_import/regex_lib.py:882-884` sözlük kaydını (03a) `frappe.get_doc` ile tam okuyor.
3. Tohum kuralları beş ayrı yamada dağılmış. Kural kaynağı tek yerde değil.

## Hedef tasarım
- Sahip bağlam `03b-ice-aktarma`, paket yolu `tradehub_core/import_pipeline/`.
- Dışarıya açılan fonksiyonlar (`import_pipeline/api.py`): `resolve_column_mapping(headers, seller_profile)` ve `extract_sku_from_filename(filename, seller_profile)`. Bugün `regex_lib.py:11,64` içinde.
- Olay yok. Önbellek düşürme kendi denetleyicisinde kalır (`hooks.py:905` denetleyiciye alınır).
- Başka bağlamlara bağlantılar: `seller_profile` Link kalır. Hedef alan listesi `catalog/contracts.py` içindeki `LISTING_IMPORT_FIELDS` sözleşmesinden okunur. Katalog bu listeyi değiştirince CI testi kırılır.
- Denetleyicide kalacak doğrulamalar: kapsam bağı, uzunluk, tehlikeli desen, derleme. Önbellek düşürme `on_update` metoduna taşınır.

## Geçiş adımları
1. `catalog/contracts.py` içine `LISTING_IMPORT_FIELDS` ekleyin (03a ekibi). `get_canonical_fields` buradan okur.
2. `hooks.py:905-909` kancalarını denetleyici `on_update`, `on_trash`, `after_insert` metotlarına taşıyın. Bağımsızdır.
3. Tohum kurallarını `import_pipeline/setup.py` içinde tek fonksiyona toplayın. Bağımsızdır.
4. `regex_lib.py:884` okumasını `catalog.api.get_attribute` ile değiştirin.
5. `module` alanını "Import Pipeline" yapın.

## Riskler ve testler
- Satıcı kuralı sistem kuralını ezmeli. Test: aynı başlık için satıcı kuralı önce eşleşir.
- Katalog alanı silinince sistem kuralı kırılmalı (sessiz kalmamalı). Test: `LISTING_IMPORT_FIELDS` dışındaki `target_field` doğrulamada reddedilir.
- Tehlikeli regex kaydedilememeli. Test: `(.+)+` deseni reddedilir.
