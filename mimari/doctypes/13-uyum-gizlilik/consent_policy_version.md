# Consent Policy Version

- Bağlam: 13-uyum-gizlilik
- Tür: Ana kayıt
- Klasör: `tradehub_core/tradehub_core/doctype/consent_policy_version`
- Denetleyici: `tradehub_core/tradehub_core/doctype/consent_policy_version/consent_policy_version.py` (27 satır)
- Önerilen sahip bağlam: 13-uyum-gizlilik

## Epic

- Epic adı: Consent Policy Version: 13-uyum-gizlilik bağlamına taşıma
- Öncelik: Önemli
- Faz: Faz 4
- Tahmini büyüklük: Küçük

### User story

Bir platform yöneticisi olarak, yeni gizlilik metni etkinleşince eskisinin otomatik kapanmasını istiyorum.
Böylece kullanıcı her zaman güncel metni onaylar.

### Kabul kriterleri

- [ ] `get_active_policy_version` fonksiyonu `privacy/api.py` içinde var.
- [ ] Yeni sürüm etkinleşince eski sürüm "Superseded" oluyor.
- [ ] Etkinleştirme sonrası `consent_policy.activated` olayı yazılıyor.
- [ ] Characterization test: `Consent Policy Version` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- Aynı politika türünde iki etkin sürüm bırakmayın. İzin kaydı yanlış sürümü alır.
- Etkin sürümün metnini sonradan değiştirmeyin. Yeni sürüm açın.
- CMS kodundan bu kaydın durumunu değiştirmeyin. Durumu yalnız gizlilik bağlamı değiştirir.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] Değişen davranış için önce başarısız olan bir test yazıldı.
- [ ] Ruff ve uygulama testleri yerelde geçiyor.
- [ ] `import-linter` kontrolü `tradehub_core.privacy` için geçiyor.
- [ ] `CODEOWNERS` içindeki gizlilik bağlamı sahibinden inceleme istendi.
- [ ] Yeni olay için sözleşme testi eklendi. Test olay alanlarını kontrol ediyor.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?

Bu kayıt gizlilik metninin ve kullanım koşullarının sürümlerini tutar. Her politika türü için tek bir sürüm "Active" olur. Yeni sürüm etkinleşince eski sürüm "Superseded" yapılır. İzin kaydı, onaylanan sürümü bu tablodan alır.

## Bugünkü bağımlılıklar

### Bu kaydın bağlandığı kayıtlar

- Bu kaydın başka kayda bağlantısı yok.

### Bu kayda dokunan kod

- `tradehub_core/privacy/consent.py:115`: adını kullanıyor
- `tradehub_core/setup/module_navigation_spec.py:1204`: adını kullanıyor
- `tradehub_core/seo_cms/doctype/cms_content/cms_content.json:300`: alt tablo ya da Link tanımı
- `tradehub_core/seo_cms/doctype/cms_content_version/cms_content_version.json:115`: alt tablo ya da Link tanımı

### hooks.py kayıtları

- `hooks.py` içinde bu DocType için kayıt yok.

## Bağımlılık sorunları

1. CMS içerik kaydı bu DocType'a Link ile bağlı. Kanıt: `cms_content.json` içindeki `consent_policy_version` alanı. CMS Content Version da aynı bağı taşıyor. Bu bağ 09 bağlamını 13 bağlamına bağlıyor.
2. Denetleyici eski sürümleri `frappe.db.set_value` ile güncelliyor. Kanıt: `consent_policy_version.py:21`. Bu yazım `on_update` olaylarını atlar. Aynı bağlam içinde olduğu için kabul edilebilir.

## Hedef tasarım

- Sahip bağlam ve paket yolu: `tradehub_core/privacy/` paketi ve yeni `Privacy` Frappe modülü.
- Dışarıya açılan fonksiyonlar: `privacy/api.py` içinde `get_active_policy_version(policy_type)` ve `list_policy_versions(policy_type)`.
- Yayınladığı olaylar: `consent_policy.activated`. Olay şu alanları taşır: `policy_type`, `version`, `effective_date`, `previous_version`.
- Dinlediği olaylar: Yok. İsterseniz 09 bağlamının `content.published` olayı yasal metin yayınını bildirebilir.
- Başka bağlamlara bağlantılar: CMS Content üzerindeki Link kalabilir. Bu kayıt kararlı bir kök kayıttır. CMS tarafı sürüm metnini anlık görüntü olarak saklayabilir.
- Denetleyicide kalacak doğrulamalar: Tek etkin sürüm kuralı denetleyicide kalır.
- Servise taşınacak iş kuralları: Sürüm etkinleştirme işi `privacy/policy.py` içinde `activate_version()` olarak toplanabilir.

## Geçiş adımları

1. `privacy/api.py` dosyasını açın. `get_active_policy_version` fonksiyonunu ekleyin.
2. `privacy/consent.py:103` içindeki `_get_active_version` bu fonksiyonu kullansın.
3. Etkinleştirme sonrası `consent_policy.activated` olayını Outbox'a yazın.
4. DocType'ı `Privacy` modülüne taşıyın.

## Riskler ve testler

- İki sürüm aynı anda etkin kalabilir. Test: yeni sürüm etkinleşince eskisi "Superseded" olmalı.
- CMS sayfasının yasal sürüm bağı kopabilir. Test: CMS içeriği kaydedilirken Link doğrulaması geçmeli.
