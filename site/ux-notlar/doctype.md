# DocType epic sayfası: UX notları

Bu notlar 326 DocType epic sayfasını anlatır. Değişen dosya `src/components/DoctypePage.tsx` dosyasıdır. Testler `tests/ux-doctype.spec.ts` dosyasındadır.

Sayfalar 320, 375, 768 ve 1280 px genişlikte incelendi. Örnek sayfalar `order` ve `product_category_required_certification` sayfalarıdır.

## Çalışma ortamı notu

Brief dosyası bu çalışma klasöründe yoktu. Dosyayı ana klasördeki `site/UX-BRIEF.md` dosyasından okudum.

Bu klasörün `package.json` dosyasında `test:dev` komutu yok. `playwright.config.ts` dosyası da 4322 portuna bakıyor. Bu iki dosyaya dokunmadım.

Testleri geçici bir yapılandırmayla çalıştırdım. Bu yapılandırma aynı 7 projeyi kullanır. Adres olarak 4321 portundaki ortak sunucuya bakar. Sunucu başlatmaz.

`npm run lint:ui` komutu da çalışmıyor. Komutun betiği `scripts/ui-gate.mjs` bu klasörde yok.

## 1. tur

### Bulunan sorunlar

1. Etiket satırında "Yönergeler" bağlantısı etiketlerin arasında duruyordu. Bağlantı etikete benzemiyordu ve ne işe yaradığı belli değildi.
2. "Küçük", "Orta" ve "Büyük" etiketleri tek başına anlamsızdı.
3. Bağlam etiketi üç kez görünüyordu. Etiket, ekmek kırıntısı ve bilgi tablosu aynı bilgiyi veriyordu.
4. Alt başlık DocType adını tekrar ediyordu. Örnek: "Order: 04-siparis bağlamına taşıma".
5. Bilgi tablosu 320 px genişlikte dardı. Etiket sütunu yer kaplıyordu. Dosya yolları kelime ortasından bölünüyordu. Örnek: "product_category_required_certific" ve "ation".
6. Bilgi tablosu kalın çerçeveli bir kutuydu. Sayfada gereksiz bir kutu daha oluşuyordu.
7. Uzun onay maddelerinde kutu, metnin ortasına hizalanıyordu. Göz kutuyu ilk satırda bulamıyordu.
8. 1280 px genişlikte satırlar 1150 px kadar uzuyordu. Uzun satırı okumak zordu.
9. Önceki ve sonraki düğmeleri yalnız DocType adını gösteriyordu. Hangisinin önceki olduğu yazıyla söylenmiyordu.
10. Sonraki düğmesi telefonda sola yaslıydı. Önceki ve sonraki düğmeleri birbirinden ayrılmıyordu.

### Yapılan değişiklikler

1. "Yönergeler" bağlantısı etiket satırından çıktı. Kopyalama düğmelerinin altına bir cümle geldi: "Başlamadan önce yönergeleri okuyun."
2. Boyut etiketi artık "Büyük iş" gibi okunuyor.
3. Bağlam etiketi kaldırıldı. Bağlam bilgi listesinde ve ekmek kırıntısında kalıyor.
4. Alt başlık bir cümle oldu. Örnek: "Bu iş Order kaydını 04-siparis bağlamına taşır."
5. Bilgi tablosu yerine çerçevesiz bir tanım listesi geldi. Etiket her genişlikte değerin üstünde duruyor. Liste geniş ekranda yan yana sütunlara bölünüyor.
6. Dosya yolları kod yazısıyla gösteriliyor. Yollar yalnız "/" ve "_" işaretlerinden sonra satır atlıyor.
7. Uzun açıklamalı değerler satırın tamamını kaplıyor. Örnek: "Önerilen sahip bağlam" alanındaki not.
8. Onay kutusu artık metnin ilk satırıyla hizalı.
9. Epic sekmesindeki içerik en çok 820 px genişliğinde. Satır uzunluğu masaüstünde okunur kaldı.
10. Önceki ve sonraki düğmeleri iki satırlı oldu. Üst satırda "Önceki" ya da "Sonraki" yazıyor. Alt satırda DocType adı yazıyor.
11. Sonraki düğmesinin metni her genişlikte sağa yaslı. Düğmeler telefonda tam genişlikte duruyor.
12. Gezinme düğmeleri bir `nav` öğesine alındı. Üstüne ince bir ayırıcı çizgi geldi.

