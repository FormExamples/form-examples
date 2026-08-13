import type { RequestHandler } from './$types';
import { buildPdfDocument } from '$lib/report/pdf-builder';
import type { DieticAssessment, GradingResult } from '$lib/engine/types';

export const POST: RequestHandler = async ({ request }) => {
	const { data, result, generatedAt } = (await request.json()) as {
		data: DieticAssessment;
		result: GradingResult;
		generatedAt: string;
	};

	const docDefinition = buildPdfDocument(data, result, generatedAt);

	// Dynamic import for server-side pdfmake.
	const PdfPrinter = (await import('pdfmake')).default;

	const fonts = {
		Roboto: {
			normal: 'node_modules/pdfmake/build/vfs_fonts.js',
			bold: 'node_modules/pdfmake/build/vfs_fonts.js',
			italics: 'node_modules/pdfmake/build/vfs_fonts.js',
			bolditalics: 'node_modules/pdfmake/build/vfs_fonts.js'
		}
	};

	// @ts-expect-error pdfmake types don't expose the constructor correctly
	const printer = new PdfPrinter(fonts);
	const pdfDoc = printer.createPdfKitDocument(docDefinition);

	const chunks: Uint8Array[] = [];

	return new Promise<Response>((resolve) => {
		pdfDoc.on('data', (chunk: Uint8Array) => chunks.push(chunk));
		pdfDoc.on('end', () => {
			const pdfBuffer = Buffer.concat(chunks);
			resolve(
				new Response(pdfBuffer, {
					headers: {
						'Content-Type': 'application/pdf',
						'Content-Disposition': 'attachment; filename="dietic-assessment.pdf"'
					}
				})
			);
		});
		pdfDoc.end();
	});
};
