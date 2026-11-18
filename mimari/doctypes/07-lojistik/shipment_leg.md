# Shipment Leg

- Bağlam: 07-lojistik
- Tür: Ana kayıt
- Klasör: `tradehub_core/tradehub_core/doctype/shipment_leg`
- Denetleyici: `tradehub_core/tradehub_core/doctype/shipment_leg/shipment_leg.py` (118 satır)
- Önerilen sahip bağlam: 07-lojistik

## Epic

- Epic adı: Shipment Leg: 07-lojistik bağlamına taşıma
- Öncelik: Düşük
- Faz: Faz 3
- Tahmini büyüklük: Küçük

### User story

Bir geliştirici olarak, kullanılmayan bir kaydın bakım yükü getirmesini istemiyorum.
Böylece kodu daha kolay anlarım.

### Kabul kriterleri

- [ ] Kaydın kullanılıp kullanılmadığı ürün sahibiyle yazılı karar olarak kaydedildi.
- [ ] Canlı veride kayıt sayısı ölçüldü ve karara eklendi.
- [ ] Kayıt kalacaksa izin ve kiracı testleri geçiyor.
- [ ] Kayıt kaldırılacaksa `Shipment Event.leg` bağı için bir plan yazıldı.
- [ ] Characterization test: `Shipment Leg` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- Kaydı veri sayımı yapmadan silmeyin.
- `seller_profile` alanını istemciden kabul etmeyin. Alan `Shipment` kaydından gelir.
- Karar verilmeden kayda yeni özellik eklemeyin.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] `test_logistics_permissions.py` geçiyor.
- [ ] Karar belgesi PR açıklamasına bağlandı.
- [ ] Lojistik ekibinden `CODEOWNERS` incelemesi istendi.
- [ ] `import-linter` kontrolü geçiyor.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?

`Shipment Leg` bir sevkiyatın bir ayağını tutar. Örneğin toplama, ara aktarma ve son teslim ayrı ayaklardır. Kayıtta çıkış ve varış noktası, araç, sürücü ve zaman bilgisi vardır.

## Bugünkü bağımlılıklar

### Bu kaydın bağlandığı kayıtlar

- `Shipment` (`shipment`, zorunlu): aynı bağlam
- `Admin Seller Profile` (`seller_profile`, zorunlu): başka bağlam (02-satici-magaza)
- `Carrier Branch` (`origin_branch`, `destination_branch`): aynı bağlam
- `Logistics Provider` (`carrier`): aynı bağlam
- `Vehicle Type` (`vehicle_type`): aynı bağlam
- `Currency` (`currency`): çekirdek Frappe kaydı

### Bu kayda dokunan kod

- `tradehub_core/logistics/permissions.py:554`: izin denetimi.
- `tradehub_core/tradehub_core/doctype/shipment_leg/shipment_leg.py:51`: denetleyici `Shipment` kaydını okuyor.
- Bu kaydı yazan bir servis ya da REST ucu bulunamadı. Kayıt yalnız Desk ekranından yazılıyor olabilir. Bu nokta doğrulanmadı.

### hooks.py kayıtları

- `tradehub_core/hooks.py:1059`: kiracı kancaları.
- `tradehub_core/hooks.py:1153` ve `tradehub_core/hooks.py:1277`: izin kancaları.

## Bağımlılık sorunları

1. Kayıt şu an iş akışında kullanılmıyor gibi görünüyor. Kod araması yalnız izin ve kanca kayıtlarını buldu. Kullanılmayan kayıt bakım yükü getirir.

Başka bağlamı bozan önemli bir sorun bulunmadı.

## Hedef tasarım

- Sahip bağlam ve paket yolu: 07-lojistik, `tradehub_core/logistics/doctype/shipment_leg/`.
- Dışarıya açılan fonksiyonlar ve olaylar: yok.
- Başka bağlamlara bağlantılar: `seller_profile` alanı `Shipment` kaydından kopyalanan anlık görüntüdür.
- Denetleyicide kalacak doğrulamalar: satıcı eşleşmesi, durum geçişi, ayak sırası tekilliği.

## Geçiş adımları

1. Ürün sahibine bu kaydın kullanılıp kullanılmadığını sorun. Karar yazılı olsun.
2. Kullanılıyorsa DocType klasörünü "Logistics" modülüne taşıyın. Kullanılmıyorsa kaldırma planı yapın.

## Riskler ve testler

- Kayıt kaldırılırsa `Shipment Event.leg` bağı kırılır. Kaldırmadan önce veri sayımı yapın.
