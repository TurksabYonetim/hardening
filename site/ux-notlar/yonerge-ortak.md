# Yönergeler ve ortak parçalar: UX notları

Kapsam adım `yonerge-ortak` oldu.

Sahip olduğum dosyalar şunlardır:

- `src/components/GuidePages.tsx`
- `src/components/bits.tsx`

Baktığım sayfalar şunlardır:

- `/yonergeler/` listesi
- 9 yönerge sayfası
- Ortak parçaların göründüğü `/kanban/` ve `/doctype/...` sayfaları

Her geçişte 320, 375, 768 ve 1280 CSS piksel genişliğe baktım.

## 1. geçiş

### Bulduğum sorunlar

1. Liste kartının başlığı dar ekranda kırpıldı. 320 pikselde üç yönergenin adı
   "..." ile kesildi. Okur yönergenin adını okuyamadı.
2. Kart başlığındaki bağlantı yalnız 20 piksel yüksekliğindeydi. Dokunma hedefi
   44 pikselin altındaydı.
3. Sayfada 9 kart vardı. Her kartın kenarlığı, başlık bölümü ve ayraç çizgisi
   vardı. Ekran kutu yığınına dönüştü.
4. 1280 pikselde özet satırları 140 karaktere kadar uzadı. Uzun satır okumayı
   zorlaştırdı.
5. Listede sıra numarası yoktu. Yönergeler sıralı okunur. Okur sırayı göremedi.
6. Geniş tablolar 320 ve 375 pikselde sağdan kesildi. Tablonun yana kaydığını
   gösteren bir işaret yoktu.
7. Geniş tabloya klavyeyle erişilemedi. Yalnız fare ve parmak tabloyu kaydırdı.
8. Alt gezinme düğmelerinde yalnız yönergenin adı yazıyordu. "Önceki" ve
   "Sonraki" sözleri yalnız ekran okuyucuya gidiyordu.

### Yaptığım değişiklikler

1. `GuidePages.tsx` dosyasında liste kartlarını kaldırdım. Yerine numaralı bir liste
   koydum. Her satırda sıra numarası, yönerge adı ve özet vardır. Satırları düz
   bir çizgi ayırır.
2. `GuidePages.tsx` dosyasında yönerge adını `h2` başlık yaptım. Başlık artık kırpılmaz ve
   tam sarılır.
3. `GuidePages.tsx` dosyasında bağlantıyı en az 44 piksel yüksekliğe getirdim.
4. `GuidePages.tsx` dosyasında özet genişliğini 70 karaktere sınırladım. Uyarı kutusunu da
   76 karaktere sınırladım.
5. `GuidePages.tsx` dosyasında alt gezinmeyi `nav` öğesi yaptım. Düğmelerde artık "Önceki
   yönerge" ve "Sonraki yönerge" yazısı görünür.
6. `bits.tsx` dosyasında rapor HTML'indeki her tabloyu kendi kutusuna aldım. Kutu geniş
   tabloyu yana kaydırır.
7. `bits.tsx` dosyasında tablo taşarsa kutunun üstünde "Tablo geniştir. Tabloyu yana
   kaydırın." ipucu çıkar. Tablo sığarsa ipucu gizlenir.
8. `bits.tsx` dosyasında taşan tablonun sağ kenarına soluk bir geçiş ekledim. Tablo sona
   kayınca geçiş kaybolur.
9. `bits.tsx` dosyasında tablo kutusunu klavyeyle kaydırılır yaptım. Sol ok, sağ ok, Home
   ve End tuşları çalışır. Safari odaklanan kutuyu ok tuşuyla kaydırmaz. Bu
   yüzden kaydırmayı kendim yazdım.
10. `bits.tsx` dosyasında odaklanan tablo kutusu sarı zemin yerine alt kenarda sarı bant
    alır. Bant çevreleyen halka değildir.

### Kontrol sonucu

- `npm run test:dev -- tests/ux-yonerge-ortak.spec.ts` komutunda 136 kontrol
  geçti ve 11 kontrol atlandı.
- `npm run test:dev -- tests/site.spec.ts` komutunda 357 kontrol geçti.

## İstekler

1. `playwright.config.ts` dosyasında `trace: "retain-on-failure"` ayarı var.
   Bütün ajanlar aynı `test-results` klasörünü kullanır. İki ajan aynı anda test
   çalıştırınca Playwright birbirinin iz dosyasını siler. Testler gerçek bir
   sorun olmadan başarısız olur. Hata şöyledir: `browserContext.close: ENOENT:
   no such file or directory ... .playwright-artifacts-0/traces/...`.
   Çözüm önerim şudur: her ajan kendi çıktı klasörünü kullansın. Örneğin
   `outputDir` değeri `test-results/${process.env.UX_AGENT || "ortak"}` olsun.
   Ben şimdilik komuta `--trace=off --output=<kendi klasörüm>` ekleyerek
   çalıştım.

