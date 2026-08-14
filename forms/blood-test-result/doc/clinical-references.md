# Blood Test Result — clinical references

Grounded reference material for the structured interpretation and reporting of
blood / pathology test results. These sources anchor the four-axis
interpretation grade, the reference ranges, the structured-reporting categories,
and the critical-result (panic-value) alerting rules used by this form.

## Reporting and communication standards

### RCPath — The communication of critical and unexpected pathology results

The Royal College of Pathologists (RCPath) best-practice recommendations on the
communication of critical and unexpected pathology results define a **critical
result** (a.k.a. critical / panic / alert value) as one requiring urgent
clinical action, and require that such a result is actively communicated — by
telephone or another method whose receipt can be promptly acknowledged — to a
person able to act on it, and that the communication is documented. Many UK
laboratories publish local **clinical decision limits / alert limits** derived
from this guidance.

Key principles relevant to this form:

- **Critical (panic) values** — results that breach an urgent action threshold
  must be flagged, communicated, and the communication recorded. This drives the
  `critical_value_present`, `critical_value_detail`, `critical_result_communicated`,
  and `reported_to` fields, the auto-escalation of Axis A to *critical* and
  Axis D to *critical-alert*, and the `critical-result-alert` safety flag.
- **Unexpected and urgent results** — results that are abnormal but not
  immediately life-threatening still warrant timely communication; this maps to
  the `abnormal_results_present` field and the `abnormal-requiring-action` /
  `urgent-referral` flag categories.
- **Actionable reporting** — a report should address the clinical question and
  offer guidance on further management, mapping to `impression` and
  `recommended_follow_up` and the follow-up-urgency axis.

Sources:

- Best practice recommendations: The communication of critical and unexpected
  pathology results, RCPath (G158).
  <https://www.rcpath.org/static/bb86b370-1545-4c5a-b5826a2c431934f5/G158-BPR-The-communication-of-critical-and-unexpected-pathology-results.pdf>
- Key Performance Indicators in Pathology, RCPath.
  <https://www.rcpath.org/static/e7b7b680-a957-4f48-aa78e601e42816de/Key-Performance-Indicators-in-Pathology-Recommendations-from-the-Royal-College-of-Pathologists.pdf>
- Example laboratory clinical decision / alert limits (Royal Berkshire NHS).
  <http://pathology.royalberkshire.nhs.uk/bdecisionlimits.php>

## Reference ranges and harmonization

### Pathology Harmony — consensus reference ranges

Reference ranges (reference intervals) historically varied widely between UK
laboratories, causing confusion when results moved between providers. The
**Pathology Harmony** initiative agreed consensus adult reference ranges for
common biochemistry and haematology analytes, reducing inter-laboratory
variation. The analyte columns and the approximate adult reference ranges
documented in `sql/04_create_table_blood_test_result.sql` follow these
harmonized values. Ranges remain indicative: the authoritative range is the one
issued by the reporting laboratory and may vary by sex, age, assay, and
specimen type.

Representative harmonized adult reference ranges used in this form:

| Analyte | Column | Units | Approx. adult reference |
| --- | --- | --- | --- |
| Haemoglobin | `haemoglobin_g_l` | g/L | 130–180 (M) / 115–160 (F) |
| White cell count | `white_cell_count` | ×10⁹/L | 4.0–11.0 |
| Platelets | `platelets` | ×10⁹/L | 150–400 |
| Neutrophils | `neutrophils` | ×10⁹/L | 2.0–7.5 |
| Sodium | `sodium_mmol_l` | mmol/L | 133–146 |
| Potassium | `potassium_mmol_l` | mmol/L | 3.5–5.3 |
| Urea | `urea_mmol_l` | mmol/L | 2.5–7.8 |
| Creatinine | `creatinine_umol_l` | µmol/L | 60–110 |
| eGFR | `egfr` | mL/min/1.73m² | ≥90 normal; <60 reduced |
| ALT | `alt_u_l` | U/L | ≤40–50 |
| Alkaline phosphatase | `alkaline_phosphatase` | U/L | 30–130 |
| Bilirubin | `bilirubin_umol_l` | µmol/L | ≤21 |
| Albumin | `albumin_g_l` | g/L | 35–50 |
| C-reactive protein | `c_reactive_protein` | mg/L | <5 |
| HbA1c | `hba1c_mmol_mol` | mmol/mol | <42 normal; ≥48 diabetes range |
| Glucose (fasting) | `glucose_mmol_l` | mmol/L | 3.9–5.5 |
| TSH | `tsh` | mU/L | 0.3–4.2 |
| Ferritin | `ferritin` | µg/L | 15–300 |
| INR | `inr` | ratio | 0.8–1.2 (off anticoagulation) |

Sources:

- The Approach to Pathology Harmony in the UK.
  <https://www.researchgate.net/publication/230756631_The_Approach_to_Pathology_Harmony_in_the_UK>
- Pathology harmony: Consensus reference ranges for blood counts.
  <https://www.researchgate.net/publication/296167024_Pathology_harmony_Consensus_reference_ranges_for_blood_counts>
- Reference ranges (laboratory values), Geeky Medics.
  <https://geekymedics.com/reference-ranges/>

## How the references map to the schema

| Reference | Schema element |
| --- | --- |
| Pathology Harmony reference ranges | analyte result-value columns; `abnormal_results_present`; reference-range bands in the grade |
| RCPath critical / panic value alerting | `critical_value_present`, `critical_value_detail`, Axis A *critical*, Axis D *critical-alert*, `critical-result-alert` flag |
| RCPath critical-result communication | `critical_result_communicated`, `reported_to` |
| RCPath urgent / unexpected results | `abnormal_results_present`, `abnormal-requiring-action` / `urgent-referral` flags |
| RCPath actionable reporting | `impression`, `recommended_follow_up`, follow-up-urgency axis |
| Mandatory report sections | report-completeness axis (`report_completeness_percent`) |
| eGFR CKD stage / glycaemic band | `reporting_category` (Axis B) |
