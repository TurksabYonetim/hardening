# Buyer Profile

- Bağlam: 01-kimlik-erisim
- Tür: Ana kayıt (kullanımdan kalktı)
- Klasör: `tradehub_core/tradehub_core/doctype/buyer_profile`
- Denetleyici: `tradehub_core/tradehub_core/doctype/buyer_profile/buyer_profile.py` (14 satır)
- Önerilen sahip bağlam: 01-kimlik-erisim (silinene kadar)

## Epic

- Epic adı: Buyer Profile: 01-kimlik-erisim bağlamına taşıma
- Öncelik: Düşük
- Faz: Faz 4
- Tahmini büyüklük: Küçük

### User story

Bir geliştirici olarak, kullanımdan kalkan alıcı profilini kaldırmak istiyorum.
Böylece kimse yanlış tabloya veri yazmaz.

### Kabul kriterleri

- [ ] `seed_demo_data.py` içinde `Buyer Profile` yazımı yok.
- [ ] `utils/tenant.py` listesinde `Buyer Profile` adı yok.
- [ ] Tabloyu kaldıran patch veriyi önce yedekliyor.
- [ ] `16_validate_migration.py` doğrulaması temiz geçiyor.
- [ ] Characterization test: `Buyer Profile` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- Bu DocType'a yeni alan ya da kanca eklemeyin. Veri `User Profile` kaydında yaşar.
- Demo veriyi bu tabloya yazmayın.
- Yedek almadan tabloyu silmeyin.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] Değişen davranış için önce başarısız olan test yazıldı.
- [ ] Ruff ve ilgili testler yerelde geçiyor.
- [ ] `import-linter` kontrolü yeni ihlal üretmiyor.
- [ ] `CODEOWNERS` içindeki 01-kimlik-erisim sahibi inceleyici olarak eklendi.
- [ ] Tüm kodda `tabBuyer Profile` araması yapıldı.
- [ ] Patch iki kez çalışınca hata vermiyor.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?
Bu kayıt eski alıcı profilidir. Veri `User Profile` kaydına taşındı. Denetleyici boştur. Kodun açıklamasına göre DocType gizli ve salt okunurdur. Açıklama DocType'ın ileride silineceğini söylüyor (`buyer_profile.py:1-8`).

## Bugünkü bağımlılıklar
### Bu kaydın bağlandığı kayıtlar
- `User` (`user`): Frappe çekirdeği
- `Country` (`country`): Frappe çekirdeği
### Bu kayda dokunan kod
- `tradehub_core/utils/tenant.py:66`: kiracı filtresinden muaf listesinde adı geçiyor
- Göç patch'leri okuyor: `tradehub_core/patches/user_profile_v1/05_migrate_buyer_profile.py`, `tradehub_core/patches/user_profile_v1/17_deprecate_old_doctypes.py:8`
- Demo veri `tradehub_core/seed_demo_data.py` bu kaydı hâlâ kullanıyor (7 yer)
### hooks.py kayıtları
- Kayıt yok.

## Bağımlılık sorunları
1. Demo veri betiği kalkan kaydı hâlâ üretiyor. Kanıt: `tradehub_core/seed_demo_data.py` (7 eşleşme). Geliştiriciler yanlış tabloya veri yazabilir.
2. Silme tarihi belirsiz. Kanıt: `buyer_profile.py:6` "Sprint 4'te drop edilir" diyor. Tarih geçti mi doğrulanmadı.

## Hedef tasarım
- Bu DocType hedefte yer almaz. Veri `User Profile` kaydında yaşar.
- Dışa açık fonksiyon gerekmez.
- Olay yoktur.

## Geçiş adımları
1. `seed_demo_data.py` içindeki `Buyer Profile` yazımlarını `User Profile` yazımına çevirin.
2. `utils/tenant.py:66` satırından adı kaldırın.
3. Veriyi yedekleyen ve tabloyu kaldıran bir patch yazın. Bu adım 1 ve 2 bittikten sonra gelir.

## Riskler ve testler
- Eski raporlar bu tabloyu okuyorsa bozulur. Silmeden önce `tabBuyer Profile` için tüm kodda arama yapın.
- `tradehub_core/patches/user_profile_v1/16_validate_migration.py` doğrulaması silmeden önce temiz geçmeli.
