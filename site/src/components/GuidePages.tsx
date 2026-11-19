import { Alert, Typography } from "antd";
import { DownOutlined, LeftOutlined, RightOutlined } from "@ant-design/icons";
import { AppShell } from "./AppShell";
import { CopyButton, Html, Inline, sectionLinks } from "./bits";
import { url } from "../lib/base";

type Guide = { slug: string; title: string; summary: string; html: string; md: string };
type Ref = { slug: string; title: string };

const CSS = `
.guide-list { list-style: none; margin: 0; padding: 0; }
.guide-item { border-top: 1px solid var(--color-hairline); }
.guide-item:last-child { border-bottom: 1px solid var(--color-hairline); }
.guide-head { margin: 0; font-size: var(--text-h3); line-height: var(--leading-h3); letter-spacing: var(--track-h3); font-weight: var(--weight-strong); }
.guide-link {
	display: flex;
	gap: var(--space-3);
	align-items: baseline;
	min-height: var(--hit);
	padding: var(--space-3) 0 var(--space-1);
	color: var(--color-text-strong);
	text-decoration: none;
}
.guide-item:hover { background: var(--bg-sunken); }
.guide-no { flex: none; min-width: 2ch; font-size: var(--text-small); line-height: 1.5; font-variant-numeric: tabular-nums; color: var(--color-text-muted); font-weight: var(--weight-medium); }
.guide-summary { margin: 0 0 var(--space-4); padding-inline-start: calc(2ch + var(--space-3)); max-width: var(--measure); color: var(--color-text); }

.guide-nav { display: flex; flex-wrap: wrap; gap: var(--space-3); margin-top: var(--space-6); border-top: 1px solid var(--color-hairline); padding-top: var(--space-4); }
.guide-nav-link {
	flex: 1 1 260px;
	display: flex;
	gap: var(--space-2);
	align-items: flex-start;
	min-height: var(--hit);
	padding: var(--space-2) 0;
	color: var(--color-primary);
	text-decoration: none;
	transition: color var(--motion-fast) var(--motion-ease);
}
.guide-nav-link:hover { color: var(--color-primary-hover); }
.guide-nav-link:hover { background: var(--bg-sunken); }
.guide-nav-link .anticon { margin-top: var(--space-1); font-size: var(--text-small); }
.guide-nav-next { justify-content: flex-end; text-align: end; }
.guide-nav-kind { display: block; font-size: var(--text-small); color: var(--color-text-muted); }
.guide-nav-title { display: block; font-weight: var(--weight-strong); }
.guide-nav-all { flex: 1 1 100%; display: flex; align-items: center; min-height: var(--hit); color: var(--color-primary); }

.guide-toc { margin: 0 0 var(--space-6); max-width: var(--measure); }
.guide-toc-head {
	display: flex;
	align-items: center;
	min-height: var(--hit);
	padding: var(--space-2) 0;
	gap: var(--space-2);
	font-weight: var(--weight-strong);
	color: var(--color-primary);
	cursor: pointer;
}
.guide-toc-head::-webkit-details-marker { display: none; }
.guide-toc-caret { font-size: var(--text-small); transition: transform var(--motion-fast) var(--motion-ease); }
.guide-toc[open] .guide-toc-caret { transform: rotate(180deg); }
.guide-toc-list { margin: 0; padding: 0 0 var(--space-2) var(--space-6); }
.guide-toc-list li { margin: 0; }
.guide-toc-plain { list-style: none; padding-inline-start: var(--space-4); }
.guide-toc-list a { display: flex; align-items: center; min-height: var(--hit); color: var(--color-primary); }

/* Okuma sütunu. Düz yazı dar kalır. Tablo ve kod tam genişlik alır. */
.guide-body .md { max-width: none; }
.guide-body .md > p,
.guide-body .md > ul,
.guide-body .md > ol,
.guide-body .md > h1,
.guide-body .md > h2,
.guide-body .md > h3,
.guide-body .md > h4,
.guide-body .md > blockquote,
.guide-body .md > hr { max-width: var(--measure); margin-inline: 0 auto; }
/* Çizgi yalnız yatay ayraca aittir. Önceki kural bütün paragraflara çizgi çiziyordu. */
.guide-body .md > hr { border: 0; border-top: 1px solid var(--color-hairline); }
.guide-body .md > .md-scrollbox { max-width: 100%; }
`;

