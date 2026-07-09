# Eye Prescription

A UK General Optical Council (GOC) aligned **spectacle prescription** as issued
by a registered optometrist or dispensing optician following a sight test.
Captures refractive correction for each eye (sphere, cylinder, axis, addition,
prism, base), pupillary distance, visual acuity, optional ocular health
findings, and lens recommendations. Computes a per-eye **refractive
classification** (emmetropia / myopia / hyperopia / astigmatism, each by
severity), a composite **prescription complexity** (simple / moderate /
complex), and a set of **safety flags** (high myopia, high astigmatism,
significant anisometropia, prism present, presbyopia, expired prescription,
paediatric, ocular pathology). Output is a signed prescription document with
validity dates suitable for handing to a lens dispenser, exporting as a FHIR
R5 `VisionPrescription` resource, or archiving as XML.

## Scope and intended users

- **Setting:** UK community optometry practice, hospital ophthalmology
  refraction clinic, dispensing optician.
- **Users:** GOC-registered optometrists (sight test + prescription) and
  GOC-registered dispensing opticians (lens recommendation).
- **Patients:** adults and children of any age requiring corrective spectacles.
- **Out of scope:** contact lens prescriptions (different fitting parameters
  including base curve and diameter), intraocular lens prescriptions, low-
  vision aids, orthoptic exercises.

## Scoring system

The prescription is graded on three orthogonal axes.

### Refractive classification (per eye)

Computed from `sphere` and `cylinder` independently for the right (OD) and
left (OS) eye.

| Class | Sphere (D) | Cylinder (D) |
| --- | --- | --- |
| Emmetropia | -0.50 to +0.50 | ≤ 0.50 |
| Low myopia | -0.75 to -3.00 | — |
| Moderate myopia | -3.25 to -6.00 | — |
| High myopia | < -6.00 | — |
| Low hyperopia | +0.75 to +2.00 | — |
| Moderate hyperopia | +2.25 to +5.00 | — |
| High hyperopia | > +5.00 | — |
| Mild astigmatism | — | 0.50 to 1.00 |
| Moderate astigmatism | — | 1.25 to 2.50 |
| High astigmatism | — | > 2.50 |
| Presbyopia | — | `addition` ≥ +0.75 |

### Prescription complexity

| Level | Drivers |
| --- | --- |
| Simple | spherical only or mild cyl, no prism, no significant anisometropia, no addition |
| Moderate | moderate sphere / cyl, includes addition, no prism, anisometropia ≤ 2 D |
| Complex | any of: high myopia / hyperopia / astigmatism, prism present, anisometropia > 2 D, or multifocal with high addition |

### Safety flags (computed independently of classification)

| Flag | Trigger |
| --- | --- |
| `high-myopia` | sphere < -6.00 D in either eye |
| `high-hyperopia` | sphere > +5.00 D in either eye |
| `high-astigmatism` | cylinder > 2.50 D in either eye |
| `anisometropia` | |sphere_OD − sphere_OS| > 2.00 D |
| `prism-present` | any non-zero prism in either eye |
| `presbyopia` | addition ≥ +0.75 D |
| `paediatric` | patient age < 16 years on issue date |
| `prescription-expired` | expiry date < today |
| `significant-change-from-prior` | sphere change > 1.00 D vs. previous prescription |
| `ocular-pathology` | any positive ocular-health finding recorded |
| `refer-ophthalmology` | clinician override flag |

## 11-step single-page wizard

Completed in order on a single continuous page. Each step is a fieldset on
the same scroll target — no multi-page form.

