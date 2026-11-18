import { useEffect, useState } from "react";
import { Button, Collapse, Progress, Table, Typography } from "antd";
import { AppShell } from "./AppShell";
import { Html, PriorityTag } from "./bits";
import { ctxLabel, loadStatuses, PRIORITY_ORDER, type DoctypeSummary, type Status } from "../lib/tasks";
import { url } from "../lib/base";

type Section = { title: string; html: string };
type Ctx = { ctx: string; title: string; sections: Section[] };

function useDone(ids: string[]) {
	const [map, setMap] = useState<Record<string, Status>>({});
	useEffect(() => setMap(loadStatuses()), []);
	return ids.filter((id) => map[id] === "Bitti").length;
}

export function ContextsPage({ contexts, docs }: { contexts: Ctx[]; docs: DoctypeSummary[] }) {
	return (
		<AppShell active="/baglamlar/" crumbs={[{ title: "Genel bakış", href: "/" }, { title: "Bağlamlar" }]}>
			<style>{`
				.ctx-izgara {
					display: grid;
					grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
					gap: var(--space-4);
				}
				@media (min-width: 768px) { .ctx-izgara { gap: var(--space-6); } }
				.ctx-kart {
					display: flex;
					flex-direction: column;
					gap: var(--space-2);
					padding: var(--space-4);
					border-radius: var(--radius-md);
					background: var(--bg-sunken);
					height: 100%;
				}
				.ctx-kart-bas {
					display: block;
					color: var(--color-text-strong) !important;
					font-size: var(--text-h3) !important;
					font-weight: var(--weight-strong);
					line-height: var(--leading-h3);
					letter-spacing: var(--track-h3);
					text-decoration: none !important;
					overflow-wrap: anywhere;
				}
				.ctx-kart:hover .ctx-kart-bas { text-decoration: underline !important; text-underline-offset: 3px; }
				.ctx-kart-klasor {
					font-size: var(--text-small);
					color: var(--color-text-muted);
					font-family: var(--font-mono);
				}
				.ctx-kart-ilerleme {
					font-size: var(--text-small);
					color: var(--color-text-muted);
					font-variant-numeric: tabular-nums;
				}
				.ctx-kart-alt {
					margin-block-start: auto;
					padding-block-start: var(--space-3);
					display: flex;
					align-items: center;
					flex-wrap: wrap;
					gap: var(--space-2) var(--space-3);
					font-size: var(--text-small);
					color: var(--color-text-muted);
					font-variant-numeric: tabular-nums;
				}
			`}</style>
			<header data-sayfa-basi>
				<Typography.Title level={1}>İş bağlamları</Typography.Title>
				<p data-ozet>Her iş bağlamı ayrı bir modül olacak. Planı ve epic'leri görmek için bir bağlam seçin.</p>
			</header>
			<div className="ctx-izgara">
				{contexts.map((c) => {
					const ds = docs.filter((d) => d.ctx === c.ctx);
					return <ContextCard key={c.ctx} c={c} ds={ds} />;
				})}
			</div>
		</AppShell>
	);
}

function ContextCard({ c, ds }: { c: Ctx; ds: DoctypeSummary[] }) {
	const done = useDone(ds.map((d) => d.id));
	const criticalPriority = ["Kriz", "Kritik"].find((priority) => ds.some((d) => d.epic?.priority === priority));
	const description = c.title.startsWith(c.ctx) ? c.title.slice(c.ctx.length).replace(/^:\s*/, "").trim() : c.title;
	const percent = ds.length ? Math.round((100 * done) / ds.length) : 0;
	return (
		<article className="ctx-kart">
			<a className="ctx-kart-bas" href={url(`/baglamlar/${c.ctx}/`)}>
				{ctxLabel(c.ctx)}
			</a>
			<span className="ctx-kart-klasor">{c.ctx}</span>
			<div className="ctx-kart-alt">
				<span>{ds.length} DocType</span>
				{criticalPriority && <PriorityTag value={criticalPriority} />}
			</div>
			<div className="ctx-kart-ilerleme">
				{/* İlerleme sıfırken çubuk çizilmez. Boş çubuk hiçbir bilgi vermez. */}
				{done > 0 && (
					<Progress
						aria-hidden
						percent={percent}
						strokeLinecap="square"
						size={["100%", 6]}
						showInfo={false}
						style={{ display: "block", marginBottom: 4 }}
					/>
				)}
				<span>
					{done} / {ds.length} epic bitti
				</span>
			</div>
		</article>
	);
}