export function GuidesPage({ guides }: { guides: Omit<Guide, "html" | "md">[] }) {
	return (
		<AppShell active="/yonergeler/" crumbs={[{ title: "Genel bakış", href: "/" }, { title: "Yönergeler" }]}>
			<style dangerouslySetInnerHTML={{ __html: CSS }} />
			<header data-sayfa-basi>
				<Typography.Title level={1}>Yönergeler</Typography.Title>
				<p data-ozet>Bu yönergeler her görevde uygulanır. Görevi kopyalayınca ajan talimatı metne kendiliğinden eklenir.</p>
			</header>
			<Alert
				type="warning"
				showIcon
				title="Her görevde dört kriter zorunludur"
				description="Characterization test, shadow mode, TDD ve feature flag. Bu dört kriter olmadan görev bitmiş sayılmaz."
				style={{ marginBottom: "var(--space-6)", maxWidth: "var(--measure)" }}
			/>
			{guides.length === 0 && (
				<Typography.Paragraph style={{ maxWidth: "var(--measure)" }}>
					Şu anda hiç yönerge yok. Veriyi üretmek için <code>npm run data</code> komutunu çalıştırın.
				</Typography.Paragraph>
			)}
			<ol className="guide-list" role="list">
				{guides.map((g, i) => (
					<li className="guide-item" key={g.slug} data-guide={g.slug}>
						<h2 className="guide-head">
							<a className="guide-link" href={url(`/yonergeler/${g.slug}/`)}>
								<span className="guide-no">{i + 1}</span>
								<span className="guide-title">{g.title}</span>
							</a>
						</h2>
						<p className="guide-summary">
							<Inline html={g.summary} text="" />
						</p>
					</li>
				))}
			</ol>
		</AppShell>
	);
}

function NavLink({ guide, kind }: { guide: Ref; kind: "prev" | "next" }) {
	const label = kind === "prev" ? "Önceki yönerge" : "Sonraki yönerge";
	return (
		<a
			className={`guide-nav-link ${kind === "next" ? "guide-nav-next" : ""}`}
			href={url(`/yonergeler/${guide.slug}/`)}
			aria-label={`${label}: ${guide.title}`}
		>
			{kind === "prev" && <LeftOutlined aria-hidden />}
			<span>
				<span className="guide-nav-kind">{label}</span>
				<span className="guide-nav-title">{guide.title}</span>
			</span>
			{kind === "next" && <RightOutlined aria-hidden />}
		</a>
	);
}

export function GuidePage({ guide, prev, next }: { guide: Guide; prev?: Ref; next?: Ref }) {
	const bolumler = sectionLinks(guide.html);
	// Başlıkların kendi numarası varsa listede ikinci bir numara çıkmasın.
	const kendiNumarali = bolumler.length > 0 && bolumler.filter((b) => /^\d+\./.test(b.text)).length * 2 >= bolumler.length;
	return (
		<AppShell active="/yonergeler/" crumbs={[{ title: "Genel bakış", href: "/" }, { title: "Yönergeler", href: "/yonergeler/" }, { title: guide.title }]}>
			<style dangerouslySetInnerHTML={{ __html: CSS }} />
			<Typography.Title level={1}>{guide.title}</Typography.Title>
			<div style={{ marginBottom: "var(--space-4)" }}>
				<CopyButton text={guide.md} label="Yönergeyi kopyala" ariaLabel={`Yönergeyi kopyala: ${guide.title}`} primary />
			</div>
			{bolumler.length >= 3 && (
				<details className="guide-toc">
					<summary className="guide-toc-head">
						<DownOutlined className="guide-toc-caret" aria-hidden />
						İçindekiler ({bolumler.length} bölüm)
					</summary>
					<ol className={kendiNumarali ? "guide-toc-list guide-toc-plain" : "guide-toc-list"} role="list">
						{bolumler.map((b) => (
							<li key={b.id}>
								<a href={`#${b.id}`}>{b.text}</a>
							</li>
						))}
					</ol>
				</details>
			)}
			<div className="guide-body">
				<Html html={guide.html} headingIds />
			</div>
			<nav className="guide-nav" aria-label="Yönergeler arasında gezinme">
				{prev && <NavLink guide={prev} kind="prev" />}
				{next && <NavLink guide={next} kind="next" />}
				<a className="guide-nav-all" href={url("/yonergeler/")}>
					Bütün yönergeleri gör
				</a>
			</nav>
		</AppShell>
	);
}
