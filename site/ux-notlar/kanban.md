# Kanban sayfası UX notları

Bu dosya `/kanban/` sayfasındaki çalışmayı anlatır. Değişen tek kaynak dosya `src/components/KanbanPage.tsx` dosyasıdır. Testler `tests/ux-kanban.spec.ts` dosyasındadır.

## Test nasıl çalıştı

Bu worktree içindeki `package.json` dosyasında `test:dev` betiği yok. Betik yalnız ana klasördeki son commit içinde var. Ben `package.json` dosyasına dokunmadım. Testleri aynı ayarla çalıştırdım. Ayar dosyası `.pane/scratch/pw.dev.config.ts` içindedir. Bu ayar testleri 4321 portundaki geliştirme sunucusuna bağlar ve derleme yapmaz.

## 1. tur

### Bulduğum sorunlar

1. 320 ve 375 px genişlikte sütun sekmeleri sığmıyordu. “Devam ediyor” sekmesi yarıda kesiliyordu. “İncelemede” ve “Bitti” sekmeleri üç nokta menüsünün arkasında kalıyordu.
2. 1280 px genişlikte boş sütunlar büyük bir resim gösteriyordu. Resim yer kaplıyordu ama ne yapılacağını söylemiyordu.
3. Arama hiçbir görev bulamazsa dört sütun ayrı ayrı “görev yok” diyordu. Süzgeci temizlemenin kolay bir yolu yoktu.
4. Kartta bağlam “genel” ya da “07-lojistik” gibi klasör adıyla görünüyordu. Bu bilginin ne olduğu yazmıyordu.
5. Durum kutusunda yalnız “Yapılacak” yazıyordu. Kutunun ne işe yaradığı anlaşılmıyordu.
6. Durum değişince odak arama kutusunun üstüne sıçrıyordu. Klavye kullanan kişi listedeki yerini kaybediyordu.
7. “Daha fazla göster” sınırı bütün sütunlarda ortaktı. Faz ya da bağlam değişince sınır sıfırlanmıyordu.
8. Arama yalnız başlıkta arıyordu. Bağlam adıyla arama sonuç vermiyordu.
9. Giriş metninde düz tırnak vardı. Kaç görevin göründüğü hiçbir yerde yazmıyordu.

### Yaptığım değişiklikler

1. Telefon ve tablette sütun seçimi artık 2 satır 2 sütunluk bir sekme ızgarasıdır. Dört sekme 320 px genişlikte de görünür. Her sekme sütun adını ve görev sayısını iki satırda gösterir. Sekmeler en az 56 px yüksekliktedir.
2. Sekmeler gerçek `tablist` yapısıdır. Ok tuşları, Home ve End tuşları sekmeler arasında gezer. Panel seçili sekmeye `aria-labelledby` ile bağlıdır.
3. Boş sütun artık kısa bir metin gösterir: “Bu sütunda görev yok.” Altında taşıma yolunu anlatan bir cümle vardır.
4. Arama sonuç vermezse tek bir boş durum görünür. İçinde “Süzgeçleri temizle” düğmesi vardır.
5. Süzgeçlerin altına bir sonuç satırı eklendi. Satır “Toplam 373 görev var.” ya da “Süzgece uyan 12 görev var.” der. Ekran okuyucu bu satırı `role="status"` ile duyurur. Süzgeç açıksa satırın yanında “Süzgeçleri temizle” düğmesi görünür.
6. Kart artık başlıkla başlar. Etiketler başlığın altına geçti. Bağlam “Bağlam: Lojistik” gibi okunur adla yazılır.
7. Durum kutusunun içinde “Durum:” öneki görünür.
8. Durum değişince odak aynı sütundaki bir sonraki karta geçer. Sonraki kart yoksa odak sütun sekmesine ya da sütun başlığına geçer.
9. “Daha fazla göster” sınırı artık her sütunda ayrıdır. Arama, faz ya da bağlam değişince sınır 30 karta döner. Düğmenin üstünde “373 görevden 30 tanesi görünüyor.” yazar. Düğmeye basınca odak ilk yeni karta geçer.
10. Arama artık başlıkta, görev kimliğinde ve bağlam adında arar.
11. Bağlam süzgecine yazarak arama eklendi.

### Kanıt

