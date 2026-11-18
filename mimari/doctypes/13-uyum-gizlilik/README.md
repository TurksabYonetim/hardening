# 13 Uyum ve gizlilik bağlamı

## 1. Bağlamın amacı

Bu bağlam kişisel veri yasalarına uyumu yönetir. Türkiye'de KVKK, Avrupa'da GDPR bu yasalardandır. Bağlam kullanıcı izinlerini, veri kopyası taleplerini ve saklama sürelerini tutar. Kişisel verinin maskelenme kuralları da bu bağlamdadır.

Kod bugün `tradehub_core/privacy/` paketinde toplanmaya başlamış durumda. Bazı parçalar hâlâ `audit/`, `utils/` ve `api/v1/` altında. DocType'ların hepsi `Tradehub Core` modülünde.

Hedef paket `tradehub_core/privacy/` olur. Hedef Frappe modülü `Privacy` olur.

## 2. DocType listesi

Ana kayıtlar (9):

- `Consent Policy Version`
- `Data Export Request`
- `Data Processing Agreement`
- `Data Retention Policy`
- `PII Field Policy`
- `Processing Activity Record`
- `User Consent Log` (kayıt defteri)
- `Deferred Anonymization` (kayıt defteri)
- `Commercial Consent Sync` (kayıt defteri, 12 bağlamına taşınmalı)

Alt tablolar (4):

- `DPA Data Category`
- `PII Jurisdiction Rule`
- `ROPA DocType Link`
- `Retention Anonymize Field`

Ayar (single) yok.

Toplam 13 DocType vardır. Her biri için ayrı rapor bu klasörde durur.

## 3. Bağlamın dışa açık API'si

Önerilen dosya `tradehub_core/privacy/api.py` dosyasıdır.

İzin fonksiyonları:

- `record_consent(user, consent_type, action, ...)`
- `check_consent(user, consent_type)`
- `get_user_consents(user)`
- `get_consent_log(name)`
- `get_active_policy_version(policy_type)`

Veri hakkı fonksiyonları:

- `request_data_export(user)`
- `get_export_status(name)`
- `schedule_anonymization(doctype, names, days, reason)`

Kişisel veri kuralı fonksiyonları:

- `get_field_policy(doctype, fieldname)`
- `mask_fields(doc, user)`

Rapor fonksiyonu:

- `export_ropa_report(fmt)`

Diğer bağlamlar için iki kayıt noktası önerilir. Kayıt noktası, `hooks.py` içinde her bağlamın kendi fonksiyonunu yazdığı listedir.

- `tradehub_personal_data_exporters` kayıt noktasında her bağlam kendi kişisel verisini dışa aktarır.
- `tradehub_anonymizers` kayıt noktasında her bağlam kendi kaydını anonim yapar.

## 4. Yayınlanan ve dinlenen olaylar

Bu bağlamın yayınladığı olaylar:

- `consent.recorded`. Olay şu alanları taşır: `log_id`, `user`, `consent_type`, `action`, `version`, `source`. 12 bildirim bağlamı dinler.
- `consent_policy.activated`. Olay şu alanları taşır: `policy_type`, `version`, `effective_date`. İsteyen bağlam dinler.
- `data_export.ready`. Olay şu alanları taşır: `request_id`, `user`, `expires_at`. 12 bildirim bağlamı e-posta için dinler.
- `dpa.expiring`. Olay şu alanları taşır: `dpa_id`, `party`, `expires_at`. 12 bildirim bağlamı dinler.
- `pii_policy.changed`. Olay `ref_doctype` ve `fieldname` alanlarını taşır. Önbellek tutan bağlamlar dinler.
- `anonymization.due` ve `retention.due`. Sahip bağlamlar kendi kayıtlarını anonim yapmak için dinler.

Bu bağlamın dinlediği olaylar:

- 01 kimlik bağlamının `account.deleted` olayı. Ertelenmiş anonimleştirme planlanır.
- 02 mağaza bağlamının `seller.deleted` olayı. Sözleşme durumu güncellenir.

## 5. Bağlamlar arası en ağır 10 bağımlılık