export function ContextPage({ c, docs }: { c: Ctx; docs: DoctypeSummary[] }) {
	const done = useDone(docs.map((d) => d.id));
	const rows = [...docs].sort(
		(a, b) => PRIORITY_ORDER.indexOf(a.epic?.priority || "Önemli") - PRIORITY_ORDER.indexOf(b.epic?.priority || "Önemli") || a.title.localeCompare(b.title, "tr"),
	);
	return (
		<AppShell active="/baglamlar/" crumbs={[{ title: "Genel bakış", href: "/" }, { title: "Bağlamlar", href: "/baglamlar/" }, { title: c.ctx }]}>
			<header data-sayfa-basi>
				<span className="eyebrow" style={{ fontFamily: "var(--font-mono)", letterSpacing: 0 }}>{c.ctx}</span>
				<Typography.Title level={1}>{ctxLabel(c.ctx)}</Typography.Title>
				<p data-ozet>{c.title}</p>
			</header>
			<dl data-sayi-serit>
				<div>
					<dt>DocType</dt>
					<dd>{docs.length}</dd>
				</div>
				<div>
					<dt>Biten epic</dt>
					<dd>
						{done} <span>/ {docs.length}</span>
					</dd>
				</div>
			</dl>
			<Typography.Title level={2}>Epic'ler</Typography.Title>
			<div className="context-epics">
				<style>{`
					.context-epics { container-type: inline-size; }
					.context-epics-scroll { overflow-x: auto; }
					.context-epics .ant-table-container { min-width: 640px; }
					.context-epics .ant-pagination { position: sticky; inset-inline-start: 0; }
					.context-epics-hint { display: none; }
					@container (width < 640px) {
						.context-epics-hint { display: block; margin: 0 0 var(--space-2); }
					}
					.context-epics .ant-table-cell:first-child { white-space: nowrap; word-break: normal; overflow-wrap: normal; }
					.context-epics td:first-child { padding-block: 0; }
					.context-epics td:first-child a { display: flex; justify-content: flex-start; padding-inline: 0; }
				`}</style>
				<p className="context-epics-hint" id="context-epics-hint">Tüm sütunları görmek için tabloyu yana kaydırın.</p>
				<div className="context-epics-scroll" role="region" aria-label="Epic tablosu" aria-describedby="context-epics-hint" tabIndex={0}>
					<Table
						size="middle"
						rowKey="id"
						dataSource={rows}
						pagination={{ pageSize: 20, hideOnSinglePage: true }}
						columns={[
							{ title: "DocType", dataIndex: "title", render: (t: string, d: DoctypeSummary) => <Button type="link" href={url(`/doctype/${d.ctx}/${d.slug}/`)}>{t}</Button> },
							{ title: "Öncelik", width: 120, render: (_: unknown, d: DoctypeSummary) => <PriorityTag value={d.epic?.priority || "Önemli"} /> },
							{ title: "Faz", width: 100, render: (_: unknown, d: DoctypeSummary) => d.epic?.phase || "Faz 4" },
							{ title: "Tür", render: (_: unknown, d: DoctypeSummary) => d.meta["Tür"] || "" },
						]}
					/>
				</div>
			</div>
			<Typography.Title level={2} style={{ marginTop: 32 }}>
				Bağlam planı
			</Typography.Title>
			<Collapse
				ghost
				defaultActiveKey={["0"]}
				styles={{ header: { alignItems: "center" } }}
				items={c.sections.map((s, i) => ({ key: String(i), label: s.title, children: <Html html={s.html} /> }))}
			/>
		</AppShell>
	);
}
