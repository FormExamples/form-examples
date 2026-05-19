# fhir-r5/ — Agent Instructions

Generated FHIR HL7 R5 JSON per SQL entity, plus a fit-note `Bundle`. Re-run
the generator after any change to `../sql-migrations/`.

```sh
bin/fhir-r5/generate-fhir-r5-representations.py united-kingdom-statement-of-fitness-for-work
```

Each file is a sample resource showing a single representative row with
realistic placeholder values. FHIR identifiers use NHS Digital systems
where applicable (NHS number, GMC, NMC, HCPC, GPhC, SNOMED CT).

See [`./index.md`](./index.md) for the resource mapping.
