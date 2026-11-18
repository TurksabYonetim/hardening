# Kabuk notları

Bu dosya kabuk alanının UX çalışmasını anlatır. Kabuk her sayfada görünen çerçevedir.

Sahip olduğum dosyalar şunlardır:

- `src/components/AppShell.tsx`
- `src/layouts/Base.astro`

Şu parçalarla ilgilendim:

- üst çubuk
- çekmece menüsü
- ana menü
- yol izi
- sayfa kabı ve kenar boşlukları
- alt bilgi
- başa dön düğmesi
- içeriğe geç bağlantısı

Testlerim `tests/ux-kabuk.spec.ts` dosyasındadır.

## 1. geçiş

### Bulduğum sorunlar

Sayfaları 320, 375, 768 ve 1280 px genişlikte açtım. Şunları buldum.

1. İçeriğe geç bağlantısı odağı taşımıyordu. `#icerik` öğesi odak alamıyordu. Klavye kullanıcısı Enter'a basınca odak gövdede kalıyordu.
2. Geniş ekranda menü bağlantısı satırın tamamını kaplamıyordu. Satır 56 px yüksekliğindeydi. Bağlantı ise yalnız 20 px yüksekliğindeydi. Satırın geri kalanına tıklamak işe yaramıyordu.
3. Menü simgesine tıklamak da işe yaramıyordu. Simge bağlantının dışında duruyordu.
4. Ant Design menüsü fazladan bir sekme durağı ekliyordu. Liste öğesi de odak alıyordu. Klavye kullanıcısı aynı menüde iki kez duruyordu.
5. Çekmecenin kapatma düğmesi 26 px genişliğindeydi. Kural en az 44 px ister.
6. Çekmece 320 px ekranda 300 px yer kaplıyordu. Maskeye basacak yalnız 20 px kalıyordu. Kullanıcı dışarı basarak çekmeceyi kapatamıyordu.
7. Yol izi bağlantıları 24 px yüksekliğindeydi. Kural en az 44 px ister.
8. Yol izinin son basamağı sayfa başlığını birebir tekrar ediyordu. Dar ekranda bu basamak iki satır kaplıyordu.
9. Üst çubuk ve alt bilgi ekranın tamamına yayılıyordu. İçerik ise 1200 px ile sınırlıydı. 1280 px ekranda site adı 24 px'te başlıyordu. Sayfa başlığı ise 64 px'te başlıyordu.
10. Başa dön düğmesi alt bilgi yazısının üstünü kapatıyordu.
11. Alt bilgi etiket dizisiyle yazılmıştı. Metin kişisel bir klasör yolu da gösteriyordu.
12. Sayfada tek bir gezinme bölgesi vardı. Ana menü gezinme bölgesi değildi. Yol izinin de adı yoktu.
13. Menü düğmesi çekmecenin açık olduğunu ekran okuyucuya söylemiyordu.

### Yaptığım düzeltmeler

1. `#icerik` öğesine `tabIndex={-1}` ekledim. Artık içeriğe geç bağlantısı odağı içeriğe taşır.
2. Üst çubuktaki Ant Design menüsünü kendi `nav` listemle değiştirdim. Bağlantı satırın tamamını kaplar. Simge bağlantının içindedir.
3. Simgeyi `aria-hidden` ile ekran okuyucudan gizledim. Bağlantının adı yalnız etikettir.
4. Çekmecedeki menüyü de aynı listeyle değiştirdim. Her satır en az 48 px yüksekliğindedir.
5. Açık olan sayfanın bağlantısına `aria-current="page"` ekledim.
6. Çekmecenin kapatma düğmesini 44 px yaptım.
7. Çekmece genişliğini `min(300px, 86vw)` yaptım. 320 px ekranda maskeye 45 px yer kalır.
8. Yol izini kendi `nav` ve `ol` yapımla yazdım. Bağlantıların basılacak alanı 44 px'tir.
9. Yol izi tek satırda durur. Sığmazsa kendi içinde yana kayar. Sayfa yatay taşmaz.
10. Yol izinin son basamağını kaldırdım. Sayfanın adını zaten başlık söyler.
11. Üst çubuğa, içeriğe ve alt bilgiye ortak bir `shell-bar` kabı verdim. Üçü aynı hatta başlar.
12. Alt bilgiye alttan 72 px boşluk verdim. Başa dön düğmesi artık yazının üstünü kapatmaz.
13. Alt bilgi metnini yeniden yazdım. Kişisel klasör yolunu çıkardım. Metin iki kısa cümledir.
14. Ana menüye `aria-label="Ana menü"` verdim. Yol izine `aria-label="Yol izi"` verdim.
15. Menü düğmesine `aria-expanded` ve `aria-controls` ekledim.
16. Menü düğmesinin simgesini sayfa başlığıyla aynı hizaya getirdim.

