# Provider Operating Channel

- Bağlam: 07-lojistik
- Tür: Alt tablo
- Klasör: `tradehub_core/tradehub_core/doctype/provider_operating_channel`
- Denetleyici: `tradehub_core/tradehub_core/doctype/provider_operating_channel/provider_operating_channel.py` (8 satır)
- Önerilen sahip bağlam: 07-lojistik

## Epic

- Epic adı: Provider Operating Channel: 07-lojistik bağlamına taşıma
- Öncelik: Düşük
- Faz: Faz 5
- Tahmini büyüklük: Küçük

### User story

Bir geliştirici olarak, `Provider Operating Channel` kaydının lojistik modülünde durmasını istiyorum.
Böylece kaydın sahibi açık olur ve başka ekip kaydı yanlışlıkla değiştirmez.

### Kabul kriterleri

- [ ] DocType klasörü `tradehub_core/logistics/doctype/provider_operating_channel/` altında duruyor.
- [ ] JSON dosyasındaki `module` alanı "Logistics" değerinde.
- [ ] `tabDocType` modül değerini güncelleyen yama tekrar çalışınca hata vermiyor.
- [ ] Taşıma üst kayıt `Logistics Provider` ile aynı PR içinde yapıldı.
- [ ] Characterization test: `Provider Operating Channel` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- Satırı `Logistics Provider` dışından yazmayın.
- Kanalı satır bağlıyken silmeyin.
- Taşımayı önce test sitesinde denemeden canlıya göndermeyin. Modül değişikliği veritabanını etkiler.
- Bu tabloyu `Logistics Provider` kaydından ayrı taşımayın. Üst kayıt alt tabloyu bulamaz.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] Yama test sitesinde iki kez çalıştırıldı ve hata vermedi.
- [ ] `bench migrate` test sitesinde hatasız bitti.
- [ ] Taşıma sonrası `Logistics Provider` kaydı Desk ekranında açıldı.
- [ ] Lojistik ekibinden `CODEOWNERS` incelemesi istendi.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?

`Provider Operating Channel`, `Logistics Provider` kaydının `operating_channels` alt tablosudur. Bir taşıyıcının hangi kanallarda çalıştığını gösterir. Örneğin bir firma yalnız kargo kanalında çalışabilir.

## Bugünkü bağımlılıklar

### Bu kaydın bağlandığı kayıtlar

- `Shipping Channel` (`shipping_channel`, zorunlu): aynı bağlam

### Bu kayda dokunan kod

- Doğrudan isimle okuyan kod bulunamadı.
- `tradehub_core/patches/v15_log041_seed_provider_operating_channels.py:54`: yama satırları üst kayıt üzerinden yazıyor.

### hooks.py kayıtları

- Kayıt yok.

## Bağımlılık sorunları

Önemli bir bağımlılık sorunu bulunmadı.

## Hedef tasarım

- Sahip bağlam ve paket yolu: 07-lojistik, `tradehub_core/logistics/doctype/provider_operating_channel/`.
- Dışarıya açılan fonksiyonlar, olaylar ve bağlantılar: yok.

## Geçiş adımları

1. Üst kayıt `Logistics Provider` ile aynı PR içinde "Logistics" modülüne taşıyın.

## Riskler ve testler

- Kanal silinirse satır boş kalabilir. Kanal silme engeli testini ekleyin.
