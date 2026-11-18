# Media Source

- Bağlam: 08-medya
- Tür: Ana kayıt
- Klasör: `tradehub_core/tradehub_core/doctype/media_source`
- Denetleyici: `tradehub_core/tradehub_core/doctype/media_source/media_source.py` (64 satır)
- Önerilen sahip bağlam: 08-medya

## Epic

- Epic adı: Media Source: 08-medya bağlamına taşıma
- Öncelik: Önemli
- Faz: Faz 4
- Tahmini büyüklük: Orta

### User story

Bir geliştirici olarak, özgün kaynağı değişmez tutmak istiyorum.
Böylece yayındaki sürümün kaynağını izlerim.

### Kabul kriterleri

- [ ] Kaynak bilgisi sonradan sessizce değiştirilemez.
- [ ] `import-linter` denetimi, dış bağlamın `Media Source` işleyicisini içe aktarmasını engeller.
- [ ] Geçiş testi, mevcut `Media Source` kaydının sahip paket üzerinden okunabildiğini gösterir.
- [ ] Characterization test: `Media Source` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- Kaynak alanlarını doğrudan yazımla değiştirmeyin. Değişmezlik denetimi atlanır.
- Katalogda ayrı bir kaynak silme sırası kurmayın. Kaynak bağını medya yönetir.
- `Media Source` için dış bağlama doğrudan yazma yolu açmayın. Yazım kuralları `media` paketinde kalır.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] `Media Source` için kabul koşullarını otomatik testte doğrulayın.
- [ ] `media` iç dosyalarına dış erişimleri `import-linter` ile kontrol edin.
- [ ] `CODEOWNERS` üzerinden `media` paketinin sahibinden inceleme isteyin.
- [ ] `tradehub_core/listing_purge/media.py:48` bağımlılığının geçiş sonrası çağrı yolunu inceleyin.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?
Medya varlığının özgün kaynağını ve dosya ölçümlerini tutar. `tradehub_core/tradehub_core/doctype/media_source/media_source.json:42`
Denetleyici ölçüleri ve kaynak alanlarının değişmezliğini doğrular. `tradehub_core/tradehub_core/doctype/media_source/media_source.py:37`

## Bugünkü bağımlılıklar
### Bu kaydın bağlandığı kayıtlar
- `Media Asset` (`asset`): aynı bağlam. `tradehub_core/tradehub_core/doctype/media_source/media_source.json:14`
- `User` (`uploaded_by`): başka bağlam (`01-kimlik-erisim`). `tradehub_core/tradehub_core/doctype/media_source/media_source.json:33`
### Bu kayda dokunan kod
- `tradehub_core/media/trash.py:555`: okuyor
### hooks.py kayıtları
- `tradehub_core/hooks.py:1167` Liste sorgusu yetki kancası.
- `tradehub_core/hooks.py:1289` Tekil kayıt yetki kancası.

## Bağımlılık sorunları
1. Katalog temizliği özgün kaynağın iç bağlantısını biliyor. Kaynak şeması katalog temizliğini etkileyebilir. `tradehub_core/listing_purge/media.py:48`

## Hedef tasarım
- `08-medya` bu kayda `tradehub_core/media/` paketinde sahip olsun.
- Dışarıya açılacak fonksiyonlar. `tradehub_core/media/api.py` içinde bu kayıt için ayrı fonksiyon önerilmiyor.
- Olaylar. Bu kayıt için ayrıca bağlamlar arası olay önerilmiyor.
- Bağlantılar. `uploaded_by` sabit `User` kimliğine bağlansın.
- Doğrulama ve iş akışı. Değişmez kaynak ve negatif ölçü denetimleri kalsın. Kaynak yaratma ve silme serviste yürüsün.

## Geçiş adımları
1. Mevcut davranış için aşağıdaki testi ekle. Sahip paket için mevcut davranışı sabitle.
2. İlk adımdan sonra bu kaydı medya silme planında ele al. Katalog tablonun adını kullanmasın.
3. İkinci adımdan sonra modül kaydını taşı. Eski Python girişlerini geçiş süresince yönlendir.

## Riskler ve testler
- Kaynak bilgisi sonradan sessizce değiştirilemez.
