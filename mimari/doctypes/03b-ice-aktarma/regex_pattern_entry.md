# Regex Pattern Entry

- Bağlam: 03b-ice-aktarma
- Tür: Alt tablo
- Klasör: `tradehub_core/tradehub_core/doctype/regex_pattern_entry`
- Denetleyici: `tradehub_core/tradehub_core/doctype/regex_pattern_entry/regex_pattern_entry.py` (22 satır)
- Önerilen sahip bağlam: 03b-ice-aktarma

## Epic

- Epic adı: Regex Pattern Entry: 03b-ice-aktarma bağlamına taşıma
- Öncelik: Düşük
- Faz: Faz 5
- Tahmini büyüklük: Küçük

### User story

Bir geliştirici olarak, bu alt tablonun `Regex Pattern Library` ile birlikte taşınmasını istiyorum.
Böylece desen kütüphanesi tek pakette durur.

### Kabul kriterleri

- [ ] `module` alanı "Import Pipeline" oldu.
- [ ] Geçersiz regex kaydedilemiyor. Test var.
- [ ] Uzunluk sınırı korunuyor.
- [ ] Characterization test: `Regex Pattern Entry` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- Satır düzeyi regex kontrolünü kaldırmayın. Ana kayıt kontrolü REST yoluyla atlanabilir.
- Ana kayıttan ayrı PR ile taşımayın.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] Regex derleme testi geçiyor.
- [ ] Yama idempotent.
- [ ] `CODEOWNERS` içe aktarma ekibinden inceleme istendi.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?
Bu alt tablo bir desen kütüphanesindeki tek bir düzenli ifadeyi (regex) tutar. Regex, metin eşleştirme kuralıdır. Satır ifadeyi, bayraklarını ve etkin durumunu taşır. Ana kayıt `Regex Pattern Library` kaydıdır.

## Bugünkü bağımlılıklar
### Bu kaydın bağlandığı kayıtlar
- Link alanı yok.
### Bu kayda dokunan kod
- `tradehub_core/tradehub_core/doctype/regex_pattern_entry/regex_pattern_entry.py:13-22`: uzunluk ve derleme kontrolü
- `tradehub_core/tradehub_core/doctype/regex_pattern_library/regex_pattern_library.json:107`: ana kayıt `patterns` alanında tutuyor
### hooks.py kayıtları
- Kayıt yok.

## Bağımlılık sorunları
Önemli bir bağımlılık sorunu bulunmadı. Alt tablo yalnız kendi bağlamı içinde kullanılıyor.

## Hedef tasarım
- Sahip bağlam `03b-ice-aktarma`.
- Dışarıya açılan fonksiyon: Ayrı fonksiyon gerekmez. Desen çözümü `resolve_column_mapping` içinde kalır.
- Olay yok.
- Başka bağlamlara bağlantı yok.
- Denetleyicide kalacak doğrulamalar: uzunluk ve derleme kontrolü kalır.

## Geçiş adımları
1. Ana kayıtla birlikte `module` alanını değiştirin.

## Riskler ve testler
- Geçersiz regex kaydedilememeli. Test: `(` ifadesi reddedilir.