2. `.md h3` başlığı ile `.md h2` başlığının üst boşluğu aynıdır. İkisi de
   `var(--space-6)` kullanır. Bu yüzden bölüm ile alt bölüm ayrılmaz. İsteğim
   şudur: `.md h3` üst boşluğu `var(--space-4)` olsun. Gereken yer
   `src/styles/tokens.css` dosyasındaki `.md h1, .md h2, .md h3, .md h4`
   kuralıdır. Örnek sayfa `/yonergeler/06-veri-sahipligi-ve-olaylar/` adresidir.
3. Yönerge sayfası kaçıncı yönergede olduğunuzu söylemez. İsteğim şudur:
   `src/pages/yonergeler/[slug].astro` dosyası `GuidePage` bileşenine `sira` ve
   `toplam` değerlerini versin. Başlığın altına "9 yönergeden 8." satırını
   koyarım. Okur böylece yerini görür.

## 2. geçiş

### Bulduğum sorunlar

1. Uzun yönergelerde bölüm listesi yoktu. `06-veri-sahipligi-ve-olaylar`
   sayfası telefonda 2500 pikselden uzundur. Okur bölüme atlayamadı.
2. Yönerge sayfasının altında yalnız önceki ve sonraki bağlantısı vardı. Listeye
   dönen bir bağlantı yoktu.
3. `Html` bileşeni her kullanımda kendi `style` etiketini yazdı. Bir sayfada
   birden çok rapor bölümü açılınca aynı kurallar birkaç kez tekrarlandı.
4. Bölüm başlıklarının bağlantı adresi yoktu. Bu yüzden içindekiler
   kurulamıyordu.

### Yaptığım değişiklikler

1. `bits.tsx` dosyasında `sectionLinks` işlevini ekledim. İşlev ikinci düzey başlıkları
   çıkarır.
2. `bits.tsx` dosyasında `Html` bileşenine `headingIds` seçeneği ekledim. Seçenek açıkken
   başlıklar `bolum-1` gibi adres alır. Yalnız yönerge sayfası bu seçeneği
   kullanır. Diğer sayfalar değişmedi.
3. `bits.tsx` dosyasında başlıklara `scroll-margin-top: 72px` verdim. Yapışkan başlık
   çubuğu bölüm başlığını artık örtmez.
4. `bits.tsx` dosyasında ortak biçim kurallarını sayfaya bir kez koydum. Kurallar artık
   `head` içinde tek bir `style` etiketindedir.
5. `GuidePages.tsx` dosyasında üç bölümden uzun yönergelere "İçindekiler" ekledim. Kutu
   kapalı başlar. Telefonda tek satır yer kaplar. Açılınca bölümler numaralı
   liste olur.
6. `GuidePages.tsx` dosyasında alt gezinmeye "Bütün yönergeleri gör" bağlantısını ekledim.

### Kontrol sonucu

- `npm run test:dev -- tests/ux-yonerge-ortak.spec.ts tests/site.spec.ts`
  komutunda 498 kontrol geçti. 11 kontrol atlandı. 2 kontrol başarısız oldu.
- Başarısız iki kontrol `/kanban/` sayfasındadır. Hata şudur: sütun değiştirme
  düğmelerinin yazısı 13,33 pikseldir. Bu düğmeler Kanban ajanının yeni
  çalışmasıdır. Benim dosyalarımla ilgisi yoktur. `/kanban/` sayfası `Html`
  bileşenini kullanmaz.
- Kendi test dosyam tek başına çalışınca hepsi geçti.

## 3. geçiş

### Bulduğum sorunlar

1. Sığan tablonun kutusu da klavye sırasındaydı. Kullanıcı boş bir durakta
   bekledi.
2. Kopyalama düğmesinin ipucu balonu dokunmatik ekranda parmağın altında kaldı.
   Balon "Panoya kopyalar" yazıyordu. Düğmenin yazısı zaten "Kopyala" idi.
3. Yönerge listesinin boş durumu yoktu. Veri gelmezse sayfa sessizce boş kaldı.

### Yaptığım değişiklikler

1. `bits.tsx` dosyasında `tabindex` değerini yalnız kayan kutuya verdim. Sığan tablo artık
   klavye sırasında durmaz.
