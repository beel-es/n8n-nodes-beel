import type { IDataObject, IExecuteFunctions, INodeExecutionData, INodeProperties } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';

import { beelApiRequest, resolveCompanyId, unwrap } from './GenericFunctions';
import type { GeneratedOperation } from './descriptions/generated/types';

/**
 * Operations that cannot come from the generator because they produce a file
 * rather than JSON. They are declared in the same shape as generated ones so the
 * Operation dropdown treats them identically.
 */

const INVOICE_ID_FIELD = {
	displayName: 'Invoice ID',
	name: 'invoiceId',
	apiName: 'invoice_id',
	type: 'string' as const,
	default: '',
	required: true,
	description: 'ID of the invoice',
	validation: { format: 'uuid' },
};

export const MANUAL_OPERATIONS: GeneratedOperation[] = [
	{
		resource: 'invoice',
		operation: 'downloadPdf',
		displayName: 'Download PDF',
		action: 'Download an invoice PDF',
		description: 'Download the invoice PDF as binary data',
		operationId: 'generateInvoicePdf',
		method: 'GET',
		path: '/v1/invoices/{invoice_id}/pdf',
		pathParams: [INVOICE_ID_FIELD],
		requiredFields: [],
		optionalFields: [],
		filters: [],
		optionalCollectionName: 'options',
		queryParamNames: [],
		paginated: false,
		isList: false,
		listKey: '',
	},
];

/** Extra properties for the hand-written operations. */
export const MANUAL_PROPERTIES: INodeProperties[] = [
	{
		displayName: 'Put Output File in Field',
		name: 'binaryPropertyName',
		type: 'string',
		default: 'data',
		required: true,
		hint: 'The name of the output binary field to put the PDF in',
		displayOptions: { show: { resource: ['invoice'], operation: ['downloadPdf'] } },
	},
	{
		displayName: 'Draft Preview',
		name: 'draftPreview',
		type: 'boolean',
		default: false,
		description:
			'Whether to render a watermarked preview instead. Issued invoices have a final PDF; drafts have no invoice number yet, so only a preview can be produced for them.',
		displayOptions: { show: { resource: ['invoice'], operation: ['downloadPdf'] } },
	},
];

/**
 * Downloads an invoice PDF into a binary field.
 *
 * Issued invoices are fetched through a short-lived pre-signed URL, so the second
 * request goes straight to storage and must not carry the API key. Drafts have no
 * final PDF and are rendered by the preview endpoint, which streams the bytes.
 */
export async function downloadInvoicePdf(
	this: IExecuteFunctions,
	itemIndex: number,
): Promise<INodeExecutionData> {
	const invoiceId = (this.getNodeParameter('invoiceId', itemIndex) as string).trim();
	const binaryPropertyName = this.getNodeParameter('binaryPropertyName', itemIndex) as string;
	const draftPreview = this.getNodeParameter('draftPreview', itemIndex, false) as boolean;

	if (invoiceId === '') {
		throw new NodeOperationError(this.getNode(), '"Invoice ID" is required', { itemIndex });
	}

	const companyId = resolveCompanyId(this, itemIndex);
	let buffer: Buffer;
	let fileName: string;
	let json: IDataObject;

	if (draftPreview) {
		const response = (await beelApiRequest.call(
			this,
			'GET',
			`/v1/invoices/${encodeURIComponent(invoiceId)}/pdf/preview`,
			undefined,
			{},
			companyId,
			{ encoding: 'arraybuffer', json: false },
		)) as ArrayBuffer;

		buffer = Buffer.from(response);
		fileName = `invoice-${invoiceId}-preview.pdf`;
		json = { invoice_id: invoiceId, file_name: fileName, preview: true };
	} else {
		const pdf = unwrap(
			await beelApiRequest.call(
				this,
				'GET',
				`/v1/invoices/${encodeURIComponent(invoiceId)}/pdf`,
				undefined,
				{},
				companyId,
			),
		);

		const downloadUrl = pdf.download_url as string | undefined;
		if (!downloadUrl) {
			throw new NodeOperationError(this.getNode(), 'The API did not return a PDF download URL', {
				itemIndex,
				description: 'Only issued invoices have a final PDF. Enable "Draft Preview" for drafts.',
			});
		}

		// Pre-signed URL: authenticate via the signature in the URL, never the API key.
		const response = (await this.helpers.httpRequest({
			method: 'GET',
			url: downloadUrl,
			encoding: 'arraybuffer',
			json: false,
		})) as ArrayBuffer;

		buffer = Buffer.from(response);
		fileName = (pdf.file_name as string) ?? `invoice-${invoiceId}.pdf`;
		json = { ...pdf, invoice_id: invoiceId };
	}

	return {
		json,
		binary: {
			[binaryPropertyName]: await this.helpers.prepareBinaryData(buffer, fileName, 'application/pdf'),
		},
		pairedItem: { item: itemIndex },
	};
}
