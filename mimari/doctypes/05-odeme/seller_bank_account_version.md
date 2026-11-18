# Seller Bank Account Version

- Bağlam: 05-odeme
- Tür: Kayıt defteri (log)
- Klasör: `tradehub_core/tradehub_core/doctype/seller_bank_account_version`
- Denetleyici: `tradehub_core/tradehub_core/doctype/seller_bank_account_version/seller_bank_account_version.py` (76 satır)
- Önerilen sahip bağlam: 05-odeme

## Epic

- Epic adı: Seller Bank Account Version: 05-odeme bağlamına taşıma
- Öncelik: Acil
- Faz: Faz 3
- Tahmini büyüklük: Orta

### User story

Bir satıcı olarak, banka hesabımı tek bir yerden güncellemek istiyorum.
Böylece alıcılar her zaman doğru hesaba ödeme yapar.

### Kabul kriterleri

- [ ] `get_payment_target` ve `get_account_status` fonksiyonları var.
- [ ] Mağaza denetleyicisi `payments.bank_accounts` içe aktarmıyor.
- [ ] IBAN değişince yeni sürüm "Unverified" oluyor.
- [ ] Sipariş anındaki talimat hesap değişikliğinden etkilenmiyor.
- [ ] Characterization test: `Seller Bank Account Version` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- Var olan sürümü değiştirmeyin. Yeni sürüm açın.
- Eski sahiplik onayını yeni hesaba taşımayın.
- Mağaza kaydındaki IBAN alanını ikinci asıl kaynak gibi kullanmayın.
- Başka paketten `payments.bank_accounts` içe aktarmayın.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] Sürüm değişmezlik testi geçiyor.
- [ ] Hesap değişikliği testi geçiyor.
- [ ] `import-linter` kontrolü geçiyor.
- [ ] Mağaza ekibinden inceleme istendi.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?
`Seller Bank Account Version` satıcının ödeme hesabının değişmez sürümüdür. Hesap her değiştiğinde yeni sürüm açılır. Eski sürüm "superseded" olur. Sürüm IBAN, hesap sahibi ve banka adını tutar. Hesap sahipliği onayı da sürüm üzerinde durur.

## Bugünkü bağımlılıklar
### Bu kaydın bağlandığı kayıtlar
- `Admin Seller Profile` (`seller`): başka bağlam (02-satici-magaza)
- `User` (`registered_by`): framework kaydı
- `Seller Bank Account Version` (`superseded_by`): aynı bağlam
- `User` (`decided_by`): framework kaydı

### Bu kayda dokunan kod
- `tradehub_core/payments/bank_accounts.py:216`: yazıyor (`_insert_version`)
- `tradehub_core/payments/bank_accounts.py:244`: yazıyor (`_supersede`)
- `tradehub_core/payments/bank_accounts.py:130`: mağaza kaydının IBAN alanlarını okuyor (02-satici-magaza)
- `tradehub_core/tradehub_core/doctype/admin_seller_profile/admin_seller_profile.py:62`: mağaza denetleyicisi `payments.bank_accounts.sync_from_profile` çağırır
- `tradehub_core/api/v1/auth.py:841`: `sync_from_profile` çağırır
- `tradehub_core/contracts/service.py:226`: okuyor (sözleşmede ödeme hedefi)
- `tradehub_core/api/order.py:838`: okuyor (alıcıya banka bilgisi)
- `tradehub_core/payments/bank_statements.py:95`: okuyor

### hooks.py kayıtları
- Kayıt yok. Mağaza kaydının `on_update` olayı denetleyici içinden çağrılır (`admin_seller_profile.py:60`).

## Bağımlılık sorunları
1. Hesabın asıl verisi mağaza kaydında, sürümü ödeme bağlamında. Mağaza denetleyicisi ödeme iç modülünü çağırır (`admin_seller_profile.py:62`). Ödeme modülü mağaza tablosunu okur (`bank_accounts.py:130`). İki bağlam birbirini döngüsel olarak bilir. Bu sorun 02-satici-magaza bağlamını bağlar.
2. Banka bilgisi okuması dört pakette dağınık (`contracts/service.py:226`, `api/order.py:838`, `api/payment.py:577`, `api/seller_terms.py:85`).

## Hedef tasarım
- Sahip bağlam: 05-odeme. Paket yolu: `tradehub_core/payments/bank_accounts.py`.
- Hesap verisinin tek sahibi ödeme bağlamı olur. Mağaza kaydındaki `iban`, `account_holder`, `bank_name` alanları bir geçiş süresince anlık görüntü olarak kalır.
- Dışarıya açılan fonksiyonlar (`payments/api.py`):
  - `register_seller_account(seller, iban, holder, bank_name, source) -> str`
  - `get_payment_target(seller, readonly: bool) -> PaymentTarget`
  - `get_account_status(seller) -> AccountStatus`
- Yayınladığı olaylar: `seller_account.changed`. Veri `seller`, `version`, `ownership_status`.
- Dinlediği olaylar: `store.bank_details_submitted` (02-satici-magaza). Geçiş süresince mağaza kaydı bu olayı yayınlar.
- Denetleyicide kalacak doğrulamalar: sürüm değişmezliği (`seller_bank_account_version.py:49`).

## Geçiş adımları
1. `payments/api.py` içinden `get_payment_target` ve `get_account_status` fonksiyonlarını verin. Diğer paketler bu iki fonksiyonu çağırsın.
2. `admin_seller_profile.py:62` çağrısını `store.bank_details_submitted` olayına çevirin. Bu adım olay altyapısından sonra gelir. Kayıt eşzamanlı kalmalı mı, ürün sahibiyle karar verin.
3. Banka bilgisi girişini `api/v1/seller_bank_account.py` üzerinden tek yola indirin.
4. Mağaza kaydındaki banka alanlarını salt okunur yapın.

## Riskler ve testler
- Eski onay yeni hesaba taşınabilir. Test: IBAN değişince yeni sürüm "Unverified" olmalı.
- Alıcı eski IBAN'a para gönderebilir. Test: sipariş anındaki talimat yeni hesap değişikliğinden etkilenmemeli.
