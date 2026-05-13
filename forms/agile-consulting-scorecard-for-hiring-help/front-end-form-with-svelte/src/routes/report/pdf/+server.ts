import type { RequestHandler } from './$types';
import { buildPdfDocument } from '$lib/report/pdf-builder';
import { gradeScorecard } from '$lib/engine/score-grader';
import { parseAssessment } from '$lib/engine/schema';

export const POST: RequestHandler = async ({ request }) => {
	const raw = await request.json();
	const data = parseAssessment(raw);
	const grade = gradeScorecard(data);

	const docDefinition = buildPdfDocument(data, grade);

	// Dynamic import for server-side pdfmake.
	const PdfPrinter = (await import('pdfmake')).default;
	const fonts = {
		Roboto: {
			normal: 'node_modules/pdfmake/build/vfs_fonts.js',
			bold: 'node_modules/pdfmake/build/vfs_fonts.js',
			italics: 'node_modules/pdfmake/build/vfs_fonts.js',
			bolditalics: 'node_modules/pdfmake/build/vfs_fonts.js',
		},
	};

	// @ts-expect-error pdfmake types don't expose constructor correctly
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
						'Content-Disposition':
							'attachment; filename="agile-consulting-scorecard-for-hiring-help.pdf"',
					},
				}),
			);
		});
		pdfDoc.end();
	});
};
