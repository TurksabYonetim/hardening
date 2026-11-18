# Authorization Anomaly Alert

- Bağlam: 01-kimlik-erisim
- Tür: Kayıt defteri (log)
- Klasör: `tradehub_core/tradehub_core/doctype/authorization_anomaly_alert`
- Denetleyici: `tradehub_core/tradehub_core/doctype/authorization_anomaly_alert/authorization_anomaly_alert.py` (8 satır)
- Önerilen sahip bağlam: 01-kimlik-erisim

## Epic

- Epic adı: Authorization Anomaly Alert: 01-kimlik-erisim bağlamına taşıma
- Öncelik: Önemli
- Faz: Faz 4
- Tahmini büyüklük: Orta

### User story

Bir platform yöneticisi olarak, şüpheli davranış uyarısının mağazayı doğru yoldan askıya almasını istiyorum.
Böylece askıya alma tüm kancaları çalıştırır.

### Kabul kriterleri

- [ ] Uyarı yalnız `raise_anomaly_alert` ile oluşuyor. `anomaly_detector.py` ve `rebac_drift_detection.py` bu fonksiyonu kullanıyor.
- [ ] `anomaly_actions.py` içinde `Admin Seller Profile` için `set_value` yok.
- [ ] Mağaza askıya alma `seller.api.suspend_store` ile yapılıyor.
- [ ] Aynı olay iki kez gelince mağaza bir kez askıya alınıyor. Test geçiyor.
- [ ] Characterization test: `Authorization Anomaly Alert` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- `Admin Seller Profile.status` alanına kimlik bağlamından yazmayın. Mağaza durumunu yalnız satıcı bağlamı değiştirir.
- `User.enabled` alanını `set_value` ile kapatmayın. Kullanıcı kancaları atlanır.
- Uyarı oluşturma kodunu yeni bir servise kopyalamayın. Tek fonksiyon kullanın.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] Değişen davranış için önce başarısız olan test yazıldı.
- [ ] Ruff ve ilgili testler yerelde geçiyor.
- [ ] `import-linter` kontrolü yeni ihlal üretmiyor.
- [ ] `CODEOWNERS` içindeki 01-kimlik-erisim sahibi inceleyici olarak eklendi.
- [ ] `tradehub_core/tests/test_anomaly_detector.py` geçiyor.
- [ ] Satıcı bağlamı (02) sahibi inceleyici olarak eklendi.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?
Bu kayıt şüpheli yetki davranışı için açılan uyarıdır. Bir kural eşiği aşılınca sistem uyarı oluşturur. Uyumluluk görevlisi uyarıyı inceler ve kapatır.

## Bugünkü bağımlılıklar
### Bu kaydın bağlandığı kayıtlar
- `Authorization Anomaly Rule` (`rule`): aynı bağlam
- `Admin Seller Profile` (`tenant`): başka bağlam (02-satici-magaza)
- `User` (`acknowledged_by`): Frappe çekirdeği
### Bu kayda dokunan kod
- `tradehub_core/services/anomaly_detector.py:374`: uyarıyı oluşturuyor
- `tradehub_core/services/rebac_drift_detection.py:315`: uyarıyı oluşturuyor
- `tradehub_core/api/v1/anomaly.py:65`: okuyor, `anomaly.py:97` ve `:114` yazıyor
- `tradehub_core/services/anomaly_actions.py:73`: bildirim kaydına bağlıyor
### hooks.py kayıtları
- `tradehub_core/hooks.py:1135`: `permission_query_conditions`
- `tradehub_core/hooks.py:1258`: `has_permission`
- `tradehub_core/hooks.py:260`: saatlik `anomaly_detector.run_detection` işi

## Bağımlılık sorunları
1. Uyarı eylemi mağazayı doğrudan askıya alıyor. Kanıt: `tradehub_core/services/anomaly_actions.py:119`. Bu kod `Admin Seller Profile.status` alanını `set_value` ile yazıyor. Mağaza kancaları (`hooks.py:799`) çalışmaz. Satıcı bağlamı bozulabilir.
2. Eylem kullanıcıyı doğrudan kapatıyor. Kanıt: `tradehub_core/services/anomaly_actions.py:104`. `User` kancaları atlanır.
3. İki ayrı servis uyarı oluşturuyor. Kanıt: `anomaly_detector.py:374` ve `rebac_drift_detection.py:315`. Alan kuralları iki yerde tekrar ediyor.

## Hedef tasarım
- Sahip bağlam: 01-kimlik-erisim. Paket yolu: `tradehub_core/identity/anomaly/`.
- Dışa açık fonksiyonlar: `raise_anomaly_alert(rule, group) -> str`, `acknowledge_alert(name, notes)`.
- Yayınladığı olaylar: `identity.anomaly.detected` (alan: `alert`, `tenant`, `actor`, `severity`).
- Satıcı bağlamı bu olayı dinler. Mağazayı kendi servisiyle askıya alır.
- Kalacak Link: `tenant` alanı `Admin Seller Profile` kök kaydına bağlı kalır.
- Denetleyici durum geçişlerini doğrular. Örneğin `resolved` kaydı yeniden `open` olamaz.

## Geçiş adımları
1. `raise_anomaly_alert` fonksiyonunu yazın. İki oluşturma noktasını bu fonksiyona bağlayın.
2. `anomaly_actions.disable_tenant` içindeki `set_value` yerine `seller.api.suspend_store(tenant, reason)` çağırın. Bu adım satıcı API'si eklendikten sonra gelir.
3. Doğrudan çağrıyı `identity.anomaly.detected` olayına çevirin. Bu adım olay altyapısından sonra gelir.

## Riskler ve testler
- Askıya alma artık kancaları çalıştırır. Yan etkiler artabilir. `tradehub_core/tests/test_anomaly_detector.py` testine askıya alma senaryosu ekleyin.
- Aynı olay iki kez gelirse mağaza iki kez askıya alınmamalı. Tekrar testi ekleyin.
