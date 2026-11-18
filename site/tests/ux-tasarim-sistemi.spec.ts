import { test, expect, type Page } from "@playwright/test";

// Bu dosya tasarım sistemini (tokens.css + theme.ts) korur.
// Bileşen dosyaları başka ajanlara aittir ve burada denetlenmez.

const BASE = (process.env.SITE_BASE || "/").replace(/\/?$/, "/");
const go = (p: string) => (BASE + p.replace(/^\//, "")).replace(/\/{2,}/g, "/");

async function ready(page: Page, path: string) {
	await page.goto(go(path));
	await page.locator("[data-app-ready]").waitFor();
}

/** İki rengin WCAG kontrast oranı. Girdi "rgb(r, g, b)" biçimindedir. */
function contrast(a: string, b: string): number {
	const lum = (c: string) => {
		const [r, g, bl] = c.match(/\d+(\.\d+)?/g)!.slice(0, 3).map((n) => Number(n) / 255);
		const f = (v: number) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
		return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(bl);
	};
	const [l1, l2] = [lum(a), lum(b)].sort((x, y) => y - x);
	return (l1 + 0.05) / (l2 + 0.05);
}

test.describe("tipografi", () => {
	test("Outfit yükleniyor ve gövde onu kullanıyor", async ({ page }) => {
		await ready(page, "/");
		const aile = await page.evaluate(() => getComputedStyle(document.body).fontFamily);
		expect(aile).toMatch(/^"?Outfit"?/);
		// Üç ağırlık da tanımlı olmalı ve gerçekten kullanılmalı.
		const tanimli = await page.evaluate(() => {
			const w = new Set<string>();
			for (const ss of Array.from(document.styleSheets)) {
				try {
					for (const r of Array.from(ss.cssRules) as CSSFontFaceRule[]) {
						if (r.constructor.name === "CSSFontFaceRule" && /Outfit/.test(r.style.fontFamily)) w.add(r.style.fontWeight);
					}
				} catch {
					/* başka kaynaktan gelen stil okunamaz */
				}
			}
			return [...w];
		});
		for (const w of ["400", "500", "600"]) expect(tanimli).toContain(w);
		const kullanilan = await page.evaluate(async () => {
			await document.fonts.ready;
			return [...document.fonts].filter((f) => f.family === "Outfit" && f.status === "loaded").map((f) => f.weight);
		});
		for (const w of ["400", "500", "600"]) expect(kullanilan).toContain(w);
	});

	test("Türkçe harfler yedek yazı tipine düşmüyor", async ({ page }) => {
		await ready(page, "/");
		const eksik = await page.evaluate(async () => {
			await document.fonts.ready;
			return "İıĞğŞşÇçÖöÜü₺".split("").filter((ch) => !document.fonts.check('16px "Outfit"', ch));
		});
		expect(eksik).toEqual([]);
	});

	test("başlık içindeki kod 14px'e sıkışmıyor", async ({ page }) => {
		await ready(page, "/yonergeler/07-metrikler/");
		const olcu = await page.evaluate(() => {
			const el = document.createElement("h2");
			el.className = "md-olcum";
			el.style.fontSize = "28px";
			el.innerHTML = '<code>test</code>';
			document.querySelector(".md")?.appendChild(el);
			const px = parseFloat(getComputedStyle(el.querySelector("code")!).fontSize);
			el.remove();
			return px;
		});
		expect(olcu).toBeGreaterThanOrEqual(14);
		expect(olcu).toBeGreaterThan(20);
	});

	test("sayılar sütun hâlinde hizalanıyor", async ({ page }) => {
		await ready(page, "/");
		// Bileşen işaretlemesine bağlı kalmamak için kendi örneğimizi ölçeriz.
		const v = await page.evaluate(() => {
			const el = document.createElement("span");
			el.className = "ant-statistic-content-value";
			document.body.appendChild(el);
			const r = getComputedStyle(el).fontVariantNumeric;
			el.remove();
			return r;
		});
		expect(v).toContain("tabular-nums");
	});

	test("kod fosforlu kalem gibi vurgulanıyor, kutu içine alınmıyor", async ({ page }) => {
		await ready(page, "/kanban/");
		const k = await page.evaluate(() => {
			const el = document.querySelector("code");
			if (!el) return null;
			const cs = getComputedStyle(el);
			return { bg: cs.backgroundImage, border: cs.borderStyle, radius: cs.borderRadius };
		});
		expect(k).not.toBeNull();
		expect(k!.bg).toContain("gradient");
		expect(k!.border).toBe("none");
	});

	test("üst çubuktaki gezinme yazıları en az 4.5:1 kontrast veriyor", async ({ page }) => {
		await ready(page, "/");
		const olcum = await page.evaluate(() => {
			const h = document.querySelector(".ant-layout-header") as HTMLElement;
			const bg = getComputedStyle(h).backgroundColor;
			return Array.from(h.querySelectorAll("a")).map((a) => ({ fg: getComputedStyle(a).color, bg }));
		});
		expect(olcum.length).toBeGreaterThan(0);
		for (const o of olcum) expect(contrast(o.fg, o.bg)).toBeGreaterThanOrEqual(4.5);
	});

	test("uzun açıklama satırı okunur genişlikte duruyor", async ({ page }) => {
		await ready(page, "/yonergeler/01-tdd/");
		const genislik = await page.locator(".md p").first().evaluate((el) => el.getBoundingClientRect().width);
		const punto = await page.locator(".md p").first().evaluate((el) => parseFloat(getComputedStyle(el).fontSize));
		// Yaklaşık 60-80 karakter. Karakter genişliği ortalama 0.5em sayılır.
		expect(genislik / (punto * 0.5)).toBeLessThan(90);
	});
});

test.describe("boşluk ve dokunma", () => {
	test("sayfa kenarı ekran genişliğine göre değişiyor", async ({ page }) => {
		await ready(page, "/");
		const oku = () => page.evaluate(() => parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--gutter")));
		await page.setViewportSize({ width: 320, height: 700 });
		const dar = await oku();
		await page.setViewportSize({ width: 1280, height: 800 });
		const genis = await oku();
		expect(dar).toBeLessThanOrEqual(12);
		expect(genis).toBeGreaterThanOrEqual(32);
	});

	test("boşluk anlamları ayrı tokenlarda duruyor", async ({ page }) => {
		await ready(page, "/");
		const t = await page.evaluate(() => {
			const s = getComputedStyle(document.documentElement);
			return ["--gutter", "--gap", "--gap-dense", "--pad-card", "--hit"].map((k) => s.getPropertyValue(k).trim());
		});
		expect(t.every((v) => /^\d+px$/.test(v))).toBe(true);
		expect(new Set(t).size).toBeGreaterThan(2);
	});

	test("dokunma hedefi en az 44px", async ({ page }) => {
		await ready(page, "/kanban/");
		const kucuk = await page.evaluate(() =>
			Array.from(document.querySelectorAll<HTMLElement>(".ant-btn, .ant-select-selector"))
				.filter((el) => el.getBoundingClientRect().width > 0)
				.filter((el) => el.getBoundingClientRect().height < 44)
				.slice(0, 5)
				.map((el) => `${el.className}: ${Math.round(el.getBoundingClientRect().height)}px`),
		);
		expect(kucuk).toEqual([]);
	});

	test("çentik alanı sayfa kenarında ayrılıyor", async ({ page }) => {
		await ready(page, "/");
		const kural = await page.evaluate(() => {
			const el = document.querySelector(".ant-layout-content") as HTMLElement;
			return getComputedStyle(el).paddingLeft;
		});
		expect(parseFloat(kural)).toBeGreaterThan(0);
	});
});

test.describe("renk", () => {
	test("ayırıcı ve kenarlık en az 3:1 kontrast veriyor", async ({ page }) => {
		await ready(page, "/");
		const { bg, divider, border } = await page.evaluate(() => {
			const s = getComputedStyle(document.documentElement);
			const topx = (v: string) => {
				const d = document.createElement("div");
				d.style.color = v;
				document.body.appendChild(d);
				const c = getComputedStyle(d).color;
				d.remove();
				return c;
			};
			return { bg: topx(s.getPropertyValue("--color-bg")), divider: topx(s.getPropertyValue("--color-divider")), border: topx(s.getPropertyValue("--color-border")) };
		});
		expect(contrast(divider, bg)).toBeGreaterThanOrEqual(3);
		expect(contrast(border, bg)).toBeGreaterThanOrEqual(3);
	});

	test("gövde metni en az 4.5:1 kontrast veriyor", async ({ page }) => {
		await ready(page, "/");
		const r = await page.evaluate(() => {
			const el = document.querySelector(".ant-typography") as HTMLElement;
			return { fg: getComputedStyle(el).color, bg: getComputedStyle(document.body).backgroundColor };
		});
		expect(contrast(r.fg, r.bg)).toBeGreaterThanOrEqual(4.5);
	});
});

test.describe("hareket", () => {
	test("geçişler 'all' kullanmıyor ve simetrik eğriyle çalışıyor", async ({ page }) => {
		await ready(page, "/kanban/");
		const t = await page.locator(".ant-btn").first().evaluate((el) => {
			const cs = getComputedStyle(el);
			return { prop: cs.transitionProperty, fn: cs.transitionTimingFunction, dur: cs.transitionDuration };
		});
		expect(t.prop).not.toContain("all");
		expect(t.fn).toContain("cubic-bezier(0.65, 0, 0.35, 1)");
		expect(t.dur.split(",").every((d) => parseFloat(d) > 0)).toBe(true);
	});

	test("pseudo-element geçişleri de onaylı eğriyi kullanıyor", async ({ page }) => {
		await ready(page, "/");
		// Sonda bileşen işaretlemesine bağlı kalmamak için kendi örneğimizi ölçeriz.
		const fn = await page.evaluate(() => {
			const el = document.createElement("span");
			el.className = "ant-olcum";
			document.body.appendChild(el);
			const v = getComputedStyle(el, "::after").transitionTimingFunction;
			el.remove();
			return v;
		});
		expect(fn).toContain("cubic-bezier(0.65, 0, 0.35, 1)");
	});
});