### Eklenen testler

Testler şunları denetler:

- alt başlığın DocType adını tekrar etmemesi,
- etiket satırında bağlantı olmaması,
- dosya yollarının taşmaması ve yalnız "/" ya da "_" işaretinden sonra bölünmesi,
- telefonda etiketin değerin üstünde durması,
- onay kutusunun ilk satırla hizası,
- masaüstünde en çok 900 px satır genişliği,
- önceki ve sonraki düğmelerinin yazısı ve hizası,
- dokunma hedeflerinin en az 44 px olması,
- Rapor sekmesi açıkken yatay taşma olmaması,
- adım kopyalama ve klavye ile sekme geçişi.

## 2. tur

### Bulunan sorunlar

1. Onay listelerinde ilerleme görünmüyordu. Okur kaç maddeyi işaretlediğini sayarak buluyordu.
2. İşaretlerin saklanmadığı yazmıyordu. Okur sayfayı yenileyince işaretleri kaybediyordu ve nedenini bilmiyordu.
3. "Rapor" sekmesi kaç bölüm olduğunu söylemiyordu.
4. Rapor bölümlerini tek tek açmak gerekiyordu. Telefonda raporun tamamını okumak altı dokunuş istiyordu.
5. Bağlam ve önerilen sahip çoğu sayfada aynı değerdi. Aynı bilgi iki satırda tekrar ediyordu.
6. Telefonda kısa bilgiler alt alta diziliyordu. Bilgi listesi sekmeleri ekranın altına itiyordu.
7. Alt başlıktaki bağlam adı telefonda tireden bölünüyordu. Örnek: "04-" ve "siparis".

### Yapılan değişiklikler

1. "Kabul kriterleri" ve "Kontrol listesi" başlıklarının yanına sayaç geldi. Örnek: "1 / 10 tamam". Sayaç ekran okuyucuya da duyurulur.
2. Kabul kriterlerinin altına bir not geldi: "İşaretler yalnız bu sayfada durur. Sayfa yenilenince işaretler silinir."
3. Sekme adı "Rapor (6 bölüm)" gibi okunuyor.
4. Rapor sekmesine "Bütün bölümleri aç" düğmesi geldi. Bölümler açıkken düğmenin adı "Bütün bölümleri kapat" olur.
5. Rapor bölümü yoksa boş durum yazısı görünür: "Bu rapor henüz yazılmadı."
6. Bağlam ile önerilen sahip aynıysa tek satır görünür. Satırın adı "Bağlam ve önerilen sahip" olur. Değerler farklıysa iki satır da kalır.
7. Kısa bilgiler telefonda yan yana duruyor. Dosya yolu ve uzun not içeren bilgiler tam satır kaplıyor.
8. Alt başlıktaki bağlam adı tek parça kalıyor.

### Test sonucu

`tests/ux-doctype.spec.ts` ve `tests/site.spec.ts` 7 projede çalıştı. 509 test geçti ve 16 test atlandı. Başarısız test yok.

## 3. tur

Bu turda klavye akışını ve uzun rapor içeriğini inceledim.

### Bulunan sorunlar

1. Klavyeyle sekmeden sonra Tab tuşuna basınca sekme panelinin kendisi odak alıyordu. Bütün panel sarıya boyanıyordu. Okur ilk onay kutusuna ulaşmak için bir kez daha Tab tuşuna basıyordu.
2. Telefonda rapor bölümlerinin iç boşluğu fazlaydı. Dosya yolları dar alanda daha çok bölünüyordu.

### Yapılan değişiklikler

1. Sekme panelleri artık Tab sırasına girmiyor. İki panelde de odaklanabilir öğe var. Bu yüzden panelin kendisinin odak alması gerekmiyor. Ant Design paneli her sekme değişiminde yeniden odaklanabilir yapıyor. Sayfa bunu bir gözlemciyle geri alıyor.
2. Klavye sırası şimdi şöyle: kopyalama düğmeleri, yönergeler bağlantısı, sekmeler, ilk onay kutusu.
3. 600 px altında rapor bölümlerinin yan boşluğu 16 px yerine 12 px oldu. Liste girintisi de 24 px yerine 16 px oldu.

### Test sonucu

`tests/ux-doctype.spec.ts` 7 projede çalıştı. 162 test geçti ve 20 test atlandı. Başarısız test yok.

