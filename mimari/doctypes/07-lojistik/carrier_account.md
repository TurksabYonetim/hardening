# Carrier Account

- Bağlam: 07-lojistik
- Tür: Ana kayıt
- Klasör: `tradehub_core/tradehub_core/doctype/carrier_account`
- Denetleyici: `tradehub_core/tradehub_core/doctype/carrier_account/carrier_account.py` (127 satır)
- Önerilen sahip bağlam: 07-lojistik

## Epic

- Epic adı: Carrier Account: 07-lojistik bağlamına taşıma
- Öncelik: Düşük
- Faz: Faz 3
- Tahmini büyüklük: Küçük

### User story

Bir satıcı olarak, kendi taşıyıcı hesabımı güvenle saklamak istiyorum.
Böylece gizli anahtarlarım başkasına görünmez.

### Kabul kriterleri

- [ ] Satıcı kimliği fonksiyonu ortak çekirdekte genel bir isimle duruyor.
- [ ] Denetleyici alt çizgili `_get_user_seller_profile` fonksiyonunu çağırmıyor.
- [ ] Bir satıcı aynı taşıyıcı için iki aktif hesap açamıyor. Bunu bir test gösteriyor.
- [ ] Gizli alanlar yetkisiz kullanıcıya maskeli görünüyor.
- [ ] Characterization test: `Carrier Account` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- Gizli değerleri kayıt defterine maskesiz yazmayın.
- Satıcılı kullanıcının platform hesabı açmasına izin vermeyin.
- Kiracı kancasını `hooks.py` içinden kaldırmayın.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] `test_logistics_permissions.py` geçiyor.
- [ ] Maskeleme testi geçiyor.
- [ ] Satıcı ekibinden `CODEOWNERS` incelemesi istendi.
- [ ] `import-linter` kontrolü geçiyor.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?

`Carrier Account` bir taşıyıcının API hesabını tutar. Hesap bir satıcıya ait olabilir. Satıcı alanı boşsa hesap platforma aittir. Kayıt API anahtarı ve gizli değerleri `Password` alanlarında saklar.

## Bugünkü bağımlılıklar

### Bu kaydın bağlandığı kayıtlar

- `Logistics Provider` (`carrier`, zorunlu): aynı bağlam
- `Admin Seller Profile` (`seller_profile`): başka bağlam (02-satici-magaza)

### Bu kayda dokunan kod

- `tradehub_core/api/v1/logistics_admin.py:159`: okuyor ve yazıyor. Platform yönetim ucu.
- `tradehub_core/api/v1/seller_shipping.py:211`: okuyor ve yazıyor. Satıcı kargo ayarları ucu.
- `tradehub_core/logistics/services/shipment_money.py:43`: okuyor. Hesabın sahibini ve adını okuyor.
- `tradehub_core/logistics/services/tracking_service.py:215`: okuyor. Takip sorgusu için hesabı yüklüyor.
- `tradehub_core/logistics/services/tracking_ingest.py:271`: okuyor. Gelen takip olayının hesabını doğruluyor.
- `tradehub_core/api/v1/logistics_webhook.py:232`: okuyor. Taşıyıcı bildiriminin imzasını doğruluyor.
- `tradehub_core/logistics/jobs/tracking_poll.py:270`: okuyor.
- `tradehub_core/logistics/services/pricing_rule_service.py:463`: okuyor.
- `tradehub_core/logistics/return_shipping.py:47`: okuyor.
- `tradehub_core/tradehub_core/doctype/carrier_account/carrier_account.py:121`: yazıyor. Diğer hesapların varsayılan bayrağını kapatıyor.

### hooks.py kayıtları

- `tradehub_core/hooks.py:1020`: `before_insert` ve `validate` kiracı kancaları.
- `tradehub_core/hooks.py:1150`: liste izni `carrier_account_query_conditions`.
- `tradehub_core/hooks.py:1274`: kayıt izni `carrier_account_has_permission`.

## Bağımlılık sorunları

1. Kiracı koruması ortak `utils/tenant.py` koduna bağlı. Kanıt: `tradehub_core/hooks.py:1020`. Bu kod 02-satici-magaza bağlamının satıcı kuralını uyguluyor. Satıcı kimliği kuralı değişirse hesap kayıtları etkilenir.
2. Denetleyici lojistiğin izin modülünün iç fonksiyonunu çağırıyor. Kanıt: `tradehub_core/tradehub_core/doctype/carrier_account/carrier_account.py:63`. Bu çağrı aynı bağlamda kalıyor. Yine de alt çizgili isim kırılgandır.

Başka bağlamı bozan önemli bir sorun bulunmadı.

## Hedef tasarım

- Sahip bağlam ve paket yolu: 07-lojistik, `tradehub_core/logistics/doctype/carrier_account/`.
- Dışarıya açılan fonksiyonlar: yok. Hesap yalnız lojistik içinde kullanılır.
- Yayınladığı olaylar: yok.
- Dinlediği olaylar: `seller.deactivated` olayı gelirse satıcı hesapları pasif yapılabilir. Bu bir öneridir.
- Başka bağlamlara bağlantılar: `seller_profile` Link alanı kalır. Satıcı kimliği ortak çekirdekten (`tradehub_core/shared/`) okunur.
- Denetleyicide kalacak doğrulamalar: tek aktif hesap kuralı, platform hesabı yetkisi, varsayılan bayrak.

## Geçiş adımları

1. `_get_user_seller_profile` fonksiyonunu ortak çekirdekte genel bir isimle açın. Denetleyici bu ismi kullansın.
2. DocType klasörünü "Logistics" modülüne taşıyın. Bu adım bağlamın toplu taşıma adımıyla birlikte yapılır.

## Riskler ve testler

- Gizli alanlar yanlış kişiye görünebilir. `onload` maskeleme testini koruyun.
- Bir satıcı iki aktif hesap açabilir. Tek aktif hesap testini ekleyin.
