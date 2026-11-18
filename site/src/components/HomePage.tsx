import { Alert, Card, Col, Collapse, Flex, List, Row, Statistic, Typography } from "antd";
import { ArrowRightOutlined } from "@ant-design/icons";
import { AppShell } from "./AppShell";
import { Html } from "./bits";
import { url } from "../lib/base";

type Phase = { id: string; label: string; slug: string; title: string; summary: string; count: number };

export default function HomePage(props: { phases: Phase[]; overviewHtml: string; counts: { doctypes: number; contexts: number; tasks: number; epics: number } }) {
	const { phases, overviewHtml, counts } = props;
	return (
		<AppShell active="/" crumbs={[]}>
			<Typography.Title level={1} style={{ marginTop: 8 }}>
				tradehub_core modüler monolit planı
			</Typography.Title>
			<Typography.Paragraph style={{ fontSize: 18, maxWidth: "62ch" }}>
				Bu site 326 DocType'ın raporunu, 16 iş bağlamının planını ve geçiş fazlarını gösterir. Her görevi tek tıkla kopyalayabilirsiniz.
			</Typography.Paragraph>
			<Alert
				type="info"
				showIcon
				title="Bu plan nasıl kullanılır?"
				description="Önce Faz −1 görevlerini bitirin. Bu faz bitmeden kod taşımayın. Her görevde characterization test, shadow mode, TDD ve feature flag zorunludur. Görevi kopyalayınca ajan talimatı da metne eklenir."
				style={{ marginBottom: 24 }}
			/>
			<Row gutter={[12, 12]} style={{ marginBottom: 24 }}>
				{[
					["DocType", counts.doctypes],
					["İş bağlamı", counts.contexts],
					["Görev", counts.tasks],
					["Hazır epic", counts.epics],
				].map(([t, v]) => (
					<Col xs={12} md={6} key={String(t)}>
						<Card size="small" variant="outlined">
							<Statistic title={String(t)} value={Number(v)} />
						</Card>
					</Col>
				))}
			</Row>
			<Typography.Title level={2}>Fazlar</Typography.Title>
			<List
				dataSource={phases}
				renderItem={(p) => (
					<List.Item>
						<a href={url(`/fazlar/${p.slug}/`)} style={{ display: "block", width: "100%", minHeight: 44, textDecoration: "none", color: "inherit" }}>
							<Flex justify="space-between" align="center" gap={12}>
								<div>
									<Typography.Text strong style={{ fontSize: 18 }}>
										{p.label}: {p.title}
									</Typography.Text>
									<br />
									<Typography.Text type="secondary">{p.summary} {p.count} görev var.</Typography.Text>
								</div>
								<ArrowRightOutlined aria-hidden />
							</Flex>
						</a>
					</List.Item>
				)}
			/>
			<Typography.Title level={2} style={{ marginTop: 32 }}>
				Genel plan
			</Typography.Title>
			<Collapse
				items={[{ key: "plan", label: "Genel mimari planın tamamını göster", children: <Html html={overviewHtml} /> }]}
			/>
		</AppShell>
	);
}
