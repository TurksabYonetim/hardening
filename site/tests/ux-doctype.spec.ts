import { test, expect, type Page } from "@playwright/test";

// DocType epic sayfasının kullanılabilirlik testleri. Sayfa: src/components/DoctypePage.tsx
const ORDER = "/doctype/04-siparis/order/";
const LONG = "/doctype/03a-katalog/product_category_required_certification/";

const BASE = (process.env.SITE_BASE || "/").replace(/\/?$/, "/");
const withBase = (path: string) => (BASE + path.replace(/^\//, "")).replace(/\/{2,}/g, "/");

async function ready(page: Page, path: string) {
	await page.goto(withBase(path));
	await page.locator("[data-app-ready]").waitFor();
}

const width = (page: Page) => page.viewportSize()!.width;

test.describe("epic sayfası: başlık bölümü", () => {
	test("alt başlık DocType adını tekrar etmiyor", async ({ page }) => {
		await ready(page, ORDER);
		const sub = page.locator("[data-doc-subtitle]");
		await expect(sub).toBeVisible();
		const text = (await sub.innerText()).trim();
		expect(text.startsWith("Order:")).toBe(false);
		expect(text).toContain("04-siparis");
	});

	test("Yönergeler bağlantısı etiket satırında değil, eylem olarak yazılı", async ({ page }) => {
		await ready(page, ORDER);
		await expect(page.locator("[data-doc-tags] a")).toHaveCount(0);
		const link = page.locator("[data-doc-actions] a[href$='/yonergeler/']");
		await expect(link).toHaveCount(1);
	});

	test("uzun başlık taşmıyor ve kelime ortasından bölünmüyor", async ({ page }) => {
		await ready(page, LONG);
		const h1 = page.getByRole("heading", { level: 1 });
		const ok = await h1.evaluate((el) => el.scrollWidth <= el.clientWidth + 1);
		expect(ok).toBe(true);
		const bad = await h1.evaluate((el) => {
			// Her satır sonundaki karakter boşluktan önce gelmeli.
			const node = el.firstChild as Text;
			const r = document.createRange();
			let lastTop = -1;
			const breaks: string[] = [];
			for (let i = 0; i < node.length; i++) {
				r.setStart(node, i);
				r.setEnd(node, i + 1);
				const rect = r.getBoundingClientRect();
				if (!rect.width) continue;
				if (lastTop >= 0 && rect.top > lastTop + 4 && node.data[i - 1] !== " ") breaks.push(node.data.slice(i - 3, i + 3));
				lastTop = rect.top;
			}
			return breaks;
		});
		expect(bad).toEqual([]);
	});
});

test.describe("epic sayfası: içerik", () => {
	test("onay kutusu metnin ilk satırıyla hizalı", async ({ page }) => {
		await ready(page, LONG);
		const diffs = await page.locator("[data-doc-epic] .ant-checkbox-wrapper").evaluateAll((ws) =>
			ws.map((w) => {
				const box = w.querySelector(".ant-checkbox")!.getBoundingClientRect();
				const label = w.querySelector(".ant-checkbox-label")!.getBoundingClientRect();
				return Math.abs(box.top - label.top);
			}),
		);
		expect(diffs.length).toBeGreaterThan(5);
		for (const d of diffs) expect(d).toBeLessThanOrEqual(8);
	});

	test("onay kutusu tıklanınca işaretleniyor", async ({ page }) => {
		await ready(page, ORDER);
		const first = page.locator("[data-doc-epic] .ant-checkbox-wrapper").first();
		await first.click();
		await expect(first.locator("input")).toBeChecked();
	});

	test("adım kopyalama düğmesi adımı panoya veriyor", async ({ page }) => {
		await ready(page, ORDER);
		await page.getByRole("button", { name: /^2\. adımı kopyala/ }).click();
		await expect(page.getByText("Kopyalandı")).toBeVisible();
		const copied = await page.evaluate(() => (window as unknown as { __lastCopied?: string }).__lastCopied || "");
		expect(copied).toContain("geçiş adımı 2");
		expect(copied).toContain("ordering/state.py");
	});
});

test.describe("epic sayfası: gezinme ve dokunma", () => {
	test("önceki ve sonraki bağlantıları yönü yazıyla söylüyor", async ({ page }) => {
		await ready(page, ORDER);
		const nav = page.locator("[data-doc-pager]");
		await expect(nav.getByRole("link", { name: /Önceki: Coupon/ })).toBeVisible();
		await expect(nav.getByRole("link", { name: /Sonraki: Order Approval/ })).toBeVisible();
		await expect(nav).toContainText("Önceki");
		await expect(nav).toContainText("Sonraki");
	});

	test("sonraki bağlantısı sağa yaslı", async ({ page }) => {
		test.skip(width(page) < 600, "Telefonda alt alta durur");
		await ready(page, ORDER);
		const nav = page.locator("[data-doc-pager]");
		const navBox = (await nav.boundingBox())!;
		const next = (await nav.getByRole("link", { name: /Sonraki/ }).boundingBox())!;
		expect(Math.abs(navBox.x + navBox.width - (next.x + next.width))).toBeLessThanOrEqual(2);
	});

	test("dokunma hedefleri en az 44px", async ({ page }) => {
		await ready(page, ORDER);
		const small = await page.evaluate(() => {
			const sel = "[data-doc-root] .ant-btn, [data-doc-root] .ant-tabs-tab, [data-doc-root] .ant-collapse-header, [data-doc-pager] a";
			return Array.from(document.querySelectorAll<HTMLElement>(sel))
				.map((el) => ({ el, r: el.getBoundingClientRect() }))
				.filter(({ r }) => r.width > 0 && r.height < 44)
				.map(({ el, r }) => `${el.className} ${Math.round(r.height)} ${el.textContent?.trim().slice(0, 20)}`);
		});
		expect(small).toEqual([]);
	});

	test("rapor sekmesi bütün bölümler açıkken taşmıyor", async ({ page }) => {
		await ready(page, ORDER);
		await page.getByRole("tab", { name: "Rapor" }).click();
		const headers = page.locator(".ant-collapse-header");
		const n = await headers.count();
		for (let i = 1; i < n; i++) await headers.nth(i).click();
		await page.waitForTimeout(400);
		const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
		expect(overflow).toBeLessThanOrEqual(0);
	});

	test("klavye ile sekmeler arasında geçiliyor", async ({ page, browserName }) => {
		await ready(page, ORDER);
		const tab = page.getByRole("tab", { name: "Epic" });
		await tab.focus();
		await page.keyboard.press("ArrowRight");
		await page.keyboard.press(browserName === "webkit" ? "Enter" : "Enter");
		await expect(page.getByRole("tab", { name: "Rapor" })).toHaveAttribute("aria-selected", "true");
	});
});

test.describe("epic sayfası: 2. tur", () => {
	test("kabul kriterleri sayacı işaretlenince artıyor", async ({ page }) => {
		await ready(page, ORDER);
		const counter = page.locator('[data-doc-progress="acceptance"]');
		await expect(counter).toHaveText("0 / 10 tamam");
		await page.locator("[data-doc-epic] .ant-checkbox-wrapper").first().click();
		await expect(counter).toHaveText("1 / 10 tamam");
		await expect(page.locator('[data-doc-progress="checklist"]')).toHaveText("0 / 5 tamam");
	});

	test("işaretlerin saklanmadığı yazıyla söyleniyor", async ({ page }) => {
		await ready(page, ORDER);
		await expect(page.locator("[data-doc-epic]")).toContainText("Sayfa yenilenince işaretler silinir.");
	});

	test("Rapor sekmesi bölüm sayısını söylüyor", async ({ page }) => {
		await ready(page, ORDER);
		await expect(page.getByRole("tab", { name: "Rapor (6 bölüm)" })).toBeVisible();
	});

	test("bütün bölümler tek düğmeyle açılıp kapanıyor", async ({ page }) => {
		await ready(page, ORDER);
		await page.getByRole("tab", { name: /Rapor/ }).click();
		const toggle = page.getByRole("button", { name: "Bütün bölümleri aç" });
		await toggle.click();
		await expect(page.locator(".ant-collapse-item-active")).toHaveCount(6);
		const close = page.getByRole("button", { name: "Bütün bölümleri kapat" });
		await close.click();
		await expect(page.locator(".ant-collapse-item-active")).toHaveCount(0);
	});
});

test("alt başlıktaki bağlam adı tireden bölünmüyor", async ({ page }) => {
	await ready(page, "/doctype/01-kimlik-erisim/approval_rule/");
	const ws = await page.locator("[data-doc-subtitle] span").first().evaluate((el) => getComputedStyle(el).whiteSpace);
	expect(ws).toBe("nowrap");
	await expect(page.locator("[data-doc-subtitle] span").first()).toHaveText("04-siparis");
});

test.describe("epic sayfası: 3. tur klavye", () => {
	test("sekme panelinin kendisi Tab sırasına girmiyor", async ({ page, browserName }) => {
		await ready(page, ORDER);
		await page.getByRole("tab", { name: "Epic" }).focus();
		await page.keyboard.press(browserName === "webkit" ? "Alt+Tab" : "Tab");
		const role = await page.evaluate(() => document.activeElement?.getAttribute("role") || document.activeElement?.tagName);
		expect(role).not.toBe("tabpanel");
		await page.getByRole("tab", { name: /Rapor/ }).click();
		await page.getByRole("tab", { name: /Rapor/ }).focus();
		await page.keyboard.press(browserName === "webkit" ? "Alt+Tab" : "Tab");
		const role2 = await page.evaluate(() => document.activeElement?.getAttribute("role") || document.activeElement?.tagName);
		expect(role2).not.toBe("tabpanel");
	});
});

test("telefonda rapor bölümlerinin iç boşluğu metne yer bırakıyor", async ({ page }) => {
	test.skip(width(page) > 375, "Yalnız telefon genişliği: 320 ve 375 px");
	await ready(page, ORDER);
	await page.getByRole("tab", { name: /Rapor/ }).click();
	const pad = await page.locator(".ant-collapse-body").first().evaluate((el) => parseFloat(getComputedStyle(el).paddingLeft));
	expect(pad).toBeLessThanOrEqual(12);
});

test.describe("epic sayfası: 4. tur", () => {
	test("bütün maddeler işaretlenince sayaç 'Hepsi tamam' diyor", async ({ page }) => {
		await ready(page, ORDER);
		const boxes = page.locator("[data-doc-checklist='checklist'] .ant-checkbox-wrapper");
		const n = await boxes.count();
		for (let i = 0; i < n; i++) await boxes.nth(i).click();
		await expect(page.locator('[data-doc-progress="checklist"]')).toHaveText(`Hepsi tamam (${n} / ${n})`);
	});

	test("kopyalama düğmelerinin ne işe yaradığı yazıyor", async ({ page }) => {
		await ready(page, ORDER);
		await expect(page.locator("[data-doc-actions]")).toContainText("Kopyalanan metni bir geliştiriciye ya da yapay zekâ ajanına verin.");
	});

});

test("geçiş adımının metni ve düğmesi numaranın sağında hizalı", async ({ page }) => {
	await ready(page, ORDER);
	const rows = await page.locator("[data-doc-step]").evaluateAll((els) =>
		els.map((el) => {
			const num = el.querySelector("[data-step-num]")!.getBoundingClientRect();
			const body = el.querySelector("[data-step-body]")!.getBoundingClientRect();
			const btn = el.querySelector(".ant-btn")!.getBoundingClientRect();
			return { numRight: num.right, bodyLeft: body.left, btnLeft: btn.left };
		}),
	);
	expect(rows.length).toBe(10);
	const left = rows[0].bodyLeft;
	for (const r of rows) {
		expect(r.bodyLeft).toBeGreaterThanOrEqual(r.numRight);
		expect(Math.abs(r.btnLeft - r.bodyLeft)).toBeLessThanOrEqual(1);
		expect(Math.abs(r.bodyLeft - left)).toBeLessThanOrEqual(1);
	}
});

test.describe("6. tur: tasarım yönü", () => {
	test("geniş ekranda okuma sütunu yaklaşık 68 karakter", async ({ page }) => {
		test.skip(width(page) < 1200, "Yalnız geniş ekran");
		await ready(page, ORDER);
		const { col, ch } = await page.evaluate(() => {
			const probe = document.createElement("span");
			probe.textContent = "0".repeat(68);
			probe.style.cssText = "font-size:16px;position:absolute;visibility:hidden;white-space:nowrap";
			document.body.appendChild(probe);
			const ch = probe.getBoundingClientRect().width;
			probe.remove();
			const els = Array.from(document.querySelectorAll<HTMLElement>("[data-doc-subtitle], [data-doc-actions] p, [data-doc-epic] .story, [data-doc-epic] .ant-list-item"));
			return { col: Math.max(...els.map((e) => e.getBoundingClientRect().width)), ch };
		});
		expect(col).toBeLessThanOrEqual(ch * 1.08);
		expect(col).toBeGreaterThan(ch * 0.8);
	});

	test("meta bilgiler tek satırda ve yalnız öncelik renkli", async ({ page }) => {
		test.skip(width(page) < 768, "Telefonda satır kırılabilir");
		await ready(page, ORDER);
		const meta = page.locator("[data-doc-tags]");
		for (const t of ["Kritik", "Faz 3", "Büyük iş", "04-siparis", "Ana kayıt"]) await expect(meta).toContainText(t);
		const items = await meta.locator(":scope > *").evaluateAll((els) =>
			els.map((e) => ({ mid: (e.getBoundingClientRect().top + e.getBoundingClientRect().bottom) / 2, bg: getComputedStyle(e).backgroundColor, border: getComputedStyle(e).borderTopStyle, text: e.textContent })),
		);
		for (const i of items) expect(Math.abs(i.mid - items[0].mid)).toBeLessThanOrEqual(3);
		const tinted = items.filter((i) => i.bg !== "rgba(0, 0, 0, 0)");
		expect(tinted.map((i) => i.text)).toEqual(["Kritik"]);
		for (const i of items.slice(1)) expect(i.border === "none" || i.border === "").toBe(true);
	});

	test("bilgi tablosu yerine dosya yolları kapalı bir ayrıntıda", async ({ page }) => {
		await ready(page, LONG);
		await expect(page.locator("[data-doc-meta]")).toHaveCount(0);
		const files = page.locator("[data-doc-files]");
		await expect(files.locator("summary")).toContainText("product_category_required_certification.py");
		await expect(files.locator("summary")).toContainText("5 satır");
		await expect(files.locator("[data-doc-path]").first()).toBeHidden();
		await files.locator("summary").click();
		await expect(files.locator("[data-doc-path]")).toHaveCount(2);
		await expect(files.locator("[data-doc-path]").nth(1)).toContainText("tradehub_core/tradehub_core/doctype/");
		const over = await files.locator("[data-doc-path]").evaluateAll((els) => els.filter((e) => e.scrollWidth > e.clientWidth + 1).length);
		expect(over).toBe(0);
	});

	test("ayrıntı başlığı dokunma hedefi kadar yüksek", async ({ page }) => {
		await ready(page, ORDER);
		const h = await page.locator("[data-doc-files] summary").evaluate((el) => el.getBoundingClientRect().height);
		expect(h).toBeGreaterThanOrEqual(44);
	});

	test("açık dosya yolu yalnız / ya da _ işaretinden sonra satır atlıyor", async ({ page }) => {
		await ready(page, LONG);
		await page.locator("[data-doc-files] summary").click();
		const bad = await page.locator("[data-doc-path] code").evaluateAll((codes) => {
			const out: string[] = [];
			for (const code of codes) {
				const walker = document.createTreeWalker(code, NodeFilter.SHOW_TEXT);
				const chars: { ch: string; top: number }[] = [];
				const r = document.createRange();
				while (walker.nextNode()) {
					const n = walker.currentNode as Text;
					for (let i = 0; i < n.length; i++) {
						r.setStart(n, i);
						r.setEnd(n, i + 1);
						const rect = r.getBoundingClientRect();
						if (rect.width) chars.push({ ch: n.data[i], top: rect.top });
					}
				}
				for (let i = 1; i < chars.length; i++) if (chars[i].top > chars[i - 1].top + 4 && !/[/_ ]/.test(chars[i - 1].ch)) out.push(chars.slice(Math.max(0, i - 4), i + 4).map((c) => c.ch).join(""));
			}
			return out;
		});
		expect(bad).toEqual([]);
	});

	test("önerilen sahip farklıysa kısa bir cümleyle yazıyor", async ({ page }) => {
		await ready(page, "/doctype/01-kimlik-erisim/approval_rule/");
		await expect(page.locator("[data-doc-owner]")).toContainText("Önerilen sahip");
		await ready(page, ORDER);
		await expect(page.locator("[data-doc-owner]")).toHaveCount(0);
	});

	test("ikincil kopyalama eylemleri sessiz bağlantı görünümünde", async ({ page }) => {
		await ready(page, ORDER);
		const quiet = await page.evaluate(() => {
			const btns = Array.from(document.querySelectorAll<HTMLElement>("[data-doc-root] .ant-btn")).filter((b) => /Raporun tamamını kopyala|adımı kopyala/.test(b.textContent || ""));
			return btns.map((b) => ({ t: b.textContent, bg: getComputedStyle(b).backgroundColor, bw: getComputedStyle(b).borderTopWidth, bs: getComputedStyle(b).borderTopStyle, bc: getComputedStyle(b).borderTopColor }));
		});
		expect(quiet.length).toBe(11);
		for (const q of quiet) {
			expect(q.bg).toBe("rgba(0, 0, 0, 0)");
			expect(q.bs === "none" || q.bw === "0px" || q.bc === "rgba(0, 0, 0, 0)").toBe(true);
		}
		const primary = page.getByRole("button", { name: /Epic'i kopyala/ });
		expect(await primary.evaluate((b) => getComputedStyle(b).backgroundColor)).not.toBe("rgba(0, 0, 0, 0)");
	});

	test("kullanıcı hikâyesi kutu içinde değil", async ({ page }) => {
		await ready(page, ORDER);
		const bg = await page.locator("[data-doc-epic] .story").evaluate((el) => getComputedStyle(el).backgroundColor);
		expect(bg).toBe("rgba(0, 0, 0, 0)");
	});

	test("önceki ve sonraki bağlantıları çerçevesiz", async ({ page }) => {
		await ready(page, ORDER);
		const styles = await page.locator("[data-doc-pager] .ant-btn").evaluateAll((els) => els.map((e) => [getComputedStyle(e).borderTopStyle, getComputedStyle(e).borderTopWidth, getComputedStyle(e).borderTopColor]));
		for (const [s, w, c] of styles) expect(s === "none" || w === "0px" || c === "rgba(0, 0, 0, 0)").toBe(true);
	});
});
