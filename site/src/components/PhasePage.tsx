import { useMemo, useState } from "react";
import { Button, Card, Checkbox, Collapse, Empty, Flex, List, Select, Space, Typography } from "antd";
import { CloseCircleFilled } from "@ant-design/icons";
import { AppShell } from "./AppShell";
import { CopyButton, Inline, PlainTag, PriorityTag } from "./bits";
import { taskToText, type DoctypeSummary, type Phase, type Task } from "../lib/tasks";
import { url } from "../lib/base";

type GuideRef = { slug: string; title: string };

function Checks({ items, html }: { items: string[]; html?: string[] }) {
	const [on, setOn] = useState<Record<number, boolean>>({});
	return (
		<List
			size="small"
			dataSource={items}
			renderItem={(t, i) => (
				<List.Item>
					<Checkbox checked={!!on[i]} onChange={(e) => setOn({ ...on, [i]: e.target.checked })} style={{ fontSize: 16 }}>
						<Inline html={html?.[i]} text={t} />
					</Checkbox>
				</List.Item>
			)}
		/>
	);
}

function PhaseTask({ task, index, guides }: { task: Task; index: number; guides: GuideRef[] }) {
	const refs = (task.guides || []).map((g) => guides.find((x) => x.slug === g)).filter(Boolean) as GuideRef[];
	return (
		<Card
			id={`gorev-${index + 1}`}
			size="small"
			title={
				<Typography.Title level={3} style={{ margin: 0, fontSize: 18, whiteSpace: "normal" }}>
					{index + 1}. <Inline html={task.titleHtml} text={task.title} />
				</Typography.Title>
			}
			styles={{ header: { padding: "12px" }, body: { padding: 12 } }}
		>
			<Flex wrap gap={8} style={{ marginBottom: 12 }}>
				<PriorityTag value={task.priority} />
				{task.owner && <PlainTag>Sorumlu: {task.owner}</PlainTag>}
			</Flex>
			{task.story && <blockquote className="story">{task.story}</blockquote>}
			<div style={{ margin: "12px 0" }}>
				<CopyButton text={taskToText(task)} label="Görevi kopyala" ariaLabel={`Görevi kopyala: ${task.title}`} primary />
			</div>
			<Collapse
				defaultActiveKey={["kabul"]}
				items={[
					{ key: "kabul", label: `Kabul kriterleri (${task.acceptance?.length || 0})`, children: <Checks items={task.acceptance || []} html={task.html?.acceptance} /> },
					{
						key: "yapma",
						label: `Yapmamanız gerekenler (${task.donts?.length || 0})`,
						children: (
							<List
								size="small"
								dataSource={task.donts || []}
								renderItem={(t, i) => (
									<List.Item>
										<Flex gap={10} align="start">
											<CloseCircleFilled style={{ color: "#a8071a", fontSize: 18, marginTop: 4 }} aria-hidden />
											<Typography.Text style={{ fontSize: 16 }}>
												<Inline html={task.html?.donts[i]} text={t} />
											</Typography.Text>
										</Flex>
									</List.Item>
								)}
							/>
						),
					},
					{ key: "kontrol", label: `Kontrol listesi (${task.checklist?.length || 0})`, children: <Checks items={task.checklist || []} html={task.html?.checklist} /> },
				]}
			/>
			{refs.length > 0 && (
				<Flex wrap gap={8} style={{ marginTop: 12 }} aria-label="Yönergeler">
					{refs.map((g) => (
						<Button key={g.slug} href={url(`/yonergeler/${g.slug}/`)} style={{ whiteSpace: "normal", height: "auto", minHeight: 44, textAlign: "start" }}>
							Yönerge: {g.title}
						</Button>
					))}
				</Flex>
			)}
		</Card>
	);
}

export default function PhasePage(props: { phase: Phase; phases: { id: string; label: string; slug: string }[]; guides: GuideRef[]; epics: { task: Task; doc: DoctypeSummary }[] }) {
	const { phase, phases, guides, epics } = props;
	const [ctx, setCtx] = useState<string>("tümü");
	const ctxOptions = useMemo(() => ["tümü", ...Array.from(new Set(epics.map((e) => e.task.ctx))).sort()], [epics]);
	const shown = epics.filter((e) => ctx === "tümü" || e.task.ctx === ctx);
	return (
		<AppShell active="/fazlar/faz-eksi-1/" crumbs={[{ title: "Genel bakış", href: "/" }, { title: "Fazlar", href: "/fazlar/faz-eksi-1/" }, { title: phase.label }]}>
			<nav aria-label="Fazlar" style={{ marginBottom: 16 }}>
				<Flex wrap gap={8}>
					{phases.map((p) => {
						const current = p.id === phase.id;
						return (
							<Button key={p.id} href={url(`/fazlar/${p.slug}/`)} type={current ? "primary" : "default"} aria-current={current ? "page" : undefined}>
								{p.label}
							</Button>
						);
					})}
				</Flex>
			</nav>
			<Typography.Title level={1}>
				{phase.label}: {phase.title}
			</Typography.Title>
			<Typography.Paragraph style={{ fontSize: 18, maxWidth: "62ch" }}>{phase.summary}</Typography.Paragraph>
			<Typography.Title level={2}>Görevler ({phase.tasks.length})</Typography.Title>
			<Flex vertical gap={16}>
				{phase.tasks.map((t, i) => (
					<PhaseTask key={t.id} task={t} index={i} guides={guides} />
				))}
			</Flex>
			<Typography.Title level={2} style={{ marginTop: 32 }}>
				Bu fazdaki epic'ler ({shown.length})
			</Typography.Title>
			{epics.length === 0 ? (
				<Empty description="Bu fazda DocType epic'i yok." />
			) : (
				<>
					<Space style={{ marginBottom: 12 }} wrap>
						<Typography.Text>Bağlam:</Typography.Text>
						<Select aria-label="Bağlam süzgeci" value={ctx} onChange={setCtx} options={ctxOptions.map((c) => ({ value: c, label: c }))} style={{ minWidth: 220 }} />
					</Space>
					<Flex vertical gap={12}>
						{shown.map(({ task, doc }) => (
							<Card key={task.id} size="small" title={<a href={url(task.href)}>{doc.title}</a>}>
								<Flex wrap gap={8} style={{ marginBottom: 8 }}>
									<PriorityTag value={task.priority} />
									<PlainTag>{task.ctx}</PlainTag>
									{task.size && <PlainTag>{task.size}</PlainTag>}
								</Flex>
								{doc.epic?.story && <Typography.Paragraph>{doc.epic.story}</Typography.Paragraph>}
								<CopyButton text={taskToText(task, doc)} label="Epic'i kopyala" ariaLabel={`Epic'i kopyala: ${doc.title}`} />
							</Card>
						))}
					</Flex>
				</>
			)}
		</AppShell>
	);
}
