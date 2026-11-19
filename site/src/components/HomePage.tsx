import { useEffect, useState } from "react";
import { Collapse, Progress, Typography } from "antd";
import { AppShell } from "./AppShell";
import { Html } from "./bits";
import { url } from "../lib/base";
import { loadStatuses, type Status } from "../lib/tasks";

/** Her fazın kendi rengi vardır. Değerler tokens.css ile aynıdır. */
const FAZ_RENK: Record<string, string> = {
	"Faz -1": "var(--faz-eksi1)",
	"Faz 0": "var(--faz-0)",
	"Faz 1": "var(--faz-1)",
	"Faz 2": "var(--faz-2)",
	"Faz 3": "var(--faz-3)",
	"Faz 4": "var(--faz-4)",
	"Faz 5": "var(--faz-5)",
};

type Phase = { id: string; label: string; slug: string; title: string; summary: string; count: number; taskIds: string[]; epic: number };

export default function HomePage(props: { phases: Phase[]; overviewHtml: string; counts: { doctypes: number; contexts: number; tasks: number; epics: number } }) {
	const { phases, overviewHtml, counts } = props;
	// Durumlar yalnız tarayıcıda durur. İlk çizimde boştur, sonra dolar.
	const [durumlar, setDurumlar] = useState<Record<string, Status>>({});
	useEffect(() => setDurumlar(loadStatuses()), []);
	const bitenSayisi = (ids: string[]) => ids.filter((id) => durumlar[id] === "Bitti").length;
	const toplamBiten = phases.reduce((n, p) => n + bitenSayisi(p.taskIds), 0);
	const toplamGorev = phases.reduce((n, p) => n + p.count, 0);
	return (
		<AppShell active="/" crumbs={[]}>
			<style>{`
				.home-ozet {
					display: flex;
					flex-wrap: wrap;
					align-items: baseline;
					gap: var(--space-3) var(--space-6);
					margin-bottom: 0;
					padding-block: var(--space-3);
					border-block: 1px solid var(--color-hairline);
				}
				.home-ozet div { display: flex; flex-direction: column; gap: 2px; }
				.home-ozet dt {
					font-size: var(--text-small);
					color: var(--color-text-muted);
					margin: 0;
				}
				.home-ozet dd {
					margin: 0;
					font-size: var(--text-h3);
					font-weight: var(--weight-strong);
					color: var(--color-text-strong);
					font-variant-numeric: tabular-nums lining-nums;
					line-height: 1.1;
				}

				.home-ilerleme {
					margin: var(--space-2) 0 var(--rhythm-section);
					font-size: var(--text-small);
					color: var(--color-text-muted);
				}
				.home-ozet [data-vurgu] { margin-inline-start: auto; }
				.home-ozet [data-vurgu] dd span {
					font-weight: var(--weight-normal);
					color: var(--color-text-muted);
					font-size: var(--text-body);
				}
				.home-phases { list-style: none; margin: 0; padding: 0; }
				.home-phases li + li { margin-top: var(--space-2); }
				.home-phase-bas {
					display: flex;
					align-items: baseline;
					flex-wrap: wrap;
					gap: var(--space-2) var(--space-3);
				}
				.home-phase-title {
					color: var(--color-text-strong);
					font-size: var(--text-h2);
					font-weight: var(--weight-strong);
					line-height: var(--leading-h3);
					letter-spacing: var(--track-h3);
				}
				/* Hover alt çizgi çizmez. Zemin merkezî kuraldan gelir. */
				.home-phase-count {
					color: var(--color-text-muted);
					font-size: var(--text-small);
					font-variant-numeric: tabular-nums;
				}
				.home-phase-bas { margin-bottom: var(--space-1); }
				.home-phase-summary {
					display: block;
					color: var(--color-text);
					max-width: var(--measure);
				}
			`}</style>

			<header data-sayfa-basi>
				<Typography.Title level={1} style={{ overflowWrap: "anywhere" }}>
					tradehub_core modüler monolit planı
				</Typography.Title>
				<p data-ozet>Kod taşımadan önce Faz −1 görevlerini bitirin. Plan yedi fazda ilerler.</p>
			</header>

			{/* Ölçek karşıtlığı: etiket küçük, rakam büyük. */}
			<dl data-sayi-serit>
				<div>
					<dt>Görev</dt>
					<dd>{counts.tasks}</dd>
				</div>
				<div>
					<dt>DocType</dt>
					<dd>{counts.doctypes}</dd>
				</div>
				<div>
					<dt>Bağlam</dt>
					<dd>{counts.contexts}</dd>
				</div>
				<div>
					<dt>Biten faz görevi</dt>
					<dd>
						{toplamBiten} <span>/ {toplamGorev}</span>
					</dd>
				</div>
			</dl>

			<Typography.Title level={2} id="home-phases" style={{ marginBottom: "var(--space-4)" }}>
				Fazlar
			</Typography.Title>
			<ol className="home-phases" role="list" aria-labelledby="home-phases">
				{phases.map((phase) => (
					<li key={phase.id}>
						<a
							href={url(`/fazlar/${phase.slug}/`)}
							aria-label={`${phase.label}: ${phase.title}`}
							data-faz-satir
							style={{ ["--faz-renk" as string]: FAZ_RENK[phase.id] || "var(--color-ink)" }}
						>
							<span data-faz-rakam aria-hidden>
								{phase.label.replace(/^Faz\s+/, "")}
							</span>
							<span className="home-phase-bas">
								<strong className="home-phase-title">{phase.title}</strong>
								<span className="home-phase-count">
									{bitenSayisi(phase.taskIds) > 0
										? `${bitenSayisi(phase.taskIds)} / ${phase.count} faz görevi bitti`
										: `${phase.count} faz görevi`}
									{phase.epic > 0 ? `, ${phase.epic} epic` : ""}
								</span>
							</span>
							<span className="home-phase-summary">
								{phase.summary}
								{/* Çubuk yalnız ilerleme varken çizilir. Boş çubuk bilgi vermez. */}
								{bitenSayisi(phase.taskIds) > 0 && (
									<Progress
										aria-hidden
										percent={Math.round((100 * bitenSayisi(phase.taskIds)) / phase.count)}
										showInfo={false}
										strokeLinecap="square"
										size={["100%", 4]}
										style={{ display: "block", marginTop: "var(--space-2)", maxWidth: 240 }}
									/>
								)}
							</span>
						</a>
					</li>
				))}
			</ol>

			<Typography.Title level={2} style={{ marginTop: "var(--rhythm-section)" }}>
				Genel plan
			</Typography.Title>
			<Collapse
				ghost
				styles={{ header: { alignItems: "center" } }}
				items={[{ key: "plan", label: "Planın tamamı", children: <Html html={overviewHtml} /> }]}
			/>
		</AppShell>
	);
}
