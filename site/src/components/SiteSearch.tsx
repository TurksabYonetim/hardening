import { useMemo, useState } from "react";
import { AutoComplete, Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import dizin from "../data/search-index.json";
import { lowerTr } from "../lib/tasks";
import { url } from "../lib/base";

/** Türkçe harfleri sadeleştirir. Böylece "sipariş" yazan "siparis" kaydını da bulur. */
const sadelestir = (s: string) =>
	lowerTr(s)
		.replace(/ı/g, "i")
		.replace(/ş/g, "s")
		.replace(/ğ/g, "g")
		.replace(/ü/g, "u")
		.replace(/ö/g, "o")
		.replace(/ç/g, "c");

type Kayit = { a: string; y: string; t: string; e: string };
const KAYITLAR = dizin as Kayit[];

/** En çok kaç sonuç gösterilir. Daha fazlası listeyi okunmaz yapar. */
const SINIR = 12;

/** Site genelinde arama. Görev, DocType, bağlam, yönerge ve faz adlarını arar. */
export function SiteSearch({ onGit }: { onGit?: () => void }) {
	const [q, setQ] = useState("");

	const sonuclar = useMemo(() => {
		const kelimeler = sadelestir(q).split(/\s+/).filter(Boolean);
		if (!kelimeler.length) return [];
		const bulunan = KAYITLAR.filter((k) => {
			const metin = sadelestir(`${k.a} ${k.t} ${k.e}`);
			return kelimeler.every((w) => metin.includes(w));
		});
		// Başlığı aramayla başlayan kayıt önce gelir.
		const ilk = kelimeler[0];
		bulunan.sort((x, y) => Number(sadelestir(y.a).startsWith(ilk)) - Number(sadelestir(x.a).startsWith(ilk)));
		return bulunan.slice(0, SINIR);
	}, [q]);

	const secenekler = sonuclar.map((k) => ({
		value: k.y,
		label: (
			<span data-arama-satir>
				<span data-arama-ad>{k.a}</span>
				<span data-arama-tur>{k.t}</span>
			</span>
		),
	}));

	return (
		<AutoComplete
			value={q}
			options={secenekler}
			popupMatchSelectWidth
			onChange={setQ}
			onSelect={(yol) => {
				setQ("");
				onGit?.();
				window.location.href = url(yol);
			}}
			notFoundContent={q.trim() ? "Sonuç yok." : null}
			data-site-arama
			style={{ width: "100%" }}
		>
			<Input
				aria-label="Sitede ara"
				placeholder="Görev, DocType, bağlam ara"
				prefix={<SearchOutlined aria-hidden />}
				allowClear
			/>
		</AutoComplete>
	);
}
