# Seller Value Mapping

- Bağlam: 03b-ice-aktarma
- Tür: Ana kayıt (ayar)
- Klasör: `tradehub_core/tradehub_core/doctype/seller_value_mapping`
- Denetleyici: `tradehub_core/tradehub_core/doctype/seller_value_mapping/seller_value_mapping.py` (68 satır)
- Önerilen sahip bağlam: 03b-ice-aktarma

## Epic

- Epic adı: Seller Value Mapping: 03b-ice-aktarma bağlamına taşıma
- Öncelik: Önemli
- Faz: Faz 4
- Tahmini büyüklük: Küçük

### User story

Bir satıcı olarak, değer eşlemelerimin ve sistem eşlemelerinin yüklemede birlikte çalışmasını istiyorum.
Böylece dosyamdaki "Yeni" değeri her seferinde doğru değere çevrilir.

### Kabul kriterleri

- [ ] İzin sorgusu sistem kaydını herkese okunur yapıyor. `Regex Pattern Library` ile aynı kural. Test var.
- [ ] `target_field` `LISTING_IMPORT_FIELDS` sözleşmesine bağlı. Test var.
- [ ] Aynı hedef alan için ikinci kayıt reddediliyor. Test var.
- [ ] Sistem eşlemesi değişince `value_map:*` anahtarları siliniyor. Test var.
- [ ] Characterization test: `Seller Value Mapping` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- Önbellek düşürmeyi denetleyiciden `hooks.py` içine taşımayın. Denetleyicide kalması doğru örnektir.
- Katalog alan adlarını sabit yazmayın.
- Satıcıya sistem eşlemesi yazma izni vermeyin.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] İzin ve teklik testleri geçiyor.
- [ ] Önbellek testi geçiyor.
- [ ] `CODEOWNERS` içe aktarma ekibinden inceleme istendi.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?
Seller Value Mapping toplu yüklemede gelen değeri hedef değere çevirir. Örneğin dosyadaki "Yeni" değeri "New" olur. Sistem eşlemesi herkes için geçerlidir. Satıcı kendi eşlemesini ekler. Her hedef alan için tek kayıt olur.

## Bugünkü bağımlılıklar
### Bu kaydın bağlandığı kayıtlar
- `Admin Seller Profile` (seller_profile): başka bağlam (02-satici-magaza)
- Alt tablo `Seller Value Mapping Row` (rows): aynı bağlam
### Bu kayda dokunan kod
- `tradehub_core/tradehub_core/doctype/seller_value_mapping/seller_value_mapping.py:9-53`: hedef alan, teklik, satır kontrolü ve önbellek düşürme
- `tradehub_core/bulk_import/value_mapping.py:35-91`: içe aktarma eşlemeyi yüklüyor ve uyguluyor
- `tradehub_core/bulk_import/regex_lib.py:357,426,457,689,751,782`: satıcı ve sistem eşlemesi uç noktaları (yazıyor)
- `tradehub_core/permissions.py:2134-2155`: satıcı yalnız kendi eşlemesini görür
### hooks.py kayıtları
- `tradehub_core/hooks.py:1125,1248`: izin sorgusu ve tek kayıt izni

## Bağımlılık sorunları
1. `tradehub_core/permissions.py:2134-2142` izin sorgusu `seller_profile` eşitliği istiyor. Sistem kaydında `seller_profile` boş. Satıcı sistem eşlemesini listede göremez. `Regex Pattern Library` izni ise sistem kapsamını açıkça izin veriyor (`permissions.py:2106-2116`). İki kural tutarsız. Doğrulanmadı: satıcı paneli sistem eşlemesini başka uç noktadan okuyabilir.
2. `target_field` değerleri katalog alan adlarıdır. `Regex Pattern Library` ile aynı sözleşme sorunu.

## Hedef tasarım
- Sahip bağlam `03b-ice-aktarma`, paket yolu `tradehub_core/import_pipeline/`.
- Dışarıya açılan fonksiyonlar: `build_value_map(seller_profile)` ve `apply_value_mapping(field, value, value_map)`. Bugün `value_mapping.py:35,91` içinde. Dışa açılmaları gerekmez. İçe aktarma kendi içinde kullanır.
- Olay yok.
- Başka bağlamlara bağlantılar: `seller_profile` Link kalır. Hedef alan listesi `catalog/contracts.py` sözleşmesinden okunur.
- Denetleyicide kalacak doğrulamalar: hepsi kalır. Önbellek düşürme zaten denetleyicide (`:49-53`). İyi örnek.

## Geçiş adımları
1. İzin sorgusunu `Regex Pattern Library` ile aynı yapın: sistem kaydı herkese okunur. Bağımsızdır.
2. `target_field` doğrulamasını `LISTING_IMPORT_FIELDS` sözleşmesine bağlayın.
3. `module` alanını "Import Pipeline" yapın.

## Riskler ve testler
- Aynı hedef alan için ikinci kayıt reddedilmeli. Test: aynı satıcı aynı alan ikinci kayıt hata verir.
- Sistem eşlemesi değişince tüm satıcı önbelleği düşmeli. Test: `value_map:*` anahtarları silinir.
