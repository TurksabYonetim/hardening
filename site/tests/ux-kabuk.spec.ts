import { test, expect, type Page } from "@playwright/test";

// Kabuk testleri. Kapsam: üst çubuk, çekmece menüsü, ana menü, yol izi,
// sayfa kabı, alt bilgi, başa dön düğmesi ve içeriğe geç bağlantısı.

const BASE = (process.env.SITE_BASE || "/").replace(/\/?$/, "/");
const withBase = (path: string) => (BASE + path.replace(/^\//, "")).replace(/\/{2,}/g, "/");

// Gelistirme sunucusu alti ajan arasinda paylasilir. Baska bir ajan dosya kaydedince
// Vite sayfayi test ortasinda yeniden yukler. Bu yuzden bir kez yeniden deneriz.
// Bu ayar gercek bir hatayi gizlemez. Surekli basarisiz olan test yine basarisiz olur.
test.describe.configure({ retries: 1 });

const HOME = "/";
const DEEP = "/doctype/03a-katalog/product_category_required_certification/";
const PAGES = [HOME, "/fazlar/faz-3/", "/kanban/", "/baglamlar/", "/baglamlar/12-bildirim-iletisim/", "/yonergeler/", "/yonergeler/06-veri-sahipligi-ve-olaylar/", DEEP];

// Gelistirme sunucusu paylasimlidir. Baska bir ajan dosya kaydedince sayfa yeniden yuklenir.
// Bu yuzden isareti bulamazsak sayfayi bir kez daha acariz.
async function ready(page: Page, path: string) {
	for (let deneme = 0; deneme < 3; deneme++) {
		try {
			await page.goto(withBase(path), { waitUntil: "domcontentloaded" });
			await page.locator("[data-app-ready]").waitFor({ timeout: 12_000 });
			return;
		} catch (hata) {
			if (deneme === 2) throw hata;
		}
	}
}

/** Geniş ekranda ana menü üst çubukta durur. Dar ekranda çekmecede durur. */
async function isWide(page: Page) {
	return (await page.locator(".shell-nav").count()) > 0;
}

test.describe("kabuk: üst çubuk", () => {
	test("üst çubuk, içerik ve alt bilgi aynı hizada başlar", async ({ page }) => {
		for (const path of [HOME, DEEP]) {
			await ready(page, path);
			const kutular = await page.evaluate(() => {
				const al = (sel: string) => {
					const el = document.querySelector(sel);
					if (!el) return null;
					const r = el.getBoundingClientRect();
					return { left: Math.round(r.left), width: Math.round(r.width) };
				};
				return { bar: al(".shell-topbar"), main: al(".shell-main"), footer: al(".shell-footer-inner") };
			});
			expect(kutular.bar).not.toBeNull();
			expect(kutular.main).toEqual(kutular.bar);
			expect(kutular.footer).toEqual(kutular.bar);
		}
	});

	test("site adı her sayfada ana sayfaya götürür", async ({ page }) => {
		await ready(page, DEEP);
		const logo = page.locator(".shell-logo");
		await expect(logo).toHaveAttribute("href", withBase("/"));
		await expect(logo).toBeVisible();
	});
});

test.describe("kabuk: ana menü", () => {
	test("açık olan sayfanın menü bağlantısı işaretlidir", async ({ page }) => {
		const beklenen: Array<[string, string]> = [
			[HOME, "Genel bakış"],
			["/fazlar/faz-3/", "Fazlar"],
			["/kanban/", "Kanban"],
			[DEEP, "Bağlamlar"],
			["/yonergeler/06-veri-sahipligi-ve-olaylar/", "Yönergeler"],
		];
		for (const [path, ad] of beklenen) {
			await ready(page, path);
			if (!(await isWide(page))) await page.getByRole("button", { name: "Menüyü aç" }).click();
			const isaretli = page.locator('nav[aria-label="Ana menü"] a[aria-current="page"]');
			await expect(isaretli).toHaveCount(1);
			await expect(isaretli).toHaveText(ad);
			if (!(await isWide(page))) await page.keyboard.press("Escape");
		}
	});

	test("menü düğmesinin simgesi sayfa başlığıyla aynı hizada başlar", async ({ page }) => {
		await ready(page, "/kanban/");
		test.skip(await isWide(page), "Menü düğmesi yalnız dar ekranda vardır.");
		const hiza = await page.evaluate(() => {
			const ico = document.querySelector(".shell-menu-btn .anticon")!.getBoundingClientRect();
			const h1 = document.querySelector("h1")!.getBoundingClientRect();
			return Math.abs(ico.x - h1.x);
		});
		expect(hiza).toBeLessThanOrEqual(1);
	});

	test("menü bağlantısı satırın tamamını kaplar, basılacak alan yeterlidir", async ({ page }) => {
		await ready(page, HOME);
		const wide = await isWide(page);
		if (!wide) await page.getByRole("button", { name: "Menüyü aç" }).click();
		const kucuk = await page.evaluate(() => {
			const kotu: string[] = [];
			for (const li of Array.from(document.querySelectorAll('nav[aria-label="Ana menü"] li'))) {
				const a = li.querySelector("a");
				if (!a) {
					kotu.push("bağlantısız satır");
					continue;
				}
				const lr = li.getBoundingClientRect();
				const ar = a.getBoundingClientRect();
				if (ar.height < 44) kotu.push(`${a.textContent} yüksekliği ${ar.height}`);
				// Bağlantı satırın tamamını kaplamalı. Ölü tıklama alanı kalmamalı.
				if (Math.abs(ar.height - lr.height) > 1 || Math.abs(ar.width - lr.width) > 1) kotu.push(`${a.textContent} satırı doldurmuyor`);
			}
			return kotu;
		});
		expect(kucuk).toEqual([]);
	});

	test("menüde beş bağlantı vardır ve simgeler ekran okuyucudan gizlidir", async ({ page }) => {
		await ready(page, HOME);
		if (!(await isWide(page))) await page.getByRole("button", { name: "Menüyü aç" }).click();
		const menu = page.locator('nav[aria-label="Ana menü"]');
		await expect(menu.locator("a")).toHaveCount(5);
		for (const ad of ["Genel bakış", "Fazlar", "Kanban", "Bağlamlar", "Yönergeler"]) {
			await expect(menu.getByRole("link", { name: ad, exact: true })).toHaveCount(1);
		}
		expect(await menu.locator(".shell-ico[aria-hidden='true']").count()).toBe(5);
	});

	test("her menü bağlantısı tek sekme durağıdır", async ({ page, browserName }) => {
		await ready(page, HOME);
		test.skip(!(await isWide(page)), "Bu kontrol geniş ekran menüsü içindir.");
		const duraklar: string[] = [];
		for (let i = 0; i < 8; i++) {
			await page.keyboard.press(browserName === "webkit" ? "Alt+Tab" : "Tab");
			duraklar.push(
				await page.evaluate(() => {
					const el = document.activeElement as HTMLElement | null;
					if (!el) return "yok";
					return `${el.tagName}:${(el.textContent || "").trim().slice(0, 20)}`;
				}),
			);
		}
		// Hiçbir UL ya da OL odak almamalı. Ant Design menüsü fazladan durak ekliyordu.
		expect(duraklar.filter((d) => d.startsWith("UL:") || d.startsWith("OL:"))).toEqual([]);
	});
});

test.describe("kabuk: çekmece menüsü", () => {
	test("dar ekranda menü düğmesi çekmeceyi açar ve kapatır", async ({ page }) => {
		await ready(page, HOME);
		test.skip(await isWide(page), "Çekmece yalnız dar ekranda vardır.");
		const dugme = page.getByRole("button", { name: "Menüyü aç" });
		await expect(dugme).toHaveAttribute("aria-expanded", "false");
		const kutu = await dugme.boundingBox();
		expect(kutu!.width).toBeGreaterThanOrEqual(44);
		expect(kutu!.height).toBeGreaterThanOrEqual(44);
		await dugme.click();
		await expect(dugme).toHaveAttribute("aria-expanded", "true");
		await expect(page.locator('nav[aria-label="Ana menü"]')).toBeVisible();
		await page.keyboard.press("Escape");
		await expect(dugme).toHaveAttribute("aria-expanded", "false");
	});

	test("çekmece kullanımdan kalkmış ayar uyarısı vermez", async ({ page }) => {
		// Yalnız kendi bileşenimizi denetleriz. Başka sayfalardaki uyarılar kapsam dışıdır.
		const uyarilar: string[] = [];
		page.on("console", (m) => {
			if (m.text().includes("antd: Drawer")) uyarilar.push(m.text());
		});
		await ready(page, HOME);
		test.skip(await isWide(page), "Çekmece yalnız dar ekranda vardır.");
		await page.getByRole("button", { name: "Menüyü aç" }).click();
		await page.waitForTimeout(400);
		expect(uyarilar).toEqual([]);
	});

	test("çekmece ekranı tamamen kaplamaz ve kapatma düğmesi büyüktür", async ({ page }) => {
		await ready(page, HOME);
		test.skip(await isWide(page), "Çekmece yalnız dar ekranda vardır.");
		await page.getByRole("button", { name: "Menüyü aç" }).click();
		await page.waitForTimeout(400);
		const olcu = await page.evaluate(() => {
			const w = document.querySelector(".ant-drawer-content-wrapper")!.getBoundingClientRect();
			const k = document.querySelector(".ant-drawer-close")!.getBoundingClientRect();
			return { cekmece: w.width, ekran: window.innerWidth, kapat: { w: k.width, h: k.height } };
		});
		// Maske üzerine basıp kapatmak için en az 40 px boş yer kalmalı.
		expect(olcu.ekran - olcu.cekmece).toBeGreaterThanOrEqual(40);
		expect(olcu.kapat.w).toBeGreaterThanOrEqual(44);
		expect(olcu.kapat.h).toBeGreaterThanOrEqual(44);
	});
});

test.describe("kabuk: yol izi", () => {
	test("yol izi tek satırdır ve sayfayı taşırmaz", async ({ page }) => {
		for (const path of [DEEP, "/baglamlar/12-bildirim-iletisim/", "/yonergeler/06-veri-sahipligi-ve-olaylar/"]) {
			await ready(page, path);
			const olcu = await page.evaluate(() => {
				const ol = document.querySelector(".shell-crumbs ol");
				if (!ol) return null;
				const satirlar = new Set(Array.from(ol.querySelectorAll("li")).map((li) => Math.round(li.getBoundingClientRect().top)));
				return { satirSayisi: satirlar.size, tasma: document.documentElement.scrollWidth - document.documentElement.clientWidth };
			});
			expect(olcu).not.toBeNull();
			expect(olcu!.satirSayisi).toBe(1);
			expect(olcu!.tasma).toBeLessThanOrEqual(0);
		}
	});

	test("yol izi bağlantılarına parmakla basılabilir", async ({ page }) => {
		await ready(page, DEEP);
		// Ölçü tokens.css dosyasından gelir. Dokunmada 44 px, farede 36 px olur.
		const kucuk = await page.evaluate(() => {
			const alt = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--hit-sm")) || 44;
			const dokunma = window.matchMedia("(pointer: coarse)").matches;
			return {
				alt,
				dokunma,
				kotu: Array.from(document.querySelectorAll(".shell-crumbs a"))
					.map((a) => ({ t: a.textContent, h: Math.round(a.getBoundingClientRect().height) }))
					.filter((x) => x.h < alt),
			};
		});
		expect(kucuk.kotu).toEqual([]);
		// Dokunmalı ekranda alt sınır 44 px'in altına inmemeli.
		if (kucuk.dokunma) expect(kucuk.alt).toBeGreaterThanOrEqual(44);
	});

	test("yol izi açık olan sayfanın adını tekrar etmez", async ({ page }) => {
		for (const path of [DEEP, "/kanban/", "/yonergeler/06-veri-sahipligi-ve-olaylar/"]) {
			await ready(page, path);
			const metin = await page.evaluate(() => {
				const nav = document.querySelector(".shell-crumbs");
				const h1 = document.querySelector("h1");
				return { iz: nav ? nav.textContent!.trim() : "", baslik: h1 ? h1.textContent!.trim() : "" };
			});
			expect(metin.baslik.length).toBeGreaterThan(0);
			expect(metin.iz).not.toContain(metin.baslik);
		}
	});

	test("ana sayfada yol izi yoktur", async ({ page }) => {
		await ready(page, HOME);
		await expect(page.locator(".shell-crumbs")).toHaveCount(0);
	});

	test("üst menüdeki sayfalarda yol izi yoktur", async ({ page }) => {
		// Kanban, Bağlamlar ve Yönergeler zaten ana menüdedir. Yol izi bilgi eklemez.
		for (const path of ["/kanban/", "/baglamlar/", "/yonergeler/"]) {
			await ready(page, path);
			await expect(page.locator(".shell-crumbs"), `${path} yol izi göstermemeli`).toHaveCount(0);
		}
	});

	test("yol izi ana sayfa basamağını tekrar etmez", async ({ page }) => {
		// Üst çubuktaki site adı zaten ana sayfayı açar.
		for (const path of [DEEP, "/fazlar/faz-3/", "/yonergeler/06-veri-sahipligi-ve-olaylar/"]) {
			await ready(page, path);
			await expect(page.locator(".shell-crumbs")).toHaveCount(1);
			await expect(page.locator(".shell-crumbs a", { hasText: "Genel bakış" })).toHaveCount(0);
		}
	});

	test("yol izi bağlantıları bir üst sayfayı açar", async ({ page }) => {
		await ready(page, DEEP);
		const son = page.locator(".shell-crumbs a").last();
		await expect(son).toHaveText("03a-katalog");
		await son.click();
		await page.locator("[data-app-ready]").waitFor();
		expect(new URL(page.url()).pathname).toBe(withBase("/baglamlar/03a-katalog/"));
	});
});

test.describe("kabuk: içeriğe geç", () => {
	test("ilk sekme içeriğe geç bağlantısına gider ve odak içeriğe taşınır", async ({ page, browserName }) => {
		await ready(page, DEEP);
		await page.keyboard.press(browserName === "webkit" ? "Alt+Tab" : "Tab");
		await expect(page.locator(".skip-link")).toBeFocused();
		await page.keyboard.press("Enter");
		await expect(page.locator("#icerik")).toBeFocused();
	});

	test("içeriğe geçince içeriğin başı yapışkan çubuğun altında kalmaz", async ({ page, browserName }) => {
		await ready(page, DEEP);
		// Önce sayfayı aşağı kaydırırız. Böylece atlama gerçekten kaydırma yapar.
		await page.evaluate(() => window.scrollTo(0, 1200));
		await page.waitForTimeout(200);
		await page.keyboard.press(browserName === "webkit" ? "Alt+Tab" : "Tab");
		await page.keyboard.press("Enter");
		await page.waitForTimeout(500);
		const durum = await page.evaluate(() => {
			const hd = document.querySelector(".shell-header")!.getBoundingClientRect();
			const ilk = document.querySelector(".shell-crumbs, h1")!.getBoundingClientRect();
			return { baslikAlt: Math.round(hd.bottom), ilkTop: Math.round(ilk.top) };
		});
		expect(durum.ilkTop).toBeGreaterThanOrEqual(durum.baslikAlt);
	});

	test("sayfa içi bağ hedefi yapışkan çubuğun altında kalmaz", async ({ page }) => {
		await ready(page, DEEP);
		const pad = await page.evaluate(() => getComputedStyle(document.documentElement).scrollPaddingTop);
		expect(parseFloat(pad)).toBeGreaterThanOrEqual(56);
	});

	test("içeriğe geç bağlantısı odakta görünür olur", async ({ page, browserName }) => {
		await ready(page, HOME);
		const gizliTop = await page.locator(".skip-link").evaluate((el) => el.getBoundingClientRect().top);
		expect(gizliTop).toBeLessThan(0);
		await page.keyboard.press(browserName === "webkit" ? "Alt+Tab" : "Tab");
		const acikTop = await page.locator(".skip-link").evaluate((el) => el.getBoundingClientRect().top);
		expect(acikTop).toBeGreaterThanOrEqual(0);
	});
});

test.describe("kabuk: alt bilgi ve başa dön", () => {
	test("alt bilgi kişisel klasör yolu yazmaz", async ({ page }) => {
		await ready(page, HOME);
		const metin = await page.locator(".shell-footer").innerText();
		expect(metin).not.toContain("/Users/");
		expect(metin).not.toContain("~/Developer");
		expect(metin).toContain("tradehub-tr/tradehub_core");
		expect(metin).toContain("version-15");
	});

	test("başa dön düğmesi alt bilgi yazısının üstünü kapatmaz", async ({ page }) => {
		await ready(page, "/kanban/");
		await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
		await page.waitForTimeout(600);
		const cakisma = await page.evaluate(() => {
			const btn = document.querySelector(".ant-float-btn");
			if (!btn) return "düğme yok";
			const b = btn.getBoundingClientRect();
			if (b.width === 0) return "görünmez";
			for (const p of Array.from(document.querySelectorAll(".shell-footer-inner p"))) {
				const r = p.getBoundingClientRect();
				if (r.left < b.right && r.right > b.left && r.top < b.bottom && r.bottom > b.top) return `çakışma: ${p.textContent!.slice(0, 30)}`;
			}
			return "temiz";
		});
		expect(cakisma).toBe("temiz");
	});

	test("başa dön düğmesi sayfanın başına döner", async ({ page }) => {
		await ready(page, "/kanban/");
		await page.evaluate(() => window.scrollTo(0, 2000));
		await page.waitForTimeout(500);
		const btn = page.getByRole("button", { name: "Sayfanın başına dön" });
		await expect(btn).toBeVisible();
		await btn.click();
		await expect.poll(() => page.evaluate(() => Math.round(window.scrollY)), { timeout: 5000 }).toBeLessThan(40);
	});
});

test.describe("kabuk: kural denetimi", () => {
	test("kabuk hiçbir genişlikte yatay taşma yapmaz", async ({ page }) => {
		for (const path of PAGES) {
			await ready(page, path);
			const tasma = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
			expect(tasma, `${path} taşıyor`).toBeLessThanOrEqual(0);
		}
	});

	test("kabuk metinleri en az 14 px olur", async ({ page }) => {
		await ready(page, DEEP);
		const kucuk = await page.evaluate(() => {
			const kotu: string[] = [];
			for (const el of Array.from(document.querySelectorAll(".shell-topbar *, .shell-crumbs *, .shell-footer *"))) {
				const r = el.getBoundingClientRect();
				if (r.width === 0 || !el.textContent?.trim()) continue;
				const fs = parseFloat(getComputedStyle(el).fontSize);
				if (fs < 14) kotu.push(`${el.className}: ${fs}`);
			}
			return kotu;
		});
		expect(kucuk).toEqual([]);
	});

	test("kabuk geçişleri simetrik eğri ve pozitif süre kullanır", async ({ page }) => {
		await ready(page, HOME);
		if (!(await isWide(page))) await page.getByRole("button", { name: "Menüyü aç" }).click();
		const g = await page.locator('nav[aria-label="Ana menü"] a').first().evaluate((el) => {
			const cs = getComputedStyle(el);
			return { fn: cs.transitionTimingFunction, dur: cs.transitionDuration, prop: cs.transitionProperty };
		});
		expect(g.fn).toContain("cubic-bezier(0.65, 0, 0.35, 1)");
		expect(g.dur.split(",").every((d) => parseFloat(d) > 0)).toBe(true);
		expect(g.prop).not.toContain("all");
	});

	test("azaltılmış hareket tercihinde kabuk geçişleri kalkar", async ({ page }) => {
		await page.emulateMedia({ reducedMotion: "reduce" });
		await ready(page, HOME);
		if (!(await isWide(page))) await page.getByRole("button", { name: "Menüyü aç" }).click();
		const dur = await page.locator('nav[aria-label="Ana menü"] a').first().evaluate((el) => getComputedStyle(el).transitionDuration);
		expect(dur.split(",").every((d) => parseFloat(d) === 0)).toBe(true);
	});

	test("menü bağlantısı klavye odağında çevre halkası çizmez", async ({ page, browserName }) => {
		await ready(page, HOME);
		test.skip(!(await isWide(page)), "Bu kontrol geniş ekran menüsü içindir.");
		const tab = browserName === "webkit" ? "Alt+Tab" : "Tab";
		// Sekme tuşuyla ilerleyip ilk menü bağlantısına geliriz. Odak modunu yalnız Tab açar.
		let bulundu = false;
		for (let i = 0; i < 8 && !bulundu; i++) {
			await page.keyboard.press(tab);
			bulundu = await page.evaluate(() => !!document.activeElement?.closest('nav[aria-label="Ana menü"]'));
		}
		expect(bulundu, "menü bağlantısına sekme ile ulaşılamadı").toBe(true);
		// Zemin rengi kısa bir geçişle gelir. Geçiş bitene kadar bekleriz.
		await page.waitForTimeout(250);
		const s = await page.evaluate(() => {
			const cs = getComputedStyle(document.activeElement as HTMLElement);
			return { outline: cs.outlineStyle, shadow: cs.boxShadow, bg: cs.backgroundColor, fg: cs.color, deco: cs.textDecorationLine };
		});
		expect(s.outline).toBe("none");
		// Çevreleyen halka yasaktır. Açık olan sayfanın alt çizgisi kalabilir.
		// O çizgi `inset` ve tek kenardadır, öğeyi çevrelemez.
		const katmanlar = s.shadow === "none" ? [] : s.shadow.split(/,(?![^(]*\))/);
		expect(katmanlar.filter((k) => !k.includes("inset"))).toEqual([]);
		expect(s.bg).toBe("rgb(255, 214, 10)");
		expect(s.fg).toBe("rgb(0, 0, 0)");
		expect(s.deco).toContain("underline");
	});

	test("kabukta 6 px'ten büyük köşe yarıçapı yoktur", async ({ page }) => {
		await ready(page, DEEP);
		const kotu = await page.evaluate(() => {
			const liste: string[] = [];
			for (const el of Array.from(document.querySelectorAll<HTMLElement>(".shell-header *, .shell-crumbs *, .shell-footer *, .ant-float-btn"))) {
				if (el.closest("svg")) continue;
				const r = el.getBoundingClientRect();
				if (r.width === 0 || r.height === 0) continue;
				const cs = getComputedStyle(el);
				for (const k of ["borderTopLeftRadius", "borderTopRightRadius", "borderBottomLeftRadius", "borderBottomRightRadius"] as const) {
					const v = cs[k];
					const px = v.endsWith("%") ? (parseFloat(v) / 100) * Math.min(r.width, r.height) : parseFloat(v);
					if (px > 6.01) liste.push(`${el.className}: ${k}=${v}`);
				}
			}
			return liste;
		});
		expect(kotu).toEqual([]);
	});
});


test.describe("kabuk: açılış çubuğu", () => {
	test("betikler gelmeden önce mavi çubuk görünür", async ({ page }) => {
		// Sayfalar `client:only` ile çizilir. Betik gelene kadar ekran boş kalmamalı.
		await page.route("**/*.js", (r) => r.abort());
		await page.route("**/@vite/**", (r) => r.abort());
		await page.goto(withBase("/kanban/"), { waitUntil: "domcontentloaded" }).catch(() => {});
		const cubuk = page.locator(".shell-boot");
		await expect(cubuk).toBeVisible();
		await expect(cubuk).toContainText("İstoç mimari planı");
		// Zemin sabit renk değil, tokens.css marka rengidir.
		const renk = await cubuk.evaluate((el) => ({
			zemin: getComputedStyle(el).backgroundColor,
			marka: getComputedStyle(document.documentElement).getPropertyValue("--color-primary").trim(),
		}));
		const hex = renk.zemin.match(/\d+/g)!.slice(0, 3).map((n) => Number(n).toString(16).padStart(2, "0")).join("");
		expect("#" + hex).toBe(renk.marka.toLowerCase());
	});

	test("kabuk hazır olunca açılış çubuğu kaldırılır", async ({ page }) => {
		await ready(page, "/kanban/");
		await expect(page.locator(".shell-boot")).toHaveCount(0);
		await expect(page.locator(".shell-header")).toHaveCount(1);
	});
});

test.describe("kabuk: kısa ekran", () => {
	test("yatay telefonda üst çubuk kısalır", async ({ page }) => {
		await page.setViewportSize({ width: 812, height: 375 });
		await ready(page, "/doctype/04-siparis/order/");
		const olcu = await page.evaluate(() => ({
			header: Math.round(document.querySelector(".shell-header")!.getBoundingClientRect().height),
			logo: Math.round(document.querySelector(".shell-logo")!.getBoundingClientRect().height),
		}));
		expect(olcu.header).toBe(48);
		expect(olcu.logo).toBe(48);
	});

	test("uzun ekranda üst çubuk 56 px kalır", async ({ page }) => {
		await page.setViewportSize({ width: 375, height: 812 });
		await ready(page, "/doctype/04-siparis/order/");
		const h = await page.evaluate(() => Math.round(document.querySelector(".shell-header")!.getBoundingClientRect().height));
		expect(h).toBe(56);
	});
});


test.describe("kabuk: tasarım yönü", () => {
	/** rgb ya da rgba metnini, verilen zemine karışmış üç sayıya çevirir. */
	const karistir = (renk: string, zemin: number[]) => {
		const s = renk.match(/[\d.]+/g)!.map(Number);
		if (s.length > 3) return s.slice(0, 3).map((c, i) => Math.round(c * s[3] + zemin[i] * (1 - s[3])));
		return s.slice(0, 3);
	};
	const kontrast = (a: number[], b: number[]) => {
		const lin = (c: number) => {
			const x = c / 255;
			return x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4);
		};
		const L = (v: number[]) => 0.2126 * lin(v[0]) + 0.7152 * lin(v[1]) + 0.0722 * lin(v[2]);
		const [l1, l2] = [L(a), L(b)].sort((x, y) => y - x);
		return (l1 + 0.05) / (l2 + 0.05);
	};

	test("üst çubuk marka mavisidir ve rengi tokendan gelir", async ({ page }) => {
		await ready(page, "/kanban/");
		const ust = await page.evaluate(() => ({
			zemin: getComputedStyle(document.querySelector(".shell-header")!).backgroundColor,
			marka: getComputedStyle(document.documentElement).getPropertyValue("--color-primary").trim().toLowerCase(),
		}));
		const hex = "#" + ust.zemin.match(/\d+/g)!.slice(0, 3).map((n) => Number(n).toString(16).padStart(2, "0")).join("");
		expect(hex).toBe(ust.marka);
	});

	test("mavi üstündeki yazılar beyaz ailesindendir ve kontrast yüksektir", async ({ page }) => {
		await ready(page, "/kanban/");
		if (!(await isWide(page))) await page.getByRole("button", { name: "Menüyü aç" }).click();
		const r = await page.evaluate(() => {
			const al = (sel: string) => {
				const el = document.querySelector(sel);
				return el ? getComputedStyle(el).color : null;
			};
			return {
				zemin: getComputedStyle(document.querySelector(".shell-header")!).backgroundColor,
				logo: al(".shell-logo"),
				bekleyen: al('.shell-nav a:not([aria-current])'),
				acik: al('.shell-nav a[aria-current="page"]'),
				dugme: al(".shell-menu-btn"),
			};
		});
		const zemin = r.zemin.match(/\d+/g)!.slice(0, 3).map(Number);
		// Site adı tam beyazdır.
		expect(karistir(r.logo!, zemin)).toEqual([255, 255, 255]);
		expect(kontrast(karistir(r.logo!, zemin), zemin)).toBeGreaterThanOrEqual(7);
		if (r.dugme) expect(karistir(r.dugme, zemin)).toEqual([255, 255, 255]);
		// Geniş ekranda menü bağlantıları da beyaz ailesindendir.
		if (r.bekleyen) {
			const b = karistir(r.bekleyen, zemin);
			expect(kontrast(b, zemin)).toBeGreaterThanOrEqual(4.5);
			// Beyaz ailesi: üç kanal da birbirine yakın ve yüksek olur.
			expect(Math.min(...b)).toBeGreaterThanOrEqual(200);
			expect(kontrast(karistir(r.acik!, zemin), zemin)).toBeGreaterThanOrEqual(7);
		}
	});

	test("açık olan menü bağlantısı düz çizgi işareti alır", async ({ page }) => {
		await ready(page, "/kanban/");
		test.skip(!(await isWide(page)), "İşaret geniş ekran menüsündedir.");
		const s = await page.locator('.shell-nav a[aria-current="page"]').evaluate((el) => {
			const cs = getComputedStyle(el);
			return { golge: cs.boxShadow, radius: cs.borderTopLeftRadius, agirlik: cs.fontWeight };
		});
		// Çizgi düzdür ve değdiği köşeler karedir. Kavisli vurgu kenarı yasaktır.
		expect(s.golge).toContain("inset");
		expect(parseFloat(s.radius)).toBe(0);
		expect(Number(s.agirlik)).toBeGreaterThanOrEqual(600);
	});

	test("geniş ekranda düz yazı satırı yaklaşık 68 karakter olur", async ({ page }) => {
		await page.setViewportSize({ width: 1600, height: 900 });
		await ready(page, "/yonergeler/");
		const genis = await page.evaluate(() => {
			// 68ch Outfit'te yaklaşık 714 px eder. Üst sınırı rahat tutarız.
			const sinir = 780;
			return Array.from(document.querySelectorAll(".shell-main p"))
				.filter((el) => !el.closest("td, th, pre"))
				.map((el) => ({ w: Math.round(el.getBoundingClientRect().width), m: (el.textContent || "").trim().slice(0, 24) }))
				.filter((x) => x.w > sinir);
		});
		expect(genis).toEqual([]);
	});

	test("tablo ve pano tam genişliği kullanabilir", async ({ page }) => {
		await page.setViewportSize({ width: 1600, height: 900 });
		await ready(page, "/kanban/");
		const main = await page.evaluate(() => Math.round(document.querySelector(".shell-main")!.getBoundingClientRect().width));
		// Okunur sütun kuralı kabı daraltmaz. Pano kabın tamamını kullanabilir.
		expect(main).toBeGreaterThanOrEqual(1000);
	});

	test("alt bilgi ayrımı kenarlıkla değil zeminle kurar", async ({ page }) => {
		await ready(page, "/kanban/");
		const alt = await page.evaluate(() => {
			const f = document.querySelector(".shell-footer")!;
			const cs = getComputedStyle(f);
			const p = getComputedStyle(document.querySelector(".shell-footer-inner p")!);
			return {
				zemin: cs.backgroundColor,
				yuzey: getComputedStyle(document.documentElement).getPropertyValue("--color-surface").trim().toLowerCase(),
				ustCizgi: parseFloat(cs.borderTopWidth),
				yazi: parseFloat(p.fontSize),
			};
		});
		const hex = "#" + alt.zemin.match(/\d+/g)!.slice(0, 3).map((n) => Number(n).toString(16).padStart(2, "0")).join("");
		expect(hex).toBe(alt.yuzey);
		expect(alt.ustCizgi).toBe(0);
		expect(alt.yazi).toBeGreaterThanOrEqual(14);
	});
});
