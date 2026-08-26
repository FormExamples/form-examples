# Cystoscopy Test Result — clinical references

Grounded reference material for the structured interpretation and reporting of
cystoscopy (bladder endoscopy) examinations. These sources anchor the four-axis
interpretation grade, the structured-reporting categories, the surveillance
follow-up intervals, and the critical-result alerting rules used by this form.

## Reporting standards

### BAUN / BAUS — Flexible Cystoscopy guidelines

The British Association of Urological Nurses (BAUN) and British Association of
Urological Surgeons (BAUS) flexible-cystoscopy guidance set performance criteria
for the procedure and its report. They require a **complete examination of the
bladder urothelium**, correct **identification of bladder landmarks**, and a
written **report of the procedure and findings**, with an **action plan for
follow-up** explained to the patient.

Key principles relevant to this form:

- **Actionable reporting** — the report should describe the findings, give an
  impression, and offer guidance on further management. This maps to the form's
  `impression` and `recommended_follow_up` fields and the follow-up-urgency axis.
- **Structured sections** — clinical history, procedure (with anaesthesia),
  findings, impression, and follow-up. The report-completeness axis scores
  presence of these mandatory sections.
- **Communication of suspicious / unexpected findings** — when a bladder tumour
  or suspicious lesion is seen, the report must record that the finding was
  communicated and to whom; this drives the `critical_result_communicated` /
  `reported_to` fields and the `critical-result-alert` safety flag.

Sources:

- BAUN and BAUS Guidelines — Flexible Cystoscopy.
  <https://www.baus.org.uk/_userfiles/pages/files/Publications/FlexiGuidelines.pdf>
- BAUN / BAUS Flexible Cystoscopy Training and Assessment Guideline (November
  2017).
  <https://www.baus.org.uk/_userfiles/pages/files/Publications/BAUN%20BAUS%20Flexible%20Cystoscopy%20Guidelines%20-%20November%202017.pdf>

## Structured-reporting categories and surveillance

### NICE NG2 — Bladder cancer: diagnosis and management

NICE NG2 sets risk-stratified cystoscopic surveillance intervals for
non-muscle-invasive bladder cancer (NMIBC). The risk group label is an example
of the value the form stores in the grade's `reporting_category` field, and the
recommended interval anchors the follow-up-urgency axis and
`recommended_follow_up`:

| NMIBC risk group | Cystoscopic surveillance (NICE NG2) |
| --- | --- |
| Low risk | Cystoscopy at 3 and 12 months; discharge to primary care if recurrence-free at 12 months. |
| Intermediate risk | Cystoscopy at 3, 9 and 18 months, then yearly; consider discharge after 5 disease-free years. |
| High risk | Cystoscopy every 3 months for 2 years, then every 6 months for 2 years, then yearly. |

When a **bladder tumour or suspicious lesion** is seen for the first time, the
finding is a critical result: it auto-escalates the follow-up-urgency axis to
`critical-alert`, drives an `urgent-referral` / `specialist-referral`
recommendation, and the suggested action is **urgent TURBT (transurethral
resection of bladder tumour) and/or MDT referral**.

Sources:

- NICE NG2 *Bladder cancer: diagnosis and management*.
  <https://www.nice.org.uk/guidance/ng2>
- NICE NG2 recommendations.
  <https://www.nice.org.uk/guidance/ng2/chapter/Recommendations>

### Cystoscopic appearance of tumours

The structured `tumour_appearance` field (papillary / solid / flat) reflects the
endoscopic morphology recorded at cystoscopy, which — together with
`tumour_size_mm` and `biopsy_taken` — supports categorization and the decision
to proceed to resection / histopathology.

- Cancer Research UK — Cystoscopy to check for cancer (assessment of tumour size
  and location; biopsy at the time of cystoscopy).
  <https://www.cancerresearchuk.org/about-cancer/tests-and-scans/cystoscopy>

## How the references map to the schema

| Reference | Schema element |
| --- | --- |
| BAUS/BAUN actionable reporting | `impression`, `recommended_follow_up`, follow-up-urgency axis |
| BAUS/BAUN mandatory report sections | report-completeness axis (`report_completeness_percent`) |
| BAUS/BAUN suspicious-finding communication | `critical_result_communicated`, `reported_to`, `critical-result-alert` flag |
| NICE NG2 NMIBC risk group | `reporting_category` (Axis B) |
| NICE NG2 surveillance intervals | `recommended_follow_up`, follow-up-urgency axis (`target_timeframe`) |
| Cystoscopic tumour morphology | `tumour_appearance`, `tumour_size_mm`, `biopsy_taken` |
