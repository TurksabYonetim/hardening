# Shipping Zone

- Bağlam: 07-lojistik
- Tür: Ana kayıt
- Klasör: `tradehub_core/tradehub_core/doctype/shipping_zone`
- Denetleyici: `tradehub_core/tradehub_core/doctype/shipping_zone/shipping_zone.py` (56 satır)
- Önerilen sahip bağlam: 07-lojistik

## Epic

- Epic adı: Shipping Zone: 07-lojistik bağlamına taşıma
- Öncelik: Düşük
- Faz: Faz 3
- Tahmini büyüklük: Küçük

### User story

Bir geliştirici olarak, bölge denetiminin proje kuralına uygun sorgu kullanmasını istiyorum.
Böylece kod tutarlı olur.

### Kabul kriterleri

- [ ] Çakışma sorgusu `frappe.qb` ile yazıldı.
- [ ] Bir il iki aktif bölgeye eklenemiyor. Bunu bir test gösteriyor.
- [ ] Fiyat testleri geçiyor.
- [ ] Characterization test: `Shipping Zone` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- Sorguya kullanıcı girdisini metin birleştirerek koymayın.
- Bir ilin iki aktif bölgede olmasına izin vermeyin. Fiyat belirsiz olur.
- Varsayılan bölgeleri kuran kodu silmeyin.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] İl çakışma testi eklendi.
- [ ] `test_pricing_engine.py` geçiyor.
- [ ] Ruff kontrolü geçiyor.
- [ ] Lojistik ekibinden `CODEOWNERS` incelemesi istendi.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?

`Shipping Zone` kargo fiyatı için illeri gruplar. Örneğin "Yakın Bölge" birkaç ili içerir. Bir il yalnız bir aktif bölgede olabilir. İller `Shipping Zone City` alt tablosundadır.

## Bugünkü bağımlılıklar

### Bu kaydın bağlandığı kayıtlar

- `Shipping Zone City` (`cities`, alt tablo): aynı bağlam

### Bu kayda dokunan kod

- `tradehub_core/logistics/services/pricing_engine.py:469`: okuyor. Varış ilinin bölgesini buluyor.
- `tradehub_core/logistics/services/pricing_rule_service.py:224`: okuyor.
- `tradehub_core/logistics/shipping_zones.py:25`: yazıyor. Varsayılan bölgeleri kuruyor.
- `tradehub_core/api/v1/logistics_catalog.py:188`: okuyor.
- `tradehub_core/setup/install.py:34`: kurulumda varsayılan bölgeleri yüklüyor.

### hooks.py kayıtları

- Kayıt yok.

## Bağımlılık sorunları

1. Denetleyici ham SQL kullanıyor. Kanıt: `tradehub_core/tradehub_core/doctype/shipping_zone/shipping_zone.py:40`. Sorgu parametreli, bu yüzden güvenlik açığı görünmüyor. Proje kuralı `frappe.qb` kullanımını önerir. Sorun aynı bağlamda kalıyor.

## Hedef tasarım

- Sahip bağlam ve paket yolu: 07-lojistik, `tradehub_core/logistics/doctype/shipping_zone/`.
- Dışarıya açılan fonksiyonlar ve olaylar: yok.
- Denetleyicide kalacak doğrulamalar: bölge kodu biçimi, bir ilin tek aktif bölgede olması.

## Geçiş adımları

1. SQL sorgusunu `frappe.qb` ile yeniden yazın. Davranış değişmesin.
2. DocType klasörünü "Logistics" modülüne taşıyın.

## Riskler ve testler

- Bir il iki bölgeye girebilir. İl çakışma testini ekleyin.
