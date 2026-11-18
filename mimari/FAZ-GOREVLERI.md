# Faz görevleri

Bu dosya `_veri/faz_gorevleri.py` betiğinden üretilir. Elle düzenlemeyin.

## Faz −1: Güvenlik ağı

Kod taşınmadan önce bugünkü davranış testlerle dondurulur. Bu faz bitmeden hiçbir kod taşınmaz.

### 1. Test altyapısını kurun: `pytest`, `syrupy`, `hypothesis`, `time-machine` ve test veri fabrikaları

- Sorumlu: Geliştirici

#### User story

Bir geliştirici olarak, testleri tek komutla çalıştırmak istiyorum. Böylece her değişikliği hemen kontrol ederim.

#### Kabul kriterleri

- [ ] `pytest` tek komutla yerelde ve CI'da çalışıyor.
- [ ] `tests/factories.py` satıcı, ürün, sepet ve sipariş üretiyor.
- [ ] Araç sürümleri `pyproject.toml` dosyasında sabit.
- [ ] Characterization test: Değişiklikten önce bütün mevcut testlerin sonucu kaydedildi. Değişiklikten sonra sonuçlar aynı.
- [ ] Shadow mode: Yeni kontrol önce yalnız rapor verdi. En az 10 PR boyunca yanlış uyarı çıkmadı. Sonra zorunlu yapıldı.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.

#### Yapmamanız gerekenler

- Canlı veritabanına bağlanan test yazmayın.
- Rastgele veri ya da gerçek saat kullanan test yazmayın.

#### Kontrol listesi

- [ ] PR şablonunun her bölümü dolu.
- [ ] Bütün zorunlu CI kontrolleri yeşil.
- [ ] `architecture/metrics.json` kötüleşmedi.
- [ ] `CODEOWNERS` onayı alındı.
- [ ] Hiçbir test silinmedi ya da atlanmadı.

#### Yönergeler

- [01-tdd.md](YONERGELER/01-tdd.md)

### 2. 12 ana akış için characterization test yazın

- Sorumlu: Geliştirici

#### User story

Bir geliştirici olarak, bugünkü davranışın kaydını istiyorum. Böylece taşıma sırasında bir şey bozulursa hemen görürüm.

#### Kabul kriterleri

- [ ] Şu 12 akışın her biri için snapshot testi var: satıcı başvurusu ve onayı, tek ürün oluşturma, CSV ile toplu yükleme, XML akışı, sepete ekleme, sepetten sipariş, ödeme tahsilatı ve stok düşümü, vergi hesabı, sevkiyat oluşturma ve teslim, tam iptal, kısmi iptal ve iade, fatura belgesi.
- [ ] Her test iki kez çalıştırıldı ve aynı sonucu verdi.
- [ ] Snapshot dosyaları repoda.
- [ ] Characterization test: Bu görevin kendisi bu testleri yazar. 12 akışın 12'si kapsandı.
- [ ] Shadow mode: Testler önce yalnız rapor verdi. Üç ardışık CI çalışmasında sonuç aynı çıktı. Sonra zorunlu yapıldı.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.

#### Yapmamanız gerekenler

- Bu görevde uygulama kodunu değiştirmeyin. Yalnız test ekleyin.
- Hatalı davranışı düzeltmeyin. Hatalı sonucu kaydedin ve issue numarasını yazın.

#### Kontrol listesi

- [ ] PR şablonunun her bölümü dolu.
- [ ] Bütün zorunlu CI kontrolleri yeşil.
- [ ] `architecture/metrics.json` kötüleşmedi.
- [ ] `CODEOWNERS` onayı alındı.
- [ ] Hiçbir test silinmedi ya da atlanmadı.

#### Yönergeler

- [02-characterization-test.md](YONERGELER/02-characterization-test.md)

### 3. Bilinen hatalar için `xfail` testleri yazın (#370, #371, #374 ve diğer kriz ve kritik issue'lar)

- Sorumlu: Geliştirici

#### User story

Bir geliştirici olarak, bilinen hataların testini istiyorum. Böylece hata düzelince ya da geri gelince haberim olur.

#### Kabul kriterleri

- [ ] `öncelik: kriz` ve `öncelik: kritik` etiketli her issue için bir `xfail` testi var.
- [ ] Her testte issue numarası yazılı.
- [ ] CI, beklenmedik biçimde geçen `xfail` testini raporluyor.
- [ ] Characterization test: Değişiklikten önce bütün mevcut testlerin sonucu kaydedildi. Değişiklikten sonra sonuçlar aynı.
- [ ] Shadow mode: Yeni kontrol önce yalnız rapor verdi. En az 10 PR boyunca yanlış uyarı çıkmadı. Sonra zorunlu yapıldı.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.

#### Yapmamanız gerekenler

- Bu görevde hatayı düzeltmeyin.
- `xfail` yerine testi atlamayın (`skip`).

#### Kontrol listesi

- [ ] PR şablonunun her bölümü dolu.
- [ ] Bütün zorunlu CI kontrolleri yeşil.
- [ ] `architecture/metrics.json` kötüleşmedi.
- [ ] `CODEOWNERS` onayı alındı.
- [ ] Hiçbir test silinmedi ya da atlanmadı.

#### Yönergeler

- [01-tdd.md](YONERGELER/01-tdd.md)

### 4. Feature flag altyapısını ekleyin

- Sorumlu: Geliştirici

#### User story

Bir platform yöneticisi olarak, yeni kodu bir anahtarla açıp kapatmak istiyorum. Böylece sorun çıkınca kod geri alınmadan eski yola dönerim.

#### Kabul kriterleri

- [ ] `tradehub_core/shared/flags.py` içinde `is_enabled(ad)` fonksiyonu var.
- [ ] Bayraklar `TH Feature Flag` kaydında tutuluyor ve ortam bazında ayarlanıyor.
- [ ] Bayrağı değiştirmek yeniden yayın gerektirmiyor.
- [ ] Her bayrak değişikliği kayda geçiyor.
- [ ] Characterization test: Değişiklikten önce bütün mevcut testlerin sonucu kaydedildi. Değişiklikten sonra sonuçlar aynı.
- [ ] Shadow mode: Yeni kontrol önce yalnız rapor verdi. En az 10 PR boyunca yanlış uyarı çıkmadı. Sonra zorunlu yapıldı.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.

#### Yapmamanız gerekenler

- Bayrağı kod içine sabit yazmayın.
- Bayrağı yapay zekâ ajanına açtırmayın.

#### Kontrol listesi

- [ ] PR şablonunun her bölümü dolu.
- [ ] Bütün zorunlu CI kontrolleri yeşil.
- [ ] `architecture/metrics.json` kötüleşmedi.
- [ ] `CODEOWNERS` onayı alındı.
- [ ] Hiçbir test silinmedi ya da atlanmadı.

#### Yönergeler

- [03-shadow-mode.md](YONERGELER/03-shadow-mode.md)

### 5. Canlı veritabanının anonimleştirilmiş kopyasını hazırlayın

- Sorumlu: Hüseyin Cengiz

#### User story

Bir DevOps mühendisi olarak, gerçek veriye benzeyen güvenli bir kopya istiyorum. Böylece her patch canlıdan önce bu kopyada denenir.

#### Kabul kriterleri

- [ ] Kopya Colima üzerindeki MariaDB konteynerinde çalışıyor.
- [ ] E-posta, telefon, vergi numarası ve banka bilgileri değiştirildi.
- [ ] Kopya haftada bir yenileniyor.
- [ ] Yedekten geri yükleme test sitesinde denendi.
- [ ] Characterization test: Değişiklikten önce bütün mevcut testlerin sonucu kaydedildi. Değişiklikten sonra sonuçlar aynı.
- [ ] Shadow mode: Yeni kontrol önce yalnız rapor verdi. En az 10 PR boyunca yanlış uyarı çıkmadı. Sonra zorunlu yapıldı.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.

