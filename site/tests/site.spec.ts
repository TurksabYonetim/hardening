import { test, expect, type Page } from "@playwright/test";
import { readFileSync } from "node:fs";

const LONG = "/doctype/03a-katalog/product_category_required_certification/";
const PAGES = ["/", "/fazlar/faz-eksi-1/", "/yonergeler/", "/yonergeler/07-metrikler/", "/fazlar/faz-3/", "/kanban/", "/baglamlar/", "/baglamlar/04-siparis/", "/doctype/04-siparis/order/", LONG];

// Site bir alt yolda yayınlanabilir. Yapılandırma ile aynı değeri kullanırız.
const BASE = (process.env.SITE_BASE || "/").replace(/\/?$/, "/");

/** Taban yolu ile birleştirir. "/x/" mutlak yoldur ve baseURL'in alt yolunu düşürür. */
const withBase = (path: string) => (BASE + path.replace(/^\//, "")).replace(/\/{2,}/g, "/");

async function ready(page: Page, path: string) {
	await page.goto(withBase(path));
	await page.locator("[data-app-ready]").waitFor();
}

test.describe("yerleşim ve tipografi", () => {
	for (const path of PAGES) {
		test(`${path}: sayfa yatay taşmıyor`, async ({ page }) => {
			await ready(page, path);
			const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
			expect(overflow).toBeLessThanOrEqual(0);
		});

		test(`${path}: görünür metin en az 14px`, async ({ page }) => {
			await ready(page, path);
			const small = await page.evaluate(() => {
				const bad: string[] = [];
				const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
				while (walker.nextNode()) {
					const n = walker.currentNode as Text;
					if (!n.textContent?.trim()) continue;
					const el = n.parentElement!;
					const r = el.getBoundingClientRect();
					const cs = getComputedStyle(el);
					if (r.width === 0 || cs.visibility === "hidden" || cs.display === "none") continue;
					if (parseFloat(cs.fontSize) < 14) bad.push(`${el.tagName}.${el.className}: ${cs.fontSize} "${n.textContent.trim().slice(0, 30)}"`);
				}
				return bad.slice(0, 10);
			});
			expect(small).toEqual([]);
		});

		test(`${path}: köşe yarıçapı en çok 6px`, async ({ page }) => {
			await ready(page, path);
			const round = await page.evaluate(() => {
				const bad: string[] = [];
				for (const el of Array.from(document.querySelectorAll<HTMLElement>("body *"))) {
					if (el.closest("svg")) continue;
					const r = el.getBoundingClientRect();
					if (r.width === 0 || r.height === 0) continue;
					const cs = getComputedStyle(el);
					for (const k of ["borderTopLeftRadius", "borderTopRightRadius", "borderBottomLeftRadius", "borderBottomRightRadius"] as const) {
						const v = cs[k];
						const px = v.endsWith("%") ? (parseFloat(v) / 100) * Math.min(r.width, r.height) : parseFloat(v);
						if (px > 6.01) bad.push(`${el.tagName}.${el.className}: ${k}=${v}`);
					}
				}
				return bad.slice(0, 10);
			});
			expect(round).toEqual([]);
		});
	}
});

test.describe("kanban", () => {
	test("görev tek tıkla kopyalanıyor", async ({ page }) => {
		await ready(page, "/kanban/");
		const card = page.locator("[data-task-card]").first();
		const id = await card.getAttribute("data-task-card");
		await card.getByRole("button", { name: /kopyala/i }).click();
		await expect(page.getByText("Kopyalandı")).toBeVisible();
		const copied = await page.evaluate(() => (window as unknown as { __lastCopied?: string }).__lastCopied || "");
		expect(copied).toContain("Görev:");
		expect(copied).toContain(id!);
	});

	test("görevin durumu değişiyor ve sayfa yenilenince korunuyor", async ({ page }) => {
		await ready(page, "/kanban/");
		const card = page.locator("[data-task-card]").first();
		const id = (await card.getAttribute("data-task-card"))!;
		await card.getByRole("combobox", { name: /durum/i }).click();
		await page.locator('.ant-select-dropdown:visible .ant-select-item-option[title="Devam ediyor"]').click();
		await expect(page.getByText(/Devam ediyor sütununa taşındı/)).toBeVisible();
		const showColumn = async () => {
			const tab = page.getByRole("tab", { name: /^Devam ediyor/ });
			if (await tab.count()) {
				await tab.scrollIntoViewIfNeeded();
				await tab.click();
			}
		};
		await showColumn();
		await expect(page.locator(`[data-task-card="${id}"]`)).toHaveAttribute("data-status", "Devam ediyor");
		await page.reload();
		await page.locator("[data-app-ready]").waitFor();
		await showColumn();
		await expect(page.locator(`[data-task-card="${id}"]`)).toHaveAttribute("data-status", "Devam ediyor");
	});
});

test.describe("epic sayfası", () => {
	test("epic bölümleri ve kopyalama düğmesi var", async ({ page }) => {
		await ready(page, "/doctype/04-siparis/order/");
		await expect(page.getByRole("heading", { name: "Order" })).toBeVisible();
		await expect(page.getByRole("button", { name: /epic'i kopyala/i })).toBeVisible();
		for (const h of ["User story", "Kabul kriterleri", "Yapmamanız gerekenler", "Kontrol listesi", "Geçiş adımları"]) {
			await expect(page.getByText(h, { exact: true }).first()).toBeVisible();
		}
	});
});

test.describe("odak ve hareket", () => {
	test("Tab görünür gösterge açar ama çevre halkası çizmez, işaretçi modu kapatır", async ({ page, browserName }) => {
		await ready(page, "/");
		expect(await page.evaluate(() => document.documentElement.dataset.focusMode)).toBe("pointer");
		await page.keyboard.press(browserName === "webkit" ? "Alt+Tab" : "Tab");
		await expect.poll(() => page.evaluate(() => document.documentElement.dataset.focusMode)).toBe("keyboard");
		const style = await page.evaluate(() => {
			const el = document.activeElement as HTMLElement;
			const cs = getComputedStyle(el);
			return { outline: cs.outlineStyle, shadow: cs.boxShadow, bg: cs.backgroundColor, deco: cs.textDecorationLine, tag: el.tagName };
		});
		expect(style.tag).not.toBe("BODY");
		expect(style.outline).toBe("none");
		expect(style.shadow).toBe("none");
		expect(style.bg === "rgba(0, 0, 0, 0)" && style.deco === "none").toBe(false);
		await page.mouse.click(5, 300);
		await expect.poll(() => page.evaluate(() => document.documentElement.dataset.focusMode)).toBe("pointer");
	});

	test("ok tuşu ve Escape klavye modunu açmıyor", async ({ page }) => {
		await ready(page, "/");
		await page.keyboard.press("ArrowDown");
		await page.keyboard.press("Escape");
		expect(await page.evaluate(() => document.documentElement.dataset.focusMode)).toBe("pointer");
	});

	test("düğme geçişi simetrik eğri ve pozitif süre kullanıyor", async ({ page }) => {
		await ready(page, "/kanban/");
		const t = await page.locator("[data-task-card] .ant-btn").first().evaluate((el) => {
			const cs = getComputedStyle(el);
			return { fn: cs.transitionTimingFunction, dur: cs.transitionDuration };
		});
		expect(t.fn).toContain("cubic-bezier(0.65, 0, 0.35, 1)");
		expect(t.dur.split(",").every((d) => parseFloat(d) > 0)).toBe(true);
	});

	test("azaltılmış hareket tercihinde geçiş kalkıyor", async ({ page }) => {
		await page.emulateMedia({ reducedMotion: "reduce" });
		await ready(page, "/kanban/");
		const dur = await page.locator("[data-task-card] .ant-btn").first().evaluate((el) => getComputedStyle(el).transitionDuration);
		expect(dur.split(",").every((d) => parseFloat(d) === 0)).toBe(true);
	});
});

test.describe("inceleme bulguları", () => {
	test("rapor HTML'inde çalıştırılabilir içerik yok", async ({ page }) => {
		for (const path of ["/", "/doctype/04-siparis/order/", "/baglamlar/04-siparis/"]) {
			await ready(page, path);
			const bad = await page.evaluate(() =>
				Array.from(document.querySelectorAll(".md *, .md-inline *")).filter(
					(el) => el.tagName === "SCRIPT" || el.tagName === "IFRAME" || Array.from(el.attributes).some((a) => a.name.startsWith("on") || /^\s*javascript:/i.test(a.value)),
				).length,
			);
			expect(bad).toBe(0);
		}
	});

	test("başlık düzeyleri atlamıyor ve tek h1 var", async ({ page }) => {
		for (const path of ["/", "/doctype/04-siparis/order/", "/baglamlar/04-siparis/", "/yonergeler/06-veri-sahipligi-ve-olaylar/", "/fazlar/faz-0/"]) {
			await ready(page, path);
			await page.locator(".ant-collapse-header:visible").first().click({ timeout: 2000 }).catch(() => {});
			const levels = await page.evaluate(() => Array.from(document.querySelectorAll("h1,h2,h3,h4,h5,h6")).filter((h) => (h as HTMLElement).offsetParent).map((h) => Number(h.tagName[1])));
			expect(levels.filter((l) => l === 1).length).toBe(1);
			for (let i = 1; i < levels.length; i++) expect(levels[i] - levels[i - 1]).toBeLessThanOrEqual(1);
		}
	});

	test("onay kutusu klavye odağında görünür gösterge alıyor", async ({ page, browserName }) => {
		await ready(page, "/doctype/04-siparis/order/");
		const box = page.locator(".ant-checkbox-input").first();
		await box.scrollIntoViewIfNeeded();
		await page.keyboard.press(browserName === "webkit" ? "Alt+Tab" : "Tab");
		await box.focus();
		const bg = await page.locator(".ant-checkbox-wrapper").first().evaluate((el) => getComputedStyle(el).backgroundColor);
		expect(bg).toBe("rgb(255, 214, 10)");
	});

	test("düğmeler 'transition: all' kullanmıyor", async ({ page }) => {
		await ready(page, "/kanban/");
		const props = await page.locator("[data-task-card] .ant-btn").first().evaluate((el) => getComputedStyle(el).transitionProperty);
		expect(props).not.toContain("all");
	});

	test("kanban düğmelerinin adı görevi içeriyor", async ({ page }) => {
		await ready(page, "/kanban/");
		const card = page.locator("[data-task-card]").first();
		const title = (await card.locator(".ant-typography").first().innerText()).trim();
		await expect(card.getByRole("button", { name: new RegExp(`Kopyala: ${title.slice(0, 15).replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`) })).toHaveCount(1);
		await expect(card.getByRole("combobox", { name: /^Durum: / })).toHaveCount(1);
	});

	test("faz seçimi bağlantılarla yapılıyor", async ({ page }) => {
		await ready(page, "/fazlar/faz-0/");
		await expect(page.getByRole("link", { name: /Faz 3/ }).first()).toBeVisible();
		await expect(page.getByRole("link", { name: /Faz −1/ }).first()).toBeVisible();
	});
});

test.describe("hardening", () => {
	test("her görevin kabul kriterlerinde characterization test, shadow mode ve TDD var", () => {
		const tasks = JSON.parse(readFileSync("src/data/tasks.json", "utf-8"));
		const docs = JSON.parse(readFileSync("src/data/doctype-summary.json", "utf-8"));
		const byId = new Map(docs.map((d: { id: string }) => [d.id, d]));
		expect(tasks.length).toBeGreaterThan(350);
		const eksik: string[] = [];
		for (const t of tasks) {
			const kabul: string[] = t.acceptance || (byId.get(t.id) as { epic: { acceptance: string[] } })?.epic?.acceptance || [];
			const text = kabul.join("\n");
			if (!/Characterization test:/.test(text) || !/Shadow mode:/.test(text) || !/TDD:/.test(text)) eksik.push(t.id);
		}
		expect(eksik).toEqual([]);
	});

	test("Faz −1 ve Faz 0 görevleri var, CI kapısı Faz 0'da", async ({ page }) => {
		await ready(page, "/fazlar/faz-eksi-1/");
		await expect(page.getByRole("heading", { level: 1 })).toContainText("Faz −1");
		await ready(page, "/fazlar/faz-0/");
		await expect(page.getByText(/CI'a uygulama testlerini ekleyin/).first()).toBeVisible();
		await expect(page.getByText(/bench migrate/).first()).toBeVisible();
	});

	test("kopyalanan faz görevi kriterleri ve ajan talimatını içeriyor", async ({ page }) => {
		await ready(page, "/fazlar/faz-0/");
		await page.getByRole("button", { name: /görevi kopyala/i }).first().click();
		await expect(page.getByText("Kopyalandı")).toBeVisible();
		const copied = await page.evaluate(() => (window as unknown as { __lastCopied?: string }).__lastCopied || "");
		for (const k of ["Kabul kriterleri", "Characterization test:", "Shadow mode:", "TDD:", "Yapmamanız gerekenler", "Ajan talimatı"]) expect(copied).toContain(k);
	});

	test("kopyalanan epic kriterleri ve ajan talimatını içeriyor", async ({ page }) => {
		await ready(page, "/doctype/04-siparis/order/");
		await page.getByRole("button", { name: /epic'i kopyala/i }).click();
		await expect(page.getByText("Kopyalandı")).toBeVisible();
		const copied = await page.evaluate(() => (window as unknown as { __lastCopied?: string }).__lastCopied || "");
		for (const k of ["Characterization test:", "Shadow mode:", "Feature flag:", "Ajan talimatı"]) expect(copied).toContain(k);
	});

	test("yönergeler sayfası 9 yönergeyi listeliyor ve metrik hedefleri görünüyor", async ({ page }) => {
		await ready(page, "/yonergeler/");
		await expect(page.locator("[data-guide]")).toHaveCount(9);
		await ready(page, "/yonergeler/07-metrikler/");
		await expect(page.getByText("Bağlamlar arası Link alanı").first()).toBeVisible();
		await expect(page.getByRole("heading", { level: 2, name: "Nasıl ölçülür?" })).toBeVisible();
	});
});

test.describe("yayın", () => {
	test("bütün iç bağlantılar taban yolu ile başlıyor", async ({ page }) => {
		const base = BASE;
		for (const path of ["/", "/fazlar/faz-0/", "/kanban/", "/baglamlar/", "/yonergeler/", "/doctype/04-siparis/order/"]) {
			await ready(page, path);
			const kotu = await page.evaluate(
				(b) =>
					Array.from(document.querySelectorAll("a[href], [data-href]"))
						.map((a) => a.getAttribute("href") || "")
						.filter((h) => h.startsWith("/") && !h.startsWith(b)),
				base,
			);
			expect(kotu).toEqual([]);
		}
	});

	test("taban yolundaki gezinme bağlantıları açılıyor", async ({ page }) => {
		for (const ad of ["Fazlar", "Kanban", "Bağlamlar", "Yönergeler"]) {
			await ready(page, "/");
			// Dar ekranda gezinme menüsü çekmecede durur.
			const menu = page.getByRole("button", { name: "Menüyü aç" });
			if (await menu.count()) await menu.click();
			const link = page.getByRole("link", { name: ad, exact: true }).first();
			await link.click();
			await page.locator("[data-app-ready]").waitFor();
			await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
			expect(new URL(page.url()).pathname.startsWith(BASE)).toBe(true);
		}
	});

	test("varlık dosyaları taban yolundan yükleniyor", async ({ page }) => {
		const base = BASE;
		const hatali: string[] = [];
		page.on("response", (r) => {
			if (r.status() >= 400) hatali.push(`${r.status()} ${r.url()}`);
		});
		await ready(page, "/");
		const css = await page.evaluate((b) => Array.from(document.querySelectorAll("link[rel=stylesheet]")).map((l) => l.getAttribute("href") || "").filter((h) => h.startsWith("/") && !h.startsWith(b)), base);
		expect(css).toEqual([]);
		expect(hatali).toEqual([]);
	});
});
