# Field Commission Quota Tier

- Bağlam: 05-odeme
- Tür: Alt tablo
- Klasör: `tradehub_core/tradehub_core/doctype/field_commission_quota_tier`
- Denetleyici: `tradehub_core/tradehub_core/doctype/field_commission_quota_tier/field_commission_quota_tier.py` (8 satır)
- Önerilen sahip bağlam: 02-satici-magaza, `Field Commission` ile birlikte

## Epic

- Epic adı: Field Commission Quota Tier: 02-satici-magaza bağlamına taşıma
- Öncelik: Düşük
- Faz: Faz 4
- Tahmini büyüklük: Küçük

### User story

Bir geliştirici olarak, kota basamaklarının doğru bonusu vermesini istiyorum.
Böylece temsilci doğru ödeme alır.

### Kabul kriterleri

- [ ] Satır `Field Commission` ile aynı PR içinde taşındı.
- [ ] Sınıra eşit satış o basamağın bonusunu alıyor.
- [ ] Var olan basamaklar değişmedi.
- [ ] Characterization test: `Field Commission Quota Tier` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- Satırı ayar kaydı dışında yazmayın.
- Bonus tutarını negatif yapmayın.
- Basamakları koda gömmeyin.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] Basamak sınırı testi eklendi.
- [ ] `ruff` kontrolü geçiyor.
- [ ] Mağaza ekibinden inceleme istendi.
- [ ] `CODEOWNERS` kaydı güncellendi.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?
`Field Commission Quota Tier` kota bonusu basamağıdır. Satır en az satış sayısını ve bonus tutarını tutar.

## Bugünkü bağımlılıklar
### Bu kaydın bağlandığı kayıtlar
- Bağlantı alanı yok.

### Bu kayda dokunan kod
- `tradehub_core/tradehub_core/utils/field_commission.py:52`: okuyor (bonus hesabı)

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
- Bonus yanlış basamaktan hesaplanabilir. Test: satış sayısı basamak sınırına eşitse o basamağın bonusu verilmeli.