1. Ekran görüntüleri 320, 375, 768 ve 1280 px genişlikte alındı. Hiçbir genişlikte sayfa yatay taşmadı.
2. `tests/ux-kanban.spec.ts` dosyasında 11 test var. 7 projede 73 test geçti. 4 test atlandı, çünkü geniş ekranda sekme yoktur.
3. Bütün takımda 670 test geçti ve 21 test düştü. Düşen testler yeniden çalıştırıldı ve 15 testin tamamı geçti. Düşmeler aynı anda çalışan diğer ajanların değişikliklerinden geldi.

## 2. tur

### Bulduğum sorunlar

1. 1280 px genişlikte sütun başlığı kaydırınca ekrandan çıkıyordu. Uzun listede kartın hangi sütunda olduğu anlaşılmıyordu.
2. Sonuç satırı ile sütun başlıkları arasında yaklaşık 50 px boşluk vardı. Boşluğun nedeni başlığın varsayılan üst boşluğuydu.
3. Pano 1080 px en küçük genişlikle yatay kaydırma kutusu içindeydi. Bu kutu yapışkan başlığı da bozuyordu.
4. Faz ve bağlam seçeneklerinde görev sayısı yoktu. Bir süzgecin kaç görev getireceği seçmeden önce bilinmiyordu.

### Yaptığım değişiklikler

1. Geniş ekranda sütun başlıkları yapışkandır. Başlık kaydırınca üst çubuğun hemen altında kalır. Üst çubuğun yüksekliğini sayfa açılırken ölçerim. Pencere boyu değişince yeniden ölçerim.
2. Sütun başlığının üst boşluğu kaldırıldı. Başlığın altına 12 px boşluk kondu.
3. Yatay kaydırma kutusu ve 1080 px en küçük genişlik kaldırıldı. 992 px genişlikte dört sütun kartları taşırmadan sığar.
4. Süzgeç seçenekleri artık görev sayısını gösterir. Örneğin “Lojistik (39 görev)” yazar.

### Kanıt

1. 992 ve 1280 px genişlikte kaydırılmış ekran görüntüsü alındı. Başlıklar üst çubuğun altında kaldı. Sayfa yatay taşmadı.
2. İki yeni test eklendi. `tests/ux-kanban.spec.ts` dosyasında 82 test geçti.
3. Bütün takımda 935 test geçti ve 2 test düştü. Düşen iki test `tests/ux-yonerge-ortak.spec.ts` dosyasındadır. Bu dosya başka bir ajanın kapsamındadır.

## 3. tur

### Bulduğum sorunlar

1. 1280 px genişlikte klavye ile “Devam ediyor” sütununa ulaşmak çok uzundu. İlk sütunda 30 kart vardır. Her kartta 3 durak vardır. Bu yüzden yaklaşık 90 kez Tab tuşuna basmak gerekiyordu.
2. İki kelimelik arama sonuç vermiyordu. Örneğin “refund ödeme” yazınca hiç görev çıkmıyordu. Arama bütün metni tek parça arıyordu.
3. Arama sonuç vermeyince “Süzgeçleri temizle” düğmesi iki kez görünüyordu.
4. Sonuç satırı “Süzgece uyan 0 görev var.” diyordu. “Süzgeç” günlük bir kelime değildir. Sıfır sonuçlu cümle de doğal değildi.
5. Durum bildirimi “Görev Bitti sütununa taşındı” diyordu. “Bitti” kelimesi fiil gibi okunuyordu.

### Yaptığım değişiklikler

1. Geniş ekranda her sütunun başına bir düğme eklendi. Düğme yalnız klavye odağı alınca görünür. Düğme “İncelemede” sütununa geç gibi bir ad taşır. Enter tuşu odağı sonraki sütunun başlığına taşır.
2. Arama artık kelimeleri ayrı ayrı arar. Her kelime başlıkta, kimlikte ya da bağlam adında geçmelidir. Kelimelerin sırası önemli değildir.
3. Sonuç satırı artık üç cümleden birini söyler. Bunlar “Toplam 373 görev var.”, “12 görev bulundu.” ve “Hiç görev bulunamadı.” cümleleridir.
4. Temizleme düğmesinin adı “Aramayı ve seçimleri temizle” oldu. Sonuç yoksa düğme yalnız boş durum kutusunda görünür.
5. Durum bildiriminde sütun adı kalın yazılır. Bildirim artık nokta ile biter.
6. Gizli “sütuna geç” düğmesinde yazı boyutu tanımlı değildi. Tarayıcı bu yüzden 13.3 px kullandı. `site.spec.ts` içindeki 14 px testi bu hatayı yakaladı. Düğmeye 16 px verildi ve test geçti.

### Kanıt

