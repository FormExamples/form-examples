# Scoring Protocol

The Agile Consulting Scorecard produces a numeric score, a categorical
readiness band, and six readiness flags. This document specifies the
protocol the engine implements.

## Inputs

The engine consumes an `AgileConsultingScorecardAssessment` object with:

- Organisation metadata (name, sector, size).
- Respondent metadata (name, role, email).
- Sixteen boolean fields `item01`..`item16`.
- Optional evidence text per item.

A `null` answer represents an unanswered item; the engine treats `null`
as `false` for scoring (i.e. no points) but surfaces it on the dashboard
separately so the reviewer can see the difference between "we
demonstrably don't do this" and "we haven't yet checked".

## Sum-of-points

The score is the count of `true` answers across `item01`..`item16`. The
score is bounded in [0, 16].

```ts
scoreTotal = Object.values({item01..item16}).filter(v => v === true).length
```

The manifesto subtotal is `item01`..`item04` (range 0–4). The principles
subtotal is `item05`..`item16` (range 0–12).

## Band table

| Score | Band | Verdict |
| --- | --- | --- |
| 0–4 | `low` | Don't hire agile help yet — focus on internal operations first |
| 5 | `borderline` | Treated as `low`; explicitly flagged because the seed leaves 5 outside its bands |
| 6–10 | `medium` | Do the agile homework first; revisit in ~3 months |
| 11–16 | `high` | Likely ready; trial an engagement and review in ~3 months |

The band is **independent** of the score in storage: future versions of
the engine could weight manifesto vs. principles differently without
changing the underlying score.

## Reviewer override

The respondent (or a reviewing sponsor) may override the computed verdict
on Step 6 of the wizard. Both the **computed** band and the **final**
band are stored and rendered. The override requires:

- A non-empty reviewer name.
- A non-empty rationale.

The dashboard renders both bands side-by-side; the report PDF lists the
computed band, the final band, and the override rationale.

## Readiness flags

Six flags are computed independently of the band. Each flag is a
high-or-medium priority signal that downgrades the practical
recommendation even where the score is high.

| Flag | Trigger | Priority |
| --- | --- | --- |
| `flag_no_senior_leadership_buyin` | manifesto item 4 = `false` | high |
| `flag_no_customer_contact` | manifesto item 1 = `false` OR principle 5 (item 5) = `false` | high |
| `flag_no_working_software` | manifesto item 2 = `false` AND principle 11 (item 11) = `false` | high |
| `flag_no_sustainable_budget` | principle 12 (item 12) = `false` | medium |
| `flag_no_self_organization` | principle 15 (item 15) = `false` | medium |
| `flag_no_reflection_culture` | principle 16 (item 16) = `false` | medium |

A `high` band combined with any flag downgrades the practical
recommendation: the engagement can proceed, but the consultant should be
briefed on the flagged area as the first focus.

## Algorithm verification

The engine has parity tests across the TypeScript (Vitest) and Rust
(cargo test) implementations:

- Engine files (TypeScript): `score-grader.ts`, `manifesto-rules.ts`,
  `principles-rules.ts`, `flagged-issues.ts`.
- Engine files (Rust): mirror module names under
  `back-end-with-loco/src/engine/`.
- Test files: `score-grader.test.ts`, `manifesto-rules.test.ts`,
  `principles-rules.test.ts`, `flagged-issues.test.ts` (TS); equivalent
  Rust tests.
- Golden fixtures: `samples/sample-assessment.json` and
  `samples/sample-grade.json`.

Both engines must produce byte-identical output for the golden fixture.

## Recommendations

Each band emits a default recommendation:

| Band | Recommendation |
| --- | --- |
| `low` | Invest in internal operations (BPO, VSM, Lean) for 3–6 months before considering agile coaching. |
| `borderline` | Same as `low` until at least one more item passes. |
| `medium` | Do the agile homework (start with the failed-flag areas) and revisit in ~3 months. |
| `high` (no flags) | Trial a 90-day engagement, review at end of trial. |
| `high` + any flag | Trial a 90-day engagement with the flagged area as the first focus. |

The recommendation engine is pure: it consumes the score, band, and
flags, and emits a string. The flag-first-focus rule fires when any
flag's priority is `high` or `medium` and the band is `high` or `medium`.

## Pre-tender summary

The engine also produces a pre-tender summary suitable for pasting into a
vendor-selection document. It includes:

- The computed band.
- The final band (after any reviewer override).
- A bulleted list of the failed items, grouped by flag.
- The recommended next actions per band.

This summary is the practical output of the form — the buyer-side
respondent shares it with potential consultants so the engagement starts
with shared understanding.

## Diff against a prior assessment

The engine supports a diff against a prior assessment, surfacing:

- Items that changed `false → true` (improvement).
- Items that changed `true → false` (regression).
- Items that changed `null → true/false` (newly answered).
- Score delta and band delta.

This supports the "revisit in ~3 months" recommendation by quantifying
movement on the underlying items.

## ISO 9001:2015 alignment

The protocol satisfies ISO 9001:2015 §9 (performance evaluation):

- §9.1.1 — monitoring and measurement (binary items per readiness
  dimension).
- §9.1.3 — analysis and evaluation (score + band + flags).
- §9.2 — internal audit (the form is itself an internal audit
  instrument).
- §9.3 — management review (the report PDF is the artefact taken to
  management review).
