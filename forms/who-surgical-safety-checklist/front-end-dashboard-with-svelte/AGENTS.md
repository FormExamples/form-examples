# Front-end dashboard (SvelteKit) — WHO Surgical Safety Checklist

SvelteKit 2.x + Svelte 5 review dashboard for the WHO Surgical Safety
Checklist. Wraps SVAR DataGrid (`@svar-ui/svelte-grid`) with the Willow theme.
Lists case date, patient, site, theatre, surgeon, anaesthetist, urgency,
specialty, status, and computed safety-flag count.

## Stack

- SvelteKit 2.x + TypeScript
- Svelte 5 runes
- Tailwind CSS 4
- SVAR DataGrid (`@svar-ui/svelte-grid` 2.x) with the Willow theme

## Data flow

```
src/lib/data/sample.ts          (12 sample ChecklistRow values)
        |
        v
src/lib/data/api.ts             fetchChecklists(): Promise<ChecklistRow[]>
        |   GET http://localhost:5150/api/dashboard/checklists
        |   on network error or empty payload, returns SAMPLE_CHECKLIST_ROWS
        v
src/routes/+page.svelte         calls fetchChecklists() in onMount()
        |   composes status/urgency/specialty/search filters
        |   feeds filtered rows to SVAR <Grid> inside <Willow>
        v
@svar-ui/svelte-grid <Grid>     row click -> opens detail drawer
```

The dashboard is **sample-first**: it must render and remain interactive even
when no backend is reachable. `api.ts` swallows fetch errors and returns the
bundled sample set; never throw past it.

## Directory map

```
src/
  app.html
  app.css
  app.d.ts
  routes/
    +layout.svelte                       Imports app.css, shell + header
    +page.svelte                         Filters + SVAR Grid + drawer
  lib/
    data/
      api.ts                             fetchChecklists with sample fallback
      sample.ts                          SAMPLE_CHECKLIST_ROWS (12 cases)
    checklist/
      types.ts                           Canonical TypeScript types
      safety-flags.ts                    computeSafetyFlags + countPhasesCompleted
```

## Columns

| Column        | Source field                              |
| ------------- | ----------------------------------------- |
| Case date     | `caseDate`                                |
| Patient       | `patientName`                             |
| Site          | `siteName`                                |
| Theatre / OR  | `operatingRoom`                           |
| Surgeon       | `surgeonName`                             |
| Anaesthetist  | `anaesthetistName`                        |
| Urgency       | `urgency`                                 |
| Specialty     | `surgicalSpecialty`                       |
| Status        | `status` (lifecycle, ChecklistStatus)     |
| Flags         | `flagCount`                               |

## Filters

- **Status**: all / not-started / sign-in-complete / time-out-complete /
  sign-out-complete / completed / abandoned.
- **Urgency**: all / elective / urgent / emergency / immediate.
- **Specialty**: all + distinct specialties extracted from the dataset.
- **Search**: case-insensitive substring match across patient name, NHS
  number, surgeon, anaesthetist, lead nurse, site, theatre, procedure, and
  specialty.

Filters compose with AND semantics: a row must satisfy every active filter to
appear in the grid.

## Row drawer

Clicking a grid row sets `selectedId`. A `$derived` lookup finds the matching
`ChecklistRow`, and the drawer renders:

- Header: case date, site, OR, patient name, planned procedure, urgency,
  specialty, lifecycle status.
- Safety flags (computed live via `computeSafetyFlags()`) coloured by severity.
- Phase 1 — Sign In: coordinator + completed-at timestamp + per-question
  responses.
- Phase 2 — Time Out: coordinator + completed-at timestamp + per-question
  responses, including critical steps, anticipated duration, anticipated
  blood loss.
- Phase 3 — Sign Out: coordinator + completed-at timestamp + per-question
  responses.
- Team-member roster from `teamMembers` (name, role, introduced flag).
- Abandoned reason, if any.

## Verify

```sh
pnpm install
pnpm run check
```