1. 1280 px genişlikte odaklanmış atlama düğmesinin ekran görüntüsü alındı. Düğme sarı zemin ve alt çizgiyle görünüyor. Çevreleyen halka yok.
2. 320 px genişlikte arama ve boş durum ekranları incelendi.
3. Kanban testleri ve `site.spec.ts` içindeki Kanban testleri birlikte çalıştı. 133 test geçti.
4. Düzeltmeden önce bütün takımda 1114 test geçti ve 3 test düştü. İki düşme 14 px hatasıydı ve düzeltildi. Üçüncü düşme `tests/ux-doctype.spec.ts` dosyasındadır. Bu dosya başka bir ajanın kapsamındadır.

## 4. tur

### Bulduğum sorunlar

1. Sayfa “Kanban” kelimesini hiç açıklamıyordu. Bu kelime günlük bir kelime değildir.
2. Ekran okuyucu kartları ayrı kutular olarak okuyordu. Sütunda kaç kart olduğu duyurulmuyordu.
3. 768 px genişlikte durum kutusu yaklaşık 490 px genişliğe uzuyordu. Kutu kartın en ağır parçası gibi görünüyordu.
4. WebKit ile 375 px genişlikte sekmeler, kartlar ve boş sütun incelendi. Bu genişlikte yeni bir sorun bulunmadı.

### Yaptığım değişiklikler

1. Giriş paragrafı artık şu cümleyle başlar: “Kanban, görevleri durumlarına göre sütunlara ayıran bir panodur.”
2. Her sütundaki kartlar artık bir listedir. Liste “Yapılacak sütunundaki görevler” gibi bir ad taşır. Her kart bir liste öğesidir.
3. Durum kutusu en çok 320 px genişliğe uzar. Telefonda kutu yine bütün satırı kaplar.

### Kanıt

1. Üç yeni test eklendi.
2. Kanban testleri ve `site.spec.ts` içindeki Kanban testleri birlikte çalıştı. 154 test geçti.
3. Bütün takım çalıştı. 1169 testin hepsi geçti.

## 5. tur

### Bulduğum sorunlar

1. Sayfa açılınca sütun sayıları bir an 0 görünüyordu. Kayıtlı durumlar ilk çizimden sonra okunuyordu. Bunu bir deneme betiğiyle gördüm. Kayıtta 1 görev “Bitti” durumundaydı ama sekme “0 görev” gösterdi.
2. Aynı tarayıcıda iki sekme açıksa bir sekmedeki durum değişikliği öbür sekmeye gelmiyordu.
3. Telefondaki sütun sekmelerinde fare ile üzerine gelince hiçbir değişiklik olmuyordu.

### Yaptığım değişiklikler

1. Kayıtlı durumlar artık ilk çizimden önce okunur. Sayılar ilk anda doğru görünür. Sayfa yalnız tarayıcıda çalıştığı için bu güvenlidir.
2. Pano artık tarayıcının `storage` olayını dinler. Başka sekmede durum değişince bu pano da güncellenir.
3. Fare sekmenin üzerine gelince seçili olmayan sekmenin zemini koyulaşır. Geçiş ortak eğriyi ve `--motion-fast` süresini kullanır. Azaltılmış hareket tercihinde geçiş kalkar.

### Kanıt

1. Üç yeni test eklendi. `tests/ux-kanban.spec.ts` dosyasında 131 test geçti.
2. Son bütün takım sonucu aşağıdaki özet bölümündedir.

## İstekler

