# Seller Availability Slot

- Bağlam: 12-bildirim-iletisim
- Tür: Ana kayıt
- Klasör: `tradehub_core/tradehub_core/doctype/seller_availability_slot`
- Denetleyici: `tradehub_core/tradehub_core/doctype/seller_availability_slot/seller_availability_slot.py` (9 satır)
- Önerilen sahip bağlam: 12-bildirim-iletisim

## Epic

- Epic adı: Seller Availability Slot: 12-bildirim-iletisim bağlamına taşıma
- Öncelik: Önemli
- Faz: Faz 4
- Tahmini büyüklük: Orta

### User story

Bir satıcı olarak, sohbet saatlerimi yönetmek istiyorum.
Böylece geçmiş rezervasyonlarım korunur.

### Kabul kriterleri

- [ ] Rezervasyonu olan zaman dilimi kapatılınca geçmiş kayıt korunur.
- [ ] Sözleşme testi `notifications/api.py::list_chat_slots` çağrısının mevcut davranışı koruduğunu gösterir.
- [ ] Takvim yetkisi mağaza durumunu mağaza API’sinden alır.
- [ ] Characterization test: `Seller Availability Slot` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- Rezervasyonu olan zaman dilimini doğrudan silmeyin. Geçmiş kayıt ona bağlıdır.
- Mağaza durumunu iç tablodan okumayın. Takvim yetkisi mağaza API’sinden gelir.
- Dış bağlamdan `notifications` iç dosyalarını çağırmayın. Geçişte `list_chat_slots` sözleşmesini kullanın.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] `Seller Availability Slot` için kabul koşullarını otomatik testte doğrulayın.
- [ ] `notifications` iç dosyalarına dış erişimleri `import-linter` ile kontrol edin.
- [ ] `CODEOWNERS` üzerinden `notifications` paketinin sahibinden inceleme isteyin.
- [ ] `tradehub_core/api/reservation.py:77` bağımlılığının geçiş sonrası çağrı yolunu inceleyin.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?
Satıcının sohbet için ayırdığı zaman dilimini tutar. `tradehub_core/tradehub_core/doctype/seller_availability_slot/seller_availability_slot.json:31`
Denetleyici, kayıt yazılmadan önce kayıt kurallarını uygular. `tradehub_core/tradehub_core/doctype/seller_availability_slot/seller_availability_slot.py:7`

## Bugünkü bağımlılıklar
### Bu kaydın bağlandığı kayıtlar
- `User` (`seller_user`): başka bağlam (`01-kimlik-erisim`). `tradehub_core/tradehub_core/doctype/seller_availability_slot/seller_availability_slot.json:18`
- `User` (`created_by_user`): başka bağlam (`01-kimlik-erisim`). `tradehub_core/tradehub_core/doctype/seller_availability_slot/seller_availability_slot.json:24`
### Bu kayda dokunan kod
- `tradehub_core/api/reservation.py:315`: yazıyor
- `tradehub_core/tests/test_ekip_uyesi_magaza.py:461`: okuyor
### hooks.py kayıtları
- Doğrudan ada göre kanca bulunmadı. Dolaylı kayıtlar doğrulanmadı. `tradehub_core/hooks.py:453`

## Bağımlılık sorunları
1. Takvim yetkisi mağaza durum alanını doğrudan okuyor. Mağaza şeması değişirse takvim yetkisi etkilenebilir. `tradehub_core/api/reservation.py:77`

## Hedef tasarım
- `12-bildirim-iletisim` bu kayda `tradehub_core/notifications/` paketinde sahip olsun.
- Dışarıya açılacak fonksiyonlar. `tradehub_core/notifications/api.py::list_chat_slots` `tradehub_core/notifications/api.py::save_chat_slot`
- Olaylar. Bu kayıt için ayrıca bağlamlar arası olay önerilmiyor.
- Bağlantılar. `seller_user` sabit `User` kimliğine bağlansın. `created_by_user` sabit `User` kimliğine bağlansın.
- Doğrulama ve iş akışı. Zaman aralığını denetleyicide doğrula. Takvim değişikliklerini rezervasyonla aynı serviste yap.

## Geçiş adımları
1. Mevcut davranış için aşağıdaki testi ekle. `list_chat_slots` sözleşmesini mevcut uygulama üzerinden geçir.
2. İlk adımdan sonra aktif mağaza denetimini mağaza API’sine geçir.
3. İkinci adımdan sonra modül kaydını taşı. Eski Python girişlerini geçiş süresince yönlendir.

## Riskler ve testler
- Rezervasyonu olan zaman dilimi kapatılınca geçmiş kayıt korunur.
