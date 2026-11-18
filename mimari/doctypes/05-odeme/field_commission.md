# Field Commission

- Bağlam: 05-odeme
- Tür: Ana kayıt
- Klasör: `tradehub_core/tradehub_core/doctype/field_commission`
- Denetleyici: `tradehub_core/tradehub_core/doctype/field_commission/field_commission.py` (14 satır)
- Önerilen sahip bağlam: 02-satici-magaza. Kayıt saha satış temsilcisinin hakedişidir. Temsilci mağazalara abonelik paketi satar. Kayıt `CRM Deal` ve `Subscription Plan` kayıtlarına bağlıdır. Pazar yeri ödeme zinciriyle bağı yoktur.

## Epic

- Epic adı: Field Commission: 02-satici-magaza bağlamına taşıma
- Öncelik: Düşük
- Faz: Faz 4
- Tahmini büyüklük: Orta

### User story

Bir saha satış temsilcisi olarak, kazandığım fırsat için hakedişimin açılmasını istiyorum.
Böylece emeğimin karşılığını alırım.

### Kabul kriterleri

- [ ] Kod `stores/field_sales/` paketinde.
- [ ] `hooks.py:837` kaydı yeni yolu gösteriyor.
- [ ] Fırsat "Won" olunca tek hakediş açılıyor.
- [ ] Characterization test: `Field Commission` kaydının dokunulan her akışı için test yazıldı. Testler değişiklikten önce ve sonra geçti.
- [ ] Shadow mode: Yeni yol eski yolla birlikte çalıştı. En az 7 gün ve 500 işlemde `Shadow Mismatch Log` kaydı 0.
- [ ] TDD: Yeni davranışın testi önce başarısız oldu. Başarısız çıktı PR açıklamasında var.
- [ ] Feature flag: Yeni yol bir bayrağın arkasında. Bayrak kapalı başlıyor.

### Yapmamanız gerekenler

- Bu kaydı ödeme zinciriyle bağlamayın.
- Onaylı hakedişi değiştirmeyin.
- CRM uygulamasının kodunu düzenlemeyin.
- Testi olmayan kod yazmayın. Başarısız testi silmeyin ya da atlamayın.

### Kontrol listesi

- [ ] Hakediş testi geçiyor.
- [ ] Eski uç nokta adresleri çalışıyor.
- [ ] Mağaza ekibinden onay alındı.
- [ ] `ruff` kontrolü geçiyor.
- [ ] PR şablonunun her bölümü dolu. Ajan talimatı (`YONERGELER/00-ajan-talimati.md`) uygulandı.

## Ne işe yarar?
`Field Commission` saha satış temsilcisinin hakedişidir. Hakediş bir CRM fırsatı kazanılınca açılır. Tür satış, pay ya da kota bonusu olabilir. Hakediş önce lider, sonra süper yönetici onayından geçer.

## Bugünkü bağımlılıklar
### Bu kaydın bağlandığı kayıtlar
- `User` (`agent`): framework kaydı
- `CRM Deal` (`deal`): dış uygulama kaydı
- `Subscription Plan` (`plan`): başka bağlam (02-satici-magaza)
- `Currency` (`currency`): framework kaydı
- `Sales Team` (`team`): başka bağlam (01-kimlik-erisim)
- `User` (`team_leader`): framework kaydı
- `User` (`leader_approved_by`): framework kaydı
- `User` (`approved_by`): framework kaydı

### Bu kayda dokunan kod
- `tradehub_core/tradehub_core/utils/field_commission.py:154`: yazıyor (fırsat kazanılınca)
- `tradehub_core/tradehub_core/utils/field_commission.py:211`: yazıyor (kota bonusu)
- `tradehub_core/tradehub_core/utils/field_commission.py:207`: yazıyor (`db.set_value`)
- `tradehub_core/api/v1/field_commission.py:225`: yazıyor (onay)
- `tradehub_core/api/v1/field_commission.py:57`: okuyor
- `tradehub_core/api/v1/sales_team.py:226`: okuyor (ekip silme kontrolü)

### hooks.py kayıtları
- `hooks.py:837`: `CRM Deal.on_update` olayı `utils.field_commission.generate_on_deal_won` çağırır.
- `hooks.py:1140` ve `hooks.py:1266`: liste ve kayıt izni `permissions.py` içindedir.

## Bağımlılık sorunları
1. Kayıt ödeme bağlamında görünüyor ama ödeme koduyla bağı yok. Ödeme geliştiricisi bu kaydı yanlışlıkla sahiplenebilir.
2. CRM fırsatı olayı doğrudan hakediş fonksiyonuna bağlı (`hooks.py:837`). CRM uygulaması güncellenirse hakediş üretimi bozulabilir.

## Hedef tasarım
- Sahip bağlam: 02-satici-magaza. Paket yolu: `tradehub_core/stores/field_sales/`.
- Dışarıya açılan fonksiyonlar: `field_sales.api.list_commissions(agent, filters)` ve `field_sales.api.approve(name, level)`.
- Yayınladığı olaylar: `field_commission.approved`. Veri `commission`, `agent`, `amount`, `currency`.
- Dinlediği olaylar: `crm.deal_won`. Bu olay `CRM Deal` işleyicisinden yayınlanır.
- Denetleyicide kalacak doğrulama: `field_commission.py:9` içindeki kural.

## Geçiş adımları
1. 02-satici-magaza sahibiyle taşıma kararını onaylayın.
2. `utils/field_commission.py` ve `api/v1/field_commission.py` dosyalarını yeni pakete taşıyın. Eski yolda yönlendirme bırakın.
3. `hooks.py:837` kaydını yeni yola çevirin.

## Riskler ve testler
- Fırsat kazanılınca hakediş açılmayabilir. Test: fırsat "Won" olunca tek hakediş açılmalı.
