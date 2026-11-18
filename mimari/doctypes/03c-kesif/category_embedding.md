# Category Embedding

- Bağlam: 03c-kesif
- Tür: Kayıt defteri (hesaplanmış önbellek)
- Klasör: `tradehub_core/tradehub_core/doctype/category_embedding`
- Denetleyici: `tradehub_core/tradehub_core/doctype/category_embedding/category_embedding.py` (15 satır)
- Önerilen sahip bağlam: 03c-kesif

## Epic

- Epic adı: Category Embedding: 03c-kesif bağlamına taşıma
- Öncelik: Düşük
- Faz: Faz 4
- Tahmini büyüklük: Küçük

### User story

Bir geliştirici olarak, kategori vektörünün `catalog.category_deleted` olayıyla temizlenmesini istiyorum.
Böylece katalog silme servisi keşif tablosunu bilmez.

### Kabul kriterleri

- [ ] `category_delete.py:305` satırı kaldırıldı. Temizlik yalnız olay dinleyicisinde.
- [ ] `hooks.py:638` kancası olay dinleyicisine taşındı.
- [ ] Kategori silinince vektör siliniyor. Test var.
- [ ] `module` alanı "Discovery" oldu.
- [ ] Characterization test: `Category Embedding` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- Katalog servisinden `Category Embedding` satırı silmeyin.
- Aynı temizliği iki yerde yazmayın.
- Haftalık görevi `default` kuyruğuna almayın. `long` kuyruğunda kalır.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] Olay dinleyici testi eklendi.
- [ ] Haftalık görev testi geçiyor.
- [ ] `CODEOWNERS` keşif ekibinden inceleme istendi.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?
Category Embedding bir kategori adının sayısal vektörünü tutar. Vektör, metni sayı dizisine çeviren bir gösterimdir. Benzer kategoriler bu sayılarla bulunur. Öneri motoru satış verisi azken bu yolu kullanır.

## Bugünkü bağımlılıklar
### Bu kaydın bağlandığı kayıtlar
- `Product Category` (category): başka bağlam (03a-katalog)
### Bu kayda dokunan kod
- `tradehub_core/recommendations/embeddings.py:48,238-290`: haftalık görev vektörleri yazıyor ve okuyor
- `tradehub_core/recommendations/cleanup.py:103-105`: kategori silinince satırı siliyor
- `tradehub_core/services/category_delete.py:29,305`: kategori silme servisi (03a) satırı doğrudan siliyor
- `tradehub_core/api/recommendations.py:113`: yönetici durum ekranı sayıyor
- `tradehub_core/setup/install.py:318`: kurulum kontrolü
### hooks.py kayıtları
- `tradehub_core/hooks.py:418`: haftalık `build_category_embeddings`
- `tradehub_core/hooks.py:638`: `Product Category.on_trash` içinde `cleanup.on_product_category_trash`

## Bağımlılık sorunları
1. `tradehub_core/services/category_delete.py:305` katalog servisi keşif tablosunu doğrudan siliyor. Aynı iş `recommendations/cleanup.py:104` içinde de var. İki yer aynı temizliği yapıyor.
2. `tradehub_core/hooks.py:638` kategori silme kancası keşif koduna bağlı. Keşif kodu hata verirse kategori silinemez (kod hatayı yutuyor, `cleanup.py:33-40`).

## Hedef tasarım
- Sahip bağlam `03c-kesif`, paket yolu `tradehub_core/discovery/recommendations/`.
- Dışarıya açılan fonksiyon gerekmez. İç önbellektir. `neighbour_categories(category)` servis içi kalır.
- Olay yok. Dinlediği olaylar: `catalog.category_deleted` (satırı siler), `catalog.category_updated` (ad değişince yeniden hesaplar).
- Başka bağlamlara bağlantı: `category` Link kalır. Alternatif: `Data` yapılır. Önbellek kaydı kategori silmeyi engellememeli.
- Denetleyicide doğrulama yok.

## Geçiş adımları
1. `hooks.py:638` kancasını `catalog.category_deleted` dinleyicisine taşıyın. `category_delete.py:305` satırını kaldırın. Outbox gerekir.
2. `module` alanını "Discovery" yapın.

## Riskler ve testler
- Kategori silinince vektör silinmeli. Test: olay dinleyicisi satırı siler.
- Haftalık görev tüm aktif kategorileri yazmalı. Test: `build_all` sonrası sayı aktif kategori sayısına eşit.
