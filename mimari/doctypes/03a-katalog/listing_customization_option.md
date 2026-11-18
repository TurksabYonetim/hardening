# Listing Customization Option

- Bağlam: 03a-katalog
- Tür: Alt tablo
- Klasör: `tradehub_core/tradehub_core/doctype/listing_customization_option`
- Denetleyici: `tradehub_core/tradehub_core/doctype/listing_customization_option/listing_customization_option.py` (5 satır)
- Önerilen sahip bağlam: 03a-katalog

## Epic

- Epic adı: Listing Customization Option: 03a-katalog bağlamına taşıma
- Öncelik: Düşük
- Faz: Faz 5
- Tahmini büyüklük: Küçük

### User story

Bir geliştirici olarak, bu kullanılmayan alt tablo için karar verilmesini ve gerekirse taşınmasını istiyorum.
Böylece şema borcu azalır.

### Kabul kriterleri

- [ ] Ürün ekibi kararı yazılı: tablo kalıyor ya da kaldırılıyor.
- [ ] Kalıyorsa `additional_cost` eksi olamaz kuralı denetleyicide ve testi var.
- [ ] `module` alanı "Catalog" oldu ya da tablo kaldırıldı.
- [ ] Characterization test: `Listing Customization Option` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- Sepete seçenek fiyatı eklemeden tabloyu "kullanılıyor" saymayın.
- Karar olmadan tabloyu silmeyin.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] Karar raporda kayıtlı.
- [ ] Yama idempotent.
- [ ] `CODEOWNERS` katalog ekibinden inceleme istendi.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?
Bu alt tablo ürün için özelleştirme seçeneklerini tutar. Örneğin "logo baskısı, ek ücret 5 TL". Ana kayıt `Listing` kaydıdır.

## Bugünkü bağımlılıklar
### Bu kaydın bağlandığı kayıtlar
- Link alanı yok.
### Bu kayda dokunan kod
- `tradehub_core/tradehub_core/doctype/listing/listing.json:682`: ana kayıt `customization_options` alanında tutuyor
- Başka kod bulunmadı (grep ile doğrulandı).
### hooks.py kayıtları
- Kayıt yok.

## Bağımlılık sorunları
Önemli bir bağımlılık sorunu bulunmadı. Not: Sepet bu seçenekleri okumuyor. Tablo kullanılmıyor.

## Hedef tasarım
- Sahip bağlam `03a-katalog`, paket yolu `tradehub_core/catalog/`.
- Dışarıya açılan fonksiyon: `get_listing_detail` okuma modeli bu satırları da içerir.
- Olay yok.
- Başka bağlamlara bağlantı yok.
- Denetleyicide kalacak doğrulama: `additional_cost` eksi olamaz. Bugün bu kontrol yok.

## Geçiş adımları
1. Ürün ekibi karar verir: seçenekler sepete girecek mi? Girmeyecekse tabloyu kaldırın.
2. Ana kayıtla birlikte `module` alanını "Catalog" yapın.

## Riskler ve testler
- Kullanılırsa eksi ek ücret reddedilmeli. Test: `additional_cost=-1` kaydı reddedilir.
