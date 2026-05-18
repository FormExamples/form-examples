# International Certificate of Vaccination or Prophylaxis — Agent Instructions

WHO model certificate ("yellow card") used under the **International Health
Regulations 2005, Annex 6** to record vaccinations or prophylactic treatments
required for international travel. Issued by an authorised vaccination centre,
signed by hand by a supervising clinician, and validated by the centre's
uniform stamp.

See [`index.md`](./index.md) for the full design, the 8-step wizard table, and
the validation rules.

## Directory map

- `./index.md` — project overview and field tables
- `./AGENTS.md` — this file (referenced by `CLAUDE.md`)
- `./plan.md` — development roadmap and status
- `./tasks.md` — task tracking
- `./doc/` — WHO / CDC / IHR reference documentation
- `./sql-migrations/` — Liquibase-formatted Postgres schema
- `./xml-representations/` — generated XML + DTD per SQL table
- `./fhir-r5/` — generated FHIR HL7 R5 JSON per SQL entity
- `./protobuf/` — generated Protocol Buffers schemas per SQL entity
- `./typespec/` — TypeSpec API definitions
- `./front-end-form-with-html/` — static single-page HTML wizard
- `./front-end-form-with-svelte/` — SvelteKit single-page wizard
- `./front-end-dashboard-with-html/` — review dashboard (HTML table)
- `./front-end-dashboard-with-svelte/` — SvelteKit SVAR DataGrid dashboard
- `./full-stack-with-loco-tera-htmx-alpine/` — Rust backend with HTMX UI
- `./full-stack-with-loco-tera-htmx-alpine-setup` — Loco scaffold generator

## Domain model

Five top-level entities:

- `patient` — the vaccinee (traveller)
- `clinician` — the supervising clinician who signs each vaccination entry
- `center` — the WHO-designated administering vaccination centre with the
  uniform stamp
- `international_certificate_of_vaccination_or_prophylaxis` — the certificate
  itself, one row per vaccinee per certificate
- `international_certificate_of_vaccination_or_prophylaxis_entry` — one row
  per disease entry on a certificate (a single certificate may carry multiple
  vaccinations)

The `_entry` table holds: disease, vaccine, date of vaccination, validity
start, validity end, manufacturer, batch number, clinician signature image,
clinician professional status, centre stamp image, optional medical waiver.

## Validation engine

- **Input shape:** `Certificate` TypeScript type containing the vaccinee
  identity, centre, supervising clinician, and a `VaccinationEntry[]`.
- **Output shape:**
  ```ts
  validateCertificate(data: Certificate): {
    validityComputedAt: string;     // ISO 8601 UTC
    overallValid: boolean;
    firedRules: FiredRule[];        // VAL001..VAL012
    warnings: Warning[];
    perEntryValidity: {
      entryId: string;
      validFrom: string;
      validUntil: string | 'lifetime';
    }[];
  }
  ```
- **Algorithm:** deterministic rule evaluation in a fixed order; severity
  hierarchy `error > warning > info`. `overallValid` is `true` when no rule
  with `severity = 'error'` fires.
- **Engine files:** `types.ts`, `utils.ts`, `validation-rules.ts`,
  `validity-dates.ts`, `lifetime-override.ts`, `report-builder.ts`.
- **Tests:** `validation-rules.test.ts`, `validity-dates.test.ts`.

## Form-specific rules

- The supervising clinician's signature on each entry must be **handwritten**.
  Reject typed names or stamped signatures (VAL006).
- The centre stamp is the **WHO-designated uniform stamp**; record an image of
  the stamp and the centre identifier (VAL007).
- For **yellow fever**, automatically compute `validFrom = vaccinationDate +
  10 days` (VAL003) and set `validUntil = 'lifetime'` unless the operator
  explicitly enters an end date (VAL004).
- The certificate must be issued in English **and** in French, plus the
  issuing country's official language (VAL012). The Tera and Svelte templates
  expose `lang` slots for the secondary language.
- The medical waiver is a free-text reason plus the clinician's electronic
  signature; destination countries may reject it.

## Conventions

- Empty string `''` for unanswered text / enum fields.
- `null` for unanswered numeric fields and unrecorded dates.
- camelCase property names in TypeScript.
- snake_case in SQL and Rust.
- Step components named `StepNName.svelte` (1-indexed).
- UI components in `src/lib/components/ui/`.
- `serde(rename_all = "camelCase")` on Rust structs shared with the front-end.
- UUIDv4 primary keys; `created_at` + `updated_at` + `deleted_at` timestamps
  on every table.
- ISO 8601 timestamps in UTC.
- ISO 3166-1 alpha-3 country codes (the WHO model uses the three-letter form).
- Disease codes: `yellow-fever`, `polio`, `smallpox`, `cholera`,
  `meningococcal`, `covid-19`, `other`.

## Front-end SvelteKit stack

- SvelteKit 2.x + TypeScript
- Svelte 5 runes (`$state`, `$derived`, `$bindable`, `$props`)
- Tailwind CSS 4 with `@import 'tailwindcss'` and `@theme`
- `pdfmake` for client-side PDF rendering of the two-page certificate
- Vitest for engine unit tests
- Dynamic step route `/certificate/[step=step]/+page.svelte` with the `step`
  param matcher validating 1–8.

## Dashboard stack

- SvelteKit + SVAR DataGrid (`@svar-ui/svelte-grid`) with the Willow theme.
- Sortable columns, dropdown filters (disease, validity status, centre).
- One row per certificate, with an expandable row revealing the entries.

## Backend stack

- Rust edition 2024
- Loco 0.16 framework on axum 0.8
- SeaORM 1.1 with PostgreSQL
- Tera templates with HTMX 2.0.8 and Alpine.js 3.14.8
- `serde(rename_all = "camelCase")` for front-end interop
- `printpdf` or `pdfmake-rs` for server-side PDF rendering

## Clinical and regulatory grounding

- WHO. *International Health Regulations (2005), Third Edition*, Annex 6.
- WHO. *Model International Certificate of Vaccination or Prophylaxis*, 2007.
- CDC. *International Certificate of Vaccination or Prophylaxis (ICVP)*.
  <https://wwwnc.cdc.gov/travel/page/icvp>.
- WHO. *Vaccines and vaccination against yellow fever: WHO Position Paper*,
  June 2013.
- WHO. *Yellow fever vaccination booster not needed* (2014) — basis for the
  2016 IHR amendment that made yellow fever vaccination lifetime-valid.

## Compliance

- MDCG 2019-11 Rev.1 (EU MDR Software Classification).
- UK Medical Devices Regulations 2002.
- ISO/IEC/IEEE 26514:2022.
- UK MHRA Software and AI as a Medical Device.

## Verify

```sh
bin/test-form international-certificate-of-vaccination-or-prophylaxis
```
