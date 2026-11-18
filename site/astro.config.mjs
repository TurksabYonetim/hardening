import { defineConfig } from "astro/config";
import react from "@astrojs/react";

// Taban yolu: kökte "/" olur. GitHub Pages alt yolunda "/hardening/" olur.
const base = process.env.SITE_BASE || "/";

export default defineConfig({
	base,
	site: process.env.SITE_URL,
	integrations: [react()],
	output: "static",
	trailingSlash: "always",
	server: { port: 4321 },
	vite: { ssr: { noExternal: ["antd", "@ant-design/icons", "@ant-design/cssinjs"] } },
});
