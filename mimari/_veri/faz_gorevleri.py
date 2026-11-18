"""Faz görevlerinin tek kaynağı. Çalıştırınca faz-gorevleri.json ve FAZ-GOREVLERI.md üretir."""
import json, os

HERE = os.path.dirname(os.path.abspath(__file__))
G = "YONERGELER/"

# Her görevde zorunlu olan kabul kriterleri. "ct" ve "sm" göreve özel yazılmadıysa bunlar kullanılır.
CT_KOD = "Characterization test: Görevin dokunduğu her akış için test yazıldı. Testler değişiklikten önce ve sonra geçti."
SM_KOD = "Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0."
CT_ALTYAPI = "Characterization test: Değişiklikten önce bütün mevcut testlerin sonucu kaydedildi. Değişiklikten sonra sonuçlar aynı."
SM_ALTYAPI = "Shadow mode: Yeni kontrol önce yalnız rapor verdi. En az 10 PR boyunca yanlış uyarı çıkmadı. Sonra zorunlu yapıldı."
TDD = "TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var."
FLAG = "Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor."

KONTROL = [
	"PR şablonunun her bölümü dolu.",
	"Bütün zorunlu CI kontrolleri yeşil.",
	"`architecture/metrics.json` kötüleşmedi.",
	"`CODEOWNERS` onayı alındı.",
	"Hiçbir test silinmedi ya da atlanmadı.",
]

def t(baslik, story, kabul, yapma, sahip="Geliştirici", ct=None, sm=None, altyapi=False, yonerge=()):
	return dict(baslik=baslik, story=story, sahip=sahip, altyapi=altyapi,
		kabul=list(kabul) + [ct or (CT_ALTYAPI if altyapi else CT_KOD), sm or (SM_ALTYAPI if altyapi else SM_KOD), TDD] + ([] if altyapi else [FLAG]),
		yapma=list(yapma), kontrol=KONTROL, yonerge=[G + y for y in yonerge])

