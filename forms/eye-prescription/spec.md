# Eye Prescription — specification

This file is the **living domain spec** for this form. It captures the contract each implementation (SQL schema, generated representations, front-ends, and Rust backend) must satisfy. Treat it as the source of truth for behaviour — update the spec before changing code.

Slug: `eye-prescription`

## 1. Purpose

A UK General Optical Council (GOC) aligned **spectacle prescription** as issued
by a registered optometrist or dispensing optician following a sight test.
Captures refractive correction for each eye (sphere, cylinder, axis, addition,
prism, base), pupillary distance, visual acuity, optional ocular health
findings, and lens recommendations. Computes a per-eye **refractive
classification** (emmetropia / myopia / hyperopia / astigmatism, each by
severity), a composite **prescription complexity** (simple / moderate /
complex), and a set of **safety flags** (high myopia, high astigmatism,
significant anisometropia, prism present, presbyopia, expired prescription,
paediatric, ocular pathology). Output is a signed prescription document with
validity dates suitable for handing to a lens dispenser, exporting as a FHIR
R5 `VisionPrescription` resource, or archiving as XML.

Full design description: [`index.md`](index.md).

## 2. Scope

In scope: the schema, scoring engine, four front-ends (form + dashboard, each in HTML and SvelteKit), and the Rust full-stack crate listed in §5. Out of scope: hosted deployment, authentication, multi-tenancy.

## 3. Scoring system

The prescription is graded on three orthogonal axes.

### Refractive classification (per eye)

Computed from `sphere` and `cylinder` independently for the right (OD) and
left (OS) eye.

| Class | Sphere (D) | Cylinder (D) |
| --- | --- | --- |
| Emmetropia | -0.50 to +0.50 | ≤ 0.50 |
| Low myopia | -0.75 to -3.00 | — |
| Moderate myopia | -3.25 to -6.00 | — |
| High myopia | < -6.00 | — |
| Low hyperopia | +0.75 to +2.00 | — |
| Moderate hyperopia | +2.25 to +5.00 | — |
| High hyperopia | > +5.00 | — |
| Mild astigmatism | — | 0.50 to 1.00 |
| Moderate astigmatism | — | 1.25 to 2.50 |
| High astigmatism | — | > 2.50 |
| Presbyopia | — | `addition` ≥ +0.75 |

### Prescription complexity

| Level | Drivers |
| --- | --- |
| Simple | spherical only or mild cyl, no prism, no significant anisometropia, no addition |
| Moderate | moderate sphere / cyl, includes addition, no prism, anisometropia ≤ 2 D |
| Complex | any of: high myopia / hyperopia / astigmatism, prism present, anisometropia > 2 D, or multifocal with high addition |

### Safety flags (computed independently of classification)

| Flag | Trigger |
| --- | --- |
| `high-myopia` | sphere < -6.00 D in either eye |
| `high-hyperopia` | sphere > +5.00 D in either eye |
| `high-astigmatism` | cylinder > 2.50 D in either eye |
| `anisometropia` | |sphere_OD − sphere_OS| > 2.00 D |
| `prism-present` | any non-zero prism in either eye |
| `presbyopia` | addition ≥ +0.75 D |
| `paediatric` | patient age < 16 years on issue date |
| `prescription-expired` | expiry date < today |
| `significant-change-from-prior` | sphere change > 1.00 D vs. previous prescription |
| `ocular-pathology` | any positive ocular-health finding recorded |
| `refer-ophthalmology` | clinician override flag |

## 4. Inputs and outputs

**Inputs.** A typed assessment object whose shape mirrors the SQL schema in `sql-migrations/` (13 migration files). Unanswered text and enum fields default to `''`; unanswered numeric, date, and time fields default to `null`.

**Outputs.** A grading object emitted by the engine: scoring result (per the instrument named in §3), `firedRules[]`, `additionalFlags[]`, and a clinical / administrative report. Rendered as HTML in the browser, exported as PDF via the SvelteKit endpoint, and convertible to FHIR R5 Bundle, XML, JSON, CSV, or TSV.

## 5. Artefacts

Required artefacts and their current status:

| Subdirectory | Role |
| --- | --- |
| `sql-migrations` | source of truth |
| `xml-representations` | generated |
| `fhir-r5` | generated |
| `protobuf` | generated |
| `openapi` | generated |
| `front-end-form-with-html` | Lily contract |
| `front-end-form-with-svelte` | SvelteKit |
| `front-end-dashboard-with-html` | Lily contract |
| `front-end-dashboard-with-svelte` | SvelteKit + SVAR |
| `full-stack-with-loco-tera-htmx-alpine` | Rust + Loco |
| `full-stack-with-loco-tera-htmx-alpine-setup` | generated scaffold script |

Generated artefacts (XML, FHIR R5, Protocol Buffers, OpenAPI, Loco setup script) are never hand-edited; re-run the generators in [`/AGENTS.md`](../../AGENTS.md) §Tools after schema changes.

## 6. Acceptance criteria

- `bin/test-form eye-prescription` exits cleanly.
- The scoring engine is pure (no side effects, no I/O) and unit-tested.
- The HTML front-ends conform to the Lily HTML headless contract
  ([`forms/AGENTS-front-end-html.md`](../AGENTS-front-end-html.md)).
- The SvelteKit front-ends conform to the Lily Svelte headless contract
  ([`forms/AGENTS-front-end-svelte.md`](../AGENTS-front-end-svelte.md))
  and pass `pnpm check` and `pnpm test`.
- The Rust crate builds (`cargo build`) and tests pass (`cargo test`).
- `bin/lily-html-refactor --check eye-prescription` reports no drift.
- LocalStorage keys preserve draft state across reloads:
  - `eye-prescription.front-end-form-with-html.v1` (HTML)
  - `eye-prescription.front-end-form-with-svelte.v1` (SvelteKit)

## 7. Compliance

Inherits the monorepo compliance baseline: MDCG 2019-11 Rev.1 (EU MDR), UK Medical Devices Regulations 2002, ISO/IEC/IEEE 26514:2022, UK MHRA Software and AI as a Medical Device. Form-specific classification (e.g. Class IIa where output drives clinical decisions) is recorded in [`index.md`](index.md) and [`AGENTS.md`](AGENTS.md) where it differs from the baseline.

## 8. References

- [`index.md`](index.md) — form description and scoring details
- [`AGENTS.md`](AGENTS.md) — agent instructions
- [`plan.md`](plan.md) — implementation roadmap
- [`tasks.md`](tasks.md) — task tracking
- [`/spec.md`](../../spec.md) — system-level specification
- [`/AGENTS.md`](../../AGENTS.md) — cross-cutting agent instructions
- [`../AGENTS-front-end-html.md`](../AGENTS-front-end-html.md) — Lily HTML contract
- [`../AGENTS-front-end-svelte.md`](../AGENTS-front-end-svelte.md) — Lily Svelte contract

## 9. Verify

```sh
bin/test-form eye-prescription
```
