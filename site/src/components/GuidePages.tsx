import { Alert, Button, Card, Flex, Typography } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { AppShell } from "./AppShell";
import { CopyButton, Html, Inline } from "./bits";
import { url } from "../lib/base";

type Guide = { slug: string; title: string; summary: string; html: string; md: string };
const NAV_BTN = { whiteSpace: "normal", height: "auto", minHeight: 44, maxWidth: "100%", textAlign: "start" } as const;

export function GuidesPage({ guides }: { guides: Omit<Guide, "html" | "md">[] }) {
	return (
		<AppShell active="/yonergeler/" crumbs={[{ title: "Genel bakış", href: "/" }, { title: "Yönergeler" }]}>
			<Typography.Title level={1}>Yönergeler</Typography.Title>
			<Typography.Paragraph style={{ fontSize: 18, maxWidth: "62ch" }}>
				Bu yönergeler her görevde uygulanır. Görevi kopyalayınca ajan talimatı metne kendiliğinden eklenir.
			</Typography.Paragraph>
			<Alert
				type="warning"
				showIcon
				title="Her görevde dört kriter zorunludur"
				description="Characterization test, shadow mode, TDD ve feature flag. Bu dört kriter olmadan görev bitmiş sayılmaz."
				style={{ marginBottom: 24 }}
			/>
			<Flex vertical gap={12}>
				{guides.map((g) => (
					<Card key={g.slug} size="small" data-guide={g.slug} title={<a href={url(`/yonergeler/${g.slug}/`)}>{g.title}</a>}>
						<Typography.Paragraph style={{ marginBottom: 0 }}>
							<Inline html={g.summary} text="" />
						</Typography.Paragraph>
					</Card>
				))}
			</Flex>
		</AppShell>
	);
}

export function GuidePage({ guide, prev, next }: { guide: Guide; prev?: { slug: string; title: string }; next?: { slug: string; title: string } }) {
	return (
		<AppShell active="/yonergeler/" crumbs={[{ title: "Genel bakış", href: "/" }, { title: "Yönergeler", href: "/yonergeler/" }, { title: guide.title }]}>
			<Typography.Title level={1}>{guide.title}</Typography.Title>
			<div style={{ marginBottom: 16 }}>
				<CopyButton text={guide.md} label="Yönergeyi kopyala" primary />
			</div>
			<Html html={guide.html} />
			<Flex justify="space-between" gap={8} wrap style={{ marginTop: 32 }}>
				{prev ? (
					<Button href={url(`/yonergeler/${prev.slug}/`)} icon={<LeftOutlined />} style={NAV_BTN} aria-label={`Önceki yönerge: ${prev.title}`}>
						{prev.title}
					</Button>
				) : (
					<span />
				)}
				{next && (
					<Button href={url(`/yonergeler/${next.slug}/`)} icon={<RightOutlined />} iconPlacement="end" style={NAV_BTN} aria-label={`Sonraki yönerge: ${next.title}`}>
						{next.title}
					</Button>
				)}
			</Flex>
		</AppShell>
	);
}
