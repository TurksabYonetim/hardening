# Dashboard Widget Role

- Bağlam: 09-icerik-vitrin
- Tür: Alt tablo
- Klasör: `tradehub_core/tradehub_core/doctype/dashboard_widget_role`
- Denetleyici: `tradehub_core/tradehub_core/doctype/dashboard_widget_role/dashboard_widget_role.py` (5 satır)
- Önerilen sahip bağlam: 14-platform-cekirdek. Ebeveyni ile birlikte taşınır.

## Epic

- Epic adı: Dashboard Widget Role: 14-platform-cekirdek bağlamına taşıma
- Öncelik: Düşük
- Faz: Faz 5
- Tahmini büyüklük: Küçük

### User story

Bir geliştirici olarak, `Dashboard Widget Role` tablosunun ebeveyni `Dashboard Widget` ile aynı modülde durmasını istiyorum.
Böylece tabloyu kimin değiştireceği açık olur.

### Kabul kriterleri

- [ ] `Dashboard Widget Role` ve `Dashboard Widget` aynı Frappe modülünde duruyor.
- [ ] `Dashboard Widget` kaydı açılınca `Dashboard Widget Role` satırları eksiksiz görünüyor.
- [ ] `Dashboard Widget Role` satırlarını yalnız `tradehub_core.platform` paketi yazıyor.
- [ ] Characterization test: `Dashboard Widget Role` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- `Dashboard Widget Role` modülünü ebeveynden ayrı bir PR ile taşımayın. Alt tablo bağı kopar.
- Başka bağlamın kodundan `Dashboard Widget Role` satırı eklemeyin ya da silmeyin. Bu tabloyu yalnız `Dashboard Widget` sahibi değiştirir.
- Alan adlarını taşıma PR'ı içinde değiştirmeyin. Taşıma ile alan değişikliği ayrı PR olmalı.
- Rol satırlarını boş bırakan patch yazmayın. Boş liste göstergeyi herkese açabilir.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] Değişen davranış için önce başarısız olan bir test yazıldı.
- [ ] Ruff ve uygulama testleri yerelde geçiyor.
- [ ] `import-linter` kontrolü `tradehub_core.platform` için geçiyor.
- [ ] `CODEOWNERS` içindeki platform çekirdeği bağlamı sahibinden inceleme istendi.
- [ ] DocType modülü taşınırsa patch iki kez çalışınca hata vermiyor.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?

Bu alt tablo bir göstergeyi hangi rollerin görebileceğini listeler. Her satır bir Frappe rolüdür.

## Bugünkü bağımlılıklar

### Bu kaydın bağlandığı kayıtlar

- `Role` (`role`, Link): başka bağlam (Frappe çekirdeği)

### Bu kayda dokunan kod

- `tradehub_core/tradehub_core/doctype/dashboard_widget/dashboard_widget.json:290`: alt tablo ya da Link tanımı

### hooks.py kayıtları

- `hooks.py` içinde bu DocType için kayıt yok.

## Bağımlılık sorunları

Önemli bir bağımlılık sorunu bulunmadı.

## Hedef tasarım

- Sahip bağlam ve paket yolu: `tradehub_core/platform/dashboards/` paketi. Ebeveyni ile aynı yerde kalır.
- Dışarıya açılan fonksiyonlar: Ayrı fonksiyon gerekmez.
- Yayınladığı olaylar: Yok.
- Dinlediği olaylar: Yok.
- Başka bağlamlara bağlantılar: `role` Link alanı Frappe `Role` kaydına bağlı kalır.
- Denetleyicide kalacak doğrulamalar: Doğrulama gerekmiyor.
- Servise taşınacak iş kuralları: Taşınacak iş kuralı yok.

## Geçiş adımları

1. Ebeveyn `Dashboard Widget` ile aynı PR içinde taşıyın.

## Riskler ve testler

- Rol filtresi kaybolursa gösterge herkese açılır. Test: rolü olmayan kullanıcı göstergeyi görmemeli.
