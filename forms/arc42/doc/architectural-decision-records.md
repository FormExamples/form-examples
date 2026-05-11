# Architectural Decision Records

Reference guide for the ADR format used in arc42 section 9.

## Format

This form uses the **Nygard format** (Michael Nygard, 2011) with a minor
extension for the status field:

```markdown
# ADR-NNN — <short title in present tense>

**Date:** YYYY-MM-DD
**Status:** proposed | accepted | superseded | deprecated

## Context

What is the situation that motivates this decision? What forces are at play?
What constraints apply?

## Decision

What was decided? State the decision in an active, present-tense sentence:
"We will …".

## Consequences

What becomes easier or harder as a result? What trade-offs are accepted?
List positive, negative, and neutral consequences.

## Alternatives considered (optional but recommended)

List the alternatives that were evaluated and the reason each was rejected.
```

## Status lifecycle

| Status | Meaning |
| --- | --- |
| `proposed` | Under discussion; not yet accepted |
| `accepted` | Decision is in effect |
| `superseded` | Replaced by a later ADR; link to the superseding record |
| `deprecated` | No longer relevant; context has changed |

## Storage

ADRs are stored in the `arc42_adr` SQL table (one row per ADR) and exposed
via the FHIR R5 `QuestionnaireResponse` extension. For human-readable
archival, they are also exported as individual markdown files in the generated
PDF report appendix.

## Scoring impact

arc42 section 9 scores 3 (Complete) only when the ADR log contains at least
3 records in a consistent format, each with a status, and at least one record
explicitly documents a rejected alternative. See `completeness-rules.md` for
the full scoring predicates.

## References

- Nygard, M. "Documenting Architecture Decisions." *Cognitect Blog*, 2011.
  <https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions>.
- Zimmermann, O. *Architectural Decision Guidance Across Projects*. WICSA, 2011.
- ADR GitHub organisation. <https://adr.github.io/>.