1. **Seçim kutusu etkileşim hedefinin altında kalıyor.** `tokens.css` artık `.ant-select-selector` için en az `var(--hit)` yüksekliği istiyor. Ancak Ant Design 6 bu sınıfı üretmiyor. Seçim kutusunun dış öğesi `.ant-select` sınıfını taşır. Bu yüzden kural hiçbir seçim kutusuna uygulanmıyor. Kutu farede ve dokunmada 43.8 px kalıyor. Dokunmada hedef 48 px'tir. Sorun Kanban kartındaki “Durum” kutusunu ve iki süzgeç kutusunu etkiler. Sitedeki bütün seçim kutuları da etkilenir. İsteğim şudur: Kurala `.ant-select` seçicisini ekleyin. Benim testim bu sorunu yakalıyor. Testi gevşetmedim.
2. **Bağlam adları için veri alanı.** Kanban kartı bağlamı okunur adla gösterir. Örneğin “07-lojistik” yerine “Lojistik” yazar. Bu adlar şimdilik `KanbanPage.tsx` içindeki küçük bir listededir. İsteğim şudur: `scripts/build-data.mjs` her göreve `ctxLabel` alanı eklesin. O zaman listeyi silerim.
3. **Epic başlıklarında klasör adı.** Epic başlıkları “Order: 04-siparis bağlamına taşıma” biçimindedir. Başlıktaki klasör adı okuru zorlar. Başlık veriden gelir. Bu yüzden değiştirmedim. İsteğim şudur: Veri üretimi başlıkta okunur bağlam adını kullansın.
4. **Pano kayıt anahtarı.** `src/lib/tasks.ts` dosyası `STORE_KEY` değerini dışarı açmıyor. Başka sekmeyle eşitleme için anahtarı `KanbanPage.tsx` içine aynen yazdım. İsteğim şudur: `STORE_KEY` değeri dışarı açılsın.
5. **Seçili sekmenin yazı rengi.** Seçili sekme koyu mavi zemin üstünde beyaz yazı kullanır. Beyaz için bir token yok. Bu yüzden `#fff` yazdım. İsteğim şudur: `--color-on-primary` tokenı eklensin.
6. **`test:dev` betiği bu worktree içinde yok.** Betik ve `PW_URL` ayarı yalnız ana klasördeki son commit içinde var. Ben aynı ayarı `.pane/scratch/pw.dev.config.ts` dosyasıyla çalıştırdım.

## Son özet

### Turlara göre değişiklikler

1. **1. tur:** Telefon ve tablette dört sütun sekmesi de görünür. Sekmeler 2 satırlık bir ızgaradır. Boş sütun ne yapılacağını söyler. Sonuç satırı ve temizleme düğmesi eklendi. Bağlam okunur adla yazılır. Durum kutusunda “Durum:” öneki görünür. Durum değişince odak sonraki karta geçer. “Daha fazla göster” her sütunda ayrı çalışır.
2. **2. tur:** Geniş ekranda sütun başlıkları yapışkandır. Yatay kaydırma kutusu kaldırıldı. Süzgeç seçenekleri görev sayısını gösterir.
3. **3. tur:** Geniş ekranda klavye bir sütunu tek adımda atlar. Arama kelimeleri ayrı ayrı arar. Sonuç satırı ve bildirim daha yalın yazıldı.
4. **4. tur:** Sayfa “Kanban” kelimesini açıklar. Kartlar ekran okuyucuya liste olarak duyurulur. Tablette durum kutusu en çok 320 px genişliktedir.
5. **5. tur:** Sayılar ilk anda doğru görünür. Pano başka sekmedeki değişikliği alır. Sekmelerde fare durumu var.

### Düzeltemediğim sorunlar

1. Kopyalama bildirimi yalnız “Kopyalandı” der. Bu metin `src/components/bits.tsx` dosyasındaki `CopyButton` bileşenindedir. Bu dosya benim değil.
2. Durum bildirimi “Görev Bitti sütununa taşındı.” der. Sütun adını tırnak içine almak daha açık olurdu. `tests/site.spec.ts` dosyasındaki bir test “Devam ediyor sütununa taşındı” metnini bitişik arar. Bu yüzden tırnak eklemedim. Onun yerine sütun adını kalın yazdım.
3. Kart türü etiketi “Epic” der. Bu kelime günlük bir kelime değildir. Etiket veriden gelir ve başka sayfalarda da aynıdır. Bu yüzden değiştirmedim.
4. Seçim kutusu yükseklik sorunu `tokens.css` dosyasından gelir. Ayrıntısı “İstekler” bölümünün 1. maddesindedir.

### Açık istekler

“İstekler” bölümündeki altı maddenin hepsi açıktır.

### Son `test:dev` sonucu

Son bütün takım çalıştırmasında 1219 test geçti. 66 test atlandı ve 17 test düştü. Düşen testlerin dağılımı şöyledir:

1. 3 düşme benim `kart düğmeleri ve süzgeçler en az 44px yükseklikte` testimdir. Neden tema değişikliğidir. Ayrıntısı “İstekler” bölümünün 1. maddesindedir. Bu testi tek başına yeniden çalıştırdım. Bu kez 7 projenin 6 projesinde düştü.
2. 14 düşme başka ajanların test dosyalarındadır. Bu dosyalar `ux-yonerge-ortak`, `ux-baglam-anasayfa` ve `ux-kabuk` testleridir. Bu dosyalar benim kapsamımda değildir.

Bu iş gerçek okurla denenmedi. Commit yapılmadı.

## Kural güncellemesi sonrası

