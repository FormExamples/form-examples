# Tumor Marker Test Result — clinical references

Grounded reference material for the structured interpretation and reporting of
serum tumour-marker results. These sources anchor the four-axis interpretation
grade, the structured-reporting categories, and the critical-result alerting
rules used by this form.

## Interpretation and appropriate use

### ACB / ACBI — Guidelines for the use of tumour markers

The Association for Clinical Biochemistry & Laboratory Medicine (ACB) and the
allied ACBI guidelines set out which markers are appropriate for which
malignancy and, critically, how to interpret a measured value. The central
message relevant to a **result** form is that tumour markers are **poor
screening tests**: most have low specificity and are raised in benign conditions,
so an isolated mildly raised value rarely indicates cancer. Markers are most
useful for **monitoring a known cancer and detecting relapse**, where the
**trend** of serial values — rather than a single reading — carries the
information.

Key principles relevant to this form:

- **Interpret in clinical context** — a value is reported against the patient's
  `clinical_history` and `known_cancer_site`, not in isolation. This maps to the
  result-classification axis.
- **Trend over single value** — serial measurement and the direction of change
  drive monitoring decisions. This maps to `previous_value`, `trend`,
  `comparison_with_previous`, and the severity axis.
- **Markedly elevated values are actionable** — a value far above the reference
  range, or a rising trend during treatment, escalates follow-up urgency.

Source:

- ACB / ACBI *Guidelines for the use of tumour markers* (5th edition).
  <https://acbi.ie/wp-content/uploads/2022/12/1644913336-1602832758-Tumour-markers-5th.pdf>

## Marker-specific guidance

### CA125 — suspected ovarian cancer (NICE)

NICE CG122 directs that serum CA125 be measured in primary care for women with
symptoms suggestive of ovarian cancer, and that an abdominal/pelvic ultrasound be
arranged if the level is **≥35 IU/mL**. The 35 IU/mL action threshold is the
anchor for the form's CA125 abnormal/markedly-elevated interpretation and the
recommended-follow-up text.

Sources:

- NICE CG122 *Ovarian cancer: recognition and initial management*.
  <https://www.nice.org.uk/guidance/cg122>
- NICE NG12 *Suspected cancer: recognition and referral*.
  <https://www.nice.org.uk/guidance/ng12>

### AFP, beta-hCG, LDH — germ-cell tumours (ASCO / ACB)

Serum AFP, beta-hCG, and LDH are the established markers for the diagnosis,
staging, prognosis, and monitoring of germ-cell tumours. A **markedly elevated**
AFP or beta-hCG is a strong signal for a germ-cell (non-seminomatous) tumour and
is treated by this form as a **critical result**, auto-escalating the follow-up
urgency to `critical-alert` and raising the `critical-result-alert` flag. An
elevated AFP in a patient otherwise thought to have seminoma reclassifies the
tumour as non-seminomatous, underscoring the clinical weight of a high value.

Sources:

- ASCO *Clinical Practice Guideline on Uses of Serum Tumor Markers in Adult Males
  With Germ Cell Tumors*. <https://ascopubs.org/doi/10.1200/JCO.2009.26.4481>
- ACB / ACBI *Guidelines for the use of tumour markers* (germ-cell section).
  <https://acbi.ie/wp-content/uploads/2022/12/1644913336-1602832758-Tumour-markers-5th.pdf>

### CA19-9, CEA, CA15-3, calcitonin, chromogranin A — monitoring markers

CA19-9 (pancreatic / hepatobiliary; reference < 37 U/mL), CEA (colorectal
monitoring), CA15-3 (breast monitoring), calcitonin (medullary thyroid
carcinoma), and chromogranin A (neuroendocrine tumours) are interpreted chiefly
for **monitoring and recurrence surveillance**. A rising value on treatment or
follow-up is the actionable signal and maps to the severity and follow-up axes.

## Over-testing and retesting intervals

### RCPath — National Minimum Retesting Intervals in Pathology

RCPath's minimum-retesting-interval guidance discourages over-testing and sets
sensible intervals for serial tumour-marker monitoring. This underpins the form's
recommended-follow-up text (e.g. a repeat interval rather than immediate
re-testing) and the `repeat-marker` recommendation value.

- RCPath *National Minimum Retesting Intervals in Pathology*.
  <https://www.rcpath.org/>

## How the references map to the schema

| Reference | Schema element |
| --- | --- |
| ACB/ACBI interpret-in-context | `clinical_history`, `known_cancer_site`, result-classification axis |
| ACB/ACBI trend over single value | `previous_value`, `trend`, `comparison_with_previous`, severity axis |
| NICE CG122 CA125 ≥35 IU/mL threshold | `ca125`, `markedly_elevated`, recommended-follow-up |
| ASCO/ACB germ-cell markers (very high AFP/βhCG) | `alpha_fetoprotein_afp`, `beta_hcg`, `lactate_dehydrogenase_ldh`, `critical-result-alert` flag |
| ACB/ACBI monitoring markers | `ca19_9`, `carcinoembryonic_antigen_cea`, `ca15_3`, `calcitonin`, `chromogranin_a` |
| RCPath minimum retesting intervals | `recommended_follow_up`, `repeat-marker` recommendation |
| Critical-result communication | `critical_result_communicated`, `reported_to`, `critical-result-alert` flag |
