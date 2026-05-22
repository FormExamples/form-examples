# Tasks: static HTML wizard

- [x] `index.html` shell with custom CSS and ordered classic `<script>` tags.
- [x] `css/style.css` — vanilla CSS, no framework dependency.
- [x] `js/types.js` — JSDoc-typed `LpaApplication`.
- [x] `js/utils.js` — date / age helpers, signature lookups.
- [x] `js/factory.js` — `emptyLpaApplication()` and friends.
- [x] `js/donor-rules.js` — `R-MCA-S9-AGE`, `R-MCA-S10-CAP`, completeness.
- [x] `js/attorney-rules.js` — count, age, distinctness, decision-rule.
- [x] `js/certificate-provider-rules.js` — family / employee / route.
- [x] `js/signature-order-rules.js` — donor → CP → attorneys cascade.
- [x] `js/instruction-rules.js` — lawfulness, ADRT, prohibited acts.
- [x] `js/registration-rules.js` — applicant, fee, persons-to-notify.
- [x] `js/flagged-issues.js` — non-statutory warnings.
- [x] `js/composite-validator.js` — entry + severity cascade.
- [x] `js/app.js` — renders all 14 sections, dynamic add/remove, live
      validity sidebar, JSON export.
- [x] Smoke-tested with Node vm sandbox — empty → invalid, full →
      ready-to-register, clearing LST → R-MCA-LST-CHOICE fatal.
- [ ] axe-core accessibility audit (deferred).
- [ ] Manual cross-browser smoke test (deferred).
- [ ] LocalStorage autosave (deferred).
