# Design direction (round 6)

The owner looked at the site and said it is bad. They are right. The five passes fixed rule compliance, not the look. This file says what the site should look like. Read it with `UX-BRIEF.md`, which still holds the hard rules.

The design-system layer (`tokens.css`, `theme.ts`) was rewritten by the orchestrator. The blue chrome bar is gone, the palette is ink-based, the type scale has real steps, tags are flat and quiet, the primary button is ink. You do not need to fix any of that.

What is still wrong is **composition**, and composition lives in your files.

## The idea

This is a field manual for a dangerous migration, not a SaaS dashboard. The reader is an engineer on a phone or a worried owner. The page must feel calm, dense and precise.

Three rules follow from that:

1. **Content, not chrome.** The reader came for tasks, phases and reports. Everything else is in the way.
2. **Space separates, boxes do not.** A border is for a form field, a table grid or a selected state. Nothing else.
3. **Sequence is visible.** This plan is ordered. The eye should feel the order without reading.

## Concrete problems to fix

### 1. Text runs the full window width
At 1280 px a paragraph is over 1800 px wide. That is unreadable. Constrain the reading column to about 68 characters. Wide screens get air on the side, not longer lines. Tables, the kanban board and code blocks may use the full width; prose must not.

### 2. Nothing is visible above the fold on a phone
On `/kanban/` at 375 px the reader sees a title, a six-line paragraph, three filters and four status tiles before the first task. Cut the explanation to one short sentence. Move the rest behind a quiet "Nasıl çalışır?" disclosure. Collapse the filters into one row. The first task must be visible without scrolling.

### 3. Equal weight everywhere
Search box, filter, status tile, task card and action button all look like the same rounded rectangle. Rank them. A task card is the content; a filter is a tool; a status count is a label. They must not look alike.

### 4. Sequence is not expressed
Phases run from −1 to 5 but the list reads as seven unrelated links with an arrow far away on the right. Lead each phase with its number set large and muted, put the title next to it, and keep the whole row clickable. Do not draw a coloured line down the side of a rounded box; that pattern is forbidden. Use type size and weight for the step feeling.

### 5. Counters that say nothing
"326 DocType / 16 bağlam / 373 görev / 326 epic" has two identical numbers and no meaning. Either show progress that changes as work is done, or drop the block.

### 6. Two equal buttons per card
"Kopyala" and "Aç" sit side by side with the same visual weight. One action is primary. Make the second one a quiet text link.

### 7. Metadata takes too many lines
Priority, phase, kind and context each take their own line or their own chip row. Put them on one line, small, separated by space. Use the priority tint only; the rest can be plain muted text.

## What not to do

- Do not add a new library, a new font or an icon set.
- Do not add animation that delays information.
- Do not shrink text or touch targets to fit. The limits are 14 px and 44 px.
- Do not edit `tokens.css` or `theme.ts`. Ask in your notes file instead.
- Do not add decorative borders, gradients, shadows on everything or coloured left edges.
- Do not make a wide screen into a wall of text; use the reading column.

## This round

One more full pass over your scope with this direction. Then:

1. Run `npm run test:dev`.
2. Append a section `## 6. tur: tasarım yönü` to your notes file: what you changed and what you left.
3. Stop. Do not commit.
