# Characterization test yönergesi

**Characterization test**, kodun bugün ne yaptığını kaydeden testtir. Kod yanlış çalışsa bile bugünkü sonucu kaydeder.

Kod taşımadan önce bu testler yazılır. Kod taşındıktan sonra aynı testler yine geçmelidir. Geçmiyorsa davranış kazara değişmiştir.

## Ne zaman yazılır?

- Her görevin ilk adımında yazılır.
- Kod değişmeden önce yazılır ve geçer.
- Görevin dokunduğu her akış için en az bir test yazılır.

## Nasıl yazılır?

1. Akışı seçin. Örnek: "Sepetten sipariş oluşturma."
2. Sabit test verisi hazırlayın. Veriyi `tests/factories.py` içindeki fonksiyonlarla üretin.
3. Saati sabitleyin. `time-machine` aracını kullanın.
4. Akışı çalıştırın.
5. Sonucu bir sözlüğe çevirin. Yalnız iş açısından önemli alanları alın. Örnek: durum, tutarlar, stok, oluşan kayıtlar.
6. Sonucu `syrupy` ile snapshot dosyasına kaydedin.
7. Testi iki kez çalıştırın. İki çalıştırma aynı sonucu vermeli.

## Örnek

```python
def test_sepetten_siparis_bugunku_davranis(snapshot, frozen_time):
	sepet = factories.sepet(urun_fiyati="100.00", adet=2, kdv=20)
	siparis = cart_api.create_order(sepet.name)
	assert ozet(siparis) == snapshot
```

## Kurallar

- Snapshot dosyasını elle düzenlemeyin.
- Snapshot değişirse PR açıklamasında nedenini yazın.
- Snapshot değişikliğini bağlamın sahibi onaylar.
- Rastgele değer, saat ve sıra snapshot'a girmez.
- Bilinen bir hata varsa snapshot hatalı sonucu kaydeder. Testin yanına issue numarasını yazın.

## Kabul ölçütü

- Görevin dokunduğu her akış için characterization test var.
- Testler değişiklikten önceki kodda geçti.
- Testler değişiklikten sonraki kodda da geçti.
- Snapshot değişikliği varsa sahibinin onayı var.
