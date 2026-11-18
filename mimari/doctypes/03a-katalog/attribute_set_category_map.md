# Attribute Set Category Map

- Bağlam: 03a-katalog
- Tür: Alt tablo
- Klasör: `tradehub_core/tradehub_core/doctype/attribute_set_category_map`
- Denetleyici: `tradehub_core/tradehub_core/doctype/attribute_set_category_map/attribute_set_category_map.py` (5 satır)
- Önerilen sahip bağlam: 03a-katalog

## Epic

- Epic adı: Attribute Set Category Map: 03a-katalog bağlamına taşıma
- Öncelik: Düşük
- Faz: Faz 5
- Tahmini büyüklük: Küçük

### User story

Bir geliştirici olarak, bu alt tablonun `Attribute Set` ile birlikte katalog modülüne taşınmasını istiyorum.
Böylece özellik seti ve kategori eşlemesi tek pakette durur.

### Kabul kriterleri

- [ ] DocType JSON `module` alanı "Catalog" oldu.
- [ ] Klasör `tradehub_core/catalog/doctype/` altında.
- [ ] `tabDocType` modül değerini güncelleyen yama idempotent.
- [ ] Kategori silme servisi bu satırları hedef kategoriye taşıyor. Test geçiyor.
- [ ] Characterization test: `Attribute Set Category Map` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- Bu tabloya ayrı CRUD uç noktası yazmayın. Ana kayıt kaydı satırları zaten yazar.
- `product_category` Link alanını kaldırmayın. Kategori kararlı kök kayıttır.
- Ana kayıttan ayrı bir PR ile taşımayın. İki kayıt birlikte gider.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] Yama test sitesinde iki kez çalıştı ve hata vermedi.
- [ ] `Attribute Set` testleri geçiyor.
- [ ] `CODEOWNERS` katalog ekibinden inceleme istendi.
- [ ] Ruff lint temiz.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?
Bu alt tablo bir özellik setini ürün kategorilerine bağlar. Alt tablo, ana kaydın içinde satır satır tutulan listedir. Ana kayıt `Attribute Set` kaydıdır. "Alt ağaca uygula" seçeneği alt kategorileri de kapsar.

## Bugünkü bağımlılıklar
### Bu kaydın bağlandığı kayıtlar
- `Product Category` (product_category): aynı bağlam
### Bu kayda dokunan kod
- `tradehub_core/tradehub_core/doctype/attribute_set/attribute_set.json:62`: ana kayıt bu tabloyu `category_mappings` alanında tutuyor
- `tradehub_core/services/category_delete.py:33`: kategori silme aracı bu satırları "bağlı kayıt" olarak sayıyor (okuyor ve taşıyor)
### hooks.py kayıtları
- Kayıt yok.

## Bağımlılık sorunları
Önemli bir bağımlılık sorunu bulunmadı. Kategori silme servisi aynı bağlamdadır.

## Hedef tasarım
- Sahip bağlam `03a-katalog`, paket yolu `tradehub_core/catalog/`.
- Dışarıya açılan fonksiyon: Ayrı fonksiyon gerekmez. `get_attribute_set` çağrısı bu satırları da döndürür.
- Olay yok.
- Başka bağlamlara bağlantı yok. `product_category` Link alanı aynı bağlamda kalır.
- Denetleyicide doğrulama yok. Satır düzeyinde iş kuralı yok.

## Geçiş adımları
1. `Attribute Set` ana kaydı ile birlikte `module` alanını "Catalog" yapın. Ana kaydın 4. adımıyla aynı PR içinde gider.

## Riskler ve testler
- Kategori silinirken bu satırlar hedef kategoriye taşınmalı. Test: `category_delete.move_links` bu tabloyu hedefe taşır.
