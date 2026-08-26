# Plan: Eye Prescription

## Current status

Scaffolded 2026-05-18. Design based on `seed.md` (Optical Revolution
overview of UK spectacle prescription conventions), extended to the full
monorepo stack (SQL, FHIR R5, XML, Protobuf, TypeSpec, HTML / SvelteKit
front-ends, Rust full-stack).

## Why this form exists

UK GOC-registered optometrists are legally required (Sight Testing
Regulations 1989) to issue a prescription at the end of every sight test.
The prescription must contain enough refractive detail for any GOC-
registered dispensing optician to fabricate the correct lenses. Capturing
the prescription as structured data — rather than as a paper form or a
PDF — enables: integration with the EHR via FHIR `VisionPrescription`,
side-by-side comparison of successive prescriptions, automatic detection of
adaptation-period flags, dashboard review across a practice's caseload, and
direct hand-off to an automated lens-grinding workflow.

## Design principles

- **Single-page wizard** — 11 steps on one continuous page (monorepo rule).
- **Sign-convention strictness** — minus-cylinder convention is the storage
  format. Plus-cylinder is a UI conversion, never a stored value.
- **Per-eye independence** — every refractive field exists separately for
  the right (OD) and left (OS) eye. No "OU / both" shortcut at the storage
  level — even when the values are identical they are stored twice.
- **Classification is orthogonal to complexity** — refractive class (myopia
  / hyperopia / astigmatism by severity) describes the patient; complexity
  (simple / moderate / complex) describes the prescription. Safety flags
  fire independently of either.
- **Pure scoring engine** — `classifyPrescription()` is a pure function
  with no side-effects, fully unit-tested with Vitest.
- **FHIR-first exchange** — the canonical interchange format is FHIR R5
  `VisionPrescription`; XML and Protobuf are alternative representations.
- **GOC number is mandatory** — the prescriber's GOC registration number is
  required for a legally valid prescription.
- **Expiry is computed** — default issue + 2 years; 1 year if patient age
  is < 16 or ≥ 70 on the issue date.

## Classification engine

The classification engine runs in three passes.

### Pass 1 — per-eye refractive class

For each eye, look up sphere on the myopia / hyperopia / emmetropia band
table and cylinder on the astigmatism band table. An eye may be assigned
multiple classes (e.g. moderate myopia *and* mild astigmatism).

### Pass 2 — patient-level findings

- **Anisometropia** — `|sphereOD - sphereOS|`. Threshold 2.00 D for the
  safety flag.
- **Presbyopia** — addition ≥ +0.75 D in either eye.
- **Prism present** — any non-zero prism in either eye.

### Pass 3 — complexity

The composite complexity is the worst-of:
- if any eye has high myopia / hyperopia / astigmatism → complex
- else if prism present or anisometropia > 2.00 D → complex
- else if addition present (presbyopia) → moderate
- else if any moderate myopia / hyperopia / astigmatism → moderate
- else → simple

### Safety flags

Flags fire independently of the complexity grade and are emitted as an
array of `AdditionalFlag` records. Each flag carries a stable `flag_id`,
a category (one of the 11 listed in `index.md`), a priority (low /
medium / high), a human-readable description, and a suggested action
(e.g. "consider refer to ophthalmology for retinal screening").

## Build order

1. [x] Scaffold directory via `bin/create-form`.
2. [x] Write top-level documentation: `index.md`, `AGENTS.md`, `plan.md`,
       `tasks.md`.
3. [ ] Write `doc/*.md` reference documentation.
4. [ ] Author SQL Liquibase migrations: patient, prescriber, eye_prescription,
       eye_prescription_eye, eye_prescription_visual_acuity,
       eye_prescription_pupillary_distance,
       eye_prescription_lens_recommendation,
       eye_prescription_ocular_health_finding, eye_prescription_grade,
       eye_prescription_grade_rule, eye_prescription_grade_flag.
5. [ ] Generate XML + DTD via
       `bin/xml-representations/generate-xml-representations.py`.
6. [ ] Generate FHIR R5 JSON via
       `bin/fhir-r5/generate-fhir-r5-representations.py`.
7. [ ] Generate Protobuf via
       `bin/protobuf/generate-protobuf-representations.py`.
8. [ ] Write TypeSpec API definitions.
9. [ ] Write `back-end-with-loco-setup` script
       (cargo loco generate scaffold per table).
10. [ ] Populate each subproject's AGENTS / index / plan / tasks with
        form-specific content (so each is implementation-ready).
11. [ ] Build SvelteKit front-end form (single-page 11-step wizard).
12. [ ] Build HTML front-end form (static, Alpine.js).
13. [ ] Build SvelteKit dashboard (SVAR DataGrid).
14. [ ] Build HTML dashboard (static review table).
15. [ ] Build Rust full-stack with axum / Loco JSON API.
16. [ ] Unit-test classification engine (Vitest).
17. [ ] Run `bin/test-form eye-prescription`.

## Future enhancements

- Zod runtime validation on the SvelteKit client (especially axis 1-180
  integer-only, sphere/cyl/add 0.25-step quantization).
- Plus-cylinder display toggle for US-trained prescribers.
- Side-by-side comparison view (current vs. prior prescription) with
  delta highlighting.
- Contact lens prescription form as a sibling project
  (`contact-lens-prescription/`) sharing the patient / prescriber tables.
- Automatic lens-thickness estimate from sphere, cylinder, axis, material
  (Vogel's formula).
- NHS GOS3 voucher integration for patients eligible for NHS-funded
  glasses.
- Bilingual UI (English / Cymraeg) for NHS Wales.
- Integration with NHS Digital Personal Demographics Service (PDS) for
  NHS number validation.
- DCB0129 / DCB0160 clinical safety case documentation.
- Audit log of every prescriber override.
- Electronic signature captured as SVG path plus trust-provided SSO claim.
- Direct integration with lens-grinding machines (DLM / OMA file format).
