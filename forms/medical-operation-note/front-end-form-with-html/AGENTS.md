# HTML operation-note wizard — Agent Instructions

Single-page static HTML + vanilla JavaScript implementation of the
12-step operating-team op-note wizard. No build step, no framework, no
runtime dependency apart from `pdfmake` loaded from a CDN for PDF
export.

## Stack

- HTML5 + CSS3 + vanilla JavaScript (ES2020).
- No build step, no node_modules, no bundler.
- Classic `<script>` tags only (no ES modules) so the form runs from
  `file://` for theatre workstations.
- Each script is wrapped in an IIFE and publishes public symbols on
  `window.MedicalOperationNote`.

## Files

- `index.html` — page shell, sticky progress bar, aria-live report region.
- `css/style.css` — mobile-first stylesheet (no framework dependencies).
- `js/types.js` — empty op-note factory, ASA / Clavien-Dindo ordering,
  EBL band helpers, common enums.
- `js/utils.js` — small pure helpers (escape, format, max-grade).
- `js/clavien-dindo-rules.js` — Clavien-Dindo classification rules.
- `js/blood-loss-rules.js` — EBL band classification (minimal / mild /
  moderate / severe / massive).
- `js/count-rules.js` — swab / needle / instrument count rules.
- `js/never-event-rules.js` — wrong-site / wrong-side / wrong-implant /
  retained-item rules.
- `js/anaesthetic-event-rules.js` — failed intubation, anaphylaxis,
  malignant hyperthermia, awareness, sux apnoea.
- `js/composite-grader.js` — max-grade engine; entry point
  `calculateOperationGrade(data)`.
- `js/flagged-issues.js` — additional safety-flag detection.
- `js/wizard.js` — step renderers, navigation, validation, localStorage
  persistence.
- `js/report.js` — HTML report preview and pdfmake PDF generation.

## Persistence

Form state autosaves to localStorage under the key
`medical-operation-note.front-end-form-with-html.v1`. State is merged
over a fresh empty op note on load so newly-added fields default
correctly.

## Engine output shape

Mirrors the SvelteKit engine 1:1:

```ts
calculateOperationGrade(data: OperationNote): {
  compositeRisk: 'routine' | 'complicated' | 'high-risk' | 'critical';
  clavienDindoGrade: '0' | 'I' | 'II' | 'IIIa' | 'IIIb' | 'IVa' | 'IVb' | 'V';
  asaPhysicalStatus: 1 | 2 | 3 | 4 | 5 | 6 | null;
  bloodLossBand: 'minimal' | 'mild' | 'moderate' | 'severe' | 'massive';
  countsAgreed: boolean;
  firedRules: FiredRule[];
  additionalFlags: AdditionalFlag[];
}
```

Algorithm: **max-grade** — the worst finding sets the composite grade;
Routine is the default when no rules fire.

## Lily Design System HTML headless

This form conforms to the Lily Design System HTML headless class
contract. See [`../../AGENTS-front-end-html.md`](../../AGENTS-front-end-html.md)
for the shared vocabulary (`.field`, `.fieldset`, `.text-input`,
`.step-list`, `.error-summary`, `.button[data-variant]`, etc.), the
page-shell template, validation pattern, and accessibility commitments.
