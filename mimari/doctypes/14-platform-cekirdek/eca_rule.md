# ECA Rule

- Bağlam: 14-platform-cekirdek
- Tür: Ana kayıt (kural tanımı)
- Klasör: `tradehub_core/tradehub_core/doctype/eca_rule`
- Denetleyici: `tradehub_core/tradehub_core/doctype/eca_rule/eca_rule.py` (58 satır)
- Önerilen sahip bağlam: 14-platform-cekirdek. Bugün kurallar yalnız `Listing` kaydında çalışıyor. Kural motoru ileride katalog dışına açılırsa çekirdekte kalmalı.

## Epic

- Epic adı: ECA Rule: 14-platform-cekirdek bağlamına taşıma
- Öncelik: Önemli
- Faz: Faz 4
- Tahmini büyüklük: Orta

### User story

Bir geliştirici olarak, kural motorunun yalnız bildirdiğim alanlara yazmasını istiyorum.
Böylece kural hatası ürün kaydını durdurmaz.

### Kabul kriterleri

- [ ] `register_rule_target` fonksiyonu var. Katalog `Listing` alanlarını bildiriyor.
- [ ] `field_update` eylemi yalnız bildirilen alanlara yazıyor. Test geçiyor.
- [ ] Kural hatası ürün kaydını durdurmuyor. `reject_row` istisnası test ediliyor.
- [ ] Satıcı kuralı başka mağazayı etkilemiyor. Test geçiyor.
- [ ] Characterization test: `ECA Rule` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- Yeni hedef DocType için `hooks.py` içine dispatcher kaydı eklemeyin. Hedefi önce `register_rule_target` ile bildirin.
- `custom_script` eylemini yeni kurallara açmayın.
- Kural motoruna iş bağlamının iç modülünü içe aktarmayın.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] Değişen davranış için önce başarısız olan test yazıldı.
- [ ] Ruff ve ilgili testler yerelde geçiyor.
- [ ] `import-linter` kontrolü yeni ihlal üretmiyor.
- [ ] `CODEOWNERS` içindeki 14-platform-cekirdek sahibi inceleyici olarak eklendi.
- [ ] Katalog bağlamı (03a) sahibi inceleyici olarak eklendi.
- [ ] `test_eca_rule.py` geçiyor.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?
Bu kayıt bir "olay, koşul, eylem" kuralıdır. ECA bu üç kelimenin kısaltmasıdır. Kural bir DocType olayını dinler. Koşul doğruysa bir eylem çalıştırır. Örneğin ürün kaydedilince bir alanı günceller ya da e-posta gönderir. Kural platform ya da tek mağaza için tanımlanır.

## Bugünkü bağımlılıklar
### Bu kaydın bağlandığı kayıtlar
- `DocType` (`reference_doctype`): Frappe çekirdeği
- `Admin Seller Profile` (`seller_profile`): başka bağlam (02-satici-magaza)
- `ECA Action Template` (`action_template`): aynı bağlam
### Bu kayda dokunan kod
- `tradehub_core/tradehub_core/doctype/eca_rule/eca_rule.py:9`: `eca.condition_compiler` içe aktarıyor
- `tradehub_core/tradehub_core/doctype/eca_rule/eca_rule.py:44`: kapsam ve öncelik kuralı
- `tradehub_core/eca/dispatcher.py:104`, `:141`: kuralları önbellekten okuyor
- `tradehub_core/eca/dispatcher.py:639`: iki aşamalı çalıştırıcı (`evaluate_rules_two_phase`)
- `tradehub_core/eca/api.py:1361`, `:1364`: kuralı oluşturuyor ve güncelliyor
- `tradehub_core/eca/api.py:1607`: izin kontrolüyle okuyor
### hooks.py kayıtları
- `tradehub_core/hooks.py:898-902`: `on_update`, `on_trash`, `after_insert` olayları `eca.dispatcher.clear_eca_cache` çağırıyor
- `tradehub_core/hooks.py:582`, `:602`, `:615`: `Listing` olaylarında `eca.dispatcher.evaluate_rules_two_phase` çalışıyor
- `tradehub_core/hooks.py:1122`: `permission_query_conditions`
- `tradehub_core/hooks.py:1246`: `has_permission`

## Bağımlılık sorunları
1. Kural motoru ürün kaydının içinde çalışıyor. Kanıt: `hooks.py:582`. Kural hata verirse ürün kaydedilmez. Kural motoru ekibi katalog akışını bozabilir.
2. `field_update` eylemi kaydı yazıyor. Kanıt: `eca/dispatcher.py:880`. Hangi alanların yazılabileceği kural verisine bağlı. Katalog ekibi bir alanın kuralla değiştiğini koddan göremez.
3. `custom_script` eylemi güvenli çalıştırıcıda kod çalıştırıyor. Kanıt: `eca/dispatcher.py:1053`. Betik `frappe` nesnesine erişiyor. Betik her tabloya yazabilir. Bağlam sınırını bu yol aşar.
4. Önemli olumlu nokta: `create_document` eylemi izinli listeyle sınırlı. Kanıt: `eca/dispatcher.py:1024` ve `eca/api.py:116`.

## Hedef tasarım
- Sahip bağlam: 14-platform-cekirdek. Paket yolu: `tradehub_core/shared/rules/` ya da `tradehub_core/platform/eca/`.
- Dışa açık fonksiyonlar: `evaluate(doc, event, phase) -> RuleOutcome`, `register_rule_target(doctype, allowed_fields)`.
- Her bağlam kurala açtığı alanları kendisi bildirir. Örneğin katalog `register_rule_target("Listing", ["status", "tags"])` çağırır.
- Olay yayınlamaz. Eylem sonucu `ECA Rule Log` kaydına yazılır.
- `seller_profile` Link alanı kalır.
- Denetleyicide kapsam, öncelik ve koşul derlemesi kalır.

## Geçiş adımları
1. `register_rule_target` fonksiyonunu ekleyin. Katalog bağlamı `Listing` alanlarını bildirsin.
2. `field_update` eylemini bildirilen alanlarla sınırlayın.
3. `custom_script` eylemini kimin kullandığını ölçün. Kullanan yoksa kapatın (doğrulanmadı: üretimde kullanım).
4. Kural hatası ürün kaydını durdurmasın. Hata yalnız kayda yazılsın. `reject_row` eylemi bunun istisnasıdır.

## Riskler ve testler
- Kural motoru kapanırsa toplu yükleme ret kuralları çalışmaz. `test_eca_rule.py` korunmalı.
- Satıcı kuralı başka mağazaya etki etmemeli. Kapsam testi ekleyin.
