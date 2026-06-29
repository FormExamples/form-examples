# Employee Satisfaction Survey — consolidated front-end (SvelteKit)

SvelteKit 2 + Svelte 5 runes + Tailwind CSS 4. Vitest for unit tests.

A single SvelteKit app combining the anonymous employee survey wizard and the
HR dashboard. The survey wizard collects ten short sections of 1–5 Likert
items; the shared pure scoring engine normalises each domain to 0–100,
averages them into a composite score, classifies the result, derives an eNPS
classification, and flags issues for HR review. See `index.md` and the parent
`../index.md` for the full specification.
