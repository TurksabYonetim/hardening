# Seller Product

- Bağlam: 03b-ice-aktarma
- Tür: Ana kayıt
- Klasör: `tradehub_core/tradehub_core/doctype/seller_product`
- Denetleyici: `tradehub_core/tradehub_core/doctype/seller_product/seller_product.py` (5 satır)
- Önerilen sahip bağlam: 03b-ice-aktarma (kaldırma adayı). Not: Bu kayıt eski bir satıcı ürün taslağı görünüyor. Hiçbir iş kodu okumuyor ya da yazmıyor.

## Epic

- Epic adı: Seller Product: 03b-ice-aktarma bağlamına taşıma
- Öncelik: Düşük
- Faz: Faz 4
- Tahmini büyüklük: Küçük

### User story

Bir platform yöneticisi olarak, kullanılmayan eski ürün taslağı kaydının kaldırılmasını istiyorum.
Böylece satıcı yanlış yere ürün girmez ve izinsiz tablo kalmaz.

### Kabul kriterleri

- [ ] Üretimdeki kayıt sayısı ölçüldü ve raporda yazılı.
- [ ] Kayıt varsa `Listing` taslağına çeviren yama var ve sayı logluyor.
- [ ] Çalışma alanı kısayolu (`satıcı_paneli.json:96-97`) kaldırıldı.
- [ ] DocType silindi ve kalan satır 0.
- [ ] Characterization test: `Seller Product` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- Veri sayısını ölçmeden DocType'ı silmeyin.
- Bu tabloya yeni özellik eklemeyin. `Listing` tek ürün kaydıdır.
- İzin sorgusu eklemeden tabloyu açık bırakmayın.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] Ölçüm sonucu PR açıklamasında.
- [ ] Taşıma yaması test sitesinde denendi.
- [ ] Kısayol kaldırma testi geçiyor.
- [ ] `CODEOWNERS` içe aktarma ve mağaza ekiplerinden inceleme istendi.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?
Seller Product satıcının basit ürün kaydıdır. Ad, fiyat aralığı, en az sipariş ve görsel tutar. Bugünkü ürün kartı `Listing` kaydıdır. Bu kayıt onun öncülü olabilir. Yalnız satıcı paneli çalışma alanında kısayolu var.

## Bugünkü bağımlılıklar
### Bu kaydın bağlandığı kayıtlar
- `Admin Seller Profile` (seller): başka bağlam (02-satici-magaza)
- `Seller Category` (category): başka bağlam (02-satici-magaza)
### Bu kayda dokunan kod
- `tradehub_core/tradehub_core/workspace/satıcı_paneli/satıcı_paneli.json:96-97`: çalışma alanı kısayolu
- Yamalar: `user_profile_v1/09_update_link_references.py`, `16_validate_migration.py`, `fix_seller_profile_owner.py`, `add_seller_role_to_workspace.py` (geçmiş taşıma)
- İş kodu yok (grep ile doğrulandı: `.py` dosyalarında yalnız yamalar).
### hooks.py kayıtları
- Kayıt yok.

## Bağımlılık sorunları
1. Kayıt kullanılmıyor. Şema borcudur. Satıcı panelinde kısayolu duruyor. Satıcı yanlış yere ürün girebilir.
2. İzin sorgusu yok. `Marketplace Seller` tüm kayıtları görür. Tenant izolasyonu yok. Veri varsa sızıntı riski.

## Hedef tasarım
- Öneri: Kaldırın. Veri varsa `Listing` kaydına taşıyın.
- Dışarıya açılan fonksiyon yok.
- Olay yok.
- Başka bağlamlara bağlantı yok (kaldırılınca).
- Denetleyici yok.

## Geçiş adımları
1. Üretimde kayıt sayısını ölçün (`frappe.db.count("Seller Product")`). Doğrulanmadı: bu analiz veri tabanına bakmadı.
2. Kayıt varsa `Listing` taslağına çeviren yama yazın.
3. Çalışma alanı kısayolunu kaldırın (`satıcı_paneli.json:96-97`).
4. DocType'ı silen yama yazın. 2. ve 3. adımdan sonra gelir.

## Riskler ve testler
- Silme öncesi veri kaybı olmamalı. Test: yama taşıma sayısını loglar ve kalan satır 0 olur.
