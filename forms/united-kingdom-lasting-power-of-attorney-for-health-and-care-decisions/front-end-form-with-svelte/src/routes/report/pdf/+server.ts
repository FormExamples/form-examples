import type { RequestHandler } from '@sveltejs/kit';
import { lpaStore } from '$lib/stores/lpa.svelte.js';
import { buildPdfDoc } from '$lib/report/pdf-builder.js';

// In a production deployment this would pipe through pdfmake's server bundle
// to emit application/pdf. For the scaffold we return the pdfmake document
// definition as JSON; the client renders it with pdfmake in the browser.
export const GET: RequestHandler = async () => {
  const doc = buildPdfDoc(lpaStore.application, lpaStore.validity);
  return new Response(JSON.stringify(doc, null, 2), {
    headers: { 'content-type': 'application/json; charset=utf-8' },
  });
};
