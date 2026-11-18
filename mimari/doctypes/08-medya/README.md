# 08-medya

## Bağlamın amacı

Medya bağlamı kaynak dosyayı, işleme durumunu ve yayınlanan çıktıyı yönetir.
Kaynak dosya yaşam döngüsü işleme ve temizlik akışlarını tetikler. `tradehub_core/hooks.py:504`, `tradehub_core/hooks.py:540`

## DocType listesi

### Ana kayıt

- [`Media Asset`](media_asset.md)
- [`Media Category`](media_category.md)
- [`Media Category Assignment`](media_category_assignment.md)
- [`Media Crop Intent`](media_crop_intent.md)
- [`Media Folder`](media_folder.md)
- [`Media Folder Item`](media_folder_item.md)
- [`Media Locale Variant`](media_locale_variant.md)
- [`Media Metadata Vault`](media_metadata_vault.md)
- [`Media Migration Run`](media_migration_run.md)
- [`Media Policy`](media_policy.md)
- [`Media Processing Job`](media_processing_job.md)
- [`Media Profile`](media_profile.md)
- [`Media Rendition`](media_rendition.md)
- [`Media SEO Override`](media_seo_override.md)
- [`Media Source`](media_source.md)
- [`Media URL Redirect`](media_url_redirect.md)
- [`Media Usage`](media_usage.md)
- [`Media Version`](media_version.md)

### Alt tablo

- [`Media Content Rule`](media_content_rule.md)
- [`Media Crop Override`](media_crop_override.md)
- [`Media Migration Batch`](media_migration_batch.md)
- [`Media Policy Profile`](media_policy_profile.md)
- [`Media Storage Profile`](media_storage_profile.md)

### Ayar (single)

- [`Media Engine Settings`](media_engine_settings.md)
- [`Media Storage Settings`](media_storage_settings.md)

### Kayıt defteri (log)

- [`Image Moderation Log`](image_moderation_log.md)
- [`Media Maintenance Report`](media_maintenance_report.md)
- [`Media Quality Report`](media_quality_report.md)
- [`Media RUM Sample`](media_rum_sample.md)
- [`Media Usage Meter`](media_usage_meter.md)

## Bağlamın dışa açık API'si

`tradehub_core/media/api.py` önerilen girişleri sunar.
`tradehub_core/media/contracts.py` veri alanlarını ve dönüş biçimlerini tanımlar.

- `get_asset`, `plan_asset_purge`, `purge_asset` ([`Media Asset`](media_asset.md)).
- `list_categories`, `save_category` ([`Media Category`](media_category.md)).
- `assign_category` ([`Media Category Assignment`](media_category_assignment.md)).
- `save_crop_intent` ([`Media Crop Intent`](media_crop_intent.md)).
- `list_folders`, `save_folder` ([`Media Folder`](media_folder.md)).
- `set_folder_items` ([`Media Folder Item`](media_folder_item.md)).
- `resolve_localized_asset` ([`Media Locale Variant`](media_locale_variant.md)).
- `list_renditions` ([`Media Rendition`](media_rendition.md)).
- `get_image_seo` ([`Media SEO Override`](media_seo_override.md)).
- `resolve_media_redirect` ([`Media URL Redirect`](media_url_redirect.md)).
- `set_asset_usage` ([`Media Usage`](media_usage.md)).
- `get_usage_totals` ([`Media Usage Meter`](media_usage_meter.md)).
- `promote_asset_version`, `rollback_asset_version` ([`Media Version`](media_version.md)).

## Yayınlanan ve dinlenen olaylar

| Olay | Veri | Yayınlayan | Dinleyen |
| --- | --- | --- | --- |
| `media.asset_published` | `event_id`, `asset_id`, `version_id` | `08-medya` | `03a-katalog` |
| `catalog.listing_media_changed` | `event_id`, `listing_id`, `asset_ids` | `03a-katalog` | `08-medya` |
| `platform.file_registered` | `event_id`, `file_id`, `owner_id` | `14-platform-cekirdek` | `08-medya` |

Yayıncı, olay kaydını değişiklikle birlikte `Outbox` tablosuna yazar.
İşlem kesinleşince `frappe.enqueue` dağıtımı başlatır.
Dinleyici her olay kimliğini tek kez işler.
Katalog silme planı eşzamanlı API üzerinden yürür. Silme anında engeller tekrar denetlenir.

## Bağlamlar arası en ağır 10 bağımlılık

