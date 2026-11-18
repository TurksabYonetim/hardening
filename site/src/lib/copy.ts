/** Metni panoya kopyalar. Clipboard API yoksa gizli textarea yöntemini kullanır. */
export async function copyText(text: string): Promise<boolean> {
	const remember = () => ((window as unknown as { __lastCopied?: string }).__lastCopied = text);
	try {
		if (navigator.clipboard && window.isSecureContext) {
			await navigator.clipboard.writeText(text);
			remember();
			return true;
		}
	} catch {
		/* aşağıdaki yönteme geç */
	}
	try {
		const active = document.activeElement as HTMLElement | null;
		const ta = document.createElement("textarea");
		ta.value = text;
		ta.setAttribute("readonly", "");
		ta.style.position = "fixed";
		ta.style.opacity = "0";
		document.body.appendChild(ta);
		ta.select();
		const ok = document.execCommand("copy");
		ta.remove();
		active?.focus();
		if (ok) remember();
		return ok;
	} catch {
		return false;
	}
}
