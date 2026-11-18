# Media Metadata Vault

- Bağlam: 08-medya
- Tür: Ana kayıt
- Klasör: `tradehub_core/tradehub_core/doctype/media_metadata_vault`
- Denetleyici: `tradehub_core/tradehub_core/doctype/media_metadata_vault/media_metadata_vault.py` (7 satır)
- Önerilen sahip bağlam: 08-medya

## Epic

- Epic adı: Media Metadata Vault: 08-medya bağlamına taşıma
- Öncelik: Acil
- Faz: Faz 4
- Tahmini büyüklük: Orta

### User story

Bir geliştirici olarak, özel üst veriyi ayrı saklamak istiyorum.
Böylece genel görsel yanıtları özel veri taşımaz.

### Kabul kriterleri

- [ ] Normal medya okuması gizli üst veriyi döndürmez.
- [ ] `import-linter` denetimi, dış bağlamın `Media Metadata Vault` işleyicisini içe aktarmasını engeller.
- [ ] Geçiş testi, mevcut `Media Metadata Vault` kaydının sahip paket üzerinden okunabildiğini gösterir.
- [ ] Characterization test: `Media Metadata Vault` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- Üst veriyi genel medya yanıtında döndürmeyin. Kasa ayrı erişim ister.
- Katalogdan kasanın kaynak alanını sorgulamayın. Şema medya paketine aittir.
- `Media Metadata Vault` için dış bağlama doğrudan yazma yolu açmayın. Yazım kuralları `media` paketinde kalır.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] `Media Metadata Vault` için kabul koşullarını otomatik testte doğrulayın.
- [ ] `media` iç dosyalarına dış erişimleri `import-linter` ile kontrol edin.
- [ ] `CODEOWNERS` üzerinden `media` paketinin sahibinden inceleme isteyin.
- [ ] `tradehub_core/listing_purge/media.py:123` bağımlılığının geçiş sonrası çağrı yolunu inceleyin.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?
Görsel kaynağına ait ayrılmış üst veriyi saklar. `tradehub_core/tradehub_core/doctype/media_metadata_vault/media_metadata_vault.json:25`
Kayıt alanlarını DocType şeması tanımlar. `tradehub_core/tradehub_core/doctype/media_metadata_vault/media_metadata_vault.json:25`

## Bugünkü bağımlılıklar
### Bu kaydın bağlandığı kayıtlar
- `Media Asset` (`asset`): aynı bağlam. `tradehub_core/tradehub_core/doctype/media_metadata_vault/media_metadata_vault.json:10`
- `File` (`source_file`): başka bağlam (`14-platform-cekirdek`). `tradehub_core/tradehub_core/doctype/media_metadata_vault/media_metadata_vault.json:11`
### Bu kayda dokunan kod
- `tradehub_core/media/exif_vault.py:106`: yazıyor
### hooks.py kayıtları
- Doğrudan ada göre kanca bulunmadı. Dolaylı kayıtlar doğrulanmadı. `tradehub_core/hooks.py:453`

## Bağımlılık sorunları
1. Katalog temizliği gizli üst veri kaydının kaynak alanını biliyor. Şema değişikliği katalog temizliğini bozabilir. `tradehub_core/listing_purge/media.py:123`

## Hedef tasarım
- `08-medya` bu kayda `tradehub_core/media/` paketinde sahip olsun.
- Dışarıya açılacak fonksiyonlar. `tradehub_core/media/api.py` içinde bu kayıt için ayrı fonksiyon önerilmiyor.
- Olaylar. Bu kayıt için ayrıca bağlamlar arası olay önerilmiyor.
- Bağlantılar. `source_file` sabit `File` kimliğine bağlansın.
- Doğrulama ve iş akışı. Gizli üst veriyi yalnız medya servisi yazsın. Silme ve erişim kararları burada uygulansın.

## Geçiş adımları
1. Mevcut davranış için aşağıdaki testi ekle. Sahip paket için mevcut davranışı sabitle.
2. İlk adımdan sonra bu kaydı medya silme planında ele al. Katalog tablonun adını kullanmasın.
3. İkinci adımdan sonra modül kaydını taşı. Eski Python girişlerini geçiş süresince yönlendir.

## Riskler ve testler
- Normal medya okuması gizli üst veriyi döndürmez.