`tests/site.spec.ts` ile birlikte de çalıştı. Benim kapsamımda başarısız test yok. `/kanban/` sayfasında 14 px testi masaüstünde başarısız oldu. O sayfa başka bir ajanın kapsamındadır.

## 4. tur

Bu turda sayfayı telefonda baştan sona yeniden okudum.

### Bulunan sorunlar

1. Bütün maddeler işaretlenince sayaç yalnız "5 / 5 tamam" diyordu. Bitiş anı göze çarpmıyordu.
2. Kopyalama düğmelerinin ne işe yaradığı yazmıyordu. Teknik olmayan okur kopyalanan metni ne yapacağını bilmiyordu.
3. Telefonda iki kopyalama düğmesinin genişliği farklıydı. Sıra düzensiz görünüyordu.
4. Geçiş adımlarında numara metnin içindeydi. İkinci satır numaranın altından başlıyordu. Adım numaraları dikey bir sütun oluşturmuyordu.

### Yapılan değişiklikler

1. Bütün maddeler işaretlenince sayaç "Hepsi tamam (5 / 5)" der.
2. Kopyalama düğmelerinin altına yeni bir cümle geldi. Cümle kopyalanan metnin kime verileceğini söyler.
3. 600 px altında iki kopyalama düğmesi tam genişlikte ve aynı boyda. Geniş ekranda düğmeler kendi boyunda kalır.
4. Adım numarası ayrı bir sütunda duruyor. Adım metni ve "adımı kopyala" düğmesi numaranın sağında aynı çizgide başlıyor.

### Test sonucu

Bu turun ilk üç testini kodla aynı adımda yazdım. Adım hizası testini önce başarısız gördüm, sonra kodu yazdım.

`tests/ux-doctype.spec.ts` ve `tests/site.spec.ts` 7 projede çalıştı. 543 test geçti ve 24 test atlandı. Başarısız test yok.

## 5. tur

Bu turda 768 ve 1280 px genişliği yeniden inceledim. Sonra 326 sayfanın hepsini taradım.

### Bulunan sorun

768 px genişlikte "Bağlam ve önerilen sahip" etiketi üç satıra bölünüyordu. Bilgi listesi eşit dar sütunlar kullanıyordu.

### Yapılan değişiklik

Bilgi listesi esnek satır düzenine geçti. Her kısa bilgi kendi genişliğini alıyor. Dosya yolu ve uzun not içeren bilgiler yine tam satır kaplıyor. Etiketler 360 px ve üstünde tek satırda kalıyor.

### Bütün sayfaların taranması

326 DocType sayfasının hepsi 320 px genişlikte açıldı. Bu tarama bir defalık bir betikle yapıldı. Betik test dosyasına eklenmedi.

Betik şunları denetledi:

- sayfada yatay taşma,
- bilgi listesinde, başlıkta, onay maddelerinde ve gezinme düğmelerinde taşma,
- 14 px altındaki görünür yazı,
- alt başlığın varlığı.

Taramada hiçbir sayfada sorun çıkmadı.

## İstekler

1. Tehlike rengi için bir token gerekiyor. "Yapmamanız gerekenler" listesindeki simge `#a8071a` rengini doğrudan kullanıyor. Örnek ad: `--color-danger`. Bu renk `tokens.css` ve `theme.ts` dosyalarına birlikte eklenmeli.
2. Bu çalışma klasörünün `package.json` dosyasında `test:dev` komutu yok. Ana klasördeki `7d8f15d` commit'i bu klasöre alınmamış. `playwright.config.ts` dosyası da 4321 portunu desteklemiyor.
3. `npm run lint:ui` komutu çalışmıyor. `scripts/ui-gate.mjs` dosyası bu klasörde yok.
4. "User story" başlığı İngilizce. `tests/site.spec.ts` bu başlığı birebir arıyor. Başlık Türkçe olacaksa test de birlikte değişmeli. Örnek: "Kullanıcı hikâyesi".

## Son özet

### Turlara göre değişiklikler

