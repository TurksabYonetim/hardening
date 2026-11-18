// Site kök dizinde ya da bir alt yolda yayınlanabilir.
// Örnek: GitHub Pages adresi https://<kullanıcı>.github.io/hardening/ olur.
// Taban yolu derleme sırasında SITE_BASE ortam değişkeninden gelir.
const RAW = import.meta.env.BASE_URL || "/";
export const BASE = RAW.endsWith("/") ? RAW : RAW + "/";

/** İç bağlantıyı taban yoluyla birleştirir. Girdi her zaman "/" ile başlar. */
export function url(path: string): string {
	if (!path.startsWith("/")) return path;
	return (BASE + path.slice(1)).replace(/\/{2,}/g, "/");
}
