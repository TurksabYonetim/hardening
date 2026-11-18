# Helpdesk Ticket Tag

- Bağlam: 12-bildirim-iletisim
- Tür: Ana kayıt
- Klasör: `tradehub_core/tradehub_core/doctype/helpdesk_ticket_tag`
- Denetleyici: `tradehub_core/tradehub_core/doctype/helpdesk_ticket_tag/helpdesk_ticket_tag.py` (12 satır)
- Önerilen sahip bağlam: 12-bildirim-iletisim

## Epic

- Epic adı: Helpdesk Ticket Tag: 12-bildirim-iletisim bağlamına taşıma
- Öncelik: Önemli
- Faz: Faz 4
- Tahmini büyüklük: Küçük

### User story

Bir platform yöneticisi olarak, destek etiketlerini yönetmek istiyorum.
Böylece etiketler biletlerle tutarlı kalır.

### Kabul kriterleri

- [ ] Etiket silme işlemi geçersiz bağlantı bırakmaz.
- [ ] `import-linter` denetimi, dış bağlamın `Helpdesk Ticket Tag` işleyicisini içe aktarmasını engeller.
- [ ] Geçiş testi, mevcut `Helpdesk Ticket Tag` kaydının sahip paket üzerinden okunabildiğini gösterir.
- [ ] Characterization test: `Helpdesk Ticket Tag` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- Bağlı biletleri denetlemeden etiketi silmeyin. Geçersiz bağlantılar kalabilir.
- Sözlükten harici bilete doğrudan yazmayın. Bilet ayrı uygulamaya aittir.
- `Helpdesk Ticket Tag` için dış bağlama doğrudan yazma yolu açmayın. Yazım kuralları `notifications` paketinde kalır.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] `Helpdesk Ticket Tag` için kabul koşullarını otomatik testte doğrulayın.
- [ ] `notifications` iç dosyalarına dış erişimleri `import-linter` ile kontrol edin.
- [ ] `CODEOWNERS` üzerinden `notifications` paketinin sahibinden inceleme isteyin.
- [ ] Mevcut bir `Helpdesk Ticket Tag` kaydını eski girişten ve sahip paketten okuyup karşılaştırın.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?
Destek biletlerine verilen etiketleri tanımlar. `tradehub_core/tradehub_core/doctype/helpdesk_ticket_tag/helpdesk_ticket_tag.json:35`
Denetleyici, kayıt yazılmadan önce kayıt kurallarını uygular. `tradehub_core/tradehub_core/doctype/helpdesk_ticket_tag/helpdesk_ticket_tag.py:8`

## Bugünkü bağımlılıklar
### Bu kaydın bağlandığı kayıtlar
- Bağlantı alanı bulunmadı. `tradehub_core/tradehub_core/doctype/helpdesk_ticket_tag/helpdesk_ticket_tag.json:35`
### Bu kayda dokunan kod
- `tradehub_core/api/ticket_tag.py:76`: yazıyor
### hooks.py kayıtları
- Doğrudan ada göre kanca bulunmadı. Dolaylı kayıtlar doğrulanmadı. `tradehub_core/hooks.py:453`

## Bağımlılık sorunları
Önemli bir bağımlılık sorunu bulunmadı.

## Hedef tasarım
- `12-bildirim-iletisim` bu kayda `tradehub_core/notifications/` paketinde sahip olsun.
- Dışarıya açılacak fonksiyonlar. `tradehub_core/notifications/api.py` içinde bu kayıt için ayrı fonksiyon önerilmiyor.
- Olaylar. Bu kayıt için ayrıca bağlamlar arası olay önerilmiyor.
- Bağlantılar. Bu kayıt için yeni bağlamlar arası bağlantı veya anlık görüntü alanı önerilmiyor.
- Doğrulama ve iş akışı. Etiket adı doğrulaması kalsın. Etiket yaşam döngüsünü destek servisi yönetsin.

## Geçiş adımları
1. Mevcut davranış için aşağıdaki testi ekle. Sahip paket için mevcut davranışı sabitle.
2. İlk adımdan sonra rapordaki doğrulamayı ve iş akışını sahip pakette topla.
3. İkinci adımdan sonra modül kaydını taşı. Eski Python girişlerini geçiş süresince yönlendir.

## Riskler ve testler
- Etiket silme işlemi geçersiz bağlantı bırakmaz.
