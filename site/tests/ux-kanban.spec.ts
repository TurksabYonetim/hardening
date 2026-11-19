import { test, expect, type Page } from "@playwright/test";

// Kanban sayfasının UX kabul testleri. Her proje genişliğinde çalışır.
const BASE = (process.env.SITE_BASE || "/").replace(/\/?$/, "/");
const withBase = (path: string) => (BASE + path.replace(/^\//, "")).replace(/\/{2,}/g, "/");

async function ready(page: Page) {
	await page.goto(withBase("/kanban/"));
	await page.locator("[data-app-ready]").waitFor();
	// Geniş ekranın varsayılanı listedir. Bu dosyadaki testler pano görünümünü sınar.
	const pano = page.locator("[data-kanban-gorunum] .ant-segmented-item-label").filter({ hasText: "Pano" });
	if (await pano.count()) await pano.click();
	await page.locator("[data-task-card]").first().waitFor();
}

/** tokens.css içindeki etkileşim hedefi: farede 44, dokunmada 48 piksel. Değer testte tekrar yazılmaz. */
const hit = (page: Page) => page.evaluate(() => parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--hit")));

const isNarrow = (page: Page) => (page.viewportSize()?.width ?? 1280) < 992;

/** Bir kartın durumunu açılır listeden değiştirir. */
async function setStatus(page: Page, card: ReturnType<Page["locator"]>, to: string) {
	await card.getByRole("button", { name: /^Durum: / }).click();
	await page.getByRole("menuitem", { name: to, exact: true }).click();
}

test.describe("kanban UX", () => {
	test.beforeEach(async ({ page }) => {
		await page.addInitScript(() => {
			// Her test temiz bir pano ile başlar.
			if (!sessionStorage.getItem("ux-kanban-temiz")) {
				localStorage.removeItem("istoc-mimari-kanban-v1");
				sessionStorage.setItem("ux-kanban-temiz", "1");
			}
		});
	});

	test("telefonda dört sütun sekmesi de görünür ve etkileşim hedefi kadar yüksek", async ({ page }) => {
		test.skip(!isNarrow(page), "Geniş ekranda sekme yerine dört sütun var");
		await ready(page);
		const tabs = page.getByRole("tab");
		await expect(tabs).toHaveCount(4);
		const min = await hit(page);
		const vw = page.viewportSize()!.width;
		for (let i = 0; i < 4; i++) {
			const box = (await tabs.nth(i).boundingBox())!;
			expect(box.height).toBeGreaterThanOrEqual(min);
			expect(box.x).toBeGreaterThanOrEqual(0);
			expect(box.x + box.width).toBeLessThanOrEqual(vw);
		}
		await expect(page.getByRole("tab", { selected: true })).toHaveText(/Yapılacak/);
	});

	test("sekmeler ok tuşlarıyla değişir ve panel seçili sekmeye bağlıdır", async ({ page }) => {
		test.skip(!isNarrow(page), "Geniş ekranda sekme yok");
		await ready(page);
		const first = page.getByRole("tab").first();
		await first.focus();
		await page.keyboard.press("ArrowRight");
		await expect(page.getByRole("tab", { selected: true })).toHaveText(/Devam ediyor/);
		await expect(page.getByRole("tab", { name: /Devam ediyor/ })).toBeFocused();
		await page.keyboard.press("End");
		await expect(page.getByRole("tab", { selected: true })).toHaveText(/Bitti/);
		await page.keyboard.press("ArrowRight");
		await expect(page.getByRole("tab", { selected: true })).toHaveText(/Yapılacak/);
		const panel = page.getByRole("tabpanel");
		await expect(panel).toHaveAttribute("aria-labelledby", (await first.getAttribute("id"))!);
		// Ok tuşları klavye modunu açmaz. Yalnız Tab açar.
		expect(await page.evaluate(() => document.documentElement.dataset.focusMode)).toBe("pointer");
	});

	test("boş sütun ne yapılacağını söyler", async ({ page }) => {
		await ready(page);
		if (isNarrow(page)) await page.getByRole("tab", { name: /Bitti/ }).click();
		await expect(page.getByText(/Bu sütunda görev yok\./).first()).toBeVisible();
		await expect(page.getByText(/satırdaki durum noktasına dokunun/).first()).toBeVisible();
		await expect(page.locator(".ant-empty-image")).toHaveCount(0);
	});

	test("arama sonuç vermezse tek bir boş durum ve temizleme düğmesi görünür", async ({ page }) => {
		await ready(page);
		await page.getByRole("textbox", { name: "Görev ara" }).fill("zzzz-olmayan-gorev");
		await expect(page.getByText("Aramanıza uyan görev yok.")).toBeVisible();
		await expect(page.locator("[data-task-card]")).toHaveCount(0);
		await expect(page.getByRole("status")).toHaveText("Hiç görev bulunamadı.");
		await expect(page.getByRole("button", { name: "Aramayı ve seçimleri temizle" })).toHaveCount(1);
		await page.getByRole("button", { name: "Aramayı ve seçimleri temizle" }).click();
		await expect(page.getByRole("textbox", { name: "Görev ara" })).toHaveValue("");
		await expect(page.getByRole("status")).toHaveText(/Toplam 373 görev var/);
		await expect(page.locator("[data-task-card]").first()).toBeVisible();
	});

	test("arama bağlam adıyla da çalışır", async ({ page }) => {
		await ready(page);
		await page.getByRole("textbox", { name: "Görev ara" }).fill("lojistik");
		await expect(page.getByRole("status")).toHaveText(/^\d+ görev bulundu\.$/);
		await page.getByRole("textbox", { name: "Görev ara" }).fill("refund ödeme");
		await expect(page.getByRole("status")).toHaveText(/^\d+ görev bulundu\.$/);
		await page.getByRole("textbox", { name: "Görev ara" }).fill("lojistik");
		const n = Number((await page.getByRole("status").innerText()).match(/\d+/)![0]);
		expect(n).toBeGreaterThanOrEqual(39);
	});

	test("kart bağlamı okunur adla ve etiketle gösterir", async ({ page }) => {
		await ready(page);
		await expect(page.locator("[data-task-card]").first()).toContainText("Bağlam: Genel");
		await expect(page.locator("[data-task-card]").first().getByRole("button", { name: /^Durum: / })).toBeVisible();
	});

	test("daha fazla göster 30 kart ekler ve odağı ilk yeni karta taşır", async ({ page }) => {
		await ready(page);
		const column = isNarrow(page) ? page.getByRole("tabpanel") : page.locator(".ant-col").first();
		await expect(column.locator("[data-task-card]")).toHaveCount(30);
		await expect(column.getByText("373 görevden 30 tanesi görünüyor.")).toBeVisible();
		const more = column.getByRole("button", { name: "30 görev daha göster" });
		await more.click();
		await expect(column.locator("[data-task-card]")).toHaveCount(60);
		const thirtyFirst = column.locator("[data-task-card]").nth(30);
		await expect(thirtyFirst).toBeFocused();
	});

	test("süzgeç değişince liste yeniden 30 kartla başlar", async ({ page }) => {
		await ready(page);
		const column = isNarrow(page) ? page.getByRole("tabpanel") : page.locator(".ant-col").first();
		await column.getByRole("button", { name: /görev daha göster/ }).click();
		await expect(column.locator("[data-task-card]")).toHaveCount(60);
		await page.getByRole("combobox", { name: "Faz süzgeci" }).click();
		await page.locator('.ant-select-dropdown:visible .ant-select-item-option[title^="Faz 4 ("]').click();
		await expect(column.locator("[data-task-card]")).toHaveCount(30);
		await expect(page.getByRole("button", { name: "Aramayı ve seçimleri temizle" })).toBeVisible();
	});

	test("durum değişince odak aynı sütundaki sonraki karta geçer", async ({ page }) => {
		await ready(page);
		const cards = page.locator('[data-task-card][data-status="Yapılacak"]');
		const secondId = await cards.nth(1).getAttribute("data-task-card");
		await setStatus(page, cards.first(), "İncelemede");
		await expect(page.getByText(/İncelemede sütununa taşındı/)).toBeVisible();
		await expect(page.locator(`[data-task-card="${secondId}"]`)).toBeFocused();
		if (isNarrow(page)) await expect(page.getByRole("tab", { name: /İncelemede/ })).toHaveAccessibleName("İncelemede: 1 görev");
		else await expect(page.getByRole("heading", { level: 2, name: /^İncelemede 1$/ })).toBeVisible();
	});

	test("sayfa ve sütun sekmeleri yatay taşmıyor", async ({ page }) => {
		await ready(page);
		const over = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
		expect(over).toBeLessThanOrEqual(0);
		const wideCards = await page.locator("[data-task-card]").evaluateAll((els) => els.filter((e) => e.scrollWidth > e.clientWidth + 1).length);
		expect(wideCards).toBe(0);
	});

	test("kart düğmeleri ve süzgeçler etkileşim hedefi kadar yüksek", async ({ page }) => {
		await ready(page);
		const min = await hit(page);
		const card = page.locator("[data-task-card]").first();
		for (const loc of [card.getByRole("button", { name: /Kopyala/ }), card.getByRole("button", { name: /^Durum: / }), page.locator(".ant-input-affix-wrapper").first()]) {
			const box = (await loc.boundingBox())!;
			expect(box.height).toBeGreaterThanOrEqual(min);
		}
	});

	test("geniş ekranda sütun başlığı kaydırınca üst çubuğun altında kalır", async ({ page }) => {
		test.skip(isNarrow(page), "Telefonda sütun başlığı yerine sekme var");
		await ready(page);
		await page.evaluate(() => window.scrollTo(0, 2000));
		const heading = page.getByRole("heading", { level: 2, name: /^Yapılacak/ });
		await expect.poll(async () => (await heading.boundingBox())!.y).toBeGreaterThanOrEqual(0);
		const box = (await heading.boundingBox())!;
		const header = await page.locator("header").first().boundingBox();
		expect(box.y).toBeLessThanOrEqual((header?.height ?? 0) + 2);
		expect(box.y).toBeGreaterThanOrEqual((header?.height ?? 0) - 2);
	});

	test("süzgeç seçenekleri görev sayısını gösterir", async ({ page }) => {
		await ready(page);
		await page.getByRole("combobox", { name: "Bağlam süzgeci" }).click();
		await page.keyboard.type("Loji");
		await expect(page.locator('.ant-select-dropdown:visible .ant-select-item-option[title="Lojistik (39 görev)"]')).toHaveCount(1);
	});

	test("geniş ekranda klavye bir sütunu tek adımda atlar", async ({ page, browserName }) => {
		test.skip(isNarrow(page), "Telefonda sütunlar sekmeyle seçilir");
		await ready(page);
		const min = await hit(page);
		const skip = page.getByRole("button", { name: "“Devam ediyor” sütununa geç" });
		const hiddenBox = (await skip.boundingBox())!;
		expect(hiddenBox.width).toBeLessThanOrEqual(1);
		await page.getByRole("combobox", { name: "Bağlam süzgeci" }).focus();
		await page.keyboard.press(browserName === "webkit" ? "Alt+Tab" : "Tab");
		await expect(skip).toBeFocused();
		const shownBox = (await skip.boundingBox())!;
		expect(shownBox.height).toBeGreaterThanOrEqual(min);
		await page.keyboard.press("Enter");
		await expect(page.getByRole("heading", { level: 2, name: /^Devam ediyor/ })).toBeFocused();
		await page.keyboard.press(browserName === "webkit" ? "Alt+Tab" : "Tab");
		await expect(page.getByRole("button", { name: "“İncelemede” sütununa geç" })).toBeFocused();
	});

	test("durum bildirimi sütun adını kalın yazar", async ({ page }) => {
		await ready(page);
		await setStatus(page, page.locator("[data-task-card]").first(), "Bitti");
		const note = page.locator("[data-kanban-bildirim]");
		await expect(note).toHaveText("Görev Bitti sütununa taşındı.");
		await expect(note.locator("strong")).toHaveText("Bitti");
	});

	test("kartlar ekran okuyucuya liste olarak duyurulur", async ({ page }) => {
		await ready(page);
		const list = page.getByRole("list", { name: "Yapılacak sütunundaki görevler" });
		await expect(list).toHaveCount(1);
		await expect(list.getByRole("listitem")).toHaveCount(30);
	});

	test("Kanban kelimesi Nasıl çalışır bölümünde açıklanır", async ({ page }) => {
		await ready(page);
		// Sayfanın adı artık yaptığı işi söylüyor: Görevler. Kanban bir görünümdür.
		await expect(page.getByRole("heading", { level: 1, name: "Görevler" })).toBeVisible();
		await page.getByText("Nasıl çalışır?").click();
		await expect(page.getByText(/Kanban görünümü görevleri durumlarına göre dört sütuna ayırır\./)).toBeVisible();
	});

	test("durum kutusu tablette 320px genişliği aşmaz", async ({ page }) => {
		await ready(page);
		await page.locator("[data-task-card]").first().getByRole("button", { name: /^Durum: / }).click();
		const box = (await page.locator(".ant-dropdown:visible").boundingBox())!;
		expect(box.width).toBeLessThanOrEqual(320);
	});

	test("kayıtlı durumlar ilk çizimde doğru sayılır", async ({ page }) => {
		await page.addInitScript(() => {
			sessionStorage.setItem("ux-kanban-temiz", "1");
			localStorage.setItem("istoc-mimari-kanban-v1", JSON.stringify({ "05-odeme/supported_currency": "Bitti" }));
		});
		// Geniş ekranda sütun sayısı yalnız pano görünümünde yazar.
		await page.addInitScript(() => localStorage.setItem("istoc-kanban-gorunum", "pano"));
		await page.goto(withBase("/kanban/"));
		// İlk kart görünür olduğu anda sayı doğru olmalıdır. Sonradan düzelen sayı kabul edilmez.
		await page.locator("[data-task-card]").first().waitFor();
		const text = isNarrow(page)
			? await page.getByRole("tab", { name: /Bitti/ }).innerText()
			: await page.getByRole("heading", { level: 2, name: /^Bitti/ }).innerText();
		expect(text).toMatch(/1/);
	});

	test("başka sekmedeki durum değişikliği bu panoya gelir", async ({ page, context }) => {
		await ready(page);
		const id = (await page.locator("[data-task-card]").first().getAttribute("data-task-card"))!;
		const other = await context.newPage();
		await other.goto(withBase("/kanban/"));
		await other.locator("[data-task-card]").first().waitFor();
		await setStatus(other, other.locator(`[data-task-card="${id}"]`), "İncelemede");
		if (isNarrow(page)) await expect(page.getByRole("tab", { name: /İncelemede/ })).toHaveAccessibleName("İncelemede: 1 görev");
		else await expect(page.getByRole("heading", { level: 2, name: /^İncelemede 1$/ })).toBeVisible();
	});

	test("sekme geçişi azaltılmış hareket tercihinde kalkar", async ({ page }) => {
		test.skip(!isNarrow(page), "Geniş ekranda sekme yok");
		await page.emulateMedia({ reducedMotion: "reduce" });
		await ready(page);
		const dur = await page.getByRole("tab").first().evaluate((el) => getComputedStyle(el).transitionDuration);
		expect(dur.split(",").every((d) => parseFloat(d) === 0)).toBe(true);
		await page.emulateMedia({ reducedMotion: "no-preference" });
		const t = await page.getByRole("tab").first().evaluate((el) => ({ fn: getComputedStyle(el).transitionTimingFunction, dur: getComputedStyle(el).transitionDuration, prop: getComputedStyle(el).transitionProperty }));
		expect(t.fn).toContain("cubic-bezier(0.65, 0, 0.35, 1)");
		expect(parseFloat(t.dur)).toBeGreaterThan(0);
		expect(t.prop).not.toContain("all");
	});

	// 6. tur: tasarım yönü. Yerleşim ve yoğunluk.
	test("ilk görev kaydırmadan görünür", async ({ page }) => {
		await ready(page);
		const vh = page.viewportSize()!.height;
		const title = (await page.locator("[data-task-card]").first().locator("[data-kanban-baslik]").boundingBox())!;
		expect(title.y + title.height).toBeLessThanOrEqual(vh);
		const meta = (await page.locator("[data-task-card]").first().locator("[data-kanban-meta]").boundingBox())!;
		expect(meta.y + meta.height).toBeLessThanOrEqual(vh);
	});

	test("açıklama tek cümledir ve geri kalanı Nasıl çalışır bölümündedir", async ({ page }) => {
		await ready(page);
		const more = page.getByText(/^Bu sayfada 373 görev vardır\./);
		await expect(more).toBeHidden();
		await page.getByText("Nasıl çalışır?").click();
		await expect(more).toBeVisible();
		const box = (await page.locator("summary").boundingBox())!;
		expect(box.height).toBeGreaterThanOrEqual(await hit(page));
	});

	test("arama ve iki süzgeç tek satırdadır", async ({ page }) => {
		await ready(page);
		const boxes = await Promise.all(
			[page.locator(".ant-input-affix-wrapper").first(), page.locator('[data-kanban-suzgec] .ant-select').first(), page.locator('[data-kanban-suzgec] .ant-select').last()].map((l) => l.boundingBox()),
		);
		const tops = boxes.map((b) => Math.round(b!.y));
		expect(new Set(tops).size).toBe(1);
		// Kapalı süzgeç kısa ad gösterir. Uzun ad kesilmez.
		await expect(page.locator("[data-kanban-suzgec] .ant-select").last()).toContainText("Bağlam");
		const clipped = await page.locator("[data-kanban-suzgec] .ant-select").evaluateAll((els) => els.filter((e) => { const c = e.querySelector(".ant-select-content-value, .ant-select-content") as HTMLElement | null; return !!c && c.scrollWidth > c.clientWidth + 1; }).length);
		expect(clipped).toBe(0);
	});

	test("kartta tek ana düğme var, Aç sessiz bir bağlantıdır", async ({ page }) => {
		await ready(page);
		const card = page.locator("[data-task-card]").first();
		await expect(card.locator(".ant-btn-primary")).toHaveCount(0);
		await expect(card.getByRole("button", { name: /^Kopyala/ })).toHaveCount(1);
		// Başlığın kendisi bağlantıdır. Satırda ikinci bir "Aç" düğmesi yoktur.
		const open = card.getByRole("link");
		await expect(open).toHaveCount(1);
		await expect(open).not.toHaveClass(/ant-btn/);
	});

	test("kartın üst bilgisi tek satırdadır ve kart kutu değildir", async ({ page }) => {
		await ready(page);
		const card = page.locator("[data-task-card]").first();
		const tops = await card.locator("[data-kanban-meta] > *").evaluateAll((els) => els.map((e) => Math.round(e.getBoundingClientRect().top + e.getBoundingClientRect().height / 2)));
		const rows = new Set(tops.map((y) => Math.round(y / 4))).size;
		// Geniş kartta üst bilgi tek satırdır. Masaüstündeki dar sütunda en çok iki satıra sarılır.
		const width = (await card.boundingBox())!.width;
		expect(rows).toBeLessThanOrEqual(width >= 320 ? 1 : 2);
		const style = await card.evaluate((e) => { const c = getComputedStyle(e); return { shadow: c.boxShadow, left: c.borderLeftWidth, top: c.borderTopWidth }; });
		expect(style).toEqual({ shadow: "none", left: "0px", top: "0px" });
	});

	test("arama kutusu süzgeçlerle aynı yüksekliktedir", async ({ page }) => {
		await ready(page);
		const a = (await page.locator(".ant-input-affix-wrapper").first().boundingBox())!;
		expect(a.height).toBeGreaterThanOrEqual(await hit(page));
		expect(a.height).toBeLessThanOrEqual((await hit(page)) + 1);
	});
});
