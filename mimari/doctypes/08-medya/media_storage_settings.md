# Media Storage Settings

- Bağlam: 08-medya
- Tür: Ayar (single)
- Klasör: `tradehub_core/tradehub_core/doctype/media_storage_settings`
- Denetleyici: `tradehub_core/tradehub_core/doctype/media_storage_settings/media_storage_settings.py` (804 satır)
- Önerilen sahip bağlam: 08-medya

## Epic

- Epic adı: Media Storage Settings: 08-medya bağlamına taşıma
- Öncelik: Acil
- Faz: Faz 4
- Tahmini büyüklük: Büyük

### User story

Bir platform yöneticisi olarak, depolama bağlantısını güvenle denemek istiyorum.
Böylece bağlantı sorununu anahtarları paylaşmadan görürüm.

### Kabul kriterleri

- [ ] Bağlantı hatası kimlik bilgilerini yanıta veya günlüğe yazmaz.
- [ ] `import-linter` denetimi, dış bağlamın `Media Storage Settings` işleyicisini içe aktarmasını engeller.
- [ ] Geçiş testi, mevcut `Media Storage Settings` kaydının sahip paket üzerinden okunabildiğini gösterir.
- [ ] Characterization test: `Media Storage Settings` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- Bağlantı denemesini ayar doğrulamasına koymayın. Ayar kaydı ağ yanıtına bağlı kalır.
- Gizli değerleri durum yanıtına eklemeyin. Durum yanıtı paylaşılabilir.
- `Media Storage Settings` için dış bağlama doğrudan yazma yolu açmayın. Yazım kuralları `media` paketinde kalır.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] `Media Storage Settings` için kabul koşullarını otomatik testte doğrulayın.
- [ ] `media` iç dosyalarına dış erişimleri `import-linter` ile kontrol edin.
- [ ] `CODEOWNERS` üzerinden `media` paketinin sahibinden inceleme isteyin.
- [ ] Mevcut bir `Media Storage Settings` kaydını eski girişten ve sahip paketten okuyup karşılaştırın.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?
Medya depolama, dağıtım ve saklama ayarlarını tutar. `tradehub_core/tradehub_core/doctype/media_storage_settings/media_storage_settings.json:115`
Denetleyici, kayıt yazılmadan önce kayıt kurallarını uygular. `tradehub_core/tradehub_core/doctype/media_storage_settings/media_storage_settings.py:215`

## Bugünkü bağımlılıklar
### Bu kaydın bağlandığı kayıtlar
- `Media Storage Profile` (`imgproxy_allowed_profiles`) alt tablosu. `tradehub_core/tradehub_core/doctype/media_storage_settings/media_storage_settings.json:81`
- `Media Storage Profile` (`derivative_always_keep_profiles`) alt tablosu. `tradehub_core/tradehub_core/doctype/media_storage_settings/media_storage_settings.json:94`
### Bu kayda dokunan kod
- `tradehub_core/media/pipeline/storage/retention.py:918`: okuyor
### hooks.py kayıtları
- `tradehub_core/hooks.py:1313` Tekil kayıt yetki kancası.
- `tradehub_core/hooks.py:312` İlgili kayıt dışı tetikleyici. `"tradehub_core.media.pipeline.storage.retention.run_scheduled_gc",`
- `tradehub_core/hooks.py:328` İlgili kayıt dışı tetikleyici. `"tradehub_core.media.pipeline.storage.retention.run_scheduled_gc_originals",`
- `tradehub_core/hooks.py:329` İlgili kayıt dışı tetikleyici. `"tradehub_core.media.pipeline.storage.retention.run_scheduled_gc_derivatives",`
- `tradehub_core/hooks.py:332` İlgili kayıt dışı tetikleyici. `"tradehub_core.media.pipeline.storage.retention.run_scheduled_soft_delete",`

## Bağımlılık sorunları
Önemli bir bağımlılık sorunu bulunmadı.

## Hedef tasarım
- `08-medya` bu kayda `tradehub_core/media/` paketinde sahip olsun.
- Dışarıya açılacak fonksiyonlar. `tradehub_core/media/api.py` içinde bu kayıt için ayrı fonksiyon önerilmiyor.
- Olaylar. Bu kayıt için ayrıca bağlamlar arası olay önerilmiyor.
- Bağlantılar. Bu kayıt için yeni bağlamlar arası bağlantı veya anlık görüntü alanı önerilmiyor.
- Doğrulama ve iş akışı. Kip ve adres denetimleri kalsın. Bağlantı denemesi ve önbellek temizliği depolama servisine taşınsın.

## Geçiş adımları
1. Mevcut davranış için aşağıdaki testi ekle. Sahip paket için mevcut davranışı sabitle.
2. İlk adımdan sonra rapordaki doğrulamayı ve iş akışını sahip pakette topla.
3. İkinci adımdan sonra modül kaydını taşı. Eski Python girişlerini geçiş süresince yönlendir.

## Riskler ve testler
- Bağlantı hatası kimlik bilgilerini yanıta veya günlüğe yazmaz.