2. `bits.tsx` dosyasında `useHover` yardımcısını ekledim. Fare ya da kalem yoksa ipucu
   balonu gösterilmez. Düğmenin erişilebilir adı değişmedi.
3. `GuidePages.tsx` dosyasında liste boşsa açıklama çıkar. Metin şudur: "Şu anda hiç
   yönerge yok. Veriyi üretmek için `npm run data` komutunu çalıştırın."

### Kontrol sonucu

- `npm run test:dev -- tests/ux-yonerge-ortak.spec.ts tests/site.spec.ts`
  komutunda 507 kontrol geçti ve 11 kontrol atlandı.

## 4. geçiş

### Bulduğum sorunlar

1. Kod blokları da dar ekranda sağdan kesildi. En uzun satır 104 karakterdir.
   `04-is-kurallari` sayfasındaki kod kutusu 917 piksel genişliktedir. Bu kutu
   1280 pikselde bile kayar.
2. Kod kutusuna klavyeyle erişilemedi. Kaydırma ipucu da yoktu.
3. Orkestratör `tokens.css` dosyasını yeniledi. `--hit-min` tokenı `--hit`
   oldu. Benim kurallarım eski adı kullanıyordu. Bu yüzden bağlantıların 44
   piksel alt sınırı geniş ekranda kayboldu.
4. Kendi kurallarımda sabit değerler vardı. Örnekler 18px, 40px ve 62ch
   değerleridir.

### Yaptığım değişiklikler

1. `bits.tsx` dosyasında kaydırma kutusunu genelleştirdim. Kutunun adı `md-scrollbox`
   oldu. Kutu `data-kind` değeriyle tabloyu ve kodu ayırır.
2. `bits.tsx` dosyasında uzun kodu da kendi kutusuna aldım. Kutunun üstünde "Kod satırları
   uzundur. Kodu yana kaydırın." ipucu çıkar. Kod kutusu klavyeyle de kayar.
3. `bits.tsx` ve `GuidePages.tsx` dosyalarında sabit değerleri tokenlarla değiştirdim.
   Kullandığım tokenlar `--hit`, `--measure`, `--measure-wide`, `--text-lead`,
   `--text-h3`, `--weight-strong`, `--leading-heading` ve `--color-hairline`
   oldu.
4. `GuidePages.tsx` dosyasında liste ayracını `--color-divider` yerine `--color-hairline`
   yaptım. Ayraç artık sessizdir. Metin öne çıkar.

### Kontrol sonucu

- `npm run test:dev -- tests/ux-yonerge-ortak.spec.ts tests/site.spec.ts`
  komutunda 535 kontrol geçti ve 11 kontrol atlandı.
- Hareket kontrolünde geçişler `cubic-bezier(0.65, 0, 0.35, 1)` eğrisini
  kullanır. Süre 120 milisaniyedir. Azaltılmış hareket tercihinde süre 0 olur.

## 5. geçiş

### Bulduğum sorunlar

1. Liste `ol` öğesinin madde işareti kapalıydı. Safari bu durumda listeyi liste
   saymaz. Ekran okuyucu öğe sayısını söylemez.
2. İçindekiler kutusunun satırları fare kullanan ekranda 36 piksel yüksekliğe
   düşüyordu.
3. Kendi metinlerimde etiket dizisi vardı. Örnek şudur: "İçindekiler: 8 bölüm".

### Yaptığım değişiklikler

1. `GuidePages.tsx` dosyasında listeye `role="list"` ekledim. Liste anlamı
   Safari'de de korunur.
2. `GuidePages.tsx` dosyasında içindekiler satırlarını `--hit` tokenına
   bağladım. Her işaretçi türünde hedef en az 44 pikseldir. Dokunmada 48 piksel
   olur.
3. `GuidePages.tsx` dosyasında içindekiler başlığını "İçindekiler (8 bölüm)"
   yaptım.
4. `tests/ux-yonerge-ortak.spec.ts` dosyasına yeni kontrol ekledim. Kontrol
   içindekiler, önceki, sonraki ve liste hedeflerinin 44 pikselini denetler.
5. İçindekiler listesinde çift numara vardı. Bazı yönergelerin başlıkları zaten
   numaralıdır. Örnek başlık şudur: "1. Her tablonun bir sahibi vardır". Liste
   bunun önüne ikinci bir numara koyuyordu. Başlıkların yarısı ya da daha çoğu
   numaralıysa liste artık numara yazmaz.
