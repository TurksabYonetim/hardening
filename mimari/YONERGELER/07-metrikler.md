# Metrik yönergesi: hangi sayı kaç olmalı?

Bu yönerge her ölçümün hedefini verir. Hedefleri ben belirledim. Ekip gerçek sonuçlara göre hedefleri sıkılaştırabilir. Hedefler gevşetilmez.

## Nasıl ölçülür?

- `scripts/architecture_metrics.py` betiği her PR'da çalışır.
- Betik sonuçları `architecture/metrics.json` dosyasına yazar.
- CI, yeni sonucu dosyadaki değerle karşılaştırır.
- Bir sayı kötüleşirse CI PR'ı durdurur. Bu yönteme **ratchet** denir. Ratchet, sayının yalnız iyi yöne gidebildiği kilittir.
- Haftalık rapor her pazartesi otomatik oluşur.

Siz yalnız iki şeye bakın:

1. CI yeşil mi?
2. Haftalık raporda kırmızı satır var mı?

Kırmızı satır varsa o hafta yeni özellik birleştirilmez. Önce kırmızı satır düzeltilir.

---

## Mimari metrikleri

| Ölçüm | Başlangıç | Faz 2 sonu | Faz 3 sonu | Faz 5 sonu |
|---|---|---|---|---|
| Bağlamlar arası Link alanı | 169 | 169'u geçmez | 100 | 40 |
| Bağlamlar arası doğrudan yazım | ölçülecek | ölçülen değeri geçmez | 10 | 0 |
| Başka bağlamın iç dosyasını import | ölçülecek | ölçülen değeri geçmez | Faz 3 bağlamlarında 0 | 0 |
| `hooks.py` dosyasındaki doğrudan kayıt | yaklaşık 560 | 0 | 0 | 0 |
| `architecture/exceptions.toml` istisna sayısı | ölçülecek | azalıyor | yarıya indi | 0 |
| "Tradehub Core" modülündeki DocType | 291 | 291 | 200 | 0 |

## Test metrikleri

| Ölçüm | Hedef | Ne zaman |
|---|---|---|
| Ana akışlar için characterization test | 12 akışın 12'si | Faz −1 sonu |
| Değişen satırların test kapsamı | en az %90 | Her PR |
| Vergi, ödeme, iade ve stok paketlerinde mutation skoru | en az %80 | Faz 3 sonu |
| Kararsız (flaky) test | 0 | Her zaman |
| CI süresi | en çok 15 dakika | Her zaman |
| Silinen ya da atlanan test | 0 | Her PR |

Ana akışlar Faz −1 görevlerinde listelenir.

## Olay metrikleri

| Ölçüm | Hedef | Sınır aşılırsa |
|---|---|---|
| Outbox'ta bekleyen olay yaşı | en çok 60 saniye | Hüseyin Cengiz'e bildirim |
| Dead letter olay sayısı | 0 | Feature flag kapatılır |
| Uzlaştırma işinin bulduğu eksik olay | 0 | Yeni özellik birleştirilmez |
| Aynı olayın ikinci kez işlenmesi | 0 | Yeni özellik birleştirilmez |

## Shadow mode metrikleri

| Ölçüm | Geçiş için hedef |
|---|---|
| Çalışma süresi | en az 7 gün |
| Karşılaştırılan işlem | en az 500 |
| `Shadow Mismatch Log` kaydı | 0 |
| Yeni kodun hata sayısı | 0 |

## Canlı ortam metrikleri

| Ölçüm | Hedef |
|---|---|
| Canlıda çıkan yeni hata | her hafta bir önceki haftadan az ya da eşit |
| Geri alınan yayın | ayda en çok 1 |
| Feature flag ile kapatılan özellik | kapatılan özellik 24 saat içinde düzeltilir |

## Merge çakışması metrikleri

| Ölçüm | Hedef |
|---|---|
| `hooks.py` dosyasında çakışma | Faz 2 sonundan sonra 0 |
| `patches.txt` dosyasında çakışma | haftada en çok 1 |
| İki bağlamı birden değiştiren PR | %5'ten az |

## Bir sayı hedefi tutmazsa

1. O metrikle ilgili yeni özellik birleştirilmez.
2. Sorunun nedeni bir issue olarak açılır.
3. Issue `öncelik: acil` etiketini alır.
4. Sorun çözülünce metrik yeniden ölçülür.
