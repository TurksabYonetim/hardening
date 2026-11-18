# hardening

`tradehub_core` uygulamasını modüler monolit yapıya taşıma planı. Plan fazlara ve görevlere bölünmüştür.

Site adresi yayından sonra buraya eklenecek.

## Bu depoda ne var?

| Klasör | İçerik |
|---|---|
| `mimari/README.md` | Genel plan. Sorunun nedenleri, hedef mimari ve hardening önlemleri. |
| `mimari/YONERGELER/` | 9 yönerge. TDD, characterization test, shadow mode, metrikler ve PR kuralları. |
| `mimari/FAZ-GOREVLERI.md` | 47 faz görevi. Faz −1'den Faz 5'e. |
| `mimari/doctypes/` | 326 DocType raporu ve 16 bağlam planı. |
| `site/` | Astro ve Ant Design ile yapılmış belge sitesi. |

## Her görevde zorunlu dört kriter

1. **Characterization test:** Bugünkü davranış testle kaydedilir.
2. **Shadow mode:** Yeni yol eski yolla birlikte çalışır. Fark 0 olmalıdır.
3. **TDD:** Test önce başarısız olur, sonra geçer.
4. **Feature flag:** Yeni yol kapalı başlar.

## Siteyi yerelde çalıştırma

```bash
cd site
npm ci
npm run dev
```

Derleme ve test:

```bash
cd site
npm run build
npm test
```

Testler Chromium ve WebKit ile çalışır. Firefox kapsam dışıdır.

## Yayın

`main` dalına her push GitHub Pages yayınını tetikler. İş akışı `.github/workflows/pages.yml` dosyasındadır.
