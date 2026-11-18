# Product Category Required Certification

- Bağlam: 03a-katalog
- Tür: Alt tablo
- Klasör: `tradehub_core/tradehub_core/doctype/product_category_required_certification`
- Denetleyici: `tradehub_core/tradehub_core/doctype/product_category_required_certification/product_category_required_certification.py` (5 satır)
- Önerilen sahip bağlam: 03a-katalog

## Epic

- Epic adı: Product Category Required Certification: 03a-katalog bağlamına taşıma
- Öncelik: Düşük
- Faz: Faz 5
- Tahmini büyüklük: Küçük

### User story

Bir geliştirici olarak, bu kullanılmayan alt tablo için karar verilmesini istiyorum.
Böylece zorunlu sertifika kuralı ya uygulanır ya şema kaldırılır.

### Kabul kriterleri

- [ ] Ürün ekibi kararı yazılı.
- [ ] Kullanılacaksa `list_required_certifications` var ve `cert_validate.py` çağırıyor.
- [ ] Eksik sertifikalı ürün aktif olamıyor. Test var.
- [ ] `module` alanı "Catalog" oldu ya da tablo kaldırıldı.
- [ ] Characterization test: `Product Category Required Certification` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- Kuralı uygulamadan tabloyu "çalışıyor" saymayın.
- Karar olmadan tabloyu silmeyin.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] Karar raporda kayıtlı.
- [ ] Alt ağaç hesabı testi eklendi.
- [ ] `CODEOWNERS` katalog ekibinden inceleme istendi.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?
Bu alt tablo bir kategoride zorunlu olan sertifikaları tutar. Ana kayıt `Product Category` kaydıdır. "Alt ağaca uygula" seçeneği alt kategorileri de kapsar.

## Bugünkü bağımlılıklar
### Bu kaydın bağlandığı kayıtlar
- `Certification Type` (certification_type): aynı bağlam
### Bu kayda dokunan kod
- `tradehub_core/tradehub_core/doctype/product_category/product_category.json:199`: ana kayıt `required_certifications` alanında tutuyor
- Başka kod bulunmadı. Bu tabloyu okuyan bir doğrulama aranmış ancak bulunamamıştır (grep ile doğrulandı).
### hooks.py kayıtları
- Kayıt yok.

## Bağımlılık sorunları
Önemli bir bağımlılık sorunu bulunmadı. Not: Tablo tanımlı ancak hiçbir kod zorunluluğu uygulamıyor. Bu, kullanılmayan şemadır.

## Hedef tasarım
- Sahip bağlam `03a-katalog`, paket yolu `tradehub_core/catalog/`.
- Dışarıya açılan fonksiyon: `list_required_certifications(category)` alt ağacı da hesaplar. Bu fonksiyon ürün doğrulamasında kullanılır.
- Olay yok.
- Başka bağlamlara bağlantı yok.
- Denetleyicide doğrulama yok. Zorunluluk kuralı `Listing` doğrulamasına servis olarak eklenir.

## Geçiş adımları
1. Ürün ekibi karar verir: tablo kullanılacak mı? Kullanılmayacaksa tabloyu kaldırın.
2. Kullanılacaksa `list_required_certifications` yazın ve `cert_validate.py` içinde çağırın.
3. Ana kayıtla birlikte `module` alanını "Catalog" yapın.

## Riskler ve testler
- Zorunlu sertifika eksik ürün aktif olmamalı. Test: kuralı uygulayan servis eksik sertifikada hata verir.
