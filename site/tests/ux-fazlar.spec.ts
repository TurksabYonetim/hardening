import { test, expect, type Page } from "@playwright/test";
import { readFileSync } from "node:fs";

// Faz sayfalarının UX testleri. Kapsam: src/components/PhasePage.tsx
const PHASES = ["faz-eksi-1", "faz-0", "faz-1", "faz-2", "faz-3", "faz-4", "faz-5"];
const WITH_EPICS = ["faz-3", "faz-4", "faz-5"];
const WITHOUT_EPICS = ["faz-eksi-1", "faz-0", "faz-1", "faz-2"];

const BASE = (process.env.SITE_BASE || "/").replace(/\/?$/, "/");
const withBase = (path: string) => (BASE + path.replace(/^\//, "")).replace(/\/{2,}/g, "/");

async function ready(page: Page, path: string) {
	await page.goto(withBase(path));
	await page.locator("[data-app-ready]").waitFor();
}

test.describe("faz sayfası: yerleşim", () => {
	for (const slug of PHASES) {
		test(`${slug}: sayfa yatay taşmıyor ve tek h1 var`, async ({ page }) => {
			await ready(page, `/fazlar/${slug}/`);
			const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
			expect(overflow).toBeLessThanOrEqual(0);
			await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
		});
	}

	test("görev kartı bağlantısı (#gorev-N) karta iniyor ve başlık üst çubuğun altında kalmıyor", async ({ page }) => {
		await ready(page, "/fazlar/faz-0/#gorev-3");
		await expect.poll(async () => page.locator("#gorev-3").evaluate((el) => Math.round(el.getBoundingClientRect().top)), { timeout: 5000 }).toBeGreaterThanOrEqual(56);
		const top = await page.locator("#gorev-3").evaluate((el) => el.getBoundingClientRect().top);
		expect(top).toBeLessThan(160);
	});

	test("onay kutusu çok satırlı metnin ilk satırıyla hizalı", async ({ page }) => {
		await ready(page, "/fazlar/faz-0/");
		// Characterization test maddesi dar ekranda birkaç satıra sarar.
		const row = page.locator("#gorev-1 .ant-checkbox-wrapper", { hasText: "Characterization test" }).first();
		await row.scrollIntoViewIfNeeded();
		const [box, label] = await Promise.all([
			row.locator(".ant-checkbox").evaluate((el) => el.getBoundingClientRect()),
			row.locator(".ant-checkbox-label").evaluate((el) => {
				const r = el.getBoundingClientRect();
				return { top: r.top, height: r.height, line: parseFloat(getComputedStyle(el).lineHeight) };
			}),
		]);
		// Kutunun alt kenarı ilk metin satırının içinde kalmalı.
		expect(box.bottom).toBeLessThanOrEqual(label.top + label.line + 1);
	});

	test("kontrol listesi satırları kart içinde fazladan girinti almıyor", async ({ page }) => {
		await ready(page, "/fazlar/faz-0/");
		const header = page.locator("#gorev-1 .ant-collapse-header").first();
		const headerLeft = await header.evaluate((el) => el.getBoundingClientRect().left);
		const box = page.locator("#gorev-1 .ant-checkbox").first();
		const boxLeft = await box.evaluate((el) => el.getBoundingClientRect().left);
		// Onay kutusu, panel başlığının sol kenarına yakın başlamalı (yalnız panel iç boşluğu kadar içeride).
		expect(boxLeft - headerLeft).toBeLessThanOrEqual(20);
	});
});

test.describe("faz sayfası: yönerge bağlantıları", () => {
	test("yönerge grubunun görünür başlığı var ve bağlantı adı tekrar içermiyor", async ({ page }) => {
		await ready(page, "/fazlar/faz-0/");
		const card = page.locator("#gorev-1");
		// Her kartta bir grup var. Landmark sayısını şişirmemek için nav değil group kullanılır.
		const group = card.getByRole("group", { name: "İlgili yönergeler" });
		await expect(card.getByRole("navigation")).toHaveCount(0);
		await expect(group).toBeVisible();
		await expect(card.getByText("İlgili yönergeler", { exact: true })).toBeVisible();
		const names = await group.getByRole("link").allInnerTexts();
		expect(names.length).toBeGreaterThan(0);
		for (const n of names) expect(n.startsWith("Yönerge:")).toBe(false);
		// TDD yönergesi başlığı aynen kullanılmalı.
		await expect(group.getByRole("link", { name: "TDD yönergesi" })).toHaveAttribute("href", /yonergeler\/01-tdd\//);
	});
});

test.describe("faz sayfası: epic listesi", () => {
	test("epic'i olmayan fazda boş durum, epic'i olan fazlara yönlendiriyor", async ({ page }) => {
		for (const slug of WITHOUT_EPICS) {
			await ready(page, `/fazlar/${slug}/`);
			const empty = page.locator("[data-epic-empty]");
			await expect(empty).toBeVisible();
			await expect(empty).toContainText("Bu fazda DocType epic'i yok");
			for (const name of ["Faz 3", "Faz 4", "Faz 5"]) await expect(empty.getByRole("link", { name })).toBeVisible();
			// Boş durumda süzgeç gösterilmez.
			await expect(page.getByRole("combobox", { name: "Bağlam süzgeci" })).toHaveCount(0);
		}
	});

	test("uzun epic listesi parça parça açılıyor", async ({ page }) => {
		await ready(page, "/fazlar/faz-4/");
		const cards = page.locator("[data-epic-card]");
		const first = await cards.count();
		expect(first).toBeGreaterThan(0);
		expect(first).toBeLessThanOrEqual(24);
		const more = page.getByRole("button", { name: /daha göster/i });
		await expect(more).toBeVisible();
		await expect(page.locator("[data-epic-status]")).toContainText(`${first}`);
		await more.click();
		await expect.poll(() => cards.count()).toBeGreaterThan(first);
		// Sayfa yüksekliği kabul edilebilir kalmalı (218 kartın tamamı açılmamalı).
		const h = await page.evaluate(() => document.documentElement.scrollHeight);
		expect(h).toBeLessThan(30000);
	});

	test("bütün epic'ler görünürken 'daha göster' düğmesi yok", async ({ page }) => {
		await ready(page, "/fazlar/faz-5/");
		const status = page.locator("[data-epic-status]");
		await expect(status).toContainText("Bu fazda 39 epic var");
		await expect(page.getByRole("button", { name: /daha göster/i })).toBeVisible();
		// Bir bağlam seçilince liste kısalır. Hepsi görünüyorsa düğme kalkar.
		await page.getByRole("combobox", { name: "Bağlam süzgeci" }).click();
		await page.locator(".ant-select-item-option").nth(1).click();
		await expect(status).toContainText("Bu bağlamda");
		if ((await status.innerText()).includes("Hepsi görünüyor")) await expect(page.getByRole("button", { name: /daha göster/i })).toHaveCount(0);
		else await expect(page.getByRole("button", { name: /daha göster/i })).toBeVisible();
	});

	test("bağlam süzgeci listeyi daraltıyor ve sayıyı güncelliyor", async ({ page }) => {
		await ready(page, "/fazlar/faz-3/");
		const select = page.getByRole("combobox", { name: "Bağlam süzgeci" });
		await select.click();
		const option = page.locator(".ant-select-item-option").nth(1);
		const label = (await option.innerText()).trim();
		await option.click();
		const cards = page.locator("[data-epic-card]");
		await expect.poll(() => cards.count()).toBeGreaterThan(0);
		const n = await cards.count();
		for (let i = 0; i < n; i++) await expect(cards.nth(i)).toContainText(label);
		await expect(page.locator("[data-epic-status]")).toContainText(`${n}`);
	});

	for (const slug of WITH_EPICS) {
		test(`${slug}: epic kartı başlığı, etiketleri ve kopyalama düğmesi var`, async ({ page }) => {
			await ready(page, `/fazlar/${slug}/`);
			const card = page.locator("[data-epic-card]").first();
			await expect(card.getByRole("link").first()).toBeVisible();
			await expect(card.getByText(/^Boyut: /)).toBeVisible();
			await expect(card.getByText(/^Bağlam: /)).toBeVisible();
			await expect(card.getByRole("button", { name: /epic'i kopyala/i })).toBeVisible();
		});
	}
});

test.describe("faz sayfası: hikâye metni", () => {
	test("görev hikâyesindeki ters tırnaklar kod olarak gösteriliyor", async ({ page }) => {
		await ready(page, "/fazlar/faz-2/");
		const story = page.locator("#gorev-1 .story");
		await expect(story).toBeVisible();
		await expect(story.locator("code")).toContainText("hooks.py");
		expect(await story.innerText()).not.toContain("`");
	});

	test("epic hikâyesindeki kod işaretleri kod olarak gösteriliyor", async ({ page }) => {
		const tasks = JSON.parse(readFileSync("src/data/tasks.json", "utf-8")) as { id: string; kind: string; phase: string; ctx: string }[];
		const docs = JSON.parse(readFileSync("src/data/doctype-summary.json", "utf-8")) as { id: string; title: string; epic?: { story?: string } }[];
		const byId = new Map(docs.map((d) => [d.id, d]));
		const hit = tasks.find((t) => t.kind === "Epic" && t.phase === "Faz 5" && byId.get(t.id)?.epic?.story?.includes("`"));
		expect(hit).toBeTruthy();
		await ready(page, "/fazlar/faz-5/");
		await page.getByRole("combobox", { name: "Bağlam süzgeci" }).click();
		await page.locator(".ant-select-item-option", { hasText: hit!.ctx }).first().click();
		const more = page.getByRole("button", { name: /hepsini göster|daha göster/i }).first();
		if (await more.count()) await more.click();
		const card = page.locator(`[data-epic-card="${hit!.id}"]`);
		await expect(card).toBeVisible();
		await expect(card.locator("code").first()).toBeVisible();
		expect(await card.innerText()).not.toContain("`");
	});
});

test.describe("faz sayfası: ilerleme ve gezinme", () => {
	test("işaretlenen madde sayfa yenilenince korunuyor ve panel başlığı ilerlemeyi gösteriyor", async ({ page }) => {
		await ready(page, "/fazlar/faz-0/");
		const card = page.locator("#gorev-2");
		const header = card.locator(".ant-collapse-header", { hasText: "Kabul kriterleri" });
		await expect(header).toContainText(/Kabul kriterleri \(\d+\)/);
		const box = card.locator(".ant-checkbox-input").first();
		await box.scrollIntoViewIfNeeded();
		await box.check();
		await expect(header).toContainText(/1 \/ \d+ işaretli/);
		await page.reload();
		await page.locator("[data-app-ready]").waitFor();
		await expect(page.locator("#gorev-2 .ant-checkbox-input").first()).toBeChecked();
		await expect(page.locator("#gorev-2 .ant-collapse-header", { hasText: "Kabul kriterleri" })).toContainText(/1 \/ \d+ işaretli/);
		// Başka görevin kutusu etkilenmez.
		await expect(page.locator("#gorev-1 .ant-checkbox-input").first()).not.toBeChecked();
		await page.locator("#gorev-2 .ant-checkbox-input").first().uncheck();
		await expect(page.locator("#gorev-2 .ant-collapse-header", { hasText: "Kabul kriterleri" })).toContainText(/Kabul kriterleri \(\d+\)$/);
	});

	test("sayfa sonunda önceki ve sonraki faz bağlantıları var", async ({ page }) => {
		await ready(page, "/fazlar/faz-0/");
		const nav = page.getByRole("navigation", { name: "Önceki ve sonraki faz" });
		await expect(nav.getByRole("link", { name: /Önceki faz: Faz −1/ })).toHaveAttribute("href", /fazlar\/faz-eksi-1\//);
		await expect(nav.getByRole("link", { name: /Sonraki faz: Faz 1/ })).toHaveAttribute("href", /fazlar\/faz-1\//);
		await ready(page, "/fazlar/faz-eksi-1/");
		await expect(page.getByRole("link", { name: /Önceki faz/ })).toHaveCount(0);
		await expect(page.getByRole("link", { name: /Sonraki faz: Faz 0/ })).toBeVisible();
		await ready(page, "/fazlar/faz-5/");
		await expect(page.getByRole("link", { name: /Sonraki faz/ })).toHaveCount(0);
		await expect(page.getByRole("link", { name: /Önceki faz: Faz 4/ })).toBeVisible();
	});

	test("geniş ekranda görev kartı okuma genişliğini aşmıyor", async ({ page }) => {
		await ready(page, "/fazlar/faz-0/");
		const w = await page.locator("#gorev-1").evaluate((el) => el.getBoundingClientRect().width);
		expect(w).toBeLessThanOrEqual(900);
	});
});

test.describe("faz sayfası: tasarım yönü", () => {
	test("metin sütunu yaklaşık 68 karakterde kalıyor", async ({ page }) => {
		await ready(page, "/fazlar/faz-0/");
		const m = await page.locator("[data-faz-column]").evaluate((el) => {
			const r = el.getBoundingClientRect();
			const probe = document.createElement("span");
			probe.textContent = "0".repeat(68);
			probe.style.cssText = "position:absolute;visibility:hidden;white-space:nowrap;font:inherit";
			el.appendChild(probe);
			const ch68 = probe.getBoundingClientRect().width;
			probe.remove();
			return { width: r.width, ch68, viewport: document.documentElement.clientWidth };
		});
		// Dar ekranda sütun ekranı doldurur. Geniş ekranda 68 karakteri aşmaz.
		expect(m.width).toBeLessThanOrEqual(Math.max(m.ch68 + 1, Math.min(m.viewport, m.ch68 + 1)));
	});

	test("görev numarası büyük ve sessiz, kutu kenarlığı yok", async ({ page }) => {
		await ready(page, "/fazlar/faz-0/");
		const task = page.locator("#gorev-1");
		const num = task.locator("[data-task-num]");
		await expect(num).toHaveText("1");
		const cs = await num.evaluate((el) => {
			const s = getComputedStyle(el);
			const body = getComputedStyle(document.body);
			return { size: parseFloat(s.fontSize), color: s.color, bodyColor: body.color };
		});
		expect(cs.size).toBeGreaterThanOrEqual(26);
		expect(cs.color).not.toBe(cs.bodyColor);
		const box = await task.evaluate((el) => {
			const s = getComputedStyle(el);
			return [s.borderLeftWidth, s.borderTopWidth, s.borderRightWidth, s.borderBottomWidth, s.boxShadow];
		});
		expect(box).toEqual(["0px", "0px", "0px", "0px", "none"]);
		// Numara ve başlık aynı satırda başlar.
		const [n, t] = await Promise.all([num.evaluate((el) => el.getBoundingClientRect()), task.locator("h3").evaluate((el) => el.getBoundingClientRect())]);
		expect(Math.abs(n.top - t.top)).toBeLessThan(12);
		expect(t.left).toBeGreaterThan(n.right);
	});

	test("açık panelde tek satırlık maddeler sıkı duruyor", async ({ page }) => {
		await ready(page, "/fazlar/faz-0/");
		const rows = await page.locator("#gorev-1 .ant-checkbox-wrapper").evaluateAll((els) =>
			els.map((el) => {
				const label = el.querySelector(".ant-checkbox-label")!;
				return { row: el.getBoundingClientRect().height, lines: Math.round(label.getBoundingClientRect().height / parseFloat(getComputedStyle(label).lineHeight)) };
			}),
		);
		const single = rows.filter((r) => r.lines === 1);
		if (single.length) for (const r of single) expect(r.row).toBeLessThanOrEqual(52);
		// Madde satırları arasında çizgi yok.
		const borders = await page.locator("#gorev-1 .ant-list-item").evaluateAll((els) => els.map((el) => getComputedStyle(el).borderBottomWidth));
		for (const b of borders) expect(b).toBe("0px");
	});

	test("faz geçişi 320 px'te tek satır ve numaraları sıralı", async ({ page }) => {
		await ready(page, "/fazlar/faz-0/");
		const links = page.locator("nav[aria-label='Fazlar'] a");
		await expect(links).toHaveCount(7);
		const tops = await links.evaluateAll((els) => els.map((el) => Math.round(el.getBoundingClientRect().top)));
		expect(new Set(tops).size).toBe(1);
		await expect(links.nth(0)).toHaveAccessibleName(/Faz −1/);
		await expect(links.nth(1)).toHaveAttribute("aria-current", "page");
	});

	test("meta bilgiler tek satırda duruyor", async ({ page }) => {
		await ready(page, "/fazlar/faz-0/");
		const meta = page.locator("#gorev-1 [data-task-meta] > *");
		const tops = await meta.evaluateAll((els) => els.map((el) => Math.round(el.getBoundingClientRect().top)));
		expect(tops.length).toBeGreaterThanOrEqual(2);
		expect(Math.max(...tops) - Math.min(...tops)).toBeLessThan(8);
	});
});

test.describe("faz sayfası: dokunma ve klavye", () => {
	test("'daha göster' sonrası odak ilk yeni karta geçiyor", async ({ page }) => {
		await ready(page, "/fazlar/faz-4/");
		const cards = page.locator("[data-epic-card]");
		const before = await cards.count();
		await page.getByRole("button", { name: /daha göster/i }).click();
		await expect.poll(() => cards.count()).toBeGreaterThan(before);
		const focusedIn = await page.evaluate((i) => {
			const el = document.activeElement;
			const card = document.querySelectorAll("[data-epic-card]")[i];
			return !!el && !!card && card.contains(el);
		}, before);
		expect(focusedIn).toBe(true);
	});


	// Hedef boyutunu tokens.css uygular. Bu testler yalnız sonucu ölçer.
	test("faz düğmeleri, kopyala ve yönerge bağlantıları en az 44px yüksek", async ({ page }) => {
		await ready(page, "/fazlar/faz-0/");
		const targets = page.locator("nav[aria-label='Fazlar'] a, #gorev-1 .ant-btn, #gorev-1 .ant-collapse-header");
		const n = await targets.count();
		for (let i = 0; i < n; i++) {
			const h = await targets.nth(i).evaluate((el) => el.getBoundingClientRect().height);
			expect(h, `hedef ${i}`).toBeGreaterThanOrEqual(44);
		}
	});

	test("onay kutulu satırlar en az 44px yüksek", async ({ page }) => {
		await ready(page, "/fazlar/faz-0/");
		const rows = page.locator("#gorev-1 .ant-list-item:has(.ant-checkbox)");
		const n = await rows.count();
		expect(n).toBeGreaterThan(0);
		for (let i = 0; i < n; i++) expect(await rows.nth(i).evaluate((el) => el.getBoundingClientRect().height), `satır ${i}`).toBeGreaterThanOrEqual(44);
	});

	test("klavye ile faz düğmesine gelince çevre halkası yok, arka plan sarı", async ({ page, browserName }) => {
		await ready(page, "/fazlar/faz-0/");
		const link = page.getByRole("link", { name: "Faz 1" }).first();
		await page.keyboard.press(browserName === "webkit" ? "Alt+Tab" : "Tab");
		await link.focus();
		const cs = await link.evaluate((el) => {
			const s = getComputedStyle(el);
			return { bg: s.backgroundColor, outline: s.outlineStyle, shadow: s.boxShadow };
		});
		expect(cs.bg).toBe("rgb(255, 214, 10)");
		expect(cs.outline).toBe("none");
		expect(cs.shadow).toBe("none");
	});
});
