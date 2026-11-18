# Seller Certification

- Bağlam: 02-satici-magaza
- Tür: Alt tablo
- Klasör: `tradehub_core/tradehub_core/doctype/seller_certification`
- Denetleyici: `tradehub_core/tradehub_core/doctype/seller_certification/seller_certification.py` (34 satır)
- Önerilen sahip bağlam: 02-satici-magaza

## Epic

- Epic adı: Seller Certification: 02-satici-magaza bağlamına taşıma
- Öncelik: Önemli
- Faz: Faz 4
- Tahmini büyüklük: Küçük

### User story

Bir satıcı olarak, sertifikamın süresi dolunca ürün sayfasından kalkmasını istiyorum.
Böylece alıcıya yanlış bilgi gösterilmez.

### Kabul kriterleri

- [ ] Sertifika işleri `tradehub_core/seller/certifications/service.py` içinde duruyor.
- [ ] Satırlar üst mağaza kaydı üzerinden değişiyor.
- [ ] Süresi dolan sertifika ürün sayfasında görünmüyor. Test geçiyor.
- [ ] Characterization test: `Seller Certification` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- Sertifika satırını üst kayıt olmadan değiştirmeyin.
- Ürün kodundan sertifika tablosuna yazmayın.
- Tarih kontrolünü denetleyiciden kaldırmayın.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] Değişen davranış için önce başarısız olan test yazıldı.
- [ ] Ruff ve ilgili testler yerelde geçiyor.
- [ ] `import-linter` kontrolü yeni ihlal üretmiyor.
- [ ] `CODEOWNERS` içindeki 02-satici-magaza sahibi inceleyici olarak eklendi.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?
Bu tablo mağazanın sertifikalarını tutar. Her satırda tür, numara, tarih ve belge vardır. Doğrulama durumu da satırdadır. Üst kayıt `Admin Seller Profile` kaydıdır.

## Bugünkü bağımlılıklar
### Bu kaydın bağlandığı kayıtlar
- `Certification Type` (`certification_type`): başka bağlam (03a-katalog)
### Bu kayda dokunan kod
- `tradehub_core/tradehub_core/doctype/seller_certification/seller_certification.py:16`: sertifika türünü okuyor
- `tradehub_core/api/seller_certifications.py:639`: satırın üst kaydını okuyor (16 yer)
- `tradehub_core/utils/cert_validate.py`: mağaza kaydında doğruluyor
- `tradehub_core/utils/cert_expiry_check.py`: süresi dolanı `Rejected` yapıyor
- `tradehub_core/api/listing.py`: ürün sayfasında gösteriyor (3 yer)
- `tradehub_core/media/file_isolation.py`, `tradehub_core/media/presets.py`: belge dosyasını tanıyor
### hooks.py kayıtları
- `tradehub_core/hooks.py:1220`: `has_permission`
- `tradehub_core/hooks.py:786`: `Admin Seller Profile.validate` olayı `cert_validate.validate_seller_certifications` çağırıyor
- `tradehub_core/hooks.py:264`: günlük `cert_expiry_check.check_certificate_expiry` işi (saatlik listede)

## Bağımlılık sorunları
1. Alt tablo API içinde tek tek düzenleniyor. Kanıt: `api/seller_certifications.py:639`. Üst kayıt kaydedilmeden satır değişirse mağaza kancaları çalışmaz (doğrulanmadı: satırın nasıl kaydedildiği).
2. `Certification Type` katalog bağlamında. Satıcı sertifikası ürün sertifikasıyla aynı türü paylaşıyor. Ortak kavram olabilir.

## Hedef tasarım
- Sahip bağlam: 02-satici-magaza. Paket yolu: `tradehub_core/seller/certifications/`.
- Dışa açık fonksiyonlar: `list_store_certifications(store)`, `add_certification(store, data)`, `verify_certification(store, row, decision)`.
- Yayınladığı olay: `seller.certification.expired` (alan: `store`, `certification_type`).
- `certification_type` Link alanı kalır.
- Denetleyicide tarih ve tür kontrolü kalır.

## Geçiş adımları
1. API kodunu `seller/certifications/service.py` dosyasına taşıyın. Satırları üst kayıt üzerinden değiştirin.
2. Süre dolma işini aynı pakete taşıyın. `hooks.py:264` yolunu güncelleyin.

## Riskler ve testler
- Süresi dolan sertifika ürün sayfasında görünmemeli. Süre dolma testi ekleyin.
