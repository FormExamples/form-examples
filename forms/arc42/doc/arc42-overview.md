# arc42 Template — Overview

arc42 is a pragmatic, lightweight architecture documentation template created
by Gernot Starke and Peter Hruschka. It organises documentation into 12
numbered sections that cover every aspect of a software system from business
goals to operational risks.

## Twelve sections

| # | Section | Core question |
| --- | --- | --- |
| 1 | Introduction and goals | What is the system for? Who are the stakeholders and what do they need? |
| 2 | Constraints | What boundaries must the architecture respect — technical, organisational, or regulatory? |
| 3 | Context and scope | What are the system's external neighbours and interfaces? |
| 4 | Solution strategy | What are the fundamental decisions about technology, structure, and quality? |
| 5 | Building block view | How is the system decomposed? What are the top-level components and their responsibilities? |
| 6 | Runtime view | How do the components interact at runtime for the most important scenarios? |
| 7 | Deployment view | Where does the system run? What is the infrastructure? |
| 8 | Cross-cutting concepts | What patterns or principles apply across multiple components? |
| 9 | Architectural decisions | What significant decisions were made, and why? (ADR log) |
| 10 | Quality requirements | What are the measurable quality goals and acceptance scenarios? |
| 11 | Risks and technical debt | What could go wrong? What shortcuts were taken? |
| 12 | Glossary | What do the key domain and technical terms mean? |

## Versioning

arc42 is maintained at <https://arc42.org/>. The template is available under
the Creative Commons Attribution 4.0 International licence. This form targets
the current arc42 v8 structure.

## Relationship to other standards

- **ISO/IEC/IEEE 42010** (Recommended Practice for Architecture Description) —
  arc42 is compatible with and informally aligned to 42010; the 12 sections map
  to the standard's concerns, viewpoints, and rationale concepts.
- **C4 model** (Brown) — arc42 section 5 (building block view) and section 6
  (runtime view) are often populated using C4 context, container, component,
  and code diagrams.
- **ADR format** (Nygard) — arc42 section 9 is conventionally implemented using
  Nygard-style architectural decision records; see `architectural-decision-records.md`.

## References

- Starke, G. & Hruschka, P. arc42 template. <https://arc42.org/>.
- Starke, G. *Effective Software Architectures: A Practical Guide*. 9th ed.,
  Hanser, 2023.
- ISO/IEC/IEEE 42010:2011. *Systems and software engineering — Architecture
  description*.