#### Yapmamanız gerekenler

- Anonimleştirilmemiş veriyi geliştirici makinesine kopyalamayın.
- Kopyayı herkese açık bir yere koymayın.

#### Kontrol listesi

- [ ] PR şablonunun her bölümü dolu.
- [ ] Bütün zorunlu CI kontrolleri yeşil.
- [ ] `architecture/metrics.json` kötüleşmedi.
- [ ] `CODEOWNERS` onayı alındı.
- [ ] Hiçbir test silinmedi ya da atlanmadı.

#### Yönergeler

- [06-veri-sahipligi-ve-olaylar.md](YONERGELER/06-veri-sahipligi-ve-olaylar.md)

### 6. Geri alma tatbikatı yapın

- Sorumlu: Hüseyin Cengiz

#### User story

Bir DevOps mühendisi olarak, geri almayı önceden denemek istiyorum. Böylece gerçek sorunda ne yapacağımı bilirim.

#### Kabul kriterleri

- [ ] Alpha ortamında bir yayın geri alındı ve süre ölçüldü.
- [ ] Geri alma adımları yazılı.
- [ ] Yedekten geri yükleme süresi ölçüldü.
- [ ] Characterization test: Değişiklikten önce bütün mevcut testlerin sonucu kaydedildi. Değişiklikten sonra sonuçlar aynı.
- [ ] Shadow mode: Yeni kontrol önce yalnız rapor verdi. En az 10 PR boyunca yanlış uyarı çıkmadı. Sonra zorunlu yapıldı.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.

#### Yapmamanız gerekenler

- Tatbikatı canlı ortamda yapmayın.

#### Kontrol listesi

- [ ] PR şablonunun her bölümü dolu.
- [ ] Bütün zorunlu CI kontrolleri yeşil.
- [ ] `architecture/metrics.json` kötüleşmedi.
- [ ] `CODEOWNERS` onayı alındı.
- [ ] Hiçbir test silinmedi ya da atlanmadı.

#### Yönergeler

- [06-veri-sahipligi-ve-olaylar.md](YONERGELER/06-veri-sahipligi-ve-olaylar.md)

## Faz 0: CI kapısı ve kurallar

Kuralları makine uygular. Her kontrol önce yalnız rapor verir, sonra zorunlu olur.

### 1. CI'a uygulama testlerini ekleyin

- Sorumlu: Geliştirici

#### User story

Bir geliştirici olarak, her PR'da testlerin çalışmasını istiyorum. Böylece kırık kod Alpha'ya çıkmaz.

#### Kabul kriterleri

- [ ] Her PR'da `pytest` çalışıyor.
- [ ] "Alpha Release" işi testlerin başarısına bağlı.
- [ ] CI süresi 15 dakikayı geçmiyor.
- [ ] Bu görev #372 issue'sunu kapatıyor.
- [ ] Characterization test: Değişiklikten önce bütün mevcut testlerin sonucu kaydedildi. Değişiklikten sonra sonuçlar aynı.
- [ ] Shadow mode: Yeni kontrol önce yalnız rapor verdi. En az 10 PR boyunca yanlış uyarı çıkmadı. Sonra zorunlu yapıldı.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.

#### Yapmamanız gerekenler

- Başarısız testi geçirmek için testi silmeyin.
- CI süresini kısaltmak için test atlamayın.

#### Kontrol listesi

- [ ] PR şablonunun her bölümü dolu.
- [ ] Bütün zorunlu CI kontrolleri yeşil.
- [ ] `architecture/metrics.json` kötüleşmedi.
- [ ] `CODEOWNERS` onayı alındı.
- [ ] Hiçbir test silinmedi ya da atlanmadı.

#### Yönergeler

- [01-tdd.md](YONERGELER/01-tdd.md)
- [08-pr-sablonu.md](YONERGELER/08-pr-sablonu.md)

### 2. CI'a Ruff kontrolünü ekleyin

- Sorumlu: Geliştirici

#### User story

Bir geliştirici olarak, kod biçiminin otomatik kontrolünü istiyorum. Böylece incelemede biçim tartışılmaz.

#### Kabul kriterleri

- [ ] `ruff check` ve `ruff format --check` her PR'da çalışıyor.
- [ ] Mevcut ihlaller bir taban dosyasında kayıtlı. Yeni ihlal PR'ı durduruyor.
- [ ] Characterization test: Değişiklikten önce bütün mevcut testlerin sonucu kaydedildi. Değişiklikten sonra sonuçlar aynı.
- [ ] Shadow mode: Yeni kontrol önce yalnız rapor verdi. En az 10 PR boyunca yanlış uyarı çıkmadı. Sonra zorunlu yapıldı.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.

#### Yapmamanız gerekenler

- Bu görevde bütün eski kodu yeniden biçimlendirmeyin.
- Kuralı kapatmak için `noqa` eklemeyin.

#### Kontrol listesi

- [ ] PR şablonunun her bölümü dolu.
- [ ] Bütün zorunlu CI kontrolleri yeşil.
- [ ] `architecture/metrics.json` kötüleşmedi.
- [ ] `CODEOWNERS` onayı alındı.
- [ ] Hiçbir test silinmedi ya da atlanmadı.

#### Yönergeler

- [08-pr-sablonu.md](YONERGELER/08-pr-sablonu.md)

### 3. `import-linter` kontrolünü ekleyin

- Sorumlu: Geliştirici

#### User story

Bir geliştirici olarak, bağlam sınırlarının otomatik kontrolünü istiyorum. Böylece başka bağlamın iç koduna kazayla bağlanmam.

#### Kabul kriterleri

- [ ] Her bağlam için bir sözleşme tanımlı.
- [ ] Mevcut ihlaller `architecture/exceptions.toml` dosyasında kayıtlı.
- [ ] Yeni ihlal PR'ı durduruyor.
- [ ] Characterization test: Değişiklikten önce bütün mevcut testlerin sonucu kaydedildi. Değişiklikten sonra sonuçlar aynı.
- [ ] Shadow mode: Yeni kontrol önce yalnız rapor verdi. En az 10 PR boyunca yanlış uyarı çıkmadı. Sonra zorunlu yapıldı.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.

#### Yapmamanız gerekenler

- İhlali gizlemek için `ignore_imports` listesine genel kalıp eklemeyin.

#### Kontrol listesi

- [ ] PR şablonunun her bölümü dolu.
- [ ] Bütün zorunlu CI kontrolleri yeşil.
- [ ] `architecture/metrics.json` kötüleşmedi.
- [ ] `CODEOWNERS` onayı alındı.
- [ ] Hiçbir test silinmedi ya da atlanmadı.

#### Yönergeler

- [06-veri-sahipligi-ve-olaylar.md](YONERGELER/06-veri-sahipligi-ve-olaylar.md)

### 4. `semgrep` ile bağlamlar arası yazım kurallarını ekleyin

- Sorumlu: Geliştirici

#### User story

Bir geliştirici olarak, başka bağlamın tablosuna yazan kodun yakalanmasını istiyorum. Böylece veri sahipliği korunur.

#### Kabul kriterleri

- [ ] `architecture/ownership.toml` her DocType'ın sahibini yazıyor.
- [ ] Kurallar `set_value`, `db.sql` ve `get_doc().save()` kalıplarını yakalıyor.
- [ ] f-string ile kurulan SQL yakalanıyor.
- [ ] Mevcut ihlaller istisna dosyasında kayıtlı.
- [ ] Characterization test: Değişiklikten önce bütün mevcut testlerin sonucu kaydedildi. Değişiklikten sonra sonuçlar aynı.
- [ ] Shadow mode: Yeni kontrol önce yalnız rapor verdi. En az 10 PR boyunca yanlış uyarı çıkmadı. Sonra zorunlu yapıldı.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.

#### Yapmamanız gerekenler

- Kuralı geçmek için SQL metnini parçalara bölmeyin.

