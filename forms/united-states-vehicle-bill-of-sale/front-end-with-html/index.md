# United States Vehicle Bill of Sale — HTML front-end (form + dashboard)

Consolidated single-directory HTML front-end: `index.html` is the single-page
United States vehicle bill-of-sale wizard; `dashboard.html` is the review
dashboard. Shared `css/` and `js/` (the classification engine in
`js/{types,rules,grader,flags}.js`, the apps in `js/form-app.js` +
`js/dashboard-app.js`).

The form is a **documentation-support instrument**, not a scored assessment and
**not legal advice**. The engine records the sale, the seller and buyer, the
vehicle and VIN, the federal odometer disclosure (49 CFR Part 580), the as-is
clause, title and lien status, notarization, and the post-sale filings; it then
classifies the sale as **complete**, **incomplete**, or **risk flagged** and
raises prioritized flags. The classification is by precedence: any risk
condition (odometer discrepancy, invalid VIN, outstanding lien, no title in
hand, branded title) comes first; otherwise any missing required item makes it
incomplete; otherwise it is complete. State rules live in the `STATE_RULES`
table in `js/rules.js`; an unknown state uses the uniform default and raises a
verify-state-rule flag. The state motor vehicle agency decides.
