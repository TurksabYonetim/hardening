# Helpdesk Ticket Tag Link

- Bağlam: 12-bildirim-iletisim
- Tür: Ana kayıt
- Klasör: `tradehub_core/tradehub_core/doctype/helpdesk_ticket_tag_link`
- Denetleyici: `tradehub_core/tradehub_core/doctype/helpdesk_ticket_tag_link/helpdesk_ticket_tag_link.py` (13 satır)
- Önerilen sahip bağlam: 12-bildirim-iletisim

## Epic

- Epic adı: Helpdesk Ticket Tag Link: 12-bildirim-iletisim bağlamına taşıma
- Öncelik: Önemli
- Faz: Faz 4
- Tahmini büyüklük: Orta

### User story

Bir platform yöneticisi olarak, yetkili olduğum bileti etiketlemek istiyorum.
Böylece destek biletlerini düzenli tutarım.

### Kabul kriterleri

- [ ] Yetkisiz kullanıcı başka ekibin biletine etiket ekleyemez.
- [ ] Sözleşme testi `notifications/api.py::set_ticket_tags` çağrısının mevcut davranışı koruduğunu gösterir.
- [ ] Geçiş testi, mevcut `Helpdesk Ticket Tag Link` kaydının sahip paket üzerinden okunabildiğini gösterir.
- [ ] Characterization test: `Helpdesk Ticket Tag Link` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- Bilet yazma iznini denetlemeden etiket eklemeyin. Bağlantı bilet kapsamını değiştirir.
- Eşlemeyi harici bilet tablosuna yazmayın. Eşlemeyi destek servisi yönetir.
- Dış bağlamdan `notifications` iç dosyalarını çağırmayın. Geçişte `set_ticket_tags` sözleşmesini kullanın.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] `Helpdesk Ticket Tag Link` için kabul koşullarını otomatik testte doğrulayın.
- [ ] `notifications` iç dosyalarına dış erişimleri `import-linter` ile kontrol edin.
- [ ] `CODEOWNERS` üzerinden `notifications` paketinin sahibinden inceleme isteyin.
- [ ] Mevcut bir `Helpdesk Ticket Tag Link` kaydını eski girişten ve sahip paketten okuyup karşılaştırın.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?
Destek bileti ile etiketi eşler. `tradehub_core/tradehub_core/doctype/helpdesk_ticket_tag_link/helpdesk_ticket_tag_link.json:39`
Denetleyici, kayıt yazılmadan önce kayıt kurallarını uygular. `tradehub_core/tradehub_core/doctype/helpdesk_ticket_tag_link/helpdesk_ticket_tag_link.py:8`

## Bugünkü bağımlılıklar
### Bu kaydın bağlandığı kayıtlar
- `HD Ticket` (`ticket`): başka bağlam (`harici Helpdesk`). `tradehub_core/tradehub_core/doctype/helpdesk_ticket_tag_link/helpdesk_ticket_tag_link.json:10`
- `Helpdesk Ticket Tag` (`tag`): aynı bağlam. `tradehub_core/tradehub_core/doctype/helpdesk_ticket_tag_link/helpdesk_ticket_tag_link.json:19`
- `User` (`tagged_by`): başka bağlam (`01-kimlik-erisim`). `tradehub_core/tradehub_core/doctype/helpdesk_ticket_tag_link/helpdesk_ticket_tag_link.json:28`
### Bu kayda dokunan kod
- `tradehub_core/api/ticket_tag.py:86`: yazıyor
### hooks.py kayıtları
- Doğrudan ada göre kanca bulunmadı. Dolaylı kayıtlar doğrulanmadı. `tradehub_core/hooks.py:453`

## Bağımlılık sorunları
Önemli bir bağımlılık sorunu bulunmadı.

## Hedef tasarım
- `12-bildirim-iletisim` bu kayda `tradehub_core/notifications/` paketinde sahip olsun.
- Dışarıya açılacak fonksiyonlar. `tradehub_core/notifications/api.py::set_ticket_tags`
- Olaylar. Bu kayıt için ayrıca bağlamlar arası olay önerilmiyor.
- Bağlantılar. `ticket` sabit `HD Ticket` kimliğine bağlansın. `tagged_by` sabit `User` kimliğine bağlansın.
- Doğrulama ve iş akışı. Bilet ve etiket eşlemesini destek servisi yazsın. Bilet yetkisini önce doğrulasın.

## Geçiş adımları
1. Mevcut davranış için aşağıdaki testi ekle. `set_ticket_tags` sözleşmesini mevcut uygulama üzerinden geçir.
2. İlk adımdan sonra rapordaki doğrulamayı ve iş akışını sahip pakette topla.
3. İkinci adımdan sonra modül kaydını taşı. Eski Python girişlerini geçiş süresince yönlendir.

## Riskler ve testler
- Yetkisiz kullanıcı başka ekibin biletine etiket ekleyemez.
