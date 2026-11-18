# Processing Activity Record

- Bağlam: 13-uyum-gizlilik
- Tür: Ana kayıt
- Klasör: `tradehub_core/tradehub_core/doctype/processing_activity_record`
- Denetleyici: `tradehub_core/tradehub_core/doctype/processing_activity_record/processing_activity_record.py` (16 satır)
- Önerilen sahip bağlam: 13-uyum-gizlilik

## Epic

- Epic adı: Processing Activity Record: 13-uyum-gizlilik bağlamına taşıma
- Öncelik: Düşük
- Faz: Faz 4
- Tahmini büyüklük: Küçük

### User story

Bir platform yöneticisi olarak, veri işleme envanterinin raporunu almak istiyorum.
Böylece denetimde hazır olurum.

### Kabul kriterleri

- [ ] Rapor üretimi `privacy/ropa.py` içinde duruyor.
- [ ] `api/v1/compliance.py:439` uç noktası yalnız bu fonksiyonu çağırıyor.
- [ ] JSON raporu bugünkü anahtarları döndürüyor.
- [ ] Characterization test: `Processing Activity Record` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- Gözden geçirme aralığını sıfır ya da eksi bırakmayın.
- Rapor uç noktasını uyum rolü dışındaki kullanıcılara açmayın.
- Rapor biçimini haber vermeden değiştirmeyin. Denetim araçları bu biçimi okur.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] Değişen davranış için önce başarısız olan bir test yazıldı.
- [ ] Ruff ve uygulama testleri yerelde geçiyor.
- [ ] `import-linter` kontrolü `tradehub_core.privacy` için geçiyor.
- [ ] `CODEOWNERS` içindeki gizlilik bağlamı sahibinden inceleme istendi.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?

Bu kayıt veri işleme faaliyetleri envanterini tutar. Bu envantere ROPA denir. ROPA, kişisel verinin hangi amaçla işlendiğini gösteren listedir. Kayıt gözden geçirme aralığını da tutar.

## Bugünkü bağımlılıklar

### Bu kaydın bağlandığı kayıtlar

- `ROPA DocType Link` (`ref_doctypes`, alt tablo): aynı bağlam

### Bu kayda dokunan kod

- `tradehub_core/api/v1/compliance.py:444`: adını kullanıyor
- `tradehub_core/api/v1/compliance.py:467`: adını kullanıyor
- `tradehub_core/setup/module_navigation_spec.py:1192`: adını kullanıyor

### hooks.py kayıtları

- `hooks.py` içinde bu DocType için kayıt yok.

## Bağımlılık sorunları

1. Önemli bir bağlam dışı bağımlılık yok. Rapor uç noktası alt tabloyu ham filtreyle okuyor. Kanıt: `api/v1/compliance.py:467`.

## Hedef tasarım

- Sahip bağlam ve paket yolu: `tradehub_core/privacy/` paketi ve yeni `Privacy` Frappe modülü.
- Dışarıya açılan fonksiyonlar: `privacy/api.py` içinde `export_ropa_report(fmt)` fonksiyonu.
- Yayınladığı olaylar: Yok.
- Dinlediği olaylar: Yok.
- Başka bağlamlara bağlantılar: Alt tablo `ROPA DocType Link` her DocType'a bağlanabilir. Bu bağ yalnız okuma içindir.
- Denetleyicide kalacak doğrulamalar: Gözden geçirme aralığı doğrulaması kalır.
- Servise taşınacak iş kuralları: Taşınacak iş kuralı yok.

## Geçiş adımları

1. Rapor üretimini `api/v1/compliance.py:439` içinden `privacy/ropa.py` içine taşıyın. Uç nokta yalnız çağırsın.
2. DocType'ı `Privacy` modülüne taşıyın.

## Riskler ve testler

- Rapor biçimi değişebilir. Test: JSON raporu bugünkü anahtarları döndürmeli.
