# Product Family Attribute

- Bağlam: 03a-katalog
- Tür: Alt tablo
- Klasör: `tradehub_core/tradehub_core/doctype/product_family_attribute`
- Denetleyici: `tradehub_core/tradehub_core/doctype/product_family_attribute/product_family_attribute.py` (5 satır)
- Önerilen sahip bağlam: 03a-katalog

## Epic

- Epic adı: Product Family Attribute: 03a-katalog bağlamına taşıma
- Öncelik: Düşük
- Faz: Faz 5
- Tahmini büyüklük: Küçük

### User story

Bir geliştirici olarak, bu kullanılmayan alt tablo için karar verilmesini istiyorum.
Böylece şema borcu azalır.

### Kabul kriterleri

- [ ] Ürün ekibi kararı yazılı.
- [ ] Kalıyorsa tekrar eden `attribute` satırı reddediliyor. Test var.
- [ ] `module` alanı "Catalog" oldu ya da tablo kaldırıldı.
- [ ] Characterization test: `Product Family Attribute` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- Karar olmadan tabloyu silmeyin.
- Tabloyu okuyan iş kodu yazmadan "kullanılıyor" saymayın.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] Karar raporda kayıtlı.
- [ ] Yama idempotent.
- [ ] `CODEOWNERS` katalog ekibinden inceleme istendi.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?
Bu alt tablo bir ürün ailesinin özelliklerini tutar. Satır özelliğin rolünü söyler. Roller "Identifying", "Descriptive", "Specification" ve "Variant Axis" değerleridir. Ana kayıt `Product Family` kaydıdır.

## Bugünkü bağımlılıklar
### Bu kaydın bağlandığı kayıtlar
- `Product Attribute` (attribute): aynı bağlam
### Bu kayda dokunan kod
- `tradehub_core/tradehub_core/doctype/product_family/product_family.json:66`: ana kayıt `family_attributes` alanında tutuyor
- Başka kod bulunmadı (grep ile doğrulandı).
### hooks.py kayıtları
- Kayıt yok.

## Bağımlılık sorunları
Önemli bir bağımlılık sorunu bulunmadı. Not: Tabloyu okuyan iş kodu yok. Şema tanımlı ancak kullanılmıyor.

## Hedef tasarım
- Sahip bağlam `03a-katalog`, paket yolu `tradehub_core/catalog/`.
- Dışarıya açılan fonksiyon: `get_product_family` bu satırları da döndürür.
- Olay yok.
- Başka bağlamlara bağlantı yok.
- Denetleyicide doğrulama yok.

## Geçiş adımları
1. Ürün ekibi karar verir: aile özellikleri kullanılacak mı? Kullanılmayacaksa tabloyu kaldırın.
2. Ana kayıtla birlikte `module` alanını "Catalog" yapın.

## Riskler ve testler
- Tablo kullanılmaya başlanırsa aynı özelliğin tekrarı engellenmeli. Test: tekrar eden `attribute` satırı reddedilir.
