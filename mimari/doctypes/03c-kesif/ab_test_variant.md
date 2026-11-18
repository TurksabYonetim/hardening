# AB Test Variant

- Bağlam: 03c-kesif
- Tür: Alt tablo
- Klasör: `tradehub_core/tradehub_core/doctype/ab_test_variant`
- Denetleyici: `tradehub_core/tradehub_core/doctype/ab_test_variant/ab_test_variant.py` (5 satır)
- Önerilen sahip bağlam: 03c-kesif

## Epic

- Epic adı: AB Test Variant: 03c-kesif bağlamına taşıma
- Öncelik: Düşük
- Faz: Faz 5
- Tahmini büyüklük: Küçük

### User story

Bir geliştirici olarak, bu alt tablonun `Listing AB Test` ile birlikte keşif modülüne taşınmasını istiyorum.
Böylece test verisi tek pakette durur.

### Kabul kriterleri

- [ ] `module` alanı "Discovery" oldu.
- [ ] `traffic_weight` 0 ile 100 arası kontrolü denetleyicide. Test var.
- [ ] Varyant ürün silinince test "Cancelled" oluyor. Olay dinleyici testi var.
- [ ] Characterization test: `AB Test Variant` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- Ağırlık kontrolünü uç noktaya yazmayın. Denetleyici karar verir.
- Ana kayıttan ayrı PR ile taşımayın.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] Ağırlık testi geçiyor.
- [ ] Yama idempotent.
- [ ] `CODEOWNERS` keşif ekibinden inceleme istendi.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?
Bu alt tablo bir AB testindeki varyantları tutar. AB testi iki ürün kartını karşılaştıran denemedir. Satır karşılaştırılan ürün kartını ve trafik ağırlığını taşır. Ana kayıt `Listing AB Test` kaydıdır.

## Bugünkü bağımlılıklar
### Bu kaydın bağlandığı kayıtlar
- `Listing` (variant_listing): başka bağlam (03a-katalog)
### Bu kayda dokunan kod
- `tradehub_core/tradehub_core/doctype/listing_ab_test/listing_ab_test.json:22`: ana kayıt `variants` alanında tutuyor
- `tradehub_core/api/ab_testing.py:76-87`: `_evaluate_one` varyantları değerlendiriyor (okuyor). Doğrulanmadı: satır içi alan adları okunmadı.
### hooks.py kayıtları
- Kayıt yok.

## Bağımlılık sorunları
1. `variant_listing` Link alanı ürün silinirken `LinkExistsError` üretir. `listing_purge/preview.py:23` bu yüzden `Listing AB Test` kaydını özel listede tutuyor. Test geçmişi ürünün ömrüne bağlı kalmamalı.

## Hedef tasarım
- Sahip bağlam `03c-kesif`, paket yolu `tradehub_core/discovery/`.
- Dışarıya açılan fonksiyon gerekmez.
- Olay yok.
- Başka bağlamlara bağlantı: `variant_listing` Link kalır. Ürün kararlı kök kayıttır. Silinen ürün için `catalog.listing_deleted` dinleyicisi testi "Cancelled" yapar.
- Denetleyicide kalacak doğrulama: `traffic_weight` 0 ile 100 arası. Bugün bu kontrol yok.

## Geçiş adımları
1. Ana kayıtla birlikte `module` alanını "Discovery" yapın.

## Riskler ve testler
- Ağırlık toplamı anlamlı olmalı. Test: ağırlık 150 reddedilir.
