/**
 * Configuration for the OpenAPI → n8n generator.
 *
 * Only what the contract cannot tell us lives here: which endpoints are worth
 * exposing, and what an operation is called in the UI. Everything else — labels,
 * descriptions, required fields, pagination, list keys — is derived in
 * `generate.ts` straight from `openapi/public-api.yaml`.
 */

/**
 * OpenAPI tag → n8n resource. Order defines the Resource dropdown.
 *
 * Every tag here is a company- or account-scoped one: the contract retired the
 * flat `/v1/invoices`-style routes (they are all `deprecated: true` and the
 * `Beel-Active-Company` header no longer exists), and the scope now travels in
 * the path — `/v1/companies/{company_id}/...` and `/v1/accounts/{account_id}/...`.
 */
export const RESOURCES: Array<{ resource: string; displayName: string; tags: string[] }> = [
	{ resource: 'invoice', displayName: 'Invoice', tags: ['CompanyInvoices', 'CompanyInvoiceLifecycle', 'CompanyInvoiceDelivery', 'CompanyProforma'] },
	{ resource: 'customer', displayName: 'Customer', tags: ['CompanyCustomers'] },
	{ resource: 'product', displayName: 'Product', tags: ['CompanyProducts'] },
	{ resource: 'series', displayName: 'Series', tags: ['CompanySeries'] },
	{ resource: 'recurringInvoice', displayName: 'Recurring Invoice', tags: ['CompanyRecurringInvoices'] },
	{ resource: 'configuration', displayName: 'Configuration', tags: ['CompanyTaxConfiguration', 'CompanyVeriFactuConfiguration', 'TaxTypes', 'InvoiceCustomization'] },
	{ resource: 'nif', displayName: 'NIF', tags: ['NIF'] },
	{ resource: 'company', displayName: 'Company', tags: ['PublicCompanies', 'Company', 'CompanyRepresentation', 'CompanyFiscalSummary'] },
	{ resource: 'account', displayName: 'Account', tags: ['Provisioning', 'Accounts'] },
	{ resource: 'paymentConnection', displayName: 'Payment Connection', tags: ['CompanyPaymentConnections'] },
	{ resource: 'paymentEvent', displayName: 'Payment Event', tags: ['CompanyPaymentEvents'] },
];

/**
 * `operationId` → n8n operation name. Being an explicit map keeps the dropdown
 * stable when the contract renames an operationId, and doubles as the allow-list:
 * an endpoint that is not here, not manual and not excluded fails the drift check.
 */
