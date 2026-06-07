# Clinical Guideline Alignment

The palliative assessment combines ESAS-r symptom scoring with
performance status, goals-of-care and advance-care-planning
documentation, medication / symptom-control planning, and
psychosocial / spiritual review. The following authoritative sources
informed the field set and rule catalogue.

## NICE guidance

| Code | Title | URL |
| --- | --- | --- |
| NG142 | End of life care for adults: service delivery | https://www.nice.org.uk/guidance/ng142 |
| NG31 | Care of dying adults in the last days of life | https://www.nice.org.uk/guidance/ng31 |
| QS13 | Quality standard for end of life care for adults | https://www.nice.org.uk/guidance/qs13 |
| QS144 | Quality standard for care of dying adults in the last days of life | https://www.nice.org.uk/guidance/qs144 |
| CG140 | Opioids in palliative care: safe and effective prescribing of strong opioids | https://www.nice.org.uk/guidance/cg140 |
| CKS | Clinical Knowledge Summaries — Palliative care | https://cks.nice.org.uk/specialities/palliative-care-general-issues |

The form's goals-of-care fields on Step 5 are aligned to the NG142 §
1.4 recommendations on individualised care planning.

NG31 *Care of dying adults in the last days of life* (2015) replaces the
Liverpool Care Pathway, which was withdrawn following the 2013
*More Care, Less Pathway* (Neuberger) review. The fields on Steps 5, 6,
and 9 reflect the NG31 emphasis on individualised assessment and shared
decision-making rather than a single end-of-life "pathway".

## WHO

- WHO definition of palliative care.
  https://www.who.int/health-topics/palliative-care
- WHO *Integrating palliative care and symptom relief into the
  responses to humanitarian emergencies and crises.* WHO 2018.
- WHO Analgesic Ladder for cancer pain (still cited as Step 1-3
  framework although the absolute prominence of Step 2 weak opioids has
  been debated).

## Royal College of Physicians (RCP)

- RCP *Talking about dying: how to begin honest conversations about
  what lies ahead.*
  https://www.rcp.ac.uk/projects/outputs/talking-about-dying-how-begin-honest-conversations-about-what-lies-ahead

## Marie Curie / Hospice UK / Sue Ryder

- Marie Curie clinical content for professionals.
  https://www.mariecurie.org.uk/professionals
- Hospice UK guidance and standards.
  https://www.hospiceuk.org

## Advance care planning

UK advance care planning documents recorded on Step 5 include (presence
yes/no, location-of-document free text):

- ReSPECT (Recommended Summary Plan for Emergency Care and Treatment).
  https://www.resus.org.uk/respect
- Advance Decision to Refuse Treatment (ADRT) — see separate form
  `advance-decision-to-refuse-treatment` in this monorepo.
- Advance Statement — see separate form
  `advance-statement-about-care`.
- Lasting Power of Attorney for Health and Welfare — see separate form
  `united-kingdom-lasting-power-of-attorney-for-health-and-care-decisions`.
- Do Not Attempt Cardiopulmonary Resuscitation (DNACPR) decision — UK
  national DNACPR form.

The engine records the presence and location of these documents but
does not re-encode their content; if absent, it flags "Consider
discussing advance care planning."

## What this engine does NOT score

- We do not compute the Palliative Prognostic Score (PaP).
- We do not compute the Palliative Prognostic Index (PPI).
- We do not compute the Karnofsky → PPS → ECOG conversions.
- We do not assign a "phase of illness" (Australian PCOC categories).
- We do not generate a prescription. Step 6 captures the existing
  symptom-control plan only.

## Patient self-report caveats

ESAS-r is validated as a patient self-report instrument. Where the
patient is unable to self-report (cognitive impairment, sedation,
end-stage delirium), Step 3 captures whether the assessment is
patient-reported, carer-reported, or clinician-rated. The Watanabe
2011 ESAS-r validation paper notes acceptable but reduced reliability
for proxy reporting.
