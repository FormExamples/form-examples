import type { RequestHandler } from '@sveltejs/kit';
import { store } from '$lib/stores/documentation.svelte.js';
import { buildAsciiDocBundle } from '$lib/report/asciidoc-builder.js';

/**
 * Server endpoint returning a single AsciiDoc file that includes all 12
 * arc42 sections inline (the index file content with section content appended).
 *
 * Note: server endpoints cannot access the client-side Svelte 5 store state;
 * this mirrors the pre-op scaffold pattern.
 */
export const GET: RequestHandler = async () => {
  const files = buildAsciiDocBundle(store.data);
  // Return all files concatenated with a separator so the user can split them,
  // or just return the index as the root document.
  const combined = files.map((f) => `// --- ${f.filename} ---\n${f.content}`).join('\n---\n');
  return new Response(combined, {
    headers: {
      'content-type': 'text/plain; charset=utf-8',
      'content-disposition': 'attachment; filename="arc42.adoc"',
    },
  });
};
