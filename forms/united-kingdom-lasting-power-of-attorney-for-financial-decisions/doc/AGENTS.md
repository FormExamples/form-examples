# UK LPA for Financial Decisions — Documentation Agent Instructions

Reference documentation for the LP1F lasting power of attorney. Place
material that supports the validator and the front-end here: statutory
citations, OPG procedural notes, field maps, glossary entries, and any
legal context not captured in the parent `../index.md`.

## Scope

- Source of truth for the rule catalogue, the field-level LP12 Guide
  cross-references, and the OPG registration workflow.
- Companion to (not replacement for) the LP1F PDF in
  `../20260420-LPA-Finance-Complete-Pack/`.

## Style

- Terse, factual, table-heavy.
- Every legal claim carries a citation: `MCA 2005 s. 9(2)(a)` or
  `LPA Regs 2007 reg. 8(1)` or `LP12 Guide part A4`. Mark uncertain
  citations `(approximate)`.
- Statutory section numbers refer to the Mental Capacity Act 2005 (c. 9)
  and the Lasting Powers of Attorney, Enduring Powers of Attorney and
  Public Guardian Regulations 2007 (SI 2007/1253), as amended.
- No emojis. No legal advice — descriptive only.
- File names are kebab-case and descriptive
  (`lpa-validation-rules.md`, `glossary.md`).

## Index file

`index.md` is the entry point for this directory. When you add a new
reference document, link it from `index.md` with a one-paragraph
summary.

## Verify

```sh
bin/test-form united-kingdom-lasting-power-of-attorney-for-financial-decisions
```
