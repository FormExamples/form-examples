# Scoring algorithm

The composite grader is a pure function of the 57 item answers. There is
no per-item weight and no respondent-specific tuning.

## Per-item answer space

Each of the 57 items has exactly four states:

| Value | Meaning | Treated as |
| --- | --- | --- |
| `yes` | The behaviour is reliably true today | Counts in the **yes** numerator and the **applicable** denominator |
| `no` | The behaviour is not reliably true today | Counts in the **applicable** denominator only |
| `not-applicable` | The item does not apply in this context | Excluded from both numerator and denominator |
| `''` (empty / unanswered) | No information yet | Excluded from both numerator and denominator |

## Per-section percentage

For each section `S` (Teams, Stakeholders, Practices):

```
applicable(S)   = yes(S) + no(S)
percent(S)      = 100 * yes(S) / applicable(S)        when applicable(S) > 0
percent(S)      = null                                when applicable(S) = 0
band(S)         = high  when percent(S) >= 75
                = mid   when percent(S) >= 50
                = low   when percent(S) <  50
                = unanswered when percent(S) is null
```

## Composite overall percent

The composite is the **unweighted mean** of the three section percentages:

```
overallPercent = mean(percent(Teams), percent(Stakeholders), percent(Practices))
```

Two guard conditions force `overallPercent = null`:

1. Any section is `unanswered` (i.e. its `applicable` is `0`).
2. Fewer than 30 of the 57 items have received any answer
   (`yes` + `no` + `not-applicable` < 30).

When `overallPercent` is null, `maturity = insufficient-data` and the
`F-INSUFFICIENT-DATA` flag fires.

## Maturity bands

| Maturity | `overallPercent` | Description |
| --- | --- | --- |
| Optimising | ≥ 90 % | Agile behaviours are pervasive; team continuously inspects and adapts |
| Mature | 75 – 89 % | High adoption with deliberate refinement; few weak sections |
| Developing | 50 – 74 % | Practices in place but uneven; one or two weak sections |
| Initial | 25 – 49 % | Partial adoption; multiple weak sections; coaching needed |
| Ad-hoc | < 25 % | Agility is largely aspirational; foundational coaching required |
| Insufficient data | n/a | < 30 items answered, or any section unanswered |

## Worked example

A team scores:

- Teams: 25 yes / 0 no / 0 n/a / 0 unanswered → 100 %
- Stakeholders: 14 yes / 0 no / 0 n/a / 0 unanswered → 100 %
- Practices: 12 yes / 6 no / 0 n/a / 0 unanswered → 67 %

```
overall = (100 + 100 + 67) / 3 = 89 %  →  MATURE
```

Section-imbalance flag fires (spread of 33 percentage points, > 30
threshold). If `p14` was set to `no`, the psychological-safety flag also
fires (any of `t22`, `s08`, `p14` = no).

## Why an unweighted mean (rather than item-level)

A per-item percentage (e.g. yes / 57) would let a strong Teams section
mask a collapsed Stakeholders section. The unweighted section mean keeps
each audience's contribution proportional, so a 100 % / 100 % / 0 % split
maps to `developing` (67 %), not `mature`, and the section-imbalance flag
makes the disparity visible.

## Determinism and idempotency

`calculate_maturity` (Rust) / `calculateMaturity` (TypeScript / vanilla
JS) is a pure function with no side effects and no I/O. The Rust and
TypeScript implementations produce **byte-identical** results for the
same input (see browser smoke tests in each front-end's `tasks.md` and
the engine unit tests in `front-end-form-with-svelte/` and
`back-end-with-loco/`).
