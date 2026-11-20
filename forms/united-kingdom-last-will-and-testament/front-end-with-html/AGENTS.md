# United Kingdom Last Will and Testament — HTML front-end (form + dashboard)

Agent instructions for this directory. See the form root [`../index.md`](../index.md) and [`../AGENTS.md`](../AGENTS.md). Lily Design System headless conventions: [`../../AGENTS-front-end-html.md`](../../AGENTS-front-end-html.md).

The grader (`js/grader.js`) returns `{ validityClass, formalityRisk, sharesTotalPercent, witnessCount }` and no flags; `js/form-app.js` composes `detectFlaggedIssues(state)` from `js/flags.js`. Keep `../examples/personas.json` in step (`bin/test-personas united-kingdom-last-will-and-testament --update`). Everything shown to the user must keep the not-legal-advice disclaimer.
