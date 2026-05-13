# Maturity Rules

Composite maturity band algorithm and fired-flag inventory for the arc42
documentation scoring engine.

## Composite maturity bands

The engine assigns one of four maturity bands using a **max-grade** (ceiling)
algorithm: the overall band is the highest band whose driver conditions are
all satisfied.

| Band | Driver |
| --- | --- |
| Draft | Any section is `empty`. |
| Reviewable | All sections are ≥ `partial`, but ≥1 section is still `partial`. |
| Ready | All sections are `complete` and no high-priority flags are fired. |
| Mature | Ready + zero medium-priority flags + ≥5 ADRs with status ≠ `draft` + ≥3 quality scenarios fully populated + ≥3 risk items with mitigation. |

The author may override the computed maturity at step 12 with a documented
reason. Both `computedMaturity` and `finalMaturity` are stored and rendered
in the report.

## Fired flags

Flags fire independently of the maturity band. They surface specific
architecturally critical omissions and are rendered in the step 12 summary.

### High priority

| Flag | Trigger |
| --- | --- |
| `no-stakeholders` | Zero stakeholder entries |
| `no-quality-goals` | Zero quality goal entries |
| `no-architectural-decisions` | Zero ADR entries |
| `no-risks` | Zero risk item entries |
| `no-business-context` | Business context description absent and zero business partners |
| `no-deployment-view` | Zero deployment nodes |

### Medium priority

| Flag | Trigger |
| --- | --- |
| `few-quality-goals` | Fewer than 3 quality goals |
| `few-adrs` | Fewer than 3 ADRs |
| `no-glossary` | Zero glossary terms |
| `no-runtime-scenarios` | Zero runtime scenarios |
| `no-quality-scenarios` | Zero quality scenarios |
| `no-crosscutting-concepts` | Zero crosscutting concept entries |

### Low priority

| Flag | Trigger |
| --- | --- |
| `no-introduction` | Introduction field absent or empty |
| `no-conventions` | Zero constraint items of kind `conventions` |
| `no-technical-debt` | Zero risk items of kind `debt` |
| `flat-decomposition` | ≥6 building blocks present but none have a `parent_id` set (i.e. the decomposition is flat where nesting is plausible) |
