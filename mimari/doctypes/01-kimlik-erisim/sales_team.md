# Sales Team

- Bağlam: 01-kimlik-erisim
- Tür: Ana kayıt
- Klasör: `tradehub_core/tradehub_core/doctype/sales_team`
- Denetleyici: `tradehub_core/tradehub_core/doctype/sales_team/sales_team.py` (41 satır)
- Önerilen sahip bağlam: 01-kimlik-erisim. Saha komisyonu bu ekibi okuyor. Komisyon kodu ileride kendi bağlamına geçerse ekip burada kalır.

## Epic

- Epic adı: Sales Team: 01-kimlik-erisim bağlamına taşıma
- Öncelik: Önemli
- Faz: Faz 4
- Tahmini büyüklük: Küçük

### User story

Bir geliştirici olarak, saha ekibini tek fonksiyonla okumak istiyorum.
Böylece komisyon hesabı ekip yapısı değişince bozulmaz.

### Kabul kriterleri

- [ ] `get_active_team_for_agent(agent)` fonksiyonu var. `field_commission.py` bu fonksiyonu kullanıyor.
- [ ] `field_commission.py` içinde `Sales Team` ve `Sales Team Member` adları geçmiyor.
- [ ] Üye iki aktif ekipte olamıyor. Test geçiyor.
- [ ] Characterization test: `Sales Team` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- Komisyon kodundan ekip tablolarını doğrudan sorgulamayın.
- Ekip adını, komisyon kayıtları kontrol edilmeden değiştirmeyin.
- Tek aktif ekip kuralını denetleyiciden kaldırmayın.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] Değişen davranış için önce başarısız olan test yazıldı.
- [ ] Ruff ve ilgili testler yerelde geçiyor.
- [ ] `import-linter` kontrolü yeni ihlal üretmiyor.
- [ ] `CODEOWNERS` içindeki 01-kimlik-erisim sahibi inceleyici olarak eklendi.
- [ ] `tradehub_core/tests/test_sales_team_api.py` geçiyor.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?
Bu kayıt platformun saha satış ekibidir. Ekibin bir lideri ve üyeleri vardır. Bir üye aynı anda yalnız bir aktif ekipte olabilir.

## Bugünkü bağımlılıklar
### Bu kaydın bağlandığı kayıtlar
- `User` (`leader`): Frappe çekirdeği
- `Sales Team Member` (`members`): aynı bağlam, alt tablo
### Bu kayda dokunan kod
- `tradehub_core/tradehub_core/doctype/sales_team/sales_team.py:14`: üyenin başka aktif ekipte olmadığını kontrol ediyor
- `tradehub_core/api/v1/sales_team.py:55`: listeliyor
- `tradehub_core/api/v1/sales_team.py:197`: adı `rename_doc` ile değiştiriyor
- `tradehub_core/api/v1/sales_team.py:199`: kaydı güncelliyor
- `tradehub_core/tradehub_core/utils/field_commission.py:76`: komisyon için aktif ekibi okuyor
### hooks.py kayıtları
- Kayıt yok.
- Dolaylı: `tradehub_core/hooks.py:837` `CRM Deal.on_update` olayı `field_commission.generate_on_deal_won` çağırıyor. Bu işleyici ekibi okuyor.

## Bağımlılık sorunları
1. Komisyon kodu ekip tablosunu doğrudan okuyor. Kanıt: `tradehub_core/tradehub_core/utils/field_commission.py:72-80`. Ekip yapısı değişirse komisyon yanlış hesaplanır.
2. API dosyası adı yeniden adlandırıyor. Kanıt: `api/v1/sales_team.py:197`. Komisyon kayıtları eski adı tutuyorsa bağ kopar (doğrulanmadı).

## Hedef tasarım
- Sahip bağlam: 01-kimlik-erisim. Paket yolu: `tradehub_core/identity/sales_team/`.
- Dışa açık fonksiyon: `get_active_team_for_agent(agent) -> TeamRef | None` (alan: `name`, `leader`).
- Olay yayınlamaz. İleride `identity.sales_team.changed` eklenebilir.
- Denetleyicide tek aktif ekip kuralı kalır.

## Geçiş adımları
1. `get_active_team_for_agent` fonksiyonunu ekleyin. Kodu `field_commission.py:64-80` bölümünden taşıyın.
2. Komisyon kodunu bu fonksiyona bağlayın.
3. Yeniden adlandırma sonrası komisyon kayıtlarını kontrol edin. Gerekirse adı değiştirmeyi yasaklayın.

## Riskler ve testler
- Üye iki ekipte görünürse komisyon iki kez yazılabilir. `tradehub_core/tests/test_sales_team_api.py` ve `test_sales_team.py` korunmalı.
