import { expect, test, type Locator, type Page } from "@playwright/test";

test.beforeEach(({ page }) => {
	test.skip(![320, 375, 768, 1280].includes(page.viewportSize()?.width ?? 0), "Kapsam genişliği dışında");
});

const base = (process.env.SITE_BASE || "/").replace(/\/?$/, "/");

async function open(page: Page, path: string) {
	await page.goto(`${base}${path}`);
	await page.locator("[data-app-ready]").waitFor();
	return page.getByRole("main");
}

async function expectNoPageOverflow(page: Page) {
	expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(0);
}

async function expectHitTarget(control: Locator) {
	const height = await control.evaluate((element) => element.getBoundingClientRect().height);
	const minimum = await control.page().evaluate(() => matchMedia("(pointer: coarse)").matches ? 48 : 44);
	expect(height).toBeGreaterThanOrEqual(minimum);
}

test("ana sayfada ilk faz ve genel plan açılır", async ({ page }) => {
	const main = await open(page, "");
	await expect(main.getByRole("heading", { level: 1 })).toContainText("modüler monolit planı");
	await expect(main.getByText("Kod taşımadan önce Faz −1 görevlerini bitirin.")).toBeVisible();
	await expect(main.getByRole("alert")).toHaveCount(0);
	await expect(main.locator(".ant-statistic")).toHaveCount(0);
	await expect(main.getByRole("link", { name: /Faz −1.*Güvenlik ağı/ })).toHaveAttribute("href", `${base}fazlar/faz-eksi-1/`);
	const phases = main.getByRole("list", { name: "Fazlar" });
	await expect(phases.getByRole("link")).toHaveCount(7);
	await expect(phases.locator(".home-phase-number")).toHaveText(["−1", "0", "1", "2", "3", "4", "5"]);
	await expect(phases.locator(".anticon")).toHaveCount(0);
	const phaseWidths = await phases.evaluate((list) => {
		const sample = document.createElement("span");
		sample.style.cssText = "position: absolute; inline-size: var(--measure);";
		list.append(sample);
		const widths = [list.getBoundingClientRect().width, sample.getBoundingClientRect().width];
		sample.remove();
		return widths;
	});
	expect(phaseWidths[0]).toBeLessThanOrEqual(phaseWidths[1] + 1);

	const plan = main.getByRole("button", { name: "Planın tamamı" });
	await expect(plan).toHaveAttribute("aria-expanded", "false");
	await expectHitTarget(plan);
	await plan.press("Enter");
	await expect(plan).toHaveAttribute("aria-expanded", "true");
	await expect(main.locator(".md")).toBeVisible();
	await expectNoPageOverflow(page);
	await plan.press("Enter");
	await expect(plan).toHaveAttribute("aria-expanded", "false");
});

test("bağlam kartı kayıtlı epic ilerlemesini gösterir ve planı açar", async ({ page }) => {
	await page.addInitScript(() => localStorage.setItem("istoc-mimari-kanban-v1", JSON.stringify({ "04-siparis/order": "Bitti" })));
	const main = await open(page, "baglamlar/");
	const link = main.getByRole("link", { name: "04-siparis", exact: true });
	const card = main.getByRole("article").filter({ has: page.getByRole("link", { name: "04-siparis", exact: true }) });
	await expect(card.getByText("1 / 14 epic bitti")).toBeVisible();
	await expect(card.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "7");
	await expectHitTarget(link);
	await expectNoPageOverflow(page);

	await link.click();
	await expect(page).toHaveURL(/\/baglamlar\/04-siparis\/$/);
	await expect(page.getByRole("main").locator("dl").filter({ hasText: "Biten epic" })).toContainText(/1\s*\/\s*14/);
});

test("epic tablosu yana kayar ve ilk sütundaki adlar tek satırda kalır", async ({ page }) => {
	const main = await open(page, "baglamlar/04-siparis/");
	const region = main.getByRole("region", { name: "Epic tablosu" });
	const hint = main.getByText("Tüm sütunları görmek için tabloyu yana kaydırın.");
	const narrow = page.viewportSize()!.width < 640;
	await expect(hint).toBeVisible({ visible: narrow });
	await expect(region).toHaveAttribute("tabindex", "0");
	const cell = region.getByRole("row").nth(1).getByRole("cell").first();
	await expect(cell).toHaveCSS("white-space", "nowrap");
	await expect(cell).toHaveCSS("word-break", "normal");
	await expectHitTarget(cell.getByRole("link"));
	const scrollLeft = await region.evaluate((element) => {
		element.scrollLeft = element.scrollWidth;
		return element.scrollLeft;
	});
	if (narrow) expect(scrollLeft).toBeGreaterThan(0);
	else expect(scrollLeft).toBe(0);
	await expectNoPageOverflow(page);

	const section = main.getByRole("button", { name: /DocType listesi/ });
	await section.press("Enter");
	await expect(section).toHaveAttribute("aria-expanded", "true");
	await expectNoPageOverflow(page);
});
