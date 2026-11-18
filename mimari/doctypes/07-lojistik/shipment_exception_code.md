# Shipment Exception Code

- Bağlam: 07-lojistik
- Tür: Ana kayıt
- Klasör: `tradehub_core/tradehub_core/doctype/shipment_exception_code`
- Denetleyici: `tradehub_core/tradehub_core/doctype/shipment_exception_code/shipment_exception_code.py` (17 satır)
- Önerilen sahip bağlam: 07-lojistik

## Epic

- Epic adı: Shipment Exception Code: 07-lojistik bağlamına taşıma
- Öncelik: Düşük
- Faz: Faz 3
- Tahmini büyüklük: Küçük

### User story

Bir geliştirici olarak, lojistik kancalarının tek bir dosyada durmasını istiyorum.
Böylece aynı anahtar iki kez tanımlanmaz.

### Kabul kriterleri

- [ ] Lojistik `doc_events` kayıtları tek bir lojistik dosyasında duruyor.
- [ ] `hooks.py` bu dosyayı birleştiriyor. Birleşen sözlük eskisiyle aynı.
- [ ] Yeni kod eklenince kod haritası güncelleniyor. Bunu bir test gösteriyor.
- [ ] Characterization test: `Shipment Exception Code` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- `hooks.py` sonuna yeni döngüyle kanca eklemeyin. Lojistik kanca dosyasını kullanın.
- Önbellek temizleme kancasını kaldırmayın. Yeni kod "OTHER" görünür.
- Seed yamasındaki kodların adını değiştirmeyin. Eşlemeler bu kodlara bağlıdır.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] Birleşen `doc_events` karşılaştırma testi geçiyor.
- [ ] Kod haritası testi eklendi.
- [ ] Lojistik ekibinden `CODEOWNERS` incelemesi istendi.
- [ ] `import-linter` kontrolü geçiyor.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?

`Shipment Exception Code` lojistik sorun kodlarının kataloğudur. Örneğin "adres bulunamadı" bir koddur. Kayıtta kategori, önem derecesi ve önerilen işlem vardır.

## Bugünkü bağımlılıklar

### Bu kaydın bağlandığı kayıtlar

- Link alanı yok.

### Bu kayda dokunan kod

- `tradehub_core/logistics/services/exception_service.py:94`: okuyor. Kod haritasını önbelleğe alıyor.
- `tradehub_core/logistics/services/exception_notifier.py:80`: okuyor.
- `tradehub_core/api/v1/pod.py:167`: okuyor.
- `tradehub_core/api/v1/logistics_ops.py:957`: okuyor.
- `tradehub_core/api/v1/logistics_catalog.py:206`: okuyor.
- `tradehub_core/patches/v15_log034_seed_exception_codes.py:24`: yazıyor. Başlangıç verisi.

### hooks.py kayıtları

- `tradehub_core/hooks.py:1596`: `after_insert`, `on_update` ve `on_trash` için önbellek temizleme kancası. Kanca `doc_events` sözlüğüne dosyanın sonunda ekleniyor.

## Bağımlılık sorunları

1. Kanca `hooks.py` dosyasının sonunda döngüyle ekleniyor. Kanıt: `tradehub_core/hooks.py:1596`. Bir geliştirici yukarıda aynı anahtarı tanımlarsa sonuç belirsiz olabilir. Sorun aynı bağlamda kalıyor.

## Hedef tasarım

- Sahip bağlam ve paket yolu: 07-lojistik, `tradehub_core/logistics/doctype/shipment_exception_code/`.
- Dışarıya açılan fonksiyonlar: yok.
- Yayınladığı ve dinlediği olaylar: yok.
- Denetleyicide kalacak doğrulamalar: kod biçimi.
- Kancalar: lojistik kancaları `tradehub_core/logistics/hooks_registry.py` gibi tek bir dosyada toplanır. `hooks.py` bu dosyayı birleştirir.

## Geçiş adımları

1. Lojistik `doc_events` kayıtlarını tek bir sözlükte toplayın. `hooks.py` bu sözlüğü birleştirsin.
2. DocType klasörünü "Logistics" modülüne taşıyın.

## Riskler ve testler

- Önbellek bayat kalırsa yeni kod "OTHER" görünür. Kod ekleme sonrası harita testini ekleyin.
