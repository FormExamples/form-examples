# Time-to-surgery gating

The computation that distinguishes this form from an ordinary pre-operative
assessment. A finding on its own is a fact. A finding gated against the weeks
remaining before surgery is a decision.

## The model

```
weeksToSurgery = floor((plannedSurgeryDate - assessmentDate) / 7)
```

Both dates come from the recorded data, never from the system clock, so the
engine stays pure and the same assessment always grades the same way.

For each domain:

| Condition | Status | Meaning |
| --- | --- | --- |
| domain does not apply (no diabetes, never smoked, …) | `not-applicable` | nothing to do |
| domain applies but the trigger is absent | `optimized` | already where it should be |
| triggered, intervention started, `weeksToSurgery >= leadTime` | `in-progress` | on track; keep going |
| triggered, not started, `weeksToSurgery >= leadTime` | `action-required` | start now and it will work |
| triggered, `weeksToSurgery < leadTime` | `insufficient-time` | it cannot work before the listed date |
| triggered, `weeksToSurgery` is null | `action-required` | ungated; the report says gating could not be applied |

```
weeksShortfall = leadTime - weeksToSurgery,  when positive; else null
```

The shortfall is the number the team acts on: it is exactly how much later the
surgery would have to be for the intervention to work.

## Why `insufficient-time` is not a warning

It forces the composite readiness band to `defer-surgery` and raises the
`insufficient-time-to-optimize` safety flag. Neither is suppressible by the
clinician override, which changes only the readiness band and leaves the flag
list untouched.

The reason is that this state has exactly two safe resolutions, and both require
a person to choose:

1. **Re-date the surgery** so the window exists. The report gives the shortfall
   in weeks, so the new date is arithmetic.
2. **Accept the unoptimized risk** because the surgery cannot wait — an
   oncological resection, a rapidly deteriorating joint, a patient who declines
   delay. This is a legitimate and common decision.

The form's job is to make the team say which one, and to record it. Step 16's
gate decision includes `accept-unoptimized-risk` for precisely this purpose, and
selecting it requires the override reason. Softening `insufficient-time` into a
warning would let the third, unsafe path happen by default: proceeding while
believing the patient was optimized.

## Worked examples

### A — comfortably in time

Assessment 2026-09-01, surgery 2026-12-01. `weeksToSurgery = 13`.

| Domain | Trigger | Lead | Status |
| --- | --- | --- | --- |
| anaemia | Hb 118 g/L, ferritin 18 µg/L | 8 | `action-required` |
| glycaemic-control | HbA1c 55 mmol/mol | 12 | `action-required` |
| smoking | current smoker | 4 | `action-required` |
| others | none | — | `optimized` / `not-applicable` |

Readiness: **optimization-required**. Every intervention fits. The plan starts
today and the list stands.

### B — the anaemia will not make it

Assessment 2026-09-01, surgery 2026-09-22. `weeksToSurgery = 3`.

| Domain | Trigger | Lead | Status | Shortfall |
| --- | --- | --- | --- | --- |
| anaemia | Hb 118 g/L, ferritin 18 µg/L, oral route | 8 | `insufficient-time` | 5 weeks |
| nutrition | MUST 2 | 3 | `action-required` | — |

Readiness: **defer-surgery**. The report says the anaemia domain is five weeks
short on the oral route — and that switching to intravenous iron drops the lead
time to four, leaving it one week short. So either the list moves by a week, or
the team accepts the risk. The nutrition intervention fits either way.

### C — already on track

Assessment 2026-09-01, surgery 2026-11-10. `weeksToSurgery = 10`.

| Domain | Trigger | Started | Lead | Status |
| --- | --- | --- | --- | --- |
| anaemia | Hb 119 g/L | IV iron given | 4 | `in-progress` |
| smoking | current smoker | cessation accepted | 4 | `in-progress` |

Readiness: **optimization-in-progress**. Nothing to start; the plan continues to
the date.

### D — no date yet

Assessment 2026-09-01, no planned surgery date. `weeksToSurgery = null`.

Every triggered domain reports `action-required` and the report states that
gating could not be applied because no surgery date is recorded. This is the
common case for a patient added to a waiting list before a date exists, and it
is why the ungated branch reports the least alarming actionable status rather
than `insufficient-time`.

## Boundary behaviour

The comparison is `weeksToSurgery >= leadTime`, so a domain with a four-week
lead time is satisfied at exactly four weeks and fails at three. `weeksToSurgery`
uses `floor`, so 27 days is 3 weeks, not 3.9. Both boundaries are asserted on
each side in the engine's test suite; see `grader.test.ts`.

A surgery date **before** the assessment date yields a negative
`weeksToSurgery`, which fails every lead time and marks every triggered domain
`insufficient-time`. That is the correct reading of a data-entry error or of an
assessment done after the fact, and the report shows the negative value rather
than hiding it.
