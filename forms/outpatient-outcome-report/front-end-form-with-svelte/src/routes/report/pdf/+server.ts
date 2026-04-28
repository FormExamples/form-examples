import type { RequestHandler } from './$types';

/**
 * PDF export endpoint.
 *
 * PDF generation is not yet implemented (no PDF library is available in
 * package.json). Returns 501 Not Implemented.
 *
 * To implement: add a PDF library (e.g. pdfmake) to package.json and build
 * a pdf-builder using the GradingResult and AssessmentData passed in the
 * request body.
 */
export const POST: RequestHandler = async () => {
	return new Response(
		JSON.stringify({ error: 'PDF export is not yet implemented in this version.' }),
		{
			status: 501,
			headers: { 'Content-Type': 'application/json' }
		}
	);
};
