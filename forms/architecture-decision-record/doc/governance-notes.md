# Governance notes — ADR implementation

## Purpose

ADRs are the system of record for architecturally significant
decisions. The implementation supports:

- A linear, append-only collection of ADRs per project.
- A structured front-end form for capturing a new ADR.
- A dashboard listing ADRs by status, date, and superseding-chain.

## Conformance to ISO/IEC/IEEE 42010:2022

ISO/IEC/IEEE 42010:2022 ("Systems and software engineering —
Architecture description") defines:

- **Architecture Decision** as a first-class element of an Architecture
  Description.
- **Architecture Description** as a work product expressing an
  architecture.

This implementation models each ADR as an Architecture Decision element
and the collection as an Architecture Description.

- Standard page: <https://www.iso.org/standard/74393.html>

## Conformance to arc42

Where used alongside arc42, ADRs are referenced from arc42 section 9
("Architectural Decisions"). The arc42 document remains the
human-readable architecture overview; ADRs remain the per-decision log.

- arc42 home: <https://arc42.org/>
- arc42 documentation: <https://docs.arc42.org/>

## Immutability

Once an ADR is accepted:

- The Context, Decision, and Consequences sections are immutable.
- The Status section is the only editable field, and only to record
  deprecation or supersession.
- The audit log captures every transition with author, timestamp, and
  rationale.

## Version control

ADRs live in the repository alongside the code they govern, so that
checking out a historical commit gives the architecture as it was at
that time. This implementation also persists ADRs in a structured store
to enable cross-project queries.

## Access control

ADRs are typically internal-organisation documents. The implementation
supports:

- Per-project read/write roles.
- Public-by-default mode for open-source projects.
- Optional redaction for ADRs that reference confidential third-party
  systems.

## Out of scope

- Automated linting of decision content (this is a documentation
  question, not a software-architecture one).
- Cross-decision dependency analysis (left to project-specific tools).
- Generation of ADRs from chat transcripts.

## References

- Michael Nygard — "Documenting Architecture Decisions" (2011).
  <https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions>
- adr.github.io. <https://adr.github.io/>
- ISO/IEC/IEEE 42010:2022. <https://www.iso.org/standard/74393.html>
- arc42 template. <https://arc42.org/>
