# Role Delegation

- Bağlam: 01-kimlik-erisim
- Tür: Ana kayıt (iş akışı)
- Klasör: `tradehub_core/tradehub_core/doctype/role_delegation`
- Denetleyici: `tradehub_core/tradehub_core/doctype/role_delegation/role_delegation.py` (29 satır)
- Önerilen sahip bağlam: 01-kimlik-erisim

## Epic

- Epic adı: Role Delegation: 01-kimlik-erisim bağlamına taşıma
- Öncelik: Düşük
- Faz: Faz 4
- Tahmini büyüklük: Küçük

### User story

Bir satıcı olarak, geçici verdiğim rolün süresi dolunca kendiliğinden kalkmasını istiyorum.
Böylece unutulan yetki kalmaz.

### Kabul kriterleri

- [ ] `delegation_service.py` kodu `tradehub_core/identity/delegation/` altında duruyor.
- [ ] `hooks.py:262` zamanlanmış işi yeni yolu kullanıyor.
- [ ] Süre dolunca rolün kalktığı test geçiyor.
- [ ] Characterization test: `Role Delegation` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- Rolü `Has Role` satırına elle yazan yeni kod eklemeyin. Servis fonksiyonunu kullanın.
- Kendine rol devrini serbest bırakmayın.
- Zamanlanmış işin adını yönlendirme olmadan değiştirmeyin.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] Değişen davranış için önce başarısız olan test yazıldı.
- [ ] Ruff ve ilgili testler yerelde geçiyor.
- [ ] `import-linter` kontrolü yeni ihlal üretmiyor.
- [ ] `CODEOWNERS` içindeki 01-kimlik-erisim sahibi inceleyici olarak eklendi.
- [ ] `tradehub_core/tests/test_delegation.py` geçiyor.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?
Bu kayıt bir rolün geçici olarak başka kullanıcıya verilmesidir. Kayıt başlangıç ve bitiş zamanı tutar. Süre dolunca rol otomatik geri alınır.

## Bugünkü bağımlılıklar
### Bu kaydın bağlandığı kayıtlar
- `User` (`delegator`, `delegate`, `approved_by`): Frappe çekirdeği
- `Role` (`role`): Frappe çekirdeği
- `Admin Seller Profile` (`tenant`): başka bağlam (02-satici-magaza)
### Bu kayda dokunan kod
- `tradehub_core/services/delegation_service.py:125`: oluşturuyor
- `tradehub_core/services/delegation_service.py:143`, `:173`, `:212`: güncelliyor
- `tradehub_core/services/delegation_service.py:236`, `:253`: kullanıcıya rol ekleyip çıkarıyor
- `tradehub_core/api/v1/delegation.py:33`, `:36`: listeliyor, `:89` açıyor
### hooks.py kayıtları
- `tradehub_core/hooks.py:1132`: `permission_query_conditions`
- `tradehub_core/hooks.py:1255`: `has_permission`
- `tradehub_core/hooks.py:262`: saatlik `delegation_service.expire_overdue_delegations` işi

## Bağımlılık sorunları
1. Önemli bir bağımlılık sorunu bulunmadı. İş kuralı tek serviste duruyor.
2. Servis `services/` klasöründe genel kodla karışık. Sahip ekip dosya yolundan anlaşılmıyor.

## Hedef tasarım
- Sahip bağlam: 01-kimlik-erisim. Paket yolu: `tradehub_core/identity/delegation/`.
- Dışa açık fonksiyonlar: `create_delegation`, `activate_delegation`, `revoke_delegation`.
- Yayınladığı olaylar: `identity.role.delegated`, `identity.role.delegation_ended`.
- `tenant` Link alanı kalır.
- Denetleyicide tarih sırası ve kendine devir yasağı kalır.

## Geçiş adımları
1. `services/delegation_service.py` dosyasını `tradehub_core/identity/delegation/` altına taşıyın. Eski yolda yönlendirme bırakın.
2. `hooks.py:262` satırını yeni yola çevirin.
3. Olay yayınını ekleyin. Bu adım olay altyapısından sonra gelir.

## Riskler ve testler
- Süre dolunca rol kalırsa güvenlik açığı oluşur. `tradehub_core/tests/test_delegation.py` süre testi korunmalı.