### Sonuç

Kabuk stillerini `Base.astro` dosyasındaki ortak stil bloğuna yazdım. Değerler `tokens.css` dosyasındaki tokenlardan gelir. Bileşen içine sabit değer yazmadım.

320 px ekranda derin bir sayfada başlık 135 px'te başlıyordu. Şimdi 125 px'te başlar. Yol izi iki satırdan tek satıra indi.

## 2. geçiş

### Bulduğum sorunlar

Bu geçişte klavye akışına, yükleme anına ve kısa ekranlara baktım.

1. Sayfalar `client:only="react"` ile çizilir. Betik gelene kadar ekran bomboş kalıyordu. Telefonda bu bekleme uzun olabilir.
2. Yol izi her sayfada "Genel bakış" basamağıyla başlıyordu. Üst çubuktaki site adı zaten ana sayfayı açar.
3. Kanban, Bağlamlar ve Yönergeler sayfaları ana menüdedir. Yol izi bu sayfalarda bilgi eklemiyordu.
4. En uzun bağlam adında yol izi 320 px ekrana sığmıyordu. Metnin 14 px'i gizli kalıyordu.
5. Yatay telefonda ekran 375 px yüksekliğindedir. Üst çubuk bu ekranın yedide birini kaplıyordu.
6. İçeriğe geç bağlantısı 38 px yüksekliğindeydi.
7. Çekmece açıkken bir sekme adımı çekmecenin dışına çıkıyor. Odak gövdeye düşüyor. Sonraki adım geri dönüyor. Bu davranış Ant Design çekmecesinden gelir.

### Yaptığım düzeltmeler

1. Gövdeye bir açılış çubuğu ekledim. Çubuk mavi zeminde site adını gösterir. Kabuk hazır olunca kısa bir betik çubuğu kaldırır.
2. Açılış çubuğu gerçek üst çubukla aynı sınıfları kullanır. Yükleme bitince yerleşim kaymaz.
3. Yol izinden ana sayfa basamağını kaldırdım.
4. Artık yol izi yalnız üst sayfaları gösterir. Üst sayfası olmayan sayfada yol izi hiç çizilmez.
5. 320 px ekranda en uzun yol izi artık sığar.
6. Yatay telefonda üst çubuğu 48 px'e indirdim. Ölçüt `max-height: 480px` sorgusudur.
7. İçeriğe geç bağlantısını 44 px yüksekliğine çıkardım.

### Dikkat edilecek bir nokta

Astro, bu stil bloğunda tanımlanan CSS değişkenini sabit değere çevirir. Değişkenin medya sorgusundaki ikinci değeri kayboldu. Bu yüzden üst çubuk yüksekliğini doğrudan medya sorgusuyla yazdım. `tokens.css` dosyasındaki tokenlar bu durumdan etkilenmez.

### Ölçüm

320 px ekranda Kanban sayfasında başlık 134 px'te başlıyordu. Şimdi 91 px'te başlar.

Derin bir epic sayfasında başlık 135 px'te başlıyordu. Şimdi 125 px'te başlar.

## 3. geçiş

Bu geçişte yapışkan üst çubuğun yan etkilerine baktım. Tasarım tokenlarının da değiştiğini gördüm.

### Bulduğum sorunlar

