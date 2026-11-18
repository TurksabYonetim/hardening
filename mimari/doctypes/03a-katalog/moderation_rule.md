# Moderation Rule

- Bağlam: 03a-katalog
- Tür: Ayar (kural kaydı)
- Klasör: `tradehub_core/tradehub_core/doctype/moderation_rule`
- Denetleyici: `tradehub_core/tradehub_core/doctype/moderation_rule/moderation_rule.py` (5 satır)
- Önerilen sahip bağlam: 11-degerlendirme. Neden: Kuralların hepsi yorum (review) risk puanı, kötüye kullanım sayısı ve yasaklı ifade içindir. Tek kullanan kod `api/moderation.py` yorum moderasyonudur.

## Epic

- Epic adı: Moderation Rule: 03a-katalog bağlamına taşıma
- Öncelik: Önemli
- Faz: Faz 4
- Tahmini büyüklük: Küçük

### User story

Bir platform yöneticisi olarak, yorum moderasyon kuralının yorum bağlamında durmasını ve eksik eşiğin kaydedilememesini istiyorum.
Böylece kural doğru ekibin elinde olur ve yanlış kural yorumları hatalı reddetmez.

### Kabul kriterleri

- [ ] Denetleyici `threshold_value` ve `banned_phrases` zorunluluğunu türe göre kontrol ediyor. Test var.
- [ ] Tohum fonksiyonu `reviews/setup.py` içinde. `install.py` yama dosyasından içe aktarmıyor.
- [ ] Bağlam haritası 11-degerlendirme gösteriyor ve `module` alanı "Reviews" oldu.
- [ ] Pasifleştirilen varsayılan kural migrate sonrası pasif kalıyor. Test geçiyor.
- [ ] Characterization test: `Moderation Rule` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- Kuralı katalog paketine taşımayın. Tek okuyucu yorum moderasyonudur.
- Kurulum kodundan yama dosyası içe aktarmayın. Tohum verisi bağlamın `setup` dosyasında olur.
- Varsayılan kuralı silmeyin, pasifleştirin. Migrate geri getirir.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] Denetleyici doğrulama testleri eklendi.
- [ ] Tohum testi (`test_mogem989_yorum_tohumlari.py`) geçiyor.
- [ ] Harita ve `module` güncellemesi aynı PR'da.
- [ ] `CODEOWNERS` değerlendirme ekibinden inceleme istendi.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?
Moderation Rule yorum moderasyonu için otomatik kural kaydıdır. Örneğin "risk puanı 80 üstüyse otomatik reddet". Yorum kaydedilince aktif kurallar sırayla denenir. Eşleşen kural yorumu reddeder, gizler ya da incelemeye alır.

## Bugünkü bağımlılıklar
### Bu kaydın bağlandığı kayıtlar
- Link alanı yok.
### Bu kayda dokunan kod
- `tradehub_core/api/moderation.py:18-30`: `_evaluate_rules` aktif kuralları okuyor
- `tradehub_core/api/moderation.py:220-235`: `list_active_rules` yöneticiye listeliyor
- `tradehub_core/setup/install.py:148-151`: kurulumda varsayılan iki kuralı tohumluyor (yazıyor)
- `tradehub_core/tradehub_core/doctype/listing_review/test_listing_review.py:1658`: yorum testi sayıyor
### hooks.py kayıtları
- Kayıt yok.

## Bağımlılık sorunları
1. Kayıt katalog bağlamında görünüyor ancak yalnız yorum bağlamı kullanıyor. `tradehub_core/api/moderation.py:18` tek okuyucudur. Harita yanlış bağlamı gösteriyor.
2. `tradehub_core/setup/install.py:148-151` kurulum kodu yama dosyasından fonksiyon içe aktarıyor. Tohum verisi bağlamın kendi `setup` dosyasında olmalı.

## Hedef tasarım
- Sahip bağlam `11-degerlendirme`, paket yolu `tradehub_core/reviews/`. Harita bu analizde değiştirilmez. Bağlam README dosyasında not edilir.
- Dışarıya açılan fonksiyon (`reviews/api.py`): `evaluate_moderation_rules(review)` karar sözlüğü verir. Başka bağlam bu kuralı doğrudan okumaz.
- Olay yok.
- Başka bağlamlara bağlantı yok.
- Denetleyicide kalacak doğrulamalar: `threshold_value` zorunlu türlerde boş olamaz. `banned_phrase` türünde `banned_phrases` boş olamaz. Bugün bu kontroller yok.

## Geçiş adımları
1. Denetleyiciye eşik ve ifade doğrulamasını ekleyin. Bağımsızdır.
2. Tohum fonksiyonunu `patches/init_review_phase6_fields.py` yerine `reviews/setup.py` içine alın. `install.py:148` oradan çağırır.
3. Bağlam haritasını güncelleyin ve `module` alanını "Reviews" yapın. 2. adımdan sonra gelir.

## Riskler ve testler
- Varsayılan kural pasifleştirilince migrate geri açmamalı. Test: `is_active=0` kural migrate sonrası pasif kalır (`test_mogem989_yorum_tohumlari.py` zaten var).
- Eşik boşken kural yorumları yanlış reddetmemeli. Test: `threshold_value` boş kural doğrulamada reddedilir.
