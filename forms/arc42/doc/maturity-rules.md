# Maturity Rules

Coaching rules fired by the scoring engine when a section falls below the
expected completeness score. Each rule names the gap and recommends the minimum
content needed to advance to the next score band.

Rules are keyed by `(sectionId, fromScore)` — they fire when the section's
observed score equals `fromScore`.

## Rule catalogue

| Rule ID | Section | From score | Coaching recommendation |
| --- | --- | --- | --- |
| MR-S1-0 | 1 Introduction and goals | 0 | Add a brief system-purpose statement, then list at least 3 quality goals (each with a measurable criterion) and a stakeholder table with name, role, and concerns. |
| MR-S1-1 | 1 Introduction and goals | 1 | Expand quality goals to 3 with measurable acceptance criteria and add a stakeholder table with at least 3 entries. |
| MR-S1-2 | 1 Introduction and goals | 2 | Ensure every quality goal has a concrete, testable criterion and every stakeholder has documented concerns. |
| MR-S2-0 | 2 Constraints | 0 | Identify at least one technical constraint (mandated technology), one organisational constraint (budget, team, regulation), and one convention (coding standard, process). |
| MR-S2-1 | 2 Constraints | 1 | Populate all three constraint categories: technical, organisational, and conventions. |
| MR-S2-2 | 2 Constraints | 2 | Complete the under-populated constraint category with specific, concrete items. |
| MR-S3-0 | 3 Context and scope | 0 | Create a business context diagram or table listing external actors and their interfaces, then add a technical context table with channels, protocols, and data formats. |
| MR-S3-1 | 3 Context and scope | 1 | Add the missing context view (business or technical) with its actors/channels and interface descriptions. |
| MR-S3-2 | 3 Context and scope | 2 | Complete the incomplete context view by adding protocol details, data formats, or missing actors. |
| MR-S4-0 | 4 Solution strategy | 0 | State the key technology decisions, describe the top-level decomposition approach, and explain how the strategy addresses the top quality goals. |
| MR-S4-1 | 4 Solution strategy | 1 | Add the decomposition approach and link the strategy to the top 3 quality goals from section 1. |
| MR-S4-2 | 4 Solution strategy | 2 | Add explicit traceability from each technology decision to the quality goal it addresses. |
| MR-S5-0 | 5 Building block view | 0 | Draw or describe a level-1 whitebox diagram listing the top-level building blocks and their responsibilities. |
| MR-S5-1 | 5 Building block view | 1 | Add a responsibility description for each level-1 block and a level-2 decomposition for the most complex block. |
| MR-S5-2 | 5 Building block view | 2 | Add at least one level-2 decomposition for a non-trivial building block. |
| MR-S6-0 | 6 Runtime view | 0 | Document at least one runtime scenario as a sequence or flow showing how the building blocks collaborate. |
| MR-S6-1 | 6 Runtime view | 1 | Add a second scenario covering a different scenario type (error/exception or operational). |
| MR-S6-2 | 6 Runtime view | 2 | Add the missing scenario type (primary use case, error/exception, or operational). |
| MR-S7-0 | 7 Deployment view | 0 | Describe the infrastructure environment and add a deployment diagram or table showing where each component runs. |
| MR-S7-1 | 7 Deployment view | 1 | Add a deployment diagram and document the SLA or scaling approach. |
| MR-S7-2 | 7 Deployment view | 2 | Complete the deployment view with SLA targets, scaling approach, or missing infrastructure tiers. |
| MR-S8-0 | 8 Cross-cutting concepts | 0 | Document at least one cross-cutting concept: a domain model, a UX pattern, or a security/operational principle. |
| MR-S8-1 | 8 Cross-cutting concepts | 1 | Add concepts covering at least two of the three categories: domain/data, UX/UI, and safety/security/ops. |
| MR-S8-2 | 8 Cross-cutting concepts | 2 | Add the missing cross-cutting concept category. |
| MR-S9-0 | 9 Architectural decisions | 0 | Create an ADR log with at least 3 records in a consistent format (context, decision, consequences, status). |
| MR-S9-1 | 9 Architectural decisions | 1 | Expand ADRs to at least 3, use a consistent format, and set a status on each. |
| MR-S9-2 | 9 Architectural decisions | 2 | Add at least one ADR that explicitly documents a rejected alternative and the rationale for rejection. |
| MR-S10-0 | 10 Quality requirements | 0 | Build a quality tree and document at least 3 quality scenarios with stimulus, system response, and measurable criterion. |
| MR-S10-1 | 10 Quality requirements | 1 | Expand quality scenarios to at least 3 with measurable criteria linked to the quality goals in section 1. |
| MR-S10-2 | 10 Quality requirements | 2 | Ensure each quality scenario has a measurable acceptance criterion and is linked to a quality goal. |
| MR-S11-0 | 11 Risks and technical debt | 0 | Create a risk table (risk, probability, impact, mitigation) with at least 3 entries and a technical-debt register. |
| MR-S11-1 | 11 Risks and technical debt | 1 | Structure risks into a table with probability, impact, and mitigation columns and add a technical-debt register. |
| MR-S11-2 | 11 Risks and technical debt | 2 | Add the technical-debt register or complete the risk priority ordering. |
| MR-S12-0 | 12 Glossary | 0 | Define at least 5 domain terms and 3 technical/architecture terms, each with a concise, unambiguous definition. |
| MR-S12-1 | 12 Glossary | 1 | Expand the glossary to at least 5 domain terms and 3 technical terms. |
| MR-S12-2 | 12 Glossary | 2 | Ensure all terms have clear, unambiguous definitions covering both domain and technical vocabulary. |

## Maturity-band coaching

When the overall maturity is below Optimised, the following band-level coaching
is surfaced in addition to the per-section rules:

| Maturity | Coaching |
| --- | --- |
| Draft | Focus on sections 1, 3, 5, and 9 (goals, context, building blocks, decisions). These four sections give the highest return on documentation investment. |
| Developing | Prioritise the sections with a score of 0 or 1. Target the top-three gaps returned by the engine. |
| Established | Fill the remaining partial sections (score 2) and set a calendar reminder to review in 90 days. |
| Optimised | Schedule a 6-month review cycle. Ensure the ADR log is updated whenever a significant decision changes. |