export const OPERATION_NAMES: Record<string, string> = {
	// Invoice — /v1/companies/{company_id}/invoices/...
	listCompanyInvoices: 'getAll',
	createCompanyInvoice: 'create',
	getCompanyInvoice: 'get',
	patchCompanyInvoice: 'update',
	deleteCompanyInvoice: 'delete',
	// The old `POST /duplicate` is now a sibling sub-resource: same act, and it is
	// the only way to copy an invoice, so it keeps the name workflows already use.
	createCompanyInvoiceDerivation: 'duplicate',
	issueCompanyInvoice: 'issue',
	voidCompanyInvoice: 'void',
	createCompanyCorrectiveInvoice: 'createCorrective',
	// One `PUT .../status` replaces mark-paid, mark-sent and revert-to-issued: the
	// contract now has one vocabulary for the commercial status instead of a verb
	// per transition. Issuing and voiding stay separate — they are fiscal acts.
	setCompanyInvoiceStatus: 'setStatus',
	// Scheduling is a sub-resource: PUT schedules or reschedules, DELETE unschedules.
	getCompanyInvoiceSchedule: 'getSchedule',
	setCompanyInvoiceSchedule: 'schedule',
	deleteCompanyInvoiceSchedule: 'unschedule',
	sendCompanyInvoice: 'send',
	convertCompanyProformaToInvoice: 'convertToInvoice',
	// Customer
	listCompanyCustomers: 'getAll',
	createCompanyCustomer: 'create',
	getCompanyCustomer: 'get',
	patchCompanyCustomer: 'update',
	deleteCompanyCustomer: 'delete',
	// Product. `GET /v1/products/search` was withdrawn: searching is `?q=` on the
	// list, which returns at least the same results in the paginated envelope.
	listCompanyProducts: 'getAll',
	createCompanyProduct: 'create',
	getCompanyProduct: 'get',
	patchCompanyProduct: 'update',
	deleteCompanyProduct: 'delete',
	// Series
	listCompanySeries: 'getAll',
	createCompanySeries: 'create',
	getCompanySeries: 'get',
	patchCompanySeries: 'update',
	deleteCompanySeries: 'delete',
	setCompanyDefaultSeries: 'setDefault',
	getCompanyDefaultSeries: 'getDefaults',
	ensureCompanyDefaultSeries: 'ensureDefaults',
	// Recurring invoice. Pause/resume are two values of one status, as with invoices.
	listCompanyRecurringInvoices: 'getAll',
	createCompanyRecurringInvoice: 'create',
	getCompanyRecurringInvoice: 'get',
	patchCompanyRecurringInvoice: 'update',
	deleteCompanyRecurringInvoice: 'delete',
	setCompanyRecurringInvoiceStatus: 'setStatus',
	skipCompanyRecurringInvoice: 'skipNext',
	generateCompanyRecurringInvoiceNow: 'generateNow',
	getCompanyRecurringInvoiceNextOccurrence: 'getNextOccurrence',
	getCompanyRecurringInvoiceHistory: 'getHistory',
	createCompanyRecurringInvoiceDerivation: 'createFromInvoice',
	// Configuration. Tax and VeriFactu settings are per company now; the tax-type
	// and customisation catalogues are platform-wide and no longer company-scoped.
	getCompanyTaxConfiguration: 'getTaxConfiguration',
	getCompanyVeriFactuConfiguration: 'getVerifactu',
	listTaxTypes: 'getTaxTypes',
	listInvoiceCustomizationOptions: 'getInvoiceCustomization',
	// NIF
	validateNif: 'validate',
	// Company (multi-NIF). The collection hangs off the account; a single company
	// is addressed directly, as is the VeriFactu representation flow that
	// registers its NIF with the AEAT.
	createCompany: 'create',
	listCompanies: 'getAll',
	getCompanyById: 'get',
	patchCompanyById: 'update',
	deleteCompanyById: 'delete',
	generateCompanyRepresentation: 'generateRepresentation',
	downloadCompanyRepresentationDocument: 'downloadRepresentation',
	getCompanyRepresentation: 'getRepresentationStatus',
	cancelCompanyRepresentation: 'cancelRepresentation',
	// Whether the NIF can issue right now, and what is missing if not. The gate
	// an onboarding flow checks before telling a client they are live.
	getCompanyIssuingReadiness: 'getIssuingReadiness',
	listCompanyStats: 'getStats',
	getCompanyFiscalSummary: 'getFiscalSummary',
	// Account (provisioning). A platform — tax advisory firm, SaaS, marketplace — creates
	// and hands over accounts by API, repeatedly. `provisionAccount` is
	// idempotent by `external_ref`, so a re-run never duplicates one.
	provisionAccount: 'provision',
	listAccounts: 'getAll',
	getAccount: 'get',
	getAccountUsage: 'getUsage',
	// Claim tokens expire after 30 days and re-issuing invalidates the previous
	// one, so a portfolio needs to re-send them on a schedule.
	createAccountClaimToken: 'createClaimToken',
	// Payment connections: the white-label flow that lets a managed NIF's holder
	// connect Stripe, after which BeeL auto-invoices every charge.
	listCompanyPaymentConnections: 'getAll',
	initiatePaymentConnection: 'initiate',
	disconnectCompanyPaymentConnection: 'disconnect',
	// Payment events. There is NO webhook for a charge that failed to invoice, and
	// the list has no server-side filter, so finding them means sweeping this
	// collection and sifting on `needs_action` — which is why these are exposed.
	listCompanyPaymentEvents: 'getAll',
	getCompanyPaymentEvent: 'get',
	retryCompanyPaymentEvent: 'retry',
	generateCompanyPaymentEventDraft: 'generateDraft',
};

