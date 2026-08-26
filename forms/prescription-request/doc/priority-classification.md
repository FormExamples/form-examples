# Priority classification — Routine / Urgent / Emergency

## Routine

A *routine* prescription is one with no specific urgency; usual NHS
EPS turnaround in primary care is up to 72 hours for non-electronic
prescriptions and shorter for EPS.

- NHS Digital. *EPS for prescribers.*
  <https://digital.nhs.uk/services/electronic-prescription-service/eps-for-prescribers>

## Urgent

An *urgent* prescription requires same-day dispensing. Triggers:

- Patient has run out of essential medication.
- Discharge medication required before patient leaves the hospital
  premises.
- Clinical condition requires immediate initiation of treatment.

Operational policy: urgent prescriptions are flagged on the EPS
message header and the dispenser is alerted.

## Emergency

An *emergency* prescription is one issued in the context of an acute
clinical need where delay would cause harm. The form's *Emergency*
classification triggers a referral to the on-call clinician for
authorization.

In the UK, the *emergency supply* of prescription-only medicine
without a prescription is governed by:

- *Human Medicines Regulations 2012*, regulations 224–225 (emergency
  supply at request of a practitioner or patient).
  <https://www.legislation.gov.uk/uksi/2012/1916/contents>
- General Pharmaceutical Council. *Emergency supply guidance.*
  <https://www.pharmacyregulation.org/guidance>

## Substitution rules

The form's *Substitution Options* field captures whether the
prescriber permits substitution. In the UK:

- Generic substitution is permitted by default unless the prescriber
  has specifically directed otherwise — guidance in BNF
  *Prescribing in general practice*.
- For specific drugs and dose forms with documented bio-equivalence
  concerns (e.g. certain anti-epileptics — see NICE NG217 §1.5.6),
  substitution is *not* permitted and the prescriber must specify
  brand.
  - NICE NG217. *Epilepsies in children, young people and adults.*
    <https://www.nice.org.uk/guidance/ng217>

In the US, *generic substitution* is permitted unless the prescriber
writes *Dispense as Written* (DAW) per state pharmacy law.

## Repeat and repeat-dispensing

The form's *Request Type* field distinguishes:

- **Acute** — single supply, new prescription.
- **Repeat** — patient is on a repeat-prescription cycle managed by
  the GP practice.
- **Repeat dispensing** — patient has a batch issue, dispensed in
  installments by the same pharmacy over up to 12 months.
  - NHS England. *Electronic Repeat Dispensing (eRD).*
    <https://digital.nhs.uk/services/electronic-prescription-service/electronic-repeat-dispensing>

## Out of scope

- Clinical appropriateness check — the prescriber is responsible for
  appropriateness; the form does not perform clinical decision
  support.
- Cost-effectiveness review — handled by the practice formulary.
