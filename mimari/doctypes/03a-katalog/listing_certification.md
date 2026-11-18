# Listing Certification

- Bağlam: 03a-katalog
- Tür: Alt tablo
- Klasör: `tradehub_core/tradehub_core/doctype/listing_certification`
- Denetleyici: `tradehub_core/tradehub_core/doctype/listing_certification/listing_certification.py` (39 satır)
- Önerilen sahip bağlam: 03a-katalog

## Epic

- Epic adı: Listing Certification: 03a-katalog bağlamına taşıma
- Öncelik: Önemli
- Faz: Faz 4
- Tahmini büyüklük: Orta

### User story

Bir satıcı olarak, mağaza sertifikam silinince ürün sertifikalarımın düzgün kalkmasını istiyorum.
Böylece ürün kaydı bozulmaz ve vitrin yanlış sertifika göstermez.

### Kabul kriterleri

- [ ] `api/seller_certifications.py` bu tabloyu `frappe.delete_doc` ile silmiyor. `catalog.api.remove_*` fonksiyonlarını çağırıyor.
- [ ] `cert_validate.py` `Seller Certification` tablosunu doğrudan okumuyor. `seller_store.api.has_verified_certification` çağırıyor.
- [ ] `seller_store.certification_removed` olayı için dinleyici var ve satırları kaldırıyor. Test var.
- [ ] `cert_expiry_check.py` içindeki `verification_status` kalıntı kodu silindi.
- [ ] Yabancı satıcı satır silemiyor. Test var.
- [ ] Characterization test: `Listing Certification` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- 02 bağlamından bu alt tabloyu `frappe.delete_doc` ile silmeyin. Ürün `validate` çalışmadan değişir.
- Katalog kodundan `Seller Certification` tablosunu okumayın. API kullanın.
- Şemada olmayan alan için `has_column` kontrolü yazmayın.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] `assign_listing_certification` ve `remove_listing_certification` testleri eklendi.
- [ ] Olay dinleyicisi testi eklendi.
- [ ] Tarih sırası testi geçiyor.
- [ ] `CODEOWNERS` katalog ve mağaza ekiplerinden inceleme istendi.
- [ ] Ruff lint temiz.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?
Bu alt tablo bir ürüne atanan sertifikaları tutar. Ana kayıt `Listing` kaydıdır. Satır sertifika türünü, belge numarasını ve tarihleri içerir. Ürün sertifikası mağazanın havuzundaki onaylı sertifikadan gelir.

## Bugünkü bağımlılıklar
### Bu kaydın bağlandığı kayıtlar
- `Certification Type` (certification_type): aynı bağlam
### Bu kayda dokunan kod
- `tradehub_core/tradehub_core/doctype/listing_certification/listing_certification.py:12-39`: tür durumu ve tarih kontrolü
- `tradehub_core/utils/cert_validate.py:21-60`: `Listing.validate` kancası satırları denetliyor. Mağaza sertifikası tablosunu (`Seller Certification`, 02) okuyor.
- `tradehub_core/api/seller_certifications.py:725-738`: mağaza sertifikası silinince bu satırları `frappe.delete_doc` ile siliyor (02 kodu yazıyor)
- `tradehub_core/api/seller_certifications.py:1012-1030`: `remove_listing_cert` satırı tek tek siliyor
- `tradehub_core/api/seller_certifications.py:830,944`: ürüne sertifika atıyor (yazıyor)
- `tradehub_core/utils/cert_expiry_check.py:103-111`: süresi dolan satırı güncelliyor (alan varsa)
- `tradehub_core/api/listing.py:846,2648,2899`: vitrin okuyor
- `tradehub_core/permissions.py:1176-1188`: satır izni üst ürünün satıcısına bakıyor
### hooks.py kayıtları
- `tradehub_core/hooks.py:571`: `Listing.validate` içinde `cert_validate.validate_listing_certifications`
- `tradehub_core/hooks.py:1221`: tek kayıt izni
- `tradehub_core/hooks.py:367`: günlük zamanlayıcı `cert_expiry_check.check_certificate_expiry`

## Bağımlılık sorunları
1. `tradehub_core/api/seller_certifications.py:736,998,1029` mağaza bağlamı (02) ürünün alt tablosunu doğrudan siliyor. Bu, başka bağlamın alt tablosuna yazmaktır. Ürün kaydı `validate` çalışmadan değişir.
2. `tradehub_core/utils/cert_validate.py:55-60` katalog doğrulaması `Seller Certification` tablosunu (02) doğrudan okuyor. Mağaza sertifika şeması değişirse ürün kaydı kırılır.
3. `tradehub_core/utils/cert_expiry_check.py:43` kod `has_column` ile alan varlığını kontrol ediyor. Şemada olmayan alan (`verification_status`) için kod yazılmış. Bu kalıntı kodtur.

## Hedef tasarım
- Sahip bağlam `03a-katalog`, paket yolu `tradehub_core/catalog/`.
- Dışarıya açılan fonksiyonlar (`catalog/api.py`): `assign_listing_certification(listing, cert_type, data)` ve `remove_listing_certification(listing, cert_type)`. Bu iki fonksiyon ürünü yükler ve kaydeder. `remove_certifications_for_seller(seller_profile, cert_type)` toplu kaldırma yapar.
- Yayınladığı olay yok. Dinlediği olaylar: `seller_store.certification_removed` (seller_profile, cert_type). Dinleyici `remove_certifications_for_seller` çağırır. `seller_store.certification_verified` gerekirse ileride eklenir.
- Başka bağlamlara bağlantılar: Mağaza sertifikası durumunu `seller_store/api.has_verified_certification(seller_profile, cert_type)` ile okur. Bugün `cert_validate.py:55` doğrudan tablo okuyor.
- Denetleyicide kalacak doğrulamalar: tür durumu, tür kategorisi ve tarih sırası. Servise taşınacak iş kuralı: mağaza havuzu kontrolü (`cert_validate.py:55-60`) `seller_store` API çağrısına döner.

## Geçiş adımları
1. `seller_store/api.py` içine `has_verified_certification` ekleyin (02 ekibi). Bu adım 02 bağlamında gider.
2. `cert_validate.py:55-60` okumasını 1. adımdaki fonksiyona çevirin. 1. adımdan sonra gelir.
3. `catalog/api.py` içine `assign_listing_certification`, `remove_listing_certification`, `remove_certifications_for_seller` ekleyin. Bağımsızdır.
4. `api/seller_certifications.py:725-738,998,1029` doğrudan silmeleri 3. adımdaki fonksiyonlara çevirin. 3. adımdan sonra gelir.
5. `seller_store.certification_removed` olayını ekleyin. 4. adımdaki çağrı olay dinleyicisine döner. Outbox altyapısı gerekir.
6. `cert_expiry_check.py:43,103-111` kalıntı `verification_status` kodunu silin. Bağımsızdır.

## Riskler ve testler
- Mağaza sertifikası silinince ürün sertifikası da düşmeli. Test: olay dinleyicisi satırları kaldırır.
- Satıcı başka satıcının ürün sertifikasını silememeli. Test: `remove_listing_cert` yabancı satırda `PermissionError` verir.
- Bitiş tarihi veriliş tarihinden önce olamaz. Test: ters tarihler reddedilir.