1. `tokens.css` dosyası yeniden yazıldı. `--page-gutter` ve `--hit-min` tokenları kalktı. Yerlerine `--gutter` ve `--hit` geldi. Benim stillerim eski adları kullanıyordu. Menü düğmesi 22 px genişliğe düştü. Yol izi bağlantıları 22 px yüksekliğe düştü. Başa dön düğmesi ekranın soluna kaydı.
2. `tokens.css` artık yatay kenar boşluğunu Ant kabuk öğelerine veriyor. Kural `!important` kullanıyor. Benim kendi kenar boşluğum bu kuralla çakışıyordu.
3. Üst çubuk yapışkandır. İçeriğe geç bağlantısı içeriğin başını çubuğun altında bırakıyordu. Yol izi ve başlığın bir kısmı görünmüyordu.
4. Ant Design 6 çekmecesinde `width` ayarı kalktı. Konsol uyarı veriyordu. Doğru ayar `size` ayarıdır.
5. Başa dön düğmesi azaltılmış hareket tercihini dinlemiyordu. Düğme her durumda yumuşak kaydırma yapıyordu.
6. Menü düğmesi açıkken `aria-controls` olmayan bir öğeyi gösteriyordu.

### Yaptığım düzeltmeler

1. Token adlarını yenileriyle değiştirdim. Artık `--gutter` ve `--hit` kullanırım.
2. Yatay kenar boşluğunu kendi stilimden kaldırdım. Boşluğu `tokens.css` verir. Çentik payı da oradan gelir.
3. `scroll-padding-top` ekledim. Değer 72 px'tir. Yatay telefonda 64 px olur. Artık sayfa içi her bağ hedefi çubuğun altında kalmaz.
4. Çekmecede `width` yerine `size` kullandım. Konsol uyarısı kalktı.
5. Başa dön düğmesine `duration` verdim. Azaltılmış hareket tercihinde süre sıfır olur.
6. `aria-controls` artık yalnız çekmece açıkken yazılır.
7. Menü düğmesinin simgesini `calc` ile hizaladım. Simge artık her ekranda başlıkla aynı yerde başlar. Bu kural dokunmalı ekranda da geçerlidir.

### Dikkat edilecek bir nokta

Astro geliştirme sunucusu `Base.astro` içindeki stili önbelleğe alır. Dosyayı değiştirdikten sonra tarayıcı eski stili kullanabilir. Dosyaya `touch` komutu uygulamak sorunu çözer.

### Ölçüm

Menü düğmesi 48 px, yol izi bağlantıları 48 px oldu. Dokunmasız ekranda ikisi de 44 px olur.

Üst çubuk, içerik ve alt bilgi dört genişlikte de aynı x değerinde başlar.

## 4. geçiş

### Kural güncellemesi

Kullanıcı test listesini daralttı. Artık yalnız 320, 375, 768 ve 1280 px kontrol edilir. 320 px ilk sıradadır. Kendi test dosyamda 390 px genişliği zaten yoktu.

`tokens.css` artık etkileşim hedefini merkezden verir. Ölçü farede 44 px, dokunmada 48 px olur.

### Bulduğum sorunlar

1. Kendi stilimde etkileşim hedefi ölçüsünü tekrar yazmıştım.
2. Yol izi bağlantılarına tam ölçüyü vermiştim. `tokens.css` yol izi bağlantısı için daha küçük `--hit-sm` ölçüsünü ayırmış.
3. Alt bilgi içerikten yeterince ayrılmıyordu. Zemin rengi beyaza çok yakındır.
4. Paylaşılan bağlantıda sayfanın adı ve özeti görünmüyordu.
5. Betik kapalıyken görünen metnin kenar boşluğu sayfayla hizalı değildi.

### Yaptığım düzeltmeler

