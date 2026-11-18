# API Scope

- Bağlam: 01-kimlik-erisim
- Tür: Alt tablo
- Klasör: `tradehub_core/tradehub_core/doctype/api_scope`
- Denetleyici: `tradehub_core/tradehub_core/doctype/api_scope/api_scope.py` (5 satır)
- Önerilen sahip bağlam: 01-kimlik-erisim

## Epic

- Epic adı: API Scope: 01-kimlik-erisim bağlamına taşıma
- Öncelik: Düşük
- Faz: Faz 4
- Tahmini büyüklük: Küçük

### User story

Bir geliştirici olarak, bir uygulamanın iznini tek fonksiyonla sormak istiyorum.
Böylece izin listesi tek yerde durur.

### Kabul kriterleri

- [ ] `identity.api.has_scope(app_name, scope)` fonksiyonu var.
- [ ] İzin listesi `identity/contracts.py` içinde tek sabit olarak duruyor.
- [ ] Her izin değeri için `has_scope` testi geçiyor.
- [ ] Characterization test: `API Scope` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- `API Scope` satırlarını üst kayıt olmadan doğrudan yazmayın. Satırlar `API Application` ile birlikte kaydedilir.
- İzin değerini kod içinde düz metin olarak tekrar yazmayın. Sabiti `contracts.py` içinden alın.
- Yeni izin eklerken başka bağlamın JSON dosyasına dokunmayın.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] Değişen davranış için önce başarısız olan test yazıldı.
- [ ] Ruff ve ilgili testler yerelde geçiyor.
- [ ] `import-linter` kontrolü yeni ihlal üretmiyor.
- [ ] `CODEOWNERS` içindeki 01-kimlik-erisim sahibi inceleyici olarak eklendi.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?
Bu tablo bir API uygulamasının izinlerini tutar. Her satırda tek bir `scope` değeri vardır. Örneğin `catalog:read` ya da `stock:write` bir izindir.

## Bugünkü bağımlılıklar
### Bu kaydın bağlandığı kayıtlar
- Link alanı yok. Tablo yalnız `API Application` kaydının `scopes` alanında kullanılır.
### Bu kayda dokunan kod
- Kod bu DocType adını doğrudan anmıyor. Satırlar `API Application` üzerinden okunur (doğrulanmadı: kapsam okuma yeri `tradehub_core/api/v1/_catalog_auth.py` içinde aranmalı).
### hooks.py kayıtları
- Kayıt yok.

## Bağımlılık sorunları
1. Önemli bir bağımlılık sorunu bulunmadı.
2. İzin değerleri JSON içindeki `Select` listesinde sabit. Yeni izin eklemek DocType değişikliği ister. Bu durum başka ekiplerin aynı JSON dosyasında çakışmasına yol açabilir.

## Hedef tasarım
- Sahip bağlam: 01-kimlik-erisim. Paket yolu: `tradehub_core/identity/api_clients/`.
- Dışa açık fonksiyon: `has_scope(app_name, scope) -> bool` (`tradehub_core/identity/api.py`).
- Olay yayınlamaz ve dinlemez.
- Başka bağlama bağlantısı yok.
- Denetleyicide yalnız izin değerinin listede olması kontrol edilir.

## Geçiş adımları
1. İzin listesini `tradehub_core/identity/contracts.py` içinde sabit olarak tanımlayın.
2. `has_scope` fonksiyonunu ekleyin. Kapsam okuyan kodu bu fonksiyona bağlayın.
3. JSON `module` alanını `API Application` ile aynı adımda taşıyın.

## Riskler ve testler
- Yanlış izin listesi dış uygulamaları engelleyebilir. Her izin için `has_scope` testi ekleyin.
