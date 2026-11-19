import { useEffect, useRef, useState, type ReactNode } from "react";
import { App, Button, Tag, Tooltip } from "antd";
import { CopyOutlined } from "@ant-design/icons";
import { copyText } from "../lib/copy";
import { BASE } from "../lib/base";

/** Rapor HTML'indeki kök bağlantıları sitenin taban yoluyla birleştirir. */
const withBase = (html: string) => (BASE === "/" ? html : html.replace(/href="\//g, `href="${BASE}`));

/** Geniş tabloyu ve uzun kodu kendi kutusunda yana kaydırır. Kutu klavyeyle de kaydırılır. */
const wrapScrollers = (html: string) =>
	html
		.replace(
			/<table(\s[^>]*)?>/g,
			(_m, attrs = "") =>
				`<div class="md-scrollbox" data-kind="tablo"><p class="md-scroll-hint">Tablo geniştir. Tabloyu yana kaydırın.</p><div class="md-scroll" tabindex="0" role="group" aria-label="Yana kaydırılan tablo"><table${attrs || ""}>`,
		)
		.replace(/<\/table>/g, "</table></div></div>")
		.replace(
			/<pre(\s[^>]*)?>/g,
			(_m, attrs = "") =>
				`<div class="md-scrollbox" data-kind="kod"><p class="md-scroll-hint">Kod satırları uzundur. Kodu yana kaydırın.</p><pre class="md-scroll" tabindex="0" role="group" aria-label="Yana kaydırılan kod"${attrs || ""}>`,
		)
		.replace(/<\/pre>/g, "</pre></div>");

const BASLIK = /<h([23])(\s[^>]*)?>/g;

/** Bölüm başlıklarına "bolum-1" gibi bağlantı adresi ekler. */
const addHeadingIds = (html: string) => {
	let n = 0;
	return html.replace(BASLIK, (_m, level, attrs = "") => {
		n += 1;
		return `<h${level}${attrs || ""} id="bolum-${n}">`;
	});
};

/** İçindekiler için ikinci düzey başlıkları çıkarır. Sıra `addHeadingIds` ile aynıdır. */
export function sectionLinks(html: string): { id: string; text: string }[] {
	const out: { id: string; text: string }[] = [];
	let n = 0;
	for (const m of html.matchAll(/<h([23])(\s[^>]*)?>([\s\S]*?)<\/h\1>/g)) {
		n += 1;
		if (m[1] !== "2") continue;
		const text = m[3].replace(/<[^>]+>/g, "").replace(/&amp;/g, "&").trim();
		if (text) out.push({ id: `bolum-${n}`, text });
	}
	return out;
}

const MD_CSS_ID = "md-ortak-bicim";
const MD_CSS = `
.md h2[id],
.md h3[id] { scroll-margin-top: 72px; }
.md-scrollbox { position: relative; margin: var(--space-4) 0; }
.md-scroll { overflow-x: auto; overscroll-behavior-x: contain; }
.md-scroll > table { display: table; min-width: 100%; max-width: none; }
.md-scroll-hint { display: none; margin: 0 0 var(--space-1); font-size: var(--text-small); color: var(--color-text-muted); }
.md-scrollbox[data-scrollable] .md-scroll-hint { display: block; }
.md-scrollbox[data-scrollable]::after {
	content: "";
	position: absolute;
	inset-block-end: 0;
	inset-inline-end: 0;
	width: 24px;
	height: calc(100% - 24px);
	pointer-events: none;
	background: linear-gradient(to right, rgba(244, 245, 247, 0), var(--color-bg));
	opacity: 1;
	transition: opacity var(--motion-fast) var(--motion-ease);
}
.md-scrollbox[data-kind="kod"][data-scrollable]::after {
	inset-block-end: 1px;
	height: calc(100% - 26px);
	background: linear-gradient(to right, rgba(244, 245, 247, 0), var(--color-surface));
	border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
}
.md-scrollbox[data-scrollable][data-atend]::after { opacity: 0; }
/* Odak göstergesi merkezî kuraldan gelir. Burada iptal edilmez.
   Eski kural sarı zemini kaldırıp yalnız 1,4:1 veren bir çizgi bırakıyordu. */
`;

/** Fare ya da kalem varsa `true` döner. Yalnız dokunmatik cihazda `false` döner. */
function useHover(): boolean {
	const [hover, setHover] = useState(false);
	useEffect(() => {
		const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
		const on = () => setHover(mq.matches);
		on();
		mq.addEventListener("change", on);
		return () => mq.removeEventListener("change", on);
	}, []);
	return hover;
}

/**
 * Tek tıkla kopyalama düğmesi.
 * `primary` ana eylemdir. `quiet` kart içindeki ikincil eylemdir.
 * `quiet` seçeneğinde düğme sessiz bir metin bağlantısı gibi görünür.
 */
export function CopyButton({ text, label = "Kopyala", ariaLabel, block = false, primary = false, quiet = false }: { text: string; label?: string; ariaLabel?: string; block?: boolean; primary?: boolean; quiet?: boolean }) {
	const { message } = App.useApp();
	// Dokunmatik ekranda ipucu balonu parmağın altında kalır. Orada balonu göstermeyiz.
	const hover = useHover();
	return (
		<Tooltip title={hover ? "Panoya kopyalar" : null}>
			<Button
				type={quiet ? "link" : primary ? "primary" : "default"}
				style={quiet ? { paddingInline: 0 } : undefined}
				icon={<CopyOutlined />}
				block={block}
				aria-label={ariaLabel || label}
				onClick={async () => {
					const ok = await copyText(text);
					if (ok) message.success("Kopyalandı");
					else message.error("Kopyalanamadı. Metni elle seçin.");
				}}
			>
				{label}
			</Button>
		</Tooltip>
	);
}

/** Öncelik adını tasarım tokenı adına çevirir. Renkler `tokens.css` dosyasındadır. */
const ONCELIK_TOKENI: Record<string, string> = {
	Kriz: "kriz",
	Kritik: "kritik",
	Acil: "acil",
	"Önemli": "onemli",
	"Düşük": "dusuk",
};

/** Öncelik etiketi. Düz ve sessizdir. Rengini yalnız tokenlardan alır. */
export function PriorityTag({ value }: { value: string }) {
	const k = ONCELIK_TOKENI[value] || ONCELIK_TOKENI["Önemli"];
	return (
		<Tag variant="filled" style={{ background: `var(--${k}-bg)`, color: `var(--${k}-fg)`, fontSize: "var(--text-small)", marginInlineEnd: 0 }}>
			{value}
		</Tag>
	);
}

/** Renksiz etiket. Zemini ve yazı rengi tema tokenlarından gelir. */

export function Html({ html, headingIds = false }: { html: string; headingIds?: boolean }) {
	const ref = useRef<HTMLDivElement>(null);
	useEffect(() => {
		// Ortak biçim kuralları sayfada bir kez durur.
		if (!document.getElementById(MD_CSS_ID)) {
			const el = document.createElement("style");
			el.id = MD_CSS_ID;
			el.textContent = MD_CSS;
			document.head.appendChild(el);
		}
		const root = ref.current;
		if (!root) return;
		const boxes = Array.from(root.querySelectorAll<HTMLElement>(".md-scrollbox"));
		if (boxes.length === 0) return;
		const sync = () => {
			for (const box of boxes) {
				const scroller = box.querySelector<HTMLElement>(".md-scroll");
				if (!scroller) continue;
				const over = scroller.scrollWidth - scroller.clientWidth;
				const kayar = over > 2;
				box.toggleAttribute("data-scrollable", kayar);
				box.toggleAttribute("data-atend", !kayar || scroller.scrollLeft >= over - 2);
				// Sığan tablo klavye sırasında boş bir durak olmaz.
				if (kayar) scroller.setAttribute("tabindex", "0");
				else if (document.activeElement !== scroller) scroller.removeAttribute("tabindex");
			}
		};
		// Safari odaklanmış kutuyu ok tuşuyla kaydırmaz. Kaydırmayı burada yaparız.
		const onKey = (e: KeyboardEvent) => {
			const scroller = e.currentTarget as HTMLElement;
			if (e.target !== scroller || e.altKey || e.ctrlKey || e.metaKey) return;
			const adim = Math.max(40, Math.round(scroller.clientWidth * 0.8));
			const son = scroller.scrollWidth - scroller.clientWidth;
			const hedef =
				e.key === "ArrowRight" ? scroller.scrollLeft + adim
				: e.key === "ArrowLeft" ? scroller.scrollLeft - adim
				: e.key === "Home" ? 0
				: e.key === "End" ? son
				: null;
			if (hedef === null) return;
			e.preventDefault();
			scroller.scrollLeft = Math.min(son, Math.max(0, hedef));
		};
		sync();
		const ro = new ResizeObserver(sync);
		ro.observe(root);
		const scrollers = boxes.map((box) => box.querySelector<HTMLElement>(".md-scroll")).filter((s): s is HTMLElement => !!s);
		for (const scroller of scrollers) {
			scroller.addEventListener("scroll", sync, { passive: true });
			scroller.addEventListener("keydown", onKey);
		}
		return () => {
			ro.disconnect();
			for (const scroller of scrollers) {
				scroller.removeEventListener("scroll", sync);
				scroller.removeEventListener("keydown", onKey);
			}
		};
	}, [html]);
	return <div className="md" ref={ref} dangerouslySetInnerHTML={{ __html: wrapScrollers(headingIds ? addHeadingIds(withBase(html)) : withBase(html)) }} />;
}

/** Satır içi HTML'i (kod ve kalın yazı) gösterir. HTML yoksa düz metni gösterir. */
export function Inline({ html, text }: { html?: string; text: string }) {
	return html ? <span className="md-inline" dangerouslySetInnerHTML={{ __html: withBase(html) }} /> : <span>{text}</span>;
}

/** Düz madde listesi. Ant Design List bileşeni her liste için istenmeyen bir
 *  canlı bölge açıyordu. Ekran okuyucu bir kutu işaretlenince bütün listeyi
 *  yeniden okuyordu. Bu parça düz ul ve li kullanır. */
export function DuzListe({ items, renderItem, dense, kontrol }: { items: readonly string[]; renderItem: (t: string, i: number) => ReactNode; dense?: boolean; kontrol?: boolean }) {
	return (
		<ul data-duz-liste data-sik={dense ? "" : undefined}>
			{items.map((t, i) => (
				// kontrol: satırın tamamı fareye cevap verir. Onay kutusu listelerinde
				// hedef yalnız 16 pikselllik kutu olmasın diye.
				<li key={i} data-kontrol-satiri={kontrol ? "" : undefined}>
					{renderItem(t, i)}
				</li>
			))}
		</ul>
	);
}
