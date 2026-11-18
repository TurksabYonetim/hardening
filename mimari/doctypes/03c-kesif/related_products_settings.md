# Related Products Settings

- Bağlam: 03c-kesif
- Tür: Ayar (single)
- Klasör: `tradehub_core/tradehub_core/doctype/related_products_settings`
- Denetleyici: `tradehub_core/tradehub_core/doctype/related_products_settings/related_products_settings.py` (57 satır)
- Önerilen sahip bağlam: 03c-kesif

## Epic

- Epic adı: Related Products Settings: 03c-kesif bağlamına taşıma
- Öncelik: Düşük
- Faz: Faz 4
- Tahmini büyüklük: Küçük

### User story

Bir platform yöneticisi olarak, öneri ağırlıklarını değiştirince hesabın hızla yeni değeri kullanmasını istiyorum.
Böylece ayar değişikliğim en geç 60 saniyede etkili olur.

### Kabul kriterleri

- [ ] Ağırlık grubu toplamı 1,0 kontrolü denetleyicide. Test var.
- [ ] `on_update` sonrası `get_settings` yeni değer veriyor. Test var.
- [ ] `module` alanı "Discovery" oldu.
- [ ] Characterization test: `Related Products Settings` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- Önbellek düşürmeyi denetleyiciden çıkarmayın. İyi örnektir.
- Ağırlık kontrolünü yalnız uç noktada yapmayın. Denetleyicide olur.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] Toplam kontrolü testi eklendi.
- [ ] Önbellek testi geçiyor.
- [ ] `CODEOWNERS` keşif ekibinden inceleme istendi.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?
Related Products Settings öneri motorunun ağırlıklarını tutar. Örneğin "aynı kategori" puanı 0,40 ağırlık alır. Tek kayıttır. Yönetici panelden değiştirir. Toplu hesap bu değerleri okur.

## Bugünkü bağımlılıklar
### Bu kaydın bağlandığı kayıtlar
- Link alanı yok.
### Bu kayda dokunan kod
- `tradehub_core/tradehub_core/doctype/related_products_settings/related_products_settings.py:12-13`: kayıt değişince önbellek düşürülüyor
- `tradehub_core/tradehub_core/doctype/related_products_settings/related_products_settings.py:16-57`: `get_settings` 60 saniye önbellekli okuma
- `tradehub_core/api/recommendations.py:34,47,62`: yönetici okuma ve güncelleme uç noktaları
### hooks.py kayıtları
- Kayıt yok.

## Bağımlılık sorunları
Önemli bir bağımlılık sorunu bulunmadı. Önbellek düşürme denetleyicide. İyi örnek.

## Hedef tasarım
- Sahip bağlam `03c-kesif`, paket yolu `tradehub_core/discovery/recommendations/`.
- Dışarıya açılan fonksiyon gerekmez. `get_settings` servis içi kalır.
- Olay yok.
- Başka bağlamlara bağlantı yok.
- Denetleyicide kalacak doğrulama: ağırlık grupları toplamı 1,0 olmalı. Bugün bu kontrol yok. `api/recommendations.py:47` uç noktada kontrol olabilir. Doğrulanmadı.

## Geçiş adımları
1. Ağırlık toplamı kontrolünü denetleyiciye ekleyin.
2. `module` alanını "Discovery" yapın.

## Riskler ve testler
- Ayar değişince 60 saniye içinde hesap yeni değeri okumalı. Test: `on_update` sonrası `get_settings` yeni değer verir.
