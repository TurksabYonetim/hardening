# Data Retention Policy

- Bağlam: 13-uyum-gizlilik
- Tür: Ana kayıt
- Klasör: `tradehub_core/tradehub_core/doctype/data_retention_policy`
- Denetleyici: `tradehub_core/tradehub_core/doctype/data_retention_policy/data_retention_policy.py` (19 satır)
- Önerilen sahip bağlam: 13-uyum-gizlilik

## Epic

- Epic adı: Data Retention Policy: 13-uyum-gizlilik bağlamına taşıma
- Öncelik: Acil
- Faz: Faz 4
- Tahmini büyüklük: Büyük

### User story

Bir geliştirici olarak, saklama süresi dolan verinin sahip bağlamın kendi koduyla anonim yapılmasını istiyorum.
Böylece gizlilik görevi benim tablomun korumalarını atlamaz.

### Kabul kriterleri

- [ ] `tradehub_anonymizers` kayıt noktası var.
- [ ] `privacy/data_retention.py` içinde ham SQL yazımı kalmadı.
- [ ] CI testi bütün kuralların alan adlarını hedef DocType meta bilgisiyle kontrol ediyor.
- [ ] Süresi dolmuş örnek kayıt anonim oluyor. Yeni kayıt değişmiyor.
- [ ] Görev `privacy/tasks.py` içinden çalışıyor.
- [ ] Characterization test: `Data Retention Policy` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- Başka bağlamın tablosuna `frappe.db.sql` ya da `set_value` ile yazmayın. Anonimleştirmeyi sahip bağlam yapar.
- Kurala var olmayan alan adı yazmayın. Kural sessizce çalışmaz.
- Sipariş ya da fatura kanıtı olan alanı yasal süre dolmadan anonim yapmayın.
- Tablo adını f-string içinde kullanıcı girdisiyle kurmayın. SQL enjeksiyonu açılır.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] Değişen davranış için önce başarısız olan bir test yazıldı.
- [ ] Ruff ve uygulama testleri yerelde geçiyor.
- [ ] `import-linter` kontrolü `tradehub_core.privacy` için geçiyor.
- [ ] `CODEOWNERS` içindeki gizlilik bağlamı sahibinden inceleme istendi.
- [ ] Her anonimleştirici için sözleşme testi var.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?

Bu kayıt bir DocType için saklama süresini tanımlar. Süre dolunca seçili alanlar anonim yapılır. Anonim yapmak, kişiyi tanıtan bilgiyi silmek ya da değiştirmek demektir. Gece görevi bu kuralları uygular.

## Bugünkü bağımlılıklar

### Bu kaydın bağlandığı kayıtlar

- `DocType` (`ref_doctype`, Link): başka bağlam (Frappe çekirdeği)
- `Retention Anonymize Field` (`fields_to_anonymize`, alt tablo): aynı bağlam

### Bu kayda dokunan kod

- `tradehub_core/privacy/data_retention.py:28`: adını kullanıyor
- `tradehub_core/privacy/data_retention.py:45`: adını kullanıyor
- `tradehub_core/setup/module_navigation_spec.py:1180`: adını kullanıyor

### hooks.py kayıtları

- `tradehub_core/hooks.py:386`: zamanlanmış görev `audit.tasks.run_data_retention_enforcement`.

## Bağımlılık sorunları

1. Saklama görevi her bağlamın tablosuna doğrudan SQL ile yazıyor. Kanıt: `privacy/data_retention.py:77` ham SQL ile okuyor. `privacy/data_retention.py:128` `frappe.db.set_value` ile yazıyor. Bu yazım hedef DocType'ın denetleyicisini atlar.
2. Kural başka bağlamın alan adlarını metin olarak tutuyor. Bir geliştirici alanın adını değiştirirse kural sessizce bozulur. Denetleyici bunu yalnız kayıt anında yakalar. Kanıt: `data_retention_policy.py:14`.
3. Görev `audit` paketinden çağrılıyor. Kanıt: `audit/tasks.py:118` ve `hooks.py:386`.
4. Hata mesajları çeviri fonksiyonu kullanmıyor.

## Hedef tasarım

- Sahip bağlam ve paket yolu: `tradehub_core/privacy/` paketi ve yeni `Privacy` Frappe modülü.
- Dışarıya açılan fonksiyonlar: `privacy/api.py` içinde `list_retention_policies()` fonksiyonu.
- Yayınladığı olaylar: `retention.due`. Olay şu alanları taşır: `ref_doctype`, `names`, `fields`, `strategy`, `policy`.
- Dinlediği olaylar: Yok.
- Başka bağlamlara bağlantılar: `ref_doctype` Link alanı kalır. Asıl anonimleştirme işini sahip bağlam yapar. Her bağlam `hooks.py` içine kendi anonimleştiricisini yazar. Örnek ad: `tradehub_anonymizers`.
- Denetleyicide kalacak doğrulamalar: Süre ve alan varlığı doğrulamaları kalır.
- Servise taşınacak iş kuralları: Ham SQL yerine sahip bağlamın anonimleştirici fonksiyonu çağrılır.

## Geçiş adımları

1. `privacy/contracts.py` içinde anonimleştirici sözleşmesini tanımlayın.
2. `tradehub_anonymizers` kayıt noktasını ekleyin. Kayıt yoksa bugünkü SQL yolu çalışsın.
3. Her bağlam kendi anonimleştiricisini ayrı PR ile eklesin.
4. Tüm bağlamlar geçince ham SQL yolunu silin. Görevi `privacy/tasks.py` içine taşıyın.
5. Bağlam sahiplerine alan adı değişikliğini haber veren bir CI testi ekleyin. Test tüm kuralların alanlarını meta ile kontrol etsin.

## Riskler ve testler

- Yanlış alan anonim yapılabilir ya da hiç yapılmayabilir. Test: süresi dolmuş örnek kayıt anonim olmalı, yeni kayıt değişmemeli.
- Alan adı değişince kural sessizce çalışmayı durdurur. Test: CI testi bilinmeyen alanı yakalamalı.
