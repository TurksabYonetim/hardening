# Media Usage Meter

- Bağlam: 08-medya
- Tür: Kayıt defteri (log)
- Klasör: `tradehub_core/tradehub_core/doctype/media_usage_meter`
- Denetleyici: `tradehub_core/tradehub_core/doctype/media_usage_meter/media_usage_meter.py` (51 satır)
- Önerilen sahip bağlam: 08-medya

## Epic

- Epic adı: Media Usage Meter: 08-medya bağlamına taşıma
- Öncelik: Önemli
- Faz: Faz 4
- Tahmini büyüklük: Orta

### User story

Bir geliştirici olarak, mağaza tüketimini dönem bazında ölçmek istiyorum.
Böylece aynı tüketim iki kez sayılmaz.

### Kabul kriterleri

- [ ] Yeniden çalıştırılan toplama tüketimi iki kere yazmaz.
- [ ] Sözleşme testi `media/api.py::get_usage_totals` çağrısının mevcut davranışı koruduğunu gösterir.
- [ ] Geçiş testi, mevcut `Media Usage Meter` kaydının sahip paket üzerinden okunabildiğini gösterir.
- [ ] Characterization test: `Media Usage Meter` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- Sayacı kilitsiz okuyup artırmayın. Eşzamanlı artış kaybolabilir.
- Dönemi sorgudan çıkarmayın. Ayrı dönemlerin tüketimi birleşebilir.
- Dış bağlamdan `media` iç dosyalarını çağırmayın. Geçişte `get_usage_totals` sözleşmesini kullanın.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] `Media Usage Meter` için kabul koşullarını otomatik testte doğrulayın.
- [ ] `media` iç dosyalarına dış erişimleri `import-linter` ile kontrol edin.
- [ ] `CODEOWNERS` üzerinden `media` paketinin sahibinden inceleme isteyin.
- [ ] Mevcut bir `Media Usage Meter` kaydını eski girişten ve sahip paketten okuyup karşılaştırın.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?
Mağazanın dönemsel medya tüketimini tutar. `tradehub_core/tradehub_core/doctype/media_usage_meter/media_usage_meter.json:69`
Denetleyici, kayıt yazılmadan önce kayıt kurallarını uygular. `tradehub_core/tradehub_core/doctype/media_usage_meter/media_usage_meter.py:41`

## Bugünkü bağımlılıklar
### Bu kaydın bağlandığı kayıtlar
- `Admin Seller Profile` (`store`): başka bağlam (`02-satici-magaza`). `tradehub_core/tradehub_core/doctype/media_usage_meter/media_usage_meter.json:18`
### Bu kayda dokunan kod
- `tradehub_core/media/meter.py:93`: yazıyor
### hooks.py kayıtları
- Doğrudan ada göre kanca bulunmadı. Dolaylı kayıtlar doğrulanmadı. `tradehub_core/hooks.py:453`

## Bağımlılık sorunları
Önemli bir bağımlılık sorunu bulunmadı.

## Hedef tasarım
- `08-medya` bu kayda `tradehub_core/media/` paketinde sahip olsun.
- Dışarıya açılacak fonksiyonlar. `tradehub_core/media/api.py::get_usage_totals`
- Olaylar. Bu kayıt için ayrıca bağlamlar arası olay önerilmiyor.
- Bağlantılar. `store` sabit `Admin Seller Profile` kimliğine bağlansın.
- Doğrulama ve iş akışı. Dönem ve sayaç doğrulamasını koru. Tüketimi toplama işini medya servisi yürütsün.

## Geçiş adımları
1. Mevcut davranış için aşağıdaki testi ekle. `get_usage_totals` sözleşmesini mevcut uygulama üzerinden geçir.
2. İlk adımdan sonra rapordaki doğrulamayı ve iş akışını sahip pakette topla.
3. İkinci adımdan sonra modül kaydını taşı. Eski Python girişlerini geçiş süresince yönlendir.

## Riskler ve testler
- Yeniden çalıştırılan toplama tüketimi iki kere yazmaz.
