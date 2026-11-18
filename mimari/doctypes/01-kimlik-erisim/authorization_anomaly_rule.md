# Authorization Anomaly Rule

- Bağlam: 01-kimlik-erisim
- Tür: Ayar (çok kayıtlı kural tablosu)
- Klasör: `tradehub_core/tradehub_core/doctype/authorization_anomaly_rule`
- Denetleyici: `tradehub_core/tradehub_core/doctype/authorization_anomaly_rule/authorization_anomaly_rule.py` (17 satır)
- Önerilen sahip bağlam: 01-kimlik-erisim

## Epic

- Epic adı: Authorization Anomaly Rule: 01-kimlik-erisim bağlamına taşıma
- Öncelik: Düşük
- Faz: Faz 4
- Tahmini büyüklük: Küçük

### User story

Bir geliştirici olarak, anomali kurallarının yalnız kurulumda oluşmasını istiyorum.
Böylece tarama işi çalışırken veri yazmaz.

### Kabul kriterleri

- [ ] `rebac_drift_detection.py` içinde `Authorization Anomaly Rule` için `new_doc` yok.
- [ ] Kural kurulumu idempotent bir patch içinde duruyor.
- [ ] Kurulum sonrası etkin kural sayısı testi geçiyor.
- [ ] Characterization test: `Authorization Anomaly Rule` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- Tarama ya da zamanlanmış iş içinde kural kaydı oluşturmayın. Kural yalnız patch ile gelir.
- `action_disable_tenant` eylemini mağaza tablosuna doğrudan yazan koda bağlamayın.
- Eşik ve süre kontrolünü denetleyiciden kaldırmayın.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] Değişen davranış için önce başarısız olan test yazıldı.
- [ ] Ruff ve ilgili testler yerelde geçiyor.
- [ ] `import-linter` kontrolü yeni ihlal üretmiyor.
- [ ] `CODEOWNERS` içindeki 01-kimlik-erisim sahibi inceleyici olarak eklendi.
- [ ] Patch iki kez çalışınca kayıt çoğalmıyor.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?
Bu kayıt şüpheli yetki davranışının kuralıdır. Kural bir eşik ve bir zaman aralığı tutar. Eşik aşılınca uyarı açılır. Kural isterse kullanıcıyı ya da mağazayı askıya alır.

## Bugünkü bağımlılıklar
### Bu kaydın bağlandığı kayıtlar
- `Admin Seller Profile` (`tenant_scope`): başka bağlam (02-satici-magaza)
### Bu kayda dokunan kod
- `tradehub_core/services/anomaly_detector.py:57`: etkin kuralları okuyor
- `tradehub_core/services/rebac_drift_detection.py:334`: kural var mı diye bakıyor, `:337` yoksa oluşturuyor
- `tradehub_core/api/v1/anomaly.py:132`: listeliyor
- `tradehub_core/setup/handover_validator.py:205`: etkin kural sayısını okuyor
### hooks.py kayıtları
- `tradehub_core/hooks.py:1136`: `permission_query_conditions`
- `tradehub_core/hooks.py:1259`: `has_permission`

## Bağımlılık sorunları
1. Tarama servisi çalışırken kural kaydı oluşturuyor. Kanıt: `tradehub_core/services/rebac_drift_detection.py:337`. Kurulum verisi çalışma anında yazılıyor. Kural seed verisi `tradehub_core/patches/v15_3_4_seed_anomaly_rules.py` içinde de var.
2. `action_disable_tenant` alanı satıcı bağlamında yan etki doğuruyor. Kanıt: `tradehub_core/services/anomaly_actions.py:114`.

## Hedef tasarım
- Sahip bağlam: 01-kimlik-erisim. Paket yolu: `tradehub_core/identity/anomaly/`.
- Dışa açık fonksiyon: `list_active_anomaly_rules() -> list[AnomalyRule]`.
- Olay yayınlamaz. Kuralın eylemleri `identity.anomaly.detected` olayına veri olarak girer.
- `tenant_scope` Link alanı kalır.
- Denetleyicide eşik ve süre kontrolü kalır.

## Geçiş adımları
1. `rebac_drift_detection.py:334-337` içindeki kural oluşturmayı bir kurulum patch'ine taşıyın.
2. `list_active_anomaly_rules` fonksiyonunu ekleyin. Dedektörü bu fonksiyona bağlayın.
3. JSON `module` alanını kimlik modülüne taşıyın.

## Riskler ve testler
- Kural seed edilmezse tarama sessizce çalışmaz. Kurulum sonrası kural sayısı testi ekleyin.
