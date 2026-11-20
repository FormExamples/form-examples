# UK LPA for Health and Care Decisions — SvelteKit wizard

SvelteKit 2 + Svelte 5 + TypeScript + Tailwind 4 single-page wizard that
captures every LP1H statutory field across 14 steps, runs the
`calculateLpaValidity()` engine, raises statutory rule violations and
ambiguity flags, and generates an OPG-ready PDF.

## Stack

- SvelteKit 2.x
- Svelte 5 runes (`$state`, `$derived`, `$bindable`, `$props`, `$effect`)
- TypeScript strict
- Tailwind CSS 4 (`@import 'tailwindcss'`, `@theme`)
- `pdfmake` for OPG-ready PDF generation
- Vitest for engine unit tests
- ESLint + Prettier

## Directory structure (planned)

```
src/
├── app.css
├── app.html
├── app.d.ts
├── params/
│   └── step.ts                          # route matcher 1-14
├── lib/
│   ├── engine/
│   │   ├── types.ts
│   │   ├── utils.ts
│   │   ├── donor-rules.ts
│   │   ├── attorney-rules.ts
│   │   ├── certificate-provider-rules.ts
│   │   ├── signature-order-rules.ts
│   │   ├── instruction-rules.ts
│   │   ├── composite-validator.ts
│   │   ├── flagged-issues.ts
│   │   └── composite-validator.test.ts
│   ├── config/steps.ts                  # 14-step definitions
│   ├── stores/lpa.svelte.ts             # reactive store via $state
│   ├── components/
│   │   ├── ui/
│   │   └── steps/Step01..Step14
│   └── report/pdf-builder.ts
└── routes/
    ├── +layout.svelte
    ├── +page.svelte
    ├── lpa/[step=step]/+page.svelte
    └── report/
        ├── +page.svelte
        └── pdf/+server.ts
```

## Running

```sh
pnpm install
pnpm dev
```

Open `http://localhost:5173` and step through the wizard.

## Testing

```sh
pnpm exec vitest run
```