#### Kontrol listesi

- [ ] PR şablonunun her bölümü dolu.
- [ ] Bütün zorunlu CI kontrolleri yeşil.
- [ ] `architecture/metrics.json` kötüleşmedi.
- [ ] `CODEOWNERS` onayı alındı.
- [ ] Hiçbir test silinmedi ya da atlanmadı.

#### Yönergeler

- [06-veri-sahipligi-ve-olaylar.md](YONERGELER/06-veri-sahipligi-ve-olaylar.md)

### 5. Testlerde çalışan yazma koruyucusunu ekleyin

- Sorumlu: Geliştirici

#### User story

Bir geliştirici olarak, sahibi olmayan kodun yazımını testte görmek istiyorum. Böylece kod taramasının kaçırdığı yazımlar da yakalanır.

#### Kabul kriterleri

- [ ] Koruyucu her veritabanı yazımında yazan paketi buluyor.
- [ ] Sahip olmayan yazım testi başarısız yapıyor.
- [ ] Koruyucu canlıda yalnız kayıt tutuyor.
- [ ] Characterization test: Değişiklikten önce bütün mevcut testlerin sonucu kaydedildi. Değişiklikten sonra sonuçlar aynı.
- [ ] Shadow mode: Yeni kontrol önce yalnız rapor verdi. En az 10 PR boyunca yanlış uyarı çıkmadı. Sonra zorunlu yapıldı.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.

#### Yapmamanız gerekenler

- Koruyucuyu canlıda hata verecek biçimde açmayın.

#### Kontrol listesi

- [ ] PR şablonunun her bölümü dolu.
- [ ] Bütün zorunlu CI kontrolleri yeşil.
- [ ] `architecture/metrics.json` kötüleşmedi.
- [ ] `CODEOWNERS` onayı alındı.
- [ ] Hiçbir test silinmedi ya da atlanmadı.

#### Yönergeler

- [06-veri-sahipligi-ve-olaylar.md](YONERGELER/06-veri-sahipligi-ve-olaylar.md)

### 6. Olay sözleşmesi kontrolünü ekleyin

- Sorumlu: Geliştirici

#### User story

Bir geliştirici olarak, kırıcı sözleşme değişikliğinin durdurulmasını istiyorum. Böylece dinleyen bağlamlar bozulmaz.

#### Kabul kriterleri

- [ ] CI, Pydantic modellerinden JSON Schema üretiyor.
- [ ] CI, eski ve yeni şemayı karşılaştırıyor.
- [ ] Kırıcı değişiklik PR'ı durduruyor.
- [ ] Characterization test: Değişiklikten önce bütün mevcut testlerin sonucu kaydedildi. Değişiklikten sonra sonuçlar aynı.
- [ ] Shadow mode: Yeni kontrol önce yalnız rapor verdi. En az 10 PR boyunca yanlış uyarı çıkmadı. Sonra zorunlu yapıldı.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.

#### Yapmamanız gerekenler

- Üretilen şema dosyasını elle düzenlemeyin.

#### Kontrol listesi

- [ ] PR şablonunun her bölümü dolu.
- [ ] Bütün zorunlu CI kontrolleri yeşil.
- [ ] `architecture/metrics.json` kötüleşmedi.
- [ ] `CODEOWNERS` onayı alındı.
- [ ] Hiçbir test silinmedi ya da atlanmadı.

#### Yönergeler

- [05-olay-sozlesmesi.md](YONERGELER/05-olay-sozlesmesi.md)

### 7. CI'a `bench migrate` denemesini ve migration rehearsal'ı ekleyin

- Sorumlu: Hüseyin Cengiz

#### User story

Bir DevOps mühendisi olarak, her patch'in kopyada denenmesini istiyorum. Böylece hatalı patch canlı veriyi bozmaz.

#### Kabul kriterleri

- [ ] Patch içeren her PR'da `bench migrate` boş sitede çalışıyor.
- [ ] Patch anonimleştirilmiş kopyada çalışıyor.
- [ ] Patch iki kez çalışıyor ve ikinci çalıştırma veri değiştirmiyor.
- [ ] Satır sayıları öncesi ve sonrası karşılaştırılıyor.
- [ ] Characterization test: Değişiklikten önce bütün mevcut testlerin sonucu kaydedildi. Değişiklikten sonra sonuçlar aynı.
- [ ] Shadow mode: Yeni kontrol önce yalnız rapor verdi. En az 10 PR boyunca yanlış uyarı çıkmadı. Sonra zorunlu yapıldı.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.

#### Yapmamanız gerekenler

- Denemeyi canlı veritabanında yapmayın.
- Başarısız denemeyi atlamak için patch'i `try/except` içine almayın.

#### Kontrol listesi

- [ ] PR şablonunun her bölümü dolu.
- [ ] Bütün zorunlu CI kontrolleri yeşil.
- [ ] `architecture/metrics.json` kötüleşmedi.
- [ ] `CODEOWNERS` onayı alındı.
- [ ] Hiçbir test silinmedi ya da atlanmadı.

#### Yönergeler

- [06-veri-sahipligi-ve-olaylar.md](YONERGELER/06-veri-sahipligi-ve-olaylar.md)

### 8. `diff-cover` ile değişen satır kapsamını zorunlu yapın

- Sorumlu: Geliştirici

#### User story

Bir geliştirici olarak, testsiz kodun birleştirilmemesini istiyorum. Böylece TDD kuralı kendiliğinden uygulanır.

#### Kabul kriterleri

- [ ] Değişen satırların kapsamı %90'ın altındaysa PR duruyor.
- [ ] Silinen ya da atlanan test PR'ı durduruyor.
- [ ] Characterization test: Değişiklikten önce bütün mevcut testlerin sonucu kaydedildi. Değişiklikten sonra sonuçlar aynı.
- [ ] Shadow mode: Yeni kontrol önce yalnız rapor verdi. En az 10 PR boyunca yanlış uyarı çıkmadı. Sonra zorunlu yapıldı.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.

#### Yapmamanız gerekenler

- Kapsamı artırmak için hiçbir şey kontrol etmeyen test yazmayın.

#### Kontrol listesi

- [ ] PR şablonunun her bölümü dolu.
- [ ] Bütün zorunlu CI kontrolleri yeşil.
- [ ] `architecture/metrics.json` kötüleşmedi.
- [ ] `CODEOWNERS` onayı alındı.
- [ ] Hiçbir test silinmedi ya da atlanmadı.

#### Yönergeler

- [01-tdd.md](YONERGELER/01-tdd.md)

### 9. Metrik betiğini ve ratchet kontrolünü ekleyin

- Sorumlu: Geliştirici

#### User story

Bir platform yöneticisi olarak, sayıların kötüleşmemesini istiyorum. Böylece yapının eski hâline dönmesini engellerim.

#### Kabul kriterleri

- [ ] `scripts/architecture_metrics.py` metrik yönergesindeki bütün sayıları üretiyor.
- [ ] Bir sayı kötüleşirse PR duruyor.
- [ ] Haftalık rapor her pazartesi oluşuyor.
- [ ] Characterization test: Değişiklikten önce bütün mevcut testlerin sonucu kaydedildi. Değişiklikten sonra sonuçlar aynı.
- [ ] Shadow mode: Yeni kontrol önce yalnız rapor verdi. En az 10 PR boyunca yanlış uyarı çıkmadı. Sonra zorunlu yapıldı.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.

#### Yapmamanız gerekenler

- Sayıyı düzeltmek için ölçümü değiştirmeyin.

#### Kontrol listesi

- [ ] PR şablonunun her bölümü dolu.
- [ ] Bütün zorunlu CI kontrolleri yeşil.
- [ ] `architecture/metrics.json` kötüleşmedi.
- [ ] `CODEOWNERS` onayı alındı.
- [ ] Hiçbir test silinmedi ya da atlanmadı.

#### Yönergeler

- [07-metrikler.md](YONERGELER/07-metrikler.md)

