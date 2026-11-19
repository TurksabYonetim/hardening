import { forwardRef, useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { App, Button, Col, Dropdown, Flex, Grid, Input, Row, Segmented, Select, Tooltip, Typography } from "antd";
import { AppstoreOutlined, CheckOutlined, CopyOutlined, DownOutlined, SearchOutlined, UnorderedListOutlined } from "@ant-design/icons";
import { AppShell } from "./AppShell";
import { CopyButton, Inline, PriorityTag } from "./bits";
import { ctxLabel, loadStatuses, lowerTr, PHASE_ORDER, phaseLabel, PRIORITY_ORDER, saveStatuses, STATUSES, taskToText, type Status, type Task } from "../lib/tasks";
import { kopyaAl, kopyaBostaYukle, kopyaYukle } from "../lib/kopya";
import { url } from "../lib/base";
import { copyText } from "../lib/copy";

const PAGE = 30;
const ALL = "tümü";

// Bağlam kimlikleri klasör adıdır. Kartta ve süzgeçte okunur adı gösteririz.
// Listede olmayan yeni bir bağlam gelirse kimliğin kendisi gösterilir.
const lower = lowerTr;
const emptyLimits = () => Object.fromEntries(STATUSES.map((s) => [s, PAGE])) as Record<Status, number>;
const tabId = (s: Status) => `kanban-sekme-${STATUSES.indexOf(s)}`;
const panelId = "kanban-panel";
// Ekranda görünmez ama ekran okuyucu okur.
const srOnly = { position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0 0 0 0)", whiteSpace: "nowrap", padding: 0, border: 0, margin: -1 } as const;
// Kartın üst bilgisi: öncelik rengi dışında hepsi sessiz, küçük metindir.
const meta = { fontSize: "var(--text-small)", color: "var(--color-text-muted)", lineHeight: 1.5 } as const;

/** Klavyeyle sütunu atlamak için düğme. Yalnız odak alınca görünür.
 * Yerel düğme tokens.css içindeki hedef kuralının seçicisine girmez. Bu yüzden yüksekliği --hit tokenından alır. */
function SkipButton({ label, onSkip }: { label: string; onSkip: () => void }) {
	const [shown, setShown] = useState(false);
	const hidden = { position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0 0 0 0)", whiteSpace: "nowrap", padding: 0, border: 0, font: "inherit", fontSize: 16 } as const;
	return (
		<button
			type="button"
			data-kanban-skip
			onFocus={() => setShown(true)}
			onBlur={() => setShown(false)}
			onClick={onSkip}
			style={
				shown
					? { display: "block", width: "100%", minHeight: "var(--hit)", marginBottom: 12, padding: "8px 12px", border: 0, borderRadius: "var(--radius-md)", background: "var(--color-surface)", color: "var(--color-text)", font: "inherit", fontSize: 16, textAlign: "start", cursor: "pointer" }
					: hidden
			}
		>
			{label}
		</button>
	);
}

/** Durum noktası: sütunu tek bakışta belli eder. Daire değil, kare köşeli. */
const DURUM_RENK: Record<Status, string> = {
	"Yapılacak": "var(--color-text-muted)",
	"Devam ediyor": "var(--color-primary)",
	"İncelemede": "#874d00",
	"Bitti": "#135200",
};

/** Satır içi kopyalama. Küçük, sessiz ve yalnız ikonlu. */
const SatirKopyala = forwardRef<HTMLButtonElement, { id: string; task: Task; baslik: string }>(function SatirKopyala({ id, task, baslik }, ref) {
	const { message } = App.useApp();
	const [bitti, setBitti] = useState(false);
	useEffect(() => {
		if (!bitti) return;
		const t = window.setTimeout(() => setBitti(false), 2000);
		return () => window.clearTimeout(t);
	}, [bitti]);
	return (
		<Tooltip title="Görevin bütün ayrıntısını kopyalar">
			<button
				ref={ref}
				type="button"
				data-kanban-kopyala
				tabIndex={-1}
				aria-label={`Kopyala: ${baslik}`}
				onClick={async (e) => {
					e.stopPropagation();
					// Pano yazma kullanıcı hareketiyle aynı işte çalışmalıdır.
					// Bu yüzden burada bekleme yapılmaz. Veri hazır değilse
					// satırın kendi bilgisinden kısa bir metin üretilir.
					const metin = kopyaAl(id) || taskToText(task);
					const ok = await copyText(metin);
					setBitti(ok);
					if (ok) message.success("Kopyalandı");
					else message.error("Kopyalanamadı. Metni elle seçin.");
				}}
			>
				{bitti ? <CheckOutlined aria-hidden /> : <CopyOutlined aria-hidden />}
			</button>
		</Tooltip>
	);
});

/** Görev satırı. Kart değil satır: amaç bir ekranda çok görev göstermek. */
function TaskRow({ task, status, ilk, fazBasi, onStatus }: { task: Task; status: Status; ilk?: boolean; fazBasi?: boolean; onStatus: (s: Status) => void }) {
	const { message } = App.useApp();
	const kopyalaRef = useRef<HTMLButtonElement>(null);

	const durumaGec = (v: Status) => {
		if (v === status) return;
		onStatus(v);
		message.success(
			<span data-kanban-bildirim>
				Görev <strong>{v}</strong> sütununa taşındı.
			</span>,
		);
	};

	// Satır odaktayken tek tuşla iş yapılır. Yazarken bu kısayollar çalışmaz.
	const onKisayol = (e: KeyboardEvent<HTMLDivElement>) => {
		const hedef = e.target as HTMLElement;
		if (hedef.closest("input, textarea, [contenteditable='true']")) return;
		if (e.metaKey || e.ctrlKey || e.altKey) return;
		const i = ["1", "2", "3", "4"].indexOf(e.key);
		if (i >= 0) {
			e.preventDefault();
			durumaGec(STATUSES[i]);
			return;
		}
		if (e.key.toLowerCase() === "c") {
			e.preventDefault();
			kopyalaRef.current?.click();
			return;
		}
		// Odaklı satırda Enter ya da Space görevin sayfasını açar.
		if (e.key === "Enter" || e.key === " ") {
			if (hedef.closest("a, button")) return;
			e.preventDefault();
			window.location.href = url(task.href);
		}
	};

	return (
		<div role="listitem" tabIndex={ilk ? 0 : -1} data-task-card={task.id} data-status={status} data-kanban-satir data-faz-basi={fazBasi ? "" : undefined} onKeyDown={onKisayol} onPointerEnter={() => void kopyaYukle()} onFocus={() => void kopyaYukle()}>
			<Dropdown
				trigger={["click"]}
				menu={{
					selectable: true,
					selectedKeys: [status],
					items: STATUSES.map((s) => ({
						key: s,
						label: (
							<span data-kanban-durum-secenek>
								<span data-kanban-nokta style={{ background: DURUM_RENK[s] }} aria-hidden />
								{s}
							</span>
						),
					})),
					onClick: ({ key }) => durumaGec(key as Status),
				}}
			>
				<button type="button" data-role="durum" data-kanban-durum tabIndex={-1} aria-label={`Durum: ${status}. Değiştirmek için açın. Görev: ${task.title}`}>
					<span data-kanban-nokta style={{ background: DURUM_RENK[status] }} aria-hidden />
				</button>
			</Dropdown>
			<div data-kanban-govde>
				<a href={url(task.href)} data-kanban-baslik-bag>
					<span data-role="baslik" data-kanban-baslik>
						<Inline html={task.titleHtml} text={task.title} />
					</span>
				</a>
				<div data-kanban-meta style={meta}>
					<PriorityTag value={task.priority} />
					<span>{phaseLabel(task.phase)}</span>
					{/* Durum yalnız renkli kareyle anlatılmaz. Renk kapalıyken de okunur. */}
					<span data-kanban-durum-adi>
						<span style={srOnly}>Durum: </span>
						{status}
					</span>
					<span data-genis aria-hidden>·</span>
					<span data-genis>
						<span style={srOnly}>Bağlam: </span>
						{ctxLabel(task.ctx)}
					</span>
				</div>
			</div>
			<SatirKopyala ref={kopyalaRef} id={task.id} task={task} baslik={task.title} />
		</div>
	);
}

export default function KanbanPage({ tasks }: { tasks: Task[] }) {
	const screens = Grid.useBreakpoint();
	const wide = !!screens.lg;
	// Tablet ve üstünde süzgeçler seçilen değeri kesmeden gösterecek kadar geniştir.
	const roomy = !!screens.md;
	// Kopyalama metni ayrı bir parçadır. Tarayıcı boşa düşünce yüklenir.
	useEffect(() => kopyaBostaYukle(), []);
	// Sayfa yalnız tarayıcıda çalışır. Kayıtlı durumlar ilk çizimden önce okunur, bu yüzden sayılar bir an 0 görünmez.
	const [statuses, setStatuses] = useState<Record<string, Status>>(loadStatuses);
	const [column, setColumn] = useState<Status>("Yapılacak");
	const [phase, setPhase] = useState(ALL);
	const [ctx, setCtx] = useState(ALL);
	const [q, setQ] = useState("");
	const [limits, setLimits] = useState(emptyLimits);
	// Geniş ekranda varsayılan liste görünümüdür. Pano ikinci seçenektir.
	const [gorunum, setGorunum] = useState<"liste" | "pano">("liste");
	useEffect(() => {
		try {
			const v = window.localStorage.getItem("istoc-kanban-gorunum");
			if (v === "liste" || v === "pano") setGorunum(v);
		} catch {
			/* tarayıcı depoyu kapatmış olabilir */
		}
	}, []);
	const gorunumSec = (v: "liste" | "pano") => {
		setGorunum(v);
		try {
			window.localStorage.setItem("istoc-kanban-gorunum", v);
		} catch {
			/* yazılamazsa görünüm yalnız bu sayfada kalır */
		}
	};
	const [listeSiniri, setListeSiniri] = useState(PAGE);
	// Durum değişince ya da yeni kartlar açılınca odak bu kimliğe taşınır.
	const [focusTarget, setFocusTarget] = useState<string | null>(null);
	const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
	const [hoverTab, setHoverTab] = useState<Status | null>(null);
	const [howOpen, setHowOpen] = useState(false);
	// Aynı tarayıcının başka sekmesinde durum değişirse bu pano da güncellenir.
	useEffect(() => {
		const sync = (e: StorageEvent) => {
			if (e.key === null || e.key === "istoc-mimari-kanban-v1") setStatuses(loadStatuses());
		};
		window.addEventListener("storage", sync);
		return () => window.removeEventListener("storage", sync);
	}, []);

	// Geniş ekranda sütun başlıkları yapışkan üst çubuğun hemen altında durur.
	const [headerOffset, setHeaderOffset] = useState(0);
	useEffect(() => {
		const measure = () => {
			const bar = document.querySelector<HTMLElement>("header");
			const pos = bar ? getComputedStyle(bar).position : "";
			setHeaderOffset(bar && (pos === "sticky" || pos === "fixed") ? bar.getBoundingClientRect().height : 0);
		};
		measure();
		window.addEventListener("resize", measure);
		return () => window.removeEventListener("resize", measure);
	}, []);

	useEffect(() => {
		if (!focusTarget) return;
		const el = document.getElementById(focusTarget) || document.querySelector<HTMLElement>(`[data-task-card="${CSS.escape(focusTarget)}"]`);
		el?.focus();
		setFocusTarget(null);
	}, [focusTarget]);

	const statusOf = (id: string): Status => statuses[id] || "Yapılacak";
	const phases = useMemo(() => [ALL, ...PHASE_ORDER.filter((p) => tasks.some((t) => t.phase === p))], [tasks]);
	const ctxs = useMemo(() => [ALL, ...Array.from(new Set(tasks.map((t) => t.ctx))).sort()], [tasks]);
	const filtered = useMemo(() => {
		// Her kelime başlıkta, kimlikte ya da bağlam adında geçmelidir. Kelimelerin sırası önemli değildir.
		const words = lower(q).split(/\s+/).filter(Boolean);
		return tasks
			.filter((t) => (phase === ALL || t.phase === phase) && (ctx === ALL || t.ctx === ctx))
			.filter((t) => {
				if (!words.length) return true;
				const hay = lower(`${t.title} ${t.id} ${ctxLabel(t.ctx)}`);
				return words.every((w) => hay.includes(w));
			})
			.sort((a, b) => PHASE_ORDER.indexOf(a.phase) - PHASE_ORDER.indexOf(b.phase) || PRIORITY_ORDER.indexOf(a.priority) - PRIORITY_ORDER.indexOf(b.priority));
	}, [tasks, phase, ctx, q]);
	const byStatus = (s: Status) => filtered.filter((t) => statusOf(t.id) === s);
	const counts = Object.fromEntries(STATUSES.map((s) => [s, byStatus(s).length])) as Record<Status, number>;
	const filtering = phase !== ALL || ctx !== ALL || q.trim() !== "";

	const resetLimits = () => {
		setLimits(emptyLimits());
		setListeSiniri(PAGE);
	};
	const clearFilters = () => {
		setPhase(ALL);
		setCtx(ALL);
		setQ("");
		resetLimits();
	};

	const changeStatus = (task: Task, from: Status, to: Status) => {
		if (from === to) return;
		// Kart bulunduğu sütundan çıkar. Odak aynı sıradaki bir sonraki karta geçer.
		const items = byStatus(from).slice(0, limits[from]);
		const i = items.findIndex((t) => t.id === task.id);
		const next = items[i + 1] || items[i - 1];
		const map = { ...statuses, [task.id]: to };
		setStatuses(map);
		saveStatuses(map);
		setFocusTarget(next ? next.id : wide ? `kanban-baslik-${STATUSES.indexOf(from)}` : tabId(from));
	};

	const showMore = (s: Status) => {
		const items = byStatus(s);
		const first = items[limits[s]];
		setLimits({ ...limits, [s]: limits[s] + PAGE });
		if (first) setFocusTarget(first.id);
	};

	const onTabKey = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
		const last = STATUSES.length - 1;
		const to = { ArrowRight: i + 1, ArrowDown: i + 1, ArrowLeft: i - 1, ArrowUp: i - 1, Home: 0, End: last }[e.key];
		if (to === undefined) return;
		e.preventDefault();
		const n = (to + STATUSES.length) % STATUSES.length;
		setColumn(STATUSES[n]);
		tabRefs.current[n]?.focus();
	};

	// Satır listesinde yukarı ve aşağı okla gezinme. Home ilk satıra, End son satıra gider.
	const onRowKey = (e: KeyboardEvent<HTMLDivElement>) => {
		const yon = { ArrowDown: 1, ArrowUp: -1, Home: 0, End: 0 }[e.key];
		if (yon === undefined) return;
		const liste = e.currentTarget;
		const satirlar = Array.from(liste.querySelectorAll<HTMLElement>("[data-task-card]"));
		if (satirlar.length === 0) return;
		const simdiki = (e.target as HTMLElement).closest<HTMLElement>("[data-task-card]");
		const i = simdiki ? satirlar.indexOf(simdiki) : -1;
		let hedef: HTMLElement | undefined;
		if (e.key === "Home") hedef = satirlar[0];
		else if (e.key === "End") hedef = satirlar[satirlar.length - 1];
		else hedef = satirlar[Math.min(Math.max(i + yon, 0), satirlar.length - 1)];
		if (!hedef || hedef === simdiki) return;
		e.preventDefault();
		hedef.focus();
	};

	const renderColumn = (s: Status) => {
		const items = byStatus(s);
		const shown = Math.min(limits[s], items.length);
		return (
			<Flex vertical gap={16} style={{ marginTop: "var(--space-1)" }}>
				{items.length === 0 && (
					<Typography.Paragraph type="secondary" data-kanban-empty style={{ padding: "var(--space-3) 0", marginBottom: 0 }}>
						Bu sütunda görev yok. Bir görevi buraya taşımak için satırdaki durum noktasına dokunun.
					</Typography.Paragraph>
				)}
				{items.length > 0 && (
					<Flex vertical role="list" aria-label={`${s} sütunundaki görevler`} onKeyDown={onRowKey}>
						{items.slice(0, limits[s]).map((t, i) => (
							<TaskRow key={t.id} task={t} status={statusOf(t.id)} ilk={i === 0} onStatus={(v) => changeStatus(t, s, v)} />
						))}
					</Flex>
				)}
				{items.length > limits[s] && (
					<Flex vertical gap={8}>
						<Typography.Text type="secondary">
							{items.length} görevden {shown} tanesi görünüyor.
						</Typography.Text>
						<Button block onClick={() => showMore(s)}>
							{Math.min(PAGE, items.length - limits[s])} görev daha göster
						</Button>
					</Flex>
				)}
			</Flex>
		);
	};

	return (
		<AppShell active="/kanban/" crumbs={[{ title: "Genel bakış", href: "/" }, { title: "Kanban" }]}>
			{/* Başlık, sayı ve yardım tek satırda. Liste ekranın üstüne yaklaşsın. */}
			<header data-sayfa-basi data-kanban-bas>
				<div data-kanban-basyer>
				<Typography.Title level={1} data-kanban-sayfa-basligi>
					Kanban
				</Typography.Title>
				<span data-kanban-toplam>{tasks.length} görev</span>
				{wide && (
					<Segmented<"liste" | "pano">
						aria-label="Görünüm"
						data-kanban-gorunum
						value={gorunum}
						onChange={gorunumSec}
						options={[
							{ value: "liste", label: "Liste", icon: <UnorderedListOutlined aria-hidden /> },
							{ value: "pano", label: "Pano", icon: <AppstoreOutlined aria-hidden /> },
						]}
						style={{ marginInlineStart: "auto" }}
					/>
				)}
				<details data-kanban-nasil onToggle={(e) => setHowOpen(e.currentTarget.open)}>
					<summary>
						Nasıl çalışır?
						<DownOutlined aria-hidden style={{ fontSize: 12, transform: howOpen ? "rotate(180deg)" : "none" }} />
					</summary>
					<Typography.Paragraph type="secondary" style={{ maxWidth: "var(--measure)", marginBottom: 0, marginTop: "var(--space-2)" }}>
						Her satır bir görevdir. Görevin durumunu soldaki renkli noktadan değiştirin. Durum yalnız bu tarayıcıda saklanır. Kopyala düğmesi görevi bütün ayrıntısıyla panoya alır. Başlığa dokununca görevin sayfası açılır.
					</Typography.Paragraph>
				</details>
				</div>
			</header>
			<Flex gap={8} data-kanban-suzgec style={{ marginBottom: 8 }}>
				<Input
					aria-label="Görev ara"
					placeholder="Görev ara"
					allowClear
					value={q}
					prefix={<SearchOutlined aria-hidden />}
					onChange={(e) => {
						setQ(e.target.value);
						resetLimits();
					}}
					// tokens.css hedef kuralı iç alana da uygulanıyor. Kutu 63 px oluyor. Yükseklik yalnız sarmalayıcıdan gelir.
					styles={{ input: { minHeight: 0 } }}
					style={{ flex: "1 1 0", minWidth: 0 }}
				/>
				<Select
					aria-label="Faz süzgeci"
					value={phase}
					popupMatchSelectWidth={false}
					labelRender={({ value }) => (value === ALL ? "Bütün fazlar" : phaseLabel(String(value)))}
					onChange={(v) => {
						setPhase(v);
						resetLimits();
					}}
					options={phases.map((p) => ({ value: p, label: p === ALL ? "Bütün fazlar" : `${phaseLabel(p)} (${tasks.filter((t) => t.phase === p).length} görev)` }))}
					style={{ flex: "0 0 auto", width: roomy ? 200 : 128 }}
				/>
				<Select
					aria-label="Bağlam süzgeci"
					value={ctx}
					popupMatchSelectWidth={false}
					showSearch={{ optionFilterProp: "label" }}
					labelRender={({ value }) => (value === ALL ? "Bütün bağlamlar" : ctxLabel(String(value)))}
					onChange={(v) => {
						setCtx(v);
						resetLimits();
					}}
					options={ctxs.map((c) => ({ value: c, label: c === ALL ? "Bütün bağlamlar" : `${ctxLabel(c)} (${tasks.filter((t) => t.ctx === c).length} görev)` }))}
					style={{ flex: "0 0 auto", width: roomy ? 240 : 150 }}
				/>
			</Flex>
			<Flex wrap align="center" gap={8} style={filtering ? { marginBottom: 8, minHeight: "var(--hit)" } : undefined}>
				<Typography.Text role="status" aria-live="polite" data-kanban-sonuc style={filtering ? undefined : srOnly}>
					{!filtering ? `Toplam ${filtered.length} görev var.` : filtered.length ? `${filtered.length} görev bulundu.` : "Hiç görev bulunamadı."}
				</Typography.Text>
				{filtering && filtered.length > 0 && (
					<Button type="link" onClick={clearFilters} style={{ paddingInline: 4 }}>
						Aramayı ve seçimleri temizle
					</Button>
				)}
			</Flex>
			{filtered.length === 0 ? (
				<div data-kanban-empty style={{ padding: "var(--space-4) 0" }}>
					<Typography.Paragraph strong style={{ marginBottom: 4 }}>
						Aramanıza uyan görev yok.
					</Typography.Paragraph>
					<Typography.Paragraph type="secondary" style={{ marginBottom: 12 }}>
						Başka bir kelime deneyin. Faz ve bağlam seçimini de değiştirebilirsiniz.
					</Typography.Paragraph>
					<Button onClick={clearFilters}>Aramayı ve seçimleri temizle</Button>
				</div>
			) : wide && gorunum === "liste" ? (
				<div data-kanban-liste>
					{/* Sütun başlığı olmadan değerler okunmuyor. "Genel" yazısı tek başına
					    bir şey söylemez, "Bağlam" başlığıyla birlikte söyler. */}
					<div data-kanban-liste-baslik aria-hidden>
						<span />
						<span>Görev</span>
						<span>Öncelik</span>
						<span>Faz</span>
						<span>Durum</span>
						<span>Bağlam</span>
						<span />
					</div>
					<Flex vertical role="list" aria-label="Bütün görevler" onKeyDown={onRowKey}>
						{filtered.slice(0, listeSiniri).map((t, i, dizi) => (
							<TaskRow
								key={t.id}
								task={t}
								status={statusOf(t.id)}
								ilk={i === 0}
								fazBasi={i > 0 && dizi[i - 1].phase !== t.phase}
								onStatus={(v) => changeStatus(t, statusOf(t.id), v)}
							/>
						))}
					</Flex>
					{filtered.length > listeSiniri && (
						<Flex vertical gap={8} style={{ marginTop: "var(--space-3)" }}>
							<Button
								onClick={() => {
									const ilk = filtered[listeSiniri];
									setListeSiniri(listeSiniri + PAGE);
									if (ilk) setFocusTarget(ilk.id);
								}}
							>
								{Math.min(PAGE, filtered.length - listeSiniri)} görev daha göster
							</Button>
							<Typography.Text type="secondary">
								{listeSiniri} / {filtered.length} görev görünüyor.
							</Typography.Text>
						</Flex>
					)}
				</div>
			) : wide ? (
				<Row gutter={24} wrap={false} data-kanban-board style={{ marginTop: "var(--space-2)" }}>
					{STATUSES.map((s, i) => (
						<Col key={s} flex="1 1 0" style={{ minWidth: 0 }}>
							<Typography.Title
								level={2}
								id={`kanban-baslik-${i}`}
								tabIndex={-1}
								style={{
									position: "sticky",
								top: headerOffset,
								zIndex: 2,
								marginTop: 0,
								marginBottom: 0,
								fontSize: "var(--text-body)",
								fontWeight: 600,
								lineHeight: 1.4,
								background: "var(--color-bg)",
								padding: "var(--space-1) 0",
								borderRadius: 0,
								borderBottom: "2px solid var(--color-ink)",
							}}
						>
							{/* tokens.css her h2'ye zorunlu 24 px verir. Sütun başlığı bir etikettir, bu yüzden yazı iç öğede küçülür. */}
							<span style={{ fontSize: "var(--text-body)" }}>
								{s} <span style={{ color: "var(--color-text-muted)", fontWeight: 400 }}>{counts[s]}</span>
							</span>
							</Typography.Title>
							{i < STATUSES.length - 1 && <SkipButton label={`“${STATUSES[i + 1]}” sütununa geç`} onSkip={() => setFocusTarget(`kanban-baslik-${i + 1}`)} />}
							{renderColumn(s)}
						</Col>
					))}
				</Row>
			) : (
				<>
					<div
						role="tablist"
						aria-label="Kanban sütunları"
						data-kanban-tablist
					>
						{STATUSES.map((s, i) => {
							const on = s === column;
							return (
								<button
									key={s}
									ref={(el) => {
										tabRefs.current[i] = el;
									}}
									type="button"
									role="tab"
									id={tabId(s)}
									aria-selected={on}
									aria-label={`${s}: ${counts[s]} görev`}
									aria-controls={panelId}
									tabIndex={on ? 0 : -1}
									data-kanban-tab={s}
									onClick={() => setColumn(s)}
									onKeyDown={(e) => onTabKey(e, i)}
									onPointerEnter={(e) => e.pointerType === "mouse" && setHoverTab(s)}
									onPointerLeave={() => setHoverTab(null)}
									style={{
										borderBottom: on ? "2px solid var(--color-ink)" : "2px solid var(--color-hairline)",
										background: hoverTab === s && !on ? "var(--color-surface)" : "transparent",
									}}
								>
									<span style={{ fontWeight: on ? 600 : 400 }}>{s}</span>
									<span data-kanban-tab-sayi>{counts[s]}</span>
								</button>
							);
						})}
					</div>
					<div role="tabpanel" id={panelId} aria-labelledby={tabId(column)}>
						{renderColumn(column)}
					</div>
				</>
			)}
		</AppShell>
	);
}
