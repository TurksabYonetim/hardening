# tradehub_core için modüler monolit planı

Bu belgeyi 18 Kasım 2026 Çarşamba günü hazırladım. İncelenen kod `tradehub-tr/tradehub_core` reposunun `version-15` dalı. Son commit numarası `08e51e53`.

Bu belge genel planı anlatır. Her DocType'ın kendi raporu `doctypes/` klasöründedir. Her iş bağlamının bir `README.md` dosyası da vardır.

Kodu yalnız okudum. Repoda hiçbir şeyi değiştirmedim.

---

## 1. Sorun neden oluyor?

Bir geliştirici bir özelliği değiştiriyor. Bu değişiklik başka bir özelliği bozuyor. Bunun dört ölçülmüş nedeni var.

### 1.1. Bütün kayıtlar tek modülde

- Repoda 326 DocType var.
- Bunların 291 tanesi tek bir Frappe modülünde duruyor. Modülün adı "Tradehub Core".
- Kalan 35 DocType SEO modüllerinde.
- Sipariş, ödeme, vergi ve lojistik kayıtları aynı modülde. Bu yüzden aralarında kod düzeyinde bir sınır yok.

### 1.2. Bazı kayıtlara her yerden dokunuluyor

Aşağıdaki sayılar, DocType adının kaç ayrı Python dosyasında geçtiğini gösterir. Testler sayılmadı.

- `Listing`: 199 dosya
- `Admin Seller Profile`: 190 dosya
- `Order`: 123 dosya
- `User Profile`: 66 dosya
- `Product Category`: 52 dosya
- `Payment Intent`: 44 dosya
- `Shipment`: 42 dosya

`Order` kaydını değiştiren bir geliştirici 123 dosyayı etkileyebilir. Bu dosyaların sahibi başka geliştiriciler olabilir.

### 1.3. Ortak dosyalar her gün çakışıyor

- `hooks.py` dosyası 1655 satır. Son 30 günde 14 kez değişti.
- `patches.txt` dosyası 581 satır. Son 30 günde 24 kez değişti.
- `Listing` kaydının değişikliklerini 32 ayrı fonksiyon dinliyor. Bu fonksiyonlar 9 farklı pakette.
- `Admin Seller Profile` kaydını 18 fonksiyon dinliyor.
- `Shipment` kaydını 12 fonksiyon dinliyor.

Dört geliştirici de bu dosyalara yazıyor. Bu yüzden merge çakışması çıkıyor.

### 1.4. Bağlamlar birbirini doğrudan çağırıyor

- DocType'lar arasında 387 bağlantı alanı (Link) var.
- Bunların 169 tanesi bir iş bağlamından başka bir iş bağlamına gidiyor.
- En yoğun bağlantılar ödemeden satıcıya (20) ve ödemeden siparişe (13) gidiyor.

Bu bağlantılar şu hataları üretti:

