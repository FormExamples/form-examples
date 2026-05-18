# Architecture Decision Record — Reference Documentation

Background reading and template references for the ADR form.

- Tyree, J. and Akerman, A., "Architecture Decisions: Demystifying
  Architecture", *IEEE Software*, March/April 2005.
  The original Tyree & Akerman paper that defines the 14-section template.
- joelparkerhenderson/architecture-decision-record (GitHub) — canonical
  open-source collection of ADR templates including the Tyree & Akerman
  variant: <https://github.com/joelparkerhenderson/architecture-decision-record>
- Nygard, M. "Documenting Architecture Decisions" (2011) — the lighter
  alternative template, used for comparison.
- ISO/IEC/IEEE 42010:2022 — Software, systems and enterprise architecture
  description. Provides the formal framework into which an ADR fits.

This directory holds copies of, or links to, those references. The
authoritative content lives upstream.

## Example ADR

[`0001-use-tyree-and-akerman-template.md`](0001-use-tyree-and-akerman-template.md)
documents why this form uses Tyree & Akerman as its data model. It is
written in the same Markdown format the form emits via `buildMarkdown`,
so it serves as a test fixture for the HTML form's
"Import .md" feature — round-tripping it produces a populated wizard.
