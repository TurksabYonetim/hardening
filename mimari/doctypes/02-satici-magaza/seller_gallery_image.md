# Seller Gallery Image

- Bağlam: 02-satici-magaza
- Tür: Alt tablo
- Klasör: `tradehub_core/tradehub_core/doctype/seller_gallery_image`
- Denetleyici: `tradehub_core/tradehub_core/doctype/seller_gallery_image/seller_gallery_image.py` (5 satır)
- Önerilen sahip bağlam: 02-satici-magaza

## Epic

- Epic adı: Seller Gallery Image: 02-satici-magaza bağlamına taşıma
- Öncelik: Önemli
- Faz: Faz 4
- Tahmini büyüklük: Küçük

### User story

Bir satıcı olarak, galeri görsellerimin yalnız benim mağazamda değişmesini istiyorum.
Böylece başka satıcı galerime yazamaz.

### Kabul kriterleri

- [ ] Alt tablodaki kiracı kancasının çalışıp çalışmadığı bir testle ölçüldü.
- [ ] Kanca çalışmıyorsa `hooks.py:934-937` kaydı kaldırıldı.
- [ ] `list_gallery_media` fonksiyonu var. Medya kodu bunu kullanıyor.
- [ ] Characterization test: `Seller Gallery Image` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- Alt tablo için `hooks.py` içine yeni `doc_events` eklemeyin. Frappe alt tabloda bu olayları çalıştırmaz.
- Medya kodundan galeri tablosunu doğrudan sorgulamayın.
- Galeriyi mağaza kaydı dışında bir kayda bağlamayın.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] Değişen davranış için önce başarısız olan test yazıldı.
- [ ] Ruff ve ilgili testler yerelde geçiyor.
- [ ] `import-linter` kontrolü yeni ihlal üretmiyor.
- [ ] `CODEOWNERS` içindeki 02-satici-magaza sahibi inceleyici olarak eklendi.
- [ ] `tradehub_core/tests/test_abac_gate_enforcement.py` geçiyor.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?
Bu tablo mağaza galerisindeki görsel ve videoları tutar. Her satırın bir kategorisi ve sırası vardır. Örneğin üretim ya da kalite kontrol görseli olabilir. Üst kayıt `Admin Seller Profile` kaydıdır.

## Bugünkü bağımlılıklar
### Bu kaydın bağlandığı kayıtlar
- Link alanı yok.
### Bu kayda dokunan kod
- `tradehub_core/api/seller.py` (2 yer): okuyor ve yazıyor
- `tradehub_core/media/magaza_gorseli.py:136`: görsel adreslerini okuyor
- `tradehub_core/media/pipeline_bridge.py` (2 yer): görsel işleme kuyruğu
- `tradehub_core/media/file_isolation.py`: dosya erişimini tanıyor
### hooks.py kayıtları
- `tradehub_core/hooks.py:934-937`: `before_insert` ve `validate` olayları kiracı izolasyonu
- `tradehub_core/hooks.py:1092`: `permission_query_conditions`
- `tradehub_core/hooks.py:1219`: `has_permission`

## Bağımlılık sorunları
1. Alt tabloya kiracı kancası bağlı. Kanıt: `hooks.py:934`. Frappe alt tablo satırları için `doc_events` çalıştırmaz. Satır üst kayıtla kaydedilir. Bu kanca büyük olasılıkla hiç çalışmıyor (doğrulanmadı).
2. Medya kodu alt tabloyu doğrudan sorguluyor. Kanıt: `media/magaza_gorseli.py:136`.

## Hedef tasarım
- Sahip bağlam: 02-satici-magaza. `Admin Seller Profile` ile aynı paket.
- Dışa açık fonksiyon: `list_gallery_media(store) -> list[GalleryItem]`.
- Görsel değişince `seller.store.updated` olayı yayınlanır. Alan: `changed_fields=["gallery_images"]`. Medya bağlamı bunu dinler.
- Denetleyici boş kalabilir.

## Geçiş adımları
1. Kancanın çalışıp çalışmadığını bir testle ölçün. Çalışmıyorsa `hooks.py:934-937` kaydını kaldırın.
2. `list_gallery_media` fonksiyonunu ekleyin. Medya okumasını buna bağlayın.

## Riskler ve testler
- Başka mağazanın galerisine yazılmamalı. `tradehub_core/tests/test_abac_gate_enforcement.py` korunmalı.
