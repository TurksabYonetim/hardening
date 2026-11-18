# Brand Featured Listing

- Bağlam: 03a-katalog
- Tür: Alt tablo
- Klasör: `tradehub_core/tradehub_core/doctype/brand_featured_listing`
- Denetleyici: `tradehub_core/tradehub_core/doctype/brand_featured_listing/brand_featured_listing.py` (5 satır)
- Önerilen sahip bağlam: 03a-katalog

## Epic

- Epic adı: Brand Featured Listing: 03a-katalog bağlamına taşıma
- Öncelik: Düşük
- Faz: Faz 5
- Tahmini büyüklük: Küçük

### User story

Bir geliştirici olarak, bu alt tablonun `Brand` ile birlikte katalog modülüne taşınmasını istiyorum.
Böylece marka sayfası verisi tek pakette durur.

### Kabul kriterleri

- [ ] `module` alanı "Catalog" oldu.
- [ ] `get_brand` öne çıkan ürün listesini döndürüyor. Test var.
- [ ] Silinen ürün bu tabloda kalmıyor. `listing_purge` kontrolü geçiyor.
- [ ] Characterization test: `Brand Featured Listing` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- 8 ürün sınırını kaldırmayın. Marka sayfası tasarımı bu sınıra göre.
- Bu tabloya ayrı uç nokta yazmayın.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] `Brand` testleri geçiyor.
- [ ] Yama idempotent.
- [ ] `CODEOWNERS` katalog ekibinden inceleme istendi.
- [ ] Ruff lint temiz.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?
Bu alt tablo marka sayfasının üstünde gösterilen ürünleri tutar. Ana kayıt `Brand` kaydıdır. En çok 8 ürün eklenebilir.

## Bugünkü bağımlılıklar
### Bu kaydın bağlandığı kayıtlar
- `Listing` (listing): aynı bağlam
### Bu kayda dokunan kod
- `tradehub_core/tradehub_core/doctype/brand/brand.py:99-109`: 8 sınırı ve tekrar kontrolü
- `tradehub_core/api/brand.py:190-195`: marka detayı için satırları okuyor
- `tradehub_core/listing_purge/preview.py:38`: ürün kalıcı silme aracı bu tabloyu "bağlı satır" sayıyor (okuyor)
### hooks.py kayıtları
- Kayıt yok.

## Bağımlılık sorunları
Önemli bir bağımlılık sorunu bulunmadı. `listing_purge` ürün silme aracı aynı bağlamın yardımcı aracıdır.

## Hedef tasarım
- Sahip bağlam `03a-katalog`, paket yolu `tradehub_core/catalog/`.
- Dışarıya açılan fonksiyon: `get_brand` çağrısı öne çıkan ürün listesini de döndürür.
- Olay yok.
- Başka bağlamlara bağlantı yok.
- Denetleyicide doğrulama yok. 8 sınırı ana kayıtta kalır.

## Geçiş adımları
1. `Brand` ana kaydıyla birlikte `module` alanını "Catalog" yapın.

## Riskler ve testler
- Silinen ürün bu tabloda kalmamalı. Test: ürün silinince satır da silinir (`listing_purge` kontrolü).
