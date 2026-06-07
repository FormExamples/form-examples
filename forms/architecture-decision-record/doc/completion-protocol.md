# Completion protocol — ADR

This document describes the protocol for capturing an Architecture
Decision Record (ADR) in this implementation. It aligns to the Nygard
template (Michael Nygard, 2011) and Tyree & Akerman extensions.

## When to write an ADR

Write an ADR when the decision is **architecturally significant** —
i.e. its reversal would be expensive. Triggers:

- Choosing a programming language, framework, or platform.
- Introducing a new external system dependency.
- Setting a cross-cutting policy (security, observability, persistence).
- Changing a public API contract.
- Adopting or retiring a standard (e.g. FHIR R5, OpenAPI 3.1).

Do **not** write an ADR for everyday refactoring, code-style choices, or
local-scope optimisations.

## Naming

ADRs are filed as `NNNN-kebab-case-title.md`, where `NNNN` is a
zero-padded sequence number assigned at creation time and never reused.

The title is a short imperative noun phrase, e.g.
`0007-use-postgres-as-canonical-store`.

## Status lifecycle

```
proposed → accepted → (deprecated | superseded by NNNN)
```

- **proposed**: under discussion; do not implement yet.
- **accepted**: in force; treat as architectural law.
- **deprecated**: no longer recommended, but not yet replaced.
- **superseded by ADR-NNNN**: replaced by a later decision.

Status transitions are themselves edits to the front-matter of the
existing ADR — these are *the only* edits permitted to an accepted ADR.

## Sections (Nygard core)

| Section | Required? | Notes |
| --- | --- | --- |
| Title | yes | one-line noun phrase |
| Status | yes | one of the lifecycle states |
| Context | yes | forces; situation; constraints |
| Decision | yes | what we chose; why |
| Consequences | yes | positive, negative, neutral |

## Optional sections (Tyree & Akerman + MADR)

| Section | When to add |
| --- | --- |
| Assumptions | non-obvious facts taken as given |
| Considered options | when more than two were on the table |
| Pros and cons of each option | when trade-offs are subtle |
| Related decisions | links to other ADRs |
| References | links to external standards, papers, RFCs |

## Workflow

1. Author opens a pull request adding the new ADR with status `proposed`.
2. Discussion happens on the PR (the ADR repo is the system of record;
   chat threads are ephemeral and may not be cited).
3. When consensus is reached, the author updates the status to
   `accepted` and merges.
4. If subsequent work renders the decision wrong or obsolete:
   - author a new ADR superseding the old;
   - in the old ADR, change status to `superseded by ADR-NNNN`.

## Anti-patterns

- **Editing the Decision after acceptance** — instead, write a new
  superseding ADR.
- **Single-author ADRs with no review** — defeats the consensus purpose.
- **Generic "use cloud" titles** — ADR titles must name the concrete
  choice.
- **ADRs without consequences** — every decision has trade-offs; record
  them.

## References

- Michael Nygard — "Documenting Architecture Decisions" (2011).
  <https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions>
- MADR template — <https://adr.github.io/madr/>
- adr.github.io — <https://adr.github.io/>
- Tyree, Akerman — "Architecture Decisions: Demystifying Architecture",
  IBM Systems Journal 45(4) 2005.
