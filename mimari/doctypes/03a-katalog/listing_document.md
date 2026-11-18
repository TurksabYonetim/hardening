# Listing Document

- Bağlam: 03a-katalog
- Tür: Alt tablo
- Klasör: `tradehub_core/tradehub_core/doctype/listing_document`
- Denetleyici: `tradehub_core/tradehub_core/doctype/listing_document/listing_document.py` (5 satır)
- Önerilen sahip bağlam: 03a-katalog

## Epic

- Epic adı: Listing Document: 03a-katalog bağlamına taşıma
- Öncelik: Düşük
- Faz: Faz 4
- Tahmini büyüklük: Küçük

### User story

Bir geliştirici olarak, belge adresinden ürünü `find_listing_by_document_url` ile bulmak istiyorum.
Böylece medya ve SEO kodu alt tabloyu doğrudan aramaz.

### Kabul kriterleri

- [ ] `media_public.py` ve `seo_audit.py` alt tabloya `frappe.get_all` ile gitmiyor.
- [ ] `find_listing_by_document_url` testi var.
- [ ] `module` alanı "Catalog" oldu.
- [ ] Characterization test: `Listing Document` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- Medya ya da SEO kodundan `Listing Document` tablosunu doğrudan sorgulamayın.
- `file` alanına Link tipi vermeyin. Dosya adresi metin kalır.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] Yeni fonksiyon testi eklendi.
- [ ] Medya ve SEO çağrıları değişti ve testleri geçiyor.
- [ ] `CODEOWNERS` katalog ekibinden inceleme istendi.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?
Bu alt tablo ürüne eklenen belgeleri tutar. Örneğin katalog PDF'i ya da teknik föy. Satır dosya, başlık, belge türü ve dil taşır. Ana kayıt `Listing` kaydıdır.

## Bugünkü bağımlılıklar
### Bu kaydın bağlandığı kayıtlar
- Link alanı yok. `file` alanı dosya adresidir.
### Bu kayda dokunan kod
- `tradehub_core/api/media_public.py:247`: dosya adresinden üst ürünü buluyor (08 okuyor)
- `tradehub_core/media/seo_audit.py:369`: belge dilini okuyor (08)
- `tradehub_core/seo/sitemap_generator.py:968,1013` ve `schema_builder.py:1494`: SEO okuyor (10)
### hooks.py kayıtları
- Kayıt yok.

## Bağımlılık sorunları
1. Medya (08) ve SEO (10) bağlamları tabloyu dosya adresiyle tersine arıyor (`media_public.py:247`). Dosya adresi üzerinde indeks yoksa sorgu yavaştır. Doğrulanmadı.

## Hedef tasarım
- Sahip bağlam `03a-katalog`, paket yolu `tradehub_core/catalog/`.
- Dışarıya açılan fonksiyonlar (`catalog/api.py`): `get_listing_documents(listing)` ve `find_listing_by_document_url(url)`.
- Olay yok.
- Başka bağlamlara bağlantı yok.
- Denetleyicide doğrulama yok.

## Geçiş adımları
1. `find_listing_by_document_url` yazın. `media_public.py:247` ve `seo_audit.py:369` bunu çağırır.
2. Ana kayıtla birlikte `module` alanını "Catalog" yapın.

## Riskler ve testler
- Belge adresi değişince SEO sitemap güncellenmeli. Test: belge eklenince `catalog.listing_updated` olayı çıkar.