### 10. `CODEOWNERS`, PR şablonu ve dal korumasını ekleyin

- Sorumlu: Hüseyin Cengiz

#### User story

Bir platform yöneticisi olarak, kuralların atlanamamasını istiyorum. Böylece disiplin kişilere bağlı kalmaz.

#### Kabul kriterleri

- [ ] `CODEOWNERS` her bağlamı bir sahibe bağlıyor.
- [ ] PR şablonu repoda. CI boş bölümü durduruyor.
- [ ] `version-15` dalında zorunlu kontroller açık. Yönetici de atlayamıyor.
- [ ] Characterization test: Değişiklikten önce bütün mevcut testlerin sonucu kaydedildi. Değişiklikten sonra sonuçlar aynı.
- [ ] Shadow mode: Yeni kontrol önce yalnız rapor verdi. En az 10 PR boyunca yanlış uyarı çıkmadı. Sonra zorunlu yapıldı.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.

#### Yapmamanız gerekenler

- Dal korumasını geçici olarak kapatmayın.

#### Kontrol listesi

- [ ] PR şablonunun her bölümü dolu.
- [ ] Bütün zorunlu CI kontrolleri yeşil.
- [ ] `architecture/metrics.json` kötüleşmedi.
- [ ] `CODEOWNERS` onayı alındı.
- [ ] Hiçbir test silinmedi ya da atlanmadı.

#### Yönergeler

- [08-pr-sablonu.md](YONERGELER/08-pr-sablonu.md)

## Faz 1: Ortak çekirdek ve olay sistemi

Para tipi, olay sistemi, shadow mode yardımcısı ve sözleşme araçları kurulur.

### 1. `Money` value object sınıfını ekleyin

- Sorumlu: Geliştirici

#### User story

Bir geliştirici olarak, parayı tek bir güvenli tiple taşımak istiyorum. Böylece yuvarlama ve para birimi hataları oluşmaz.

#### Kabul kriterleri

- [ ] `shared/money.py` içinde değişmez `Money` sınıfı var.
- [ ] Farklı para birimlerini toplamak hata veriyor.
- [ ] Yuvarlama kuralı tek yerde ve property-based testle korunuyor.
- [ ] Characterization test: Görevin dokunduğu her akış için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

#### Yapmamanız gerekenler

- Yeni kodda tutar için `float` kullanmayın.
- Bu görevde mevcut alanların tipini değiştirmeyin.

#### Kontrol listesi

- [ ] PR şablonunun her bölümü dolu.
- [ ] Bütün zorunlu CI kontrolleri yeşil.
- [ ] `architecture/metrics.json` kötüleşmedi.
- [ ] `CODEOWNERS` onayı alındı.
- [ ] Hiçbir test silinmedi ya da atlanmadı.

#### Yönergeler

- [04-is-kurallari.md](YONERGELER/04-is-kurallari.md)

### 2. `Domain Event` outbox kaydını ve `publish` fonksiyonunu ekleyin

- Sorumlu: Geliştirici

#### User story

Bir geliştirici olarak, olayı işle aynı işlemde kaydetmek istiyorum. Böylece olay kaybolmaz.

#### Kabul kriterleri

- [ ] Olay, işi yapan kayıtla aynı işlemde yazılıyor.
- [ ] İşlem geri alınınca olay da geri alınıyor. Bunun testi var.
- [ ] Her olayın değişmeyen `event_id` değeri var.
- [ ] Characterization test: Görevin dokunduğu her akış için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

#### Yapmamanız gerekenler

- Olayı `frappe.enqueue` ile doğrudan göndermeyin. Önce outbox'a yazın.

#### Kontrol listesi

- [ ] PR şablonunun her bölümü dolu.
- [ ] Bütün zorunlu CI kontrolleri yeşil.
- [ ] `architecture/metrics.json` kötüleşmedi.
- [ ] `CODEOWNERS` onayı alındı.
- [ ] Hiçbir test silinmedi ya da atlanmadı.

#### Yönergeler

- [06-veri-sahipligi-ve-olaylar.md](YONERGELER/06-veri-sahipligi-ve-olaylar.md)

### 3. Dağıtıcıyı, tekrar denemeyi ve dead letter listesini ekleyin

- Sorumlu: Geliştirici

#### User story

Bir geliştirici olarak, başarısız olayın yeniden denenmesini istiyorum. Böylece geçici hatalar veri kaybına yol açmaz.

#### Kabul kriterleri

- [ ] Başarısız olay artan aralıklarla en çok 8 kez deneniyor.
- [ ] 8 denemeden sonra olay dead letter listesine geçiyor.
- [ ] Dead letter kaydı ekibe bildirim gönderiyor.
- [ ] Characterization test: Görevin dokunduğu her akış için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

#### Yapmamanız gerekenler

- Başarısız olayı silmeyin.
- Hatayı sessizce yutmayın.

#### Kontrol listesi

- [ ] PR şablonunun her bölümü dolu.
- [ ] Bütün zorunlu CI kontrolleri yeşil.
- [ ] `architecture/metrics.json` kötüleşmedi.
- [ ] `CODEOWNERS` onayı alındı.
- [ ] Hiçbir test silinmedi ya da atlanmadı.

#### Yönergeler

- [06-veri-sahipligi-ve-olaylar.md](YONERGELER/06-veri-sahipligi-ve-olaylar.md)

### 4. `Processed Event` kaydı ile idempotent dinleyici altyapısını ekleyin

- Sorumlu: Geliştirici

#### User story

Bir geliştirici olarak, aynı olayın iki kez işlenmemesini istiyorum. Böylece stok ve para iki kez hareket etmez.

#### Kabul kriterleri

- [ ] `(dinleyici, event_id)` çifti veritabanında benzersiz.
- [ ] Aynı olay iki kez gönderilince ikinci gönderim iş yapmıyor. Bunun testi var.
- [ ] `@subscriber` dekoratörü bu kontrolü kendiliğinden yapıyor.
- [ ] Characterization test: Görevin dokunduğu her akış için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

#### Yapmamanız gerekenler

- Tekrar kontrolünü dinleyicinin içine elle yazmayın. Dekoratörü kullanın.

#### Kontrol listesi

- [ ] PR şablonunun her bölümü dolu.
- [ ] Bütün zorunlu CI kontrolleri yeşil.
- [ ] `architecture/metrics.json` kötüleşmedi.
- [ ] `CODEOWNERS` onayı alındı.
- [ ] Hiçbir test silinmedi ya da atlanmadı.

#### Yönergeler

- [06-veri-sahipligi-ve-olaylar.md](YONERGELER/06-veri-sahipligi-ve-olaylar.md)

### 5. `shadow_compare` yardımcısını ve `Shadow Mismatch Log` kaydını ekleyin

- Sorumlu: Geliştirici

#### User story

Bir geliştirici olarak, eski ve yeni yolu güvenle karşılaştırmak istiyorum. Böylece yeni yola kanıtla geçerim.

#### Kabul kriterleri

- [ ] Yeni kodun hatası kullanıcıya gitmiyor.
- [ ] Yeni kod arka planda çalışıyor ve isteği yavaşlatmıyor.
- [ ] Fark `Shadow Mismatch Log` kaydına yazılıyor.
- [ ] Geçiş koşullarını gösteren bir rapor var.
- [ ] Characterization test: Görevin dokunduğu her akış için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yardımcının kendisi örnek bir hesapta 7 gün çalıştı. Yanlış fark kaydı çıkmadı.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

#### Yapmamanız gerekenler

- Shadow mode'da yeni kodun veritabanına yazmasına izin vermeyin.

#### Kontrol listesi

- [ ] PR şablonunun her bölümü dolu.
- [ ] Bütün zorunlu CI kontrolleri yeşil.
- [ ] `architecture/metrics.json` kötüleşmedi.
- [ ] `CODEOWNERS` onayı alındı.
- [ ] Hiçbir test silinmedi ya da atlanmadı.

