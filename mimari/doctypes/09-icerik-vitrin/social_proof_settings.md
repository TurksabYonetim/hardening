# Social Proof Settings

- Bağlam: 09-icerik-vitrin
- Tür: Ayar (single)
- Klasör: `tradehub_core/tradehub_core/doctype/social_proof_settings`
- Denetleyici: `tradehub_core/tradehub_core/doctype/social_proof_settings/social_proof_settings.py` (18 satır)
- Önerilen sahip bağlam: 09-icerik-vitrin

## Epic

- Epic adı: Social Proof Settings: 09-icerik-vitrin bağlamına taşıma
- Öncelik: Önemli
- Faz: Faz 4
- Tahmini büyüklük: Orta

### User story

Bir geliştirici olarak, satış rozetlerini sipariş tablosuna bakmadan hesaplamak istiyorum.
Böylece sipariş ekibi alan değiştirince rozetler bozulmaz.

### Kabul kriterleri

- [ ] `api/social_proof.py` içinde `tabOrder` ve `tabOrder Item` geçen SQL kalmadı.
- [ ] Satış sayıları `ordering/api.py` içindeki okuma modelinden geliyor.
- [ ] `hooks.py:711` kaydı kaldırıldı. Önbellek `order.status_changed` olayıyla temizleniyor.
- [ ] Aynı veriyle eski ve yeni sayım aynı sonucu veriyor.
- [ ] Characterization test: `Social Proof Settings` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- Sipariş tablosuna yeni ham SQL eklemeyin. Sipariş bağlamının okuma fonksiyonunu kullanın.
- `Order` kancasına yeni vitrin işleyicisi eklemeyin. Olaya abone olun.
- Eşik değerlerini kod içine sabit yazmayın. Değerler bu ayardan okunmalı.
- `hooks.py` içine doğrudan yeni `doc_events` kaydı eklenmedi.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] Değişen davranış için önce başarısız olan bir test yazıldı.
- [ ] Ruff ve uygulama testleri yerelde geçiyor.
- [ ] `import-linter` kontrolü `tradehub_core.content` için geçiyor.
- [ ] `CODEOWNERS` içindeki içerik bağlamı sahibinden inceleme istendi.
- [ ] Yeni olay için sözleşme testi eklendi. Test olay alanlarını kontrol ediyor.
- [ ] Abone aynı olayı iki kez alınca ikinci işlem hiçbir şey değiştirmiyor.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?

Bu ayar ürün sayfasındaki sosyal kanıt rozetlerinin eşiklerini tutar. Sosyal kanıt, "çok satan" gibi güven veren göstergelerdir. Her metrik eşik değerini geçince gösterilir.

## Bugünkü bağımlılıklar

### Bu kaydın bağlandığı kayıtlar

- Bu kaydın başka kayda bağlantısı yok.

### Bu kayda dokunan kod

- `tradehub_core/api/social_proof.py:54`: okuyor
- `tradehub_core/api/social_proof.py:645`: okuyor

### hooks.py kayıtları

- `tradehub_core/hooks.py:711`: `Order` doc_events kaydı `api.social_proof.invalidate_for_order` fonksiyonunu çağırıyor.
- `tradehub_core/hooks.py:250`: zamanlanmış görev `social_proof.reset_view_counters_rolling_24h`.

## Bağımlılık sorunları

1. Rozet kodu sipariş tablolarını ham SQL ile okuyor. Kanıt: `api/social_proof.py:115` ve `api/social_proof.py:116` satırlarında `tabOrder Item` ve `tabOrder` var. Sipariş ekibi alan değiştirirse rozetler bozulur.
2. Sipariş kancası vitrin kodunu doğrudan çağırıyor. Kanıt: `hooks.py:711` satırında `social_proof.invalidate_for_order` var.
3. Rozet kodu favori ve ilan sayaç tablolarını da okuyor. Kanıt: `api/social_proof.py:129` ve `api/social_proof.py:152`.

## Hedef tasarım

- Sahip bağlam ve paket yolu: `tradehub_core/content/` paketi ve `Content` Frappe modülü.
- Dışarıya açılan fonksiyonlar: `content/api.py` içinde `get_social_proof_signals(listing)`.
- Yayınladığı olaylar: Yok.
- Dinlediği olaylar: 04 bağlamının `order.status_changed` olayı. Abone, ilgili ilanın önbelleğini siler.
- Başka bağlamlara bağlantılar: Başka bağlama Link yok. Satış sayısı 04 bağlamının okuma modelinden gelir. Örnek: `ordering/api.py` içinde `get_sales_counts(listings)`.
- Denetleyicide kalacak doğrulamalar: Önbellek temizliği kalır.
- Servise taşınacak iş kuralları: Satış ve alıcı sayımı sipariş bağlamının okuma modeline taşınır.

## Geçiş adımları

1. Sipariş bağlamı `get_sales_counts()` ve `get_distinct_buyers()` fonksiyonlarını açsın. Bu adım önce gelir.
2. `social_proof.py` içindeki ham SQL bu fonksiyonlara geçsin.
3. `hooks.py:711` kaydını `order.status_changed` aboneliğine çevirin.
4. `api/social_proof.py` dosyasını `content/` paketine taşıyın.

## Riskler ve testler

- Rozet sayıları değişebilir. Test: aynı veriyle eski ve yeni sayım eşit olmalı.
- Önbellek temizlenmezse eski sayı görünür. Test: sipariş durumu değişince rozet yenilenmeli.
