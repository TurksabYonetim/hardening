# Fazlar kapsamı: UX notları

Bu kapsamın tek kaynak dosyası `src/components/PhasePage.tsx` dosyasıdır. Sayfalar `/fazlar/faz-eksi-1/` ile `/fazlar/faz-5/` arasındadır.
Testler `tests/ux-fazlar.spec.ts` dosyasındadır.

## Ortam notu

Bu worktree brief'in commit'ini (`7d8f15d`) içermiyor. `npm run test:dev` betiği ve `PW_URL` desteği bu worktree'de yok.
Orkestratör dosyalarına dokunmadım. Aynı ayarı geçici bir Playwright ayar dosyasıyla kurdum.
Bu ayar çalışan `http://localhost:4321` sunucusuna bağlanır ve derleme yapmaz.
Komut şudur:

```
npx playwright test --config <scratch>/pw.dev.config.ts
```

Ayar dosyası orkestratörün `playwright.config.ts` projeleriyle aynıdır (7 proje, Firefox yok).

## 1. tur

### Bulgular

1. `#gorev-N` bağlantısı karta inmiyordu. Sayfa tarayıcıda çiziliyor. Tarayıcı kaydırmayı içerik gelmeden yapıyordu. Kanban'dan gelen okur sayfanın en üstünde kalıyordu.
2. Onay kutusu çok satırlı metnin ortasında duruyordu. 320 px'te 6 satırlık maddede kutu metnin ortasına düşüyordu.
3. Liste satırları panel içinde 16 px fazladan girinti alıyordu. 320 px'te metin sütunu 32 px daralıyordu.
4. Yönerge düğmeleri "Yönerge: TDD yönergesi" yazıyordu. "Yönerge" kelimesi iki kez geçiyordu. Grubun görünür başlığı yoktu.
5. Faz 4 sayfası 218 epic kartını tek seferde çiziyordu. 375 px'te sayfa 64.698 px uzunluğundaydı.
6. Boş durum yalnız "Bu fazda DocType epic'i yok." diyordu. Okur epic'leri nerede bulacağını bilmiyordu.
7. Epic kartında boyut etiketi yalnız "Orta" yazıyordu. Etiketin ne olduğu belli değildi.

### Değişiklikler

1. Sayfa açılınca `location.hash` içindeki karta kaydırma eklendi. Karta `scroll-margin-top: 72px` verildi. Yapışkan üst çubuk 56 px. Kart başlığı çubuğun altında kalmıyor.
2. Onay kutusu ilk metin satırıyla hizalandı. `styles.icon` ile `align-self: flex-start` verildi.
3. Liste satırlarının yatay iç boşluğu sıfırlandı. Panelin kendi iç boşluğu yeterli.
4. Yönerge grubu `<nav aria-label="İlgili yönergeler">` oldu. Görünür "İlgili yönergeler" başlığı eklendi. Düğme metni yalnız yönerge başlığı.
5. Epic listesi 20'şer açılıyor. "20 epic daha göster" düğmesi var. Kalan 20'den çoksa "Kalan N epic'in hepsini göster" düğmesi de var. Bağlam değişince sayaç başa döner.
6. Durum satırı eklendi. Örnek metin şudur: "Bu fazda 218 epic var. Şimdi 20 epic görünüyor." Satır `aria-live="polite"` taşır. Süzgeç değişince ekran okuyucu sonucu duyar.
7. Boş durum iki kısa cümle ve üç bağlantı oldu. Bağlantılar Faz 3, Faz 4 ve Faz 5 sayfalarına gider. Boş durumda süzgeç gösterilmez.
8. Epic kartında boyut etiketi "Boyut: Orta" oldu. Görev kartındaki "Sorumlu: Geliştirici" ile aynı biçim.

### Kanıt

- Ekran görüntüleri 320, 375, 768 ve 1280 px'te alındı (Chromium).
- Kendi test dosyamda 20 test vardı. Testler 7 projede çalıştı ve 140 sonuç geçti.
- Tam takım sonucu aşağıdaki "Son test sonucu" bölümünde.

## 2. tur

