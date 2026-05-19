# Plan — MEDIF front-end form (SvelteKit)

## Phase 1 — Scaffold (done)

- SvelteKit 2.x project initialised with Tailwind 4, Vitest, TypeScript.
- Reactive store with `$state` and `$derived` runes.
- 14 step components mirroring the spec.

## Phase 2 — Engine

- `MedifAssessment` shape mirroring SQL migration 04.
- Five rule modules: equipment, recent-event, cardiorespiratory, pregnancy,
  communicable.
- Composite grader implementing max-band semantics.
- Safety-flag emitter independent of the fitness band.
- Vitest coverage of the grader's main pathways.

## Phase 3 — UI polish

- Wire ProgressBar to track current step (currently best-effort).
- Add per-step "Next" buttons that update `store.currentStep`.
- Add a printable report view at `/report`.

## Phase 4 — Backend integration

- POST the assessment payload to `/api/medifs`.
- Generate FHIR R5 Bundle from the assessment.
- PDF download via `pdfmake`.
