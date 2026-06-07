# SAFER patient-flow bundle

The SAFER patient-flow bundle is the NHS Improvement / NHS England
care bundle for improving inpatient flow. The discharge summary
produced by this form is the artefact that closes the SAFER loop on
*expected discharge date* and *senior review*.

- NHS Improvement (now NHS England). *SAFER patient flow bundle.*
  Index: <https://www.england.nhs.uk/sustainableimprovement/safer-patient-flow-bundle/>
- The five SAFER elements:
  - **S** — Senior review before midday
  - **A** — All patients have an *Expected Discharge Date* and
    Clinical Criteria for Discharge
  - **F** — Flow of patients commences at the earliest opportunity
  - **E** — Early discharge — 33% of patients discharged before midday
  - **R** — Review — multi-disciplinary review of patients with
    extended length of stay

## Discharge to Assess (D2A)

D2A is the NHS England *Hospital discharge and community support*
operating model that supersedes the older "discharge to assess" pilot
programmes.

- *Hospital discharge and community support: policy and operating
  model* (2022, updated).
  <https://www.gov.uk/government/publications/hospital-discharge-and-community-support-policy-and-operating-model>
- The four discharge pathways:
  - **Pathway 0** — simple discharge home (no new social care)
  - **Pathway 1** — discharge home with new health or social care
    support
  - **Pathway 2** — discharge to a community bed for short-term
    rehabilitation
  - **Pathway 3** — discharge to a care home for assessment

This form captures the pathway in the *Follow-up Arrangements* step
(field name: `dischargePathway`).

## SBAR communication

The *Clinician Sign-off* and *Community Care Instructions* steps
follow the **SBAR** (Situation–Background–Assessment–Recommendation)
structure recommended by NHS England for clinical handover.

- NHS England. *SBAR communication tool — situation, background,
  assessment, recommendation.*
  <https://www.england.nhs.uk/wp-content/uploads/2021/03/qsir-sbar-communication-tool.pdf>
- WHO. *Communication during patient handovers.* Patient Safety
  Solutions, volume 1, solution 3, May 2007.
  <https://www.who.int/publications/i/item/communication-during-patient-hand-overs>

## Discharge completeness — derivation of "Complete / Partial / Incomplete"

The validator categories used by this form are derived from the
*mandatory* vs *optional* designation in the PRSB *eDischarge summary
standard*. The PRSB standard does not itself define a three-band
completeness label; the bands are an implementation convenience that:

- **Complete** = all PRSB mandatory headings present and non-empty.
- **Partial** = one or more PRSB *recommended* (non-mandatory) headings
  empty; mandatory headings all present.
- **Incomplete** = one or more PRSB *mandatory* headings empty.

PRSB membership and the live standard list:
<https://theprsb.org/standards/>
