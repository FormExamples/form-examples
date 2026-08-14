# MEDIF — SvelteKit front-end wizard

SvelteKit 2.x + Svelte 5 runes single-page wizard that digitizes the Medical
Information Form for Air Travel (MEDIF). Fourteen sections on one continuous
scrolling page collect the submitting agent, the passenger, trip details,
the attending physician's clinical evaluation, and the requested in-flight
accommodations. The application computes a fitness-to-fly band, fired rules,
and safety flags suitable for submission to an airline medical desk.

## Wizard sections

1. Submitting agent
2. Passenger identification
3. Trip details (airline, sectors, cabin class, IATA SSR codes)
4. Reason MEDIF is required
5. Attending physician
6. Diagnosis and clinical history
7. Cardiovascular fitness
8. Respiratory fitness
9. Recent events and surgery
10. Pregnancy and obstetric history
11. Communicable disease screening
12. In-flight medical requirements
13. Cabin medications and equipment
14. Summary and physician sign-off

## Outputs

- Fitness band: `fit` | `fit-with-conditions` | `requires-review` | `unfit-to-fly`
- Fired rules with rule IDs, categories, and band assignments
- Safety flags with priority (low / medium / high) and suggested action
- Airline-medical-desk recommendation text
- ISO `validUntil` date (signature date + 14 days)

## Develop

```sh
pnpm install
pnpm run dev
```

## Test

```sh
pnpm run check
pnpm run test
```