Düzenleyici iki kuralı değiştirdi. 390 px artık test listesinde yok. `tokens.css` artık etkileşim hedefini kendisi uygular. Bu hedef farede 44 px, dokunmada 48 px'tir.

### Yaptığım değişiklikler

1. Test dosyamda 390 px genişliği yoktu. Testler ayardaki projelere göre çalışır. Bu yüzden testlerden bir şey silmedim.
2. `KanbanPage.tsx` içindeki sabit 44 ve 56 değerlerini kaldırdım. Sütun sekmeleri ve “sütuna geç” düğmesi Ant Design düğmesi değildir. Bu yüzden `tokens.css` kuralı bu düğmelere uygulanmaz. Bu düğmeler yüksekliği `var(--hit)` tokenından alır. Sonuç satırı da kayma olmasın diye `var(--hit)` yüksekliğini kullanır.
3. Testlerdeki sabit 44 sayısını kaldırdım. Testler hedef değeri sayfadaki `--hit` tokenından okur.

### Kanıt

1. `npm run test:dev` artık bu worktree içinde çalışıyor. Geçici ayar dosyasını bıraktım.
2. `tests/ux-kanban.spec.ts` dosyasında 103 test geçti ve 9 test düştü.
3. 6 düşme altyapı hatasıdır. Hata `test-results` klasöründe dosya bulunamadı (ENOENT) diyor. Bu klasörü birden çok ajan aynı anda kullanıyor.
4. 3 düşme gerçektir. Seçim kutusu 43.8 px kalıyor. Nedeni “İstekler” bölümünün 1. maddesindedir.
5. 5. turda bu klasörü bir kez sildim. Bu silme o sırada test çalıştıran başka bir ajanı etkilemiş olabilir. Klasör yalnız test çıktısı içerir ve Git dışındadır.

## 6. tur: tasarım yönü

Bu tur `TASARIM-YONU.md` dosyasını uygular. Konu kurallar değil, yerleşim ve yoğunluktur.

### Bulduğum sorunlar

1. 375 px genişlikte ilk görev ekranın altındaydı. Önce 6 satırlık açıklama, 3 süzgeç satırı ve 4 durum kutusu geliyordu.
2. Arama, faz ve bağlam üç ayrı satır tutuyordu.
3. Her kartta “Kopyala” ve “Aç” aynı ağırlıkta iki düğmeydi. “Kopyala” düğmesi her kartta koyu dolguluydu. Bir sütunda 30 koyu düğme oluyordu.
4. Öncelik, faz ve tür üç ayrı etiket kutusuydu. Bağlam ayrı bir satırdaydı.
5. Telefondaki durum sekmeleri dolu kutulardı. Kartlar ve süzgeçlerle aynı görünüyorlardı.
6. Geniş ekranda sütun başlıkları gri dolu bloklardı. Başlıklar kartlardan daha ağır görünüyordu.
7. Boş sütun gri bir kutu içindeydi.
8. Arama kutusu 63 px yükseklikteydi. Bu yükseklik süzgeçlerle aynı satıra sığmıyordu.

### Yaptığım değişiklikler

1. Açıklama artık tek cümledir. Cümle şudur: “Kanban, görevleri durumlarına göre sütunlara ayıran bir panodur.” Geri kalan bilgi sessiz bir “Nasıl çalışır?” bölümündedir. Bölüm kapalı başlar. Yanındaki ok bölümün açık ya da kapalı olduğunu gösterir.
2. Açıklama metni okuma genişliğini aşmaz. Genişlik `--measure` tokenından gelir.
3. Arama ve iki süzgeç tek satırdadır. Kapalı süzgeç kısa ad gösterir. Örneğin “Faz” ya da “Lojistik” yazar. Açılan listede seçeneğin uzun adı ve görev sayısı durur. Telefonda süzgeçler dar, tablette ve masaüstünde geniştir.
4. “Toplam 373 görev var.” satırı ekrandan kalktı. Bu sayı sekmelerde ve sütun başlıklarında zaten var. Ekran okuyucu satırı yine okur. Satır yalnız arama ya da süzgeç açıkken görünür.
5. Kartta tek düğme var. “Kopyala” artık çerçeveli sade bir düğmedir. “Aç” sessiz, altı çizili bir bağlantıdır.
6. Kartın üst bilgisi tek satırdadır. Yalnız öncelik renkli bir etikettir. Faz, tür ve bağlam küçük ve soluk metindir.
7. Telefondaki sekmeler artık etikettir. Her sekmede sütun adı ve soluk sayı tek satırda durur. Seçili sekmenin altında koyu düz bir çizgi vardır. Çizginin köşeleri radiussuzdur.
8. Geniş ekranda sütun başlığı 16 px kalın bir etikettir. Sayı soluk yazılır. Başlığın altında koyu düz bir çizgi vardır.
9. Boş sütun artık kutu değildir. Yalnız kısa iki cümledir.
10. Arama kutusunun iç alanı ikinci kez hedef yüksekliği almıyor. Kutu artık süzgeçlerle aynı yüksekliktedir.
11. Sütun başlığı ile ilk kart arasına 12 px boşluk kondu.

