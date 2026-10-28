# Medical Device Assessment — specification

Living domain spec for this form. Update before changing code.

Slug: `medical-device-assessment`

## 1. Purpose

Assess a medical device's regulatory risk class under EU MDR 2017/745
Annex VIII (and UK MDR 2002), derive the conformity-assessment route, and
report readiness gaps. Full description: [`index.md`](../index.md).

## 2. Scope

In scope: schema, scoring engine, front-ends (form + dashboard, HTML and
SvelteKit) and the Loco JSON API. Out of scope: FDA classification, IVDR
classification (flagged only), authentication, multi-tenancy.

## 3. Scoring system

- **Primary instrument:** MDR Annex VIII class (I, IIa, IIb, III), the maximum
  over all fired rules.
- **Suffixes:** `s` sterile, `m` measuring, `r` reusable surgical instrument;
  Class I only.
- **Conformity route:** `self-declaration` (plain Class I),
  `notified-body-partial` (Is / Im / Ir), `notified-body-full` (IIa+).
- **Regulatory readiness:** `ready`, `gaps`, or `blocked` (no intended purpose,
  or IVD out of scope).
- **Override:** the assessor may set a final class different from computed,
  with a mandatory reason; the engine raises a `class-override` flag.
- **Fail-safe:** unanswered classification inputs never lower the class; an
  incomplete device kind yields class `''` and a `blocked` readiness.

## 4. Inputs and outputs

**Inputs.** A typed assessment object mirroring `sql/` (migrations 02–04).
Unanswered text and enum fields are `''`; unanswered numeric, date, time
fields are `null`.

**Outputs.** `{ computedClass, finalClass, classSuffix, conformityRoute,
determiningRule, readiness, firedRules[], flags[] }` (migrations 05–07).

## 5. Artefacts

| Subdirectory               | Role                                         |
| -------------------------- | -------------------------------------------- |
| `sql`                      | source of truth                              |
| `xml`, `fhir`, `protobuf`, `openapi` | generated                          |
| `front-end-with-html`      | HTML + Lily — not implemented                |
| `front-end-with-svelte`    | SvelteKit — not implemented                  |
| `back-end-with-loco`       | Rust + Loco JSON API — not implemented       |
| `back-end-with-loco-setup` | generated scaffold script                    |

## 6. Acceptance criteria

- `bin/test-form medical-device-assessment` exits cleanly.
- `bin/test-sql-apply medical-device-assessment` passes.
- The engine is pure and unit-tested, including each rule's boundary.
- localStorage keys: `medical-device-assessment.front-end-with-html.v1`,
  `medical-device-assessment.front-end-with-svelte.v1`.

## 7. Compliance

Inherits the monorepo baseline (MDCG 2019-11 Rev.1, UK MDR 2002, ISO/IEC/IEEE
26514:2022, MHRA software guidance). This tool applies a simplified reading of
Annex VIII; it is a decision aid and does not replace a notified-body opinion.

## 8. References

[`index.md`](../index.md) · [`AGENTS.md`](../AGENTS.md) · [`plan.md`](../plan.md) ·
[`tasks.md`](../tasks.md) · [`/spec.md`](../../../spec.md) · [`/AGENTS.md`](../../../AGENTS.md)

## 9. Verify

```sh
bin/test-form medical-device-assessment
bin/test-sql-apply medical-device-assessment
```
