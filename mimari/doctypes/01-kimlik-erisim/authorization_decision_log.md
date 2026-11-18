# Authorization Decision Log

- Bağlam: 01-kimlik-erisim
- Tür: Kayıt defteri (log)
- Klasör: `tradehub_core/tradehub_core/doctype/authorization_decision_log`
- Denetleyici: `tradehub_core/tradehub_core/doctype/authorization_decision_log/authorization_decision_log.py` (63 satır)
- Önerilen sahip bağlam: 01-kimlik-erisim

## Epic

- Epic adı: Authorization Decision Log: 01-kimlik-erisim bağlamına taşıma
- Öncelik: Önemli
- Faz: Faz 4
- Tahmini büyüklük: Orta

### User story

Bir geliştirici olarak, yetki kayıtlarını yalnız okuma fonksiyonuyla okumak istiyorum.
Böylece medya kodu denetim kaydına bağımlı kalmaz.

### Kabul kriterleri

- [ ] `query_decisions` okuma modeli var. `media/audit.py` bu fonksiyonu kullanıyor.
- [ ] `media_version.py` içinde `Authorization Decision Log` adı geçmiyor.
- [ ] Kayda yalnız `log_decision` yazıyor. Doğrudan `get_doc` yazımı yok.
- [ ] Hash zinciri testi `tradehub_core/tests/test_audit.py` geçiyor.
- [ ] Characterization test: `Authorization Decision Log` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- Bu kaydı güncellemeyin ve silmeyin. Kayıt değişmez olmalı.
- İş kararını bu logdan çıkarmayın. Örneğin medya sürümünü kendi tablosunda tutun.
- Tabloyu `frappe.qb` ile başka bağlamdan sorgulamayın. Okuma modelini kullanın.
- `audit_write` bayrağını kullanıcı akışında açmayın.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] Değişen davranış için önce başarısız olan test yazıldı.
- [ ] Ruff ve ilgili testler yerelde geçiyor.
- [ ] `import-linter` kontrolü yeni ihlal üretmiyor.
- [ ] `CODEOWNERS` içindeki 01-kimlik-erisim sahibi inceleyici olarak eklendi.
- [ ] `tradehub_core/tests/test_media_version_promote.py` geçiyor.
- [ ] Medya bağlamı (08) sahibi inceleyici olarak eklendi.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?
Bu kayıt her yetki kararının denetim izidir. Kim, neyi, hangi kararla yaptı bilgisini tutar. Kayıtlar zincir halinde özetlenir (hash zinciri). Böylece sonradan değiştirilen kayıt fark edilir. Kayıt değiştirilemez ve silinemez.

## Bugünkü bağımlılıklar
### Bu kaydın bağlandığı kayıtlar
- `User` (`actor`): Frappe çekirdeği
- `Admin Seller Profile` (`tenant`): başka bağlam (02-satici-magaza)
- `Region` (`region`): başka bağlam (07-lojistik)
### Bu kayda dokunan kod
- `tradehub_core/audit/log.py:177`: tek yazma noktası
- `tradehub_core/audit/log.py:67`: zinciri doğruluyor
- `tradehub_core/audit/tasks.py:44`: eski kayıtları sayıyor ve arşivliyor
- `tradehub_core/api/v1/permission_console.py:109`: sayıyor
- `tradehub_core/services/anomaly_detector.py:163`: anomali için okuyor
- `tradehub_core/tradehub_core/doctype/media_version/media_version.py:425`: medya sürüm geçmişini buradan okuyor
- `tradehub_core/media/audit.py:438`, `:690`, `:848`: medya denetimi için okuyor
### hooks.py kayıtları
- `tradehub_core/hooks.py:1133`: `permission_query_conditions`
- `tradehub_core/hooks.py:1256`: `has_permission`

## Bağımlılık sorunları
1. Medya bağlamı iş kararını denetim kaydından çıkarıyor. Kanıt: `tradehub_core/tradehub_core/doctype/media_version/media_version.py:425`. Önceki etkin sürüm bu kayıttan bulunuyor. Log arşivlenirse medya geri alma bozulabilir.
2. Medya kodu tabloyu `frappe.qb` ile doğrudan sorguluyor. Kanıt: `tradehub_core/media/audit.py:438`. Alan adı değişirse medya kırılır.
3. Her kayıt öncekinin hash değerini okuyor. Kanıt: `authorization_decision_log.py:33`. Yoğun yazmada iki kayıt aynı öncekini görebilir. Kilit yok (doğrulanmadı: çakışma gerçekte oluşuyor mu).
4. `Region` linki lojistik bağlamına bağımlılık yaratıyor. Bu link yalnız bilgi amaçlı görünüyor.

## Hedef tasarım
- Sahip bağlam: 01-kimlik-erisim. Paket yolu: `tradehub_core/identity/audit/`. Yazma aracı paylaşılan çekirdekte kalabilir: `tradehub_core/shared/audit.py`.
- Dışa açık fonksiyonlar:
  - `log_decision(action, decision, object_doctype, object_name, context)`
  - `query_decisions(filters, limit) -> list[DecisionRow]` (okuma modeli)
  - `verify_chain(since) -> ChainReport`
- Olay yayınlamaz. Anomali dedektörü okuma modelini kullanır.
- `region` alanı anlık görüntü (snapshot) olarak düz metne çevrilebilir. Anlık görüntü, o anki değerin kopyasıdır.
- Denetleyicide değişmezlik ve hash kuralı kalır.

## Geçiş adımları
1. `query_decisions` okuma modelini ekleyin. `media/audit.py` sorgularını bu fonksiyona bağlayın.
2. Medya sürüm geçmişini kendi tablosunda tutun. `media_version.py:425` okumasını kaldırın. Bu iş 08-medya ekibinin PR'ıdır.
3. Önce yük testiyle sorunu ölçün. Sorun varsa hash zincirine satır kilidi ekleyin.
4. JSON `module` alanını kimlik modülüne taşıyın.

## Riskler ve testler
- Arşiv işi kayıt silince zincir kopabilir. `tradehub_core/tests/test_audit.py` zincir testi korunmalı.
- Medya geri alma testi (`tradehub_core/tests/test_media_version_promote.py`) 2. adımda geçmeli.
