# 14-platform-cekirdek: Platform çekirdeği

## 1. Bağlamın amacı
Bu bağlam tüm bağlamların ortak kullandığı küçük parçaları tutar. Bugün burada kural motoru (ECA) ve iki genel ayar kaydı var. Hedefte bu bağlam paylaşılan çekirdek (shared kernel) olur. Paylaşılan çekirdek, her bağlamın güvenle kullanabileceği küçük ortak koddur. Olay yolu (event bus) burada durur. Para tipleri, kiracı kimliği ve i18n yardımcıları da burada durur. Çekirdek hiçbir iş bağlamını içe aktarmaz. Bağımlılık yönü hep bağlamlardan çekirdeğe doğrudur.

Önerilen paket yolu: `tradehub_core/shared/`. Kural motoru için `tradehub_core/shared/rules/` ya da mevcut `tradehub_core/eca/` paketi kullanılabilir.

## 2. DocType listesi
Ana kayıtlar:
- `ECA Rule`

Ayarlar ve kataloglar:
- `ECA Action Template`
- `Marketplace Settings` (single, bölünecek)
- `Tracking Settings` (single, taşınacak)

Kayıt defterleri:
- `ECA Rule Log`

Hedefte eklenecek yeni kayıtlar (bugün yok):
- `Domain Event Outbox`: yayınlanan olaylar. Alanlar: `event_id`, `event_name`, `aggregate_doctype`, `aggregate_name`, `payload` (JSON), `status`, `attempts`, `created_at`, `dispatched_at`.
- `Domain Event Receipt`: işlenen olaylar. Alanlar: `event_id`, `subscriber`, `processed_at`. Aynı olayın iki kez işlenmesini engeller.

## 3. Bağlamın dışa açık API'si
Olay yolu (`tradehub_core/shared/events.py`):
- `publish(event_name, aggregate_doctype, aggregate_name, payload) -> str`. Aynı veritabanı işlemi içinde `Domain Event Outbox` satırı yazar.
- `subscribe(event_name, handler_path)`. Her bağlam kendi `events.py` dosyasında abonelik listesi tutar.
- `dispatch_pending()`. Kuyruk işçisi bekleyen olayları dağıtır. `frappe.enqueue(..., enqueue_after_commit=True)` ile tetiklenir.
- `handled_once(event_id, subscriber)`. Bağlam yöneticisidir. İşlenmiş olayı atlar.

Ortak tipler (`tradehub_core/shared/types.py`):
- `Money(amount, currency)`, `StoreRef(name)`, `UserRef(name)`

Ortak yetki yardımcıları (`tradehub_core/shared/auth.py`):
- `is_platform_admin(user) -> bool`. Bugün `permissions._is_platform_full_access` iç fonksiyonu bu işi yapıyor.

Ayar:
- `get_platform_defaults() -> PlatformDefaults` (dil, para birimi, kural sürümü, öneri bekleme süresi)

Kural motoru:
- `evaluate(doc, event, phase) -> RuleOutcome`
- `register_rule_target(doctype, allowed_fields)`
- `register_action_templates(specs)`
- `purge_rule_logs(context_doctype, context_name)`

## 4. Yayınlanan ve dinlenen olaylar
Bu bağlam iş olayı yayınlamaz. Bu bağlam olayları taşır.

Olay sözleşmesi kuralları:
- Olay adı `<bağlam>.<varlık>.<geçmiş zaman fiili>` biçimindedir. Örnek: `order.confirmed`, `seller.kyb.status_changed`.
- Her olayın bir `event_id` değeri vardır. Değer tekildir.
- Veri yalnız kimlik ve anlık görüntü taşır. Örneğin `store` adı ve değişen alanlar.
- Olay verisinin tipi yayınlayan bağlamın `contracts.py` dosyasında tanımlanır.
- Abone hata verirse olay yeniden denenir. Beş denemeden sonra `status = failed` olur ve yöneticiye görünür.

Örnek zincir (sahibin anlattığı sorun):
1. Sipariş bağlamı `order.confirmed` yayınlar.
2. Vergi bağlamı olayı dinler. Vergi satırlarını hesaplar ve kaydeder. Sonra `order.tax_calculated` yayınlar.
3. Lojistik bağlamı `order.tax_calculated` olayını dinler. Gönderi taslağı oluşturur.
4. Hiçbir bağlam diğerinin fonksiyonunu doğrudan çağırmaz.

Mevcut benzer yapılar şunlardır. Ödeme bağlamı kendi giden kaydını tutuyor (`tradehub_core/payments/operations.py:4`). Paylaşım senkronu kendi gelen ve giden kaydını tutuyor (`tradehub_core/shared_sync/store.py:95`). Ayrıca `Catalog Outbound Event`, `Platform Notification Event` ve `Payment Job Event` DocType'ları var. Bu yapılar ortak olay yoluna örnek olarak incelenmeli (doğrulanmadı: iç ayrıntıları okunmadı).

