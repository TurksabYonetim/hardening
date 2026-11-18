import brief from "../data/agent-brief.json";

export type Epic = {
	name: string;
	priority: string;
	phase: string;
	size: string;
	story: string;
	acceptance: string[];
	donts: string[];
	checklist: string[];
	html?: { story: string; acceptance: string[]; donts: string[]; checklist: string[] };
};

export type DoctypeSummary = {
	id: string;
	slug: string;
	ctx: string;
	title: string;
	meta: Record<string, string>;
	epic: Epic | null;
	steps: string[];
	stepsHtml?: string[];
};

export type Task = {
	id: string;
	kind: "Epic" | "Faz görevi";
	phase: string;
	ctx: string;
	title: string;
	titleHtml?: string;
	priority: string;
	size?: string;
	href: string;
	// Yalnız faz görevlerinde dolu olan alanlar. Epic'lerde bu bilgiler DoctypeSummary içindedir.
	owner?: string;
	story?: string;
	acceptance?: string[];
	donts?: string[];
	checklist?: string[];
	guides?: string[];
	html?: { acceptance: string[]; donts: string[]; checklist: string[] };
};

export type Phase = { id: string; label: string; slug: string; title: string; summary: string; tasks: Task[] };

export const STATUSES = ["Yapılacak", "Devam ediyor", "İncelemede", "Bitti"] as const;
export type Status = (typeof STATUSES)[number];
export const PRIORITY_ORDER = ["Kriz", "Kritik", "Acil", "Önemli", "Düşük"];
export const PHASE_ORDER = ["Faz -1", "Faz 0", "Faz 1", "Faz 2", "Faz 3", "Faz 4", "Faz 5"];
export const phaseLabel = (id: string) => id.replace("-", "−");

/** Bağlamın insan adı. Klasör adı yalnız adreste ve kopyalanan metinde kalır. */
export const CTX_LABELS: Record<string, string> = {
	genel: "Genel",
	"01-kimlik-erisim": "Kimlik ve erişim",
	"02-satici-magaza": "Satıcı ve mağaza",
	"03a-katalog": "Katalog",
	"03b-ice-aktarma": "İçe aktarma",
	"03c-kesif": "Keşif",
	"04-siparis": "Sipariş",
	"05-odeme": "Ödeme",
	"06-vergi-fatura": "Vergi ve fatura",
	"07-lojistik": "Lojistik",
	"08-medya": "Medya",
	"09-icerik-vitrin": "İçerik ve vitrin",
	"10-seo": "SEO",
	"11-degerlendirme": "Değerlendirme",
	"12-bildirim-iletisim": "Bildirim ve iletişim",
	"13-uyum-gizlilik": "Uyum ve gizlilik",
	"14-platform-cekirdek": "Platform çekirdeği",
};
export const ctxLabel = (c: string) => CTX_LABELS[c] || c;
export const lowerTr = (s: string) => s.toLocaleLowerCase("tr");

const STORE_KEY = "istoc-mimari-kanban-v1";

/** Pano durumu yalnız bu tarayıcıda saklanır. Erişilemezse boş döner. */
export function loadStatuses(): Record<string, Status> {
	try {
		return JSON.parse(localStorage.getItem(STORE_KEY) || "{}");
	} catch {
		return {};
	}
}

export function saveStatuses(map: Record<string, Status>): void {
	try {
		localStorage.setItem(STORE_KEY, JSON.stringify(map));
	} catch {
		/* depolama kapalıysa durum yalnız bu oturumda kalır */
	}
}

const list = (title: string, items: string[], box = false) =>
	items.length ? `\n${title}:\n${items.map((i) => (box ? `- [ ] ${i}` : `- ${i}`)).join("\n")}\n` : "";

const AGENT = `\n---\nAjan talimatı (her görevde zorunlu):\n\n${brief.md.replace(/^# .+\n/, "").trim()}\n`;

/** Bir görevi başka bir geliştiriciye ya da yapay zekâ ajanına verilecek metne çevirir. Ajan talimatı her zaman eklenir. */
export function taskToText(task: Task, doc?: DoctypeSummary): string {
	const head = [
		`Görev: ${task.title}`,
		`Kimlik: ${task.id}`,
		`Tür: ${task.kind}`,
		`Faz: ${phaseLabel(task.phase)}`,
		`Öncelik: ${task.priority}`,
		`Bağlam: ${task.ctx}`,
		`Repo: tradehub-tr/tradehub_core (dal: version-15)`,
	];
	if (!doc) {
		return (
			head.join("\n") +
			(task.owner ? `\nSorumlu: ${task.owner}` : "") +
			`\nKaynak: mimari/FAZ-GOREVLERI.md\n` +
			(task.story ? `\nKullanıcı hikâyesi:\n${task.story}\n` : "") +
			list("Kabul kriterleri", task.acceptance || [], true) +
			list("Yapmamanız gerekenler", task.donts || []) +
			list("Kontrol listesi", task.checklist || [], true) +
			list("Yönergeler", (task.guides || []).map((g) => `mimari/YONERGELER/${g}.md`)) +
			AGENT
		);
	}
	const e = doc.epic;
	return (
		head.join("\n") +
		`\nKaynak rapor: mimari/doctypes/${doc.id}.md\n` +
		(e?.story ? `\nKullanıcı hikâyesi:\n${e.story}\n` : "") +
		list("Kabul kriterleri", e?.acceptance || [], true) +
		list("Yapmamanız gerekenler", e?.donts || []) +
		list("Kontrol listesi", e?.checklist || [], true) +
		list("Geçiş adımları", doc.steps) +
		`\nKural: Bağlamlar birbirine yalnız api.py ve olaylarla ulaşır. Başka bağlamın iç dosyasına ve tablosuna yazmayın.\n` +
		AGENT
	);
}
