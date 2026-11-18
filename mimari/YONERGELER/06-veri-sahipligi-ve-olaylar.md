# Veri sahipliği, olay güvenliği ve veritabanı değişikliği yönergesi

Bu yönerge dört riski kapatır:

1. Bir bağlamın başka bağlamın tablosuna yazması.
2. Olayın gecikmesi.
3. Olayın iki kez gelmesi ya da hiç gelmemesi.
4. Hatalı bir patch'in canlı veriyi bozması.

---

## 1. Her tablonun bir sahibi vardır

- `architecture/ownership.toml` dosyası her DocType'ın sahip bağlamını yazar.
- Dosya `mimari/_veri/baglamlar.json` verisinden üretilir.

Bu kural üç katmanda denetlenir.

### Katman 1: Kod taraması (CI)

`semgrep` aracı şu kalıpları arar:

- `frappe.db.set_value("<başka bağlamın DocType'ı>", ...)`
- `frappe.db.sql("UPDATE `tab<başka bağlamın DocType'ı>` ...")`
- `frappe.get_doc("<başka bağlamın DocType'ı>", ...).save()`
- f-string ile kurulan SQL

Kural dosyası `architecture/semgrep/*.yml` yolunda durur.

### Katman 2: Import kontrolü (CI)

`import-linter` aracı bir bağlamın başka bağlamın iç dosyasını import etmesini durdurur. Yalnız `api.py` ve `contracts.py` import edilebilir.

### Katman 3: Çalışma anı kontrolü (testlerde)

Testler çalışırken bir **yazma koruyucusu** açıktır. Koruyucu her veritabanı yazımında şunu kontrol eder: Yazan kod, tablonun sahibi olan bağlamdan mı geliyor?

- Koruyucu `frappe.db.sql` ve `Document.db_insert`, `db_update` çağrılarını izler.
- Yazan kodun paketini çağrı yığınından bulur.
- Sahip değilse testi başarısız yapar.

Bu kontrol yalnız test ortamında açıktır. Canlıda yalnız kayıt tutar. Kayıt sayısı [metrik yönergesinde](07-metrikler.md) izlenir.

### İstisna

Geçiş sırasında bazı eski yazımlar kalır. Her istisna `architecture/exceptions.toml` dosyasına yazılır. Her istisnanın bir issue numarası ve bitiş fazı vardır. İstisna sayısı yalnız azalabilir. Artarsa CI PR'ı durdurur.

---

## 2. Gecikme sorunu: sorgu ile olay ayrılır

Bu yönteme **CQRS** denir. Okuma ve yazma işleri ayrı yollardan yapılır.

- **Sonucu hemen gereken işler sorgudur.** Örnek: Sepette vergi tutarını göstermek. Bu işte olay kullanılmaz. Sipariş bağlamı `tax.api.quote_order_taxes()` fonksiyonunu doğrudan çağırır. Sonuç aynı istekte gelir.
- **Sonucu beklemeyen işler olaydır.** Örnek: Sevkiyat taslağı oluşturmak. Bu iş birkaç saniye sonra olabilir.
- Sipariş kaydında vergi alanları sipariş anında yazılır. Bu yüzden ekran eksik tutar göstermez.
- Olayla gelen bir sonuç bekleniyorsa ekran "Hesaplanıyor" durumunu gösterir. Sonuç gelince Frappe realtime (socket.io) bildirimiyle ekran güncellenir.

---

## 3. Olay iki kez gelirse ya da hiç gelmezse

### Hiç gelmeme: Transactional Outbox

- Olay, işi yapan kayıtla aynı veritabanı işleminde `Domain Event` tablosuna yazılır.
- İşlem geri alınırsa olay da geri alınır.
- Dağıtıcı bekleyen olayları gönderir. Başarısız olursa tekrar dener.
- Tekrar denemeler artan aralıklarla yapılır. En çok 8 deneme yapılır.
- 8 denemeden sonra olay **dead letter** listesine geçer. Bu liste ekibe bildirim gönderir.
- Her saat bir **uzlaştırma işi** (reconciliation job) çalışır. İş, olayı yayınlanmamış siparişleri bulur ve raporlar.

