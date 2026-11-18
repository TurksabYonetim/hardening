# Yapay zekâ ajanı için zorunlu talimat

Bu talimat her göreve eklenir. Görevi bir yapay zekâ ajanına verirken bu metni de verin. Sitedeki "Kopyala" düğmesi bu talimatı görev metnine kendiliğinden ekler.

## Ajan şu sırayla çalışır

1. Görevin kaynak raporunu okuyun.
2. Rapordaki iddiayı kodda bulun. İddia kodda yoksa durun ve bunu yazın.
3. Bugünkü davranışı kaydeden **characterization test** yazın. Testi çalıştırın. Test geçmeli.
4. Yeni davranış için bir test yazın. Testi çalıştırın. Test başarısız olmalı.
5. Başarısız test çıktısını PR açıklamasına ekleyin.
6. Testi geçirecek en küçük kod değişikliğini yapın.
7. Bütün testleri çalıştırın. Hepsi geçmeli.
8. Yeni yolu **shadow mode** içinde ekleyin. Eski yol kullanıcıya sonuç vermeye devam etsin.
9. Yeni yolu bir **feature flag** arkasına koyun. Bayrak kapalı başlasın.
10. PR açıklamasını [PR şablonuna](08-pr-sablonu.md) göre doldurun.

## Ajan şunları yapmaz

- Testi olmayan kod yazmaz.
- Başarısız bir testi silmez, atlamaz ya da gevşetmez.
- Bir PR'da birden fazla bağlamı değiştirmez.
- Başka bağlamın tablosuna `frappe.db.set_value`, `frappe.db.sql` ya da `doc.save()` ile yazmaz.
- `hooks.py` dosyasına doğrudan kayıt eklemez.
- Canlı veritabanına bağlanmaz. Patch'i canlıda çalıştırmaz.
- Feature flag'i kendisi açmaz.
- Bir kontrolü geçmek için kontrolün ayarını değiştirmez.

## Ajan şu durumlarda durur ve insana sorar

- Rapordaki iddia kodda bulunamadıysa.
- Characterization test bugünkü davranışı kaydedemiyorsa.
- Değişiklik iki bağlamı birden gerektiriyorsa.
- Değişiklik veritabanından veri silmeyi gerektiriyorsa.
- Bir metrik [metrik yönergesindeki](07-metrikler.md) sınırı aşıyorsa.

## Terimler

- **Characterization test:** Kodun bugün ne yaptığını kaydeden test. Kod yanlış çalışsa bile bugünkü sonucu kaydeder. Amacı, değişiklikten sonra davranışın kazara değişmediğini göstermektir.
- **Shadow mode:** Yeni kodun eski kodla aynı anda çalışması. Kullanıcı yalnız eski kodun sonucunu görür. Sistem iki sonucu karşılaştırır ve farkı kaydeder.
- **Feature flag:** Yeni kodu açıp kapatan anahtar. Sorun çıkarsa kod geri alınmadan anahtar kapatılır.
- **TDD (Test Driven Development):** Önce test, sonra kod. Test önce başarısız olur. Sonra kod testi geçirir.
