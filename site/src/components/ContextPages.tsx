import { useEffect, useState } from "react";
import { Card, Col, Collapse, Flex, Progress, Row, Statistic, Table, Typography } from "antd";
import { AppShell } from "./AppShell";
import { Html, PlainTag, PriorityTag } from "./bits";
import { loadStatuses, PRIORITY_ORDER, type DoctypeSummary, type Status } from "../lib/tasks";
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
			<Typography.Title level={1}>İş bağlamları</Typography.Title>
			<Typography.Paragraph>Her bağlam ayrı bir modül olacak. Bir bağlam seçip planını ve epic'lerini açın.</Typography.Paragraph>
			<Row gutter={[12, 12]}>
				{contexts.map((c) => {
					const ds = docs.filter((d) => d.ctx === c.ctx);
					return (
						<Col xs={24} md={12} xl={8} key={c.ctx}>
							<ContextCard c={c} ds={ds} />
						</Col>
					);
				})}
			</Row>
		</AppShell>
	);
}

function ContextCard({ c, ds }: { c: Ctx; ds: DoctypeSummary[] }) {
	const done = useDone(ds.map((d) => d.id));
	const crit = ds.filter((d) => ["Kriz", "Kritik"].includes(d.epic?.priority || "")).length;
	return (
		<Card size="small" title={<a href={url(`/baglamlar/${c.ctx}/`)}>{c.ctx}</a>} style={{ height: "100%" }}>
			<Typography.Paragraph ellipsis={{ rows: 2 }}>{c.title}</Typography.Paragraph>
			<Flex wrap gap={8} style={{ marginBottom: 8 }}>
				<PlainTag>{ds.length} DocType</PlainTag>
				{crit > 0 && <PriorityTag value="Kritik" />}
			</Flex>
			<Progress percent={ds.length ? Math.round((100 * done) / ds.length) : 0} strokeLinecap="square" format={(p) => `%${p} bitti`} />
		</Card>
	);
}

export function ContextPage({ c, docs }: { c: Ctx; docs: DoctypeSummary[] }) {
	const done = useDone(docs.map((d) => d.id));
	const rows = [...docs].sort(
		(a, b) => PRIORITY_ORDER.indexOf(a.epic?.priority || "Önemli") - PRIORITY_ORDER.indexOf(b.epic?.priority || "Önemli") || a.title.localeCompare(b.title, "tr"),
	);
	return (
		<AppShell active="/baglamlar/" crumbs={[{ title: "Genel bakış", href: "/" }, { title: "Bağlamlar", href: "/baglamlar/" }, { title: c.ctx }]}>
			<Typography.Title level={1}>{c.ctx}</Typography.Title>
			<Typography.Paragraph style={{ fontSize: 18 }}>{c.title}</Typography.Paragraph>
			<Row gutter={[12, 12]} style={{ marginBottom: 24 }}>
				<Col xs={12} md={6}>
					<Card size="small">
						<Statistic title="DocType" value={docs.length} />
					</Card>
				</Col>
				<Col xs={12} md={6}>
					<Card size="small">
						<Statistic title="Biten epic" value={done} suffix={`/ ${docs.length}`} />
					</Card>
				</Col>
			</Row>
			<Typography.Title level={2}>Epic'ler</Typography.Title>
			<Table
				size="middle"
				rowKey="id"
				dataSource={rows}
				pagination={{ pageSize: 20, hideOnSinglePage: true }}
				scroll={{ x: 640 }}
				columns={[
					{ title: "DocType", dataIndex: "title", width: 240, render: (t: string, d: DoctypeSummary) => <a href={url(`/doctype/${d.ctx}/${d.slug}/`)} style={{ wordBreak: "normal", overflowWrap: "normal" }}>{t}</a> },
					{ title: "Öncelik", width: 120, render: (_: unknown, d: DoctypeSummary) => <PriorityTag value={d.epic?.priority || "Önemli"} /> },
					{ title: "Faz", width: 100, render: (_: unknown, d: DoctypeSummary) => d.epic?.phase || "Faz 4" },
					{ title: "Tür", render: (_: unknown, d: DoctypeSummary) => d.meta["Tür"] || "" },
				]}
			/>
			<Typography.Title level={2} style={{ marginTop: 32 }}>
				Bağlam planı
			</Typography.Title>
			<Collapse
				defaultActiveKey={["0"]}
				items={c.sections.map((s, i) => ({ key: String(i), label: s.title, children: <Html html={s.html} /> }))}
			/>
		</AppShell>
	);
}
