# Confusion Assessment Method (CAM) — specification

This file is the **living domain spec** for this form. It captures the contract
each implementation (SQL schema, generated representations, front-ends, and Rust
back-end) must satisfy. Treat it as the source of truth for behaviour — update
the spec before changing code.

Slug: `confusion-assessment-method`

## 1. Purpose

A bedside **delirium screening** instrument. It records four observational
**features** and applies the validated CAM diagnostic algorithm to classify
delirium as **present** or **absent**. This is a **status / classification**
form, not a numeric-score form: there is no total, no cut-off, and no band
table. The output is a boolean status plus the set of positive features.

Full design description: [`index.md`](../index.md).

## 2. Scope

In scope: the schema, the classification engine, four front-ends (form +
dashboard, each in HTML and SvelteKit), and the Rust JSON-API crate. The
CAM-ICU variant is in scope as a mode of the same instrument (same features,
same algorithm, non-verbal task substitutions). Out of scope: hosted
deployment, authentication, multi-tenancy, and full clinical diagnosis of the
underlying cause of delirium.

## 3. Data model

The core entity is an **assessment** with four **features**, each a
present / absent observation, plus identification, motoric subtype, and a
computed result.

| Feature | Field | Type | Positive when |
| --- | --- | --- | --- |
| 1 | `acuteOnsetFluctuating` | present / absent | acute change from baseline AND fluctuating course |
| 2 | `inattention` | present / absent | difficulty focusing attention (confirmed by attention test) |
| 3 | `disorganisedThinking` | present / absent | incoherent, rambling, or illogical thinking |
| 4 | `alteredConsciousness` | present / absent | level of consciousness anything other than alert |

Supporting fields: assessor identity, encounter metadata, `variant`
(`cam` | `camIcu`), `consciousnessLevel`
(`alert` | `vigilant` | `lethargic` | `stupor` | `coma`), optional `rassScore`
(−5..+4, CAM-ICU), `attentionTest` used, `motoricSubtype`
(`hypoactive` | `hyperactive` | `mixed` | `normal`), and observation notes
(hallucinations, delusions, sleep–wake disturbance).

Each feature is a tri-state at data-entry time: `present`, `absent`, or unset.
An unset feature is treated as `absent` for algorithm evaluation but is
distinguished in storage so an incomplete assessment can be detected.

## 4. Algorithm (boolean logic)

The classification is a pure boolean function of the four features:

```
deliriumPresent = feature1 AND feature2 AND (feature3 OR feature4)
```

- `feature1` = acute onset and fluctuating course is present
- `feature2` = inattention is present
- `feature3` = disorganized thinking is present
- `feature4` = altered level of consciousness is present

Classification: `deliriumPresent ? 'present' : 'absent'`.

The engine also returns `positiveFeatures: number[]` — the subset of `{1,2,3,4}`
that were present — so the reasoning is auditable. CAM and CAM-ICU share this
identical algorithm; only the evidence-gathering tasks differ.

Edge case: if `variant = camIcu` and `rassScore ∈ {−4, −5}` (unrousable), the
result is `unableToAssess` rather than `present` / `absent`, and the algorithm
is not evaluated.

## 5. Inputs and outputs

**Input.** A typed `CamAssessment` object whose shape mirrors the SQL schema.
Unanswered text and enum fields default to `''`; unanswered numeric, date, and
time fields default to `null`; unset features default to `absent` at evaluation.

**Output.** A grading object from the engine:

```ts
gradeCam(data: CamAssessment): {
  classification: 'present' | 'absent' | 'unableToAssess';
  deliriumPresent: boolean;
  positiveFeatures: number[];        // subset of [1,2,3,4]
  motoricSubtype: 'hypoactive' | 'hyperactive' | 'mixed' | 'normal' | '';
  flaggedIssues: FlaggedIssue[];
}
```

Rendered as HTML in the browser, exported as PDF, and convertible to FHIR R5
Bundle, XML, JSON, CSV, or TSV.

## 6. Flagged issues

Derived independently of the classification; priority high / medium / low:

- **Delirium present → cause workup** (high) — fires when `deliriumPresent`;
  prompts the reversible-precipitant screen (PINCH ME) and investigations.
- **Hypoactive delirium** (high) — fires when `motoricSubtype = hypoactive`;
  the most-missed and worst-prognosis presentation.
- **Altered consciousness / safety** (high) — fires when
  `consciousnessLevel ∈ {stupor, coma}`; urgent medical review.
- **Deliriogenic medication** (medium) — recent high-risk drug noted.
- **Unable to assess** (medium) — CAM-ICU RASS −4/−5 or incomplete attention
  test; re-assess when arousal improves.
- **Repeat screening** (low) — a single negative screen does not exclude
  delirium; re-screen at least once per shift in at-risk patients.

## 7. Artefacts

| Subdirectory | Role |
| --- | --- |
| `sql` | source of truth |
| `xml` | generated |
| `fhir` | generated |
| `protobuf` | generated |
| `front-end-with-html` | HTML + Lily (wizard + dashboard) |
| `front-end-with-svelte` | SvelteKit (wizard + dashboard) |
| `back-end-with-loco` | Rust + Loco JSON API |

Generated artefacts (XML, FHIR R5, Protocol Buffers, OpenAPI, Loco setup script)
are never hand-edited; re-run the generators in
[`/AGENTS.md`](../../../AGENTS.md) §Tools after schema changes.

## 8. Acceptance criteria

- `bin/test-form confusion-assessment-method` exits cleanly.
- The classification engine is pure (no side effects, no I/O) and unit-tested,
  covering each satisfying and non-satisfying feature pattern and the
  `unableToAssess` edge case.
- The HTML front-ends conform to the Lily HTML headless contract
  ([`forms/AGENTS-front-end-html.md`](../../AGENTS-front-end-html.md)).
- The SvelteKit front-ends conform to the Lily Svelte headless contract
  ([`forms/AGENTS-front-end-svelte.md`](../../AGENTS-front-end-svelte.md)) and
  pass `pnpm check` and `pnpm test`.
- The Rust crate builds (`cargo build`) and tests pass (`cargo test`).
- LocalStorage keys preserve draft state across reloads:
  - `confusion-assessment-method.front-end-with-html.v1`
  - `confusion-assessment-method.front-end-with-svelte.v1`

## 9. Compliance

Inherits the monorepo compliance baseline: MDCG 2019-11 Rev.1 (EU MDR), UK
Medical Devices Regulations 2002, ISO/IEC/IEEE 26514:2022, UK MHRA Software and
AI as a Medical Device. Form-specific classification (Class IIa where output
drives clinical management of delirium) is recorded in [`index.md`](../index.md).

## 10. References

- [`index.md`](../index.md) — form description and scoring details
- [`AGENTS.md`](../AGENTS.md) — agent instructions
- [`plan.md`](../plan.md) — implementation roadmap
- [`tasks.md`](../tasks.md) — task tracking
- [`/spec.md`](../../../spec.md) — system-level specification
- [`/AGENTS.md`](../../../AGENTS.md) — cross-cutting agent instructions

## 11. Verify

```sh
bin/test-form confusion-assessment-method
```
