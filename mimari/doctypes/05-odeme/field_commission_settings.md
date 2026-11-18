# Field Commission Settings

- Bağlam: 05-odeme
- Tür: Ayar (single)
- Klasör: `tradehub_core/tradehub_core/doctype/field_commission_settings`
- Denetleyici: `tradehub_core/tradehub_core/doctype/field_commission_settings/field_commission_settings.py` (8 satır)
- Önerilen sahip bağlam: 02-satici-magaza, `Field Commission` ile birlikte

## Epic

- Epic adı: Field Commission Settings: 02-satici-magaza bağlamına taşıma
- Öncelik: Düşük
- Faz: Faz 4
- Tahmini büyüklük: Küçük

### User story

Bir geliştirici olarak, hakediş ayarının geçmiş kayıtları değiştirmemesini istiyorum.
Böylece eski ödemeler sabit kalır.

### Kabul kriterleri

- [ ] Ayar `Field Commission` ile aynı PR içinde taşındı.
- [ ] Dönem değişikliği geçmiş hakedişi değiştirmiyor.
- [ ] Ayar ekranı çalışıyor.
- [ ] Characterization test: `Field Commission Settings` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- Ayar değişince geçmiş hakedişi yeniden hesaplamayın.
- Para birimini kayıtlı hakedişlerde değiştirmeyin.
- Ayarı koda gömülü değerle ezmeyin.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] Dönem değişikliği testi eklendi.
- [ ] `ruff` kontrolü geçiyor.
- [ ] Mağaza ekibinden inceleme istendi.
- [ ] `CODEOWNERS` kaydı güncellendi.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?
`Field Commission Settings` saha hakedişi için genel ayardır. Ayar para birimini ve kota dönemini tutar. Kota dönemi aylık, çeyreklik ya da yıllık olabilir.

## Bugünkü bağımlılıklar
### Bu kaydın bağlandığı kayıtlar
- `Currency` (`currency`): framework kaydı

### Bu kayda dokunan kod
- `tradehub_core/api/v1/field_commission.py:204`: yazıyor (ayar kaydı)
- `tradehub_core/api/v1/field_commission.py:190`: okuyor
- `tradehub_core/tradehub_core/utils/field_commission.py:39`: okuyor (`quota_period`)

### hooks.py kayıtları
- Kayıt yok.

## Bağımlılık sorunları
Önemli bir bağımlılık sorunu bulunmadı.

## Hedef tasarım
- Sahip bağlam: 02-satici-magaza. Paket yolu: `tradehub_core/stores/field_sales/`.
- Dışarıya açılan fonksiyon ve olay yoktur.

## Geçiş adımları
1. `Field Commission` ile aynı PR içinde taşıyın.

## Riskler ve testler
- Dönem değişince eski bonuslar yeniden hesaplanabilir. Test: dönem değişikliği geçmiş hakedişi değiştirmemeli.
