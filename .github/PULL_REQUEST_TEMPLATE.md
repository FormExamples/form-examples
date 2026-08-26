## What this changes

<!-- One paragraph. If it changes a form, name the slug(s). -->

## Checklist

- [ ] **Spec first**: if this changes behaviour or a data shape, the spec
      changed in this same PR (`spec.md`, `spec/`, or the form's
      `spec/index.md`) — see the golden rule in
      [CONTRIBUTING.md](../blob/main/CONTRIBUTING.md).
- [ ] **Generated artefacts regenerated, never hand-edited** (XML, FHIR,
      protobuf, OpenAPI, `schema.sql`, `deny.toml`, `llms.txt`, setup
      scripts, `forms.tsv`, `docs/tools.md`).
- [ ] **Verify gates pass locally** (the Verify list in
      [CONTRIBUTING.md](../blob/main/CONTRIBUTING.md)); none were weakened
      to make something pass.
- [ ] **Uniformity preserved**: a change to one form that should apply to
      all of them is rolled out to all of them, with its `--check` gate.
- [ ] **CHANGELOG updated** — the affected form's `CHANGELOG.md`, and the
      root one for repository-level change.

## AI disclosure

Per [AI_STATEMENT.md §10](../blob/main/AI_STATEMENT.md): if any content here
is **ai-generated**, say so below — which tool, and what it did. Disclosure
lives here in the PR description, never in commit trailers. You remain
responsible for the submission in full: understood, explained on request,
tested, and honest.

<!-- e.g. "Claude Code generated the SQL migrations and step components;
     I reviewed, adjusted the grading bands, and wrote the spec." -->
