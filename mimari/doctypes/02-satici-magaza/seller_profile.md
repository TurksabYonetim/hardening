# Seller Profile

- Bağlam: 02-satici-magaza
- Tür: Ana kayıt (kullanımdan kalktı)
- Klasör: `tradehub_core/tradehub_core/doctype/seller_profile`
- Denetleyici: `tradehub_core/tradehub_core/doctype/seller_profile/seller_profile.py` (15 satır)
- Önerilen sahip bağlam: 02-satici-magaza (silinene kadar)

## Epic

- Epic adı: Seller Profile: 02-satici-magaza bağlamına taşıma
- Öncelik: Düşük
- Faz: Faz 4
- Tahmini büyüklük: Küçük

### User story

Bir geliştirici olarak, kullanımdan kalkan satıcı profilini kaldırmak istiyorum.
Böylece ölü kod yanlış sonuç üretmez.

### Kabul kriterleri

- [ ] `tenant_seller_validation.py` dosyası kaldırıldı ya da kullanıcısı belgelendi.
- [ ] `Data Processing Agreement` bağı `Admin Seller Profile` kaydına çevrildi.
- [ ] Tabloyu kaldıran patch veriyi önce yedekliyor.
- [ ] Characterization test: `Seller Profile` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- Bu DocType'a yeni alan ya da kanca eklemeyin.
- Var olmayan `tenant` alanını okuyan kod eklemeyin.
- Yedek almadan tabloyu silmeyin.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] Değişen davranış için önce başarısız olan test yazıldı.
- [ ] Ruff ve ilgili testler yerelde geçiyor.
- [ ] `import-linter` kontrolü yeni ihlal üretmiyor.
- [ ] `CODEOWNERS` içindeki 02-satici-magaza sahibi inceleyici olarak eklendi.
- [ ] Gizlilik bağlamı (13) sahibi inceleyici olarak eklendi.
- [ ] Taşıma öncesi ve sonrası sözleşme kayıt sayısı aynı.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?
Bu kayıt eski satıcı profilidir. Veri `User Profile` ve `Admin Seller Profile` kayıtlarına taşındı. Denetleyici boştur. Kodun açıklamasına göre DocType gizli ve salt okunurdur (`seller_profile.py:1-8`).

## Bugünkü bağımlılıklar
### Bu kaydın bağlandığı kayıtlar
- `User` (`user`): Frappe çekirdeği
- `Seller Application` (`application`): aynı bağlam
- `Country` (`country`): Frappe çekirdeği
- Bu kayda bağlanan: `Data Processing Agreement` (13-uyum-gizlilik)
### Bu kayda dokunan kod
- `tradehub_core/tradehub_core/utils/tenant_seller_validation.py:108`: `tenant` alanını okuyor. Bu alan JSON içinde yok.
- `tradehub_core/tradehub_core/utils/tenant_seller_validation.py:266`: `tenant` alanına göre arıyor
- `tradehub_core/utils/helpers.py:7`: adı anıyor
- `tradehub_core/api/seo.py:199`: eski adı yeni ada çeviriyor
- `tradehub_core/privacy/data_export.py:102`: dışa aktarmada adı geçiyor
### hooks.py kayıtları
- Kayıt yok.

## Bağımlılık sorunları
1. Kod var olmayan alanı okuyor. Kanıt: `tenant_seller_validation.py:108`. JSON içinde `tenant` alanı yok. Hata `except` ile yutuluyor (`:109`). Bu modül `hooks.py` içinde kayıtlı değil. Kod ölü görünüyor (doğrulanmadı: başka çağıran var mı).
2. Gizlilik bağlamı kalkan kayda bağlı. Kanıt: `Data Processing Agreement` Link alanı (`mimari/_veri/envanter.json`). Silme bu bağı koparır.

## Hedef tasarım
- Bu DocType hedefte yer almaz.
- `Data Processing Agreement` bağı `Admin Seller Profile` kaydına çevrilir.

## Geçiş adımları
1. `tenant_seller_validation.py` dosyasını kullanan yer olup olmadığını kontrol edin. Yoksa dosyayı kaldırın.
2. `Data Processing Agreement` Link alanını `Admin Seller Profile` kaydına çevirin. Bu iş 13-uyum-gizlilik ekibinin PR'ıdır.
3. Veriyi yedekleyen ve tabloyu kaldıran patch yazın. Bu adım 1 ve 2'den sonra gelir.

## Riskler ve testler
- Eski sözleşme kayıtları bağını kaybedebilir. Taşıma öncesi ve sonrası kayıt sayısı testi ekleyin.
