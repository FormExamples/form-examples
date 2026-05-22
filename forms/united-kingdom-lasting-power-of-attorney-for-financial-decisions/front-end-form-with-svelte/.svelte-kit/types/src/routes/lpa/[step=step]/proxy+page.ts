// @ts-nocheck
import type { PageLoad } from './$types.js';

// Disable prerender for the wizard itself; it relies on client-side state.
export const prerender = false;

export const load = ({ params }: Parameters<PageLoad>[0]) => {
  return { step: Number(params.step) };
};