6. İki kontrol yoğun çalışmada takılıyordu. Kontroller "İçindekiler" kutusunu
   tıklıyordu. Kutu açılmadan bağlantıya tıklanıyordu. Kontrollere "kutu açıldı
   mı" beklemesi ekledim.

### Kullanıcının yeni kuralı

Kullanıcı 18 Kasım 2026 Çarşamba günü iki kural verdi.

1. Test genişlikleri yalnız 320, 375, 768 ve 1280 pikseldir. 390 piksel
   kaldırıldı. Benim test dosyamda sabit genişlik yoktur. Genişlikler
   `playwright.config.ts` dosyasından gelir. Orkestratör `chromium-390`
   projesini zaten kaldırdı.
2. Etkileşim hedefi kuralı `tokens.css` dosyasındadır. Bu kuralı kendi dosyamda
   tekrar yazmam. Önemli not: `tokens.css` içindeki `min-height` kuralı yalnız
   Ant Design sınıflarını seçer. Örnekler `.ant-btn` ve `.ant-collapse-header`
   sınıflarıdır. Benim öğelerim düz `a` ve `summary` öğeleridir. Bu yüzden
   onlarda `min-height: var(--hit)` satırı durur. Satırı silersem liste
   bağlantısı yine 20 piksele düşer. Sabit 44 ya da 48 değerini yazmadım.
   Merkezî `--hit` tokenını kullandım.

## Son özet

### Geçiş geçiş ne değişti

1. **1. geçiş.** Liste kartlarını numaralı listeye çevirdim. Kırpılan yönerge
   adlarını açtım. Dokunma hedeflerini 44 piksele çıkardım. Geniş tabloyu kendi
   kaydırma kutusuna aldım. Kutuya ipucu, sağ kenar geçişi ve klavye desteği
   ekledim. Alt gezinmeye görünür "Önceki yönerge" ve "Sonraki yönerge" yazısı
   koydum.
2. **2. geçiş.** Uzun yönergelere "İçindekiler" kutusu ekledim. Bölüm
   başlıklarına bağlantı adresi verdim. Alt gezinmeye "Bütün yönergeleri gör"
   bağlantısını ekledim. Ortak biçim kurallarını sayfaya bir kez koydum.
3. **3. geçiş.** Sığan tabloyu klavye sırasından çıkardım. Dokunmatik ekranda
   ipucu balonunu kapattım. Listeye boş durum metni ekledim.
4. **4. geçiş.** Uzun kod bloklarını da kaydırma kutusuna aldım. Yenilenen
   `tokens.css` tokenlarına geçtim. Sabit piksel ve `ch` değerlerini kaldırdım.
5. **5. geçiş.** Liste anlamını Safari için korudum. İçindekiler hedeflerini
   `--hit` tokenına bağladım. Metinlerdeki etiket dizisini düzelttim.

### Düzeltemediklerim

1. Yönerge gövdesinin biçimi `src/styles/tokens.css` dosyasındadır. O dosya
   orkestratöründür. `.md h3` başlığı ile gövde metni arasındaki fark zayıftır.
   İkisinin üst boşluğu da aynıdır. Bu yüzden bölüm sırası zor okunur.
2. Yönerge sayfası kaçıncı yönergede olduğunu yazmaz. Sıra numarası
   `src/pages/yonergeler/[slug].astro` dosyasından gelir. O dosya benim değildir.
3. `/kanban/` ve `/baglamlar/` sayfalarındaki kalan hatalar başka ajanlarındır.
   Bu sayfalardaki dosyalara dokunmadım.

### Açık istekler

Bu bölümün ayrıntısı yukarıdaki `## İstekler` başlığındadır. Özet şudur:

1. Her ajan kendi Playwright çıktı klasörünü kullansın. Ortak `test-results`
   klasörü iki ajan aynı anda test çalıştırınca çakışır.
2. `.md h3` başlığının üst boşluğu `.md h2` başlığından az olsun. Böylece bölüm
   ve alt bölüm ayrılır.
3. `[slug].astro` dosyası `GuidePage` bileşenine sıra numarası ve toplam sayı
   versin. Sayfa o zaman "9 yönergeden 8." bilgisini gösterebilir.

### Son kontrol sonucu

`npm run test:dev -- tests/ux-yonerge-ortak.spec.ts tests/site.spec.ts`
komutunda 470 kontrol geçti. 10 kontrol atlandı. Başarısız kontrol olmadı.
Atlanan kontroller genişliğe bağlıdır. Dar ekran kontrolü geniş ekranda atlanır.
Geniş ekran kontrolü de dar ekranda atlanır.

