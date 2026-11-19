import { useEffect, useMemo, useRef, useState } from "react";
import { Button, Checkbox, Collapse, Flex, Select, Typography } from "antd";
import { CloseSquareFilled } from "@ant-design/icons";
import { AppShell } from "./AppShell";
import { CopyButton, DuzListe, Inline, PriorityTag } from "./bits";
import { ctxLabel, taskToText, type DoctypeSummary, type Phase, type Task } from "../lib/tasks";
import { url } from "../lib/base";
import { loadChecks, saveChecks } from "../lib/checks";

type GuideRef = { slug: string; title: string };
type PhaseLink = { id: string; label: string; slug: string };
type EpicRow = { task: Task; doc: DoctypeSummary };

/** Uzun epic listeleri bu adımla açılır. Faz 4'te 218 epic vardır. */
const EPIC_STEP = 20;
/** Yapışkan üst çubuğun yüksekliği (56px) ve biraz nefes payı. */
const ANCHOR_OFFSET = 72;

/* Yerleşim ve yoğunluk. Değerler tokens.css'ten gelir, burada sabit sayı yoktur.
   İlke: ayrımı boşluk ve tipografi kurar, kutu ve kenarlık değil. Sıra numarası büyük ve sessizdir. */
/** Her fazın kendi rengi vardır. Değerler tokens.css ile aynıdır. */
const FAZ_RENK: Record<string, string> = {
	"Faz -1": "var(--faz-eksi1)",
	"Faz 0": "var(--faz-0)",
	"Faz 1": "var(--faz-1)",
	"Faz 2": "var(--faz-2)",
	"Faz 3": "var(--faz-3)",
	"Faz 4": "var(--faz-4)",
	"Faz 5": "var(--faz-5)",
};