FAZLAR = [
 dict(id="Faz -1", ad="Güvenlik ağı", ozet="Kod taşınmadan önce bugünkü davranış testlerle dondurulur. Bu faz bitmeden hiçbir kod taşınmaz.", gorevler=[
  t("Test altyapısını kurun: `pytest`, `syrupy`, `hypothesis`, `time-machine` ve test veri fabrikaları",
    "Bir geliştirici olarak, testleri tek komutla çalıştırmak istiyorum. Böylece her değişikliği hemen kontrol ederim.",
    ["`pytest` tek komutla yerelde ve CI'da çalışıyor.", "`tests/factories.py` satıcı, ürün, sepet ve sipariş üretiyor.", "Araç sürümleri `pyproject.toml` dosyasında sabit."],
    ["Canlı veritabanına bağlanan test yazmayın.", "Rastgele veri ya da gerçek saat kullanan test yazmayın."], altyapi=True, yonerge=["01-tdd.md"]),
  t("12 ana akış için characterization test yazın",
    "Bir geliştirici olarak, bugünkü davranışın kaydını istiyorum. Böylece taşıma sırasında bir şey bozulursa hemen görürüm.",
    ["Şu 12 akışın her biri için snapshot testi var: satıcı başvurusu ve onayı, tek ürün oluşturma, CSV ile toplu yükleme, XML akışı, sepete ekleme, sepetten sipariş, ödeme tahsilatı ve stok düşümü, vergi hesabı, sevkiyat oluşturma ve teslim, tam iptal, kısmi iptal ve iade, fatura belgesi.",
     "Her test iki kez çalıştırıldı ve aynı sonucu verdi.", "Snapshot dosyaları repoda."],
    ["Bu görevde uygulama kodunu değiştirmeyin. Yalnız test ekleyin.", "Hatalı davranışı düzeltmeyin. Hatalı sonucu kaydedin ve issue numarasını yazın."],
    ct="Characterization test: Bu görevin kendisi bu testleri yazar. 12 akışın 12'si kapsandı.",
    sm="Shadow mode: Testler önce yalnız rapor verdi. Üç ardışık CI çalışmasında sonuç aynı çıktı. Sonra zorunlu yapıldı.", altyapi=True, yonerge=["02-characterization-test.md"]),
  t("Bilinen hatalar için `xfail` testleri yazın (#370, #371, #374 ve diğer kriz ve kritik issue'lar)",
    "Bir geliştirici olarak, bilinen hataların testini istiyorum. Böylece hata düzelince ya da geri gelince haberim olur.",
    ["`öncelik: kriz` ve `öncelik: kritik` etiketli her issue için bir `xfail` testi var.", "Her testte issue numarası yazılı.", "CI, beklenmedik biçimde geçen `xfail` testini raporluyor."],
    ["Bu görevde hatayı düzeltmeyin.", "`xfail` yerine testi atlamayın (`skip`)."], altyapi=True, yonerge=["01-tdd.md"]),
  t("Feature flag altyapısını ekleyin",
    "Bir platform yöneticisi olarak, yeni kodu bir anahtarla açıp kapatmak istiyorum. Böylece sorun çıkınca kod geri alınmadan eski yola dönerim.",
    ["`tradehub_core/shared/flags.py` içinde `is_enabled(ad)` fonksiyonu var.", "Bayraklar `TH Feature Flag` kaydında tutuluyor ve ortam bazında ayarlanıyor.", "Bayrağı değiştirmek yeniden yayın gerektirmiyor.", "Her bayrak değişikliği kayda geçiyor."],
    ["Bayrağı kod içine sabit yazmayın.", "Bayrağı yapay zekâ ajanına açtırmayın."], altyapi=True, yonerge=["03-shadow-mode.md"]),
  t("Canlı veritabanının anonimleştirilmiş kopyasını hazırlayın",
    "Bir DevOps mühendisi olarak, gerçek veriye benzeyen güvenli bir kopya istiyorum. Böylece her patch canlıdan önce bu kopyada denenir.",
    ["Kopya Colima üzerindeki MariaDB konteynerinde çalışıyor.", "E-posta, telefon, vergi numarası ve banka bilgileri değiştirildi.", "Kopya haftada bir yenileniyor.", "Yedekten geri yükleme test sitesinde denendi."],
    ["Anonimleştirilmemiş veriyi geliştirici makinesine kopyalamayın.", "Kopyayı herkese açık bir yere koymayın."],
    sahip="Hüseyin Cengiz", altyapi=True, yonerge=["06-veri-sahipligi-ve-olaylar.md"]),
  t("Geri alma tatbikatı yapın",
    "Bir DevOps mühendisi olarak, geri almayı önceden denemek istiyorum. Böylece gerçek sorunda ne yapacağımı bilirim.",
    ["Alpha ortamında bir yayın geri alındı ve süre ölçüldü.", "Geri alma adımları yazılı.", "Yedekten geri yükleme süresi ölçüldü."],
    ["Tatbikatı canlı ortamda yapmayın."], sahip="Hüseyin Cengiz", altyapi=True, yonerge=["06-veri-sahipligi-ve-olaylar.md"]),
 ]),
 dict(id="Faz 0", ad="CI kapısı ve kurallar", ozet="Kuralları makine uygular. Her kontrol önce yalnız rapor verir, sonra zorunlu olur.", gorevler=[
  t("CI'a uygulama testlerini ekleyin", "Bir geliştirici olarak, her PR'da testlerin çalışmasını istiyorum. Böylece kırık kod Alpha'ya çıkmaz.",
    ["Her PR'da `pytest` çalışıyor.", "\"Alpha Release\" işi testlerin başarısına bağlı.", "CI süresi 15 dakikayı geçmiyor.", "Bu görev #372 issue'sunu kapatıyor."],
    ["Başarısız testi geçirmek için testi silmeyin.", "CI süresini kısaltmak için test atlamayın."], altyapi=True, yonerge=["01-tdd.md", "08-pr-sablonu.md"]),
  t("CI'a Ruff kontrolünü ekleyin", "Bir geliştirici olarak, kod biçiminin otomatik kontrolünü istiyorum. Böylece incelemede biçim tartışılmaz.",
    ["`ruff check` ve `ruff format --check` her PR'da çalışıyor.", "Mevcut ihlaller bir taban dosyasında kayıtlı. Yeni ihlal PR'ı durduruyor."],
    ["Bu görevde bütün eski kodu yeniden biçimlendirmeyin.", "Kuralı kapatmak için `noqa` eklemeyin."], altyapi=True, yonerge=["08-pr-sablonu.md"]),
  t("`import-linter` kontrolünü ekleyin", "Bir geliştirici olarak, bağlam sınırlarının otomatik kontrolünü istiyorum. Böylece başka bağlamın iç koduna kazayla bağlanmam.",
    ["Her bağlam için bir sözleşme tanımlı.", "Mevcut ihlaller `architecture/exceptions.toml` dosyasında kayıtlı.", "Yeni ihlal PR'ı durduruyor."],
    ["İhlali gizlemek için `ignore_imports` listesine genel kalıp eklemeyin."], altyapi=True, yonerge=["06-veri-sahipligi-ve-olaylar.md"]),
  t("`semgrep` ile bağlamlar arası yazım kurallarını ekleyin", "Bir geliştirici olarak, başka bağlamın tablosuna yazan kodun yakalanmasını istiyorum. Böylece veri sahipliği korunur.",
    ["`architecture/ownership.toml` her DocType'ın sahibini yazıyor.", "Kurallar `set_value`, `db.sql` ve `get_doc().save()` kalıplarını yakalıyor.", "f-string ile kurulan SQL yakalanıyor.", "Mevcut ihlaller istisna dosyasında kayıtlı."],
    ["Kuralı geçmek için SQL metnini parçalara bölmeyin."], altyapi=True, yonerge=["06-veri-sahipligi-ve-olaylar.md"]),
  t("Testlerde çalışan yazma koruyucusunu ekleyin", "Bir geliştirici olarak, sahibi olmayan kodun yazımını testte görmek istiyorum. Böylece kod taramasının kaçırdığı yazımlar da yakalanır.",
    ["Koruyucu her veritabanı yazımında yazan paketi buluyor.", "Sahip olmayan yazım testi başarısız yapıyor.", "Koruyucu canlıda yalnız kayıt tutuyor."],
    ["Koruyucuyu canlıda hata verecek biçimde açmayın."], altyapi=True, yonerge=["06-veri-sahipligi-ve-olaylar.md"]),
  t("Olay sözleşmesi kontrolünü ekleyin", "Bir geliştirici olarak, kırıcı sözleşme değişikliğinin durdurulmasını istiyorum. Böylece dinleyen bağlamlar bozulmaz.",
    ["CI, Pydantic modellerinden JSON Schema üretiyor.", "CI, eski ve yeni şemayı karşılaştırıyor.", "Kırıcı değişiklik PR'ı durduruyor."],
    ["Üretilen şema dosyasını elle düzenlemeyin."], altyapi=True, yonerge=["05-olay-sozlesmesi.md"]),
  t("CI'a `bench migrate` denemesini ve migration rehearsal'ı ekleyin", "Bir DevOps mühendisi olarak, her patch'in kopyada denenmesini istiyorum. Böylece hatalı patch canlı veriyi bozmaz.",
    ["Patch içeren her PR'da `bench migrate` boş sitede çalışıyor.", "Patch anonimleştirilmiş kopyada çalışıyor.", "Patch iki kez çalışıyor ve ikinci çalıştırma veri değiştirmiyor.", "Satır sayıları öncesi ve sonrası karşılaştırılıyor."],
    ["Denemeyi canlı veritabanında yapmayın.", "Başarısız denemeyi atlamak için patch'i `try/except` içine almayın."],
    sahip="Hüseyin Cengiz", altyapi=True, yonerge=["06-veri-sahipligi-ve-olaylar.md"]),
  t("`diff-cover` ile değişen satır kapsamını zorunlu yapın", "Bir geliştirici olarak, testsiz kodun birleştirilmemesini istiyorum. Böylece TDD kuralı kendiliğinden uygulanır.",
    ["Değişen satırların kapsamı %90'ın altındaysa PR duruyor.", "Silinen ya da atlanan test PR'ı durduruyor."],
    ["Kapsamı artırmak için hiçbir şey kontrol etmeyen test yazmayın."], altyapi=True, yonerge=["01-tdd.md"]),
  t("Metrik betiğini ve ratchet kontrolünü ekleyin", "Bir platform yöneticisi olarak, sayıların kötüleşmemesini istiyorum. Böylece yapının eski hâline dönmesini engellerim.",
    ["`scripts/architecture_metrics.py` metrik yönergesindeki bütün sayıları üretiyor.", "Bir sayı kötüleşirse PR duruyor.", "Haftalık rapor her pazartesi oluşuyor."],
    ["Sayıyı düzeltmek için ölçümü değiştirmeyin."], altyapi=True, yonerge=["07-metrikler.md"]),
  t("`CODEOWNERS`, PR şablonu ve dal korumasını ekleyin", "Bir platform yöneticisi olarak, kuralların atlanamamasını istiyorum. Böylece disiplin kişilere bağlı kalmaz.",
    ["`CODEOWNERS` her bağlamı bir sahibe bağlıyor.", "PR şablonu repoda. CI boş bölümü durduruyor.", "`version-15` dalında zorunlu kontroller açık. Yönetici de atlayamıyor."],
    ["Dal korumasını geçici olarak kapatmayın."], sahip="Hüseyin Cengiz", altyapi=True, yonerge=["08-pr-sablonu.md"]),
 ]),
 dict(id="Faz 1", ad="Ortak çekirdek ve olay sistemi", ozet="Para tipi, olay sistemi, shadow mode yardımcısı ve sözleşme araçları kurulur.", gorevler=[
  t("`Money` value object sınıfını ekleyin", "Bir geliştirici olarak, parayı tek bir güvenli tiple taşımak istiyorum. Böylece yuvarlama ve para birimi hataları oluşmaz.",
    ["`shared/money.py` içinde değişmez `Money` sınıfı var.", "Farklı para birimlerini toplamak hata veriyor.", "Yuvarlama kuralı tek yerde ve property-based testle korunuyor."],
    ["Yeni kodda tutar için `float` kullanmayın.", "Bu görevde mevcut alanların tipini değiştirmeyin."], yonerge=["04-is-kurallari.md"]),
  t("`Domain Event` outbox kaydını ve `publish` fonksiyonunu ekleyin", "Bir geliştirici olarak, olayı işle aynı işlemde kaydetmek istiyorum. Böylece olay kaybolmaz.",
    ["Olay, işi yapan kayıtla aynı işlemde yazılıyor.", "İşlem geri alınınca olay da geri alınıyor. Bunun testi var.", "Her olayın değişmeyen `event_id` değeri var."],
    ["Olayı `frappe.enqueue` ile doğrudan göndermeyin. Önce outbox'a yazın."], yonerge=["06-veri-sahipligi-ve-olaylar.md"]),
  t("Dağıtıcıyı, tekrar denemeyi ve dead letter listesini ekleyin", "Bir geliştirici olarak, başarısız olayın yeniden denenmesini istiyorum. Böylece geçici hatalar veri kaybına yol açmaz.",
    ["Başarısız olay artan aralıklarla en çok 8 kez deneniyor.", "8 denemeden sonra olay dead letter listesine geçiyor.", "Dead letter kaydı ekibe bildirim gönderiyor."],
    ["Başarısız olayı silmeyin.", "Hatayı sessizce yutmayın."], yonerge=["06-veri-sahipligi-ve-olaylar.md"]),
  t("`Processed Event` kaydı ile idempotent dinleyici altyapısını ekleyin", "Bir geliştirici olarak, aynı olayın iki kez işlenmemesini istiyorum. Böylece stok ve para iki kez hareket etmez.",
    ["`(dinleyici, event_id)` çifti veritabanında benzersiz.", "Aynı olay iki kez gönderilince ikinci gönderim iş yapmıyor. Bunun testi var.", "`@subscriber` dekoratörü bu kontrolü kendiliğinden yapıyor."],
    ["Tekrar kontrolünü dinleyicinin içine elle yazmayın. Dekoratörü kullanın."], yonerge=["06-veri-sahipligi-ve-olaylar.md"]),
  t("`shadow_compare` yardımcısını ve `Shadow Mismatch Log` kaydını ekleyin", "Bir geliştirici olarak, eski ve yeni yolu güvenle karşılaştırmak istiyorum. Böylece yeni yola kanıtla geçerim.",
    ["Yeni kodun hatası kullanıcıya gitmiyor.", "Yeni kod arka planda çalışıyor ve isteği yavaşlatmıyor.", "Fark `Shadow Mismatch Log` kaydına yazılıyor.", "Geçiş koşullarını gösteren bir rapor var."],
    ["Shadow mode'da yeni kodun veritabanına yazmasına izin vermeyin."],
    sm="Shadow mode: Yardımcının kendisi örnek bir hesapta 7 gün çalıştı. Yanlış fark kaydı çıkmadı.", yonerge=["03-shadow-mode.md"]),
  t("Pydantic olay modellerini ve şema kaydını kurun", "Bir geliştirici olarak, olayların yazılı sözleşmesini istiyorum. Böylece olayın anlamı kazara değişmez.",
    ["Olaylar Pydantic modeli. Her modelin docstring'inde \"Anlam\" satırı var.", "JSON Schema dosyaları `contracts/schemas/` klasöründe.", "Her olay için en az üç örnek veri dosyası var."],
    ["Olay verisini düz sözlük olarak göndermeyin."], yonerge=["05-olay-sozlesmesi.md"]),
  t("TypeScript tiplerini ve `zod` doğrulamasını üretin", "Bir ön yüz geliştiricisi olarak, API tiplerinin otomatik gelmesini istiyorum. Böylece arka uç değişince derleme hata verir.",
    ["`json-schema-to-typescript` tipleri üretiyor.", "`tradehubfront` ve `admin-panel` üretilen tipleri kullanıyor.", "API cevapları `zod` ile doğrulanıyor.", "CI, üretilen dosyaların güncel olduğunu kontrol ediyor."],
    ["Üretilen tip dosyasını elle düzenlemeyin."], yonerge=["05-olay-sozlesmesi.md"]),
  t("Saatlik uzlaştırma işini ekleyin", "Bir platform yöneticisi olarak, kaybolan olayların bulunmasını istiyorum. Böylece eksik iş fark edilmeden kalmaz.",
    ["İş, olayı yayınlanmamış kayıtları buluyor.", "İş, bulduklarını raporluyor ve bildirim gönderiyor.", "İş hiçbir veriyi kendiliğinden değiştirmiyor."],
    ["Uzlaştırma işine otomatik düzeltme yaptırmayın."], sahip="Hüseyin Cengiz", yonerge=["06-veri-sahipligi-ve-olaylar.md"]),
 ]),
 dict(id="Faz 2", ad="hooks.py dosyasını bölme", ozet="Ortak dosyalar bağlamlara bölünür. Merge çakışmaları azalır.", gorevler=[
  t("`hooks_merge.py` yardımcısını ekleyin", "Bir geliştirici olarak, bağlam kayıtlarının otomatik birleşmesini istiyorum. Böylece `hooks.py` dosyasına elle yazmam.",
    ["Yardımcı `doc_events`, `scheduler_events` ve yetki kayıtlarını birleştiriyor.", "Aynı anahtara iki bağlam yazarsa yardımcı hata veriyor."],
    ["Birleştirme sırasını rastgele bırakmayın. Sıra sabit olmalı."],
    ct="Characterization test: Birleşmiş `doc_events` sözlüğü eski sözlükle bire bir aynı. Bunun testi var.",
    sm="Shadow mode: Yeni birleşmiş sözlük açılışta eski sözlükle karşılaştırıldı. 7 gün boyunca fark 0."),
  t("Her bağlam için `hooks_fragment.py` oluşturun ve kayıtları taşıyın", "Bir geliştirici olarak, kendi bağlamımın kayıtlarını kendi dosyamda tutmak istiyorum. Böylece başka geliştiriciyle çakışmam.",
    ["Her bağlamın kendi `hooks_fragment.py` dosyası var.", "`hooks.py` içinde doğrudan kayıt kalmadı.", "Her bağlam ayrı bir PR ile taşındı."],
    ["Taşıma sırasında bir kaydın davranışını değiştirmeyin.", "Bir PR'da iki bağlamı taşımayın."],
    ct="Characterization test: Her taşımadan sonra birleşmiş sözlük eski sözlükle aynı.",
    sm="Shadow mode: Yeni birleşmiş sözlük açılışta eski sözlükle karşılaştırıldı. 7 gün boyunca fark 0."),
  t("`permissions.py` dosyasını bağlamlara bölün", "Bir geliştirici olarak, yetki kurallarımı kendi bağlamımda tutmak istiyorum. Böylece yetki değişiklikleri çakışmaz.",
    ["Her bağlamın yetki fonksiyonları kendi paketinde.", "Satıcı izolasyonu testleri her DocType için var."],
    ["Yetki kuralını gevşetmeyin.", "`ignore_permissions=True` eklemeyin."],
    sm="Shadow mode: Eski ve yeni yetki fonksiyonu aynı sorgu için karşılaştırıldı. 7 gün ve 500 sorguda fark 0."),
  t("`patches.txt` dosyasını bölümlere ayırın ve patch klasörlerini taşıyın", "Bir geliştirici olarak, patch'imi kendi bölümüme eklemek istiyorum. Böylece `patches.txt` çakışması azalır.",
    ["Her bağlamın `patches.txt` içinde kendi bölümü var.", "Yeni patch'ler `tradehub_core/<bağlam>/patches/` klasöründe.", "Çalışmış patch'lerin yolu değişmedi."],
    ["Çalışmış bir patch'in adını ya da yolunu değiştirmeyin. Frappe onu yeniden çalıştırır."],
    sm="Shadow mode: Yeni düzen anonimleştirilmiş kopyada `bench migrate` ile denendi. Hiçbir eski patch yeniden çalışmadı."),
 ]),
 dict(id="Faz 3", ad="Sipariş, vergi, ödeme ve lojistik", ozet="En çok hata üreten alan olaylarla ayrılır. Her adım shadow mode ile doğrulanır.", gorevler=[
  t("Dört bağlama `api.py` ve `contracts.py` ekleyin", "Bir geliştirici olarak, her bağlamın tek bir dış kapısını istiyorum. Böylece neyi çağırabileceğimi bilirim.",
    ["`ordering`, `tax`, `payments` ve `logistics` paketlerinde `api.py` ve `contracts.py` var.", "Fonksiyonlar tipli girdi ve çıktı kullanıyor.", "Her fonksiyonun sözleşme testi var."],
    ["`api.py` içine iş kuralı yazmayın. Yalnız iç servisi çağırın."]),
  t("Sipariş durumunu durum makinesine taşıyın", "Bir geliştirici olarak, sipariş durumunu tek yerden değiştirmek istiyorum. Böylece #370 türü hatalar oluşmaz.",
    ["`ordering/state.py` bütün geçişleri tanımlıyor.", "İzin verilmeyen geçiş hata veriyor.", "Her geçişin testi var. Her durum çifti için property-based test var."],
    ["`Order.status` alanına başka bir yerden yazmayın.", "`frappe.db.set_value(\"Order\", ...)` kullanmayın."], yonerge=["06-veri-sahipligi-ve-olaylar.md"]),
  t("Vergi hesabını `tax.api` üzerinden sorgu olarak sunun", "Bir alıcı olarak, sepette doğru vergiyi hemen görmek istiyorum. Böylece ödeyeceğim tutarı bilirim.",
    ["Sipariş denetleyicisi `tax_core` iç modüllerini çağırmıyor.", "Vergi kuralları karar tablosunda. Mali müşavir onayı PR'da.", "Vergi invariant'ları için property-based test var.", "Vergi paketinde mutation skoru en az %80."],
    ["Vergi hesabını olaya taşımayın. Sonuç hemen gerekiyor.", "Tutar için `float` kullanmayın."], yonerge=["04-is-kurallari.md"]),
  t("İade hesabını vergi sözleşmesine bağlayın (#371)", "Bir alıcı olarak, iptalde doğru tutarın iade edilmesini istiyorum. Böylece az ya da fazla iade almam.",
    ["İade tutarı kalemin dondurulmuş brüt tutarından hesaplanıyor.", "Çoklu vergi ve vergi dahil fiyat için test var.", "#371 için yazılan `xfail` testi normal teste döndü."],
    ["İade formülünü lojistik paketinde tutmayın."], yonerge=["04-is-kurallari.md"]),
  t("`payment.collected` olayını ekleyin ve ödeme kodunun sipariş yazımını kaldırın", "Bir geliştirici olarak, ödemenin siparişe olayla haber vermesini istiyorum. Böylece ödeme kodu sipariş durumlarını bilmek zorunda kalmaz.",
    ["`payments/service.py` içinde `Order` yazımı kalmadı.", "Sipariş bağlamı `payment.collected` olayını idempotent işliyor.", "Olay iki kez gelince sipariş bir kez onaylanıyor. Bunun testi var."],
    ["Ödeme kodundan sipariş durumuna bakmayın."], yonerge=["05-olay-sozlesmesi.md", "06-veri-sahipligi-ve-olaylar.md"]),
  t("`order.confirmed` olayı ile stok düşümünü ayırın (#370)", "Bir satıcı olarak, ödenen siparişte stoğun her durumda düşmesini istiyorum. Böylece olmayan ürünü satmam.",
    ["Stok, `order.confirmed` olayıyla düşüyor.", "Stok defterinde `(sipariş, kalem, hareket türü)` benzersiz.", "Stok hiçbir girdide eksiye düşmüyor. Property-based test var.", "#370 için yazılan `xfail` testi normal teste döndü."],
    ["Stok düşümünü sipariş durumuna bağlamayın."], yonerge=["06-veri-sahipligi-ve-olaylar.md"]),
  t("Lojistiğin sipariş yazımını olaylarla değiştirin", "Bir geliştirici olarak, lojistiğin siparişe olayla haber vermesini istiyorum. Böylece lojistik geliştiricisi sipariş kaydına dokunmaz.",
    ["`logistics/hooks.py` içinde `Order` yazımı kalmadı.", "Lojistik `shipment.handed_over` ve `shipment.delivered` olaylarını yayınlıyor.", "Sevkiyat taslağı `order.confirmed` olayıyla oluşuyor."],
    ["`Order.status` ve `fulfillment_status` alanlarına lojistikten yazmayın."], yonerge=["05-olay-sozlesmesi.md"]),
  t("Dört bağlamda `import-linter` ve yazım kurallarını zorunlu yapın", "Bir platform yöneticisi olarak, bu dört bağlamda sınırın kilitlenmesini istiyorum. Böylece yapı geri bozulmaz.",
    ["Dört bağlam için istisna sayısı 0.", "Kontroller PR'ı durduruyor."],
    ["İstisna dosyasına yeni satır eklemeyin."], altyapi=True, yonerge=["07-metrikler.md"]),
 ]),
 dict(id="Faz 4", ad="Diğer bağlamlar", ozet="Kalan bağlamlar aynı yöntemle taşınır. Her DocType'ın epic'i bu fazdadır.", gorevler=[
  t(f"{b} bağlamını taşıyın", "Bir geliştirici olarak, bu bağlamın kendi modülünde durmasını istiyorum. Böylece başka geliştiricilerin işini bozmam.",
    ["Bağlamın `api.py`, `contracts.py` ve `hooks_fragment.py` dosyaları var.", "Bağlamın bütün epic'leri \"Bitti\" durumunda.", "Bağlam için istisna sayısı 0."],
    ["Bir PR'da birden fazla DocType taşımayın."])
  for b in ["Katalog", "Satıcı ve mağaza", "Medya", "İçe aktarma", "Değerlendirme", "Bildirim ve iletişim", "Kalan"]
 ]),
 dict(id="Faz 5", ad="DocType modüllerini taşıma", ozet="DocType'ın modül alanı değişir. Bu adım veritabanını etkiler ve en sona kalır.", gorevler=[
  t("Modül taşıma patch şablonunu yazın", "Bir geliştirici olarak, güvenli bir patch şablonu istiyorum. Böylece her taşıma aynı güvenli yolla yapılır.",
    ["Şablon `--dry-run` modunu destekliyor.", "Şablon iki kez çalışınca veri değiştirmiyor.", "Şablonun geri dönüş dosyası var ve denendi."],
    ["Şablonda veri silen komut kullanmayın."], yonerge=["06-veri-sahipligi-ve-olaylar.md"],
    sm="Shadow mode: Şablon anonimleştirilmiş kopyada `--dry-run` ile çalıştı. Rapor beklenen değişiklikle aynı."),
  t("DocType'ları bağlam bağlam yeni modüle taşıyın", "Bir geliştirici olarak, her DocType'ın kendi modülünde görünmesini istiyorum. Böylece sahiplik klasörden belli olur.",
    ["Her bağlam ayrı bir yayında taşındı.", "Her taşıma migration rehearsal'dan geçti.", "Satır sayıları öncesi ve sonrası aynı."],
    ["Aynı yayında iki bağlamı taşımayın.", "Taşımayı davranış değişikliğiyle birleştirmeyin."], yonerge=["06-veri-sahipligi-ve-olaylar.md"],
    sm="Shadow mode: Taşıma önce Alpha, Beta ve RC ortamlarında 7'şer gün çalıştı. Hata sayısı 0."),
  t("Canlıda taşımayı yedekle birlikte yapın", "Bir DevOps mühendisi olarak, canlı taşımayı geri alınabilir yapmak istiyorum. Böylece sorun çıkarsa veri kaybolmaz.",
    ["Taşımadan önce yedek alındı ve geri yükleme denendi.", "Taşıma sonrası satır sayıları kontrol edildi.", "Geri alma süresi ölçüldü."],
    ["Yedek olmadan canlıda patch çalıştırmayın."], sahip="Hüseyin Cengiz", yonerge=["06-veri-sahipligi-ve-olaylar.md"],
    sm="Shadow mode: Canlı taşıma, RC ortamındaki 7 günlük hatasız çalışmadan sonra yapıldı."),
  t("\"Tradehub Core\" modülünü boşaltın ve eski yolları kaldırın", "Bir geliştirici olarak, eski yönlendirmelerin temizlenmesini istiyorum. Böylece iki yol birden bakım gerektirmez.",
    ["\"Tradehub Core\" modülünde DocType kalmadı.", "Eski import yolları en az iki yayın sonra kaldırıldı.", "Kapalı kalan feature flag'ler temizlendi."],
    ["Eski yolu aynı yayında kaldırmayın."], yonerge=["07-metrikler.md"]),
 ]),
]

