# Manual Payment Command

- Bağlam: 05-odeme
- Tür: Kayıt defteri (log)
- Klasör: `tradehub_core/tradehub_core/doctype/manual_payment_command`
- Denetleyici: `tradehub_core/tradehub_core/doctype/manual_payment_command/manual_payment_command.py` (19 satır)
- Önerilen sahip bağlam: 05-odeme

## Epic

- Epic adı: Manual Payment Command: 05-odeme bağlamına taşıma
- Öncelik: Düşük
- Faz: Faz 3
- Tahmini büyüklük: Küçük

### User story

Bir geliştirici olarak, elle ödeme komutunun iki kez çalışmamasını istiyorum.
Böylece finans ekibi aynı işlemi iki kez yapmaz.

### Kabul kriterleri

- [ ] Aynı anahtar ve içerik aynı yanıtı dönüyor.
- [ ] `planned_delete` kapısı `shared/retention.py` içinden geliyor.
- [ ] Kayıt değişmeden kalıyor.
- [ ] Characterization test: `Manual Payment Command` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- Saklanan yanıtı değiştirmeyin.
- Farklı içerikle aynı anahtarı kabul etmeyin.
- `manual_guard` kapısını atlamayın.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] Tekillik testi geçiyor.
- [ ] İzin testi geçiyor.
- [ ] `ruff` kontrolü geçiyor.
- [ ] `CODEOWNERS` sahibinden inceleme istendi.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?
`Manual Payment Command` elle ödeme komutlarının tekillik kaydıdır. Aynı anahtarla gelen komut ikinci kez çalışmaz. Kayıt önceki yanıtı saklar ve aynı yanıtı yeniden döner.

## Bugünkü bağımlılıklar
### Bu kaydın bağlandığı kayıtlar
- `User` (`actor`): framework kaydı
- `Payment Intent` (`payment_intent`): aynı bağlam

### Bu kayda dokunan kod
- `tradehub_core/payments/manual_commands.py:58`: yazıyor
- `tradehub_core/payments/manual_guard.py:90`: yazım kapısı

### hooks.py kayıtları
- `hooks.py:1572`: liste ve kayıt izni `payments.manual_guard` içindedir.

## Bağımlılık sorunları
Önemli bir bağımlılık sorunu bulunmadı.

## Hedef tasarım
- Sahip bağlam: 05-odeme.
- Dışarıya açılan fonksiyon ve olay yoktur.
- Paylaşılan olay altyapısının alıcı makbuzu bu kaydın desenini kullanabilir. Desen şudur: anahtar, içerik özeti ve önceki sonuç.

## Geçiş adımları
1. Değişiklik gerekmez. `planned_delete` taşımasıyla içe aktarımı güncelleyin.

## Riskler ve testler
- Aynı komut iki kez çalışabilir. Test: aynı anahtar ve içerik aynı yanıtı dönmeli.
