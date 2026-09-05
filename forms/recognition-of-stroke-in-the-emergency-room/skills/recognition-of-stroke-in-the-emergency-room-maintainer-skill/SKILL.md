---
name: recognition-of-stroke-in-the-emergency-room-maintainer-skill
description: "Implementation workflow for maintaining and extending the Recognition Of Stroke In the Emergency Room (ROSIER) form (forms/recognition-of-stroke-in-the-emergency-room/) — editing its spec, schema, or engine, regenerating derived artefacts, and running its verify gates. Use when implementing a change to this form's spec, SQL schema, front-end, back-end, or personas. For the repo-wide workflow, use form-examples-maintainer-skill instead."
---

# Recognition Of Stroke In the Emergency Room (ROSIER) — Maintainer Skill

Implementation-facing companion to `recognition-of-stroke-in-the-emergency-room-skill` (this form's end-user concepts skill) and to `form-examples-maintainer-skill` (the repo-wide maintainer skill — read that one first for the golden rule, generators, and the full verify-gate catalogue). This skill is the one-form-scoped map.

## Directory layout

`forms/recognition-of-stroke-in-the-emergency-room/` contains:

| Subdirectory | Role |
| --- | --- |
| `sql` | source of truth |
| `xml` | generated |
| `fhir` | generated |
| `protobuf` | generated |
| `openapi` | generated |
| `front-end-with-html` | HTML + Lily (wizard + dashboard) |
| `front-end-with-svelte` | SvelteKit (wizard + dashboard) |
| `back-end-with-loco` | Rust + Loco JSON API |

Generated artefacts (`xml`, `fhir`, `protobuf`, `openapi`, the Loco setup script, `CHANGELOG.md`, `examples/assessment.json`) are never hand-edited — regenerate them instead; see the tool catalogue in [`/AGENTS.md`](../../../../AGENTS.md).

## Scoring engine

- **Input shape:** `RosierAssessment` TypeScript type — the two mimic criteria,
  five neurological-sign inputs, the blood-glucose precondition, plus context
  and identification fields.
- **Output shape:**
  ```ts
  gradeRosier(data: RosierAssessment): {
    rosierScore: number;          // -2..+5
    band: 'stroke-unlikely' | 'stroke-likely';
    firedCriteria: FiredCriterion[];
    flaggedIssues: FlaggedIssue[];
  }
  ```
- **Algorithm:** signed additive — each mimic contributes 0 or −1, each sign
  contributes 0 or +1; the total −2..+5 determines the band (`> 0` →
  `stroke-likely`). See spec §4. The `> 0` threshold is strict (exactly 0 is
  `stroke-unlikely`).
  - loss of consciousness / syncope = yes → −1
  - seizure activity = yes → −1
  - asymmetric facial weakness = yes → +1
  - asymmetric arm weakness = yes → +1
  - asymmetric leg weakness = yes → +1
  - speech disturbance = yes → +1
  - visual field defect = yes → +1
- **Engine files:** `types.ts`, `utils.ts`, `rosier-rules.ts`,
  `rosier-grader.ts`, `flagged-issues.ts`.
- **Tests:** `rosier-grader.test.ts`, `rosier-rules.test.ts` — cover the `> 0`
  threshold boundary (total 0 vs +1), the extremes (−2 and +5), and the
  hypoglycaemia flag at glucose 3.4 / 3.5.

## Verify

```sh
bin/test-form recognition-of-stroke-in-the-emergency-room
bin/test-sql-apply recognition-of-stroke-in-the-emergency-room
bin/test-personas recognition-of-stroke-in-the-emergency-room
bin/test-e2e --html recognition-of-stroke-in-the-emergency-room
```

## See also

- [`../../AGENTS.md`](../../AGENTS.md) — this form's agent instructions.
- [`../../spec/index.md`](../../spec/index.md) — living domain spec.
- [`../../tasks.md`](../../tasks.md) — task tracking.
- [`../../../../AGENTS.md`](../../../../AGENTS.md) — repo-wide tool catalogue and verify gates.
