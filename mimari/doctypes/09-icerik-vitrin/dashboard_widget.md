# Dashboard Widget

- Bağlam: 09-icerik-vitrin
- Tür: Ana kayıt
- Klasör: `tradehub_core/tradehub_core/doctype/dashboard_widget`
- Denetleyici: `tradehub_core/tradehub_core/doctype/dashboard_widget/dashboard_widget.py` (130 satır)
- Önerilen sahip bağlam: 14-platform-cekirdek. Kayıt yönetim panosu motorunun ayarıdır.

## Epic

- Epic adı: Dashboard Widget: 14-platform-cekirdek bağlamına taşıma
- Öncelik: Önemli
- Faz: Faz 4
- Tahmini büyüklük: Büyük

### User story

Bir platform yöneticisi olarak, bir ekip alan adını değiştirince panodaki sayıların bozulmamasını istiyorum.
Böylece panoya güvenebilirim.

### Kabul kriterleri

- [ ] `DEFAULT_SCOPE_FIELDS` sözlüğü `dashboards/scope.py` dosyasında duruyor.
- [ ] Denetleyici artık `dashboard_engine` modülünü içe aktarmıyor.
- [ ] `tradehub_dashboard_metrics` kayıt noktası var. Sipariş ve ödeme metrikleri bu noktadan geliyor.
- [ ] CI testi bütün göstergelerin alan adlarını meta bilgisiyle kontrol ediyor.
- [ ] Satıcı panosu yalnız kendi mağazasının sayılarını gösteriyor.
- [ ] Characterization test: `Dashboard Widget` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- Yeni gösterge için başka bağlamın tablosuna ham SQL yazmayın. Metriği o bağlamın sağlayıcısına ekleyin.
- `scope_field` alanını boş bırakan satıcı göstergesi eklemeyin. Başka satıcının verisi görünür.
- Kaynak DocType değişince yalnız patch ile düzeltmekle yetinmeyin. Metrik sağlayıcısını da güncelleyin.
- `dashboard_engine.py` içindeki SQL parametrelerini metin birleştirerek kurmayın. SQL enjeksiyonu riski doğar.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] Değişen davranış için önce başarısız olan bir test yazıldı.
- [ ] Ruff ve uygulama testleri yerelde geçiyor.
- [ ] `import-linter` kontrolü `tradehub_core.platform` için geçiyor.
- [ ] `CODEOWNERS` içindeki platform çekirdeği bağlamı sahibinden inceleme istendi.
- [ ] Kapsam alanı testi her satıcı göstergesi için geçiyor.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?

Bu kayıt yönetim panosundaki bir göstergeyi tanımlar. Gösterge bir DocType'tan sayı, toplam ya da grafik üretir. Kaynak DocType `source_doctype` alanında seçilir. Motor `tradehub_core/tradehub_core/api/dashboard_engine.py` dosyasıdır.

## Bugünkü bağımlılıklar

### Bu kaydın bağlandığı kayıtlar

- `DocType` (`source_doctype`, Link): başka bağlam (Frappe çekirdeği)
- `Dashboard Widget Role` (`visible_roles`, alt tablo): aynı bağlam

### Bu kayda dokunan kod

- `tradehub_core/tradehub_core/api/dashboard_engine.py:967`: yazıyor
- `tradehub_core/tradehub_core/api/dashboard_engine.py:979`: yazıyor
- `tradehub_core/tradehub_core/api/dashboard_engine.py:633`: okuyor
- `tradehub_core/tradehub_core/api/dashboard_engine.py:824`: okuyor
- `tradehub_core/tradehub_core/api/dashboard_engine.py:625`: adını kullanıyor
- `tradehub_core/tradehub_core/api/dashboard_engine.py:724`: adını kullanıyor
- 10 patch ya da tohum dosyası bu adı kullanıyor. Örnek: `tradehub_core/patches/backfill_widget_scope_field.py`.

### hooks.py kayıtları

- `hooks.py` içinde bu DocType için kayıt yok.

## Bağımlılık sorunları

1. Motor her bağlamın tablosunu ham SQL ile okuyor. Kanıt: `dashboard_engine.py:389` ve `dashboard_engine.py:440`. Bir ekip alan adını değiştirirse gösterge sessizce bozulur.
2. Kapsam alanları başka bağlamların DocType adlarıyla sabit yazılı. Kanıt: `dashboard_engine.py:189` satırındaki `DEFAULT_SCOPE_FIELDS`.
3. Denetleyici API modülünü içe aktarıyor. Kanıt: `dashboard_widget.py:79`. Yön tersine dönmüş durumda.
4. Birçok patch gösterge kayıtlarını değiştiriyor. Örnek: `patches/fix_total_users_widgets_to_user_profile.py`. Kaynak DocType değişince patch gerekiyor.

## Hedef tasarım

- Sahip bağlam ve paket yolu: `tradehub_core/platform/dashboards/` paketi. 14-platform-cekirdek bağlamına taşınır.
- Dışarıya açılan fonksiyonlar: `platform/api.py` içinde `render_widget(name, filters)`. Her bağlam kendi metrik sağlayıcısını kaydeder.
- Yayınladığı olaylar: Yok.
- Dinlediği olaylar: Yok.
- Başka bağlamlara bağlantılar: `source_doctype` Link alanı geçiş süresince kalır. Hedefte her bağlam bir okuma modeli verir. Okuma modeli, başka bağlamın okuyabildiği belgelenmiş görünümdür. Örnek kayıt noktası: `tradehub_dashboard_metrics`.
- Denetleyicide kalacak doğrulamalar: JSON alanı, renk ön ayarı ve kapsam alanı doğrulamaları kalır.
- Servise taşınacak iş kuralları: `DEFAULT_SCOPE_FIELDS` sözlüğü her bağlamın metrik sağlayıcısına dağıtılır.

## Geçiş adımları

1. `DEFAULT_SCOPE_FIELDS` sözlüğünü ayrı bir `dashboards/scope.py` dosyasına alın. Denetleyici oradan okusun.
2. `tradehub_dashboard_metrics` kayıt noktasını ekleyin. Kayıt yoksa bugünkü SQL yolu çalışsın.
3. Her bağlam kendi metriklerini ayrı PR ile kaydetsin. İlk sırada sipariş ve ödeme olsun.
4. CI testi tüm göstergelerin alanlarını meta bilgisiyle kontrol etsin.
5. DocType'ı 14 bağlamının modülüne taşıyın.

## Riskler ve testler

- Satıcı panosu başka satıcının sayılarını gösterebilir. Test: kapsam alanı her göstergede uygulanmalı.
- Alan adı değişince gösterge sıfır gösterir. Test: CI meta testi bilinmeyen alanı yakalamalı.
