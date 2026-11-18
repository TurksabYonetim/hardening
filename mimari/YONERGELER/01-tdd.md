# TDD yönergesi

**TDD (Test Driven Development)** bu projede zorunludur. Testi olmayan PR birleştirilmez. Bu kuralı CI uygular.

## Her davranış değişikliğinde sıra

1. **Kırmızı:** Yeni davranış için bir test yazın. Testi çalıştırın. Test başarısız olmalı.
2. **Yeşil:** Testi geçirecek en küçük kodu yazın. Testi çalıştırın. Test geçmeli.
3. **Temizlik:** Kodu düzenleyin. Bütün testler yine geçmeli.

Kırmızı adımın çıktısını PR açıklamasına yapıştırın. Çıktı yoksa PR incelenmez.

## Hata düzeltmede sıra

1. Hatayı gösteren bir test yazın.
2. Testi `xfail` olarak işaretleyin. `xfail` şu demektir: "Bu test bugün başarısız. Bu bilinen bir hata."
3. Testin içine issue numarasını yazın. Örnek: `# tradehub-tr/tradehub_core#370`.
4. Hatayı düzeltin.
5. `xfail` işaretini kaldırın. Test artık normal geçmeli.

CI şunu kontrol eder: `xfail` testi beklenmedik biçimde geçerse uyarı verir. Bu, hatanın başka bir değişiklikle düzeldiğini gösterir.

## Test türleri ve yerleri

| Tür | Ne zaman | Yer |
|---|---|---|
| Birim testi | Saf iş kuralı. Veritabanı yok. | `tradehub_core/<bağlam>/tests/unit/` |
| Entegrasyon testi | DocType, veritabanı ve olay birlikte | `tradehub_core/<bağlam>/tests/integration/` |
| Characterization test | Bugünkü davranışı kaydetmek | `tradehub_core/tests/characterization/` |
| Sözleşme testi | Olayın ve API'nin biçimi | `tradehub_core/<bağlam>/tests/contract/` |
| Property-based test | Kural her girdide doğru mu | `tradehub_core/<bağlam>/tests/property/` |
| Uçtan uca test | Gerçek tarayıcıda ana akış | `tradehubfront/tests/e2e/` |

## Kullanılacak araçlar

- `pytest`: Testleri çalıştırır.
- `hypothesis`: Property-based test üretir. Örnek: "Her sepet için brüt tutar, net tutar ile verginin toplamıdır."
- `syrupy`: Snapshot testi yapar. Characterization test çıktısını dosyada saklar.
- `time-machine`: Testte saati sabitler.
- `diff-cover`: Yalnız değişen satırların test kapsamını ölçer.
- `mutmut`: Testlerin hatayı gerçekten yakalayıp yakalamadığını ölçer. Bu yönteme **mutation testing** denir.

Araç sürümlerini projenin Python sürümüne göre doğrulayın. Sürümleri `pyproject.toml` dosyasına sabitleyin.

## Kabul ölçütü

Bir PR şu durumda TDD kuralına uyar:

- Değişen her davranış için en az bir yeni test var.
- Kırmızı adımın çıktısı PR açıklamasında var.
- Değişen satırların test kapsamı en az %90.
- Hiçbir test silinmedi ya da atlanmadı.
