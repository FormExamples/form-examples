# Safety Case Notes — Ergonomic Assessment

## Regulatory framework

The ergonomic assessment is primarily a health-and-safety instrument
rather than a medical device. Nevertheless this form is delivered in a
healthcare-aligned monorepo and conforms to the project's standard
compliance scaffold.

- HSE *Health and Safety at Work etc. Act 1974*:
  https://www.legislation.gov.uk/ukpga/1974/37/contents
- *Manual Handling Operations Regulations 1992* (as amended):
  https://www.legislation.gov.uk/uksi/1992/2793/contents
- *Health and Safety (Display Screen Equipment) Regulations 1992*:
  https://www.legislation.gov.uk/uksi/1992/2792/contents
- *Management of Health and Safety at Work Regulations 1999*:
  https://www.legislation.gov.uk/uksi/1999/3242/contents
- DCB 0129 / DCB 0160 (where the assessment is part of an NHS service):
  https://digital.nhs.uk/services/clinical-safety/clinical-risk-management-standards
- MDCG 2019-11 Rev.1 (decision-support classification reference).
- UK MHRA *Software and AI as a Medical Device*.
  https://www.gov.uk/government/publications/software-and-artificial-intelligence-ai-as-a-medical-device

## Device classification position

REBA scoring is deterministic and the action levels are taken verbatim
from Hignett & McAtamney 2000. The form is decision support: the
ergonomics practitioner or occupational health professional retains
authority for the action plan.

## Hazards and mitigations

| Hazard | Mitigation |
| --- | --- |
| Under-grading high-risk posture | REBA scoring is deterministic; any score ≥ 8 forces "high" or "very high" with mandatory action plan |
| Failure to escalate near-miss / acute injury | Step 6 captures recent acute symptom or injury; presence triggers immediate occupational-health referral prompt |
| Manual handling assessment skipped where required | Step 5 mandatory when role involves lifting, carrying, pushing or pulling; MHOR-required |
| DSE assessment incomplete | Step 2 enforces all DSE Regulations 1992 / L26 items for workstation-based roles |
| Vulnerable worker not flagged | Step 1 captures age, pregnancy, disability where worker has chosen to disclose; vulnerable-worker flag triggers tailored risk assessment per MHSWR 1999 |
| Psychosocial risk hidden by physical-only assessment | Step 9 captures HSE Management Standards domains; severe scores trigger occupational-health referral |
| Worker confidentiality breach | Health data captured under Article 9 GDPR special category; access restricted to occupational-health and the worker |
| Employer pressure to under-report | Form supports anonymous-mode submission via tokenized link for occupational-health-led services |

## Information governance

- UK GDPR / Data Protection Act 2018 — special-category data.
- ICO *Employment practices code*.
  https://ico.org.uk/for-organizations/employment/
- Where the assessment is conducted within an NHS service, NHS DSPT
  applies.
- Worker records retained per local occupational-health retention schedule.

## Action plan accountability

- Step 10 records the action plan with:
  - Specific control measures
  - Hierarchy of control (elimination, substitution, engineering controls,
    administrative controls, PPE)
  - Responsible person
  - Review date
- Where action requires capital expenditure or organizational change, the
  form signposts to the employer's safety-management system.

## Worker rights signposting

- Worker rights under Health and Safety at Work etc. Act 1974 and
  the Employment Rights Act 1996.
- HSE *Workers' rights* guidance:
  https://www.hse.gov.uk/workers/index.htm

## Audit and traceability

- Each REBA component is timestamped and attributed.
- Computed REBA score, action level, and clinician-confirmed action plan
  stored side by side.
- Reassessment cadence captured for each high-risk role.
