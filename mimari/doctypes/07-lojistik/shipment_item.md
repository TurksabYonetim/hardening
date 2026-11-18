# Shipment Item

- Bağlam: 07-lojistik
- Tür: Alt tablo
- Klasör: `tradehub_core/tradehub_core/doctype/shipment_item`
- Denetleyici: `tradehub_core/tradehub_core/doctype/shipment_item/shipment_item.py` (8 satır)
- Önerilen sahip bağlam: 07-lojistik

## Epic

- Epic adı: Shipment Item: 07-lojistik bağlamına taşıma
- Öncelik: Kritik
- Faz: Faz 3
- Tahmini büyüklük: Orta

### User story

Bir geliştirici olarak, sevkiyat kalemlerinin sipariş verisini olaydan almasını istiyorum.
Böylece sipariş kalemi değişince sevkiyat kalemi bozulmaz.

### Kabul kriterleri

- [ ] `order_item` alanının bir anlık görüntü kimliği olduğu DocType açıklamasında yazıyor.
- [ ] Kalem kopyası `order.confirmed` olay verisinden doluyor. `Order Item` tablosu yalnız yedek yolda okunuyor.
- [ ] Sipariş ekibiyle kalem kimliklerinin değişmeyeceği yazılı karar olarak kaydedildi.
- [ ] Bölme kuralı testleri geçiyor. Bir kalem sipariş miktarından fazla sevk edilemiyor.
- [ ] Characterization test: `Shipment Item` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- `Order Item` satırlarına lojistik kodundan yazmayın. Bu tablo sipariş bağlamının alt tablosudur.
- `order_item` alanını başka bir Link alanıyla değiştirmeyin. Eski sevkiyatların bağı kopar.
- `shared_sync_shipment_line` sütununu silmeyin. Paylaşımlı stok tetikleyicisi bu sütuna bakar.
- Kopya alanlarını sevkiyat açıldıktan sonra değiştirmeyin. Kopya değişmezliği kuralı vardır.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] `test_shipment_core.py` bölme kuralı testleri geçiyor.
- [ ] Paylaşımlı sipariş için sevkiyat kalemi güncelleme testi eklendi.
- [ ] Olay verisinde kalem alanlarının bulunduğunu gösteren sözleşme testi eklendi.
- [ ] Sipariş ekibinden `CODEOWNERS` incelemesi istendi.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?

`Shipment Item`, `Shipment` kaydının `items` alt tablosudur. Sevkiyatta hangi sipariş kaleminden kaç adet gittiğini tutar. Ürün adı, varyant ve birim fiyat sevkiyat açılırken kopyalanır.

## Bugünkü bağımlılıklar

### Bu kaydın bağlandığı kayıtlar

- `Order Item` (`order_item`, zorunlu): başka bağlam (04-siparis). `Order Item` bir alt tablodur.
- `Listing` (`listing`): başka bağlam (03a-katalog)

### Bu kayda dokunan kod

- `tradehub_core/logistics/services/split_engine.py:102`: okuyor. Kalan miktarı hesaplıyor.
- `tradehub_core/logistics/hooks.py:114`: yazıyor. Kalem kopyasını `Order Item` ve `Listing` kayıtlarından dolduruyor.
- `tradehub_core/logistics/hooks.py:270`: okuyor. Siparişin karşılanma durumunu hesaplıyor.
- `tradehub_core/logistics/services/order_cancellation.py:112`: okuyor.
- `tradehub_core/logistics/services/packaging_service.py:310`: okuyor.
- `tradehub_core/api/v1/shipment.py:771`: okuyor.
- `tradehub_core/shared_sync/schema.py:45`: alana `shared_sync_shipment_line` sütunu ekliyor.
- `tradehub_core/shared_sync/schema.py:190`: tabloya veritabanı tetikleyicisi koyuyor.

### hooks.py kayıtları

- Doğrudan kayıt yok. Kalem kuralları `Shipment` kaydının kancalarında çalışır (`tradehub_core/hooks.py:1031`, `tradehub_core/hooks.py:1036`).

## Bağımlılık sorunları

1. Link alanı başka bağlamın alt tablo satırını gösteriyor. Kanıt: `order_item` alanı `Order Item` kaydına bağlıdır. Hedef mimari Link alanını yalnız ana kayıtlara izin verir. Sipariş ekibi kalem satırlarını yeniden yazarsa sevkiyat bağları kırılır.
2. Kopya alma kodu `Order Item` ve `Listing` tablolarını doğrudan okuyor. Kanıt: `tradehub_core/logistics/hooks.py:137` ve `tradehub_core/logistics/hooks.py:152`.
3. Paylaşımlı stok kodu tabloya sütun ve tetikleyici ekliyor. Kanıt: `tradehub_core/shared_sync/schema.py:45` ve `tradehub_core/shared_sync/schema.py:190`.

## Hedef tasarım

- Sahip bağlam ve paket yolu: 07-lojistik, `tradehub_core/logistics/doctype/shipment_item/`.
- Dışarıya açılan fonksiyonlar: `get_shipped_quantities(order)` bu tabloyu okur. Fonksiyon `Shipment` raporunda tanımlıdır.
- Yayınladığı ve dinlediği olaylar: yok. Olaylar üst kayıttan yayınlanır.
- Başka bağlamlara bağlantılar:
  - `order_item` alanı sipariş kaleminin kararlı kimliği olarak kalır. Alan bir anlık görüntü kimliği olarak belgelenir.
  - `item_name`, `variation` ve `unit_price` alanları anlık görüntüdür.
  - Kopya verisi `order.confirmed` olay verisinden gelir.

## Geçiş adımları

1. `order_item` alanının bir anlık görüntü kimliği olduğunu DocType açıklamasına yazın.
2. `order.confirmed` olayı hazır olunca kopya verisini olaydan alın. Doğrudan okuma bir süre yedek kalsın.
3. Sipariş ekibiyle kalem satırı kimliklerinin değişmeyeceğini yazılı karar yapın.

## Riskler ve testler

- Sipariş kalemi değişirse fazla sevkiyat açılabilir. `tradehub_core/logistics/tests/test_shipment_core.py` bölme kuralı testlerini koruyun.
- Tetikleyici ile kod birbirini engelleyebilir. Paylaşımlı sipariş için sevkiyat kalemi güncelleme testini ekleyin.
