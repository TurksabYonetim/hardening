# Category Review Template

- Bağlam: 11-degerlendirme
- Tür: Ana kayıt
- Klasör: `tradehub_core/tradehub_core/doctype/category_review_template`
- Denetleyici: `tradehub_core/tradehub_core/doctype/category_review_template/category_review_template.py` (5 satır)
- Önerilen sahip bağlam: 11-degerlendirme

## Epic

- Epic adı: Category Review Template: 11-degerlendirme bağlamına taşıma
- Öncelik: Düşük
- Faz: Faz 4
- Tahmini büyüklük: Küçük

### User story

Bir geliştirici olarak, şablon kodunun katalog tablosunu doğrudan okumamasını istiyorum.
Böylece katalog değişiklikleri yorum şablonunu bozmaz.

### Kabul kriterleri

- [ ] `api/templates.py:34` okuması `catalog.api.get_listing_category` ile yapılıyor.
- [ ] `api/templates.py` dosyası `reviews/templates/` paketinde duruyor.
- [ ] Kurulum çağrısı (`setup/install.py:152`) yeni yola bakıyor.
- [ ] `catalog.category_deleted` olayı gelince şablon pasif oluyor.
- [ ] Characterization test: `Category Review Template` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- `Listing.product_category` alanını doğrudan okumayın. Katalog okuma fonksiyonunu kullanın.
- Kategori silinince şablonu katalog kodundan değiştirmeyin. Olayı dinleyin.
- Kurulum çağrısını taşımadan dosyayı silmeyin. Kurulum bozulur.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] Şablon bulma testi geçiyor.
- [ ] Kurulum sonrası varsayılan şablon testi eklendi.
- [ ] `import-linter` kontrolü geçiyor.
- [ ] Katalog bağlamının `CODEOWNERS` sahibinden okuma fonksiyonu için inceleme istendi.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?
Her ürün kategorisi için yorum formuna ek sorular tanımlanır. Bu kayıt bir kategorinin ek sorularını tutar. Alıcının cevapları yorumun `category_template_answers` alanına yazılır.

## Bugünkü bağımlılıklar
### Bu kaydın bağlandığı kayıtlar
- `Product Category` (`category`): başka bağlam (03a-katalog)
- `Template Question` (`extra_questions`): aynı bağlam, alt tablo
### Bu kayda dokunan kod
- `tradehub_core/api/templates.py:38`: okuyor (kategoriye göre şablon)
- `tradehub_core/api/templates.py:34`: okuyor (`Listing.product_category`)
- `tradehub_core/api/templates.py:219`: yazıyor (varsayılan şablonlar)
- `tradehub_core/setup/install.py:152`: kurulumda şablonları ekler
- `tradehub_core/services/category_delete.py:35`: okuyor (kategori silinirken bağ kontrolü)
- `tradehub_core/patches/init_review_phase4_fields.py:42`: yama
### hooks.py kayıtları
- Kayıt yoktur.

## Bağımlılık sorunları
1. Şablon bulmak için katalog tablosu okunuyor. `tradehub_core/api/templates.py:34` `Listing.product_category` alanını okur. Bu okuma küçük ve kabul edilebilir. Yine de bir okuma modeliyle yapılmalı.
2. Katalog bağlamı kategori silerken bu DocType adını biliyor (`tradehub_core/services/category_delete.py:35`). Bu, Link alanının doğal sonucudur.

## Hedef tasarım
- Sahip bağlam ve paket yolu: `tradehub_core/reviews/templates/`.
- Dışarıya açılan fonksiyon: `reviews.api.get_category_template(category=None, listing=None)`.
- Olay yayınlamaz.
- Dinlediği olay: `catalog.category_deleted` (category). Şablon pasif yapılır.
- `category` Link alanı kalır. `Product Category` kararlı bir kayıttır.
- `Listing` kategorisi `catalog.api.get_listing_category(listing)` ile okunur.

## Geçiş adımları
1. `templates.py:34` okumasını katalog okuma fonksiyonuna çevirin.
2. `api/templates.py` dosyasını `reviews/templates/` paketine taşıyın.
3. Kurulum çağrısını (`setup/install.py:152`) yeni yola bağlayın. Bu adım 2. adımdan sonra gelir.

## Riskler ve testler
- Kategori silinince şablon sahipsiz kalabilir. Kategori silme testinde şablon davranışını sınayın.