const FAZ_CSS = `
/* Faz başlığı: renk alanı solda, yazı sağda. Sayfanın grafik anı budur. */
.faz-bas { display: grid; grid-template-columns: auto minmax(0, 1fr); column-gap: var(--space-4); align-items: start; }
.faz-bas > div, .faz-bas [data-faz-rakam] { position: relative; z-index: 1; }
.faz-bas [data-faz-rakam] { width: 80px; height: 80px; font-size: 36px; }
@media (max-width: 480px) { .faz-bas { grid-template-columns: 1fr; row-gap: var(--space-3); } .faz-bas [data-faz-rakam] { width: 56px; height: 56px; font-size: 26px; } }
.faz-bas h1.ant-typography { max-width: 18ch; }

.faz { max-width: var(--measure); }
@media (min-width: 1024px) {
	.faz-duzen { display: grid; grid-template-columns: minmax(0, 1fr) 272px; column-gap: var(--space-12); align-items: start; }
	.faz { max-width: 680px; }
	.faz-ray { position: sticky; top: calc(56px + var(--space-6)); }
}
.faz-ray { display: none; }
@media (min-width: 1024px) { .faz-ray { display: block; } }
/* Ray tek bir modüldür. Üç ayrı kutu yerine bir yüzey ve içinde bölümler. */
.faz-ray { background: var(--bg-sunken); border-radius: var(--radius-md); padding: var(--space-4); }
.faz-ray section + section { margin-top: var(--space-4); padding-top: var(--space-4); border-top: 1px solid var(--color-hairline); }
.faz-ray h2 {
	font-size: var(--text-eyebrow) !important;
	font-weight: var(--weight-strong) !important;
	letter-spacing: var(--track-eyebrow);
	color: var(--color-text-muted) !important;
	margin: 0 0 var(--space-3) !important;
}
/* Sayı satırı: etiket solda, rakam sağda. Aynı hizada, aynı sırada. */
/* Etiket solda, rakam sağda. İkisi aynı satırda ve hizalı durur. */
.faz-ray dl { display: grid; grid-template-columns: 1fr auto; gap: var(--space-2) var(--space-3); align-items: baseline; margin: 0; }
.faz-ray dt { margin: 0; font-size: var(--text-small); color: var(--color-text-muted); }
.faz-ray dd {
	margin: 0;
	font-size: var(--text-lead);
	font-weight: var(--weight-strong);
	line-height: 1.2;
	color: var(--color-text-strong);
	font-variant-numeric: tabular-nums lining-nums;
}
.faz-ray ul { list-style: none; margin: 0; padding: 0; }
/* Ray bağlantısı mavi değildir. Etkileşim zemini değiştirir. */
.faz-ray li + li { margin-top: 2px; }
.faz-ray a {
	display: block;
	padding: var(--space-2);
	margin-inline: calc(var(--space-2) * -1);
	border-radius: var(--radius-sm);
	font-size: var(--text-small);
	line-height: 1.35;
	color: var(--color-text) !important;
	text-decoration: none !important;
	transition-property: background-color;
	transition-duration: var(--motion-fast);
	transition-timing-function: var(--motion-ease);
}
.faz-ray a:hover { background: var(--color-surface-strong); }
.faz-ray a[aria-current="page"] { background: var(--color-ink); color: #ffffff !important; font-weight: var(--weight-medium); }
.faz-ray [data-ray-faz] { display: flex; align-items: center; gap: var(--space-2); }
.faz-ray [data-ray-nokta] { width: 10px; height: 10px; border-radius: 2px; flex: 0 0 auto; }
.faz-switch { display: flex; flex-wrap: wrap; align-items: center; gap: var(--space-1); margin-bottom: var(--rhythm-block); }
.faz-switch-label { font-size: var(--text-small); color: var(--color-text-muted); letter-spacing: var(--track-meta); margin-inline-end: var(--space-1); }
.faz-switch .ant-btn { padding-inline: var(--space-2); min-width: calc(var(--space-6) + var(--space-3)); font-size: var(--text-body); font-weight: var(--weight-medium); color: var(--color-text-muted); font-variant-numeric: tabular-nums; border-radius: var(--radius-sm); }
.faz-switch .ant-btn:hover { background: var(--bg-sunken) !important; color: var(--color-text) !important; }
/* Seçili faz dolu bir blok olur. Geçici hover durumu kalıcı seçimden güçlü olamaz. */
/* Seçili faz dolu blok olur. Üzerine gelince ve basılınca da cevap verir. */
.faz-switch .ant-btn[aria-current="page"] { background: var(--color-ink) !important; color: #ffffff !important; font-weight: var(--weight-strong); text-decoration: none; }
.faz-switch .ant-btn[aria-current="page"]:hover { background: var(--durum-ink-hover) !important; color: #ffffff !important; }
.faz-switch .ant-btn[aria-current="page"]:active { background: var(--durum-ink-basili) !important; color: #ffffff !important; }
.faz-eyebrow { display: block; align-items: center; gap: var(--space-2); font-size: var(--text-eyebrow); font-weight: var(--weight-strong); color: var(--color-text-muted); letter-spacing: var(--track-eyebrow); margin-bottom: var(--space-3); }
.faz-eyebrow [data-faz-rozet] { letter-spacing: 0; }
.faz-lead { font-size: var(--text-lead); line-height: var(--leading-body); margin: 0 0 var(--space-6); }
.faz-h2 { margin: var(--space-6) 0 var(--space-3) !important; }

.gorev { display: grid; grid-template-columns: auto minmax(0, 1fr); column-gap: var(--space-3); row-gap: var(--space-3); scroll-margin-top: ${ANCHOR_OFFSET}px; }
.gorev + .gorev { margin-top: var(--rhythm-section); padding-top: var(--rhythm-block); border-top: 1px solid var(--color-hairline); }
.gorev-num {
	align-self: start;
	margin-top: 3px;
	display: inline-flex;
	align-items: center;
	justify-content: center;
	min-width: 24px;
	height: 24px;
	padding-inline: 5px;
	border-radius: var(--radius-xs);
	background: var(--faz-renk, var(--color-ink));
	color: var(--color-ink);
	font-size: var(--text-small);
	font-weight: var(--weight-strong);
	font-variant-numeric: tabular-nums lining-nums;
	line-height: 1;
}
.gorev-title { margin: 0 !important; font-size: var(--text-h3) !important; line-height: var(--leading-h3) !important; letter-spacing: var(--track-h3); align-self: center; }
.gorev-body { grid-column: 2; display: flex; flex-direction: column; gap: var(--space-3); min-width: 0; }
@media (max-width: 374px) { .gorev-body { grid-column: 1 / -1; } }
.gorev-meta { display: flex; flex-wrap: wrap; align-items: center; gap: var(--space-1) var(--space-3); font-size: var(--text-small); color: var(--color-text-muted); letter-spacing: var(--track-meta); }
.gorev .story { font-size: var(--text-body); padding: var(--space-3) var(--space-4); background: var(--bg-sunken); border-radius: var(--radius-md); }

.gorev .ant-collapse-ghost > .ant-collapse-item > .ant-collapse-header { padding-inline: 0; font-weight: var(--weight-medium); align-items: center; }
.gorev .ant-collapse-ghost .ant-collapse-body,
.gorev .ant-collapse-ghost .ant-collapse-content-box { padding: 0 0 var(--space-2) !important; }
.gorev .ant-list-item { padding: 0 !important; border-block-end: none !important; }
.gorev .ant-checkbox-wrapper { padding-block: var(--space-2); align-items: flex-start; }
.gorev .ant-checkbox-wrapper .ant-checkbox { align-self: flex-start; margin-top: 3px; }
.gorev-dont { display: flex; gap: var(--space-2); align-items: flex-start; padding-block: var(--space-2); }
.gorev-guides { display: flex; flex-wrap: wrap; align-items: baseline; gap: var(--space-1) var(--space-3); }
.gorev-guides .ant-btn-link { padding: 0; height: auto; white-space: normal; text-align: start; text-decoration: underline; text-underline-offset: 3px; }

.epic-tools { display: flex; flex-wrap: wrap; align-items: center; gap: var(--space-2) var(--space-3); margin-bottom: var(--space-2); }
.epic-status { font-size: var(--text-small); color: var(--color-text-muted); margin: 0 0 var(--space-4) !important; }
.epic { display: flex; flex-direction: column; gap: var(--space-2); scroll-margin-top: ${ANCHOR_OFFSET}px; }
.epic + .epic { margin-top: var(--space-6); }
.epic-title { margin: 0 !important; font-size: var(--text-lead) !important; line-height: var(--leading-heading) !important; }
.epic-title a { color: var(--color-primary); text-decoration: underline; text-underline-offset: 3px; }
.epic .ant-typography { margin-bottom: 0; }
.epic-more { display: flex; flex-wrap: wrap; gap: var(--space-2) var(--space-3); margin-top: var(--space-4); }
.epic-empty { padding: var(--pad-card) var(--space-4); background: var(--color-surface); border-radius: var(--radius-md); }

.faz-pager { display: flex; flex-wrap: wrap; justify-content: space-between; gap: var(--space-2); margin-top: calc(var(--space-6) * 2); }
.faz-pager .ant-btn { white-space: normal; height: auto; text-align: start; }
.sr-only { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }
`;

