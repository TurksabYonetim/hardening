# İş kuralı hatalarını önleme yönergesi

Modüler yapı tek başına yanlış bir formülü düzeltmez. Bu yönerge iş kuralı hatalarını kodlamadan önce ve sonra yakalar.

## 1. Para hiçbir zaman `float` olmaz

- Bütün tutarlar `Decimal` tipindedir.
- Para için tek bir sınıf vardır: `tradehub_core/shared/money.py` içindeki `Money`.
- `Money` sınıfı tutarı ve para birimini birlikte taşır.
- Farklı para birimleri toplanamaz. Sınıf bunu hata ile durdurur.
- Yuvarlama kuralı tek yerdedir. Örnek: kuruşa yuvarlama, "yarım yukarı".

```python
from dataclasses import dataclass
from decimal import Decimal, ROUND_HALF_UP

@dataclass(frozen=True)
class Money:
	amount: Decimal
	currency: str

	def __add__(self, other: "Money") -> "Money":
		if other.currency != self.currency:
			raise ValueError("Farklı para birimleri toplanamaz.")
		return Money(self.amount + other.amount, self.currency)

	def rounded(self) -> "Money":
		return Money(self.amount.quantize(Decimal("0.01"), rounding=ROUND_HALF_UP), self.currency)
```

Bu sınıf **value object** örneğidir. Value object, değeri değişmeyen ve kendi kuralını taşıyan küçük bir nesnedir.

## 2. Vergi ve iade kuralları tabloda yazılır

Kural kodun içine gömülmez. Kural bir **karar tablosunda** (decision table) yazılır. Tablo `tradehub_core/tax/rules/*.yaml` dosyalarında durur.

Örnek satır:

```yaml
- ad: KDV dahil fiyat, tek oran
  vergi_davranisi: Inclusive
  oranlar: [20]
  birim_fiyat: "120.00"
  adet: 1
  beklenen_net: "100.00"
  beklenen_vergi: "20.00"
  beklenen_brut: "120.00"
```

Her satır kendiliğinden bir test olur. Testi `pytest` tablodan üretir.

**Tabloyu mali müşavir onaylar.** Yeni satır eklenince ya da satır değişince onay yeniden alınır. Onay, PR'da yorum olarak kalır.

## 3. Kural her girdide doğru mu? Property-based test

`hypothesis` aracı binlerce rastgele girdi üretir. Her girdide şu kuralları kontrol eder:

- Brüt tutar, net tutar ile vergi toplamına eşittir.
- İade tutarı, ödenen tutarı geçmez.
- Kısmi iptallerin toplamı, tam iptale eşittir.
- Stok hiçbir zaman eksiye düşmez.

Bu kurallara **invariant** denir. Invariant, her durumda doğru kalması gereken kuraldır.

## 4. İki hesap birbirini kontrol eder

Kritik hesaplar iki yoldan yapılır:

- Vergi motoru vergiyi hesaplar.
- Fatura belgesi kendi toplamını ayrıca hesaplar.

İki sonuç farklıysa sipariş "Kontrol gerekiyor" durumuna geçer. Para hareketi yapılmaz.

## 5. Testler hatayı gerçekten yakalıyor mu?

**Mutation testing** bunu ölçer. `mutmut` aracı kodu kasıtlı olarak bozar. Örnek: `+` işaretini `-` yapar. Sonra testleri çalıştırır. Testler bu bozulmayı yakalamalı.

Vergi, ödeme, iade ve stok paketlerinde mutation skoru en az %80 olmalıdır.

## Kabul ölçütü

- Yeni tutar alanları `Money` sınıfını kullanıyor.
- Kural karar tablosunda yazılı ve mali müşavir onayı var.
- Invariant'lar için property-based test var.
- Mutation skoru eşiğin üstünde.
