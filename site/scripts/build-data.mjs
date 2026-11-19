// Mimari raporlarını (../mimari) okuyup sitenin kullandığı JSON verisini üretir.
// Kaynak Markdown dosyaları yalnız okunur.
import { readFileSync, writeFileSync, readdirSync, existsSync, mkdirSync } from "node:fs";
import { join, dirname, basename } from "node:path";
import { fileURLToPath } from "node:url";
import { marked } from "marked";
import sanitizeHtml from "sanitize-html";

const here = dirname(fileURLToPath(import.meta.url));
const SRC = process.env.MIMARI_DIR || join(here, "..", "..", "mimari");
const OUT = join(here, "..", "src", "data");
mkdirSync(OUT, { recursive: true });

const read = (p) => readFileSync(p, "utf-8");
// Raporları ajanlar yazar. HTML yalnız izin listesindeki etiketlerle sayfaya girer.
const SAFE = {
	allowedTags: ["p", "ul", "ol", "li", "strong", "em", "code", "pre", "a", "h2", "h3", "h4", "h5", "h6", "blockquote", "table", "thead", "tbody", "tr", "th", "td", "br", "hr", "del"],
	allowedAttributes: { a: ["href", "title"] },
	allowedSchemes: ["http", "https", "mailto"],
	allowedSchemesAppliedToAttributes: ["href"],
};
const clean = (html) => sanitizeHtml(html, SAFE);
/** Başlıkları sayfanın başlık sırasına uyacak kadar aşağı kaydırır. En üst düzey "minLevel" olur. */
const shiftHeadings = (md, minLevel) => {
	const levels = [...md.matchAll(/^(#{1,6})\s/gm)].map((m) => m[1].length);
	if (!levels.length) return md;
	const delta = Math.max(0, minLevel - Math.min(...levels));
	return md.replace(/^(#{1,6})(\s)/gm, (_, h, sp) => "#".repeat(Math.min(6, h.length + delta)) + sp);
};
const block = (md, minLevel = 3) => clean(marked.parse(shiftHeadings(md || "", minLevel)));
/** Satır içi Markdown'ı (`kod`, **kalın**) temizlenmiş HTML'e çevirir. */
const inline = (t) => clean(marked.parseInline(t || ""));
const warnings = [];

/** Markdown metnini başlık düzeyine göre bölümlere ayırır. */
export function splitSections(md, level) {
	const marker = "#".repeat(level) + " ";
	const out = [];
	let cur = null;
	for (const line of md.split("\n")) {
		if (line.startsWith(marker)) {
			if (cur) out.push(cur);
			cur = { title: line.slice(marker.length).trim(), body: [] };
		} else if (cur) {
			cur.body.push(line);
		}
	}
	if (cur) out.push(cur);
	return out.map((s) => ({ title: s.title, body: s.body.join("\n").trim() }));
}

/** "- Anahtar: değer" satırlarını sözlüğe çevirir. */
export function bulletMap(text) {
	const map = {};
	for (const line of text.split("\n")) {
		const m = line.match(/^-\s+([^:]+):\s*(.+)$/);
		if (m) map[m[1].trim()] = m[2].trim();
	}
	return map;
}

/** Madde, numaralı ya da onay kutulu liste öğelerini döndürür. Alt maddeler ve devam satırları öğeye eklenir. */
export function listItems(text) {
	const items = [];
	for (const line of text.split("\n")) {
		const top = line.match(/^(?:[-*]\s+(?:\[[ xX]\]\s+)?|\d+\.\s+)(.+)$/);
		if (top) {
			items.push(top[1].trim());
			continue;
		}
		const cont = line.match(/^\s+(?:[-*]\s+|\d+\.\s+)?(.+)$/);
		if (cont && items.length) items[items.length - 1] += " " + cont[1].trim();
	}
	return items;
}

const PRIORITIES = ["Kriz", "Kritik", "Acil", "Önemli", "Düşük"];
const normPriority = (p) => PRIORITIES.find((x) => (p || "").toLowerCase().startsWith(x.toLowerCase())) || "Önemli";
const normPhase = (p) => {
	const m = (p || "").match(/Faz\s*(\d)/i);
	return m ? `Faz ${m[1]}` : "Faz 4";
};

function parseDoctype(ctx, file) {
	const md = read(join(SRC, "doctypes", ctx, file));
	const title = (md.match(/^#\s+(.+)$/m) || [, basename(file, ".md")])[1].trim();
	const head = md.split(/\n## /)[0];
	const meta = bulletMap(head);
	const h2 = splitSections(md, 2);
	const get = (name) => h2.find((s) => s.title.toLowerCase().startsWith(name.toLowerCase()));
	const epicSec = get("Epic");
	let epic = null;
	if (epicSec) {
		const h3 = splitSections("\n" + epicSec.body, 3);
		const pick = (n) => h3.find((s) => s.title.toLowerCase().startsWith(n.toLowerCase()))?.body || "";
		const em = bulletMap(epicSec.body.split("\n### ")[0]);
		for (const k of ["Öncelik", "Faz", "Tahmini büyüklük"]) if (!em[k]) warnings.push(`${ctx}/${file}: "${k}" eksik`);
		epic = {
			name: em["Epic adı"] || `${title}: ${ctx} bağlamına taşıma`,
			priority: normPriority(em["Öncelik"]),
			phase: normPhase(em["Faz"]),
			size: em["Tahmini büyüklük"] || "Orta",
			story: pick("User story").replace(/\n+/g, " ").trim(),
			acceptance: listItems(pick("Kabul kriterleri")),
			donts: listItems(pick("Yapmamanız gerekenler")),
			checklist: listItems(pick("Kontrol listesi")),
		};
		epic.html = {
			story: inline(epic.story),
			acceptance: epic.acceptance.map(inline),
			donts: epic.donts.map(inline),
			checklist: epic.checklist.map(inline),
		};
	}
	if (!epicSec) warnings.push(`${ctx}/${file}: Epic bölümü yok`);
	const steps = listItems(get("Geçiş adımları")?.body || "");
	const slug = basename(file, ".md");
	return {
		id: `${ctx}/${slug}`,
		slug,
		ctx,
		title,
		meta,
		epic,
		steps,
		stepsHtml: steps.map(inline),
		sections: h2
			.filter((s) => s.title !== "Epic")
			.map((s) => ({ title: s.title, html: block(s.body, 3), md: s.body })),
		md,
	};
}

function parseContext(ctx) {
	const p = join(SRC, "doctypes", ctx, "README.md");
	const md = existsSync(p) ? read(p) : "";
	const title = (md.match(/^#\s+(.+)$/m) || [, ctx])[1].trim();
	const h2 = splitSections(md, 2);
	return {
		ctx,
		title,
		sections: h2.map((s) => ({ title: s.title, html: block(s.body, 3), md: s.body })),
		md,
	};
}

/** Faz kimliğini adres parçasına çevirir. "Faz -1" -> "faz-eksi-1". */
export const phaseSlug = (id) => id.toLowerCase().replace(" -", "-eksi-").replace(" ", "-");
const phaseLabel = (id) => id.replace("-", "−");

/** Fazlar ve faz görevleri ../mimari/_veri/faz-gorevleri.json dosyasından gelir. */
function parsePhases() {
	const md = read(join(SRC, "README.md"));
	const raw = JSON.parse(read(join(SRC, "_veri", "faz-gorevleri.json")));
	const phases = raw.map((f) => ({
		id: f.id,
		label: phaseLabel(f.id),
		slug: phaseSlug(f.id),
		title: f.ad,
		summary: f.ozet,
		tasks: f.gorevler,
	}));
	const linked = md.replace(/\]\(YONERGELER\/(\d\d-[\w-]+)\.md\)/g, "](/yonergeler/$1/)").replace(/\]\(FAZ-GOREVLERI\.md\)/g, "](/fazlar/faz-eksi-1/)");
	return { phases, overviewHtml: block(linked, 3), overviewMd: md };
}

/** Yönergeler: ../mimari/YONERGELER/*.md */
function parseGuides() {
	const dir = join(SRC, "YONERGELER");
	return readdirSync(dir)
		.filter((f) => f.endsWith(".md"))
		.sort()
		.map((f) => {
			const md = read(join(dir, f));
			const title = (md.match(/^#\s+(.+)$/m) || [, f])[1].trim();
			const body = md.replace(/^#\s+.+$/m, "").replace(/\]\((\d\d-[\w-]+)\.md\)/g, "](/yonergeler/$1/)");
			const first = body.split("\n").find((l) => l.trim() && !l.startsWith("#")) || "";
			return { slug: basename(f, ".md"), title, summary: inline(first), html: block(body, 2), md };
		});
}

const contexts = readdirSync(join(SRC, "doctypes"), { withFileTypes: true })
	.filter((d) => d.isDirectory())
	.map((d) => d.name)
	.sort();

const doctypes = [];
for (const ctx of contexts) {
	for (const f of readdirSync(join(SRC, "doctypes", ctx)).filter((f) => f.endsWith(".md") && f !== "README.md").sort()) {
		doctypes.push(parseDoctype(ctx, f));
	}
}
const ctxData = contexts.map(parseContext);
const { phases, overviewHtml, overviewMd } = parsePhases();

const guides = parseGuides();
const agentBrief = guides.find((g) => g.slug === "00-ajan-talimati")?.md || "";

/** Panodaki kartlar: her faz görevi ve her DocType epic'i bir görevdir. */
const tasks = [];
for (const ph of phases) {
	ph.tasks = ph.tasks.map((g) => {
		const task = {
			id: g.id,
			kind: "Faz görevi",
			phase: ph.id,
			ctx: "genel",
			title: g.baslik.replace(/`/g, ""),
			titleHtml: inline(g.baslik),
			priority: ph.id === "Faz -1" || ph.id === "Faz 0" ? "Acil" : "Önemli",
			owner: g.sahip,
			story: g.story,
			acceptance: g.kabul,
			donts: g.yapma,
			checklist: g.kontrol,
			guides: g.yonerge.map((y) => basename(y, ".md")),
			html: { acceptance: g.kabul.map(inline), donts: g.yapma.map(inline), checklist: g.kontrol.map(inline) },
			href: `/fazlar/${ph.slug}/#gorev-${g.id.split("/").pop()}`,
		};
		tasks.push(task);
		return task;
	});
}
for (const d of doctypes) {
	tasks.push({
		id: d.id,
		kind: "Epic",
		phase: d.epic?.phase || "Faz 4",
		ctx: d.ctx,
		title: d.epic?.name || `${d.title}: ${d.ctx} bağlamına taşıma`,
		titleHtml: inline(d.epic?.name || `${d.title}: ${d.ctx} bağlamına taşıma`),
		priority: d.epic?.priority || "Önemli",
		size: d.epic?.size,
		href: `/doctype/${d.ctx}/${d.slug}/`,
	});
}

const summary = doctypes.map(({ md, sections, ...rest }) => rest);
writeFileSync(join(OUT, "doctypes.json"), JSON.stringify(doctypes));
writeFileSync(join(OUT, "doctype-summary.json"), JSON.stringify(summary));
writeFileSync(join(OUT, "contexts.json"), JSON.stringify(ctxData));
writeFileSync(join(OUT, "phases.json"), JSON.stringify({ phases, overviewHtml, overviewMd }));
writeFileSync(join(OUT, "guides.json"), JSON.stringify(guides));
writeFileSync(join(OUT, "agent-brief.json"), JSON.stringify({ md: agentBrief }));
writeFileSync(join(OUT, "tasks.json"), JSON.stringify(tasks));

// --- Arama dizini ---
// Üst çubuktaki arama bu küçük dosyayı okur. Büyük veri dosyaları istemciye gitmez.
const aramaDizini = [
	...phases.flatMap((f) =>
		f.tasks.map((t) => ({ a: t.title, y: t.href, t: "Görev", e: f.label })),
	),
	...summary.map((d) => ({ a: d.title, y: `/doctype/${d.ctx}/${d.slug}/`, t: "DocType", e: d.ctx })),
	...ctxData.map((c) => ({ a: c.title, y: `/baglamlar/${c.ctx}/`, t: "Bağlam", e: c.ctx })),
	...guides.map((g) => ({ a: g.title, y: `/yonergeler/${g.slug}/`, t: "Yönerge", e: "" })),
	...phases.map((f) => ({ a: f.title, y: `/fazlar/${f.slug}/`, t: "Faz", e: f.label })),
];
writeFileSync(join(OUT, "search-index.json"), JSON.stringify(aramaDizini));

// --- Kanban verisi: hafif liste ve ayrı kopyalama metni ---
// Kanban sayfası önceden bütün tasks.json ve doctype-summary.json dosyasını
// adaya props olarak gönderiyordu. Bu, HTML'i 2,2 MB yapıyordu ve ilk
// boyamada ekran boş kalıyordu. Artık liste hafif, kopyalama metni ayrı
// bir parçada ve ada bağlandıktan sonra yükleniyor.
const fazEtiket = (id) => id.replace("-", "\u2212");
const madde = (baslik, ogeler, kutu = false) =>
	ogeler && ogeler.length ? `\n${baslik}:\n${ogeler.map((i) => (kutu ? `- [ ] ${i}` : `- ${i}`)).join("\n")}\n` : "";
const AJAN = `\n---\nAjan talimatı (her görevde zorunlu):\n\n${agentBrief.replace(/^# .+\n/, "").trim()}\n`;

/** src/lib/tasks.ts içindeki taskToText ile aynı metni üretir.
 *  İki yerin aynı kalması tests/site.spec.ts içindeki kopyalama testiyle korunur. */
function gorevMetni(task, doc) {
	const bas = [
		`Görev: ${task.title}`,
		`Kimlik: ${task.id}`,
		`Tür: ${task.kind}`,
		`Faz: ${fazEtiket(task.phase)}`,
		`Öncelik: ${task.priority}`,
		`Bağlam: ${task.ctx}`,
		`Repo: tradehub-tr/tradehub_core (dal: version-15)`,
	];
	if (!doc) {
		return (
			bas.join("\n") +
			(task.owner ? `\nSorumlu: ${task.owner}` : "") +
			`\nKaynak: mimari/FAZ-GOREVLERI.md\n` +
			(task.story ? `\nKullanıcı hikâyesi:\n${task.story}\n` : "") +
			madde("Kabul kriterleri", task.acceptance, true) +
			madde("Yapmamanız gerekenler", task.donts) +
			madde("Kontrol listesi", task.checklist, true) +
			madde("Yönergeler", (task.guides || []).map((g) => `mimari/YONERGELER/${g}.md`)) +
			AJAN
		);
	}
	const e = doc.epic;
	return (
		bas.join("\n") +
		`\nKaynak rapor: mimari/doctypes/${doc.id}.md\n` +
		(e && e.story ? `\nKullanıcı hikâyesi:\n${e.story}\n` : "") +
		madde("Kabul kriterleri", e && e.acceptance, true) +
		madde("Yapmamanız gerekenler", e && e.donts) +
		madde("Kontrol listesi", e && e.checklist, true) +
		madde("Geçiş adımları", doc.steps) +
		`\nKural: Bağlamlar birbirine yalnız api.py ve olaylarla ulaşır. Başka bağlamın iç dosyasına ve tablosuna yazmayın.\n` +
		AJAN
	);
}

const ozetHarita = new Map(summary.map((d) => [d.id, d]));
const kanbanListe = tasks.map((t) => ({
	id: t.id,
	kind: t.kind,
	phase: t.phase,
	ctx: t.ctx,
	title: t.title,
	titleHtml: t.titleHtml,
	priority: t.priority,
	href: t.href,
}));
const kanbanKopya = Object.fromEntries(tasks.map((t) => [t.id, gorevMetni(t, ozetHarita.get(t.id))]));
writeFileSync(join(OUT, "kanban-liste.json"), JSON.stringify(kanbanListe));
writeFileSync(join(OUT, "kanban-kopya.json"), JSON.stringify(kanbanKopya));
console.log("kanban: liste", kanbanListe.length, "kayıt, kopya metni", Object.keys(kanbanKopya).length, "kayıt");

console.log("arama dizini:", aramaDizini.length, "kayıt");

if (warnings.length) {
	console.warn(`UYARI: ${warnings.length} rapor eksik alan içeriyor:\n` + warnings.slice(0, 20).join("\n"));
	if (process.env.STRICT_DATA) process.exit(1);
}
console.log(`veri: ${guides.length} yönerge, ${doctypes.length} DocType, ${ctxData.length} bağlam, ${phases.length} faz, ${tasks.length} görev, epic'li ${doctypes.filter((d) => d.epic).length}`);
