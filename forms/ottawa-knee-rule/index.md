# Ottawa Knee Rule

A validated clinical decision rule that decides whether a **knee radiograph
(X-ray)** is needed after an acute knee injury. It records five objective
bedside criteria and applies simple **ANY-of** logic: a knee X-ray is indicated
when **at least one** criterion is present, and is **not** indicated when all
five are absent. The rule is highly sensitive for clinically significant knee
fractures, so a negative result safely rules out the need for imaging and
reduces unnecessary radiography.

This is a **classification / decision-rule** instrument. Its output is a binary
imaging decision (X-ray indicated: yes/no), **not** a numeric score or risk
percentage. Presence of any single criterion is sufficient to indicate imaging;
the criteria are not summed or weighted.

The Ottawa Knee Rule was derived and validated by Stiell *et al.* (*Annals of
Emergency Medicine* 1995; *JAMA* 1996; *BMJ* 1997). It is intended to identify,
without imaging, adult patients with acute knee trauma who do not require a
radiograph.

## Scope and intended users

- **Setting:** emergency department (ED), minor-injuries unit (MIU), urgent-care
  and walk-in centres — any setting assessing acute knee injury where selective
  radiography is appropriate.
- **Users:** doctors, emergency nurse practitioners, physiotherapy
  practitioners, paramedics, and other frontline clinicians performing bedside
  musculoskeletal assessment.
- **Patients:** adults with an **acute** knee injury (blunt trauma or twisting),
  typically presenting within 7 days.
- **Not for:** children (the Ottawa Knee Rule is validated in adults; use
  clinical judgement or a paediatric pathway), isolated superficial skin
  injuries, patients re-presenting for reassessment of a known fracture, or
  patients in whom examination is unreliable. The rule assesses the **need for
  imaging** and never diagnoses or excludes a fracture on its own.

## Scoring system

**Primary instrument:** the Ottawa Knee Rule — five criteria, each recorded as
present or absent. A knee X-ray is **indicated** when **any one or more** of the
five criteria is present.

| # | Criterion | X-ray indicated when |
| --- | --- | --- |
| 1 | Age | Age **≥ 55** years |
| 2 | Isolated patellar tenderness | Tenderness **at the patella** with **no other bony tenderness** of the knee |
| 3 | Fibular head tenderness | Tenderness **at the head of the fibula** |
| 4 | Knee flexion | **Inability to flex** the knee to **90°** |
| 5 | Weight-bearing | **Inability to bear weight** (take **4 steps**, transferring weight twice onto each leg) **both immediately after the injury and** in the ED, regardless of limping |

**Decision logic (ANY-of).**

| Condition | Decision | Recommended action |
| --- | --- | --- |
| **All five** criteria absent | **X-ray not indicated** | A knee radiograph is not required. Provide symptomatic treatment, safety-netting, and follow-up advice; re-assess if symptoms fail to settle. |
| **Any** criterion present | **X-ray indicated** | Obtain a knee radiograph series per local protocol and manage findings accordingly. |

The decision is driven by presence, not by a total: exactly one positive
criterion produces the same "X-ray indicated" decision as five. There is no
numeric score and no threshold to sum.

## Assessment steps

Completed in order on a single continuous single-page wizard. Each step records
an **objective bedside finding**.

| # | Step | Key fields |
| --- | --- | --- |
| 1 | Assessment context | assessing clinician name and role, date and time of assessment, care setting, injury mechanism and time since injury |
| 2 | Patient identification | patient identifier, sex, side of injured knee |
| 3 | Age | patient age in years → criterion 1 |
| 4 | Bony tenderness | patellar tenderness, whether it is isolated (no other bony tenderness), fibular head tenderness → criteria 2 and 3 |
| 5 | Knee flexion | able / unable to flex the knee to 90° → criterion 4 |
| 6 | Weight-bearing | able / unable to take four steps immediately after injury and in the ED → criterion 5 |
| 7 | Summary and decision | computed imaging decision (X-ray indicated yes/no), fired criteria, red-flag issues, applicability note, free-text clinical note |

## Conventions

- Empty string `''` for unanswered text and enum fields; `null` for unanswered
  numeric, date, and time fields.
- camelCase property names in TypeScript and front-end Rust serde; snake_case in
  SQL and Rust internals.
- UUIDv4 primary keys via `gen_random_uuid()`.
- Timestamps on every table: `created_at`, `updated_at`, `deleted_at`.
- Import and export via JSON, XML, CSV, and TSV.
- The decision engine is pure (no side effects, no I/O) and unit-tested.

## Compliance

- **MDCG 2019-11 Rev.1** (EU MDR/IVDR software classification) — clinical
  decision-support tool; the output recommends whether to image rather than
  determining diagnosis or treatment.
- **UK Medical Devices Regulations 2002.**
- **ISO/IEC/IEEE 26514:2022** — design and development of information for users.
- **UK MHRA** *Software and AI as a Medical Device.*

## Clinical references

- Stiell I.G. *et al.* Prospective validation of a decision rule for the use of
  radiography in acute knee injuries. *JAMA* 1996; 275(8):611–615.
- Stiell I.G. *et al.* Derivation of a decision rule for the use of radiography
  in acute knee injuries. *Ann Emerg Med* 1995; 26(4):405–413.
- Stiell I.G. *et al.* Implementation of the Ottawa Knee Rule for the use of
  radiography in acute knee injuries. *JAMA* 1997; 278(23):2075–2079.
- Bachmann L.M. *et al.* The accuracy of the Ottawa knee rule to rule out knee
  fractures: a systematic review. *Ann Intern Med* 2004; 140(2):121–124.

## Verify

```sh
bin/test-form ottawa-knee-rule
```
