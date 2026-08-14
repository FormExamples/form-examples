# Documentation

Guides for the medical-forms monorepo. Start with the root
[`README.md`](../README.md) for the what, [`spec.md`](../spec.md) for the
system contract, and [`CONTRIBUTING.md`](../CONTRIBUTING.md) for how to work in
the repo.

## Guides

- [Architecture](architecture.md) — the big picture; pointer to the full
  [arc42](../arc42/) architecture document.
- [Data model](data-model.md) — the per-form relational schema, shared
  `patient`/`clinician` entities, grading tables, and conventions.
- [Generator pipeline](generator-pipeline.md) — how SQL becomes XML, FHIR R5,
  Protocol Buffers, OpenAPI, and the Loco setup script.
- [Scoring engines](scoring-engines.md) — the pure grading-engine pattern and
  how the HTML, Svelte, and Rust implementations stay in agreement.
- [Lily Design System](lily.md) — the headless HTML and Svelte UI contracts and
  the sync/refactor/status tooling.
- [Back end](back-end.md) — the Rust + axum + Loco JSON API, one crate per form.
- [Verification](verification.md) — every gate and what it proves.
- [Internationalization](i18n.md) — the message-extraction pattern and the
  English/Welsh pilot.
- [Tools reference](tools.md) — generated reference for every `bin/` tool.

## Tutorials

Hands-on, runnable walkthroughs live in [`tutorials/`](tutorials/):

1. [Quickstart](tutorials/01-quickstart.md) — run one form locally (HTML,
   Svelte, and the Loco API).
2. [Build a new form](tutorials/02-new-form.md) — end to end with a worked
   example.
3. [Author a scoring engine](tutorials/03-scoring-engine.md).
4. [The generator pipeline](tutorials/04-generator-pipeline.md).
5. [Consume the API](tutorials/05-consume-the-api.md).
6. [Customize Lily](tutorials/06-lily.md).

Every command in these tutorials points at a real `bin/` tool or `forms/`
path; `bin/test-tutorials` is a fast static check that fails if any tutorial
references a tool or path that no longer exists (doc rot).
