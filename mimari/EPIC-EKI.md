# Follow-up: turn every DocType report into an epic

The owner wants every DocType report to work as one **epic** in a task board. Update every report in your list. Keep all existing sections and evidence. Do not rewrite them.

Insert this block directly after the bullet list at the top of each report (before `## Ne işe yarar?`). Use exactly these headings, because a build script parses them:

```
## Epic

- Epic adı: <DocType adı>: <bağlam> bağlamına taşıma
- Öncelik: Kriz / Kritik / Acil / Önemli / Düşük
- Faz: Faz 0 / Faz 1 / Faz 2 / Faz 3 / Faz 4 / Faz 5
- Tahmini büyüklük: Küçük / Orta / Büyük

### User story

Bir <geliştirici / satıcı / alıcı / platform yöneticisi> olarak, <ne istiyorum>.
Böylece <ne kazanırım>.

### Kabul kriterleri

- [ ] <ölçülebilir, test edilebilir bir koşul>
- [ ] ...

### Yapmamanız gerekenler

- <bu DocType üzerinde çalışırken yapılmaması gereken somut bir şey ve kısa nedeni>
- ...

### Kontrol listesi

- [ ] <PR açmadan önce yapılacak somut bir kontrol>
- [ ] ...
```

## Rules for the content
- Priority: use `Kriz` only if a current bug causes money, data or customer loss now. Most migration epics are `Önemli` or `Acil`. The order, payment, tax and logistics core records (`Order`, `Order Item`, `Payment Intent`, `Shipment`, tax lines) are at least `Kritik`.
- Phase: follow the master plan in `mimari/README.md` section 5. Order, payment, tax and logistics DocTypes go to Faz 3. Other contexts go to Faz 4. Use Faz 5 only for module move steps if the epic is only that.
- User story: one or two sentences, real benefit, no jargon. Prefer the developer view ("Bir geliştirici olarak...") unless the DocType directly serves sellers, buyers or admins.
- Acceptance criteria: 3 to 6 items. Each must be checkable, for example "`Order` kaydını yalnız `ordering` paketi yazıyor. `import-linter` kontrolü geçiyor." Base them on this report's own "Hedef tasarım" and "Geçiş adımları".
- "Yapmamanız gerekenler": 3 to 6 items. Make them specific to this DocType and its evidence. Example: "`logistics/hooks.py` içinden `Order.status` alanına yazmayın. Sipariş durumunu yalnız sipariş bağlamı değiştirir." Also include general ones only when relevant: do not edit another context's child table, do not add new `doc_events` to `hooks.py` directly, do not call another context's internal module.
- Checklist: 4 to 8 items for before opening a PR, for example tests added, `import-linter` passes, patch is idempotent, `CODEOWNERS` reviewer requested, events have a contract test.
- Plain Turkish for a reader who needs reading support. Short sentences, one idea each. Subject first, verb last. No semicolons, no em dashes. Code names in backticks.

## Context README
Also add an `## Epic özeti` section at the end of each context README. List every epic in that context as a bullet: `- <DocType>: <Öncelik>, <Faz>, <Büyüklük>`.

## Finish
- Update every report in your TSV. Do not skip any.
- Then count reports that contain `## Epic`, `### User story`, `### Kabul kriterleri`, `### Yapmamanız gerekenler` and `### Kontrol listesi`. The count must equal your TSV row count. Append the result to your progress file `mimari/_veri/ilerleme-<worker id>.txt` with the line `EPIC: <n>/<total>`.
- Write only inside `mimari/`. Never touch the repo.
