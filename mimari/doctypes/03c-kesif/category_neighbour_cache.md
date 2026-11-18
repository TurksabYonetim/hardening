# Category Neighbour Cache

- Bağlam: 03c-kesif
- Tür: Kayıt defteri (hesaplanmış önbellek)
- Klasör: `tradehub_core/tradehub_core/doctype/category_neighbour_cache`
- Denetleyici: `tradehub_core/tradehub_core/doctype/category_neighbour_cache/category_neighbour_cache.py` (16 satır)
- Önerilen sahip bağlam: 03c-kesif

## Epic

- Epic adı: Category Neighbour Cache: 03c-kesif bağlamına taşıma
- Öncelik: Düşük
- Faz: Faz 4
- Tahmini büyüklük: Küçük

### User story

Bir geliştirici olarak, kategori benzerlik kenarlarının `catalog.category_deleted` olayıyla temizlenmesini istiyorum.
Böylece katalog kodu keşif tablosuna dokunmaz.

### Kabul kriterleri

- [ ] `category_delete.py:306-307` satırları kaldırıldı.
- [ ] Kategori silinince iki yöndeki kenar siliniyor. Test var.
- [ ] `module` alanı "Discovery" oldu.
- [ ] Characterization test: `Category Neighbour Cache` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- Katalog servisinden bu tabloyu silmeyin.
- Bileşik indeksi (`category, similarity`) kaldırmayın. Sıcak yol sorgusu buna bağlı.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] İki yönlü silme testi eklendi.
- [ ] İndeks yaması korunuyor.
- [ ] `CODEOWNERS` keşif ekibinden inceleme istendi.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?
Category Neighbour Cache iki kategori arasındaki benzerlik puanını tutar. Vektör hesabı bitince bu tablo doldurulur. Öneri motoru "benzer kategoriler" sorusunu bu tablodan hızlı okur.

## Bugünkü bağımlılıklar
### Bu kaydın bağlandığı kayıtlar
- `Product Category` (category, neighbour_category): başka bağlam (03a-katalog)
### Bu kayda dokunan kod
- `tradehub_core/recommendations/neighbour_cache.py:32,141,174`: yeniden kurma, yazma ve kategori bazlı silme
- `tradehub_core/recommendations/embeddings.py:161-191`: okuma ve yeniden kurma tetikleme
- `tradehub_core/services/category_delete.py:29,306-307`: katalog servisi satırları doğrudan siliyor
- `tradehub_core/api/recommendations.py:116`: yönetici durum ekranı sayıyor
### hooks.py kayıtları
- `tradehub_core/hooks.py:418`: haftalık görev `build_category_embeddings` sonunda `neighbour_cache.rebuild_all` çağırır (yorum satır 416-417)
- `tradehub_core/hooks.py:638`: `Product Category.on_trash` temizliği

## Bağımlılık sorunları
1. `tradehub_core/services/category_delete.py:306-307` katalog servisi keşif tablosunu doğrudan siliyor. `Category Embedding` ile aynı sorun.
2. İki Link alanı kategori silmeyi kilitleyebilir. Temizlik kancası bunu önlüyor ancak kanca sırası kritik.

## Hedef tasarım
- Sahip bağlam `03c-kesif`, paket yolu `tradehub_core/discovery/recommendations/`.
- Dışarıya açılan fonksiyon gerekmez.
- Olay yok. Dinlediği olay: `catalog.category_deleted` (iki yönlü satır silme).
- Başka bağlamlara bağlantılar: iki Link alanı kalır ya da `Data` olur. Önbellek kaydı kategori ömrünü etkilememeli.
- Denetleyicide doğrulama yok.

## Geçiş adımları
1. `Category Embedding` ile birlikte `catalog.category_deleted` dinleyicisine taşıyın.
2. `module` alanını "Discovery" yapın.

## Riskler ve testler
- Kategori silinince her iki yöndeki kenar silinmeli. Test: `category` ve `neighbour_category` filtreleri boş döner.
