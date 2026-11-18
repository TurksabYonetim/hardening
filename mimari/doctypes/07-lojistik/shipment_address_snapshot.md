# Shipment Address Snapshot

- Bağlam: 07-lojistik
- Tür: Alt tablo
- Klasör: `tradehub_core/tradehub_core/doctype/shipment_address_snapshot`
- Denetleyici: `tradehub_core/tradehub_core/doctype/shipment_address_snapshot/shipment_address_snapshot.py` (8 satır)
- Önerilen sahip bağlam: 07-lojistik

## Epic

- Epic adı: Shipment Address Snapshot: 07-lojistik bağlamına taşıma
- Öncelik: Acil
- Faz: Faz 3
- Tahmini büyüklük: Küçük

### User story

Bir geliştirici olarak, gizlilik kodunun adres kopyasını lojistik fonksiyonuyla anonim yapmasını istiyorum.
Böylece alan adı değişince hesap silme bozulmaz.

### Kabul kriterleri

- [ ] `tradehub_core/logistics/api.py` içinde `anonymize_address_snapshots` fonksiyonu var.
- [ ] `privacy/account_deletion.py` adres kopyası tablosuna doğrudan yazmıyor. Bu fonksiyonu çağırıyor.
- [ ] Hesap silme sonrası kopyanın kişisel alanları anonim. Bunu bir test gösteriyor.
- [ ] Dolu kopya satırları değiştirilemiyor. Değişmezlik testi geçiyor.
- [ ] Characterization test: `Shipment Address Snapshot` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- `privacy/` içinden bu tabloya yeni doğrudan yazma eklemeyin. Yazma lojistik fonksiyonundan geçmeli.
- Kopya alanlarını sevkiyat açıldıktan sonra güncellemeyin. Kopya o anın adresidir.
- `source_address` alanını zorunlu yapmayın. Hesap silinince bu bağ boşalır.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] Hesap silme testi ve ertelenmiş anonimleştirme testi geçiyor.
- [ ] Kopya değişmezliği testi geçiyor.
- [ ] Gizlilik ekibinden `CODEOWNERS` incelemesi istendi.
- [ ] `import-linter` kontrolü geçiyor.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?

`Shipment Address Snapshot`, `Shipment` kaydının `address_snapshots` alt tablosudur. Sevkiyat açıldığında çıkış ve varış adresinin kopyasını tutar. Adres sonradan değişse de sevkiyattaki kopya değişmez.

## Bugünkü bağımlılıklar

### Bu kaydın bağlandığı kayıtlar

- `Addresses` (`source_address`): başka bağlam (01-kimlik-erisim)

### Bu kayda dokunan kod

- `tradehub_core/logistics/hooks.py:89`: yazıyor. Sevkiyat eklenirken kopyayı alıyor.
- `tradehub_core/logistics/hooks.py:587`: okuyor. Siparişin teslim adresini `Order` kaydından okuyor.
- `tradehub_core/logistics/hooks.py:552`: okuyor. Satıcının çıkış adresini okuyor.
- `tradehub_core/privacy/account_deletion.py:269`: yazıyor. Hesap silinince `source_address` bağını boşaltıyor.
- `tradehub_core/privacy/deferred_anonymization.py:24`: yazıyor. 90 gün sonra kişisel alanları anonim yapıyor.
- `tradehub_core/tradehub_core/doctype/shipment/shipment.py:326`: denetleyici dolu kopyaların değişmesini engelliyor.

### hooks.py kayıtları

- Doğrudan kayıt yok. Kopya `Shipment` kaydının `before_insert` kancasında alınır (`tradehub_core/hooks.py:1031`).

## Bağımlılık sorunları

1. Gizlilik kodu lojistiğin alt tablosuna doğrudan yazıyor. Kanıt: `tradehub_core/privacy/account_deletion.py:269`. Lojistik ekibi alan adını değiştirirse hesap silme bozulur (13-uyum-gizlilik).
2. Lojistik kopya alırken `Order` ve `Addresses` kayıtlarını doğrudan okuyor. Kanıt: `tradehub_core/logistics/hooks.py:596`. Sipariş ekibi adres alanını değiştirirse sevkiyat kopyası boş kalır.

## Hedef tasarım

- Sahip bağlam ve paket yolu: 07-lojistik, `tradehub_core/logistics/doctype/shipment_address_snapshot/`.
- Dışarıya açılan fonksiyonlar: `anonymize_address_snapshots(addresses: list[str], reason: str)`. Gizlilik bağlamı bu fonksiyonu çağırır.
- Dinlediği olaylar: `user.account_deleted`. Bu olay fonksiyon çağrısının yerine geçebilir.
- Başka bağlamlara bağlantılar: `source_address` Link alanı kalır. Adres verisi `order.confirmed` olay verisinden gelir.
- Denetleyicide kalacak doğrulamalar: kopya değişmezliği (üst kayıtta).

## Geçiş adımları

1. `anonymize_address_snapshots` fonksiyonunu lojistik `api.py` içine ekleyin. İçeride bugünkü mantığı kullanın.
2. `privacy/account_deletion.py` bu fonksiyonu çağırsın.
3. `order.confirmed` olayı hazır olunca adres verisini olaydan alın.

## Riskler ve testler

- Kişisel veri silinmeyebilir. Hesap silme sonrası kopyanın anonim olduğunu test edin.
- Kopya değişmezliği bozulabilir. Değişmezlik testini koruyun.
