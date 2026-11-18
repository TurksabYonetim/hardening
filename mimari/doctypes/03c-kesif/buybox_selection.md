# Buybox Selection

- Bağlam: 03c-kesif
- Tür: Kayıt defteri (hesaplanmış sonuç)
- Klasör: `tradehub_core/tradehub_core/doctype/buybox_selection`
- Denetleyici: `tradehub_core/tradehub_core/doctype/buybox_selection/buybox_selection.py` (8 satır)
- Önerilen sahip bağlam: 03b-ice-aktarma (eşleştirme ve buybox servisi). Neden: Tek yazıcı `catalog/service.py:809-841` `recompute_buybox` fonksiyonudur. Bu servis `Catalog Product` ve `Product Mapping` ile aynı pakettedir. Keşif bağlamı yalnız sonucu okur.

## Epic

- Epic adı: Buybox Selection: 03c-kesif bağlamına taşıma
- Öncelik: Önemli
- Faz: Faz 4
- Tahmini büyüklük: Küçük

### User story

Bir geliştirici olarak, kazanan teklif kaydının eşleştirme servisiyle aynı bağlamda durmasını istiyorum.
Böylece hesaplanmış sonuç ürün silmeyi kilitlemez ve sahibi bellidir.

### Kabul kriterleri

- [ ] `winner_listing` alanı `Data` anlık görüntü. Yama değer koruyor.
- [ ] Bağlam haritası 03b gösteriyor ve `module` alanı "Import Pipeline" oldu.
- [ ] `matching.buybox_changed` olayı `recompute_buybox` sonunda yayınlanıyor. Sözleşme testi var.
- [ ] Kazanan ürün silinince kayıt kalıyor ve yeniden hesaplanıyor. Test var.
- [ ] Characterization test: `Buybox Selection` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- Keşif kodundan bu tabloya yazmayın. Tek yazıcı eşleştirme servisidir.
- `winner_listing` alanını Link bırakmayın.
- `listing_purge` özel listesine yeni istisna eklemeyin. Sorunu kaynakta çözün.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] Tür değişimi yaması idempotent.
- [ ] Olay testi eklendi.
- [ ] Harita ve `module` güncellemesi aynı PR'da.
- [ ] `CODEOWNERS` içe aktarma ve keşif ekiplerinden inceleme istendi.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?
Buybox Selection bir katalog ürünü için kazanan teklifi tutar. Aynı ürünü satan satıcılar arasından en iyi teklif seçilir. Puan ve puan ayrıntısı saklanır. Vitrin kazanan teklifi öne çıkarır.

## Bugünkü bağımlılıklar
### Bu kaydın bağlandığı kayıtlar
- `Catalog Product` (catalog_product): başka bağlam (03b-ice-aktarma)
- `Listing` (winner_listing): başka bağlam (03a-katalog)
### Bu kayda dokunan kod
- `tradehub_core/tradehub_core/doctype/buybox_selection/buybox_selection.py:5-8`: anahtar üretimi
- `tradehub_core/catalog/service.py:832-836`: `recompute_buybox` kaydı `set_value` ile güncelliyor ya da yeni açıyor
- `tradehub_core/listing_purge/preview.py:23`: ürün silme aracı bağı sayıyor
### hooks.py kayıtları
- Kayıt yok. `Listing.on_update` ve `Admin Seller Profile.on_update` kancaları (`hooks.py:1399-1401`) dolaylı tetikliyor.

## Bağımlılık sorunları
1. Kayıt keşif bağlamında görünüyor ancak yalnız eşleştirme servisi (03b) yazıyor. Harita yanlış sahibi gösteriyor.
2. `winner_listing` Link alanı ürün silinirken kilitlenir. `listing_purge/preview.py:23` özel işliyor. Hesaplanmış sonuç `Data` anlık görüntü olmalı.
3. `tradehub_core/catalog/service.py:834` `set_value` ile `update_modified=False` yazıyor. Denetleyici anahtar kuralı yeni kayıtta çalışır, güncellemede atlanır. Kabul edilebilir.

## Hedef tasarım
- Sahip bağlam `03b-ice-aktarma`, paket yolu `tradehub_core/import_pipeline/matching/`. Harita bu analizde değiştirilmez. README'de not edilir.
- Dışarıya açılan fonksiyon (`import_pipeline/api.py`): `get_buybox_winner(product, context_key="global")`. Vitrin bunu çağırır.
- Yayınladığı olay: `matching.buybox_changed` (product, winner_listing, score). Dinleyen: vitrin önbelleği, 03c öneri. Dinlediği olay yok (servis içi hesap).
- Başka bağlamlara bağlantılar: `catalog_product` Link kalır. `winner_listing` `Data` anlık görüntü olur.
- Denetleyicide kalacak doğrulama: anahtar üretimi.

## Geçiş adımları
1. `winner_listing` alanını `Data` yapın. Yama değeri korur. `listing_purge/preview.py:23` özel kodu kalkar.
2. Bağlam haritasını 03b olarak güncelleyin. `module` alanını "Import Pipeline" yapın.
3. `matching.buybox_changed` olayını `recompute_buybox` sonunda yayınlayın. Outbox gerekir.

## Riskler ve testler
- Kazanan değişince vitrin önbelleği düşmeli. Test: olay dinleyicisi önbelleği siler.
- Kazanan ürün silinince kayıt kilitlenmemeli. Test: ürün silinir, `Buybox Selection` kalır ve yeniden hesaplanır.
