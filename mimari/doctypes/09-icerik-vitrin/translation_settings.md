# Translation Settings

- Bağlam: 09-icerik-vitrin
- Tür: Ayar (single)
- Klasör: `tradehub_core/tradehub_core/doctype/translation_settings`
- Denetleyici: `tradehub_core/tradehub_core/doctype/translation_settings/translation_settings.py` (5 satır)
- Önerilen sahip bağlam: 11-degerlendirme. Ayarı yalnız yorum çevirisi, moderasyon ve duygu analizi kullanıyor.

## Epic

- Epic adı: Translation Settings: 11-degerlendirme bağlamına taşıma
- Öncelik: Önemli
- Faz: Faz 4
- Tahmini büyüklük: Orta

### User story

Bir geliştirici olarak, yapay zekâ sağlayıcı ayarını tek fonksiyondan okumak istiyorum.
Böylece çeviri, moderasyon ve duygu analizi aynı anda bozulmaz.

### Kabul kriterleri

- [ ] `get_ai_provider_config()` fonksiyonu 11 bağlamının `api.py` dosyasında var.
- [ ] `api/translation.py`, `api/moderation.py` ve `api/sentiment.py` bu fonksiyonu kullanıyor.
- [ ] Kota dolunca çeviri deneme moduna düşüyor.
- [ ] Ayar 11-degerlendirme bağlamının modülünde duruyor.
- [ ] Characterization test: `Translation Settings` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- API anahtarlarını düz metin alana taşımayın. Alanlar `Password` türünde kalmalı.
- Ayarı yeni bir modülde doğrudan `frappe.get_single` ile okumayın. Ortak fonksiyonu kullanın.
- Kota sayacını sıfırlayan ikinci bir görev eklemeyin. Sayaç tek görevle sıfırlanmalı.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] Değişen davranış için önce başarısız olan bir test yazıldı.
- [ ] Ruff ve uygulama testleri yerelde geçiyor.
- [ ] `import-linter` kontrolü `tradehub_core.reviews` için geçiyor.
- [ ] `CODEOWNERS` içindeki değerlendirme bağlamı sahibinden inceleme istendi.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?

Bu ayar otomatik çeviri sağlayıcısını tutar. Sağlayıcı OpenAI, DeepL ya da deneme modu olabilir. Ayar günlük kotayı ve aylık harcama sınırını da tutar.

## Bugünkü bağımlılıklar

### Bu kaydın bağlandığı kayıtlar

- Bu kaydın başka kayda bağlantısı yok.

### Bu kayda dokunan kod

- `tradehub_core/api/translation.py:135`: yazıyor
- `tradehub_core/api/translation.py:136`: yazıyor
- `tradehub_core/api/moderation.py:144`: okuyor
- `tradehub_core/api/moderation.py:199`: okuyor
- `tradehub_core/api/sentiment.py:123`: okuyor
- `tradehub_core/api/translation.py:47`: okuyor
- `tradehub_core/api/translation.py:91`: okuyor
- `tradehub_core/api/moderation.py:153`: adını kullanıyor
- `tradehub_core/api/moderation.py:154`: adını kullanıyor
- `tradehub_core/api/sentiment.py:133`: adını kullanıyor
- `tradehub_core/api/sentiment.py:134`: adını kullanıyor
- `tradehub_core/api/translation.py:65`: adını kullanıyor
- 2 patch ya da tohum dosyası bu adı kullanıyor. Örnek: `tradehub_core/patches/init_review_phase5_fields.py`.

### hooks.py kayıtları

- `hooks.py` içinde bu DocType için kayıt yok.

## Bağımlılık sorunları

1. Üç ayrı modül aynı ayarı okuyor. Kanıt: `api/translation.py:47`, `api/moderation.py:144` ve `api/sentiment.py:123`. Biri alan değiştirirse diğer ikisi bozulur.
2. Kullanım sayacı ayarın içinde duruyor. Kanıt: `usage_today` alanı. Ayar kaydı her çeviride değişiyor olabilir. Durum doğrulanmadı.

## Hedef tasarım

- Sahip bağlam ve paket yolu: `tradehub_core/reviews/` paketi. 11-degerlendirme bağlamına taşınır.
- Dışarıya açılan fonksiyonlar: `reviews/api.py` içinde `get_ai_provider_config()` fonksiyonu. Üç modül bunu kullanır.
- Yayınladığı olaylar: Yok.
- Dinlediği olaylar: Yok.
- Başka bağlamlara bağlantılar: Başka bağlama bağlantı yok.
- Denetleyicide kalacak doğrulamalar: Ayrı doğrulama gerekmiyor.
- Servise taşınacak iş kuralları: Kota sayacı ayrı bir sayaç kaydına ya da Redis değerine taşınabilir.

## Geçiş adımları

1. `get_ai_provider_config()` fonksiyonunu açın.
2. Üç modül bu fonksiyonu kullansın.
3. DocType'ı 11 bağlamının modülüne taşıyın.

## Riskler ve testler

- Kota aşılabilir. Test: kota dolunca çeviri deneme moduna düşmeli.