Bütün test dosyaları birlikte çalıştığında 19 kontrol başarısız oldu. Bu
kontroller `tests/ux-kanban.spec.ts` ve `tests/ux-baglam-anasayfa.spec.ts`
dosyalarındadır. İkisi de başka ajanlarındır. Benim kapsamımda başarısız
kontrol yoktur.

Tarayıcılar Chromium ve WebKit'tir. Firefox kullanıcı kararıyla kapsam dışıdır.
Gerçek telefonla deneme yapılmadı. Gerçek okurla denenmedi.

## 6. tur: tasarım yönü

`TASARIM-YONU.md` dosyasını okudum. Yönü kendi kapsamıma uyguladım.

### Ne değiştirdim

1. `bits.tsx` dosyasında `PriorityTag` artık sabit renk yazmaz. Renkler
   `tokens.css` dosyasındaki tokenlardan gelir. Tokenlar `--kriz-bg`,
   `--kriz-fg` ve benzerleridir. Etiket düzdür. Kenarlığı yoktur.
2. `bits.tsx` dosyasında `PlainTag` da sabit renk yazmaz. Zemini ve yazı rengi
   `theme.ts` dosyasındaki `Tag` ayarından gelir. Kenarlığı kaldırdım.
3. `bits.tsx` dosyasında `CopyButton` bileşenine `quiet` seçeneği ekledim.
   Seçenek açıkken düğme sessiz bir metin bağlantısı gibi görünür. Kart
   içindeki ikincil kopyalama bu seçeneği kullanır. Ana eylem `primary`
   kalır. Düğmenin erişilebilir adı değişmez.
4. `GuidePages.tsx` dosyasında yönerge gövdesine okuma sütunu kurdum. Düz yazı
   yaklaşık 68 karakterde kalır. Paragraf, liste ve başlık bu sınırı kullanır.
   Tablo ve kod bloğu tam genişliği kullanır. 1280 pikselde paragraf 710
   piksel, tablo 1200 piksel genişliktedir.
5. `GuidePages.tsx` dosyasında alt gezinmenin kutularını kaldırdım. Önceki ve
   sonraki bağlantıları artık kenarlıksızdır. Üstlerindeki ince çizgi ve boşluk
   onları ayırır.
6. `GuidePages.tsx` dosyasında "İçindekiler" kutusunun zeminini kaldırdım.
   Açılır liste artık sessizdir.
7. `GuidePages.tsx` dosyasında sıra numarasını büyüttüm ve sessizleştirdim.
   Numara 20 piksel ve soluk renktedir. Başlık 18 piksel ve koyu mavidir. Sıra
   duygusu böyle oluşur.
8. `GuidePages.tsx` dosyasında liste ve alt gezinme genişliğini sınırladım.
   Geniş ekranda ayraç çizgileri artık boşlukta uzamaz.
9. `tests/ux-yonerge-ortak.spec.ts` dosyasına iki kontrol ekledim. Biri okuma
   sütununu denetler. Öteki öncelik etiketinin rengini tokenla karşılaştırır.

### Ne bıraktım

1. `quiet` seçeneğini kendi sayfalarımda kullanmadım. Yönerge sayfasında tek
   kopyalama düğmesi vardır. O düğme ana eylemdir. Seçenek kart kullanan
   ajanlar için hazırdır. Örnek kullanım şudur:
   `<CopyButton text={metin} label="Kopyala" quiet />`.
2. `tokens.css` ve `theme.ts` dosyalarına dokunmadım.
3. `/kanban/`, `/fazlar/` ve `/doctype/` sayfalarının düzeni başka ajanlarındır.
   Ortak etiket ve düğme değişikliğim o sayfalarda da görünür. Düzenlerini
   değiştirmedim.

### Kontrol sonucu

`npm run test:dev -- tests/ux-yonerge-ortak.spec.ts tests/site.spec.ts`
komutunda son çalıştırmada 473 kontrol geçti. 18 kontrol atlandı. 1 kontrol
başarısız oldu.

Başarısız kontrol `/doctype/03a-katalog/product_category_required_certification/`
sayfasındadır. Sayfa 320 pikselde 46 piksel yatay taşar. Taşan öğe bir
`summary` öğesi içindeki `code` öğesidir. Metni
`product_category_required_certification` adıdır. Bu açılır yapı DocType
ajanının yeni çalışmasıdır. `src/components/DoctypePage.tsx` dosyası benim
değildir. Bu yüzden düzeltmedim.

Kendi test dosyam tek başına çalışınca 168 kontrol geçti ve 18 kontrol atlandı.
