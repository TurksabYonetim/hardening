# Seller Balance

- Bağlam: 05-odeme
- Tür: Ana kayıt
- Klasör: `tradehub_core/tradehub_core/doctype/seller_balance`
- Denetleyici: `tradehub_core/tradehub_core/doctype/seller_balance/seller_balance.py` (5 satır)
- Önerilen sahip bağlam: 05-odeme

## Epic

- Epic adı: Seller Balance: 05-odeme bağlamına taşıma
- Öncelik: Acil
- Faz: Faz 3
- Tahmini büyüklük: Orta

### User story

Bir satıcı olarak, bakiyemin gerçek tahsilatlarla uyuşmasını istiyorum.
Böylece ne kadar alacağımı bilirim.

### Kabul kriterleri

- [ ] Bakiye kuralı yazılı ve ürün sahibi onaylı.
- [ ] `utils/seller_payout.py` ölü kodu silindi.
- [ ] `get_seller_balance` fonksiyonu var.
- [ ] Bakiye toplamı doğrulanmış tahsilat toplamıyla uyuşuyor.
- [ ] Characterization test: `Seller Balance` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- `tradehub_seller` uygulamasından içe aktarım yapmayın. Bu uygulama depoda yok.
- Bakiyeyi elle düzeltmeyin. Değer olaylardan türetilir.
- Muhasebe ekranında ham SQL ile bakiye toplamayın.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] Bakiye eşitlik testi eklendi.
- [ ] Ölü kodun çağrılmadığı arama ile doğrulandı.
- [ ] Muhasebe ekranı testi geçiyor.
- [ ] Ürün sahibinden onay alındı.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?
`Seller Balance` satıcının bakiye özetini tutar. Alanlar kullanılabilir bakiye, bekleyen bakiye, toplam kazanç ve toplam çekilen tutardır. Her satıcının tek kaydı olur (`autoname=field:seller`).

## Bugünkü bağımlılıklar
### Bu kaydın bağlandığı kayıtlar
- `Admin Seller Profile` (`seller`): başka bağlam (02-satici-magaza)
- `Currency` (`currency`): framework kaydı

### Bu kayda dokunan kod
- `tradehub_core/api/accounting.py:25`: ham SQL ile okuyor (`SUM(pending_balance)`)
- `tradehub_core/tradehub_core/utils/seller_payout.py:31`: yazıyor gibi görünür. Fonksiyon `tradehub_seller` uygulamasından içe aktarım yapar (`seller_payout.py:27`). Bu uygulama bu depoda yok. Bu yol çalışmaz, doğrulanmadı.
- `tradehub_core/permissions.py:880`: izin denetimi
- `tradehub_core/tradehub_core/api/dashboard_engine.py:195`: pano filtresi

### hooks.py kayıtları
- `hooks.py:918`: `before_insert` ve `validate` olaylarında kiracı izolasyonu çalışır.
- `hooks.py:1083` ve `hooks.py:1210`: liste ve kayıt izni `permissions.py` içindedir.

## Bağımlılık sorunları
1. Kaydı güncelleyen çalışan kod bulunmadı. Tek yazım yolu olmayan bir uygulamaya bağlı (`utils/seller_payout.py:27`). Bakiye tahsilatlarla ayrışmış olabilir. Muhasebe ekranı yine de bu tabloyu okur (`api/accounting.py:25`).
2. Yeni ödeme zinciri bakiyeyi hiç güncellemiyor. Bakiye ile tahsilat arasında kural yok.

## Hedef tasarım
- Sahip bağlam: 05-odeme.
- Kayıt bir okuma modeli olur. Değer `Payment Collection` ve `Payment Refund Record` kayıtlarından türetilir.
- Dışarıya açılan fonksiyon: `payments.api.get_seller_balance(seller) -> SellerBalanceView`.
- Dinlediği olaylar: `payment.collected` ve `payment.refunded` (aynı bağlam). Bakiye bu olaylarla güncellenir.
- Yayınladığı olaylar: yok.
- Alternatif: tablo kaldırılır ve bakiye her okumada hesaplanır. Karar ürün sahibinindir.

## Geçiş adımları
1. `utils/seller_payout.py` dosyasının ölü kod olduğunu doğrulayın. Sonra dosyayı silin. Bu adım bağımsızdır.
2. Bakiye kuralını ürün sahibiyle yazın. Örnek: komisyon düşülür mü, bekleme süresi var mı.
3. `get_seller_balance` fonksiyonunu ekleyin. `api/accounting.py:25` bu fonksiyonu kullansın.
4. Olay dinleyicisini ekleyin.

## Riskler ve testler
- Muhasebe ekranı yanlış toplam gösterebilir. Test: bakiye toplamı doğrulanmış tahsilat toplamıyla uyuşmalı.
