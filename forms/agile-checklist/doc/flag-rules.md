# Additional-flag rules

Operational flags fire **independently** of the composite maturity level.
A flag captures a specific cross-cutting risk that may not be obvious
from the headline percentage alone. Each flag is stored as a row in
`agile_checklist_grade_flag` with a stable `flag_id` and a
`triggering_items` list.

## Flag catalogue

| Flag ID | Category | Priority | Trigger predicate |
| --- | --- | --- | --- |
| `F-TEAMS-AUTONOMY` | teams-autonomy-risk | high | `percent(Teams) < 50` |
| `F-STAKEHOLDERS-TRUST` | stakeholders-trust-risk | high | `percent(Stakeholders) < 50` |
| `F-PRACTICES-DISCIPLINE` | practices-discipline-risk | high | `percent(Practices) < 50` |
| `F-SECTION-IMBALANCE` | section-imbalance | medium | `max(\|percent(i) - percent(j)\|) > 30` for any defined pair |
| `F-FINISHED-WORK` | finished-work-risk | high | `t08 = no` AND `p12 = no` |
| `F-EXPERIMENTATION-BLOCKED` | experimentation-blocked | high | `s09 = no` AND `s10 = no` |
| `F-LEARNING-STALLED` | learning-stalled | medium | `t17 = no` AND `t18 = no` |
| `F-PSYCHOLOGICAL-SAFETY` | psychological-safety-risk | high | any of `t22 = no`, `s08 = no`, `p14 = no` |
| `F-INSUFFICIENT-DATA` | insufficient-data | medium | `answeredCount < 30` |

## Why each predicate is shaped this way

### Section-level low-band risks

These are 1-to-1 with the section's `low` band, but they are surfaced as
**flags** (not just coaching rules) so the dashboard's "weak sections"
column and CSV export carry them. A team can be `mature` overall but
still have a single low section that warrants a flag.

### Section imbalance (medium)

Spread > 30 percentage points means the three audiences are moving at
very different speeds. Coaching that lifts the highest section further
will widen the gap; coaching needs to target the lowest section. Pair
threshold (30 pts) is empirical: smaller spreads are usually within
self-report noise.

### Finished-work risk (high)

`t08` ("Teams rarely wait for work to be completed by others") and `p12`
("The organization places a higher value on finished work than it does
on the number of work items in process") together describe a system
where work is **started faster than it is finished**. The fix is WIP
limits at the team or programme level; it is rarely solved by hiring or
sprinting.

### Experimentation blocked (high)

`s09` ("Stakeholders support teams in experimenting") and `s10`
("Stakeholders don't punish an unsuccessful experiment") together
describe a sponsor relationship in which no learning will happen. The
team can talk about agility forever; nothing will change without
explicit budget for experiments that may fail.

### Learning stalled (medium)

`t17` ("Teams seek to learn relevant, new skills") and `t18` ("Teams
continue to learn and improve skills") together describe a team where
capability is **decaying in real time** — yesterday's skills will not
cover next year's work. Priority is medium rather than high because the
damage is slow-acting; the operational tempo is unaffected for a quarter
or two.

### Psychological-safety risk (high, "any" predicate)

Three items map to three distinct sub-aspects of safety:

- `t22` — *within* the team: can dissenting views be expressed?
- `s08` — from *sponsors*: do they keep authority delegated when things
  get hard?
- `p14` — between *teams*: when problems arise, is the focus on solution
  rather than blame?

Any single `no` here is enough to fire the flag because safety is the
foundation under everything else. There is no "partial" safety — either
people can say uncomfortable things or they cannot.

### Insufficient data (medium)

When fewer than 30 of the 57 items are answered, the composite is
mathematically meaningful but **practically unreliable**. The
medium-priority flag asks the user to finish before relying on the
maturity result.

## Display order

The dashboard and reports list flags in priority order: high → medium →
low. Within a priority bucket the order is the order they appear in the
engine source; this is stable and deterministic but has no semantic
meaning.
