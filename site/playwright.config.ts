import { defineConfig, devices } from "@playwright/test";

// Site bir alt yolda yayınlanabilir. SITE_BASE ile testler de o yolu kullanır.
const BASE = process.env.SITE_BASE || "/";
// PW_URL verilirse testler calisan bir gelistirme sunucusuna baglanir ve derleme yapilmaz.
// Birden cok ajan ayni worktree icinde calisirken dist klasoru cakismasin diye gereklidir.
const EXISTING = process.env.PW_URL;

// Firefox kullanıcı kararıyla kapsam dışıdır. Chromium ve WebKit çalışır.
export default defineConfig({
	testDir: "tests",
	timeout: 30_000,
	fullyParallel: true,
	reporter: [["list"]],
	use: { baseURL: EXISTING ? EXISTING.replace(/\/$/, "") + "/" : `http://localhost:4322${BASE}`.replace(/\/$/, "") + "/", trace: "retain-on-failure" },
	webServer: EXISTING
		? undefined
		: {
				command: "npm run build && npm run preview:test",
				url: `http://localhost:4322${BASE}`,
				reuseExistingServer: !process.env.CI,
				timeout: 240_000,
			},
	projects: [
		{ name: "chromium-320", use: { ...devices["Desktop Chrome"], viewport: { width: 320, height: 700 }, hasTouch: true } },
		{ name: "chromium-tablet", use: { ...devices["Desktop Chrome"], viewport: { width: 768, height: 1024 }, hasTouch: true } },
		{ name: "chromium-991", use: { ...devices["Desktop Chrome"], viewport: { width: 991, height: 800 } } },
		{ name: "chromium-desktop", use: { ...devices["Desktop Chrome"], viewport: { width: 1280, height: 800 } } },
		{ name: "webkit-375", use: { ...devices["iPhone 13 Mini"], browserName: "webkit" } },
		{ name: "webkit-desktop", use: { ...devices["Desktop Safari"], viewport: { width: 1280, height: 800 } } },
	],
});
