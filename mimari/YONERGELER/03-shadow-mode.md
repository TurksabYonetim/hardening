# Shadow mode yönergesi

**Shadow mode**, yeni kodun eski kodla aynı anda çalışmasıdır. Kullanıcı yalnız eski kodun sonucunu görür. Sistem iki sonucu karşılaştırır. Fark varsa `Shadow Mismatch Log` kaydına yazar.

Her görevde shadow mode zorunludur. Shadow mode olmadan yeni yol açılmaz.

## Nasıl kurulur?

Faz 1'de ortak bir yardımcı yazılır: `tradehub_core/shared/shadow.py`.

```python
from tradehub_core.shared.shadow import shadow_compare

def siparis_vergisi(order_name: str):
	eski = eski_vergi_hesabi(order_name)
	shadow_compare(
		name="tax.order_total",
		key=order_name,
		primary=lambda: eski,
		candidate=lambda: tax_api.calculate_for_order(order_name),
		compare=lambda a, b: a.gross_total == b.gross_total,
	)
	return eski
```

Yardımcı şu kuralları uygular:

- Yeni kod hata verirse kullanıcıya hata gitmez. Hata kaydedilir.
- Yeni kod yavaşsa kullanıcı beklemez. Yeni kod arka planda çalışır.
- Yeni kod veritabanına yazmaz. Yalnız sonuç üretir.
- Karşılaştırma sonucu `Shadow Mismatch Log` kaydına yazılır.

## Yazan kodlarda shadow mode

Bazı yeni kodlar veritabanına yazar. Örnek: stok düşürme. Bu kodlar shadow mode'da şöyle çalışır:

1. Yeni kod yazacağı değişikliği hesaplar ama yazmaz.
2. Eski kod gerçekten yazar.
3. Yardımcı, yeni kodun hesapladığı değişikliği eski kodun yaptığı değişiklikle karşılaştırır.

## Altyapı görevlerinde shadow mode

CI kontrolleri ve araçlar için de shadow mode vardır. Yeni kontrol önce yalnız rapor verir. PR'ı durdurmaz. Kontrolün sonuçları en az 10 PR boyunca izlenir. Yanlış uyarı yoksa kontrol PR'ı durduracak hale getirilir.

## Yeni yola geçiş koşulu

Yeni yol yalnız şu koşulların hepsi sağlanınca açılır:

1. Shadow mode en az 7 gün çalıştı.
2. En az 500 gerçek işlem karşılaştırıldı. İşlem sayısı azsa süre 14 güne çıkar.
3. `Shadow Mismatch Log` kayıt sayısı 0.
4. Yeni kodun hata sayısı 0.
5. Bağlamın sahibi geçişi onayladı.

Geçiş, feature flag ile önce Alpha, sonra Beta, sonra RC, en son canlı ortamda açılır.

## Kabul ölçütü

- Yeni yol shadow mode içinde çalışıyor.
- Karşılaştırma fonksiyonu yazıldı ve testi var.
- Geçiş koşullarının 5 maddesi de sağlandı.
