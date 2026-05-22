# Documentation — Agent Instructions

This directory contains the regulatory and clinical reference material
that drives the HIPAA-authorization validity engine.

Every file is plain Markdown. Update the relevant Markdown file whenever
the corresponding rule in `validation-rules.ts` or
`sensitive-category-rules.ts` is added or modified.

## Files

- `index.md` — overview (also rendered as `README.md`)
- `hipaa-privacy-rule.md` — quotes the canonical 45 CFR § 164.508 text
- `sensitive-categories.md` — federal and state-specific sensitive
  categories
- `state-templates.md` — cross-walk to TN HS-2557, PA DHS, HHS-OCR
  sample
- `validation-rules.md` — rule table consumed by reviewers when
  authoring or auditing the validity engine
