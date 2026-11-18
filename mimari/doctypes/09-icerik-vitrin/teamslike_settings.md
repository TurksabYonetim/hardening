# Teamslike Settings

- Bağlam: 09-icerik-vitrin
- Tür: Ayar (single)
- Klasör: `tradehub_core/tradehub_core/doctype/teamslike_settings`
- Denetleyici: `tradehub_core/tradehub_core/doctype/teamslike_settings/teamslike_settings.py` (5 satır)
- Önerilen sahip bağlam: 12-bildirim-iletisim. Kayıt sohbet servisinin bağlantı ayarıdır.

## Epic

- Epic adı: Teamslike Settings: 12-bildirim-iletisim bağlamına taşıma
- Öncelik: Önemli
- Faz: Faz 4
- Tahmini büyüklük: Küçük

### User story

Bir geliştirici olarak, sohbet ayarının sohbet koduyla aynı bağlamda durmasını istiyorum.
Böylece sohbet ekibi ayarı tek yerden yönetir.

### Kabul kriterleri

- [ ] Ayar 12-bildirim-iletisim bağlamının modülünde duruyor.
- [ ] `api/chat.py` kodu 12 bağlamının paketinde duruyor.
- [ ] Bağlantı testi uç noktası "ok" dönüyor.
- [ ] Characterization test: `Teamslike Settings` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- Erişim anahtarını sohbet çıktısına ya da hata kaydına yazmayın. Gizli bilgi sızar.
- Gizli değerleri `site_config.json` önceliğini atlayarak okumayın. Yedekten dönen site yanlış sunucuya bağlanır.
- Bu ayarı vitrin kodundan okumayın. Okuma sohbet bağlamının API'siyle yapılmalı.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] Değişen davranış için önce başarısız olan bir test yazıldı.
- [ ] Ruff ve uygulama testleri yerelde geçiyor.
- [ ] `import-linter` kontrolü `tradehub_core.notifications` için geçiyor.
- [ ] `CODEOWNERS` içindeki bildirim bağlamı sahibinden inceleme istendi.
- [ ] Gizli alanlar hata mesajlarında maskeli görünüyor.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?

Bu ayar dış sohbet servisi Teamslike bağlantısını tutar. Ayar adres, kiracı bilgisi, yönetici hesabı ve imza anahtarını içerir. Sohbet API'si bu ayarı her istekte okur.

## Bugünkü bağımlılıklar

### Bu kaydın bağlandığı kayıtlar

- Bu kaydın başka kayda bağlantısı yok.

### Bu kayda dokunan kod

- `tradehub_core/api/chat.py:828`: yazıyor
- `tradehub_core/api/chat.py:829`: yazıyor
- `tradehub_core/api/chat.py:71`: okuyor
- `tradehub_core/api/chat.py:111`: adını kullanıyor
- 2 patch ya da tohum dosyası bu adı kullanıyor. Örnek: `tradehub_core/patches/init_teamslike_settings.py`.

### hooks.py kayıtları

- `hooks.py` içinde bu DocType için kayıt yok.

## Bağımlılık sorunları

1. Kayıt yanlış bağlamda. Tek kullanıcısı sohbet kodudur. Kanıt: `api/chat.py:71`.
2. Yönetici erişim anahtarı `Long Text` alanında duruyor. Kanıt: `teamslike_settings.json` içindeki `admin_access_token` alanı. Bu alan şifreli değil. Bu bir bağımlılık değil, güvenlik notudur.

## Hedef tasarım

- Sahip bağlam ve paket yolu: `tradehub_core/notifications/chat/` paketi. 12-bildirim-iletisim bağlamına taşınır.
- Dışarıya açılan fonksiyonlar: `notifications/api.py` içinde `get_chat_status()`.
- Yayınladığı olaylar: Yok.
- Dinlediği olaylar: Yok.
- Başka bağlamlara bağlantılar: Başka bağlama bağlantı yok.
- Denetleyicide kalacak doğrulamalar: Ayrı doğrulama gerekmiyor.
- Servise taşınacak iş kuralları: Ayar okuma `api/chat.py:61` içindeki `_conf` fonksiyonunda kalır.

## Geçiş adımları

1. `api/chat.py` dosyasını 12 bağlamının paketine taşıyın.
2. DocType'ı 12 bağlamının modülüne taşıyın.
3. `admin_access_token` alanını `Password` türüne çevirmeyi ayrı PR ile değerlendirin.

## Riskler ve testler

- Sohbet servisi bağlantısı kopabilir. Test: bağlantı testi uç noktası "ok" dönmeli.
