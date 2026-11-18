# Listing Attribute Value

- Bağlam: 03a-katalog
- Tür: Alt tablo
- Klasör: `tradehub_core/tradehub_core/doctype/listing_attribute_value`
- Denetleyici: `tradehub_core/tradehub_core/doctype/listing_attribute_value/listing_attribute_value.py` (5 satır)
- Önerilen sahip bağlam: 03a-katalog

## Epic

- Epic adı: Listing Attribute Value: 03a-katalog bağlamına taşıma
- Öncelik: Önemli
- Faz: Faz 4
- Tahmini büyüklük: Küçük

### User story

Bir geliştirici olarak, özellik satırlarını `replace_listing_attributes` ile toplu yazmak istiyorum.
Böylece paylaşım bağlamı alt tabloyu doğrudan silip yazmaz ve otomatik bağ çözümü atlanmaz.

### Kabul kriterleri

- [ ] `shared_sync/projections.py` bu tabloya `frappe.db.delete` ya da `set_value` ile gitmiyor.
- [ ] Çeviri alanları DocType JSON içinde. `fixtures/custom_field.json` kaydı kaldırıldı ve yama var.
- [ ] Serbest metin etiket Link alanını dolduruyor. Test var.
- [ ] `module` alanı "Catalog" oldu.
- [ ] Characterization test: `Listing Attribute Value` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- Bu alt tabloya başka bağlamdan doğrudan satır eklemeyin. Satır da silmeyin.
- Çeviri alanlarını özel alan olarak eklemeyin. Şema tek yerde tanımlı olur.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] `replace_listing_attributes` testi eklendi.
- [ ] Çeviri alanı yaması idempotent ve kolonlar korunuyor.
- [ ] Paylaşım testleri geçiyor.
- [ ] `CODEOWNERS` katalog ve paylaşım ekiplerinden inceleme istendi.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?
Bu alt tablo ürünün özellik değerlerini tutar. Örneğin "Renk: Kırmızı". Satır özelliğe bağlanır ve değeri taşır. Ana kayıt `Listing` kaydıdır.

## Bugünkü bağımlılıklar
### Bu kaydın bağlandığı kayıtlar
- `Product Attribute` (attribute): aynı bağlam
### Bu kayda dokunan kod
- `tradehub_core/tradehub_core/doctype/listing/listing.py:261-284`: eksik özellik bağını otomatik çözüyor
- `tradehub_core/shared_sync/projections.py:357,462-479`: paylaşım bağlamı satırları siliyor, yazıyor, oluşturuyor
- `tradehub_core/api/listing.py:894,2680`: vitrin okuyor
- `tradehub_core/seo/i18n.py:83,106`: SEO çeviri alanlarını okuyor (10)
- `tradehub_core/bulk_import/export.py:263`: dışa aktarma okuyor (03b)
- `tradehub_core/fixtures/custom_field.json:1012-1089`: sekiz özel alan bu tabloya eklenmiş (çeviri alanları)
### hooks.py kayıtları
- Kayıt yok.

## Bağımlılık sorunları
1. `tradehub_core/shared_sync/projections.py:466,474,479` paylaşım bağlamı satırları doğrudan yazıyor. `listing.py:261` otomatik bağ çözümü atlanır.
2. `tradehub_core/fixtures/custom_field.json:1012-1089` çeviri alanları özel alan olarak dışarıdan ekleniyor. Şema iki yerde tanımlı.

## Hedef tasarım
- Sahip bağlam `03a-katalog`, paket yolu `tradehub_core/catalog/`.
- Dışarıya açılan fonksiyonlar (`catalog/api.py`): `get_listing_attributes(listing, lang)` etiketli ve çevrili liste verir. `replace_listing_attributes(listing, rows)` toplu yazma yapar.
- Olay yok. `catalog.listing_updated` olayı yeterlidir.
- Başka bağlamlara bağlantı yok.
- Denetleyicide doğrulama yok. Otomatik bağ çözümü ana kayıtta kalır ve `resolve_or_create_attribute` çağırır.

## Geçiş adımları
1. `replace_listing_attributes` yazın. `shared_sync/projections.py:462-479` bunu çağırır.
2. Çeviri özel alanlarını DocType JSON içine alın. Fixture kaydını kaldırın. Yama gerekir.
3. Ana kayıtla birlikte `module` alanını "Catalog" yapın.

## Riskler ve testler
- Serbest metin etiket Link alanını doldurmalı. Test: `attribute` boş, `attribute_label` dolu satır kaydedilir.
- Çeviri alanları kaybolmamalı. Test: yama sonrası `attribute_value_en` kolonu var.