out = []
md = ["# Faz görevleri", "", "Bu dosya `_veri/faz_gorevleri.py` betiğinden üretilir. Elle düzenlemeyin.", ""]
for f in FAZLAR:
	md += [f"## {f['id'].replace('-', '−')}: {f['ad']}", "", f["ozet"], ""]
	for i, g in enumerate(f["gorevler"], 1):
		g["id"] = f"faz/{f['id'].lower().replace(' -', '-eksi-').replace(' ', '-')}/{i}"
		md += [f"### {i}. {g['baslik']}", "", f"- Sorumlu: {g['sahip']}", "", "#### User story", "", g["story"], "", "#### Kabul kriterleri", ""]
		md += [f"- [ ] {k}" for k in g["kabul"]] + ["", "#### Yapmamanız gerekenler", ""] + [f"- {y}" for y in g["yapma"]]
		md += ["", "#### Kontrol listesi", ""] + [f"- [ ] {k}" for k in g["kontrol"]] + [""]
		if g["yonerge"]:
			md += ["#### Yönergeler", ""] + [f"- [{y.split('/')[-1]}]({y})" for y in g["yonerge"]] + [""]
	out.append(f)
json.dump(out, open(os.path.join(HERE, "faz-gorevleri.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)
open(os.path.join(HERE, "..", "FAZ-GOREVLERI.md"), "w", encoding="utf-8").write("\n".join(md))
print(sum(len(f["gorevler"]) for f in out), "faz görevi")
