# Issued Barcode

- Bağlam: 07-lojistik
- Tür: Kayıt defteri (log)
- Klasör: `tradehub_core/tradehub_core/doctype/issued_barcode`
- Denetleyici: `tradehub_core/tradehub_core/doctype/issued_barcode/issued_barcode.py` (19 satır)
- Önerilen sahip bağlam: 03a-katalog. Kayıt ürün ve varyant için verilen iç barkodları tutar. Sevkiyatla bağı yoktur.

## Epic

- Epic adı: Issued Barcode: 03a-katalog bağlamına taşıma
- Öncelik: Önemli
- Faz: Faz 4
- Tahmini büyüklük: Küçük

### User story

Bir geliştirici olarak, iç barkod sicilinin katalog paketinde durmasını istiyorum.
Böylece ürün ekibi barkod kodunu kendi alanında yönetir.

### Kabul kriterleri

- [ ] `utils/internal_barcode.py` katalog paketine taşındı. Eski yolda yönlendiren içe aktarma kaldı.
- [ ] `api/sku.py` ve `Listing` denetleyicisi yeni yoldan içe aktarıyor.
- [ ] Aynı kod iki kez verilemiyor. Bunu bir test gösteriyor.
- [ ] Taşıma önerisi bağlam haritası sahibine iletildi.
- [ ] Characterization test: `Issued Barcode` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- Satıcıya bu kayda yazma yetkisi vermeyin. Sicil yalnız barkod modülünden yazılır.
- Kapalı kodu yeniden vermeyin.
- Bağlam haritasını bu epic içinde değiştirmeyin.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] Barkod tekillik testi geçiyor.
- [ ] `api/sku.py` çağrı testi eklendi.
- [ ] Katalog ekibinden `CODEOWNERS` incelemesi istendi.
- [ ] `import-linter` kontrolü geçiyor.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?

`Issued Barcode` platformun ürünlere verdiği iç barkodların sicilidir. Bir kod bir kez verilir ve bir daha kullanılmaz. Kayıtta satıcı, ürün ve varyant bilgisi vardır.

## Bugünkü bağımlılıklar

### Bu kaydın bağlandığı kayıtlar

- Link alanı yok. `seller_profile` ve `listing` alanları düz metin (`Data`) olarak tutulur.
- Bu alanlar mantıksal olarak `Admin Seller Profile` (02-satici-magaza) ve `Listing` (03a-katalog) kayıtlarını gösterir.

### Bu kayda dokunan kod

- `tradehub_core/utils/internal_barcode.py:115`: yazıyor. Sicil yalnız bu modülden yazılır.
- `tradehub_core/api/sku.py:21`: modülü kullanıyor.
- `tradehub_core/tradehub_core/doctype/listing/listing.py:145`: ürün kaydı barkodu doğruluyor.
- `tradehub_core/tradehub_core/doctype/listing/listing.py:154`: ürün kaydı barkodu kapatıyor.
- `tradehub_core/tradehub_core/doctype/issued_barcode/issued_barcode.py:10`: denetleyici aynı modülü kullanıyor.

### hooks.py kayıtları

- Kayıt yok.

## Bağımlılık sorunları

1. Kayıt yanlış bağlamda sayılmış. Bütün kullanıcılar katalog kodudur (`tradehub_core/tradehub_core/doctype/listing/listing.py:145`). Lojistik ekibi bu kaydı değiştirirse ürün kaydı bozulur.
2. Satıcı ve ürün alanları Link değil, düz metin. Ürün silinince sicil satırı boşa düşmez. Bu bilinçli bir tercih olabilir. Gerekçe kodda bulunamadı, doğrulanmadı.

## Hedef tasarım

- Sahip bağlam ve paket yolu: 03a-katalog, örneğin `tradehub_core/catalog/doctype/issued_barcode/`.
- Dışarıya açılan fonksiyonlar (`tradehub_core/catalog/api.py`): `issue_internal_barcode(seller, listing, variant_row)` ve `close_barcodes_for_listing(listing)`.
- Yayınladığı ve dinlediği olaylar: yok. Ürün kalıcı silinirse katalog kendi içinde kapatır.
- Başka bağlamlara bağlantılar: yok.
- Denetleyicide kalacak doğrulamalar: kod biçimi ve silme yasağı.

## Geçiş adımları

1. Bağlam haritasında kaydı 03a-katalog altına almayı önerin. Haritayı bu analizde değiştirmeyin.
2. `utils/internal_barcode.py` dosyasını katalog paketine taşıyın. Eski yolda yönlendiren bir içe aktarma bırakın.
3. DocType klasörünü katalog modülüne taşıyın.

## Riskler ve testler

- Aynı kod iki kez verilebilir. Tekillik testini koruyun.
- Taşıma sırasında içe aktarma yolu kırılabilir. `api/sku.py` çağrısı için test ekleyin.