1. 1. tur: Etiket satırı, alt başlık ve bilgi listesi düzeldi. Dosya yolları artık kelime ortasından bölünmüyor. Onay kutusu hizası, masaüstü satır uzunluğu ve gezinme düğmeleri de düzeldi.
2. 2. tur: Onay listelerine sayaç geldi. İşaretlerin saklanmadığı yazıldı. Rapor sekmesine bölüm sayısı ve "Bütün bölümleri aç" düğmesi geldi. Tekrarlayan bağlam satırı birleşti.
3. 3. tur: Sekme paneli Tab sırasından çıktı. Telefonda rapor bölümlerinin iç boşluğu azaldı.
4. 4. tur: Sayaç bitişte "Hepsi tamam" diyor. Kopyalama düğmelerinin amacı yazıldı. Telefonda düğmeler eşit genişlikte. Adım numaraları ayrı sütunda.
5. 5. tur: Bilgi listesi esnek düzene geçti. 326 sayfanın hepsi tarandı.

### Düzeltemediklerim

1. Ekmek kırıntısı, üst menü ve alt bilgi `AppShell.tsx` dosyasındadır. Bu dosya benim kapsamımda değil.
2. Kopyalama düğmesinin ipucu ve etiket renkleri `bits.tsx` ve `theme.ts` dosyalarındadır. Örneğin "Düşük" etiketinin rengi bu dosyalardan gelir.
3. Rapor içindeki kod yazısının bölünmesi `tokens.css` dosyasındaki `.md code` kuralına bağlıdır. Bu yüzden rapor sekmesinde dosya yolları kelime ortasından bölünebilir.
4. İşaretler sayfa yenilenince silinir. Bunu saklamak yeni bir veri kararı ister. Bu yüzden yalnız bir not ekledim.

### Açık istekler

Yukarıdaki "İstekler" bölümündeki 4 madde açık.

### Son test sonucu

Testler geçici bir Playwright yapılandırmasıyla çalıştı. Yapılandırma 4321 portundaki ortak sunucuyu ve aynı 7 projeyi kullanır. Firefox çalıştırılmadı.

Son çalıştırmada bütün test dosyaları çalıştı. 1164 test geçti ve 64 test atlandı. 11 test başarısız oldu.

Başarısız 11 testin hiçbiri benim dosyalarımda değil. Hepsi şu dosyalardadır: `ux-yonerge-ortak.spec.ts`, `ux-baglam-anasayfa.spec.ts`, `ux-kabuk.spec.ts` ve `ux-kanban.spec.ts`.

`tests/ux-doctype.spec.ts` ve `tests/site.spec.ts` dosyalarında başarısız test yok. Gerçek cihazda ve CI'da deneme yapılmadı.

## Kural güncellemesi sonrası

Kural 18 Kasım 2026 Çarşamba günü güncellendi. Kontrol genişlikleri artık 320, 375, 768 ve 1280 px. İlk sırada 320 px var. 390 px listeden çıktı.

### Yapılan değişiklikler

1. Test dosyamda 390 px genişliği yoktu. Telefon testleri "400 px altı" koşulunu kullanıyordu. Bu koşulu "375 px ve altı" yaptım. Bu testler artık 320 ve 375 px genişlikte çalışıyor.
2. Gezinme düğmelerindeki `min-height` kuralını kaldırdım. Bu kuralı artık `tokens.css` uyguluyor. Fare için en az 44 px, dokunma için 48 px geçerli.
3. Kaldırılan kural `--hit-min` tokenını kullanıyordu. Bu token `tokens.css` içinde artık yok.

### Test sonucu

`npm run test:dev` komutu artık var. Komutu `ux-doctype.spec.ts` ve `site.spec.ts` dosyalarıyla çalıştırdım. 469 test geçti ve 23 test atlandı. Başarısız test yok.

İlk denemede 10 test `ENOENT` hatası verdi. Bu hatalar testlerin kendisinden gelmedi. Başka bir ajanın test çalıştırması ortak `test-results` klasörünü sildi. Bu yüzden son çalıştırmada `--output` ile ayrı bir klasör kullandım.

## İstekler (güncel)

1. Tehlike rengi için token isteği hâlâ açık. Örnek ad: `--color-danger`.
2. Ajanlar aynı `test-results` klasörünü kullanıyor. Bir ajanın testi başka bir ajanın kanıt dosyalarını siliyor. Her ajan için ayrı `--output` klasörü önerilir.
3. "User story" başlığı isteği hâlâ açık.

## 6. tur: tasarım yönü

Bu turda `TASARIM-YONU.md` dosyasını uyguladım. Sahibin en önemli üç maddesini önce ele aldım.

### En önemli üç madde

