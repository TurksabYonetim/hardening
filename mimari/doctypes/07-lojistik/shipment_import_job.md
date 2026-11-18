# Shipment Import Job

- Bağlam: 07-lojistik
- Tür: Ana kayıt
- Klasör: `tradehub_core/tradehub_core/doctype/shipment_import_job`
- Denetleyici: `tradehub_core/tradehub_core/doctype/shipment_import_job/shipment_import_job.py` (49 satır)
- Önerilen sahip bağlam: 07-lojistik

## Epic

- Epic adı: Shipment Import Job: 07-lojistik bağlamına taşıma
- Öncelik: Önemli
- Faz: Faz 3
- Tahmini büyüklük: Küçük

### User story

Bir satıcı olarak, CSV ile toplu sevkiyat açmak istiyorum.
Böylece çok siparişi tek tek girmem gerekmez. Sipariş kodu değişince bu işin bozulmaması gerekir.

### Kabul kriterleri

- [ ] Sipariş bağlamında izin denetimi yapan bir okuma fonksiyonu var.
- [ ] `shipment_import.py` artık `Order` kaydını doğrudan okumuyor.
- [ ] `shipment_import.py` artık `permissions.order_has_permission` çağırmıyor.
- [ ] Başka satıcının siparişi içe aktarılamıyor. `test_shipment_import.py` geçiyor.
- [ ] Characterization test: `Shipment Import Job` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- İzin denetimini atlayan bir satır yolu eklemeyin. Her satır elle sevkiyat kapısından geçer.
- İş durum geçiş kuralını kaldırmayın.
- Aynı `row_key` ile ikinci sevkiyat açmayın.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] `test_shipment_import.py` geçiyor.
- [ ] Sipariş ekibinden `CODEOWNERS` incelemesi istendi.
- [ ] `import-linter` kontrolü geçiyor.
- [ ] Örnek bir CSV dosyası ile elle denendi.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?

`Shipment Import Job` bir CSV dosyasından toplu sevkiyat açma işini tutar. İş eşleme, önizleme, uygulama, tamamlandı ve hata durumlarından geçer. Her satır `Shipment Import Row` alt tablosunda durur.

## Bugünkü bağımlılıklar

### Bu kaydın bağlandığı kayıtlar

- `Admin Seller Profile` (`seller_profile`): başka bağlam (02-satici-magaza)
- `Shipment Import Row` (`rows`, alt tablo): aynı bağlam

### Bu kayda dokunan kod

- `tradehub_core/api/v1/logistics_import.py:137`: yazıyor. İşi açıyor.
- `tradehub_core/api/v1/logistics_import.py:56`: okuyor.
- `tradehub_core/logistics/services/shipment_import.py:340`: yazıyor. Satırları uygulayıp sevkiyat açıyor.
- `tradehub_core/logistics/services/shipment_import.py:257`: `Order` kaydını okuyor (04-siparis).
- `tradehub_core/logistics/services/shipment_import.py:247`: sipariş izin fonksiyonunu çağırıyor.

### hooks.py kayıtları

- Kayıt yok.

## Bağımlılık sorunları

1. İçe aktarma sipariş kaydını doğrudan okuyor. Kanıt: `tradehub_core/logistics/services/shipment_import.py:257`. Sipariş ekibi alan adını değiştirirse satır doğrulaması bozulur.
2. İçe aktarma ortak `permissions.py` içindeki `order_has_permission` fonksiyonunu çağırıyor. Kanıt: `tradehub_core/logistics/services/shipment_import.py:247`. Bu fonksiyon sipariş bağlamına aittir.

## Hedef tasarım

- Sahip bağlam ve paket yolu: 07-lojistik, `tradehub_core/logistics/doctype/shipment_import_job/`.
- Dışarıya açılan fonksiyonlar: yok.
- Yayınladığı ve dinlediği olaylar: yok.
- Başka bağlamlara bağlantılar: sipariş okuması `ordering.api.get_order_for_shipment(order, user)` gibi bir okuma modeline geçer.
- Denetleyicide kalacak doğrulamalar: durum geçişi kuralı.

## Geçiş adımları

1. Sipariş bağlamı bir okuma fonksiyonu açsın. Fonksiyon izin denetimini de yapsın.
2. `shipment_import.py:247` ve `shipment_import.py:257` bu fonksiyonu kullansın.
3. DocType klasörünü "Logistics" modülüne taşıyın.

## Riskler ve testler

- Başka satıcının siparişi içe aktarılabilir. `tradehub_core/logistics/tests/test_shipment_import.py` izin testlerini koruyun.