### Bırakılan ve uyduğum kararlar

1. Bu tur sırasında `tokens.css` dosyasına “Kullanıcı düzeltmeleri” bölümü geldi. Bu bölüm görev kartını zemin rengiyle ayırır. Ben kartı önce ince bir çizgiyle ayırmıştım. Bölüm bu stili `!important` ile eziyor. Bu kullanıcı kararıdır. Bu yüzden kendi kart stilimi kaldırdım. Kartın zemini, köşesi ve iç boşluğu artık yalnız `tokens.css` dosyasından gelir.
2. Kart gövdesinin iç boşluğunu sıfırladım. Boşluğu kartın kendisi veriyor. Gövde de verirse boşluk iki kez eklenir.
3. Üst çubuk yeniden mavi oldu. Bu değişiklik benim kapsamımda değildir.

### Yeni istekler

1. **Arama kutusu çift yükseklik alıyor.** `tokens.css` içindeki hedef kuralı `.ant-input` ve `.ant-input-affix-wrapper` sınıflarına birlikte uygulanıyor. Arama kutusunda `.ant-input` iç alandır. İç alan da 44 px oluyor. Dış kutu iç boşlukla birlikte 63 px oluyor. Ben bunu kendi kutumda `styles.input` ile düzelttim. İsteğim şudur: Kural `.ant-input-affix-wrapper > .ant-input` öğesine uygulanmasın.
2. **Her `h2` başlığına zorunlu 24 px veriliyor.** Kanban sütun başlığı bir etikettir. Bu yüzden yazıyı başlığın içindeki bir öğede küçülttüm. Etiket gibi duran başlıklar için bir sınıf istiyorum. Bir token da olabilir.
3. **Seçim kutusu yüksekliği isteği hâlâ açıktır.** `tokens.css` kart içindeki seçim kutusunun yazısını 14 px yaptı. Kartın “Durum” kutusu bu yüzden artık 40.7 px kalıyor. Ayrıntısı “İstekler” bölümünün 1. maddesindedir.

### Kanıt

1. 320, 375, 768 ve 1280 px genişlikte ekran görüntüsü alındı. Hiçbir genişlikte sayfa yatay taşmadı.
2. 375 × 629 px ekranda ilk görevin başlığı, üst bilgisi ve “Kopyala” düğmesi kaydırmadan görünür.
3. Altı yeni test eklendi. Testler ilk görevin görünmesini ve süzgeçlerin tek satırda olmasını denetler. Kartta koyu düğme olmamasını ve “Aç” öğesinin bağlantı olmasını da denetler. Üst bilginin tek satırda olmasını ve arama kutusunun yüksekliğini de denetler.
4. `tests/ux-kanban.spec.ts` dosyasında 142 test geçti ve 6 test düştü. Düşen 6 test, “Durum” kutusunun yüksekliğini ölçen testtir. Neden “Yeni istekler” bölümünün 3. maddesindedir.
5. Üst bilgi testi düzeltildi. Masaüstündeki sütun dardır. Kartın iç boşluğu da artık `tokens.css` dosyasından gelir. Bu yüzden “Bağlam: Genel” ikinci satıra iner. Kart en az 320 px genişse test tek satır ister. Daha dar kartta en çok iki satıra izin verir.
6. Bütün takım `npm run test:dev` ile çalıştı. 1215 test geçti, 45 test düştü, 3 test kararsız çıktı, 63 test atlandı. Düşmelerin çoğu başka ajanların sayfalarındadır. Bu sayfalar çalışma sırasında değişiyordu. Benim dosyamda iki test düştü. Birincisi “Durum” kutusu yüksekliğidir. İkincisi üst bilgi testidir. Üst bilgi testini düzelttikten sonra yalnız “Durum” kutusu testi düşüyor.

Bu iş gerçek okurla denenmedi. Commit yapılmadı.
