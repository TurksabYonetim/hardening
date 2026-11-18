# CMS Content Version

- Bağlam: 09-icerik-vitrin
- Tür: Kayıt defteri (log)
- Klasör: `tradehub_core/seo_cms/doctype/cms_content_version`
- Denetleyici: `tradehub_core/seo_cms/doctype/cms_content_version/cms_content_version.py` (47 satır)
- Önerilen sahip bağlam: 09-icerik-vitrin

## Epic

- Epic adı: CMS Content Version: 09-icerik-vitrin bağlamına taşıma
- Öncelik: Önemli
- Faz: Faz 4
- Tahmini büyüklük: Küçük

### User story

Bir geliştirici olarak, sürüm defterinin izin kodunu içerik paketinde görmek istiyorum.
Böylece SEO paketini değiştirmeden izin kuralını düzeltebilirim.

### Kabul kriterleri

- [ ] `cms_version_query_conditions` ve `cms_version_has_permission` fonksiyonları `content/permissions.py` içinde duruyor.
- [ ] Yabancı mağazanın sürüm satırı `/api/resource` yolunda listelenmiyor.
- [ ] `version_key` boş olan satır kaydedilemiyor.
- [ ] Characterization test: `CMS Content Version` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- Sürüm satırlarını `frappe.db.delete` ile silmeyin. Silme yalnız `content/api.py` test yardımcısından yapılmalı.
- `version_key` üretimini çağrı yerine taşımayın. Anahtarı yalnız denetleyici üretir.
- İzin kaydını genel mağaza döngüsüne eklemeyin. Bu tabloda `store` alanı yoktur.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] Değişen davranış için önce başarısız olan bir test yazıldı.
- [ ] Ruff ve uygulama testleri yerelde geçiyor.
- [ ] `import-linter` kontrolü `tradehub_core.content` için geçiyor.
- [ ] `CODEOWNERS` içindeki içerik bağlamı sahibinden inceleme istendi.
- [ ] Mağaza izni için iki katmanlı test var. Liste ve doğrudan kayıt ayrı test ediliyor.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?

Bu kayıt içerik yayınlarının sürüm defteridir. Her yayın bir satır üretir. Satır Builder anlık görüntüsüne ve yasal metin sürümüne bağlıdır. Geri alma işlemi bu satırları kullanır.

## Bugünkü bağımlılıklar

### Bu kaydın bağlandığı kayıtlar

- `CMS Content` (`content`, Link): aynı bağlam
- `Builder Snapshot` (`snapshot`, Link): başka bağlam (Frappe Builder uygulaması)
- `User` (`published_by`, Link): başka bağlam (Frappe çekirdeği)
- `Consent Policy Version` (`consent_policy_version`, Link): başka bağlam (13-uyum-gizlilik)

### Bu kayda dokunan kod

- `tradehub_core/seo_helper/audit/schema_f44.py:1038`: yazıyor
- `tradehub_core/seo_helper/audit/schema_f44.py:1214`: yazıyor
- `tradehub_core/seo_helper/audit/schema_f44.py:1035`: okuyor
- `tradehub_core/seo_helper/core/permissions.py:156`: okuyor
- `tradehub_core/seo_helper/api/cms.py:438`: adını kullanıyor
- `tradehub_core/seo_helper/cms/versioning.py:358`: adını kullanıyor
- `tradehub_core/seo_helper/cms/versioning.py:459`: adını kullanıyor
- 1 patch ya da tohum dosyası bu adı kullanıyor. Örnek: `tradehub_core/seo_helper/patches/v0_3/cms_tekillik_anahtarlari.py`.

### hooks.py kayıtları

- `tradehub_core/hooks.py:1445`: `permission_query_conditions["CMS Content Version"] = f"{_SH}.core.permissions.cms_version_query_conditions"`
- `tradehub_core/hooks.py:1446`: `has_permission["CMS Content Version"] = f"{_SH}.core.permissions.cms_version_has_permission"`

## Bağımlılık sorunları

1. İzin kuralı ebeveyn tablodan mağaza bilgisini okuyor. Kanıt: `hooks.py:1445` ve `seo_helper/core/permissions.py:170`. İzin kodu SEO paketinde duruyor.
2. Denetim aracı sürüm satırlarını doğrudan siliyor. Kanıt: `seo_helper/audit/schema_f44.py:1038`. Bu araç test verisi temizliyor ama canlı tabloya yazıyor.

## Hedef tasarım

- Sahip bağlam ve paket yolu: `tradehub_core/content/cms/` paketi. Bugünkü `SEO CMS` modülü bu bağlama ait sayılır.
- Dışarıya açılan fonksiyonlar: `content/api.py` içinde `list_versions(content)` ve `rollback(content, version_no)`.
- Yayınladığı olaylar: Yok.
- Dinlediği olaylar: Yok.
- Başka bağlamlara bağlantılar: `snapshot` Link alanı Frappe Builder kaydına bağlı kalır. `consent_policy_version` Link alanı kalır.
- Denetleyicide kalacak doğrulamalar: `version_key` üretimi ve sıfır sürüm kontrolü kalır.
- Servise taşınacak iş kuralları: Sürüm yazımı `content/cms/versioning.py` içinde kalır.

## Geçiş adımları

1. `cms_version_query_conditions` fonksiyonunu `content/permissions.py` içine taşıyın. `hooks.py:1445` yolunu güncelleyin.
2. `schema_f44.py` temizliğini `content/api.py` içindeki test yardımcı fonksiyonuna bağlayın.
3. Ebeveyn ile aynı sırada `Content` modülüne taşıyın.

## Riskler ve testler

- Satıcı başka mağazanın sürümlerini görebilir. Test: yabancı mağaza sürümü listede çıkmamalı.
