# Attribute Set Group

- Bağlam: 03a-katalog
- Tür: Alt tablo
- Klasör: `tradehub_core/tradehub_core/doctype/attribute_set_group`
- Denetleyici: `tradehub_core/tradehub_core/doctype/attribute_set_group/attribute_set_group.py` (5 satır)
- Önerilen sahip bağlam: 03a-katalog

## Epic

- Epic adı: Attribute Set Group: 03a-katalog bağlamına taşıma
- Öncelik: Düşük
- Faz: Faz 4
- Tahmini büyüklük: Küçük

### User story

Bir geliştirici olarak, grup başlıklarını `get_attribute_set` okuma modelinden almak istiyorum.
Böylece vitrin kodu alt tablo adını bilmek zorunda kalmaz.

### Kabul kriterleri

- [ ] `api/listing.py` içinde `Attribute Set Group` adıyla `frappe.get_all` çağrısı kalmadı.
- [ ] `get_attribute_set` grupları `display_order` sırasıyla döndürüyor. Test var.
- [ ] `module` alanı "Catalog" oldu.
- [ ] Characterization test: `Attribute Set Group` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- Vitrin dosyasından alt tabloyu doğrudan okumayın. Vitrin ayrı bağlam olursa sınır aşılır.
- Grup sırasını vitrin tarafında yeniden sıralamayın. Sıra kaynakta tutulur.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] Grup sırası için birim testi eklendi.
- [ ] `api/listing.py` değişikliği ürün detay testinden geçti.
- [ ] `CODEOWNERS` katalog ekibinden inceleme istendi.
- [ ] Ruff lint temiz.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?
Bu alt tablo özellik setinin içindeki başlık gruplarını tutar. Örneğin "Genel" ve "Teknik" grupları. Ürün detay sayfası özellikleri bu gruplara göre sıralar.

## Bugünkü bağımlılıklar
### Bu kaydın bağlandığı kayıtlar
- Link alanı yok.
### Bu kayda dokunan kod
- `tradehub_core/tradehub_core/doctype/attribute_set/attribute_set.json:56`: ana kayıt `groups` alanında tutuyor
- `tradehub_core/api/listing.py:4507-4512`: ürün detayında grup başlıklarını `frappe.get_all` ile okuyor
### hooks.py kayıtları
- Kayıt yok.

## Bağımlılık sorunları
1. `tradehub_core/api/listing.py:4507` alt tablo adına doğrudan gidiyor. Bu dosya ileride vitrin bağlamına ayrılabilir. O zaman bu okuma bağlam sınırını aşar.

## Hedef tasarım
- Sahip bağlam `03a-katalog`, paket yolu `tradehub_core/catalog/`.
- Dışarıya açılan fonksiyon: `get_attribute_set(set_code)` grupları da döndürür.
- Olay yok.
- Başka bağlamlara bağlantı yok.
- Denetleyicide doğrulama yok.

## Geçiş adımları
1. `api/listing.py:4507` okumasını `catalog.api.get_attribute_set` üzerinden yapın. `Attribute Set` 1. adımından sonra gelir.
2. Ana kayıtla birlikte `module` alanını "Catalog" yapın.

## Riskler ve testler
- Grup sırası değişirse ürün detayı farklı görünür. Test: `display_order` sırası korunur.