/**
 * Hand-written instead of generated: they move a file rather than JSON — two
 * PDF downloads and the multipart upload of the signed representation.
 */
export const MANUAL_OPERATION_IDS = [
	'getCompanyInvoicePdf',
	'previewCompanyInvoicePdf',
	'submitCompanyRepresentation',
];

/**
 * Endpoints the hand-written code calls without exposing them as an operation:
 * the dropdown loaders, the identity lookup behind `account_id`, and the webhook
 * subscription the Trigger node manages on the user's behalf.
 *
 * Listing them here makes the generator emit their path into `CONTRACT_PATHS`,
 * so no URL is ever typed into a `.ts` file. That is the difference between a
 * contract change failing the build with the endpoint it dropped, and the node
 * shipping a 404 nobody notices until a workflow runs — which is exactly how
 * the whole flat `/v1/invoices` surface stayed in place after it was retired.
 */
export const REFERENCED_OPERATION_IDS = [
	// `account_id` for every account-scoped path.
	'getMyIdentity',
	// Dropdowns.
	'listCompanies',
	'listAccounts',
	'listCompanySeries',
	'listCompanyCustomers',
	'listCompanyProducts',
	// BeeL Trigger, which owns its subscription's whole lifecycle.
	'listAccountWebhookSubscriptions',
	'createAccountWebhookSubscription',
	'patchAccountWebhookSubscription',
	'deleteAccountWebhookSubscription',
];

/**
 * Live endpoints deliberately not exposed, listed so the drift check separates
 * "decided no" from "not looked at".
 *
 * Deprecated endpoints do NOT belong here: the contract already marks them, and
 * `generate.ts` excludes them from that flag. Enumerating them by hand would
 * mean ~90 identifiers that go stale the day the API deletes them at sunset,
 * with nothing to say so.
 */
export const EXCLUDED_OPERATION_IDS = [
	// Bulk, import and export — n8n's own batching and file nodes do this better.
	'createCompanyCustomersBulk', 'deleteCompanyCustomersBulk',
	'createCompanyCustomerImport', 'previewCompanyCustomerImport', 'downloadCustomerImportTemplate',
	'createCompanyProductsBulk', 'deleteCompanyProductsBulk',
	'createCompanyInvoiceBatch', 'createCompanyInvoicePdfArchive', 'createCompanyInvoiceDelivery',
	'createCompanyInvoiceExport',
	// `PUT /v1/configuration/series/{series_id}`: the only flat route the contract
	// does not mark deprecated, though every sibling is and the company-scoped
	// `patchCompanySeries` replaces it. Excluded by hand until the flag catches up.
	'updateSeries',
	// One-off configuration, genuinely done once in the dashboard: branding,
	// template customisation, and the tax/VeriFactu settings of a NIF.
	'updateMe', 'updateCompanyTaxConfiguration', 'updateCompanyVeriFactuConfiguration',
	'uploadCompanyLogoById', 'deleteCompanyLogoById',
	'getCompanyInvoiceCustomization', 'updateCompanyInvoiceCustomization',
	'activateCompanyById', 'deactivateCompanyById',
	// Ending or re-levelling the management of a provisioned account. Left out
	// deliberately: offboarding is as automatable as onboarding, but these are
	// destructive over someone else's fiscal data and rare enough that doing them
	// deliberately in the dashboard is the safer default. Reconsider on request.
	'changeManagedAccountAccessLevel', 'endAccountManagement',
	// Webhook subscriptions are managed by the BeeL Trigger node, which uses the
	// four in REFERENCED_OPERATION_IDS; the rest have no place in a workflow.
	'getAccountWebhookSubscription', 'listAccountWebhookDeliveries',
	'retryAccountWebhookDelivery', 'testAccountWebhookSubscription', 'rotateAccountWebhookSecret',
	// Team administration inside an account: who else can log in and what they
	// reach. Occasional, and done by a person, not by a workflow.
	'listAccountMembers', 'getAccountMember', 'patchAccountMember', 'deleteAccountMember',
	'listAccountMemberGrants', 'putAccountMemberGrant', 'deleteAccountMemberGrant', 'putAccountOwner',
	'listAccountInvitations', 'createAccountInvitation', 'getAccountInvitation', 'deleteAccountInvitation',
	// Observability: request and email delivery logs, read in the dashboard when
	// debugging rather than driven from a workflow.
	'listAccountRequestLogs', 'getAccountRequestLog',
	'listAccountEmailDeliveries', 'getAccountEmailDeliveryIndicators', 'getAccountEmailDelivery',
];