#### Yönergeler

- [03-shadow-mode.md](YONERGELER/03-shadow-mode.md)

### 6. Pydantic olay modellerini ve şema kaydını kurun

- Sorumlu: Geliştirici

#### User story

Bir geliştirici olarak, olayların yazılı sözleşmesini istiyorum. Böylece olayın anlamı kazara değişmez.

#### Kabul kriterleri

- [ ] Olaylar Pydantic modeli. Her modelin docstring'inde "Anlam" satırı var.
- [ ] JSON Schema dosyaları `contracts/schemas/` klasöründe.
- [ ] Her olay için en az üç örnek veri dosyası var.
- [ ] Characterization test: Görevin dokunduğu her akış için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

#### Yapmamanız gerekenler

- Olay verisini düz sözlük olarak göndermeyin.

#### Kontrol listesi

- [ ] PR şablonunun her bölümü dolu.
- [ ] Bütün zorunlu CI kontrolleri yeşil.
- [ ] `architecture/metrics.json` kötüleşmedi.
- [ ] `CODEOWNERS` onayı alındı.
- [ ] Hiçbir test silinmedi ya da atlanmadı.

#### Yönergeler

- [05-olay-sozlesmesi.md](YONERGELER/05-olay-sozlesmesi.md)

### 7. TypeScript tiplerini ve `zod` doğrulamasını üretin

- Sorumlu: Geliştirici

#### User story

Bir ön yüz geliştiricisi olarak, API tiplerinin otomatik gelmesini istiyorum. Böylece arka uç değişince derleme hata verir.

#### Kabul kriterleri

- [ ] `json-schema-to-typescript` tipleri üretiyor.
- [ ] `tradehubfront` ve `admin-panel` üretilen tipleri kullanıyor.
- [ ] API cevapları `zod` ile doğrulanıyor.
- [ ] CI, üretilen dosyaların güncel olduğunu kontrol ediyor.
- [ ] Characterization test: Görevin dokunduğu her akış için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

#### Yapmamanız gerekenler

- Üretilen tip dosyasını elle düzenlemeyin.

#### Kontrol listesi

- [ ] PR şablonunun her bölümü dolu.
- [ ] Bütün zorunlu CI kontrolleri yeşil.
- [ ] `architecture/metrics.json` kötüleşmedi.
- [ ] `CODEOWNERS` onayı alındı.
- [ ] Hiçbir test silinmedi ya da atlanmadı.

#### Yönergeler

- [05-olay-sozlesmesi.md](YONERGELER/05-olay-sozlesmesi.md)

### 8. Saatlik uzlaştırma işini ekleyin

- Sorumlu: Hüseyin Cengiz

#### User story

Bir platform yöneticisi olarak, kaybolan olayların bulunmasını istiyorum. Böylece eksik iş fark edilmeden kalmaz.

#### Kabul kriterleri

- [ ] İş, olayı yayınlanmamış kayıtları buluyor.
- [ ] İş, bulduklarını raporluyor ve bildirim gönderiyor.
- [ ] İş hiçbir veriyi kendiliğinden değiştirmiyor.
- [ ] Characterization test: Görevin dokunduğu her akış için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

#### Yapmamanız gerekenler

- Uzlaştırma işine otomatik düzeltme yaptırmayın.

#### Kontrol listesi

- [ ] PR şablonunun her bölümü dolu.
- [ ] Bütün zorunlu CI kontrolleri yeşil.
- [ ] `architecture/metrics.json` kötüleşmedi.
- [ ] `CODEOWNERS` onayı alındı.
- [ ] Hiçbir test silinmedi ya da atlanmadı.

#### Yönergeler

- [06-veri-sahipligi-ve-olaylar.md](YONERGELER/06-veri-sahipligi-ve-olaylar.md)

## Faz 2: hooks.py dosyasını bölme

Ortak dosyalar bağlamlara bölünür. Merge çakışmaları azalır.

### 1. `hooks_merge.py` yardımcısını ekleyin

- Sorumlu: Geliştirici

#### User story

Bir geliştirici olarak, bağlam kayıtlarının otomatik birleşmesini istiyorum. Böylece `hooks.py` dosyasına elle yazmam.

#### Kabul kriterleri

- [ ] Yardımcı `doc_events`, `scheduler_events` ve yetki kayıtlarını birleştiriyor.
- [ ] Aynı anahtara iki bağlam yazarsa yardımcı hata veriyor.
- [ ] Characterization test: Birleşmiş `doc_events` sözlüğü eski sözlükle bire bir aynı. Bunun testi var.
- [ ] Shadow mode: Yeni birleşmiş sözlük açılışta eski sözlükle karşılaştırıldı. 7 gün boyunca fark 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

#### Yapmamanız gerekenler

- Birleştirme sırasını rastgele bırakmayın. Sıra sabit olmalı.

#### Kontrol listesi

- [ ] PR şablonunun her bölümü dolu.
- [ ] Bütün zorunlu CI kontrolleri yeşil.
- [ ] `architecture/metrics.json` kötüleşmedi.
- [ ] `CODEOWNERS` onayı alındı.
- [ ] Hiçbir test silinmedi ya da atlanmadı.

### 2. Her bağlam için `hooks_fragment.py` oluşturun ve kayıtları taşıyın

- Sorumlu: Geliştirici

#### User story

Bir geliştirici olarak, kendi bağlamımın kayıtlarını kendi dosyamda tutmak istiyorum. Böylece başka geliştiriciyle çakışmam.

#### Kabul kriterleri

- [ ] Her bağlamın kendi `hooks_fragment.py` dosyası var.
- [ ] `hooks.py` içinde doğrudan kayıt kalmadı.
- [ ] Her bağlam ayrı bir PR ile taşındı.
- [ ] Characterization test: Her taşımadan sonra birleşmiş sözlük eski sözlükle aynı.
- [ ] Shadow mode: Yeni birleşmiş sözlük açılışta eski sözlükle karşılaştırıldı. 7 gün boyunca fark 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

#### Yapmamanız gerekenler

- Taşıma sırasında bir kaydın davranışını değiştirmeyin.
- Bir PR'da iki bağlamı taşımayın.

#### Kontrol listesi

- [ ] PR şablonunun her bölümü dolu.
- [ ] Bütün zorunlu CI kontrolleri yeşil.
- [ ] `architecture/metrics.json` kötüleşmedi.
- [ ] `CODEOWNERS` onayı alındı.
- [ ] Hiçbir test silinmedi ya da atlanmadı.

### 3. `permissions.py` dosyasını bağlamlara bölün

- Sorumlu: Geliştirici

#### User story

Bir geliştirici olarak, yetki kurallarımı kendi bağlamımda tutmak istiyorum. Böylece yetki değişiklikleri çakışmaz.

#### Kabul kriterleri

- [ ] Her bağlamın yetki fonksiyonları kendi paketinde.
- [ ] Satıcı izolasyonu testleri her DocType için var.
- [ ] Characterization test: Görevin dokunduğu her akış için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Eski ve yeni yetki fonksiyonu aynı sorgu için karşılaştırıldı. 7 gün ve 500 sorguda fark 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

#### Yapmamanız gerekenler

- Yetki kuralını gevşetmeyin.
- `ignore_permissions=True` eklemeyin.

#### Kontrol listesi

- [ ] PR şablonunun her bölümü dolu.
- [ ] Bütün zorunlu CI kontrolleri yeşil.
- [ ] `architecture/metrics.json` kötüleşmedi.
- [ ] `CODEOWNERS` onayı alındı.
- [ ] Hiçbir test silinmedi ya da atlanmadı.

### 4. `patches.txt` dosyasını bölümlere ayırın ve patch klasörlerini taşıyın

- Sorumlu: Geliştirici

#### User story

Bir geliştirici olarak, patch'imi kendi bölümüme eklemek istiyorum. Böylece `patches.txt` çakışması azalır.

