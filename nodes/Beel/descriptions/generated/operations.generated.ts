/**
 * GENERATED FILE — DO NOT EDIT.
 *
 * Produced by `npm run generate` from `openapi/public-api.yaml`
 * (BeeL Public API 1.7.1).
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
		"action": "List the invoices of a company",
		"description": "Returns a paginated list of the invoices issued under this company (NIF), with the same filters as the flat route",
		"operationId": "listCompanyInvoices",
		"method": "GET",
		"path": "/v1/companies/{company_id}/invoices",
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
				"validation": {
					"minItems": 1
				},
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
					},
					{
						"name": "CONVERTED",
						"value": "CONVERTED",
						"description": "Proforma converted into an invoice (terminal; the proforma survives"
					},
					{
						"name": "ACTIVE",
						"value": "ACTIVE",
						"description": "Active proforma. The single working state of a proforma (non-fiscal"
					},
					{
						"name": "EXPIRED",
						"value": "EXPIRED",
						"description": "Proforma whose offer validity (`valid_until`) has passed. Derived on read"
					}
				],
				"multipleValues": true,
				"default": []
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
						"description": "Simplified invoice without all recipient requirements (up to 3,000€ VAT included)"
					},
					{
						"name": "PROFORMA",
						"value": "PROFORMA",
						"description": "Commercial document (formal quote) with no fiscal validity."
					}
				],
				"default": ""
			},
			{
				"name": "fiscal_only",
				"apiName": "fiscal_only",
				"displayName": "Fiscal Only",
				"description": "When `true`, returns only fiscal documents (STANDARD, CORRECTIVE, SIMPLIFIED), excluding proformas and any other non-fiscal document",
				"type": "boolean",
				"default": false
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
				"name": "external_ref",
				"apiName": "external_ref",
				"displayName": "External Ref",
				"description": "Filter by exact external reference (client-supplied order/cart/contract id)",
				"type": "string",
				"default": ""
			},
			{
				"name": "rectified_invoice_id",
				"apiName": "rectified_invoice_id",
				"displayName": "Rectified Invoice ID",
				"description": "Return the corrective invoices that correct this invoice",
				"validation": {
					"format": "uuid"
				},
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
				"description": "Filter by the VeriFactu submission status of the invoice, using the very same vocabulary that `verifactu.submission_status` publishes on each invoice",
				"type": "options",
				"options": [
					{
						"name": "— Not set —",
						"value": ""
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
						"name": "VOIDED",
						"value": "VOIDED"
					},
					{
						"name": "REJECTED",
						"value": "REJECTED"
					}
				],
				"default": ""
			},
			{
				"name": "verifactu_enabled",
				"apiName": "verifactu_enabled",
				"displayName": "Verifactu Enabled",
				"description": "Filter by whether VeriFactu is enabled for the invoice — the same flag published as `verifactu.enabled`",
				"type": "boolean",
				"default": false
			},
			{
				"name": "metadata",
				"apiName": "metadata",
				"displayName": "Metadata",
				"description": "Filter by metadata key/value pairs (exact match, AND between keys)",
				"type": "json",
				"default": "{}"
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
			"fiscal_only",
			"customer_id",
			"date_from",
			"date_to",
			"invoice_number",
			"recipient_name",
			"recipient_nif",
			"series_code",
			"external_ref",
			"rectified_invoice_id",
			"taxable_base_min",
			"taxable_base_max",
			"total_min",
			"total_max",
			"verifactu_status",
			"verifactu_enabled",
			"metadata",
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
		"action": "Create an invoice for a company",
		"description": "Creates a new invoice under this company (NIF)",
		"operationId": "createCompanyInvoice",
		"method": "POST",
		"path": "/v1/companies/{company_id}/invoices",
		"pathParams": [],
		"requiredFields": [
			{
				"name": "type",
				"apiName": "type",
				"displayName": "Type",
				"description": "Invoice type to create",
				"required": true,
				"type": "options",
				"options": [
					{
						"name": "STANDARD",
						"value": "STANDARD"
					},
					{
						"name": "CORRECTIVE",
						"value": "CORRECTIVE"
					},
					{
						"name": "SIMPLIFIED",
						"value": "SIMPLIFIED"
					},
					{
						"name": "PROFORMA",
						"value": "PROFORMA"
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
						"placeholder": "My Company Ltd"
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
						"placeholder": "My Company"
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
						"description": "Identifier type",
						"type": "options",
						"options": [
							{
								"name": "NIF IVA",
								"value": "NIF_IVA"
							},
							{
								"name": "PASSPORT",
								"value": "PASSPORT"
							},
							{
								"name": "COUNTRY ID",
								"value": "COUNTRY_ID"
							},
							{
								"name": "RESIDENCE CERTIFICATE",
								"value": "RESIDENCE_CERTIFICATE"
							},
							{
								"name": "OTHER DOCUMENT",
								"value": "OTHER_DOCUMENT"
							},
							{
								"name": "NOT REGISTERED",
								"value": "NOT_REGISTERED"
							},
							{
								"name": "02",
								"value": "02"
							},
							{
								"name": "03",
								"value": "03"
							},
							{
								"name": "04",
								"value": "04"
							},
							{
								"name": "05",
								"value": "05"
							},
							{
								"name": "06",
								"value": "06"
							},
							{
								"name": "07",
								"value": "07"
							}
						],
						"default": "NIF_IVA",
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
						"placeholder": "123 Main Street",
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
						"placeholder": "2nd floor, Apt A",
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
						"description": "The country name in Spanish, e.g. España for Spain — this is what BeeL's API expects (max 100 characters)",
						"validation": {
							"pattern": "^[a-zA-Z0-9À-ÿ\\u0100-\\u017F\\u00B7\\u2018\\u2019\\u0060\\u00B4\\s\\.,\\-\\/'ºª]+$",
							"minLength": 1,
							"maxLength": 100
						},
						"type": "string",
						"default": "",
						"placeholder": "Spain",
						"required": false
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
						"default": "",
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
						"description": "Description of invoiced concept (max 2000 characters)",
						"validation": {
							"maxLength": 2000
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
						"validation": {
							"minimum": 0,
							"maximum": 999999.9999,
							"exclusiveMinimum": true
						},
						"type": "number",
						"default": 0
					},
					{
						"name": "total_excluding_tax",
						"apiName": "total_excluding_tax",
						"displayName": "Total Excluding Tax",
						"description": "Declared line total excluding taxes (total-declared mode, e.g (max 99999999.99)",
						"validation": {
							"maximum": 99999999.99
						},
						"type": "number",
						"default": 0
					},
					{
						"name": "total_including_tax",
						"apiName": "total_including_tax",
						"displayName": "Total Including Tax",
						"description": "Declared line total including taxes (tax-inclusive total-declared mode): what the customer paid for this line — taxable base + VAT + equivalence surcharge (max 99999999.99)",
						"validation": {
							"maximum": 99999999.99
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
						"description": "Regime key according to VeriFactu regulations",
						"type": "options",
						"options": [
							{
								"name": "— Not set —",
								"value": ""
							},
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
						"default": "",
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
								"name": "0 625",
								"value": 0.625
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
						"description": "IRPF withholding rate for this line",
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
								"name": "Exempt — Art. 20 LIVA",
								"value": "EXENTA_ART_20"
							},
							{
								"name": "Exempt — Art. 21 LIVA",
								"value": "EXENTA_ART_21"
							},
							{
								"name": "Exempt — Art. 22 LIVA",
								"value": "EXENTA_ART_22"
							},
							{
								"name": "Exempt — Art. 24 LIVA",
								"value": "EXENTA_ART_24"
							},
							{
								"name": "Exempt — Art. 25 LIVA",
								"value": "EXENTA_ART_25"
							},
							{
								"name": "Exempt — Art. 26 LIVA",
								"value": "EXENTA_ART_26"
							},
							{
								"name": "Exempt — Art. 140 LIVA",
								"value": "EXENTA_ART_140"
							},
							{
								"name": "Not Subject to VAT — Art. 7.9 LIVA",
								"value": "NO_SUJETA_ART_7_9"
							},
							{
								"name": "Not Subject to VAT — Outside the Spanish VAT Territory",
								"value": "NO_SUJETA_LOCALIZACION"
							},
							{
								"name": "Reverse Charge — Art. 84.2.a LIVA",
								"value": "ISP_ART_84_2_A"
							},
							{
								"name": "Reverse Charge — Art. 84.2.e LIVA",
								"value": "ISP_ART_84_2_E"
							},
							{
								"name": "Reverse Charge — Art. 84.2.f LIVA",
								"value": "ISP_ART_84_2_F"
							},
							{
								"name": "Special Regime — Art. 129 LIVA",
								"value": "REGIMEN_ART_129"
							},
							{
								"name": "Special Regime — Art. 135 LIVA",
								"value": "REGIMEN_ART_135"
							},
							{
								"name": "Special Regime — Art. 141 LIVA",
								"value": "REGIMEN_ART_141"
							},
							{
								"name": "Special Regime — Art. 154 LIVA",
								"value": "REGIMEN_ART_154"
							},
							{
								"name": "Special Regime — Art. 163 Decies LIVA",
								"value": "REGIMEN_ART_163_DECIES"
							},
							{
								"name": "Other",
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
					},
					{
						"name": "line_type",
						"apiName": "line_type",
						"displayName": "Line Type",
						"description": "Fiscal line type",
						"type": "options",
						"options": [
							{
								"name": "NORMAL",
								"value": "NORMAL"
							},
							{
								"name": "SUPLIDO",
								"value": "SUPLIDO"
							}
						],
						"default": "NORMAL"
					},
					{
						"name": "source_invoice_reference",
						"apiName": "source_invoice_reference",
						"displayName": "Source Invoice Reference",
						"description": "Reference to the original invoice issued by the third party in the client's name (max 50 characters)",
						"validation": {
							"maxLength": 50
						},
						"type": "string",
						"default": ""
					},
					{
						"name": "source_invoice_ids",
						"apiName": "source_invoice_ids",
						"displayName": "Source Invoice IDs",
						"description": "Ids of the issued invoices that make up the SUPLIDO (UUID)",
						"type": "string",
						"validation": {
							"format": "uuid"
						},
						"multipleValues": true,
						"default": []
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
				"name": "valid_until",
				"apiName": "valid_until",
				"displayName": "Valid Until",
				"description": "Offer validity date (YYYY-MM-DD)",
				"validation": {
					"format": "date"
				},
				"type": "string",
				"default": "",
				"placeholder": "2025-02-28"
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
								"name": "BIZUM",
								"value": "BIZUM"
							},
							{
								"name": "OTHER",
								"value": "OTHER"
							}
						],
						"default": ""
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
						"description": "Payment term in days (between 0 and 365)",
						"validation": {
							"minimum": 0,
							"maximum": 365
						},
						"type": "number",
						"default": 0,
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
				"name": "external_ref",
				"apiName": "external_ref",
				"displayName": "External Ref",
				"description": "This field was previously named `external_reference` (max 255 characters)",
				"validation": {
					"maxLength": 255
				},
				"type": "string",
				"default": "",
				"placeholder": "ORD-2025-0042"
			},
			{
				"name": "metadata",
				"apiName": "metadata",
				"displayName": "Metadata",
				"description": "Your own key/value pairs to cross-reference this invoice with records in your system (order ids, tenants, internal codes)",
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
		"filters": [
			{
				"name": "wait_for_pdf",
				"apiName": "wait_for_pdf",
				"displayName": "Wait For Pdf",
				"description": "Same flag as `options.wait_for_pdf`",
				"type": "boolean",
				"default": false
			}
		],
		"optionalCollectionName": "additionalFields",
		"queryParamNames": [
			"wait_for_pdf"
		],
		"paginated": false,
		"isList": false,
		"listKey": ""
	},
	{
		"resource": "invoice",
		"operation": "get",
		"displayName": "Get",
		"action": "Get an invoice of a company",
		"description": "Retrieves the full details of an invoice of this company (NIF)",
		"operationId": "getCompanyInvoice",
		"method": "GET",
		"path": "/v1/companies/{company_id}/invoices/{invoice_id}",
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
		"operation": "update",
		"displayName": "Update",
		"action": "Update an invoice of a company partially",
		"description": "Updates only the fields present in the body, leaving every other field of the invoice as it is",
		"operationId": "patchCompanyInvoice",
		"method": "PATCH",
		"path": "/v1/companies/{company_id}/invoices/{invoice_id}",
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
				"name": "type",
				"apiName": "type",
				"displayName": "Type",
				"description": "New invoice type",
				"type": "options",
				"options": [
					{
						"name": "— Not set —",
						"value": ""
					},
					{
						"name": "STANDARD",
						"value": "STANDARD"
					},
					{
						"name": "CORRECTIVE",
						"value": "CORRECTIVE"
					},
					{
						"name": "SIMPLIFIED",
						"value": "SIMPLIFIED"
					},
					{
						"name": "PROFORMA",
						"value": "PROFORMA"
					}
				],
				"default": ""
			},
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
				"name": "valid_until",
				"apiName": "valid_until",
				"displayName": "Valid Until",
				"description": "Offer validity date (YYYY-MM-DD)",
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
				"description": "Replaces the recipient when present",
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
						"placeholder": "My Company Ltd"
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
						"placeholder": "My Company"
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
						"description": "Identifier type",
						"type": "options",
						"options": [
							{
								"name": "NIF IVA",
								"value": "NIF_IVA"
							},
							{
								"name": "PASSPORT",
								"value": "PASSPORT"
							},
							{
								"name": "COUNTRY ID",
								"value": "COUNTRY_ID"
							},
							{
								"name": "RESIDENCE CERTIFICATE",
								"value": "RESIDENCE_CERTIFICATE"
							},
							{
								"name": "OTHER DOCUMENT",
								"value": "OTHER_DOCUMENT"
							},
							{
								"name": "NOT REGISTERED",
								"value": "NOT_REGISTERED"
							},
							{
								"name": "02",
								"value": "02"
							},
							{
								"name": "03",
								"value": "03"
							},
							{
								"name": "04",
								"value": "04"
							},
							{
								"name": "05",
								"value": "05"
							},
							{
								"name": "06",
								"value": "06"
							},
							{
								"name": "07",
								"value": "07"
							}
						],
						"default": "NIF_IVA",
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
						"placeholder": "123 Main Street",
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
						"placeholder": "2nd floor, Apt A",
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
						"description": "The country name in Spanish, e.g. España for Spain — this is what BeeL's API expects (max 100 characters)",
						"validation": {
							"pattern": "^[a-zA-Z0-9À-ÿ\\u0100-\\u017F\\u00B7\\u2018\\u2019\\u0060\\u00B4\\s\\.,\\-\\/'ºª]+$",
							"minLength": 1,
							"maxLength": 100
						},
						"type": "string",
						"default": "",
						"placeholder": "Spain",
						"required": false
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
						"default": "",
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
						"description": "Required for NORMAL lines; optional for SUPLIDO lines (max 2000 characters)",
						"validation": {
							"maxLength": 2000
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
						"validation": {
							"minimum": 0,
							"maximum": 999999.9999,
							"exclusiveMinimum": true
						},
						"type": "number",
						"default": 0
					},
					{
						"name": "total_excluding_tax",
						"apiName": "total_excluding_tax",
						"displayName": "Total Excluding Tax",
						"description": "Declared line total excluding taxes (total-declared mode, e.g (max 99999999.99)",
						"validation": {
							"maximum": 99999999.99
						},
						"type": "number",
						"default": 0
					},
					{
						"name": "total_including_tax",
						"apiName": "total_including_tax",
						"displayName": "Total Including Tax",
						"description": "Declared line total including taxes (tax-inclusive total-declared mode): what the customer paid for this line — taxable base + VAT + equivalence surcharge (max 99999999.99)",
						"validation": {
							"maximum": 99999999.99
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
						"description": "Regime key according to VeriFactu regulations",
						"type": "options",
						"options": [
							{
								"name": "— Not set —",
								"value": ""
							},
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
						"default": "",
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
								"name": "0 625",
								"value": 0.625
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
						"description": "IRPF withholding rate for this line",
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
								"name": "Exempt — Art. 20 LIVA",
								"value": "EXENTA_ART_20"
							},
							{
								"name": "Exempt — Art. 21 LIVA",
								"value": "EXENTA_ART_21"
							},
							{
								"name": "Exempt — Art. 22 LIVA",
								"value": "EXENTA_ART_22"
							},
							{
								"name": "Exempt — Art. 24 LIVA",
								"value": "EXENTA_ART_24"
							},
							{
								"name": "Exempt — Art. 25 LIVA",
								"value": "EXENTA_ART_25"
							},
							{
								"name": "Exempt — Art. 26 LIVA",
								"value": "EXENTA_ART_26"
							},
							{
								"name": "Exempt — Art. 140 LIVA",
								"value": "EXENTA_ART_140"
							},
							{
								"name": "Not Subject to VAT — Art. 7.9 LIVA",
								"value": "NO_SUJETA_ART_7_9"
							},
							{
								"name": "Not Subject to VAT — Outside the Spanish VAT Territory",
								"value": "NO_SUJETA_LOCALIZACION"
							},
							{
								"name": "Reverse Charge — Art. 84.2.a LIVA",
								"value": "ISP_ART_84_2_A"
							},
							{
								"name": "Reverse Charge — Art. 84.2.e LIVA",
								"value": "ISP_ART_84_2_E"
							},
							{
								"name": "Reverse Charge — Art. 84.2.f LIVA",
								"value": "ISP_ART_84_2_F"
							},
							{
								"name": "Special Regime — Art. 129 LIVA",
								"value": "REGIMEN_ART_129"
							},
							{
								"name": "Special Regime — Art. 135 LIVA",
								"value": "REGIMEN_ART_135"
							},
							{
								"name": "Special Regime — Art. 141 LIVA",
								"value": "REGIMEN_ART_141"
							},
							{
								"name": "Special Regime — Art. 154 LIVA",
								"value": "REGIMEN_ART_154"
							},
							{
								"name": "Special Regime — Art. 163 Decies LIVA",
								"value": "REGIMEN_ART_163_DECIES"
							},
							{
								"name": "Other",
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
					},
					{
						"name": "line_type",
						"apiName": "line_type",
						"displayName": "Line Type",
						"description": "Fiscal line type",
						"type": "options",
						"options": [
							{
								"name": "— Not set —",
								"value": ""
							},
							{
								"name": "NORMAL",
								"value": "NORMAL"
							},
							{
								"name": "SUPLIDO",
								"value": "SUPLIDO"
							}
						],
						"default": ""
					},
					{
						"name": "source_invoice_reference",
						"apiName": "source_invoice_reference",
						"displayName": "Source Invoice Reference",
						"description": "Reference to the original invoice issued by the third party in the client's name (max 50 characters)",
						"validation": {
							"maxLength": 50
						},
						"type": "string",
						"default": ""
					},
					{
						"name": "source_invoice_ids",
						"apiName": "source_invoice_ids",
						"displayName": "Source Invoice IDs",
						"description": "Ids of the issued invoices that make up the SUPLIDO (UUID)",
						"type": "string",
						"validation": {
							"format": "uuid"
						},
						"multipleValues": true,
						"default": []
					}
				],
				"multipleValues": true,
				"default": {}
			},
			{
				"name": "payment_info",
				"apiName": "payment_info",
				"displayName": "Payment Info",
				"description": "Replaces the payment information when present (sets method/IBAN/SWIFT/term days)",
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
								"name": "BIZUM",
								"value": "BIZUM"
							},
							{
								"name": "OTHER",
								"value": "OTHER"
							}
						],
						"default": ""
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
						"description": "Payment term in days (between 0 and 365)",
						"validation": {
							"minimum": 0,
							"maximum": 365
						},
						"type": "number",
						"default": 0,
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
			},
			{
				"name": "options",
				"apiName": "options",
				"displayName": "Options",
				"description": "Processing options for the draft",
				"type": "fixedCollection",
				"fields": [
					{
						"name": "send_automatically",
						"apiName": "send_automatically",
						"displayName": "Send Automatically",
						"description": "Whether the invoice should be auto-emailed after issuing",
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
					},
					{
						"name": "verifactu_enabled",
						"apiName": "verifactu_enabled",
						"displayName": "Verifactu Enabled",
						"description": "Whether VeriFactu submission is enabled at issue time",
						"type": "boolean",
						"default": false
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
		"resource": "invoice",
		"operation": "delete",
		"displayName": "Delete",
		"action": "Delete a draft invoice of a company",
		"description": "Deletes a draft invoice of this company",
		"operationId": "deleteCompanyInvoice",
		"method": "DELETE",
		"path": "/v1/companies/{company_id}/invoices/{invoice_id}",
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
		"operation": "duplicate",
		"displayName": "Duplicate",
		"action": "Derive a draft invoice from an existing one",
		"description": "Creates a new draft invoice derived from an existing invoice of this company",
		"operationId": "createCompanyInvoiceDerivation",
		"method": "POST",
		"path": "/v1/companies/{company_id}/invoices/derivations",
		"pathParams": [],
		"requiredFields": [
			{
				"name": "from_invoice_id",
				"apiName": "from_invoice_id",
				"displayName": "From Invoice ID",
				"description": "Invoice this one is derived from (UUID)",
				"required": true,
				"validation": {
					"format": "uuid"
				},
				"type": "string",
				"default": "",
				"placeholder": "550e8400-e29b-41d4-a716-446655440000"
			},
			{
				"name": "mode",
				"apiName": "mode",
				"displayName": "Mode",
				"description": "How to derive the new invoice from `from_invoice_id`",
				"required": true,
				"type": "options",
				"options": [
					{
						"name": "DUPLICATE",
						"value": "DUPLICATE"
					}
				],
				"default": "DUPLICATE"
			}
		],
		"optionalFields": [
			{
				"name": "series_id",
				"apiName": "series_id",
				"displayName": "Series ID",
				"description": "Series for the new draft",
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
				"description": "Observations for the new draft (max 2000 characters)",
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
		"operation": "issue",
		"displayName": "Issue",
		"action": "Issue an invoice (DRAFT → ISSUED)",
		"description": "Finalizes a draft invoice of this company: assigns its definitive number from the configured series and makes it immutable",
		"operationId": "issueCompanyInvoice",
		"method": "POST",
		"path": "/v1/companies/{company_id}/invoices/{invoice_id}/issue",
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
		"operation": "void",
		"displayName": "Void",
		"action": "Void an issued invoice",
		"description": "Voids an issued invoice of this company",
		"operationId": "voidCompanyInvoice",
		"method": "POST",
		"path": "/v1/companies/{company_id}/invoices/{invoice_id}/void",
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
				"name": "reason",
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
		"operation": "createCorrective",
		"displayName": "Create Corrective",
		"action": "Create a corrective invoice",
		"description": "Issues a corrective invoice that amends the invoice in the path",
		"operationId": "createCompanyCorrectiveInvoice",
		"method": "POST",
		"path": "/v1/companies/{company_id}/invoices/{invoice_id}/corrective",
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
				"name": "reason_invoice_createCorrective",
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
						"description": "Concept description (max 2000 characters)",
						"validation": {
							"maxLength": 2000
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
						"validation": {
							"maximum": 999999.9999
						},
						"type": "number",
						"default": 0
					},
					{
						"name": "total_excluding_tax",
						"apiName": "total_excluding_tax",
						"displayName": "Total Excluding Tax",
						"description": "Declared line total excluding taxes (total-declared mode, e.g (max 99999999.99)",
						"validation": {
							"maximum": 99999999.99
						},
						"type": "number",
						"default": 0
					},
					{
						"name": "total_including_tax",
						"apiName": "total_including_tax",
						"displayName": "Total Including Tax",
						"description": "Declared line total including taxes (tax-inclusive total-declared mode): what the customer paid for this line — taxable base + VAT + equivalence surcharge (max 99999999.99)",
						"validation": {
							"maximum": 99999999.99
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
						"description": "Regime key according to VeriFactu regulations",
						"type": "options",
						"options": [
							{
								"name": "— Not set —",
								"value": ""
							},
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
						"default": "",
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
								"name": "0 625",
								"value": 0.625
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
						"description": "IRPF withholding rate for this line",
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
								"name": "Exempt — Art. 20 LIVA",
								"value": "EXENTA_ART_20"
							},
							{
								"name": "Exempt — Art. 21 LIVA",
								"value": "EXENTA_ART_21"
							},
							{
								"name": "Exempt — Art. 22 LIVA",
								"value": "EXENTA_ART_22"
							},
							{
								"name": "Exempt — Art. 24 LIVA",
								"value": "EXENTA_ART_24"
							},
							{
								"name": "Exempt — Art. 25 LIVA",
								"value": "EXENTA_ART_25"
							},
							{
								"name": "Exempt — Art. 26 LIVA",
								"value": "EXENTA_ART_26"
							},
							{
								"name": "Exempt — Art. 140 LIVA",
								"value": "EXENTA_ART_140"
							},
							{
								"name": "Not Subject to VAT — Art. 7.9 LIVA",
								"value": "NO_SUJETA_ART_7_9"
							},
							{
								"name": "Not Subject to VAT — Outside the Spanish VAT Territory",
								"value": "NO_SUJETA_LOCALIZACION"
							},
							{
								"name": "Reverse Charge — Art. 84.2.a LIVA",
								"value": "ISP_ART_84_2_A"
							},
							{
								"name": "Reverse Charge — Art. 84.2.e LIVA",
								"value": "ISP_ART_84_2_E"
							},
							{
								"name": "Reverse Charge — Art. 84.2.f LIVA",
								"value": "ISP_ART_84_2_F"
							},
							{
								"name": "Special Regime — Art. 129 LIVA",
								"value": "REGIMEN_ART_129"
							},
							{
								"name": "Special Regime — Art. 135 LIVA",
								"value": "REGIMEN_ART_135"
							},
							{
								"name": "Special Regime — Art. 141 LIVA",
								"value": "REGIMEN_ART_141"
							},
							{
								"name": "Special Regime — Art. 154 LIVA",
								"value": "REGIMEN_ART_154"
							},
							{
								"name": "Special Regime — Art. 163 Decies LIVA",
								"value": "REGIMEN_ART_163_DECIES"
							},
							{
								"name": "Other",
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
				"description": "Series for the corrective invoice",
				"validation": {
					"format": "uuid"
				},
				"type": "options",
				"loadOptionsMethod": "getSeries",
				"default": ""
			},
			{
				"name": "external_ref",
				"apiName": "external_ref",
				"displayName": "External Ref",
				"description": "Client-supplied identifier from an external system (order, cart, contract…) (max 255 characters)",
				"validation": {
					"maxLength": 255
				},
				"type": "string",
				"default": "",
				"placeholder": "ORD-2025-0042"
			},
			{
				"name": "metadata",
				"apiName": "metadata",
				"displayName": "Metadata",
				"description": "Your own key/value pairs to cross-reference this invoice with records in your system (order ids, tenants, internal codes)",
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
		"operation": "setStatus",
		"displayName": "Set Status",
		"action": "Set the status of an invoice",
		"description": "Sets the commercial status of an invoice: paid, sent, or back to issued",
		"operationId": "setCompanyInvoiceStatus",
		"method": "PUT",
		"path": "/v1/companies/{company_id}/invoices/{invoice_id}/status",
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
				"name": "status",
				"apiName": "status",
				"displayName": "Status",
				"description": "Target status",
				"required": true,
				"type": "options",
				"options": [
					{
						"name": "ISSUED",
						"value": "ISSUED"
					},
					{
						"name": "SENT",
						"value": "SENT"
					},
					{
						"name": "PAID",
						"value": "PAID"
					}
				],
				"default": "ISSUED"
			}
		],
		"optionalFields": [
			{
				"name": "payment_date",
				"apiName": "payment_date",
				"displayName": "Payment Date",
				"description": "Payment date (YYYY-MM-DD)",
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
				"description": "Payment details object",
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
								"name": "BIZUM",
								"value": "BIZUM"
							},
							{
								"name": "OTHER",
								"value": "OTHER"
							}
						],
						"default": ""
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
						"description": "Payment term in days (between 0 and 365)",
						"validation": {
							"minimum": 0,
							"maximum": 365
						},
						"type": "number",
						"default": 0,
						"numberPrecision": 0
					}
				],
				"default": {}
			},
			{
				"name": "sent_at",
				"apiName": "sent_at",
				"displayName": "Sent At",
				"description": "Timestamp for when the invoice was sent (ISO 8601 date-time)",
				"validation": {
					"format": "date-time"
				},
				"type": "string",
				"default": "",
				"placeholder": "2025-01-29T18:45:00Z"
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
		"operation": "getSchedule",
		"displayName": "Get Schedule",
		"action": "Get the scheduling of an invoice",
		"description": "Returns the date and generation mode currently scheduled for this invoice",
		"operationId": "getCompanyInvoiceSchedule",
		"method": "GET",
		"path": "/v1/companies/{company_id}/invoices/{invoice_id}/schedule",
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
		"operation": "schedule",
		"displayName": "Schedule",
		"action": "Schedule or reschedule an invoice",
		"description": "Replaces the scheduling of a draft invoice, whether it had one or not: scheduling for the first time and moving an existing schedule are the same act on the same sub-resource",
		"operationId": "setCompanyInvoiceSchedule",
		"method": "PUT",
		"path": "/v1/companies/{company_id}/invoices/{invoice_id}/schedule",
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
				"description": "Date on which the invoice should be processed (YYYY-MM-DD)",
				"required": true,
				"validation": {
					"format": "date"
				},
				"type": "string",
				"default": "",
				"placeholder": "2025-02-15"
			},
			{
				"name": "generation_mode",
				"apiName": "generation_mode",
				"displayName": "Generation Mode",
				"description": "Action to perform when processing a scheduled invoice: - DRAFT: Create as draft for manual review - ISSUE_AND_SEND: Issue and send automatically via email",
				"required": true,
				"type": "options",
				"options": [
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
				"default": "DRAFT"
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
		"resource": "invoice",
		"operation": "unschedule",
		"displayName": "Unschedule",
		"action": "Remove the scheduling of an invoice",
		"description": "Removes the scheduling of an invoice, leaving it as a plain draft",
		"operationId": "deleteCompanyInvoiceSchedule",
		"method": "DELETE",
		"path": "/v1/companies/{company_id}/invoices/{invoice_id}/schedule",
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
		"operation": "send",
		"displayName": "Send",
		"action": "Send an invoice by email",
		"description": "Sends the invoice by email, attaching its PDF by default",
		"operationId": "sendCompanyInvoice",
		"method": "POST",
		"path": "/v1/companies/{company_id}/invoices/{invoice_id}/send",
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
				"description": "Email language",
				"type": "options",
				"options": [
					{
						"name": "— Not set —",
						"value": ""
					},
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
		"operation": "convertToInvoice",
		"displayName": "Convert To Invoice",
		"action": "Convert a proforma into an invoice",
		"description": "Converts an accepted proforma of this company into a real invoice",
		"operationId": "convertCompanyProformaToInvoice",
		"method": "POST",
		"path": "/v1/companies/{company_id}/invoices/{invoice_id}/convert-to-invoice",
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
				"name": "issue",
				"apiName": "issue",
				"displayName": "Issue",
				"description": "If `true`, emit the resulting invoice atomically in the same act (assigns a fiscal number and runs the quota/ledger/VeriFactu→PDF flow)",
				"type": "boolean",
				"default": false
			},
			{
				"name": "verifactu_enabled",
				"apiName": "verifactu_enabled",
				"displayName": "Verifactu Enabled",
				"description": "Whether the resulting invoice generates VeriFactu information",
				"type": "boolean",
				"default": false
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
		"resource": "customer",
		"operation": "getAll",
		"displayName": "Get Many",
		"action": "List the customers of a company",
		"description": "Returns a paginated list of the customers of this company (NIF), with optional filters",
		"operationId": "listCompanyCustomers",
		"method": "GET",
		"path": "/v1/companies/{company_id}/customers",
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
				"default": "",
				"placeholder": "My Company Ltd"
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
		"action": "Create a customer for a company",
		"description": "Creates a new customer under this company (NIF)",
		"operationId": "createCompanyCustomer",
		"method": "POST",
		"path": "/v1/companies/{company_id}/customers",
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
				"default": "",
				"placeholder": "My Company Ltd"
			},
			{
				"name": "address",
				"apiName": "address",
				"displayName": "Address",
				"description": "Address you send when you create or update a company, a customer or an onboarding",
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
						"placeholder": "123 Main Street"
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
						"placeholder": "2nd floor, Apt A"
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
						"description": "The country name in Spanish, e.g. España for Spain — this is what BeeL's API expects (max 100 characters)",
						"validation": {
							"pattern": "^[a-zA-Z0-9À-ÿ\\u0100-\\u017F\\u00B7\\u2018\\u2019\\u0060\\u00B4\\s\\.,\\-\\/'ºª]+$",
							"minLength": 1,
							"maxLength": 100
						},
						"type": "string",
						"default": "",
						"placeholder": "Spain"
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
						"default": "",
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
				"default": "",
				"placeholder": "My Company"
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
						"description": "Identifier type",
						"required": true,
						"type": "options",
						"options": [
							{
								"name": "NIF IVA",
								"value": "NIF_IVA"
							},
							{
								"name": "PASSPORT",
								"value": "PASSPORT"
							},
							{
								"name": "COUNTRY ID",
								"value": "COUNTRY_ID"
							},
							{
								"name": "RESIDENCE CERTIFICATE",
								"value": "RESIDENCE_CERTIFICATE"
							},
							{
								"name": "OTHER DOCUMENT",
								"value": "OTHER_DOCUMENT"
							},
							{
								"name": "NOT REGISTERED",
								"value": "NOT_REGISTERED"
							},
							{
								"name": "02",
								"value": "02"
							},
							{
								"name": "03",
								"value": "03"
							},
							{
								"name": "04",
								"value": "04"
							},
							{
								"name": "05",
								"value": "05"
							},
							{
								"name": "06",
								"value": "06"
							},
							{
								"name": "07",
								"value": "07"
							}
						],
						"default": "NIF_IVA"
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
				"name": "website",
				"apiName": "website",
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
								"name": "BIZUM",
								"value": "BIZUM"
							},
							{
								"name": "OTHER",
								"value": "OTHER"
							}
						],
						"default": ""
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
						"description": "Payment term in days (between 0 and 365)",
						"validation": {
							"minimum": 0,
							"maximum": 365
						},
						"type": "number",
						"default": 0,
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
		"action": "Get a customer of a company",
		"description": "Retrieves the complete details of a customer of this company (NIF)",
		"operationId": "getCompanyCustomer",
		"method": "GET",
		"path": "/v1/companies/{company_id}/customers/{customer_id}",
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
		"action": "Update a customer of a company partially",
		"description": "Updates only the fields present in the body, leaving every other field of the customer as it is",
		"operationId": "patchCompanyCustomer",
		"method": "PATCH",
		"path": "/v1/companies/{company_id}/customers/{customer_id}",
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
				"name": "nif",
				"apiName": "nif",
				"displayName": "NIF",
				"description": "New Spanish Tax ID (exactly 9 characters)",
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
				"description": "New alternative identifier (non-Spanish customers)",
				"type": "fixedCollection",
				"fields": [
					{
						"name": "type",
						"apiName": "type",
						"displayName": "Type",
						"description": "Identifier type",
						"required": true,
						"type": "options",
						"options": [
							{
								"name": "NIF IVA",
								"value": "NIF_IVA"
							},
							{
								"name": "PASSPORT",
								"value": "PASSPORT"
							},
							{
								"name": "COUNTRY ID",
								"value": "COUNTRY_ID"
							},
							{
								"name": "RESIDENCE CERTIFICATE",
								"value": "RESIDENCE_CERTIFICATE"
							},
							{
								"name": "OTHER DOCUMENT",
								"value": "OTHER_DOCUMENT"
							},
							{
								"name": "NOT REGISTERED",
								"value": "NOT_REGISTERED"
							},
							{
								"name": "02",
								"value": "02"
							},
							{
								"name": "03",
								"value": "03"
							},
							{
								"name": "04",
								"value": "04"
							},
							{
								"name": "05",
								"value": "05"
							},
							{
								"name": "06",
								"value": "06"
							},
							{
								"name": "07",
								"value": "07"
							}
						],
						"default": "NIF_IVA"
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
				"name": "legal_name",
				"apiName": "legal_name",
				"displayName": "Legal Name",
				"description": "Customer legal name (max 120 characters)",
				"validation": {
					"minLength": 1,
					"maxLength": 120
				},
				"type": "string",
				"default": "",
				"placeholder": "My Company Ltd"
			},
			{
				"name": "trade_name",
				"apiName": "trade_name",
				"displayName": "Trade Name",
				"description": "Customer trade name (max 120 characters)",
				"validation": {
					"maxLength": 120
				},
				"type": "string",
				"default": "",
				"placeholder": "My Company"
			},
			{
				"name": "address",
				"apiName": "address",
				"displayName": "Address",
				"description": "Full address",
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
						"placeholder": "123 Main Street"
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
						"placeholder": "2nd floor, Apt A"
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
						"description": "The country name in Spanish, e.g. España for Spain — this is what BeeL's API expects (max 100 characters)",
						"validation": {
							"pattern": "^[a-zA-Z0-9À-ÿ\\u0100-\\u017F\\u00B7\\u2018\\u2019\\u0060\\u00B4\\s\\.,\\-\\/'ºª]+$",
							"minLength": 1,
							"maxLength": 100
						},
						"type": "string",
						"default": "",
						"placeholder": "Spain"
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
						"default": "",
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
				"description": "Email address (email address, min 5 characters, max 255 characters)",
				"validation": {
					"minLength": 5,
					"maxLength": 255,
					"format": "email"
				},
				"type": "string",
				"default": ""
			},
			{
				"name": "website",
				"apiName": "website",
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
				"description": "Additional emails for invoice delivery (email address, min 5 characters, max 255 characters)",
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
				"description": "Contact person name (max 200 characters)",
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
				"description": "Additional notes",
				"type": "string",
				"default": ""
			},
			{
				"name": "preferred_payment_method",
				"apiName": "preferred_payment_method",
				"displayName": "Preferred Payment Method",
				"description": "Default payment method",
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
								"name": "BIZUM",
								"value": "BIZUM"
							},
							{
								"name": "OTHER",
								"value": "OTHER"
							}
						],
						"default": ""
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
						"description": "Payment term in days (between 0 and 365)",
						"validation": {
							"minimum": 0,
							"maximum": 365
						},
						"type": "number",
						"default": 0,
						"numberPrecision": 0
					}
				],
				"default": {}
			},
			{
				"name": "general_discount",
				"apiName": "general_discount",
				"displayName": "General Discount",
				"description": "General discount percentage (between 0 and 100)",
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
		"action": "Delete a customer of a company",
		"description": "Deletes a customer of this company (NIF) that has no invoices",
		"operationId": "deleteCompanyCustomer",
		"method": "DELETE",
		"path": "/v1/companies/{company_id}/customers/{customer_id}",
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
		"action": "List the products of a company",
		"description": "Returns a paginated list of the products/services of this company (NIF), with optional filters",
		"operationId": "listCompanyProducts",
		"method": "GET",
		"path": "/v1/companies/{company_id}/products",
		"pathParams": [],
		"requiredFields": [],
		"optionalFields": [],
		"filters": [
			{
				"name": "q",
				"apiName": "q",
				"displayName": "Search Query",
				"description": "Search by name, code or description",
				"validation": {
					"maxLength": 100
				},
				"type": "string",
				"default": ""
			},
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
			"q",
			"category",
			"active",
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
		"action": "Create a product for a company",
		"description": "Creates a new product or service in the catalog of this company (NIF)",
		"operationId": "createCompanyProduct",
		"method": "POST",
		"path": "/v1/companies/{company_id}/products",
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
				"description": "Complete tax information with cross-validations: - IVA: only percentages 0, 4, 10, 21 - IGIC: only percentages 0, 3, 5, 7, 9.5, 15, 20 - IPSI: only percentages 0.5, 1, 2, 4, 8, 10 - OTHER: any percentage between 0 and 100 Exception: when regime_key = \"17\" (OSS/IOSS) the invoice applies the destin...",
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
						"description": "Regime key according to VeriFactu regulations",
						"type": "options",
						"options": [
							{
								"name": "— Not set —",
								"value": ""
							},
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
						"default": ""
					}
				],
				"default": {}
			},
			{
				"name": "equivalence_surcharge_rate",
				"apiName": "equivalence_surcharge_rate",
				"displayName": "Equivalence Surcharge Rate",
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
				"name": "irpf_rate",
				"apiName": "irpf_rate",
				"displayName": "IRPF Rate",
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
		"action": "Get a product of a company",
		"description": "Retrieves the details of a product of this company (NIF)",
		"operationId": "getCompanyProduct",
		"method": "GET",
		"path": "/v1/companies/{company_id}/products/{product_id}",
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
		"action": "Update a product of a company",
		"description": "Updates only the fields present in the body, leaving every other field of the product as it is — in particular `main_tax`, `irpf_rate` and `equivalence_surcharge_rate`",
		"operationId": "patchCompanyProduct",
		"method": "PATCH",
		"path": "/v1/companies/{company_id}/products/{product_id}",
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
				"description": "Unique alphanumeric product code (max 50 characters)",
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
				"description": "Detailed description",
				"type": "string",
				"default": "",
				"placeholder": "Specialized technical consulting services"
			},
			{
				"name": "category",
				"apiName": "category",
				"displayName": "Category",
				"description": "Product category",
				"type": "options",
				"options": [
					{
						"name": "— Not set —",
						"value": ""
					},
					{
						"name": "PRODUCT",
						"value": "PRODUCT"
					},
					{
						"name": "SERVICE",
						"value": "SERVICE"
					},
					{
						"name": "CONSULTING",
						"value": "CONSULTING"
					},
					{
						"name": "SOFTWARE",
						"value": "SOFTWARE"
					},
					{
						"name": "TRAINING",
						"value": "TRAINING"
					},
					{
						"name": "OTHER",
						"value": "OTHER"
					}
				],
				"default": ""
			},
			{
				"name": "default_price",
				"apiName": "default_price",
				"displayName": "Default Price",
				"description": "Suggested default price (min 0)",
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
				"description": "Unit of measure (max 50 characters)",
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
				"description": "Main tax",
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
						"description": "Regime key according to VeriFactu regulations",
						"type": "options",
						"options": [
							{
								"name": "— Not set —",
								"value": ""
							},
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
						"default": ""
					}
				],
				"default": {}
			},
			{
				"name": "equivalence_surcharge_rate",
				"apiName": "equivalence_surcharge_rate",
				"displayName": "Equivalence Surcharge Rate",
				"description": "Equivalence surcharge percentage (between 0 and 100)",
				"validation": {
					"minimum": 0,
					"maximum": 100,
					"multipleOf": 0.01
				},
				"type": "number",
				"default": 0
			},
			{
				"name": "irpf_rate",
				"apiName": "irpf_rate",
				"displayName": "IRPF Rate",
				"description": "IRPF withholding percentage (between 0 and 100)",
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
		"action": "Delete a product of a company",
		"description": "Deletes a product from the catalog of this company (NIF)",
		"operationId": "deleteCompanyProduct",
		"method": "DELETE",
		"path": "/v1/companies/{company_id}/products/{product_id}",
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
		"resource": "series",
		"operation": "getAll",
		"displayName": "Get Many",
		"action": "List the invoice series of a company",
		"description": "Retrieves the invoice series of this company (NIF)",
		"operationId": "listCompanySeries",
		"method": "GET",
		"path": "/v1/companies/{company_id}/series",
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
			},
			{
				"name": "document_type",
				"apiName": "document_type",
				"displayName": "Document Type",
				"description": "Filter by document type (UNASSIGNED series are always included)",
				"type": "options",
				"options": [
					{
						"name": "— Not set —",
						"value": ""
					},
					{
						"name": "UNASSIGNED",
						"value": "UNASSIGNED",
						"description": "Legacy series, compatible with any invoice type"
					},
					{
						"name": "STANDARD",
						"value": "STANDARD",
						"description": "Standard invoice"
					},
					{
						"name": "SIMPLIFIED",
						"value": "SIMPLIFIED",
						"description": "Simplified invoice"
					},
					{
						"name": "CORRECTIVE",
						"value": "CORRECTIVE",
						"description": "Corrects or cancels a previous invoice"
					},
					{
						"name": "PROFORMA",
						"value": "PROFORMA",
						"description": "Proforma (commercial document, non-fiscal numbering)"
					}
				],
				"default": ""
			}
		],
		"optionalCollectionName": "options",
		"queryParamNames": [
			"active",
			"document_type"
		],
		"paginated": true,
		"isList": true,
		"listKey": ""
	},
	{
		"resource": "series",
		"operation": "create",
		"displayName": "Create",
		"action": "Create an invoice series for a company",
		"description": "Creates a new invoice series under this company (NIF)",
		"operationId": "createCompanySeries",
		"method": "POST",
		"path": "/v1/companies/{company_id}/series",
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
				"description": "When this series' counter resets",
				"required": true,
				"type": "options",
				"options": [
					{
						"name": "NEVER",
						"value": "NEVER"
					},
					{
						"name": "ANNUAL",
						"value": "ANNUAL"
					},
					{
						"name": "MONTHLY",
						"value": "MONTHLY"
					}
				],
				"default": "ANNUAL"
			}
		],
		"optionalFields": [
			{
				"name": "document_type",
				"apiName": "document_type",
				"displayName": "Document Type",
				"description": "Document type associated with a series",
				"type": "options",
				"options": [
					{
						"name": "— Not set —",
						"value": ""
					},
					{
						"name": "UNASSIGNED",
						"value": "UNASSIGNED",
						"description": "Legacy series, compatible with any invoice type"
					},
					{
						"name": "STANDARD",
						"value": "STANDARD",
						"description": "Standard invoice"
					},
					{
						"name": "SIMPLIFIED",
						"value": "SIMPLIFIED",
						"description": "Simplified invoice"
					},
					{
						"name": "CORRECTIVE",
						"value": "CORRECTIVE",
						"description": "Corrects or cancels a previous invoice"
					},
					{
						"name": "PROFORMA",
						"value": "PROFORMA",
						"description": "Proforma (commercial document, non-fiscal numbering)"
					}
				],
				"default": ""
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
				"description": "Whether this is the default series for its document_type",
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
		"operation": "get",
		"displayName": "Get",
		"action": "Get one invoice series of a company",
		"description": "Retrieves a single invoice series of this company (NIF)",
		"operationId": "getCompanySeries",
		"method": "GET",
		"path": "/v1/companies/{company_id}/series/{series_id}",
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
		"operation": "update",
		"displayName": "Update",
		"action": "Update an invoice series of a company partially",
		"description": "Updates only the fields present in the body, leaving every other field of the series as it is",
		"operationId": "patchCompanySeries",
		"method": "PATCH",
		"path": "/v1/companies/{company_id}/series/{series_id}",
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
				"name": "document_type",
				"apiName": "document_type",
				"displayName": "Document Type",
				"description": "Document type associated with a series",
				"type": "options",
				"options": [
					{
						"name": "— Not set —",
						"value": ""
					},
					{
						"name": "UNASSIGNED",
						"value": "UNASSIGNED",
						"description": "Legacy series, compatible with any invoice type"
					},
					{
						"name": "STANDARD",
						"value": "STANDARD",
						"description": "Standard invoice"
					},
					{
						"name": "SIMPLIFIED",
						"value": "SIMPLIFIED",
						"description": "Simplified invoice"
					},
					{
						"name": "CORRECTIVE",
						"value": "CORRECTIVE",
						"description": "Corrects or cancels a previous invoice"
					},
					{
						"name": "PROFORMA",
						"value": "PROFORMA",
						"description": "Proforma (commercial document, non-fiscal numbering)"
					}
				],
				"default": ""
			},
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
				"description": "Series description (max 1000 characters)",
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
						"name": "— Not set —",
						"value": ""
					},
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
				"default": ""
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
		"action": "Delete an invoice series of a company",
		"description": "Soft-deletes an invoice series",
		"operationId": "deleteCompanySeries",
		"method": "DELETE",
		"path": "/v1/companies/{company_id}/series/{series_id}",
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
		"action": "Mark a series as the default of a company",
		"description": "Marks an invoice series as the default of this company (NIF)",
		"operationId": "setCompanyDefaultSeries",
		"method": "PUT",
		"path": "/v1/companies/{company_id}/series/{series_id}/default",
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
		"optionalCollectionName": "updateFields",
		"queryParamNames": [],
		"paginated": false,
		"isList": false,
		"listKey": ""
	},
	{
		"resource": "series",
		"operation": "getDefaults",
		"displayName": "Get Defaults",
		"action": "Get the default series of a company, per document type",
		"description": "Reports, for each `DocumentType` relevant to automatic invoicing flows (Stripe Connect, etc.), whether this company (NIF) has a default invoice series and which one",
		"operationId": "getCompanyDefaultSeries",
		"method": "GET",
		"path": "/v1/companies/{company_id}/series/defaults",
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
		"resource": "series",
		"operation": "ensureDefaults",
		"displayName": "Ensure Defaults",
		"action": "Ensure the company has a default series for every document type",
		"description": "Idempotently ensures this company (NIF) has a default invoice series for each relevant `DocumentType` (STANDARD, SIMPLIFIED, CORRECTIVE) in the current environment",
		"operationId": "ensureCompanyDefaultSeries",
		"method": "PUT",
		"path": "/v1/companies/{company_id}/series/defaults",
		"pathParams": [],
		"requiredFields": [],
		"optionalFields": [],
		"filters": [],
		"optionalCollectionName": "updateFields",
		"queryParamNames": [],
		"paginated": false,
		"isList": true,
		"listKey": ""
	},
	{
		"resource": "recurringInvoice",
		"operation": "getAll",
		"displayName": "Get Many",
		"action": "List the recurring invoices of a company",
		"description": "Lists the recurring invoice templates of this company (NIF), with filters and pagination",
		"operationId": "listCompanyRecurringInvoices",
		"method": "GET",
		"path": "/v1/companies/{company_id}/recurring-invoices",
		"pathParams": [],
		"requiredFields": [],
		"optionalFields": [],
		"filters": [
			{
				"name": "status",
				"apiName": "status",
				"displayName": "Status",
				"description": "Lifecycle state of a recurring invoice schedule",
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
				"name": "sort_by",
				"apiName": "sort_by",
				"displayName": "Sort By",
				"description": "Field to sort by",
				"type": "options",
				"options": [
					{
						"name": "— Not set —",
						"value": ""
					},
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
						"name": "— Not set —",
						"value": ""
					},
					{
						"name": "Asc",
						"value": "asc"
					},
					{
						"name": "Desc",
						"value": "desc"
					}
				],
				"default": ""
			}
		],
		"optionalCollectionName": "options",
		"queryParamNames": [
			"status",
			"customer_id",
			"sort_by",
			"sort_order"
		],
		"paginated": true,
		"isList": true,
		"listKey": ""
	},
	{
		"resource": "recurringInvoice",
		"operation": "create",
		"displayName": "Create",
		"action": "Create a recurring invoice for a company",
		"description": "Creates a new recurring invoice template under this company (NIF) with all its template data (lines, recipient, series, payment) and recurrence configuration",
		"operationId": "createCompanyRecurringInvoice",
		"method": "POST",
		"path": "/v1/companies/{company_id}/recurring-invoices",
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
				"description": "Date the subscription started (YYYY-MM-DD)",
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
						"description": "Format: max 2000 characters",
						"required": true,
						"validation": {
							"maxLength": 2000
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
						"description": "Tax type",
						"type": "string",
						"default": ""
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
						"description": "VeriFactu regime key",
						"type": "string",
						"default": ""
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
						"name": "BIZUM",
						"value": "BIZUM"
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
				"description": "Whether the invoices generated by this template carry VeriFactu information",
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
		"operation": "get",
		"displayName": "Get",
		"action": "Get a recurring invoice of a company",
		"description": "Retrieves the full details of a recurring invoice template of this company (NIF), including its schedule, template lines and next generation date",
		"operationId": "getCompanyRecurringInvoice",
		"method": "GET",
		"path": "/v1/companies/{company_id}/recurring-invoices/{recurring_invoice_id}",
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
		"operation": "update",
		"displayName": "Update",
		"action": "Update a recurring invoice of a company partially",
		"description": "Updates only the fields present in the body, leaving every other field of the recurring invoice as it is — in particular the recipient, which survives a change of `lines`",
		"operationId": "patchCompanyRecurringInvoice",
		"method": "PATCH",
		"path": "/v1/companies/{company_id}/recurring-invoices/{recurring_invoice_id}",
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
				"description": "Template name (max 255 characters)",
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
				"description": "Day of the month the invoice is issued (between 1 and 31)",
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
				"description": "First issue date (YYYY-MM-DD)",
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
				"description": "Date the recurrence stops (YYYY-MM-DD)",
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
				"description": "Series the generated invoices are numbered in",
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
				"description": "Recipient of the generated invoices",
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
				"description": "Template lines, replaced as a whole (they are not patched line by line)",
				"validation": {
					"minItems": 1
				},
				"type": "fixedCollection",
				"fields": [
					{
						"name": "description",
						"apiName": "description",
						"displayName": "Description",
						"description": "Format: max 2000 characters",
						"required": true,
						"validation": {
							"maxLength": 2000
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
						"description": "Tax type",
						"type": "string",
						"default": ""
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
						"description": "VeriFactu regime key",
						"type": "string",
						"default": ""
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
				"description": "Payment method",
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
						"name": "BIZUM",
						"value": "BIZUM"
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
				"description": "Notes printed on the generated invoices",
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
				"description": "Email delivery settings, replaced as a whole",
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
		"operation": "delete",
		"displayName": "Delete",
		"action": "Delete a recurring invoice of a company",
		"description": "Permanently deletes a recurring invoice template of this company (NIF) and cancels any pending scheduled generations",
		"operationId": "deleteCompanyRecurringInvoice",
		"method": "DELETE",
		"path": "/v1/companies/{company_id}/recurring-invoices/{recurring_invoice_id}",
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
		"operation": "setStatus",
		"displayName": "Set Status",
		"action": "Set the status of a recurring invoice",
		"description": "Sets the lifecycle status of a recurring invoice template, which is how generation is paused and resumed: - `PAUSED` stops automatic generation, keeping the schedule configuration intact",
		"operationId": "setCompanyRecurringInvoiceStatus",
		"method": "PUT",
		"path": "/v1/companies/{company_id}/recurring-invoices/{recurring_invoice_id}/status",
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
		"requiredFields": [
			{
				"name": "status_recurringInvoice_setStatus",
				"apiName": "status",
				"displayName": "Status",
				"description": "Target status",
				"required": true,
				"type": "options",
				"options": [
					{
						"name": "ACTIVE",
						"value": "ACTIVE"
					},
					{
						"name": "PAUSED",
						"value": "PAUSED"
					}
				],
				"default": "ACTIVE"
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
		"resource": "recurringInvoice",
		"operation": "skipNext",
		"displayName": "Skip Next",
		"action": "Skip the next generation of a recurring invoice",
		"description": "Skips the next scheduled invoice generation and advances the generation date to the following period",
		"operationId": "skipCompanyRecurringInvoice",
		"method": "POST",
		"path": "/v1/companies/{company_id}/recurring-invoices/{recurring_invoice_id}/skip",
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
		"description": "Runs the generation of this recurring template immediately, out of its schedule",
		"operationId": "generateCompanyRecurringInvoiceNow",
		"method": "POST",
		"path": "/v1/companies/{company_id}/recurring-invoices/{recurring_invoice_id}/generate",
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
		"operation": "getNextOccurrence",
		"displayName": "Get Next Occurrence",
		"action": "Get the next occurrence of a recurring invoice",
		"description": "Returns the invoice that would be produced by the next generation of this recurring template, computed from the current issuer, recipient and series data",
		"operationId": "getCompanyRecurringInvoiceNextOccurrence",
		"method": "GET",
		"path": "/v1/companies/{company_id}/recurring-invoices/{recurring_invoice_id}/next-occurrence",
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
		"operation": "getHistory",
		"displayName": "Get History",
		"action": "Get the generation history of a recurring invoice",
		"description": "Returns the invoices previously generated from this recurring template, including their status and generation dates",
		"operationId": "getCompanyRecurringInvoiceHistory",
		"method": "GET",
		"path": "/v1/companies/{company_id}/recurring-invoices/{recurring_invoice_id}/history",
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
		"resource": "recurringInvoice",
		"operation": "createFromInvoice",
		"displayName": "Create From Invoice",
		"action": "Derive a recurring invoice from an existing invoice",
		"description": "Creates a recurring invoice template of this company taking its lines, recipient, series and payment data from an existing invoice, so only the recurrence has to be described",
		"operationId": "createCompanyRecurringInvoiceDerivation",
		"method": "POST",
		"path": "/v1/companies/{company_id}/recurring-invoices/derivations",
		"pathParams": [],
		"requiredFields": [
			{
				"name": "from_invoice_id",
				"apiName": "from_invoice_id",
				"displayName": "From Invoice ID",
				"description": "Invoice the template is derived from (UUID)",
				"required": true,
				"validation": {
					"format": "uuid"
				},
				"type": "string",
				"default": ""
			},
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
				"description": "Date the subscription started (YYYY-MM-DD)",
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
				"description": "Whether the invoices this template generates enter VeriFactu",
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
		"resource": "configuration",
		"operation": "getTaxConfiguration",
		"displayName": "Get Tax Configuration",
		"action": "Get the tax configuration of a company",
		"description": "Retrieves the tax configuration of this company (NIF), including: - Default tax regime (VAT, IGIC, IPSI, OTHERS) - Default main tax percentage - IRPF and equivalence surcharge configuration The catalog of tax types this configuration draws from is not company data and lives outside this resource",
		"operationId": "getCompanyTaxConfiguration",
		"method": "GET",
		"path": "/v1/companies/{company_id}/tax-configuration",
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
		"action": "Get the VeriFactu configuration of a company",
		"description": "Retrieves the VeriFactu configuration of this company (NIF)",
		"operationId": "getCompanyVeriFactuConfiguration",
		"method": "GET",
		"path": "/v1/companies/{company_id}/verifactu-configuration",
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
		"action": "List the tax types allowed in Spain",
		"description": "Returns the tax regimes and percentages that Spanish law allows on an invoice: VAT (mainland), IGIC (Canary Islands), IPSI (Ceuta and Melilla), the withholding (IRPF) percentages, the equivalence surcharge that corresponds to each VAT rate, and the exemption reasons with the classification each o...",
		"operationId": "listTaxTypes",
		"method": "GET",
		"path": "/v1/tax-types",
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
		"action": "List invoice templates",
		"description": "Returns the PDF templates a NIF can be rendered with, each one with a readable name and a short description, translated into the language of the user the credential belongs to",
		"operationId": "listInvoiceCustomizationOptions",
		"method": "GET",
		"path": "/v1/invoice-customization-options",
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
				"placeholder": "My Company Ltd"
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
		"action": "Create a company",
		"description": "Creates a new NIF/company under the authenticated account",
		"operationId": "createCompany",
		"method": "POST",
		"path": "/v1/accounts/{account_id}/companies",
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
				"placeholder": "B12345674"
			},
			{
				"name": "legal_name_company_create",
				"apiName": "legal_name",
				"displayName": "Legal Name",
				"description": "Legal/fiscal name",
				"required": true,
				"type": "string",
				"default": "",
				"placeholder": "My Company Ltd"
			},
			{
				"name": "entity_type",
				"apiName": "entity_type",
				"displayName": "Entity Type",
				"description": "Taxpayer type",
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
				"name": "address",
				"apiName": "address",
				"displayName": "Address",
				"description": "Address you send when you create or update a company, a customer or an onboarding",
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
						"placeholder": "123 Main Street"
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
						"placeholder": "2nd floor, Apt A"
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
						"description": "The country name in Spanish, e.g. España for Spain — this is what BeeL's API expects (max 100 characters)",
						"validation": {
							"pattern": "^[a-zA-Z0-9À-ÿ\\u0100-\\u017F\\u00B7\\u2018\\u2019\\u0060\\u00B4\\s\\.,\\-\\/'ºª]+$",
							"minLength": 1,
							"maxLength": 100
						},
						"type": "string",
						"default": "",
						"placeholder": "Spain"
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
						"default": "",
						"placeholder": "ES"
					}
				],
				"default": {}
			}
		],
		"optionalFields": [
			{
				"name": "legal_form",
				"apiName": "legal_form",
				"displayName": "Legal Form",
				"description": "Legal form (SL, SA, ...)",
				"type": "string",
				"default": "",
				"placeholder": "SL"
			},
			{
				"name": "legal_representative",
				"apiName": "legal_representative",
				"displayName": "Legal Representative",
				"description": "Legal representative data for a legal entity",
				"type": "fixedCollection",
				"fields": [
					{
						"name": "full_name",
						"apiName": "full_name",
						"displayName": "Full Name",
						"description": "Full name of the legal representative (max 255 characters)",
						"required": true,
						"validation": {
							"minLength": 1,
							"maxLength": 255
						},
						"type": "string",
						"default": "",
						"placeholder": "Jane Smith"
					},
					{
						"name": "nif",
						"apiName": "nif",
						"displayName": "NIF",
						"description": "Tax ID of the legal representative (DNI/CIF/NIE) (exactly 9 characters)",
						"required": true,
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
						"placeholder": "123 Main Street",
						"required": true,
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
						"required": true,
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
						"placeholder": "2nd floor, Apt A",
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
						"required": true,
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
						"required": true,
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
						"required": true,
						"groupRequired": true
					},
					{
						"name": "address_country",
						"apiName": "address.country",
						"displayName": "Address Country",
						"description": "The country name in Spanish, e.g. España for Spain — this is what BeeL's API expects (max 100 characters)",
						"validation": {
							"pattern": "^[a-zA-Z0-9À-ÿ\\u0100-\\u017F\\u00B7\\u2018\\u2019\\u0060\\u00B4\\s\\.,\\-\\/'ºª]+$",
							"minLength": 1,
							"maxLength": 100
						},
						"type": "string",
						"default": "",
						"placeholder": "Spain",
						"required": false
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
						"default": "",
						"placeholder": "ES",
						"required": false
					}
				],
				"default": {}
			},
			{
				"name": "trade_name",
				"apiName": "trade_name",
				"displayName": "Trade Name",
				"description": "Commercial/trade name (optional)",
				"type": "string",
				"default": "",
				"placeholder": "My Company"
			},
			{
				"name": "default_main_tax",
				"apiName": "default_main_tax",
				"displayName": "Default Main Tax",
				"description": "Complete tax information with cross-validations: - IVA: only percentages 0, 4, 10, 21 - IGIC: only percentages 0, 3, 5, 7, 9.5, 15, 20 - IPSI: only percentages 0.5, 1, 2, 4, 8, 10 - OTHER: any percentage between 0 and 100 Exception: when regime_key = \"17\" (OSS/IOSS) the invoice applies the destin...",
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
						"description": "Regime key according to VeriFactu regulations",
						"type": "options",
						"options": [
							{
								"name": "— Not set —",
								"value": ""
							},
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
						"default": ""
					}
				],
				"default": {}
			},
			{
				"name": "default_irpf_rate",
				"apiName": "default_irpf_rate",
				"displayName": "Default IRPF Rate",
				"description": "Default IRPF retention rate for this company's invoices (between 0 and 100)",
				"validation": {
					"minimum": 0,
					"maximum": 100
				},
				"type": "number",
				"default": 0
			},
			{
				"name": "numbering",
				"apiName": "numbering",
				"displayName": "Numbering",
				"description": "Configuration of the invoice series the company is born with",
				"type": "fixedCollection",
				"fields": [
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
						"name": "initial_number",
						"apiName": "initial_number",
						"displayName": "Initial Number",
						"description": "Number the ordinary series counter starts at (between 1 and 999999)",
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
						"name": "format",
						"apiName": "format",
						"displayName": "Format",
						"description": "Format template the ordinary series' invoice numbers are printed with (`{CODIGO}`, `{YYYY}`/`{YY}`, `{MM}`, `{NUM}`/`{NUM:X}` — must contain `{NUM}` or `{NUM:X}`) (max 255 characters)",
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
						"description": "When the ordinary series' counter resets (`NEVER`/`ANNUAL`/`MONTHLY`)",
						"type": "options",
						"options": [
							{
								"name": "— Not set —",
								"value": ""
							},
							{
								"name": "NEVER",
								"value": "NEVER"
							},
							{
								"name": "ANNUAL",
								"value": "ANNUAL"
							},
							{
								"name": "MONTHLY",
								"value": "MONTHLY"
							}
						],
						"default": ""
					},
					{
						"name": "simplified_code",
						"apiName": "simplified.code",
						"displayName": "Simplified Code",
						"description": "Alphanumeric series code (used in {CODIGO} variable) (max 50 characters)",
						"validation": {
							"pattern": "^[A-Z0-9\\-_]{1,50}$",
							"minLength": 1,
							"maxLength": 50
						},
						"type": "string",
						"default": "",
						"placeholder": "FAC",
						"required": false
					},
					{
						"name": "simplified_initial_number",
						"apiName": "simplified.initial_number",
						"displayName": "Simplified Initial Number",
						"description": "Number this series' counter starts at, to continue the numbering already used elsewhere (between 1 and 999999)",
						"validation": {
							"minimum": 1,
							"maximum": 999999,
							"format": "int64"
						},
						"type": "number",
						"default": 0,
						"numberPrecision": 0,
						"required": false
					},
					{
						"name": "simplified_format",
						"apiName": "simplified.format",
						"displayName": "Simplified Format",
						"description": "Format template this series' invoice numbers are printed with (max 255 characters)",
						"validation": {
							"pattern": "^[A-Z0-9\\-_/{}:]*$",
							"minLength": 1,
							"maxLength": 255
						},
						"type": "string",
						"default": "",
						"placeholder": "{CODIGO}-{YYYY}-{NUM:4}",
						"required": false
					},
					{
						"name": "simplified_counter_reset",
						"apiName": "simplified.counter_reset",
						"displayName": "Simplified Counter Reset",
						"description": "When this series' counter resets (`NEVER`/`ANNUAL`/`MONTHLY`)",
						"type": "options",
						"options": [
							{
								"name": "— Not set —",
								"value": ""
							},
							{
								"name": "NEVER",
								"value": "NEVER"
							},
							{
								"name": "ANNUAL",
								"value": "ANNUAL"
							},
							{
								"name": "MONTHLY",
								"value": "MONTHLY"
							}
						],
						"default": "",
						"required": false
					},
					{
						"name": "corrective_code",
						"apiName": "corrective.code",
						"displayName": "Corrective Code",
						"description": "Alphanumeric series code (used in {CODIGO} variable) (max 50 characters)",
						"validation": {
							"pattern": "^[A-Z0-9\\-_]{1,50}$",
							"minLength": 1,
							"maxLength": 50
						},
						"type": "string",
						"default": "",
						"placeholder": "FAC",
						"required": false
					},
					{
						"name": "corrective_initial_number",
						"apiName": "corrective.initial_number",
						"displayName": "Corrective Initial Number",
						"description": "Number this series' counter starts at, to continue the numbering already used elsewhere (between 1 and 999999)",
						"validation": {
							"minimum": 1,
							"maximum": 999999,
							"format": "int64"
						},
						"type": "number",
						"default": 0,
						"numberPrecision": 0,
						"required": false
					},
					{
						"name": "corrective_format",
						"apiName": "corrective.format",
						"displayName": "Corrective Format",
						"description": "Format template this series' invoice numbers are printed with (max 255 characters)",
						"validation": {
							"pattern": "^[A-Z0-9\\-_/{}:]*$",
							"minLength": 1,
							"maxLength": 255
						},
						"type": "string",
						"default": "",
						"placeholder": "{CODIGO}-{YYYY}-{NUM:4}",
						"required": false
					},
					{
						"name": "corrective_counter_reset",
						"apiName": "corrective.counter_reset",
						"displayName": "Corrective Counter Reset",
						"description": "When this series' counter resets (`NEVER`/`ANNUAL`/`MONTHLY`)",
						"type": "options",
						"options": [
							{
								"name": "— Not set —",
								"value": ""
							},
							{
								"name": "NEVER",
								"value": "NEVER"
							},
							{
								"name": "ANNUAL",
								"value": "ANNUAL"
							},
							{
								"name": "MONTHLY",
								"value": "MONTHLY"
							}
						],
						"default": "",
						"required": false
					}
				],
				"default": {}
			},
			{
				"name": "aeat_environment",
				"apiName": "aeat_environment",
				"displayName": "Aeat Environment",
				"description": "AEAT/VeriFactu environment to register this NIF against",
				"type": "options",
				"options": [
					{
						"name": "TEST",
						"value": "TEST"
					},
					{
						"name": "PROD",
						"value": "PROD"
					}
				],
				"default": "TEST"
			},
			{
				"name": "activate",
				"apiName": "activate",
				"displayName": "Activate",
				"description": "Whether to **switch the company on** in `aeat_environment` as part of this call",
				"type": "boolean",
				"default": true
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
		"action": "List the companies (NIFs) of an account (paginated)",
		"description": "Returns a server-side page of the companies (NIFs) that belong to the given account, optionally filtered by `search` (NIF / legal name / trade name)",
		"operationId": "listCompanies",
		"method": "GET",
		"path": "/v1/accounts/{account_id}/companies",
		"pathParams": [],
		"requiredFields": [],
		"optionalFields": [],
		"filters": [
			{
				"name": "search",
				"apiName": "search",
				"displayName": "Search",
				"description": "Case-insensitive filter on NIF, legal name or trade name",
				"type": "string",
				"default": ""
			},
			{
				"name": "include",
				"apiName": "include",
				"displayName": "Include",
				"description": "Include derived data",
				"type": "options",
				"options": [
					{
						"name": "— Not set —",
						"value": ""
					},
					{
						"name": "Readiness",
						"value": "readiness"
					}
				],
				"default": ""
			}
		],
		"optionalCollectionName": "options",
		"queryParamNames": [
			"search",
			"include"
		],
		"paginated": true,
		"isList": true,
		"listKey": ""
	},
	{
		"resource": "company",
		"operation": "get",
		"displayName": "Get",
		"action": "Get company details",
		"description": "Returns details of a specific company (NIF), including its VeriFactu status",
		"operationId": "getCompanyById",
		"method": "GET",
		"path": "/v1/companies/{company_id}",
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
		"resource": "company",
		"operation": "update",
		"displayName": "Update",
		"action": "Update company details",
		"description": "Updates editable fields of a company (same field set as the profile)",
		"operationId": "patchCompanyById",
		"method": "PATCH",
		"path": "/v1/companies/{company_id}",
		"pathParams": [],
		"requiredFields": [],
		"optionalFields": [
			{
				"name": "entity_type",
				"apiName": "entity_type",
				"displayName": "Entity Type",
				"description": "Entity type",
				"type": "options",
				"options": [
					{
						"name": "— Not set —",
						"value": ""
					},
					{
						"name": "INDIVIDUAL",
						"value": "INDIVIDUAL"
					},
					{
						"name": "LEGAL ENTITY",
						"value": "LEGAL_ENTITY"
					}
				],
				"default": ""
			},
			{
				"name": "legal_name",
				"apiName": "legal_name",
				"displayName": "Legal Name",
				"description": "Legal/fiscal name (max 255 characters)",
				"validation": {
					"minLength": 1,
					"maxLength": 255
				},
				"type": "string",
				"default": "",
				"placeholder": "My Company Ltd"
			},
			{
				"name": "nif",
				"apiName": "nif",
				"displayName": "NIF",
				"description": "NIF/CIF (exactly 9 characters)",
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
				"name": "legal_form",
				"apiName": "legal_form",
				"displayName": "Legal Form",
				"description": "Legal form (SL, SA, ...) (max 100 characters)",
				"validation": {
					"minLength": 1,
					"maxLength": 100
				},
				"type": "string",
				"default": ""
			},
			{
				"name": "trade_name",
				"apiName": "trade_name",
				"displayName": "Trade Name",
				"description": "Commercial/trade name for the company (max 255 characters)",
				"validation": {
					"minLength": 1,
					"maxLength": 255
				},
				"type": "string",
				"default": "",
				"placeholder": "My Company"
			},
			{
				"name": "address",
				"apiName": "address",
				"displayName": "Address",
				"description": "Address you send when you create or update a company, a customer or an onboarding",
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
						"placeholder": "123 Main Street"
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
						"placeholder": "2nd floor, Apt A"
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
						"description": "The country name in Spanish, e.g. España for Spain — this is what BeeL's API expects (max 100 characters)",
						"validation": {
							"pattern": "^[a-zA-Z0-9À-ÿ\\u0100-\\u017F\\u00B7\\u2018\\u2019\\u0060\\u00B4\\s\\.,\\-\\/'ºª]+$",
							"minLength": 1,
							"maxLength": 100
						},
						"type": "string",
						"default": "",
						"placeholder": "Spain"
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
						"default": "",
						"placeholder": "ES"
					}
				],
				"default": {}
			},
			{
				"name": "legal_representative",
				"apiName": "legal_representative",
				"displayName": "Legal Representative",
				"description": "Legal representative data for a legal entity",
				"type": "fixedCollection",
				"fields": [
					{
						"name": "full_name",
						"apiName": "full_name",
						"displayName": "Full Name",
						"description": "Full name of the legal representative (max 255 characters)",
						"required": true,
						"validation": {
							"minLength": 1,
							"maxLength": 255
						},
						"type": "string",
						"default": "",
						"placeholder": "Jane Smith"
					},
					{
						"name": "nif",
						"apiName": "nif",
						"displayName": "NIF",
						"description": "Tax ID of the legal representative (DNI/CIF/NIE) (exactly 9 characters)",
						"required": true,
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
						"placeholder": "123 Main Street",
						"required": true,
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
						"required": true,
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
						"placeholder": "2nd floor, Apt A",
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
						"required": true,
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
						"required": true,
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
						"required": true,
						"groupRequired": true
					},
					{
						"name": "address_country",
						"apiName": "address.country",
						"displayName": "Address Country",
						"description": "The country name in Spanish, e.g. España for Spain — this is what BeeL's API expects (max 100 characters)",
						"validation": {
							"pattern": "^[a-zA-Z0-9À-ÿ\\u0100-\\u017F\\u00B7\\u2018\\u2019\\u0060\\u00B4\\s\\.,\\-\\/'ºª]+$",
							"minLength": 1,
							"maxLength": 100
						},
						"type": "string",
						"default": "",
						"placeholder": "Spain",
						"required": false
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
						"default": "",
						"placeholder": "ES",
						"required": false
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
				"default": "",
				"placeholder": "user@example.com"
			},
			{
				"name": "website",
				"apiName": "website",
				"displayName": "Website",
				"description": "Website (max 500 characters)",
				"validation": {
					"minLength": 1,
					"maxLength": 500
				},
				"type": "string",
				"default": ""
			},
			{
				"name": "logo_url",
				"apiName": "logo_url",
				"displayName": "Logo URL",
				"description": "Logo URL (max 500 characters)",
				"validation": {
					"minLength": 1,
					"maxLength": 500
				},
				"type": "string",
				"default": ""
			},
			{
				"name": "additional_info",
				"apiName": "additional_info",
				"displayName": "Additional Info",
				"description": "Additional information displayed on invoices (max 500 characters)",
				"validation": {
					"maxLength": 500
				},
				"type": "string",
				"default": ""
			},
			{
				"name": "default_iban",
				"apiName": "default_iban",
				"displayName": "Default IBAN",
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
				"name": "default_swift",
				"apiName": "default_swift",
				"displayName": "Default SWIFT",
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
				"name": "account_holder",
				"apiName": "account_holder",
				"displayName": "Account Holder",
				"description": "Bank account holder (max 255 characters)",
				"validation": {
					"minLength": 1,
					"maxLength": 255
				},
				"type": "string",
				"default": ""
			},
			{
				"name": "iae",
				"apiName": "iae",
				"displayName": "Iae",
				"description": "IAE code (max 20 characters)",
				"validation": {
					"minLength": 1,
					"maxLength": 20
				},
				"type": "string",
				"default": ""
			},
			{
				"name": "activity_start_date",
				"apiName": "activity_start_date",
				"displayName": "Activity Start Date",
				"description": "Activity start date (YYYY-MM-DD)",
				"validation": {
					"format": "date"
				},
				"type": "string",
				"default": ""
			},
			{
				"name": "default_payment_term",
				"apiName": "default_payment_term",
				"displayName": "Default Payment Term",
				"description": "Default payment term in days (between 0 and 365)",
				"validation": {
					"minimum": 0,
					"maximum": 365
				},
				"type": "number",
				"default": 0,
				"numberPrecision": 0
			},
			{
				"name": "invoice_template_type",
				"apiName": "invoice_template_type",
				"displayName": "Invoice Template Type",
				"description": "Invoice PDF template type",
				"type": "options",
				"options": [
					{
						"name": "— Not set —",
						"value": ""
					},
					{
						"name": "MODERN TABLE",
						"value": "MODERN_TABLE"
					},
					{
						"name": "PROFESSIONAL SERVICE",
						"value": "PROFESSIONAL_SERVICE"
					}
				],
				"default": ""
			},
			{
				"name": "invoice_accent_color",
				"apiName": "invoice_accent_color",
				"displayName": "Invoice Accent Color",
				"description": "Invoice PDF accent color (#RRGGBB)",
				"validation": {
					"pattern": "^#[0-9A-Fa-f]{6}$"
				},
				"type": "string",
				"default": "",
				"placeholder": "#fc481d"
			},
			{
				"name": "invoice_language",
				"apiName": "invoice_language",
				"displayName": "Invoice Language",
				"description": "Language for invoice PDFs",
				"type": "options",
				"options": [
					{
						"name": "— Not set —",
						"value": ""
					},
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
				"default": ""
			},
			{
				"name": "email_language",
				"apiName": "email_language",
				"displayName": "Email Language",
				"description": "Language for emails",
				"type": "options",
				"options": [
					{
						"name": "— Not set —",
						"value": ""
					},
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
		"description": "Removes the NIF from your account: it stops appearing in the account and stops being billed",
		"operationId": "deleteCompanyById",
		"method": "DELETE",
		"path": "/v1/companies/{company_id}",
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
		"resource": "company",
		"operation": "generateRepresentation",
		"displayName": "Generate Representation",
		"action": "Generate the representation document",
		"description": "Generates the unsigned AEAT representation PDF for this company (NIF), which is the first step of the process: download it with `GET /v1/companies/{company_id}/representation/document`, sign it digitally and upload it back with `POST /v1/companies/{company_id}/representation/submit`",
		"operationId": "generateCompanyRepresentation",
		"method": "POST",
		"path": "/v1/companies/{company_id}/representation",
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
		"resource": "company",
		"operation": "downloadRepresentation",
		"displayName": "Download Representation",
		"action": "Download the representation document",
		"description": "Returns a presigned URL, valid for 5 minutes, to download the representation PDF of this company (NIF)",
		"operationId": "downloadCompanyRepresentationDocument",
		"method": "GET",
		"path": "/v1/companies/{company_id}/representation/document",
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
		"resource": "company",
		"operation": "getRepresentationStatus",
		"displayName": "Get Representation Status",
		"action": "Get fiscal representation",
		"description": "Returns the state of the AEAT fiscal representation of this company (NIF): whether the document has been generated, signed, submitted, accepted or cancelled",
		"operationId": "getCompanyRepresentation",
		"method": "GET",
		"path": "/v1/companies/{company_id}/representation",
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
		"resource": "company",
		"operation": "cancelRepresentation",
		"displayName": "Cancel Representation",
		"action": "Cancel the fiscal representation",
		"description": "Cancels the active AEAT representation of this company (NIF)",
		"operationId": "cancelCompanyRepresentation",
		"method": "DELETE",
		"path": "/v1/companies/{company_id}/representation",
		"pathParams": [],
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

/**
 * Paths of the endpoints the hand-written code calls directly, straight from the
 * contract — the dropdown loaders, the identity lookup and the Trigger node's
 * subscription. Declared in `REFERENCED_OPERATION_IDS`; generation fails if the
 * contract drops one, so a retired route can never be left hardcoded in a caller.
 */
export const CONTRACT_PATHS: Record<string, string> = {
	"createAccountWebhookSubscription": "/v1/accounts/{account_id}/webhooks",
	"deleteAccountWebhookSubscription": "/v1/accounts/{account_id}/webhooks/{webhook_id}",
	"getCompanyInvoicePdf": "/v1/companies/{company_id}/invoices/{invoice_id}/pdf",
	"getMyIdentity": "/v1/me/identity",
	"listAccountWebhookSubscriptions": "/v1/accounts/{account_id}/webhooks",
	"listCompanies": "/v1/accounts/{account_id}/companies",
	"listCompanyCustomers": "/v1/companies/{company_id}/customers",
	"listCompanyProducts": "/v1/companies/{company_id}/products",
	"listCompanySeries": "/v1/companies/{company_id}/series",
	"patchAccountWebhookSubscription": "/v1/accounts/{account_id}/webhooks/{webhook_id}",
	"previewCompanyInvoicePdf": "/v1/companies/{company_id}/invoices/{invoice_id}/pdf/preview",
	"submitCompanyRepresentation": "/v1/companies/{company_id}/representation/submit"
};
