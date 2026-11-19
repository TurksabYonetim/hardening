import { useEffect, useState, type ReactNode } from "react";
import { App as AntApp, Button, ConfigProvider, Drawer, FloatButton, Grid } from "antd";
import { MenuOutlined, HomeOutlined, ProjectOutlined, ApartmentOutlined, SafetyCertificateOutlined, VerticalAlignTopOutlined, SearchOutlined, CloseOutlined } from "@ant-design/icons";
import trTR from "antd/locale/tr_TR";
import { buildTheme } from "../lib/theme";
import { url } from "../lib/base";
import { SiteSearch } from "./SiteSearch";

const NAV = [
	{ key: "/", label: "Genel bakış", icon: <HomeOutlined /> },
	{ key: "/kanban/", label: "Görevler", icon: <ProjectOutlined /> },
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

	const marka = (
		<a className="yan-marka" href={url("/")}>
			<span className="yan-marka-im" aria-hidden>
				İ
			</span>
			<span className="yan-marka-ad">İstoç mimari planı</span>
		</a>
	);

	return (
		<div className="kabuk" data-app-ready={readyFlag ? "" : undefined}>
			{/* Gezinme solda durur. İçerik bütün genişliği kullanır. */}
			{wide && (
				<aside className="yan" aria-label="Ana gezinme">
					{marka}
					<NavLinks active={active} className="yan-nav" />
					<p className="yan-dip">
						<code>mimari/</code> raporlarından üretilir.
					</p>
				</aside>
			)}

			<div className="govde">
				<header className="ust">
					{!wide && (
						<Button
							className="ust-btn"
							type="text"
							aria-label="Menüyü aç"
							aria-expanded={open}
							aria-controls={open ? "ana-menu" : undefined}
							icon={<MenuOutlined style={{ fontSize: 20 }} />}
							onClick={() => setOpen(true)}
						/>
					)}
					{!wide && <span className="ust-ad">İstoç mimari planı</span>}
					<div className="ust-iz">
						<Crumbs crumbs={crumbs} />
					</div>
					{wide ? (
						<div className="ust-arama">
							<SiteSearch />
						</div>
					) : (
						<Button
							className="ust-btn"
							type="text"
							aria-label="Sitede ara"
							aria-expanded={aramaAcik}
							icon={<SearchOutlined style={{ fontSize: 20 }} />}
							onClick={() => setAramaAcik(true)}
						/>
					)}
				</header>

				<main id="icerik" tabIndex={-1} className="icerik">
					{children}
				</main>
			</div>

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
			<FloatButton.BackTop
				aria-label="Sayfanın başına dön"
				shape="square"
				icon={<VerticalAlignTopOutlined />}
				visibilityHeight={600}
				duration={reduced ? 0 : 400}
				style={{ insetInlineEnd: "var(--gutter)", insetBlockEnd: "var(--space-4)" }}
			/>
		</div>
	);
}
