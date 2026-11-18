# Region

- Bağlam: 07-lojistik
- Tür: Ana kayıt
- Klasör: `tradehub_core/tradehub_core/doctype/region`
- Denetleyici: `tradehub_core/tradehub_core/doctype/region/region.py` (82 satır)
- Önerilen sahip bağlam: 13-uyum-gizlilik. Kayıt hukuk bölgesini, veri yerleşimini ve kişisel veri maskeleme kuralını tutar. Kargo ile ilgisi yoktur.

## Epic

- Epic adı: Region: 13-uyum-gizlilik bağlamına taşıma
- Öncelik: Önemli
- Faz: Faz 4
- Tahmini büyüklük: Orta

### User story

Bir platform yöneticisi olarak, hukuk bölgesi kurallarının gizlilik bağlamında durmasını istiyorum.
Böylece yetki ve veri maskeleme kararları tek yerden yönetilir.

### Kabul kriterleri

- [ ] Uyum bağlamında `get_jurisdiction` ve `get_pii_policy` fonksiyonları var.
- [ ] `utils/pii.py` ve `services/abac_context.py` bu fonksiyonları kullanıyor.
- [ ] Kurulumdan sonra varsayılan bölgeler yükleniyor. Bunu bir test gösteriyor.
- [ ] ABAC bölge testi taşımadan önce ve sonra aynı sonucu veriyor.
- [ ] Characterization test: `Region` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- `fixtures` kaydını `hooks.py` içinden kaldırmayın. Varsayılan bölgeler kaybolur.
- Bölge kodunu değiştirmeyin. `Buyer Profile.region` bağları kırılır.
- Kayda lojistik alanı eklemeyin. Kayıt kargo ile ilgili değildir.
- Bağlam haritasını bu epic içinde değiştirmeyin.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] ABAC bölge testi geçiyor.
- [ ] Kurulum sonrası bölge sayısı testi eklendi.
- [ ] Kimlik ve uyum ekiplerinden `CODEOWNERS` incelemesi istendi.
- [ ] `import-linter` kontrolü geçiyor.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?

`Region` bir hukuk ve veri bölgesini tutar. Örneğin bir bölge KVKK ya da GDPR kurallarına bağlıdır. Kayıtta ülke listesi, varsayılan para birimi ve kişisel veri maskeleme kuralı vardır.

## Bugünkü bağımlılıklar

### Bu kaydın bağlandığı kayıtlar

- `Currency` (`default_currency`): çekirdek Frappe kaydı

### Bu kayda dokunan kod

- `tradehub_core/utils/pii.py:283`: okuyor. Bölgenin hukuk türünü okuyor.
- `tradehub_core/services/abac_context.py:223`: okuyor. Yetki kararı için bölgeyi okuyor (01-kimlik-erisim).
- `tradehub_core/patches/v15_1_2_add_entitlement_custom_fields.py:62`: `Buyer Profile.region` özel alanını bu kayda bağlıyor.
- `tradehub_core/patches/v15_1_2_add_entitlement_custom_fields.py:150`: kuruluş kaydına `tradehub_region` özel alanını bağlıyor.
- `tradehub_core/setup/handover_validator.py:91`: kurulum denetimi kaydı zorunlu sayıyor.
- `tradehub_core/setup/seed_test_data.py:108`: test verisi yazıyor.

### hooks.py kayıtları

- `tradehub_core/hooks.py:126`: kayıt `fixtures` listesinde. Varsayılan kayıtlar uygulamayla birlikte gelir.

## Bağımlılık sorunları

1. Kayıt yanlış bağlamda sayılmış. Bütün kullanıcılar gizlilik ve yetki kodudur (`tradehub_core/utils/pii.py:283`, `tradehub_core/services/abac_context.py:223`). Lojistik kodunda kullanıcı yok.
2. Bölge kaydı yetki kararına giriyor. Kanıt: `tradehub_core/services/abac_context.py:223`. Bu kayıt değişirse yetki kararları değişir (01-kimlik-erisim).

## Hedef tasarım

- Sahip bağlam ve paket yolu: 13-uyum-gizlilik, örneğin `tradehub_core/compliance/doctype/region/`.
- Dışarıya açılan fonksiyonlar (`tradehub_core/compliance/api.py`): `get_jurisdiction(region: str) -> str | None` ve `get_pii_policy(region: str) -> dict`.
- Yayınladığı olaylar: `region.policy_changed`. Yetki önbelleği bu olayı dinleyebilir.
- Dinlediği olaylar: yok.
- Başka bağlamlara bağlantılar: `Buyer Profile.region` ve kuruluş kaydındaki Link alanları kalır. `Region` kararlı bir ana kayıttır.
- Denetleyicide kalacak doğrulamalar: bölge kodu biçimi, ülke listesi, maskeleme kuralı biçimi.

## Geçiş adımları

1. Bağlam haritasında kaydı 13-uyum-gizlilik altına almayı önerin. Haritayı bu analizde değiştirmeyin.
2. `utils/pii.py` ve `services/abac_context.py` okumalarını `get_jurisdiction` fonksiyonuna çevirin.
3. DocType klasörünü uyum modülüne taşıyın. `fixtures` kaydı aynı kalır.

## Riskler ve testler

- `fixtures` taşınırken varsayılan bölgeler kaybolabilir. Kurulum sonrası bölge sayısı testini ekleyin.
- Yetki kararı değişebilir. ABAC bölge testini taşımadan önce ve sonra çalıştırın.
