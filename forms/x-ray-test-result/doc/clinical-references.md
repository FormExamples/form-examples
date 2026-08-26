# X-Ray Test Result — clinical references

Grounded reference material for the structured interpretation and reporting of
plain-radiograph (X-ray) examinations. These sources anchor the four-axis
interpretation grade, the structured-reporting category, and the critical-result
alerting rules used by this form.

## Reporting standards

### RCR — Standards for the interpretation and reporting of imaging investigations

The Royal College of Radiologists (RCR) standards provide a baseline that all
radiology reports should achieve, so the quality and consistency of imaging
interpretation can be assured. The guidance is written by and for radiologists
but applies to **all who interpret and report imaging, regardless of
professional background** (radiologists, reporting radiographers, and other
reporting clinicians), including plain radiographs.

Key principles relevant to this form:

- **Actionable reporting** — a report should be timely, clear and precise,
  clearly address the clinical question, highlight the relevant findings, and
  offer guidance on further management, with the urgency for action clearly
  documented within the report. This maps to the form's `impression` and
  `recommended_follow_up` fields and the follow-up-urgency axis.
- **Structured sections** — clinical history, projections / technique,
  comparison, findings, and an impression/conclusion. The report-completeness
  axis scores presence of these mandatory sections.
- **Communication of critical, urgent, and unexpected significant findings** —
  the report must record that such a finding was communicated and to whom; this
  drives the `critical_result_communicated` / `reported_to` fields and the
  `critical-result-alert` safety flag.

Sources:

- Standards for interpretation and reporting of imaging investigations, RCR.
  <https://www.rcr.ac.uk/media/wlsf4ufl/ppqi_reporting-standards-guidance.pdf>
- RCR clinical radiology publications index.
  <https://www.rcr.ac.uk/our-services/all-our-publications/clinical-radiology-publications/>

### RCR — Communication of critical, urgent and unexpected significant findings

The RCR (with the National Patient Safety Agency lineage) requires fail-safe
back-up and safety-net procedures so that the communication of reports is
reliable, especially for critical, urgent, and unexpected significant findings.
Providers should create standard operating procedures that comply with national
guidelines for communicating time-critical findings and for imaging
classification for reporting priority. This underpins the form's critical-result
communication fields and the auto-escalation of Axis D to *critical-alert* for a
**pneumothorax**, **free intraperitoneal air**, or an **unstable fracture**.

Sources:

- Standards for the communication of critical, urgent and unexpected significant
  radiological findings (second edition), RCR.
  <https://rad-alert.co.uk/Standards.pdf>
- Alerts and notification of imaging reports: recommendations (October 2022),
  RCR.
  <https://www.rcr.ac.uk/media/44sfqlbi/rcr-publications_alerts-and-notification-of-imaging-reports-recommendations_october-2022.pdf>
- HSSIB — Failures in communication or follow-up of unexpected significant
  radiological findings (investigation report).
  <https://www.hssib.org.uk/patient-safety-investigations/failures-in-communication-or-follow-up-of-unexpected-significant-radiological-findings/investigation-report/>

## Structured reporting and incidental findings

Plain-radiograph reporting commonly uses a free-text structured-reporting label
(e.g. normal / abnormal-acute / abnormal-chronic) rather than a numbered
assessment-and-management system. The form stores that label in the grade's
`reporting_category` field (Axis B). Incidentally discovered abnormalities are
captured by the `incidental_finding` structured flag and the
`incidental-finding` safety-flag category, consistent with the RCR principle that
clinically significant incidental findings must be communicated and followed up.

## Appropriateness and dose context (carried from the request)

- The Royal College of Radiologists *iRefer: Making the best use of clinical
  radiology*.
  <https://www.rcr.ac.uk/our-services/all-our-publications/clinical-radiology-publications/irefer/>
- UK Ionizing Radiation (Medical Exposure) Regulations 2017 — IR(ME)R
  (justification recorded on the originating request; the result records the
  performed examination).
  <https://www.legislation.gov.uk/uksi/2017/1322/contents/made>

## How the references map to the schema

| Reference | Schema element |
| --- | --- |
| RCR actionable reporting | `impression`, `recommended_follow_up`, follow-up-urgency axis |
| RCR mandatory report sections | report-completeness axis (`report_completeness_percent`) |
| RCR critical-finding communication | `critical_result_communicated`, `reported_to`, `critical-result-alert` flag |
| RCR structured / reporting-priority label | `reporting_category` (Axis B) |
| RCR incidental-finding follow-up | `incidental_finding`, `incidental-finding` flag |
| IR(ME)R justification (from request) | `originating_request_reference` |