#### Kabul kriterleri

- [ ] Her bağlamın `patches.txt` içinde kendi bölümü var.
- [ ] Yeni patch'ler `tradehub_core/<bağlam>/patches/` klasöründe.
- [ ] Çalışmış patch'lerin yolu değişmedi.
- [ ] Characterization test: Görevin dokunduğu her akış için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni düzen anonimleştirilmiş kopyada `bench migrate` ile denendi. Hiçbir eski patch yeniden çalışmadı.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

#### Yapmamanız gerekenler

- Çalışmış bir patch'in adını ya da yolunu değiştirmeyin. Frappe onu yeniden çalıştırır.

#### Kontrol listesi

- [ ] PR şablonunun her bölümü dolu.
- [ ] Bütün zorunlu CI kontrolleri yeşil.
- [ ] `architecture/metrics.json` kötüleşmedi.
- [ ] `CODEOWNERS` onayı alındı.
- [ ] Hiçbir test silinmedi ya da atlanmadı.

## Faz 3: Sipariş, vergi, ödeme ve lojistik

En çok hata üreten alan olaylarla ayrılır. Her adım shadow mode ile doğrulanır.

### 1. Dört bağlama `api.py` ve `contracts.py` ekleyin

- Sorumlu: Geliştirici

#### User story

Bir geliştirici olarak, her bağlamın tek bir dış kapısını istiyorum. Böylece neyi çağırabileceğimi bilirim.

#### Kabul kriterleri

- [ ] `ordering`, `tax`, `payments` ve `logistics` paketlerinde `api.py` ve `contracts.py` var.
- [ ] Fonksiyonlar tipli girdi ve çıktı kullanıyor.
- [ ] Her fonksiyonun sözleşme testi var.
- [ ] Characterization test: Görevin dokunduğu her akış için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

#### Yapmamanız gerekenler

- `api.py` içine iş kuralı yazmayın. Yalnız iç servisi çağırın.

#### Kontrol listesi

- [ ] PR şablonunun her bölümü dolu.
- [ ] Bütün zorunlu CI kontrolleri yeşil.
- [ ] `architecture/metrics.json` kötüleşmedi.
- [ ] `CODEOWNERS` onayı alındı.
- [ ] Hiçbir test silinmedi ya da atlanmadı.

### 2. Sipariş durumunu durum makinesine taşıyın

- Sorumlu: Geliştirici

#### User story

Bir geliştirici olarak, sipariş durumunu tek yerden değiştirmek istiyorum. Böylece #370 türü hatalar oluşmaz.

#### Kabul kriterleri

- [ ] `ordering/state.py` bütün geçişleri tanımlıyor.
- [ ] İzin verilmeyen geçiş hata veriyor.
- [ ] Her geçişin testi var. Her durum çifti için property-based test var.
- [ ] Characterization test: Görevin dokunduğu her akış için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

#### Yapmamanız gerekenler

- `Order.status` alanına başka bir yerden yazmayın.
- `frappe.db.set_value("Order", ...)` kullanmayın.

#### Kontrol listesi

- [ ] PR şablonunun her bölümü dolu.
- [ ] Bütün zorunlu CI kontrolleri yeşil.
- [ ] `architecture/metrics.json` kötüleşmedi.
- [ ] `CODEOWNERS` onayı alındı.
- [ ] Hiçbir test silinmedi ya da atlanmadı.

#### Yönergeler

- [06-veri-sahipligi-ve-olaylar.md](YONERGELER/06-veri-sahipligi-ve-olaylar.md)

### 3. Vergi hesabını `tax.api` üzerinden sorgu olarak sunun

- Sorumlu: Geliştirici

#### User story

Bir alıcı olarak, sepette doğru vergiyi hemen görmek istiyorum. Böylece ödeyeceğim tutarı bilirim.

#### Kabul kriterleri

- [ ] Sipariş denetleyicisi `tax_core` iç modüllerini çağırmıyor.
- [ ] Vergi kuralları karar tablosunda. Mali müşavir onayı PR'da.
- [ ] Vergi invariant'ları için property-based test var.
- [ ] Vergi paketinde mutation skoru en az %80.
- [ ] Characterization test: Görevin dokunduğu her akış için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

#### Yapmamanız gerekenler

- Vergi hesabını olaya taşımayın. Sonuç hemen gerekiyor.
- Tutar için `float` kullanmayın.

#### Kontrol listesi

- [ ] PR şablonunun her bölümü dolu.
- [ ] Bütün zorunlu CI kontrolleri yeşil.
- [ ] `architecture/metrics.json` kötüleşmedi.
- [ ] `CODEOWNERS` onayı alındı.
- [ ] Hiçbir test silinmedi ya da atlanmadı.

#### Yönergeler

- [04-is-kurallari.md](YONERGELER/04-is-kurallari.md)

### 4. İade hesabını vergi sözleşmesine bağlayın (#371)

- Sorumlu: Geliştirici

#### User story

Bir alıcı olarak, iptalde doğru tutarın iade edilmesini istiyorum. Böylece az ya da fazla iade almam.

#### Kabul kriterleri

- [ ] İade tutarı kalemin dondurulmuş brüt tutarından hesaplanıyor.
- [ ] Çoklu vergi ve vergi dahil fiyat için test var.
- [ ] #371 için yazılan `xfail` testi normal teste döndü.
- [ ] Characterization test: Görevin dokunduğu her akış için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

#### Yapmamanız gerekenler

- İade formülünü lojistik paketinde tutmayın.

#### Kontrol listesi

- [ ] PR şablonunun her bölümü dolu.
- [ ] Bütün zorunlu CI kontrolleri yeşil.
- [ ] `architecture/metrics.json` kötüleşmedi.
- [ ] `CODEOWNERS` onayı alındı.
- [ ] Hiçbir test silinmedi ya da atlanmadı.

#### Yönergeler

- [04-is-kurallari.md](YONERGELER/04-is-kurallari.md)

### 5. `payment.collected` olayını ekleyin ve ödeme kodunun sipariş yazımını kaldırın

- Sorumlu: Geliştirici

#### User story

Bir geliştirici olarak, ödemenin siparişe olayla haber vermesini istiyorum. Böylece ödeme kodu sipariş durumlarını bilmek zorunda kalmaz.

#### Kabul kriterleri

- [ ] `payments/service.py` içinde `Order` yazımı kalmadı.
- [ ] Sipariş bağlamı `payment.collected` olayını idempotent işliyor.
- [ ] Olay iki kez gelince sipariş bir kez onaylanıyor. Bunun testi var.
- [ ] Characterization test: Görevin dokunduğu her akış için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

#### Yapmamanız gerekenler

- Ödeme kodundan sipariş durumuna bakmayın.

#### Kontrol listesi

- [ ] PR şablonunun her bölümü dolu.
- [ ] Bütün zorunlu CI kontrolleri yeşil.
- [ ] `architecture/metrics.json` kötüleşmedi.
- [ ] `CODEOWNERS` onayı alındı.
- [ ] Hiçbir test silinmedi ya da atlanmadı.

#### Yönergeler

- [05-olay-sozlesmesi.md](YONERGELER/05-olay-sozlesmesi.md)
- [06-veri-sahipligi-ve-olaylar.md](YONERGELER/06-veri-sahipligi-ve-olaylar.md)

### 6. `order.confirmed` olayı ile stok düşümünü ayırın (#370)

- Sorumlu: Geliştirici

#### User story

Bir satıcı olarak, ödenen siparişte stoğun her durumda düşmesini istiyorum. Böylece olmayan ürünü satmam.

#### Kabul kriterleri

- [ ] Stok, `order.confirmed` olayıyla düşüyor.
- [ ] Stok defterinde `(sipariş, kalem, hareket türü)` benzersiz.
- [ ] Stok hiçbir girdide eksiye düşmüyor. Property-based test var.
- [ ] #370 için yazılan `xfail` testi normal teste döndü.
- [ ] Characterization test: Görevin dokunduğu her akış için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

