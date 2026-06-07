# Completion protocol — issue tracker

## Fields

| Field | Required | Notes |
| --- | --- | --- |
| Title | yes | one-line imperative noun phrase |
| Type | yes | bug \| task \| story \| epic \| incident \| problem \| change \| service-request |
| Severity | yes | critical \| high \| medium \| low |
| Priority | yes | P1 \| P2 \| P3 \| P4 |
| Reporter | yes | user submitting the issue |
| Assignee | optional | user accountable for resolution |
| Component / area | optional | controlled vocabulary per project |
| Description | yes | what, why, expected vs actual |
| Steps to reproduce | bug only | minimal repro |
| Environment | bug / incident | software version, OS, browser, region |
| Attachments | optional | screenshots, logs, traces |
| Linked issues | optional | duplicate-of, blocks, blocked-by, related-to |
| SLA clock | derived | starts at "triaged" |

## States and transitions

The canonical state machine is:

```
new → triaged → in-progress → in-review → done
                    ↘ blocked ↗
                    ↘ wont-fix
                    ↘ duplicate-of(NN)
```

Allowed transitions:

- `new → triaged | duplicate-of | wont-fix`
- `triaged → in-progress | blocked | wont-fix`
- `in-progress → in-review | blocked | wont-fix`
- `in-review → done | in-progress`
- `blocked → in-progress | wont-fix`
- `done → ` (terminal; reopening creates a new issue linked
  "regression-of")

Every transition records actor, timestamp, optional comment.

## Severity rubric

| Severity | Examples |
| --- | --- |
| Critical | production outage; security breach; data corruption affecting many users |
| High | major user-visible bug, no workaround; degraded performance |
| Medium | functional bug with workaround; documentation gap |
| Low | typo; cosmetic UI alignment; unclear log message |

## Priority rubric (SLA-bearing)

| Priority | First response | Resolution |
| --- | --- | --- |
| P1 | 15 minutes | 4 hours |
| P2 | 1 business hour | 1 business day |
| P3 | 1 business day | 5 business days |
| P4 | 5 business days | best-effort |

(These are example targets to be tuned per project; the implementation
allows per-project SLA overrides.)

## Triage protocol

Triage decides Type, Severity, Priority, Component, Assignee. Triage is
performed by the on-call engineer or a triage rota. ITIL 4 requires
that the triage decision is captured with a timestamp and rationale.

Triage outputs:

- Issue accepted → state `triaged`, SLA clock starts.
- Issue duplicate → state `duplicate-of(NN)`, no SLA clock.
- Issue cannot reproduce → returned to reporter for more info.
- Issue out of scope → state `wont-fix` with explanation.

## Incident management additions (ITIL / SRE)

For Type=incident:

- An **incident commander** is named.
- A **status page** entry is updated at every transition.
- A **post-incident review** record is required before close, capturing
  contributing factors, what went well, what went badly, action items.
- Action items become linked issues.

Reference: Google SRE Workbook — incident response.
<https://sre.google/workbook/incident-response/>

## Anti-patterns

- Closing an issue without recording a Resolution category.
- Reopening a closed issue (use "regression-of" instead).
- Editing description silently — the implementation preserves the
  history.
- Bumping priority without rationale.