### Bulgular

1. Görev hikâyesinde ters tırnaklar ham görünüyordu. Örnek: Faz 2, 1. görev: "Böylece `hooks.py` dosyasına elle yazmam." Hikâye metni HTML'siz geliyor.
2. Epic hikâyesinde de aynı sorun vardı. 57 epic'in hikâyesinde kod işareti var. Veride HTML hâli (`epic.html.story`) hazırdı ama kullanılmıyordu.
3. "Daha göster" sonrası odak düğmede kalıyordu. Son parçada düğme kaybolunca odak sayfa gövdesine düşüyordu. Klavye okuru yeni kartları bulamıyordu.
4. Epic kartlarında `scroll-margin-top` yoktu. Odak kaydırması kartı üst çubuğun altına sokabilirdi.

### Değişiklikler

1. `StoryText` yardımcısı eklendi. Ters tırnaklı parçalar `<code>` olarak çizilir. Kutuya `md-inline` sınıfı verildi. Böylece mevcut kod rengi ve sarma kuralı uygulanır.
2. Epic kartı hikâyeyi `Inline` ile ve `epic.html.story` üzerinden gösterir.
3. "Daha göster" ve "Hepsini göster" tıklanınca odak ilk yeni kartın başlık bağlantısına geçer. Kart üst çubuğun altında görünür.
4. Epic kartlarına da `scroll-margin-top: 72px` verildi.

### Kanıt

- Kendi test dosyamda 23 test vardı. Testler chromium-320 ve webkit-desktop üzerinde çalıştı ve 46 sonuç geçti.

## 3. tur

### Bulgular

1. Onay kutusu işaretleri sayfa yenilenince siliniyordu. Okur ilerlemesini kaybediyordu. Kanban durumları ise tarayıcıda saklanıyordu.
2. Panel başlığı ilerlemeyi göstermiyordu. Kapalı panelde kaç madde işaretli olduğu görünmüyordu.
3. Sayfa sonunda sonraki faza geçiş yoktu. Faz 4 sayfası 375 px'te on binlerce piksel uzun. Okur başa dönmek zorundaydı.
4. 1280 px'te madde satırları 1.150 px genişliğe yayılıyordu. Bir satırda 115 karakter vardı. Göz satır başını kaçırıyordu.

### Değişiklikler

1. İşaretler `localStorage` içinde saklanır. Anahtar `istoc-mimari-fazlar-kontrol-v1`. Depolama kapalıysa işaret yalnız o oturumda kalır. Her görevin kabul ve kontrol listesi ayrı saklanır.
2. Panel başlığı işaret varsa ilerlemeyi yazar: "Kabul kriterleri (3 / 7 işaretli)". İşaret yoksa yalnız sayı kalır.
3. Sayfa sonuna "Önceki faz" ve "Sonraki faz" bağlantıları eklendi. Sonraki faz ana düğmedir. İlk fazda önceki, son fazda sonraki bağlantı yoktur.
4. Görev kartları, epic listesi ve alt gezinme 880 px ile sınırlandı. Bu genişlik yaklaşık 100 karakterdir. Faz düğmeleri ve başlıklar tam genişlikte kalır.

### Kanıt

- Kendi test dosyamda 26 test vardı. Testler chromium-320 ve chromium-desktop üzerinde çalıştı ve 52 sonuç geçti.
- 1. tur sonrası tam takım 7 projede 6,8 dakikada çalıştı. 799 test geçti, 16 test atlandı, hiçbir test başarısız olmadı. Atlanan testler başka ajanın yönerge testleridir.

## 4. tur

### Bulgular

1. Onay kutulu satırlar 41,6 px yüksekti. Dokunma hedefi kuralı 44 px ister. Tek satırlık maddelerde hedef küçük kalıyordu.
2. İlk fazda alt gezinmede boş bir `<span>` yer tutuyordu. Gereksiz öğe.
3. WebKit ve Chromium'da klavye sırası kontrol edildi. Sıra: içeriğe geç, menü, site adı, kırıntı, 7 faz düğmesi, kopyala, paneller, kutular, yönergeler. Sorun yok.
4. Bağlam süzgecinin açılan paneli Ant Design `Select` paneli. Yerel menü değil. Sorun yok.
5. Odak göstergesi tek öğede kalıyor. 10 Tab sonrası yalnız etkin öğe sarı. Sorun yok.

