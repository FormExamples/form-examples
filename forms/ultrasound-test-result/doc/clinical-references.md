# Ultrasound Test Result — clinical references

Grounded reference material for the structured interpretation and reporting of
general (non-obstetric) diagnostic ultrasound examinations. These sources anchor
the four-axis interpretation grade, the structured-reporting categories, and the
critical-result alerting rules used by this form.

## Reporting standards

### RCR — Standards for the interpretation and reporting of imaging investigations

The Royal College of Radiologists (RCR) standards provide a baseline that all
imaging reports should achieve, so the quality and consistency of imaging
interpretation can be assured. The guidance applies to **all who interpret and
report imaging, regardless of professional background** — radiologists,
sonographers, reporting radiographers, and other reporting clinicians — in both
local department and remote / teleradiology settings.

Key principles relevant to this form:

- **Actionable reporting** — a report should clearly address the clinical
  question, highlight the relevant findings, and offer guidance on further
  management. This maps to the form's `impression` and `recommended_follow_up`
  fields and the follow-up-urgency axis.
- **Structured sections** — clinical history, technique / examination adequacy,
  comparison, findings, and an impression/conclusion. The report-completeness
  axis scores presence of these mandatory sections.
- **Report attribution** — the report should state the author's name, professional
  status, registration body and registration number; this maps to the
  `clinician` table fields.
- **Communication of critical, urgent, and unexpected significant findings** —
  the report must record that such a finding was communicated and to whom; this
  drives the `critical_result_communicated` / `reported_to` fields and the
  `critical-result-alert` safety flag.

Sources:

- Standards for interpretation and reporting of imaging investigations (PPQI
  reporting-standards guidance), RCR.
  <https://www.rcr.ac.uk/media/wlsf4ufl/ppqi_reporting-standards-guidance.pdf>
- Standards for interpretation and reporting of imaging investigations (second
  edition, March 2018), RCR.
  <https://www.rcr.ac.uk/media/yiglbn35/rcr-publications_standards-for-interpretation-and-reporting-of-imaging-investigations-second-edition_march-2018.pdf>

## Structured-reporting categories

### ACR TI-RADS (thyroid)

The ACR Thyroid Imaging, Reporting and Data System (TI-RADS) standardises
reporting of thyroid ultrasounds. It scores five feature categories (composition,
echogenicity, shape, margin, echogenic foci) into a level from **TR1 (benign)**
to **TR5 (high suspicion of malignancy)**, and ties each level plus nodule size
to a management recommendation (fine-needle aspiration vs ultrasound
surveillance). The TR level is an example of the value the form stores in the
grade's `reporting_category` field for thyroid-neck studies.

- ACR Thyroid Imaging Reporting & Data System (TI-RADS).
  <https://www.acr.org/Clinical-Resources/Clinical-Tools-and-Reference/Reporting-and-Data-Systems/TI-RADS>
- ACR TI-RADS: White Paper of the ACR TI-RADS Committee, *JACR*.
  <https://www.jacr.org/article/s1546-1440(17)30186-2/fulltext>

### Breast U-classification

For breast ultrasound, a structured **U1–U5** classification (U1 normal to U5
malignant) is the analogous structured-reporting label; it is likewise stored in
the `reporting_category` field for breast studies.

## Incidental findings

Incidentally discovered abnormalities (e.g. renal or hepatic cysts, simple
adnexal cysts, small solid lesions) are common on general ultrasound. The
`incidental_finding` structured flag and the `incidental-finding` safety-flag
category record and surface these so that appropriate follow-up is not missed.

## Critical findings (auto-escalation)

A subset of sonographic findings are time-critical and **auto-escalate** Axis D
to `critical-alert` with a `critical-result-alert` flag, regardless of the other
axes:

- **DVT present** on venous Doppler (`dvt_present`) — risk of pulmonary embolism.
- **Ruptured or large abdominal aortic aneurysm** (`aneurysm`).
- **Sonographic signs of testicular torsion** (recorded in `findings_narrative`
  for scrotum-testes studies) — a surgical emergency.

These map directly to the request form's red-flag indications (suspected DVT,
suspected AAA, suspected testicular torsion) — now confirmed or excluded by the
result.

## Practice guidelines

- BMUS — Guidelines for professional ultrasound practice. <https://www.bmus.org/>
- AIUM practice parameters for the performance of abdominal, pelvic, scrotal,
  thyroid, breast, and peripheral-vascular ultrasound examinations.
  <https://www.aium.org/>

## How the references map to the schema

| Reference | Schema element |
| --- | --- |
| RCR actionable reporting | `impression`, `recommended_follow_up`, follow-up-urgency axis |
| RCR mandatory report sections | report-completeness axis (`report_completeness_percent`) |
| RCR report attribution | `clinician.name`, `clinician.role`, `clinician.registration_body`, `clinician.registration_number` |
| RCR critical-finding communication | `critical_result_communicated`, `reported_to`, `critical-result-alert` flag |
| ACR TI-RADS / breast U-classification | `reporting_category` (Axis B) |
| Incidental-findings guidance | `incidental_finding`, `incidental-finding` flag |
| Critical-finding escalation | `dvt_present`, `aneurysm`, follow-up-urgency = critical-alert |
