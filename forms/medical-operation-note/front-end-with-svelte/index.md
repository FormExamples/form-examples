# Medical Operation Note — SvelteKit data-entry wizard

SvelteKit 2 + Svelte 5 + TypeScript + Tailwind 4 single-page operating-team
wizard that records the contemporaneous surgical operation note across 12
steps, computes a composite operative-risk grade
(Routine / Complicated / High-risk / Critical) with Clavien–Dindo, ASA,
and blood-loss bands, raises a set of WHO Sign-Out safety flags, and
generates a signed PDF op note.

The data-entry operator is the **operating team** (lead surgeon,
assistant, anaesthetist, scrub nurse), not the patient.

## Stack

- SvelteKit 2.x
- Svelte 5 runes (`$state`, `$derived`, `$bindable`, `$props`, `$effect`)
- TypeScript strict
- Tailwind CSS 4 (`@import 'tailwindcss'`, `@theme`)
- `pdfmake` for client-side PDF generation
- Vitest for engine unit tests
- ESLint + Prettier

## Directory structure

```
src/
├── app.css                                  # Tailwind entry + Lily-class theme
├── app.html                                 # HTML shell
├── app.d.ts                                 # App type declarations
├── params/
│   └── step.ts                              # Route matcher 1–12
├── lib/
│   ├── engine/
│   │   ├── types.ts                         # OperationNote + GradingResult
│   │   ├── utils.ts                         # bands and helpers
│   │   ├── factory.ts                       # createEmptyOperationNote()
│   │   ├── composite-grader.ts              # calculateOperationGrade()
│   │   ├── clavien-dindo-rules.ts
│   │   ├── blood-loss-rules.ts
│   │   ├── count-rules.ts
│   │   ├── never-event-rules.ts
│   │   ├── anaesthetic-event-rules.ts
│   │   ├── flagged-issues.ts
│   │   ├── composite-grader.test.ts
│   │   └── clavien-dindo-rules.test.ts
│   ├── config/steps.ts                      # 12-step definitions
│   ├── state.svelte.ts                      # runes-based store
│   ├── report.ts                            # pdfmake doc + HTML preview
│   ├── components/ui/                       # Lily-shaped UI primitives
│   └── steps/                               # Step1Identification.svelte …
│                                            #   Step12SignOff.svelte
└── routes/
    ├── +layout.svelte
    ├── +page.svelte                         # single-page wizard
    └── operation-note/[step=step]/+page.svelte  # one step at a time
```

## Running

```sh
pnpm install
pnpm dev
```

Open `http://localhost:5173` for the single-page wizard, or visit
`http://localhost:5173/operation-note/1` for the dynamic step route.

## Testing

```sh
pnpm test
```

Vitest covers the composite grader and the Clavien–Dindo rules.