### Değişiklikler

1. Onay kutulu satırların dikey iç boşluğu 10 px oldu. Satır yüksekliği 45,6 px.
2. Alt gezinmede boş `<span>` kaldırıldı. Önceki faz yoksa sonraki faz düğmesi sağa yaslanır.

### Kanıt

- Kendi test dosyamda 27 test vardı. Testler 7 projede çalıştı ve 189 sonuç geçti.
- WebKit 375 px'te ekran görüntüleri alındı: sayfa başı, açık süzgeç paneli, klavye odağı.

## 5. tur

### Bulgular

1. Her görev kartındaki yönerge grubu `<nav>` landmark'ıydı. Faz 0'da 10 kartta 10 ayrı landmark oluşuyordu. Ekran okuyucunun landmark listesi şişiyordu.
2. Epic kartında bağlam etiketi yalnız "03a-katalog" yazıyordu. "Boyut: Küçük" ve "Sorumlu: Geliştirici" etiketleri ise açıklamalıydı. Biçim tutarsızdı.
3. 768 px'te epic listesi ve durum satırı kontrol edildi. Sorun yok.
4. Notlar `yalin-turkce-denetim.mjs` ile denetlendi. Etiket dizisi uyarıları tam cümleye çevrildi.

### Değişiklikler

1. Yönerge grubu `role="group"` ve `aria-label="İlgili yönergeler"` oldu. Sayfada tek `<nav>` alt gezinmede kaldı. Faz düğmeleri de ayrı bir `<nav>` içindedir.
2. Epic kartında bağlam etiketi "Bağlam: 03a-katalog" oldu.

### Kanıt

- Kendi test dosyamda 27 test var. Testler chromium-320 ve webkit-375 üzerinde çalıştı ve 54 sonuç geçti.
- Tam takım sonucu aşağıdaki "Son test sonucu" bölümündedir.

## İstekler

1. Hata rengi için token istiyorum. "Yapmamanız gerekenler" listesindeki kapalı daire simgesi `#a8071a` rengini sabit yazıyor. `tokens.css` içinde `--color-danger: #a8071a` olursa simge tokenı kullanır. Aynı değer `theme.ts` içinde `colorError` olarak zaten var.
2. Bu worktree'ye orkestratörün `7d8f15d` commit'i gelmeli. O commit `npm run test:dev` betiğini ve `PW_URL` desteğini getiriyor. Ben orkestratör dosyalarına dokunmadım. Testleri geçici bir ayar dosyasıyla aynı sunucuya karşı çalıştırdım.

## Özet

### Tur tur değişiklikler

1. tur: `#gorev-N` bağlantısı karta iniyor. Onay kutusu ilk satırla hizalı. Liste girintisi kalktı. Yönerge grubu başlık aldı ve düğme metni sadeleşti. Epic listesi 20'şer açılıyor ve durum satırı var. Boş durum üç faza bağlantı veriyor. Boyut etiketi açıklamalı.
2. tur: Hikâyedeki ters tırnaklar kod olarak görünüyor. Epic hikâyesi hazır HTML'i kullanıyor. "Daha göster" sonrası odak ilk yeni karta geçiyor.
3. tur: İşaretler tarayıcıda saklanıyor. Panel başlığı ilerlemeyi gösteriyor. Sayfa sonunda önceki ve sonraki faz bağlantıları var. Okuma genişliği 880 px ile sınırlı.
4. tur: Onay kutulu satırlar 44 px'ten yüksek. Alt gezinmedeki boş öğe kalktı.
5. tur: Yönerge grubu landmark değil. Bağlam etiketi açıklamalı.

### Düzeltemediklerim

