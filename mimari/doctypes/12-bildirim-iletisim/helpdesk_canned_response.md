# Helpdesk Canned Response

- Bağlam: 12-bildirim-iletisim
- Tür: Ana kayıt
- Klasör: `tradehub_core/tradehub_core/doctype/helpdesk_canned_response`
- Denetleyici: `tradehub_core/tradehub_core/doctype/helpdesk_canned_response/helpdesk_canned_response.py` (12 satır)
- Önerilen sahip bağlam: 12-bildirim-iletisim

## Epic

- Epic adı: Helpdesk Canned Response: 12-bildirim-iletisim bağlamına taşıma
- Öncelik: Önemli
- Faz: Faz 4
- Tahmini büyüklük: Orta

### User story

Bir platform yöneticisi olarak, ekibime ait hazır yanıtı seçmek istiyorum.
Böylece destek talebine hızlı yanıt veririm.

### Kabul kriterleri

- [ ] Başka ekibin özel hazır yanıtı listelenmez.
- [ ] `import-linter` denetimi, dış bağlamın `Helpdesk Canned Response` işleyicisini içe aktarmasını engeller.
- [ ] Geçiş testi, mevcut `Helpdesk Canned Response` kaydının sahip paket üzerinden okunabildiğini gösterir.
- [ ] Characterization test: `Helpdesk Canned Response` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- Ekip filtresini yalnız ekranda uygulamayın. Servis erişimi de kısıtlamalıdır.
- Yanıt üzerinden `HD Team` kaydını değiştirmeyin. Ekip ayrı uygulamaya aittir.
- `Helpdesk Canned Response` için dış bağlama doğrudan yazma yolu açmayın. Yazım kuralları `notifications` paketinde kalır.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] `Helpdesk Canned Response` için kabul koşullarını otomatik testte doğrulayın.
- [ ] `notifications` iç dosyalarına dış erişimleri `import-linter` ile kontrol edin.
- [ ] `CODEOWNERS` üzerinden `notifications` paketinin sahibinden inceleme isteyin.
- [ ] Mevcut bir `Helpdesk Canned Response` kaydını eski girişten ve sahip paketten okuyup karşılaştırın.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?
Destek ekibinin hazır yanıt metnini tutar. `tradehub_core/tradehub_core/doctype/helpdesk_canned_response/helpdesk_canned_response.json:84`
Denetleyici, kayıt yazılmadan önce kayıt kurallarını uygular. `tradehub_core/tradehub_core/doctype/helpdesk_canned_response/helpdesk_canned_response.py:8`

## Bugünkü bağımlılıklar
### Bu kaydın bağlandığı kayıtlar
- `HD Team` (`created_by_team`): başka bağlam (`harici Helpdesk`). `tradehub_core/tradehub_core/doctype/helpdesk_canned_response/helpdesk_canned_response.json:73`
### Bu kayda dokunan kod
- `tradehub_core/api/canned_response.py:40`: okuyor
### hooks.py kayıtları
- Doğrudan ada göre kanca bulunmadı. Dolaylı kayıtlar doğrulanmadı. `tradehub_core/hooks.py:453`

## Bağımlılık sorunları
Önemli bir bağımlılık sorunu bulunmadı.

## Hedef tasarım
- `12-bildirim-iletisim` bu kayda `tradehub_core/notifications/` paketinde sahip olsun.
- Dışarıya açılacak fonksiyonlar. `tradehub_core/notifications/api.py` içinde bu kayıt için ayrı fonksiyon önerilmiyor.
- Olaylar. Bu kayıt için ayrıca bağlamlar arası olay önerilmiyor.
- Bağlantılar. `created_by_team` sabit `HD Team` kimliğine bağlansın.
- Doğrulama ve iş akışı. Yanıt doğrulaması kalsın. Listeleme ve ekip kapsamı destek servisinde toplansın.

## Geçiş adımları
1. Mevcut davranış için aşağıdaki testi ekle. Sahip paket için mevcut davranışı sabitle.
2. İlk adımdan sonra rapordaki doğrulamayı ve iş akışını sahip pakette topla.
3. İkinci adımdan sonra modül kaydını taşı. Eski Python girişlerini geçiş süresince yönlendir.

## Riskler ve testler
- Başka ekibin özel hazır yanıtı listelenmez.
