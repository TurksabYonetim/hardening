# Product Attribute Value Option

- Bağlam: 03a-katalog
- Tür: Alt tablo
- Klasör: `tradehub_core/tradehub_core/doctype/product_attribute_value_option`
- Denetleyici: `tradehub_core/tradehub_core/doctype/product_attribute_value_option/product_attribute_value_option.py` (5 satır)
- Önerilen sahip bağlam: 03a-katalog

## Epic

- Epic adı: Product Attribute Value Option: 03a-katalog bağlamına taşıma
- Öncelik: Düşük
- Faz: Faz 4
- Tahmini büyüklük: Küçük

### User story

Bir geliştirici olarak, filtre seçenek etiketlerini `get_attribute` okuma modelinden almak istiyorum.
Böylece vitrin kodu alt tablo adını bilmez.

### Kabul kriterleri

- [ ] `api/listing.py` içinde `Product Attribute Value Option` adıyla `frappe.get_all` çağrısı kalmadı.
- [ ] Seçenekler `sort_order` sırasıyla dönüyor. Test var.
- [ ] `module` alanı "Catalog" oldu.
- [ ] Characterization test: `Product Attribute Value Option` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- Vitrin dosyasından alt tabloyu doğrudan okumayın.
- Seçenek sırasını vitrin tarafında değiştirmeyin.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] Sıra testi eklendi.
- [ ] Filtre testi geçiyor.
- [ ] `CODEOWNERS` katalog ekibinden inceleme istendi.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?
Bu alt tablo seçimli bir özelliğin seçeneklerini tutar. Örneğin "Renk" için "Kırmızı" ve "Mavi". Satır etiket, İngilizce etiket ve renk kodu içerir. Ana kayıt `Product Attribute` kaydıdır.

## Bugünkü bağımlılıklar
### Bu kaydın bağlandığı kayıtlar
- Link alanı yok.
### Bu kayda dokunan kod
- `tradehub_core/tradehub_core/doctype/product_attribute/product_attribute.json:89`: ana kayıt `value_options` alanında tutuyor
- `tradehub_core/tradehub_core/doctype/product_attribute/product_attribute.py:18-20`: seçimli türde en az bir satır istiyor
- `tradehub_core/api/listing.py:3024-3029`: vitrin filtresi etiket ve rengi `frappe.get_all` ile okuyor
### hooks.py kayıtları
- Kayıt yok.

## Bağımlılık sorunları
1. `tradehub_core/api/listing.py:3024` vitrin kodu alt tablo adına doğrudan gidiyor. Vitrin ayrı bağlam olursa bu okuma sınırı aşar.

## Hedef tasarım
- Sahip bağlam `03a-katalog`, paket yolu `tradehub_core/catalog/`.
- Dışarıya açılan fonksiyon: `get_attribute(code)` seçenekleri de döndürür.
- Olay yok.
- Başka bağlamlara bağlantı yok.
- Denetleyicide doğrulama yok. "En az bir seçenek" kuralı ana kayıtta kalır.

## Geçiş adımları
1. `api/listing.py:3024` okumasını `catalog.api.get_attribute` ile yapın. `Product Attribute` 1. adımından sonra gelir.
2. Ana kayıtla birlikte `module` alanını "Catalog" yapın.

## Riskler ve testler
- Filtre seçenek sırası `sort_order` ile korunmalı. Test: sıralı seçenekler aynı sırayla döner.
