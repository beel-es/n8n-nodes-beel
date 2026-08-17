/**
 * Everything the n8n editor puts in front of a user, in English.
 *
 * n8n's node review requires every visible string to be English, but the
 * contract is a Spanish invoicing API: its `example`s are Spanish addresses,
 * some enum members are Spanish words, and a few are citations of Spanish tax
 * law. Translating the contract is the wrong fix — it is vendored from the API
 * repo, so a re-sync would undo it, and those examples are right where they
 * live, in BeeL's own API reference.
 *
 * So the boundary is here: the contract stays as it is, and this module owns
 * the text that crosses into the UI. `assertEnglishUiText` (below) then fails
 * generation if any visible string slips through untranslated, which is what
 * stops this from being caught by review a third time.
 */

/** A field's UI text, overriding whatever the contract's schema implies. */
export type FieldUiOverride = {
	default?: string;
	placeholder?: string;
	description?: string;
};

/**
 * Keyed by the property's own name in the contract, so a field picks the
 * override up wherever it appears — nested inside an `address` object, or
 * flattened onto a company as `address_street`.
 */
export const FIELD_UI_OVERRIDES: Record<string, FieldUiOverride> = {
	// The API stores the country as its Spanish name, so the value cannot be
	// anglicised — but the default must not pre-fill "España" into the editor.
	// The field says so in English instead, and starts empty.
	country: {
		default: '',
		placeholder: 'Spain',
		description:
			"The country name in Spanish, e.g. España for Spain — this is what BeeL's API expects",
	},
	floor: { placeholder: '2nd floor, Apt A' },
	// Spanish street examples: "Calle Mayor, 123", "Calle Mayor".
	street: { placeholder: '123 Main Street' },
	address_street: { placeholder: '123 Main Street' },
	// "Mi Empresa SL".
	legal_name: { placeholder: 'My Company Ltd' },
	// "Mi Empresa" — the commercial name a company trades under.
	trade_name: { placeholder: 'My Company' },
	// "María García López", on the company's legal representative.
	full_name: { placeholder: 'Jane Smith' },
};

/**
 * Display names for enum members whose value is a Spanish word or a citation of
 * Spanish tax law. The value sent to the API never changes — only its label.
 *
 * `ExemptionReason` is nearly all of this: its members cite articles of the
 * Spanish VAT law (Ley 37/1992, "LIVA"). Each label says what the article does,
 * in English, and keeps the citation so the option stays identifiable to an
 * accountant on either side of the integration.
 */
export const OPTION_NAME_OVERRIDES: Record<string, string> = {
	EXENTA_ART_20: 'Exempt — Art. 20 LIVA',
	// The contract split the old EXENTA_ART_21_24 into one member per article.
	EXENTA_ART_21: 'Exempt — Art. 21 LIVA',
	EXENTA_ART_22: 'Exempt — Art. 22 LIVA',
	EXENTA_ART_24: 'Exempt — Art. 24 LIVA',
	EXENTA_ART_25: 'Exempt — Art. 25 LIVA',
	EXENTA_ART_26: 'Exempt — Art. 26 LIVA',
	EXENTA_ART_140: 'Exempt — Art. 140 LIVA',
	NO_SUJETA_ART_7_9: 'Not Subject to VAT — Art. 7.9 LIVA',
	NO_SUJETA_LOCALIZACION: 'Not Subject to VAT — Outside the Spanish VAT Territory',
	ISP_ART_84_2_A: 'Reverse Charge — Art. 84.2.a LIVA',
	ISP_ART_84_2_E: 'Reverse Charge — Art. 84.2.e LIVA',
	ISP_ART_84_2_F: 'Reverse Charge — Art. 84.2.f LIVA',
	REGIMEN_ART_129: 'Special Regime — Art. 129 LIVA',
	REGIMEN_ART_135: 'Special Regime — Art. 135 LIVA',
	REGIMEN_ART_141: 'Special Regime — Art. 141 LIVA',
	REGIMEN_ART_154: 'Special Regime — Art. 154 LIVA',
	REGIMEN_ART_163_DECIES: 'Special Regime — Art. 163 Decies LIVA',
	OTRO: 'Other',
};

// ── The guard ───────────────────────────────────────────────────────────────

/**
 * Spanish words that have appeared, or plausibly will, in a contract example or
 * enum. Matched whole-word and case-insensitively. This is a smoke detector,
 * not a language classifier: it only has to be good enough to stop the specific
 * way Spanish reaches the UI here, which is copied `example`s and enum members.
 */
