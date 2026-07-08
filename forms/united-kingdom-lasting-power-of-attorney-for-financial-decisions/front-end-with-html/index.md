# UK Lasting Power of Attorney for Financial Decisions — HTML front-end (form + dashboard)

Consolidated single-directory HTML front-end: `index.html` is the single-page
15-step LP1F wizard; `dashboard.html` is the LPA case dashboard. Shared `css/`
and `js/` (the validation engine in `js/{types,rules,flags,grader}.js` — a
framework-free port of the SvelteKit `src/lib/validator/`, with byte-for-byte
identical rule / flag / band ids, so the HTML, Svelte, and Loco stacks agree).
