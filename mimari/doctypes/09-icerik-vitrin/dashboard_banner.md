# Dashboard Banner

- Bağlam: 09-icerik-vitrin
- Tür: Ana kayıt
- Klasör: `tradehub_core/tradehub_core/doctype/dashboard_banner`
- Denetleyici: `tradehub_core/tradehub_core/doctype/dashboard_banner/dashboard_banner.py` (5 satır)
- Önerilen sahip bağlam: 14-platform-cekirdek. Kayıt mağaza vitrini değil, yönetim paneli öğesidir.

## Epic

- Epic adı: Dashboard Banner: 14-platform-cekirdek bağlamına taşıma
- Öncelik: Düşük
- Faz: Faz 4
- Tahmini büyüklük: Küçük

### User story

Bir platform yöneticisi olarak, panel duyurularının panel modülünde yönetilmesini istiyorum.
Böylece vitrin ekibinin işi panel şeridini bozmaz.

### Kabul kriterleri

- [ ] `Dashboard Banner` kaydı 14-platform-cekirdek bağlamında belgeleniyor.
- [ ] `api/banner.py` kodu `platform/` paketinde duruyor.
- [ ] Etkin şeritler sıra numarasına göre dönüyor.
- [ ] Characterization test: `Dashboard Banner` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- Bu kaydı mağaza vitrini koduna bağlamayın. Kayıt yalnız yönetim panelinde görünür.
- `setup/module_navigation_spec.py:1276` menü kaydını taşıma PR'ında unutmayın. Menü bağlantısı kırılır.
- Şeritleri misafir kullanıcıya açmayın. Uç nokta `allow_guest=False` kalmalı.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] Değişen davranış için önce başarısız olan bir test yazıldı.
- [ ] Ruff ve uygulama testleri yerelde geçiyor.
- [ ] `import-linter` kontrolü `tradehub_core.platform` için geçiyor.
- [ ] `CODEOWNERS` içindeki platform çekirdeği bağlamı sahibinden inceleme istendi.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?

Bu kayıt yönetim panelinin üstündeki duyuru şeritlerini tutar. Her kayıt başlık, bağlantı ve sıra numarası taşır.

## Bugünkü bağımlılıklar

### Bu kaydın bağlandığı kayıtlar

- Bu kaydın başka kayda bağlantısı yok.

### Bu kayda dokunan kod

- `tradehub_core/api/banner.py:8`: adını kullanıyor
- `tradehub_core/setup/module_navigation_spec.py:1274`: adını kullanıyor
- `tradehub_core/setup/module_navigation_spec.py:1276`: adını kullanıyor

### hooks.py kayıtları

- `hooks.py` içinde bu DocType için kayıt yok.

## Bağımlılık sorunları

1. Kayıt yanlış bağlamda. Kullanıcısı mağaza vitrini değil, panel ekranıdır. Kanıt: `setup/module_navigation_spec.py:1276`.

## Hedef tasarım

- Sahip bağlam ve paket yolu: `tradehub_core/platform/` paketi. 14-platform-cekirdek bağlamına taşınır.
- Dışarıya açılan fonksiyonlar: `platform/api.py` içinde `get_active_banners()`.
- Yayınladığı olaylar: Yok. Önbellek temizliği bağlam içinde kalır.
- Dinlediği olaylar: Yok.
- Başka bağlamlara bağlantılar: Başka bağlama bağlantı yok.
- Denetleyicide kalacak doğrulamalar: Ayrı doğrulama gerekmiyor. Önbellek temizliği kalır.
- Servise taşınacak iş kuralları: Okuma ve önbellek mantığı `api/banner.py` dosyasından `content/` paketine taşınır.

## Geçiş adımları

1. `api/banner.py` dosyasını bağlam paketine taşıyın. Eski yolda yalnız yeniden dışa aktarma bırakın.
2. `hooks.py` içindeki önbellek kancalarının yolunu yeni pakete çevirin.
3. DocType'ı `Content` modülüne taşıyın. JSON `module` alanını ve klasörü birlikte değiştirin.

## Riskler ve testler

- Panel şeridi kaybolabilir. Test: etkin kayıtlar sıra numarasıyla dönmeli.
