# Bhutani Bilirubin Nomogram

A predictive risk-stratification tool for neonatal hyperbilirubinaemia. It plots
a newborn infant's **total serum bilirubin (TSB)** against the infant's
**age in hours** on the hour-specific Bhutani nomogram to assign a **percentile
risk zone** — **low**, **low-intermediate**, **high-intermediate**, or
**high** — that predicts the likelihood of subsequent significant
hyperbilirubinaemia. The same TSB and age are compared with the age- and
gestation-specific **treatment-threshold graphs** (UK NICE) to indicate whether
the infant is at or above the **phototherapy** or **exchange-transfusion**
threshold.

The instrument is a **classification**, not a numeric sum: it maps a
(age-in-hours, TSB) point to a named risk zone and to threshold comparisons. It
is derived from Bhutani *et al.* (*Pediatrics* 1999), the predischarge
hour-specific bilirubin nomogram for healthy term and near-term newborns, and is
used alongside the NICE treatment-threshold charts (NICE CG98 /
*Jaundice in newborn babies under 28 days*).

## Scope and intended users

- **Setting:** postnatal wards, neonatal units, midwife-led units, transitional
  care, and community / midwifery follow-up where a newborn's bilirubin is
  measured before or shortly after discharge.
- **Users:** midwives, neonatal and paediatric nurses, paediatricians, neonatal
  nurse practitioners, and other clinicians assessing newborn jaundice.
- **Patients:** newborn infants, principally **term and near-term** (≥ 35 weeks'
  gestation), in the first days of life (the nomogram is defined for roughly
  0–168 hours of age).
- **Not for:** a definitive diagnosis of the cause of jaundice; infants below the
  gestational range of the local threshold charts without specialist input; a
  substitute for clinical judgement, direct (conjugated) bilirubin assessment, or
  investigation of underlying pathology. A low-risk zone does **not** exclude the
  need for follow-up.

## Risk-zone model

The Bhutani nomogram is a set of hour-specific percentile curves for TSB across
the first week of life. A measured TSB at a known age in hours falls into one of
four zones bounded by the 40th, 75th, and 95th percentile tracks:

| Zone | Bounded by | Percentile band | Predictive meaning |
| --- | --- | --- | --- |
| **Low risk** | below the 40th percentile track | < 40th | Very low probability of subsequent significant hyperbilirubinaemia. |
| **Low-intermediate risk** | 40th to < 75th percentile track | 40th–75th | Low probability; routine follow-up per age and risk factors. |
| **High-intermediate risk** | 75th to < 95th percentile track | 75th–95th | Increased probability; closer surveillance and earlier re-measurement. |
| **High risk** | at or above the 95th percentile track | ≥ 95th | Highest probability of subsequent significant hyperbilirubinaemia; ensure timely re-testing and consider treatment against the threshold charts. |

The zone predicts **risk of a future significant rise**; it is distinct from the
**treatment decision**, which is made against the threshold graphs:

- **Phototherapy threshold** — the age- and gestation-specific TSB line above
  which phototherapy is indicated. A TSB **at or above** this line is a positive
  treatment signal.
- **Exchange-transfusion threshold** — the higher, more urgent line above which
  exchange transfusion is considered. A TSB **at or above** this line is an
  emergency.

Both threshold lines rise with postnatal age and are set **lower for lower
gestational age**. The tool therefore takes **gestational age** as an input and
selects the appropriate threshold curve. Recognized **risk factors** that lower
the effective concern threshold and warrant earlier / closer assessment include:

- gestational age **< 38 weeks**;
- a **previous sibling** who required phototherapy or had neonatal jaundice;
- **exclusive breastfeeding**, particularly if feeding is not well established;
- visible **bruising** or cephalohaematoma;
- **blood-group incompatibility** (e.g. ABO or Rhesus) or a positive direct
  antiglobulin (Coombs) test;
- jaundice **onset < 24 hours** of age (always pathological until proven
  otherwise).

## Assessment steps

Completed in order on a single continuous single-page wizard. Each step records
an objective measurement or a documented risk factor.

| # | Step | Key fields |
| --- | --- | --- |
| 1 | Assessment context | assessing clinician name and role, date and time of assessment, care setting |
| 2 | Infant identification | infant identifier, sex, date and time of birth, gestational age at birth (weeks) |
| 3 | Bilirubin measurement | age at measurement (hours), total serum bilirubin (µmol/L), measurement method (serum / transcutaneous) |
| 4 | Risk factors | gestation < 38 weeks, previous sibling with jaundice, exclusive breastfeeding, bruising / cephalohaematoma, blood-group incompatibility / positive DAT, onset < 24 hours |
| 5 | Summary and result | computed age in hours, risk zone / percentile band, phototherapy and exchange-threshold comparison, fired risk factors, flagged issues, escalation recommendation, free-text clinical note |

## Conventions

- Empty string `''` for unanswered text and enum fields; `null` for unanswered
  numeric, date, and time fields.
- camelCase property names in TypeScript and front-end Rust serde; snake_case in
  SQL and Rust internals.
- UUIDv4 primary keys via `gen_random_uuid()`.
- Timestamps on every table: `created_at`, `updated_at`, `deleted_at`.
- Import and export via JSON, XML, CSV, and TSV.
- The classification engine is pure (no side effects, no I/O) and unit-tested.
- Bilirubin is recorded in **µmol/L** (SI units, UK convention).

## Compliance

- **MDCG 2019-11 Rev.1** (EU MDR/IVDR software classification) — clinical
  decision-support tool; the output predicts risk and prompts comparison with
  treatment thresholds rather than determining treatment autonomously.
- **UK Medical Devices Regulations 2002.**
- **ISO/IEC/IEEE 26514:2022** — design and development of information for users.
- **UK MHRA** *Software and AI as a Medical Device.*

## Clinical references

- Bhutani V.K., Johnson L., Sivieri E.M. Predictive ability of a predischarge
  hour-specific serum bilirubin for subsequent significant hyperbilirubinemia in
  healthy term and near-term newborns. *Pediatrics* 1999; 103(1):6–14.
- NICE CG98. *Jaundice in newborn babies under 28 days* (2010, updated 2023),
  including the treatment-threshold graphs by gestational age.
- American Academy of Pediatrics. *Clinical Practice Guideline Revision:
  Management of Hyperbilirubinemia in the Newborn Infant 35 or More Weeks of
  Gestation* (2022).

## Verify

```sh
bin/test-form bhutani-bilirubin-nomogram
```
