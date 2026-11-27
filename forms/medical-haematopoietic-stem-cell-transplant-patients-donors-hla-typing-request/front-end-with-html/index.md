# Medical Haematopoietic Stem Cell Transplant Patients/Donors HLA Typing Request: HTML front-end (form + dashboard)

Agent instructions for this directory. See the form root [`../index.md`](../index.md) and [`../AGENTS.md`](../AGENTS.md). Lily Design System headless conventions: [`../../AGENTS-front-end-html.md`](../../AGENTS-front-end-html.md).

- `js/types.js`: `emptyRequest()` (the source of truth for every other front-end) and `SAMPLE_REQUIREMENTS`, the tube volumes per role (local policy).
- `js/rules.js`, `js/flags.js`, `js/grader.js`: the four-axis engine. Turnaround targets are local policy (`TARGETS`).
- `js/form-app.js`: the eight-section wizard. `examples/personas.json` is verified by `bin/test-personas`.

Keep this front-end generic: no health service, laboratory or regional names in form text. (The vendored theme catalogue is fleet-wide and byte-identical; leave it.)
