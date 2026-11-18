# Seller Template Profile

- Bağlam: 02-satici-magaza
- Tür: Ana kayıt (ayar önbelleği)
- Klasör: `tradehub_core/tradehub_core/doctype/seller_template_profile`
- Denetleyici: `tradehub_core/tradehub_core/doctype/seller_template_profile/seller_template_profile.py` (18 satır)
- Önerilen sahip bağlam: 03b-ice-aktarma. Kaydı yalnız toplu ürün yükleme kodu kullanıyor.

## Epic

- Epic adı: Seller Template Profile: 03b-ice-aktarma bağlamına taşıma
- Öncelik: Düşük
- Faz: Faz 4
- Tahmini büyüklük: Küçük

### User story

Bir geliştirici olarak, yükleme şablonunun sahibini içe aktarma ekibi yapmak istiyorum.
Böylece kaydı kullanan ekip kaydın sahibi olur.

### Kabul kriterleri

- [ ] JSON `module` alanı içe aktarma modülünü gösteriyor.
- [ ] `CODEOWNERS` kaydı 03b ekibini gösteriyor.
- [ ] Mağaza silinince şablonlar olayla siliniyor. Test geçiyor.
- [ ] Characterization test: `Seller Template Profile` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- Satıcı paketinden bu kayda yazmayın.
- `fingerprint` tekliğini kaldırmayın.
- `mapping_json` biçimini sürüm alanı olmadan değiştirmeyin.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] Değişen davranış için önce başarısız olan test yazıldı.
- [ ] Ruff ve ilgili testler yerelde geçiyor.
- [ ] `import-linter` kontrolü yeni ihlal üretmiyor.
- [ ] `CODEOWNERS` içindeki 03b-ice-aktarma sahibi inceleyici olarak eklendi.
- [ ] `test_seller_template_profile.py` geçiyor.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?
Bu kayıt bir satıcının yükleme dosyası şablonunu hatırlar. Dosyanın parmak izi (fingerprint) ve sütun eşlemesi saklanır. Parmak izi, dosya yapısından üretilen tekil koddur. Aynı biçimde dosya gelince eşleme tekrar kullanılır.

## Bugünkü bağımlılıklar
### Bu kaydın bağlandığı kayıtlar
- `Admin Seller Profile` (`seller`): aynı bağlam
### Bu kayda dokunan kod
- `tradehub_core/bulk_import/ingestion/profile_store.py:54`, `:80`, `:91`: okuyor, güncelliyor, oluşturuyor
- `tradehub_core/bulk_import/ingestion/profile_store.py:109`: kullanım sayacını okuyor
- `tradehub_core/bulk_import/tasks.py:147`, `:154`: temizlik işi
### hooks.py kayıtları
- `tradehub_core/hooks.py:1126`: `permission_query_conditions`
- `tradehub_core/hooks.py:1249`: `has_permission`

## Bağımlılık sorunları
1. Kayıt yanlış bağlamda. Kanıt: tüm kullanıcılar `bulk_import/` paketinde. Satıcı ekibi bu kaydın sahibi gibi görünüyor ama dokunmuyor.
2. Önemli başka bir bağımlılık sorunu bulunmadı.

## Hedef tasarım
- Sahip bağlam: 03b-ice-aktarma. Paket yolu: `tradehub_core/bulk_import/`.
- Dışa açık fonksiyon gerekmez. Kayıt içe aktarma bağlamının iç verisidir.
- Dinlediği olay: `seller.store.deleted`. Mağazanın şablonlarını siler.
- `seller` Link alanı kalır.
- Denetleyicide zorunlu alan ve biçim kontrolü kalır.

## Geçiş adımları
1. JSON `module` alanını içe aktarma modülüne çevirin. CODEOWNERS kaydını 03b ekibine verin.
2. Mağaza silme olayını dinleyen işleyiciyi ekleyin. Bu adım olay altyapısından sonra gelir.

## Riskler ve testler
- Şablon kaybolursa satıcı eşlemeyi yeniden yapar. `test_seller_template_profile.py` korunmalı.
