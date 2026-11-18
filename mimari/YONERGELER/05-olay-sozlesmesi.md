# Olay sözleşmesi yönergesi

Bir olayın alanı değişirse hata hemen görünür. Ama olayın **anlamı** değişirse hata gizli kalır. Bu yönerge iki türü de yakalar.

## 1. Her olay bir Pydantic modelidir

Olaylar `pydantic` sınıfı olarak yazılır. Sınıf, olayın alanlarını ve kurallarını taşır.

```python
from decimal import Decimal
from typing import Literal
from pydantic import BaseModel, Field

class OrderConfirmedV1(BaseModel):
	"""Ödemesi alınmış ve satıcının hazırlayacağı sipariş.

	Anlam: Bu olaydan sonra sipariş iptal edilmeden stok düşer ve sevkiyat başlar.
	Bu olay her sipariş için en çok bir kez yayınlanır.
	"""

	event: Literal["order.confirmed"] = "order.confirmed"
	version: Literal[1] = 1
	event_id: str
	order: str
	seller: str
	gross_total: Decimal = Field(ge=0)
	currency: str = Field(min_length=3, max_length=3)
```

Docstring, olayın **anlamını** yazar. Anlam değişirse yeni sürüm açılır.

## 2. Sözleşmeler dosyada saklanır

- CI, her modelden JSON Schema dosyası üretir.
- Dosyalar `contracts/schemas/<olay>.v<sürüm>.json` yolunda durur.
- Bu klasöre **şema kaydı** (schema registry) denir.

## 3. Kırıcı değişikliği CI durdurur

CI, şemanın eski hâlini yeni hâliyle karşılaştırır. Şu değişiklikler **kırıcıdır**:

- Alan silmek.
- Alanın tipini değiştirmek.
- Zorunlu yeni alan eklemek.
- Docstring'deki "Anlam" satırını değiştirmek.

Kırıcı değişiklik aynı sürümde yapılamaz. Yeni sürüm açılır. Örnek: `OrderConfirmedV2`. Eski sürüm en az iki yayın boyunca yayınlanmaya devam eder.

## 4. Tüketici odaklı sözleşme testi

Olayı dinleyen her bağlam kendi beklentisini test olarak yazar. Bu yönteme **consumer-driven contract test** denir.

Örnek: Lojistik bağlamı `order.confirmed` olayından `order` ve `seller` alanlarını bekler. Bu beklenti lojistiğin test klasöründe yazılıdır. Sipariş bağlamı olayı değiştirirse lojistiğin testi kırılır.

## 5. Ön yüz aynı sözleşmeyi kullanır

- `json-schema-to-typescript` aracı şemalardan TypeScript tipleri üretir.
- `tradehubfront` ve `admin-panel` repoları bu tipleri kullanır.
- `zod` kütüphanesi, API'den gelen veriyi çalışma anında doğrular. Veri sözleşmeye uymazsa ekran hata gösterir ve olayı kaydeder.
- Üretilen dosyalar elle değiştirilmez. CI, dosyaların güncel olduğunu kontrol eder.

## 6. Olayın örnekleri vardır

Her olay için en az üç örnek veri dosyası vardır. Örnekler `contracts/examples/` klasöründe durur. Testler ve ön yüz taklit sunucusu (MSW) bu örnekleri kullanır.

## Kabul ölçütü

- Olay Pydantic modeli olarak yazıldı ve anlamı docstring'de var.
- JSON Schema dosyası üretildi.
- Her dinleyicinin sözleşme testi var.
- TypeScript tipleri güncel.
- Kırıcı değişiklik kontrolü geçti.
