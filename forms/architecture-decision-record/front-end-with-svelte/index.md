# Front-end Form (SvelteKit)

SvelteKit 2 + Svelte 5 runes + Tailwind 4 implementation of the ADR
wizard for the Tyree & Akerman 14-section template.

## Stack

- SvelteKit 2.x with the `auto` adapter
- Svelte 5 runes (`$state`, `$derived`, `$props`)
- Tailwind 4 via `@tailwindcss/vite`
- TypeScript strict mode
- `svelte-check` for type and accessibility validation

## Structure

```
src/
  app.html, app.css, app.d.ts
  routes/
    +layout.svelte
    +page.svelte           Single-page wizard with 16 step components
    report/+page.svelte    Markdown ADR rendering
  lib/
    types.ts               AdrFormData, Author, Organization, etc.
    stores/adr.svelte.ts   Reactive store using $state
    config/steps.ts        Step metadata
    report/build-markdown.ts
    components/steps/      Step01Author.svelte … Step16Summary.svelte
```

## Run

```sh
pnpm install
pnpm dev
```