1. Menü düğmesinden `height` kuralını kaldırdım. Yüksekliği `tokens.css` verir. Kare biçim için yalnız genişlik kaldı.
2. Çekmece satırındaki sabit 48 px değerini `var(--hit)` ile değiştirdim.
3. Yol izi bağlantılarını `var(--hit-sm)` ölçüsüne aldım. Dokunmalı ekranda bu ölçü 44 px olur.
4. İçeriğe geç bağlantısındaki kendi ölçü kuralımı kaldırdım. Bu bağlantıyı yalnız klavye açar. Ölçüyü `tokens.css` yönetir.
5. Alt bilgiye ince bir üst çizgi ekledim. Renk `--color-hairline` tokenıdır.
6. Başlık bölümüne `og:title`, `og:description` ve `og:locale` etiketlerini ekledim. Artık sohbete yapıştırılan bağlantı sayfanın adını gösterir.
7. `color-scheme` etiketini ekledim. Tarayıcı sayfayı kendiliğinden koyulaştırmaz.
8. Betik kapalıyken görünen metni sayfa kabına aldım. Metin iki kısa cümle oldu.

## İstekler

Bu istekler `tokens.css` dosyasının sahibinedir. Ben o dosyaya dokunmadım.

1. **Okunur sütun için `px` birimli bir token gerekir.** `--measure` tokenı `ch` birimindedir. `ch` birimi öğenin kendi yazı boyuna göre büyür. Bu yüzden büyük başlığı okunur sütuna sığdıramıyorum. Gövde boyundan hesaplanmış `--measure-px` gibi bir token açılırsa başlık da aynı sütuna girer.
2. **Mavi üstündeki yazı için renk tokenı gerekir.** Üst çubuk marka mavisidir. Üstündeki yazı tam beyaz ya da yüzde 90 beyaz olur. Bu iki değeri şimdilik `Base.astro` içinde yazıyorum. `--color-on-primary` ve `--color-on-primary-muted` tokenları açılırsa oradaki sabit değerleri kaldırırım.
3. **Çekmecenin kapatma düğmesi merkezî listede yok.** `tokens.css` içindeki etkileşim hedefi listesi `.ant-drawer-close` seçicisini kapsamıyor. Düğme kuralsız 30x20 px kalıyor. Ölçüyü şimdilik `Base.astro` içinde veriyorum. Seçici merkezî listeye eklenirse oradaki kuralı kaldırırım.
4. **Her sayfanın açıklaması aynı.** `description` değeri bütün sayfalarda "tradehub_core modüler monolit geçiş planı" olur. Açıklamayı sayfa dosyaları `Base.astro` bileşenine verir. Sayfa dosyaları benim değil. Her sayfa kendi özetini verirse arama sonucu ve paylaşılan bağlantı daha anlaşılır olur.
5. **Sayfalar `client:only="react"` ile çiziliyor.** Betik gelene kadar gerçek içerik yoktur. Açılış çubuğunu ekledim. Yine de ilk boyamada yalnız üst çubuk görünür. Sunucu tarafında çizim açılırsa telefonda ilk görüntü belirgin biçimde hızlanır. Karar sayfa dosyalarının sahibinindir.

## 5. geçiş

Bu geçiş son denetimdi. Dört genişlikte bütün sayfaları yeniden gezdim.

Şu başlıkları denetledim:

- yatay taşma
- kabuk yazı boyu
- köşe yarıçapı
- üst çubuk, içerik ve alt bilgi hizası
- yol izinin satır sayısı
- sayfada tek `h1` olması
- açılış çubuğunun kaldırılması

Dört genişlikte de sorun çıkmadı.

Klavye yolu şöyledir: içeriğe geç, site adı, beş menü bağlantısı, yol izi bağlantıları, sonra içerik. Her öğe tek durak alır.

Küçük bir eksik buldum ve kapattım. Bağlantısı olmayan yol izi basamağının stili yoktu. Bu basamak için sessiz bir metin stili yazdım.

## 6. tur: tasarım yönü

`TASARIM-YONU.md` dosyasını okudum. Tasarım sistemi katmanına dokunmadım.

### Üst çubuk ve menü

Tur sırasında yön iki kez değişti. Önce üst çubuk sessiz beyaz yüzey oldu. Sonra sahibi markanın mavisini geri istedi. Son durum mavidir.

Benim dosyamdaki sabit renkleri kaldırdım. Zemini artık `tokens.css` verir.

Mavi zemin üstünde yazılar beyaz ailesindendir:

