import { defineConfig, devices } from "@playwright/test";

// Site bir alt yolda yayınlanabilir. SITE_BASE ile testler de o yolu kullanır.
const BASE = process.env.SITE_BASE || "/";

// Firefox kullanıcı kararıyla kapsam dışıdır. Chromium ve WebKit çalışır.
export default defineConfig({
	testDir: "tests",
	timeout: 30_000,
	fullyParallel: true,
	reporter: [["list"]],
	use: { baseURL: `http://localhost:4322${BASE}`.replace(/\/$/, "") + "/", trace: "retain-on-failure" },
	webServer: {
		command: "npm run build && npm run preview:test",
		url: `http://localhost:4322${BASE}`,
		reuseExistingServer: !process.env.CI,
		timeout: 240_000,
	},
	projects: [
		{ name: "chromium-320", use: { ...devices["Desktop Chrome"], viewport: { width: 320, height: 700 }, hasTouch: true } },
		{ name: "chromium-390", use: { ...devices["Pixel 7"], viewport: { width: 390, height: 844 } } },
		{ name: "chromium-tablet", use: { ...devices["Desktop Chrome"], viewport: { width: 768, height: 1024 }, hasTouch: true } },
		{ name: "chromium-991", use: { ...devices["Desktop Chrome"], viewport: { width: 991, height: 800 } } },
		{ name: "chromium-desktop", use: { ...devices["Desktop Chrome"], viewport: { width: 1280, height: 800 } } },
		{ name: "webkit-375", use: { ...devices["iPhone 13 Mini"], browserName: "webkit" } },
		{ name: "webkit-desktop", use: { ...devices["Desktop Safari"], viewport: { width: 1280, height: 800 } } },
	],
});
