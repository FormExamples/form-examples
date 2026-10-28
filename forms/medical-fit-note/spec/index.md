# Medical Fit Note — specification

Living domain spec. Update before changing code.

Slug: `medical-fit-note`

## 1. Purpose

Let a clinician sign and approve a fit note for an employee on sick leave.
See [`index.md`](../index.md).

## 2. Scope

In scope: schema, approval engine, front-ends (HTML and SvelteKit) and Loco
JSON API. Out of scope: statutory issuing, authentication, employer delivery.

## 3. Scoring system

Rule-based approval (R-01 to R-09 in `index.md`). Output: `approved`,
`needs-completion` or `blocked`. Fail-safe: a missing safety-relevant input
never yields `approved`.

## 4. Inputs and outputs

Inputs mirror `sql/` migrations 02–04. Unanswered text and enum fields are
`''`; unanswered numeric and date fields are `null`. Outputs mirror
migrations 05–07: `outcome`, `approvalStatus`, `durationDays`,
`adjustmentCount`, `firedRules[]`, `flags[]`.

## 5. Artefacts

`sql` is the source of truth; `xml`, `fhir`, `protobuf`, `openapi` and the
Loco setup script are generated. The HTML and SvelteKit front-ends and the Loco back-end are implemented and
wired together. The back-end serves plain REST JSON at `/api/employees`,
`/api/clinicians`, `/api/medical_fit_notes`, `/api/medical_fit_note_grades`,
`/api/medical_fit_note_grade_rules` and `/api/medical_fit_note_grade_flags`
(no bespoke submit or result endpoint), with permissive CORS in development.
The API base is `window.__API_BASE__` / `?api=` (HTML) or `VITE_API_BASE`
(Svelte), default `http://localhost:5150`.

- **Dashboard**: fetch notes, employees, clinicians, grades and flags and join
  client-side; fall back to offline sample rows with a notice on failure or an
  empty list.
- **Submit**: the local engine grades the wizard (the report always shows),
  then POST employee, clinician (both find-or-create by NHS number or name and
  birth date, and registration number or name), `medical_fit_note`
  (`status` is `signed` only when `approvalStatus` is `approved` and the
  declaration is given, else `draft`), `medical_fit_note_grade`, then one POST
  per fired rule and flag. Flag categories outside the SQL CHECK list are
  skipped. Saving requires employee name, date of birth and clinician name.
  On failure an error is shown and the report and draft are kept.

## 6. Acceptance criteria

- `bin/test-form medical-fit-note` exits cleanly.
- `bin/test-sql-apply medical-fit-note` passes.
- localStorage keys: `medical-fit-note.front-end-with-html.v1`,
  `medical-fit-note.front-end-with-svelte.v1`.

## 7. Compliance

Inherits the monorepo baseline. Handles special-category health data; consent
to share with the employer is recorded explicitly.

## 8. References

[`index.md`](../index.md) · [`AGENTS.md`](../AGENTS.md) · [`plan.md`](../plan.md) ·
[`tasks.md`](../tasks.md) · [`/spec.md`](../../../spec.md)

## 9. Verify

```sh
bin/test-form medical-fit-note
bin/test-sql-apply medical-fit-note
```
