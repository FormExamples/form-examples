# International Patient Summary — front-end (SvelteKit)

SvelteKit 2 + Svelte 5 runes + Tailwind CSS 4 + SVAR DataGrid. Vitest for unit tests.

Consolidated front-end for the International Patient Summary (IPS): a single
continuous wizard at `/international-patient-summaries/[id]` and a clinician
dashboard at `/international-patient-summaries/`. The shared completeness
validation engine (ISO 27269 / HL7 FHIR IPS IG) grades each summary as
Complete, Partial, or Incomplete and powers both surfaces.

See parent [`../index.md`](../index.md) for the full form specification.
