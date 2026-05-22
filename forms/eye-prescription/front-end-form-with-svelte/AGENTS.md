# Eye Prescription — SvelteKit Front-End Form

Single-page 11-step wizard implemented in SvelteKit 2 + Svelte 5 +
TypeScript + Tailwind CSS 4. The data-entry UI is operated by a GOC-
registered optometrist or dispensing optician.

See the form-wide [`../AGENTS.md`](../AGENTS.md) for the design,
[`../doc/refractive-classification-rules.md`](../doc/refractive-classification-rules.md)
for the rules engine, and
[`../doc/sign-convention-notes.md`](../doc/sign-convention-notes.md) for the
minus-cylinder / plus-cylinder convention.

> **Status:** scaffolded; full implementation is deferred. The structure
> below is the target.

## Target structure

```
src/
  routes/
    +layout.svelte
    +page.svelte                              # redirect to /prescription/1
    prescription/
      [step=step]/+page.svelte                # one route, eleven render branches
  lib/
    types.ts                                  # EyePrescription + child types
    utils.ts                                  # quantise, validate, format
    refractive-rules.ts                       # band tables (sphere, cyl, add)
    complexity-grader.ts                      # composite complexity engine
    flagged-issues.ts                         # safety-flag engine
    components/
      ui/                                     # Button, Input, Select, Fieldset
      Step1Prescriber.svelte
      Step2Patient.svelte
      Step3Examination.svelte
      Step4VisualAcuity.svelte
      Step5RightEye.svelte
      Step6LeftEye.svelte
      Step7Addition.svelte
      Step8PupillaryDistance.svelte
      Step9LensRecommendation.svelte
      Step10OcularHealth.svelte
      Step11Summary.svelte
    pdf.ts                                    # pdfmake report
params/
  step.ts                                     # validates 1..11
app.css                                       # Tailwind 4 @import + @theme
```

## Conventions

- Svelte 5 runes: `$state`, `$derived`, `$bindable`, `$props`.
- Form state held in a single `$state` rune at the layout level so all
  step components share the same `EyePrescription` object.
- Each step component receives `data` (the prescription) and a callback
  for change events. No global store.
- Per-step validation in the step component; cross-step validation in
  `complexity-grader.ts`.
- Sign-convention check: cylinder must be ≤ 0; reject positive cylinder
  with a clear error message and a "convert from plus-cylinder" button.
- Sphere / cylinder / addition / prism inputs snap to 0.25 D steps on
  blur.
- Axis input rejects 0; suggests 180 instead.
- The summary step (11) shows computed classification, complexity, and
  flags in real time using `$derived` against `data`.

## Testing

- Vitest for `refractive-rules.ts`, `complexity-grader.ts`,
  `flagged-issues.ts`.
- Vitest component tests for each step (form validation, snap behaviour).
- Playwright end-to-end test for the happy-path 11-step flow (deferred).

## PDF output

- `pdfmake` for client-side preview.
- Layout matches the UK NHS / GOC paper prescription as closely as
  practical so the printed output is familiar to dispensing opticians.

## Verify

```sh
pnpm install
pnpm run check
pnpm run test
```
