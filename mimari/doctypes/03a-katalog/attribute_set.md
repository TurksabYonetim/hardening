# Attribute Set

- Bağlam: 03a-katalog
- Tür: Ana kayıt
- Klasör: `tradehub_core/tradehub_core/doctype/attribute_set`
- Denetleyici: `tradehub_core/tradehub_core/doctype/attribute_set/attribute_set.py` (29 satır)
- Önerilen sahip bağlam: 03a-katalog

## Epic

- Epic adı: Attribute Set: 03a-katalog bağlamına taşıma
- Öncelik: Önemli
- Faz: Faz 4
- Tahmini büyüklük: Küçük

### User story

Bir geliştirici olarak, özellik setini `catalog.api.get_attribute_set` ile okumak istiyorum.
Böylece set kodu ya da alt tablo adı değişince içe aktarma ve tamlık puanı kırılmaz.

### Kabul kriterleri

- [ ] `catalog/api.py` içinde `get_attribute_set` ve `list_required_attributes` fonksiyonları var.
- [ ] `utils/completeness.py` alt tabloya `frappe.get_all` ile gitmiyor. `list_required_attributes` çağırıyor.
- [ ] `bulk_import/persister.py` set kodunu `resolve_attribute_set_code` ile çözüyor.
- [ ] Döngü ve tekrar kontrolü için denetleyici testleri geçiyor.
- [ ] `import-linter` kontrolü `tradehub_core.catalog` için geçiyor.
- [ ] Characterization test: `Attribute Set` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- `Attribute Set Item` ve `Attribute Set Group` tablolarını başka bağlamdan `frappe.get_all` ile okumayın. Alt tablo adı değişince sessizce kırılır.
- `bulk_import` paketinden set kodunu doğrudan çözmeyin. `catalog.api` fonksiyonunu kullanın.
- Denetleyiciye yeni iş kuralı eklemeyin. Kurallar `catalog/` servisine gider.
- `hooks.py` içine bu DocType için kanca eklemeyin.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] Yeni API fonksiyonları için birim testi eklendi.
- [ ] `utils/completeness.py` ve `persister.py` çağrıları değişti ve testleri geçiyor.
- [ ] `import-linter` yerelde çalıştırıldı.
- [ ] `CODEOWNERS` katalog ekibinden inceleme istendi.
- [ ] Ruff biçimi ve lint temiz.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?
Attribute Set bir "özellik seti" kaydıdır. Bir ürün grubunda hangi özelliklerin sorulacağını tanımlar. Örneğin "Mutfak Robotu" seti güç, renk ve garanti özelliklerini içerir. Ürün kartı (Listing) bu seti `attribute_set` alanıyla seçer.

## Bugünkü bağımlılıklar
### Bu kaydın bağlandığı kayıtlar
- `Attribute Set` (parent_attribute_set): aynı bağlam
- Alt tablo `Attribute Set Group` (groups): aynı bağlam
- Alt tablo `Attribute Set Item` (items): aynı bağlam
- Alt tablo `Attribute Set Category Map` (category_mappings): aynı bağlam
### Bu kayda dokunan kod
- `tradehub_core/tradehub_core/doctype/attribute_set/attribute_set.py:11-22`: döngü kontrolü yapıyor (okuyor)
- `tradehub_core/tradehub_core/doctype/attribute_set/attribute_set.py:24-29`: aynı özelliğin iki kez eklenmesini engelliyor
- `tradehub_core/api/listing.py:4506-4512`: ürün detayında grup başlıklarını okuyor
- `tradehub_core/utils/completeness.py:154-159`: zorunlu özellik satırlarını okuyor
- `tradehub_core/bulk_import/persister.py:295`: toplu içe aktarmada Link değerini çözüyor (okuyor)
- `tradehub_core/bulk_import/api.py:674`: şablon sütununda adı geçiyor
- `tradehub_core/utils/tenant.py:73`: satıcı izolasyonundan muaf listede
### hooks.py kayıtları
- Kayıt yok. `tradehub_core/hooks.py` içinde bu ad için `doc_events` ya da izin kancası bulunmadı.

## Bağımlılık sorunları
1. `tradehub_core/bulk_import/persister.py:295` içe aktarma bağlamı (03b) bu kaydın adını doğrudan çözüyor. Bu okuma zararsızdır. Ancak sözleşmesizdir. Set kodu değişirse içe aktarma kırılır.
2. `tradehub_core/utils/completeness.py:154` alt tablo adına doğrudan `frappe.get_all` ile gidiyor. Alt tablo adı değişirse tamlık puanı sessizce bozulur.

## Hedef tasarım
- Sahip bağlam `03a-katalog`, paket yolu `tradehub_core/catalog/`. DocType JSON `module` alanı "Catalog" olur.
- Dışarıya açılan fonksiyonlar (`catalog/api.py`): `get_attribute_set(set_code)` set ve satırlarını tek sözlükte verir. `list_required_attributes(set_code)` zorunlu özellik kodlarını verir. `resolve_attribute_set_code(label)` içe aktarma için kodu bulur.
- Yayınladığı olaylar: `catalog.attribute_set_changed` (set_code). Dinlediği olay yok.
- Başka bağlamlara bağlantılar: Bu kayda dışarıdan Link yok. `Listing.attribute_set` aynı bağlamda kalır.
- Denetleyicide kalacak doğrulamalar: döngü kontrolü ve tekrar kontrolü kalır. Servise taşınacak iş kuralı yok.

## Geçiş adımları
1. `catalog/api.py` içine `get_attribute_set` ve `list_required_attributes` fonksiyonlarını ekleyin. Bu adım tek başına birleştirilir.
2. `utils/completeness.py:154` çağrısını `list_required_attributes` ile değiştirin. 1. adımdan sonra gelir.
3. `bulk_import/persister.py:295` Link çözümünü `resolve_attribute_set_code` ile yapın. 1. adımdan sonra gelir.
4. DocType JSON `module` alanını "Catalog" yapın ve klasörü `tradehub_core/catalog/doctype/` altına taşıyın. 2. ve 3. adımdan sonra gelir.

## Riskler ve testler
- Set kodu değişince ürün tamlık puanı değişebilir. Test: zorunlu özelliği olan set için `calculate_completeness_score` doğru puan verir.
- Döngü kontrolü üç seviyeli hiyerarşide çalışmalı. Test: A üstü B, B üstü A kaydı reddedilir.
