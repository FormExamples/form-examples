---
name: agile-checklist-maintainer-skill
description: "Implementation workflow for maintaining and extending the Agile Checklist form (forms/agile-checklist/) — editing its spec, schema, or engine, regenerating derived artefacts, and running its verify gates. Use when implementing a change to this form's spec, SQL schema, front-end, back-end, or personas. For the repo-wide workflow, use form-examples-maintainer-skill instead."
---

# Agile Checklist — Maintainer Skill

Implementation-facing companion to `agile-checklist-skill` (this form's end-user concepts skill) and to `form-examples-maintainer-skill` (the repo-wide maintainer skill — read that one first for the golden rule, generators, and the full verify-gate catalogue). This skill is the one-form-scoped map.

## Directory layout

`forms/agile-checklist/` contains:

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

- **Input shape:** `AgileChecklist` TypeScript type containing the
  respondent identification block plus 57 `ItemResponse` entries
  (`{ answer: 'yes' | 'no' | 'not-applicable' | '' }`), grouped by
  section.
- **Output shape:**
  ```ts
  calculateMaturity(data: AgileChecklist): {
    answeredCount: number;            // 0..57
    teamsPercent: number | null;      // 0..100, null if section unanswered
    stakeholdersPercent: number | null;
    practicesPercent: number | null;
    overallPercent: number | null;    // unweighted mean of the three sections
    maturity: 'optimising' | 'mature' | 'developing' | 'initial'
            | 'ad-hoc' | 'insufficient-data';
    sectionBands: {
      teams: 'high' | 'mid' | 'low' | 'unanswered';
      stakeholders: 'high' | 'mid' | 'low' | 'unanswered';
      practices: 'high' | 'mid' | 'low' | 'unanswered';
    };
    firedRules: FiredRule[];
    additionalFlags: AdditionalFlag[];
  }
  ```
- **Algorithm:** per-section percentage of `yes` answers over
  applicable items (`not-applicable` excluded from denominator);
  unweighted mean of the three section percentages produces the
  composite. Thresholds in `index.md`.
- **Engine files:** `types.ts`, `factory.ts`, `items.ts` (the 57 items
  with section, ordinal, slug, text), `maturity-rules.ts`,
  `flagged-issues.ts`, `composite-grader.ts`.
- **Tests:** `composite-grader.test.ts`, `maturity-rules.test.ts`.

## Verify

```sh
bin/test-form agile-checklist
bin/test-sql-apply agile-checklist
bin/test-personas agile-checklist
bin/test-e2e --html agile-checklist
```

## See also

- [`../../AGENTS.md`](../../AGENTS.md) — this form's agent instructions.
- [`../../spec/index.md`](../../spec/index.md) — living domain spec.
- [`../../tasks.md`](../../tasks.md) — task tracking.
- [`../../../../AGENTS.md`](../../../../AGENTS.md) — repo-wide tool catalogue and verify gates.