1. Kodun içindeki uzun dosya yolları 320 px'te kelime ortasından bölünüyor. Bu davranış `tokens.css` içindeki `.md-inline code { overflow-wrap: anywhere }` kuralından gelir. Dosya orkestratörün. Kural bilinçli görünüyor, çünkü yollar sarılmazsa sayfa yatay taşar.
2. Kırıntıda sayfanın kendi adı artık görünmüyor. Bu değişiklik `AppShell.tsx` dosyasından geliyor. Dosya başka ajanın.
3. Faz düğmeleri 320 px'te üç satır kaplıyor. Yatay kaydırma şeridi daha az yer kaplar. Ancak sarma düzeni klavye ve ekran okuyucu için daha güvenlidir. Değiştirmedim.

### Açık istekler

- Hata rengi tokenı (`--color-danger`).
- Orkestratör commit'inin bu worktree'ye gelmesi.

### Okur denemesi

Gerçek okurla denenmedi.

## Kural güncellemesi, 18 Kasım 2026 Çarşamba

Orkestratör iki kuralı güncelledi. Test genişlikleri artık 320, 375, 768 ve 1280 px. 390 px listede yok. `tokens.css` artık her işaretçide en az 44 px hedef uyguluyor. Dokunmada hedef 48 px.

Buna göre şunları yaptım:

1. Kendi test dosyamda 390 genişliği yoktu. Testler proje adlarını orkestratörün ayarından alır. Geçici ayar dosyamdan `chromium-390` projesini kaldırdım.
2. `PhasePage.tsx` içindeki `minHeight: 44` değerlerini kaldırdım. Yönerge düğmeleri ve alt gezinme düğmeleri artık hedef boyutunu `tokens.css` dosyasından alır.
3. Onay kutulu satırlardaki 10 px dikey boşluğu kaldırdım. `tokens.css` artık `.ant-checkbox-wrapper` için 44 px hedef uyguluyor.
4. 4. turdaki iki değişiklik böylece geri alındı. Testler yerinde kaldı. Testler yalnız sonucu ölçer, kuralı tekrar yazmaz.

## Son test sonucu

Son tam takım 18 Kasım 2026 Çarşamba günü çalıştı. Komut, çalışan 4321 sunucusuna karşı 7 projede bütün test dosyalarını çalıştırdı.
935 test geçti. 36 test atlandı. Hiçbir test başarısız olmadı. Süre 6,1 dakika.
Atlanan testler başka ajanın yönerge test dosyasındadır. Benim dosyamda atlanan test yok.

Bir tip notu var. `npx tsc --noEmit` komutu benim test dosyamda `node:fs` ve `process` için tip hatası verir. Aynı hata `tests/site.spec.ts` dosyasında da vardır. Nedeni `tsconfig.json` içinde Node tiplerinin olmamasıdır. Bu durum önceden vardı. `@types/node` eklemek `package.json` değişikliği ister. O dosya orkestratörün.

### Kural güncellemesinden sonraki tam takım

Kural güncellemesinden sonra tam takım yeniden çalıştı. Proje sayısı 6 oldu, çünkü 390 px projesi kalktı.
1172 test geçti. 66 test atlandı. Hiçbir test başarısız olmadı. Süre 11,3 dakika.
Atlanan testler başka ajanların dosyalarındadır. Benim dosyamda atlanan test yok.

## 6. tur: tasarım yönü

`TASARIM-YONU.md` dosyasını okudum. Token katmanına dokunmadım. Yerleşimi ve yoğunluğu `PhasePage.tsx` içinde yeniden kurdum. Stil kuralları bileşenin içindeki bir `<style>` bloğundadır. Bütün değerler `tokens.css` değişkenlerinden gelir.

### Değiştirdiklerim

