# Tasks: SvelteKit LP1H wizard

- [x] `package.json` with SvelteKit 2, Svelte 5, Tailwind 4, pdfmake, Vitest.
- [x] `svelte.config.js` + `vite.config.ts` + `tsconfig.json`.
- [x] `src/app.html`, `src/app.css`, `src/app.d.ts`.
- [x] `src/params/step.ts` — route matcher 1-14.
- [x] `src/lib/engine/types.ts` — `LpaApplication`, `LpaValidityResult`,
      `FiredRule`, `AdditionalFlag`, `RuleSeverity`.
- [x] `src/lib/engine/utils.ts` — date math, age computation,
      sign-order comparison.
- [x] `src/lib/engine/donor-rules.ts` — `R-MCA-S9-AGE`,
      `R-MCA-S10-CAP`, donor-signature-date.
- [x] `src/lib/engine/attorney-rules.ts` — `R-MCA-ATT-AGE`,
      `R-MCA-ATT-CAP`, decision-rule consistency.
- [x] `src/lib/engine/certificate-provider-rules.ts` — `R-MCA-CP-FAM`,
      `R-MCA-CP-EMP`, `R-MCA-CP-ROUTE`, two-year rule.
- [x] `src/lib/engine/signature-order-rules.ts` — `R-MCA-ORDER`,
      `R-MCA-WIT-NOT-ATT`.
- [x] `src/lib/engine/instruction-rules.ts` — `R-MCA-INSTR-LAW`,
      `R-MCA-INSTR-ADRT`, `R-MCA-COP-PROHIBITED`.
- [x] `src/lib/engine/registration-rules.ts` — `R-MCA-NOTIFY-MAX`,
      `R-MCA-REG-APPLICANT`, `R-MCA-FEE`.
- [x] `src/lib/engine/composite-validator.ts` — entry point + cascade.
- [x] `src/lib/engine/flagged-issues.ts` — non-statutory warnings.
- [x] `src/lib/engine/factory.ts` — `emptyLpaApplication()` and friends.
- [x] `src/lib/engine/composite-validator.test.ts` — Vitest (20 tests, all pass).
- [x] `src/lib/stores/lpa.svelte.ts` — reactive store.
- [x] `src/lib/config/steps.ts` — 14-step definitions.
- [x] `src/lib/components/ui/*.svelte` — FormField, SelectField, TextAreaField, NumberField, YesNoField, ProgressBar.
- [x] `src/lib/components/steps/Step*.svelte` — all 14 steps wired into the dynamic route.
- [x] `src/lib/report/pdf-builder.ts` — pdfmake LP1H document definition.
- [x] `src/routes/+layout.svelte`, `+page.svelte`.
- [x] `src/routes/lpa/[step=step]/+page.svelte`.
- [x] `src/routes/report/+page.svelte`, `/pdf/+server.ts` — LP1H preview + JSON pdfmake doc.
- [ ] Zod runtime validation (deferred).
- [ ] Axe-core audit (deferred).
- [ ] Playwright end-to-end (deferred).
