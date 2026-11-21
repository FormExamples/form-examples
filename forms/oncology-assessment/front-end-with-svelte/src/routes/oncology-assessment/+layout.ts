// In the formexamples.github.io build (VITE_FORM_EXAMPLES_SITE=1) every page
// the crawler reaches is prerendered, with a trailing slash like the rest of
// the site; a record page (`[id]`) is not, and falls back to the app's
// 200.html. Elsewhere nothing is prerendered and URLs are unchanged.
const site = import.meta.env.VITE_FORM_EXAMPLES_SITE === '1';

export const prerender = site ? 'auto' : false;
export const trailingSlash = site ? 'always' : 'never';