1. İzin kaydı bildirim kodunu doğrudan çağırıyor. Kanıt: `privacy/consent.py:35`.
2. `Commercial Consent Sync` denetleyicisi bildirim paketini içe aktarıyor. Kanıt: `commercial_consent_sync.py:11`.
3. Bildirim kodu izin kaydını doğrudan okuyor. Kanıt: `notifications/consent_bridge.py:77` ve `:162`.
4. Veri dışa aktarma kodu 15 DocType'ı doğrudan okuyor. Kanıt: `privacy/data_export.py:63`. Liste `Order`, `Cart`, `RFQ` ve `Addresses` gibi kayıtları içeriyor.
5. Saklama görevi her tabloya ham SQL ile yazıyor. Kanıt: `privacy/data_retention.py:77` ve `privacy/data_retention.py:128`.
6. Ertelenmiş anonimleştirme lojistik tablosuna yazıyor. Kanıt: `privacy/deferred_anonymization.py:24` ve `:85`.
7. PII izin kodu ortak `permissions.py` dosyasında. Kanıt: `hooks.py:1138` ve `hooks.py:1261`.
8. Yetki simülatörü PII tablosunu okuyor. Kanıt: `api/v1/authorization_simulator.py:115`.
9. Gizlilik görevleri `audit` paketinden çağrılıyor. Kanıt: `audit/tasks.py:118`, `audit/tasks.py:125` ve `audit/tasks.py:130`.
10. Medya paketi `Data Export Request` adını biliyor. Kanıt: `media/presets.py:55`.

## 6. Önerilen geçiş sırası

Her madde bir PR boyutundadır.

1. `privacy/api.py` ve `privacy/contracts.py` dosyalarını açın. Fonksiyonlar önce eski kodu çağırsın.
2. Ortak Outbox hazır olunca `consent.recorded` olayını yayınlayın. Doğrudan çağrı şimdilik kalsın.
3. 12 bildirim bağlamı olaya abone olsun. Sonra `privacy/consent.py:35` çağrısını kaldırın.
4. `Commercial Consent Sync` kaydını 12 bağlamına devredin.
5. `tradehub_personal_data_exporters` kayıt noktasını ekleyin. Eski liste geçiş süresince çalışsın.
6. Her bağlam kendi dışa aktarıcısını ayrı PR ile eklesin.
7. `tradehub_anonymizers` kayıt noktasını ekleyin. İlk olarak lojistik anonimleştiricisini taşıyın.
8. `utils/pii_compliance.py` dosyasını `privacy/pii.py` olarak taşıyın.
9. PII izin fonksiyonlarını `permissions.py` dosyasından `privacy/permissions.py` dosyasına taşıyın.
10. Gizlilik görevlerini `audit/tasks.py` içinden `privacy/tasks.py` içine taşıyın.
11. DocType'ları `Privacy` modülüne taşıyın. Alt tablolar ebeveynleriyle aynı PR içinde gitsin.
12. Çeviri fonksiyonu kullanmayan hata mesajlarını `_()` ile sarın.

## 7. Başka bağlama taşınması gereken DocType'lar

- `Commercial Consent Sync` 12-bildirim-iletisim bağlamına taşınmalı. Kaydı yalnız bildirim servisi yazar. Kanıt: `commercial_consent_sync.py:16`.

Bağlam haritası değiştirilmedi. Bu öneri yalnız raporlarda yazılıdır.

## 8. Paralel çalışan geliştiriciler için kurallar

1. Başka bağlamın tablosuna ham SQL ile yazmayın. Anonimleştirmeyi sahip bağlama bırakın.
2. Yeni kişisel veri alanı eklerseniz `PII Field Policy` kaydı da ekleyin.
3. Kişisel veri tutan yeni DocType eklerseniz bir dışa aktarıcı kaydedin.
4. Bir alanın adını değiştirirseniz saklama kurallarını kontrol edin. CI testi bu kontrolü yapmalı.
5. İzin kararını yalnız `record_consent` ile yazın.
6. Bildirim kodu izin tablosunu doğrudan okumasın. `privacy/api.py` kullansın.
7. Hata mesajlarını `_()` ile yazın.
8. Testleri `tradehub_core/privacy/tests/` altına yazın.

Gerçek okurla denenmedi.

## Epic özeti

Bu bağlamda 13 epic vardır. Her epic bir DocType raporunun başındadır.

- Commercial Consent Sync: Önemli, Faz 4, Orta
- Consent Policy Version: Önemli, Faz 4, Küçük
- DPA Data Category: Düşük, Faz 5, Küçük
- Data Export Request: Acil, Faz 4, Büyük
- Data Processing Agreement: Önemli, Faz 4, Orta
- Data Retention Policy: Acil, Faz 4, Büyük
- Deferred Anonymization: Acil, Faz 4, Orta
- PII Field Policy: Önemli, Faz 4, Orta
- PII Jurisdiction Rule: Düşük, Faz 5, Küçük
- Processing Activity Record: Düşük, Faz 4, Küçük
- ROPA DocType Link: Düşük, Faz 5, Küçük
- Retention Anonymize Field: Düşük, Faz 5, Küçük
- User Consent Log: Önemli, Faz 4, Orta
