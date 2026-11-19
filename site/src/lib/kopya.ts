/** Kanban kopyalama metni. 1,7 MB'lık bu veri adaya props olarak gönderilmez.
 *  Sayfa boşa düştüğünde ayrı bir parça olarak yüklenir. Böylece ilk boyama
 *  beklemez. Kullanıcı kopyalamaya basmadan önce veri bellekte olur. */

let harita: Record<string, string> | null = null;
let bekleyen: Promise<Record<string, string>> | null = null;

/** Veriyi yükler. Aynı anda birden çok çağrı tek indirmeyi paylaşır. */
export function kopyaYukle(): Promise<Record<string, string>> {
	if (harita) return Promise.resolve(harita);
	if (!bekleyen) {
		bekleyen = import("../data/kanban-kopya.json")
			.then((m) => {
				harita = (m.default || m) as Record<string, string>;
				return harita;
			})
			.catch(() => {
				bekleyen = null;
				return {};
			});
	}
	return bekleyen;
}

/** Bellekteki metni döndürür. Henüz yüklenmediyse null döner.
 *  Pano yazma işlemi kullanıcı hareketiyle aynı işte çalışmalıdır,
 *  bu yüzden burada beklemeyiz. */
export function kopyaAl(id: string): string | null {
	return harita ? harita[id] || null : null;
}

/** Tarayıcı boşa düşünce veriyi yükler. */
export function kopyaBostaYukle(): void {
	if (typeof window === "undefined") return;
	const calistir = () => void kopyaYukle();
	const w = window as unknown as {
		requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => void;
		setTimeout: (cb: () => void, ms: number) => number;
	};
	if (typeof w.requestIdleCallback === "function") w.requestIdleCallback(calistir, { timeout: 3000 });
	else w.setTimeout(calistir, 1200);
}
