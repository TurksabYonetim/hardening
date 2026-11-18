# Commercial Consent Sync

- Bağlam: 13-uyum-gizlilik
- Tür: Kayıt defteri (log)
- Klasör: `tradehub_core/tradehub_core/doctype/commercial_consent_sync`
- Denetleyici: `tradehub_core/tradehub_core/doctype/commercial_consent_sync/commercial_consent_sync.py` (23 satır)
- Önerilen sahip bağlam: 12-bildirim-iletisim. Kaydı yalnız bildirim servisi yazıyor. Denetleyici bile bildirim paketine bağlı.

## Epic

- Epic adı: Commercial Consent Sync: 12-bildirim-iletisim bağlamına taşıma
- Öncelik: Önemli
- Faz: Faz 4
- Tahmini büyüklük: Orta

### User story

Bir geliştirici olarak, pazarlama izni kaydedilince İYS aktarımının olayla başlamasını istiyorum.
Böylece bildirim kodu bozulsa bile izin kaydı kaybolmaz.

### Kabul kriterleri

- [ ] `privacy/consent.py:35` doğrudan çağrısı kaldırıldı. Aktarım `consent.recorded` olayıyla başlıyor.
- [ ] Aynı olay iki kez gelince tek satır oluşuyor.
- [ ] Kayıt 12-bildirim-iletisim bağlamının modülünde duruyor.
- [ ] `consent_bridge.py` izin kaydını `privacy/api.get_consent_log` ile okuyor.
- [ ] Characterization test: `Commercial Consent Sync` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- Bu kaydı Desk ya da `/api/resource` üzerinden yazmayın. Denetleyici bunu bilerek reddeder.
- `notifications.store.writing` korumasını kaldırmayın. İzin sırası kuralları atlanır.
- Gizlilik kodundan bildirim paketinin iç fonksiyonunu çağırmayın. Olay yayınlayın.
- İYS hedefini doğrulamadan izin aktarmayın. `assert_grantable` kapısı tek kapıdır.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] Değişen davranış için önce başarısız olan bir test yazıldı.
- [ ] Ruff ve uygulama testleri yerelde geçiyor.
- [ ] `import-linter` kontrolü `tradehub_core.notifications` için geçiyor.
- [ ] `CODEOWNERS` içindeki bildirim bağlamı sahibinden inceleme istendi.
- [ ] Yeni olay için sözleşme testi eklendi. Test olay alanlarını kontrol ediyor.
- [ ] Abone aynı olayı iki kez alınca ikinci işlem hiçbir şey değiştirmiyor.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?

Bu kayıt ticari iletişim izninin dış sisteme aktarımını izler. Dış sistem İYS'dir. İYS, Türkiye'deki ticari ileti izin kayıt sistemidir. Her satır bir izin kararını ve aktarım durumunu tutar. Başarısız aktarımlar `next_retry_at` alanıyla yeniden denenir.

## Bugünkü bağımlılıklar

### Bu kaydın bağlandığı kayıtlar

- `User Consent Log` (`consent_log`, Link): aynı bağlam
- `User` (`user`, Link): başka bağlam (Frappe çekirdeği)

### Bu kayda dokunan kod

- `tradehub_core/notifications/purge.py:33`: okuyor
- `tradehub_core/notifications/seed.py:134`: okuyor
- `tradehub_core/notifications/consent_bridge.py:19`: adını kullanıyor
- `tradehub_core/notifications/seed.py:135`: adını kullanıyor

### hooks.py kayıtları

- `hooks.py` içinde bu DocType için kayıt yok.

## Bağımlılık sorunları

1. Denetleyici bildirim paketini doğrudan içe aktarıyor. Kanıt: `commercial_consent_sync.py:11` satırında `notifications.store.writing` var. Bu yüzden 13 bağlamındaki DocType 12 bağlamına bağımlı.
2. Gizlilik kodu bildirim köprüsünü doğrudan çağırıyor. Kanıt: `privacy/consent.py:35` satırı `consent_bridge.after_decision` fonksiyonunu çağırıyor. Bildirim kodu bozulursa izin kaydı da hata verir.
3. Bildirim kodu `User Consent Log` tablosunu doğrudan okuyor. Kanıt: `notifications/consent_bridge.py:162`. İzin kaydının alan adları değişirse bildirim kodu bozulur.

## Hedef tasarım

- Sahip bağlam ve paket yolu: 12-bildirim-iletisim. Yol: `tradehub_core/notifications/` ve `Notifications` modülü.
- Dışarıya açılan fonksiyonlar: `notifications/api.py` içinde `get_commercial_consent_status(user)` ve `retry_commercial_consent_sync(name)`.
- Yayınladığı olaylar: `commercial_consent.synced` ve `commercial_consent.sync_failed`. Olay şu alanları taşır: `sync_id`, `consent_log`, `user`, `channel`, `status`.
- Dinlediği olaylar: 13 bağlamının `consent.recorded` olayı. Yalnız `marketing_email` ve `marketing_sms` türleri işlenir.
- Başka bağlamlara bağlantılar: `consent_log` Link alanı `User Consent Log` kaydına bağlı kalır. Bu kayıt değişmez bir denetim kaydıdır. `user` Link alanı da kalır. Kanal ve izin türü anlık görüntü (snapshot) alanı olarak saklanır. Anlık görüntü, olay anındaki değerin kopyasıdır.
- Denetleyicide kalacak doğrulamalar: Yalnız servis yazabilir kuralı kalır.
- Servise taşınacak iş kuralları: Aktarım ve yeniden deneme mantığı `notifications/consent_bridge.py` içinde kalır.

## Geçiş adımları

1. 13 bağlamı `consent.recorded` olayını yayınlasın. Bu adım önce gelir. Olay şimdilik Outbox kaydına yazılsın, çağrı da kalsın.
2. Bildirim bağlamı bu olaya abone olsun. Abone, olay kimliğini saklayarak aynı olayı iki kez işlemesin.
3. `privacy/consent.py:35` içindeki doğrudan çağrıyı kaldırın. Bu adım 2. adımdan sonra gelir.
4. `consent_bridge.py:162` okumasını `privacy/api.get_consent_log(name)` çağrısına çevirin.
5. DocType'ı `Notifications` modülüne taşıyın. JSON `module` alanını ve klasörü birlikte değiştirin.

## Riskler ve testler

- Pazarlama izni kaydı sonrası İYS satırı açılmayabilir. Test: izin kaydı sonrası olay işlenince tek satır oluşmalı.
- Aynı olay iki kez gelirse iki satır açılabilir. Test: aynı olay kimliği ikinci kez işlenince satır sayısı değişmemeli.
