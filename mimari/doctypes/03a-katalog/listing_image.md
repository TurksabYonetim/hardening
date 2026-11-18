# Listing Image

- Bağlam: 03a-katalog
- Tür: Alt tablo
- Klasör: `tradehub_core/tradehub_core/doctype/listing_image`
- Denetleyici: `tradehub_core/tradehub_core/doctype/listing_image/listing_image.py` (5 satır)
- Önerilen sahip bağlam: 03a-katalog

## Epic

- Epic adı: Listing Image: 03a-katalog bağlamına taşıma
- Öncelik: Önemli
- Faz: Faz 4
- Tahmini büyüklük: Orta

### User story

Bir geliştirici olarak, ürün görsellerini `get_listing_images_bulk` ve `replace_listing_images` ile yönetmek istiyorum.
Böylece dört bağlam alt tabloyu doğrudan okumaz ve paylaşım kodu ana görsel kuralını atlamaz.

### Kabul kriterleri

- [ ] `api/tailored.py`, `api/rfq.py`, `sitemap_generator.py` görselleri `get_listing_images_bulk` ile okuyor.
- [ ] `shared_sync/media.py` görselleri `replace_listing_images` ile yazıyor.
- [ ] Medya kancaları `catalog.listing_images_changed` ve `media.image_redirected` olaylarında.
- [ ] Ana görsel boşken ilk ek görsel seçiliyor. Test var.
- [ ] Characterization test: `Listing Image` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- Paylaşım bağlamından `Listing Image` satırlarını `frappe.db.delete` ile silmeyin.
- Vitrin ya da teklif kodundan alt tabloyu `frappe.get_all` ile okumayın.
- `hooks.py` içine medya kancası eklemeyin. Olay dinleyicisi yazın.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] Toplu okuma ve toplu yazma testleri eklendi.
- [ ] Olay sözleşme testi eklendi.
- [ ] Ana görsel testi geçiyor.
- [ ] `CODEOWNERS` katalog ve medya ekiplerinden inceleme istendi.
- [ ] Ruff lint temiz.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?
Bu alt tablo ürünün ek görsellerini tutar. Satır görsel adresi, alternatif metin ve sırayı içerir. Ana kayıt `Listing` kaydıdır. İlk görsel boş `primary_image` alanını doldurur.

## Bugünkü bağımlılıklar
### Bu kaydın bağlandığı kayıtlar
- Link alanı yok. `image` alanı dosya adresidir.
### Bu kayda dokunan kod
- `tradehub_core/tradehub_core/doctype/listing/listing.py:286-304`: ilk görseli ana görsel yapıyor
- `tradehub_core/shared_sync/media.py:446-460`, `projections.py:303,341`, `catalog.py:945`: paylaşım bağlamı satırları siliyor, sırasını yazıyor, yeni satır ekliyor
- `tradehub_core/media/seo.py:446-460`: medya bağlamı (08) `media_role` alanını okuyor (alan varsa)
- `tradehub_core/media/pipeline/policy/slots/product-image.json:21`: medya işleme politikası bu tabloyu hedef alıyor
- `tradehub_core/api/tailored.py:79,402,544`, `api/rfq.py:296,479,812`: vitrin ve teklif görselleri okuyor (04, 09)
- `tradehub_core/api/media_manifest.py:1574`, `api/listing.py:4168,4322`: okuyor
- `tradehub_core/seo/sitemap_generator.py:1057`: görsel sitemap okuyor (10)
- `tradehub_core/bulk_import/export.py:271`: dışa aktarma okuyor (03b)
### hooks.py kayıtları
- Kayıt yok. `Listing.on_update` içindeki `media.kare.on_listing_update` (`hooks.py:608`) görselleri işliyor.

## Bağımlılık sorunları
1. `tradehub_core/shared_sync/media.py:449,457,460` paylaşım bağlamı satırları `frappe.db.delete`, `set_value` ve `get_doc().insert` ile doğrudan yazıyor. Katalog `_ensure_primary_image` kuralı atlanır.
2. `tradehub_core/media/seo.py:446` medya bağlamı `has_column` ile alan varlığını kontrol ediyor. Şemada `media_role` alanı yok. Özel alan (custom field) üzerinden eklenmiş olabilir. Doğrulanmadı.
3. Dört bağlam (04, 09, 10, 03b) görselleri `frappe.get_all("Listing Image")` ile okuyor. Okuma modeli yok.

## Hedef tasarım
- Sahip bağlam `03a-katalog`, paket yolu `tradehub_core/catalog/`.
- Dışarıya açılan fonksiyonlar (`catalog/api.py`): `get_listing_images(listing)` ve `get_listing_images_bulk(listings)` sıralı görsel listesi verir. `replace_listing_images(listing, rows)` paylaşım için toplu yazma yapar.
- Yayınladığı olay: `catalog.listing_images_changed` (listing). Medya (08) ve SEO (10) bu olayı dinler. Dinlediği olay: `media.image_redirected` (eski adres, yeni adres). Bugün `media.kare.yonlendirilmis_gorselleri_esle` `validate` kancasıyla yapıyor (`hooks.py:584`).
- Başka bağlamlara bağlantı yok. Görsel adresi `Data` olarak kalır.
- Denetleyicide doğrulama yok. `_ensure_primary_image` ana kayıtta kalır.

## Geçiş adımları
1. `catalog/api.py` içine `get_listing_images_bulk` ekleyin. `api/tailored.py`, `api/rfq.py`, `sitemap_generator.py` okumalarını buna çevirin.
2. `replace_listing_images` ekleyin. `shared_sync/media.py:446-460` bunu çağırır. 1. adımdan bağımsızdır.
3. Medya kancalarını (`hooks.py:584,608`) olaylara taşıyın. Outbox gerekir.

## Riskler ve testler
- Ana görsel boşken ilk ek görsel seçilmeli. Test: `sort_order` en düşük satır `primary_image` olur.
- Paylaşımdan gelen görsel listesi yerel sırayı korumalı. Test: `replace_listing_images` `idx` değerlerini doğru yazar.
