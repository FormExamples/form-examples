# Completion protocol — OKR tracker

## Lifecycle

1. **Draft** — owner authors the objective and proposes key results.
2. **Align** — sibling teams comment, links to parent OKRs are drawn.
3. **Commit** — leadership and owner accept the OKR set for the
   cycle.
4. **Check-in** — weekly KR progress updates by owner.
5. **Re-forecast** — at mid-cycle, KRs may be revised with leadership
   sign-off and rationale.
6. **Score** — at end-of-cycle, KRs are scored 0.0-1.0.
7. **Retrospective** — what worked, what to change next cycle.

## Fields

| Field | Required | Notes |
| --- | --- | --- |
| Cycle | yes | e.g. 2026-Q1 |
| Level | yes | company \| division \| team \| individual |
| Owner | yes | accountable person |
| Type | yes | committed \| aspirational (Google convention) |
| Objective | yes | short, ambitious, action-oriented |
| Aligned-to | optional | link to parent objective |
| Key results | 3-5 | per Doerr 2018 guideline |
| KR target value | yes per KR | numeric or boolean |
| KR baseline value | yes per KR | the value at cycle start |
| KR units | yes per KR | $, %, count, days, NPS points, etc. |
| KR owner | yes per KR | defaults to objective owner |
| Confidence | check-in | 1-5 self-rated likelihood of hitting KR |
| Status | derived | green / yellow / red from check-in confidence |
| Final score | end-of-cycle | 0.00-1.00 |
| Retrospective notes | end-of-cycle | what learned |

## Key result quality criteria

Each KR must be:

- **Measurable**: a number or a clear binary state.
- **Time-bound**: the target value applies at end of cycle.
- **Outcome, not output**: prefer "reduce checkout abandonment from
  X % to Y %" over "ship feature A".
- **Independent of other KRs**: if KR A always implies KR B, drop B.

The implementation enforces these by validating:

- target ≠ baseline (otherwise no movement is required);
- units present;
- date of measurement = end of cycle.

## Scoring rubric

| Score | Interpretation (aspirational OKRs) | Interpretation (committed OKRs) |
| --- | --- | --- |
| 1.0 | exceeded target (rare; check ambition) | exceeded; expected |
| 0.7-0.9 | green: achievement | green: marginal pass |
| 0.4-0.6 | yellow: progress; learning | yellow: fail; investigate |
| 0.0-0.3 | red: re-think | red: fail; escalate |

## Anti-patterns

- **OKR theatre**: writing OKRs at the start of the cycle and never
  checking in.
- **KR = task list**: KRs that read like jira tasks ("ship feature X")
  rather than outcomes.
- **One-line OKRs without rationale**: missing the "why".
- **Cascading OKRs verbatim**: child OKRs that copy parent text are a
  sign the alignment conversation didn't happen.
- **Stretch and committed mixed**: aspirational and committed OKRs
  should be flagged so leadership reads them differently.

## Integration

- Objectives can be linked to meetings (decisions and retros) and to
  ADRs (when an OKR commit is architecturally significant).
- KR check-ins flow into the employee 1:1 meeting record for owner /
  manager conversations.

## References

- Doerr, J. (2018). *Measure What Matters*. Portfolio.
  <https://www.whatmatters.com/>
- Klau, R. (2013). How Google sets goals: OKRs.
  <https://library.gv.com/how-google-sets-goals-okrs-a1f69b0b72c7>
- Grove, A. S. (1983). *High Output Management*. Random House.
