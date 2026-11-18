# Order Approval Log

- Bağlam: 04-siparis
- Tür: Alt tablo
- Klasör: `tradehub_core/tradehub_core/doctype/order_approval_log`
- Denetleyici: `tradehub_core/tradehub_core/doctype/order_approval_log/order_approval_log.py` (8 satır)
- Önerilen sahip bağlam: 04-siparis, `ordering/procurement/` alt paketi

## Epic

- Epic adı: Order Approval Log: 04-siparis bağlamına taşıma
- Öncelik: Düşük
- Faz: Faz 3
- Tahmini büyüklük: Küçük

### User story

Bir geliştirici olarak, onay adımlarının değiştirilemez bir iz bırakmasını istiyorum.
Böylece denetimde kimin onay verdiği bellidir.

### Kabul kriterleri

- [ ] Satır `Order Approval` ile aynı pakette.
- [ ] Var olan satır değiştirilmek istenince hata veriliyor.
- [ ] Her onay ve ret bir satır yazıyor.
- [ ] Characterization test: `Order Approval Log` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- Var olan log satırını güncellemeyin. Yeni satır ekleyin.
- Satırı ana kayıt dışında yazmayın. Yazım `approval_workflow` servisindedir.
- Satırı temizlik işiyle silmeyin. Denetim izi kaybolur.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] Değişmezlik testi eklendi.
- [ ] Onay akışı testleri geçiyor.
- [ ] `ruff` kontrolü geçiyor.
- [ ] `CODEOWNERS` sahibinden inceleme istendi.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?
`Order Approval Log` onay sürecinin adım kaydıdır. Her satır onaycıyı, zamanı ve kararı tutar. Karar onay, ret, yükseltme ya da süre aşımı olabilir.

## Bugünkü bağımlılıklar
### Bu kaydın bağlandığı kayıtlar
- `User` (`approver`): framework kaydı

### Bu kayda dokunan kod
- `tradehub_core/services/approval_workflow.py:256`: yazıyor (satır ekler)
- `tradehub_core/setup/handover_validator.py:101`: okuyor (kurulum denetimi)

### hooks.py kayıtları
- Kayıt yok.

## Bağımlılık sorunları
Önemli bir bağımlılık sorunu bulunmadı.

## Hedef tasarım
- Sahip bağlam: 04-siparis. Paket yolu: `tradehub_core/ordering/procurement/`.
- Dışarıya açılan fonksiyon yoktur. Satırlar `Order Approval` ile okunur.
- Olay yoktur.
- Denetleyicide kalacak doğrulama: satır yazıldıktan sonra değişmemeli. Bu kural bugün yok, eklenmesi önerilir.

## Geçiş adımları
1. `Order Approval` ile aynı PR içinde taşıyın.

## Riskler ve testler
- Denetim izi değiştirilebilir. Test: var olan satır değiştirilmek istenince hata vermeli.
