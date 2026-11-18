# Listing View Counter

- Bağlam: 03c-kesif
- Tür: Kayıt defteri (sayaç)
- Klasör: `tradehub_core/tradehub_core/doctype/listing_view_counter`
- Denetleyici: `tradehub_core/tradehub_core/doctype/listing_view_counter/listing_view_counter.py` (14 satır)
- Önerilen sahip bağlam: 03c-kesif

## Epic

- Epic adı: Listing View Counter: 03c-kesif bağlamına taşıma
- Öncelik: Önemli
- Faz: Faz 4
- Tahmini büyüklük: Küçük

### User story

Bir geliştirici olarak, görüntüleme sayacının ürün silmeyi kilitlememesini istiyorum.
Böylece katalog kodu keşif tablosunu adıyla tanımak zorunda kalmaz.

### Kabul kriterleri

- [ ] `listing` alanı `Data`. Yama değer koruyor. `api/listing.py:112` satırı kaldırıldı.
- [ ] `catalog.listing_deleted` dinleyicisi satırı siliyor. Test var.
- [ ] `Listing.view_count` ile ilişki kararı yazılı.
- [ ] 24 saat geçen sayaç sıfırlanıyor. Test geçiyor.
- [ ] `module` alanı "Discovery" oldu.
- [ ] Characterization test: `Listing View Counter` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- `listing` alanını Link bırakmayın. Sayaç ürün silmeyi kilitler.
- Katalog kodundan bu tabloyu silmeyin.
- UPSERT sorgusunu iki ayrı sorguya bölmeyin. Eşzamanlı sayım bozulur.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] Tür değişimi yaması idempotent.
- [ ] Eşzamanlı artış testi geçiyor.
- [ ] Olay dinleyici testi eklendi.
- [ ] `CODEOWNERS` keşif ekibinden inceleme istendi.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?
Listing View Counter bir ürünün son 24 saatteki görüntülenme sayısını tutar. Vitrin "son 24 saatte 37 kişi baktı" bilgisini buradan okur. Saatlik görev eski sayaçları sıfırlar.

## Bugünkü bağımlılıklar
### Bu kaydın bağlandığı kayıtlar
- `Listing` (listing): başka bağlam (03a-katalog)
### Bu kayda dokunan kod
- `tradehub_core/api/social_proof.py:444,531`: `record_view` ham SQL UPSERT ile sayacı artırıyor
- `tradehub_core/api/social_proof.py:152,317-321`: sosyal kanıt okuyor
- `tradehub_core/api/social_proof.py:521`: saatlik sıfırlama görevi
- `tradehub_core/api/listing.py:112`: ürün silinirken temizlenecek analitik tablolar listesinde (03a kodu siliyor)
- `tradehub_core/listing_purge/preview.py:19`: ürün silme aracı bağı sayıyor
### hooks.py kayıtları
- `tradehub_core/hooks.py:250`: saatlik `reset_view_counters_rolling_24h`

## Bağımlılık sorunları
1. `tradehub_core/api/listing.py:107-116` katalog kodu keşif tablolarını adıyla tanıyor ve siliyor. Katalog yeni analitik tabloyu bilmek zorunda kalıyor.
2. `Listing.view_count` alanı da var (`listing.py:725` `increment_view_count`). İki sayaç iki yerde. Hangisi doğru belirsiz.

## Hedef tasarım
- Sahip bağlam `03c-kesif`, paket yolu `tradehub_core/discovery/signals/`.
- Dışarıya açılan fonksiyonlar (`discovery/api.py`): `record_view(listing, user, session)` ve `get_views_24h(listings)`.
- Yayınladığı olay yok (çok sık olay üretir). Dinlediği olay: `catalog.listing_deleted` (satırı siler).
- Başka bağlamlara bağlantı: `listing` alanı `Data` olmalı. Sayaç ürün silmeyi kilitlememeli. Bugün Link.
- Denetleyicide doğrulama yok.

## Geçiş adımları
1. `listing` alanını `Data` yapın. Yama değer korur. `api/listing.py:112` satırı kalkar.
2. `catalog.listing_deleted` dinleyicisi satırı siler. Outbox gerekir.
3. `Listing.view_count` ile ilişki kararı: toplam sayaç olaydan mı güncellenir, kaldırılır mı? 03a ve 03c ekibi karar verir.
4. `module` alanını "Discovery" yapın.

## Riskler ve testler
- 24 saat geçen sayaç sıfırlanmalı. Test: `last_event` 25 saat önce olan satır sıfırlanır.
- Eşzamanlı görüntüleme sayacı doğru artırmalı. Test: UPSERT iki paralel çağrıda 2 verir.
