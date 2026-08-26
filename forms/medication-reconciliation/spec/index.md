# Medication Reconciliation — specification

This file is the **living domain spec** for this form. It captures the contract
each implementation (SQL schema, generated representations, front-ends, and Rust
back-end) must satisfy. Treat it as the source of truth for behaviour — update
the spec before changing code.

Slug: `medication-reconciliation`

## 1. Purpose

A medicines-safety document that reconciles a patient's medicines at a
transition of care (admission / transfer / discharge). It captures the
best-possible medication history (BPMH) from two or more independent sources and
the current inpatient list, reconciles the two, classifies every discrepancy,
grades the **completeness / status** of the reconciliation, and raises **safety
flags**. It is a documentation-and-completeness form, not a numeric score.

Full design description: [`index.md`](../index.md).

## 2. Scope

In scope: the schema, reconciliation engine, two consolidated front-ends
(`front-end-with-html`, `front-end-with-svelte`), the Rust Loco JSON-API crate,
and the generated representations (XML, FHIR R5, protobuf, OpenAPI). Out of
scope: hosted deployment, authentication, multi-tenancy, definitive interaction
decision-support, and primary-care repeat authorization.

## 3. Data model

One logical reconciliation record with child collections of line items and
discrepancies. Fields default to `''` (text/enum) or `null` (numeric/date/time)
when unanswered.

**Encounter and identification.**

| Field | Type | Notes |
| --- | --- | --- |
| `reconciliationType` | enum | admission / transfer / discharge |
| `careSetting` | enum | emergency-department / acute-medical-unit / surgical-admissions / ward / critical-care / other |
| `reconciledAt` | timestamp | date and time of reconciliation |
| `clinicianName` | text | reconciling clinician |
| `clinicianRole` | enum | pharmacist / pharmacy-technician / prescriber / nurse / other |
| `patientIdentifier` | text | local identifier |
| `ageBand` | enum | adult / paediatric age band |
| `sex` | enum | patient sex |
| `weightKg` | numeric | for weight-based dosing (nullable) |
| `allergyStatus` | enum | documented / no-known-drug-allergies / not-documented |

**Information source** (`information_source`, 0..*): one row per source used to
build the BPMH.

| Field | Type | Notes |
| --- | --- | --- |
| `sourceType` | enum | patient-interview / carer-interview / gp-record / repeat-prescription / community-pharmacy / dispensing-history / previous-discharge-summary / own-drugs-bag / care-home-mar |
| `verified` | boolean | whether the source was directly checked |

**Allergy** (`allergy`, 0..*): drug allergy / adverse reaction.

| Field | Type | Notes |
| --- | --- | --- |
| `substance` | text | drug or class the patient reacts to |
| `reactionType` | enum | allergy / intolerance / adverse-effect / unknown |
| `severity` | enum | mild / moderate / severe / anaphylaxis |

**Medication line item** (`medication_line_item`, 0..*): one row per medicine on
either list. `listSource` distinguishes the BPMH from the inpatient list.

| Field | Type | Notes |
| --- | --- | --- |
| `listSource` | enum | bpmh / inpatient |
| `drugName` | text | generic (preferred) or brand name |
| `form` | text | tablet / capsule / injection / patch / … |
| `dose` | text | e.g. `5 mg` (free text to preserve units) |
| `route` | enum | oral / iv / im / subcutaneous / topical / inhaled / … |
| `frequency` | text | e.g. `once daily`, `BD`, `PRN` |
| `indication` | text | reason for the medicine |
| `highRiskClass` | enum | none / anticoagulant / insulin / opioid / other |
| `adherence` | enum | taking / not-taking / intermittent / unknown |
| `sourceType` | enum | which information source this line came from |
| `status` | enum | active / held / stopped / suspended (inpatient rows) |

**Discrepancy** (`discrepancy`, 0..*): one row per reconciliation difference.

| Field | Type | Notes |
| --- | --- | --- |
| `discrepancyType` | enum | omission / commission / duplication / dose / frequency / route / formulation |
| `bpmhItemRef` | text | matched BPMH line item (nullable) |
| `inpatientItemRef` | text | matched inpatient line item (nullable) |
| `intendedAction` | enum | continue / hold / stop / change / start |
| `rationale` | text | clinical reason for the action |
| `intentional` | boolean | true = documented decision; false = unexplained (error) |

**Derived (never stored as input).** `status`, `discrepancies[]` (classified),
`firedRules[]`, `flags[]`, `sourceCount`, `unintentionalCount`,
`highRiskUnintentionalCount`.

## 4. Reconciliation algorithm

Pure function `reconcile(data)`, no I/O. Steps:

1. **Derive counts.** `sourceCount = information_source[].length`;
   `unintentionalCount = discrepancies[].filter(d => !d.intentional).length`;
   `highRiskUnintentionalCount` = unintentional discrepancies whose matched line
   item has `highRiskClass in {anticoagulant, insulin, opioid}`.
