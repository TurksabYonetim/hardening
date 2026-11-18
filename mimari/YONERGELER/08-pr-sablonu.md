# PR şablonu ve ekip disiplini yönergesi

Kurallar insan hafızasına bırakılmaz. Kuralları araçlar uygular. Bu yönerge hangi aracın hangi kuralı uyguladığını yazar.

## Kuralı uygulayan araçlar

| Kural | Aracı | Nerede |
|---|---|---|
| Test olmadan birleştirme yok | `diff-cover` ve zorunlu CI kontrolü | GitHub dal koruması |
| Bağlam sınırı | `import-linter`, `semgrep` | CI |
| Doğru kişi inceler | `CODEOWNERS` | GitHub |
| Metrik kötüleşmez | Ratchet betiği | CI |
| Olay sözleşmesi kırılmaz | Şema karşılaştırma | CI |
| Patch güvenli | Migration rehearsal | CI |
| PR şablonu dolu | PR denetleyici betik | CI |
| Mimari istisna kayıtlı | `architecture/exceptions.toml` | CI |

**Dal koruması:** `version-15` dalına yalnız bu kontroller geçince birleştirme yapılır. Kontrolleri yönetici bile atlayamaz. Bu ayarı Hüseyin Cengiz yapar.

## Mimari karar kaydı

Kuralın dışına çıkmak gerekirse bir **ADR** (Architecture Decision Record) yazılır. ADR, kararın nedenini ve süresini yazar. ADR dosyaları `docs/adr/` klasöründe durur. ADR olmadan istisna eklenemez.

## PR şablonu

`.github/pull_request_template.md` dosyası şu bölümleri içerir. CI, her bölümün dolu olduğunu kontrol eder.

```markdown
## Görev
<!-- Görevin kimliği ve kaynak rapor yolu. Örnek: 04-siparis/order -->

## Bağlam
<!-- Bu PR yalnız bir bağlamı değiştirir. Bağlamın adı. -->

## Characterization test
<!-- Test dosyası ve testin değişiklikten önce geçtiğini gösteren çıktı. -->

## TDD kırmızı adım
<!-- Yeni testin başarısız çıktısı. -->

## Shadow mode
<!-- shadow_compare adı ve geçiş koşullarının durumu. -->

## Feature flag
<!-- Bayrağın adı. Bayrak kapalı mı? -->

## Veritabanı değişikliği
<!-- Patch var mı? Expand, taşı ya da daralt adımlarından hangisi? Migration rehearsal sonucu. -->

## Metrikler
<!-- architecture/metrics.json farkı. -->

## Yapay zekâ kullanımı
<!-- Kod ajanla yazıldıysa ajan talimatının uygulandığını onaylayın. -->
```

## Ön yüz için ek kurallar

- API çağrıları üretilmiş TypeScript tipleriyle yazılır.
- API cevapları `zod` ile doğrulanır.
- Ana akışlar için Playwright uçtan uca testi vardır.
- Testler sahte sunucu olarak MSW kullanır. MSW, sözleşmedeki örnek verileri sunar.

## Kabul ölçütü

- PR şablonunun her bölümü dolu.
- Bütün zorunlu CI kontrolleri yeşil.
- `CODEOWNERS` onayı var.
