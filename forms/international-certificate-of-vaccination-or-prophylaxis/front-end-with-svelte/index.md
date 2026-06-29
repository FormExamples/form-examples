# ICVP — SvelteKit data-entry wizard

SvelteKit 2 + Svelte 5 + TypeScript + Tailwind 4 single-page wizard that
captures all eight steps of the WHO **International Certificate of
Vaccination or Prophylaxis** and produces a validation report plus a PDF
download.

## Stack

- SvelteKit 2.x
- Svelte 5 runes (`$state`, `$derived`, `$bindable`, `$props`, `$effect`)
- TypeScript strict
- Tailwind CSS 4 (`@import "tailwindcss";`, `@theme`)
- `pdfmake` for client-side PDF generation
- Vitest for engine unit tests

## Directory structure

```
src/
├── app.css                              # Tailwind entry + custom theme
├── app.html                             # HTML shell
├── app.d.ts                             # App type declarations
├── params/
│   └── step.ts                          # Route matcher 1-8
├── lib/
│   ├── engine/
│   │   ├── types.ts
│   │   ├── validation-rules.ts
│   │   ├── validity-dates.ts
│   │   ├── lifetime-override.ts
│   │   ├── report-builder.ts
│   │   └── validation-rules.test.ts
│   ├── config/steps.ts
│   ├── stores/certificate.svelte.ts
│   ├── components/
│   │   ├── ui/
│   │   └── steps/Step01..Step08
│   └── report/pdf-builder.ts
└── routes/
    ├── +layout.svelte
    ├── +page.svelte
    ├── certificate/[step=step]/+page.svelte
    └── report/
        ├── +page.svelte
        └── pdf/+server.ts
```

## Running

```sh
pnpm install
pnpm run dev
```

Open <http://localhost:5173> and step through the wizard.

## Testing

```sh
npx vitest run
```
