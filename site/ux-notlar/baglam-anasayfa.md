# Bağlamlar ve ana sayfa

## 1. tur

Üç adresi 320, 375, 768 ve 1280 CSS pikselde açtım. 320 ve 375 pikselde bağlam kartlarının başlık bağlantıları 44 pikselden kısaydı. Epic tablosu dar ekranda yatay kayıyordu. Kaydırma alanı klavye sırasına girmiyordu. İlk sütunun sözcük koruması yalnız bağlantının içindeydi.

Kart başlıklarına 44 piksel dokunma alanı verdim. Epic tablosuna adlandırılmış, klavyeyle odaklanabilen bir kaydırma alanı ekledim. İlk sütundaki adları tek satırda tuttum ve DocType bağlantılarını 44 piksele çıkardım.

Çalışma ağacındaki `package.json` dosyasında `test:dev` komutu yok. Ana çalışma ağacındaki test yapılandırmasını geçici bir dosyaya uyarladım. Playwright mevcut 4321 sunucusunu kullanıyor.

## 2. tur

Üç sayfayı dört genişlikte yeniden açtım. 320 pikselde bilgi kutusu 237 piksel yüksekliğindeydi. İlk adım metnin içinde kalıyordu. Girişteki sabit sayılar istatistiklerle aynı kaynağı kullanmıyordu. 768 ve 1280 pikselde dört kart aynı sırada, 320 ve 375 pikselde iki sırada okunuyordu.

Ana başlığın ve girişin aralıklarını hizaladım. Girişteki sayıları veri kaynağına bağladım. Bilgi kutusunun başlığını ilk adıma ayırdım ve açıklamayı iki kısa paragrafa böldüm. İstatistik etiketlerini kısalttım ve kart boylarını eşitledim. Bu geçişte `npm run test:dev` erişilebilir oldu.

## 3. tur

Üç sayfayı dört genişlikte yeniden açtım. Bağlam kartları her genişlikte kısa kodu başlıkta ve açıklamada tekrarlıyordu. Açıklama en dar kartlarda kırpılabiliyordu. Yüzde değerinden kaç epic’in bittiği anlaşılmıyordu. Faz özetinin sonundaki görev sayısını 320 ve 375 pikselde bulmak zordu.

Kart açıklamalarındaki yinelenen kodu çıkardım ve kırpmayı kaldırdım. İlerleme çubuğuna erişilebilir ad verdim. Tamamlanan ve toplam epic sayısını çubuğun üstüne yazdım. Faz görev sayılarını ayrı satıra aldım. Başlığı bağlantı renginde ve oku başlıkla aynı hizada gösterdim.

## 4. tur

Üç sayfayı dört genişlikte yeniden açtım. 320 ve 375 pikselde tablonun diğer sütunlarını görmek için yana kaydırmak gerektiği görünmüyordu. Sabit genişlik tüm Ant Design bileşenine verilince başka bağlamlarda sayfalama da ekran dışına çıkabiliyordu. 320 pikselde bilgi kutusundaki simge metnin alanını daraltıyordu. Genel plan düğmesinin etiketi iki satıra taşıyordu.

Tablonun alt sınırını yalnız tablo alanına uyguladım. Kaydırma ipucu dar kapsayıcılarda görünür. Sayfalama görünür alanda kalır. Bilgi kutusunun simgesini kaldırdım ve plan düğmesinin adını kısalttım. Her iki planda da başlıkların dokunma alanını açıkça 44 piksel olarak belirledim.

## 5. tur

Üç sayfayı 320, 375, 768 ve 1280 pikselde yeniden açtım. Bilgi kutusu ilk görevleri tarif ediyordu. Okuyucu bağlantıyı bulmak için faz listesine iniyordu. Bağlam kartı `Kriz` önceliğini `Kritik` diye gösteriyordu. Bağlam istatistiğinde toplam sayı, biten sayı kadar baskındı.

Bilgi kutusuna Faz −1 bağlantısını ekledim. Kart, varsa `Kriz` önceliğini gösterir. Detay sayfasında biten sayıyı öne çıkardım.

Son tarayıcı kontrolünde 12 sayfa ve genişlik eşleşmesini denedim. Ana sayfanın planını ve sipariş planındaki dokuz bölümü açtım. Sayfalar yatay taşmadı. Epic tablosunun kaydırma alanı 320 pikselde 288, 375 pikselde 343 piksel genişliğindeydi. Tablo 640 piksel genişliğinde kaldı. 768 ve 1280 pikselde tablonun tümü görünüyordu.

## Sonuç

İlk geçişte dokunma ve kaydırma alanlarını düzelttim. İkinci geçişte ana sayfanın girişini, bilgi kutusunu ve istatistiklerini düzenledim. Üçüncü geçişte kart ilerlemesini ve faz listesini daha kolay taranır hâle getirdim. Dördüncü geçişte tabloya kaydırma ipucu ekledim ve plan kontrollerini kısalttım. Beşinci geçişte ilk faza doğrudan bağlantı verdim ve öncelik etiketini düzelttim.

