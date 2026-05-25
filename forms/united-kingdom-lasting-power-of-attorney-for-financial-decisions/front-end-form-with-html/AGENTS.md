# UK LPA HTML form — Agent Instructions

Static HTML + Alpine.js 3.14.8 implementation of the 15-step LP1F wizard.
No build step, no node_modules, no server.

## Stack

- HTML5 + Tailwind via the Play CDN (`https://cdn.tailwindcss.com`).
- Alpine.js 3.14.8 from jsDelivr.
- Vanilla JavaScript validator, identical-by-rule to the SvelteKit engine.

## Files

- `index.html` — page shell + 15 `<section>` blocks (Step N — Title).
- `css/styles.css` — component overrides (badges, person cards, panel).
- `js/validator.js` — `window.validateLpa(lpa)` with every blocker and
  flag rule from `../doc/lpa-validation-rules.md`.
- `js/sample-data.js` — `window.LpaSampleData` clean-deed fixture.
- `js/app.js` — `lpaWizard()` Alpine factory: state, validation,
  localStorage autosave, add / remove handlers.

## Conventions

- camelCase property names everywhere in JS.
- `''` for empty enum / text fields, `null` for unanswered dates.
- One continuous single-page wizard — donor scrolls. No multi-page navigation.
- No emojis anywhere.

## Validation contract

`window.validateLpa(lpa)` returns:

```js
{
  validityBand: 'draft' | 'ready_for_signing' | 'partially_signed'
              | 'fully_signed' | 'ready_for_registration' | 'submitted'
              | 'registered' | 'rejected',
  compositeRisk: 'low' | 'moderate' | 'high' | 'critical',
  firedRules: FiredRule[],        // statutory blockers (critical)
  additionalFlags: FiredRule[]    // low | moderate | high
}
```

Each `FiredRule` has `ruleId`, `priority`, `citation`, `fieldPath`,
`message`, and `remediation`. Citations point at MCA 2005 sections, the
LPA Regulations 2007, or LP1F / LP12 form references.

## Persistence

`localStorage` key: `uk-lpa-financial.front-end-form-with-html.v1`.
Autosave fires on any state change via Alpine's `$watch('state', ...)`.

## Accessibility

- Semantic landmark structure (`<header>`, `<main>`, `<footer>`,
  `<section aria-labelledby=...>`).
- Skip link to step 1.
- Labels paired with every input.
- Sticky validation summary uses live updates (no `aria-live` because the
  panel is always visible).

## Lily Design System HTML headless

This form conforms to the Lily Design System HTML headless class contract.
See [`../../AGENTS-front-end-html.md`](../../AGENTS-front-end-html.md) for
the shared vocabulary (`.field`, `.fieldset`, `.text-input`, `.step-list`,
`.error-summary`, `.button[data-variant]`, etc.), the page-shell template,
validation pattern, and accessibility commitments.