| # | Step | Key fields |
| --- | --- | --- |
| 1 | Prescriber identification | name, GOC registration number, role (optometrist / dispensing optician), practice name, practice address, contact email and phone |
| 2 | Patient identification | name, date of birth, sex, NHS number, address, postcode, contact |
| 3 | Examination details | date of sight test, date of issue, expiry date (default issue + 2 years; 1 year if age < 16 or ≥ 70), reason for sight test, prior prescription on file |
| 4 | Visual acuity | distance Snellen (right / left / binocular, unaided and corrected), near Snellen, pinhole VA, dominant eye |
| 5 | Right eye refraction (OD) | sphere (-30.00 to +30.00 D, 0.25 steps), cylinder (-10.00 to +10.00 D, 0.25), axis (1°–180°), prism (0.00–20.00 prism diopters), base direction (in / out / up / down) |
| 6 | Left eye refraction (OS) | same fields as step 5 |
| 7 | Addition for near | addition right and left (typically equal; +0.75 to +3.50 D, 0.25 steps); intermediate addition if specified |
| 8 | Pupillary distance | distance PD total mm, monocular right and left, near PD, segment height for bifocal / varifocal |
| 9 | Lens recommendation | prescription type (single vision distance / near / intermediate, bifocal, trifocal, varifocal, occupational), lens material (CR-39 / polycarbonate / Trivex / high-index 1.67 / high-index 1.74), coatings (anti-reflective, scratch-resistant, blue-light, photochromic, polarised), tint, UV protection |
| 10 | Ocular health findings (optional) | slit-lamp findings, fundus findings, intraocular pressure (IOP) per eye, OCT findings, cup-to-disc ratio, refractive classification per eye |
| 11 | Summary & sign-off | computed refractive classification per eye, anisometropia detection, complexity grade, safety flags, clinician notes, follow-up interval, electronic signature |

## Output

- **HTML report preview** matching the standard UK NHS / GOC prescription layout.
- **Printable PDF** via `pdfmake`.
- **FHIR R5 Bundle** exportable to EHR — primary resource is
  `VisionPrescription` linked to `Patient`, `Practitioner`, and `Encounter`.
- **XML** representation for archival.
- **Protocol Buffers** representation for cross-language integration.
- **TypeSpec** representation for API-first definition.

## Directory structure

```
eye-prescription/
  index.md                                          # this file
  AGENTS.md                                         # agent instructions
  plan.md                                           # implementation roadmap
  tasks.md                                          # task tracking
  seed.md                                           # source seed material
  doc/                                              # documentation
  sql/                                   # Liquibase Postgres migrations
  xml/                              # XML + DTD per SQL table
  fhir/r5/                                          # FHIR HL7 R5 JSON resources
  protobuf/                                         # Protocol Buffers .proto schemas
  typespec/                                         # TypeSpec API definitions
  front-end-with-html/                         # static single-page HTML wizard
  front-end-with-svelte/                       # SvelteKit single-page wizard
  front-end-with-html/                    # HTML review table
  front-end-with-svelte/                  # SvelteKit SVAR DataGrid
  back-end-with-loco/            # Rust backend + server-rendered UI
  back-end-with-loco-setup       # generator shell script
```

## Clinical references

- General Optical Council (GOC). *Standards of Practice for Optometrists and
  Dispensing Opticians* (effective April 2016, updated).
  <https://standards.optical.org/>
- Opticians Act 1989 (UK) — sight test and prescription requirements.
  <https://www.legislation.gov.uk/ukpga/1989/44/contents>
- Sale of Optical Appliances Order 1984 (SI 1984/1778).
- The Sight Testing (Examination and Prescription) (No 2) Regulations 1989
  (SI 1989/1230) — required prescription content.
- College of Optometrists. *Clinical Management Guidelines.*
  <https://www.college-optometrists.org/clinical-guidance/clinical-management-guidelines>
- HL7 FHIR R5 `VisionPrescription` resource.
  <https://hl7.org/fhir/R5/visionprescription.html>
- WHO ICD-11 chapter 09 (Diseases of the visual system) — H52 refractive
  errors.
- Optical Confederation guidance on prescription validity (NHS GOS3 form).

## Compliance

- **MDCG 2019-11 Rev.1 (EU MDR Software Classification)** — pure documentation
  of a clinician-issued prescription with rule-based classification falls
  within Class I if the output does not directly drive a treatment decision,
  Class IIa if the lens recommendation is the primary clinical output.
- **UK Medical Devices Regulations 2002.**
- **ISO/IEC/IEEE 26514:2022** — design and development of information for users.
- **UK MHRA Software and AI as a Medical Device.**
- **Opticians Act 1989** — only a GOC-registered prescriber may issue a
  prescription; the form must capture the prescriber's GOC number.
- **UK GDPR / Data Protection Act 2018** — patient identifiable data must be
  processed lawfully; NHS number is a special category identifier.

## Verify

```sh
bin/test-form eye-prescription
```
