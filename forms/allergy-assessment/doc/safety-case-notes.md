# Safety case notes

## Intended use

A structured-data capture form for clinical allergy history. It applies a
deterministic categorical grading rule (Low/Moderate/High/Critical) to the
captured history and flags issues that warrant clinician escalation.

## Intended user

Qualified clinician (allergist, GP, paediatrician, specialist nurse) acting
within their normal scope of practice. The form is not intended for
self-diagnosis or to substitute for clinician judgement.

## Risk classification (MDCG 2019-11 Rev.1)

- **Class:** Class I medical device software.
- **Rationale:** The output informs but does not directly drive a clinical
  decision; the grading and flagged-issue rules are explicit, deterministic
  and visible to the user, and the final referral / prescribing decision
  rests with the clinician.
- The form has no diagnostic claim; it does not assert that a patient is or
  is not allergic to a substance — it records the clinician's structured
  history and applies published grading definitions.

## Foreseeable misuse

| Misuse | Mitigation |
| --- | --- |
| Use for self-diagnosis | Plain-language disclaimer on Step 1 stating "for clinician use" |
| Omission of beta-blocker / ACEi check | Mandatory medication section in Step 8 |
| Ignoring biphasic anaphylaxis follow-up | Auto-flag in Step 6 if any prior anaphylaxis |
| Failure to issue adrenaline auto-injectors | Hard flag in summary if Critical category and no AAI prescribed |

## Regulatory framework

- EU MDR 2017/745 — Class I rule 11 software.
- UK Medical Devices Regulations 2002 (UK MDR), MHRA registration.
- MHRA *Software and AI as a medical device*, 2022.
  <https://www.gov.uk/government/publications/software-and-artificial-intelligence-ai-as-a-medical-device>
- ISO 14971:2019 Application of risk management to medical devices.
- IEC 62304:2006+A1:2015 Medical device software life-cycle processes.
- ISO/IEC/IEEE 26514:2022 — Design and development of information for users.
- ISO 27001:2022 — Information security management.

## Clinical evidence base

- NICE CG183 Drug allergy: diagnosis and management (2014).
- BSACI Anaphylaxis Guideline (Ewan et al. 2021).
- Resuscitation Council UK Emergency treatment of anaphylaxis (2021).
- EAACI Food Allergy and Anaphylaxis Guidelines (Muraro et al. 2014).
- WAO Anaphylaxis Guidance 2020 (Cardona et al. 2020).

## Data protection

- Personal allergy data is special-category personal data under UK GDPR Art.9.
- Lawful basis: Art.9(2)(h) provision of medical care for the data subject.
- Records are encrypted at rest (AES-256) and in transit (TLS 1.3).
- Audit trail of `created_at`, `updated_at`, `deleted_at`, and a separate
  `audit_log` table per the Information Governance Toolkit / Data Security and
  Protection Toolkit.

## Adverse-event reporting

Any unexpected behaviour of the form, especially one that may have masked an
anaphylaxis flag, must be reported via:

- MHRA Yellow Card scheme: <https://yellowcard.mhra.gov.uk/>
- Internal incident-reporting workflow (linked to the medical-error-report
  form in this monorepo).

## Post-market surveillance

The engine emits an event for every change in computed severity category, and
those events are aggregated into a PMS dashboard for the medical-device
manufacturer. Trend analysis is performed quarterly and incorporated into the
clinical evaluation plan.

## See also

- [grading-rules.md](grading-rules.md)
- [clinical-guideline-alignment.md](clinical-guideline-alignment.md)
- [assessment-protocol.md](assessment-protocol.md)
- [references.md](references.md)
