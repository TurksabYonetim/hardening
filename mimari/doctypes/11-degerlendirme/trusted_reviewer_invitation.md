# Trusted Reviewer Invitation

- Bağlam: 11-degerlendirme
- Tür: Ana kayıt
- Klasör: `tradehub_core/tradehub_core/doctype/trusted_reviewer_invitation`
- Denetleyici: `tradehub_core/tradehub_core/doctype/trusted_reviewer_invitation/trusted_reviewer_invitation.py` (5 satır)
- Önerilen sahip bağlam: 11-degerlendirme

## Epic

- Epic adı: Trusted Reviewer Invitation: 11-degerlendirme bağlamına taşıma
- Öncelik: Önemli
- Faz: Faz 4
- Tahmini büyüklük: Orta

### User story

Bir platform yöneticisi olarak, güvenilir yorumcu davetlerinin doğru durumda kalmasını istiyorum.
Böylece yorum yazan kişinin daveti açık görünmez.

### Kabul kriterleri

- [ ] Hata mesajlarının hepsi `_()` ile sarılı.
- [ ] Gereksiz kiracı kancaları `hooks.py` kaydından kaldırıldı.
- [ ] Toplu davet `catalog.listing_published` olayıyla çalışıyor. `Listing` tablosu taranmıyor.
- [ ] `review.submitted` olayı gelince davet "Reviewed" durumuna geçiyor.
- [ ] Characterization test: `Trusted Reviewer Invitation` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- Toplu davette `Listing` tablosunu doğrudan taramayın. Katalog olayını dinleyin.
- Hata mesajını çıplak metinle yazmayın. Proje kuralı `_()` ister.
- Satıcı alanı olmayan bu kayda kiracı kancası eklemeyin.
- Daveti bildirmek için bildirim kodunu doğrudan çağırmayın. `reviewer.invited` olayını yayınlayın.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] Davet, kabul ve ret testleri geçiyor.
- [ ] Yorum sonrası davet durumunu kanıtlayan test eklendi.
- [ ] `reviewer.invited` için sözleşme testi eklendi.
- [ ] `import-linter` kontrolü geçiyor.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?
Platform, güvenilir yorumcuları yeni ürünleri denemeye davet eder. Bu kayıt daveti ve durumunu tutar. Davetli yorum yazınca kayıt yoruma bağlanır.

## Bugünkü bağımlılıklar
### Bu kaydın bağlandığı kayıtlar
- `User` (`user`): başka bağlam (01-kimlik-erisim)
- `Listing` (`listing`): başka bağlam (03a-katalog)
- `Listing Review` (`review`): aynı bağlam
### Bu kayda dokunan kod
- `tradehub_core/api/reputation.py:242`: yazıyor (yeni davet)
- `tradehub_core/api/reputation.py:281` ve `tradehub_core/api/reputation.py:299`: yazıyor (kabul ve ret)
- `tradehub_core/api/reputation.py:336`: yazıyor (zamanlanmış toplu davet)
- `tradehub_core/api/analytics.py:153`: okuyor
- `tradehub_core/tradehub_core/doctype/listing_review/listing_review.py:50`: yazıyor (yorum silinince bağı boşaltır)
### hooks.py kayıtları
- `tradehub_core/hooks.py:946`: `before_insert` ve `validate` kiracı kancaları.
- `tradehub_core/hooks.py:424`: zamanlanmış iş `tradehub_core.api.reputation.send_trusted_reviewer_invitations`.
- `tradehub_core/hooks.py:1090` ve `tradehub_core/hooks.py:1217`: okuma izni kuralları.

## Bağımlılık sorunları
1. Toplu davet katalog tablosunu tarıyor. `send_trusted_reviewer_invitations` etkin `Listing` kayıtlarını okur (`tradehub_core/api/reputation.py:348`).
2. Kiracı kancaları iş yapmaz. Kayıtta satıcı alanı yoktur (`tradehub_core/utils/tenant.py:237`).
3. Hata mesajları çeviri işlevi olmadan yazılmış. Örneğin `tradehub_core/api/reputation.py:215` çıplak metin kullanır. Proje kuralı `_()` ister.
4. `review` alanının davet akışında dolduğu yer bulunmadı. Bu doğrulanmadı.

## Hedef tasarım
- Sahip bağlam ve paket yolu: `tradehub_core/reviews/reputation/`.
- Dışarıya açılan fonksiyonlar: `reviews.api.invite_trusted_reviewer(user, listing)`, `accept_invitation(name)`, `decline_invitation(name)`.
- Yayınladığı olay: `reviewer.invited` (invitation, user, listing). Bildirim bağlamı bu olayla haber verir.
- Dinlediği olaylar: `catalog.listing_published` (listing) ve `review.submitted`. İkinci olay daveti "Reviewed" yapar.
- `user`, `listing` ve `review` Link alanları kalır.
- Denetleyiciye durum geçiş kuralı eklenebilir.

## Geçiş adımları
1. Hata mesajlarını `_()` ile sarın.
2. Gereksiz kiracı kancalarını kaldırın.
3. Toplu davet taramasını `catalog.listing_published` olayına çevirin. Bu adım olay yayınlayıcısı hazır olunca yapılır.
4. `review.submitted` olayı ile daveti "Reviewed" durumuna geçirin.

## Riskler ve testler
- Aynı kullanıcıya aynı ürün için iki davet gidebilir. Aktif davet kontrolünü sınayın.
- Süresi geçen davet açık kalabilir. "Expired" geçişi için test ekleyin.
