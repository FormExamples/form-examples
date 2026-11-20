# US Standard Certificate of Death — HTML front-end (form + dashboard)

Agent instructions for this directory. See the form root [`../index.md`](../index.md) and [`../AGENTS.md`](../AGENTS.md). Lily Design System headless conventions: [`../../AGENTS-front-end-html.md`](../../AGENTS-front-end-html.md).

- `js/rules.js` — predicates, mechanism and abbreviation lists, `STATE_RULES`.
- `js/grader.js` — `validateCertificate(d)`: class, underlying cause, referral indicator.
- `js/flags.js` — `detectFlaggedIssues(d)`: prioritized flags, called by `form-app.js` as `detectFlaggedIssues(state)`.
- Edit `STATE_RULES` only with a primary source; keep the `verified` markers honest and mirror any change in the Svelte engine port.
