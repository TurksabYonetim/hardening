# Shipment Package

- Bağlam: 07-lojistik
- Tür: Alt tablo
- Klasör: `tradehub_core/tradehub_core/doctype/shipment_package`
- Denetleyici: `tradehub_core/tradehub_core/doctype/shipment_package/shipment_package.py` (8 satır)
- Önerilen sahip bağlam: 07-lojistik

## Epic

- Epic adı: Shipment Package: 07-lojistik bağlamına taşıma
- Öncelik: Önemli
- Faz: Faz 3
- Tahmini büyüklük: Küçük

### User story

Bir geliştirici olarak, medya ve ürün silme kodunun etiket dosyalarını lojistik API ile bulmasını istiyorum.
Böylece koli alanları değişince dosya izni bozulmaz.

### Kabul kriterleri

- [ ] `logistics/api.py` içinde `get_label_file_owner` ve `label_files_for_shipments` fonksiyonları var.
- [ ] `media/file_isolation.py` koli tablosunu doğrudan okumuyor.
- [ ] `listing_purge/executor.py` lojistik iç servisini içe aktarmıyor.
- [ ] Koli silinince etiket dosyası da siliniyor. Bunu bir test gösteriyor.
- [ ] Characterization test: `Shipment Package` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- Etiket dosyasını herkese açık yapmayın. Etikette alıcı adresi vardır.
- Koli satırını `Shipment` dışından yazmayın. Koli toplamları üst kayıtta hesaplanır.
- `package_code` tekilliğini kaldırmayın.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] `test_packaging_api.py` ve `test_label_service.py` geçiyor.
- [ ] Etiket dosya izni testi eklendi.
- [ ] Medya ekibinden `CODEOWNERS` incelemesi istendi.
- [ ] `import-linter` kontrolü geçiyor.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?

`Shipment Package`, `Shipment` kaydının `packages` alt tablosudur. Her satır bir koliyi tutar. Satırda ölçü, ağırlık, desi, barkod ve etiket bilgisi vardır.

## Bugünkü bağımlılıklar

### Bu kaydın bağlandığı kayıtlar

- `Package Type` (`package_type`): aynı bağlam

### Bu kayda dokunan kod

- `tradehub_core/logistics/services/packaging_service.py:317`: yazıyor. Koli ekliyor ve değiştiriyor.
- `tradehub_core/logistics/services/label_service.py:408`: yazıyor. Etiket dosyasını koliye bağlıyor.
- `tradehub_core/api/v1/shipment.py:138`: okuyor.
- `tradehub_core/media/file_isolation.py:235`: okuyor. Etiket dosyasının sahibini koli satırından buluyor.
- `tradehub_core/listing_purge/executor.py:386`: okuyor. Silmeden önce etiket dosyalarını denetliyor.
- `tradehub_core/patches/v15_10_04_mogem555_koli_alanlari.py:30`: şemayı değiştiren yama.

### hooks.py kayıtları

- Doğrudan kayıt yok. Koli toplamları `Shipment` denetleyicisinde hesaplanır (`tradehub_core/tradehub_core/doctype/shipment/shipment.py:171`).

## Bağımlılık sorunları

1. Medya bağlamı koli satırını doğrudan okuyor. Kanıt: `tradehub_core/media/file_isolation.py:235`. Lojistik alan adını değiştirirse dosya izni bozulur (08-medya).
2. Ürün silme akışı lojistik iç servisini içe aktarıyor. Kanıt: `tradehub_core/listing_purge/executor.py:386`.

## Hedef tasarım

- Sahip bağlam ve paket yolu: 07-lojistik, `tradehub_core/logistics/doctype/shipment_package/`.
- Dışarıya açılan fonksiyonlar: `get_label_file_owner(file_name)` ve `label_files_for_shipments(shipments)`. Medya ve ürün silme bu fonksiyonları kullanır.
- Yayınladığı ve dinlediği olaylar: yok.
- Başka bağlamlara bağlantılar: yok.

## Geçiş adımları

1. İki okuma fonksiyonunu lojistik `api.py` içine ekleyin.
2. `media/file_isolation.py` ve `listing_purge/executor.py` bu fonksiyonları kullansın.
3. Üst kayıt `Shipment` ile aynı PR içinde "Logistics" modülüne taşıyın.

## Riskler ve testler

- Etiket dosyası yanlış kişiye açılabilir. Etiket dosya izni testini ekleyin.
- Koli silinince etiket dosyası yetim kalabilir. `on_trash` temizleme testini koruyun.
