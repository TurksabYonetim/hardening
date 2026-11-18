import { useState } from "react";
import { Button, Checkbox, Collapse, Descriptions, Empty, Flex, List, Tabs, Typography } from "antd";
import { CloseCircleFilled, LeftOutlined, RightOutlined } from "@ant-design/icons";
import { AppShell } from "./AppShell";
import { CopyButton, Html, Inline, PlainTag, PriorityTag } from "./bits";
import { taskToText, type DoctypeSummary, type Task } from "../lib/tasks";
import { url } from "../lib/base";

type Section = { title: string; html: string; md: string };

// Uzun DocType adları dar ekranda taşmasın diye düğme metni satır atlayabilir.
const NAV_BTN = { whiteSpace: "normal", height: "auto", minHeight: 44, maxWidth: "100%", textAlign: "start" } as const;

function CheckList({ items, html, empty }: { items: string[]; html?: string[]; empty: string }) {
	const [checked, setChecked] = useState<Record<number, boolean>>({});
	if (!items.length) return <Empty description={empty} />;
	return (
		<List
			dataSource={items}
			renderItem={(t, i) => (
				<List.Item>
					<Checkbox checked={!!checked[i]} onChange={(e) => setChecked({ ...checked, [i]: e.target.checked })} style={{ fontSize: 16 }}>
						<Inline html={html?.[i]} text={t} />
					</Checkbox>
				</List.Item>
			)}
		/>
	);
}

function Heading({ children }: { children: string }) {
	return (
		<Typography.Title level={2} style={{ marginTop: 24, fontSize: 20 }}>
			{children}
		</Typography.Title>
	);
}

export default function DoctypePage(props: { doc: DoctypeSummary; sections: Section[]; md: string; task: Task; prev?: DoctypeSummary; next?: DoctypeSummary }) {
	const { doc, sections, md, task, prev, next } = props;
	const e = doc.epic;
	const missing = "Bu bölüm rapora henüz eklenmedi.";
	const epicTab = (
		<>
			<Heading>User story</Heading>
			{e?.story ? (
				<blockquote className="story">
					<Inline html={e.html?.story} text={e.story} />
				</blockquote>
			) : (
				<Empty description={missing} />
			)}
			<Heading>Kabul kriterleri</Heading>
			<CheckList items={e?.acceptance || []} html={e?.html?.acceptance} empty={missing} />
			<Heading>Yapmamanız gerekenler</Heading>
			{e?.donts?.length ? (
				<List
					dataSource={e.donts}
					renderItem={(t, i) => (
						<List.Item>
							<Flex gap={10} align="start">
								<CloseCircleFilled style={{ color: "#a8071a", fontSize: 18, marginTop: 4 }} aria-hidden />
								<Typography.Text style={{ fontSize: 16 }}>
									<Inline html={e.html?.donts[i]} text={t} />
								</Typography.Text>
							</Flex>
						</List.Item>
					)}
				/>
			) : (
				<Empty description={missing} />
			)}
			<Heading>Kontrol listesi</Heading>
			<CheckList items={e?.checklist || []} html={e?.html?.checklist} empty={missing} />
			<Heading>Geçiş adımları</Heading>
			{doc.steps.length ? (
				<List
					dataSource={doc.steps}
					renderItem={(s, i) => (
						<List.Item>
							<Flex vertical gap={8} style={{ width: "100%" }}>
								<Typography.Text style={{ fontSize: 16 }}>
									<strong>{i + 1}.</strong> <Inline html={doc.stepsHtml?.[i]} text={s} />
								</Typography.Text>
								<div>
									<CopyButton
										label={`${i + 1}. adımı kopyala`}
										text={`Görev: ${doc.title} geçiş adımı ${i + 1}\nKimlik: ${doc.id}#adim-${i + 1}\nAdım: ${s}\nKaynak rapor: mimari/doctypes/${doc.id}.md\nRepo: tradehub-tr/tradehub_core (dal: version-15)\n`}
									/>
								</div>
							</Flex>
						</List.Item>
					)}
				/>
			) : (
				<Empty description={missing} />
			)}
		</>
	);
	return (
		<AppShell
			active="/baglamlar/"
			crumbs={[
				{ title: "Genel bakış", href: "/" },
				{ title: "Bağlamlar", href: "/baglamlar/" },
				{ title: doc.ctx, href: `/baglamlar/${doc.ctx}/` },
				{ title: doc.title },
			]}
		>
			<Typography.Title level={1} style={{ marginBottom: 8 }}>
				{doc.title}
			</Typography.Title>
			<Flex wrap gap={8} style={{ marginBottom: 12 }}>
				<PriorityTag value={task.priority} />
				<PlainTag>{task.phase}</PlainTag>
				<a href={url("/yonergeler/")}>Yönergeler</a>
				{e?.size && <PlainTag>{e.size}</PlainTag>}
				<PlainTag>{doc.ctx}</PlainTag>
			</Flex>
			{e?.name && <Typography.Paragraph style={{ fontSize: 18 }}>{e.name}</Typography.Paragraph>}
			<Flex wrap gap={8} style={{ marginBottom: 16 }}>
				<CopyButton text={taskToText(task, doc)} label="Epic'i kopyala" primary />
				<CopyButton text={md} label="Raporun tamamını kopyala" />
			</Flex>
			<Descriptions
				size="small"
				column={{ xs: 1, md: 2 }}
				bordered
				items={Object.entries(doc.meta).map(([k, v]) => ({
					key: k,
					label: k,
					// Uzun dosya yolları kelime ortasından değil, "/" işaretinden sonra satır atlar.
					children: v
						.replace(/`/g, "")
						.split("/")
						.flatMap((part, i, arr) => (i < arr.length - 1 ? [part + "/", <wbr key={i} />] : [part])),
				}))}
				style={{ marginBottom: 16 }}
			/>
			<Tabs
				items={[
					{ key: "epic", label: "Epic", children: epicTab },
					{
						key: "rapor",
						label: "Rapor",
						children: (
							<Collapse
								defaultActiveKey={["0"]}
								items={sections.map((s, i) => ({ key: String(i), label: s.title, children: <Html html={s.html} /> }))}
							/>
						),
					},
				]}
			/>
			<Flex justify="space-between" gap={8} wrap style={{ marginTop: 32 }}>
				{prev ? (
					<Button href={url(`/doctype/${prev.ctx}/${prev.slug}/`)} icon={<LeftOutlined />} style={NAV_BTN} aria-label={`Önceki rapor: ${prev.title}`}>
						{prev.title}
					</Button>
				) : (
					<span />
				)}
				{next && (
					<Button href={url(`/doctype/${next.ctx}/${next.slug}/`)} icon={<RightOutlined />} iconPlacement="end" style={NAV_BTN} aria-label={`Sonraki rapor: ${next.title}`}>
						{next.title}
					</Button>
				)}
			</Flex>
		</AppShell>
	);
}
