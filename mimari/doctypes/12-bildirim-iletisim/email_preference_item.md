# Email Preference Item

- Bağlam: 12-bildirim-iletisim
- Tür: Alt tablo
- Klasör: `tradehub_core/tradehub_core/doctype/email_preference_item`
- Denetleyici: `tradehub_core/tradehub_core/doctype/email_preference_item/email_preference_item.py` (5 satır)
- Önerilen sahip bağlam: 12-bildirim-iletisim

## Epic

- Epic adı: Email Preference Item: 12-bildirim-iletisim bağlamına taşıma
- Öncelik: Önemli
- Faz: Faz 4
- Tahmini büyüklük: Küçük

### User story

Bir geliştirici olarak, e-posta seçeneğinin etiketini değiştirmek istiyorum.
Böylece kayıtlı tercihler geçerli kalır.

### Kabul kriterleri

- [ ] Etiket düzenlemesi kayıtlı tercih anahtarını değiştirmez.
- [ ] `Email Preference Item` yazımı `Email Preference Category` üzerinden yapılır.
- [ ] Geçiş testi, mevcut `Email Preference Item` kaydının sahip paket üzerinden okunabildiğini gösterir.
- [ ] Characterization test: `Email Preference Item` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- Etiket düzenlerken tercih anahtarını değiştirmeyin. Kullanıcı kaydı anahtarı taşır.
- Alt satırı tek başına silmeyin. Kategori ve eski tercihler etkilenebilir.
- `Email Preference Category` dışındaki bağlamların alt satırı değiştirmesine izin vermeyin. Üst kayıt bütünlüğü bozulabilir.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] `Email Preference Item` için kabul koşullarını otomatik testte doğrulayın.
- [ ] `notifications` iç dosyalarına dış erişimleri `import-linter` ile kontrol edin.
- [ ] `CODEOWNERS` üzerinden `notifications` paketinin sahibinden inceleme isteyin.
- [ ] `Email Preference Category` kaydedilirken alt satır sırasını ve mevcut değerleri karşılaştırın.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?
Bir kategori altındaki e-posta tercih seçeneğini tutar. `tradehub_core/tradehub_core/doctype/email_preference_item/email_preference_item.json:58`
Kayıt alanlarını DocType şeması tanımlar. `tradehub_core/tradehub_core/doctype/email_preference_item/email_preference_item.json:58`

## Bugünkü bağımlılıklar
### Bu kaydın bağlandığı kayıtlar
- Bağlantı alanı bulunmadı. `tradehub_core/tradehub_core/doctype/email_preference_item/email_preference_item.json:58`
### Bu kayda dokunan kod
- `tradehub_core/api/v1/email_preferences.py:27`: okuyor
- `tradehub_core/tradehub_core/doctype/email_preference_category/email_preference_category.py:24`: okuyor
### hooks.py kayıtları
- Doğrudan ada göre kanca bulunmadı. Dolaylı kayıtlar doğrulanmadı. `tradehub_core/hooks.py:453`

## Bağımlılık sorunları
Önemli bir bağımlılık sorunu bulunmadı.

## Hedef tasarım
- `12-bildirim-iletisim` bu kayda `tradehub_core/notifications/` paketinde sahip olsun.
- Dışarıya açılacak fonksiyonlar. `tradehub_core/notifications/api.py` içinde bu kayıt için ayrı fonksiyon önerilmiyor.
- Olaylar. Bu kayıt için ayrıca bağlamlar arası olay önerilmiyor.
- Bağlantılar. Bu kayıt için yeni bağlamlar arası bağlantı veya anlık görüntü alanı önerilmiyor.
- Doğrulama ve iş akışı. Öğe anahtarını kategori üzerinden yönet. Önceki kullanıcı tercihlerini koru.

## Geçiş adımları
1. Mevcut davranış için aşağıdaki testi ekle. Sahip paket için mevcut davranışı sabitle.
2. İlk adımdan sonra üst kayıt kaydederken alt satır kurallarını uygula.
3. İkinci adımdan sonra modül kaydını taşı. Eski Python girişlerini geçiş süresince yönlendir.

## Riskler ve testler
- Etiket düzenlemesi kayıtlı tercih anahtarını değiştirmez.
