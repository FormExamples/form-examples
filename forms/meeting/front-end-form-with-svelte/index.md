# Meeting — Front-end Form (SvelteKit)

SvelteKit 2.x + Svelte 5 single-page wizard for the meeting form. Renders
the 10 steps described in the top-level [`index.md`](../index.md) using
runes (`$state`, `$derived`, `$bindable`, `$props`) and the Tailwind CSS 4
`@theme` token system. Step components live in
`src/lib/components/steps/` as `StepNName.svelte`; the validation engine
lives in `src/lib/validateMeeting.ts` and is unit-tested with Vitest.

Routing uses a dynamic `/meeting/[step=step]/+page.svelte` with a `step`
param matcher that validates the integer range 1–10. The wizard is still
a single continuous page — the dynamic route only scrolls into view; it
does not unmount earlier steps.

See the sibling [`AGENTS.md`](./AGENTS.md) for agent instructions and
[`plan.md`](./plan.md) for the implementation roadmap.
