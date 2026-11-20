# United States Durable Financial Power of Attorney — plan

See [`spec/index.md`](./spec/index.md) for the contract.

## Status

All layers built 2026-11-20: docs and research, SQL, generated representations,
HTML and SvelteKit front-ends, Axum back-end, examples and personas.

## Roadmap

1. Research and spec (UPOAA, eight state rules, IRS Form 2848). Done.
2. SQL: principal, agent, main table, grade triad. Done.
3. Generated representations. Done.
4. Engine (HTML JS and Svelte TypeScript) with tests and personas. Done.
5. Front-ends. Done.
6. Axum crate. Done.
7. Later: add more states to `STATE_RULES`; re-verify rows marked secondary.