- Site adı, menü düğmesi ve açık olan sayfa tam beyazdır. Ölçülen kontrast 10,05:1 olur.
- Bekleyen menü bağlantıları yüzde 90 beyazdır. Ölçülen kontrast 8,47:1 olur.
- Açık olan sayfanın altında düz beyaz çizgi vardır. Çizginin değdiği köşeler karedir.

Kendi kurallarımın seçicisi `tokens.css` içindeki düzeltmeden daha güçlüdür. Bu yüzden oradaki düzeltme artık gereksizdir. Tarayıcıda beklenen değer benim kuralımdan gelir.

### Okunur metin sütunu

İçerik kapsayıcısına okunur sütun sınırı koydum. Düz yazı satırı `--measure` tokenını kullanır. 1600 px ekranda bir paragraf 1200 px yerine 714 px genişliğinde olur. Bu genişlik yaklaşık 68 karakter eder.

Tablo, pano, kart ve kod bloğu tam genişliği kullanmaya devam eder. Kap daralmadı.

### Alt bilgi

Alt bilgiden üst çizgiyi kaldırdım. Ayrımı artık zemin kurar. Zemin `--color-surface` tokenıdır. Yazı rengi `--color-text-muted` tokenıdır.

### Çekmece menüsü

Çekmecedeki açık sayfa işaretinden mavi dolguyu kaldırdım. Yerine sessiz yüzey ve kalın yazı koydum.

### Yapmadıklarım

Başlıkların genişliğini tam istediğim gibi sınırlayamadım. Nedeni şudur: `--measure` tokenı `ch` birimindedir. `ch` birimi öğenin kendi yazı boyuna göre hesaplanır. Büyük başlıkta 68ch yaklaşık 1077 px eder. Bu değer kaptan dar değildir. Paragraf sınırı doğru çalışır, çünkü paragrafın yazı boyu gövde boyudur.

Kanban ve ana sayfa gibi sayfaların içi benim dosyalarımda değildir. Oradaki kart, filtre ve sayaç düzenine dokunmadım.

### Bulduğum ama benim olmayan bir hata

Tur sırasında 320 px ekranda en uzun epic sayfasında yatay taşma gördüm. Taşma 46 px idi.

Taşmanın nedenini buldum. `src/components/DoctypePage.tsx` dosyasının 26. satırı `[data-doc-files] code { overflow-wrap: normal; }` kuralını yazar. Uzun dosya adı bu kural yüzünden satır sonunda bölünmez.

Taşma şu an yok. Başka bir ajan aynı satırdaki yazı boyunu küçülttü. Uzun ad artık 245 px kaplar ve ekrana sığar.

Kural hâlâ duruyor. Daha uzun bir dosya adı gelirse taşma geri döner. Kalıcı çözüm o dosyanın sahibine aittir. Ben o dosyaya dokunmadım.

### 6. turda bulduğum kendi hatam

Mavi zemine geçerken menü renklerini `!important` ile yazdım. Bu kurallar merkezî odak kuralını da bastırdı. Klavye odağındaki bağlantı sarı zemin alıyordu ama yazı beyaz kalıyordu. Beyaz yazı sarı zeminde okunmaz.

Kendi testim bu hatayı yakaladı. Odak için ayrı bir kural yazdım. Artık odaktaki bağlantının yazısı siyah olur.

Açık olan sayfanın altındaki beyaz çizgi odakta da durur. Bu çizgi tek kenardadır ve öğeyi çevrelemez. Çevreleyen halka yasağı korunur.

### Testler

Testleri `npm run test:dev` komutuyla çalıştırdım.

- `tests/ux-kabuk.spec.ts` dosyasındaki testlerin tamamı 7 tarayıcı profilinde geçti.
- `tests/site.spec.ts` dosyasında bir test düşüyor. Düşen test `kanban düğmelerinin adı görevi içeriyor` testidir. Test tek başına çalıştırınca da düşer. Neden Kanban kartının yapısıdır. Kartın içinde artık `.ant-typography` öğesi bulunamıyor. O dosya benim değil.
- Geliştirme sunucusu altı ajan arasında paylaşılır. Başka bir ajan dosya kaydedince sayfa test ortasında yeniden yüklenir. Bu yüzden birkaç test kararsız çalışır. Kararsız testler yeniden denemede geçer.
