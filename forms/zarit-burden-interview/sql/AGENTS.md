# Zarit Burden Interview (ZBI) — SQL migrations

Agent instructions for this directory. PostgreSQL migrations for the Zarit Burden Interview (ZBI) form — the source of truth for the data shape. Numbered `NN_*.sql` files plus the combined `schema.sql`.

## Specification Driven Development

**The `spec/` directory is the source of truth.** 
- Before doing anything read all files inside the `spec/` directory using your file-reading tools.
- Treat all files inside `spec/` as strict requirements. Where any file disagrees with the spec, the spec wins: fix the file, or change the spec on purpose and bring the other files into line in the same commit. 
- Do not improvise structure, style, or citation practice.

## More

See the form root [`../AGENTS.md`](../AGENTS.md) for the form-wide conventions and the repo root [`../../AGENTS.md`](../../AGENTS.md) for the system-wide tooling.
