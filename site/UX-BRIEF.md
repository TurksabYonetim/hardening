# UX improvement brief (shared)

You are one of 6 agents improving the UX of a published documentation site. You all share ONE git worktree. Read this whole brief before touching anything.

Live site: https://turksabyonetim.github.io/hardening/
Local dev server (already running, do NOT start your own): http://localhost:4321/

## What the site is

An Astro 7 + React 19 + Ant Design 6 static site. It holds the plan for migrating a Frappe v15 application to a modular monolith: 7 phases, 47 phase tasks, 326 DocType epics, 16 bounded contexts, 9 guides. Readers are 4 remote developers and a non-technical owner. Most reading happens on a phone.

## Your job: 5 passes

Do FIVE complete passes over your scope. Not one. Each pass:

1. **Look.** Open every page in your scope in the browser at 320, 375, 768 and 1280 CSS px. 320 comes first and is non-negotiable. Do not test 390. Look at every element, every component, every block, every section, one by one. Use the running dev server.
2. **List.** Write down what is wrong or weak. Be specific: which element, which width, what exactly is bad.
3. **Fix.** Change only the files you own (below).
4. **Prove.** Run `npm run test:dev` and make sure nothing broke.
5. **Record.** Append what you changed to `ux-notlar/<your-scope>.md`.

Then start the next pass with fresh eyes. Later passes should find subtler things than the first: rhythm, hierarchy, scan-ability, wording, empty states, long-content behaviour, keyboard flow.

Do not stop after one pass. Five.

## File ownership — NEVER edit a file you do not own

Your scope and your files are given in your own task message. Other agents are editing the other files at the same time. If you touch their files, you destroy their work.

Nobody edits these — they are owned by the orchestrator:
- `src/styles/tokens.css`
- `src/lib/theme.ts`
- `playwright.config.ts`
- `package.json`
- `scripts/build-data.mjs`

If you need a new design token, a theme change or a data-shape change, DO NOT make it. Write the request in `ux-notlar/<your-scope>.md` under a heading `## İstekler` with: what you need, why, and which element needs it. The orchestrator reads these between passes.

## Tests

- Write your own test file: `tests/ux-<your-scope>.spec.ts`. Never edit `tests/site.spec.ts` or another agent's test file.
- Run tests with `npm run test:dev` (it uses the shared dev server; do NOT run `npm run build` or `npm run test`, they would clash with the other agents).
- `tests/site.spec.ts` has 357 passing tests. If your change breaks one, you broke a rule — fix your change, do not weaken the test.

## Hard UI rules — a change that violates one of these is wrong, however good it looks

1. **Minimum text size 14 CSS px.** Body text is 16. Nothing readable may be smaller than 14.
2. **Maximum border radius 6px.** No round or pill-shaped components. No `Badge`, `Avatar`, `Switch`, `Radio`, `Spin` with default round shapes.
3. **No surrounding focus ring, in any colour, for any input method.** Keyboard focus must stay visible through the existing non-surrounding indicator (yellow background + underline). Only Tab and Shift+Tab turn keyboard mode on.
4. **No coloured accent line on the edge of a rounded box.** A straight accent line is allowed only if the corners it touches are square.
5. **Motion:** `cubic-bezier(.65, 0, .35, 1)`, positive duration both directions, no `transition: all`, and transitions disappear under `prefers-reduced-motion: reduce`.
6. **Dropdowns are Ant Design `Select`.** Never a native `<select>`.
7. **Font is Outfit.** Do not add another font.
8. **Mobile first.** 320 px must work: no horizontal page overflow, touch targets at least 44 px, no mid-word breaks in the first table column.
9. **High contrast.** Text on its background must be clearly readable. Prefer the existing tokens.
10. **Turkish text** follows the project rules: short sentences, one idea each, subject first and verb last, everyday words, no semicolons, no em dashes. Code and paths stay in backticks.

## Git rules

- **Do not commit. Do not push. Do not switch branches. Do not create branches.**
- The orchestrator reviews, tests and commits everything at the end.
- Do not run `git add`, `git stash`, `git checkout` or `git restore` — another agent's uncommitted work is in the same worktree and you would destroy it.

## What good looks like

Prefer changes that make the page easier to read and act on:
- clear visual hierarchy, so the eye finds the next action without reading everything
- consistent spacing rhythm instead of ad-hoc margins
- fewer boxes; use space and type weight to separate things
- shorter, plainer Turkish labels
- helpful empty, loading and error states
- long content that wraps and scrolls correctly instead of overflowing
- a keyboard path that reaches everything in a sensible order

Avoid: decoration for its own sake, new libraries, new fonts, animation that delays information, and anything that only looks good at desktop width.

## When you finish all five passes

Write a final summary at the end of `ux-notlar/<your-scope>.md`:
- what you changed, pass by pass
- what you could not fix and why
- any token or theme request still open
- the result of your last `npm run test:dev`

Then stop. Do not commit.
