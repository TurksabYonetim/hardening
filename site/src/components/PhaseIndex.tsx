import { Typography } from "antd";
import { AppShell } from "./AppShell";
import { url } from "../lib/base";

const FAZ_RENK: Record<string, string> = {
	"Faz -1": "var(--faz-eksi1)",
	"Faz 0": "var(--faz-0)",
	"Faz 1": "var(--faz-1)",
	"Faz 2": "var(--faz-2)",
	"Faz 3": "var(--faz-3)",
	"Faz 4": "var(--faz-4)",
	"Faz 5": "var(--faz-5)",
};

type Satir = { id: string; label: string; slug: string; title: string; summary: string; gorev: number; epic: number };

/** Fazlar dizini. Menüdeki "Fazlar" bağlantısı önceden hep Faz −1 sayfasını açıyordu. */
export function PhaseIndex({ phases }: { phases: Satir[] }) {
	const toplamGorev = phases.reduce((n, p) => n + p.gorev, 0);
	const toplamEpic = phases.reduce((n, p) => n + p.epic, 0);
	return (
		<AppShell active="/fazlar/" crumbs={[{ title: "Genel bakış", href: "/" }, { title: "Fazlar" }]}>
			<style>{`
				.faz-dizin { list-style: none; margin: 0; padding: 0; }
				.faz-dizin li + li { margin-top: var(--space-1); }
				.faz-dizin-bas { display: flex; align-items: baseline; flex-wrap: wrap; gap: var(--space-2) var(--space-3); }
				.faz-dizin-ad {
					color: var(--color-text-strong);
					font-size: var(--text-h2);
					font-weight: var(--weight-strong);
					line-height: var(--leading-h3);
					letter-spacing: var(--track-h3);
				}
				.faz-dizin a:hover .faz-dizin-ad { text-decoration: underline; text-underline-offset: 3px; }
				.faz-dizin-sayi { color: var(--color-text-muted); font-size: var(--text-small); font-variant-numeric: tabular-nums; }
				.faz-dizin-bas { margin-bottom: var(--space-1); }
				.faz-dizin-ozet { max-width: var(--measure); }
			`}</style>
			<header data-sayfa-basi>
				<Typography.Title level={1}>Fazlar</Typography.Title>
				<p data-ozet>Plan yedi fazdan oluşur. Fazlar sırayla yapılır. Bir faz bitmeden sonraki faz başlamaz.</p>
			</header>
			<dl data-sayi-serit>
				<div>
					<dt>Faz</dt>
					<dd>{phases.length}</dd>
				</div>
				<div>
					<dt>Faz görevi</dt>
					<dd>{toplamGorev}</dd>
				</div>
				<div>
					<dt>Epic</dt>
					<dd>{toplamEpic}</dd>
				</div>
			</dl>
			<ol className="faz-dizin" role="list">
				{phases.map((p) => (
					<li key={p.id}>
						<a
							href={url(`/fazlar/${p.slug}/`)}
							aria-label={`${p.label}: ${p.title}`}
							data-faz-satir
							style={{ ["--faz-renk" as string]: FAZ_RENK[p.id] || "var(--color-ink)" }}
						>
							<span data-faz-rakam aria-hidden>
								{p.label.replace(/^Faz\s+/, "")}
							</span>
							<span className="faz-dizin-bas">
								<strong className="faz-dizin-ad">{p.title}</strong>
								<span className="faz-dizin-sayi">
									{p.gorev} faz görevi{p.epic > 0 ? `, ${p.epic} epic` : ""}
								</span>
							</span>
							<span className="faz-dizin-ozet">{p.summary}</span>
						</a>
					</li>
				))}
			</ol>
		</AppShell>
	);
}