/** Düz metindeki ters tırnaklı parçaları kod olarak gösterir. Faz görevlerinin hikâyesi HTML'siz gelir. */
function StoryText({ text }: { text: string }) {
	const parts = text.split(/(`[^`]+`)/g).filter(Boolean);
	return (
		<>
			{parts.map((part, i) =>
				part.startsWith("`") && part.endsWith("`") && part.length > 2 ? <code key={i}>{part.slice(1, -1)}</code> : <span key={i}>{part}</span>,
			)}
		</>
	);
}

/** Bir listenin işaretli madde sayısını tutar. Sayfa yenilenince işaretler geri gelir. */
function useChecks(storeId: string, count: number): [Set<number>, (i: number, v: boolean) => void] {
	const [on, setOn] = useState<Set<number>>(new Set());
	useEffect(() => {
		const saved = loadChecks()[storeId] || [];
		setOn(new Set(saved.filter((i) => i < count)));
	}, [storeId, count]);
	const toggle = (i: number, v: boolean) => {
		const next = new Set(on);
		if (v) next.add(i);
		else next.delete(i);
		setOn(next);
		const store = loadChecks();
		if (next.size) store[storeId] = Array.from(next).sort((a, b) => a - b);
		else delete store[storeId];
		saveChecks(store);
	};
	return [on, toggle];
}

/** Panel başlığı: işaret yoksa yalnız sayı, varsa ilerleme. */
const panelLabel = (title: string, total: number, done: number) => (done > 0 ? `${title} (${done} / ${total} işaretli)` : `${title} (${total})`);

/** Onay kutulu madde listesi. Satırlar arasında çizgi yok, kutu ilk satırla hizalı. */
function Checks({ items, html, on, onToggle }: { items: string[]; html?: string[]; on: Set<number>; onToggle: (i: number, v: boolean) => void }) {
	return (
		<DuzListe
			items={items}
			kontrol
			renderItem={(t, i) => (
				<Checkbox checked={on.has(i)} onChange={(e) => onToggle(i, e.target.checked)} style={{ fontSize: "var(--text-body)" }}>
					<Inline html={html?.[i]} text={t} />
				</Checkbox>
			)}
		/>
	);
}

function PhaseTask({ task, index, guides }: { task: Task; index: number; guides: GuideRef[] }) {
	const refs = (task.guides || []).map((g) => guides.find((x) => x.slug === g)).filter(Boolean) as GuideRef[];
	const acceptance = task.acceptance || [];
	const checklist = task.checklist || [];
	const donts = task.donts || [];
	const [kabulOn, toggleKabul] = useChecks(`${task.id}#kabul`, acceptance.length);
	const [kontrolOn, toggleKontrol] = useChecks(`${task.id}#kontrol`, checklist.length);
	const headingId = `gorev-${index + 1}-baslik`;
	return (
		<article id={`gorev-${index + 1}`} className="gorev" aria-labelledby={headingId}>
			<span className="gorev-num" data-task-num aria-hidden>
				{index + 1}
			</span>
			<Typography.Title level={3} id={headingId} className="gorev-title">
				<span className="sr-only">{index + 1}. </span>
				<Inline html={task.titleHtml} text={task.title} />
			</Typography.Title>
			<div className="gorev-body">
				<div className="gorev-meta" data-task-meta>
					<PriorityTag value={task.priority} />
					{task.owner && <span>Sorumlu: {task.owner}</span>}
				</div>
				{task.story && (
					<blockquote className="story md-inline">
						<StoryText text={task.story} />
					</blockquote>
				)}
				<div>
					<CopyButton text={taskToText(task)} label="Görevi kopyala" ariaLabel={`Görevi kopyala: ${task.title}`} primary />
				</div>
				<Collapse
					ghost
					defaultActiveKey={["kabul", "yapma"]}
					items={[
						{ key: "kabul", label: panelLabel("Kabul kriterleri", acceptance.length, kabulOn.size), children: <Checks items={acceptance} html={task.html?.acceptance} on={kabulOn} onToggle={toggleKabul} /> },
						{
							key: "yapma",
							label: `Yapmamanız gerekenler (${donts.length})`,
							children: (
								<DuzListe
									items={donts}
									renderItem={(t, i) => (
										<div className="gorev-dont">
											<CloseSquareFilled style={{ color: "var(--tehlike-fg)", fontSize: 18, marginTop: 3 }} aria-hidden />
											<Typography.Text>
												<Inline html={task.html?.donts[i]} text={t} />
											</Typography.Text>
										</div>
									)}
								/>
							),
						},
						{ key: "kontrol", label: panelLabel("Kontrol listesi", checklist.length, kontrolOn.size), children: <Checks items={checklist} html={task.html?.checklist} on={kontrolOn} onToggle={toggleKontrol} /> },
					]}
				/>
				{refs.length > 0 && (
					<div role="group" aria-label="İlgili yönergeler" className="gorev-guides">
						<Typography.Text style={{ fontSize: "var(--text-small)", color: "var(--color-text-muted)" }}>İlgili yönergeler</Typography.Text>
						{refs.map((g) => (
							<Button key={g.slug} type="link" href={url(`/yonergeler/${g.slug}/`)}>
								{g.title}
							</Button>
						))}
					</div>
				)}
			</div>
		</article>
	);
}

function EpicCard({ task, doc }: EpicRow) {
	return (
		<article data-epic-card={task.id} className="epic">
			<Typography.Title level={3} className="epic-title">
				<a href={url(task.href)}>{doc.title}</a>
			</Typography.Title>
			<div className="gorev-meta">
				<PriorityTag value={task.priority} />
				<span>Bağlam: {ctxLabel(task.ctx)}</span>
				{task.size && <span>Boyut: {task.size}</span>}
			</div>
			{doc.epic?.story && (
				<Typography.Paragraph>
					<Inline html={doc.epic.html?.story} text={doc.epic.story} />
				</Typography.Paragraph>
			)}
			<div>
				<CopyButton text={taskToText(task, doc)} label="Epic'i kopyala" ariaLabel={`Epic'i kopyala: ${doc.title}`} />
			</div>
		</article>
	);
}

/** Epic'i olmayan fazlarda okuru epic'lerin bulunduğu fazlara yönlendirir. */
function EpicEmpty({ phases }: { phases: PhaseLink[] }) {
	const withEpics = phases.filter((p) => ["Faz 3", "Faz 4", "Faz 5"].includes(p.id));
	return (
		<div data-epic-empty className="epic-empty">
			<Typography.Paragraph style={{ marginBottom: 8 }}>Bu fazda DocType epic'i yok. Bu fazın işi yukarıdaki görevlerdir.</Typography.Paragraph>
			<Typography.Paragraph style={{ marginBottom: 12 }}>DocType epic'leri şu fazlarda bulunur:</Typography.Paragraph>
			<Flex wrap gap={8}>
				{withEpics.map((p) => (
					<Button key={p.id} href={url(`/fazlar/${p.slug}/`)}>
						{p.label}
					</Button>
				))}
			</Flex>
		</div>
	);
}

function EpicList({ epics }: { epics: EpicRow[] }) {
	const [ctx, setCtx] = useState<string>("tümü");
	const [limit, setLimit] = useState(EPIC_STEP);
	// "Daha göster" sonrası odak ilk yeni karta geçer. Klavye okuru düğmede ya da boşlukta kalmaz.
	const [focusIndex, setFocusIndex] = useState<number | null>(null);
	const listRef = useRef<HTMLDivElement>(null);
	useEffect(() => {
		if (focusIndex === null) return;
		const card = listRef.current?.querySelectorAll<HTMLElement>("[data-epic-card]")[focusIndex];
		card?.querySelector<HTMLElement>("a, button")?.focus({ preventScroll: true });
		card?.scrollIntoView({ block: "start" });
		setFocusIndex(null);
	}, [focusIndex]);
	const showMore = (step: number) => {
		setFocusIndex(shown.length);
		setLimit((l) => l + step);
	};
	const ctxOptions = useMemo(() => ["tümü", ...Array.from(new Set(epics.map((e) => e.task.ctx))).sort()], [epics]);
	const filtered = epics.filter((e) => ctx === "tümü" || e.task.ctx === ctx);
	const shown = filtered.slice(0, limit);
	const remaining = filtered.length - shown.length;
	const where = ctx === "tümü" ? "Bu fazda" : "Bu bağlamda";
	const status = remaining > 0 ? `${where} ${filtered.length} epic var. Şimdi ${shown.length} epic görünüyor.` : `${where} ${filtered.length} epic var. Hepsi görünüyor.`;
	return (
		<>
			<div className="epic-tools">
				<Typography.Text>Bağlam:</Typography.Text>
				<Select
					aria-label="Bağlam süzgeci"
					value={ctx}
					onChange={(v) => {
						setCtx(v);
						setLimit(EPIC_STEP);
					}}
					options={ctxOptions.map((c) => ({ value: c, label: c === "tümü" ? "Bütün bağlamlar" : ctxLabel(c) }))}
					style={{ minWidth: 220 }}
				/>
			</div>
			<Typography.Paragraph data-epic-status aria-live="polite" className="epic-status">
				{status}
			</Typography.Paragraph>
			<div ref={listRef}>
				{shown.map((row) => (
					<EpicCard key={row.task.id} {...row} />
				))}
			</div>
			{remaining > 0 && (
				<div className="epic-more">
					<Button type="primary" onClick={() => showMore(EPIC_STEP)}>
						{Math.min(EPIC_STEP, remaining)} epic daha göster
					</Button>
					{remaining > EPIC_STEP && (
						<Button type="text" onClick={() => showMore(remaining)}>
							Kalan {remaining} epic'in hepsini göster
						</Button>
					)}
				</div>
			)}
		</>
	);
}

/** Sayfa sonunda önceki ve sonraki faza geçiş. Sonraki faz ana eylemdir, önceki faz sessiz bağlantıdır. */
function PhasePager({ phases, current }: { phases: PhaseLink[]; current: string }) {
	const i = phases.findIndex((p) => p.id === current);
	const prev = i > 0 ? phases[i - 1] : null;
	const next = i >= 0 && i < phases.length - 1 ? phases[i + 1] : null;
	if (!prev && !next) return null;
	return (
		<nav aria-label="Önceki ve sonraki faz" className="faz-pager" style={{ justifyContent: prev ? "space-between" : "flex-end" }}>
			{prev && (
				<Button type="text" href={url(`/fazlar/${prev.slug}/`)}>
					Önceki faz: {prev.label}
				</Button>
			)}
			{next && (
				<Button type="primary" href={url(`/fazlar/${next.slug}/`)}>
					Sonraki faz: {next.label}
				</Button>
			)}
		</nav>
	);
}

/** Faz geçişi: tek satırda sıralı numaralar. Geçerli faz mürekkep ve altı çizili. */
function PhaseSwitch({ phases, current }: { phases: PhaseLink[]; current: string }) {
	return (
		<nav aria-label="Fazlar" className="faz-switch">
			<span className="faz-switch-label" aria-hidden>
				Faz
			</span>
			{phases.map((p) => {
				const isCurrent = p.id === current;
				const num = p.label.replace(/^Faz\s*/, "");
				return (
					<Button key={p.id} type="text" href={url(`/fazlar/${p.slug}/`)} aria-label={p.label} aria-current={isCurrent ? "page" : undefined}>
						{num}
					</Button>
				);
			})}
		</nav>
	);
}

export default function PhasePage(props: { phase: Phase; phases: PhaseLink[]; guides: GuideRef[]; epics: EpicRow[] }) {
	const { phase, phases, guides, epics } = props;

	// Sayfa tarayıcıda çizilir. Bu yüzden #gorev-N bağlantısı için kaydırmayı biz yaparız.
	useEffect(() => {
		const id = decodeURIComponent(window.location.hash.slice(1));
		if (!id) return;
		const el = document.getElementById(id);
		if (el) el.scrollIntoView({ block: "start" });
	}, []);

	return (
		<AppShell active="/" crumbs={[{ title: "Genel bakış", href: "/" }, { title: phase.label }]}>
			<style dangerouslySetInnerHTML={{ __html: FAZ_CSS }} />
			<div className="faz-duzen">
			<div className="faz" data-faz-column style={{ ["--faz-renk" as string]: FAZ_RENK[phase.id] || "var(--color-ink)" }}>
				<PhaseSwitch phases={phases} current={phase.id} />
				<header
					data-sayfa-basi
					className="faz-bas"
					style={{
						["--bas-zemin" as string]: `color-mix(in srgb, ${FAZ_RENK[phase.id] || "var(--color-ink)"} 9%, #ffffff)`,
					}}
				>
					<span data-faz-rakam aria-hidden>
						{phase.label.replace(/^Faz\s+/, "")}
					</span>
					<div>
						<span className="faz-eyebrow">{phase.label}</span>
						<Typography.Title level={1}>{phase.title}</Typography.Title>
						<p data-ozet>{phase.summary}</p>
					</div>
				</header>
				<Typography.Title level={2} className="faz-h2">
					Görevler ({phase.tasks.length})
				</Typography.Title>
				<div>
					{phase.tasks.map((t, i) => (
						<PhaseTask key={t.id} task={t} index={i} guides={guides} />
					))}
				</div>
				<Typography.Title level={2} className="faz-h2" style={{ marginTop: "calc(var(--space-6) * 2)" }}>
					Bu fazdaki epic'ler ({epics.length})
				</Typography.Title>
				{epics.length === 0 ? <EpicEmpty phases={phases} /> : <EpicList epics={epics} />}
				<PhasePager phases={phases} current={phase.id} />
			</div>
			<aside className="faz-ray" aria-label="Faz özeti">
				<section>
					<h2>Bu fazda</h2>
					<dl>
						<dt>Görev</dt>
						<dd>{phase.tasks.length}</dd>
						<dt>Kabul kriteri</dt>
						<dd>{phase.tasks.reduce((n, t) => n + (t.acceptance?.length || 0), 0)}</dd>
						<dt>Epic</dt>
						<dd>{epics.length}</dd>
					</dl>
				</section>
				{guides.length > 0 && (
					<section>
						<h2>Yönergeler</h2>
						<ul>
							{guides.map((g) => (
								<li key={g.slug}>
									<a href={url(`/yonergeler/${g.slug}/`)}>{g.title}</a>
								</li>
							))}
						</ul>
					</section>
				)}
				<section>
					<h2>Fazlar</h2>
					<ul>
						{phases.map((p) => (
							<li key={p.id}>
								<a href={url(`/fazlar/${p.slug}/`)} aria-current={p.id === phase.id ? "page" : undefined}>
									<span data-ray-faz>
										<span data-ray-nokta style={{ background: FAZ_RENK[p.id] || "var(--color-ink)" }} aria-hidden />
										{p.label}
									</span>
								</a>
							</li>
						))}
					</ul>
				</section>
			</aside>
			</div>
		</AppShell>
	);
}
