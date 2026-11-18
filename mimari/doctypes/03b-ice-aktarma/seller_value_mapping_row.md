# Seller Value Mapping Row

- Bağlam: 03b-ice-aktarma
- Tür: Alt tablo
- Klasör: `tradehub_core/tradehub_core/doctype/seller_value_mapping_row`
- Denetleyici: `tradehub_core/tradehub_core/doctype/seller_value_mapping_row/seller_value_mapping_row.py` (7 satır)
- Önerilen sahip bağlam: 03b-ice-aktarma

## Epic

- Epic adı: Seller Value Mapping Row: 03b-ice-aktarma bağlamına taşıma
- Öncelik: Düşük
- Faz: Faz 5
- Tahmini büyüklük: Küçük

### User story

Bir geliştirici olarak, bu alt tablonun `Seller Value Mapping` ile birlikte taşınmasını istiyorum.
Böylece değer eşlemesi tek pakette durur.

### Kabul kriterleri

- [ ] `module` alanı "Import Pipeline" oldu.
- [ ] Boş `source_value` satırı reddediliyor. Test var.
- [ ] Characterization test: `Seller Value Mapping Row` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- Ana kayıttan ayrı PR ile taşımayın.
- Bu tabloya ayrı uç nokta yazmayın.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] Yama idempotent.
- [ ] Ana kayıt testleri geçiyor.
- [ ] `CODEOWNERS` içe aktarma ekibinden inceleme istendi.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?
Bu alt tablo tek bir değer eşlemesini tutar. Gelen değer ve hedef değer çiftidir. Ana kayıt `Seller Value Mapping` kaydıdır.

## Bugünkü bağımlılıklar
### Bu kaydın bağlandığı kayıtlar
- Link alanı yok.
### Bu kayda dokunan kod
- `tradehub_core/tradehub_core/doctype/seller_value_mapping/seller_value_mapping.json:67`: ana kayıt `rows` alanında tutuyor
- `tradehub_core/tradehub_core/doctype/seller_value_mapping/seller_value_mapping.py:36-47`: boş değer kontrolü
### hooks.py kayıtları
- Kayıt yok.

## Bağımlılık sorunları
Önemli bir bağımlılık sorunu bulunmadı.

## Hedef tasarım
- Sahip bağlam `03b-ice-aktarma`.
- Dışarıya açılan fonksiyon gerekmez.
- Olay yok.
- Başka bağlamlara bağlantı yok.
- Denetleyicide doğrulama yok. Boş değer kontrolü ana kayıtta kalır.

## Geçiş adımları
1. Ana kayıtla birlikte `module` alanını değiştirin.

## Riskler ve testler
- Boş gelen değer reddedilmeli. Test: `source_value` boş satır hata verir.