#### Yapmamanız gerekenler

- Stok düşümünü sipariş durumuna bağlamayın.

#### Kontrol listesi

- [ ] PR şablonunun her bölümü dolu.
- [ ] Bütün zorunlu CI kontrolleri yeşil.
- [ ] `architecture/metrics.json` kötüleşmedi.
- [ ] `CODEOWNERS` onayı alındı.
- [ ] Hiçbir test silinmedi ya da atlanmadı.

#### Yönergeler

- [06-veri-sahipligi-ve-olaylar.md](YONERGELER/06-veri-sahipligi-ve-olaylar.md)

### 7. Lojistiğin sipariş yazımını olaylarla değiştirin

- Sorumlu: Geliştirici

#### User story

Bir geliştirici olarak, lojistiğin siparişe olayla haber vermesini istiyorum. Böylece lojistik geliştiricisi sipariş kaydına dokunmaz.

#### Kabul kriterleri

- [ ] `logistics/hooks.py` içinde `Order` yazımı kalmadı.
- [ ] Lojistik `shipment.handed_over` ve `shipment.delivered` olaylarını yayınlıyor.
- [ ] Sevkiyat taslağı `order.confirmed` olayıyla oluşuyor.
- [ ] Characterization test: Görevin dokunduğu her akış için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

#### Yapmamanız gerekenler

- `Order.status` ve `fulfillment_status` alanlarına lojistikten yazmayın.

#### Kontrol listesi

- [ ] PR şablonunun her bölümü dolu.
- [ ] Bütün zorunlu CI kontrolleri yeşil.
- [ ] `architecture/metrics.json` kötüleşmedi.
- [ ] `CODEOWNERS` onayı alındı.
- [ ] Hiçbir test silinmedi ya da atlanmadı.

#### Yönergeler

- [05-olay-sozlesmesi.md](YONERGELER/05-olay-sozlesmesi.md)

### 8. Dört bağlamda `import-linter` ve yazım kurallarını zorunlu yapın

- Sorumlu: Geliştirici

#### User story

Bir platform yöneticisi olarak, bu dört bağlamda sınırın kilitlenmesini istiyorum. Böylece yapı geri bozulmaz.

#### Kabul kriterleri

- [ ] Dört bağlam için istisna sayısı 0.
- [ ] Kontroller PR'ı durduruyor.
- [ ] Characterization test: Değişiklikten önce bütün mevcut testlerin sonucu kaydedildi. Değişiklikten sonra sonuçlar aynı.
- [ ] Shadow mode: Yeni kontrol önce yalnız rapor verdi. En az 10 PR boyunca yanlış uyarı çıkmadı. Sonra zorunlu yapıldı.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.

#### Yapmamanız gerekenler

- İstisna dosyasına yeni satır eklemeyin.

#### Kontrol listesi

- [ ] PR şablonunun her bölümü dolu.
- [ ] Bütün zorunlu CI kontrolleri yeşil.
- [ ] `architecture/metrics.json` kötüleşmedi.
- [ ] `CODEOWNERS` onayı alındı.
- [ ] Hiçbir test silinmedi ya da atlanmadı.

#### Yönergeler

- [07-metrikler.md](YONERGELER/07-metrikler.md)

## Faz 4: Diğer bağlamlar

Kalan bağlamlar aynı yöntemle taşınır. Her DocType'ın epic'i bu fazdadır.

### 1. Katalog bağlamını taşıyın

- Sorumlu: Geliştirici

#### User story

Bir geliştirici olarak, bu bağlamın kendi modülünde durmasını istiyorum. Böylece başka geliştiricilerin işini bozmam.

#### Kabul kriterleri

- [ ] Bağlamın `api.py`, `contracts.py` ve `hooks_fragment.py` dosyaları var.
- [ ] Bağlamın bütün epic'leri "Bitti" durumunda.
- [ ] Bağlam için istisna sayısı 0.
- [ ] Characterization test: Görevin dokunduğu her akış için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

#### Yapmamanız gerekenler

- Bir PR'da birden fazla DocType taşımayın.

#### Kontrol listesi

- [ ] PR şablonunun her bölümü dolu.
- [ ] Bütün zorunlu CI kontrolleri yeşil.
- [ ] `architecture/metrics.json` kötüleşmedi.
- [ ] `CODEOWNERS` onayı alındı.
- [ ] Hiçbir test silinmedi ya da atlanmadı.

### 2. Satıcı ve mağaza bağlamını taşıyın

- Sorumlu: Geliştirici

#### User story

Bir geliştirici olarak, bu bağlamın kendi modülünde durmasını istiyorum. Böylece başka geliştiricilerin işini bozmam.

#### Kabul kriterleri

- [ ] Bağlamın `api.py`, `contracts.py` ve `hooks_fragment.py` dosyaları var.
- [ ] Bağlamın bütün epic'leri "Bitti" durumunda.
- [ ] Bağlam için istisna sayısı 0.
- [ ] Characterization test: Görevin dokunduğu her akış için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

#### Yapmamanız gerekenler

- Bir PR'da birden fazla DocType taşımayın.

#### Kontrol listesi

- [ ] PR şablonunun her bölümü dolu.
- [ ] Bütün zorunlu CI kontrolleri yeşil.
- [ ] `architecture/metrics.json` kötüleşmedi.
- [ ] `CODEOWNERS` onayı alındı.
- [ ] Hiçbir test silinmedi ya da atlanmadı.

### 3. Medya bağlamını taşıyın

- Sorumlu: Geliştirici

#### User story

Bir geliştirici olarak, bu bağlamın kendi modülünde durmasını istiyorum. Böylece başka geliştiricilerin işini bozmam.

#### Kabul kriterleri

- [ ] Bağlamın `api.py`, `contracts.py` ve `hooks_fragment.py` dosyaları var.
- [ ] Bağlamın bütün epic'leri "Bitti" durumunda.
- [ ] Bağlam için istisna sayısı 0.
- [ ] Characterization test: Görevin dokunduğu her akış için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

#### Yapmamanız gerekenler

- Bir PR'da birden fazla DocType taşımayın.

#### Kontrol listesi

- [ ] PR şablonunun her bölümü dolu.
- [ ] Bütün zorunlu CI kontrolleri yeşil.
- [ ] `architecture/metrics.json` kötüleşmedi.
- [ ] `CODEOWNERS` onayı alındı.
- [ ] Hiçbir test silinmedi ya da atlanmadı.

### 4. İçe aktarma bağlamını taşıyın

- Sorumlu: Geliştirici

#### User story

Bir geliştirici olarak, bu bağlamın kendi modülünde durmasını istiyorum. Böylece başka geliştiricilerin işini bozmam.

#### Kabul kriterleri

- [ ] Bağlamın `api.py`, `contracts.py` ve `hooks_fragment.py` dosyaları var.
- [ ] Bağlamın bütün epic'leri "Bitti" durumunda.
- [ ] Bağlam için istisna sayısı 0.
- [ ] Characterization test: Görevin dokunduğu her akış için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

#### Yapmamanız gerekenler

- Bir PR'da birden fazla DocType taşımayın.

#### Kontrol listesi

- [ ] PR şablonunun her bölümü dolu.
- [ ] Bütün zorunlu CI kontrolleri yeşil.
- [ ] `architecture/metrics.json` kötüleşmedi.
- [ ] `CODEOWNERS` onayı alındı.
- [ ] Hiçbir test silinmedi ya da atlanmadı.

### 5. Değerlendirme bağlamını taşıyın

- Sorumlu: Geliştirici

#### User story

Bir geliştirici olarak, bu bağlamın kendi modülünde durmasını istiyorum. Böylece başka geliştiricilerin işini bozmam.

#### Kabul kriterleri

