# Architectural Decision Records

Reference for the ADR format used in step 9 of the arc42 documentation wizard.

## Format

Each ADR captures one significant architectural decision with five fields:

| Field | Description |
| --- | --- |
| **Title** | Short, present-tense label identifying the decision (e.g. "Use PostgreSQL as the primary database"). |
| **Status** | Lifecycle state: `draft` / `proposed` / `accepted` / `deprecated` / `superseded`. |
| **Context** | The situation, forces, constraints, or problem that motivated the decision. |
| **Decision** | What was decided, stated in an active, present-tense sentence: "We will …". |
| **Consequences** | What becomes easier or harder as a result; positive, negative, and neutral trade-offs accepted. |

## Status lifecycle

| Status | Meaning |
| --- | --- |
| `draft` | Being written; not yet ready for review. |
| `proposed` | Under discussion; not yet accepted. |
| `accepted` | Decision is in effect. |
| `deprecated` | No longer relevant; context has changed. |
| `superseded` | Replaced by a later ADR; link to the superseding record. |

Note: the `complete` threshold for section 9 requires ≥3 ADRs with status
**≠ `draft`** (i.e. at least `proposed`, `accepted`, `deprecated`, or
`superseded`). See `completeness-rules.md`.

## References

- ADR GitHub organisation and MADR format: <https://adr.github.io/>
- Nygard, M. "Documenting Architecture Decisions." *Cognitect Blog*, 2011.
  <https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions>.