2. **Classify each discrepancy** by `discrepancyType` and by `intentional`. An
   intentional discrepancy carries a documented `intendedAction` + `rationale`;
   an unintentional discrepancy (missing action / rationale, or explicitly
   `intentional == false`) is an outstanding error.
3. **Derive status** (first match wins):
   ```
   status =
     sourceCount < 2                         -> 'incomplete'
     allergyStatus == 'not-documented'       -> 'incomplete'
     any line item not reviewed              -> 'incomplete'
     unintentionalCount > 0                   -> 'discrepancies-outstanding'
     any discrepancy missing action/rationale -> 'discrepancies-outstanding'
     otherwise                                -> 'complete'
   ```
4. **Raise flags** (see §5), independently of the status.

A discrepancy on a **high-risk** medicine that is unintentional both keeps the
status at `discrepancies-outstanding` and raises the high-priority safety flag.

## 5. Flagged issues (safety flags)

Emitted independently of the status, each with a priority:

- **High-risk unintentional discrepancy** (high) —
  `highRiskUnintentionalCount > 0`: unresolved discrepancy on an anticoagulant,
  insulin, or opioid.
- **Insufficient sources** (high) — `sourceCount < 2`: BPMH built from fewer than
  two independent sources.
- **Allergy conflict** (high) — a reconciled `medication_line_item.drugName`
  matches an `allergy.substance`.
- **Drug interaction** (high / medium) — a clinically significant interaction
  between two reconciled medicines (rule table; flags for pharmacist review).
- **Therapeutic duplication** (medium) — the same drug or class appears twice.
- **Unintentional discrepancy outstanding** (medium) — `unintentionalCount > 0`
  not otherwise covered by the high-risk flag.
- **Allergy status not documented** (low) — `allergyStatus == 'not-documented'`.

## 6. Inputs and outputs

**Input.** A typed reconciliation object whose shape mirrors the SQL schema in
`sql/`. Unanswered text/enum fields default to `''`; unanswered numeric, date,
and time fields default to `null`; child collections default to `[]`.

**Output.** A grading object emitted by the engine:

```ts
{
  status: 'complete' | 'discrepancies-outstanding' | 'incomplete';
  discrepancies: ClassifiedDiscrepancy[]; // type + intentional + action + rationale
  firedRules: FiredRule[];
  flags: SafetyFlag[];
  sourceCount: number;
  unintentionalCount: number;
  highRiskUnintentionalCount: number;
}
```

Rendered as HTML in the browser and convertible to FHIR R5 Bundle
(`MedicationStatement` for BPMH, `MedicationRequest` for the inpatient list,
`List` for the reconciliation), XML, JSON, CSV, or TSV.

## 7. Artefacts

| Subdirectory | Role |
| --- | --- |
| `sql` | source of truth |
| `xml` | generated |
| `fhir` | generated |
| `protobuf` | generated |
| `openapi` | generated |
| `front-end-with-html` | HTML + Lily (wizard + dashboard) |
| `front-end-with-svelte` | SvelteKit (wizard + dashboard) |
| `back-end-with-loco` | Rust + Loco JSON API |
| `back-end-with-loco-setup` | generated scaffold script |

Generated artefacts are never hand-edited; re-run the generators in
[`/AGENTS.md`](../../../AGENTS.md) §Tools after schema changes.

## 8. Acceptance criteria

- `bin/test-form medication-reconciliation` exits cleanly.
- The reconciliation engine is pure (no side effects, no I/O) and unit-tested,
  covering: each status class; each discrepancy type; intentional vs
  unintentional; the high-risk (anticoagulant / insulin / opioid) branch; the
  `< 2` sources branch; the allergy-conflict branch.
- The HTML front-ends conform to the Lily HTML headless contract
  ([`forms/AGENTS-front-end-html.md`](../../AGENTS-front-end-html.md)).
- The SvelteKit front-ends conform to the Lily Svelte headless contract
  ([`forms/AGENTS-front-end-svelte.md`](../../AGENTS-front-end-svelte.md)) and
  pass `pnpm check` and `pnpm test`.
- The Rust crate builds (`cargo build`) and tests pass (`cargo test`).

## 9. Compliance

Inherits the monorepo compliance baseline: MDCG 2019-11 Rev.1 (EU MDR/IVDR),
UK Medical Devices Regulations 2002, ISO/IEC/IEEE 26514:2022, UK MHRA Software
and AI as a Medical Device. Form-specific classification is recorded in
[`index.md`](../index.md) and [`AGENTS.md`](../AGENTS.md) where it differs from
the baseline.

## 10. References

- [`index.md`](../index.md) — form description and completeness / safety model
- [`AGENTS.md`](../AGENTS.md) — agent instructions
- [`plan.md`](../plan.md) — implementation roadmap
- [`tasks.md`](../tasks.md) — task tracking
- [`/spec.md`](../../../spec.md) — system-level specification
- [`/AGENTS.md`](../../../AGENTS.md) — cross-cutting agent instructions

## 11. Verify

```sh
bin/test-form medication-reconciliation
```
