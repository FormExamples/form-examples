# United States Birth Certificate Application — SvelteKit front-end

Agent instructions for this directory. See the form root [`../index.md`](../index.md), [`../AGENTS.md`](../AGENTS.md) and the shared conventions in [`../../AGENTS-front-end-svelte.md`](../../AGENTS-front-end-svelte.md).

- Routes live under `src/routes/united-states-birth-certificate-application/` (welcome page, `united-states-birth-certificate-applications` dashboard, `[id]` wizard, `[id]/report`, report PDF endpoint).
- The wizard is one continuous single page of six step components (`Step1Applicant` to `Step6Declaration`) in `src/lib/components/steps/`.
- Keep the engine in `src/lib/engine/` pure; `createDefaultApplication()` stays in `defaults.ts`. A change to a state rule is made in `birth-rules.ts` and in the HTML `js/rules.js`, then the spec and personas are updated.
- Gate: `pnpm run check`, `pnpm exec vitest run`, `pnpm run lint`, `pnpm run format:check`.