1. **Metin sütunu.** Sayfanın bütün içeriği `--measure` (68 karakter) genişliğinde bir sütundadır. Faz geçişi, başlık, görevler, epic listesi ve alt gezinme bu sütundadır. 1280 px'te sütun yaklaşık 600 px'tir. Geniş ekranda yanlarda boşluk kalır, satır uzamaz.
2. **Görev kartı kalktı, sıra numarası geldi.** Her görev artık kutusuz bir `<article>` öğesidir. Sol sütunda sıra numarası büyük ve sessiz durur. Numara `--text-h1` boyutunda, kalın ve soluk renktedir. Başlık numaranın yanındadır. Görevler birbirinden boşlukla ayrılır, çizgiyle değil. Kavisli kutu kenarına renkli çizgi yoktur. 320 px'te gövde numaranın altına tam genişlikte iner. 375 px ve üstünde gövde başlığın hizasında kalır.
3. **Paneller açıkken tarama.** Paneller `ghost` moddadır. Kenarlık ve dolgu yoktur. Panel başlığı orta ağırlıktadır. Madde satırları arasındaki çizgiler kalktı. Satır iç boşluğu 8 px oldu. Tek satırlık madde 44 px yüksekliğinde durur. Önceden 60 px'ti. Onay kutusu ilk satırla hizalıdır. Liste, panel başlığının sol kenarından başlar.
4. **Meta bilgiler tek satır.** Öncelik etiketi renk alanı olarak kaldı. "Sorumlu", "Bağlam" ve "Boyut" bilgileri 14 px soluk metindir. Hepsi tek satırda, boşlukla ayrılmış durur.
5. **Faz geçişi.** Yedi büyük düğme yerine tek satırda numara dizisi var: "Faz −1 0 1 2 3 4 5". Geçerli faz koyu ve altı çizilidir. Her bağlantının erişilebilir adı "Faz 0" gibi tam addır. Dizi 320 px'te tek satıra sığar.
6. **Sayfa başlığı.** "Faz 0" küçük ve soluk bir üst satır oldu. Faz adı büyük başlıktır. Sıra hissi tipografiyle kurulur.
7. **Yönerge bağlantıları.** Kutulu düğmeler yerine altı çizili metin bağlantılarıdır. Önlerinde soluk "İlgili yönergeler" etiketi vardır. Bağlantılar `ant-btn-link` olduğu için 44 px hedefi tokenlardan alır.
8. **Epic listesi.** Kartlar kalktı. Her epic bir `<article>` öğesidir. Başlık 18 px bağlantıdır. Meta tek satırdır. Epic'ler boşlukla ayrılır. Durum satırı 14 px soluk metindir.
9. **Alt gezinme.** "Sonraki faz" ana düğmedir. "Önceki faz" sessiz metin düğmesidir. "Hepsini göster" düğmesi de sessiz metin düğmesi oldu.
10. **Hata rengi.** "Yapmamanız gerekenler" simgesi artık `--kriz-fg` tokenını kullanır. Önceki sabit renk kalktı. Önceki turdaki `--color-danger` isteği böylece kapandı.

### Bıraktıklarım

1. "Kabul kriterleri" paneli açık başlar. Kabul kriterleri görevin asıl içeriğidir. Kapalı başlasa okur her görevde bir tık daha yapar.
2. "Epic'i kopyala" düğmesi sessiz çerçeveli düğme olarak kaldı. Epic'te tek eylem budur. Başlık bağlantısı içeriktir, düğme araçtır.
3. Faz geçişinde yalnız numaralar görünür. "Faz" kelimesi satır başında bir kez yazılır. Başlıkta tam ad zaten vardır.

### Testler

`tests/ux-fazlar.spec.ts` dosyasına beş test eklendi: sütun genişliği 68 karakteri aşmıyor, görev numarası büyük ve soluk ve kutu kenarlığı yok, açık panelde tek satırlık madde 52 px'i aşmıyor ve satır çizgisi yok, faz geçişi 320 px'te tek satır, meta bilgiler tek satır.
Epic kartı seçicileri `.ant-card-body` yerine `[data-epic-card]` oldu.
Kendi dosyam chromium-320 ve chromium-desktop üzerinde çalıştı. 32 test, 64 sonuç geçti.

### 6. tur sonrası tam takım

Tam takım 6 projede çalıştı. 1243 test geçti. 63 test atlandı. Hiçbir test başarısız olmadı. Süre 10,8 dakika.
Atlanan testler başka ajanların dosyalarındadır. Benim dosyamda atlanan test yok.
