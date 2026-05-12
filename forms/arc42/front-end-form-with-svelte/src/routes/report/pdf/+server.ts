import type { RequestHandler } from '@sveltejs/kit';
import { store } from '$lib/stores/documentation.svelte.js';
import { calculateMaturity } from '$lib/grading/maturity-grader.js';
import { buildPdfDocDefinition } from '$lib/report/pdf-builder.js';

/**
 * Server endpoint that builds a PDF document definition and returns it as
 * JSON. In a production deployment this would be piped through pdfmake's
 * server bundle to emit application/pdf; for the scaffold we return the
 * doc definition which the client renders with pdfmake in the browser.
 *
 * Note: server endpoints cannot access the client-side Svelte 5 store state;
 * this mirrors the pre-op scaffold pattern of returning the doc definition
 * from whatever state the server-side store singleton holds.
 */
export const GET: RequestHandler = async () => {
  const result = calculateMaturity(store.data);
  const doc = buildPdfDocDefinition(store.data, result);
  return new Response(JSON.stringify(doc, null, 2), {
    headers: { 'content-type': 'application/json' },
  });
};
