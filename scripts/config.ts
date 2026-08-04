/**
 * Configuration for the OpenAPI → n8n generator.
 *
 * Only what the contract cannot tell us lives here: which endpoints are worth
 * exposing, and what an operation is called in the UI. Everything else — labels,
 * descriptions, required fields, pagination, list keys — is derived in
 * `generate.ts` straight from `openapi/public-api.yaml`.
 */

/** OpenAPI tag → n8n resource. Order defines the Resource dropdown. */
export const RESOURCES: Array<{ resource: string; displayName: string; tags: string[] }> = [
	{ resource: 'invoice', displayName: 'Invoice', tags: ['Invoices', 'InvoiceLifecycle', 'InvoiceDelivery'] },
	{ resource: 'customer', displayName: 'Customer', tags: ['Customers'] },
	{ resource: 'product', displayName: 'Product', tags: ['Products'] },
	{ resource: 'series', displayName: 'Series', tags: ['InvoiceSeries'] },
	{ resource: 'recurringInvoice', displayName: 'Recurring Invoice', tags: ['RecurringInvoices'] },
	{ resource: 'configuration', displayName: 'Configuration', tags: ['ConfigurationTax', 'ConfigurationVeriFactu', 'ConfigurationPreferences'] },
	{ resource: 'nif', displayName: 'NIF', tags: ['NIF'] },
	{ resource: 'company', displayName: 'Company', tags: ['PublicCompanies', 'PublicCompanyRepresentations'] },
];

/**
 * `operationId` → n8n operation name. Being an explicit map keeps the dropdown
 * stable when the contract renames an operationId, and doubles as the allow-list:
 * an endpoint that is not here, not manual and not excluded fails the drift check.
 */
export const OPERATION_NAMES: Record<string, string> = {
	// Invoice
	listInvoices: 'getAll',
	createInvoice: 'create',
	updateInvoice: 'update',
	createCorrectiveInvoice: 'createCorrective',
	getInvoice: 'get',
	deleteInvoice: 'delete',
	issueInvoice: 'issue',
	duplicateInvoice: 'duplicate',
	sendInvoiceEmail: 'send',
	markInvoicePaid: 'markPaid',
	markInvoiceSent: 'markSent',
	revertInvoiceToIssued: 'revertToIssued',
	voidInvoice: 'void',
	scheduleInvoice: 'schedule',
	unscheduleInvoice: 'unschedule',
	rescheduleInvoice: 'reschedule',
	// Customer
	listCustomers: 'getAll',
	createCustomer: 'create',
	getCustomer: 'get',
	updateCustomer: 'update',
	deactivateCustomer: 'delete',
	// Product
	listProducts: 'getAll',
	createProduct: 'create',
	getProduct: 'get',
	updateProduct: 'update',
	deleteProduct: 'delete',
	searchProducts: 'search',
	// Series
	listSeries: 'getAll',
	createSeries: 'create',
	updateSeries: 'update',
	deleteSeries: 'delete',
	setDefaultSeries: 'setDefault',
	// Recurring invoice
	createRecurringInvoice: 'create',
	updateRecurringInvoice: 'update',
	listRecurringInvoices: 'getAll',
	getRecurringInvoice: 'get',
	createRecurringFromInvoice: 'createFromInvoice',
	deleteRecurringInvoice: 'delete',
	pauseRecurringInvoice: 'pause',
	resumeRecurringInvoice: 'resume',
	generateInvoiceNow: 'generateNow',
	skipNextGeneration: 'skipNext',
	previewRecurringInvoice: 'preview',
	getRecurringHistory: 'getHistory',
	// Configuration
	getTaxConfiguration: 'getTaxConfiguration',
	getTaxTypes: 'getTaxTypes',
	getVeriFactuConfiguration: 'getVerifactu',
	getInvoiceCustomizationOptions: 'getInvoiceCustomization',
	// NIF
	validateNif: 'validate',
	// Company (multi-NIF): CRUD plus the VeriFactu representation flow that
	// registers a NIF with the AEAT.
	createCompany: 'create',
	listCompanies: 'getAll',
	getCompany: 'get',
	updateCompany: 'update',
	deleteCompany: 'delete',
	generateRepresentation: 'generateRepresentation',
	downloadRepresentation: 'downloadRepresentation',
	getRepresentationStatus: 'getRepresentationStatus',
	cancelRepresentation: 'cancelRepresentation',
};

/**
 * Hand-written instead of generated: they move a file rather than JSON — two
 * PDF downloads and the multipart upload of the signed representation.
 */
export const MANUAL_OPERATION_IDS = [
	'generateInvoicePdf',
	'previewDraftInvoicePdf',
	'submitRepresentation',
];

/** Out of scope, listed so the drift check separates "decided no" from "not looked at". */
export const EXCLUDED_OPERATION_IDS = [
	// Bulk, import and export — n8n's own batching and file nodes do this better.
	'downloadInvoicesPdfBulk', 'sendInvoicesBulkEmail', 'changeInvoicesStatusBulk', 'exportInvoicesExcel',
	'createCustomersBulk', 'deactivateCustomersBulk', 'importCustomersCsvPreview', 'importHoldedContacts',
	'downloadCustomerTemplateCsv', 'createProductsBulk', 'deleteProductsBulk',
	// Company-scoped API keys. The contract says the issued key "authenticates
	// directly as this company", but in practice everything is operated with the
	// account-wide key and companies are managed from it, so exposing these would
	// promise an isolation the platform does not actually work that way.
	'createCompanyApiKey', 'listCompanyApiKeys', 'revokeCompanyApiKey',
	// Account-wide settings, changed in the dashboard rather than per workflow.
	'updateLanguage', 'updateTaxConfiguration', 'updateVeriFactuConfiguration',
	// Webhook subscriptions are managed by the BeeL Trigger node.
	'createWebhookSubscription', 'listWebhookSubscriptions', 'updateWebhookSubscription',
	'deleteWebhookSubscription', 'listWebhookDeliveries', 'retryWebhookDelivery', 'rotateWebhookSecret',
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
