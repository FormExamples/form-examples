# United Kingdom Vehicle Bill of Sale — HTML front-end

Vanilla JavaScript (ES modules, no build) + Lily Design System front-end: a
single continuous single-page wizard (`index.html`, ten sections) and a
dashboard (`dashboard.html`). Documentation support, not legal advice.

The engine is a **completeness and validity** engine, not a numeric score:
`js/rules.js` (required items, risk conditions, advisory predicates),
`js/grader.js` (`assessBillOfSale` returns `complete` / `incomplete` /
`risk-flagged` with missing-item and risk counts), `js/flags.js`
(`detectFlaggedIssues`, sorted high to low). `js/types.js` holds the empty state
and display labels; `js/form-app.js` is the wizard.

See [`../spec/index.md`](../spec/index.md) for the contract and
[`../examples/personas.json`](../examples/personas.json) for the persona oracle
(`bin/test-personas united-kingdom-vehicle-bill-of-sale`).
