# Data Processing Agreement

- Bağlam: 13-uyum-gizlilik
- Tür: Ana kayıt
- Klasör: `tradehub_core/tradehub_core/doctype/data_processing_agreement`
- Denetleyici: `tradehub_core/tradehub_core/doctype/data_processing_agreement/data_processing_agreement.py` (10 satır)
- Önerilen sahip bağlam: 13-uyum-gizlilik

## Epic

- Epic adı: Data Processing Agreement: 13-uyum-gizlilik bağlamına taşıma
- Öncelik: Önemli
- Faz: Faz 4
- Tahmini büyüklük: Orta

### User story

Bir platform yöneticisi olarak, bitişi yaklaşan veri işleme sözleşmelerini zamanında görmek istiyorum.
Böylece süresi dolmuş sözleşmeyle veri işlemem.

### Kabul kriterleri

- [ ] `seller_profile` Link hedefi doğrulandı. Hedef eskiyse patch ile düzeltildi.
- [ ] `check_expiring_dpas` görevi `privacy/tasks.py` içinde duruyor.
- [ ] 30 gün içinde biten sözleşme için tek bir `dpa.expiring` olayı yazılıyor.
- [ ] Hata mesajları `_()` ile yazılı.
- [ ] Characterization test: `Data Processing Agreement` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- İmza tarihi olmadan sözleşmeyi "Active" yapmayın.
- Sınır ötesi aktarımı mekanizma girmeden işaretlemeyin.
- Bitiş bildirimini `audit` paketine yeni kod olarak eklemeyin. İş gizlilik bağlamına aittir.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] Değişen davranış için önce başarısız olan bir test yazıldı.
- [ ] Ruff ve uygulama testleri yerelde geçiyor.
- [ ] `import-linter` kontrolü `tradehub_core.privacy` için geçiyor.
- [ ] `CODEOWNERS` içindeki gizlilik bağlamı sahibinden inceleme istendi.
- [ ] Yeni olay için sözleşme testi eklendi. Test olay alanlarını kontrol ediyor.
- [ ] Link hedefi patch'i iki kez çalışınca hata vermiyor.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?

Bu kayıt veri işleme sözleşmesini tutar. Sözleşme bir tedarikçi ya da satıcı ile yapılır. Kayıt imza tarihini, bitiş tarihini ve sınır ötesi aktarımı tutar. Haftalık görev, bitişi yaklaşan sözleşmeleri bildirir.

## Bugünkü bağımlılıklar

### Bu kaydın bağlandığı kayıtlar

- `User` (`party_user`, Link): başka bağlam (Frappe çekirdeği)
- `Seller Profile` (`seller_profile`, Link): başka bağlam (02-satici-magaza)
- `DPA Data Category` (`data_categories`, alt tablo): aynı bağlam

### Bu kayda dokunan kod

- `tradehub_core/audit/tasks.py:136`: adını kullanıyor
- `tradehub_core/media/pipeline/policy/slots/document-attachment.json:23`: adını kullanıyor
- `tradehub_core/setup/module_navigation_spec.py:1168`: adını kullanıyor

### hooks.py kayıtları

- `tradehub_core/hooks.py:434`: zamanlanmış görev `audit.tasks.check_expiring_dpas`.

## Bağımlılık sorunları

1. Sözleşme `Seller Profile` kaydına bağlı. Kanıt: `data_processing_agreement.json` içindeki `seller_profile` alanı. Proje belgeleri Seller Profile kaydının User Profile ve Admin Seller Profile ile birleştiğini söylüyor. Bu Link hedefi güncel olmayabilir. Durum doğrulanmadı.
2. Bitiş kontrolü `audit` paketinde duruyor. Kanıt: `audit/tasks.py:130` ve `hooks.py:434`. Gizlilik işi başka paketin zamanlanmış görevine bağlı.
3. Hata mesajları çeviri fonksiyonu kullanmıyor. Kanıt: `data_processing_agreement.py` içindeki `frappe.throw` satırları.

## Hedef tasarım

- Sahip bağlam ve paket yolu: `tradehub_core/privacy/` paketi ve yeni `Privacy` Frappe modülü.
- Dışarıya açılan fonksiyonlar: `privacy/api.py` içinde `get_active_dpa(seller)` fonksiyonu.
- Yayınladığı olaylar: `dpa.expiring`. Olay şu alanları taşır: `dpa_id`, `party`, `expires_at`. Bildirim bağlamı bu olayı dinler.
- Dinlediği olaylar: 02 bağlamının `seller.deleted` olayı. Sözleşme silinmez, durumu güncellenir.
- Başka bağlamlara bağlantılar: `seller_profile` Link alanı mağaza kök kaydına bağlanmalı. Mağaza kök kaydı `Admin Seller Profile` kaydıdır. `party_user` Link alanı kalır.
- Denetleyicide kalacak doğrulamalar: İmza tarihi ve aktarım mekanizması doğrulamaları kalır.
- Servise taşınacak iş kuralları: Bitiş bildirimi `privacy/tasks.py` içine taşınır.

## Geçiş adımları

1. `Seller Profile` Link hedefini doğrulayın. Hedef eskiyse `Admin Seller Profile` için patch yazın.
2. `check_expiring_dpas` fonksiyonunu `privacy/tasks.py` içine taşıyın. `hooks.py:434` satırını güncelleyin.
3. Bildirim e-postası yerine `dpa.expiring` olayını yayınlayın.
4. Hata mesajlarını `_()` ile sarın. DocType'ı `Privacy` modülüne taşıyın.

## Riskler ve testler

- Link hedefi değişirse eski kayıtlar açılmayabilir. Test: patch sonrası tüm sözleşmeler açılmalı.
- Bitiş bildirimi kaybolabilir. Test: 30 gün içinde biten sözleşme için tek olay yazılmalı.
