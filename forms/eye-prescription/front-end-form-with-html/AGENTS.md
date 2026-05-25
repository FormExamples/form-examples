# Eye Prescription — HTML Front-End Form

Single-page 11-step wizard implemented as a static HTML page with
Alpine.js for interactivity and Tailwind CSS via CDN. No build step.
Useful for environments that cannot run a Node toolchain.

See the form-wide [`../AGENTS.md`](../AGENTS.md) for the design and
[`../doc/refractive-classification-rules.md`](../doc/refractive-classification-rules.md)
for the rules engine.

> **Status:** scaffolded; full implementation is deferred.

## Target structure

```
index.html              # single page with all 11 step fieldsets
assets/
  script.js             # Alpine.js component with state + classification
  rules.js              # refractive-rules + complexity-grader + flagged-issues
  pdf.js                # pdfmake wrapper for client-side PDF
```

## Key choices

- **No build step.** Tailwind via the play CDN
  (`https://cdn.tailwindcss.com`), Alpine.js via
  `https://cdn.jsdelivr.net/npm/alpinejs@3.14.8/dist/cdn.min.js`,
  `pdfmake` via CDN.
- **All 11 steps on one scroll surface** in a single Alpine.js component.
- **`x-data`** holds the entire `EyePrescription` object.
- **`x-effect`** recomputes classification, complexity, and flags on every
  change.
- **Sign-convention** discipline as per the SvelteKit form: cylinder ≤ 0.
- **0.25 D snap** implemented in `step` attribute on `<input type="number">`
  with `min` / `max` matching the schema.
- **Axis** validation on `blur` (reject 0).

## Verify

Open `index.html` in a browser and complete a prescription end-to-end.
Watch the browser console for validation errors.

## Lily Design System HTML headless

This form conforms to the Lily Design System HTML headless class contract.
See [`../../AGENTS-front-end-html.md`](../../AGENTS-front-end-html.md) for
the shared vocabulary (`.field`, `.fieldset`, `.text-input`, `.step-list`,
`.error-summary`, `.button[data-variant]`, etc.), the page-shell template,
validation pattern, and accessibility commitments.
