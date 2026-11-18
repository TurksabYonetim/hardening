/** Kabul kriteri işaretleri. Ortak depo: faz sayfası ve DocType sayfası aynı yeri kullanır.
 *  Depo yalnız okurun kendi tarayıcısındadır. Başka kişi bu işaretleri görmez. */

export type CheckStore = Record<string, number[]>;

const CHECK_KEY = "istoc-mimari-kontrol-v1";
/** Eski anahtar. İlk okumada yeni anahtara taşınır. */
const ESKI_KEY = "istoc-mimari-fazlar-kontrol-v1";

export function loadChecks(): CheckStore {
	try {
		const yeni = JSON.parse(localStorage.getItem(CHECK_KEY) || "{}") as CheckStore;
		const eski = JSON.parse(localStorage.getItem(ESKI_KEY) || "{}") as CheckStore;
		if (Object.keys(eski).length) {
			const birlesik = { ...eski, ...yeni };
			localStorage.setItem(CHECK_KEY, JSON.stringify(birlesik));
			localStorage.removeItem(ESKI_KEY);
			return birlesik;
		}
		return yeni;
	} catch {
		return {};
	}
}

export function saveChecks(store: CheckStore): void {
	try {
		localStorage.setItem(CHECK_KEY, JSON.stringify(store));
	} catch {
		/* tarayıcı depoyu kapatmış olabilir */
	}
}

/** Kaç madde işaretli? Sayfa çizilmeden önce de doğru sayar. */
export function countChecks(storeId: string, count: number): number {
	return (loadChecks()[storeId] || []).filter((i) => i < count).length;
}