- [#370](https://github.com/tradehub-tr/tradehub_core/issues/370): Lojistik kodu sipariş durumunu değiştiriyor. Ödeme kodu bu yeni durumu tanımıyor. Bu yüzden stok düşmüyor.
- [#371](https://github.com/tradehub-tr/tradehub_core/issues/371): İptal kodu iadeyi eski vergi formülüyle hesaplıyor. Vergi motoru bu formülü değiştirdi. Kimse iptal kodunu güncellemedi.

İki hatada da bir geliştirici başka birinin kodunun içine dokunuyor. Diğer geliştirici bunu bilmiyor.

---

## 2. Hedef: Frappe içinde modüler monolit

**Modüler monolit** şu demektir: Uygulama tek parça kalır ve tek seferde deploy edilir. Ama içinde birbirinden ayrılmış modüller vardır. Her modül kendi verisinin sahibidir. Modüller birbirine yalnız belli kapılardan ulaşır.

Frappe bunu desteklemek için gereken parçaların çoğunu zaten sunuyor. Ayrı bir framework kurmaya gerek yok.

### 2.1. İş bağlamları

**İş bağlamı** (bounded context) tek bir iş alanının sınırıdır. Örneğin "sipariş" bir bağlamdır. "Vergi" başka bir bağlamdır.

326 DocType'ı 16 bağlama ayırdım:

1. `01-kimlik-erisim`: kullanıcı, rol, yetki, API anahtarı (25 DocType)
2. `02-satici-magaza`: satıcı, mağaza, KYB, abonelik (20 DocType)
3. `03a-katalog`: ürün, kategori, özellik, marka (25 DocType)
4. `03b-ice-aktarma`: toplu yükleme ve XML akışı (11 DocType)
5. `03c-kesif`: arama, öneri, favori (12 DocType)
6. `04-siparis`: sepet, sipariş, teklif (14 DocType)
7. `05-odeme`: ödeme, iade, satıcı bakiyesi (30 DocType)
8. `06-vergi-fatura`: vergi kuralları ve faturalar (9 DocType)
9. `07-lojistik`: sevkiyat, kargo, teslimat (39 DocType)
10. `08-medya`: görsel ve dosya (30 DocType)
11. `09-icerik-vitrin`: CMS, vitrin ve tema (26 DocType)
12. `10-seo`: SEO kayıtları (27 DocType)
13. `11-degerlendirme`: yorum, puan, soru-cevap (19 DocType)
14. `12-bildirim-iletisim`: bildirim, e-posta, sohbet, destek (21 DocType)
15. `13-uyum-gizlilik`: KVKK, onay, veri saklama (13 DocType)
16. `14-platform-cekirdek`: genel ayarlar ve kural motoru (5 DocType)

Bu bölme bir öneridir. İşçi raporlarında taşınması önerilen DocType'lar ayrıca yazılıdır.

### 2.2. Yedi kural

Her bağlam bu yedi kurala uyar.

#### Kural 1: Her bağlam ayrı bir Frappe modülüdür

- Her bağlam `modules.txt` dosyasında kendi adıyla yer alır. Örnek: "Ordering", "Tax", "Logistics".
- Her DocType'ın JSON dosyasındaki `module` alanı bu adı taşır.
- Her bağlamın kendi Python paketi vardır. Örnek: `tradehub_core/ordering/`.

Böylece hangi kaydın hangi ekibe ait olduğu klasörden belli olur.

#### Kural 2: Her bağlamın tek bir dış kapısı vardır

Her bağlam iki dosya sunar:

- `api.py`: Başka bağlamların çağırabileceği fonksiyonlar.
- `contracts.py`: Bu fonksiyonların aldığı ve döndürdüğü veri tipleri.

Örnek:

```python
# tradehub_core/tax/contracts.py
from dataclasses import dataclass

@dataclass(frozen=True)
class TaxLine:
	rule: str
	rate: float
	amount: float

@dataclass(frozen=True)
class OrderTaxResult:
	order: str
	gross_total: float
	lines: list[TaxLine]
```

```python
# tradehub_core/tax/api.py
from tradehub_core.tax.contracts import OrderTaxResult

def calculate_for_order(order_name: str) -> OrderTaxResult:
	"""Siparişin vergisini hesaplar ve sonucu döndürür."""
	...
```

Başka bir bağlam şu üç şeyi yapamaz:

- Bu bağlamın iç dosyalarını import edemez.
- Bu bağlamın DocType'larına `frappe.get_doc(...).save()` ile yazamaz.
- Bu bağlamın tablolarına `frappe.db.set_value` veya SQL ile yazamaz.

Okuma için de önce `api.py` kullanılır.

#### Kural 3: Bağlamlar birbirine olayla haber verir

**Olay** (domain event) "bu iş oldu" diyen kısa bir mesajdır. Örnek: `order.confirmed`.

Bugün sipariş kodu vergi ve lojistik kodunu doğrudan çağırıyor. Hedef düzende sipariş yalnız olay yayınlar. Vergi ve lojistik bu olayı kendileri dinler.

Olay sistemi üç parçadan oluşur:

1. **Outbox kaydı:** Yeni bir `Domain Event` DocType'ı. Olay, işi yapan kayıtla aynı veritabanı işleminde bu tabloya yazılır. Böylece iş geri alınırsa olay da geri alınır.
2. **Dağıtıcı:** İşlem kaydedildikten sonra `frappe.enqueue` ile çalışır. Bekleyen olayları dinleyicilere gönderir.
3. **Dinleyiciler:** Her bağlam kendi dinleyicilerini kaydeder. Her dinleyici olayın numarasını saklar. Aynı olay iki kez gelirse ikinci kez işlem yapmaz.

Örnek:

```python
# tradehub_core/shared/events.py
import frappe

def publish(event_type: str, aggregate: str, payload: dict) -> None:
	"""Olayı aynı işlem içinde Outbox tablosuna yazar."""
	frappe.get_doc({
		"doctype": "Domain Event",
		"event_type": event_type,
		"aggregate": aggregate,
		"payload": frappe.as_json(payload),
		"status": "Pending",
	}).insert(ignore_permissions=True)  # sistem kaydı, kullanıcı girdisi değil
	frappe.db.after_commit.add(_schedule_dispatch)
```

```python
# tradehub_core/tax/subscribers.py
from tradehub_core.shared.events import subscriber

@subscriber("order.confirmed")
def on_order_confirmed(event):
	"""Sipariş onaylanınca vergiyi hesaplar ve sonucu yayınlar."""
	...
```

#### Kural 4: Bağlamlar arası bağlantılar sınırlıdır

- Başka bağlama giden `Link` alanları yalnız ana kayıtlara gider. Ana kayıt örnekleri: `Order`, `Listing`, `Admin Seller Profile`, `User`.
- Bir bağlam başka bağlamın alt tablosunu (child table) değiştiremez.
- Bir bağlam başka bağlamdan veri kopyalayabilir. Bu kopya "anlık görüntü" (snapshot) olarak işaretlenir. Örnek: Sevkiyat, siparişin adresini kendi kaydına kopyalar.

#### Kural 5: `hooks.py` bağlamlara bölünür

Bugün dört geliştirici tek bir `hooks.py` dosyasına yazıyor. Hedef düzende her bağlam kendi kayıtlarını kendi dosyasında tutar. `hooks.py` bu dosyaları yalnız birleştirir.

```python
# tradehub_core/ordering/hooks_fragment.py
doc_events = {
	"Order": {
		"on_update": "tradehub_core.ordering.handlers.on_order_update",
	},
}
scheduler_events = {"hourly": ["tradehub_core.ordering.tasks.expire_carts"]}
```

```python
# tradehub_core/hooks.py
from tradehub_core.shared.hooks_merge import merge
from tradehub_core.ordering import hooks_fragment as ordering
from tradehub_core.tax import hooks_fragment as tax
from tradehub_core.logistics import hooks_fragment as logistics

doc_events = merge(ordering.doc_events, tax.doc_events, logistics.doc_events)
scheduler_events = merge(ordering.scheduler_events, tax.scheduler_events, logistics.scheduler_events)
```

Bir bağlamın `hooks_fragment.py` dosyası yalnız kendi DocType'larını dinler. Başka bağlamın kaydına tepki vermek isteyen bağlam olay dinler.

Aynı yöntem `permission_query_conditions` ve `has_permission` için de kullanılır. Böylece `permissions.py` dosyası da bağlamlara bölünür.

`patches.txt` tek dosya kalmak zorunda. Frappe bunu böyle okur. Çakışmayı azaltmak için her bağlam kendi bölümünü kullanır. Patch dosyaları `tradehub_core/<bağlam>/patches/` klasöründe durur.

#### Kural 6: Denetleyiciler ince kalır

**Denetleyici** (controller), DocType'ın `.py` dosyasındaki sınıftır.

- Denetleyici yalnız kendi kaydının kurallarını kontrol eder. Örnek: "Fiyat eksi olamaz."
- İş akışları bağlamın servis fonksiyonlarına taşınır. Örnek: "Siparişi onayla."
- Başka bağlamı etkileyen işler olaya taşınır.

Her şeyi sınıf yapmak gerekmez. Basit fonksiyonlar bağımlılığı düşük tutuyorsa yeterlidir.

#### Kural 7: Ortak çekirdek küçük kalır

`tradehub_core/shared/` klasörü yalnız gerçekten ortak olan şeyleri tutar:

- para ve kur hesapları
- kiracı (tenant) ve satıcı kimliği
- çeviri yardımcıları
- olay sistemi
- `hooks.py` birleştirme yardımcısı

Yeni bir şeyi buraya koymak için ekip onayı gerekir.

---

## 3. Sipariş, vergi ve lojistik akışı

Bu akış örneğinizdeki üç geliştiricinin işini birbirinden ayırır.

### 3.1. Bugün

- Sipariş, ödeme, vergi ve lojistik kodu birbirinin durum alanlarına doğrudan bakıyor.
- Lojistik kodu `Order.status` alanını kendisi değiştiriyor.
- Ödeme kodu yalnız iki sipariş durumunu tanıyor.
- Bir geliştirici yeni bir durum eklerse diğer kodlar bunu bilmiyor.

Ayrıntılı kanıt `doctypes/04-siparis/README.md`, `doctypes/05-odeme/README.md` ve `doctypes/07-lojistik/README.md` dosyalarındadır.

### 3.2. Hedef akış

Her adımı tek bir bağlam yapar. Bağlamlar yalnız olayla konuşur.

1. **Sipariş bağlamı** siparişi oluşturur. Sonra `order.placed` olayını yayınlar.
2. **Vergi bağlamı** `order.placed` olayını dinler. Vergiyi hesaplar ve kendi tablosuna yazar. Sonra `order.tax_calculated` olayını yayınlar.
3. **Sipariş bağlamı** `order.tax_calculated` olayını dinler. Toplam tutarı siparişe anlık görüntü olarak yazar.
4. **Ödeme bağlamı** ödemeyi alır. Sonra `payment.collected` olayını yayınlar.
5. **Sipariş bağlamı** `payment.collected` olayını dinler. Siparişi "ödendi" yapar. Sonra `order.confirmed` olayını yayınlar.
6. **Katalog bağlamı** `order.confirmed` olayını dinler. Stoğu düşürür.
7. **Lojistik bağlamı** `order.confirmed` olayını dinler. Sevkiyat taslağını oluşturur.
8. **Lojistik bağlamı** kargo hareketlerinde `shipment.handed_over` ve `shipment.delivered` olaylarını yayınlar.
9. **Sipariş bağlamı** bu olayları dinler. Sipariş durumunu yalnız kendisi değiştirir.

Bu düzende sipariş durumunu yalnız sipariş bağlamı değiştirir. Lojistik geliştiricisi `Order` kaydına hiç dokunmaz. Vergi geliştiricisi iade formülünü değiştirirse iade kodu `tax/api.py` üzerinden yeni formülü kullanır.

### 3.3. Olay sözleşmesi

Her olayın yazılı bir sözleşmesi olur. Sözleşme şunları içerir:

- olayın adı ve sürümü, örnek: `order.confirmed` sürüm 1
- veri alanları ve tipleri
- olayı yayınlayan bağlam
- olayı dinleyen bağlamlar

Sözleşmeler `tradehub_core/<bağlam>/contracts.py` dosyasında durur. Bir alan silinecekse önce yeni sürüm yayınlanır. Eski sürüm bir süre daha desteklenir.

---

## 4. Kuralları kim ve nasıl uygular?

Yazılı kural tek başına yetmez. Kuralları makine kontrol etmeli.

### 4.1. CI içinde import kontrolü

`import-linter` aracı, hangi paketin hangi paketi import edebileceğini kontrol eder. Örnek ayar:

```toml
# pyproject.toml
[tool.importlinter]
root_package = "tradehub_core"

[[tool.importlinter.contracts]]
name = "Bağlamlar yalnız birbirinin api ve contracts dosyalarını kullanır"
type = "independence"
modules = [
	"tradehub_core.ordering",
	"tradehub_core.tax",
	"tradehub_core.logistics",
	"tradehub_core.payments",
]
ignore_imports = [
	"tradehub_core.* -> tradehub_core.*.api",
	"tradehub_core.* -> tradehub_core.*.contracts",
]
```

Bu ayarın sözdizimini kurulacak sürüme göre doğrulayın. Ben aracı bu repoda çalıştırmadım.

İlk aşamada kontrol yalnız uyarı verir. Bütün bağlamlar taşınınca kontrol PR'ı durdurur.

### 4.2. Testler CI içinde çalışır

[#372](https://github.com/tradehub-tr/tradehub_core/issues/372) issue'su şunu gösteriyor: CI bugün hiçbir uygulama testi çalıştırmıyor. Bu, modüler yapıdan önce çözülmeli.

Her bağlamın kendi test klasörü olur. Her olay sözleşmesi için bir sözleşme testi olur. Sözleşme testi şunu kontrol eder: Olay, sözleşmedeki alanlarla yayınlanıyor mu?

### 4.3. Kod sahipliği

`.github/CODEOWNERS` dosyası her bağlamı bir geliştiriciye bağlar. Örnek:

```
/tradehub_core/ordering/   @siparis-sorumlusu
/tradehub_core/tax/        @vergi-sorumlusu
/tradehub_core/logistics/  @lojistik-sorumlusu
/tradehub_core/shared/     @siparis-sorumlusu @vergi-sorumlusu @lojistik-sorumlusu
```

Buradaki adlar örnektir. Gerçek GitHub kullanıcı adlarını ekip seçer.

Bir PR başka bağlamın dosyasına dokunursa o bağlamın sahibi otomatik olarak incelemeye çağrılır.

---

## 5. Geçiş planı

Geçiş tek seferde yapılmaz. Her adım küçük bir PR'dır. Uygulama her adımdan sonra çalışmaya devam eder.

Görevlerin tamamı [FAZ-GOREVLERI.md](FAZ-GOREVLERI.md) dosyasındadır. Her görevde user story, kabul kriterleri, yapılmayacaklar ve kontrol listesi vardır.

**Her görevde dört kabul kriteri zorunludur:**

1. **Characterization test:** Bugünkü davranış testle kaydedildi.
2. **Shadow mode:** Yeni yol eski yolla birlikte çalıştı ve fark çıkmadı.
3. **TDD:** Test önce başarısız oldu, sonra geçti.
4. **Feature flag:** Yeni yol kapalı başladı.

### Faz −1: Güvenlik ağı

Kod taşınmadan önce bugünkü davranış testlerle dondurulur. Bu faz bitmeden hiçbir kod taşınmaz. 6 görev var.

### Faz 0: CI kapısı ve kurallar

Kuralları makine uygular. Her kontrol önce yalnız rapor verir, sonra zorunlu olur. 10 görev var.

### Faz 1: Ortak çekirdek ve olay sistemi

Para tipi, olay sistemi, shadow mode yardımcısı ve sözleşme araçları kurulur. 8 görev var.

### Faz 2: `hooks.py` dosyasını bölme

Ortak dosyalar bağlamlara bölünür. 4 görev var.

### Faz 3: Sipariş, vergi, ödeme ve lojistik

En çok hata üreten alan olaylarla ayrılır. 8 görev var.

### Faz 4: Diğer bağlamlar

Kalan bağlamlar aynı yöntemle taşınır. 7 görev var.

### Faz 5: DocType modüllerini taşıma

DocType'ın modül alanı değişir. Bu adım veritabanını etkiler ve en sona kalır. 4 görev var.

## 6. Dört geliştirici için çalışma kuralları

1. Her geliştirici bir ya da birkaç bağlamın sahibidir.
2. Bir PR mümkünse tek bir bağlamı değiştirir.
3. Başka bağlamın verisine ihtiyacınız varsa o bağlamın `api.py` dosyasını kullanın.
4. İhtiyacınız olan fonksiyon `api.py` dosyasında yoksa sahibinden isteyin. Kendiniz iç dosyaya dokunmayın.
5. Başka bağlama haber vermek için olay yayınlayın. O bağlamın kodunu çağırmayın.
6. Bir olayın alanını değiştirecekseniz önce yeni sürüm yayınlayın.
7. `hooks.py` dosyasına doğrudan yazmayın. Kendi `hooks_fragment.py` dosyanızı kullanın.
8. Yeni DocType'ı kendi bağlamınızın modülünde açın.
9. Her yeni davranış için önce başarısız olan bir test yazın.

---

## 7. Hardening: planın kendi risklerine karşı önlemler

**Hardening**, sistemi hatalara karşı sağlamlaştırmak demektir. Modüler yapı tek başına her sorunu çözmez. Aşağıdaki her risk için bir mimari önlem ve bir yönerge vardır.

| Risk | Önlem | Yönerge |
|---|---|---|
| İş kuralı yanlış olabilir | `Money` value object, karar tablosu, property-based test, mutation testing, mali müşavir onayı | [04-is-kurallari.md](YONERGELER/04-is-kurallari.md) |
| Olayın anlamı değişebilir | Pydantic modeller, şema kaydı, kırıcı değişiklik kontrolü, consumer-driven contract test, üretilen TypeScript tipleri ve `zod` | [05-olay-sozlesmesi.md](YONERGELER/05-olay-sozlesmesi.md) |
| Bir bağlam başka tabloya yazabilir | Sahiplik dosyası, `semgrep`, `import-linter`, testlerde yazma koruyucusu | [06-veri-sahipligi-ve-olaylar.md](YONERGELER/06-veri-sahipligi-ve-olaylar.md) |
| Ekip kuralları atlayabilir | Dal koruması, `CODEOWNERS`, PR denetleyici, ratchet, ADR | [08-pr-sablonu.md](YONERGELER/08-pr-sablonu.md) |
| Olay gecikebilir | CQRS: hemen gereken sonuç sorgu ile alınır, olay yalnız bekleyebilen işte kullanılır | [06-veri-sahipligi-ve-olaylar.md](YONERGELER/06-veri-sahipligi-ve-olaylar.md) |
| Olay iki kez gelebilir ya da kaybolabilir | Transactional outbox, idempotent dinleyici, dead letter, uzlaştırma işi, durum makinesi | [06-veri-sahipligi-ve-olaylar.md](YONERGELER/06-veri-sahipligi-ve-olaylar.md) |
| Patch canlı veriyi bozabilir | Expand and contract, migration rehearsal, `--dry-run`, yedek ve geri dönüş | [06-veri-sahipligi-ve-olaylar.md](YONERGELER/06-veri-sahipligi-ve-olaylar.md) |
| Raporlar yapay zekâ çıktısıdır | Ajan önce iddiayı kodda doğrular, sonra characterization test yazar | [00-ajan-talimati.md](YONERGELER/00-ajan-talimati.md) |
| Hangi sayının kaç olacağı bilinmez | Her metriğin hedefi yazılı. CI kötüleşmeyi durdurur | [07-metrikler.md](YONERGELER/07-metrikler.md) |

Diğer yönergeler: [TDD](YONERGELER/01-tdd.md), [characterization test](YONERGELER/02-characterization-test.md), [shadow mode](YONERGELER/03-shadow-mode.md).

### Eklenen kütüphaneler

- **Python:** `pytest`, `hypothesis`, `syrupy`, `time-machine`, `diff-cover`, `mutmut`, `pydantic`, `python-statemachine`, `import-linter`, `semgrep`.
- **TypeScript:** `zod`, `json-schema-to-typescript`, `msw`, `@playwright/test`.

Sürümleri kurmadan önce projenin Python ve Node sürümleriyle doğrulayın. Bu kütüphaneleri bu repoda kurmadım ve çalıştırmadım.

### Bu önlemler neyi garanti etmez?

Bu önlemler hatayı sıfıra indirmez. Hatanın küçük kalmasını, hızlı görülmesini ve geri alınmasını sağlar. Bir kural testle ya da tabloyla yazılmadıysa hiçbir araç onu koruyamaz.

## 8. Dosyalar

- [Faz görevleri](FAZ-GOREVLERI.md)
- `YONERGELER/`: 9 yönerge
- [Ortak işçi talimatı](ORTAK-BRIEF.md)
- [DocType envanteri](_veri/envanter.json)
- [DocType bağlam haritası](_veri/baglamlar.json)
- `doctypes/<bağlam>/README.md`: Her bağlamın planı
- `doctypes/<bağlam>/<doctype>.md`: Her DocType'ın raporu

## 9. Doğrulanmayanlar

- `import-linter` ayarını bu repoda çalıştırmadım.
- Önerilen kod örneklerini çalıştırmadım. Bunlar tasarım örnekleridir.
- Faz sürelerini ekip hızına göre tahmin ettim. Gerçek süreyi ekip belirlemeli.
- DocType raporlarının doğruluğu her raporun kendi kanıtına bağlıdır.
