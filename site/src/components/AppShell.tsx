import { useEffect, useState, type ReactNode } from "react";
import { App as AntApp, Button, ConfigProvider, Drawer, FloatButton, Grid, Layout } from "antd";
import { MenuOutlined, HomeOutlined, ProjectOutlined, ApartmentOutlined, SafetyCertificateOutlined, VerticalAlignTopOutlined, SearchOutlined, CloseOutlined } from "@ant-design/icons";
import trTR from "antd/locale/tr_TR";
import { buildTheme } from "../lib/theme";
import { url } from "../lib/base";
import { SiteSearch } from "./SiteSearch";

const NAV = [
	{ key: "/", label: "Genel bakış", icon: <HomeOutlined /> },
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
				<Shell active={active} crumbs={crumbs} reduced={reduced}>
					{children}
				</Shell>
			</AntApp>
		</ConfigProvider>
	);
}

/** Gezinme bağlantıları. Simgeyi ekran okuyucudan gizleriz. Bağlantının adı yalnız etikettir. */
function NavLinks({ active, className }: { active: string; className: string }) {
	return (
		<nav className={className} aria-label="Ana menü">
			<ul>
				{NAV.map((n) => (
					<li key={n.key}>
						<a href={url(n.key)} aria-current={n.key === active ? "page" : undefined}>
							<span className="shell-ico" aria-hidden="true">
								{n.icon}
							</span>
							{n.label}
						</a>
					</li>
				))}
			</ul>
		</nav>
	);
}

/**
 * Yol izi yalnız üst sayfaları gösterir.
 * Son basamak açık olan sayfadır. Sayfanın adını zaten başlık söyler.
 * Ana sayfa basamağını da çizmeyiz. Üst çubuktaki site adı ana sayfayı açar.
 */
function Crumbs({ crumbs }: { crumbs: Crumb[] }) {
	const ustler = crumbs.length > 0 && !crumbs[crumbs.length - 1].href ? crumbs.slice(0, -1) : crumbs;
	const trail = ustler.filter((c) => c.href !== "/");
	if (trail.length === 0) return null;
	return (
		<nav className="shell-crumbs" aria-label="Yol izi">
			<ol>
				{trail.map((c, i) => (
					<li key={`${c.title}-${i}`}>
						{i > 0 && (
							<span className="shell-sep" aria-hidden="true">
								/
							</span>
						)}
						{c.href ? <a href={url(c.href)}>{c.title}</a> : <span className="shell-crumb-text">{c.title}</span>}
					</li>
				))}
			</ol>
		</nav>
	);
}

function Shell({ active, crumbs, reduced, children }: { active: string; crumbs: Crumb[]; reduced: boolean; children: ReactNode }) {
	const screens = Grid.useBreakpoint();
	const wide = !!screens.lg;
	const [open, setOpen] = useState(false);
	const [aramaAcik, setAramaAcik] = useState(false);
	const [readyFlag, setReady] = useState(false);
	useEffect(() => setReady(true), []);
	return (
		<Layout style={{ minHeight: "100vh", background: "var(--color-bg)" }} data-app-ready={readyFlag ? "" : undefined}>
			<Layout.Header className="shell-header">
				<div className="shell-bar shell-topbar">
					{!wide && (
						<Button
							className="shell-menu-btn"
							type="text"
							aria-label="Menüyü aç"
							aria-expanded={open}
							aria-controls={open ? "ana-menu" : undefined}
							icon={<MenuOutlined style={{ fontSize: 20 }} />}
							onClick={() => setOpen(true)}
						/>
					)}
					<a className="shell-logo" href={url("/")}>
						İstoç mimari planı
					</a>
					{wide && <NavLinks active={active} className="shell-nav" />}
					{wide ? (
						<div className="shell-arama">
							<SiteSearch />
						</div>
					) : (
						<Button
							className="shell-menu-btn shell-arama-btn"
							type="text"
							aria-label="Sitede ara"
							aria-expanded={aramaAcik}
							icon={<SearchOutlined style={{ fontSize: 20 }} />}
							onClick={() => setAramaAcik(true)}
						/>
					)}
				</div>
			</Layout.Header>
			{!wide && (
				<Drawer
					title="Sitede ara"
					placement="top"
					size="auto"
					open={aramaAcik}
					onClose={() => setAramaAcik(false)}
					closeIcon={<CloseOutlined />}
					rootClassName="shell-drawer"
				>
					<SiteSearch onGit={() => setAramaAcik(false)} />
				</Drawer>
			)}
			{!wide && (
				<Drawer
					title="Menü"
					placement="left"
					open={open}
					onClose={() => setOpen(false)}
					size="min(300px, 86vw)"
					rootClassName="shell-drawer"
					styles={{ body: { padding: 0 } }}
				>
					<div id="ana-menu">
						<NavLinks active={active} className="shell-drawer-nav" />
					</div>
				</Drawer>
			)}
			<Layout.Content id="icerik" tabIndex={-1} className="shell-content">
				<div className="shell-bar shell-main">
					<Crumbs crumbs={crumbs} />
					{children}
				</div>
			</Layout.Content>
			<Layout.Footer className="shell-footer">
				<div className="shell-bar shell-footer-inner">
					<p>
						Bu site <code>mimari/</code> klasöründeki raporlardan üretilir.
					</p>
					<p>
						Geçiş çalışması <code>tradehub-tr/tradehub_core</code> deposunun <code>version-15</code> dalında yapılır.
					</p>
				</div>
			</Layout.Footer>
			<FloatButton.BackTop
				aria-label="Sayfanın başına dön"
				shape="square"
				icon={<VerticalAlignTopOutlined />}
				visibilityHeight={600}
				duration={reduced ? 0 : 400}
				style={{ insetInlineEnd: "var(--gutter)", insetBlockEnd: "var(--space-4)" }}
			/>
		</Layout>
	);
}
