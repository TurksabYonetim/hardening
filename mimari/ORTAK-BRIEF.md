# DocType architecture analysis: shared brief

You are one of 6 parallel analysts. Goal: for every DocType in your list, write one Markdown report and a concrete plan that moves it into a sustainable, low-coupled **modular monolith** inside Frappe v15. Read this whole brief before starting.

## The problem the owner described
- 4 remote developers commit and merge to the same repo every day.
- When one developer changes a feature or a DocType, other features and DocTypes break.
- Example: one builds "order", one builds "logistics", one builds the "tax engine". After an order, tax must be calculated automatically and the logistics workflow between buyer and seller must start. Today these pieces call each other directly and break each other.
- Target: each business area works like an independent module, with clear contracts, so developers can work in parallel without conflicts.

## Inputs
- Repo (read-only): `<tradehub_core deposunun yerel kopyası>` at `origin/version-15`. Ignore its `worktrees/` folder. Python package is `tradehub_core/`. App hooks: `tradehub_core/hooks.py`. Permissions: `tradehub_core/permissions.py`. Service code lives in many folders (`api/`, `api/v1/`, `logistics/`, `payments/`, `tax_core/`, `shared_sync/`, `bulk_import/`, `media/`, `seo*/`, `utils/`, `tradehub_core/utils/`, `eca/`, `tasks.py`).
- Inventory with fields, Link targets, child tables, controller size and the files that reference each DocType name: `mimari/_veri/envanter.json`.
- Context map (DocType to bounded context): `mimari/_veri/baglamlar.json`. Contexts: 01-kimlik-erisim, 02-satici-magaza, 03a-katalog, 03b-ice-aktarma, 03c-kesif, 04-siparis, 05-odeme, 06-vergi-fatura, 07-lojistik, 08-medya, 09-icerik-vitrin, 10-seo, 11-degerlendirme, 12-bildirim-iletisim, 13-uyum-gizlilik, 14-platform-cekirdek. If a DocType clearly belongs to another context, say so in its report and in your context README. Do not move it in the map.
- Your list: a TSV file named in your task (columns: context, DocType, folder).

## Hard rules
- READ ONLY. Never edit the repo, commit, push, open PRs or issues. Do not run the app, bench, migrations or tests.
- Every claim about current code needs `path:line` evidence. Mark unverified points as "doğrulanmadı".
- Do not invent fields or functions. Read the DocType JSON and its controller, and grep for the DocType name and its controller functions.
- Write only inside `mimari/`.

## Target architecture to plan against (Frappe-native modular monolith)
Use these building blocks. Recommend only what each DocType really needs. Procedural service functions are fine when they keep coupling low. Do not add classes or layers without a concrete reason.
1. **Bounded context = Frappe module + Python package.** Each context becomes its own Frappe module (`modules.txt`) and package, for example `tradehub_core/ordering/`, `tradehub_core/tax/`, `tradehub_core/logistics/`. DocType JSON `module` field matches the context.
2. **Public API per context.** Each context exposes `tradehub_core/<context>/api.py` (Python functions other contexts may call) and `contracts.py` (typed dicts or dataclasses for inputs and outputs). Other contexts never import its internals, never call `frappe.get_doc` on its DocTypes to write, and never write its tables with `frappe.db.set_value` or SQL. Reading through the public API is preferred. Direct read of another context's DocType is allowed only through a documented read model.
3. **Domain events instead of direct calls.** Cross-context reactions use events. Pattern: the owning context publishes an event (for example `order.confirmed`) into an **Outbox** DocType in the same transaction, a worker dispatches it with `frappe.enqueue` after commit, and subscribers in other contexts handle it idempotently (event id stored). Example chain: `order.confirmed` -> tax context calculates and stores tax lines -> publishes `order.tax_calculated` -> logistics context creates the shipment draft. `doc_events` in `hooks.py` may only call the owning context's own handlers or the event publisher.
4. **Links across contexts.** Keep Frappe `Link` fields across contexts only to stable aggregate roots (for example `Order`, `Listing`, `Admin Seller Profile`, `User`). No cross-context child table edits. Denormalized snapshot fields are allowed when they are documented as snapshots.
5. **Ownership and enforcement.** Each context gets a `CODEOWNERS` entry, its own tests folder, and an import rule checked in CI (for example `import-linter` contracts: `tradehub_core.<a>` must not import `tradehub_core.<b>.<internal>`). Patches live under the owning context.
6. **Controllers stay thin.** DocType controllers validate their own invariants only. Business workflows move into the context's service functions. Cross-context side effects in controllers are moved to events.
7. **Shared kernel is small.** Only truly shared things (money, currency, tenant and seller identity, i18n helpers, the event bus) live in `tradehub_core/shared/`.

