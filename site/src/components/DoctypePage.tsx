import { Fragment, useEffect, useRef, useState, type ReactNode } from "react";
import { App, Button, Checkbox, Collapse, Flex, Select, Tabs, Typography } from "antd";
import { CloseSquareFilled, CopyOutlined, LeftOutlined, RightOutlined } from "@ant-design/icons";
import { AppShell } from "./AppShell";
import { CopyButton, DuzListe, Html, Inline, PriorityTag } from "./bits";
import { ctxLabel, loadStatuses, phaseLabel, saveStatuses, STATUSES, type Status } from "../lib/tasks";
import { copyText } from "../lib/copy";
import { taskToText, type DoctypeSummary, type Task } from "../lib/tasks";
import { url } from "../lib/base";
import { loadChecks, saveChecks } from "../lib/checks";

type Section = { title: string; html: string; md: string };

// Bu sayfaya özgü düzen kuralları. Değerler tokens.css dosyasından gelir.
const PAGE_CSS = `
/* Bölüm başlığı h1'den açıkça küçük olur. Merkezî h2 kuralı !important taşır,
   bu yüzden satır içi stil işlemiyordu. Sınıf aynı güçte yazılır. */
.doc-bolum-basligi.ant-typography {
	margin-top: var(--rhythm-block) !important;
	margin-bottom: var(--space-3) !important;
	font-size: var(--text-h3) !important;
	line-height: var(--leading-h3) !important;
	letter-spacing: var(--track-h3);
}

/* Okuma genişliği yalnız metin sütununa aittir. Sayfanın tamamına değil. */
[data-doc-root] { max-width: none; }
[data-doc-icerik] { max-width: var(--measure-wide); }
@media (max-width: 1023px) { [data-doc-icerik] { max-width: var(--measure); } }
[data-doc-root] h1 { overflow-wrap: normal; word-break: normal; hyphens: manual; }
[data-doc-root] .ant-checkbox-wrapper { align-items: flex-start; }
[data-doc-root] .ant-checkbox-wrapper .ant-checkbox { align-self: flex-start; margin-top: 5px; }
[data-doc-tags] { display: flex; flex-wrap: wrap; align-items: center; gap: var(--space-1) var(--space-4); margin-bottom: var(--space-3); font-size: var(--text-small); color: var(--color-text-muted); letter-spacing: var(--track-meta); }
[data-doc-tags] > span { white-space: nowrap; }
[data-doc-owner] { font-size: var(--text-small); color: var(--color-text-muted); margin-bottom: var(--space-3); }
[data-doc-files] { margin: 0 0 var(--space-4); font-size: var(--text-small); color: var(--color-text-muted); }
[data-doc-files] summary { min-height: var(--hit); padding-block: 10px; box-sizing: border-box; cursor: pointer; }
[data-doc-files] dl { margin: 0 0 var(--space-2); }
[data-doc-files] dt { font-weight: var(--weight-strong); margin-top: var(--space-2); }
[data-doc-files] dd { margin: 0; min-width: 0; }
[data-doc-files] code { overflow-wrap: normal; }
[data-doc-actions] .ant-btn-primary { flex: 1 1 220px; }
@media (min-width: 600px) { [data-doc-actions] .ant-btn-primary { flex: 0 0 auto; } }
[data-doc-epic] .story { background: transparent; padding: 0; margin: 0; font-size: var(--text-lead); line-height: var(--leading-body); }
[data-doc-epic] .ant-list-item { padding-block: 2px; border-block-end: 0; }
[data-doc-epic] [data-doc-steps] .ant-list-item { padding-block: var(--space-2); }
[data-doc-root] .ant-collapse-ghost > .ant-collapse-item + .ant-collapse-item { border-top: 1px solid var(--color-hairline); }
[data-doc-pager] { display: flex; flex-wrap: wrap; justify-content: space-between; gap: var(--space-2); margin-top: var(--space-6); padding-top: var(--space-4); border-top: 1px solid var(--color-hairline); }
[data-doc-pager] .ant-btn { flex: 1 1 240px; max-width: 100%; height: auto; padding-block: var(--space-2); padding-inline: 0; white-space: normal; justify-content: flex-start; text-align: start; }
[data-doc-pager] .ant-btn > span:not(.ant-btn-icon) { flex: 1 1 auto; min-width: 0; }
[data-doc-pager] [data-dir="next"] { text-align: end; margin-inline-start: auto; }
[data-doc-pager] .pager-dir { display: block; font-size: var(--text-small); color: var(--color-text-muted); }
[data-doc-pager] .pager-title { display: block; font-weight: var(--weight-strong); }
@media (max-width: 599px) { [data-doc-root] .ant-collapse-body { padding-inline: var(--space-3) !important; } [data-doc-root] .ant-collapse-body .md ul, [data-doc-root] .ant-collapse-body .md ol { padding-left: var(--space-4); } }
@media (min-width: 600px) { [data-doc-pager] .ant-btn { flex: 0 1 auto; max-width: 48%; } }
`;

