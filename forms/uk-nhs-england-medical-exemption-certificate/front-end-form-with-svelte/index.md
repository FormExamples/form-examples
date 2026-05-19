# SvelteKit form — UK NHS England Medical Exemption Certificate (FP92A)

Single-page 10-step wizard that captures the FP92A data set and runs the
NHSBSA eligibility grading engine entirely client-side. Built with SvelteKit
2, Svelte 5 runes, Tailwind CSS 4, and Vite 7.

The form must be one continuous single-page wizard — no multi-page routing.

## Run

```sh
pnpm install
pnpm run dev
```

Then open <http://localhost:5173>.

## Test

```sh
pnpm run check
pnpm run test
```

## Steps

1. Practitioner identification
2. Patient identification
3. Existing exemption check
4. Age-based exclusion check
5. Pregnancy / maternity check
6. Qualifying condition selection (one or more of the ten NHSBSA conditions)
7. Qualifying condition detail (per-condition diagnosis & treatment)
8. Disability / appliance attestation
9. Practitioner declaration
10. Summary, eligibility result &amp; sign-off
