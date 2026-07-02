# Mental Health Act Assessment — SvelteKit front-end (form + dashboard)

Consolidated SvelteKit front-end for the Mental Health Act 1983 (as amended
2007) assessment. A single continuous single-page wizard captures the
AMHP-coordinated assessment, the medical recommendations, and the statutory
criteria; the shared pure engine classifies the recommended section, validates
whether the required documentation is complete, and classifies the urgency; and
a SVAR DataGrid dashboard lists assessed people with their engine-computed
status.

This is a **documentation and legal-completeness** instrument. The engine emits
a completeness status (`valid` / `incomplete`), a recommended-section class,
and an urgency class, plus the required-signatory and criteria checklists and a
set of flagged issues. There is **no numeric score**, and it makes **no
automated decision to detain** — the prescribed statutory forms remain the
definitive legal record, and decisions rest with the professionals.

## Surfaces

- **Welcome** (`/`) — purpose, specification, documentation, and links.
- **Wizard** (`/mental-health-act-assessments/[id]`) — the nine-step
  assessment; classifies and validates on submit.
- **Report** (`/mental-health-act-assessments/[id]/report`) — section
  classification banner, completeness / urgency badges, interpretation, the
  required-signatory and criteria tables, and flagged issues; PDF via
  `report/pdf`.
- **Dashboard** (`/mental-health-act-assessments`) — SVAR DataGrid of assessed
  people (client-only, `ssr = false`), filterable by recommended-section class
  and completeness status.

## Classification / validation algorithm

```
recommendedSectionClass = sectionToClass(recommendedSection)
requiredSignatories     = SIGNATORIES[class] evaluated present / absent
criteriaSummary         = CRITERIA[class]   evaluated met / not-met + evidence
completenessStatus:
  class != 'none' : 'valid' when EVERY required signatory is present AND
                     EVERY required criterion is 'met' with evidence; else 'incomplete'
  class == 'none' : 'valid' when the outcome is resolved (informal / community / no-action)
urgencyClass:
  'emergency' when class in {s4, s5-2, s5-4, s136} OR riskImminence == 'imminent'
  'urgent'    when class in {s2, s3}
  'routine'   otherwise
```

The engine does **not** decide whether to detain — it validates the
documentation supporting the chosen section and classifies the section and its
urgency.

## Verify

```sh
pnpm install
pnpm run check       # svelte-check: 0 errors, 0 warnings
pnpm run build       # production build
pnpm exec vitest run # engine unit tests
```
