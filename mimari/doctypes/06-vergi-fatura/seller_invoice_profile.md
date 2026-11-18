# Seller Invoice Profile

- Bağlam: 06-vergi-fatura
- Tür: Ana kayıt
- Klasör: `tradehub_core/tradehub_core/doctype/seller_invoice_profile`
- Denetleyici: `tradehub_core/tradehub_core/doctype/seller_invoice_profile/seller_invoice_profile.py` (13 satır)
- Önerilen sahip bağlam: 06-vergi-fatura

## Epic

- Epic adı: Seller Invoice Profile: 06-vergi-fatura bağlamına taşıma
- Öncelik: Önemli
- Faz: Faz 3
- Tahmini büyüklük: Küçük

### User story

Bir satıcı olarak, belgelerimde doğru vergi numarasının görünmesini istiyorum.
Böylece alıcı belgeyi kabul eder.

### Kabul kriterleri

- [ ] Asıl vergi kimliği kaynağı belgede yazılı.
- [ ] Profil `tax.api.get_invoice_profile` ile okunuyor.
- [ ] `store.deleted` olayı profili temizliyor.
- [ ] Mağaza vergi numarası değişince yeni proforma yeni değeri gösteriyor.
- [ ] Characterization test: `Seller Invoice Profile` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- Mağaza kaydındaki vergi alanlarını fatura kodundan yazmayın.
- Satıcı başına ikinci profil açmayın. Kayıt adı satıcı kodudur.
- Banka alanlarını profile eklemeyin. Banka verisi ödeme bağlamındadır.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] Vergi numarası testi eklendi.
- [ ] İzin testi geçiyor.
- [ ] Mağaza ekibinden görüş alındı.
- [ ] `ruff` kontrolü geçiyor.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?
`Seller Invoice Profile` satıcının belge görünüm ayarlarını tutar. Ayarlar ad, adres, vergi dairesi ve vergi numarasıdır. Şablon, renk ve logo tercihi de buradadır. Her satıcının tek profili olur.

## Bugünkü bağımlılıklar
### Bu kaydın bağlandığı kayıtlar
- `Admin Seller Profile` (`seller`): başka bağlam (02-satici-magaza)

### Bu kayda dokunan kod
- `tradehub_core/invoice_documents/service.py:385`: yazıyor (`save_profile`)
- `tradehub_core/invoice_documents/service.py:89`: okuyor (`profile_values`)
- `tradehub_core/invoice_documents/permissions.py:22`: izin denetimi
- `tradehub_core/listing_purge/plan.py:58`: mağaza silme planında okunuyor

### hooks.py kayıtları
- `hooks.py:1582` ve `hooks.py:1585`: liste ve kayıt izni.

## Bağımlılık sorunları
1. `tax_id` ve `tax_office` alanları `Admin Seller Profile` kaydında da var (`invoice_documents/service.py:97`). İki kaynak ayrışabilir. Hangisinin asıl olduğu belgede yazılmalı. Bu nokta doğrulanmadı.

## Hedef tasarım
- Sahip bağlam: 06-vergi-fatura. Paket yolu: `tradehub_core/tax/invoicing/`.
- Dışarıya açılan fonksiyonlar: `tax.api.get_invoice_profile(seller)` ve `tax.api.save_invoice_profile(seller, data)`.
- Dinlediği olaylar: `store.deleted` (02-satici-magaza). Profil silinir.
- `seller` Link alanı kalır.
- Kural: vergi kimliği mağaza kaydından okunur. Profildeki alan yalnız görünüm için kullanılır. Bu bir öneridir, iş kararı gerekir.

## Geçiş adımları
1. Asıl vergi kimliği kaynağını ürün sahibiyle netleştirin.
2. Kaydı `Order Invoice Document` ile birlikte taşıyın.
3. `store.deleted` olayı tanımlanınca temizlik işleyicisini ekleyin.

## Riskler ve testler
- Belgede yanlış vergi numarası çıkabilir. Test: mağaza vergi numarası değişince yeni proforma yeni değeri göstermeli.
