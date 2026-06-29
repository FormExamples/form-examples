# United States HIPAA Authorization Form — front-end (SvelteKit)

SvelteKit 2 + Svelte 5 runes + Tailwind CSS 4. Vitest for unit tests.

A single continuous nine-step authorization wizard (patient identification,
signer, disclosing source, recipient, records to disclose, purpose, expiration,
patient-rights acknowledgements, signature & witness) plus a SVAR DataGrid
review dashboard. A pure rule-based engine validates every HIPAA core element
(45 CFR § 164.508(c)(1)) and required statement (§ 164.508(c)(2)), applies the
sensitive-category rules (42 CFR Part 2, HIV/AIDS, mental-health, psychotherapy
notes, VA § 7332), and returns a `valid` / `invalid` status with fired rules,
additional flags, and a completeness percentage.

See parent [`../index.md`](../index.md) for the full domain specification.

## Run

```sh
pnpm install
pnpm dev       # dev server
pnpm check     # svelte-check (0 errors, 0 warnings)
pnpm build     # production build
pnpm exec vitest run   # engine unit tests
```