1. **Okuma sütunu.** Sayfanın bütün içeriği `--measure` genişliğinde duruyor. Bu genişlik 68 karakterdir. 1280 px ekranda satırlar artık 1150 px uzunluğunda değil. Sağ tarafta boşluk kalıyor.
2. **Dosya yolları.** Üst bilgi tablosu kalktı. Klasör ve denetleyici yolları kapalı bir "Dosya yolları" ayrıntısına taşındı. Kapalı başlıkta yalnız dosya adı ve satır sayısı görünür. Örnek: `order.py` (535 satır). Okur başlığa dokununca iki tam yol açılır.
3. **Meta satırı.** Öncelik, faz, büyüklük, bağlam ve tür tek satırda duruyor. Yalnız öncelik renkli zemin alıyor. Diğerleri küçük ve soluk düz yazıdır. Telefonda satır gerekirse ikinci satıra iner.

### Diğer değişiklikler

1. "Raporun tamamını kopyala" artık sessiz bir bağlantı görünümünde. Ana eylem yalnız "Epic'i kopyala" düğmesidir.
2. Geçiş adımlarındaki 10 kopyalama düğmesi de sessiz bağlantı oldu. Erişilebilir adları değişmedi. Örnek: "2. adımı kopyala".
3. Önerilen sahip bağlam, bağlamdan farklıysa kısa bir not olarak görünür. Aynıysa not görünmez. Bağlam zaten meta satırında yazıyor.
4. Kullanıcı hikâyesi gri kutudan çıktı. Metin büyük gövde yazısı olarak duruyor.
5. Listelerdeki ayırıcı çizgiler kalktı. Maddeleri artık boşluk ayırıyor.
6. Rapor bölümleri çerçeveli kutu değil. Bölümler arasında yalnız ince bir çizgi var. "Bütün bölümleri aç" da sessiz bir bağlantı oldu.
7. Önceki ve sonraki bağlantıları çerçevesiz. Üstlerinde ince bir ayırıcı çizgi kaldı.
8. "Yapmamanız gerekenler" simgesi artık `--kriz-fg` tokenını kullanıyor. Önceki `#a8071a` sabit rengi kalktı. Bu yüzden renk token isteği kapandı.

### Bıraktıklarım

1. "User story" başlığı İngilizce kaldı. `tests/site.spec.ts` bu başlığı birebir arıyor.
2. Rapor içindeki kod yazısı `tokens.css` kurallarına bağlı. Rapordaki uzun yollar kelime ortasından bölünebilir.
3. Telefonda bazı geçiş adımlarında kod satırı kutusu 2 ya da 3 px taşıyor. Taşan bir harf yok ve sayfa yatay kaymıyor. Ölçüm kod kutusunun satır sonundan geliyor. Bu kuralı `tokens.css` belirliyor.

### Testler

Eski bilgi tablosu testlerini kaldırdım. Yerlerine 9 yeni test yazdım. Yeni testleri önce çalıştırdım ve başarısız olduklarını gördüm. Sonra kodu yazdım.

Yeni testler şunları denetler:

- okuma sütununun 68 karakter civarında kalması,
- meta bilgilerin tek satırda durması ve yalnız önceliğin renkli olması,
- dosya yollarının kapalı ayrıntıda durması,
- açık yolların yalnız "/" ya da "_" işaretinden sonra bölünmesi,
- ayrıntı başlığının en az 44 px yüksek olması,
- önerilen sahip notunun yalnız farklı bağlamda görünmesi,
- ikincil kopyalama eylemlerinin çerçevesiz olması,
- kullanıcı hikâyesinin kutu içinde olmaması,
- önceki ve sonraki bağlantılarının çerçevesiz olması.

`tests/ux-doctype.spec.ts` ve `tests/site.spec.ts` birlikte çalıştı. 474 test geçti ve 12 test atlandı. Başarısız test yok.

Bir defalık tarama betiği 326 sayfanın hepsini 320 px genişlikte açtı. Hiçbir sayfa yatay kaymadı. Hiçbir sayfada 14 px altında yazı yok.

Bir kez `PW_URL` olmadan test çalıştırdım. Playwright 4322 portunda zaten çalışan sunucuyu kullandı. Derleme başlatmadı.

`npm run test:dev` komutu bütün test dosyalarıyla da çalıştı. 1298 test geçti ve 67 test atlandı. 9 test başarısız oldu. Başarısız testlerin hepsi `ux-kanban.spec.ts` ve `ux-kabuk.spec.ts` dosyalarındadır. Bu dosyalar başka ajanların kapsamındadır.
