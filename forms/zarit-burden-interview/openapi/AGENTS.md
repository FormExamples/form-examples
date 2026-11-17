# Zarit Burden Interview (ZBI) — OpenAPI representations

Agent instructions for this directory. OpenAPI 3.1 `.yaml` specifications for the Zarit Burden Interview (ZBI) form, generated per SQL entity. Do not hand-edit; re-run `bin/openapi/generate-openapi-representations.py`.

## Specification Driven Development

**The `spec/` directory is the source of truth.** 
- Before doing anything read all files inside the `spec/` directory using your file-reading tools.
- Treat all files inside `spec/` as strict requirements. Where any file disagrees with the spec, the spec wins: fix the file, or change the spec on purpose and bring the other files into line in the same commit. 
- Do not improvise structure, style, or citation practice.

## More
See the form root [`../AGENTS.md`](../AGENTS.md) for the form-wide conventions and the repo root [`../../AGENTS.md`](../../AGENTS.md) for the system-wide tooling.
