# Plan: UK LPA HTML wizard

- [x] Single-page HTML with 15 step sections (LP1F sections 1–15).
- [x] Alpine.js 3.14.8 from CDN, no build step.
- [x] Tailwind via Play CDN plus `css/styles.css` overrides.
- [x] Pure-JS validator (`js/validator.js`) with every blocker rule and
      flag rule from `../doc/lpa-validation-rules.md`, exporting
      `window.validateLpa(lpa)`.
- [x] Sticky validation summary panel showing validity band, composite
      risk, fired statutory blockers, and additional flags — each with
      statutory citation and remediation hint.
- [x] localStorage autosave under
      `uk-lpa-financial.front-end-form-with-html.v1`.
- [x] Clean-deed sample fixture (`js/sample-data.js`).
- [x] Load-sample and reset controls.
- [ ] PDF export of the LP1F replica (out of scope for the HTML build;
      handled by the SvelteKit and full-stack implementations).
- [ ] Welsh-language second locale (future).
- [ ] Service worker for offline use (future).
