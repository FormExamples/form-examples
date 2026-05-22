# Clinical Safety Case Notes (DCB0129 / DCB0160)

Placeholder for the NHS Digital clinical safety documentation. The
detailed safety case is **deferred** (see `tasks.md`) and must be
authored by a Clinical Safety Officer (CSO) before the form is deployed
into an NHS environment.

## Standards

- **DCB0129** — *Clinical Risk Management: its Application in the
  Manufacture of Health IT Systems.* Mandatory for organisations
  manufacturing health IT for use in the NHS.
- **DCB0160** — *Clinical Risk Management: its Application in the
  Deployment and Use of Health IT Systems.* Mandatory for NHS
  organisations deploying health IT.

## Scope

This form is a **clinician-driven prescription document** with a rule-
based classification engine. Its classification output is **advisory**:
the prescriber signs the final prescription and is the legally
responsible party.

Risk classification under MDCG 2019-11 Rev.1: **Class I** if used purely
as a record-keeping tool, **Class IIa** if the lens recommendation is
the primary clinical output driving dispensing.

## Foreseeable hazards (initial register)

| # | Hazard | Cause | Severity | Likelihood | Mitigation |
| --- | --- | --- | --- | --- | --- |
| H-01 | Incorrect lens dispensed | Wrong sign convention entered | Catastrophic | Low | Sign-convention validation, plus-cylinder display toggle, audit log |
| H-02 | Astigmatism axis off by 90° | Plus / minus cylinder confusion | Major | Low | Storage in single (minus) convention; conversion is UI-only |
| H-03 | Adaptation symptoms (headache, dizziness) | Significant change vs. prior not flagged | Moderate | Medium | `R-CHANGE-01` rule fires when sphere change > 1.00 D |
| H-04 | Missed amblyopia (paediatric) | Anisometropia not flagged | Catastrophic | Low | `R-ANISO-01` rule + `paediatric` flag combination |
| H-05 | Missed glaucoma | Raised IOP not flagged | Catastrophic | Low | Step 10 captures IOP per eye; threshold flag (deferred) |
| H-06 | Missed diabetic retinopathy | Fundus finding not recorded | Catastrophic | Low | Step 10 captures fundus findings; `ocular-pathology` flag |
| H-07 | Wrong patient | Patient identification error | Catastrophic | Low | NHS number validation (deferred — PDS integration) |
| H-08 | Expired prescription dispensed | Expiry not enforced | Major | Low | `prescription-expired` flag; dashboard filter |
| H-09 | Invalid axis (0°) | Data entry error | Minor | Medium | CHECK constraint at SQL layer + front-end validator |
| H-10 | Invalid sphere magnitude (> +30 / < -30) | Data entry error | Major | Low | CHECK constraint at SQL layer + front-end validator |

## Outstanding actions

- [ ] Appoint Clinical Safety Officer (CSO).
- [ ] Complete the Clinical Safety Case Report per DCB0129 §3.5.
- [ ] Author Hazard Log per DCB0129 §3.4 (the table above is the seed).
- [ ] Identify Clinical Safety Officer at deploying organisation per
      DCB0160.
- [ ] Complete Clinical Safety Case Report per DCB0160 §3.6.
- [ ] User acceptance testing with a real GOC-registered optometrist
      cohort.
- [ ] Schedule annual review cycle.

## References

- NHS England *Clinical Risk Management Standards*:
  <https://digital.nhs.uk/services/clinical-safety>
- DCB0129 v4.2 (2018).
- DCB0160 v3.2 (2018).
- MDCG 2019-11 Rev.1.
- UK Medical Devices Regulations 2002.
- UK MHRA *Software and AI as a Medical Device*.
