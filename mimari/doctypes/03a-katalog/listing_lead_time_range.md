# Listing Lead Time Range

- Bağlam: 03a-katalog
- Tür: Alt tablo
- Klasör: `tradehub_core/tradehub_core/doctype/listing_lead_time_range`
- Denetleyici: `tradehub_core/tradehub_core/doctype/listing_lead_time_range/listing_lead_time_range.py` (5 satır)
- Önerilen sahip bağlam: 03a-katalog

## Epic

- Epic adı: Listing Lead Time Range: 03a-katalog bağlamına taşıma
- Öncelik: Düşük
- Faz: Faz 5
- Tahmini büyüklük: Küçük

### User story

Bir geliştirici olarak, bu kullanılmayan alt tablo için lojistik ekibinin karar vermesini istiyorum.
Böylece hazırlık süresi ya teslim tahminine girer ya şema kaldırılır.

### Kabul kriterleri

- [ ] Lojistik ekibi kararı yazılı.
- [ ] Kullanılacaksa `get_lead_time_days` var ve lojistik bunu çağırıyor.
- [ ] Çakışan aralık reddediliyor. Test var.
- [ ] `module` alanı "Catalog" oldu ya da tablo kaldırıldı.
- [ ] Characterization test: `Listing Lead Time Range` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- Lojistik kodundan bu tabloyu doğrudan okumayın. `get_lead_time_days` kullanın.
- Karar olmadan tabloyu silmeyin.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] Karar raporda kayıtlı.
- [ ] Aralık çakışma testi eklendi.
- [ ] `CODEOWNERS` katalog ve lojistik ekiplerinden inceleme istendi.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?
Bu alt tablo miktara göre hazırlık süresini tutar. Örneğin 1 ile 100 adet arası 3 gün. Ana kayıt `Listing` kaydıdır.

## Bugünkü bağımlılıklar
### Bu kaydın bağlandığı kayıtlar
- Link alanı yok.
### Bu kayda dokunan kod
- `tradehub_core/tradehub_core/doctype/listing/listing.json:811`: ana kayıt `lead_time_ranges` alanında tutuyor
- Başka kod bulunmadı (grep ile doğrulandı).
### hooks.py kayıtları
- Kayıt yok.

## Bağımlılık sorunları
Önemli bir bağımlılık sorunu bulunmadı. Not: Lojistik (07) bu tabloyu okumuyor. Teslim süresi hesabında kullanılmıyor.

## Hedef tasarım
- Sahip bağlam `03a-katalog`, paket yolu `tradehub_core/catalog/`.
- Dışarıya açılan fonksiyon: `get_lead_time_days(listing, qty)` miktara göre gün verir. Lojistik bunu çağırır.
- Olay yok.
- Başka bağlamlara bağlantı yok.
- Denetleyicide kalacak doğrulama: aralıklar çakışmamalı. Bugün bu kontrol yok.

## Geçiş adımları
1. Lojistik ekibi karar verir: hazırlık süresi teslim tahminine girecek mi?
2. Girecekse `get_lead_time_days` yazın. Lojistik bunu çağırır.
3. Ana kayıtla birlikte `module` alanını "Catalog" yapın.

## Riskler ve testler
- Çakışan aralık reddedilmeli. Test: 1-100 ve 50-200 aralıkları birlikte kaydedilemez.
