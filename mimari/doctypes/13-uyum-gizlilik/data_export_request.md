# Data Export Request

- Bağlam: 13-uyum-gizlilik
- Tür: Ana kayıt
- Klasör: `tradehub_core/tradehub_core/doctype/data_export_request`
- Denetleyici: `tradehub_core/tradehub_core/doctype/data_export_request/data_export_request.py` (27 satır)
- Önerilen sahip bağlam: 13-uyum-gizlilik

## Epic

- Epic adı: Data Export Request: 13-uyum-gizlilik bağlamına taşıma
- Öncelik: Acil
- Faz: Faz 4
- Tahmini büyüklük: Büyük

### User story

Bir alıcı olarak, kişisel verimin eksiksiz bir kopyasını almak istiyorum.
Böylece yasal hakkımı kullanırım.

### Kabul kriterleri

- [ ] `tradehub_personal_data_exporters` kayıt noktası var.
- [ ] `privacy/data_export.py:63` içindeki `_EXPORTABLE_DOCTYPES` sözlüğü boşaldı ve silindi.
- [ ] Örnek kullanıcı için bütün bölümler ZIP içinde var.
- [ ] Hatalı bir dışa aktarıcı yalnız kendi bölümünü atlıyor ve hata kaydı yazıyor.
- [ ] 24 saatte ikinci talep reddediliyor. Hata mesajı `_()` ile yazılı.
- [ ] Characterization test: `Data Export Request` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- Gizlilik paketine başka bağlamın DocType adını yeni satır olarak eklemeyin. O bağlam kendi dışa aktarıcısını yazmalı.
- Dışa aktarma dosyasını herkese açık dosya olarak kaydetmeyin. Kişisel veri sızar.
- İndirme bağlantısını süre ve jeton kontrolü olmadan açmayın.
- Rate limit kontrolünü denetleyiciden çıkarmayın.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] Değişen davranış için önce başarısız olan bir test yazıldı.
- [ ] Ruff ve uygulama testleri yerelde geçiyor.
- [ ] `import-linter` kontrolü `tradehub_core.privacy` için geçiyor.
- [ ] `CODEOWNERS` içindeki gizlilik bağlamı sahibinden inceleme istendi.
- [ ] Her dışa aktarıcı için sözleşme testi var.
- [ ] İndirme denetim kaydı yazılıyor.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?

Bu kayıt kullanıcının kişisel veri kopyası talebini tutar. KVKK ve GDPR bu hakkı tanır. Sistem talebi kuyruğa alır ve ZIP dosyası üretir. Dosya süre dolunca silinir ve durum "Expired" olur.

## Bugünkü bağımlılıklar

### Bu kaydın bağlandığı kayıtlar

- `User` (`user`, Link): başka bağlam (Frappe çekirdeği)

### Bu kayda dokunan kod

- `tradehub_core/privacy/data_export.py:464`: yazıyor
- `tradehub_core/api/v1/compliance.py:269`: okuyor
- `tradehub_core/api/v1/compliance.py:338`: okuyor
- `tradehub_core/privacy/data_export.py:232`: okuyor
- `tradehub_core/api/v1/compliance.py:247`: adını kullanıyor
- `tradehub_core/api/v1/compliance.py:313`: adını kullanıyor
- `tradehub_core/media/pipeline/policy/quota.schema.json:444`: adını kullanıyor
- `tradehub_core/media/presets.py:55`: adını kullanıyor
- `tradehub_core/media/presets.py:96`: adını kullanıyor
- `tradehub_core/privacy/data_export.py:335`: adını kullanıyor
- `tradehub_core/privacy/data_export.py:371`: adını kullanıyor
- `tradehub_core/setup/module_navigation_spec.py:1156`: adını kullanıyor

### hooks.py kayıtları

- `tradehub_core/hooks.py:387`: zamanlanmış görev `audit.tasks.cleanup_expired_data_exports`.

## Bağımlılık sorunları

1. Dışa aktarma kodu birçok bağlamın tablosunu doğrudan okuyor. Kanıt: `privacy/data_export.py:63` satırındaki `_EXPORTABLE_DOCTYPES` listesi. Liste `Order`, `Cart`, `RFQ`, `Listing Review`, `Addresses` gibi kayıtları içeriyor. Bir geliştirici bu alanlardan birini silerse dışa aktarma bozulur.
2. Medya paketi bu DocType adını biliyor. Kanıt: `media/presets.py:55` ve `media/presets.py:96`. Bu bağ 08 bağlamını 13 bağlamına bağlıyor.
3. Denetleyicideki hata mesajı çeviri fonksiyonu kullanmıyor. Kanıt: `data_export_request.py:25` satırında çıplak metin var. Bu bir proje kuralı ihlali.

## Hedef tasarım

- Sahip bağlam ve paket yolu: `tradehub_core/privacy/` paketi ve yeni `Privacy` Frappe modülü.
- Dışarıya açılan fonksiyonlar: `privacy/api.py` içinde `request_data_export(user)` ve `get_export_status(name)`.
- Yayınladığı olaylar: `data_export.ready`. Olay şu alanları taşır: `request_id`, `user`, `expires_at`. Bildirim bağlamı e-postayı bu olayla gönderir.
- Dinlediği olaylar: Yok.
- Başka bağlamlara bağlantılar: `user` Link alanı kalır. Diğer bağlamların verisi bir kayıt defteri ile toplanır. Her bağlam `hooks.py` içine kendi dışa aktarıcısını yazar. Örnek ad: `tradehub_personal_data_exporters`.
- Denetleyicide kalacak doğrulamalar: 24 saatte tek talep kuralı denetleyicide kalır.
- Servise taşınacak iş kuralları: Veri toplama işi her bağlamın kendi dışa aktarıcısına taşınır. `privacy` yalnız sonuçları birleştirir.

## Geçiş adımları

1. `privacy/contracts.py` içinde dışa aktarıcı sözleşmesini tanımlayın. Girdi `user`, çıktı satır listesi olsun.
2. `hooks.py` içine `tradehub_personal_data_exporters` kayıt noktasını ekleyin. `frappe.get_hooks` ile okuyun.
3. Her bağlam için bir PR açın. Her PR `_EXPORTABLE_DOCTYPES` içinden kendi satırını kendi paketine taşısın.
4. Liste boşalınca `_EXPORTABLE_DOCTYPES` sözlüğünü silin.
5. Hata mesajını `_()` ile sarın.

## Riskler ve testler

- Dışa aktarma dosyasında bir bölüm eksik kalabilir. Test: örnek kullanıcı için tüm bölümler ZIP içinde olmalı.
- Bir dışa aktarıcı hata verirse tüm talep düşebilir. Test: hatalı dışa aktarıcı yalnız kendi bölümünü atlamalı ve hata kaydı yazmalı.
