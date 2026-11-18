# Supported Currency

- Bağlam: 05-odeme
- Tür: Ana kayıt
- Klasör: `tradehub_core/tradehub_core/doctype/supported_currency`
- Denetleyici: `tradehub_core/tradehub_core/doctype/supported_currency/supported_currency.py` (32 satır)
- Önerilen sahip bağlam: 14-platform-cekirdek, paylaşılan çekirdek (`tradehub_core/shared/money/`)

## Epic

- Epic adı: Supported Currency: 14-platform-cekirdek bağlamına taşıma
- Öncelik: Düşük
- Faz: Faz 4
- Tahmini büyüklük: Küçük

### User story

Bir geliştirici olarak, açık para birimlerini tek bir yerden okumak istiyorum.
Böylece yeni birim her ekranda aynı anda görünür.

### Kabul kriterleri

- [ ] `shared.money.supported_currencies` fonksiyonu var.
- [ ] `hooks.py:550` kaydı yeni yolu gösteriyor.
- [ ] Birim açılınca önbellek temizleniyor.
- [ ] Characterization test: `Supported Currency` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- Kurulum yamasını tekrar çalışınca kopya kayıt açacak şekilde yazmayın.
- Para birimi listesini koda gömmeyin.
- `module` alanını Faz 5 öncesinde değiştirmeyin.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] Önbellek testi geçiyor.
- [ ] Yama tekrar çalıştırıldı ve kopya açmadı.
- [ ] `ruff` kontrolü geçiyor.
- [ ] Platform ekibinden inceleme istendi.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?
`Supported Currency` sitede açık olan para birimlerinin listesidir. Kayıt sembolü, Türkçe ve İngilizce adı ve ondalık sayısını tutar. Görünüm sırası `display_order` alanındadır.

## Bugünkü bağımlılıklar
### Bu kaydın bağlandığı kayıtlar
- `Currency` (`currency_code`): framework kaydı

### Bu kayda dokunan kod
- `tradehub_core/setup/install.py:290`: yazıyor (kurulumda ilk liste)
- `tradehub_core/patches/v15_11_09_para_birimi_sirasi_gbp.py:30`: yazıyor (yama)
- `tradehub_core/api/currency.py:127`: okuyor (önbellekli)
- `tradehub_core/services/tcmb.py:88`: okuyor (hangi kurların çekileceği)

### hooks.py kayıtları
- `hooks.py:550`: `on_update`, `after_insert` ve `on_trash` olayları `api.currency.invalidate_currency_cache` çağırır.

## Bağımlılık sorunları
Önemli bir bağımlılık sorunu bulunmadı. Kayıt yanlış bağlamda duruyor. Para birimi listesi bütün bağlamların ortak verisidir.

## Hedef tasarım
- Sahip bağlam: paylaşılan çekirdek. Paket yolu: `tradehub_core/shared/money/`.
- Dışarıya açılan fonksiyon: `shared.money.supported_currencies() -> list[CurrencyView]`.
- Olay yoktur. Önbellek temizliği aynı paketin içinde kalır.
- Denetleyicide kalacak doğrulamalar: `Currency` kaydından otomatik doldurma (`supported_currency.py:24`).

## Geçiş adımları
1. `Currency Rate Pair` raporundaki 1. adımla birlikte taşıyın.
2. `hooks.py:550` kaydını yeni yola çevirin.

## Riskler ve testler
- Yeni para birimi görünmeyebilir. Test: birim açılınca önbellek temizlenmeli ve listede görünmeli.
