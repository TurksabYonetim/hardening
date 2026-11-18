# Seller Inquiry

- Bağlam: 04-siparis
- Tür: Ana kayıt
- Klasör: `tradehub_core/tradehub_core/doctype/seller_inquiry`
- Denetleyici: `tradehub_core/tradehub_core/doctype/seller_inquiry/seller_inquiry.py` (5 satır)
- Önerilen sahip bağlam: 12-bildirim-iletisim. Kayıt alıcının mağazaya yazdığı bir mesajdır. Sipariş ya da ödeme ile bağı yoktur.

## Epic

- Epic adı: Seller Inquiry: 12-bildirim-iletisim bağlamına taşıma
- Öncelik: Düşük
- Faz: Faz 4
- Tahmini büyüklük: Küçük

### User story

Bir satıcı olarak, gelen soruları iletişim ekranında yönetmek istiyorum.
Böylece mesajlar tek yerde durur.

### Kabul kriterleri

- [ ] Mesaj uç noktaları `messaging/inquiries.py` içinde.
- [ ] Eski uç nokta adresleri çalışıyor.
- [ ] Satıcı yalnız kendi mağazasının mesajlarını listeliyor.
- [ ] CRM dönüşümü ad ve e-postayı doğru taşıyor.
- [ ] Characterization test: `Seller Inquiry` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- Bu kaydı sipariş paketine bağlamayın. Kayıt bir iletişim mesajıdır.
- Kiracı izolasyonu kancasını kaldırmayın (`hooks.py:926`).
- `module` alanını Faz 5 öncesinde değiştirmeyin.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] Kiracı izolasyonu testi geçiyor.
- [ ] CRM dönüşüm testi geçiyor.
- [ ] 12-bildirim-iletisim sahibinden onay alındı.
- [ ] `CODEOWNERS` kaydı güncellendi.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?
`Seller Inquiry` ziyaretçinin ya da alıcının satıcıya gönderdiği sorudur. Kayıt gönderenin adını, e-postasını ve mesajını tutar. Satıcı mesajı okur ve cevap yazar. Satıcı mesajı CRM adayına da çevirebilir.

## Bugünkü bağımlılıklar
### Bu kaydın bağlandığı kayıtlar
- `Admin Seller Profile` (`seller`): başka bağlam (02-satici-magaza)
- `User` (`buyer`, `replied_by`): framework kaydı

### Bu kayda dokunan kod
- `tradehub_core/api/seller.py:1900`: yazıyor (mesajı açar)
- `tradehub_core/api/seller.py:2041`: yazıyor (`is_read`)
- `tradehub_core/api/seller.py:2131`: yazıyor (`is_trashed`)
- `tradehub_core/api/seller.py:2007`: okuyor (satıcı listesi)
- `tradehub_core/api/seller_crm.py:153`: okuyor (CRM adayına çevirir)
- `tradehub_core/api/rfq.py:380`: okuyor (gelen kutusu listesi)
- `tradehub_core/api/rfq.py:759`: okuyor
- `tradehub_core/seo_helper/setup/install.py:133`: özel alan kurar (SEO atfı)

### hooks.py kayıtları
- `hooks.py:926`: `before_insert` ve `validate` olaylarında kiracı izolasyonu çalışır.
- `hooks.py:1099` ve `hooks.py:1225`: liste ve kayıt izni `permissions.py` içindedir.
- `hooks.py:1408`: SEO atıf işleyicisi `after_insert` olayına eklenir.

## Bağımlılık sorunları
Önemli bir bağımlılık sorunu bulunmadı. Kayıt yanlış bağlamda duruyor. Bu yüzden sipariş geliştiricisi ile iletişim geliştiricisi aynı klasöre dokunuyor.

## Hedef tasarım
- Sahip bağlam: 12-bildirim-iletisim. Paket yolu: `tradehub_core/messaging/inquiries.py`.
- Dışarıya açılan fonksiyonlar: `messaging.api.send_inquiry(...)` ve `messaging.api.get_inquiry_for_crm(name)`.
- Yayınladığı olaylar: `inquiry.received`. Veri `inquiry`, `seller`, `buyer`.
- Dinlediği olaylar: yok.
- Başka bağlamlara bağlantılar: `seller` Link alanı kalır.
- Denetleyicide kalacak doğrulamalar: yok. Kiracı izolasyonu `hooks.py:926` kaydında kalır.

## Geçiş adımları
1. 12-bildirim-iletisim sahibiyle taşıma kararını onaylayın.
2. `api/seller.py:1900` ile `api/seller.py:2131` arasındaki mesaj uç noktalarını `messaging/inquiries.py` içine taşıyın. Eski adres korunmalı.
3. DocType JSON `module` alanını yeni modüle çevirin.

## Riskler ve testler
- Satıcı başka mağazanın mesajını görebilir. Test: satıcı yalnız kendi mağazasının mesajlarını listelemeli.
- CRM dönüşümü bozulabilir. Test: mesaj CRM adayına dönünce ad ve e-posta doğru taşınmalı.
