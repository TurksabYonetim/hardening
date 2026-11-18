# Chat Thread Map

- Bağlam: 12-bildirim-iletisim
- Tür: Ana kayıt
- Klasör: `tradehub_core/tradehub_core/doctype/chat_thread_map`
- Denetleyici: `tradehub_core/tradehub_core/doctype/chat_thread_map/chat_thread_map.py` (13 satır)
- Önerilen sahip bağlam: 12-bildirim-iletisim

## Epic

- Epic adı: Chat Thread Map: 12-bildirim-iletisim bağlamına taşıma
- Öncelik: Önemli
- Faz: Faz 4
- Tahmini büyüklük: Orta

### User story

Bir geliştirici olarak, sohbet eşleşmelerini tek yerden yönetmek istiyorum.
Böylece mağaza temizliği sohbet kayıtlarını tutarlı işler.

### Kabul kriterleri

- [ ] Yinelenen konuşma bildirimi yeni eşleme oluşturmaz.
- [ ] Sözleşme testi `notifications/api.py::purge_store_chat_threads` çağrısının mevcut davranışı koruduğunu gösterir.
- [ ] Mağaza temizliği yalnız hedef mağazanın eşleşmelerini kaldırır.
- [ ] Characterization test: `Chat Thread Map` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- Mağaza temizliğinden eşleme tablosunu silmeyin. Saklama kararını sohbet servisi verir.
- Konuşma kimliğini denetlemeden kayıt açmayın. Aynı konuşma iki eşleme oluşturabilir.
- Dış bağlamdan `notifications` iç dosyalarını çağırmayın. Geçişte `purge_store_chat_threads` sözleşmesini kullanın.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] `Chat Thread Map` için kabul koşullarını otomatik testte doğrulayın.
- [ ] `notifications` iç dosyalarına dış erişimleri `import-linter` ile kontrol edin.
- [ ] `CODEOWNERS` üzerinden `notifications` paketinin sahibinden inceleme isteyin.
- [ ] `tradehub_core/services/store_cleanup.py:30` bağımlılığının geçiş sonrası çağrı yolunu inceleyin.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?
Harici sohbet konuşmasını mağaza ve alıcıyla eşler. `tradehub_core/tradehub_core/doctype/chat_thread_map/chat_thread_map.json:41`
Kayıt alanlarını DocType şeması tanımlar. `tradehub_core/tradehub_core/doctype/chat_thread_map/chat_thread_map.json:41`

## Bugünkü bağımlılıklar
### Bu kaydın bağlandığı kayıtlar
- `Admin Seller Profile` (`seller`): başka bağlam (`02-satici-magaza`). `tradehub_core/tradehub_core/doctype/chat_thread_map/chat_thread_map.json:24`
- `User` (`buyer_user`): başka bağlam (`01-kimlik-erisim`). `tradehub_core/tradehub_core/doctype/chat_thread_map/chat_thread_map.json:31`
### Bu kayda dokunan kod
- `tradehub_core/api/chat.py:486`: yazıyor
- `tradehub_core/services/store_cleanup.py:30`: siliyor
- `tradehub_core/tests/test_media_browse.py:340`: yazıyor
- `tradehub_core/tests/test_store_cleanup.py:91`: yazıyor
### hooks.py kayıtları
- Doğrudan ada göre kanca bulunmadı. Dolaylı kayıtlar doğrulanmadı. `tradehub_core/hooks.py:453`

## Bağımlılık sorunları
1. Mağaza temizliği sohbet eşleşmelerini doğrudan siliyor. Sohbetin saklama kuralı atlanabilir. `tradehub_core/services/store_cleanup.py:30`

## Hedef tasarım
- `12-bildirim-iletisim` bu kayda `tradehub_core/notifications/` paketinde sahip olsun.
- Dışarıya açılacak fonksiyonlar. `tradehub_core/notifications/api.py::purge_store_chat_threads`
- Olaylar. Bu kayıt için ayrıca bağlamlar arası olay önerilmiyor.
- Bağlantılar. `seller` sabit `Admin Seller Profile` kimliğine bağlansın. `buyer_user` sabit `User` kimliğine bağlansın.
- Doğrulama ve iş akışı. Konuşma eşleştirmesini sohbet servisi yönetsin. Mağaza temizliği bu servisi çağırsın.

## Geçiş adımları
1. Mevcut davranış için aşağıdaki testi ekle. `purge_store_chat_threads` sözleşmesini mevcut uygulama üzerinden geçir.
2. İlk adımdan sonra mağaza temizliğini `purge_store_chat_threads` işlevine bağla.
3. İkinci adımdan sonra modül kaydını taşı. Eski Python girişlerini geçiş süresince yönlendir.

## Riskler ve testler
- Yinelenen konuşma bildirimi yeni eşleme oluşturmaz.
