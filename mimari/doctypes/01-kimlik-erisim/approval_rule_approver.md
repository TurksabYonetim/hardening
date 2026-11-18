# Approval Rule Approver

- Bağlam: 01-kimlik-erisim
- Tür: Alt tablo
- Klasör: `tradehub_core/tradehub_core/doctype/approval_rule_approver`
- Denetleyici: `tradehub_core/tradehub_core/doctype/approval_rule_approver/approval_rule_approver.py` (8 satır)
- Önerilen sahip bağlam: 04-siparis. Üst kaydı `Approval Rule` sipariş onayına aittir.

## Epic

- Epic adı: Approval Rule Approver: 04-siparis bağlamına taşıma
- Öncelik: Düşük
- Faz: Faz 3
- Tahmini büyüklük: Küçük

### User story

Bir geliştirici olarak, onaylayıcının kurallarını tek fonksiyonla bulmak istiyorum.
Böylece izin kontrolü atlanmaz.

### Kabul kriterleri

- [ ] `list_rules_for_approver(user)` fonksiyonu var.
- [ ] `api/v1/order_approval.py` içinde `Approval Rule Approver` için `get_all` yok.
- [ ] Onaylayıcıya göre liste testi geçiyor.
- [ ] Characterization test: `Approval Rule Approver` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- Alt tabloyu üst kayıt olmadan yazmayın. Satırlar `Approval Rule` ile kaydedilir.
- Kullanıcı verisi için `get_all` kullanmayın. Proje kuralı `get_list` ister.
- Bu tabloyu `Approval Rule` dışında bir kayda bağlamayın.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] Değişen davranış için önce başarısız olan test yazıldı.
- [ ] Ruff ve ilgili testler yerelde geçiyor.
- [ ] `import-linter` kontrolü yeni ihlal üretmiyor.
- [ ] `CODEOWNERS` içindeki 04-siparis sahibi inceleyici olarak eklendi.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?
Bu tablo onay kuralının onaylayıcılarını tutar. Her satırda bir kullanıcı ve onay seviyesi vardır. `sequence` alanı aynı seviyedeki sırayı verir.

## Bugünkü bağımlılıklar
### Bu kaydın bağlandığı kayıtlar
- `User` (`approver`): Frappe çekirdeği
### Bu kayda dokunan kod
- `tradehub_core/api/v1/order_approval.py:181`: kullanıcının onaylayıcı olduğu kuralları `get_all` ile okuyor
- `tradehub_core/tradehub_core/doctype/approval_rule/approval_rule.py:81`: satırları doğruluyor
### hooks.py kayıtları
- Kayıt yok.

## Bağımlılık sorunları
1. Alt tablo üst kayıt olmadan doğrudan sorgulanıyor. Kanıt: `tradehub_core/api/v1/order_approval.py:181`. `get_all` izin kontrolü yapmaz. Proje kuralı kullanıcı verisinde `get_list` ister.

## Hedef tasarım
- Sahip bağlam: 04-siparis. Paket yolu: `tradehub_core/ordering/approval/`.
- Dışa açık fonksiyon: `list_rules_for_approver(user) -> list[str]`.
- Olay yayınlamaz ve dinlemez.
- `approver` Link alanı `User` kök kaydına bağlı kalır.
- Doğrulama üst kaydın denetleyicisinde kalır.

## Geçiş adımları
1. `list_rules_for_approver` fonksiyonunu ekleyin. `order_approval.py:181` satırını bu fonksiyona bağlayın.
2. JSON `module` alanını `Approval Rule` ile aynı PR içinde taşıyın.

## Riskler ve testler
- Onaylayıcı listesi eksik gelirse onay bekleyen siparişler görünmez. Onaylayıcıya göre liste testi ekleyin.
