# arc42 Template — Overview

arc42 is a pragmatic, lightweight software architecture documentation template
created by Gernot Starke and Peter Hruschka. It organizes documentation into
12 numbered sections that together cover every aspect of a software system,
from business goals to operational risks. The template is open-source
(Creative Commons) and widely used across Europe; it is the native format
targeted by this form's AsciiDoc export.

Source: <https://arc42.org/overview>.

## Twelve sections

| # | AsciiDoc file | Section | Summary |
| --- | --- | --- | --- |
| 1 | `01_introduction_and_goals.adoc` | Introduction and Goals | States the system purpose, lists up to five prioritized quality goals, and names the key stakeholders together with their expectations and concerns. |
| 2 | `02_architecture_constraints.adoc` | Constraints | Records technical constraints (mandated technologies, platforms), organizational constraints (budget, team size, timelines, regulations), and conventions (coding standards, tooling choices, processes). |
| 3 | `03_context_and_scope.adoc` | Context and Scope | Defines the system boundary via a business context (external actors and their interfaces) and a technical context (channels, protocols, data formats). |
| 4 | `04_solution_strategy.adoc` | Solution Strategy | Summarizes the fundamental technology decisions, the top-level decomposition approach, and how the strategy addresses the most important quality goals. |
| 5 | `05_building_block_view.adoc` | Building Block View | Decomposes the system into building blocks, showing responsibilities and interfaces at one or more nesting levels (whitebox / blackbox). |
| 6 | `06_runtime_view.adoc` | Runtime View | Illustrates important runtime scenarios — primary use cases, error/exception paths, and operational flows — showing how building blocks collaborate. |
| 7 | `07_deployment_view.adoc` | Deployment View | Describes the infrastructure environments, maps building blocks to deployment nodes, and documents SLAs or scaling approaches. |
| 8 | `08_crosscutting_concepts.adoc` | Crosscutting Concepts | Documents patterns, principles, or models that apply across multiple building blocks: domain models, UX patterns, security concepts, operational patterns. |
| 9 | `09_architecture_decisions.adoc` | Architectural Decisions | An ADR log of significant decisions, each with title, status, context, decision, and consequences. |
| 10 | `10_quality_requirements.adoc` | Quality Requirements | A quality tree and a set of quality scenarios (source + stimulus + artifact + response + measurable criterion) that operationalize the quality goals from section 1. |
| 11 | `11_risks_and_technical_debt.adoc` | Risks and Technical Debt | A prioritized risk table (probability, impact, mitigation) and a technical-debt register. |
| 12 | `12_glossary.adoc` | Glossary | Definitions of domain terms and technical/architecture terms used throughout the document. |

## AsciiDoc filename pattern

arc42's native tooling (arc42-template on GitHub, docToolchain) expects
one file per section named `NN_section_name.adoc`:

```
01_introduction_and_goals.adoc
02_architecture_constraints.adoc
03_context_and_scope.adoc
04_solution_strategy.adoc
05_building_block_view.adoc
06_runtime_view.adoc
07_deployment_view.adoc
08_crosscutting_concepts.adoc
09_architecture_decisions.adoc
10_quality_requirements.adoc
11_risks_and_technical_debt.adoc
12_glossary.adoc
```

This form's AsciiDoc export (via `asciidoc-builder.ts`) produces exactly this
layout, plus an `index.adoc` that includes all twelve files.

## References

- arc42 overview: <https://arc42.org/overview>
- arc42 template: <https://arc42.org/template>
- Starke, G. & Hruschka, P. arc42 template. Creative Commons licence.
- Starke, G. *Effective Software Architectures: A Practical Guide*. 9th ed.,
  Hanser, 2023.
