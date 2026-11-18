import { useEffect, useMemo, useState } from "react";
import { App, Button, Card, Col, Empty, Flex, Grid, Input, Row, Select, Space, Tabs, Typography } from "antd";
import { LinkOutlined, SearchOutlined } from "@ant-design/icons";
import { AppShell } from "./AppShell";
import { CopyButton, Inline, PlainTag, PriorityTag } from "./bits";
import { loadStatuses, PHASE_ORDER, phaseLabel, PRIORITY_ORDER, saveStatuses, STATUSES, taskToText, type DoctypeSummary, type Status, type Task } from "../lib/tasks";
import { url } from "../lib/base";

const PAGE = 30;

function TaskCard({ task, doc, status, onStatus }: { task: Task; doc?: DoctypeSummary; status: Status; onStatus: (s: Status) => void }) {
	// Bildirim, AntApp sağlayıcısının içinde çalışan bu bileşenden gönderilir.
	const { message } = App.useApp();
	return (
		<Card size="small" data-task-card={task.id} data-status={status} styles={{ body: { padding: 12 } }}>
			<Flex wrap gap={6} style={{ marginBottom: 8 }}>
				<PriorityTag value={task.priority} />
				<PlainTag>{phaseLabel(task.phase)}</PlainTag>
				<PlainTag>{task.kind}</PlainTag>
			</Flex>
			<Typography.Paragraph strong style={{ marginBottom: 4, fontSize: 16 }}>
				<Inline html={task.titleHtml} text={task.title} />
			</Typography.Paragraph>
			<Typography.Text type="secondary">{task.ctx}</Typography.Text>
			<Flex wrap gap={8} style={{ marginTop: 12 }}>
				<CopyButton text={taskToText(task, doc)} label="Kopyala" ariaLabel={`Kopyala: ${task.title}`} primary />
				<Button href={url(task.href)} icon={<LinkOutlined />} aria-label={`${task.title} sayfasını aç`}>
					Aç
				</Button>
				<Select<Status>
					aria-label={`Durum: ${task.title}`}
					value={status}
					onChange={(v) => {
						onStatus(v);
						message.success(`Görev ${v} sütununa taşındı`);
						// Kart görünür sütundan çıkabilir. Odak kaybolmasın diye sütun başlığına taşınır.
						requestAnimationFrame(() => document.getElementById("kanban-sutun")?.focus());
					}}
					options={STATUSES.map((s) => ({ value: s, label: s }))}
					style={{ minWidth: 160, flex: 1 }}
				/>
			</Flex>
		</Card>
	);
}

export default function KanbanPage({ tasks, docs }: { tasks: Task[]; docs: DoctypeSummary[] }) {
	const screens = Grid.useBreakpoint();
	const wide = !!screens.lg;
	const docMap = useMemo(() => new Map(docs.map((d) => [d.id, d])), [docs]);
	const [statuses, setStatuses] = useState<Record<string, Status>>({});
	const [column, setColumn] = useState<Status>("Yapılacak");
	const [phase, setPhase] = useState("tümü");
	const [ctx, setCtx] = useState("tümü");
	const [q, setQ] = useState("");
	const [limit, setLimit] = useState(PAGE);
	useEffect(() => setStatuses(loadStatuses()), []);

	const statusOf = (id: string): Status => statuses[id] || "Yapılacak";
	const setStatus = (id: string, s: Status) => {
		const next = { ...statuses, [id]: s };
		setStatuses(next);
		saveStatuses(next);
	};
	const phases = useMemo(() => ["tümü", ...PHASE_ORDER.filter((p) => tasks.some((t) => t.phase === p))], [tasks]);
	const ctxs = useMemo(() => ["tümü", ...Array.from(new Set(tasks.map((t) => t.ctx))).sort()], [tasks]);
	const filtered = useMemo(
		() =>
			tasks
				.filter((t) => (phase === "tümü" || t.phase === phase) && (ctx === "tümü" || t.ctx === ctx))
				.filter((t) => !q || t.title.toLocaleLowerCase("tr").includes(q.toLocaleLowerCase("tr")))
				.sort((a, b) => PHASE_ORDER.indexOf(a.phase) - PHASE_ORDER.indexOf(b.phase) || PRIORITY_ORDER.indexOf(a.priority) - PRIORITY_ORDER.indexOf(b.priority)),
		[tasks, phase, ctx, q],
	);
	const byStatus = (s: Status) => filtered.filter((t) => statusOf(t.id) === s);
	const counts = Object.fromEntries(STATUSES.map((s) => [s, byStatus(s).length])) as Record<Status, number>;

	const renderColumn = (s: Status) => {
		const items = byStatus(s);
		return (
			<Flex vertical gap={12}>
				{items.length === 0 && <Empty description={`"${s}" sütununda görev yok`} />}
				{items.slice(0, limit).map((t) => (
					<TaskCard key={t.id} task={t} doc={docMap.get(t.id)} status={statusOf(t.id)} onStatus={(v) => setStatus(t.id, v)} />
				))}
				{items.length > limit && (
					<Button block onClick={() => setLimit(limit + PAGE)}>
						{Math.min(PAGE, items.length - limit)} görev daha göster
					</Button>
				)}
			</Flex>
		);
	};

	return (
		<AppShell active="/kanban/" crumbs={[{ title: "Genel bakış", href: "/" }, { title: "Kanban" }]}>
			<Typography.Title level={1}>Kanban</Typography.Title>
			<Typography.Paragraph>
				Görevin durumunu "Durum" kutusundan değiştirin. Durum yalnız bu tarayıcıda saklanır. "Kopyala" düğmesi görevi bütün ayrıntısıyla panoya alır.
			</Typography.Paragraph>
			<div id="kanban-sutun" tabIndex={-1} aria-label="Kanban sütunları" style={{ outline: "none" }} />
			<Space orientation="vertical" style={{ width: "100%", marginBottom: 16 }} size={8}>
				<Input
					aria-label="Görev ara"
					placeholder="Görev ara"
					allowClear
					prefix={<SearchOutlined aria-hidden />}
					onChange={(e) => {
						setQ(e.target.value);
						setLimit(PAGE);
					}}
				/>
				<Flex wrap gap={8}>
					<Select aria-label="Faz süzgeci" value={phase} onChange={setPhase} options={phases.map((p) => ({ value: p, label: p === "tümü" ? "Bütün fazlar" : phaseLabel(p) }))} style={{ minWidth: 150, flex: 1 }} />
					<Select aria-label="Bağlam süzgeci" value={ctx} onChange={setCtx} options={ctxs.map((c) => ({ value: c, label: c === "tümü" ? "Bütün bağlamlar" : c }))} style={{ minWidth: 200, flex: 2 }} />
				</Flex>
			</Space>
			{wide ? (
				<div style={{ overflowX: "auto" }}>
					<Row gutter={12} wrap={false} style={{ minWidth: 1080 }}>
						{STATUSES.map((s) => (
							<Col key={s} flex="1 1 0">
								<Typography.Title level={2} style={{ fontSize: 18, background: "var(--color-surface-strong)", padding: "8px 12px", borderRadius: 6 }}>
									{s} ({counts[s]})
								</Typography.Title>
								{renderColumn(s)}
							</Col>
						))}
					</Row>
				</div>
			) : (
				<>
					<Tabs
						activeKey={column}
						onChange={(k) => setColumn(k as Status)}
						items={STATUSES.map((st) => ({ key: st, label: `${st} (${counts[st]})` }))}
						style={{ marginBottom: 4 }}
					/>
					{renderColumn(column)}
				</>
			)}
		</AppShell>
	);
}
