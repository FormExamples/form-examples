# Return to Work — SvelteKit clinician wizard

SvelteKit 2 + Svelte 5 + TypeScript + Tailwind 4 single-page clinician
wizard that collects the 12-step Return to Work assessment, computes a
fitness statement (`fit` / `may-be-fit` / `not-fit`) and a
restriction-priority grade (`routine` / `standard` / `restricted` /
`high-risk`), raises safety flags, and generates a signed PDF
*Statement of Fitness for Work*.

Although the directory is named `front-end-form-with-svelte` (monorepo
convention), the data-entry operator is a **clinician**, not the
employee.

## Stack

- SvelteKit 2.x
- Svelte 5 runes (`$state`, `$derived`, `$bindable`, `$props`,
  `$effect`)
- TypeScript strict
- Tailwind CSS 4 (`@import 'tailwindcss'`, `@theme`)
- `pdfmake` for server-side PDF generation
- Vitest for engine unit tests
- ESLint + Prettier

## Directory structure

```
src/
├── app.css                              # Tailwind entry + custom theme
├── app.html                             # HTML shell
├── app.d.ts                             # App type declarations
├── params/
│   └── step.ts                          # Route matcher 1-12
├── lib/
│   ├── engine/
│   │   ├── types.ts
│   │   ├── utils.ts
│   │   ├── fitness-rules.ts
│   │   ├── restriction-rules.ts
│   │   ├── composite-grader.ts
│   │   ├── flagged-issues.ts
│   │   ├── composite-grader.test.ts
│   │   └── restriction-rules.test.ts
│   ├── config/
│   │   ├── steps.ts
│   │   └── restriction-catalogue.ts
│   ├── stores/assessment.svelte.ts
│   ├── components/
│   │   ├── ui/
│   │   └── steps/Step01..Step12
│   └── report/pdf-builder.ts
└── routes/
    ├── +layout.svelte
    ├── +page.svelte
    ├── assessment/[step=step]/+page.svelte
    └── report/
        ├── +page.svelte
        └── pdf/+server.ts
```

## Step-to-route map

| # | Route | Component |
| --- | --- | --- |
| 1 | `/assessment/1` | `Step01ClinicianIdentification.svelte` |
| 2 | `/assessment/2` | `Step02PatientIdentification.svelte` |
| 3 | `/assessment/3` | `Step03JobContext.svelte` |
| 4 | `/assessment/4` | `Step04AbsenceHistory.svelte` |
| 5 | `/assessment/5` | `Step05ReasonForAbsence.svelte` |
| 6 | `/assessment/6` | `Step06CurrentTreatment.svelte` |
| 7 | `/assessment/7` | `Step07FunctionalAssessment.svelte` |
| 8 | `/assessment/8` | `Step08FitnessStatement.svelte` |
| 9 | `/assessment/9` | `Step09PhasedReturn.svelte` |
| 10 | `/assessment/10` | `Step10AdjustmentsRestrictions.svelte` |
| 11 | `/assessment/11` | `Step11FollowUp.svelte` |
| 12 | `/assessment/12` | `Step12SignOff.svelte` |

## Running

```sh
pnpm install
pnpm run dev
```

Open `http://localhost:5173` and step through the wizard.

## Testing

```sh
pnpm exec vitest run
```
