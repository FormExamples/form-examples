# Hospital Daily Monitoring Checklist — SvelteKit Form

Single-page SvelteKit wizard for the hospital daily monitoring checklist.
24 steps: inspection details (1), one step per hospital area (2-23, 22
areas), and summary &amp; sign-off (24). Each of the 97 checkpoints is
answered **satisfactory / needs-attention / not-applicable**, with an
optional free-text remark.

There is no clinical grading engine here — this is an operational
compliance checklist, not a diagnostic instrument. The shared engine only
tallies checkpoints answered and lists needs-attention checkpoints by area.

## Stack

- SvelteKit 2 + TypeScript
- Svelte 5 runes (`$state`, `$derived`, `$props`)
- Tailwind CSS 4 (`@import 'tailwindcss'` + `@theme`)
- `pdfmake` for PDF report generation
- SVAR DataGrid for the review dashboard
- Vitest for engine unit tests

## Directory layout

```
src/
  app.css                                   # Tailwind theme overrides + Lily tokens
  app.html
  routes/
    +server.ts                              # root redirect to /hospital-daily-monitoring-checklist/
    hospital-daily-monitoring-checklist/
      +layout.svelte                        # nav, theme/locale/text-size/share pickers
      +page.svelte                          # welcome page
      hospital-daily-monitoring-checklists/
        +page.svelte                        # dashboard (SVAR DataGrid)
        +page.ts                             # ssr = false
        [id]/
          +page.svelte                      # the 24-step wizard
          report/
            +page.svelte                    # printable report
            pdf/+server.ts                   # pdfmake PDF export
  lib/
    config/
      items.ts                              # the 97 checkpoints (id, section, sectionTitle, subsection?, text)
      steps.ts                              # 24 step definitions
    stores/
      assessment.svelte.ts                  # global $state store
    engine/
      types.ts
      factory.ts                            # createEmptyAssessment()
      summary.ts                            # summariseChecklist() — pure tally, not a grading engine
      summary.test.ts
      utils.ts                              # status label/colour helpers
    components/
      ui/                                   # Lily Design System Svelte headless contract
      steps/
        Step01InspectionDetails.svelte
        Step02Opd.svelte … Step23RecordRoom.svelte  (one per hospital area)
        Step24Summary.svelte
```

## Engine

`summariseChecklist(data)` returns:

```ts
{
  answeredCount: number;              // 0..97
  needsAttentionCount: number;
  needsAttentionItems: { id: string; sectionTitle: string; text: string; remarks: string }[];
  sectionsWithNeedsAttention: number[]; // section numbers 1..22
}
```

Pure function, no side effects. `not-applicable` and unanswered checkpoints
never count as needs-attention.

## Run

```sh
pnpm install
pnpm dev
pnpm test
pnpm check
```
