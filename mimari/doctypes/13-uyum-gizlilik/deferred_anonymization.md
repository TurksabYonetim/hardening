# Deferred Anonymization

- Bağlam: 13-uyum-gizlilik
- Tür: Kayıt defteri (log)
- Klasör: `tradehub_core/tradehub_core/doctype/deferred_anonymization`
- Denetleyici: `tradehub_core/tradehub_core/doctype/deferred_anonymization/deferred_anonymization.py` (8 satır)
- Önerilen sahip bağlam: 13-uyum-gizlilik

## Epic

- Epic adı: Deferred Anonymization: 13-uyum-gizlilik bağlamına taşıma
- Öncelik: Acil
- Faz: Faz 4
- Tahmini büyüklük: Orta

### User story

Bir geliştirici olarak, sevkiyat adresinin lojistik kodu tarafından anonim yapılmasını istiyorum.
Böylece lojistik ekibi alan adı değiştirince anonimleştirme bozulmaz.

### Kabul kriterleri

- [ ] `anonymize_shipment_address(name)` fonksiyonu lojistik paketinde var.
- [ ] `ANONYMIZE_FIELDS` sözlüğü `privacy` paketinden silindi.
- [ ] Vadesi gelmiş satır işlenince adres alanları anonim oluyor.
- [ ] İşleyici hata verince satırın durumu "Done" olmuyor.
- [ ] Characterization test: `Deferred Anonymization` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- `Shipment Address Snapshot` tablosuna gizlilik kodundan `db.set_value` ile yazmayın. Lojistik koruması atlanır.
- 90 günlük süreyi kod içinde ikinci kez tanımlamayın. Sabit tek yerde kalmalı.
- Satırı işlemeden "Done" yapmayın. Kanıt kaybolur.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] Değişen davranış için önce başarısız olan bir test yazıldı.
- [ ] Ruff ve uygulama testleri yerelde geçiyor.
- [ ] `import-linter` kontrolü `tradehub_core.privacy` için geçiyor.
- [ ] `CODEOWNERS` içindeki gizlilik bağlamı sahibinden inceleme istendi.
- [ ] Abone aynı olayı iki kez alınca ikinci işlem hiçbir şey değiştirmiyor.
- [ ] Lojistik bağlamı sahibinden de inceleme istendi.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?

Bu kayıt ertelenmiş anonimleştirme işlerini tutar. Hesap silinince bazı kayıtlar kanıt olarak bir süre kalır. Örneğin sevkiyat adresi 90 gün sonra anonim olur. Günlük görev vadesi gelen satırları işler.

## Bugünkü bağımlılıklar

### Bu kaydın bağlandığı kayıtlar

- `DocType` (`reference_doctype`, Link): başka bağlam (Frappe çekirdeği)

### Bu kayda dokunan kod

- `tradehub_core/privacy/deferred_anonymization.py:48`: adını kullanıyor
- `tradehub_core/privacy/deferred_anonymization.py:63`: adını kullanıyor

### hooks.py kayıtları

- `tradehub_core/hooks.py:391`: zamanlanmış görev `privacy.deferred_anonymization.run_due_anonymizations`.

## Bağımlılık sorunları

1. Gizlilik kodu lojistik tablosuna doğrudan yazıyor. Kanıt: `privacy/deferred_anonymization.py:24` satırında `Shipment Address Snapshot` alanları var. Yazım `privacy/deferred_anonymization.py:85` satırında `db.set_value` ile yapılıyor. Lojistik ekibi alan adını değiştirirse anonimleştirme bozulur.
2. Kod, lojistik denetleyicisinin korumasını bilerek atlıyor. Kanıt: `privacy/deferred_anonymization.py:9` yorumu.

## Hedef tasarım

- Sahip bağlam ve paket yolu: `tradehub_core/privacy/` paketi ve yeni `Privacy` Frappe modülü.
- Dışarıya açılan fonksiyonlar: `privacy/api.py` içinde `schedule_anonymization(doctype, names, days, reason)`.
- Yayınladığı olaylar: `anonymization.due`. Olay şu alanları taşır: `reference_doctype`, `reference_name`, `reason`.
- Dinlediği olaylar: 01 bağlamının `account.deleted` olayı.
- Başka bağlamlara bağlantılar: `reference_doctype` Link alanı kalır. Alan listesi sahip bağlamda durur. Lojistik bağlamı `anonymization.due` olayını dinler ve kendi kaydını anonim yapar.
- Denetleyicide kalacak doğrulamalar: Ayrı doğrulama gerekmiyor.
- Servise taşınacak iş kuralları: `ANONYMIZE_FIELDS` sözlüğü lojistik paketine taşınır.

## Geçiş adımları

1. Lojistik paketine `anonymize_shipment_address(name)` fonksiyonunu ekleyin. Bu fonksiyon kopya korumasını kendi bilerek açsın.
2. `run_due_anonymizations` bu fonksiyonu `tradehub_anonymizers` kayıt noktası üzerinden çağırsın.
3. `ANONYMIZE_FIELDS` sözlüğünü `privacy` paketinden silin.

## Riskler ve testler

- 90 gün sonra adres anonim olmayabilir. Test: vadesi gelmiş satır sonrası adres alanları anonim olmalı.
- Durum "Done" olur ama yazım yapılmayabilir. Test: işleyici hata verirse durum değişmemeli.