## 5. Bağlamlar arası en ağır 10 bağımlılık
1. Kural motoru ürün kaydının içinde çalışıyor. Kural hatası ürün kaydını durdurur. Kanıt: `tradehub_core/hooks.py:582`, `:602`, `:615`.
2. `custom_script` eylemi her tabloya yazabilir. Kanıt: `tradehub_core/eca/dispatcher.py:1053`.
3. `field_update` eylemi ürün alanlarını kural verisine göre yazıyor. Kanıt: `tradehub_core/eca/dispatcher.py:880`.
4. Çekirdek log tablosu içe aktarma işine bağlı. Kanıt: `ECA Rule Log.bulk_import_job` alanı.
5. İçe aktarma kodu çekirdek log tablosunu siliyor. Kanıt: `tradehub_core/bulk_import/tasks.py:82`.
6. Altı bağlam aynı ayar dosyasını kullanıyor. Kanıt: `Marketplace Settings` alanları ve okuyucular `tradehub_core/api/category.py:67`, `tradehub_core/api/v1/subscription_payment.py:41`, `tradehub_core/contracts/reseller.py:17`, `tradehub_core/context/settings.py:63`.
7. Genel ayar satıcı mağazasına bağlı. Kanıt: `Marketplace Settings.thoptan_seller` alanı.
8. Abonelik banka bilgisi genel ayarda. Kanıt: `subscription_iban` alanı ve `tradehub_core/api/v1/subscription_payment.py:40`.
9. Kural kalıbı değişince kural önbelleği temizlenmeyebilir. Kanıt: önbellek kancası yalnız `ECA Rule` için var (`tradehub_core/hooks.py:898`).
10. Ortak yetki yardımcısı iç fonksiyon olarak duruyor. Kanıt: `tradehub_core/tradehub_core/doctype/user_context_preference/user_context_preference.py:37` `permissions._is_platform_full_access` çağırıyor.

## 6. Önerilen geçiş sırası
1. `tradehub_core/shared/` paketini açın. CODEOWNERS kaydını mimari sahibine verin.
2. `shared/auth.py` içine `is_platform_admin` fonksiyonunu ekleyin. İç fonksiyon çağrılarını buna çevirin.
3. `Domain Event Outbox` ve `Domain Event Receipt` DocType'larını ekleyin.
4. `shared/events.py` içine `publish`, `subscribe`, `dispatch_pending` ve `handled_once` fonksiyonlarını yazın. Testleri `tradehub_core/shared/tests/` altına ekleyin.
5. İlk olayı küçük bir akışta deneyin. Önerilen akış: `seller.subscription.status_changed`. Bu akış zaten commit sonrası kuyruk kullanıyor (`tradehub_core/tradehub_core/doctype/store_subscription/store_subscription.py:110`).
6. `order.confirmed`, `order.tax_calculated` zincirini 04, 06 ve 07 ekipleriyle birlikte kurun.
7. `ECA Rule Log` için genel bağlam alanlarını ekleyin. `bulk_import_job` alanını kaldırın.
8. `register_rule_target` ile kural motorunun yazabileceği alanları sınırlayın.
9. `Marketplace Settings` alanlarını bağlamların ayar kayıtlarına taşıyın. Her grup ayrı PR olsun.
10. `Tracking Settings` kaydını 09-icerik-vitrin bağlamına taşıyın.
11. `import-linter` kuralını açın: `tradehub_core.shared` hiçbir iş bağlamını içe aktaramaz.

## 7. Başka bağlama taşınması gereken DocType'lar
- `Tracking Settings`: 09-icerik-vitrin. Yalnız vitrin izleme kodlarını yükler.
- `Marketplace Settings` alan grupları:
  - Adres ayarları: 01-kimlik-erisim
  - `invoice_generation_mode`: 06-vergi-fatura
  - `hide_empty_categories`: 03a-katalog
  - Abonelik banka bilgisi ve bayi ayarı: 02-satici-magaza ya da 05-odeme
- `ECA Rule`, `ECA Action Template` ve `ECA Rule Log` burada kalır. Bugün yalnız `Listing` için çalışıyor. Kural motoru başka bağlamlara açılmayacaksa 03a-katalog bağlamına taşınabilir. Bu bir mimari karardır.

## 8. Paralel çalışan geliştiriciler için kurallar
1. Çekirdek koda iş kuralı eklenmez. Örneğin vergi hesabı çekirdekte durmaz.
2. Çekirdek hiçbir bağlamı içe aktarmaz. Bağlamlar çekirdeği içe aktarır.
3. Başka bağlama tepki gerekiyorsa doğrudan çağrı yapılmaz. Olay yayınlanır.
4. Olay işleyicisi aynı olayı iki kez alabilir. İşleyici her zaman `handled_once` kullanır.
5. Olay verisi değişirse eski alanlar korunur. Yeni alan eklenebilir, alan silinmez.
6. Genel ayar kaydına yeni alan eklenmez. Her bağlam kendi ayar kaydını açar.
7. Kural motoruna yeni hedef DocType eklemek o bağlamın sahibinin onayını ister.
8. Çekirdekte yapılan her değişiklik bütün bağlamları etkiler. Bu yüzden çekirdek PR'ları iki onay alır.

## Epic özeti

Bu bağlamdaki epic listesi aşağıdadır. Hedef bağlam her raporun Epic bölümünde yazılıdır.

- ECA Action Template: Düşük, Faz 4, Küçük
- ECA Rule: Önemli, Faz 4, Orta
- ECA Rule Log: Düşük, Faz 4, Küçük
- Marketplace Settings: Önemli, Faz 4, Orta
- Tracking Settings: Düşük, Faz 5, Küçük
