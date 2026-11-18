# User Consent Log

- Bağlam: 13-uyum-gizlilik
- Tür: Kayıt defteri (log)
- Klasör: `tradehub_core/tradehub_core/doctype/user_consent_log`
- Denetleyici: `tradehub_core/tradehub_core/doctype/user_consent_log/user_consent_log.py` (10 satır)
- Önerilen sahip bağlam: 13-uyum-gizlilik

## Epic

- Epic adı: User Consent Log: 13-uyum-gizlilik bağlamına taşıma
- Öncelik: Önemli
- Faz: Faz 4
- Tahmini büyüklük: Orta

### User story

Bir alıcı olarak, verdiğim ya da geri çektiğim iznin doğru kaydedilmesini istiyorum.
Böylece istemediğim pazarlama iletisini almam.

### Kabul kriterleri

- [ ] `record_consent` her kayıtta Outbox'a tek bir `consent.recorded` olayı yazıyor.
- [ ] `privacy/consent.py:35` doğrudan bildirim çağrısı kaldırıldı.
- [ ] `notifications/consent_bridge.py` bu tabloyu doğrudan okumuyor.
- [ ] Geri çekme sonrası `check_consent` izin yok diyor.
- [ ] Characterization test: `User Consent Log` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- İzin satırını düzenlemeyin ya da silmeyin. Defter değişmez kanıttır.
- İzin kaydını `record_consent` dışından yazmayın. IP ve sürüm bilgisi eksik kalır.
- Bildirim paketinden bu tabloya sorgu yazmayın. `privacy/api.py` kullanın.
- İzin kaydı ile bildirim işini aynı işlemde zorunlu bağlamayın. Bildirim hatası izni geri alır.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] Değişen davranış için önce başarısız olan bir test yazıldı.
- [ ] Ruff ve uygulama testleri yerelde geçiyor.
- [ ] `import-linter` kontrolü `tradehub_core.privacy` için geçiyor.
- [ ] `CODEOWNERS` içindeki gizlilik bağlamı sahibinden inceleme istendi.
- [ ] Yeni olay için sözleşme testi eklendi. Test olay alanlarını kontrol ediyor.
- [ ] Abone aynı olayı iki kez alınca ikinci işlem hiçbir şey değiştirmiyor.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?

Bu kayıt kullanıcının izin kararlarını tutar. Her satır bir onay ya da geri çekmedir. Satır IP adresini ve tarayıcı bilgisini de saklar. İzin kararının tek kayıt kaynağı bu tablodur.

## Bugünkü bağımlılıklar

### Bu kaydın bağlandığı kayıtlar

- `User` (`user`, Link): başka bağlam (Frappe çekirdeği)

### Bu kayda dokunan kod

- `tradehub_core/notifications/consent_bridge.py:162`: okuyor
- `tradehub_core/notifications/consent_bridge.py:77`: adını kullanıyor
- `tradehub_core/privacy/consent.py:21`: adını kullanıyor
- `tradehub_core/privacy/consent.py:47`: adını kullanıyor
- `tradehub_core/privacy/data_export.py:214`: adını kullanıyor
- `tradehub_core/setup/module_navigation_spec.py:1144`: adını kullanıyor
- `tradehub_core/tradehub_core/doctype/commercial_consent_sync/commercial_consent_sync.json:24`: alt tablo ya da Link tanımı

### hooks.py kayıtları

- `hooks.py` içinde bu DocType için kayıt yok.

## Bağımlılık sorunları

1. İzin kaydı sonrası bildirim kodu doğrudan çağrılıyor. Kanıt: `privacy/consent.py:35`. Bildirim kodu hata verirse izin kaydı da geri alınabilir.
2. Bildirim paketi tabloyu doğrudan okuyor. Kanıt: `notifications/consent_bridge.py:77` ve `notifications/consent_bridge.py:162`.
3. Bildirim tercih uç noktası gizlilik içini içe aktarıyor. Kanıt: `api/v1/notification_preferences.py:76`.

## Hedef tasarım

- Sahip bağlam ve paket yolu: `tradehub_core/privacy/` paketi ve yeni `Privacy` Frappe modülü.
- Dışarıya açılan fonksiyonlar: `privacy/api.py` içinde `record_consent()`, `check_consent()`, `get_user_consents()` ve `get_consent_log(name)`.
- Yayınladığı olaylar: `consent.recorded`. Olay şu alanları taşır: `log_id`, `user`, `consent_type`, `action`, `version`, `source`. Bildirim bağlamı dinler.
- Dinlediği olaylar: Yok.
- Başka bağlamlara bağlantılar: `user` Link alanı kalır. Politika sürümü anlık görüntü olarak `version` alanında saklanır.
- Denetleyicide kalacak doğrulamalar: IP ve tarayıcı bilgisini dolduran `before_insert` kalır.
- Servise taşınacak iş kuralları: İzin kaydı mantığı zaten `privacy/consent.py` içinde. Yalnız dış çağrı olaya döner.

## Geçiş adımları

1. Outbox ve olay yayıncısı ortak çekirdekte hazır olmalı. Bu adım önce gelir.
2. `record_consent` içinde `consent.recorded` olayını yazın.
3. Bildirim bağlamı abone olunca `privacy/consent.py:35` çağrısını kaldırın.
4. `notification_preferences.py:76` içe aktarmasını `privacy/api.record_consent` yapın.

## Riskler ve testler

- İzin kaydı ile İYS aktarımı arasında gecikme oluşur. Test: olay işlenince aktarım satırı açılmalı.
- İzin geri çekilince pazarlama iletisi sürebilir. Test: geri çekme sonrası `check_consent` izin yok demeli.
