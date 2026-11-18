# Chat Attachment

- Bağlam: 12-bildirim-iletisim
- Tür: Ana kayıt
- Klasör: `tradehub_core/tradehub_core/doctype/chat_attachment`
- Denetleyici: `tradehub_core/tradehub_core/doctype/chat_attachment/chat_attachment.py` (13 satır)
- Önerilen sahip bağlam: 12-bildirim-iletisim

## Epic

- Epic adı: Chat Attachment: 12-bildirim-iletisim bağlamına taşıma
- Öncelik: Önemli
- Faz: Faz 4
- Tahmini büyüklük: Orta

### User story

Bir geliştirici olarak, sohbet eklerini mağaza kapsamında listelemek istiyorum.
Böylece başka mağazanın ekleri görünmez.

### Kabul kriterleri

- [ ] Başka mağazanın eklentisi listede ve toplamda görünmez.
- [ ] Sözleşme testi `notifications/api.py::list_store_chat_attachments` çağrısının mevcut davranışı koruduğunu gösterir.
- [ ] Medya tarayıcısı ek listesi ve toplamı için aynı mağaza kapsamını kullanır.
- [ ] Characterization test: `Chat Attachment` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- Medya tarayıcısından ek tablosunu sorgulamayın. Yetki kuralı iki yere dağılır.
- Gereksiz gönderici alanlarını döndürmeyin. Görünüm yalnız gerekli alanları taşır.
- Dış bağlamdan `notifications` iç dosyalarını çağırmayın. Geçişte `list_store_chat_attachments` sözleşmesini kullanın.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] `Chat Attachment` için kabul koşullarını otomatik testte doğrulayın.
- [ ] `notifications` iç dosyalarına dış erişimleri `import-linter` ile kontrol edin.
- [ ] `CODEOWNERS` üzerinden `notifications` paketinin sahibinden inceleme isteyin.
- [ ] `tradehub_core/media/browse.py:179` bağımlılığının geçiş sonrası çağrı yolunu inceleyin.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?
Sohbet eklentisinin gönderen ve mağaza bilgisini tutar. `tradehub_core/tradehub_core/doctype/chat_attachment/chat_attachment.json:85`
Kayıt alanlarını DocType şeması tanımlar. `tradehub_core/tradehub_core/doctype/chat_attachment/chat_attachment.json:85`

## Bugünkü bağımlılıklar
### Bu kaydın bağlandığı kayıtlar
- `Admin Seller Profile` (`seller`): başka bağlam (`02-satici-magaza`). `tradehub_core/tradehub_core/doctype/chat_attachment/chat_attachment.json:30`
- `User` (`sender`): başka bağlam (`01-kimlik-erisim`). `tradehub_core/tradehub_core/doctype/chat_attachment/chat_attachment.json:38`
### Bu kayda dokunan kod
- `tradehub_core/api/chat.py:523`: yazıyor
- `tradehub_core/media/browse.py:179`: okuyor
- `tradehub_core/tests/test_media_browse.py:288`: yazıyor
- `tradehub_core/tests/test_seller_media_browse.py:56`: yazıyor
### hooks.py kayıtları
- Doğrudan ada göre kanca bulunmadı. Dolaylı kayıtlar doğrulanmadı. `tradehub_core/hooks.py:453`

## Bağımlılık sorunları
1. Medya tarayıcısı sohbet eklerini doğrudan sayıyor. Sohbet şeması değişirse medya sayacı bozulabilir. `tradehub_core/media/browse.py:179`

## Hedef tasarım
- `12-bildirim-iletisim` bu kayda `tradehub_core/notifications/` paketinde sahip olsun.
- Dışarıya açılacak fonksiyonlar. `tradehub_core/notifications/api.py::list_store_chat_attachments`
- Olaylar. Bu kayıt için ayrıca bağlamlar arası olay önerilmiyor.
- Bağlantılar. `seller` sabit `Admin Seller Profile` kimliğine bağlansın. `sender` sabit `User` kimliğine bağlansın. Medya okuma modelinde yalnız mağaza kapsamlı ek kimliği ve liste alanları bulunsun.
- Doğrulama ve iş akışı. Medya tarayıcısına mağaza kapsamlı okuma modeli ver. Okuma modeli yalnız gerekli alanları döndürsün.

## Geçiş adımları
1. Mevcut davranış için aşağıdaki testi ekle. `list_store_chat_attachments` sözleşmesini mevcut uygulama üzerinden geçir.
2. İlk adımdan sonra medya sayaçlarını ve listelemeyi aynı yetkili okuma modeline geçir.
3. İkinci adımdan sonra modül kaydını taşı. Eski Python girişlerini geçiş süresince yönlendir.

## Riskler ve testler
- Başka mağazanın eklentisi listede ve toplamda görünmez.
