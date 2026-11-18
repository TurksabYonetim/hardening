import { useEffect, useState, type ReactNode } from "react";
import { App as AntApp, Breadcrumb, Button, ConfigProvider, Drawer, Grid, Layout, Menu, Typography, FloatButton } from "antd";
import { MenuOutlined, HomeOutlined, ProjectOutlined, ApartmentOutlined, FlagOutlined, SafetyCertificateOutlined, VerticalAlignTopOutlined } from "@ant-design/icons";
import trTR from "antd/locale/tr_TR";
import { buildTheme } from "../lib/theme";
import { url } from "../lib/base";

const NAV = [
	{ key: "/", label: "Genel bakış", icon: <HomeOutlined /> },
	{ key: "/fazlar/faz-eksi-1/", label: "Fazlar", icon: <FlagOutlined /> },
	{ key: "/kanban/", label: "Kanban", icon: <ProjectOutlined /> },
	{ key: "/baglamlar/", label: "Bağlamlar", icon: <ApartmentOutlined /> },
	{ key: "/yonergeler/", label: "Yönergeler", icon: <SafetyCertificateOutlined /> },
];

function usePrefersReducedMotion(): boolean {
	const [reduced, setReduced] = useState(false);
	useEffect(() => {
		const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
		const on = () => setReduced(mq.matches);
		on();
		mq.addEventListener("change", on);
		return () => mq.removeEventListener("change", on);
	}, []);
	return reduced;
}

type Crumb = { title: string; href?: string };

export function AppShell({ active, crumbs, children }: { active: string; crumbs: Crumb[]; children: ReactNode }) {
	const reduced = usePrefersReducedMotion();
	return (
		<ConfigProvider theme={buildTheme(reduced)} locale={trTR}>
			<AntApp>
				<Shell active={active} crumbs={crumbs}>
					{children}
				</Shell>
			</AntApp>
		</ConfigProvider>
	);
}

function Shell({ active, crumbs, children }: { active: string; crumbs: Crumb[]; children: ReactNode }) {
	const screens = Grid.useBreakpoint();
	const wide = !!screens.lg;
	const [open, setOpen] = useState(false);
	const [readyFlag, setReady] = useState(false);
	useEffect(() => setReady(true), []);
	const go = (key: string) => {
		window.location.href = url(key);
	};
	const items = NAV.map((n) => ({ ...n, label: <a href={url(n.key)}>{n.label}</a> }));
	return (
		<Layout style={{ minHeight: "100vh", background: "var(--color-bg)" }} data-app-ready={readyFlag ? "" : undefined}>
			<Layout.Header
				style={{
					position: "sticky",
					top: 0,
					zIndex: 20,
					display: "flex",
					alignItems: "center",
					gap: 12,
					padding: "0 var(--page-gutter)",
					background: "#0a3d91",
					height: 56,
					lineHeight: "56px",
				}}
			>
				{!wide && (
					<Button
						type="text"
						aria-label="Menüyü aç"
						icon={<MenuOutlined style={{ fontSize: 20 }} />}
						onClick={() => setOpen(true)}
						style={{ minWidth: 44, height: 44, color: "#ffffff" }}
					/>
				)}
				<a href={url("/")} style={{ color: "#fff", fontWeight: 600, fontSize: 18, whiteSpace: "nowrap", textDecoration: "none" }}>
					İstoç mimari planı
				</a>
				{wide && (
					<Menu
						mode="horizontal"
						theme="dark"
						selectedKeys={[active]}
						items={items}
						style={{ flex: 1, minWidth: 0, background: "transparent", fontSize: 16 }}
					/>
				)}
			</Layout.Header>
			<Drawer
				title="Menü"
				placement="left"
				open={open}
				onClose={() => setOpen(false)}
				size={300}
				styles={{ body: { padding: 0 } }}
			>
				<Menu mode="inline" selectedKeys={[active]} items={items} onClick={(e) => go(e.key)} style={{ borderInlineEnd: 0, fontSize: 16 }} />
			</Drawer>
			<Layout.Content id="icerik" style={{ padding: "16px var(--page-gutter) 48px", width: "100%", maxWidth: 1200, margin: "0 auto" }}>
				{crumbs.length > 0 && (
					<Breadcrumb
						style={{ marginBottom: 12 }}
						items={crumbs.map((c) => ({ title: c.href ? <a href={url(c.href)}>{c.title}</a> : c.title }))}
					/>
				)}
				{children}
			</Layout.Content>
			<Layout.Footer style={{ background: "var(--color-surface)", padding: "16px var(--page-gutter)" }}>
				<Typography.Text style={{ fontSize: 14 }}>
					Kaynak: <code>~/Developer/istoc-gunluk-analiz/mimari/</code>. Repo: <code>tradehub-tr/tradehub_core</code>, dal <code>version-15</code>.
				</Typography.Text>
			</Layout.Footer>
			<FloatButton.BackTop
				aria-label="Sayfanın başına dön"
				shape="square"
				icon={<VerticalAlignTopOutlined />}
				visibilityHeight={600}
			/>
		</Layout>
	);
}
