# Helpdesk Saved Filter

- Bağlam: 12-bildirim-iletisim
- Tür: Ana kayıt
- Klasör: `tradehub_core/tradehub_core/doctype/helpdesk_saved_filter`
- Denetleyici: `tradehub_core/tradehub_core/doctype/helpdesk_saved_filter/helpdesk_saved_filter.py` (21 satır)
- Önerilen sahip bağlam: 12-bildirim-iletisim

## Epic

- Epic adı: Helpdesk Saved Filter: 12-bildirim-iletisim bağlamına taşıma
- Öncelik: Önemli
- Faz: Faz 4
- Tahmini büyüklük: Orta

### User story

Bir platform yöneticisi olarak, destek filtrelerimi kaydetmek istiyorum.
Böylece özel aramalarım başka kullanıcılara açılmaz.

### Kabul kriterleri

- [ ] Başka kullanıcı özel filtreyi okuyamaz veya değiştiremez.
- [ ] `import-linter` denetimi, dış bağlamın `Helpdesk Saved Filter` işleyicisini içe aktarmasını engeller.
- [ ] Geçiş testi, mevcut `Helpdesk Saved Filter` kaydının sahip paket üzerinden okunabildiğini gösterir.
- [ ] Characterization test: `Helpdesk Saved Filter` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- Sahip alanını doğrulamadan paylaşmayın. Başkasının filtresi açılabilir.
- Özel filtreyi genel listeye katmayın. Kullanıcı veya ekip kapsamı gereklidir.
- `Helpdesk Saved Filter` için dış bağlama doğrudan yazma yolu açmayın. Yazım kuralları `notifications` paketinde kalır.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] `Helpdesk Saved Filter` için kabul koşullarını otomatik testte doğrulayın.
- [ ] `notifications` iç dosyalarına dış erişimleri `import-linter` ile kontrol edin.
- [ ] `CODEOWNERS` üzerinden `notifications` paketinin sahibinden inceleme isteyin.
- [ ] Mevcut bir `Helpdesk Saved Filter` kaydını eski girişten ve sahip paketten okuyup karşılaştırın.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?
Destek kullanıcısının kaydettiği filtreleri tutar. `tradehub_core/tradehub_core/doctype/helpdesk_saved_filter/helpdesk_saved_filter.json:69`
Denetleyici, kayıt yazılmadan önce kayıt kurallarını uygular. `tradehub_core/tradehub_core/doctype/helpdesk_saved_filter/helpdesk_saved_filter.py:10`

## Bugünkü bağımlılıklar
### Bu kaydın bağlandığı kayıtlar
- `User` (`owner_user`): başka bağlam (`01-kimlik-erisim`). `tradehub_core/tradehub_core/doctype/helpdesk_saved_filter/helpdesk_saved_filter.json:37`
### Bu kayda dokunan kod
- `tradehub_core/api/saved_filter.py:94`: yazıyor
### hooks.py kayıtları
- Doğrudan ada göre kanca bulunmadı. Dolaylı kayıtlar doğrulanmadı. `tradehub_core/hooks.py:453`

## Bağımlılık sorunları
Önemli bir bağımlılık sorunu bulunmadı.

## Hedef tasarım
- `12-bildirim-iletisim` bu kayda `tradehub_core/notifications/` paketinde sahip olsun.
- Dışarıya açılacak fonksiyonlar. `tradehub_core/notifications/api.py` içinde bu kayıt için ayrı fonksiyon önerilmiyor.
- Olaylar. Bu kayıt için ayrıca bağlamlar arası olay önerilmiyor.
- Bağlantılar. `owner_user` sabit `User` kimliğine bağlansın.
- Doğrulama ve iş akışı. Filtre biçimi ve sahiplik denetimi kalsın. Paylaşım ve listeleme destek servisine alınsın.

## Geçiş adımları
1. Mevcut davranış için aşağıdaki testi ekle. Sahip paket için mevcut davranışı sabitle.
2. İlk adımdan sonra rapordaki doğrulamayı ve iş akışını sahip pakette topla.
3. İkinci adımdan sonra modül kaydını taşı. Eski Python girişlerini geçiş süresince yönlendir.

## Riskler ve testler
- Başka kullanıcı özel filtreyi okuyamaz veya değiştiremez.