### İki kez gelme: Idempotency

- Her olayın değişmeyen bir `event_id` değeri vardır.
- Her dinleyici işlediği olayı `Processed Event` tablosuna yazar.
- Tabloda `(dinleyici, event_id)` çifti benzersizdir. Aynı olay ikinci kez işlenemez.
- Para ve stok hareketleri ayrıca kendi benzersiz anahtarını taşır. Örnek: Stok defterinde `(sipariş, kalem, hareket türü)` benzersizdir.

### Sipariş yaşam döngüsü bir durum makinesidir

- Sipariş durumları `ordering/state.py` içindeki tek bir sınıftadır.
- Sınıf, `python-statemachine` kütüphanesiyle yazılır.
- İzin verilmeyen geçiş hata verir. Örnek: "Ödeme Bekleniyor" durumundan "Tamamlandı" durumuna doğrudan geçilemez.
- Bu yapı #370 türü hataları önler.

Bu yapıya **process manager** denir. Process manager, birden çok bağlamı ilgilendiren uzun bir işi yönetir.

---

## 4. Veritabanı değişikliği: Expand and contract

Patch'i bir yapay zekâ ajanı yazabilir. Ama patch'in güvenliğini araçlar kontrol eder.

### Kural 1: Değişiklik üç yayında yapılır

Bu yönteme **expand and contract** denir.

1. **Genişlet:** Yeni alan ya da tablo eklenir. Eski alan kalır. Kod iki alana da yazar.
2. **Taşı:** Veri eskiden yeniye kopyalanır. Kod yeni alandan okur. Shadow mode iki alanı karşılaştırır.
3. **Daralt:** Eski alan en az iki yayın sonra silinir.

Aynı yayında hem ekleme hem silme yapılmaz.

### Kural 2: Her patch güvenlik testinden geçer

Her patch şu kontrollerden geçer. Kontrolleri CI yapar.

1. Patch iki kez çalıştırılır. İkinci çalıştırma hiçbir şey değiştirmemeli.
2. Patch boş bir test veritabanında çalışır.
3. Patch, canlı veritabanının anonimleştirilmiş kopyasında çalışır. Buna **migration rehearsal** denir.
4. Patch öncesi ve sonrası satır sayıları karşılaştırılır. Beklenmeyen fark varsa CI durur.
5. Patch'in `--dry-run` modu vardır. Bu mod hiçbir şey yazmaz, yalnız raporlar.

### Kural 3: Geri dönüş yolu yazılıdır

- Her patch'in yanında bir geri dönüş dosyası vardır.
- Geri dönüş dosyası da migration rehearsal içinde denenir.

### Kural 4: Canlıdan önce yedek

Bu adımlar **Hüseyin Cengiz** tarafından yapılır:

1. Canlı veritabanının yedeğini alır.
2. Yedeğin geri yüklenebildiğini test sitesinde dener.
3. Patch'i Alpha, Beta ve RC ortamlarında sırayla çalıştırır.
4. Canlıda çalıştırır ve satır sayılarını kontrol eder.

Yapay zekâ ajanı canlı veritabanına bağlanmaz.

### Anonimleştirilmiş kopya

- Kopya, kişisel verileri değiştirilmiş hâlde tutulur. Örnek: e-posta, telefon, vergi numarası.
- Kopya Colima üzerinde çalışan bir MariaDB konteynerindedir.
- Kopyayı Hüseyin Cengiz haftada bir yeniler.

---

## Kabul ölçütü

- Yeni kod başka bağlamın tablosuna yazmıyor. Üç katmanlı kontrol geçiyor.
- Olay outbox ile yayınlanıyor. Dinleyici idempotent.
- Hemen gereken sonuçlar sorgu ile alınıyor.
- Patch expand and contract kuralına uyuyor ve migration rehearsal geçti.