const SPANISH_WORDS = [
	'calle', 'avenida', 'plaza', 'piso', 'puerta', 'empresa', 'sociedad', 'cliente',
	'factura', 'facturas', 'rectificativa', 'simplificada', 'borrador', 'cobrada',
	'emitida', 'anulada', 'exenta', 'exento', 'sujeta', 'regimen', 'régimen',
	'otro', 'otra', 'suplido', 'suplidos', 'importe', 'fecha', 'numero', 'número',
	'correo', 'nombre', 'apellido', 'aunque', 'según', 'segun', 'desde', 'hasta',
	'para', 'por', 'con', 'sin', 'del', 'los', 'las', 'una', 'uno', 'este', 'esta',
	'como', 'cuando', 'donde', 'pero', 'mas', 'muy', 'que', 'qué',
];

/** Characters that are all but proof of Spanish in an otherwise English string. */
const SPANISH_CHARS = /[ñÑ¿¡ªº]|[áéíóúÁÉÍÓÚ]/;

/**
 * Strings allowed to contain the above: proper nouns, the API's own vocabulary,
 * and the one place where a Spanish word is the point — the country field
 * telling you, in English, that the API wants the Spanish name.
 */
const ALLOWED = [
	/^Madrid$/,
	/España for Spain/,
	/\bLIVA\b/,
	/^(IVA|IGIC|IPSI|NIF|CIF|IRPF|AEAT|VeriFactu|Verifactu|Holded)$/,
	// The API's own line-type value. There is no English term for a "suplido" — a
	// cost advanced on the client's behalf, invoiced without VAT — and the value
	// is what an accountant looks for, so it is kept and explained where it is used.
	/\bSUPLIDO\b/,
];

/** Every user-visible string in a generated node parameter, with its location. */
type VisibleString = { path: string; kind: string; value: string };

function collectVisibleStrings(node: unknown, path: string, out: VisibleString[]): void {
	if (Array.isArray(node)) {
		node.forEach((child, index) => collectVisibleStrings(child, `${path}[${index}]`, out));
		return;
	}
	if (node === null || typeof node !== 'object') return;

	const record = node as Record<string, unknown>;
	const label = typeof record.apiName === 'string' ? record.apiName : (record.name as string) ?? '';
	const here = label ? `${path}.${label}` : path;

	for (const key of ['displayName', 'description', 'placeholder', 'name'] as const) {
		const value = record[key];
		if (typeof value === 'string' && value !== '') out.push({ path: here, kind: key, value });
	}
	// A default only reaches the editor as text when it is one.
	if (typeof record.default === 'string' && record.default !== '') {
		out.push({ path: here, kind: 'default', value: record.default });
	}

	for (const [key, value] of Object.entries(record)) {
		if (typeof value === 'object' && value !== null) collectVisibleStrings(value, here, out);
	}
}

function looksSpanish(value: string): string | undefined {
	if (ALLOWED.some((allowed) => allowed.test(value))) return undefined;

	const chars = value.match(SPANISH_CHARS);
	if (chars) return `contains "${chars[0]}"`;

	for (const word of SPANISH_WORDS) {
		// Underscore counts as part of a word, so an API identifier quoted inside an
		// English sentence ("required if id_otro is not provided") is not a hit.
		// Enum labels are unaffected: title-casing has already turned their
		// underscores into spaces by the time they get here.
		if (new RegExp(`(?:^|[^\\p{L}_])${word}(?:[^\\p{L}_]|$)`, 'iu').test(value)) {
			return `contains the Spanish word "${word}"`;
		}
	}
	return undefined;
}

/**
 * Fails generation when a user-visible string is not English.
 *
 * Runs on every `npm run generate` and, through `--check`, in CI — so a contract
 * re-sync that reintroduces a Spanish example breaks the build with the fix to
 * make, rather than reaching n8n's reviewers.
 */
export function assertEnglishUiText(operations: unknown): void {
	const strings: VisibleString[] = [];
	collectVisibleStrings(operations, 'operations', strings);

	const offenders = strings
		.map((entry) => ({ ...entry, reason: looksSpanish(entry.value) }))
		.filter((entry): entry is VisibleString & { reason: string } => entry.reason !== undefined);

	if (offenders.length === 0) return;

	const seen = new Set<string>();
	const lines = offenders
		.filter((entry) => {
			const key = `${entry.kind}:${entry.value}`;
			if (seen.has(key)) return false;
			seen.add(key);
			return true;
		})
		.map((entry) => `  ${entry.path} · ${entry.kind}: "${entry.value}" — ${entry.reason}`);

	throw new Error(
		`n8n requires every string shown in the editor to be English, and ${offenders.length} ` +
			`${offenders.length === 1 ? 'is' : 'are'} not:\n${lines.join('\n')}\n\n` +
			'Fix it in scripts/ui-text.ts — FIELD_UI_OVERRIDES for a field\'s placeholder, default ' +
			'or description, OPTION_NAME_OVERRIDES for an enum label (the value sent to the API is ' +
			'unaffected). If the string is a proper noun or API vocabulary, add it to ALLOWED.',
	);
}
