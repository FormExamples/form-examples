# Allergy Skin Test Request

A UK NHS–aligned **allergy testing request (referral)** that a clinician
completes to request allergy diagnostic testing — skin-prick testing,
intradermal testing, patch testing, specific-IgE blood testing, or a
drug-provocation challenge — for a patient with suspected allergic disease. It
records the requested test type, the allergen panels of interest, the clinical
indication and specific question, the relevant clinical history, and the
validity-and-safety history (antihistamines, beta-blockers, active skin disease,
prior anaphylaxis) — then computes a **four-axis grading** (appropriateness,
validity and safety, request completeness, and triage priority) plus a set of
safety-critical flags. The output is a vetting report that supports the allergy
service's triage and booking decision.

This form is the allergy-diagnostics counterpart to the repository's other
clinician-driven request forms. It is completed by an allergist-immunologist,
GP, dermatologist, hospital doctor, or nurse rather than by the patient, and is
aligned with BSACI and EAACI skin-test and specific-IgE guidance — including the
requirement to withhold antihistamines for an appropriate washout before skin
testing.

## Scope and intended users

- **Setting:** NHS allergy clinic, immunology service, dermatology clinic,
  general practice, or hospital outpatient / inpatient referral.
- **Users:** allergist-immunologists, GPs, dermatologists, hospital doctors,
  and nurses who raise or vet incoming requests.
- **Patients:** people with suspected food, drug, aeroallergen, venom, latex, or
  contact allergy requiring diagnostic testing.

## Scoring system

The engine grades each request on **four independent axes**, each citable to a
recognized body. Axes are orthogonal: a highly appropriate request can still be
invalid (e.g. the patient is on antihistamines), incomplete, or urgent.

| Axis | Instrument | Output |
| --- | --- | --- |
| **A. Appropriateness** | BSACI / EAACI indication match (1–9 ordinal) | usually-appropriate (7–9) / may-be-appropriate (4–6) / usually-not-appropriate (1–3) |
| **B. Validity and safety** | Antihistamine, beta-blocker, anaphylaxis, and skin-disease rules | ok / caution / contraindicated |
| **C. Request completeness** | Mandatory-field checklist; indication, clinical question, and allergen selection weighted highest | 0–100 % complete (+ missing fields) |
| **D. Triage priority** | Urgency escalation rules | routine / urgent (+ target timeframe) |

The validity-and-safety axis encodes the most important pre-analytic rule in
allergy diagnostics: **antihistamines suppress the weal-and-flare response and
invalidate skin-prick and intradermal tests**, so they must be withheld for an
appropriate washout (typically five half-lives) before testing. A **beta-blocker
with a history of anaphylaxis** raises a caution because adrenaline may be less
effective if a systemic reaction occurs during testing. **Active skin disease**
at the test site (eczema, dermographism) can invalidate or distort the result.

### Test types, allergen panels, and indications

| Test type | Typical use |
| --- | --- |
| Skin-prick test | First-line for IgE-mediated food, aeroallergen, venom, latex allergy |
| Intradermal test | Drug and venom allergy when skin-prick is negative |
| Patch test | Delayed-type contact dermatitis (contact allergens) |
| Specific-IgE blood | When skin testing is unsafe / invalid (antihistamines, skin disease, anaphylaxis risk) |
| Drug-provocation challenge | Gold standard for confirming / excluding drug allergy, supervised setting |

| Allergen panel | Examples |
| --- | --- |
| Aeroallergens | Pollens, house dust mite, animal dander, moulds |
| Food | Milk, egg, peanut, tree nut, fish, shellfish, wheat, soy |
| Drug | Beta-lactams, NSAIDs, perioperative agents |
| Venom | Bee, wasp / Vespula venom |
| Latex | Natural rubber latex |
| Contact | Nickel, fragrances, preservatives (patch-test series) |

| Primary indication | Notes |
| --- | --- |
| Suspected food allergy | Skin-prick / specific-IgE first-line |
| Suspected drug allergy | Skin / intradermal / provocation; specialist setting |
| Rhinitis / asthma | Aeroallergen skin-prick / specific-IgE |
| Anaphylaxis investigation | Identify trigger; resuscitation-ready |
| Venom allergy | Skin-prick then intradermal; specific-IgE |
| Contact dermatitis | Patch testing |
| Urticaria | Targeted testing only where a trigger is suspected |

