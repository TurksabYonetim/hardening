import { App, Button, Tag, Tooltip } from "antd";
import { CopyOutlined } from "@ant-design/icons";
import { copyText } from "../lib/copy";
import { PRIORITY_COLORS } from "../lib/theme";
import { BASE } from "../lib/base";

/** Rapor HTML'indeki kök bağlantıları sitenin taban yoluyla birleştirir. */
const withBase = (html: string) => (BASE === "/" ? html : html.replace(/href="\//g, `href="${BASE}`));

/** Tek tıkla kopyalama düğmesi. Erişilebilir adı her zaman "Kopyala" içerir. */
export function CopyButton({ text, label = "Kopyala", ariaLabel, block = false, primary = false }: { text: string; label?: string; ariaLabel?: string; block?: boolean; primary?: boolean }) {
	const { message } = App.useApp();
	return (
		<Tooltip title="Panoya kopyalar">
			<Button
				type={primary ? "primary" : "default"}
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

export function PriorityTag({ value }: { value: string }) {
	const c = PRIORITY_COLORS[value] || PRIORITY_COLORS["Önemli"];
	return (
		<Tag style={{ background: c.bg, color: c.fg, borderColor: c.bg, fontSize: 14, marginInlineEnd: 0 }}>
			{value}
		</Tag>
	);
}

export function PlainTag({ children }: { children: React.ReactNode }) {
	return <Tag style={{ fontSize: 14, marginInlineEnd: 0, borderColor: "#6b6f76" }}>{children}</Tag>;
}

export function Html({ html }: { html: string }) {
	return <div className="md" dangerouslySetInnerHTML={{ __html: withBase(html) }} />;
}

/** Satır içi HTML'i (kod ve kalın yazı) gösterir. HTML yoksa düz metni gösterir. */
export function Inline({ html, text }: { html?: string; text: string }) {
	return html ? <span className="md-inline" dangerouslySetInnerHTML={{ __html: withBase(html) }} /> : <span>{text}</span>;
}