1. Katalog temizliği varlığın alanlarını ve silme engellerini doğrudan okur. `tradehub_core/listing_purge/media.py:141`
2. Katalog çalıştırıcısı medya kayıtlarının silme sırasını belirler. `tradehub_core/listing_purge/executor.py:42`
3. Dosya ekleme kancası medya türevi üretimine doğrudan girer. `tradehub_core/hooks.py:504`
4. Dosya silme kancası medya temizliğini doğrudan çağırır. `tradehub_core/hooks.py:540`
5. Katalog güncellemesi medya eşleme işlevini doğrudan çağırır. `tradehub_core/hooks.py:608`
6. Satıcı profili güncellemesi medya işleyicisini doğrudan çağırır. `tradehub_core/hooks.py:809`
7. Medya tarayıcısı sohbet eklerini doğrudan sorgular. `tradehub_core/media/browse.py:195`
8. Medya metin servisi katalog başlığını ve adres anahtarını doğrudan okur. `tradehub_core/media/seo.py:488`
9. SEO çözümleyicisi medya yönlendirme kaydını doğrudan okur. `tradehub_core/seo/page_resolver.py:643`
10. İnceleme silme işlemi moderasyon günlüğünü bağlı kayıtlarla birlikte siler. `tradehub_core/tradehub_core/doctype/listing_review/listing_review.py:44`, `tradehub_core/tradehub_core/doctype/listing_review/listing_review.py:591`

## Önerilen geçiş sırası

1. Medya API sözleşmesini ekle. Mevcut çağrıları içeride kullan.
2. İlk adımdan sonra katalog silme planını medya API’sine geçir. Uygulama sırasında planı tekrar doğrula.
3. İlk adımdan sonra SEO yönlendirme okuyucusunu medya API’sine geçir.
4. İlk adımdan sonra medya tarayıcısını iletişim ekleri görünümüne geçir. Mağaza kapsamını test et.
5. İlk adımdan sonra dosya ekleme işini olay kuyruğuna geçir. Geri alınan işlemi ve tekrarı test et.
6. Beşinci adımdan sonra katalog medya değişiklikleri için aynı olay düzenini kullan.
7. Önceki adımlardan sonra sahip paketlerin `modules.txt` kayıtlarını ve DocType `module` alanlarını taşı.
8. Yedinci adımdan sonra eski yönlendirme girişlerini kaldır. İçe aktarma kurallarını CI’da denetle.

## Başka bağlama taşınması gereken DocType'lar

`Image Moderation Log` için `11-degerlendirme` önerilir.
Önerilen giriş `tradehub_core/reviews/api.py::record_review_image_decision` işlevine taşınsın.
Yorum silme işlemi bu günlüğü sahip olunan kayıt olarak siler. `tradehub_core/tradehub_core/doctype/listing_review/listing_review.py:44`, `tradehub_core/tradehub_core/doctype/listing_review/listing_review.py:591`

## Bu bağlamda paralel çalışacak geliştiriciler için kurallar

- `CODEOWNERS` içinde medya paketine sahip ata. Testleri ve geçiş yamalarını o pakette tut.
- CI, sürekli bütünleştirme denetimidir. CI içinde paket içi işlevlere yapılan dış erişimleri engelle.
- Katalog yalnız medya API’si üzerinden medya kaydı yazsın.
- Belgelenmiş okuma modeli, dış tüketici için alanları ve yetki kapsamını tanımlar.
- İşleme, saklama ve yayın değişiklikleri ayrı değişiklik istekleriyle ilerlesin.

## Epic özeti

- Image Moderation Log: Önemli, Faz 4, Orta
- Media Asset: Acil, Faz 4, Büyük
- Media Category: Önemli, Faz 4, Orta
- Media Category Assignment: Önemli, Faz 4, Orta
- Media Content Rule: Önemli, Faz 4, Küçük
- Media Crop Intent: Önemli, Faz 4, Orta
- Media Crop Override: Önemli, Faz 4, Küçük
- Media Engine Settings: Önemli, Faz 4, Orta
- Media Folder: Önemli, Faz 4, Orta
- Media Folder Item: Önemli, Faz 4, Orta
- Media Locale Variant: Önemli, Faz 4, Orta
- Media Maintenance Report: Önemli, Faz 4, Orta
- Media Metadata Vault: Acil, Faz 4, Orta
- Media Migration Batch: Önemli, Faz 4, Küçük
- Media Migration Run: Önemli, Faz 4, Büyük
- Media Policy: Önemli, Faz 4, Orta
- Media Policy Profile: Önemli, Faz 4, Küçük
- Media Processing Job: Acil, Faz 4, Orta
- Media Profile: Önemli, Faz 4, Orta
- Media Quality Report: Önemli, Faz 4, Orta
- Media RUM Sample: Önemli, Faz 4, Orta
- Media Rendition: Acil, Faz 4, Orta
- Media SEO Override: Önemli, Faz 4, Orta
- Media Source: Önemli, Faz 4, Orta
- Media Storage Profile: Önemli, Faz 4, Küçük
- Media Storage Settings: Acil, Faz 4, Büyük
- Media URL Redirect: Önemli, Faz 4, Orta
- Media Usage: Acil, Faz 4, Orta
- Media Usage Meter: Önemli, Faz 4, Orta
- Media Version: Acil, Faz 4, Büyük
