# Proof of Delivery Revision

- Bağlam: 07-lojistik
- Tür: Kayıt defteri (log)
- Klasör: `tradehub_core/tradehub_core/doctype/proof_of_delivery_revision`
- Denetleyici: `tradehub_core/tradehub_core/doctype/proof_of_delivery_revision/proof_of_delivery_revision.py` (23 satır)
- Önerilen sahip bağlam: 07-lojistik

## Epic

- Epic adı: Proof of Delivery Revision: 07-lojistik bağlamına taşıma
- Öncelik: Düşük
- Faz: Faz 3
- Tahmini büyüklük: Küçük

### User story

Bir geliştirici olarak, teslim kanıtı sürümlerinin ürün silme paketine bağlı olmamasını istiyorum.
Böylece o paket değişince sürüm kaydı bozulmaz.

### Kabul kriterleri

- [ ] Denetleyici `planned_delete` süsleyicisini `tradehub_core/shared/` altından alıyor.
- [ ] Teslim kanıtı düzeltilince bir sürüm kaydı yazılıyor. Bunu bir test gösteriyor.
- [ ] Sürüm kaydı sonradan değiştirilemiyor.
- [ ] Characterization test: `Proof of Delivery Revision` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- Sürüm kaydını servis dışından yazmayın.
- Eski sürümleri silen bir temizlik işi eklemeyin. Sürümler denetim izidir.
- Bu değişikliği `Proof of Delivery` değişikliğinden ayrı yapmayın. İki kayıt aynı içe aktarmayı kullanır.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] `test_pod_api.py` geçiyor.
- [ ] Sürüm sayısı testi eklendi.
- [ ] `import-linter` kontrolü geçiyor.
- [ ] Katalog ekibinden `CODEOWNERS` incelemesi istendi.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?

`Proof of Delivery Revision` teslim kanıtının eski sürümlerini saklar. Teslim kanıtı değişince eski hali bu kayda kopyalanır. Kayıtta değişikliği yapan kişi ve neden vardır.

## Bugünkü bağımlılıklar

### Bu kaydın bağlandığı kayıtlar

- `Proof of Delivery` (`proof_of_delivery`, zorunlu): aynı bağlam
- `Shipment` (`shipment`, zorunlu): aynı bağlam
- `User` (`amended_by`, zorunlu): çekirdek Frappe kaydı

### Bu kayda dokunan kod

- `tradehub_core/logistics/services/pod_service.py:201`: yazıyor.
- `tradehub_core/api/v1/pod.py:191`: okuyor.
- `tradehub_core/listing_purge/executor.py:39`: siliyor.
- `tradehub_core/tradehub_core/doctype/proof_of_delivery_revision/proof_of_delivery_revision.py:7`: denetleyici `listing_purge.guards` modülünü içe aktarıyor.

### hooks.py kayıtları

- Kayıt yok.

## Bağımlılık sorunları

1. Denetleyici ürün silme paketine bağlı. Kanıt: `tradehub_core/tradehub_core/doctype/proof_of_delivery_revision/proof_of_delivery_revision.py:7`. Sorun `Proof of Delivery` raporundaki ile aynıdır.

## Hedef tasarım

- Sahip bağlam ve paket yolu: 07-lojistik, `tradehub_core/logistics/doctype/proof_of_delivery_revision/`.
- Dışarıya açılan fonksiyonlar ve olaylar: yok.
- Denetleyicide kalacak doğrulamalar: yalnız servis yazabilir, kayıt değişmez.

## Geçiş adımları

1. `Proof of Delivery` ile aynı PR içinde `planned_delete` içe aktarmasını ortak çekirdeğe çevirin.
2. DocType klasörünü "Logistics" modülüne taşıyın.

## Riskler ve testler

- Sürüm kaydı yazılmadan kanıt değişebilir. Düzeltme sonrası sürüm sayısı testini koruyun.
