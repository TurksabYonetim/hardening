# Chat Reservation

- Bağlam: 12-bildirim-iletisim
- Tür: Ana kayıt
- Klasör: `tradehub_core/tradehub_core/doctype/chat_reservation`
- Denetleyici: `tradehub_core/tradehub_core/doctype/chat_reservation/chat_reservation.py` (11 satır)
- Önerilen sahip bağlam: 12-bildirim-iletisim

## Epic

- Epic adı: Chat Reservation: 12-bildirim-iletisim bağlamına taşıma
- Öncelik: Acil
- Faz: Faz 4
- Tahmini büyüklük: Orta

### User story

Bir alıcı olarak, uygun bir sohbet saati ayırmak istiyorum.
Böylece seçtiğim saat başka alıcıya verilmez.

### Kabul kriterleri

- [ ] Aynı saat dilimini iki alıcı aynı anda ayıramaz.
- [ ] Sözleşme testi `notifications/api.py::reserve_chat_slot` çağrısının mevcut davranışı koruduğunu gösterir.
- [ ] İptal edilen rezervasyon etkin rezervasyon sorgusundan çıkar.
- [ ] Characterization test: `Chat Reservation` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- Zaman dilimi kilidini atlamayın. Aynı saat iki kez ayrılabilir.
- Sohbet paketini mağaza tablosundan sorgulamayın. Bu bilgiyi mağaza API’si verir.
- Dış bağlamdan `notifications` iç dosyalarını çağırmayın. Geçişte `reserve_chat_slot` sözleşmesini kullanın.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] `Chat Reservation` için kabul koşullarını otomatik testte doğrulayın.
- [ ] `notifications` iç dosyalarına dış erişimleri `import-linter` ile kontrol edin.
- [ ] `CODEOWNERS` üzerinden `notifications` paketinin sahibinden inceleme isteyin.
- [ ] `tradehub_core/api/reservation.py:107` bağımlılığının geçiş sonrası çağrı yolunu inceleyin.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?
Bir alıcı ile satıcı arasındaki sohbet rezervasyonunu tutar. `tradehub_core/tradehub_core/doctype/chat_reservation/chat_reservation.json:33`
Denetleyici, kayıt yazılmadan önce kayıt kurallarını uygular. `tradehub_core/tradehub_core/doctype/chat_reservation/chat_reservation.py:7`

## Bugünkü bağımlılıklar
### Bu kaydın bağlandığı kayıtlar
- `User` (`buyer_user`): başka bağlam (`01-kimlik-erisim`). `tradehub_core/tradehub_core/doctype/chat_reservation/chat_reservation.json:19`
- `User` (`seller_user`): başka bağlam (`01-kimlik-erisim`). `tradehub_core/tradehub_core/doctype/chat_reservation/chat_reservation.json:20`
- `Seller Availability Slot` (`slot`): aynı bağlam. `tradehub_core/tradehub_core/doctype/chat_reservation/chat_reservation.json:26`
### Bu kayda dokunan kod
- `tradehub_core/api/reservation.py:444`: yazıyor
### hooks.py kayıtları
- Doğrudan ada göre kanca bulunmadı. Dolaylı kayıtlar doğrulanmadı. `tradehub_core/hooks.py:453`

## Bağımlılık sorunları
1. Rezervasyon servisi satıcı sohbet paketini doğrudan okuyor. Mağaza şeması değişirse rezervasyon etkilenebilir. `tradehub_core/api/reservation.py:107`

## Hedef tasarım
- `12-bildirim-iletisim` bu kayda `tradehub_core/notifications/` paketinde sahip olsun.
- Dışarıya açılacak fonksiyonlar. `tradehub_core/notifications/api.py::reserve_chat_slot` `tradehub_core/notifications/api.py::cancel_chat_reservation`
- Olaylar. Bu kayıt için ayrıca bağlamlar arası olay önerilmiyor.
- Bağlantılar. `buyer_user` sabit `User` kimliğine bağlansın. `seller_user` sabit `User` kimliğine bağlansın.
- Doğrulama ve iş akışı. Zaman doğrulaması denetleyicide kalsın. Rezervasyon ve iptal aynı kilitleme kuralını kullansın.

## Geçiş adımları
1. Mevcut davranış için aşağıdaki testi ekle. `reserve_chat_slot` sözleşmesini mevcut uygulama üzerinden geçir.
2. İlk adımdan sonra sohbet paketi okumasını mağaza API’sine geçir.
3. İkinci adımdan sonra modül kaydını taşı. Eski Python girişlerini geçiş süresince yönlendir.

## Riskler ve testler
- Aynı saat dilimini iki alıcı aynı anda ayıramaz.