- [ ] Bağlamın `api.py`, `contracts.py` ve `hooks_fragment.py` dosyaları var.
- [ ] Bağlamın bütün epic'leri "Bitti" durumunda.
- [ ] Bağlam için istisna sayısı 0.
- [ ] Characterization test: Görevin dokunduğu her akış için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

#### Yapmamanız gerekenler

- Bir PR'da birden fazla DocType taşımayın.

#### Kontrol listesi

- [ ] PR şablonunun her bölümü dolu.
- [ ] Bütün zorunlu CI kontrolleri yeşil.
- [ ] `architecture/metrics.json` kötüleşmedi.
- [ ] `CODEOWNERS` onayı alındı.
- [ ] Hiçbir test silinmedi ya da atlanmadı.

### 6. Bildirim ve iletişim bağlamını taşıyın

- Sorumlu: Geliştirici

#### User story

Bir geliştirici olarak, bu bağlamın kendi modülünde durmasını istiyorum. Böylece başka geliştiricilerin işini bozmam.

#### Kabul kriterleri

- [ ] Bağlamın `api.py`, `contracts.py` ve `hooks_fragment.py` dosyaları var.
- [ ] Bağlamın bütün epic'leri "Bitti" durumunda.
- [ ] Bağlam için istisna sayısı 0.
- [ ] Characterization test: Görevin dokunduğu her akış için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

#### Yapmamanız gerekenler

- Bir PR'da birden fazla DocType taşımayın.

#### Kontrol listesi

- [ ] PR şablonunun her bölümü dolu.
- [ ] Bütün zorunlu CI kontrolleri yeşil.
- [ ] `architecture/metrics.json` kötüleşmedi.
- [ ] `CODEOWNERS` onayı alındı.
- [ ] Hiçbir test silinmedi ya da atlanmadı.

### 7. Kalan bağlamını taşıyın

- Sorumlu: Geliştirici

#### User story

Bir geliştirici olarak, bu bağlamın kendi modülünde durmasını istiyorum. Böylece başka geliştiricilerin işini bozmam.

#### Kabul kriterleri

- [ ] Bağlamın `api.py`, `contracts.py` ve `hooks_fragment.py` dosyaları var.
- [ ] Bağlamın bütün epic'leri "Bitti" durumunda.
- [ ] Bağlam için istisna sayısı 0.
- [ ] Characterization test: Görevin dokunduğu her akış için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

#### Yapmamanız gerekenler

- Bir PR'da birden fazla DocType taşımayın.

#### Kontrol listesi

- [ ] PR şablonunun her bölümü dolu.
- [ ] Bütün zorunlu CI kontrolleri yeşil.
- [ ] `architecture/metrics.json` kötüleşmedi.
- [ ] `CODEOWNERS` onayı alındı.
- [ ] Hiçbir test silinmedi ya da atlanmadı.

## Faz 5: DocType modüllerini taşıma

DocType'ın modül alanı değişir. Bu adım veritabanını etkiler ve en sona kalır.

### 1. Modül taşıma patch şablonunu yazın

- Sorumlu: Geliştirici

#### User story

Bir geliştirici olarak, güvenli bir patch şablonu istiyorum. Böylece her taşıma aynı güvenli yolla yapılır.

#### Kabul kriterleri

- [ ] Şablon `--dry-run` modunu destekliyor.
- [ ] Şablon iki kez çalışınca veri değiştirmiyor.
- [ ] Şablonun geri dönüş dosyası var ve denendi.
- [ ] Characterization test: Görevin dokunduğu her akış için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Şablon anonimleştirilmiş kopyada `--dry-run` ile çalıştı. Rapor beklenen değişiklikle aynı.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

#### Yapmamanız gerekenler

- Şablonda veri silen komut kullanmayın.

#### Kontrol listesi

- [ ] PR şablonunun her bölümü dolu.
- [ ] Bütün zorunlu CI kontrolleri yeşil.
- [ ] `architecture/metrics.json` kötüleşmedi.
- [ ] `CODEOWNERS` onayı alındı.
- [ ] Hiçbir test silinmedi ya da atlanmadı.

#### Yönergeler

- [06-veri-sahipligi-ve-olaylar.md](YONERGELER/06-veri-sahipligi-ve-olaylar.md)

### 2. DocType'ları bağlam bağlam yeni modüle taşıyın

- Sorumlu: Geliştirici

#### User story

Bir geliştirici olarak, her DocType'ın kendi modülünde görünmesini istiyorum. Böylece sahiplik klasörden belli olur.

#### Kabul kriterleri

- [ ] Her bağlam ayrı bir yayında taşındı.
- [ ] Her taşıma migration rehearsal'dan geçti.
- [ ] Satır sayıları öncesi ve sonrası aynı.
- [ ] Characterization test: Görevin dokunduğu her akış için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Taşıma önce Alpha, Beta ve RC ortamlarında 7'şer gün çalıştı. Hata sayısı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

#### Yapmamanız gerekenler

- Aynı yayında iki bağlamı taşımayın.
- Taşımayı davranış değişikliğiyle birleştirmeyin.

#### Kontrol listesi

- [ ] PR şablonunun her bölümü dolu.
- [ ] Bütün zorunlu CI kontrolleri yeşil.
- [ ] `architecture/metrics.json` kötüleşmedi.
- [ ] `CODEOWNERS` onayı alındı.
- [ ] Hiçbir test silinmedi ya da atlanmadı.

#### Yönergeler

- [06-veri-sahipligi-ve-olaylar.md](YONERGELER/06-veri-sahipligi-ve-olaylar.md)

### 3. Canlıda taşımayı yedekle birlikte yapın

- Sorumlu: Hüseyin Cengiz

#### User story

Bir DevOps mühendisi olarak, canlı taşımayı geri alınabilir yapmak istiyorum. Böylece sorun çıkarsa veri kaybolmaz.

#### Kabul kriterleri

- [ ] Taşımadan önce yedek alındı ve geri yükleme denendi.
- [ ] Taşıma sonrası satır sayıları kontrol edildi.
- [ ] Geri alma süresi ölçüldü.
- [ ] Characterization test: Görevin dokunduğu her akış için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Canlı taşıma, RC ortamındaki 7 günlük hatasız çalışmadan sonra yapıldı.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

#### Yapmamanız gerekenler

- Yedek olmadan canlıda patch çalıştırmayın.

#### Kontrol listesi

- [ ] PR şablonunun her bölümü dolu.
- [ ] Bütün zorunlu CI kontrolleri yeşil.
- [ ] `architecture/metrics.json` kötüleşmedi.
- [ ] `CODEOWNERS` onayı alındı.
- [ ] Hiçbir test silinmedi ya da atlanmadı.

#### Yönergeler

- [06-veri-sahipligi-ve-olaylar.md](YONERGELER/06-veri-sahipligi-ve-olaylar.md)

### 4. "Tradehub Core" modülünü boşaltın ve eski yolları kaldırın

- Sorumlu: Geliştirici

#### User story

Bir geliştirici olarak, eski yönlendirmelerin temizlenmesini istiyorum. Böylece iki yol birden bakım gerektirmez.

#### Kabul kriterleri

- [ ] "Tradehub Core" modülünde DocType kalmadı.
- [ ] Eski import yolları en az iki yayın sonra kaldırıldı.
- [ ] Kapalı kalan feature flag'ler temizlendi.
- [ ] Characterization test: Görevin dokunduğu her akış için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

#### Yapmamanız gerekenler

- Eski yolu aynı yayında kaldırmayın.

#### Kontrol listesi

- [ ] PR şablonunun her bölümü dolu.
- [ ] Bütün zorunlu CI kontrolleri yeşil.
- [ ] `architecture/metrics.json` kötüleşmedi.
- [ ] `CODEOWNERS` onayı alındı.
- [ ] Hiçbir test silinmedi ya da atlanmadı.

#### Yönergeler

- [07-metrikler.md](YONERGELER/07-metrikler.md)
