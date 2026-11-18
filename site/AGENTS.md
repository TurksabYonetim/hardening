# İstoç mimari belgeleri sitesi

Bu site `../mimari/` klasöründeki raporları gösterir. Astro ve Ant Design ile yapıldı.

## Komutlar

- Veriyi üretmek için `npm run data` çalıştırın. Komut `../mimari/` klasörünü okur.
- Siteyi derlemek için `npm run build` çalıştırın.
- Derlenmiş siteyi açmak için `npm run preview` çalıştırın. Adres `http://localhost:4322` olur.
- Testleri çalıştırmak için `npm test` çalıştırın. Testler Chromium ve WebKit'te çalışır. Firefox kullanıcı kararıyla kapsam dışıdır.

## Kalıcı arayüz kararları

1. Görünür metin en az 14 CSS px olur. Gövde metni 16 px olur.
2. Köşe yarıçapı en çok 6 px olur. Yuvarlak ya da hap biçimli bileşen kullanılmaz. Örnek: `Badge`, `Avatar`, `Switch`, `Radio`, `Spin`.
3. Renkler yüksek kontrastlıdır. Değerler `src/styles/tokens.css` ve `src/lib/theme.ts` dosyalarındadır. İkisi birlikte değişir.
4. Yazı tipi Outfit'tir.
5. Hareket eğrisi `cubic-bezier(.65, 0, .35, 1)` olur. Azaltılmış hareket tercihinde geçişler kalkar.
6. Odakta çevreleyen halka yoktur. Yalnız Tab ve Shift+Tab klavye modunu açar. Klavye modunda odaklanan öğe sarı zemin ve alt çizgi alır.
7. Kenara renkli vurgu çizgisi eklenmez.
8. Açılır listeler Ant Design `Select` bileşenidir. Tarayıcının kendi listesi kullanılmaz.
9. Kanban durumu yalnız tarayıcının `localStorage` alanında saklanır.

Bu kararları `tests/site.spec.ts` testleri denetler. Yeni bileşen eklerseniz testleri çalıştırın.

## Veri kaynakları

- Fazlar ve faz görevleri `../mimari/_veri/faz_gorevleri.py` betiğinden gelir. Betik `faz-gorevleri.json` dosyasını üretir.
- Yönergeler `../mimari/YONERGELER/` klasöründen gelir.
- Her görevin kabul kriterlerinde "Characterization test:", "Shadow mode:" ve "TDD:" satırları zorunludur. `tests/site.spec.ts` bunu denetler.
- Kopyalanan her görev metninin sonuna ajan talimatı eklenir.