/**
 * Parameter names the node defines itself. n8n stores values by name, so a
 * generated field landing on one of these would read the other's value — which
 * is how a `company_id` path parameter and the multi-NIF picker collided.
 */
export const RESERVED_PARAMETER_NAMES = [
	'resource',
	'operation',
	'activeCompany',
	'activeAccount',
	'idempotencyKey',
	'returnAll',
	'limit',
	'filters',
	'additionalFields',
	'updateFields',
	'options',
	'binaryPropertyName',
	'inputBinaryField',
	'draftPreview',
];

/** Fields that get a resource dropdown instead of a free-text UUID. */
export const LOAD_OPTIONS_BY_FIELD: Record<string, string> = {
	series_id: 'getSeries',
	customer_id: 'getCustomers',
};

/**
 * Cross-field constraints the contract states in prose instead of schema.
 *
 * `TaxInfo` documents which percentages each tax type accepts, but as a bullet
 * list in its description, so the generator would otherwise offer a free number
 * and let an invalid rate reach the API. `null` means the type accepts any value.
 */
export const TAX_PERCENTAGES: Record<string, number[] | null> = {
	IVA: [0, 4, 10, 21],
	IGIC: [0, 3, 5, 7, 9.5, 15, 20],
	IPSI: [0.5, 1, 2, 4, 8, 10],
	OTHER: null,
};

/**
 * Groups of fields the API accepts EXACTLY ONE of, even though the contract says
 * so only in prose: the rule lives in the server, not in the schema.
 *
 * Without this there is no way to get it right. n8n materialises every field of a
 * collection with its default, and a number's default is `0` — a legitimate
 * value, so it cannot simply be dropped. An invoice line went out carrying
 * `unit_price`, `total_excluding_tax` and `total_including_tax` at once, and the
 * API rejected it with "must carry exactly one of...".
 *
 * Declared here, the generator adds a selector that decides which one is shown,
 * so sending two stops being possible from the form.
 */
export const EXCLUSIVE_FIELD_GROUPS: Array<{
	/** Name of the generated selector. Never sent: it is `uiOnly`. */
	name: string;
	displayName: string;
	description: string;
	/** The `apiName` of each alternative, and how it reads in the dropdown. */
	choices: Array<{ apiName: string; label: string; description: string }>;
}> = [
	{
		name: 'price_mode',
		displayName: 'Price Given As',
		description: 'Which figure you are stating for this line. BeeL works the other two out.',
		choices: [
			{ apiName: 'unit_price', label: 'Unit Price', description: 'Price per unit, before taxes — the usual case' },
			{ apiName: 'total_excluding_tax', label: 'Line Total Without Tax', description: 'You know the taxable base and want it respected exactly' },
			{ apiName: 'total_including_tax', label: 'Line Total With Tax', description: 'You know what the customer pays and want the base worked back from it' },
		],
	},
];

/**
 * UI copy lives in `ui-text.ts`, not here: `FIELD_UI_OVERRIDES` for a field's
 * placeholder, default or description, and `OPTION_NAME_OVERRIDES` for enum
 * labels. That module also holds the guard that fails generation when a
 * user-visible string is not English.
 */

/** Acronyms and one-letter names that title-casing would mangle. */
export const DISPLAY_NAME_OVERRIDES: Record<string, string> = {
	nif: 'NIF',
	iban: 'IBAN',
	swift: 'SWIFT',
	irpf: 'IRPF',
	irpf_rate: 'IRPF Rate',
	url: 'URL',
	web: 'Website',
	cc: 'CC',
	q: 'Search Query',
};
