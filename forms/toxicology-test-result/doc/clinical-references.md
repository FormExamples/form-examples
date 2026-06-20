# Toxicology Test Result — clinical references

Grounded reference material for the structured interpretation and reporting of
toxicology / poisons / therapeutic-drug-level assays. These sources anchor the
four-axis interpretation grade, the toxic-threshold and nomogram categories, and
the critical-result alerting rules used by this form.

## Decision-support resource

### TOXBASE / NPIS

TOXBASE is the clinical-toxicology database of the UK National Poisons
Information Service (NPIS) and the primary decision-support resource for the
interpretation and management of poisoning. It provides agent-specific guidance
on toxic thresholds, antidotes, and management that underpins this form's
`overall_result_status`, `toxic_level_present`, and `recommended_follow_up`
fields, and the follow-up-urgency axis. The NPIS telephone service
(0344 892 0111) supplements TOXBASE for complex cases.

- TOXBASE — NPIS clinical toxicology database. <https://www.toxbase.org/>

## Paracetamol treatment nomogram

The UK paracetamol-overdose treatment nomogram changed fundamentally in 2012
following an MHRA directive (on Commission on Human Medicines advice): a single
**100 mg/L (660 µmol/L) at 4 h** treatment line now applies to all acute
overdoses with a known ingestion time, irrespective of risk factors. Plasma
paracetamol levels are **not interpretable on the nomogram before 4 h
post-ingestion**, so `time_since_ingestion_hours` is required to interpret
`paracetamol_level_mg_l`. A level **above the treatment line**
(`paracetamol_nomogram = above-treatment-line`) is a toxic, critical result that
mandates the antidote.

**N-acetylcysteine (NAC)** is the antidote of choice and is near-100 % effective
in preventing paracetamol-induced hepatotoxicity if started within 8 h of
ingestion. A paracetamol level above the treatment line therefore
auto-escalates Axis D to *critical-alert* with an urgent NAC action and raises
the `critical-result-alert` flag.

- NHSGGC / RCEM adult paracetamol-overdose treatment guidance (UK 100 mg/L
  nomogram, NAC). <https://www.cem.scot.nhs.uk/adult/paracetamoltreat.pdf>
- GGC Medicines — Treatment of Paracetamol Overdose.
  <https://handbook.ggcmedicines.org.uk/guidelines/drug-overdose-and-toxicity/treatment-of-paracetamol-overdose/>

## Toxic thresholds (result interpretation)

Approximate reference points used to drive `toxic_level_present`,
`overall_result_status`, and Axis B severity. Always interpret against the
reporting laboratory's units and reference ranges and against TOXBASE.

| Result value | Indicative toxic threshold |
| --- | --- |
| Paracetamol | Above the 100 mg/L-at-4 h treatment-nomogram line |
| Salicylate | Toxicity above the therapeutic range; high levels may indicate haemodialysis |
| Lithium | Toxicity from ≈ 1.5 mmol/L; severe > 3.5 mmol/L (therapeutic ≈ 0.4–1.0 mmol/L) |
| Digoxin | Toxicity above the therapeutic range (≈ 0.8–2.0 ng/mL) |
| Carboxyhaemoglobin | Poisoning generally > 10 %; severe > 20 % (smokers baseline 10–15 %) |

Sources:

- Lithium toxicity (StatPearls / Emergency Care BC) — toxic bands by mmol/L.
  <https://www.ncbi.nlm.nih.gov/books/NBK499992/>
- Digoxin level reference range (Medscape).
  <https://emedicine.medscape.com/article/2089975-overview>
- Salicylate / aspirin poisoning (Merck Manual Professional Edition).
  <https://www.merckmanuals.com/professional/injuries-poisoning/poisoning/aspirin-and-other-salicylate-poisoning>
- Carboxyhaemoglobin toxicity (StatPearls).
  <https://www.ncbi.nlm.nih.gov/books/NBK557888/>

## Reporting and critical-result communication

The reporting clinician must record that a critical or unexpected significant
result was communicated and to whom; this drives the
`critical_result_communicated` / `reported_to` fields and the
`critical-result-alert` safety flag. RCEM toxicology guidance frames the
management of suspected and confirmed poisoning that the report's impression and
recommended follow-up should support.

- RCEM — *Management of Patients with Suspected but Unidentified Poisoning in the
  Emergency Department* and Toxicology Special Interest Group guidance.
  <https://rcem.ac.uk/>

## How the references map to the schema

| Reference | Schema element |
| --- | --- |
| TOXBASE / NPIS agent-specific thresholds | `toxic_level_present`, `overall_result_status`, follow-up-urgency axis |
| MHRA paracetamol nomogram (100 mg/L at 4 h) | `paracetamol_level_mg_l`, `paracetamol_nomogram`, `time_since_ingestion_hours` |
| NAC antidote | `recommended_follow_up`, `recommended_action`, `critical-result-alert` flag |
| Lithium / digoxin / salicylate / CO toxic thresholds | `lithium_level_mmol_l`, `digoxin_level`, `salicylate_level_mg_l`, `carboxyhaemoglobin_percent` |
| Critical-result communication | `critical_result_communicated`, `reported_to` |
| Mandatory report sections | report-completeness axis (`report_completeness_percent`) |
