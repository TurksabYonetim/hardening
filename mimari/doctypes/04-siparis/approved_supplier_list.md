# Approved Supplier List

- Bağlam: 04-siparis
- Tür: Ana kayıt
- Klasör: `tradehub_core/tradehub_core/doctype/approved_supplier_list`
- Denetleyici: `tradehub_core/tradehub_core/doctype/approved_supplier_list/approved_supplier_list.py` (53 satır)
- Önerilen sahip bağlam: 04-siparis, `ordering/procurement/` alt paketi. `Approval Rule` ve `Cost Center` bugün 01-kimlik-erisim bağlamında. Bu üçü aynı satın alma politikasıdır. Üçü aynı pakette toplanmalı.

## Epic

- Epic adı: Approved Supplier List: 04-siparis bağlamına taşıma
- Öncelik: Önemli
- Faz: Faz 3
- Tahmini büyüklük: Orta

### User story

Bir platform yöneticisi olarak, alıcı şirketin yalnız onaylı tedarikçiden alım yapmasını istiyorum.
Böylece şirket satın alma politikası korunur.

### Kabul kriterleri

- [ ] Liste kodu `ordering/procurement/` paketinde.
- [ ] `hooks.py` kaydı yeni yolu gösteriyor. Eski yol yönlendirme ile çalışıyor.
- [ ] Onaysız tedarikçiden sipariş reddediliyor. `tests/test_procurement.py` geçiyor.
- [ ] Liste değişince sonraki sipariş yeni listeyi görüyor.
- [ ] Characterization test: `Approved Supplier List` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- Kiracı başına ikinci varsayılan liste açmayın. `approved_supplier_list.py:17` bunu engeller.
- Önbelleği temizlemeden listeyi doğrudan SQL ile değiştirmeyin.
- `Approval Rule` ve `Cost Center` kayıtlarını 01-kimlik-erisim sahibine sormadan taşımayın.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] Satın alma testleri geçiyor.
- [ ] Önbellek temizliği test edildi.
- [ ] Eski uç nokta adresleri çalışıyor.
- [ ] 01-kimlik-erisim sahibinden görüş alındı.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?
`Approved Supplier List` alıcı şirketin onaylı tedarikçi listesidir. Liste hangi satıcıdan alım yapılabileceğini söyler. Her kiracının bir varsayılan listesi olur. Sipariş kaydı açılırken liste denetlenir.

## Bugünkü bağımlılıklar
### Bu kaydın bağlandığı kayıtlar
- `Admin Seller Profile` (`tenant`): başka bağlam (02-satici-magaza)
- `Approved Supplier Entry` (`suppliers`, alt tablo): aynı bağlam

### Bu kayda dokunan kod
- `tradehub_core/api/v1/procurement.py:246`: yazıyor (liste açar)
- `tradehub_core/api/v1/procurement.py:281`: yazıyor (liste siler)
- `tradehub_core/api/v1/procurement.py:181`: okuyor
- `tradehub_core/services/supplier_whitelist.py:53`: okuyor (önbellekli varsayılan liste)
- `tradehub_core/api/v1/authorization_simulator.py:114`: okuyor (yetki deneme aracı)
- `tradehub_core/setup/handover_validator.py:105`: okuyor (kurulum denetimi)

### Denetleyicinin kendi dış çağrıları
- `approved_supplier_list.py:46`: `services.supplier_whitelist` önbelleğini temizler.

### hooks.py kayıtları
- Doğrudan kayıt yok.
- `hooks.py:704`: `Order.before_insert` olayında `supplier_whitelist.validate_order_supplier` çalışır. Bu işleyici bu listeyi okur.

## Bağımlılık sorunları
1. Liste mantığı `services/` klasöründe, uç noktalar `api/v1/` klasöründe, DocType ise ortak klasörde. Üç yer üç ayrı sahipte görünüyor. Satın alma kuralı değişince üç dosya birlikte değişmeli.
2. `tenant` alanı `Admin Seller Profile` kaydına bağlı (`approved_supplier_list.json:13`). Alıcı şirketi bir satıcı mağazası gibi tutuluyor. Bu kimlik modeli 01-kimlik-erisim bağlamında netleşmeli. Bu nokta doğrulanmadı.

## Hedef tasarım
- Sahip bağlam: 04-siparis. Paket yolu: `tradehub_core/ordering/procurement/`.
- Dışarıya açılan fonksiyonlar (`ordering/api.py`):
  - `check_supplier_allowed(buyer_tenant: str, supplier: str, amount, categories) -> Decision`
- Yayınladığı olaylar: yok.
- Dinlediği olaylar: yok. Liste sipariş açılırken eşzamanlı okunur.
- Başka bağlamlara bağlantılar: `tenant` ve `supplier` Link olarak kalır.
- Denetleyicide kalacak doğrulamalar: kiracı başına tek varsayılan liste (`approved_supplier_list.py:17`), aynı tedarikçinin iki kez yazılmaması (`approved_supplier_list.py:35`).
- Servise taşınacak iş kuralları: `services/supplier_whitelist.py` dosyasının tamamı.

## Geçiş adımları
1. `services/supplier_whitelist.py` dosyasını `ordering/procurement/whitelist.py` konumuna taşıyın. Eski yolda bir yönlendirme bırakın.
2. `hooks.py:704` kaydını yeni yola çevirin.
3. `api/v1/procurement.py` uç noktalarını `ordering/procurement/endpoints.py` içine taşıyın. Eski adres korunmalı.
4. `Approval Rule` ve `Cost Center` taşınmasını 01-kimlik-erisim sahibiyle konuşun. Bu adım ayrı bir PR olur.

## Riskler ve testler
- Onaysız tedarikçiden sipariş açılabilir. Var olan test korunmalı: `tests/test_procurement.py:166`.
- Önbellek eski listeyi tutabilir. Test: liste değişince sonraki sipariş yeni listeyi görmeli.
