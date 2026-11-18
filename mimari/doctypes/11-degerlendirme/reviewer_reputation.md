# Reviewer Reputation

- Bağlam: 11-degerlendirme
- Tür: Ana kayıt
- Klasör: `tradehub_core/tradehub_core/doctype/reviewer_reputation`
- Denetleyici: `tradehub_core/tradehub_core/doctype/reviewer_reputation/reviewer_reputation.py` (5 satır)
- Önerilen sahip bağlam: 11-degerlendirme

## Epic

- Epic adı: Reviewer Reputation: 11-degerlendirme bağlamına taşıma
- Öncelik: Acil
- Faz: Faz 4
- Tahmini büyüklük: Orta

### User story

Bir geliştirici olarak, itibar hesabının yorum işlemini ortada bitirmemesini istiyorum.
Böylece yorum kaydı yarıda kalırsa itibar puanı yanlış yazılmaz.

### Kabul kriterleri

- [ ] `api/reputation.py:138` içindeki `frappe.db.commit()` çağrısı kaldırıldı.
- [ ] Yorum, oy ve ihbar kancaları tek bir kuyruk işine bağlı.
- [ ] KYB bilgisi 02-satici-magaza bağlamının `is_kyb_verified(user)` fonksiyonundan geliyor.
- [ ] `api/reputation.py` dosyası `reviews/reputation/` paketinde duruyor.
- [ ] Characterization test: `Reviewer Reputation` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- `doc_event` kancası içinde `frappe.db.commit()` çağırmayın. Bu çağrı Outbox desenini bozar.
- `KYB Verification` tablosunu doğrudan okumayın. Satıcı bağlamının fonksiyonunu kullanın.
- İtibar hesabını yorum kaydıyla aynı işlemde çalıştırmayın. Kuyruğa alın.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] İşlem geri alınınca itibar puanının yazılmadığını kanıtlayan test eklendi.
- [ ] Seviye hesabı testleri geçiyor.
- [ ] Kuyruk işinin tekrar çalışmaya dayanıklı olduğu test edildi.
- [ ] `import-linter` kontrolü geçiyor.
- [ ] 02-satici-magaza bağlamının `CODEOWNERS` sahibinden inceleme istendi.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?
Sistem, her yorumcuya bir itibar puanı verir. Bu kayıt puanı ve seviyeyi tutar. Seviye, yorumun ağırlığını etkiler. Her kullanıcının tek kaydı vardır.

## Bugünkü bağımlılıklar
### Bu kaydın bağlandığı kayıtlar
- `User` (`user`): başka bağlam (01-kimlik-erisim)
### Bu kayda dokunan kod
- `tradehub_core/api/reputation.py:121`: okuyor ve yazıyor (`reputation.py:135`, `reputation.py:137`)
- `tradehub_core/api/reputation.py:52`: okuyor (seviye ağırlığı)
- `tradehub_core/api/rating_engine.py:168`: okuyor
- `tradehub_core/api/analytics.py:128`: okuyor
- `tradehub_core/api/mobile_api.py:252`, `tradehub_core/api/storefront_api.py:95`: okuyor
### hooks.py kayıtları
- `tradehub_core/hooks.py:345`: zamanlanmış iş `tradehub_core.api.reputation.daily_recompute_all`.
- `tradehub_core/hooks.py:757`, `tradehub_core/hooks.py:769`, `tradehub_core/hooks.py:775`: yorum, oy ve ihbar kancaları puanı yeniden hesaplar.

## Bağımlılık sorunları
1. Puan hesabı satıcı bağlamının tablosunu okuyor. `_is_kyb_verified` `KYB Verification` kaydını okur (`tradehub_core/api/reputation.py:64`). Bu DocType 02-satici-magaza bağlamındadır.
2. Hesap, üç ayrı kanca ile aynı işlemde tetikleniyor. Yorum, oy ve ihbar kaydı yavaşlayabilir.
3. `recompute_user` işlemi kendisi bitiriyor. `tradehub_core/api/reputation.py:138` `frappe.db.commit()` çağırır. Bu fonksiyon `doc_event` kancasından da çalışır. Yorum kaydı yarıda kalırsa itibar puanı yine de yazılmış olur. Outbox deseni bu yüzden bozulur.

## Hedef tasarım
- Sahip bağlam ve paket yolu: `tradehub_core/reviews/reputation/`.
- Dışarıya açılan fonksiyon: `reviews.api.get_reviewer_tier(user)`.
- Yayınladığı olay: `reviewer.tier_changed` (user, tier, score).
- Dinlediği olaylar: `review.approved`, `review.voted`, `review.reported`, `seller.kyb_verified`.
- `user` Link alanı kalır. `kyb_verified` bir anlık görüntü alanıdır.
- Denetleyici boş kalır.

## Geçiş adımları
1. `KYB Verification` okumasını 02-satici-magaza bağlamının `is_kyb_verified(user)` fonksiyonuyla değiştirin.
2. Üç kancayı tek bir kuyruk işine bağlayın.
3. `api/reputation.py` dosyasını `reviews/reputation/` paketine taşıyın. Bu adım 2. adımdan sonra gelir.

## Riskler ve testler
- Seviye gecikmeli değişebilir. Kuyruk işi sonrası seviyeyi sınayan test ekleyin.
- Ağırlıklı puan seviyeye bağlıdır. Seviye değişince ağırlıklı puanın yenilendiğini sınayın.
