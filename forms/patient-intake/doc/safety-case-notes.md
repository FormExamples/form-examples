# Safety case notes — patient intake

## Risk pathway — High risk classification

The form's *High* risk level is a triage signal to the receiving
clinician that the record contains one or more flags warranting
clinician review *before* the encounter. It is **not** a clinical
risk score; it must not be used to allocate clinical resources,
prescribe, or deny care.

Documented composite-flag triggers should include:

- Drug allergy with history of anaphylaxis (NICE CG183).
- Active suicidal ideation disclosed (NICE NG225).
- Multiple high-risk medications (e.g. anticoagulants, opioids,
  immunosuppressants).
- Pregnancy with potentially teratogenic medication on the
  medications list.

## Allergy review

- NICE CG183. *Drug allergy: diagnosis and management.*
  <https://www.nice.org.uk/guidance/cg183>
- BNF *Drug allergy and cross-sensitivity.*
  <https://bnf.nice.org.uk/>

Allergy data captured at intake must be visible to every clinician
handling the encounter; the receiving EHR is responsible for that
display.

## Mental health and safeguarding

- NICE NG225. *Self-harm: assessment, management and preventing
  recurrence.* <https://www.nice.org.uk/guidance/ng225>
- NHS England. *Safeguarding adults and children.*
  <https://www.england.nhs.uk/safeguarding/>
- *Care Act 2014.* <https://www.legislation.gov.uk/ukpga/2014/23/contents>

Any disclosure of abuse, neglect, coercive control, or active
suicidal ideation is *not* an intake record event; it is a
safeguarding event and must be escalated per local policy on the
same working day.

## Identification accuracy

- WHO. *Patient Safety Solutions — Patient Identification.*
  <https://www.who.int/publications/i/item/patient-identification>
- NHS Digital. *NHS Number policy and guidance.*
  <https://digital.nhs.uk/services/personal-demographics-service/nhs-number>

Two-factor identification (name + DOB at minimum) is the operational
expectation.

## Free-text and PHI handling

- Free-text fields (chief complaint, review of systems narrative)
  often contain PHI of third parties. Operational guidance: redact
  third-party identifiers before sharing the record outside the
  treating organization.
- Audit trail must capture every read/write to the intake record per
  HIPAA §164.312 (US) / NHS England Data Security and Protection
  Toolkit (UK).
  <https://www.dsptoolkit.nhs.uk/>

## Out of scope

- This form does not perform clinical decision support — it captures
  data for the clinician to interpret.
- This form does not authenticate the patient — that is an EHR /
  portal function.
