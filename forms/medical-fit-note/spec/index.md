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
Loco setup script are generated. Front-ends and back-end: not implemented.

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
