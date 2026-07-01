# Anion Gap Calculator — Agent Instructions

Point-of-care calculator for the serum anion gap and its albumin-corrected
value from a routine electrolyte panel, collected via a single continuous
single-page wizard. Computes `anionGap = (Na + K) − (Cl + HCO₃)` (or
`Na − (Cl + HCO₃)` when potassium is omitted), corrects for albumin
(`+ 0.25 × (40 − albumin)`), and classifies the result as low / normal / high /
very-high, flagging a high anion gap for a HAGMA differential (GOLDMARK /
MUDPILES).

See [`index.md`](./index.md) for the full design and the assessment-step table,
and [`spec/index.md`](./spec/index.md) for the living domain spec.

## Directory map

- `./index.md` — project overview
- `./AGENTS.md` — this file (referenced by `CLAUDE.md`)
- `./spec/` — living domain spec (`index.md` + `README.md` symlink)
- `./plan.md` — development roadmap and status
- `./tasks.md` — task tracking
- `./doc/` — clinical reference documentation (anion gap, albumin correction)
- `./sql/` — Liquibase-formatted PostgreSQL schema (source of truth)
- `./xml/` — generated XML + DTD per SQL table
- `./fhir/` — generated FHIR HL7 R5 JSON per SQL entity
- `./protobuf/` — generated Protocol Buffers `.proto` schemas
- `./openapi/` — generated OpenAPI 3.1 specifications
- `./front-end-with-html/` — consolidated HTML wizard + dashboard (Lily)
- `./front-end-with-svelte/` — consolidated SvelteKit wizard + dashboard (Lily)
- `./back-end-with-loco/` — Rust axum + Loco JSON API

## Calculation engine

- **Input shape:** `AnionGapCalculation` TypeScript type — the electrolyte and
  albumin inputs plus context and identification fields.
- **Output shape:**
  ```ts
  calculateAnionGap(data: AnionGapCalculation): {
    includesPotassium: boolean;
    anionGap: number | null;
    correctedAnionGap: number | null;
    normalLow: number;
    normalHigh: number;
    classificationValue: number | null;
    classificationBand: 'low' | 'normal' | 'high' | 'very-high' | null;
    flaggedIssues: FlaggedIssue[];
  }
  ```
- **Algorithm:** pure formula (see spec §4). Potassium presence selects the
  formula and the reference upper bound (16 with K, 12 without); albumin enables
  the correction `+ 0.25 × (40 − albumin)`; classification uses the corrected
  gap when available, otherwise the raw gap.
  - `anionGap = (sodium + potassium) − (chloride + bicarbonate)` (with K)
  - `anionGap = sodium − (chloride + bicarbonate)` (without K)
  - `correctedAnionGap = anionGap + 0.25 × (40 − albumin)`
  - band: `>= 20` very-high, `> normalHigh` high, `< 8` low, else normal
- **Engine files:** `types.ts`, `utils.ts`, `anion-gap-rules.ts`,
  `anion-gap-calculator.ts`, `flagged-issues.ts`.
- **Tests:** `anion-gap-calculator.test.ts`, `anion-gap-rules.test.ts` — cover
  both formulae, the albumin correction, each classification boundary (7/8,
  12/13, 16/17, 19/20), and the hypoalbuminaemia-masking case.

## Flagged issues

Computed independently of the band (see spec §5): very high anion gap
(`>= 20`, urgent), high anion gap (`> normalHigh`, high), hypoalbuminaemia
masking a raised gap (raw normal but corrected high, high), low anion gap
(`< 8`, medium), incomplete calculation (any required electrolyte missing, low).

## Conventions

- Empty string `''` for unanswered text / enum fields.
- `null` for unanswered numeric, date, and time fields.
- camelCase property names in TypeScript and front-end Rust serde.
- snake_case in SQL and Rust internals.
- Step components named `StepNName.svelte` (1-indexed).
- UI components in `src/lib/components/ui/`.
- `serde(rename_all = "camelCase")` on Rust structs shared with the front-end.
- UUIDv4 primary keys via `gen_random_uuid()`.
- `created_at`, `updated_at`, `deleted_at` timestamps on every table.
- Import and export via JSON, XML, CSV, and TSV.
- Generated artefacts (XML, FHIR, protobuf, OpenAPI, Loco setup) are never
  hand-edited.

## Clinical grounding

- Kraut J.A., Madias N.E. Serum anion gap: its uses and limitations.
  *Clin J Am Soc Nephrol* 2007; 2(1):162–174.
- Figge J. *et al.* Anion gap and hypoalbuminemia. *Crit Care Med* 1998;
  26(11):1807–1810.
- Mehta A.N. *et al.* GOLD MARK: an anion gap mnemonic for the 21st century.
  *Lancet* 2008; 372(9642):892.

## Compliance

- MDCG 2019-11 Rev.1 (EU MDR/IVDR Software Classification).
- UK Medical Devices Regulations 2002.
- ISO/IEC/IEEE 26514:2022.
- UK MHRA *Software and AI as a Medical Device.*

## Verify

```sh
bin/test-form anion-gap-calculator
```
