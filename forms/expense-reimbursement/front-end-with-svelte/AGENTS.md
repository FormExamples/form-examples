# Expense Reimbursement — front-end-with-svelte/

SvelteKit + Lily Design System front-end for the expense reimbursement claim: a
single continuous six-section wizard (worker, approver, claim, expenses,
repayment, declaration) that grades the claim on three axes — policy compliance,
completeness and approval tier — plus fraud-prevention flags.

Routes are nested under `src/routes/expense-reimbursement/` (served at
`/expense-reimbursement/`): a welcome page, `/expense-reimbursements` (claims
dashboard), and `/expense-reimbursements/[id]` (+ `/report`; `new` is a fresh
draft).

The engine in `src/lib/engine/` mirrors the HTML front-end's `js/` engine;
rule and flag IDs are shared verbatim across the HTML, Svelte and Axum stacks.
`createDefaultClaim()` lives in `engine/defaults.ts`, not the store, because the
store imports `$app/env`, which Vitest cannot resolve.

```sh
pnpm install && pnpm run lint && pnpm run format:check && pnpm run check && pnpm run build && pnpm exec vitest run
```