/** Dosya yolunu "/" ve "_" işaretlerinden sonra bölünebilir yapar. Kelime ortası bölünmez. */
function breakablePath(path: string): ReactNode[] {
	return path.split(/(?<=[/_])/).flatMap((part, i) => (i ? [<wbr key={i} />, part] : [part]));
}

/** Ters tırnak içindeki parçalar kod olur. Kalan metin düz yazı olarak kalır. */
function MetaValue({ value }: { value: string }) {
	return (
		<>
			{value.split("`").map((part, i) => (i % 2 ? <code key={i}>{breakablePath(part)}</code> : <Fragment key={i}>{part}</Fragment>))}
		</>
	);
}

function CheckList({ title, kind, items, html, empty, note, storeId }: { title: string; kind: string; items: string[]; html?: string[]; empty: string; note?: string; storeId: string }) {
	// İşaretler tarayıcıda saklanır. Sayfa yenilenince geri gelirler.
	const [checked, setChecked] = useState<Record<number, boolean>>({});
	useEffect(() => {
		const kayitli = loadChecks()[storeId] || [];
		const harita: Record<number, boolean> = {};
		for (const i of kayitli) if (i < items.length) harita[i] = true;
		setChecked(harita);
	}, [storeId, items.length]);
	const isaretle = (i: number, v: boolean) => {
		const sonraki = { ...checked, [i]: v };
		setChecked(sonraki);
		const depo = loadChecks();
		const liste = Object.keys(sonraki)
			.filter((k) => sonraki[Number(k)])
			.map(Number)
			.sort((x, y) => x - y);
		if (liste.length) depo[storeId] = liste;
		else delete depo[storeId];
		saveChecks(depo);
	};
	const done = Object.values(checked).filter(Boolean).length;
	return (
		<>
			<Flex justify="space-between" align="baseline" gap={8} wrap>
				<Heading>{title}</Heading>
				{items.length > 0 && (
					<span data-doc-progress={kind} aria-live="polite" style={{ fontSize: "var(--text-small)", color: "var(--color-text-muted)" }}>
						{done === items.length ? `Hepsi tamam (${done} / ${items.length})` : `${done} / ${items.length} tamam`}
					</span>
				)}
			</Flex>
			{note && items.length > 0 && <Typography.Paragraph style={{ fontSize: "var(--text-small)", color: "var(--color-text-muted)", marginBottom: 0 }}>{note}</Typography.Paragraph>}
			{items.length ? (
				<div data-doc-checklist={kind}>
					<DuzListe
						items={items}
						kontrol
						renderItem={(t, i) => (
							<Checkbox checked={!!checked[i]} onChange={(e) => isaretle(i, e.target.checked)} style={{ fontSize: 16 }}>
								<Inline html={html?.[i]} text={t} />
							</Checkbox>
						)}
					/>
				</div>
			) : (
				<p data-bos-metin>{empty}</p>
			)}
		</>
	);
}

function Heading({ children }: { children: string }) {
	return (
		<Typography.Title level={2} className="doc-bolum-basligi">
			{children}
		</Typography.Title>
	);
}

