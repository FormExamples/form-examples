# Medication Reconciliation

A structured medicines-safety document that reconciles a patient's medicines at
a transition of care — **admission**, **internal transfer**, or **discharge**.
It captures the **best-possible medication history (BPMH)** compiled from two or
more independent information sources, records the **current inpatient medication
list**, and reconciles the two — identifying every **discrepancy** (omission,
duplication, dose / frequency / route change, drug interaction, high-risk
medicine) and documenting the **intended action** (continue / hold / stop /
change / start) with a clinical **rationale** for each line item.

This is a **documentation and completeness** form rather than a numeric risk
calculator. Its engine does not compute a score; it grades the **completeness
and status** of the reconciliation and raises **safety flags** when an
unresolved risk remains. The output is a signed reconciliation record suitable
for the drug chart, the discharge summary, and the general-practice record.

Medication reconciliation is a WHO High 5s patient-safety intervention and a
NICE (NG5) and Royal Pharmaceutical Society expectation at every transfer of
care. Errors introduced at admission and discharge are a leading cause of
preventable medication-related harm.

## Scope and intended users

- **Setting:** hospital admission (emergency department, acute medical unit,
  surgical admissions), ward-to-ward or ward-to-critical-care transfer, and
  discharge from an inpatient episode.
- **Users:** clinical pharmacists and pharmacy technicians (who most often
  compile the BPMH), prescribers (doctors, non-medical prescribers), and nurses.
- **Patients:** any admitted patient taking, or expected to take, regular or
  as-required medicines, including high-risk medicines.
- **Not for:** primary-care repeat-prescription authorization, a substitute for
  a full clinical medication review, or definitive interaction screening (it
  flags for pharmacist review rather than replacing a decision-support engine).

## Sections and data captured

Collected in order on one continuous single-page wizard.

| # | Section | Key fields |
| --- | --- | --- |
| 1 | Encounter context | reconciliation type (admission / transfer / discharge), care setting, date and time, reconciling clinician name and role |
| 2 | Patient identification | patient identifier, age band, sex, weight (for weight-based dosing) |
| 3 | Information sources | each source used to build the BPMH (patient / carer interview, GP record, repeat-prescription list, community-pharmacy record, dispensing history, previous discharge summary, own-drugs bag, care-home MAR chart), with a "verified" flag; **two or more independent sources are required** |
| 4 | Allergies and adverse reactions | documented drug allergies and reaction type, or "no known drug allergies" confirmed |
| 5 | Best-possible medication history (BPMH) | one line item per home medicine: drug name, form, dose, route, frequency, indication, high-risk class, last-taken, adherence, source |
| 6 | Current inpatient / proposed list | one line item per currently-prescribed or proposed medicine: drug name, form, dose, route, frequency, status |
| 7 | Reconciliation | per discrepancy: type, matched BPMH and inpatient line items, intended action (continue / hold / stop / change / start), rationale, whether the discrepancy is intentional |
| 8 | Summary and sign-off | computed status, discrepancy list, fired rules, safety flags, free-text note, clinician sign-off |

## Completeness and safety model

The engine is a **pure reconciliation function** — no score, no I/O. It compares
the BPMH against the inpatient list, classifies each discrepancy, derives a
**status class**, and raises **safety flags**.

### Status classes

| Status | Meaning |
| --- | --- |
| **Complete** | BPMH captured from **≥ 2 independent sources**; every BPMH and inpatient line item reconciled; every discrepancy has a documented intended action **and** rationale (i.e. is intentional); no unintentional discrepancy outstanding; allergies documented. |
| **Discrepancies-outstanding** | Reconciliation performed and sources adequate, but **≥ 1 discrepancy is unintentional** or lacks a documented action / rationale — requires prescriber resolution before sign-off. |
| **Incomplete** | The reconciliation cannot yet be judged: **fewer than two information sources**, allergy status not documented, or one or more line items not yet reviewed. |

### Discrepancy classification

Each discrepancy is one **type**, and is either **intentional** (a documented
clinical decision with a rationale) or **unintentional** (an unexplained
difference — treated as a potential error):

| Type | Definition |
| --- | --- |
| **Omission** | A BPMH medicine is absent from the inpatient list. |
| **Commission** | An inpatient medicine has no matching BPMH entry (newly started with no rationale). |
| **Duplication** | The same drug or therapeutic class appears twice (therapeutic duplication). |
| **Dose** | Same drug, different dose. |
| **Frequency** | Same drug, different frequency / timing. |
| **Route** | Same drug, different route. |
| **Formulation** | Same drug, different form (e.g. modified vs immediate release). |

An **intentional** discrepancy (e.g. warfarin held before surgery, with reason)
is expected and does not block a **Complete** status. An **unintentional**
discrepancy is an outstanding error.

### Safety flags

Raised independently of the status, each with a priority:

- **High-risk unintentional discrepancy** (high) — an unintentional discrepancy
  on an anticoagulant, insulin, or opioid (the high-risk classes).
- **Insufficient sources** (high) — fewer than two independent information
  sources used to build the BPMH.
- **Allergy conflict** (high) — a reconciled medicine matches a documented drug
  allergy.
- **Drug interaction** (high / medium) — a clinically significant interaction
  between two reconciled medicines.
- **Therapeutic duplication** (medium) — the same drug or class prescribed twice.
- **Unintentional discrepancy outstanding** (medium) — any unresolved
  unintentional discrepancy not on a high-risk medicine.
- **Allergy status not documented** (low) — neither allergies nor "no known drug
  allergies" recorded.

## Assessment steps

The eight sections above run as one continuous single-page wizard; the final
step renders the computed status, the discrepancy table, fired rules, safety
flags, and the clinician sign-off. The form must remain a single-page wizard —
no multi-page forms.

## Conventions

- Empty string `''` for unanswered text and enum fields; `null` for unanswered
  numeric, date, and time fields.
- camelCase property names in TypeScript and front-end Rust serde; snake_case in
  SQL and Rust internals.
- UUIDv4 primary keys via `gen_random_uuid()`.
- Timestamps on every table: `created_at`, `updated_at`, `deleted_at`.
- Import and export via JSON, XML, CSV, and TSV.
- The reconciliation engine is pure (no side effects, no I/O) and unit-tested.

## Compliance

- **MDCG 2019-11 Rev.1** (EU MDR/IVDR software classification) — clinical
  documentation and completeness tool; the output prompts pharmacist / prescriber
  review rather than determining treatment.
- **UK Medical Devices Regulations 2002.**
- **ISO/IEC/IEEE 26514:2022** — design and development of information for users.
- **UK MHRA** *Software and AI as a Medical Device.*

## Clinical references

- World Health Organization. *The High 5s Project — Assuring Medication Accuracy
  at Transitions in Care (Medication Reconciliation)*, 2014.
- NICE NG5. *Medicines optimisation: the safe and effective use of medicines to
  enable the best possible outcomes*, 2015.
- Royal Pharmaceutical Society. *Keeping patients safe when they transfer between
  care providers*, 2012.
- NICE / NPSA. *Technical patient safety solutions for medicines reconciliation
  on admission of adults to hospital* (PSG001), 2007.

## Verify

```sh
bin/test-form medication-reconciliation
```
