# ECA Rule Log

- Bağlam: 14-platform-cekirdek
- Tür: Kayıt defteri (log)
- Klasör: `tradehub_core/tradehub_core/doctype/eca_rule_log`
- Denetleyici: `tradehub_core/tradehub_core/doctype/eca_rule_log/eca_rule_log.py` (14 satır)
- Önerilen sahip bağlam: 14-platform-cekirdek

## Epic

- Epic adı: ECA Rule Log: 14-platform-cekirdek bağlamına taşıma
- Öncelik: Düşük
- Faz: Faz 4
- Tahmini büyüklük: Küçük

### User story

Bir geliştirici olarak, kural loglarının genel bir bağlam alanı taşımasını istiyorum.
Böylece çekirdek içe aktarma bağlamına bağlı kalmaz.

### Kabul kriterleri

- [ ] `context_doctype` ve `context_name` alanları var.
- [ ] `bulk_import_job` alanı kaldırıldı.
- [ ] `purge_rule_logs` fonksiyonu var. `bulk_import/tasks.py` bunu kullanıyor.
- [ ] `has_permission` kaydı eklendi.
- [ ] Characterization test: `ECA Rule Log` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- Çekirdek tablosuna iş bağlamına özel Link alanı eklemeyin.
- İçe aktarma kodundan bu tabloyu doğrudan silmeyin.
- Log yazma hatası yüzünden kuralı durdurmayın.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] Değişen davranış için önce başarısız olan test yazıldı.
- [ ] Ruff ve ilgili testler yerelde geçiyor.
- [ ] `import-linter` kontrolü yeni ihlal üretmiyor.
- [ ] `CODEOWNERS` içindeki 14-platform-cekirdek sahibi inceleyici olarak eklendi.
- [ ] `test_eca_rule_log.py` geçiyor.
- [ ] Patch iki kez çalışınca veri bozulmuyor.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?
Bu kayıt her kural çalışmasının sonucudur. Koşul sonucu, eylem çalıştı mı ve hata bilgisi saklanır. Toplu yüklemede hangi işten geldiği de tutulur.

## Bugünkü bağımlılıklar
### Bu kaydın bağlandığı kayıtlar
- `ECA Rule` (`eca_rule`): aynı bağlam
- `Bulk Import Job` (`bulk_import_job`): başka bağlam (03b-ice-aktarma)
### Bu kayda dokunan kod
- `tradehub_core/eca/dispatcher.py:1065`: kaydı oluşturuyor
- `tradehub_core/eca/dispatcher.py:561`, `:597`: eski sürüm yazıcıları
- `tradehub_core/bulk_import/tasks.py:81-82`: işe ait kayıtları siliyor
- `tradehub_core/eca/api.py`: listeliyor
### hooks.py kayıtları
- `tradehub_core/hooks.py:1123`: `permission_query_conditions`

## Bağımlılık sorunları
1. Çekirdek log tablosu içe aktarma işine bağlı. Kanıt: `bulk_import_job` Link alanı. Çekirdek, üst katmandaki bir bağlamı biliyor. Bağımlılık yönü ters.
2. İçe aktarma kodu çekirdek tablosunu siliyor. Kanıt: `bulk_import/tasks.py:82`.
3. `has_permission` kaydı yok. Yalnız liste filtresi var (`hooks.py:1123`). Tek kayıt açılışı rol izniyle sınırlı.

## Hedef tasarım
- Sahip bağlam: 14-platform-cekirdek. `ECA Rule` ile aynı paket.
- `bulk_import_job` alanı genel bir bağlam alanına çevrilir. Örneğin `context_doctype` ve `context_name`. Bu bir Dynamic Link olur. Dynamic Link, hedef DocType adını ayrı alanda tutan bağlantıdır.
- Dışa açık fonksiyon: `purge_rule_logs(context_doctype, context_name)`.
- Olay yoktur.
- Denetleyicide durum değeri kontrolü kalır.

## Geçiş adımları
1. `context_doctype` ve `context_name` alanlarını ekleyin. Yazıcı iki yere de yazsın.
2. `purge_rule_logs` fonksiyonunu ekleyin. `bulk_import/tasks.py:81` buna bağlansın.
3. Eski `bulk_import_job` alanını kaldırın. Bu adım 1 ve 2'den sonra gelir.
4. `has_permission` kaydını ekleyin.

## Riskler ve testler
- Toplu yükleme hata raporu log kayıtlarını okur. Rapor testini taşıma sırasında çalıştırın.
- `test_eca_rule_log.py` korunmalı.
