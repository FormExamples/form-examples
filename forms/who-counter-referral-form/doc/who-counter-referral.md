# WHO Counter-Referral Form

This form implements the WHO standardised counter-referral form for
discharging patients back from a referral facility to their primary care
facility (or to the initiating facility that referred them). It is the
return complement to the WHO Acute Referral Form.

## Authoritative WHO sources

- **Form PDF** — WHO. *Counter-Referral Form*.
  <https://cdn.who.int/media/docs/default-source/integrated-health-services-(ihs)/csy/ect/counter-referral-form.pdf>
- **Emergency Care Toolkit** —
  <https://www.who.int/teams/integrated-health-services/clinical-services-and-systems/emergency-and-critical-care>
- **WHO Basic Emergency Care (BEC).** Geneva: WHO; 2018.
  ISBN 978-92-4-151308-1.
  <https://www.who.int/publications/i/item/basic-emergency-care-approach-to-the-acutely-ill-and-injured>
- **WHO IMAI / IMCI referral framework.**
  <https://www.who.int/publications/i/item/9789241544016>

## Counter-referral concept

In the WHO Integrated Management of Adolescent and Adult Illness (IMAI)
framework the referral chain is bidirectional:

- **Upward referral** — primary care or initiating facility refers the
  patient *up* to a referral facility for higher-acuity or specialty
  care. Documented on the WHO Acute Referral Form.
- **Counter-referral (downward referral)** — referral facility discharges
  the patient *down* to the primary care facility for continuing care.
  Documented on the WHO Counter-Referral Form.

Without the counter-referral step, continuity of care breaks: the
primary-care provider does not know what happened during the inpatient
stay, what investigations were done, what treatment was changed, or
what follow-up is required.

## SBAR communication framework

Like the Acute Referral Form, the Counter-Referral Form is structured
around **SBAR**:

| SBAR | Form section |
| --- | --- |
| **S**ituation | Chief complaint, primary diagnosis, treatments initiated, ICU/surgery/hospitalised flags |
| **B**ackground | History of present illness, past medical history, significant investigations and events |
| **A**ssessment | Final diagnoses / problem list, prognosis, goals of care, patient / family informed |
| **R**ecommendations | Follow-up plan, pending investigations, follow-up arrangements, deterioration instructions |

## Facility relationships

The form distinguishes three possible facilities:

1. **Initiating facility** — the facility that originally referred the
   patient (named on the Acute Referral Form).
2. **Referral facility** — the facility that received the patient and
   provided the inpatient care. Completes this form.
3. **Primary care facility** — the patient's ongoing primary care
   provider. May be the same as the initiating facility, or may differ
   (e.g. the initiating facility was an emergency unit; the primary care
   facility is the patient's local health centre).

The form supports this three-way relationship explicitly so the
correct downstream provider receives the discharge information.

## Communication checkboxes

Two communication checkboxes confirm the counter-referral conversation:

- "Discussed follow-up care with primary care provider"
- "Discussed follow-up care with initiating facility"

At least one of these must be checked. Best practice (WHO IMAI) is for
both to be checked when the primary care and initiating facilities
differ.

## Follow-up timeframe

Four bands captured for the urgency of primary-care follow-up:

| Band | Typical conditions |
| --- | --- |
| **Urgent** (within 24 hours) | Post-discharge sepsis, recent acute coronary syndrome, recent stroke, decompensated heart failure, anticoagulant initiation, severe asthma exacerbation, post-deliberate self-harm |
| **2-6 days** | Hospitalisation for moderate exacerbation, post-procedural review, new diabetes diagnosis |
| **1-2 weeks** | Routine post-hospitalisation review, stable chronic-disease follow-up |
| **>2 weeks** | Long-term review, low-acuity discharges |

## Status flags

The Recommendations section captures five status flags that materially
affect ongoing care:

- **Cognitive impairment** — implications for medication adherence,
  capacity, safeguarding.
- **Carer-dependent** — implications for community support, social
  work referral.
- **Spinal precautions** — implications for safe handling, mobility
  assessment.
- **Weight-bearing restrictions** — implications for physiotherapy,
  home adaptations.
- **Palliative care** — implications for advance-care planning, DNACPR
  status, community palliative team referral.

## Pending investigations

The form prompts the referral facility to list any investigation results
still pending at the time of discharge (e.g. histology, microbiology
final report) and to specify who will action them. Failing to action
pending results is a recognised source of avoidable patient harm — see
the WHO patient-safety curriculum and the UK General Medical Council
*Good medical practice* duties.

References:
- WHO. *Patient safety curriculum guide: multi-professional edition*.
  Geneva: WHO; 2011. ISBN 978-92-4-150195-8.
  <https://www.who.int/publications/i/item/9789241501958>
- General Medical Council. *Good medical practice*. London: GMC; 2024.
  <https://www.gmc-uk.org/professional-standards/professional-standards-for-doctors/good-medical-practice>

## Deterioration instructions

The form requires explicit, written instructions for what the patient or
carer should do if specified symptoms recur or worsen — for example,
"return immediately to A&E if breathlessness or chest pain returns; call
the GP surgery on day 3 if cough persists; attend the wound-care clinic
on day 7."

These safety-netting instructions reduce avoidable readmissions and are
endorsed by NICE NG94 *Emergency and acute medical care* recommendations.

Reference: NICE NG94. *Emergency and acute medical care in over 16s:
service delivery and organisation*. 2018.
<https://www.nice.org.uk/guidance/ng94>

## Patient / family informed

The Assessment section captures whether the patient and / or family have
been told of the diagnoses, prognosis, and follow-up plan. This is a
prerequisite for informed consent to discharge under common law and the
UK Mental Capacity Act 2005.

Reference: Mental Capacity Act 2005 (c. 9).
<https://www.legislation.gov.uk/ukpga/2005/9/contents>

## Versioning note

The Counter-Referral Form is part of the WHO Emergency Care Toolkit
Referral Forms package. Implementations should record the SHA-256 of
the downloaded PDF at the time of import.

## References

- WHO. *Counter-Referral Form* (PDF) — see header.
- WHO. *Basic Emergency Care*. 2018.
- WHO. *IMAI / IMCI*.
  <https://www.who.int/publications/i/item/9789241544016>
- WHO. *Patient safety curriculum guide*. 2011. ISBN 978-92-4-150195-8.
- NICE NG94. *Emergency and acute medical care in over 16s*. 2018.
  <https://www.nice.org.uk/guidance/ng94>
- General Medical Council. *Good medical practice*. 2024.
  <https://www.gmc-uk.org/professional-standards/professional-standards-for-doctors/good-medical-practice>