320 pikselde ok tuşu tabloyu yana kaydırdı. Klavye odağı sarı zeminle göründü. Tarayıcı çevre halkası çizmedi.

İlk test çalıştırmasında 321 test geçti ve 36 test başarısız oldu. Birinci ve ikinci çalıştırmalar aynı çıktı dizinini kullandığı için bazı Playwright iz dosyaları kayboldu. İkinci geçişte 334 test geçti ve 23 test başarısız oldu. Sonraki çalıştırmalarda ayrı çıktı dizinleri kullandım. Üçüncü geçişte 354 test geçti ve üç Kanban testi başarısız oldu. Dördüncü geçişte 451 test geçti, 12 test atlandı ve altı Kanban veya DocType testi başarısız oldu.

Son `npm run test:dev` çalıştırmasında 547 test geçti, 16 test atlandı ve dört test başarısız oldu. Bu kapsamın 21 testi geçti. Kanban durum testi kapsam dışındaydı. WebKit 375 pikselde üç kapsam sayfasında 6 piksel yatay taşma ölçtü. Ayrı tarayıcı denemesinde bu farkı yeniden üretemedim. Yatay taşma testlerini üçer kez çalıştırdım. 30 testin tümü geçti. Tek seferlik ölçümün nedeni doğrulanamadı.

## İstekler

Açık token ya da tema isteği yok.

## Genişlik ve etkileşim hedefi güncellemesi

Kapsam testleri 320 pikselden başladı. Yalnız 320, 375, 768 ve 1280 piksel kullanıldı. Epic tablosu her projenin kendi genişliğinde ölçüldü. Dar ekranda kaydırma ve ipucu, geniş ekranda tablonun tamamı doğrulandı.

İki bileşendeki yerel hedef boyutlarını kaldırdım. Plan başlıkları ve bağlantı düğmeleri ortak stilin hedef ölçülerini kullanır. Kart ve faz bağlantıları alanını içerik ve boşluklarla alır. Kapsam testleri fare ve dokunma için geçerli yükseklikleri ölçtü. Chromium ve WebKit genelinde 15 test geçti.

## 6. tur: tasarım yönü

Üç sayfayı 320, 375, 768 ve 1280 pikselde inceledim. 320 pikselde ana sayfanın bilgi kutusu 271 piksel yüksekliğindeydi. Dört sayaç da ilk fazı aşağı itiyordu. 1280 pikselde faz satırları ana içerik alanının tümüne yayılıyordu.

Bilgi kutusu ve sayaçları kaldırdım. İlk adımı bir cümleyle belirttim. Ana sayfada giriş ve faz listesi, bağlam sayfalarında giriş metni için ortak `--measure` ölçüsünü kullandım. Epic tablosu geniş alanını korudu. Genel plan ve bağlam planı açılmaya devam ediyor.

`npm run test:dev` ile dört genişlikte 15 kapsam testi geçti.

## 7. tur: faz sırası

Üç sayfayı dört genişlikte yeniden açtım. 1280 pikselde ok, sütun daralmışken bile başlıktan uzakta kalıyordu. 320 ve 375 pikselde faz etiketi uzun başlıkları gereksiz yere uzatıyordu.

Fazları sıralı bir listeye aldım. −1 ile 5 arasındaki numaraları büyük, ikincil renkte ve ayrı bir sütunda gösterdim. Başlık, görev sayısı ve özet aynı hizada durur. Oku ve satır çizgilerini kaldırdım. Satırın tamamı bağlantı olarak kaldı.

`npm run test:dev` ile dört genişlikte 15 kapsam testi geçti. Test, numaraların sırasını ve listenin okuma ölçüsünü de doğruladı.

## 8. tur: bağlamların görsel ağırlığı

Üç sayfayı dört genişlikte yeniden açtım. 320 ve 375 pikselde kart başlıkları, kenarlıklar ve etiket satırı ilerleme bilgisini aşağı itiyordu. 1280 pikselde sipariş sayfasındaki iki istatistik kartı tablodan daha fazla görsel ağırlık taşıyordu.

Bağlam kutularını başlık, metadata ve ilerleme çubuğu olan kenarlıksız bölümlere dönüştürdüm. Öncelik rengini yalnız öncelik etiketinde bıraktım. Sipariş sayfasında iki kutu yerine biten ve toplam epic sayısını tek satırda gösterdim. Planların dış çerçevesini hafiflettim. Epic tablosunun genişliği, yatay kaydırması ve ilk sütundaki sözcük koruması yerinde kaldı.

1280 pikselde üç sayfanın okuma alanı `68ch` olarak ölçüldü. Kullanılan yazı tipiyle bu ölçü 714 piksele denk geldi. Son tarayıcı kontrolünde 12 sayfa ve genişlik eşleşmesinde plan bölümlerini açtım. Sayfalar yatay taşmadı.

Son `npm run test:dev` çalıştırmasında 60 test geçti. Bunların 15’i kapsam testiydi. Kalan 45 test üç sayfanın taşma, yazı boyutu ve köşe yarıçapını denetledi. Bu çalıştırma kapsam sayfalarıyla sınırlıydı. Açık token veya tema isteği yok.
