# Fluoroscopy Test Result — clinical references

Grounded reference material for the structured interpretation and reporting of
fluoroscopy / contrast studies (barium and water-soluble swallow / meal /
follow-through / enema, defecating proctogram, hysterosalpingogram, micturating
cystourethrogram, arthrogram, and fluoroscopy-guided procedures). These sources
anchor the four-axis interpretation grade, the structured-reporting category,
and the critical-result alerting rules used by this form.

## Reporting standards

### RCR — Standards for the interpretation and reporting of imaging investigations

The Royal College of Radiologists (RCR) standards provide a baseline that all
radiology reports should achieve, so the quality and consistency of imaging
interpretation can be assured. The guidance is written by and for radiologists
but applies to **all who interpret and report imaging, regardless of
professional background** (radiologists, consultants, and reporting
radiographers).

Key principles relevant to this form:

- **Actionable reporting** — a report should clearly address the clinical
  question, highlight the relevant findings, and offer guidance on further
  management. This maps to the form's `impression` and `recommended_follow_up`
  fields and the follow-up-urgency axis.
- **Structured sections** — clinical history, technique, comparison, findings,
  and an impression/conclusion. The report-completeness axis scores presence of
  these mandatory sections.
- **Communication of critical, urgent, and unexpected significant findings** —
  the report must record that such a finding was communicated and to whom; this
  drives the `critical_result_communicated` / `reported_to` fields and the
  `critical-result-alert` safety flag.

Sources:

- Standards for interpretation and reporting of imaging investigations (third
  edition), RCR.
  <https://www.rcr.ac.uk/our-services/all-our-publications/clinical-radiology-publications/standards-for-interpretation-and-reporting-of-imaging-investigations-third-edition/>
- RCR clinical radiology publications index.
  <https://www.rcr.ac.uk/our-services/all-our-publications/clinical-radiology-publications/>

## Technique and structured-reporting standards

### ACR practice parameter for esophagrams and upper-GI examinations

The ACR–SPR–SAR practice parameter describes the indications, technique,
contrast selection, and reporting requirements for fluoroscopic esophagrams and
upper-GI examinations. It underpins the form's `study_type`, `contrast_used`,
`examination_adequacy`, and `reporting_category` fields.

- ACR–SPR–SAR Practice Parameter for the Performance of Esophagrams and Upper
  Gastrointestinal Examinations.
  <https://gravitas.acr.org/PPTS/DownloadPreviewDocument?DocId=46>
- Barium Swallow — StatPearls, NCBI Bookshelf.
  <https://www.ncbi.nlm.nih.gov/books/NBK493176/>

## Critical findings and contrast selection (perforation / leak)

A **perforation or contrast leak / extravasation** is a critical fluoroscopy
finding: it drives Axis A to `critical`, auto-escalates Axis D to
`critical-alert`, and raises the `critical-result-alert` flag, requiring the
result to be communicated to the referrer and documented in
`critical_result_communicated` / `reported_to`.

When perforation is suspected, **water-soluble (low-osmolar) contrast is the
preferred first-line agent** because free barium extravasation into the
mediastinum or peritoneum causes mediastinitis / peritonitis and is difficult to
clear surgically. A water-soluble study that is unremarkable but with persisting
clinical suspicion may be followed by a thinned-barium study, which is more
sensitive for small leaks. This maps to the `contrast_used` field and the
`discrepancy-with-request` flag (e.g. barium used where water-soluble was
indicated).

- Esophageal perforation: comparison of use of aqueous and barium-containing
  contrast media, *Radiology*.
  <https://pubs.rsna.org/doi/abs/10.1148/radiology.202.3.9051016>
- Diagnostic Utility of CT and Fluoroscopic Esophagography for Suspected
  Esophageal Perforation, *AJR*.
  <https://ajronline.org/doi/10.2214/AJR.19.22166>

## Dose context

- UK Ionising Radiation (Medical Exposure) Regulations 2017 — IR(ME)R
  (justification and dose audit; fluoroscopy screening time recorded per study).
  <https://www.legislation.gov.uk/uksi/2017/1322/contents/made>

## How the references map to the schema

| Reference | Schema element |
| --- | --- |
| RCR actionable reporting | `impression`, `recommended_follow_up`, follow-up-urgency axis |
| RCR mandatory report sections | report-completeness axis (`report_completeness_percent`) |
| RCR critical-finding communication | `critical_result_communicated`, `reported_to`, `critical-result-alert` flag |
| ACR esophagram / upper-GI practice parameter | `study_type`, `contrast_used`, `examination_adequacy`, `reporting_category` (Axis B) |
| Perforation contrast-selection evidence | `perforation_or_leak`, `contrast_used`, `discrepancy-with-request` flag |
| IR(ME)R dose audit | `screening_time_minutes` |
