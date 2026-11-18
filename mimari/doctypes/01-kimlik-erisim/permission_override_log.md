# Permission Override Log

- Bağlam: 01-kimlik-erisim
- Tür: Kayıt defteri (log)
- Klasör: `tradehub_core/tradehub_core/doctype/permission_override_log`
- Denetleyici: `tradehub_core/tradehub_core/doctype/permission_override_log/permission_override_log.py` (32 satır)
- Önerilen sahip bağlam: 01-kimlik-erisim

## Epic

- Epic adı: Permission Override Log: 01-kimlik-erisim bağlamına taşıma
- Öncelik: Düşük
- Faz: Faz 4
- Tahmini büyüklük: Küçük

### User story

Bir geliştirici olarak, yetki müdahale kaydını kimlik paketinden yazmak istiyorum.
Böylece sahibi belli olur.

### Kabul kriterleri

- [ ] Yazma fonksiyonu `tradehub_core/identity/audit/` altında duruyor. Eski yolda yönlendirme var.
- [ ] Gerekçesiz kayıt reddediliyor. Test geçiyor.
- [ ] Kayıt silinemiyor. Test geçiyor.
- [ ] Characterization test: `Permission Override Log` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- Bu kaydı silmeyin ya da değiştirmeyin.
- Gerekçe zorunluluğunu kaldırmayın.
- Kaydı `audit/log.py` dışındaki yeni bir yerden yazmayın.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] Değişen davranış için önce başarısız olan test yazıldı.
- [ ] Ruff ve ilgili testler yerelde geçiyor.
- [ ] `import-linter` kontrolü yeni ihlal üretmiyor.
- [ ] `CODEOWNERS` içindeki 01-kimlik-erisim sahibi inceleyici olarak eklendi.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?
Bu kayıt yöneticinin yetki kararını elle değiştirdiği anı tutar. Gerekçe alanı zorunludur. Kayıt silinemez.

## Bugünkü bağımlılıklar
### Bu kaydın bağlandığı kayıtlar
- `User` (`admin_user`, `approved_by`): Frappe çekirdeği
### Bu kayda dokunan kod
- `tradehub_core/audit/log.py:314`: tek yazma noktası
- `tradehub_core/audit/tasks.py:68`, `:95`: sayıyor
- `tradehub_core/api/v1/permission_console.py:119`, `:1621`: okuyor
### hooks.py kayıtları
- `tradehub_core/hooks.py:1137`: `permission_query_conditions`
- `tradehub_core/hooks.py:1260`: `has_permission`

## Bağımlılık sorunları
1. Önemli bir bağımlılık sorunu bulunmadı. Yazma tek noktadan yapılıyor (`audit/log.py:314`).

## Hedef tasarım
- Sahip bağlam: 01-kimlik-erisim. Paket yolu: `tradehub_core/identity/audit/`.
- Dışa açık fonksiyon: `log_permission_override(target, action, justification, ...)`.
- Olay yayınlamaz ve dinlemez.
- Denetleyicide gerekçe zorunluluğu ve silme yasağı kalır.

## Geçiş adımları
1. `audit/log.py` içindeki yazma fonksiyonunu kimlik paketine taşıyın. Eski yolda yönlendirme bırakın.
2. JSON `module` alanını kimlik modülüne çevirin.

## Riskler ve testler
- Gerekçesiz kayıt reddedilmeli. `tradehub_core/tests/test_audit.py` bunu korumalı.
