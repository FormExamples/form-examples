import type { PageLoad } from './$types.js';

// Disable prerender for the wizard itself; it relies on client-side state.
export const prerender = false;

export const load: PageLoad = ({ params }) => {
  return { step: Number(params.step) };
};
