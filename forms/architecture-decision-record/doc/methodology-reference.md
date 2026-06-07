# Methodology reference — Architecture Decision Records

An **Architecture Decision Record (ADR)** is a short, immutable document
that captures one architecturally significant decision, the context in
which it was made, the alternatives considered, and the consequences.

## Origin

Michael Nygard introduced ADRs in his 2011 blog post
**"Documenting Architecture Decisions"**:
<https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions>

The post proposes a deliberately minimal template (five sections) that
records each decision in version control alongside the source code.

## Canonical reference

The community-maintained reference is **adr.github.io**:
<https://adr.github.io/>

It lists multiple template variants, tooling (`adr-tools`, `log4brains`,
`adr-manager`, etc.), and case studies. The GitHub organisation
"joelparkerhenderson/architecture-decision-record" provides a popular
template library mirrored at
<https://github.com/joelparkerhenderson/architecture-decision-record>.

## Nygard template (five sections)

A Nygard ADR contains:

1. **Title** — short noun phrase; numbered (e.g. `0001-record-architecture-decisions`).
2. **Status** — proposed, accepted, deprecated, superseded by [link].
3. **Context** — the forces in play: technological, political,
   organisational, business.
4. **Decision** — the decision and its justification.
5. **Consequences** — positive, negative, and neutral outcomes.

## Other widely-cited templates

| Template | Notable features |
| --- | --- |
| **MADR** (Markdown ADR) — <https://adr.github.io/madr/> | Adds explicit *Considered Options* and *Pros / Cons* per option |
| **Tyree & Akerman 2005** — IBM Systems Journal, "Architecture Decisions: Demystifying Architecture" | Heavyweight: assumptions, constraints, positions, argument, implications, related decisions |
| **Y-statement** (Olaf Zimmermann) — <https://medium.com/@docsoc/architecture-decision-records-adrs-aef0c4dba83> | "In the context of X, facing concern Y, we decided for option Z because…" |

The repository ADR `0001-use-tyree-and-akerman-template.md` already
records this implementation's choice of template.

## Lifecycle

ADRs are **append-only**. A decision that turns out to be wrong is not
edited or deleted; instead a new ADR is created with status "accepted"
that supersedes the old, and the old ADR's status is updated to
"superseded by ADR-NNNN".

This makes the ADR set a true historical record of architectural intent.

## Relationship to ISO/IEC/IEEE 42010

ISO/IEC/IEEE 42010:2022 "Systems and software engineering — Architecture
description" defines a conceptual model in which Architecture Decisions
are first-class architectural elements, recorded as part of the
Architecture Description. ADRs are a lightweight implementation of that
model.

- Standard page: <https://www.iso.org/standard/74393.html>

## Relationship to arc42

The arc42 architecture template includes a dedicated section **9.
Architectural Decisions**. arc42 recommends maintaining the bulk of
decisions as ADRs and only summarising the most architecturally
significant in section 9.

- arc42 home: <https://arc42.org/>
- arc42 section 9: <https://docs.arc42.org/section-9/>
