# Sales Team Member

- Bağlam: 01-kimlik-erisim
- Tür: Alt tablo
- Klasör: `tradehub_core/tradehub_core/doctype/sales_team_member`
- Denetleyici: `tradehub_core/tradehub_core/doctype/sales_team_member/sales_team_member.py` (8 satır)
- Önerilen sahip bağlam: 01-kimlik-erisim

## Epic

- Epic adı: Sales Team Member: 01-kimlik-erisim bağlamına taşıma
- Öncelik: Düşük
- Faz: Faz 4
- Tahmini büyüklük: Küçük

### User story

Bir geliştirici olarak, ekip üyesini yalnız üst kayıt üzerinden okumak istiyorum.
Böylece alt tablo yapısı serbestçe değişebilir.

### Kabul kriterleri

- [ ] Bu tabloyu yalnız `identity` paketi okuyor.
- [ ] Üye bulunamayınca komisyon hata vermiyor. Test geçiyor.
- [ ] `Sales Team` epic'i ile aynı PR'da kapanıyor.
- [ ] Characterization test: `Sales Team Member` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- Alt tabloyu üst kayıt olmadan yazmayın.
- Başka bağlamdan bu tabloyu sorgulamayın.
- Tabloya ekip dışı bilgi eklemeyin.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] Değişen davranış için önce başarısız olan test yazıldı.
- [ ] Ruff ve ilgili testler yerelde geçiyor.
- [ ] `import-linter` kontrolü yeni ihlal üretmiyor.
- [ ] `CODEOWNERS` içindeki 01-kimlik-erisim sahibi inceleyici olarak eklendi.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?
Bu tablo satış ekibinin üyelerini tutar. Her satırda bir saha elemanı (`agent`) vardır.

## Bugünkü bağımlılıklar
### Bu kaydın bağlandığı kayıtlar
- `User` (`agent`): Frappe çekirdeği
### Bu kayda dokunan kod
- `tradehub_core/tradehub_core/doctype/sales_team/sales_team.py:26`: üst kayıt üyeleri doğruluyor
- `tradehub_core/api/v1/sales_team.py:62`: listeliyor
- `tradehub_core/tradehub_core/utils/field_commission.py:72`: alt tabloyu doğrudan sorguluyor
### hooks.py kayıtları
- Kayıt yok.

## Bağımlılık sorunları
1. Komisyon kodu alt tabloyu üst kayıt olmadan okuyor. Kanıt: `tradehub_core/tradehub_core/utils/field_commission.py:72`.

## Hedef tasarım
- Sahip bağlam: 01-kimlik-erisim. `Sales Team` ile aynı paket.
- Dışa açık fonksiyon gerekmez. Okuma `get_active_team_for_agent` üzerinden yapılır.
- Olay yoktur.

## Geçiş adımları
1. `Sales Team` raporundaki 1. ve 2. adımı uygulayın. Bu tablo aynı PR ile düzelir.

## Riskler ve testler
- Üye listesinin boş gelmesi komisyonu durdurur. Üye bulunamadı testi ekleyin.
