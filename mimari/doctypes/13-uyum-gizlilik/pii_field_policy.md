# PII Field Policy

- Bağlam: 13-uyum-gizlilik
- Tür: Ana kayıt
- Klasör: `tradehub_core/tradehub_core/doctype/pii_field_policy`
- Denetleyici: `tradehub_core/tradehub_core/doctype/pii_field_policy/pii_field_policy.py` (37 satır)
- Önerilen sahip bağlam: 13-uyum-gizlilik

## Epic

- Epic adı: PII Field Policy: 13-uyum-gizlilik bağlamına taşıma
- Öncelik: Önemli
- Faz: Faz 4
- Tahmini büyüklük: Orta

### User story

Bir geliştirici olarak, kişisel veri kurallarının gizlilik paketinde durmasını istiyorum.
Böylece ortak izin dosyasında başka ekiplerle çakışmam.

### Kabul kriterleri

- [ ] `utils/pii_compliance.py` içeriği `privacy/pii.py` dosyasında duruyor.
- [ ] PII izin fonksiyonları `privacy/permissions.py` içinde. `hooks.py:1138` ve `hooks.py:1261` yeni yolu gösteriyor.
- [ ] `authorization_simulator.py` kuralları `privacy/api.get_field_policy` ile okuyor.
- [ ] Yetkisiz kullanıcı maskeli değer görüyor.
- [ ] Characterization test: `PII Field Policy` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- `permissions.py` dosyasına yeni PII fonksiyonu eklemeyin. Kod gizlilik paketine aittir.
- Aynı hukuk bölgesini iki kez tanımlamayın.
- Kural değişince önbellek temizliğini atlamayın. Eski kural uygulanır.
- Maskelemeyi kapatan bir test kısayolu bırakmayın.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] Değişen davranış için önce başarısız olan bir test yazıldı.
- [ ] Ruff ve uygulama testleri yerelde geçiyor.
- [ ] `import-linter` kontrolü `tradehub_core.privacy` için geçiyor.
- [ ] `CODEOWNERS` içindeki gizlilik bağlamı sahibinden inceleme istendi.
- [ ] Maskeleme testi en az bir yetkili ve bir yetkisiz kullanıcı ile çalışıyor.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?

Bu kayıt bir DocType alanının kişisel veri olduğunu tanımlar. PII, kişiyi tanıtan bilgidir. Kayıt alanın maskelenme ve erişim kuralını tutar. Ülke bazlı kurallar alt tabloda durur.

## Bugünkü bağımlılıklar

### Bu kaydın bağlandığı kayıtlar

- `DocType` (`ref_doctype`, Link): başka bağlam (Frappe çekirdeği)
- `PII Jurisdiction Rule` (`jurisdiction_rules`, alt tablo): aynı bağlam

### Bu kayda dokunan kod

- `tradehub_core/api/v1/compliance.py:105`: yazıyor
- `tradehub_core/api/v1/compliance.py:145`: yazıyor
- `tradehub_core/api/v1/compliance.py:103`: okuyor
- `tradehub_core/api/v1/compliance.py:141`: okuyor
- `tradehub_core/setup/handover_validator.py:196`: okuyor
- `tradehub_core/utils/pii_compliance.py:117`: okuyor
- `tradehub_core/api/v1/authorization_simulator.py:115`: adını kullanıyor
- `tradehub_core/api/v1/compliance.py:49`: adını kullanıyor
- `tradehub_core/api/v1/compliance.py:67`: adını kullanıyor
- `tradehub_core/setup/handover_validator.py:102`: adını kullanıyor
- `tradehub_core/utils/pii_compliance.py:109`: adını kullanıyor
- `tradehub_core/utils/pii_compliance.py:282`: adını kullanıyor
- 2 patch ya da tohum dosyası bu adı kullanıyor. Örnek: `tradehub_core/patches/v15_3_2_seed_pii_compliance_policies.py`.

### hooks.py kayıtları

- `tradehub_core/hooks.py:1138`: `"PII Field Policy": "tradehub_core.permissions.pii_field_policy_query_conditions",`
- `tradehub_core/hooks.py:1261`: `"PII Field Policy": "tradehub_core.permissions.pii_field_policy_has_permission",`

## Bağımlılık sorunları

1. İzin denetimi merkezi `permissions.py` dosyasında. Kanıt: `hooks.py:1138` ve `hooks.py:1261`. Bu dosya 1176 satırlık ortak bir dosya. Her bağlam aynı dosyayı değiştiriyor ve çakışma riski yüksek.
2. Kural motoru `utils/pii_compliance.py` içinde. Kanıt: `pii_field_policy.py:30`. Bu dosya gizlilik paketinin dışında.
3. Yetki simülatörü bu tabloyu okuyor. Kanıt: `api/v1/authorization_simulator.py:115`. Bu kod 01 bağlamına ait.

## Hedef tasarım

- Sahip bağlam ve paket yolu: `tradehub_core/privacy/` paketi ve yeni `Privacy` Frappe modülü.
- Dışarıya açılan fonksiyonlar: `privacy/api.py` içinde `get_field_policy(doctype, fieldname)` ve `mask_fields(doc, user)`.
- Yayınladığı olaylar: `pii_policy.changed`. Olay şu alanları taşır: `ref_doctype`, `fieldname`. Önbellek tutan bağlamlar bu olayı dinler.
- Dinlediği olaylar: Yok.
- Başka bağlamlara bağlantılar: `ref_doctype` Link alanı kalır. 01 bağlamı kuralları `privacy/api.py` üzerinden okur.
- Denetleyicide kalacak doğrulamalar: Ülke tekilliği ve permlevel doğrulamaları kalır.
- Servise taşınacak iş kuralları: `utils/pii_compliance.py` içeriği `privacy/pii.py` dosyasına taşınır.

## Geçiş adımları

1. `utils/pii_compliance.py` dosyasını `privacy/pii.py` olarak taşıyın. Eski yolda yalnız yeniden dışa aktarma bırakın.
2. İzin fonksiyonlarını `permissions.py` dosyasından `privacy/permissions.py` dosyasına taşıyın. `hooks.py` yolunu güncelleyin.
3. `authorization_simulator.py` okumasını `privacy/api.get_field_policy` çağrısına çevirin.
4. Eski yeniden dışa aktarmayı bir sürüm sonra silin.

## Riskler ve testler

- Maskeleme kapanırsa kişisel veri sızar. Test: yetkisiz kullanıcı maskeli değer görmeli.
- Önbellek temizlenmezse eski kural uygulanır. Test: kural değişince ilk okuma yeni kuralı döndürmeli.
