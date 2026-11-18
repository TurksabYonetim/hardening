# TH Module Registry

- Bağlam: 01-kimlik-erisim
- Tür: Ayar (ağaç yapılı menü kataloğu)
- Klasör: `tradehub_core/tradehub_core/doctype/th_module_registry`
- Denetleyici: `tradehub_core/tradehub_core/doctype/th_module_registry/th_module_registry.py` (60 satır)
- Önerilen sahip bağlam: 01-kimlik-erisim

## Epic

- Epic adı: TH Module Registry: 01-kimlik-erisim bağlamına taşıma
- Öncelik: Acil
- Faz: Faz 4
- Tahmini büyüklük: Büyük

### User story

Bir geliştirici olarak, kendi bağlamımın menüsünü kendi paketimde bildirmek istiyorum.
Böylece diğer ekiplerin menü patch'leriyle çakışmam.

### Kabul kriterleri

- [ ] `register_navigation` fonksiyonu ve `after_migrate` toplayıcısı var.
- [ ] Her bağlamın menüsü kendi `navigation.py` dosyasında duruyor.
- [ ] Menü anahtarlarının tekil olduğu test geçiyor.
- [ ] `tradehub_core/tests/test_seed_nav_keys_ancestors.py` geçiyor.
- [ ] Yeni menü patch'i yazmak `CODEOWNERS` ile kimlik ekibi onayı istiyor.
- [ ] Characterization test: `TH Module Registry` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- Yeni menü öğesi için yeni patch yazmayın. Bağlamın `navigation.py` dosyasını kullanın.
- Başka bağlamın `module_key` değerini değiştirmeyin.
- Toplayıcının mevcut öğeleri sessizce silmesine izin vermeyin.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] Değişen davranış için önce başarısız olan test yazıldı.
- [ ] Ruff ve ilgili testler yerelde geçiyor.
- [ ] `import-linter` kontrolü yeni ihlal üretmiyor.
- [ ] `CODEOWNERS` içindeki 01-kimlik-erisim sahibi inceleyici olarak eklendi.
- [ ] Taşıma öncesi ve sonrası menü ağacı karşılaştırıldı.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?
Bu kayıt yönetici ve satıcı panelinin menü ağacıdır. Her öğe bir bölüm, grup ya da sayfa olabilir. Öğe bir yeteneğe bağlıysa yalnız o yeteneği olan görür.

## Bugünkü bağımlılıklar
### Bu kaydın bağlandığı kayıtlar
- `TH Module Registry` (`parent_th_module_registry`): aynı kayıt
- `DocType` (`doctype_ref`): Frappe çekirdeği
- `TH Capability Registry` (`default_requires_capability`): aynı bağlam
### Bu kayda dokunan kod
- `tradehub_core/utils/permission_resolver.py:300`, `:369`: menüyü okuyor
- `tradehub_core/api/v1/permission_console.py:1953`, `:1958`: okuyor
- `tradehub_core/tradehub_core/doctype/th_module_registry/th_module_registry.py:46`: üst öğenin panelini okuyor
- 20'den fazla patch menü öğesi ekliyor. Örnek: `tradehub_core/patches/v15_9_21_g0_seed_seller_shipments_nav.py`, `tradehub_core/patches/v15_8_7_seed_messaging_nav.py`
### hooks.py kayıtları
- `tradehub_core/hooks.py:1002-1004`: `on_update` ve `after_delete` olayları `permission_resolver.on_module_registry_change` çağırıyor

## Bağımlılık sorunları
1. Her bağlam menüyü kendi patch'inde yazıyor. Kanıt: lojistik, mesaj, medya ve ödeme menü patch'leri. Aynı `module_key` iki patch'te ezilebilir. Bu, paralel geliştirmede en sık çakışma noktalarından biridir.
2. Menü kayıtları veritabanında. Kodla birlikte gözden geçirilmiyor. Bir ekip başkasının menüsünü bozabilir.

## Hedef tasarım
- Sahip bağlam: 01-kimlik-erisim. Paket yolu: `tradehub_core/identity/navigation/`.
- Her bağlam menüsünü kendi paketinde bildirir. Örnek dosya: `tradehub_core/logistics/navigation.py`. Dosya `NAV_ITEMS` listesi tutar.
- Dışa açık fonksiyon: `register_navigation(context_key, items)`. `after_migrate` sırasında tüm bildirimleri toplar.
- Yayınladığı olay: `identity.navigation.changed`.
- Denetleyicide panel kalıtımı ve hedef tutarlılığı kalır.

## Geçiş adımları
1. `register_navigation` fonksiyonunu ve `after_migrate` toplayıcısını ekleyin.
2. Bir bağlamın menüsünü bildirim dosyasına taşıyın. Örneğin lojistik. Sonucu mevcut kayıtlarla karşılaştırın.
3. Diğer bağlamları tek tek taşıyın. Her bağlam ayrı PR olsun.
4. Yeni menü patch'i yazmayı CODEOWNERS ile kimlik ekibinin onayına bağlayın.

## Riskler ve testler
- Toplayıcı mevcut öğeyi silerse menü kaybolur. `tradehub_core/tests/test_seed_nav_keys_ancestors.py` korunmalı.
- Her bağlamın menü anahtarlarının tekil olduğunu gösteren test ekleyin.
