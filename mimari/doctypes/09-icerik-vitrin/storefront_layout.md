# Storefront Layout

- Bağlam: 09-icerik-vitrin
- Tür: Ana kayıt
- Klasör: `tradehub_core/tradehub_core/doctype/storefront_layout`
- Denetleyici: `tradehub_core/tradehub_core/doctype/storefront_layout/storefront_layout.py` (89 satır)
- Önerilen sahip bağlam: 09-icerik-vitrin

## Epic

- Epic adı: Storefront Layout: 09-icerik-vitrin bağlamına taşıma
- Öncelik: Önemli
- Faz: Faz 4
- Tahmini büyüklük: Orta

### User story

Bir satıcı olarak, mağaza sayfamın düzenini güvenle kaydetmek istiyorum.
Böylece görsel ya da mağaza değişiklikleri sayfamı bozmaz.

### Kabul kriterleri

- [ ] `api/seller.py` düzeni yalnız `save_storefront_layout` fonksiyonuyla yazıyor.
- [ ] Medya kodu düzen JSON'unda `LIKE` araması yapmıyor. `list_layout_image_urls` kullanıyor.
- [ ] `hooks.py:819` kaydı kaldırıldı. Medya bağlamı `storefront.layout_changed` olayını dinliyor.
- [ ] Mağaza silinince `seller.deleted` olayı düzeni siliyor.
- [ ] Geçersiz bölüm türü kaydedilemiyor.
- [ ] Characterization test: `Storefront Layout` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- `api/seller.py` içinden `frappe.new_doc("Storefront Layout")` çağırmayın. Yazım içerik bağlamının fonksiyonuyla yapılmalı.
- Bölüm JSON biçimini medya testlerini güncellemeden değiştirmeyin. Görsel temizliği bozulur.
- `services/store_cleanup.py` içine yeni içerik silme satırı eklemeyin. Temizlik olay abonesiyle yapılmalı.
- `hooks.py` içine doğrudan yeni `doc_events` kaydı eklenmedi.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] Değişen davranış için önce başarısız olan bir test yazıldı.
- [ ] Ruff ve uygulama testleri yerelde geçiyor.
- [ ] `import-linter` kontrolü `tradehub_core.content` için geçiyor.
- [ ] `CODEOWNERS` içindeki içerik bağlamı sahibinden inceleme istendi.
- [ ] Yeni olay için sözleşme testi eklendi. Test olay alanlarını kontrol ediyor.
- [ ] Abone aynı olayı iki kez alınca ikinci işlem hiçbir şey değiştirmiyor.
- [ ] Satıcı mağaza sayfası 320 piksel genişlikte açılıyor.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?

Bu kayıt bir satıcının mağaza sayfası düzenini tutar. Düzen bölüm listesi ve tema renkleri içerir. İkisi de JSON metni olarak saklanır. Her mağazanın tek düzeni vardır.

## Bugünkü bağımlılıklar

### Bu kaydın bağlandığı kayıtlar

- `Admin Seller Profile` (`seller_profile`, Link): başka bağlam (02-satici-magaza)

### Bu kayda dokunan kod

- `tradehub_core/api/seller.py:1778`: yazıyor
- `tradehub_core/api/seller.py:1836`: yazıyor
- `tradehub_core/api/seller.py:1774`: okuyor
- `tradehub_core/api/seller.py:1776`: okuyor
- `tradehub_core/media/magaza_gorseli.py:141`: okuyor
- `tradehub_core/media/pipeline_bridge.py:620`: okuyor
- `tradehub_core/media/magaza_gorseli.py:257`: adını kullanıyor
- `tradehub_core/media/pipeline/policy/slots/company-cover-image.json:21`: adını kullanıyor
- `tradehub_core/media/pipeline/policy/slots/seller-logo.json:21`: adını kullanıyor
- `tradehub_core/media/usage.py:140`: adını kullanıyor
- `tradehub_core/media/usage.py:733`: adını kullanıyor
- `tradehub_core/services/store_cleanup.py:28`: adını kullanıyor

### hooks.py kayıtları

- `tradehub_core/hooks.py:819`: doc_events kaydı. `validate` -> `tradehub_core.media.magaza_gorseli.vitrin_yonlendirmelerini_esle`, `on_update` -> `tradehub_core.media.magaza_gorseli.on_storefront_layout_update`
- `tradehub_core/hooks.py:815`: `Admin Seller Profile` `on_trash` kaydı `services.store_cleanup.delete_store_owned_records` fonksiyonunu çağırıyor. Bu fonksiyon düzeni siler.

## Bağımlılık sorunları

1. Satıcı API'si düzeni doğrudan yazıyor. Kanıt: `api/seller.py:1778` ve `api/seller.py:1836` satırlarında `new_doc` var. Bu kod 02 bağlamına ait.
2. Medya kodu bu DocType'ın kancalarına bağlı. Kanıt: `hooks.py:819` satırında medya fonksiyonları var. 08 bağlamı 09 kaydının kaydetme akışına giriyor.
3. Medya kodu JSON metninde `LIKE` ile adres arıyor. Kanıt: `media/pipeline_bridge.py:620` ve `media/magaza_gorseli.py:257`. Bölüm biçimi değişirse görsel temizliği bozulur.
4. Mağaza silme kodu düzeni doğrudan siliyor. Kanıt: `services/store_cleanup.py:28`.

## Hedef tasarım

- Sahip bağlam ve paket yolu: `tradehub_core/content/` paketi ve `Content` Frappe modülü.
- Dışarıya açılan fonksiyonlar: `content/api.py` içinde `get_storefront_layout(seller)`, `save_storefront_layout(seller, sections, theme)` ve `list_layout_image_urls(seller)`.
- Yayınladığı olaylar: `storefront.layout_changed`. Olay şu alanları taşır: `seller`, `image_urls`. Medya bağlamı görsel kullanımını bu olayla günceller.
- Dinlediği olaylar: 02 bağlamının `seller.deleted` olayı. Abone, düzeni siler. 08 bağlamının `media.url_redirected` olayı. Abone, eski görsel adresini yenisiyle değiştirir.
- Başka bağlamlara bağlantılar: `seller_profile` Link alanı `Admin Seller Profile` kök kaydına bağlı kalır.
- Denetleyicide kalacak doğrulamalar: Bölüm türü ve JSON geçerlilik kontrolleri kalır.
- Servise taşınacak iş kuralları: Varsayılan bölüm ve tema değerleri `content/storefront.py` içine taşınır.

## Geçiş adımları

1. `save_storefront_layout` fonksiyonunu açın. `api/seller.py:1774` ve `:1814` bu fonksiyonu çağırsın.
2. `list_layout_image_urls` fonksiyonunu açın. Medya kodu `LIKE` sorgusu yerine bunu kullansın.
3. `storefront.layout_changed` olayını yayınlayın. Medya bağlamı abone olunca `hooks.py:819` kaydını kaldırın.
4. `store_cleanup.py:28` silmesini `seller.deleted` aboneliğine taşıyın.
5. DocType'ı `Content` modülüne taşıyın.

## Riskler ve testler

- Vitrin görselleri 404 verebilir. Test: görsel adresi değişince düzen yeni adresi göstermeli.
- Mağaza silinince düzen yetim kalabilir. Test: olay işlenince düzen silinmeli.
