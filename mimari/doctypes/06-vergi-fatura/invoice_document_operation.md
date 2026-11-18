# Invoice Document Operation

- Bağlam: 06-vergi-fatura
- Tür: Kayıt defteri (log)
- Klasör: `tradehub_core/tradehub_core/doctype/invoice_document_operation`
- Denetleyici: `tradehub_core/tradehub_core/doctype/invoice_document_operation/invoice_document_operation.py` (20 satır)
- Önerilen sahip bağlam: 06-vergi-fatura

## Epic

- Epic adı: Invoice Document Operation: 06-vergi-fatura bağlamına taşıma
- Öncelik: Düşük
- Faz: Faz 3
- Tahmini büyüklük: Küçük

### User story

Bir geliştirici olarak, fatura komutlarının iki kez çalışmamasını istiyorum.
Böylece aynı istek iki belge üretmez.

### Kabul kriterleri

- [ ] `planned_delete` kapısı `shared/retention.py` içinden geliyor.
- [ ] Aynı anahtar ve içerik iki kez gelince tek belge kalıyor.
- [ ] Kayıt `tax/invoicing/` paketinde.
- [ ] Characterization test: `Invoice Document Operation` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- Kaydı elle silmeyin. Silme yalnız planlı temizlikte serbesttir.
- Aynı anahtarla farklı içerik kabul etmeyin.
- `listing_purge` paketini yeni yerde içe aktarmayın.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] Tekillik testi geçiyor.
- [ ] Temizlik kapısı testi geçiyor.
- [ ] `ruff` kontrolü geçiyor.
- [ ] `CODEOWNERS` sahibinden inceleme istendi.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?
`Invoice Document Operation` fatura komutlarının tekillik kaydıdır. Tekillik, aynı isteğin iki kez işlenmemesi demektir. Aynı anahtar ve aynı içerik gelirse aynı sonuç döner. Farklı içerik gelirse istek reddedilir.

## Bugünkü bağımlılıklar
### Bu kaydın bağlandığı kayıtlar
- `User` (`actor`): framework kaydı

### Bu kayda dokunan kod
- `tradehub_core/invoice_documents/idempotency.py:31`: yazıyor ve okuyor
- `tradehub_core/invoice_documents/permissions.py:23`: izin denetimi

### Denetleyicinin kendi dış çağrıları
- `invoice_document_operation.py:9`: `listing_purge.guards.planned_delete` çağrısı. Silme yalnız planlı temizlikte serbesttir.

### hooks.py kayıtları
- `hooks.py:1586` ve `hooks.py:1589`: liste ve kayıt izni.

## Bağımlılık sorunları
1. Denetleyici `listing_purge` paketine bağlı (`invoice_document_operation.py:9`). Bu bağ ödeme kayıtlarında da var. Temizlik paketi değişirse fatura kaydı silinemez. Bağ küçük ama ortak bir kurala dönüşmeli.

## Hedef tasarım
- Sahip bağlam: 06-vergi-fatura. Paket yolu: `tradehub_core/tax/invoicing/`.
- Dışarıya açılan fonksiyon yoktur. Kayıt iç kullanım içindir.
- Olay yoktur.
- `planned_delete` kontrolü paylaşılan çekirdeğe taşınır: `shared/retention.py`.
- Denetleyicide kalacak doğrulama: kayıt yazıldıktan sonra değişmemeli.

## Geçiş adımları
1. `planned_delete` fonksiyonunu `shared/retention.py` içine taşıyın. Eski yolda yönlendirme bırakın. Bu adım bütün ödeme kayıtlarını da etkiler.
2. Kaydı `Order Invoice Document` ile birlikte taşıyın.

## Riskler ve testler
- Aynı komut iki belge üretebilir. Test: aynı anahtar ve içerik iki kez gelince tek belge kalmalı.
