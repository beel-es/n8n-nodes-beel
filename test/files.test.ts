import { describe, expect, it } from 'vitest';

import { downloadInvoicePdf, submitRepresentation } from '../nodes/Beel/manualOperations';
import { COMPANY_BASE, COMPANY_ID, INVOICE_ID, makeContext } from './helpers';

/**
 * The two operations that move a file rather than JSON. They are hand-written,
 * so nothing in the generated metadata covers them.
 */

const PDF = Buffer.from('%PDF-1.4 fake');

describe('downloading an invoice PDF', () => {
	it('follows the pre-signed URL and puts the file in a binary field', async () => {
		const stub = makeContext({
			parameters: {
				invoiceId: INVOICE_ID,
				binaryPropertyName: 'data',
				draftPreview: false,
			},
			responses: [
				{ data: { download_url: 'https://files.beel.es/x.pdf', file_name: 'A-2026-0001.pdf' } },
				PDF,
			],
		});

		const item = await downloadInvoicePdf.call(stub.context, 0);

		expect(stub.requests[0].url).toBe(`${COMPANY_BASE}/invoices/${INVOICE_ID}/pdf`);
		expect(stub.requests[1].url).toBe('https://files.beel.es/x.pdf');
		expect(item.binary?.data).toMatchObject({
			fileName: 'A-2026-0001.pdf',
			mimeType: 'application/pdf',
		});
	});

	it('never sends the API key to storage', async () => {
		const stub = makeContext({
			parameters: { invoiceId: INVOICE_ID, binaryPropertyName: 'data', draftPreview: false },
			responses: [{ data: { download_url: 'https://files.beel.es/x.pdf', file_name: 'a.pdf' } }, PDF],
		});

		await downloadInvoicePdf.call(stub.context, 0);

		// The signature travels in the URL; the second request carries no auth at all.
		expect(stub.requests[1].headers).toBeUndefined();
	});

	it('explains itself when a draft has no final PDF', async () => {
		const stub = makeContext({
			parameters: { invoiceId: INVOICE_ID, binaryPropertyName: 'data', draftPreview: false },
			responses: { data: {} },
		});

		await expect(downloadInvoicePdf.call(stub.context, 0)).rejects.toThrow(/did not return a PDF/);
	});

	it('streams the preview endpoint for a draft', async () => {
		const stub = makeContext({
			parameters: { invoiceId: INVOICE_ID, binaryPropertyName: 'file', draftPreview: true },
			responses: PDF,
		});

		const item = await downloadInvoicePdf.call(stub.context, 0);

		expect(stub.requests).toHaveLength(1);
		expect(stub.requests[0].url).toBe(
			`${COMPANY_BASE}/invoices/${INVOICE_ID}/pdf/preview`,
		);
		expect(item.json).toMatchObject({ preview: true });
		expect(item.binary?.file).toBeDefined();
	});
});

describe('submitting a signed representation', () => {
	it('uploads the binary field as multipart', async () => {
		const stub = makeContext({
			parameters: { activeCompany: COMPANY_ID, inputBinaryField: 'data' },
			binary: { data: { data: PDF, fileName: 'signed.pdf', mimeType: 'application/pdf' } },
			responses: { data: { status: 'SUBMITTED' } },
		});

		const item = await submitRepresentation.call(stub.context, 0);

		expect(stub.requests[0]).toMatchObject({
			method: 'POST',
			url: `${COMPANY_BASE}/representation/submit`,
		});
		expect(stub.requests[0].body).toBeInstanceOf(FormData);
		expect((stub.requests[0].body as FormData).get('file')).toBeInstanceOf(Blob);
		expect(item.json).toMatchObject({ status: 'SUBMITTED' });
	});

	it('refuses a binary field that is not a PDF', async () => {
		const stub = makeContext({
			parameters: { activeCompany: COMPANY_ID, inputBinaryField: 'data' },
			binary: { data: { data: PDF, fileName: 'photo.png', mimeType: 'image/png' } },
		});

		await expect(submitRepresentation.call(stub.context, 0)).rejects.toThrow(/must be a PDF/);
		expect(stub.requests).toHaveLength(0);
	});

	it('requires a company, since the path is scoped by one', async () => {
		const stub = makeContext({
			parameters: { activeCompany: '  ', inputBinaryField: 'data' },
			credentials: { apiKey: 'beel_sk_test_x' },
			binary: { data: { data: PDF, mimeType: 'application/pdf' } },
		});

		await expect(submitRepresentation.call(stub.context, 0)).rejects.toThrow(/needs a company/);
		expect(stub.requests).toHaveLength(0);
	});
});
