# Helpdesk SLA Policy

- Bağlam: 12-bildirim-iletisim
- Tür: Ana kayıt
- Klasör: `tradehub_core/tradehub_core/doctype/helpdesk_sla_policy`
- Denetleyici: `tradehub_core/tradehub_core/doctype/helpdesk_sla_policy/helpdesk_sla_policy.py` (18 satır)
- Önerilen sahip bağlam: 12-bildirim-iletisim

## Epic

- Epic adı: Helpdesk SLA Policy: 12-bildirim-iletisim bağlamına taşıma
- Öncelik: Önemli
- Faz: Faz 4
- Tahmini büyüklük: Orta

### User story

Bir platform yöneticisi olarak, destek süresi ihlallerini izlemek istiyorum.
Böylece aynı ihlal için tekrar uyarı almam.

### Kabul kriterleri

- [ ] Zaman sınırını aşan bilet için aynı uyarı tekrarlanmaz.
- [ ] `import-linter` denetimi, dış bağlamın `Helpdesk SLA Policy` işleyicisini içe aktarmasını engeller.
- [ ] Geçiş testi, mevcut `Helpdesk SLA Policy` kaydının sahip paket üzerinden okunabildiğini gösterir.
- [ ] Characterization test: `Helpdesk SLA Policy` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- Bilet yorumunu politika denetleyicisinde oluşturmayın. Harici işlemi servis yürütür.
- Tekrar işaretini kaldırmayın. Zamanlayıcı aynı bileti yeniden görebilir.
- `Helpdesk SLA Policy` için dış bağlama doğrudan yazma yolu açmayın. Yazım kuralları `notifications` paketinde kalır.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] `Helpdesk SLA Policy` için kabul koşullarını otomatik testte doğrulayın.
- [ ] `notifications` iç dosyalarına dış erişimleri `import-linter` ile kontrol edin.
- [ ] `CODEOWNERS` üzerinden `notifications` paketinin sahibinden inceleme isteyin.
- [ ] `tradehub_core/utils/sla_checker.py:127` bağımlılığının geçiş sonrası çağrı yolunu inceleyin.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?
Destek için hizmet süresi hedeflerini tanımlar. `tradehub_core/tradehub_core/doctype/helpdesk_sla_policy/helpdesk_sla_policy.json:68`
Denetleyici, kayıt yazılmadan önce kayıt kurallarını uygular. `tradehub_core/tradehub_core/doctype/helpdesk_sla_policy/helpdesk_sla_policy.py:8`

## Bugünkü bağımlılıklar
### Bu kaydın bağlandığı kayıtlar
- Bağlantı alanı bulunmadı. `tradehub_core/tradehub_core/doctype/helpdesk_sla_policy/helpdesk_sla_policy.json:68`
### Bu kayda dokunan kod
- `tradehub_core/utils/sla_checker.py:60`: okuyor
### hooks.py kayıtları
- `tradehub_core/hooks.py:235` İlgili kayıt dışı tetikleyici. `"tradehub_core.utils.sla_checker.check_sla_breaches",`

## Bağımlılık sorunları
1. Süre denetimi harici destek bileti yorumunu doğrudan oluşturuyor. Destek uygulaması değişirse uyarı akışı etkilenebilir. `tradehub_core/utils/sla_checker.py:127`

## Hedef tasarım
- `12-bildirim-iletisim` bu kayda `tradehub_core/notifications/` paketinde sahip olsun.
- Dışarıya açılacak fonksiyonlar. `tradehub_core/notifications/api.py` içinde bu kayıt için ayrı fonksiyon önerilmiyor.
- Olaylar. Bu kayıt için ayrıca bağlamlar arası olay önerilmiyor.
- Bağlantılar. Bu kayıt için yeni bağlamlar arası bağlantı veya anlık görüntü alanı önerilmiyor.
- Doğrulama ve iş akışı. Süre doğrulaması denetleyicide kalsın. Destek servisi gecikme hesabını ve bilet işlemini koordine etsin.

## Geçiş adımları
1. Mevcut davranış için aşağıdaki testi ekle. Sahip paket için mevcut davranışı sabitle.
2. İlk adımdan sonra harici bilet yorumunu Helpdesk bağdaştırıcısına taşı.
3. İkinci adımdan sonra modül kaydını taşı. Eski Python girişlerini geçiş süresince yönlendir.

## Riskler ve testler
- Zaman sınırını aşan bilet için aynı uyarı tekrarlanmaz.