## Output 1: one report per DocType
Path: `mimari/doctypes/<context>/<doctype-folder-name>.md` (folder name as in the repo, for example `order_item.md`).

Write in plain Turkish for a reader who needs reading support. Short sentences, one idea each, about 15 words at most. Subject first, verb last. Explain a technical term the first time it appears. No semicolons and no em dashes. Keep code, paths and names in backticks. Use exactly this structure:

```
# <DocType adı>

- Bağlam: <context>
- Tür: Ana kayıt / Alt tablo / Ayar (single) / Kayıt defteri (log)
- Klasör: `<folder>`
- Denetleyici: `<controller path>` (<satır> satır)
- Önerilen sahip bağlam: <context> (farklıysa nedenini yazın)

## Ne işe yarar?
<2-4 kısa cümle>

## Bugünkü bağımlılıklar
### Bu kaydın bağlandığı kayıtlar
- `<Link hedefi>` (<alan adı>): aynı bağlam / başka bağlam (<bağlam>)
### Bu kayda dokunan kod
- `<dosya:satır>`: okuyor / yazıyor / doc_event
### hooks.py kayıtları
- ...

## Bağımlılık sorunları
1. <sorun, kanıt `path:line`, hangi bağlamı bozabilir>
(Sorun yoksa "Önemli bir bağımlılık sorunu bulunmadı." yazın.)

## Hedef tasarım
- Sahip bağlam ve paket yolu
- Dışarıya açılan fonksiyonlar (`<context>/api.py`)
- Yayınladığı olaylar ve dinlediği olaylar
- Başka bağlamlara bağlantılar: kalacak Link alanları, okuma modeli, anlık görüntü alanları
- Denetleyicide kalacak doğrulamalar ve servise taşınacak iş kuralları

## Geçiş adımları
1. <küçük, tek başına birleştirilebilir adım>
(Her adım tek bir PR olacak kadar küçük olsun. Hangi adımın hangi adımdan önce gelmesi gerektiğini yazın.)

## Riskler ve testler
- <kırılabilecek akış ve eklenmesi gereken test>
```

For child tables (`istable`) and small settings or log DocTypes, keep the report short, but still fill every section.

## Output 2: one README per context
Path: `mimari/doctypes/<context>/README.md`. Same plain Turkish style. Sections:
1. Bağlamın amacı
2. DocType listesi (ana kayıtlar, alt tablolar, ayarlar)
3. Bağlamın dışa açık API'si (önerilen fonksiyon listesi)
4. Yayınlanan ve dinlenen olaylar (olay adı, veri alanları, kim dinler)
5. Bağlamlar arası en ağır 10 bağımlılık, kanıtla
6. Önerilen geçiş sırası (numaralı, PR boyutunda)
7. Başka bağlama taşınması gereken DocType'lar
8. Bu bağlamda paralel çalışacak geliştiriciler için kurallar

## Progress and finish
- After every 10 DocTypes, append a line to `mimari/_veri/ilerleme-<your worker id>.txt` with the time and count.
- Do every DocType in your list. Do not skip any. If you run low on context, finish the current report, write the progress file, and continue in the same session.
- At the end, check that the number of `.md` files you wrote (excluding README) equals the number of rows in your TSV. Write the final count to the progress file.
- If `runpane` is available, finish with `runpane report --state done --summary-file <your context README path>`.
