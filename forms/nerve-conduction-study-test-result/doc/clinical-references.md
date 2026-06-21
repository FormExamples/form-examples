# Nerve Conduction Study Test Result — clinical references

Grounded reference material for the structured interpretation and reporting of
nerve conduction studies (NCS) and needle electromyography (EMG). These sources
anchor the four-axis interpretation grade, the structured-reporting categories,
and the critical-result alerting rules used by this form.

## Reporting standards

### AANEM — Recommended Policy for Electrodiagnostic Medicine

The American Association of Neuromuscular & Electrodiagnostic Medicine (AANEM)
*Recommended Policy for Electrodiagnostic Medicine* sets out the standards for
the proper performance and interpretation of nerve conduction studies and needle
EMG: who should perform and supervise the studies, how the studies should be
planned and designed in real time, and how findings should be integrated into a
clinical interpretation. It provides the baseline that an electrodiagnostic
report should achieve.

Key principles relevant to this form:

- **Integrated, physician-interpreted studies** — the study is planned and
  interpreted by a qualified physician, not a fixed protocol. This maps to the
  `study_type`, `region`, and `study_adequacy` fields.
- **Actionable interpretation** — the report should clearly answer the clinical
  question and guide further management. This maps to the form's `impression`
  and `recommended_follow_up` fields and the follow-up-urgency axis.

Sources:

- Recommended Policy for Electrodiagnostic Medicine (executive summary), AANEM.
  <https://www.aanem.org/docs/default-source/documents/recommended-policy-2023.pdf>
- Recommended Policy for Electrodiagnostic Medicine, AANEM position statement.
  <https://aanem.org/clinical-practice-resources/position-statements/position-statement/recommended-policy-for-electrodiagnostic-medicine>

### AANEM — Reporting the Results of Nerve Conduction Studies and Needle EMG

The AANEM statement on *Reporting the Results of Nerve Conduction Studies and
Needle EMG* (published in *Muscle & Nerve*, October 2005, with updates approved
in May 2014, August 2019, and December 2024) defines the **mandatory content of
an electrodiagnostic report**: the clinical history and question, the studies
performed, the tabulated NCS and EMG data, an interpretation, and a conclusion /
impression. The report-completeness axis scores presence of these mandatory
sections.

- Reporting the Results of Nerve Conduction Studies and Needle EMG, AANEM.
  <https://www.aanem.org/docs/default-source/documents/aanem/practice/rptresultsemgncs-pdf.pdf>

## Severity grading and diagnostic categories

### AANEM / AAN — Electrodiagnostic studies in carpal tunnel syndrome

The AANEM / AAN / AAPM&R practice parameter outlines the EDX studies and
reference values considered standard of care when carpal tunnel syndrome (median
neuropathy at the wrist) is clinically suspected; these studies confirm the
diagnosis with high sensitivity (>85 %) and specificity (≈95 %). Severity is
conventionally graded in three bands, which the form stores in the grade's
`reporting_category` (Axis B) field and reflects in `severity`:

- **Mild** — prolonged sensory distal latency with normal motor studies and no
  axonal loss.
- **Moderate** — abnormal sensory latency with prolonged motor distal latency
  and no axonal loss.
- **Severe** — any nerve-conduction abnormality with axonal loss (low or absent
  sensory / motor action potentials, or denervation on needle EMG).

Sources:

- AAEM/AAN/AAPM&R Practice Parameter: Electrodiagnostic studies in carpal tunnel
  syndrome (summary statement; reaffirmed), *Neurology* / AANEM.
  <https://www.aanem.org/docs/default-source/documents/cts_reaffirmed.pdf>
- Carpal Tunnel Syndrome: an AANEM Quality Measure Set, *Muscle & Nerve* 2020.
  <https://www.aanem.org/docs/default-source/documents/aanem/advocacy/zivkovic-et-al-2020-muscle-nerve.pdf>

### AAN / AANEM — Evaluation of distal symmetric polyneuropathy

The practice parameter for the evaluation of distal symmetric polyneuropathy
underpins the form's `peripheral_neuropathy` structured finding and the
`pattern` characterisation (demyelinating vs axonal vs mixed) used by the
severity axis.

- Practice Parameter: Evaluation of distal symmetric polyneuropathy
  (evidence-based review), *Neurology*.
  <https://www.neurology.org/doi/10.1212/01.wnl.0000336370.51010.a1>

## Critical findings

A finding of **motor neurone disease / anterior-horn-cell features** (widespread
active and chronic denervation), or a **severe acute neuropathy** such as a
Guillain-Barré syndrome (acute inflammatory demyelinating) pattern with
conduction block / conduction failure, is treated as a critical result: it
auto-escalates the follow-up-urgency axis to `critical-alert` and raises the
`critical-result-alert` safety flag, because early confirmation changes
management, access to disease-modifying therapy, and the urgency of inpatient
neurology review. This drives the `motor_neurone_disease_features` structured
flag and the `critical_result_communicated` / `reported_to` fields.

## How the references map to the schema

| Reference | Schema element |
| --- | --- |
| AANEM recommended policy (study design / adequacy) | `study_type`, `region`, `study_adequacy` |
| AANEM report-content standard (mandatory sections) | report-completeness axis (`report_completeness_percent`) |
| AANEM actionable interpretation | `impression`, `recommended_follow_up`, follow-up-urgency axis |
| AANEM CTS severity grading | `carpal_tunnel_syndrome`, `severity`, `reporting_category` (Axis B) |
| AAN distal symmetric polyneuropathy parameter | `peripheral_neuropathy`, `pattern` |
| MND / severe acute neuropathy critical-result rule | `motor_neurone_disease_features`, `critical_result_communicated`, `reported_to`, `critical-result-alert` flag |
