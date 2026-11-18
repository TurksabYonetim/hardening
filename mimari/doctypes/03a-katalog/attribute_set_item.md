# Attribute Set Item

- Bağlam: 03a-katalog
- Tür: Alt tablo
- Klasör: `tradehub_core/tradehub_core/doctype/attribute_set_item`
- Denetleyici: `tradehub_core/tradehub_core/doctype/attribute_set_item/attribute_set_item.py` (5 satır)
- Önerilen sahip bağlam: 03a-katalog

## Epic

- Epic adı: Attribute Set Item: 03a-katalog bağlamına taşıma
- Öncelik: Düşük
- Faz: Faz 4
- Tahmini büyüklük: Küçük

### User story

Bir geliştirici olarak, zorunlu özellik satırlarını `list_required_attributes` ile okumak istiyorum.
Böylece tamlık puanı katalog paketinin içinde kalır.

### Kabul kriterleri

- [ ] `utils/completeness.py` dosyası `catalog/completeness.py` olarak taşındı.
- [ ] Eski yoldan içe aktaran kod yok. `grep` sonucu boş.
- [ ] Zorunlu satır boşken puan 1.0 olmuyor. Test var.
- [ ] `module` alanı "Catalog" oldu.
- [ ] Characterization test: `Attribute Set Item` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- Kök `utils/` klasörüne katalog kuralı yazmayın. Kök klasör ortak alandır.
- Alt tabloya başka bağlamdan `frappe.get_all` ile gitmeyin.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] Tamlık puanı testleri taşınan dosyada geçiyor.
- [ ] Eski içe aktarma yolları düzeltildi.
- [ ] `import-linter` geçiyor.
- [ ] `CODEOWNERS` katalog ekibinden inceleme istendi.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?
Bu alt tablo bir özellik setindeki tek bir özelliği tutar. Satır özelliği, grubunu ve zorunlu olup olmadığını söyler. "Varyant ekseni" işareti o özelliğin renk ya da beden gibi seçim ekseni olduğunu söyler.

## Bugünkü bağımlılıklar
### Bu kaydın bağlandığı kayıtlar
- `Product Attribute` (attribute): aynı bağlam
### Bu kayda dokunan kod
- `tradehub_core/tradehub_core/doctype/attribute_set/attribute_set.json:59`: ana kayıt `items` alanında tutuyor
- `tradehub_core/tradehub_core/doctype/attribute_set/attribute_set.py:24-29`: tekrar eden özelliği reddediyor
- `tradehub_core/utils/completeness.py:154-159`: zorunlu satırları okuyor
### hooks.py kayıtları
- Kayıt yok.

## Bağımlılık sorunları
1. `tradehub_core/utils/completeness.py:154` doğrudan tablo adıyla okuyor. Tamlık puanı aynı bağlamda kalırsa sorun yok. Kök `utils/` klasörü ortak alandır. Bu dosya kataloğa taşınmalı.

## Hedef tasarım
- Sahip bağlam `03a-katalog`, paket yolu `tradehub_core/catalog/`.
- Dışarıya açılan fonksiyon: `list_required_attributes(set_code)`.
- Olay yok.
- Başka bağlamlara bağlantı yok.
- Denetleyicide doğrulama yok. Tekrar kontrolü ana kayıtta kalır.

## Geçiş adımları
1. `utils/completeness.py` dosyasını `catalog/completeness.py` olarak taşıyın. Eski yoldan içe aktaran kodu düzeltin.
2. Ana kayıtla birlikte `module` alanını "Catalog" yapın.

## Riskler ve testler
- Zorunlu özellik eksikse tamlık puanı düşmeli. Test: zorunlu satır boşken puan 1.0 olmaz.