## Wizard steps

Completed in order on a single-page wizard.

| # | Step | Key fields |
| --- | --- | --- |
| 1 | Requesting clinician | name, role, registration body + number, contact, supervising consultant, referral date |
| 2 | Patient identification | NHS number, name, DOB |
| 3 | Requested test | test type, allergen panels (aeroallergens, food, drug, venom, latex, contact) |
| 4 | Clinical indication | primary indication, specific clinical question, clinical details / history |
| 5 | Validity and safety | previous anaphylaxis, on antihistamines, on beta-blocker, active skin disease |
| 6 | Triage and logistics | urgency, requested-by date, site, setting, notes |
| 7 | Review and submit | computed four-axis grade, flags, recommendation |

## Safety flags

Computed independently of the axes. Priority: high / medium / low. Categories:
previous-anaphylaxis-resus-ready, antihistamines-invalidate-test,
beta-blocker-caution, active-skin-disease, missing-indication,
missing-clinical-details, no-allergen-selected, other.

## Output

- **HTML report preview** and downloadable **PDF**.
- **FHIR R5 Bundle** exportable for integration with hospital EHR / LIMS.
- **XML** representation for archival or legacy import.
- Import and export via JSON, XML, CSV, and TSV.

## Directory structure

```
allergy-skin-test-request/
  index.md                          # this file
  AGENTS.md                         # agent instructions
  plan.md                           # implementation roadmap
  tasks.md                          # task tracking
  spec.md                           # living spec (generated from index.md)
  CHANGELOG.md                      # per-form changelog
  doc/                              # clinical reference documentation
  examples/                         # filled-form JSON fixture + FHIR R5 Bundle
  sql/                   # PostgreSQL migrations (source of truth)
  xml/              # XML + DTD per SQL table (generated)
  fhir/r5/                          # FHIR HL7 R5 JSON per SQL entity (generated)
  protobuf/                         # Protocol Buffers schemas (generated)
  openapi/                          # OpenAPI 3.1 specs (generated)
  front-end-with-html/         # single-page HTML wizard
  front-end-with-svelte/       # SvelteKit single-page wizard
  front-end-with-html/    # vetting dashboard (HTML table)
  front-end-with-svelte/  # vetting dashboard (SVAR Grid)
  back-end-with-loco/               # Rust axum + Loco JSON API
  back-end-with-loco-setup          # scaffold generator (generated)
```

## Clinical references

- BSACI *Standard Operating Procedure for skin-prick testing* (adult and
  paediatric); antihistamines and tricyclic antidepressants suppress the
  weal-and-flare response and must be withheld before testing.
  <https://www.bsaci.org/wp-content/uploads/2019/12/paedSPTnew.pdf>
- BSACI *Guidelines for the management of drug allergy* (skin, intradermal, and
  drug-provocation testing).
  <https://onlinelibrary.wiley.com/doi/full/10.1111/j.1365-2222.2008.03155.x>
- BSACI *Guidelines for the management of allergic and non-allergic rhinitis*
  (aeroallergen testing). <https://pmc.ncbi.nlm.nih.gov/articles/PMC7162111/>
- EAACI *Guidelines: Anaphylaxis (2021 update)* — beta-blockers and anaphylaxis
  management. <https://onlinelibrary.wiley.com/doi/10.1111/all.15032>
- EAACI / ENDA *Position paper on drug provocation testing* (2024).
  <https://onlinelibrary.wiley.com/doi/full/10.1111/all.15996>
- WAO *Risk and safety requirements for diagnostic and therapeutic procedures
  in allergology* — beta-blocker relative contraindication, resuscitation
  readiness. <https://pmc.ncbi.nlm.nih.gov/articles/PMC5062928/>

## Compliance

- MDCG 2019-11 Rev.1 (EU MDR Software Classification) — clinical decision
  support, Class IIa where output drives triage / test selection.
- UK Medical Devices Regulations 2002.
- ISO/IEC/IEEE 26514:2022.
- UK MHRA *Software and AI as a Medical Device*.
- NHS Data Security and Protection Toolkit.

## Verify

```sh
bin/test-form allergy-skin-test-request
```
