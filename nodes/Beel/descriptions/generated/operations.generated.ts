/**
 * GENERATED FILE — DO NOT EDIT.
 *
 * Produced by `npm run generate` from `openapi/public-api.yaml`
 * (BeeL Public API 1.0.1).
 *
 * Hand-written operations live in `../InvoiceDescription.ts`.
 */

import type { GeneratedOperation, GeneratedResource } from './types';

/** Resource dropdown, in the order declared in scripts/config.ts. */
export const GENERATED_RESOURCES: GeneratedResource[] = [
	{
		"resource": "invoice",
		"displayName": "Invoice"
	},
	{
		"resource": "customer",
		"displayName": "Customer"
	},
	{
		"resource": "product",
		"displayName": "Product"
	},
	{
		"resource": "series",
		"displayName": "Series"
	},
	{
		"resource": "recurringInvoice",
		"displayName": "Recurring Invoice"
	},
	{
		"resource": "configuration",
		"displayName": "Configuration"
	},
	{
		"resource": "nif",
		"displayName": "NIF"
	},
	{
		"resource": "company",
		"displayName": "Company"
	}
];

export const GENERATED_OPERATIONS: GeneratedOperation[] = [
	{
		"resource": "invoice",
		"operation": "getAll",
		"displayName": "Get Many",
		"action": "List invoices",
		"description": "Returns a paginated list of invoices with optional filters",
		"operationId": "listInvoices",
		"method": "GET",
		"path": "/v1/invoices",
		"pathParams": [],
		"requiredFields": [],
		"optionalFields": [],
		"filters": [
			{
				"name": "search",
				"apiName": "search",
				"displayName": "Search",
				"description": "Global search across invoice number, recipient name, recipient NIF, and series code (partial, case-insensitive)",
				"type": "string",
				"default": ""
			},
			{
				"name": "status",
				"apiName": "status",
				"displayName": "Status",
				"description": "Filter by invoice status",
				"type": "options",
				"options": [
					{
						"name": "— Not set —",
						"value": ""
					},
					{
						"name": "SCHEDULED",
						"value": "SCHEDULED",
						"description": "Scheduled invoice to be issued automatically on a future date"
					},
					{
						"name": "DRAFT",
						"value": "DRAFT",
						"description": "Draft invoice not sent yet (modifiable)"
					},
					{
						"name": "ISSUED",
						"value": "ISSUED",
						"description": "Finalized invoice with definitive number but not sent"
					},
					{
						"name": "SENT",
						"value": "SENT",
						"description": "Invoice sent to customer"
					},
					{
						"name": "PAID",
						"value": "PAID",
						"description": "Invoice paid"
					},
					{
						"name": "OVERDUE",
						"value": "OVERDUE",
						"description": "Overdue invoice (not paid after due date)"
					},
					{
						"name": "RECTIFIED",
						"value": "RECTIFIED",
						"description": "Partially corrected invoice (one or more PARTIAL corrective invoices)"
					},
					{
						"name": "VOIDED",
						"value": "VOIDED",
						"description": "Completely cancelled invoice (TOTAL corrective invoice)"
					}
				],
				"default": ""
			},
			{
				"name": "type",
				"apiName": "type",
				"displayName": "Type",
				"description": "Filter by invoice type",
				"type": "options",
				"options": [
					{
						"name": "— Not set —",
						"value": ""
					},
					{
						"name": "STANDARD",
						"value": "STANDARD",
						"description": "Standard invoice"
					},
					{
						"name": "CORRECTIVE",
						"value": "CORRECTIVE",
						"description": "Corrects or cancels a previous invoice"
					},
					{
						"name": "SIMPLIFIED",
						"value": "SIMPLIFIED",
						"description": "Simplified invoice without all requirements (up to 400€, or 3,000€ with NIF)"
					}
				],
				"default": ""
			},
			{
				"name": "customer_id",
				"apiName": "customer_id",
				"displayName": "Customer ID",
				"description": "Filter by customer UUID",
				"validation": {
					"format": "uuid"
				},
				"type": "options",
				"loadOptionsMethod": "getCustomers",
				"default": ""
			},
			{
				"name": "date_from",
				"apiName": "date_from",
				"displayName": "Date From",
				"description": "Issue date from (YYYY-MM-DD)",
				"validation": {
					"format": "date"
				},
				"type": "string",
				"default": ""
			},
			{
				"name": "date_to",
				"apiName": "date_to",
				"displayName": "Date To",
				"description": "Issue date to (YYYY-MM-DD)",
				"validation": {
					"format": "date"
				},
				"type": "string",
				"default": ""
			},
			{
				"name": "invoice_number",
				"apiName": "invoice_number",
				"displayName": "Invoice Number",
				"description": "Search by invoice number (e.g., 2025/0001)",
				"type": "string",
				"default": ""
			},
			{
				"name": "recipient_name",
				"apiName": "recipient_name",
				"displayName": "Recipient Name",
				"description": "Filter by recipient's fiscal name (partial, case-insensitive search)",
				"type": "string",
				"default": ""
			},
			{
				"name": "recipient_nif",
				"apiName": "recipient_nif",
				"displayName": "Recipient NIF",
				"description": "Filter by recipient's NIF (partial search)",
				"type": "string",
				"default": ""
			},
			{
				"name": "series_code",
				"apiName": "series_code",
				"displayName": "Series Code",
				"description": "Filter by series code",
				"type": "string",
				"default": ""
			},
			{
				"name": "taxable_base_min",
				"apiName": "taxable_base_min",
				"displayName": "Taxable Base Min",
				"description": "Minimum taxable base",
				"validation": {
					"format": "double"
				},
				"type": "number",
				"default": 0
			},
			{
				"name": "taxable_base_max",
				"apiName": "taxable_base_max",
				"displayName": "Taxable Base Max",
				"description": "Maximum taxable base",
				"validation": {
					"format": "double"
				},
				"type": "number",
				"default": 0
			},
			{
				"name": "total_min",
				"apiName": "total_min",
				"displayName": "Total Min",
				"description": "Minimum invoice total",
				"validation": {
					"format": "double"
				},
				"type": "number",
				"default": 0
			},
			{
				"name": "total_max",
				"apiName": "total_max",
				"displayName": "Total Max",
				"description": "Maximum invoice total",
				"validation": {
					"format": "double"
				},
				"type": "number",
				"default": 0
			},
			{
				"name": "verifactu_status",
				"apiName": "verifactu_status",
				"displayName": "Verifactu Status",
				"description": "Filter by VeriFactu status",
				"type": "options",
				"options": [
					{
						"name": "— Not set —",
						"value": ""
					},
					{
						"name": "NO VERIFACTU",
						"value": "NO_VERIFACTU"
					},
					{
						"name": "PENDING",
						"value": "PENDING"
					},
					{
						"name": "ACCEPTED",
						"value": "ACCEPTED"
					},
					{
						"name": "REJECTED",
						"value": "REJECTED"
					}
				],
				"default": ""
			},
			{
				"name": "sort_by",
				"apiName": "sort_by",
				"displayName": "Sort By",
				"description": "Field to sort by (e.g., issue_date, invoice_number, invoice_total)",
				"type": "string",
				"default": ""
			},
			{
				"name": "sort_order",
				"apiName": "sort_order",
				"displayName": "Sort Order",
				"description": "Sort direction",
				"type": "options",
				"options": [
					{
						"name": "Asc",
						"value": "asc"
					},
					{
						"name": "Desc",
						"value": "desc"
					}
				],
				"default": "desc"
			}
		],
		"optionalCollectionName": "options",
		"queryParamNames": [
			"search",
			"status",
			"type",
			"customer_id",
			"date_from",
			"date_to",
			"invoice_number",
			"recipient_name",
			"recipient_nif",
			"series_code",
			"taxable_base_min",
			"taxable_base_max",
			"total_min",
			"total_max",
			"verifactu_status",
			"sort_by",
			"sort_order"
		],
		"paginated": true,
		"isList": true,
		"listKey": "invoices"
	},
	{
		"resource": "invoice",
		"operation": "create",
		"displayName": "Create",
		"action": "Create invoice",
		"description": "Creates a new invoice",
		"operationId": "createInvoice",
		"method": "POST",
		"path": "/v1/invoices",
		"pathParams": [],
		"requiredFields": [
			{
				"name": "type",
				"apiName": "type",
				"displayName": "Type",
				"description": "- STANDARD: Standard invoice - CORRECTIVE: Corrects or cancels a previous invoice - SIMPLIFIED: Simplified invoice without all requirements (up to 400€, or 3,000€ with NIF)",
				"required": true,
				"type": "options",
				"options": [
					{
						"name": "STANDARD",
						"value": "STANDARD",
						"description": "Standard invoice"
					},
					{
						"name": "CORRECTIVE",
						"value": "CORRECTIVE",
						"description": "Corrects or cancels a previous invoice"
					},
					{
						"name": "SIMPLIFIED",
						"value": "SIMPLIFIED",
						"description": "Simplified invoice without all requirements (up to 400€, or 3,000€ with NIF)"
					}
				],
				"default": "STANDARD"
			},
			{
				"name": "recipient",
				"apiName": "recipient",
				"displayName": "Recipient",
				"required": true,
				"type": "fixedCollection",
				"fields": [
					{
						"name": "customer_id",
						"apiName": "customer_id",
						"displayName": "Customer ID",
						"description": "UUID of a registered customer",
						"validation": {
							"format": "uuid"
						},
						"type": "options",
						"loadOptionsMethod": "getCustomers",
						"default": ""
					},
					{
						"name": "legal_name",
						"apiName": "legal_name",
						"displayName": "Legal Name",
						"description": "Recipient legal name (max 255 characters)",
						"validation": {
							"minLength": 1,
							"maxLength": 255
						},
						"type": "string",
						"default": "",
						"placeholder": "Tech Solutions SL"
					},
					{
						"name": "trade_name",
						"apiName": "trade_name",
						"displayName": "Trade Name",
						"description": "Recipient trade name (optional) (max 255 characters)",
						"validation": {
							"minLength": 1,
							"maxLength": 255
						},
						"type": "string",
						"default": "",
						"placeholder": "TechSol"
					},
					{
						"name": "nif",
						"apiName": "nif",
						"displayName": "NIF",
						"description": "Spanish Tax ID (9 alphanumeric characters) (exactly 9 characters)",
						"validation": {
							"pattern": "^[A-Za-z0-9]{9}$",
							"minLength": 9,
							"maxLength": 9
						},
						"type": "string",
						"default": "",
						"placeholder": "B12345678"
					},
					{
						"name": "alternative_id_type",
						"apiName": "alternative_id.type",
						"displayName": "Alternative ID Type",
						"description": "- 02: VAT-ID (intra-community) - 03: Passport - 04: Country of residence ID - 05: Residence certificate - 06: Other document - 07: Not registered",
						"type": "options",
						"options": [
							{
								"name": "02",
								"value": "02",
								"description": "VAT-ID (intra-community)"
							},
							{
								"name": "03",
								"value": "03",
								"description": "Passport"
							},
							{
								"name": "04",
								"value": "04",
								"description": "Country of residence ID"
							},
							{
								"name": "05",
								"value": "05",
								"description": "Residence certificate"
							},
							{
								"name": "06",
								"value": "06",
								"description": "Other document"
							},
							{
								"name": "07",
								"value": "07",
								"description": "Not registered"
							}
						],
						"default": "02",
						"required": false,
						"groupRequired": true
					},
					{
						"name": "alternative_id_number",
						"apiName": "alternative_id.number",
						"displayName": "Alternative ID Number",
						"description": "Format: max 20 characters",
						"validation": {
							"minLength": 1,
							"maxLength": 20
						},
						"type": "string",
						"default": "",
						"required": false,
						"groupRequired": true
					},
					{
						"name": "alternative_id_country_code",
						"apiName": "alternative_id.country_code",
						"displayName": "Alternative ID Country Code",
						"description": "ISO 3166-1 alpha-2 country code (exactly 2 characters)",
						"validation": {
							"pattern": "^[A-Z]{2}$",
							"minLength": 2,
							"maxLength": 2
						},
						"type": "string",
						"default": "",
						"required": false
					},
					{
						"name": "address_street",
						"apiName": "address.street",
						"displayName": "Address Street",
						"description": "Full address (street, number, floor, etc.) - Latin characters only (max 255 characters)",
						"validation": {
							"pattern": "^[a-zA-Z0-9À-ÿ\\u0100-\\u017F\\u00B7\\s\\.,\\-\\/'ºª°:;\"()&#]+$",
							"minLength": 1,
							"maxLength": 255
						},
						"type": "string",
						"default": "",
						"placeholder": "Calle Mayor, 123",
						"required": false,
						"groupRequired": true
					},
					{
						"name": "address_number",
						"apiName": "address.number",
						"displayName": "Address Number",
						"description": "Street number (max 20 characters)",
						"validation": {
							"minLength": 1,
							"maxLength": 20
						},
						"type": "string",
						"default": "",
						"placeholder": "123",
						"required": false,
						"groupRequired": true
					},
					{
						"name": "address_floor",
						"apiName": "address.floor",
						"displayName": "Address Floor",
						"description": "Floor or level (max 10 characters)",
						"validation": {
							"maxLength": 10
						},
						"type": "string",
						"default": "",
						"placeholder": "2º A",
						"required": false
					},
					{
						"name": "address_door",
						"apiName": "address.door",
						"displayName": "Address Door",
						"description": "Door or apartment (max 10 characters)",
						"validation": {
							"maxLength": 10
						},
						"type": "string",
						"default": "",
						"placeholder": "A",
						"required": false
					},
					{
						"name": "address_postal_code",
						"apiName": "address.postal_code",
						"displayName": "Address Postal Code",
						"description": "Postal code (5 digits for Spain, free format for other countries) (max 20 characters)",
						"validation": {
							"minLength": 1,
							"maxLength": 20
						},
						"type": "string",
						"default": "",
						"placeholder": "28001",
						"required": false,
						"groupRequired": true
					},
					{
						"name": "address_city",
						"apiName": "address.city",
						"displayName": "Address City",
						"description": "City or town - Latin characters only (max 100 characters)",
						"validation": {
							"pattern": "^[a-zA-Z0-9À-ÿ\\u0100-\\u017F\\u00B7\\u2018\\u2019\\u0060\\u00B4\\s\\.,\\-\\/'ºª()]+$",
							"minLength": 1,
							"maxLength": 100
						},
						"type": "string",
						"default": "",
						"placeholder": "Madrid",
						"required": false,
						"groupRequired": true
					},
					{
						"name": "address_province",
						"apiName": "address.province",
						"displayName": "Address Province",
						"description": "Province or state - Latin characters only (max 100 characters)",
						"validation": {
							"pattern": "^[a-zA-Z0-9À-ÿ\\u0100-\\u017F\\u00B7\\u2018\\u2019\\u0060\\u00B4\\s\\.,\\-\\/'ºª]+$",
							"minLength": 1,
							"maxLength": 100
						},
						"type": "string",
						"default": "",
						"placeholder": "Madrid",
						"required": false,
						"groupRequired": true
					},
					{
						"name": "address_country",
						"apiName": "address.country",
						"displayName": "Address Country",
						"description": "Country - Latin characters only (max 100 characters)",
						"validation": {
							"pattern": "^[a-zA-Z0-9À-ÿ\\u0100-\\u017F\\u00B7\\u2018\\u2019\\u0060\\u00B4\\s\\.,\\-\\/'ºª]+$",
							"minLength": 1,
							"maxLength": 100
						},
						"type": "string",
						"default": "España",
						"placeholder": "España",
						"required": false,
						"groupRequired": true
					},
					{
						"name": "address_country_code",
						"apiName": "address.country_code",
						"displayName": "Address Country Code",
						"description": "ISO 3166-1 alpha-2 country code (exactly 2 characters)",
						"validation": {
							"pattern": "^[A-Z]{2}$",
							"minLength": 2,
							"maxLength": 2
						},
						"type": "string",
						"default": "ES",
						"placeholder": "ES",
						"required": false
					},
					{
						"name": "phone",
						"apiName": "phone",
						"displayName": "Phone",
						"description": "Phone number (min 9 characters, max 20 characters)",
						"validation": {
							"pattern": "^[+]?[0-9\\s\\-\\(\\)]+$",
							"minLength": 9,
							"maxLength": 20
						},
						"type": "string",
						"default": "",
						"placeholder": "+34 612 345 678"
					},
					{
						"name": "email",
						"apiName": "email",
						"displayName": "Email",
						"description": "Email address (minimum valid email is 5 chars, e.g (email address, min 5 characters, max 255 characters)",
						"validation": {
							"minLength": 5,
							"maxLength": 255,
							"format": "email"
						},
						"type": "string",
						"default": "",
						"placeholder": "user@example.com"
					}
				],
				"default": {}
			},
			{
				"name": "lines",
				"apiName": "lines",
				"displayName": "Lines",
				"required": true,
				"validation": {
					"minItems": 1
				},
				"type": "fixedCollection",
				"fields": [
					{
						"name": "description",
						"apiName": "description",
						"displayName": "Description",
						"description": "Description of invoiced concept (max 500 characters)",
						"required": true,
						"validation": {
							"minLength": 1,
							"maxLength": 500
						},
						"type": "string",
						"default": "",
						"placeholder": "Web application development - Sprint 1"
					},
					{
						"name": "quantity",
						"apiName": "quantity",
						"displayName": "Quantity",
						"description": "Product/service quantity (can be negative for franchises or discounts)",
						"required": true,
						"type": "number",
						"default": 0
					},
					{
						"name": "unit",
						"apiName": "unit",
						"displayName": "Unit",
						"type": "string",
						"default": "",
						"placeholder": "hours"
					},
					{
						"name": "unit_price",
						"apiName": "unit_price",
						"displayName": "Unit Price",
						"description": "Unit price before taxes (between 0 (exclusive) and 999999.9999)",
						"required": true,
						"validation": {
							"minimum": 0,
							"maximum": 999999.9999,
							"exclusiveMinimum": true
						},
						"type": "number",
						"default": 0
					},
					{
						"name": "discount_percentage",
						"apiName": "discount_percentage",
						"displayName": "Discount Percentage",
						"description": "Discount percentage applied (0-100) (between 0 and 100)",
						"validation": {
							"minimum": 0,
							"maximum": 100
						},
						"type": "number",
						"default": 0
					},
					{
						"name": "main_tax_type",
						"apiName": "main_tax.type",
						"displayName": "Main Tax Type",
						"description": "Tax type by territory: - IVA: Iberian Peninsula and Balearic Islands (0%, 4%, 10%, 21%) - IGIC: Canary Islands (0%, 3%, 5%, 7%, 9.5%, 15%, 20%) - IPSI: Ceuta and Melilla (0.5%, 1%, 2%, 4%, 8%, 10%) - OTHER: Configurable 0%-100%",
						"type": "options",
						"options": [
							{
								"name": "IVA",
								"value": "IVA",
								"description": "Iberian Peninsula and Balearic Islands (0%, 4%, 10%, 21%)"
							},
							{
								"name": "IGIC",
								"value": "IGIC",
								"description": "Canary Islands (0%, 3%, 5%, 7%, 9.5%, 15%, 20%)"
							},
							{
								"name": "IPSI",
								"value": "IPSI",
								"description": "Ceuta and Melilla (0.5%, 1%, 2%, 4%, 8%, 10%)"
							},
							{
								"name": "OTHER",
								"value": "OTHER",
								"description": "Configurable 0%-100%"
							}
						],
						"default": "IVA",
						"required": false,
						"groupRequired": true
					},
					{
						"name": "main_tax_percentage_IVA",
						"apiName": "main_tax.percentage",
						"displayName": "Main Tax Percentage",
						"description": "Tax percentage (between 0 and 100) — rates allowed for IVA",
						"validation": {
							"minimum": 0,
							"maximum": 100
						},
						"type": "options",
						"default": 21,
						"required": false,
						"groupRequired": true,
						"options": [
							{
								"name": "0%",
								"value": 0
							},
							{
								"name": "4%",
								"value": 4
							},
							{
								"name": "10%",
								"value": 10
							},
							{
								"name": "21%",
								"value": 21
							}
						],
						"showWhen": {
							"field": "main_tax_type",
							"values": [
								"IVA"
							]
						}
					},
					{
						"name": "main_tax_percentage_IGIC",
						"apiName": "main_tax.percentage",
						"displayName": "Main Tax Percentage",
						"description": "Tax percentage (between 0 and 100) — rates allowed for IGIC",
						"validation": {
							"minimum": 0,
							"maximum": 100
						},
						"type": "options",
						"default": 0,
						"required": false,
						"groupRequired": true,
						"options": [
							{
								"name": "0%",
								"value": 0
							},
							{
								"name": "3%",
								"value": 3
							},
							{
								"name": "5%",
								"value": 5
							},
							{
								"name": "7%",
								"value": 7
							},
							{
								"name": "9.5%",
								"value": 9.5
							},
							{
								"name": "15%",
								"value": 15
							},
							{
								"name": "20%",
								"value": 20
							}
						],
						"showWhen": {
							"field": "main_tax_type",
							"values": [
								"IGIC"
							]
						}
					},
					{
						"name": "main_tax_percentage_IPSI",
						"apiName": "main_tax.percentage",
						"displayName": "Main Tax Percentage",
						"description": "Tax percentage (between 0 and 100) — rates allowed for IPSI",
						"validation": {
							"minimum": 0,
							"maximum": 100
						},
						"type": "options",
						"default": 0.5,
						"required": false,
						"groupRequired": true,
						"options": [
							{
								"name": "0.5%",
								"value": 0.5
							},
							{
								"name": "1%",
								"value": 1
							},
							{
								"name": "2%",
								"value": 2
							},
							{
								"name": "4%",
								"value": 4
							},
							{
								"name": "8%",
								"value": 8
							},
							{
								"name": "10%",
								"value": 10
							}
						],
						"showWhen": {
							"field": "main_tax_type",
							"values": [
								"IPSI"
							]
						}
					},
					{
						"name": "main_tax_percentage_OTHER",
						"apiName": "main_tax.percentage",
						"displayName": "Main Tax Percentage",
						"description": "Tax percentage (between 0 and 100)",
						"validation": {
							"minimum": 0,
							"maximum": 100
						},
						"type": "number",
						"default": 0,
						"required": false,
						"groupRequired": true,
						"showWhen": {
							"field": "main_tax_type",
							"values": [
								"OTHER"
							]
						}
					},
					{
						"name": "main_tax_regime_key",
						"apiName": "main_tax.regime_key",
						"displayName": "Main Tax Regime Key",
						"description": "Regime key according to VeriFactu regulations: - 01: General regime operation - 02: Export - 03: Used goods, art, antiques - 04: Investment gold - 05: Travel agencies - 06: Group of entities - 07: Cash basis - 08: IPSI/IVA/IGIC operations - 09: Mediating agencies - 10: Third-party collections - 1...",
						"type": "options",
						"options": [
							{
								"name": "01",
								"value": "01",
								"description": "General regime operation"
							},
							{
								"name": "02",
								"value": "02",
								"description": "Export"
							},
							{
								"name": "03",
								"value": "03",
								"description": "Used goods, art, antiques"
							},
							{
								"name": "04",
								"value": "04",
								"description": "Investment gold"
							},
							{
								"name": "05",
								"value": "05",
								"description": "Travel agencies"
							},
							{
								"name": "06",
								"value": "06",
								"description": "Group of entities"
							},
							{
								"name": "07",
								"value": "07",
								"description": "Cash basis"
							},
							{
								"name": "08",
								"value": "08",
								"description": "IPSI/IVA/IGIC operations"
							},
							{
								"name": "09",
								"value": "09",
								"description": "Mediating agencies"
							},
							{
								"name": "10",
								"value": "10",
								"description": "Third-party collections"
							},
							{
								"name": "11",
								"value": "11",
								"description": "Local rental"
							},
							{
								"name": "14",
								"value": "14",
								"description": "VAT pending in certifications"
							},
							{
								"name": "15",
								"value": "15",
								"description": "VAT pending successive tract"
							},
							{
								"name": "17",
								"value": "17",
								"description": "OSS and IOSS"
							},
							{
								"name": "18",
								"value": "18",
								"description": "Equivalence surcharge"
							},
							{
								"name": "19",
								"value": "19",
								"description": "REAGYP"
							},
							{
								"name": "20",
								"value": "20",
								"description": "Simplified regime"
							}
						],
						"default": "01",
						"required": false
					},
					{
						"name": "equivalence_surcharge_rate",
						"apiName": "equivalence_surcharge_rate",
						"displayName": "Equivalence Surcharge Rate",
						"description": "Equivalence surcharge percentage in decimal format",
						"type": "options",
						"options": [
							{
								"name": "— Not set —",
								"value": ""
							},
							{
								"name": "0",
								"value": 0
							},
							{
								"name": "0 5",
								"value": 0.5
							},
							{
								"name": "1 4",
								"value": 1.4
							},
							{
								"name": "5 2",
								"value": 5.2
							}
						],
						"default": ""
					},
					{
						"name": "irpf_rate",
						"apiName": "irpf_rate",
						"displayName": "IRPF Rate",
						"description": "Personal income tax/withholding percentage in integer format",
						"type": "options",
						"options": [
							{
								"name": "— Not set —",
								"value": ""
							},
							{
								"name": "0",
								"value": 0
							},
							{
								"name": "1",
								"value": 1
							},
							{
								"name": "2",
								"value": 2
							},
							{
								"name": "7",
								"value": 7
							},
							{
								"name": "15",
								"value": 15
							},
							{
								"name": "19",
								"value": 19
							},
							{
								"name": "24",
								"value": 24
							}
						],
						"default": ""
					},
					{
						"name": "exemption_reason",
						"apiName": "exemption_reason",
						"displayName": "Exemption Reason",
						"description": "Tax exemption reason code per Spanish VAT Law (Ley 37/1992 LIVA)",
						"type": "options",
						"options": [
							{
								"name": "— Not set —",
								"value": ""
							},
							{
								"name": "EXENTA ART 20",
								"value": "EXENTA_ART_20"
							},
							{
								"name": "EXENTA ART 21 24",
								"value": "EXENTA_ART_21_24"
							},
							{
								"name": "EXENTA ART 25",
								"value": "EXENTA_ART_25"
							},
							{
								"name": "EXENTA ART 26",
								"value": "EXENTA_ART_26"
							},
							{
								"name": "EXENTA ART 140",
								"value": "EXENTA_ART_140"
							},
							{
								"name": "NO SUJETA ART 7 9",
								"value": "NO_SUJETA_ART_7_9"
							},
							{
								"name": "ISP ART 84 2 A",
								"value": "ISP_ART_84_2_A"
							},
							{
								"name": "ISP ART 84 2 E",
								"value": "ISP_ART_84_2_E"
							},
							{
								"name": "ISP ART 84 2 F",
								"value": "ISP_ART_84_2_F"
							},
							{
								"name": "REGIMEN ART 129",
								"value": "REGIMEN_ART_129"
							},
							{
								"name": "REGIMEN ART 135",
								"value": "REGIMEN_ART_135"
							},
							{
								"name": "REGIMEN ART 141",
								"value": "REGIMEN_ART_141"
							},
							{
								"name": "REGIMEN ART 154",
								"value": "REGIMEN_ART_154"
							},
							{
								"name": "REGIMEN ART 163 DECIES",
								"value": "REGIMEN_ART_163_DECIES"
							},
							{
								"name": "OTRO",
								"value": "OTRO"
							}
						],
						"default": ""
					},
					{
						"name": "exemption_reason_text",
						"apiName": "exemption_reason_text",
						"displayName": "Exemption Reason Text",
						"description": "Custom exemption text (max 500 characters)",
						"validation": {
							"maxLength": 500
						},
						"type": "string",
						"default": ""
					}
				],
				"multipleValues": true,
				"default": {}
			}
		],
		"optionalFields": [
			{
				"name": "series_id",
				"apiName": "series_id",
				"displayName": "Series ID",
				"description": "Invoicing series ID (if not specified, uses default)",
				"validation": {
					"format": "uuid"
				},
				"type": "options",
				"loadOptionsMethod": "getSeries",
				"default": ""
			},
			{
				"name": "operation_date",
				"apiName": "operation_date",
				"displayName": "Operation Date",
				"description": "Date when the operation actually occurred (YYYY-MM-DD)",
				"validation": {
					"format": "date"
				},
				"type": "string",
				"default": "",
				"placeholder": "2025-01-10"
			},
			{
				"name": "due_date",
				"apiName": "due_date",
				"displayName": "Due Date",
				"description": "Payment due date (YYYY-MM-DD)",
				"validation": {
					"format": "date"
				},
				"type": "string",
				"default": "",
				"placeholder": "2025-02-14"
			},
			{
				"name": "payment_info",
				"apiName": "payment_info",
				"displayName": "Payment Info",
				"type": "fixedCollection",
				"fields": [
					{
						"name": "method",
						"apiName": "method",
						"displayName": "Method",
						"description": "Preferred payment method",
						"type": "options",
						"options": [
							{
								"name": "NONE",
								"value": "NONE"
							},
							{
								"name": "BANK TRANSFER",
								"value": "BANK_TRANSFER"
							},
							{
								"name": "CARD",
								"value": "CARD"
							},
							{
								"name": "CASH",
								"value": "CASH"
							},
							{
								"name": "CHECK",
								"value": "CHECK"
							},
							{
								"name": "DIRECT DEBIT",
								"value": "DIRECT_DEBIT"
							},
							{
								"name": "OTHER",
								"value": "OTHER"
							}
						],
						"default": "BANK_TRANSFER"
					},
					{
						"name": "iban",
						"apiName": "iban",
						"displayName": "IBAN",
						"description": "IBAN (International Bank Account Number) (min 15 characters, max 34 characters)",
						"validation": {
							"pattern": "^[A-Z]{2}\\d{2}[A-Z0-9]{1,30}$",
							"minLength": 15,
							"maxLength": 34
						},
						"type": "string",
						"default": "",
						"placeholder": "ES1234567890123456789012"
					},
					{
						"name": "swift",
						"apiName": "swift",
						"displayName": "SWIFT",
						"description": "SWIFT/BIC code (min 8 characters, max 11 characters)",
						"validation": {
							"pattern": "^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$",
							"minLength": 8,
							"maxLength": 11
						},
						"type": "string",
						"default": "",
						"placeholder": "ABCDESMMXXX"
					},
					{
						"name": "payment_term_days",
						"apiName": "payment_term_days",
						"displayName": "Payment Term Days",
						"description": "Payment term in days (optional, default 30) (between 0 and 365)",
						"validation": {
							"minimum": 0,
							"maximum": 365
						},
						"type": "number",
						"default": 30,
						"numberPrecision": 0
					}
				],
				"default": {}
			},
			{
				"name": "notes",
				"apiName": "notes",
				"displayName": "Notes",
				"description": "Format: max 1000 characters",
				"validation": {
					"maxLength": 1000
				},
				"type": "string",
				"default": "",
				"placeholder": "Payment by bank transfer. Includes technical support for 30 days."
			},
			{
				"name": "rectified_invoice_id",
				"apiName": "rectified_invoice_id",
				"displayName": "Rectified Invoice ID",
				"description": "Required if type is \"CORRECTIVE\" (UUID)",
				"validation": {
					"format": "uuid"
				},
				"type": "string",
				"default": "",
				"placeholder": "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
			},
			{
				"name": "rectification_reason",
				"apiName": "rectification_reason",
				"displayName": "Rectification Reason",
				"description": "Required if type is \"CORRECTIVE\" (max 500 characters)",
				"validation": {
					"maxLength": 500
				},
				"type": "string",
				"default": "",
				"placeholder": "Amount correction due to calculation error in hours"
			},
			{
				"name": "metadata",
				"apiName": "metadata",
				"displayName": "Metadata",
				"description": "Additional metadata in key-value format",
				"type": "json",
				"default": "{}"
			},
			{
				"name": "options",
				"apiName": "options",
				"displayName": "Options",
				"description": "Controls how the invoice is processed after creation",
				"type": "fixedCollection",
				"fields": [
					{
						"name": "verifactu_enabled",
						"apiName": "verifactu_enabled",
						"displayName": "Verifactu Enabled",
						"description": "Whether VeriFactu information should be generated for this invoice",
						"type": "boolean",
						"default": false
					},
					{
						"name": "issue_directly",
						"apiName": "issue_directly",
						"displayName": "Issue Directly",
						"description": "If `true`, creates the invoice directly as **ISSUED** with a definitive number and PDF",
						"type": "boolean",
						"default": false
					},
					{
						"name": "wait_for_pdf",
						"apiName": "wait_for_pdf",
						"displayName": "Wait For Pdf",
						"description": "Only applies when `issue_directly` is `true`",
						"type": "boolean",
						"default": false
					},
					{
						"name": "send_automatically",
						"apiName": "send_automatically",
						"displayName": "Send Automatically",
						"description": "Only applies when `issue_directly` is `true`",
						"type": "boolean",
						"default": false
					},
					{
						"name": "email_config_recipients",
						"apiName": "email_config.recipients",
						"displayName": "Email Config Recipients",
						"description": "List of recipient emails (at least 1 required) (email address, min 5 characters, max 255 characters)",
						"validation": {
							"minLength": 5,
							"maxLength": 255,
							"format": "email",
							"minItems": 1
						},
						"type": "string",
						"multipleValues": true,
						"default": [],
						"required": false,
						"groupRequired": true
					},
					{
						"name": "email_config_cc",
						"apiName": "email_config.cc",
						"displayName": "Email Config CC",
						"description": "List of CC emails (optional) (email address, min 5 characters, max 255 characters)",
						"type": "string",
						"validation": {
							"minLength": 5,
							"maxLength": 255,
							"format": "email"
						},
						"multipleValues": true,
						"default": [],
						"required": false
					},
					{
						"name": "email_config_subject",
						"apiName": "email_config.subject",
						"displayName": "Email Config Subject",
						"description": "Custom email subject (optional, if not specified uses a default) (max 200 characters)",
						"validation": {
							"minLength": 1,
							"maxLength": 200
						},
						"type": "string",
						"default": "",
						"placeholder": "Invoice 2025/0001 - Web development services",
						"required": false
					},
					{
						"name": "email_config_message",
						"apiName": "email_config.message",
						"displayName": "Email Config Message",
						"description": "Custom message (optional, added to email body) (max 2000 characters)",
						"validation": {
							"minLength": 1,
							"maxLength": 2000
						},
						"type": "string",
						"default": "",
						"placeholder": "Dear customer, please find attached the invoice for the services provided. Thank you for your trust.",
						"required": false
					}
				],
				"default": {}
			}
		],
		"filters": [],
		"optionalCollectionName": "additionalFields",
		"queryParamNames": [],
		"paginated": false,
		"isList": false,
		"listKey": ""
	},
	{
		"resource": "invoice",
		"operation": "update",
		"displayName": "Update",
		"action": "Update invoice",
		"description": "Updates an existing draft invoice",
		"operationId": "updateInvoice",
		"method": "PUT",
		"path": "/v1/invoices/{invoice_id}",
		"pathParams": [
			{
				"name": "invoiceId",
				"apiName": "invoice_id",
				"displayName": "Invoice ID",
				"description": "Invoice ID",
				"required": true,
				"validation": {
					"format": "uuid"
				},
				"type": "string",
				"default": "",
				"placeholder": "550e8400-e29b-41d4-a716-446655440000"
			}
		],
		"requiredFields": [],
		"optionalFields": [
			{
				"name": "series_id",
				"apiName": "series_id",
				"displayName": "Series ID",
				"description": "Series ID",
				"validation": {
					"format": "uuid"
				},
				"type": "options",
				"loadOptionsMethod": "getSeries",
				"default": ""
			},
			{
				"name": "operation_date",
				"apiName": "operation_date",
				"displayName": "Operation Date",
				"description": "Date when the operation occurred (YYYY-MM-DD)",
				"validation": {
					"format": "date"
				},
				"type": "string",
				"default": ""
			},
			{
				"name": "due_date",
				"apiName": "due_date",
				"displayName": "Due Date",
				"description": "New due date (YYYY-MM-DD)",
				"validation": {
					"format": "date"
				},
				"type": "string",
				"default": ""
			},
			{
				"name": "recipient",
				"apiName": "recipient",
				"displayName": "Recipient",
				"type": "fixedCollection",
				"fields": [
					{
						"name": "customer_id",
						"apiName": "customer_id",
						"displayName": "Customer ID",
						"description": "UUID of a registered customer",
						"validation": {
							"format": "uuid"
						},
						"type": "options",
						"loadOptionsMethod": "getCustomers",
						"default": ""
					},
					{
						"name": "legal_name",
						"apiName": "legal_name",
						"displayName": "Legal Name",
						"description": "Recipient legal name (max 255 characters)",
						"validation": {
							"minLength": 1,
							"maxLength": 255
						},
						"type": "string",
						"default": "",
						"placeholder": "Tech Solutions SL"
					},
					{
						"name": "trade_name",
						"apiName": "trade_name",
						"displayName": "Trade Name",
						"description": "Recipient trade name (optional) (max 255 characters)",
						"validation": {
							"minLength": 1,
							"maxLength": 255
						},
						"type": "string",
						"default": "",
						"placeholder": "TechSol"
					},
					{
						"name": "nif",
						"apiName": "nif",
						"displayName": "NIF",
						"description": "Spanish Tax ID (9 alphanumeric characters) (exactly 9 characters)",
						"validation": {
							"pattern": "^[A-Za-z0-9]{9}$",
							"minLength": 9,
							"maxLength": 9
						},
						"type": "string",
						"default": "",
						"placeholder": "B12345678"
					},
					{
						"name": "alternative_id_type",
						"apiName": "alternative_id.type",
						"displayName": "Alternative ID Type",
						"description": "- 02: VAT-ID (intra-community) - 03: Passport - 04: Country of residence ID - 05: Residence certificate - 06: Other document - 07: Not registered",
						"type": "options",
						"options": [
							{
								"name": "02",
								"value": "02",
								"description": "VAT-ID (intra-community)"
							},
							{
								"name": "03",
								"value": "03",
								"description": "Passport"
							},
							{
								"name": "04",
								"value": "04",
								"description": "Country of residence ID"
							},
							{
								"name": "05",
								"value": "05",
								"description": "Residence certificate"
							},
							{
								"name": "06",
								"value": "06",
								"description": "Other document"
							},
							{
								"name": "07",
								"value": "07",
								"description": "Not registered"
							}
						],
						"default": "02",
						"required": false,
						"groupRequired": true
					},
					{
						"name": "alternative_id_number",
						"apiName": "alternative_id.number",
						"displayName": "Alternative ID Number",
						"description": "Format: max 20 characters",
						"validation": {
							"minLength": 1,
							"maxLength": 20
						},
						"type": "string",
						"default": "",
						"required": false,
						"groupRequired": true
					},
					{
						"name": "alternative_id_country_code",
						"apiName": "alternative_id.country_code",
						"displayName": "Alternative ID Country Code",
						"description": "ISO 3166-1 alpha-2 country code (exactly 2 characters)",
						"validation": {
							"pattern": "^[A-Z]{2}$",
							"minLength": 2,
							"maxLength": 2
						},
						"type": "string",
						"default": "",
						"required": false
					},
					{
						"name": "address_street",
						"apiName": "address.street",
						"displayName": "Address Street",
						"description": "Full address (street, number, floor, etc.) - Latin characters only (max 255 characters)",
						"validation": {
							"pattern": "^[a-zA-Z0-9À-ÿ\\u0100-\\u017F\\u00B7\\s\\.,\\-\\/'ºª°:;\"()&#]+$",
							"minLength": 1,
							"maxLength": 255
						},
						"type": "string",
						"default": "",
						"placeholder": "Calle Mayor, 123",
						"required": false,
						"groupRequired": true
					},
					{
						"name": "address_number",
						"apiName": "address.number",
						"displayName": "Address Number",
						"description": "Street number (max 20 characters)",
						"validation": {
							"minLength": 1,
							"maxLength": 20
						},
						"type": "string",
						"default": "",
						"placeholder": "123",
						"required": false,
						"groupRequired": true
					},
					{
						"name": "address_floor",
						"apiName": "address.floor",
						"displayName": "Address Floor",
						"description": "Floor or level (max 10 characters)",
						"validation": {
							"maxLength": 10
						},
						"type": "string",
						"default": "",
						"placeholder": "2º A",
						"required": false
					},
					{
						"name": "address_door",
						"apiName": "address.door",
						"displayName": "Address Door",
						"description": "Door or apartment (max 10 characters)",
						"validation": {
							"maxLength": 10
						},
						"type": "string",
						"default": "",
						"placeholder": "A",
						"required": false
					},
					{
						"name": "address_postal_code",
						"apiName": "address.postal_code",
						"displayName": "Address Postal Code",
						"description": "Postal code (5 digits for Spain, free format for other countries) (max 20 characters)",
						"validation": {
							"minLength": 1,
							"maxLength": 20
						},
						"type": "string",
						"default": "",
						"placeholder": "28001",
						"required": false,
						"groupRequired": true
					},
					{
						"name": "address_city",
						"apiName": "address.city",
						"displayName": "Address City",
						"description": "City or town - Latin characters only (max 100 characters)",
						"validation": {
							"pattern": "^[a-zA-Z0-9À-ÿ\\u0100-\\u017F\\u00B7\\u2018\\u2019\\u0060\\u00B4\\s\\.,\\-\\/'ºª()]+$",
							"minLength": 1,
							"maxLength": 100
						},
						"type": "string",
						"default": "",
						"placeholder": "Madrid",
						"required": false,
						"groupRequired": true
					},
					{
						"name": "address_province",
						"apiName": "address.province",
						"displayName": "Address Province",
						"description": "Province or state - Latin characters only (max 100 characters)",
						"validation": {
							"pattern": "^[a-zA-Z0-9À-ÿ\\u0100-\\u017F\\u00B7\\u2018\\u2019\\u0060\\u00B4\\s\\.,\\-\\/'ºª]+$",
							"minLength": 1,
							"maxLength": 100
						},
						"type": "string",
						"default": "",
						"placeholder": "Madrid",
						"required": false,
						"groupRequired": true
					},
					{
						"name": "address_country",
						"apiName": "address.country",
						"displayName": "Address Country",
						"description": "Country - Latin characters only (max 100 characters)",
						"validation": {
							"pattern": "^[a-zA-Z0-9À-ÿ\\u0100-\\u017F\\u00B7\\u2018\\u2019\\u0060\\u00B4\\s\\.,\\-\\/'ºª]+$",
							"minLength": 1,
							"maxLength": 100
						},
						"type": "string",
						"default": "España",
						"placeholder": "España",
						"required": false,
						"groupRequired": true
					},
					{
						"name": "address_country_code",
						"apiName": "address.country_code",
						"displayName": "Address Country Code",
						"description": "ISO 3166-1 alpha-2 country code (exactly 2 characters)",
						"validation": {
							"pattern": "^[A-Z]{2}$",
							"minLength": 2,
							"maxLength": 2
						},
						"type": "string",
						"default": "ES",
						"placeholder": "ES",
						"required": false
					},
					{
						"name": "phone",
						"apiName": "phone",
						"displayName": "Phone",
						"description": "Phone number (min 9 characters, max 20 characters)",
						"validation": {
							"pattern": "^[+]?[0-9\\s\\-\\(\\)]+$",
							"minLength": 9,
							"maxLength": 20
						},
						"type": "string",
						"default": "",
						"placeholder": "+34 612 345 678"
					},
					{
						"name": "email",
						"apiName": "email",
						"displayName": "Email",
						"description": "Email address (minimum valid email is 5 chars, e.g (email address, min 5 characters, max 255 characters)",
						"validation": {
							"minLength": 5,
							"maxLength": 255,
							"format": "email"
						},
						"type": "string",
						"default": "",
						"placeholder": "user@example.com"
					}
				],
				"default": {}
			},
			{
				"name": "lines",
				"apiName": "lines",
				"displayName": "Lines",
				"type": "fixedCollection",
				"fields": [
					{
						"name": "description",
						"apiName": "description",
						"displayName": "Description",
						"description": "Format: max 500 characters",
						"required": true,
						"validation": {
							"minLength": 1,
							"maxLength": 500
						},
						"type": "string",
						"default": ""
					},
					{
						"name": "quantity",
						"apiName": "quantity",
						"displayName": "Quantity",
						"required": true,
						"type": "number",
						"default": 0
					},
					{
						"name": "unit",
						"apiName": "unit",
						"displayName": "Unit",
						"type": "string",
						"default": ""
					},
					{
						"name": "unit_price",
						"apiName": "unit_price",
						"displayName": "Unit Price",
						"description": "Unit price before taxes (between 0 (exclusive) and 999999.9999)",
						"required": true,
						"validation": {
							"minimum": 0,
							"maximum": 999999.9999,
							"exclusiveMinimum": true
						},
						"type": "number",
						"default": 0
					},
					{
						"name": "discount_percentage",
						"apiName": "discount_percentage",
						"displayName": "Discount Percentage",
						"type": "number",
						"default": 0
					},
					{
						"name": "main_tax_type",
						"apiName": "main_tax.type",
						"displayName": "Main Tax Type",
						"description": "Tax type by territory: - IVA: Iberian Peninsula and Balearic Islands (0%, 4%, 10%, 21%) - IGIC: Canary Islands (0%, 3%, 5%, 7%, 9.5%, 15%, 20%) - IPSI: Ceuta and Melilla (0.5%, 1%, 2%, 4%, 8%, 10%) - OTHER: Configurable 0%-100%",
						"type": "options",
						"options": [
							{
								"name": "IVA",
								"value": "IVA",
								"description": "Iberian Peninsula and Balearic Islands (0%, 4%, 10%, 21%)"
							},
							{
								"name": "IGIC",
								"value": "IGIC",
								"description": "Canary Islands (0%, 3%, 5%, 7%, 9.5%, 15%, 20%)"
							},
							{
								"name": "IPSI",
								"value": "IPSI",
								"description": "Ceuta and Melilla (0.5%, 1%, 2%, 4%, 8%, 10%)"
							},
							{
								"name": "OTHER",
								"value": "OTHER",
								"description": "Configurable 0%-100%"
							}
						],
						"default": "IVA",
						"required": false,
						"groupRequired": true
					},
					{
						"name": "main_tax_percentage_IVA",
						"apiName": "main_tax.percentage",
						"displayName": "Main Tax Percentage",
						"description": "Tax percentage (between 0 and 100) — rates allowed for IVA",
						"validation": {
							"minimum": 0,
							"maximum": 100
						},
						"type": "options",
						"default": 21,
						"required": false,
						"groupRequired": true,
						"options": [
							{
								"name": "0%",
								"value": 0
							},
							{
								"name": "4%",
								"value": 4
							},
							{
								"name": "10%",
								"value": 10
							},
							{
								"name": "21%",
								"value": 21
							}
						],
						"showWhen": {
							"field": "main_tax_type",
							"values": [
								"IVA"
							]
						}
					},
					{
						"name": "main_tax_percentage_IGIC",
						"apiName": "main_tax.percentage",
						"displayName": "Main Tax Percentage",
						"description": "Tax percentage (between 0 and 100) — rates allowed for IGIC",
						"validation": {
							"minimum": 0,
							"maximum": 100
						},
						"type": "options",
						"default": 0,
						"required": false,
						"groupRequired": true,
						"options": [
							{
								"name": "0%",
								"value": 0
							},
							{
								"name": "3%",
								"value": 3
							},
							{
								"name": "5%",
								"value": 5
							},
							{
								"name": "7%",
								"value": 7
							},
							{
								"name": "9.5%",
								"value": 9.5
							},
							{
								"name": "15%",
								"value": 15
							},
							{
								"name": "20%",
								"value": 20
							}
						],
						"showWhen": {
							"field": "main_tax_type",
							"values": [
								"IGIC"
							]
						}
					},
					{
						"name": "main_tax_percentage_IPSI",
						"apiName": "main_tax.percentage",
						"displayName": "Main Tax Percentage",
						"description": "Tax percentage (between 0 and 100) — rates allowed for IPSI",
						"validation": {
							"minimum": 0,
							"maximum": 100
						},
						"type": "options",
						"default": 0.5,
						"required": false,
						"groupRequired": true,
						"options": [
							{
								"name": "0.5%",
								"value": 0.5
							},
							{
								"name": "1%",
								"value": 1
							},
							{
								"name": "2%",
								"value": 2
							},
							{
								"name": "4%",
								"value": 4
							},
							{
								"name": "8%",
								"value": 8
							},
							{
								"name": "10%",
								"value": 10
							}
						],
						"showWhen": {
							"field": "main_tax_type",
							"values": [
								"IPSI"
							]
						}
					},
					{
						"name": "main_tax_percentage_OTHER",
						"apiName": "main_tax.percentage",
						"displayName": "Main Tax Percentage",
						"description": "Tax percentage (between 0 and 100)",
						"validation": {
							"minimum": 0,
							"maximum": 100
						},
						"type": "number",
						"default": 0,
						"required": false,
						"groupRequired": true,
						"showWhen": {
							"field": "main_tax_type",
							"values": [
								"OTHER"
							]
						}
					},
					{
						"name": "main_tax_regime_key",
						"apiName": "main_tax.regime_key",
						"displayName": "Main Tax Regime Key",
						"description": "Regime key according to VeriFactu regulations: - 01: General regime operation - 02: Export - 03: Used goods, art, antiques - 04: Investment gold - 05: Travel agencies - 06: Group of entities - 07: Cash basis - 08: IPSI/IVA/IGIC operations - 09: Mediating agencies - 10: Third-party collections - 1...",
						"type": "options",
						"options": [
							{
								"name": "01",
								"value": "01",
								"description": "General regime operation"
							},
							{
								"name": "02",
								"value": "02",
								"description": "Export"
							},
							{
								"name": "03",
								"value": "03",
								"description": "Used goods, art, antiques"
							},
							{
								"name": "04",
								"value": "04",
								"description": "Investment gold"
							},
							{
								"name": "05",
								"value": "05",
								"description": "Travel agencies"
							},
							{
								"name": "06",
								"value": "06",
								"description": "Group of entities"
							},
							{
								"name": "07",
								"value": "07",
								"description": "Cash basis"
							},
							{
								"name": "08",
								"value": "08",
								"description": "IPSI/IVA/IGIC operations"
							},
							{
								"name": "09",
								"value": "09",
								"description": "Mediating agencies"
							},
							{
								"name": "10",
								"value": "10",
								"description": "Third-party collections"
							},
							{
								"name": "11",
								"value": "11",
								"description": "Local rental"
							},
							{
								"name": "14",
								"value": "14",
								"description": "VAT pending in certifications"
							},
							{
								"name": "15",
								"value": "15",
								"description": "VAT pending successive tract"
							},
							{
								"name": "17",
								"value": "17",
								"description": "OSS and IOSS"
							},
							{
								"name": "18",
								"value": "18",
								"description": "Equivalence surcharge"
							},
							{
								"name": "19",
								"value": "19",
								"description": "REAGYP"
							},
							{
								"name": "20",
								"value": "20",
								"description": "Simplified regime"
							}
						],
						"default": "01",
						"required": false
					},
					{
						"name": "equivalence_surcharge_rate",
						"apiName": "equivalence_surcharge_rate",
						"displayName": "Equivalence Surcharge Rate",
						"description": "Equivalence surcharge percentage in decimal format",
						"type": "options",
						"options": [
							{
								"name": "— Not set —",
								"value": ""
							},
							{
								"name": "0",
								"value": 0
							},
							{
								"name": "0 5",
								"value": 0.5
							},
							{
								"name": "1 4",
								"value": 1.4
							},
							{
								"name": "5 2",
								"value": 5.2
							}
						],
						"default": ""
					},
					{
						"name": "irpf_rate",
						"apiName": "irpf_rate",
						"displayName": "IRPF Rate",
						"description": "Personal income tax/withholding percentage in integer format",
						"type": "options",
						"options": [
							{
								"name": "— Not set —",
								"value": ""
							},
							{
								"name": "0",
								"value": 0
							},
							{
								"name": "1",
								"value": 1
							},
							{
								"name": "2",
								"value": 2
							},
							{
								"name": "7",
								"value": 7
							},
							{
								"name": "15",
								"value": 15
							},
							{
								"name": "19",
								"value": 19
							},
							{
								"name": "24",
								"value": 24
							}
						],
						"default": ""
					},
					{
						"name": "exemption_reason",
						"apiName": "exemption_reason",
						"displayName": "Exemption Reason",
						"description": "Tax exemption reason code per Spanish VAT Law (Ley 37/1992 LIVA)",
						"type": "options",
						"options": [
							{
								"name": "— Not set —",
								"value": ""
							},
							{
								"name": "EXENTA ART 20",
								"value": "EXENTA_ART_20"
							},
							{
								"name": "EXENTA ART 21 24",
								"value": "EXENTA_ART_21_24"
							},
							{
								"name": "EXENTA ART 25",
								"value": "EXENTA_ART_25"
							},
							{
								"name": "EXENTA ART 26",
								"value": "EXENTA_ART_26"
							},
							{
								"name": "EXENTA ART 140",
								"value": "EXENTA_ART_140"
							},
							{
								"name": "NO SUJETA ART 7 9",
								"value": "NO_SUJETA_ART_7_9"
							},
							{
								"name": "ISP ART 84 2 A",
								"value": "ISP_ART_84_2_A"
							},
							{
								"name": "ISP ART 84 2 E",
								"value": "ISP_ART_84_2_E"
							},
							{
								"name": "ISP ART 84 2 F",
								"value": "ISP_ART_84_2_F"
							},
							{
								"name": "REGIMEN ART 129",
								"value": "REGIMEN_ART_129"
							},
							{
								"name": "REGIMEN ART 135",
								"value": "REGIMEN_ART_135"
							},
							{
								"name": "REGIMEN ART 141",
								"value": "REGIMEN_ART_141"
							},
							{
								"name": "REGIMEN ART 154",
								"value": "REGIMEN_ART_154"
							},
							{
								"name": "REGIMEN ART 163 DECIES",
								"value": "REGIMEN_ART_163_DECIES"
							},
							{
								"name": "OTRO",
								"value": "OTRO"
							}
						],
						"default": ""
					},
					{
						"name": "exemption_reason_text",
						"apiName": "exemption_reason_text",
						"displayName": "Exemption Reason Text",
						"description": "Format: max 500 characters",
						"validation": {
							"maxLength": 500
						},
						"type": "string",
						"default": ""
					}
				],
				"multipleValues": true,
				"default": {}
			},
			{
				"name": "payment_info",
				"apiName": "payment_info",
				"displayName": "Payment Info",
				"type": "fixedCollection",
				"fields": [
					{
						"name": "method",
						"apiName": "method",
						"displayName": "Method",
						"description": "Preferred payment method",
						"type": "options",
						"options": [
							{
								"name": "NONE",
								"value": "NONE"
							},
							{
								"name": "BANK TRANSFER",
								"value": "BANK_TRANSFER"
							},
							{
								"name": "CARD",
								"value": "CARD"
							},
							{
								"name": "CASH",
								"value": "CASH"
							},
							{
								"name": "CHECK",
								"value": "CHECK"
							},
							{
								"name": "DIRECT DEBIT",
								"value": "DIRECT_DEBIT"
							},
							{
								"name": "OTHER",
								"value": "OTHER"
							}
						],
						"default": "BANK_TRANSFER"
					},
					{
						"name": "iban",
						"apiName": "iban",
						"displayName": "IBAN",
						"description": "IBAN (International Bank Account Number) (min 15 characters, max 34 characters)",
						"validation": {
							"pattern": "^[A-Z]{2}\\d{2}[A-Z0-9]{1,30}$",
							"minLength": 15,
							"maxLength": 34
						},
						"type": "string",
						"default": "",
						"placeholder": "ES1234567890123456789012"
					},
					{
						"name": "swift",
						"apiName": "swift",
						"displayName": "SWIFT",
						"description": "SWIFT/BIC code (min 8 characters, max 11 characters)",
						"validation": {
							"pattern": "^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$",
							"minLength": 8,
							"maxLength": 11
						},
						"type": "string",
						"default": "",
						"placeholder": "ABCDESMMXXX"
					},
					{
						"name": "payment_term_days",
						"apiName": "payment_term_days",
						"displayName": "Payment Term Days",
						"description": "Payment term in days (optional, default 30) (between 0 and 365)",
						"validation": {
							"minimum": 0,
							"maximum": 365
						},
						"type": "number",
						"default": 30,
						"numberPrecision": 0
					}
				],
				"default": {}
			},
			{
				"name": "notes",
				"apiName": "notes",
				"displayName": "Notes",
				"type": "string",
				"default": ""
			}
		],
		"filters": [],
		"optionalCollectionName": "updateFields",
		"queryParamNames": [],
		"paginated": false,
		"isList": false,
		"listKey": ""
	},
	{
		"resource": "invoice",
		"operation": "createCorrective",
		"displayName": "Create Corrective",
		"action": "Create corrective invoice",
		"description": "Creates a corrective invoice to correct or void an issued invoice",
		"operationId": "createCorrectiveInvoice",
		"method": "POST",
		"path": "/v1/invoices/{invoice_id}/corrective",
		"pathParams": [
			{
				"name": "invoiceId",
				"apiName": "invoice_id",
				"displayName": "Invoice ID",
				"description": "Invoice ID to rectify",
				"required": true,
				"validation": {
					"format": "uuid"
				},
				"type": "string",
				"default": "",
				"placeholder": "550e8400-e29b-41d4-a716-446655440000"
			}
		],
		"requiredFields": [
			{
				"name": "rectification_type",
				"apiName": "rectification_type",
				"displayName": "Rectification Type",
				"description": "Type of rectification applied to a corrective invoice: - TOTAL: Completely cancels the original invoice (status → VOIDED) - PARTIAL: Partially corrects the original invoice (status → RECTIFIED)",
				"required": true,
				"type": "options",
				"options": [
					{
						"name": "TOTAL",
						"value": "TOTAL",
						"description": "Completely cancels the original invoice (status → VOIDED)"
					},
					{
						"name": "PARTIAL",
						"value": "PARTIAL",
						"description": "Partially corrects the original invoice (status → RECTIFIED)"
					}
				],
				"default": "TOTAL"
			},
			{
				"name": "rectification_code",
				"apiName": "rectification_code",
				"displayName": "Rectification Code",
				"description": "Rectification codes according to VeriFactu regulations (AEAT): - R1: Error founded in law and Art",
				"required": true,
				"type": "options",
				"options": [
					{
						"name": "R1",
						"value": "R1",
						"description": "Error founded in law and Art. 80 One, Two and Six LIVA"
					},
					{
						"name": "R2",
						"value": "R2",
						"description": "Article 80 Three LIVA (Bankruptcy proceedings)"
					},
					{
						"name": "R3",
						"value": "R3",
						"description": "Article 80 Four LIVA (Uncollectable debts)"
					},
					{
						"name": "R4",
						"value": "R4",
						"description": "Other causes"
					},
					{
						"name": "R5",
						"value": "R5",
						"description": "Simplified invoices (Art. 80 One and Two LIVA) - ONLY for simplified invoices"
					}
				],
				"default": "R1"
			},
			{
				"name": "reason",
				"apiName": "reason",
				"displayName": "Reason",
				"description": "Detailed reason for rectification (minimum 10 characters) (min 10 characters, max 1000 characters)",
				"required": true,
				"validation": {
					"minLength": 10,
					"maxLength": 1000
				},
				"type": "string",
				"default": "",
				"placeholder": "Amount correction due to calculation error in hours worked during the project"
			}
		],
		"optionalFields": [
			{
				"name": "lines",
				"apiName": "lines",
				"displayName": "Lines",
				"description": "**TOTAL**: Optional (if not sent, original invoice lines are copied negated) **PARTIAL**: REQUIRED (adjustment lines with positive or negative amounts)",
				"type": "fixedCollection",
				"fields": [
					{
						"name": "description",
						"apiName": "description",
						"displayName": "Description",
						"description": "Concept description (max 500 characters)",
						"required": true,
						"validation": {
							"minLength": 1,
							"maxLength": 500
						},
						"type": "string",
						"default": "",
						"placeholder": "Adjustment for incorrectly invoiced hours"
					},
					{
						"name": "quantity",
						"apiName": "quantity",
						"displayName": "Quantity",
						"description": "Quantity (can be negative for corrective invoices)",
						"required": true,
						"type": "number",
						"default": 0
					},
					{
						"name": "unit",
						"apiName": "unit",
						"displayName": "Unit",
						"type": "string",
						"default": "",
						"placeholder": "hours"
					},
					{
						"name": "unit_price",
						"apiName": "unit_price",
						"displayName": "Unit Price",
						"description": "Unit price before taxes (can be negative in corrective invoices) (max 999999.9999)",
						"required": true,
						"validation": {
							"maximum": 999999.9999
						},
						"type": "number",
						"default": 0
					},
					{
						"name": "discount_percentage",
						"apiName": "discount_percentage",
						"displayName": "Discount Percentage",
						"description": "Format: between 0 and 100",
						"validation": {
							"minimum": 0,
							"maximum": 100
						},
						"type": "number",
						"default": 0
					},
					{
						"name": "main_tax_type",
						"apiName": "main_tax.type",
						"displayName": "Main Tax Type",
						"description": "Tax type by territory: - IVA: Iberian Peninsula and Balearic Islands (0%, 4%, 10%, 21%) - IGIC: Canary Islands (0%, 3%, 5%, 7%, 9.5%, 15%, 20%) - IPSI: Ceuta and Melilla (0.5%, 1%, 2%, 4%, 8%, 10%) - OTHER: Configurable 0%-100%",
						"type": "options",
						"options": [
							{
								"name": "IVA",
								"value": "IVA",
								"description": "Iberian Peninsula and Balearic Islands (0%, 4%, 10%, 21%)"
							},
							{
								"name": "IGIC",
								"value": "IGIC",
								"description": "Canary Islands (0%, 3%, 5%, 7%, 9.5%, 15%, 20%)"
							},
							{
								"name": "IPSI",
								"value": "IPSI",
								"description": "Ceuta and Melilla (0.5%, 1%, 2%, 4%, 8%, 10%)"
							},
							{
								"name": "OTHER",
								"value": "OTHER",
								"description": "Configurable 0%-100%"
							}
						],
						"default": "IVA",
						"required": false,
						"groupRequired": true
					},
					{
						"name": "main_tax_percentage_IVA",
						"apiName": "main_tax.percentage",
						"displayName": "Main Tax Percentage",
						"description": "Tax percentage (between 0 and 100) — rates allowed for IVA",
						"validation": {
							"minimum": 0,
							"maximum": 100
						},
						"type": "options",
						"default": 21,
						"required": false,
						"groupRequired": true,
						"options": [
							{
								"name": "0%",
								"value": 0
							},
							{
								"name": "4%",
								"value": 4
							},
							{
								"name": "10%",
								"value": 10
							},
							{
								"name": "21%",
								"value": 21
							}
						],
						"showWhen": {
							"field": "main_tax_type",
							"values": [
								"IVA"
							]
						}
					},
					{
						"name": "main_tax_percentage_IGIC",
						"apiName": "main_tax.percentage",
						"displayName": "Main Tax Percentage",
						"description": "Tax percentage (between 0 and 100) — rates allowed for IGIC",
						"validation": {
							"minimum": 0,
							"maximum": 100
						},
						"type": "options",
						"default": 0,
						"required": false,
						"groupRequired": true,
						"options": [
							{
								"name": "0%",
								"value": 0
							},
							{
								"name": "3%",
								"value": 3
							},
							{
								"name": "5%",
								"value": 5
							},
							{
								"name": "7%",
								"value": 7
							},
							{
								"name": "9.5%",
								"value": 9.5
							},
							{
								"name": "15%",
								"value": 15
							},
							{
								"name": "20%",
								"value": 20
							}
						],
						"showWhen": {
							"field": "main_tax_type",
							"values": [
								"IGIC"
							]
						}
					},
					{
						"name": "main_tax_percentage_IPSI",
						"apiName": "main_tax.percentage",
						"displayName": "Main Tax Percentage",
						"description": "Tax percentage (between 0 and 100) — rates allowed for IPSI",
						"validation": {
							"minimum": 0,
							"maximum": 100
						},
						"type": "options",
						"default": 0.5,
						"required": false,
						"groupRequired": true,
						"options": [
							{
								"name": "0.5%",
								"value": 0.5
							},
							{
								"name": "1%",
								"value": 1
							},
							{
								"name": "2%",
								"value": 2
							},
							{
								"name": "4%",
								"value": 4
							},
							{
								"name": "8%",
								"value": 8
							},
							{
								"name": "10%",
								"value": 10
							}
						],
						"showWhen": {
							"field": "main_tax_type",
							"values": [
								"IPSI"
							]
						}
					},
					{
						"name": "main_tax_percentage_OTHER",
						"apiName": "main_tax.percentage",
						"displayName": "Main Tax Percentage",
						"description": "Tax percentage (between 0 and 100)",
						"validation": {
							"minimum": 0,
							"maximum": 100
						},
						"type": "number",
						"default": 0,
						"required": false,
						"groupRequired": true,
						"showWhen": {
							"field": "main_tax_type",
							"values": [
								"OTHER"
							]
						}
					},
					{
						"name": "main_tax_regime_key",
						"apiName": "main_tax.regime_key",
						"displayName": "Main Tax Regime Key",
						"description": "Regime key according to VeriFactu regulations: - 01: General regime operation - 02: Export - 03: Used goods, art, antiques - 04: Investment gold - 05: Travel agencies - 06: Group of entities - 07: Cash basis - 08: IPSI/IVA/IGIC operations - 09: Mediating agencies - 10: Third-party collections - 1...",
						"type": "options",
						"options": [
							{
								"name": "01",
								"value": "01",
								"description": "General regime operation"
							},
							{
								"name": "02",
								"value": "02",
								"description": "Export"
							},
							{
								"name": "03",
								"value": "03",
								"description": "Used goods, art, antiques"
							},
							{
								"name": "04",
								"value": "04",
								"description": "Investment gold"
							},
							{
								"name": "05",
								"value": "05",
								"description": "Travel agencies"
							},
							{
								"name": "06",
								"value": "06",
								"description": "Group of entities"
							},
							{
								"name": "07",
								"value": "07",
								"description": "Cash basis"
							},
							{
								"name": "08",
								"value": "08",
								"description": "IPSI/IVA/IGIC operations"
							},
							{
								"name": "09",
								"value": "09",
								"description": "Mediating agencies"
							},
							{
								"name": "10",
								"value": "10",
								"description": "Third-party collections"
							},
							{
								"name": "11",
								"value": "11",
								"description": "Local rental"
							},
							{
								"name": "14",
								"value": "14",
								"description": "VAT pending in certifications"
							},
							{
								"name": "15",
								"value": "15",
								"description": "VAT pending successive tract"
							},
							{
								"name": "17",
								"value": "17",
								"description": "OSS and IOSS"
							},
							{
								"name": "18",
								"value": "18",
								"description": "Equivalence surcharge"
							},
							{
								"name": "19",
								"value": "19",
								"description": "REAGYP"
							},
							{
								"name": "20",
								"value": "20",
								"description": "Simplified regime"
							}
						],
						"default": "01",
						"required": false
					},
					{
						"name": "equivalence_surcharge_rate",
						"apiName": "equivalence_surcharge_rate",
						"displayName": "Equivalence Surcharge Rate",
						"description": "Equivalence surcharge percentage in decimal format",
						"type": "options",
						"options": [
							{
								"name": "— Not set —",
								"value": ""
							},
							{
								"name": "0",
								"value": 0
							},
							{
								"name": "0 5",
								"value": 0.5
							},
							{
								"name": "1 4",
								"value": 1.4
							},
							{
								"name": "5 2",
								"value": 5.2
							}
						],
						"default": ""
					},
					{
						"name": "irpf_rate",
						"apiName": "irpf_rate",
						"displayName": "IRPF Rate",
						"description": "Personal income tax/withholding percentage in integer format",
						"type": "options",
						"options": [
							{
								"name": "— Not set —",
								"value": ""
							},
							{
								"name": "0",
								"value": 0
							},
							{
								"name": "1",
								"value": 1
							},
							{
								"name": "2",
								"value": 2
							},
							{
								"name": "7",
								"value": 7
							},
							{
								"name": "15",
								"value": 15
							},
							{
								"name": "19",
								"value": 19
							},
							{
								"name": "24",
								"value": 24
							}
						],
						"default": ""
					},
					{
						"name": "exemption_reason",
						"apiName": "exemption_reason",
						"displayName": "Exemption Reason",
						"description": "Tax exemption reason code per Spanish VAT Law (Ley 37/1992 LIVA)",
						"type": "options",
						"options": [
							{
								"name": "— Not set —",
								"value": ""
							},
							{
								"name": "EXENTA ART 20",
								"value": "EXENTA_ART_20"
							},
							{
								"name": "EXENTA ART 21 24",
								"value": "EXENTA_ART_21_24"
							},
							{
								"name": "EXENTA ART 25",
								"value": "EXENTA_ART_25"
							},
							{
								"name": "EXENTA ART 26",
								"value": "EXENTA_ART_26"
							},
							{
								"name": "EXENTA ART 140",
								"value": "EXENTA_ART_140"
							},
							{
								"name": "NO SUJETA ART 7 9",
								"value": "NO_SUJETA_ART_7_9"
							},
							{
								"name": "ISP ART 84 2 A",
								"value": "ISP_ART_84_2_A"
							},
							{
								"name": "ISP ART 84 2 E",
								"value": "ISP_ART_84_2_E"
							},
							{
								"name": "ISP ART 84 2 F",
								"value": "ISP_ART_84_2_F"
							},
							{
								"name": "REGIMEN ART 129",
								"value": "REGIMEN_ART_129"
							},
							{
								"name": "REGIMEN ART 135",
								"value": "REGIMEN_ART_135"
							},
							{
								"name": "REGIMEN ART 141",
								"value": "REGIMEN_ART_141"
							},
							{
								"name": "REGIMEN ART 154",
								"value": "REGIMEN_ART_154"
							},
							{
								"name": "REGIMEN ART 163 DECIES",
								"value": "REGIMEN_ART_163_DECIES"
							},
							{
								"name": "OTRO",
								"value": "OTRO"
							}
						],
						"default": ""
					},
					{
						"name": "exemption_reason_text",
						"apiName": "exemption_reason_text",
						"displayName": "Exemption Reason Text",
						"description": "Format: max 500 characters",
						"validation": {
							"maxLength": 500
						},
						"type": "string",
						"default": ""
					}
				],
				"multipleValues": true,
				"default": {}
			},
			{
				"name": "notes",
				"apiName": "notes",
				"displayName": "Notes",
				"description": "Additional observations about the rectification (max 1000 characters)",
				"validation": {
					"maxLength": 1000
				},
				"type": "string",
				"default": "",
				"placeholder": "Rectification requested by the customer due to quantity error"
			},
			{
				"name": "series_id",
				"apiName": "series_id",
				"displayName": "Series ID",
				"description": "Series for the corrective invoice (optional, if not specified uses the original invoice's series)",
				"validation": {
					"format": "uuid"
				},
				"type": "options",
				"loadOptionsMethod": "getSeries",
				"default": ""
			},
			{
				"name": "options",
				"apiName": "options",
				"displayName": "Options",
				"description": "Controls how the invoice is processed after creation",
				"type": "fixedCollection",
				"fields": [
					{
						"name": "verifactu_enabled",
						"apiName": "verifactu_enabled",
						"displayName": "Verifactu Enabled",
						"description": "Whether VeriFactu information should be generated for this invoice",
						"type": "boolean",
						"default": false
					},
					{
						"name": "issue_directly",
						"apiName": "issue_directly",
						"displayName": "Issue Directly",
						"description": "If `true`, creates the invoice directly as **ISSUED** with a definitive number and PDF",
						"type": "boolean",
						"default": false
					},
					{
						"name": "wait_for_pdf",
						"apiName": "wait_for_pdf",
						"displayName": "Wait For Pdf",
						"description": "Only applies when `issue_directly` is `true`",
						"type": "boolean",
						"default": false
					},
					{
						"name": "send_automatically",
						"apiName": "send_automatically",
						"displayName": "Send Automatically",
						"description": "Only applies when `issue_directly` is `true`",
						"type": "boolean",
						"default": false
					},
					{
						"name": "email_config_recipients",
						"apiName": "email_config.recipients",
						"displayName": "Email Config Recipients",
						"description": "List of recipient emails (at least 1 required) (email address, min 5 characters, max 255 characters)",
						"validation": {
							"minLength": 5,
							"maxLength": 255,
							"format": "email",
							"minItems": 1
						},
						"type": "string",
						"multipleValues": true,
						"default": [],
						"required": false,
						"groupRequired": true
					},
					{
						"name": "email_config_cc",
						"apiName": "email_config.cc",
						"displayName": "Email Config CC",
						"description": "List of CC emails (optional) (email address, min 5 characters, max 255 characters)",
						"type": "string",
						"validation": {
							"minLength": 5,
							"maxLength": 255,
							"format": "email"
						},
						"multipleValues": true,
						"default": [],
						"required": false
					},
					{
						"name": "email_config_subject",
						"apiName": "email_config.subject",
						"displayName": "Email Config Subject",
						"description": "Custom email subject (optional, if not specified uses a default) (max 200 characters)",
						"validation": {
							"minLength": 1,
							"maxLength": 200
						},
						"type": "string",
						"default": "",
						"placeholder": "Invoice 2025/0001 - Web development services",
						"required": false
					},
					{
						"name": "email_config_message",
						"apiName": "email_config.message",
						"displayName": "Email Config Message",
						"description": "Custom message (optional, added to email body) (max 2000 characters)",
						"validation": {
							"minLength": 1,
							"maxLength": 2000
						},
						"type": "string",
						"default": "",
						"placeholder": "Dear customer, please find attached the invoice for the services provided. Thank you for your trust.",
						"required": false
					}
				],
				"default": {}
			}
		],
		"filters": [],
		"optionalCollectionName": "additionalFields",
		"queryParamNames": [],
		"paginated": false,
		"isList": false,
		"listKey": ""
	},
	{
		"resource": "invoice",
		"operation": "get",
		"displayName": "Get",
		"action": "Get invoice by ID",
		"description": "Retrieves complete details of a specific invoice",
		"operationId": "getInvoice",
		"method": "GET",
		"path": "/v1/invoices/{invoice_id}",
		"pathParams": [
			{
				"name": "invoiceId",
				"apiName": "invoice_id",
				"displayName": "Invoice ID",
				"description": "Invoice ID",
				"required": true,
				"validation": {
					"format": "uuid"
				},
				"type": "string",
				"default": "",
				"placeholder": "550e8400-e29b-41d4-a716-446655440000"
			}
		],
		"requiredFields": [],
		"optionalFields": [],
		"filters": [],
		"optionalCollectionName": "options",
		"queryParamNames": [],
		"paginated": false,
		"isList": false,
		"listKey": ""
	},
	{
		"resource": "invoice",
		"operation": "delete",
		"displayName": "Delete",
		"action": "Delete invoice",
		"description": "Deletes (marks as deleted) an invoice",
		"operationId": "deleteInvoice",
		"method": "DELETE",
		"path": "/v1/invoices/{invoice_id}",
		"pathParams": [
			{
				"name": "invoiceId",
				"apiName": "invoice_id",
				"displayName": "Invoice ID",
				"description": "Invoice ID",
				"required": true,
				"validation": {
					"format": "uuid"
				},
				"type": "string",
				"default": "",
				"placeholder": "550e8400-e29b-41d4-a716-446655440000"
			}
		],
		"requiredFields": [],
		"optionalFields": [],
		"filters": [],
		"optionalCollectionName": "options",
		"queryParamNames": [],
		"paginated": false,
		"isList": false,
		"listKey": ""
	},
	{
		"resource": "invoice",
		"operation": "issue",
		"displayName": "Issue",
		"action": "Issue invoice (DRAFT → ISSUED)",
		"description": "Finalizes a draft invoice and marks it as issued",
		"operationId": "issueInvoice",
		"method": "POST",
		"path": "/v1/invoices/{invoice_id}/issue",
		"pathParams": [
			{
				"name": "invoiceId",
				"apiName": "invoice_id",
				"displayName": "Invoice ID",
				"description": "Invoice ID",
				"required": true,
				"validation": {
					"format": "uuid"
				},
				"type": "string",
				"default": "",
				"placeholder": "550e8400-e29b-41d4-a716-446655440000"
			}
		],
		"requiredFields": [],
		"optionalFields": [],
		"filters": [
			{
				"name": "wait_for_pdf",
				"apiName": "wait_for_pdf",
				"displayName": "Wait For Pdf",
				"description": "If `true`, waits for PDF generation and returns the URL in the response",
				"type": "boolean",
				"default": false
			}
		],
		"optionalCollectionName": "options",
		"queryParamNames": [
			"wait_for_pdf"
		],
		"paginated": false,
		"isList": false,
		"listKey": ""
	},
	{
		"resource": "invoice",
		"operation": "duplicate",
		"displayName": "Duplicate",
		"action": "Duplicate invoice as draft",
		"description": "Creates a copy of an existing invoice as a new draft",
		"operationId": "duplicateInvoice",
		"method": "POST",
		"path": "/v1/invoices/{invoice_id}/duplicate",
		"pathParams": [
			{
				"name": "invoiceId",
				"apiName": "invoice_id",
				"displayName": "Invoice ID",
				"description": "ID of the invoice to duplicate",
				"required": true,
				"validation": {
					"format": "uuid"
				},
				"type": "string",
				"default": "",
				"placeholder": "550e8400-e29b-41d4-a716-446655440000"
			}
		],
		"requiredFields": [],
		"optionalFields": [
			{
				"name": "series_id",
				"apiName": "series_id",
				"displayName": "Series ID",
				"description": "Series ID for the new invoice",
				"validation": {
					"format": "uuid"
				},
				"type": "options",
				"loadOptionsMethod": "getSeries",
				"default": ""
			},
			{
				"name": "notes",
				"apiName": "notes",
				"displayName": "Notes",
				"description": "Observations for the new invoice (max 2000 characters)",
				"validation": {
					"maxLength": 2000
				},
				"type": "string",
				"default": ""
			}
		],
		"filters": [],
		"optionalCollectionName": "options",
		"queryParamNames": [],
		"paginated": false,
		"isList": false,
		"listKey": ""
	},
	{
		"resource": "invoice",
		"operation": "send",
		"displayName": "Send",
		"action": "Send invoice by email",
		"description": "Sends the invoice by email to the customer",
		"operationId": "sendInvoiceEmail",
		"method": "POST",
		"path": "/v1/invoices/{invoice_id}/send",
		"pathParams": [
			{
				"name": "invoiceId",
				"apiName": "invoice_id",
				"displayName": "Invoice ID",
				"description": "Invoice ID",
				"required": true,
				"validation": {
					"format": "uuid"
				},
				"type": "string",
				"default": "",
				"placeholder": "550e8400-e29b-41d4-a716-446655440000"
			}
		],
		"requiredFields": [],
		"optionalFields": [
			{
				"name": "recipients",
				"apiName": "recipients",
				"displayName": "Recipients",
				"description": "If not specified, uses the customer's email (email address, min 5 characters, max 255 characters)",
				"type": "string",
				"validation": {
					"minLength": 5,
					"maxLength": 255,
					"format": "email"
				},
				"multipleValues": true,
				"default": []
			},
			{
				"name": "cc",
				"apiName": "cc",
				"displayName": "CC",
				"description": "Format: email address, min 5 characters, max 255 characters",
				"type": "string",
				"validation": {
					"minLength": 5,
					"maxLength": 255,
					"format": "email"
				},
				"multipleValues": true,
				"default": []
			},
			{
				"name": "subject",
				"apiName": "subject",
				"displayName": "Subject",
				"description": "Email subject (optional, if not specified uses a default) (max 200 characters)",
				"validation": {
					"minLength": 1,
					"maxLength": 200
				},
				"type": "string",
				"default": ""
			},
			{
				"name": "message",
				"apiName": "message",
				"displayName": "Message",
				"description": "Custom message (optional, added before standard message) (max 2000 characters)",
				"validation": {
					"minLength": 1,
					"maxLength": 2000
				},
				"type": "string",
				"default": ""
			},
			{
				"name": "attach_pdf",
				"apiName": "attach_pdf",
				"displayName": "Attach Pdf",
				"type": "boolean",
				"default": true
			},
			{
				"name": "language",
				"apiName": "language",
				"displayName": "Language",
				"description": "Supported languages",
				"type": "options",
				"options": [
					{
						"name": "Es",
						"value": "es"
					},
					{
						"name": "En",
						"value": "en"
					},
					{
						"name": "Ca",
						"value": "ca"
					}
				],
				"default": "es"
			}
		],
		"filters": [],
		"optionalCollectionName": "options",
		"queryParamNames": [],
		"paginated": false,
		"isList": false,
		"listKey": ""
	},
	{
		"resource": "invoice",
		"operation": "markPaid",
		"displayName": "Mark Paid",
		"action": "Mark invoice as paid",
		"description": "Marks an invoice as paid",
		"operationId": "markInvoicePaid",
		"method": "POST",
		"path": "/v1/invoices/{invoice_id}/mark-paid",
		"pathParams": [
			{
				"name": "invoiceId",
				"apiName": "invoice_id",
				"displayName": "Invoice ID",
				"description": "Invoice ID",
				"required": true,
				"validation": {
					"format": "uuid"
				},
				"type": "string",
				"default": "",
				"placeholder": "550e8400-e29b-41d4-a716-446655440000"
			}
		],
		"requiredFields": [],
		"optionalFields": [
			{
				"name": "payment_date",
				"apiName": "payment_date",
				"displayName": "Payment Date",
				"description": "Payment date (defaults to today) (YYYY-MM-DD)",
				"validation": {
					"format": "date"
				},
				"type": "string",
				"default": "",
				"placeholder": "2025-01-15"
			},
			{
				"name": "payment_method",
				"apiName": "payment_method",
				"displayName": "Payment Method",
				"description": "Payment details object (not a string enum)",
				"type": "fixedCollection",
				"fields": [
					{
						"name": "method",
						"apiName": "method",
						"displayName": "Method",
						"description": "Preferred payment method",
						"type": "options",
						"options": [
							{
								"name": "NONE",
								"value": "NONE"
							},
							{
								"name": "BANK TRANSFER",
								"value": "BANK_TRANSFER"
							},
							{
								"name": "CARD",
								"value": "CARD"
							},
							{
								"name": "CASH",
								"value": "CASH"
							},
							{
								"name": "CHECK",
								"value": "CHECK"
							},
							{
								"name": "DIRECT DEBIT",
								"value": "DIRECT_DEBIT"
							},
							{
								"name": "OTHER",
								"value": "OTHER"
							}
						],
						"default": "BANK_TRANSFER"
					},
					{
						"name": "iban",
						"apiName": "iban",
						"displayName": "IBAN",
						"description": "IBAN (International Bank Account Number) (min 15 characters, max 34 characters)",
						"validation": {
							"pattern": "^[A-Z]{2}\\d{2}[A-Z0-9]{1,30}$",
							"minLength": 15,
							"maxLength": 34
						},
						"type": "string",
						"default": "",
						"placeholder": "ES1234567890123456789012"
					},
					{
						"name": "swift",
						"apiName": "swift",
						"displayName": "SWIFT",
						"description": "SWIFT/BIC code (min 8 characters, max 11 characters)",
						"validation": {
							"pattern": "^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$",
							"minLength": 8,
							"maxLength": 11
						},
						"type": "string",
						"default": "",
						"placeholder": "ABCDESMMXXX"
					},
					{
						"name": "payment_term_days",
						"apiName": "payment_term_days",
						"displayName": "Payment Term Days",
						"description": "Payment term in days (optional, default 30) (between 0 and 365)",
						"validation": {
							"minimum": 0,
							"maximum": 365
						},
						"type": "number",
						"default": 30,
						"numberPrecision": 0
					}
				],
				"default": {}
			}
		],
		"filters": [],
		"optionalCollectionName": "options",
		"queryParamNames": [],
		"paginated": false,
		"isList": false,
		"listKey": ""
	},
	{
		"resource": "invoice",
		"operation": "markSent",
		"displayName": "Mark Sent",
		"action": "Mark invoice as sent",
		"description": "Marks an invoice as sent manually",
		"operationId": "markInvoiceSent",
		"method": "POST",
		"path": "/v1/invoices/{invoice_id}/mark-sent",
		"pathParams": [
			{
				"name": "invoiceId",
				"apiName": "invoice_id",
				"displayName": "Invoice ID",
				"description": "Invoice ID",
				"required": true,
				"validation": {
					"format": "uuid"
				},
				"type": "string",
				"default": "",
				"placeholder": "550e8400-e29b-41d4-a716-446655440000"
			}
		],
		"requiredFields": [],
		"optionalFields": [
			{
				"name": "sent_at",
				"apiName": "sent_at",
				"displayName": "Sent At",
				"description": "Custom timestamp for when the invoice was sent (ISO 8601 date-time)",
				"validation": {
					"format": "date-time"
				},
				"type": "string",
				"default": "",
				"placeholder": "2025-01-29T18:45:00Z"
			}
		],
		"filters": [],
		"optionalCollectionName": "options",
		"queryParamNames": [],
		"paginated": false,
		"isList": false,
		"listKey": ""
	},
	{
		"resource": "invoice",
		"operation": "revertToIssued",
		"displayName": "Revert To Issued",
		"action": "Revert invoice to issued status",
		"description": "Reverts an invoice from SENT to ISSUED status",
		"operationId": "revertInvoiceToIssued",
		"method": "POST",
		"path": "/v1/invoices/{invoice_id}/revert-to-issued",
		"pathParams": [
			{
				"name": "invoiceId",
				"apiName": "invoice_id",
				"displayName": "Invoice ID",
				"description": "Invoice ID",
				"required": true,
				"validation": {
					"format": "uuid"
				},
				"type": "string",
				"default": "",
				"placeholder": "550e8400-e29b-41d4-a716-446655440000"
			}
		],
		"requiredFields": [],
		"optionalFields": [],
		"filters": [],
		"optionalCollectionName": "options",
		"queryParamNames": [],
		"paginated": false,
		"isList": false,
		"listKey": ""
	},
	{
		"resource": "invoice",
		"operation": "void",
		"displayName": "Void",
		"action": "Void invoice",
		"description": "Voids an invoice by changing its status to `VOIDED`",
		"operationId": "voidInvoice",
		"method": "POST",
		"path": "/v1/invoices/{invoice_id}/void",
		"pathParams": [
			{
				"name": "invoiceId",
				"apiName": "invoice_id",
				"displayName": "Invoice ID",
				"description": "Invoice ID",
				"required": true,
				"validation": {
					"format": "uuid"
				},
				"type": "string",
				"default": "",
				"placeholder": "550e8400-e29b-41d4-a716-446655440000"
			}
		],
		"requiredFields": [
			{
				"name": "reason_invoice_void",
				"apiName": "reason",
				"displayName": "Reason",
				"description": "Void reason (minimum 10 characters) (min 10 characters, max 500 characters)",
				"required": true,
				"validation": {
					"minLength": 10,
					"maxLength": 500
				},
				"type": "string",
				"default": "",
				"placeholder": "Invoice issued with incorrect customer data"
			}
		],
		"optionalFields": [
			{
				"name": "void_date",
				"apiName": "void_date",
				"displayName": "Void Date",
				"description": "Void date (defaults to today) (YYYY-MM-DD)",
				"validation": {
					"format": "date"
				},
				"type": "string",
				"default": "",
				"placeholder": "2025-01-20"
			}
		],
		"filters": [],
		"optionalCollectionName": "options",
		"queryParamNames": [],
		"paginated": false,
		"isList": false,
		"listKey": ""
	},
	{
		"resource": "invoice",
		"operation": "schedule",
		"displayName": "Schedule",
		"action": "Schedule invoice for future processing",
		"description": "Schedules a draft invoice to be automatically processed on a future date",
		"operationId": "scheduleInvoice",
		"method": "POST",
		"path": "/v1/invoices/{invoice_id}/schedule",
		"pathParams": [
			{
				"name": "invoiceId",
				"apiName": "invoice_id",
				"displayName": "Invoice ID",
				"description": "Invoice ID",
				"required": true,
				"validation": {
					"format": "uuid"
				},
				"type": "string",
				"default": "",
				"placeholder": "550e8400-e29b-41d4-a716-446655440000"
			}
		],
		"requiredFields": [
			{
				"name": "scheduled_for",
				"apiName": "scheduled_for",
				"displayName": "Scheduled For",
				"description": "Date when the invoice should be processed (must be today or future) (YYYY-MM-DD)",
				"required": true,
				"validation": {
					"format": "date"
				},
				"type": "string",
				"default": "",
				"placeholder": "2025-02-15"
			}
		],
		"optionalFields": [
			{
				"name": "action",
				"apiName": "action",
				"displayName": "Action",
				"description": "Action to perform when processing a scheduled invoice: - DRAFT: Create as draft for manual review - ISSUE_AND_SEND: Issue and send automatically via email",
				"type": "options",
				"options": [
					{
						"name": "— Not set —",
						"value": ""
					},
					{
						"name": "DRAFT",
						"value": "DRAFT",
						"description": "Create as draft for manual review"
					},
					{
						"name": "ISSUE AND SEND",
						"value": "ISSUE_AND_SEND",
						"description": "Issue and send automatically via email"
					}
				],
				"default": ""
			}
		],
		"filters": [],
		"optionalCollectionName": "options",
		"queryParamNames": [],
		"paginated": false,
		"isList": false,
		"listKey": ""
	},
	{
		"resource": "invoice",
		"operation": "unschedule",
		"displayName": "Unschedule",
		"action": "Cancel scheduled invoice",
		"description": "Cancels a scheduled invoice and converts it back to draft",
		"operationId": "unscheduleInvoice",
		"method": "POST",
		"path": "/v1/invoices/{invoice_id}/unschedule",
		"pathParams": [
			{
				"name": "invoiceId",
				"apiName": "invoice_id",
				"displayName": "Invoice ID",
				"description": "Invoice ID",
				"required": true,
				"validation": {
					"format": "uuid"
				},
				"type": "string",
				"default": "",
				"placeholder": "550e8400-e29b-41d4-a716-446655440000"
			}
		],
		"requiredFields": [],
		"optionalFields": [],
		"filters": [],
		"optionalCollectionName": "options",
		"queryParamNames": [],
		"paginated": false,
		"isList": false,
		"listKey": ""
	},
	{
		"resource": "invoice",
		"operation": "reschedule",
		"displayName": "Reschedule",
		"action": "Reschedule invoice",
		"description": "Changes the scheduled date for a scheduled invoice",
		"operationId": "rescheduleInvoice",
		"method": "PATCH",
		"path": "/v1/invoices/{invoice_id}/reschedule",
		"pathParams": [
			{
				"name": "invoiceId",
				"apiName": "invoice_id",
				"displayName": "Invoice ID",
				"description": "Invoice ID",
				"required": true,
				"validation": {
					"format": "uuid"
				},
				"type": "string",
				"default": "",
				"placeholder": "550e8400-e29b-41d4-a716-446655440000"
			}
		],
		"requiredFields": [
			{
				"name": "scheduled_for",
				"apiName": "scheduled_for",
				"displayName": "Scheduled For",
				"description": "New date when the invoice should be processed (YYYY-MM-DD)",
				"required": true,
				"validation": {
					"format": "date"
				},
				"type": "string",
				"default": "",
				"placeholder": "2025-03-01"
			}
		],
		"optionalFields": [],
		"filters": [],
		"optionalCollectionName": "updateFields",
		"queryParamNames": [],
		"paginated": false,
		"isList": false,
		"listKey": ""
	},
	{
		"resource": "customer",
		"operation": "getAll",
		"displayName": "Get Many",
		"action": "List customers",
		"description": "Returns a paginated list of customers with optional filters",
		"operationId": "listCustomers",
		"method": "GET",
		"path": "/v1/customers",
		"pathParams": [],
		"requiredFields": [],
		"optionalFields": [],
		"filters": [
			{
				"name": "active",
				"apiName": "active",
				"displayName": "Active",
				"description": "Filter by active/inactive status",
				"type": "boolean",
				"default": false
			},
			{
				"name": "search",
				"apiName": "search",
				"displayName": "Search",
				"description": "Global search by name, NIF or email",
				"type": "string",
				"default": ""
			},
			{
				"name": "legal_name",
				"apiName": "legal_name",
				"displayName": "Legal Name",
				"description": "Filter by legal name (partial search case-insensitive)",
				"type": "string",
				"default": ""
			},
			{
				"name": "nif",
				"apiName": "nif",
				"displayName": "NIF",
				"description": "Filter by NIF (partial search)",
				"type": "string",
				"default": ""
			},
			{
				"name": "email",
				"apiName": "email",
				"displayName": "Email",
				"description": "Filter by email (partial search)",
				"type": "string",
				"default": ""
			},
			{
				"name": "phone",
				"apiName": "phone",
				"displayName": "Phone",
				"description": "Filter by phone (partial search)",
				"type": "string",
				"default": ""
			},
			{
				"name": "city",
				"apiName": "city",
				"displayName": "City",
				"description": "Filter by city",
				"type": "string",
				"default": ""
			},
			{
				"name": "province",
				"apiName": "province",
				"displayName": "Province",
				"description": "Filter by province",
				"type": "string",
				"default": ""
			},
			{
				"name": "sort_by",
				"apiName": "sort_by",
				"displayName": "Sort By",
				"description": "Field to sort by (eg",
				"type": "string",
				"default": ""
			},
			{
				"name": "sort_order",
				"apiName": "sort_order",
				"displayName": "Sort Order",
				"description": "Sort order direction",
				"type": "options",
				"options": [
					{
						"name": "Asc",
						"value": "asc"
					},
					{
						"name": "Desc",
						"value": "desc"
					}
				],
				"default": "asc"
			}
		],
		"optionalCollectionName": "options",
		"queryParamNames": [
			"active",
			"search",
			"legal_name",
			"nif",
			"email",
			"phone",
			"city",
			"province",
			"sort_by",
			"sort_order"
		],
		"paginated": true,
		"isList": true,
		"listKey": "customers"
	},
	{
		"resource": "customer",
		"operation": "create",
		"displayName": "Create",
		"action": "Create customer",
		"description": "Creates a new customer",
		"operationId": "createCustomer",
		"method": "POST",
		"path": "/v1/customers",
		"pathParams": [],
		"requiredFields": [
			{
				"name": "legal_name",
				"apiName": "legal_name",
				"displayName": "Legal Name",
				"description": "Customer legal name (required) (max 120 characters)",
				"required": true,
				"validation": {
					"pattern": "^\\S.*$",
					"minLength": 1,
					"maxLength": 120
				},
				"type": "string",
				"default": ""
			},
			{
				"name": "address",
				"apiName": "address",
				"displayName": "Address",
				"required": true,
				"type": "fixedCollection",
				"fields": [
					{
						"name": "street",
						"apiName": "street",
						"displayName": "Street",
						"description": "Full address (street, number, floor, etc.) - Latin characters only (max 255 characters)",
						"required": true,
						"validation": {
							"pattern": "^[a-zA-Z0-9À-ÿ\\u0100-\\u017F\\u00B7\\s\\.,\\-\\/'ºª°:;\"()&#]+$",
							"minLength": 1,
							"maxLength": 255
						},
						"type": "string",
						"default": "",
						"placeholder": "Calle Mayor, 123"
					},
					{
						"name": "number",
						"apiName": "number",
						"displayName": "Number",
						"description": "Street number (max 20 characters)",
						"required": true,
						"validation": {
							"minLength": 1,
							"maxLength": 20
						},
						"type": "string",
						"default": "",
						"placeholder": "123"
					},
					{
						"name": "floor",
						"apiName": "floor",
						"displayName": "Floor",
						"description": "Floor or level (max 10 characters)",
						"validation": {
							"maxLength": 10
						},
						"type": "string",
						"default": "",
						"placeholder": "2º A"
					},
					{
						"name": "door",
						"apiName": "door",
						"displayName": "Door",
						"description": "Door or apartment (max 10 characters)",
						"validation": {
							"maxLength": 10
						},
						"type": "string",
						"default": "",
						"placeholder": "A"
					},
					{
						"name": "postal_code",
						"apiName": "postal_code",
						"displayName": "Postal Code",
						"description": "Postal code (5 digits for Spain, free format for other countries) (max 20 characters)",
						"required": true,
						"validation": {
							"minLength": 1,
							"maxLength": 20
						},
						"type": "string",
						"default": "",
						"placeholder": "28001"
					},
					{
						"name": "city",
						"apiName": "city",
						"displayName": "City",
						"description": "City or town - Latin characters only (max 100 characters)",
						"required": true,
						"validation": {
							"pattern": "^[a-zA-Z0-9À-ÿ\\u0100-\\u017F\\u00B7\\u2018\\u2019\\u0060\\u00B4\\s\\.,\\-\\/'ºª()]+$",
							"minLength": 1,
							"maxLength": 100
						},
						"type": "string",
						"default": "",
						"placeholder": "Madrid"
					},
					{
						"name": "province",
						"apiName": "province",
						"displayName": "Province",
						"description": "Province or state - Latin characters only (max 100 characters)",
						"required": true,
						"validation": {
							"pattern": "^[a-zA-Z0-9À-ÿ\\u0100-\\u017F\\u00B7\\u2018\\u2019\\u0060\\u00B4\\s\\.,\\-\\/'ºª]+$",
							"minLength": 1,
							"maxLength": 100
						},
						"type": "string",
						"default": "",
						"placeholder": "Madrid"
					},
					{
						"name": "country",
						"apiName": "country",
						"displayName": "Country",
						"description": "Country - Latin characters only (max 100 characters)",
						"required": true,
						"validation": {
							"pattern": "^[a-zA-Z0-9À-ÿ\\u0100-\\u017F\\u00B7\\u2018\\u2019\\u0060\\u00B4\\s\\.,\\-\\/'ºª]+$",
							"minLength": 1,
							"maxLength": 100
						},
						"type": "string",
						"default": "España",
						"placeholder": "España"
					},
					{
						"name": "country_code",
						"apiName": "country_code",
						"displayName": "Country Code",
						"description": "ISO 3166-1 alpha-2 country code (exactly 2 characters)",
						"validation": {
							"pattern": "^[A-Z]{2}$",
							"minLength": 2,
							"maxLength": 2
						},
						"type": "string",
						"default": "ES",
						"placeholder": "ES"
					}
				],
				"default": {}
			}
		],
		"optionalFields": [
			{
				"name": "trade_name",
				"apiName": "trade_name",
				"displayName": "Trade Name",
				"description": "Customer trade name (optional) (max 120 characters)",
				"validation": {
					"maxLength": 120
				},
				"type": "string",
				"default": ""
			},
			{
				"name": "nif",
				"apiName": "nif",
				"displayName": "NIF",
				"description": "Spanish Tax ID (required if id_otro is not provided) (exactly 9 characters)",
				"validation": {
					"pattern": "^(\\d{8}[A-Z]|[ABCDEFGHJKLMNPQRSUVW]\\d{7}[A-Z0-9]|[XYZ]\\d{7}[A-Z])$",
					"minLength": 9,
					"maxLength": 9
				},
				"type": "string",
				"default": "",
				"placeholder": "12345678A"
			},
			{
				"name": "alternative_id",
				"apiName": "alternative_id",
				"displayName": "Alternative ID",
				"description": "Alternative identifier for customers without Spanish Tax ID",
				"type": "fixedCollection",
				"fields": [
					{
						"name": "type",
						"apiName": "type",
						"displayName": "Type",
						"description": "- 02: VAT-ID (intra-community) - 03: Passport - 04: Country of residence ID - 05: Residence certificate - 06: Other document - 07: Not registered",
						"required": true,
						"type": "options",
						"options": [
							{
								"name": "02",
								"value": "02",
								"description": "VAT-ID (intra-community)"
							},
							{
								"name": "03",
								"value": "03",
								"description": "Passport"
							},
							{
								"name": "04",
								"value": "04",
								"description": "Country of residence ID"
							},
							{
								"name": "05",
								"value": "05",
								"description": "Residence certificate"
							},
							{
								"name": "06",
								"value": "06",
								"description": "Other document"
							},
							{
								"name": "07",
								"value": "07",
								"description": "Not registered"
							}
						],
						"default": "02"
					},
					{
						"name": "number",
						"apiName": "number",
						"displayName": "Number",
						"description": "Format: max 20 characters",
						"required": true,
						"validation": {
							"minLength": 1,
							"maxLength": 20
						},
						"type": "string",
						"default": ""
					},
					{
						"name": "country_code",
						"apiName": "country_code",
						"displayName": "Country Code",
						"description": "ISO 3166-1 alpha-2 country code (exactly 2 characters)",
						"validation": {
							"pattern": "^[A-Z]{2}$",
							"minLength": 2,
							"maxLength": 2
						},
						"type": "string",
						"default": ""
					}
				],
				"default": {}
			},
			{
				"name": "phone",
				"apiName": "phone",
				"displayName": "Phone",
				"description": "Phone number (min 9 characters, max 20 characters)",
				"validation": {
					"pattern": "^[+]?[0-9\\s\\-\\(\\)]+$",
					"minLength": 9,
					"maxLength": 20
				},
				"type": "string",
				"default": "",
				"placeholder": "+34 612 345 678"
			},
			{
				"name": "email",
				"apiName": "email",
				"displayName": "Email",
				"description": "Email address (minimum valid email is 5 chars, e.g (email address, min 5 characters, max 255 characters)",
				"validation": {
					"minLength": 5,
					"maxLength": 255,
					"format": "email"
				},
				"type": "string",
				"default": ""
			},
			{
				"name": "web",
				"apiName": "web",
				"displayName": "Website",
				"description": "Website URL (max 255 characters)",
				"validation": {
					"pattern": "^(https?://.+|)$",
					"maxLength": 255
				},
				"type": "string",
				"default": ""
			},
			{
				"name": "billing_emails",
				"apiName": "billing_emails",
				"displayName": "Billing Emails",
				"description": "Additional emails for invoice delivery (optional) (email address, min 5 characters, max 255 characters)",
				"type": "string",
				"validation": {
					"minLength": 5,
					"maxLength": 255,
					"format": "email"
				},
				"multipleValues": true,
				"default": []
			},
			{
				"name": "contact_person",
				"apiName": "contact_person",
				"displayName": "Contact Person",
				"description": "Contact person name (optional) (max 200 characters)",
				"validation": {
					"maxLength": 200
				},
				"type": "string",
				"default": ""
			},
			{
				"name": "notes",
				"apiName": "notes",
				"displayName": "Notes",
				"description": "Additional notes about the customer (optional)",
				"type": "string",
				"default": ""
			},
			{
				"name": "preferred_payment_method",
				"apiName": "preferred_payment_method",
				"displayName": "Preferred Payment Method",
				"type": "fixedCollection",
				"fields": [
					{
						"name": "method",
						"apiName": "method",
						"displayName": "Method",
						"description": "Preferred payment method",
						"type": "options",
						"options": [
							{
								"name": "NONE",
								"value": "NONE"
							},
							{
								"name": "BANK TRANSFER",
								"value": "BANK_TRANSFER"
							},
							{
								"name": "CARD",
								"value": "CARD"
							},
							{
								"name": "CASH",
								"value": "CASH"
							},
							{
								"name": "CHECK",
								"value": "CHECK"
							},
							{
								"name": "DIRECT DEBIT",
								"value": "DIRECT_DEBIT"
							},
							{
								"name": "OTHER",
								"value": "OTHER"
							}
						],
						"default": "BANK_TRANSFER"
					},
					{
						"name": "iban",
						"apiName": "iban",
						"displayName": "IBAN",
						"description": "IBAN (International Bank Account Number) (min 15 characters, max 34 characters)",
						"validation": {
							"pattern": "^[A-Z]{2}\\d{2}[A-Z0-9]{1,30}$",
							"minLength": 15,
							"maxLength": 34
						},
						"type": "string",
						"default": "",
						"placeholder": "ES1234567890123456789012"
					},
					{
						"name": "swift",
						"apiName": "swift",
						"displayName": "SWIFT",
						"description": "SWIFT/BIC code (min 8 characters, max 11 characters)",
						"validation": {
							"pattern": "^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$",
							"minLength": 8,
							"maxLength": 11
						},
						"type": "string",
						"default": "",
						"placeholder": "ABCDESMMXXX"
					},
					{
						"name": "payment_term_days",
						"apiName": "payment_term_days",
						"displayName": "Payment Term Days",
						"description": "Payment term in days (optional, default 30) (between 0 and 365)",
						"validation": {
							"minimum": 0,
							"maximum": 365
						},
						"type": "number",
						"default": 30,
						"numberPrecision": 0
					}
				],
				"default": {}
			},
			{
				"name": "general_discount",
				"apiName": "general_discount",
				"displayName": "General Discount",
				"description": "General discount percentage (optional) (between 0 and 100)",
				"validation": {
					"minimum": 0,
					"maximum": 100
				},
				"type": "number",
				"default": 0
			}
		],
		"filters": [],
		"optionalCollectionName": "additionalFields",
		"queryParamNames": [],
		"paginated": false,
		"isList": false,
		"listKey": ""
	},
	{
		"resource": "customer",
		"operation": "get",
		"displayName": "Get",
		"action": "Get customer by ID",
		"description": "Retrieves complete details of a specific customer",
		"operationId": "getCustomer",
		"method": "GET",
		"path": "/v1/customers/{customer_id}",
		"pathParams": [
			{
				"name": "customerId",
				"apiName": "customer_id",
				"displayName": "Customer ID",
				"description": "Customer ID",
				"required": true,
				"validation": {
					"format": "uuid"
				},
				"type": "options",
				"loadOptionsMethod": "getCustomers",
				"default": ""
			}
		],
		"requiredFields": [],
		"optionalFields": [],
		"filters": [],
		"optionalCollectionName": "options",
		"queryParamNames": [],
		"paginated": false,
		"isList": false,
		"listKey": ""
	},
	{
		"resource": "customer",
		"operation": "update",
		"displayName": "Update",
		"action": "Update customer",
		"description": "Updates an existing customer",
		"operationId": "updateCustomer",
		"method": "PUT",
		"path": "/v1/customers/{customer_id}",
		"pathParams": [
			{
				"name": "customerId",
				"apiName": "customer_id",
				"displayName": "Customer ID",
				"description": "Customer ID",
				"required": true,
				"validation": {
					"format": "uuid"
				},
				"type": "options",
				"loadOptionsMethod": "getCustomers",
				"default": ""
			}
		],
		"requiredFields": [],
		"optionalFields": [
			{
				"name": "legal_name",
				"apiName": "legal_name",
				"displayName": "Legal Name",
				"description": "Customer legal name (max 120 characters)",
				"validation": {
					"minLength": 1,
					"maxLength": 120
				},
				"type": "string",
				"default": ""
			},
			{
				"name": "trade_name",
				"apiName": "trade_name",
				"displayName": "Trade Name",
				"description": "Customer trade name (optional) (max 120 characters)",
				"validation": {
					"maxLength": 120
				},
				"type": "string",
				"default": ""
			},
			{
				"name": "address",
				"apiName": "address",
				"displayName": "Address",
				"type": "fixedCollection",
				"fields": [
					{
						"name": "street",
						"apiName": "street",
						"displayName": "Street",
						"description": "Full address (street, number, floor, etc.) - Latin characters only (max 255 characters)",
						"required": true,
						"validation": {
							"pattern": "^[a-zA-Z0-9À-ÿ\\u0100-\\u017F\\u00B7\\s\\.,\\-\\/'ºª°:;\"()&#]+$",
							"minLength": 1,
							"maxLength": 255
						},
						"type": "string",
						"default": "",
						"placeholder": "Calle Mayor, 123"
					},
					{
						"name": "number",
						"apiName": "number",
						"displayName": "Number",
						"description": "Street number (max 20 characters)",
						"required": true,
						"validation": {
							"minLength": 1,
							"maxLength": 20
						},
						"type": "string",
						"default": "",
						"placeholder": "123"
					},
					{
						"name": "floor",
						"apiName": "floor",
						"displayName": "Floor",
						"description": "Floor or level (max 10 characters)",
						"validation": {
							"maxLength": 10
						},
						"type": "string",
						"default": "",
						"placeholder": "2º A"
					},
					{
						"name": "door",
						"apiName": "door",
						"displayName": "Door",
						"description": "Door or apartment (max 10 characters)",
						"validation": {
							"maxLength": 10
						},
						"type": "string",
						"default": "",
						"placeholder": "A"
					},
					{
						"name": "postal_code",
						"apiName": "postal_code",
						"displayName": "Postal Code",
						"description": "Postal code (5 digits for Spain, free format for other countries) (max 20 characters)",
						"required": true,
						"validation": {
							"minLength": 1,
							"maxLength": 20
						},
						"type": "string",
						"default": "",
						"placeholder": "28001"
					},
					{
						"name": "city",
						"apiName": "city",
						"displayName": "City",
						"description": "City or town - Latin characters only (max 100 characters)",
						"required": true,
						"validation": {
							"pattern": "^[a-zA-Z0-9À-ÿ\\u0100-\\u017F\\u00B7\\u2018\\u2019\\u0060\\u00B4\\s\\.,\\-\\/'ºª()]+$",
							"minLength": 1,
							"maxLength": 100
						},
						"type": "string",
						"default": "",
						"placeholder": "Madrid"
					},
					{
						"name": "province",
						"apiName": "province",
						"displayName": "Province",
						"description": "Province or state - Latin characters only (max 100 characters)",
						"required": true,
						"validation": {
							"pattern": "^[a-zA-Z0-9À-ÿ\\u0100-\\u017F\\u00B7\\u2018\\u2019\\u0060\\u00B4\\s\\.,\\-\\/'ºª]+$",
							"minLength": 1,
							"maxLength": 100
						},
						"type": "string",
						"default": "",
						"placeholder": "Madrid"
					},
					{
						"name": "country",
						"apiName": "country",
						"displayName": "Country",
						"description": "Country - Latin characters only (max 100 characters)",
						"required": true,
						"validation": {
							"pattern": "^[a-zA-Z0-9À-ÿ\\u0100-\\u017F\\u00B7\\u2018\\u2019\\u0060\\u00B4\\s\\.,\\-\\/'ºª]+$",
							"minLength": 1,
							"maxLength": 100
						},
						"type": "string",
						"default": "España",
						"placeholder": "España"
					},
					{
						"name": "country_code",
						"apiName": "country_code",
						"displayName": "Country Code",
						"description": "ISO 3166-1 alpha-2 country code (exactly 2 characters)",
						"validation": {
							"pattern": "^[A-Z]{2}$",
							"minLength": 2,
							"maxLength": 2
						},
						"type": "string",
						"default": "ES",
						"placeholder": "ES"
					}
				],
				"default": {}
			},
			{
				"name": "phone",
				"apiName": "phone",
				"displayName": "Phone",
				"description": "Phone number (min 9 characters, max 20 characters)",
				"validation": {
					"pattern": "^[+]?[0-9\\s\\-\\(\\)]+$",
					"minLength": 9,
					"maxLength": 20
				},
				"type": "string",
				"default": "",
				"placeholder": "+34 612 345 678"
			},
			{
				"name": "email",
				"apiName": "email",
				"displayName": "Email",
				"description": "Email address (minimum valid email is 5 chars, e.g (email address, min 5 characters, max 255 characters)",
				"validation": {
					"minLength": 5,
					"maxLength": 255,
					"format": "email"
				},
				"type": "string",
				"default": ""
			},
			{
				"name": "web",
				"apiName": "web",
				"displayName": "Website",
				"description": "Website URL (max 255 characters)",
				"validation": {
					"pattern": "^(https?://.+|)$",
					"maxLength": 255
				},
				"type": "string",
				"default": ""
			},
			{
				"name": "billing_emails",
				"apiName": "billing_emails",
				"displayName": "Billing Emails",
				"description": "Additional emails for invoice delivery (optional) (email address, min 5 characters, max 255 characters)",
				"type": "string",
				"validation": {
					"minLength": 5,
					"maxLength": 255,
					"format": "email"
				},
				"multipleValues": true,
				"default": []
			},
			{
				"name": "contact_person",
				"apiName": "contact_person",
				"displayName": "Contact Person",
				"description": "Contact person name (optional) (max 200 characters)",
				"validation": {
					"maxLength": 200
				},
				"type": "string",
				"default": ""
			},
			{
				"name": "notes",
				"apiName": "notes",
				"displayName": "Notes",
				"description": "Additional notes about the customer (optional)",
				"type": "string",
				"default": ""
			},
			{
				"name": "preferred_payment_method",
				"apiName": "preferred_payment_method",
				"displayName": "Preferred Payment Method",
				"type": "fixedCollection",
				"fields": [
					{
						"name": "method",
						"apiName": "method",
						"displayName": "Method",
						"description": "Preferred payment method",
						"type": "options",
						"options": [
							{
								"name": "NONE",
								"value": "NONE"
							},
							{
								"name": "BANK TRANSFER",
								"value": "BANK_TRANSFER"
							},
							{
								"name": "CARD",
								"value": "CARD"
							},
							{
								"name": "CASH",
								"value": "CASH"
							},
							{
								"name": "CHECK",
								"value": "CHECK"
							},
							{
								"name": "DIRECT DEBIT",
								"value": "DIRECT_DEBIT"
							},
							{
								"name": "OTHER",
								"value": "OTHER"
							}
						],
						"default": "BANK_TRANSFER"
					},
					{
						"name": "iban",
						"apiName": "iban",
						"displayName": "IBAN",
						"description": "IBAN (International Bank Account Number) (min 15 characters, max 34 characters)",
						"validation": {
							"pattern": "^[A-Z]{2}\\d{2}[A-Z0-9]{1,30}$",
							"minLength": 15,
							"maxLength": 34
						},
						"type": "string",
						"default": "",
						"placeholder": "ES1234567890123456789012"
					},
					{
						"name": "swift",
						"apiName": "swift",
						"displayName": "SWIFT",
						"description": "SWIFT/BIC code (min 8 characters, max 11 characters)",
						"validation": {
							"pattern": "^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$",
							"minLength": 8,
							"maxLength": 11
						},
						"type": "string",
						"default": "",
						"placeholder": "ABCDESMMXXX"
					},
					{
						"name": "payment_term_days",
						"apiName": "payment_term_days",
						"displayName": "Payment Term Days",
						"description": "Payment term in days (optional, default 30) (between 0 and 365)",
						"validation": {
							"minimum": 0,
							"maximum": 365
						},
						"type": "number",
						"default": 30,
						"numberPrecision": 0
					}
				],
				"default": {}
			},
			{
				"name": "general_discount",
				"apiName": "general_discount",
				"displayName": "General Discount",
				"description": "General discount percentage (optional) (between 0 and 100)",
				"validation": {
					"minimum": 0,
					"maximum": 100
				},
				"type": "number",
				"default": 0
			},
			{
				"name": "active",
				"apiName": "active",
				"displayName": "Active",
				"description": "Whether the customer is active or inactive",
				"type": "boolean",
				"default": false
			}
		],
		"filters": [],
		"optionalCollectionName": "updateFields",
		"queryParamNames": [],
		"paginated": false,
		"isList": false,
		"listKey": ""
	},
	{
		"resource": "customer",
		"operation": "delete",
		"displayName": "Delete",
		"action": "Deactivate customer",
		"description": "Deactivates (marks as deleted) a customer",
		"operationId": "deactivateCustomer",
		"method": "DELETE",
		"path": "/v1/customers/{customer_id}",
		"pathParams": [
			{
				"name": "customerId",
				"apiName": "customer_id",
				"displayName": "Customer ID",
				"description": "Customer ID",
				"required": true,
				"validation": {
					"format": "uuid"
				},
				"type": "options",
				"loadOptionsMethod": "getCustomers",
				"default": ""
			}
		],
		"requiredFields": [],
		"optionalFields": [],
		"filters": [],
		"optionalCollectionName": "options",
		"queryParamNames": [],
		"paginated": false,
		"isList": false,
		"listKey": ""
	},
	{
		"resource": "product",
		"operation": "getAll",
		"displayName": "Get Many",
		"action": "List products/services from catalog",
		"description": "Returns a paginated list of products/services with optional filters",
		"operationId": "listProducts",
		"method": "GET",
		"path": "/v1/products",
		"pathParams": [],
		"requiredFields": [],
		"optionalFields": [],
		"filters": [
			{
				"name": "category",
				"apiName": "category",
				"displayName": "Category",
				"description": "Filter by product category",
				"type": "options",
				"options": [
					{
						"name": "— Not set —",
						"value": ""
					},
					{
						"name": "PRODUCT",
						"value": "PRODUCT",
						"description": "Physical, tangible products"
					},
					{
						"name": "SERVICE",
						"value": "SERVICE",
						"description": "General services"
					},
					{
						"name": "CONSULTING",
						"value": "CONSULTING",
						"description": "Consulting and advisory services"
					},
					{
						"name": "SOFTWARE",
						"value": "SOFTWARE",
						"description": "Development, licenses, SaaS"
					},
					{
						"name": "TRAINING",
						"value": "TRAINING",
						"description": "Courses, workshops, training"
					},
					{
						"name": "OTHER",
						"value": "OTHER",
						"description": "Other unclassified types"
					}
				],
				"default": ""
			},
			{
				"name": "active",
				"apiName": "active",
				"displayName": "Active",
				"description": "Filter by active/inactive status",
				"type": "boolean",
				"default": false
			},
			{
				"name": "search",
				"apiName": "search",
				"displayName": "Search",
				"description": "Global search by name, code or description",
				"validation": {
					"maxLength": 100
				},
				"type": "string",
				"default": ""
			},
			{
				"name": "name",
				"apiName": "name",
				"displayName": "Name",
				"description": "Filter by name (partial search case-insensitive)",
				"type": "string",
				"default": ""
			},
			{
				"name": "code",
				"apiName": "code",
				"displayName": "Code",
				"description": "Filter by code (partial search)",
				"type": "string",
				"default": ""
			},
			{
				"name": "min_price",
				"apiName": "min_price",
				"displayName": "Min Price",
				"description": "Minimum price",
				"validation": {
					"minimum": 0
				},
				"type": "number",
				"default": 0
			},
			{
				"name": "max_price",
				"apiName": "max_price",
				"displayName": "Max Price",
				"description": "Maximum price",
				"validation": {
					"minimum": 0
				},
				"type": "number",
				"default": 0
			},
			{
				"name": "sort_by",
				"apiName": "sort_by",
				"displayName": "Sort By",
				"description": "Field to sort by",
				"type": "options",
				"options": [
					{
						"name": "Name",
						"value": "name"
					},
					{
						"name": "Code",
						"value": "code"
					},
					{
						"name": "Category",
						"value": "category"
					},
					{
						"name": "Default Price",
						"value": "default_price"
					},
					{
						"name": "Created At",
						"value": "created_at"
					}
				],
				"default": "name"
			},
			{
				"name": "sort_order",
				"apiName": "sort_order",
				"displayName": "Sort Order",
				"description": "Sort order direction",
				"type": "options",
				"options": [
					{
						"name": "Asc",
						"value": "asc"
					},
					{
						"name": "Desc",
						"value": "desc"
					}
				],
				"default": "asc"
			}
		],
		"optionalCollectionName": "options",
		"queryParamNames": [
			"category",
			"active",
			"search",
			"name",
			"code",
			"min_price",
			"max_price",
			"sort_by",
			"sort_order"
		],
		"paginated": true,
		"isList": true,
		"listKey": "products"
	},
	{
		"resource": "product",
		"operation": "create",
		"displayName": "Create",
		"action": "Create new product/service",
		"description": "Creates a new product or service in the catalog",
		"operationId": "createProduct",
		"method": "POST",
		"path": "/v1/products",
		"pathParams": [],
		"requiredFields": [
			{
				"name": "name",
				"apiName": "name",
				"displayName": "Name",
				"description": "Product/service name (max 255 characters)",
				"required": true,
				"validation": {
					"maxLength": 255
				},
				"type": "string",
				"default": "",
				"placeholder": "Technical consulting"
			}
		],
		"optionalFields": [
			{
				"name": "code",
				"apiName": "code",
				"displayName": "Code",
				"description": "Unique alphanumeric product code (optional) (max 50 characters)",
				"validation": {
					"pattern": "^[a-zA-Z0-9_-]*$",
					"maxLength": 50
				},
				"type": "string",
				"default": "",
				"placeholder": "SERV-001"
			},
			{
				"name": "description",
				"apiName": "description",
				"displayName": "Description",
				"description": "Detailed description (optional)",
				"type": "string",
				"default": "",
				"placeholder": "Specialized technical consulting services"
			},
			{
				"name": "category",
				"apiName": "category",
				"displayName": "Category",
				"description": "Product/service category: * PRODUCT - Physical, tangible products * SERVICE - General services * CONSULTING - Consulting and advisory services * SOFTWARE - Development, licenses, SaaS * TRAINING - Courses, workshops, training * OTHER - Other unclassified types",
				"type": "options",
				"options": [
					{
						"name": "— Not set —",
						"value": ""
					},
					{
						"name": "PRODUCT",
						"value": "PRODUCT",
						"description": "Physical, tangible products"
					},
					{
						"name": "SERVICE",
						"value": "SERVICE",
						"description": "General services"
					},
					{
						"name": "CONSULTING",
						"value": "CONSULTING",
						"description": "Consulting and advisory services"
					},
					{
						"name": "SOFTWARE",
						"value": "SOFTWARE",
						"description": "Development, licenses, SaaS"
					},
					{
						"name": "TRAINING",
						"value": "TRAINING",
						"description": "Courses, workshops, training"
					},
					{
						"name": "OTHER",
						"value": "OTHER",
						"description": "Other unclassified types"
					}
				],
				"default": ""
			},
			{
				"name": "default_price",
				"apiName": "default_price",
				"displayName": "Default Price",
				"description": "Suggested default price (optional) (min 0)",
				"validation": {
					"minimum": 0,
					"multipleOf": 0.0001
				},
				"type": "number",
				"default": 0
			},
			{
				"name": "unit",
				"apiName": "unit",
				"displayName": "Unit",
				"description": "Unit of measure (optional) (max 50 characters)",
				"validation": {
					"maxLength": 50
				},
				"type": "string",
				"default": "",
				"placeholder": "hours"
			},
			{
				"name": "main_tax",
				"apiName": "main_tax",
				"displayName": "Main Tax",
				"description": "Complete tax information with cross-validations: - IVA: only percentages 0, 4, 10, 21 - IGIC: only percentages 0, 3, 5, 7, 9.5, 15, 20 - IPSI: only percentages 0.5, 1, 2, 4, 8, 10 - OTHER: any percentage between 0 and 100",
				"type": "fixedCollection",
				"fields": [
					{
						"name": "type",
						"apiName": "type",
						"displayName": "Type",
						"description": "Tax type by territory: - IVA: Iberian Peninsula and Balearic Islands (0%, 4%, 10%, 21%) - IGIC: Canary Islands (0%, 3%, 5%, 7%, 9.5%, 15%, 20%) - IPSI: Ceuta and Melilla (0.5%, 1%, 2%, 4%, 8%, 10%) - OTHER: Configurable 0%-100%",
						"required": true,
						"type": "options",
						"options": [
							{
								"name": "IVA",
								"value": "IVA",
								"description": "Iberian Peninsula and Balearic Islands (0%, 4%, 10%, 21%)"
							},
							{
								"name": "IGIC",
								"value": "IGIC",
								"description": "Canary Islands (0%, 3%, 5%, 7%, 9.5%, 15%, 20%)"
							},
							{
								"name": "IPSI",
								"value": "IPSI",
								"description": "Ceuta and Melilla (0.5%, 1%, 2%, 4%, 8%, 10%)"
							},
							{
								"name": "OTHER",
								"value": "OTHER",
								"description": "Configurable 0%-100%"
							}
						],
						"default": "IVA"
					},
					{
						"name": "percentage_IVA",
						"apiName": "percentage",
						"displayName": "Percentage",
						"description": "Tax percentage (between 0 and 100) — rates allowed for IVA",
						"required": true,
						"validation": {
							"minimum": 0,
							"maximum": 100
						},
						"type": "options",
						"default": 21,
						"options": [
							{
								"name": "0%",
								"value": 0
							},
							{
								"name": "4%",
								"value": 4
							},
							{
								"name": "10%",
								"value": 10
							},
							{
								"name": "21%",
								"value": 21
							}
						],
						"showWhen": {
							"field": "type",
							"values": [
								"IVA"
							]
						}
					},
					{
						"name": "percentage_IGIC",
						"apiName": "percentage",
						"displayName": "Percentage",
						"description": "Tax percentage (between 0 and 100) — rates allowed for IGIC",
						"required": true,
						"validation": {
							"minimum": 0,
							"maximum": 100
						},
						"type": "options",
						"default": 0,
						"options": [
							{
								"name": "0%",
								"value": 0
							},
							{
								"name": "3%",
								"value": 3
							},
							{
								"name": "5%",
								"value": 5
							},
							{
								"name": "7%",
								"value": 7
							},
							{
								"name": "9.5%",
								"value": 9.5
							},
							{
								"name": "15%",
								"value": 15
							},
							{
								"name": "20%",
								"value": 20
							}
						],
						"showWhen": {
							"field": "type",
							"values": [
								"IGIC"
							]
						}
					},
					{
						"name": "percentage_IPSI",
						"apiName": "percentage",
						"displayName": "Percentage",
						"description": "Tax percentage (between 0 and 100) — rates allowed for IPSI",
						"required": true,
						"validation": {
							"minimum": 0,
							"maximum": 100
						},
						"type": "options",
						"default": 0.5,
						"options": [
							{
								"name": "0.5%",
								"value": 0.5
							},
							{
								"name": "1%",
								"value": 1
							},
							{
								"name": "2%",
								"value": 2
							},
							{
								"name": "4%",
								"value": 4
							},
							{
								"name": "8%",
								"value": 8
							},
							{
								"name": "10%",
								"value": 10
							}
						],
						"showWhen": {
							"field": "type",
							"values": [
								"IPSI"
							]
						}
					},
					{
						"name": "percentage_OTHER",
						"apiName": "percentage",
						"displayName": "Percentage",
						"description": "Tax percentage (between 0 and 100)",
						"required": true,
						"validation": {
							"minimum": 0,
							"maximum": 100
						},
						"type": "number",
						"default": 0,
						"showWhen": {
							"field": "type",
							"values": [
								"OTHER"
							]
						}
					},
					{
						"name": "regime_key",
						"apiName": "regime_key",
						"displayName": "Regime Key",
						"description": "Regime key according to VeriFactu regulations: - 01: General regime operation - 02: Export - 03: Used goods, art, antiques - 04: Investment gold - 05: Travel agencies - 06: Group of entities - 07: Cash basis - 08: IPSI/IVA/IGIC operations - 09: Mediating agencies - 10: Third-party collections - 1...",
						"type": "options",
						"options": [
							{
								"name": "01",
								"value": "01",
								"description": "General regime operation"
							},
							{
								"name": "02",
								"value": "02",
								"description": "Export"
							},
							{
								"name": "03",
								"value": "03",
								"description": "Used goods, art, antiques"
							},
							{
								"name": "04",
								"value": "04",
								"description": "Investment gold"
							},
							{
								"name": "05",
								"value": "05",
								"description": "Travel agencies"
							},
							{
								"name": "06",
								"value": "06",
								"description": "Group of entities"
							},
							{
								"name": "07",
								"value": "07",
								"description": "Cash basis"
							},
							{
								"name": "08",
								"value": "08",
								"description": "IPSI/IVA/IGIC operations"
							},
							{
								"name": "09",
								"value": "09",
								"description": "Mediating agencies"
							},
							{
								"name": "10",
								"value": "10",
								"description": "Third-party collections"
							},
							{
								"name": "11",
								"value": "11",
								"description": "Local rental"
							},
							{
								"name": "14",
								"value": "14",
								"description": "VAT pending in certifications"
							},
							{
								"name": "15",
								"value": "15",
								"description": "VAT pending successive tract"
							},
							{
								"name": "17",
								"value": "17",
								"description": "OSS and IOSS"
							},
							{
								"name": "18",
								"value": "18",
								"description": "Equivalence surcharge"
							},
							{
								"name": "19",
								"value": "19",
								"description": "REAGYP"
							},
							{
								"name": "20",
								"value": "20",
								"description": "Simplified regime"
							}
						],
						"default": "01"
					}
				],
				"default": {}
			},
			{
				"name": "equivalence_surcharge",
				"apiName": "equivalence_surcharge",
				"displayName": "Equivalence Surcharge",
				"description": "Equivalence surcharge percentage (optional) (between 0 and 100)",
				"validation": {
					"minimum": 0,
					"maximum": 100,
					"multipleOf": 0.01
				},
				"type": "number",
				"default": 0
			},
			{
				"name": "irpf",
				"apiName": "irpf",
				"displayName": "IRPF",
				"description": "IRPF withholding percentage (optional) (between 0 and 100)",
				"validation": {
					"minimum": 0,
					"maximum": 100,
					"multipleOf": 0.01
				},
				"type": "number",
				"default": 0
			}
		],
		"filters": [],
		"optionalCollectionName": "additionalFields",
		"queryParamNames": [],
		"paginated": false,
		"isList": false,
		"listKey": ""
	},
	{
		"resource": "product",
		"operation": "get",
		"displayName": "Get",
		"action": "Get product by ID",
		"description": "Retrieves details of a specific product",
		"operationId": "getProduct",
		"method": "GET",
		"path": "/v1/products/{product_id}",
		"pathParams": [
			{
				"name": "productId",
				"apiName": "product_id",
				"displayName": "Product ID",
				"description": "Product unique UUID",
				"required": true,
				"validation": {
					"format": "uuid"
				},
				"type": "string",
				"default": ""
			}
		],
		"requiredFields": [],
		"optionalFields": [],
		"filters": [],
		"optionalCollectionName": "options",
		"queryParamNames": [],
		"paginated": false,
		"isList": false,
		"listKey": ""
	},
	{
		"resource": "product",
		"operation": "update",
		"displayName": "Update",
		"action": "Update product",
		"description": "Updates an existing product",
		"operationId": "updateProduct",
		"method": "PUT",
		"path": "/v1/products/{product_id}",
		"pathParams": [
			{
				"name": "productId",
				"apiName": "product_id",
				"displayName": "Product ID",
				"description": "Product unique UUID",
				"required": true,
				"validation": {
					"format": "uuid"
				},
				"type": "string",
				"default": ""
			}
		],
		"requiredFields": [],
		"optionalFields": [
			{
				"name": "code",
				"apiName": "code",
				"displayName": "Code",
				"description": "Unique alphanumeric product code (optional) (max 50 characters)",
				"validation": {
					"pattern": "^[a-zA-Z0-9_-]*$",
					"maxLength": 50
				},
				"type": "string",
				"default": "",
				"placeholder": "SERV-001"
			},
			{
				"name": "name",
				"apiName": "name",
				"displayName": "Name",
				"description": "Product/service name (max 255 characters)",
				"validation": {
					"maxLength": 255
				},
				"type": "string",
				"default": "",
				"placeholder": "Technical consulting"
			},
			{
				"name": "description",
				"apiName": "description",
				"displayName": "Description",
				"description": "Detailed description (optional)",
				"type": "string",
				"default": "",
				"placeholder": "Specialized technical consulting services"
			},
			{
				"name": "category",
				"apiName": "category",
				"displayName": "Category",
				"description": "Product/service category: * PRODUCT - Physical, tangible products * SERVICE - General services * CONSULTING - Consulting and advisory services * SOFTWARE - Development, licenses, SaaS * TRAINING - Courses, workshops, training * OTHER - Other unclassified types",
				"type": "options",
				"options": [
					{
						"name": "— Not set —",
						"value": ""
					},
					{
						"name": "PRODUCT",
						"value": "PRODUCT",
						"description": "Physical, tangible products"
					},
					{
						"name": "SERVICE",
						"value": "SERVICE",
						"description": "General services"
					},
					{
						"name": "CONSULTING",
						"value": "CONSULTING",
						"description": "Consulting and advisory services"
					},
					{
						"name": "SOFTWARE",
						"value": "SOFTWARE",
						"description": "Development, licenses, SaaS"
					},
					{
						"name": "TRAINING",
						"value": "TRAINING",
						"description": "Courses, workshops, training"
					},
					{
						"name": "OTHER",
						"value": "OTHER",
						"description": "Other unclassified types"
					}
				],
				"default": ""
			},
			{
				"name": "default_price",
				"apiName": "default_price",
				"displayName": "Default Price",
				"description": "Suggested default price (optional) (min 0)",
				"validation": {
					"minimum": 0,
					"multipleOf": 0.0001
				},
				"type": "number",
				"default": 0
			},
			{
				"name": "unit",
				"apiName": "unit",
				"displayName": "Unit",
				"description": "Unit of measure (optional) (max 50 characters)",
				"validation": {
					"maxLength": 50
				},
				"type": "string",
				"default": "",
				"placeholder": "hours"
			},
			{
				"name": "main_tax",
				"apiName": "main_tax",
				"displayName": "Main Tax",
				"description": "Complete tax information with cross-validations: - IVA: only percentages 0, 4, 10, 21 - IGIC: only percentages 0, 3, 5, 7, 9.5, 15, 20 - IPSI: only percentages 0.5, 1, 2, 4, 8, 10 - OTHER: any percentage between 0 and 100",
				"type": "fixedCollection",
				"fields": [
					{
						"name": "type",
						"apiName": "type",
						"displayName": "Type",
						"description": "Tax type by territory: - IVA: Iberian Peninsula and Balearic Islands (0%, 4%, 10%, 21%) - IGIC: Canary Islands (0%, 3%, 5%, 7%, 9.5%, 15%, 20%) - IPSI: Ceuta and Melilla (0.5%, 1%, 2%, 4%, 8%, 10%) - OTHER: Configurable 0%-100%",
						"required": true,
						"type": "options",
						"options": [
							{
								"name": "IVA",
								"value": "IVA",
								"description": "Iberian Peninsula and Balearic Islands (0%, 4%, 10%, 21%)"
							},
							{
								"name": "IGIC",
								"value": "IGIC",
								"description": "Canary Islands (0%, 3%, 5%, 7%, 9.5%, 15%, 20%)"
							},
							{
								"name": "IPSI",
								"value": "IPSI",
								"description": "Ceuta and Melilla (0.5%, 1%, 2%, 4%, 8%, 10%)"
							},
							{
								"name": "OTHER",
								"value": "OTHER",
								"description": "Configurable 0%-100%"
							}
						],
						"default": "IVA"
					},
					{
						"name": "percentage_IVA",
						"apiName": "percentage",
						"displayName": "Percentage",
						"description": "Tax percentage (between 0 and 100) — rates allowed for IVA",
						"required": true,
						"validation": {
							"minimum": 0,
							"maximum": 100
						},
						"type": "options",
						"default": 21,
						"options": [
							{
								"name": "0%",
								"value": 0
							},
							{
								"name": "4%",
								"value": 4
							},
							{
								"name": "10%",
								"value": 10
							},
							{
								"name": "21%",
								"value": 21
							}
						],
						"showWhen": {
							"field": "type",
							"values": [
								"IVA"
							]
						}
					},
					{
						"name": "percentage_IGIC",
						"apiName": "percentage",
						"displayName": "Percentage",
						"description": "Tax percentage (between 0 and 100) — rates allowed for IGIC",
						"required": true,
						"validation": {
							"minimum": 0,
							"maximum": 100
						},
						"type": "options",
						"default": 0,
						"options": [
							{
								"name": "0%",
								"value": 0
							},
							{
								"name": "3%",
								"value": 3
							},
							{
								"name": "5%",
								"value": 5
							},
							{
								"name": "7%",
								"value": 7
							},
							{
								"name": "9.5%",
								"value": 9.5
							},
							{
								"name": "15%",
								"value": 15
							},
							{
								"name": "20%",
								"value": 20
							}
						],
						"showWhen": {
							"field": "type",
							"values": [
								"IGIC"
							]
						}
					},
					{
						"name": "percentage_IPSI",
						"apiName": "percentage",
						"displayName": "Percentage",
						"description": "Tax percentage (between 0 and 100) — rates allowed for IPSI",
						"required": true,
						"validation": {
							"minimum": 0,
							"maximum": 100
						},
						"type": "options",
						"default": 0.5,
						"options": [
							{
								"name": "0.5%",
								"value": 0.5
							},
							{
								"name": "1%",
								"value": 1
							},
							{
								"name": "2%",
								"value": 2
							},
							{
								"name": "4%",
								"value": 4
							},
							{
								"name": "8%",
								"value": 8
							},
							{
								"name": "10%",
								"value": 10
							}
						],
						"showWhen": {
							"field": "type",
							"values": [
								"IPSI"
							]
						}
					},
					{
						"name": "percentage_OTHER",
						"apiName": "percentage",
						"displayName": "Percentage",
						"description": "Tax percentage (between 0 and 100)",
						"required": true,
						"validation": {
							"minimum": 0,
							"maximum": 100
						},
						"type": "number",
						"default": 0,
						"showWhen": {
							"field": "type",
							"values": [
								"OTHER"
							]
						}
					},
					{
						"name": "regime_key",
						"apiName": "regime_key",
						"displayName": "Regime Key",
						"description": "Regime key according to VeriFactu regulations: - 01: General regime operation - 02: Export - 03: Used goods, art, antiques - 04: Investment gold - 05: Travel agencies - 06: Group of entities - 07: Cash basis - 08: IPSI/IVA/IGIC operations - 09: Mediating agencies - 10: Third-party collections - 1...",
						"type": "options",
						"options": [
							{
								"name": "01",
								"value": "01",
								"description": "General regime operation"
							},
							{
								"name": "02",
								"value": "02",
								"description": "Export"
							},
							{
								"name": "03",
								"value": "03",
								"description": "Used goods, art, antiques"
							},
							{
								"name": "04",
								"value": "04",
								"description": "Investment gold"
							},
							{
								"name": "05",
								"value": "05",
								"description": "Travel agencies"
							},
							{
								"name": "06",
								"value": "06",
								"description": "Group of entities"
							},
							{
								"name": "07",
								"value": "07",
								"description": "Cash basis"
							},
							{
								"name": "08",
								"value": "08",
								"description": "IPSI/IVA/IGIC operations"
							},
							{
								"name": "09",
								"value": "09",
								"description": "Mediating agencies"
							},
							{
								"name": "10",
								"value": "10",
								"description": "Third-party collections"
							},
							{
								"name": "11",
								"value": "11",
								"description": "Local rental"
							},
							{
								"name": "14",
								"value": "14",
								"description": "VAT pending in certifications"
							},
							{
								"name": "15",
								"value": "15",
								"description": "VAT pending successive tract"
							},
							{
								"name": "17",
								"value": "17",
								"description": "OSS and IOSS"
							},
							{
								"name": "18",
								"value": "18",
								"description": "Equivalence surcharge"
							},
							{
								"name": "19",
								"value": "19",
								"description": "REAGYP"
							},
							{
								"name": "20",
								"value": "20",
								"description": "Simplified regime"
							}
						],
						"default": "01"
					}
				],
				"default": {}
			},
			{
				"name": "equivalence_surcharge",
				"apiName": "equivalence_surcharge",
				"displayName": "Equivalence Surcharge",
				"description": "Equivalence surcharge percentage (optional) (between 0 and 100)",
				"validation": {
					"minimum": 0,
					"maximum": 100,
					"multipleOf": 0.01
				},
				"type": "number",
				"default": 0
			},
			{
				"name": "irpf",
				"apiName": "irpf",
				"displayName": "IRPF",
				"description": "IRPF withholding percentage (optional) (between 0 and 100)",
				"validation": {
					"minimum": 0,
					"maximum": 100,
					"multipleOf": 0.01
				},
				"type": "number",
				"default": 0
			},
			{
				"name": "active",
				"apiName": "active",
				"displayName": "Active",
				"description": "Indicates whether the product is active",
				"type": "boolean",
				"default": false
			}
		],
		"filters": [],
		"optionalCollectionName": "updateFields",
		"queryParamNames": [],
		"paginated": false,
		"isList": false,
		"listKey": ""
	},
	{
		"resource": "product",
		"operation": "delete",
		"displayName": "Delete",
		"action": "Delete product",
		"description": "Deletes a product from catalog",
		"operationId": "deleteProduct",
		"method": "DELETE",
		"path": "/v1/products/{product_id}",
		"pathParams": [
			{
				"name": "productId",
				"apiName": "product_id",
				"displayName": "Product ID",
				"description": "Product unique UUID",
				"required": true,
				"validation": {
					"format": "uuid"
				},
				"type": "string",
				"default": ""
			}
		],
		"requiredFields": [],
		"optionalFields": [],
		"filters": [],
		"optionalCollectionName": "options",
		"queryParamNames": [],
		"paginated": false,
		"isList": false,
		"listKey": ""
	},
	{
		"resource": "product",
		"operation": "search",
		"displayName": "Search",
		"action": "Search and autocomplete",
		"description": "Optimized endpoint for active product autocomplete",
		"operationId": "searchProducts",
		"method": "GET",
		"path": "/v1/products/search",
		"pathParams": [],
		"requiredFields": [],
		"optionalFields": [],
		"filters": [
			{
				"name": "q",
				"apiName": "q",
				"displayName": "Search Query",
				"description": "Search term (empty to get recent products)",
				"validation": {
					"maxLength": 100
				},
				"type": "string",
				"default": ""
			},
			{
				"name": "limit",
				"apiName": "limit",
				"displayName": "Limit",
				"description": "Result limit (max 20)",
				"validation": {
					"minimum": 1,
					"maximum": 20
				},
				"type": "number",
				"default": 10,
				"numberPrecision": 0
			}
		],
		"optionalCollectionName": "options",
		"queryParamNames": [
			"q",
			"limit"
		],
		"paginated": false,
		"isList": true,
		"listKey": ""
	},
	{
		"resource": "series",
		"operation": "getAll",
		"displayName": "Get Many",
		"action": "List invoice series",
		"description": "Retrieves all invoice series for the user",
		"operationId": "listSeries",
		"method": "GET",
		"path": "/v1/configuration/series",
		"pathParams": [],
		"requiredFields": [],
		"optionalFields": [],
		"filters": [
			{
				"name": "active",
				"apiName": "active",
				"displayName": "Active",
				"description": "Filter by active/inactive series",
				"type": "boolean",
				"default": false
			}
		],
		"optionalCollectionName": "options",
		"queryParamNames": [
			"active"
		],
		"paginated": false,
		"isList": true,
		"listKey": ""
	},
	{
		"resource": "series",
		"operation": "create",
		"displayName": "Create",
		"action": "Create invoice series",
		"description": "Creates a new invoice series",
		"operationId": "createSeries",
		"method": "POST",
		"path": "/v1/configuration/series",
		"pathParams": [],
		"requiredFields": [
			{
				"name": "name_series_create",
				"apiName": "name",
				"displayName": "Name",
				"description": "Descriptive name of the series (max 100 characters)",
				"required": true,
				"validation": {
					"minLength": 1,
					"maxLength": 100
				},
				"type": "string",
				"default": "",
				"placeholder": "Main Series"
			},
			{
				"name": "code",
				"apiName": "code",
				"displayName": "Code",
				"description": "Alphanumeric series code (used in {CODIGO} variable) (max 50 characters)",
				"required": true,
				"validation": {
					"pattern": "^[A-Z0-9\\-_]{1,50}$",
					"minLength": 1,
					"maxLength": 50
				},
				"type": "string",
				"default": "",
				"placeholder": "FAC"
			},
			{
				"name": "format",
				"apiName": "format",
				"displayName": "Format",
				"description": "Format template with available variables (UPPERCASE ONLY): - {CODIGO}: Series code (e.g., \"FAC\") - {YYYY}: Year with 4 digits (e.g., \"2025\") - {YY}: Year with 2 digits (e.g., \"25\") - {MM}: Month with 2 digits (e.g., \"01\") - {NUM}: Sequential number without padding (e.g., \"1\") - {NUM:X}: Sequentia... (max 255 characters)",
				"required": true,
				"validation": {
					"pattern": "^[A-Z0-9\\-_/{}:]*$",
					"minLength": 1,
					"maxLength": 255
				},
				"type": "string",
				"default": "",
				"placeholder": "{CODIGO}-{YYYY}-{NUM:4}"
			},
			{
				"name": "counter_reset",
				"apiName": "counter_reset",
				"displayName": "Counter Reset",
				"description": "Counter reset policy: - NEVER: Counter never resets (continuous numbering) - ANNUAL: Counter resets yearly - MONTHLY: Counter resets monthly",
				"required": true,
				"type": "options",
				"options": [
					{
						"name": "NEVER",
						"value": "NEVER",
						"description": "Counter never resets (continuous numbering)"
					},
					{
						"name": "ANNUAL",
						"value": "ANNUAL",
						"description": "Counter resets yearly"
					},
					{
						"name": "MONTHLY",
						"value": "MONTHLY",
						"description": "Counter resets monthly"
					}
				],
				"default": "ANNUAL"
			}
		],
		"optionalFields": [
			{
				"name": "description",
				"apiName": "description",
				"displayName": "Description",
				"description": "Optional series description (max 1000 characters)",
				"validation": {
					"maxLength": 1000
				},
				"type": "string",
				"default": "",
				"placeholder": "Series for standard invoices"
			},
			{
				"name": "initial_number",
				"apiName": "initial_number",
				"displayName": "Initial Number",
				"description": "Initial number for this series counter (between 1 and 999999)",
				"validation": {
					"minimum": 1,
					"maximum": 999999,
					"format": "int64"
				},
				"type": "number",
				"default": 1,
				"numberPrecision": 0
			},
			{
				"name": "active",
				"apiName": "active",
				"displayName": "Active",
				"description": "Whether the series is active",
				"type": "boolean",
				"default": true
			},
			{
				"name": "default_series",
				"apiName": "default_series",
				"displayName": "Default Series",
				"description": "Whether this is the default series",
				"type": "boolean",
				"default": false
			}
		],
		"filters": [],
		"optionalCollectionName": "additionalFields",
		"queryParamNames": [],
		"paginated": false,
		"isList": false,
		"listKey": ""
	},
	{
		"resource": "series",
		"operation": "update",
		"displayName": "Update",
		"action": "Update invoice series",
		"description": "Updates an existing invoice series",
		"operationId": "updateSeries",
		"method": "PUT",
		"path": "/v1/configuration/series/{series_id}",
		"pathParams": [
			{
				"name": "seriesId",
				"apiName": "series_id",
				"displayName": "Series ID",
				"description": "Series ID",
				"required": true,
				"validation": {
					"format": "uuid"
				},
				"type": "options",
				"loadOptionsMethod": "getSeries",
				"default": ""
			}
		],
		"requiredFields": [],
		"optionalFields": [
			{
				"name": "name",
				"apiName": "name",
				"displayName": "Name",
				"description": "Descriptive name of the series (max 100 characters)",
				"validation": {
					"minLength": 1,
					"maxLength": 100
				},
				"type": "string",
				"default": "",
				"placeholder": "Main Series"
			},
			{
				"name": "code",
				"apiName": "code",
				"displayName": "Code",
				"description": "Alphanumeric series code (used in {CODIGO} variable) (max 50 characters)",
				"validation": {
					"pattern": "^[A-Z0-9\\-_]{1,50}$",
					"minLength": 1,
					"maxLength": 50
				},
				"type": "string",
				"default": "",
				"placeholder": "FAC"
			},
			{
				"name": "description",
				"apiName": "description",
				"displayName": "Description",
				"description": "Optional series description (max 1000 characters)",
				"validation": {
					"maxLength": 1000
				},
				"type": "string",
				"default": "",
				"placeholder": "Series for standard invoices"
			},
			{
				"name": "format",
				"apiName": "format",
				"displayName": "Format",
				"description": "Format template with available variables (UPPERCASE ONLY): - {CODIGO}: Series code (e.g., \"FAC\") - {YYYY}: Year with 4 digits (e.g., \"2025\") - {YY}: Year with 2 digits (e.g., \"25\") - {MM}: Month with 2 digits (e.g., \"01\") - {NUM}: Sequential number without padding (e.g., \"1\") - {NUM:X}: Sequentia... (max 255 characters)",
				"validation": {
					"pattern": "^[A-Z0-9\\-_/{}:]*$",
					"minLength": 1,
					"maxLength": 255
				},
				"type": "string",
				"default": "",
				"placeholder": "{CODIGO}-{YYYY}-{NUM:4}"
			},
			{
				"name": "counter_reset",
				"apiName": "counter_reset",
				"displayName": "Counter Reset",
				"description": "Counter reset policy: - NEVER: Counter never resets (continuous numbering) - ANNUAL: Counter resets yearly - MONTHLY: Counter resets monthly",
				"type": "options",
				"options": [
					{
						"name": "NEVER",
						"value": "NEVER",
						"description": "Counter never resets (continuous numbering)"
					},
					{
						"name": "ANNUAL",
						"value": "ANNUAL",
						"description": "Counter resets yearly"
					},
					{
						"name": "MONTHLY",
						"value": "MONTHLY",
						"description": "Counter resets monthly"
					}
				],
				"default": "ANNUAL"
			},
			{
				"name": "initial_number",
				"apiName": "initial_number",
				"displayName": "Initial Number",
				"description": "Initial number for this series counter (between 1 and 999999)",
				"validation": {
					"minimum": 1,
					"maximum": 999999,
					"format": "int64"
				},
				"type": "number",
				"default": 0,
				"numberPrecision": 0
			},
			{
				"name": "active",
				"apiName": "active",
				"displayName": "Active",
				"description": "Whether the series is active",
				"type": "boolean",
				"default": false
			},
			{
				"name": "default_series",
				"apiName": "default_series",
				"displayName": "Default Series",
				"description": "Whether this is the default series",
				"type": "boolean",
				"default": false
			}
		],
		"filters": [],
		"optionalCollectionName": "updateFields",
		"queryParamNames": [],
		"paginated": false,
		"isList": false,
		"listKey": ""
	},
	{
		"resource": "series",
		"operation": "delete",
		"displayName": "Delete",
		"action": "Delete series",
		"description": "Soft-deletes an invoice series",
		"operationId": "deleteSeries",
		"method": "DELETE",
		"path": "/v1/configuration/series/{series_id}",
		"pathParams": [
			{
				"name": "seriesId",
				"apiName": "series_id",
				"displayName": "Series ID",
				"description": "Series ID",
				"required": true,
				"validation": {
					"format": "uuid"
				},
				"type": "options",
				"loadOptionsMethod": "getSeries",
				"default": ""
			}
		],
		"requiredFields": [],
		"optionalFields": [],
		"filters": [],
		"optionalCollectionName": "options",
		"queryParamNames": [],
		"paginated": false,
		"isList": false,
		"listKey": ""
	},
	{
		"resource": "series",
		"operation": "setDefault",
		"displayName": "Set Default",
		"action": "Mark series as default",
		"description": "Marks an invoice series as the user's default",
		"operationId": "setDefaultSeries",
		"method": "POST",
		"path": "/v1/configuration/series/{series_id}/default",
		"pathParams": [
			{
				"name": "seriesId",
				"apiName": "series_id",
				"displayName": "Series ID",
				"description": "Series ID to mark as default",
				"required": true,
				"validation": {
					"format": "uuid"
				},
				"type": "options",
				"loadOptionsMethod": "getSeries",
				"default": ""
			}
		],
		"requiredFields": [],
		"optionalFields": [],
		"filters": [],
		"optionalCollectionName": "options",
		"queryParamNames": [],
		"paginated": false,
		"isList": false,
		"listKey": ""
	},
	{
		"resource": "recurringInvoice",
		"operation": "create",
		"displayName": "Create",
		"action": "Create a recurring invoice from scratch",
		"description": "Creates a new recurring invoice template with all template data (lines, recipient, series, payment) and recurrence configuration, without needing an existing invoice",
		"operationId": "createRecurringInvoice",
		"method": "POST",
		"path": "/v1/recurring-invoices",
		"pathParams": [],
		"requiredFields": [
			{
				"name": "name",
				"apiName": "name",
				"displayName": "Name",
				"description": "Format: max 255 characters",
				"required": true,
				"validation": {
					"maxLength": 255
				},
				"type": "string",
				"default": ""
			},
			{
				"name": "day_of_month",
				"apiName": "day_of_month",
				"displayName": "Day Of Month",
				"description": "Format: between 1 and 31",
				"required": true,
				"validation": {
					"minimum": 1,
					"maximum": 31
				},
				"type": "number",
				"default": 0,
				"numberPrecision": 0
			},
			{
				"name": "start_date",
				"apiName": "start_date",
				"displayName": "Start Date",
				"description": "Format: YYYY-MM-DD",
				"required": true,
				"validation": {
					"format": "date"
				},
				"type": "string",
				"default": ""
			},
			{
				"name": "series_id",
				"apiName": "series_id",
				"displayName": "Series ID",
				"required": true,
				"validation": {
					"format": "uuid"
				},
				"type": "options",
				"loadOptionsMethod": "getSeries",
				"default": ""
			},
			{
				"name": "invoice_type",
				"apiName": "invoice_type",
				"displayName": "Invoice Type",
				"required": true,
				"type": "options",
				"options": [
					{
						"name": "STANDARD",
						"value": "STANDARD"
					},
					{
						"name": "SIMPLIFIED",
						"value": "SIMPLIFIED"
					}
				],
				"default": "STANDARD"
			},
			{
				"name": "lines_recurringInvoice_create",
				"apiName": "lines",
				"displayName": "Lines",
				"required": true,
				"validation": {
					"minItems": 1
				},
				"type": "fixedCollection",
				"fields": [
					{
						"name": "description",
						"apiName": "description",
						"displayName": "Description",
						"description": "Format: max 500 characters",
						"required": true,
						"validation": {
							"maxLength": 500
						},
						"type": "string",
						"default": ""
					},
					{
						"name": "quantity",
						"apiName": "quantity",
						"displayName": "Quantity",
						"description": "Format: min 0.01",
						"required": true,
						"validation": {
							"minimum": 0.01
						},
						"type": "number",
						"default": 0
					},
					{
						"name": "unit",
						"apiName": "unit",
						"displayName": "Unit",
						"description": "Format: max 20 characters",
						"validation": {
							"maxLength": 20
						},
						"type": "string",
						"default": ""
					},
					{
						"name": "unit_price",
						"apiName": "unit_price",
						"displayName": "Unit Price",
						"description": "Format: min 0",
						"required": true,
						"validation": {
							"minimum": 0
						},
						"type": "number",
						"default": 0
					},
					{
						"name": "discount_percentage",
						"apiName": "discount_percentage",
						"displayName": "Discount Percentage",
						"description": "Format: between 0 and 100",
						"validation": {
							"minimum": 0,
							"maximum": 100
						},
						"type": "number",
						"default": 0
					},
					{
						"name": "tax_type",
						"apiName": "tax_type",
						"displayName": "Tax Type",
						"type": "string",
						"default": "IVA"
					},
					{
						"name": "vat_rate",
						"apiName": "vat_rate",
						"displayName": "Vat Rate",
						"required": true,
						"type": "number",
						"default": 0
					},
					{
						"name": "regime_key",
						"apiName": "regime_key",
						"displayName": "Regime Key",
						"type": "string",
						"default": "01"
					},
					{
						"name": "equivalence_surcharge_rate",
						"apiName": "equivalence_surcharge_rate",
						"displayName": "Equivalence Surcharge Rate",
						"type": "number",
						"default": 0
					},
					{
						"name": "irpf_rate",
						"apiName": "irpf_rate",
						"displayName": "IRPF Rate",
						"type": "number",
						"default": 0
					}
				],
				"multipleValues": true,
				"default": {}
			}
		],
		"optionalFields": [
			{
				"name": "preview_days",
				"apiName": "preview_days",
				"displayName": "Preview Days",
				"description": "Days before emission date to create a draft for review (between 0 and 30)",
				"validation": {
					"minimum": 0,
					"maximum": 30
				},
				"type": "number",
				"default": 0,
				"numberPrecision": 0
			},
			{
				"name": "end_date",
				"apiName": "end_date",
				"displayName": "End Date",
				"description": "Format: YYYY-MM-DD",
				"validation": {
					"format": "date"
				},
				"type": "string",
				"default": ""
			},
			{
				"name": "customer_id",
				"apiName": "customer_id",
				"displayName": "Customer ID",
				"validation": {
					"format": "uuid"
				},
				"type": "options",
				"loadOptionsMethod": "getCustomers",
				"default": ""
			},
			{
				"name": "payment_method",
				"apiName": "payment_method",
				"displayName": "Payment Method",
				"description": "Payment method for invoices and recurring invoices",
				"type": "options",
				"options": [
					{
						"name": "— Not set —",
						"value": ""
					},
					{
						"name": "NONE",
						"value": "NONE"
					},
					{
						"name": "BANK TRANSFER",
						"value": "BANK_TRANSFER"
					},
					{
						"name": "CARD",
						"value": "CARD"
					},
					{
						"name": "CASH",
						"value": "CASH"
					},
					{
						"name": "CHECK",
						"value": "CHECK"
					},
					{
						"name": "DIRECT DEBIT",
						"value": "DIRECT_DEBIT"
					},
					{
						"name": "OTHER",
						"value": "OTHER"
					}
				],
				"default": ""
			},
			{
				"name": "payment_iban",
				"apiName": "payment_iban",
				"displayName": "Payment IBAN",
				"type": "string",
				"default": ""
			},
			{
				"name": "payment_swift",
				"apiName": "payment_swift",
				"displayName": "Payment SWIFT",
				"type": "string",
				"default": ""
			},
			{
				"name": "payment_term_days",
				"apiName": "payment_term_days",
				"displayName": "Payment Term Days",
				"type": "number",
				"default": 0,
				"numberPrecision": 0
			},
			{
				"name": "notes",
				"apiName": "notes",
				"displayName": "Notes",
				"type": "string",
				"default": ""
			},
			{
				"name": "verifactu_enabled",
				"apiName": "verifactu_enabled",
				"displayName": "Verifactu Enabled",
				"type": "boolean",
				"default": false
			},
			{
				"name": "send_automatically",
				"apiName": "send_automatically",
				"displayName": "Send Automatically",
				"type": "boolean",
				"default": false
			},
			{
				"name": "email_configuration",
				"apiName": "email_configuration",
				"displayName": "Email Configuration",
				"type": "fixedCollection",
				"fields": [
					{
						"name": "recipients",
						"apiName": "recipients",
						"displayName": "Recipients",
						"type": "string",
						"multipleValues": true,
						"default": []
					},
					{
						"name": "cc",
						"apiName": "cc",
						"displayName": "CC",
						"type": "string",
						"multipleValues": true,
						"default": []
					},
					{
						"name": "subject",
						"apiName": "subject",
						"displayName": "Subject",
						"type": "string",
						"default": ""
					},
					{
						"name": "message",
						"apiName": "message",
						"displayName": "Message",
						"type": "string",
						"default": ""
					}
				],
				"default": {}
			}
		],
		"filters": [],
		"optionalCollectionName": "additionalFields",
		"queryParamNames": [],
		"paginated": false,
		"isList": false,
		"listKey": ""
	},
	{
		"resource": "recurringInvoice",
		"operation": "update",
		"displayName": "Update",
		"action": "Update a recurring invoice",
		"description": "Updates the schedule, template lines, or recipient of a recurring invoice",
		"operationId": "updateRecurringInvoice",
		"method": "PUT",
		"path": "/v1/recurring-invoices/{recurring_invoice_id}",
		"pathParams": [
			{
				"name": "recurringInvoiceId",
				"apiName": "recurring_invoice_id",
				"displayName": "Recurring Invoice ID",
				"description": "Format: UUID",
				"required": true,
				"validation": {
					"format": "uuid"
				},
				"type": "string",
				"default": ""
			}
		],
		"requiredFields": [],
		"optionalFields": [
			{
				"name": "name",
				"apiName": "name",
				"displayName": "Name",
				"description": "Format: max 255 characters",
				"validation": {
					"maxLength": 255
				},
				"type": "string",
				"default": ""
			},
			{
				"name": "day_of_month",
				"apiName": "day_of_month",
				"displayName": "Day Of Month",
				"description": "Format: between 1 and 31",
				"validation": {
					"minimum": 1,
					"maximum": 31
				},
				"type": "number",
				"default": 0,
				"numberPrecision": 0
			},
			{
				"name": "start_date",
				"apiName": "start_date",
				"displayName": "Start Date",
				"description": "Format: YYYY-MM-DD",
				"validation": {
					"format": "date"
				},
				"type": "string",
				"default": ""
			},
			{
				"name": "preview_days",
				"apiName": "preview_days",
				"displayName": "Preview Days",
				"description": "Days before emission date to create a draft for review (between 0 and 30)",
				"validation": {
					"minimum": 0,
					"maximum": 30
				},
				"type": "number",
				"default": 0,
				"numberPrecision": 0
			},
			{
				"name": "end_date",
				"apiName": "end_date",
				"displayName": "End Date",
				"description": "Format: YYYY-MM-DD",
				"validation": {
					"format": "date"
				},
				"type": "string",
				"default": ""
			},
			{
				"name": "series_id",
				"apiName": "series_id",
				"displayName": "Series ID",
				"validation": {
					"format": "uuid"
				},
				"type": "options",
				"loadOptionsMethod": "getSeries",
				"default": ""
			},
			{
				"name": "customer_id",
				"apiName": "customer_id",
				"displayName": "Customer ID",
				"validation": {
					"format": "uuid"
				},
				"type": "options",
				"loadOptionsMethod": "getCustomers",
				"default": ""
			},
			{
				"name": "lines",
				"apiName": "lines",
				"displayName": "Lines",
				"validation": {
					"minItems": 1
				},
				"type": "fixedCollection",
				"fields": [
					{
						"name": "description",
						"apiName": "description",
						"displayName": "Description",
						"description": "Format: max 500 characters",
						"required": true,
						"validation": {
							"maxLength": 500
						},
						"type": "string",
						"default": ""
					},
					{
						"name": "quantity",
						"apiName": "quantity",
						"displayName": "Quantity",
						"description": "Format: min 0.01",
						"required": true,
						"validation": {
							"minimum": 0.01
						},
						"type": "number",
						"default": 0
					},
					{
						"name": "unit",
						"apiName": "unit",
						"displayName": "Unit",
						"description": "Format: max 20 characters",
						"validation": {
							"maxLength": 20
						},
						"type": "string",
						"default": ""
					},
					{
						"name": "unit_price",
						"apiName": "unit_price",
						"displayName": "Unit Price",
						"description": "Format: min 0",
						"required": true,
						"validation": {
							"minimum": 0
						},
						"type": "number",
						"default": 0
					},
					{
						"name": "discount_percentage",
						"apiName": "discount_percentage",
						"displayName": "Discount Percentage",
						"description": "Format: between 0 and 100",
						"validation": {
							"minimum": 0,
							"maximum": 100
						},
						"type": "number",
						"default": 0
					},
					{
						"name": "tax_type",
						"apiName": "tax_type",
						"displayName": "Tax Type",
						"type": "string",
						"default": "IVA"
					},
					{
						"name": "vat_rate",
						"apiName": "vat_rate",
						"displayName": "Vat Rate",
						"required": true,
						"type": "number",
						"default": 0
					},
					{
						"name": "regime_key",
						"apiName": "regime_key",
						"displayName": "Regime Key",
						"type": "string",
						"default": "01"
					},
					{
						"name": "equivalence_surcharge_rate",
						"apiName": "equivalence_surcharge_rate",
						"displayName": "Equivalence Surcharge Rate",
						"type": "number",
						"default": 0
					},
					{
						"name": "irpf_rate",
						"apiName": "irpf_rate",
						"displayName": "IRPF Rate",
						"type": "number",
						"default": 0
					}
				],
				"multipleValues": true,
				"default": {}
			},
			{
				"name": "payment_method",
				"apiName": "payment_method",
				"displayName": "Payment Method",
				"description": "Payment method for invoices and recurring invoices",
				"type": "options",
				"options": [
					{
						"name": "— Not set —",
						"value": ""
					},
					{
						"name": "NONE",
						"value": "NONE"
					},
					{
						"name": "BANK TRANSFER",
						"value": "BANK_TRANSFER"
					},
					{
						"name": "CARD",
						"value": "CARD"
					},
					{
						"name": "CASH",
						"value": "CASH"
					},
					{
						"name": "CHECK",
						"value": "CHECK"
					},
					{
						"name": "DIRECT DEBIT",
						"value": "DIRECT_DEBIT"
					},
					{
						"name": "OTHER",
						"value": "OTHER"
					}
				],
				"default": ""
			},
			{
				"name": "payment_iban",
				"apiName": "payment_iban",
				"displayName": "Payment IBAN",
				"type": "string",
				"default": ""
			},
			{
				"name": "payment_swift",
				"apiName": "payment_swift",
				"displayName": "Payment SWIFT",
				"type": "string",
				"default": ""
			},
			{
				"name": "payment_term_days",
				"apiName": "payment_term_days",
				"displayName": "Payment Term Days",
				"type": "number",
				"default": 0,
				"numberPrecision": 0
			},
			{
				"name": "notes",
				"apiName": "notes",
				"displayName": "Notes",
				"type": "string",
				"default": ""
			},
			{
				"name": "verifactu_enabled",
				"apiName": "verifactu_enabled",
				"displayName": "Verifactu Enabled",
				"type": "boolean",
				"default": false
			},
			{
				"name": "send_automatically",
				"apiName": "send_automatically",
				"displayName": "Send Automatically",
				"type": "boolean",
				"default": false
			},
			{
				"name": "email_configuration",
				"apiName": "email_configuration",
				"displayName": "Email Configuration",
				"type": "fixedCollection",
				"fields": [
					{
						"name": "recipients",
						"apiName": "recipients",
						"displayName": "Recipients",
						"type": "string",
						"multipleValues": true,
						"default": []
					},
					{
						"name": "cc",
						"apiName": "cc",
						"displayName": "CC",
						"type": "string",
						"multipleValues": true,
						"default": []
					},
					{
						"name": "subject",
						"apiName": "subject",
						"displayName": "Subject",
						"type": "string",
						"default": ""
					},
					{
						"name": "message",
						"apiName": "message",
						"displayName": "Message",
						"type": "string",
						"default": ""
					}
				],
				"default": {}
			}
		],
		"filters": [],
		"optionalCollectionName": "updateFields",
		"queryParamNames": [],
		"paginated": false,
		"isList": false,
		"listKey": ""
	},
	{
		"resource": "recurringInvoice",
		"operation": "getAll",
		"displayName": "Get Many",
		"action": "List recurring invoices",
		"description": "Lists all recurring invoices for the authenticated user with filters and pagination",
		"operationId": "listRecurringInvoices",
		"method": "GET",
		"path": "/v1/recurring-invoices",
		"pathParams": [],
		"requiredFields": [],
		"optionalFields": [],
		"filters": [
			{
				"name": "status",
				"apiName": "status",
				"displayName": "Status",
				"type": "options",
				"options": [
					{
						"name": "— Not set —",
						"value": ""
					},
					{
						"name": "ACTIVE",
						"value": "ACTIVE"
					},
					{
						"name": "PAUSED",
						"value": "PAUSED"
					},
					{
						"name": "COMPLETED",
						"value": "COMPLETED"
					}
				],
				"default": ""
			},
			{
				"name": "customer_id",
				"apiName": "customer_id",
				"displayName": "Customer ID",
				"validation": {
					"format": "uuid"
				},
				"type": "options",
				"loadOptionsMethod": "getCustomers",
				"default": ""
			},
			{
				"name": "sortBy",
				"apiName": "sortBy",
				"displayName": "Sort By",
				"type": "options",
				"options": [
					{
						"name": "Name",
						"value": "name"
					},
					{
						"name": "Next Generation",
						"value": "next_generation"
					},
					{
						"name": "Status",
						"value": "status"
					},
					{
						"name": "Created At",
						"value": "created_at"
					}
				],
				"default": "created_at"
			},
			{
				"name": "sortOrder",
				"apiName": "sortOrder",
				"displayName": "Sort Order",
				"type": "options",
				"options": [
					{
						"name": "Asc",
						"value": "asc"
					},
					{
						"name": "Desc",
						"value": "desc"
					}
				],
				"default": "desc"
			}
		],
		"optionalCollectionName": "options",
		"queryParamNames": [
			"status",
			"customer_id",
			"sortBy",
			"sortOrder"
		],
		"paginated": true,
		"isList": true,
		"listKey": ""
	},
	{
		"resource": "recurringInvoice",
		"operation": "get",
		"displayName": "Get",
		"action": "Get a recurring invoice by ID",
		"description": "Retrieves the full details of a recurring invoice including its schedule, template lines, and next generation date",
		"operationId": "getRecurringInvoice",
		"method": "GET",
		"path": "/v1/recurring-invoices/{recurring_invoice_id}",
		"pathParams": [
			{
				"name": "recurringInvoiceId",
				"apiName": "recurring_invoice_id",
				"displayName": "Recurring Invoice ID",
				"description": "Format: UUID",
				"required": true,
				"validation": {
					"format": "uuid"
				},
				"type": "string",
				"default": ""
			}
		],
		"requiredFields": [],
		"optionalFields": [],
		"filters": [],
		"optionalCollectionName": "options",
		"queryParamNames": [],
		"paginated": false,
		"isList": false,
		"listKey": ""
	},
	{
		"resource": "recurringInvoice",
		"operation": "createFromInvoice",
		"displayName": "Create From Invoice",
		"action": "Create a recurring invoice from an existing invoice",
		"description": "Creates a new recurring invoice template using the lines, recipient, and configuration from an existing invoice",
		"operationId": "createRecurringFromInvoice",
		"method": "POST",
		"path": "/v1/invoices/{invoice_id}/create-recurring",
		"pathParams": [
			{
				"name": "invoiceId",
				"apiName": "invoice_id",
				"displayName": "Invoice ID",
				"description": "Format: UUID",
				"required": true,
				"validation": {
					"format": "uuid"
				},
				"type": "string",
				"default": ""
			}
		],
		"requiredFields": [
			{
				"name": "name",
				"apiName": "name",
				"displayName": "Name",
				"description": "Format: max 255 characters",
				"required": true,
				"validation": {
					"maxLength": 255
				},
				"type": "string",
				"default": ""
			},
			{
				"name": "day_of_month",
				"apiName": "day_of_month",
				"displayName": "Day Of Month",
				"description": "Format: between 1 and 31",
				"required": true,
				"validation": {
					"minimum": 1,
					"maximum": 31
				},
				"type": "number",
				"default": 0,
				"numberPrecision": 0
			},
			{
				"name": "start_date",
				"apiName": "start_date",
				"displayName": "Start Date",
				"description": "Format: YYYY-MM-DD",
				"required": true,
				"validation": {
					"format": "date"
				},
				"type": "string",
				"default": ""
			}
		],
		"optionalFields": [
			{
				"name": "end_date",
				"apiName": "end_date",
				"displayName": "End Date",
				"description": "Format: YYYY-MM-DD",
				"validation": {
					"format": "date"
				},
				"type": "string",
				"default": ""
			},
			{
				"name": "verifactu_enabled",
				"apiName": "verifactu_enabled",
				"displayName": "Verifactu Enabled",
				"type": "boolean",
				"default": false
			},
			{
				"name": "send_automatically",
				"apiName": "send_automatically",
				"displayName": "Send Automatically",
				"type": "boolean",
				"default": false
			},
			{
				"name": "email_configuration",
				"apiName": "email_configuration",
				"displayName": "Email Configuration",
				"type": "fixedCollection",
				"fields": [
					{
						"name": "recipients",
						"apiName": "recipients",
						"displayName": "Recipients",
						"type": "string",
						"multipleValues": true,
						"default": []
					},
					{
						"name": "cc",
						"apiName": "cc",
						"displayName": "CC",
						"type": "string",
						"multipleValues": true,
						"default": []
					},
					{
						"name": "subject",
						"apiName": "subject",
						"displayName": "Subject",
						"type": "string",
						"default": ""
					},
					{
						"name": "message",
						"apiName": "message",
						"displayName": "Message",
						"type": "string",
						"default": ""
					}
				],
				"default": {}
			}
		],
		"filters": [],
		"optionalCollectionName": "additionalFields",
		"queryParamNames": [],
		"paginated": false,
		"isList": false,
		"listKey": ""
	},
	{
		"resource": "recurringInvoice",
		"operation": "delete",
		"displayName": "Delete",
		"action": "Delete a recurring invoice",
		"description": "Permanently deletes a recurring invoice and cancels any pending scheduled generations",
		"operationId": "deleteRecurringInvoice",
		"method": "DELETE",
		"path": "/v1/recurring-invoices/{recurring_invoice_id}",
		"pathParams": [
			{
				"name": "recurringInvoiceId",
				"apiName": "recurring_invoice_id",
				"displayName": "Recurring Invoice ID",
				"description": "Format: UUID",
				"required": true,
				"validation": {
					"format": "uuid"
				},
				"type": "string",
				"default": ""
			}
		],
		"requiredFields": [],
		"optionalFields": [],
		"filters": [],
		"optionalCollectionName": "options",
		"queryParamNames": [],
		"paginated": false,
		"isList": false,
		"listKey": ""
	},
	{
		"resource": "recurringInvoice",
		"operation": "pause",
		"displayName": "Pause",
		"action": "Pause a recurring invoice",
		"description": "Pauses automatic invoice generation",
		"operationId": "pauseRecurringInvoice",
		"method": "POST",
		"path": "/v1/recurring-invoices/{recurring_invoice_id}/pause",
		"pathParams": [
			{
				"name": "recurringInvoiceId",
				"apiName": "recurring_invoice_id",
				"displayName": "Recurring Invoice ID",
				"description": "Format: UUID",
				"required": true,
				"validation": {
					"format": "uuid"
				},
				"type": "string",
				"default": ""
			}
		],
		"requiredFields": [],
		"optionalFields": [],
		"filters": [],
		"optionalCollectionName": "options",
		"queryParamNames": [],
		"paginated": false,
		"isList": false,
		"listKey": ""
	},
	{
		"resource": "recurringInvoice",
		"operation": "resume",
		"displayName": "Resume",
		"action": "Resume a paused recurring invoice",
		"description": "Resumes automatic invoice generation for a previously paused recurring invoice",
		"operationId": "resumeRecurringInvoice",
		"method": "POST",
		"path": "/v1/recurring-invoices/{recurring_invoice_id}/resume",
		"pathParams": [
			{
				"name": "recurringInvoiceId",
				"apiName": "recurring_invoice_id",
				"displayName": "Recurring Invoice ID",
				"description": "Format: UUID",
				"required": true,
				"validation": {
					"format": "uuid"
				},
				"type": "string",
				"default": ""
			}
		],
		"requiredFields": [],
		"optionalFields": [],
		"filters": [],
		"optionalCollectionName": "options",
		"queryParamNames": [],
		"paginated": false,
		"isList": false,
		"listKey": ""
	},
	{
		"resource": "recurringInvoice",
		"operation": "generateNow",
		"displayName": "Generate Now",
		"action": "Generate an invoice now from a recurring template",
		"description": "Manually triggers invoice generation from a recurring template",
		"operationId": "generateInvoiceNow",
		"method": "POST",
		"path": "/v1/recurring-invoices/{recurring_invoice_id}/generate",
		"pathParams": [
			{
				"name": "recurringInvoiceId",
				"apiName": "recurring_invoice_id",
				"displayName": "Recurring Invoice ID",
				"description": "Format: UUID",
				"required": true,
				"validation": {
					"format": "uuid"
				},
				"type": "string",
				"default": ""
			}
		],
		"requiredFields": [],
		"optionalFields": [],
		"filters": [],
		"optionalCollectionName": "options",
		"queryParamNames": [],
		"paginated": false,
		"isList": false,
		"listKey": ""
	},
	{
		"resource": "recurringInvoice",
		"operation": "skipNext",
		"displayName": "Skip Next",
		"action": "Skip the next generation",
		"description": "Skips the next scheduled invoice generation and advances the generation date to the following period",
		"operationId": "skipNextGeneration",
		"method": "POST",
		"path": "/v1/recurring-invoices/{recurring_invoice_id}/skip",
		"pathParams": [
			{
				"name": "recurringInvoiceId",
				"apiName": "recurring_invoice_id",
				"displayName": "Recurring Invoice ID",
				"description": "Format: UUID",
				"required": true,
				"validation": {
					"format": "uuid"
				},
				"type": "string",
				"default": ""
			}
		],
		"requiredFields": [],
		"optionalFields": [],
		"filters": [],
		"optionalCollectionName": "options",
		"queryParamNames": [],
		"paginated": false,
		"isList": false,
		"listKey": ""
	},
	{
		"resource": "recurringInvoice",
		"operation": "preview",
		"displayName": "Preview",
		"action": "Preview next invoice from recurring template",
		"description": "Returns a computed preview of what the next invoice would look like when generated from this recurring template",
		"operationId": "previewRecurringInvoice",
		"method": "GET",
		"path": "/v1/recurring-invoices/{recurring_invoice_id}/preview",
		"pathParams": [
			{
				"name": "recurringInvoiceId",
				"apiName": "recurring_invoice_id",
				"displayName": "Recurring Invoice ID",
				"description": "UUID of the recurring invoice template",
				"required": true,
				"validation": {
					"format": "uuid"
				},
				"type": "string",
				"default": ""
			}
		],
		"requiredFields": [],
		"optionalFields": [],
		"filters": [],
		"optionalCollectionName": "options",
		"queryParamNames": [],
		"paginated": false,
		"isList": false,
		"listKey": ""
	},
	{
		"resource": "recurringInvoice",
		"operation": "getHistory",
		"displayName": "Get History",
		"action": "Get generation history for a recurring invoice",
		"description": "Returns the list of invoices previously generated from this recurring template, including their status and generation dates",
		"operationId": "getRecurringHistory",
		"method": "GET",
		"path": "/v1/recurring-invoices/{recurring_invoice_id}/history",
		"pathParams": [
			{
				"name": "recurringInvoiceId",
				"apiName": "recurring_invoice_id",
				"displayName": "Recurring Invoice ID",
				"description": "Format: UUID",
				"required": true,
				"validation": {
					"format": "uuid"
				},
				"type": "string",
				"default": ""
			}
		],
		"requiredFields": [],
		"optionalFields": [],
		"filters": [],
		"optionalCollectionName": "options",
		"queryParamNames": [],
		"paginated": false,
		"isList": true,
		"listKey": ""
	},
	{
		"resource": "configuration",
		"operation": "getTaxConfiguration",
		"displayName": "Get Tax Configuration",
		"action": "Get user tax configuration",
		"description": "Retrieves the user's tax configuration, including: - Default tax regime (VAT, IGIC, IPSI, OTHERS) - Default main tax percentage - IRPF and equivalence surcharge configuration",
		"operationId": "getTaxConfiguration",
		"method": "GET",
		"path": "/v1/configuration/taxes",
		"pathParams": [],
		"requiredFields": [],
		"optionalFields": [],
		"filters": [],
		"optionalCollectionName": "options",
		"queryParamNames": [],
		"paginated": false,
		"isList": false,
		"listKey": ""
	},
	{
		"resource": "configuration",
		"operation": "getTaxTypes",
		"displayName": "Get Tax Types",
		"action": "Get complete tax types catalog",
		"description": "Retrieves the complete catalog of available tax types with structured information for tax configuration in Spain: - **Tax regimes**: VAT (Peninsula), IGIC (Canary Islands), IPSI (Ceuta/Melilla), OTHERS - **Percentages per regime**: Valid percentages for each tax type - **Regime codes**: VeriFactu...",
		"operationId": "getTaxTypes",
		"method": "GET",
		"path": "/v1/configuration/tax-types",
		"pathParams": [],
		"requiredFields": [],
		"optionalFields": [],
		"filters": [],
		"optionalCollectionName": "options",
		"queryParamNames": [],
		"paginated": false,
		"isList": false,
		"listKey": ""
	},
	{
		"resource": "configuration",
		"operation": "getVerifactu",
		"displayName": "Get Verifactu",
		"action": "Get VeriFactu configuration",
		"description": "Retrieves the current VeriFactu configuration",
		"operationId": "getVeriFactuConfiguration",
		"method": "GET",
		"path": "/v1/configuration/verifactu",
		"pathParams": [],
		"requiredFields": [],
		"optionalFields": [],
		"filters": [],
		"optionalCollectionName": "options",
		"queryParamNames": [],
		"paginated": false,
		"isList": false,
		"listKey": ""
	},
	{
		"resource": "configuration",
		"operation": "getInvoiceCustomization",
		"displayName": "Get Invoice Customization",
		"action": "Get invoice customization options",
		"description": "Retrieves available option catalogs to customize invoices: **Template types:** - MODERN_TABLE: Structured table design, ideal for standard products/services - PROFESSIONAL_SERVICE: Text-based design, ideal for notaries/consultancies **Suggested color palette:** - BeeL default colors (orange, blue...",
		"operationId": "getInvoiceCustomizationOptions",
		"method": "GET",
		"path": "/v1/configuration/invoice-customization-options",
		"pathParams": [],
		"requiredFields": [],
		"optionalFields": [],
		"filters": [],
		"optionalCollectionName": "options",
		"queryParamNames": [],
		"paginated": false,
		"isList": false,
		"listKey": ""
	},
	{
		"resource": "nif",
		"operation": "validate",
		"displayName": "Validate",
		"action": "Validate NIF against AEAT registry",
		"description": "**Public endpoint** to validate a NIF/CIF against the AEAT registry using VeriFactu",
		"operationId": "validateNif",
		"method": "POST",
		"path": "/v1/nif/validate",
		"pathParams": [],
		"requiredFields": [
			{
				"name": "nif",
				"apiName": "nif",
				"displayName": "NIF",
				"description": "NIF/CIF to validate against the AEAT census (exactly 9 characters)",
				"required": true,
				"validation": {
					"pattern": "^(\\d{8}[A-Z]|[ABCDEFGHJKLMNPQRSUVW]\\d{7}[A-Z0-9]|[XYZ]\\d{7}[A-Z])$",
					"minLength": 9,
					"maxLength": 9
				},
				"type": "string",
				"default": "",
				"placeholder": "12345678A"
			}
		],
		"optionalFields": [
			{
				"name": "legal_name",
				"apiName": "legal_name",
				"displayName": "Legal Name",
				"description": "Last name and first name (individual) or business name (legal entity) (max 255 characters)",
				"validation": {
					"minLength": 1,
					"maxLength": 255
				},
				"type": "string",
				"default": "",
				"placeholder": "JUAN PEREZ GARCIA"
			}
		],
		"filters": [],
		"optionalCollectionName": "options",
		"queryParamNames": [],
		"paginated": false,
		"isList": false,
		"listKey": ""
	},
	{
		"resource": "company",
		"operation": "create",
		"displayName": "Create",
		"action": "Create a company (sub-account)",
		"description": "Creates a new NIF/company under the authenticated account",
		"operationId": "createCompany",
		"method": "POST",
		"path": "/v1/companies",
		"pathParams": [],
		"requiredFields": [
			{
				"name": "nif_company_create",
				"apiName": "nif",
				"displayName": "NIF",
				"description": "NIF/CIF of the business",
				"required": true,
				"type": "string",
				"default": "",
				"placeholder": "B12345678"
			},
			{
				"name": "legal_name_company_create",
				"apiName": "legal_name",
				"displayName": "Legal Name",
				"description": "Legal/fiscal name",
				"required": true,
				"type": "string",
				"default": "",
				"placeholder": "Mi Empresa SL"
			},
			{
				"name": "entity_type",
				"apiName": "entity_type",
				"displayName": "Entity Type",
				"description": "Type of entity",
				"required": true,
				"type": "options",
				"options": [
					{
						"name": "INDIVIDUAL",
						"value": "INDIVIDUAL"
					},
					{
						"name": "LEGAL ENTITY",
						"value": "LEGAL_ENTITY"
					}
				],
				"default": "INDIVIDUAL"
			},
			{
				"name": "address_street",
				"apiName": "address_street",
				"displayName": "Address Street",
				"required": true,
				"type": "string",
				"default": "",
				"placeholder": "Calle Mayor"
			},
			{
				"name": "address_postal_code",
				"apiName": "address_postal_code",
				"displayName": "Address Postal Code",
				"required": true,
				"type": "string",
				"default": "",
				"placeholder": "28001"
			},
			{
				"name": "address_city",
				"apiName": "address_city",
				"displayName": "Address City",
				"required": true,
				"type": "string",
				"default": "",
				"placeholder": "Madrid"
			},
			{
				"name": "address_province",
				"apiName": "address_province",
				"displayName": "Address Province",
				"required": true,
				"type": "string",
				"default": "",
				"placeholder": "Madrid"
			}
		],
		"optionalFields": [
			{
				"name": "address_number",
				"apiName": "address_number",
				"displayName": "Address Number",
				"type": "string",
				"default": "",
				"placeholder": "10"
			},
			{
				"name": "address_country",
				"apiName": "address_country",
				"displayName": "Address Country",
				"type": "string",
				"default": "ES"
			},
			{
				"name": "legal_form",
				"apiName": "legal_form",
				"displayName": "Legal Form",
				"description": "Required for LEGAL_ENTITY",
				"type": "string",
				"default": ""
			},
			{
				"name": "representative_name",
				"apiName": "representative_name",
				"displayName": "Representative Name",
				"description": "Required for LEGAL_ENTITY",
				"type": "string",
				"default": ""
			},
			{
				"name": "representative_nif",
				"apiName": "representative_nif",
				"displayName": "Representative NIF",
				"description": "Required for LEGAL_ENTITY",
				"type": "string",
				"default": ""
			},
			{
				"name": "business_display_name",
				"apiName": "business_display_name",
				"displayName": "Business Display Name",
				"description": "Optional display name",
				"type": "string",
				"default": ""
			},
			{
				"name": "tax_type",
				"apiName": "tax_type",
				"displayName": "Tax Type",
				"type": "string",
				"default": "IVA"
			},
			{
				"name": "tax_percentage",
				"apiName": "tax_percentage",
				"displayName": "Tax Percentage",
				"type": "number",
				"default": 21
			},
			{
				"name": "irpf_percentage",
				"apiName": "irpf_percentage",
				"displayName": "IRPF Percentage",
				"type": "number",
				"default": 15
			}
		],
		"filters": [],
		"optionalCollectionName": "additionalFields",
		"queryParamNames": [],
		"paginated": false,
		"isList": false,
		"listKey": ""
	},
	{
		"resource": "company",
		"operation": "getAll",
		"displayName": "Get Many",
		"action": "List all companies",
		"description": "Returns all companies (sub-accounts) under the authenticated account",
		"operationId": "listCompanies",
		"method": "GET",
		"path": "/v1/companies",
		"pathParams": [],
		"requiredFields": [],
		"optionalFields": [],
		"filters": [],
		"optionalCollectionName": "options",
		"queryParamNames": [],
		"paginated": false,
		"isList": true,
		"listKey": ""
	},
	{
		"resource": "company",
		"operation": "get",
		"displayName": "Get",
		"action": "Get company details",
		"description": "Returns details of a specific company including VeriFactu status",
		"operationId": "getCompany",
		"method": "GET",
		"path": "/v1/companies/{company_id}",
		"pathParams": [
			{
				"name": "companyId",
				"apiName": "company_id",
				"displayName": "Company ID",
				"description": "Format: UUID",
				"required": true,
				"validation": {
					"format": "uuid"
				},
				"type": "string",
				"default": ""
			}
		],
		"requiredFields": [],
		"optionalFields": [],
		"filters": [],
		"optionalCollectionName": "options",
		"queryParamNames": [],
		"paginated": false,
		"isList": false,
		"listKey": ""
	},
	{
		"resource": "company",
		"operation": "update",
		"displayName": "Update",
		"action": "Update company details",
		"description": "Updates editable fields of a company",
		"operationId": "updateCompany",
		"method": "PATCH",
		"path": "/v1/companies/{company_id}",
		"pathParams": [
			{
				"name": "companyId",
				"apiName": "company_id",
				"displayName": "Company ID",
				"description": "Format: UUID",
				"required": true,
				"validation": {
					"format": "uuid"
				},
				"type": "string",
				"default": ""
			}
		],
		"requiredFields": [],
		"optionalFields": [
			{
				"name": "business_display_name",
				"apiName": "business_display_name",
				"displayName": "Business Display Name",
				"description": "Friendly display name for the company",
				"type": "string",
				"default": ""
			},
			{
				"name": "address_street",
				"apiName": "address_street",
				"displayName": "Address Street",
				"type": "string",
				"default": ""
			},
			{
				"name": "address_number",
				"apiName": "address_number",
				"displayName": "Address Number",
				"type": "string",
				"default": ""
			},
			{
				"name": "address_postal_code",
				"apiName": "address_postal_code",
				"displayName": "Address Postal Code",
				"type": "string",
				"default": ""
			},
			{
				"name": "address_city",
				"apiName": "address_city",
				"displayName": "Address City",
				"type": "string",
				"default": ""
			},
			{
				"name": "address_province",
				"apiName": "address_province",
				"displayName": "Address Province",
				"type": "string",
				"default": ""
			},
			{
				"name": "address_country",
				"apiName": "address_country",
				"displayName": "Address Country",
				"type": "string",
				"default": ""
			}
		],
		"filters": [],
		"optionalCollectionName": "updateFields",
		"queryParamNames": [],
		"paginated": false,
		"isList": false,
		"listKey": ""
	},
	{
		"resource": "company",
		"operation": "delete",
		"displayName": "Delete",
		"action": "Delete a company",
		"description": "Deletes a company (sub-account)",
		"operationId": "deleteCompany",
		"method": "DELETE",
		"path": "/v1/companies/{company_id}",
		"pathParams": [
			{
				"name": "companyId",
				"apiName": "company_id",
				"displayName": "Company ID",
				"description": "Format: UUID",
				"required": true,
				"validation": {
					"format": "uuid"
				},
				"type": "string",
				"default": ""
			}
		],
		"requiredFields": [],
		"optionalFields": [],
		"filters": [],
		"optionalCollectionName": "options",
		"queryParamNames": [],
		"paginated": false,
		"isList": false,
		"listKey": ""
	},
	{
		"resource": "company",
		"operation": "generateRepresentation",
		"displayName": "Generate Representation",
		"action": "Generate unsigned representation PDF",
		"description": "Generates the VeriFactu representation PDF for digital signature",
		"operationId": "generateRepresentation",
		"method": "POST",
		"path": "/v1/companies/{company_id}/representation/generate",
		"pathParams": [
			{
				"name": "companyId",
				"apiName": "company_id",
				"displayName": "Company ID",
				"description": "Format: UUID",
				"required": true,
				"validation": {
					"format": "uuid"
				},
				"type": "string",
				"default": ""
			}
		],
		"requiredFields": [],
		"optionalFields": [],
		"filters": [],
		"optionalCollectionName": "options",
		"queryParamNames": [],
		"paginated": false,
		"isList": false,
		"listKey": ""
	},
	{
		"resource": "company",
		"operation": "downloadRepresentation",
		"displayName": "Download Representation",
		"action": "Download representation PDF",
		"description": "Returns a presigned URL (5min) to download the representation PDF",
		"operationId": "downloadRepresentation",
		"method": "GET",
		"path": "/v1/companies/{company_id}/representation/download",
		"pathParams": [
			{
				"name": "companyId",
				"apiName": "company_id",
				"displayName": "Company ID",
				"description": "Format: UUID",
				"required": true,
				"validation": {
					"format": "uuid"
				},
				"type": "string",
				"default": ""
			}
		],
		"requiredFields": [],
		"optionalFields": [],
		"filters": [],
		"optionalCollectionName": "options",
		"queryParamNames": [],
		"paginated": false,
		"isList": false,
		"listKey": ""
	},
	{
		"resource": "company",
		"operation": "getRepresentationStatus",
		"displayName": "Get Representation Status",
		"action": "Get representation status",
		"description": "Returns the current status of the VeriFactu representation process",
		"operationId": "getRepresentationStatus",
		"method": "GET",
		"path": "/v1/companies/{company_id}/representation/status",
		"pathParams": [
			{
				"name": "companyId",
				"apiName": "company_id",
				"displayName": "Company ID",
				"description": "Format: UUID",
				"required": true,
				"validation": {
					"format": "uuid"
				},
				"type": "string",
				"default": ""
			}
		],
		"requiredFields": [],
		"optionalFields": [],
		"filters": [],
		"optionalCollectionName": "options",
		"queryParamNames": [],
		"paginated": false,
		"isList": false,
		"listKey": ""
	},
	{
		"resource": "company",
		"operation": "cancelRepresentation",
		"displayName": "Cancel Representation",
		"action": "Cancel representation",
		"description": "Cancels the current representation process",
		"operationId": "cancelRepresentation",
		"method": "DELETE",
		"path": "/v1/companies/{company_id}/representation/cancel",
		"pathParams": [
			{
				"name": "companyId",
				"apiName": "company_id",
				"displayName": "Company ID",
				"description": "Format: UUID",
				"required": true,
				"validation": {
					"format": "uuid"
				},
				"type": "string",
				"default": ""
			}
		],
		"requiredFields": [],
		"optionalFields": [],
		"filters": [],
		"optionalCollectionName": "options",
		"queryParamNames": [],
		"paginated": false,
		"isList": false,
		"listKey": ""
	}
];
