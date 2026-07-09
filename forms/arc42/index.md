# arc42

A structured documentation wizard for [arc42](https://arc42.org/overview),
the pragmatic template for software architecture communication. One form
instance captures one architecture's documentation across arc42's twelve
canonical sections; the form computes a per-section completeness grade,
a composite **maturity band** (Draft / Reviewable / Ready / Mature),
and a set of fired flags for architecturally critical omissions. Output
is a signed arc42 document in HTML, PDF, AsciiDoc, FHIR R5 Bundle, and XML.

This is a non-clinical reference form. It demonstrates that the
`forms/` monorepo pattern — single-page wizard, structured schema,
scoring engine, multi-format report — generalises beyond medical
assessments.

## 12-step wizard

| # | Step | Key fields |
| --- | --- | --- |
| 1 | Introduction & Goals | introduction, business goals (≤5), quality goals (≤5: name + priority + scenario), stakeholders (≤8: name + role + concerns) |
| 2 | Constraints | technical (≤8), organizational (≤5), conventions (≤8) |
| 3 | Context & Scope | business context + partners (≤8), technical context + interfaces (≤8) |
| 4 | Solution Strategy | strategy summary, technology decisions (≤6), top-level decomposition, quality strategies (≤5) |
| 5 | Building Block View | overview, building blocks (≤12, one nesting level) |
| 6 | Runtime View | overview, runtime scenarios (≤8) |
| 7 | Deployment View | overview, deployment nodes (≤10) |
| 8 | Crosscutting Concepts | overview, concepts (≤10) |
| 9 | Architectural Decisions | ADRs (≤15: title, status, context, decision, consequences) |
| 10 | Quality Requirements | tree summary, quality scenarios (≤10: source, stimulus, artifact, response, measure) |
| 11 | Risks & Technical Debt | risks + debt (≤10: kind, probability, impact, mitigation) |
| 12 | Summary, Maturity & Sign-off | glossary terms (≤25), computed maturity, fired rules, flags, override + reason, signature |

## Scoring

- **Completeness per section:** `empty` / `partial` / `complete`.
- **Composite maturity (max-grade):** Draft / Reviewable / Ready / Mature.
- **Flags:** high / medium / low priority, fire independently of the
  maturity band.
- **Override:** author may override the computed maturity at step 12 with a
  documented reason. Both computed and final maturity are stored.

## Output

- HTML preview + PDF (via `pdfmake`).
- AsciiDoc bundle in arc42's native format (one file per section).
- FHIR R5 Bundle (`Questionnaire`, `QuestionnaireResponse`, `Composition`).
- XML + DTD per SQL entity.

## Directory structure

```
arc42/
  index.md
  AGENTS.md
  plan.md
  tasks.md
  doc/                                              # arc42 + grading docs
  sql/                                   # Liquibase Postgres migrations
  xml-representations/                              # generated XML + DTD
  fhir-r5/                                          # generated FHIR R5 JSON
  front-end-form-with-svelte/                       # SvelteKit 12-step wizard
  front-end-form-with-html/                         # placeholder (follow-up session)
  front-end-dashboard-with-html/                    # placeholder
  front-end-dashboard-with-svelte/                  # placeholder
  back-end-with-loco/            # placeholder
```

## References

- arc42 overview: <https://arc42.org/overview>
- arc42 template: <https://arc42.org/template>
- ADR pattern: <https://adr.github.io/>

## Verify

```sh
bin/test-form arc42
```
