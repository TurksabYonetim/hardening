import { test, expect, type Page } from "@playwright/test";

// Site bir alt yolda yayınlanabilir. Testler yapılandırma ile aynı tabanı kullanır.
const BASE = (process.env.SITE_BASE || "/").replace(/\/?$/, "/");
const withBase = (path: string) => (BASE + path.replace(/^\//, "")).replace(/\/{2,}/g, "/");

const SLUGS = [
	"00-ajan-talimati",
	"01-tdd",
	"02-characterization-test",
	"03-shadow-mode",
	"04-is-kurallari",
	"05-olay-sozlesmesi",
	"06-veri-sahipligi-ve-olaylar",
	"07-metrikler",
	"08-pr-sablonu",
];

async function ready(page: Page, path: string) {
	await page.goto(withBase(path));
	await page.locator("[data-app-ready]").waitFor();
}

test.describe("yönerge listesi", () => {
	test("dokuz yönerge sıra numarasıyla listeleniyor", async ({ page }) => {
		await ready(page, "/yonergeler/");
		const items = page.locator("[data-guide]");
		await expect(items).toHaveCount(9);
		await expect(items.first().locator(".guide-no")).toHaveText("1");
		await expect(items.last().locator(".guide-no")).toHaveText("9");
	});

	test("yönerge adı kırpılmıyor", async ({ page }) => {
		await ready(page, "/yonergeler/");
		const kirpik = await page.evaluate(() =>
			Array.from(document.querySelectorAll<HTMLElement>(".guide-title"))
				.filter((el) => el.scrollWidth - el.clientWidth > 1 || getComputedStyle(el).textOverflow === "ellipsis")
				.map((el) => el.textContent || ""),
		);
		expect(kirpik).toEqual([]);
	});

	test("yönerge bağlantısı en az 44 piksel yüksekliğinde", async ({ page }) => {
		await ready(page, "/yonergeler/");
		const kucuk = await page.evaluate(() =>
			Array.from(document.querySelectorAll<HTMLElement>(".guide-link"))
				.map((el) => el.getBoundingClientRect().height)
				.filter((h) => h < 44),
		);
		expect(kucuk).toEqual([]);
	});

	test("yönerge bağlantısı yönerge sayfasını açıyor", async ({ page }) => {
		await ready(page, "/yonergeler/");
		await page.locator("[data-guide] .guide-link").first().click();
		await page.waitForURL(`**${withBase(`/yonergeler/${SLUGS[0]}/`)}`);
		await page.locator("[data-app-ready]").waitFor();
		expect(new URL(page.url()).pathname).toBe(withBase(`/yonergeler/${SLUGS[0]}/`));
		await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
	});
});

test.describe("yönerge sayfası", () => {
	test("geniş tablo dar ekranda kendi kutusunda yana kayıyor", async ({ page }, info) => {
		const genislik = info.project.use.viewport?.width ?? 0;
		test.skip(genislik >= 768, "Bu kontrol yalnız dar ekranda anlamlıdır.");
		await ready(page, "/yonergeler/07-metrikler/");
		const kutu = page.locator(".md-scrollbox").first();
		await expect(kutu).toHaveAttribute("data-scrollable", "");
		await expect(kutu.locator(".md-scroll-hint")).toBeVisible();
		const kayma = await kutu.locator(".md-scroll").evaluate((el) => {
			el.scrollLeft = 200;
			return el.scrollLeft;
		});
		expect(kayma).toBeGreaterThan(0);
		const tasma = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
		expect(tasma).toBeLessThanOrEqual(0);
	});

	test("tablo kutusu klavyeyle kaydırılabiliyor", async ({ page }, info) => {
		const genislik = info.project.use.viewport?.width ?? 0;
		test.skip(genislik >= 768, "Dar ekranda tablo kayar. Geniş ekranda tablo sığar.");
		await ready(page, "/yonergeler/07-metrikler/");
		const scroller = page.locator(".md-scrollbox[data-scrollable] .md-scroll").first();
		await expect(scroller).toHaveAttribute("tabindex", "0");
		await scroller.focus();
		await page.keyboard.press("ArrowRight");
		await expect.poll(() => scroller.evaluate((el) => el.scrollLeft)).toBeGreaterThan(0);
	});

	test("geniş ekranda tablo sığıyor ve ipucu gizli", async ({ page }, info) => {
		const genislik = info.project.use.viewport?.width ?? 0;
		test.skip(genislik < 768, "Bu kontrol yalnız geniş ekranda anlamlıdır.");
		await ready(page, "/yonergeler/07-metrikler/");
		await expect(page.locator(".md-scrollbox[data-scrollable]")).toHaveCount(0);
		await expect(page.locator(".md-scroll-hint").first()).toBeHidden();
	});

	test("sığan tablo klavye sırasında durak olmuyor", async ({ page }) => {
		await ready(page, "/yonergeler/07-metrikler/");
		const sigan = page.locator(".md-scrollbox:not([data-scrollable]) .md-scroll");
		for (let i = 0; i < (await sigan.count()); i++) await expect(sigan.nth(i)).not.toHaveAttribute("tabindex", "0");
	});

	test("sığan tabloda kaydırma ipucu gizli", async ({ page }) => {
		await ready(page, "/yonergeler/07-metrikler/");
		const dar = page.locator(".md-scrollbox:not([data-scrollable])");
		for (let i = 0; i < (await dar.count()); i++) await expect(dar.nth(i).locator(".md-scroll-hint")).toBeHidden();
	});

	test("uzun kod dar ekranda kendi kutusunda yana kayıyor", async ({ page }, info) => {
		const genislik = info.project.use.viewport?.width ?? 0;
		test.skip(genislik >= 768, "Geniş ekranda kod satırı sığar.");
		await ready(page, "/yonergeler/04-is-kurallari/");
		const kutu = page.locator('.md-scrollbox[data-kind="kod"]').first();
		await expect(kutu).toHaveAttribute("data-scrollable", "");
		await expect(kutu.locator(".md-scroll-hint")).toBeVisible();
		const kod = kutu.locator("pre.md-scroll");
		await expect(kod).toHaveAttribute("tabindex", "0");
		await kod.focus();
		await page.keyboard.press("ArrowRight");
		await expect.poll(() => kod.evaluate((el) => el.scrollLeft)).toBeGreaterThan(0);
		const tasma = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
		expect(tasma).toBeLessThanOrEqual(0);
	});

	test("sığan kodda kaydırma ipucu gizli", async ({ page }) => {
		await ready(page, "/yonergeler/04-is-kurallari/");
		const sigan = page.locator('.md-scrollbox[data-kind="kod"]:not([data-scrollable])');
		const adet = await sigan.count();
		expect(adet).toBeGreaterThan(0);
		for (let i = 0; i < adet; i++) await expect(sigan.nth(i).locator(".md-scroll-hint")).toBeHidden();
	});

	test("başlıkların kendi numarası varsa içindekiler ikinci numara yazmıyor", async ({ page }) => {
		await ready(page, "/yonergeler/06-veri-sahipligi-ve-olaylar/");
		await expect(page.locator("ol.guide-toc-plain")).toHaveCount(1);
		const stil = await page.locator("ol.guide-toc-plain").evaluate((el) => getComputedStyle(el).listStyleType);
		expect(stil).toBe("none");
		await ready(page, "/yonergeler/07-metrikler/");
		await expect(page.locator("ol.guide-toc-plain")).toHaveCount(0);
	});

	test("yönerge sayfasındaki hedefler en az 44 piksel", async ({ page }) => {
		await ready(page, "/yonergeler/07-metrikler/");
		await page.locator("details.guide-toc summary").click();
		await expect(page.locator("details.guide-toc")).toHaveAttribute("open", "");
		const kucuk = await page.evaluate(() =>
			Array.from(document.querySelectorAll<HTMLElement>(".guide-toc-head, .guide-toc-list a, .guide-nav a"))
				.map((el) => ({ ad: (el.textContent || "").trim().slice(0, 24), h: el.getBoundingClientRect().height }))
				.filter((x) => x.h > 0 && x.h < 44),
		);
		expect(kucuk).toEqual([]);
	});

	test("önceki ve sonraki bağlantıları görünür adla duruyor", async ({ page }) => {
		await ready(page, "/yonergeler/01-tdd/");
		const nav = page.getByRole("navigation", { name: "Yönergeler arasında gezinme" });
		await expect(nav.getByText("Önceki yönerge")).toBeVisible();
		await expect(nav.getByText("Sonraki yönerge")).toBeVisible();
		await expect(nav.locator("a")).toHaveCount(3);
		await expect(nav.getByRole("link", { name: "Bütün yönergeleri gör" })).toBeVisible();
	});

	test("ilk yönergede önceki yok, son yönergede sonraki yok", async ({ page }) => {
		await ready(page, `/yonergeler/${SLUGS[0]}/`);
		let nav = page.getByRole("navigation", { name: "Yönergeler arasında gezinme" });
		await expect(nav.getByText("Önceki yönerge")).toHaveCount(0);
		await expect(nav.getByText("Sonraki yönerge")).toBeVisible();
		await ready(page, `/yonergeler/${SLUGS[8]}/`);
		nav = page.getByRole("navigation", { name: "Yönergeler arasında gezinme" });
		await expect(nav.getByText("Önceki yönerge")).toBeVisible();
		await expect(nav.getByText("Sonraki yönerge")).toHaveCount(0);
	});

	test("sonraki bağlantısı bir sonraki yönergeyi açıyor", async ({ page }) => {
		await ready(page, `/yonergeler/${SLUGS[0]}/`);
		await page.getByRole("link", { name: /^Sonraki yönerge:/ }).click();
		await page.waitForURL(`**${withBase(`/yonergeler/${SLUGS[1]}/`)}`);
		await page.locator("[data-app-ready]").waitFor();
		expect(new URL(page.url()).pathname).toBe(withBase(`/yonergeler/${SLUGS[1]}/`));
	});

	test("içindekiler bölüm başlığına atlıyor", async ({ page }) => {
		await ready(page, "/yonergeler/07-metrikler/");
		const toc = page.locator("details.guide-toc");
		await expect(toc).toHaveCount(1);
		await toc.locator("summary").click();
		await expect(toc).toHaveAttribute("open", "");
		const ilk = toc.locator("a").first();
		const hedef = (await ilk.getAttribute("href")) || "";
		expect(hedef).toMatch(/^#bolum-\d+$/);
		await ilk.click();
		const baslik = page.locator(hedef);
		await expect(baslik).toBeVisible();
		const ust = await baslik.evaluate((el) => el.getBoundingClientRect().top);
		expect(ust).toBeGreaterThanOrEqual(56);
	});

	test("kopyala düğmesi yönerge metnini panoya alıyor", async ({ page }) => {
		await ready(page, "/yonergeler/01-tdd/");
		await page.getByRole("button", { name: /Yönergeyi kopyala/ }).click();
		await expect(page.getByText("Kopyalandı")).toBeVisible();
		const metin = await page.evaluate(() => (window as unknown as { __lastCopied?: string }).__lastCopied || "");
		expect(metin).toContain("TDD");
		expect(metin.length).toBeGreaterThan(200);
	});
});

test.describe("bütün yönergeler", () => {
	for (const slug of SLUGS) {
		test(`${slug}: yatay taşma yok ve metin en az 14 piksel`, async ({ page }) => {
			await ready(page, `/yonergeler/${slug}/`);
			const tasma = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
			expect(tasma).toBeLessThanOrEqual(0);
			const kucuk = await page.evaluate(() => {
				const bad: string[] = [];
				const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
				while (walker.nextNode()) {
					const n = walker.currentNode as Text;
					if (!n.textContent?.trim()) continue;
					const el = n.parentElement!;
					const r = el.getBoundingClientRect();
					const cs = getComputedStyle(el);
					if (r.width === 0 || cs.visibility === "hidden" || cs.display === "none") continue;
					if (parseFloat(cs.fontSize) < 14) bad.push(`${el.tagName}: ${cs.fontSize}`);
				}
				return bad.slice(0, 5);
			});
			expect(kucuk).toEqual([]);
		});
	}
});

test.describe("hareket", () => {
	test("yönerge geçişleri proje eğrisini ve pozitif süreyi kullanıyor", async ({ page }) => {
		await ready(page, "/yonergeler/07-metrikler/");
		for (const sec of [".guide-toc-caret", ".guide-nav-link"]) {
			const stil = await page.locator(sec).first().evaluate((el) => {
				const cs = getComputedStyle(el);
				return { prop: cs.transitionProperty, dur: cs.transitionDuration, ease: cs.transitionTimingFunction };
			});
			expect(stil.prop).not.toContain("all");
			expect(parseFloat(stil.dur)).toBeGreaterThan(0);
			expect(stil.ease).toBe("cubic-bezier(0.65, 0, 0.35, 1)");
		}
	});
});

test.describe("azaltılmış hareket", () => {
	test.use({ reducedMotion: "reduce" });

	test("azaltılmış hareket tercihinde geçiş kalkıyor", async ({ page }) => {
		await ready(page, "/yonergeler/07-metrikler/");
		const dur = await page.locator(".guide-toc-caret").first().evaluate((el) => getComputedStyle(el).transitionDuration);
		expect(parseFloat(dur)).toBe(0);
	});
});

test.describe("tasarım yönü", () => {
	test("geniş ekranda düz yazı dar kalır, tablo geniş olur", async ({ page }, info) => {
		const genislik = info.project.use.viewport?.width ?? 0;
		test.skip(genislik < 1024, "Bu kontrol yalnız geniş ekranda anlamlıdır.");
		await ready(page, "/yonergeler/07-metrikler/");
		const yazi = await page.locator(".guide-body .md > p").first().evaluate((el) => el.getBoundingClientRect().width);
		const tablo = await page.locator(".guide-body .md > .md-scrollbox").first().evaluate((el) => el.getBoundingClientRect().width);
		expect(yazi).toBeLessThan(900);
		expect(tablo).toBeGreaterThan(yazi);
	});

	test("öncelik etiketi rengini tasarım tokenından alır", async ({ page }) => {
		await ready(page, "/baglamlar/");
		const etiket = page.locator(".ant-tag").first();
		test.skip((await etiket.count()) === 0, "Bu sayfada şu anda etiket yok.");
		const sonuc = await etiket.evaluate((el) => {
			const cs = getComputedStyle(el);
			const kok = getComputedStyle(document.documentElement);
			const tokenlar = ["kriz", "kritik", "acil", "onemli", "dusuk"].map((k) => kok.getPropertyValue(`--${k}-bg`).trim());
			return { bg: cs.backgroundColor, kenar: parseFloat(cs.borderTopWidth), tokenlar };
		});
		const hex = (r: string) => {
			const [a, b, c] = r.replace(/[^\d,]/g, "").split(",").map(Number);
			return "#" + [a, b, c].map((n) => n.toString(16).padStart(2, "0")).join("");
		};
		expect(sonuc.tokenlar).toContain(hex(sonuc.bg));
		expect(sonuc.kenar).toBe(0);
	});
});