/** İkincil kopyalama eylemi. Görünümü sessiz bir bağlantıdır. */
function QuietCopy({ text, label }: { text: string; label: string }) {
	const { message } = App.useApp();
	return (
		<Button
			type="link"
			icon={<CopyOutlined />}
			aria-label={label}
			style={{ paddingInline: 0 }}
			onClick={async () => {
				const ok = await copyText(text);
				if (ok) message.success("Kopyalandı");
				else message.error("Kopyalanamadı. Metni elle seçin.");
			}}
		>
			{label}
		</Button>
	);
}

/** Klasör ve denetleyici yolları kapalı bir ayrıntıda durur. Başlıkta yalnız dosya adı görünür. */
function Files({ meta }: { meta: Record<string, string> }) {
	const rows = (["Klasör", "Denetleyici"] as const).filter((k) => meta[k]);
	if (!rows.length) return null;
	const ctl = meta["Denetleyici"] || "";
	const m = ctl.match(/^`([^`]+)`\s*(.*)$/);
	const file = m ? m[1].split("/").pop() : "";
	return (
		<details data-doc-files>
			<summary>
				{file ? (
					<>
						Dosya yolları: <code>{breakablePath(file || "")}</code> {m?.[2]}
					</>
				) : (
					"Dosya yolları"
				)}
			</summary>
			<dl>
				{rows.map((k) => (
					<Fragment key={k}>
						<dt>{k}</dt>
						<dd data-doc-path>
							<MetaValue value={meta[k]} />
						</dd>
					</Fragment>
				))}
			</dl>
		</details>
	);
}

/** Rapor bölümleri. İlk bölüm açık başlar. Tek düğme bütün bölümleri açar ya da kapatır. */
function Report({ sections }: { sections: Section[] }) {
	const [open, setOpen] = useState<string[]>(sections.length ? ["0"] : []);
	if (!sections.length) return <p data-bos-metin>Bu rapor henüz yazılmadı.</p>;
	const all = open.length === sections.length;
	return (
		<>
			<Flex justify="flex-end" style={{ marginBottom: 12 }}>
				<Button onClick={() => setOpen(all ? [] : sections.map((_, i) => String(i)))}>{all ? "Bütün bölümleri kapat" : "Bütün bölümleri aç"}</Button>
			</Flex>
			<Collapse
				activeKey={open}
				onChange={(k) => setOpen(Array.isArray(k) ? k : [k])}
				items={sections.map((s, i) => ({ key: String(i), label: s.title, children: <Html html={s.html} /> }))}
			/>
		</>
	);
}

/** "Order: 04-siparis bağlamına taşıma" adından okunur bir cümle kurar. Bağlam adı tirede bölünmez. */
function subtitle(doc: DoctypeSummary): ReactNode {
	const name = doc.epic?.name;
	if (!name) return null;
	const m = name.match(/: (.+) bağlamına taşıma$/);
	if (!m) return name;
	return (
		<>
			Bu iş {doc.title} kaydını <span style={{ whiteSpace: "nowrap" }}>{m[1]}</span> bağlamına taşır.
		</>
	);
}

/** Görevin durumu kendi sayfasından değiştirilebilir. Kanban ile aynı depoyu kullanır. */
function DurumSecici({ id, baslik }: { id: string; baslik: string }) {
	const [durum, setDurum] = useState<Status>("Yapılacak");
	useEffect(() => setDurum(loadStatuses()[id] || "Yapılacak"), [id]);
	return (
		<Select<Status>
			size="small"
			value={durum}
			aria-label={`Durum: ${durum}. Görev: ${baslik}`}
			popupMatchSelectWidth={false}
			options={STATUSES.map((v) => ({ value: v, label: v }))}
			onChange={(v) => {
				setDurum(v);
				const harita = loadStatuses();
				harita[id] = v;
				saveStatuses(harita);
			}}
			style={{ minWidth: 150 }}
		/>
	);
}

export default function DoctypePage(props: { doc: DoctypeSummary; sections: Section[]; md: string; task: Task; prev?: DoctypeSummary; next?: DoctypeSummary }) {
	const { doc, sections, md, task, prev, next } = props;
	const e = doc.epic;
	const missing = "Bu bölüm rapora henüz eklenmedi.";
	const sub = subtitle(doc);
	// Önerilen sahip bağlam, bağlamdan farklıysa kısa bir not olarak görünür. Aynıysa meta satırı yeter.
	const owner = doc.meta["Önerilen sahip bağlam"] && doc.meta["Önerilen sahip bağlam"] !== doc.meta["Bağlam"] ? doc.meta["Önerilen sahip bağlam"] : "";
	const root = useRef<HTMLDivElement>(null);
	// İki panelde de odaklanabilir öğe var. Panelin kendisi Tab sırasına girerse bütün panel sarıya boyanır.
	// Ant Design paneli her sekme değişiminde yeniden odaklanabilir yapar. Gözlemci bunu geri alır.
	useEffect(() => {
		const el = root.current;
		if (!el) return;
		const fix = () => el.querySelectorAll<HTMLElement>('[role="tabpanel"][tabindex="0"]').forEach((p) => (p.tabIndex = -1));
		fix();
		const mo = new MutationObserver(fix);
		mo.observe(el, { subtree: true, childList: true, attributes: true, attributeFilter: ["tabindex"] });
		return () => mo.disconnect();
	}, []);
	const epicTab = (
		<div data-doc-epic>
			<Heading>Kullanıcı hikâyesi</Heading>
			{e?.story ? (
				<blockquote className="story">
					<Inline html={e.html?.story} text={e.story} />
				</blockquote>
			) : (
				<p data-bos-metin>{missing}</p>
			)}
			<CheckList title="Kabul kriterleri" kind="acceptance" storeId={`${doc.id}#kabul`} items={e?.acceptance || []} html={e?.html?.acceptance} empty={missing} note="İşaretler bu tarayıcıda saklanır. Başka kişi bu işaretleri görmez." />
			<Heading>Yapmamanız gerekenler</Heading>
			{e?.donts?.length ? (
				<DuzListe
					items={e.donts}
					renderItem={(t, i) => (
						<Flex gap={10} align="start">
							<CloseSquareFilled style={{ color: "var(--tehlike-fg)", fontSize: 18, marginTop: 3 }} aria-hidden />
							<Typography.Text style={{ fontSize: 16 }}>
								<Inline html={e.html?.donts[i]} text={t} />
							</Typography.Text>
						</Flex>
					)}
				/>
			) : (
				<p data-bos-metin>{missing}</p>
			)}
			<CheckList title="Kontrol listesi" kind="checklist" storeId={`${doc.id}#kontrol`} items={e?.checklist || []} html={e?.html?.checklist} empty={missing} />
			<Heading>Geçiş adımları</Heading>
			{doc.steps.length ? (
				<div data-doc-steps>
					<DuzListe
						items={doc.steps}
						renderItem={(s, i) => (
							<Flex gap={8} align="start" style={{ width: "100%" }} data-doc-step>
								<strong data-step-num style={{ flex: "0 0 auto", minWidth: "2.2ch", fontSize: 16, lineHeight: 1.6 }}>
									{i + 1}.
								</strong>
								<Flex vertical gap={8} style={{ flex: 1, minWidth: 0 }} data-step-body>
									<Typography.Text style={{ fontSize: 16 }}>
										<Inline html={doc.stepsHtml?.[i]} text={s} />
									</Typography.Text>
									<div>
										<QuietCopy
											label={`${i + 1}. adımı kopyala`}
											text={`Görev: ${doc.title} geçiş adımı ${i + 1}\nKimlik: ${doc.id}#adim-${i + 1}\nAdım: ${s}\nKaynak rapor: mimari/doctypes/${doc.id}.md\nRepo: tradehub-tr/tradehub_core (dal: version-15)\n`}
										/>
									</div>
								</Flex>
							</Flex>
						)}
					/>
				</div>
			) : (
				<p data-bos-metin>{missing}</p>
			)}
		</div>
	);
	return (
		<AppShell
			active="/baglamlar/"
			crumbs={[
				{ title: "Genel bakış", href: "/" },
				{ title: "Bağlamlar", href: "/baglamlar/" },
				{ title: ctxLabel(doc.ctx), href: `/baglamlar/${doc.ctx}/` },
				{ title: doc.title },
			]}
		>
			<style>{PAGE_CSS}</style>
			<div data-doc-root ref={root}>
				<header data-sayfa-basi data-doc-bas>
					<span className="eyebrow">{ctxLabel(doc.ctx)}</span>
					<Typography.Title level={1}>{doc.title}</Typography.Title>
					{sub && <p data-ozet>{sub}</p>}
				</header>
				<div data-doc-duzen>
					<div data-doc-icerik>
						{sub && (
							<Typography.Paragraph style={{ fontSize: "var(--text-lead)", marginBottom: 12 }} data-doc-subtitle>
								{sub}
							</Typography.Paragraph>
						)}
						{owner && (
							<p data-doc-owner>
								Önerilen sahip bağlam: <MetaValue value={owner} />
							</p>
						)}
						<Files meta={doc.meta} />
				<Tabs
					items={[
						{ key: "epic", label: "Epic", children: epicTab },
						{
							key: "rapor",
							label: `Rapor (${sections.length} bölüm)`,
							children: <Report sections={sections} />,
						},
					]}
				/>
					</div>
					<aside data-doc-ray aria-label="Görev bilgisi">
						<section>
							<h2>Eylem</h2>
							<CopyButton text={taskToText(task, doc)} label="Epic'i kopyala" primary block />
							<QuietCopy text={md} label="Raporun tamamını kopyala" />
							<p data-ray-not>
								Kopyalanan metni bir geliştiriciye ya da yapay zekâ ajanına verin. Başlamadan önce <a href={url("/yonergeler/")}>yönergeleri</a> okuyun.
							</p>
						</section>
						<section>
							<h2>Bilgi</h2>
							<dl data-doc-meta>
								<div>
									<dt>Durum</dt>
									<dd>
										<DurumSecici id={doc.id} baslik={doc.title} />
									</dd>
								</div>
								<div>
									<dt>Öncelik</dt>
									<dd>
										<PriorityTag value={task.priority} />
									</dd>
								</div>
								<div>
									<dt>Faz</dt>
									<dd>
										<span data-faz-rozet={task.phase} aria-hidden>
											{task.phase.replace(/^Faz\s+/, "")}
										</span>
										{phaseLabel(task.phase)}
									</dd>
								</div>
								{e?.size && (
									<div>
										<dt>Boyut</dt>
										<dd>{e.size} iş</dd>
									</div>
								)}
								<div>
									<dt>Bağlam</dt>
									<dd>
										<a href={url(`/baglamlar/${doc.ctx}/`)}>{ctxLabel(doc.ctx)}</a>
									</dd>
								</div>
								{doc.meta["Tür"] && (
									<div>
										<dt>Tür</dt>
										<dd>{doc.meta["Tür"]}</dd>
									</div>
								)}
							</dl>
						</section>
					</aside>
				</div>
				<nav data-doc-pager aria-label="Diğer DocType raporları">
					{prev && (
						<Button type="text" href={url(`/doctype/${prev.ctx}/${prev.slug}/`)} icon={<LeftOutlined />} data-dir="prev" aria-label={`Önceki: ${prev.title}`}>
							<span>
								<span className="pager-dir">Önceki</span>
								<span className="pager-title">{prev.title}</span>
							</span>
						</Button>
					)}
					{next && (
						<Button type="text" href={url(`/doctype/${next.ctx}/${next.slug}/`)} icon={<RightOutlined />} iconPlacement="end" data-dir="next" aria-label={`Sonraki: ${next.title}`}>
							<span>
								<span className="pager-dir">Sonraki</span>
								<span className="pager-title">{next.title}</span>
							</span>
						</Button>
					)}
				</nav>
			</div>
		</AppShell>
	);
}
