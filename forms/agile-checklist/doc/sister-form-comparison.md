# Sister-form comparison

This form is one of two agile-adoption assessments in the monorepo.
They are designed to be **complementary** and to be run together.

## The two forms

| Form | What it measures | Scale | Items |
| --- | --- | --- | --- |
| [`agile-principles-assessment`](../../agile-principles-assessment) | The **12 principles** of the Agile Manifesto — statements of intent and belief | 1–5 Likert per principle | 12 |
| [`agile-checklist`](..) | **Concrete observable behaviours** of teams, stakeholders, and operating practices | yes / no / not-applicable per item | 57 (25 + 14 + 18) |

## Why both?

Principles and behaviours measure different things, and a team can land
in any of the four quadrants:

```
                    behaviours high       behaviours low
  principles high   healthy adoption     aspirational gap
  principles low    cargo-cult agile     pre-agile / waterfall
```

- **Healthy adoption** (high / high) — the organization believes in
  agile and acts on it. Coaching focuses on the few weak spots.
- **Aspirational gap** (high / low) — the organization *says* it values
  agility but the day-to-day reality is different. This is the most
  common failure mode and the most useful one to surface: coaching has
  to translate intent into named behaviours.
- **Cargo-cult agile** (low / high) — the organization does the rituals
  (stand-ups, retrospectives, story points) but doesn't believe in the
  underlying principles. Coaching has to address *why* before adding
  more *what*.
- **Pre-agile / waterfall** (low / low) — the organization is not
  pretending. Coaching here can be honest about whether agility is the
  right fit before investing further.

## Recommended workflow

1. Run the **principles assessment** once at the start of an engagement
   to set expectations and surface aspirational language.
2. Run the **checklist** once per quarter to track whether real
   behaviour is shifting.
3. Compare the two side by side at each cycle.

A future dashboard enhancement will overlay both forms' results by team.

## Scoring relationship

The two forms use the same maturity-level vocabulary
(`optimising` / `mature` / `developing` / `initial` / `ad-hoc` /
`insufficient-data`) but **different thresholds**:

- Principles assessment thresholds are on a 1–5 Likert mean
  (≥ 4.5 / 3.75 / 3.0 / 2.0 / < 2.0).
- Checklist thresholds are on a 0–100 percent yes (≥ 90 / 75 / 50 / 25 /
  < 25).

Bands map approximately as follows:

| Maturity | Principles mean | Checklist percent |
| --- | --- | --- |
| Optimizing | ≥ 4.50 (90% of 5) | ≥ 90 |
| Mature | ≥ 3.75 (75% of 5) | ≥ 75 |
| Developing | ≥ 3.00 (60% of 5) | ≥ 50 |
| Initial | ≥ 2.00 (40% of 5) | ≥ 25 |
| Ad-hoc | < 2.00 | < 25 |

The principles "developing" band is wider (3.0–3.74 ≈ 60–75%) than the
checklist's (50–74%). This is intentional: principles tend to score
higher than behaviours, so the bands compensate.

## Shared respondent identity

Both forms collect the same respondent fields (name, email, role, team,
organization, assessment date, period) using the same role enum. A
future dashboard can join submissions by `(respondent, team, date
window)` to show principles vs. behaviour for the same observation
point.

## Pseudonymous / anonymous comparison

Both forms support an anonymous-submission mode (in the SvelteKit form;
the static HTML form treats name/email/role as optional). The dashboard
redacts respondent name and role from anonymous rows in both CSV
exports and the rendered table.
