# Architecture — Medical Forms monorepo (arc42)

This is the architecture documentation for the **Medical Forms** monorepo,
following the [arc42](https://arc42.org/) template. It describes a repository of
**286 uniform, full-stack medical and administrative form projects** whose one
shared design — schema, validation pattern, accessibility contract, scoring
engine layout, and generation pipeline — is proven across more than a hundred
distinct clinical and administrative domains.

Read this alongside the two primary sources of truth it summarises:

- Root [`README.md`](../README.md) — the *what*.
- Root [`spec.md`](../spec.md) — the *system contract* (spec-driven development).
- Root [`AGENTS.md`](../AGENTS.md) and the per-stack docs in [`AGENTS/`](../AGENTS/)
  and [`forms/AGENTS-*.md`](../forms/) — the *how* of each stack.

Where this document and the specs disagree, the specs win: this is a
navigational overview, not a second contract.

## Table of contents

| #  | Section | Contents |
| -- | ------- | -------- |
| 1  | [Introduction and Goals](01-introduction-and-goals.md) | What the system is; quality goals; stakeholders |
| 2  | [Architecture Constraints](02-architecture-constraints.md) | Spec-driven workflow, generated-never-edited, tech + regulatory constraints |
| 3  | [Context and Scope](03-context-and-scope.md) | Business and technical context; external standards |
| 4  | [Solution Strategy](04-solution-strategy.md) | "One shared design, N domains"; the generation pipeline; verification-as-contract |
| 5  | [Building Block View](05-building-block-view.md) | The per-form directory as the building block; the `bin/` toolchain; one form decomposed |
| 6  | [Runtime View](06-runtime-view.md) | Wizard → scoring engine → report; JSON-API request flow; the generator run |
| 7  | [Deployment View](07-deployment-view.md) | Deployment out of scope today; the intended shape |
| 8  | [Cross-cutting Concepts](08-cross-cutting-concepts.md) | Data model, Lily, generation, accessibility, import/export, spec-driven dev |
| 9  | [Architecture Decisions](09-architecture-decisions.md) | ADRs: relational schema, route layout, HTML consolidation, observability, SQL as source of truth |
| 10 | [Quality Requirements](10-quality-requirements.md) | Quality tree; concrete scenarios |
| 11 | [Risks and Technical Debt](11-risks-and-technical-debt.md) | Accessibility palette debt, CI breadth, i18n, deployment/auth |
| 12 | [Glossary](12-glossary.md) | Lily, Loco, FHIR R5, grading engine, drift gate, slug, … |

## About arc42

arc42 answers twelve questions about a software architecture, from goals
(section 1) to vocabulary (section 12). The template is deliberately crisp and
diagram-friendly; each section here stays focused and uses a
[Mermaid](https://mermaid.js.org/) diagram only where a picture earns its place
(context, building blocks, runtime, pipeline).
