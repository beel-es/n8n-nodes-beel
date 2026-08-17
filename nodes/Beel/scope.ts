/**
 * How the BeeL contract scopes a request, in one place.
 *
 * The API used to take the multi-NIF scope in a `Beel-Active-Company` header.
 * The contract retired it: `{company_id}` in the path is now the only source of
 * context, and the account that owns it is derived from it. So nearly every
 * endpoint opens with `/v1/companies/{company_id}` or `/v1/accounts/{account_id}`.
 *
 * Those placeholders are not arguments the user picks per operation — the
 * company comes from the node's own "Company" field (or the credential default)
 * and the account is derived from the API key — so they get no form field, and
 * `beelApiRequest` fills them in instead.
 *
 * That rule has to hold on both sides of the generator or requests break in a
 * way nothing catches: if the generator stopped treating `{company_id}` as a
 * scope it would emit a required field for it, and if the request helper stopped
 * substituting it the literal `{company_id}` would travel in the URL and the API
 * would answer 404. Hence one module, imported by `scripts/generate.ts` (which
 * decides what gets a field) and by `GenericFunctions.ts` (which substitutes).
 *
 * Adding an axis when the contract grows one is a single entry here.
 */

/**
 * The path parameters that carry a scope, as the contract names them.
 *
 * A union rather than `string` so `SCOPE_RESOLVERS` cannot compile while an
 * axis has no way to be resolved — adding one here is what points at the code
 * that must handle it.
 */
export type ScopeParameter = 'company_id' | 'account_id';

/** A path prefix whose placeholder carries the request's scope. */
export interface ScopeAxis {
	/** The path parameter, as the contract names it. */
	parameter: ScopeParameter;
	/**
	 * The prefix a path must open with for that placeholder to be a scope.
	 *
	 * Matching the prefix rather than the bare placeholder is deliberate: a
	 * `{company_id}` further down a path really is an argument — as in
	 * `/v1/accounts/{account_id}/members/{member_id}/grants/{company_id}`, where it
	 * says which company the grant is for — and must keep its own field.
	 */
	prefix: string;
}

export const SCOPE_AXES: readonly ScopeAxis[] = [
	{ parameter: 'company_id', prefix: '/v1/companies/{company_id}' },
	{ parameter: 'account_id', prefix: '/v1/accounts/{account_id}' },
];

/** The scope axes a path opens with, in the order they must be substituted. */
export function scopeAxesOf(path: string): ScopeAxis[] {
	return SCOPE_AXES.filter((axis) => path.startsWith(axis.prefix));
}

/** Placeholder for an axis, as it appears in a path. */
export function placeholderOf(axis: ScopeAxis): string {
	return `{${axis.parameter}}`;
}
