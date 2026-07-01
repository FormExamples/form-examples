# Centor Score for Streptococcal Pharyngitis

A clinical prediction tool that estimates the likelihood that an acute sore
throat is caused by **group A beta-haemolytic streptococcus (GABHS, "strep")**
and therefore the likelihood that antibiotics would help. It records four
objective **Centor criteria**, each scoring 1 point when present —
**tonsillar exudate**, **tender anterior cervical lymphadenopathy**,
**fever (temperature > 38 °C or a history of fever)**, and **absence of
cough** — for a Centor total of **0–4**. The **McIsaac modification** adds an
**age modifier** (+1 for ages 3–14, 0 for 15–44, −1 for ≥ 45) to give a
modified score of **−1 to 5** that adjusts for the age-related probability of
streptococcal infection.

A higher score raises the estimated probability of streptococcal pharyngitis and
guides **testing and antibiotic** decisions: a low score needs neither a test nor
an antibiotic; a mid-range score prompts a rapid antigen detection test (RADT) or
throat swab; a high score prompts a RADT/swab or empirical antibiotics under
antimicrobial-stewardship principles. The score is a decision aid, not a
diagnosis: it never overrides clinical judgement or a red flag for airway
compromise or peritonsillar abscess (quinsy).

The Centor criteria were derived by Centor *et al.* (*Medical Decision Making*,
1981) for adults; McIsaac *et al.* (*CMAJ* 1998, *JAMA* 2004) added the age
modifier and validated the tool across ages. In UK primary care, **NICE NG84**
recommends **FeverPAIN** or **Centor** as alternative scoring tools for acute
sore throat.

## Scope and intended users

- **Setting:** general practice, urgent and out-of-hours primary care, walk-in
  centres, community pharmacy consultations, and emergency departments — any
  setting assessing an acute sore throat.
- **Users:** general practitioners, nurse practitioners, advanced clinical
  practitioners, pharmacists, and other primary/urgent-care clinicians.
- **Patients:** adults and children aged ≥ 3 years presenting with an acute
  sore throat. The McIsaac age modifier makes the tool applicable across ages.
- **Not for:** children under 3 years, immunocompromised patients, recurrent or
  chronic sore throat, or as a substitute for clinical judgement. A low score
  does not exclude streptococcal infection, and the tool does not assess for
  glandular fever, epiglottitis, or other causes.
- **Alternative tool:** **FeverPAIN** (Little *et al.*; NICE NG84) is an
  equally recommended UK scoring tool for the same decision. This form
  implements Centor with the McIsaac modification.

## Scoring system

**Primary instrument:** Centor criteria — four features, each scoring 1 point
when present and 0 when absent. Centor total 0–4.

| # | Centor criterion | Scores 1 point when | Points |
| --- | --- | --- | --- |
| 1 | Tonsillar exudate | Exudate or swelling on the tonsils | 0 or 1 |
| 2 | Tender anterior cervical lymphadenopathy | Swollen, tender anterior cervical lymph nodes | 0 or 1 |
| 3 | Fever | Temperature > 38 °C, or a history of fever | 0 or 1 |
| 4 | Absence of cough | Cough is absent | 0 or 1 |

**McIsaac age modifier.** Added to the Centor total to give the modified
(McIsaac) score, range **−1 to 5**.

| Age (years) | Modifier |
| --- | --- |
| 3–14 | +1 |
| 15–44 | 0 |
| ≥ 45 | −1 |

**Interpretation (modified McIsaac score).**

| Modified score | Risk band | Approx. probability of GABHS | Recommended action |
| --- | --- | --- | --- |
| ≤ 1 | Low | ~ 1–10 % | No throat swab and no antibiotic. Self-care and safety-netting advice; most sore throats are viral and self-limiting. |
| 2–3 | Moderate | ~ 11–35 % | Consider a rapid antigen detection test (RADT) or throat swab; treat with antibiotics only if positive or clinically indicated. |
| 4–5 | High | ~ 50 % or more | Consider a RADT/throat swab, or empirical antibiotics under antimicrobial-stewardship principles (e.g. phenoxymethylpenicillin per local policy), with safety-netting. |

The original Centor total (0–4) is retained alongside the McIsaac score; banding
uses the McIsaac score so the age-related probability is reflected. Higher scores
increase the probability of streptococcal infection and hence the potential
benefit of antibiotics, balanced against antimicrobial stewardship.

## Assessment steps

Completed in order on a single continuous single-page wizard. Each step records
an **objective clinical finding**.

| # | Step | Key fields |
| --- | --- | --- |
| 1 | Assessment context | assessing clinician name and role, date and time of assessment, care setting |
| 2 | Patient identification | patient identifier, age (years, drives the McIsaac modifier), sex |
| 3 | Tonsillar exudate | exudate/swelling on the tonsils present → criterion 1 |
| 4 | Cervical lymphadenopathy | tender, swollen anterior cervical nodes → criterion 2 |
| 5 | Fever | measured temperature (°C) and/or history of fever → criterion 3 |
| 6 | Cough | cough present or absent → criterion 4 (scores when **absent**) |
| 7 | Red-flag review | airway / peritonsillar (quinsy) warning features: stridor or difficulty breathing, drooling or unable to swallow saliva, trismus, muffled ("hot-potato") voice, unilateral neck swelling |
| 8 | Summary and score | computed Centor total, age modifier, McIsaac score, risk band, fired criteria, red-flag issues, testing/antibiotic recommendation, free-text clinical note |

## Conventions

- Empty string `''` for unanswered text and enum fields; `null` for unanswered
  numeric, date, and time fields.
- camelCase property names in TypeScript and front-end Rust serde; snake_case in
  SQL and Rust internals.
- UUIDv4 primary keys via `gen_random_uuid()`.
- Timestamps on every table: `created_at`, `updated_at`, `deleted_at`.
- Import and export via JSON, XML, CSV, and TSV.
- The scoring engine is pure (no side effects, no I/O) and unit-tested.

## Compliance

- **MDCG 2019-11 Rev.1** (EU MDR/IVDR software classification) — clinical
  decision-support scoring tool; the output informs testing and prescribing
  rather than determining treatment.
- **UK Medical Devices Regulations 2002.**
- **ISO/IEC/IEEE 26514:2022** — design and development of information for users.
- **UK MHRA** *Software and AI as a Medical Device.*

## Clinical references

- Centor R.M. *et al.* The diagnosis of strep throat in adults in the emergency
  room. *Medical Decision Making* 1981; 1(3):239–246.
- McIsaac W.J. *et al.* A clinical score to reduce unnecessary antibiotic use in
  patients with sore throat. *CMAJ* 1998; 158(1):75–83.
- McIsaac W.J. *et al.* Empirical validation of guidelines for the management of
  pharyngitis in children and adults. *JAMA* 2004; 291(13):1587–1595.
- NICE NG84. *Sore throat (acute): antimicrobial prescribing* (2018) — Centor and
  FeverPAIN scoring tools.
- Little P. *et al.* PRImary care Streptococcal Management (PRISM) / FeverPAIN.
  *BMJ* 2013; 347:f5806.

## Verify

```sh
bin/test-form centor-score-for-streptococcal-pharyngitis
```
