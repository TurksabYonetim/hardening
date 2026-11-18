# Approved Supplier Entry

- Bağlam: 04-siparis
- Tür: Alt tablo
- Klasör: `tradehub_core/tradehub_core/doctype/approved_supplier_entry`
- Denetleyici: `tradehub_core/tradehub_core/doctype/approved_supplier_entry/approved_supplier_entry.py` (8 satır)
- Önerilen sahip bağlam: 04-siparis, `ordering/procurement/` alt paketi

## Epic

- Epic adı: Approved Supplier Entry: 04-siparis bağlamına taşıma
- Öncelik: Düşük
- Faz: Faz 3
- Tahmini büyüklük: Küçük

### User story

Bir geliştirici olarak, tedarikçi satırındaki tutar aralığının mantıklı olmasını istiyorum.
Böylece yanlış giriş bütün siparişleri engellemez.

### Kabul kriterleri

- [ ] Satır `Approved Supplier List` ile aynı PR içinde taşındı.
- [ ] En az tutar en çok tutardan büyükse kayıt reddediliyor.
- [ ] Var olan listeler değişmeden açılıyor.
- [ ] Characterization test: `Approved Supplier Entry` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- Satırı ana kayıt dışında yazmayın. Yazım `api/v1/procurement.py` üzerinden yapılır.
- `supplier` alanını düz metne çevirmeyin. Link alanı kalır.
- Var olan ters aralıkları düzeltmeden doğrulamayı açmayın.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] Tutar aralığı testi eklendi.
- [ ] Var olan veride ters aralık sorgusu çalıştırıldı.
- [ ] `ruff` kontrolü geçiyor.
- [ ] `CODEOWNERS` sahibinden inceleme istendi.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?
`Approved Supplier Entry` onaylı tedarikçi listesinin bir satırıdır. Satır bir tedarikçiyi ve izin verilen tutar aralığını tutar. İzin verilen kategoriler `allowed_categories` alanında yazılıdır.

## Bugünkü bağımlılıklar
### Bu kaydın bağlandığı kayıtlar
- `Admin Seller Profile` (`supplier`): başka bağlam (02-satici-magaza)

### Bu kayda dokunan kod
- `tradehub_core/api/v1/procurement.py:195`: okuyor
- `tradehub_core/setup/handover_validator.py:106`: okuyor (kurulum denetimi)
- Yazım ana kayıt üzerinden yapılır (`api/v1/procurement.py:246`).

### hooks.py kayıtları
- Kayıt yok.

## Bağımlılık sorunları
Önemli bir bağımlılık sorunu bulunmadı.

## Hedef tasarım
- Sahip bağlam: 04-siparis. Paket yolu: `tradehub_core/ordering/procurement/`.
- Dışarıya açılan fonksiyon yoktur. Satır yalnız ana kayıt üzerinden okunur.
- Olay yoktur.
- `supplier` Link alanı kalır.
- Denetleyicide kalacak doğrulama: `min_order_amount` değeri `max_order_amount` değerini geçmemeli. Bu kural bugün yok.

## Geçiş adımları
1. Ana kayıtla birlikte taşıyın. Ayrı PR gerekmez.
2. Tutar aralığı doğrulamasını ekleyin. Önce testi yazın.

## Riskler ve testler
- Ters tutar aralığı bütün siparişleri engelleyebilir. Test: en az tutar en çok tutardan büyükse kayıt reddedilmeli.
