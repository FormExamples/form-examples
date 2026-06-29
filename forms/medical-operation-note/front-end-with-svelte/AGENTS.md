# Medical Operation Note — SvelteKit Front-end Agent Instructions

Single-page operating-team data-entry wizard. 12 steps. Computes the
composite operative-risk grade (Routine / Complicated / High-risk /
Critical), the Clavien–Dindo classification, the blood-loss band, the
counts-agreed state, and the safety-flag set (incorrect count, retained
foreign body, never-event, unplanned ICU, massive haemorrhage, massive
transfusion, conversion to open, intra-op arrest, anaesthetic incident,
implant registry pending, specimen labelling, equipment problem,
documentation gap). Produces a PDF report.

## Stack

- SvelteKit 2, Svelte 5 runes, TypeScript strict, Tailwind CSS 4,
  pdfmake, Vitest.

## Conventions

- camelCase TypeScript property names.
- Empty string `''` for unanswered text / enum fields; `null` for
  unanswered numeric / date / time fields.
- Step components named `Step{N}{Name}.svelte` (1-indexed, no spaces,
  ampersands, or parentheses in filename).
- UI components in `src/lib/components/ui/`.
- Engine files in `src/lib/engine/` with a single
  `calculateOperationGrade()` pure function as the entry point.
- Reactive store in `src/lib/state.svelte.ts` using `$state` runes.
- Route matcher at `src/params/step.ts` rejects anything outside 1–12.

## Engine contract

```ts
export function calculateOperationGrade(data: OperationNote): GradingResult;
```

No side effects. No network calls. No `Date.now()` inside rules. Tests
pin all expected outputs per rule.

## Operating-team-only rules

These have no patient-self-report analogue and live on the
`safetyCountsEbl` / `anaesthesia` / `postOperativePlan` / `signOff`
sub-trees:

- **Incorrect count flag** — swab/needle/instrument count
  discrepancy unresolved at sign-out → high priority,
  composite risk ≥ High-risk.
- **Retained foreign body flag** — any declared retained item →
  high priority, never-event candidate, composite risk = Critical.
- **Never-event flag** — wrong-site / wrong-side / wrong-patient /
  wrong-procedure / wrong-implant → high, statutory NHS England
  notification.
- **Massive haemorrhage flag** — EBL > 1500 mL → high, composite risk
  ≥ High-risk; EBL > 3000 mL → Critical.
- **Massive transfusion flag** — ≥ 4 units PRBC intra-operative or
  massive haemorrhage protocol activated → high.
- **Conversion to open flag** — planned minimally-invasive case
  converted to open → medium.
- **Intra-operative arrest flag** — cardiac or respiratory arrest in
  theatre → high, composite risk = Critical.
- **Anaesthetic incident flag** — failed intubation, awareness,
  anaphylaxis, malignant hyperthermia, suxamethonium apnoea → high.

## Surgeon override

The lead surgeon may override the computed composite risk on Step 12
with a documented reason. Both the computed grade and the final grade
are stored and rendered in the PDF report and FHIR Bundle.

## PDF report

`src/lib/report.ts` exports `buildPdfDoc(data, result)` and
`buildHtmlPreview(data, result)`. Includes operation identification,
patient identification, surgical team, diagnoses, anaesthesia, position
and approach, findings, materials and implants, drains and specimens,
counts and EBL, composite risk, fired rules, safety flags, post-op
plan, and electronic signature line.

## Testing

Vitest in:
- `src/lib/engine/composite-grader.test.ts`
- `src/lib/engine/clavien-dindo-rules.test.ts`

Coverage of:
- Default Routine when no rules fire.
- Each blood-loss band maps to its risk band.
- Count discrepancy forces High-risk.
- Retained foreign body forces Critical.
- Never-event tokens force Critical.
- Intra-op arrest forces Critical.
- Massive transfusion (≥ 4 PRBC or MHP) forces High-risk.
- Conversion to open forces ≥ Complicated.
- Major anaesthetic events force ≥ High-risk; minor → ≥ Complicated.
- ASA IV → High-risk; ASA V → Critical.
- Max-grade algorithm (worst domain wins).
- Surgeon override sets `finalRisk` but preserves computed.
- Implant registry pending raises medium flag.
- Documentation gap raises low flag.

Run with `pnpm test`.

## Accessibility

WCAG 2.2 AA target. All inputs have an associated `<label>` (via Lily
`Field` + `label` for visible labels, or `aria-label` for compact
inputs). Progress bar announced via `aria-live`. Keyboard-only
navigation of the wizard is supported. The dynamic step route
(`/operation-note/[step]`) supports back/forward browser navigation.
