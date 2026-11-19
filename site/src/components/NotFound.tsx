import { Button, Flex, Typography } from "antd";
import { AppShell } from "./AppShell";
import { url } from "../lib/base";

const YOLLAR = [
	{ yol: "/", ad: "Genel bakış", not: "Planın özeti ve fazlar" },
	{ yol: "/fazlar/faz-eksi-1/", ad: "Fazlar", not: "Sıralı yedi faz ve görevleri" },
	{ yol: "/kanban/", ad: "Kanban", not: "373 görevin listesi ve panosu" },
	{ yol: "/baglamlar/", ad: "Bağlamlar", not: "16 iş bağlamı ve epic'ler" },
	{ yol: "/yonergeler/", ad: "Yönergeler", not: "Her görevde geçerli dokuz kural" },
];

/** Adres yanlışsa okur boşlukta kalmaz. Buradan ana bölümlere gider. */
export function NotFoundPage() {
	return (
		<AppShell active="" crumbs={[]}>
			<style>{`
				.yok-liste { list-style: none; margin: 0; padding: 0; }
				.yok-liste li + li { border-top: 1px solid var(--color-hairline); }
				.yok-liste a {
					display: block;
					padding-block: var(--space-4);
					color: var(--color-text);
					text-decoration: none;
				}
				.yok-ad {
					display: block;
					font-size: var(--text-h3);
					font-weight: var(--weight-strong);
					line-height: var(--leading-h3);
					color: var(--color-text-strong);
				}
				.yok-liste a:hover { background: var(--bg-sunken); }
				.yok-not { display: block; color: var(--color-text-muted); }
			`}</style>
			<header data-sayfa-basi>
				<span className="eyebrow">404</span>
				<Typography.Title level={1}>Bu sayfa yok</Typography.Title>
				<p data-ozet>Adres yanlış olabilir. Sayfa taşınmış da olabilir. Aşağıdaki bölümlerden birini seçin.</p>
			</header>
			<Flex gap={12} wrap style={{ marginBottom: "var(--rhythm-section)" }}>
				<Button type="primary" href={url("/")}>
					Genel bakışa git
				</Button>
				<Button href={url("/kanban/")}>Görev listesine git</Button>
			</Flex>
			<Typography.Title level={2}>Bütün bölümler</Typography.Title>
			<ul className="yok-liste">
				{YOLLAR.map((y) => (
					<li key={y.yol}>
						<a href={url(y.yol)}>
							<span className="yok-ad">{y.ad}</span>
							<span className="yok-not">{y.not}</span>
						</a>
					</li>
				))}
			</ul>
		</AppShell>
	);
}
