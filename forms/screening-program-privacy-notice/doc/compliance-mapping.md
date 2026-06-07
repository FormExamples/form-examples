# Compliance Mapping

This document maps each clause of the Screening Program Privacy Notice to
the UK GDPR / DPA 2018 / NHS-Act 2006 / Public-Health instrument that
authorises the processing.

## Article 13 fulfilment matrix

| Art. 13 item | Where satisfied in the notice |
| --- | --- |
| 13(1)(a) controller identity & contact | "Practice contact" block (practice-customisable) |
| 13(1)(a) DPO contact | "Data Protection Officer" block |
| 13(1)(c) purposes and legal basis | "How we use your information" lists screening recipients with Art. 6(1)(e), Art. 9(2)(h), and Art. 9(2)(i) bases |
| 13(1)(e) recipients | NHS England, UKHSA, named research bodies |
| 13(1)(f) international transfers | Stated as none for routine screening |
| 13(2)(a) retention | NHS Records Management Code |
| 13(2)(b) rights | Access, rectification, restriction; objection restricted under Art. 89 research safeguards |
| 13(2)(d) complaint to ICO | "How to complain" |
| 13(2)(e) statutory provision | Stated as statutory under Health and Social Care Act 2012 Secretary of State Directions |
| 13(2)(f) automated decision-making | Stated as not applicable (algorithmic triage may apply at the screening lab; if so, disclosed separately) |

## Per-flow lawful basis matrix

| Screening / audit flow | UK GDPR Art. 6 | UK GDPR Art. 9 | Common-law support | Opt-out applicable? |
| --- | --- | --- | --- | --- |
| Operational screening (invite, attend, result) | 6(1)(e) | 9(2)(h) | direct care; implied authority | No |
| Screening surveillance to UKHSA | 6(1)(c) | 9(2)(i) | statutory under Health Protection (Notification) Regulations 2010 | No |
| Screening service planning & quality audit | 6(1)(e) | 9(2)(h) | s.251 CAG approval | Yes |
| Approved screening research | 6(1)(e) | 9(2)(j) | s.251 CAG approval + HRA approval | Yes |
| Anonymised statistics | outside UK GDPR | n/a | Anonymisation Code | No (not personal data) |

## Practice-customisable block

The form includes a `practice_config` block so each practice fills in:

- Practice name and contact.
- DPO contact.
- Named local research organisations participating in screening cohorts.
- The local CAG approval reference where applicable.

This satisfies the Art. 13(1)(a) / (e) requirements at the local-controller
level without re-issuing the notice text.

## Rights interaction under Article 89

Article 89 UK GDPR (read with DPA 2018 Schedule 2 Part 6 paragraph 27)
allows restriction of certain rights where exercising them would seriously
impair the achievement of an archiving / research / statistical purpose:

- Article 21 (objection) — restricted.
- Article 15 (access) — restricted where likewise.
- Article 16 (rectification) — applies but limited where retained for
  statistical comparability.

ICO research provisions:
<https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/data-protection-and-research-information/>

## National Data Opt-Out scope

The form clarifies, per the NHS England operational policy, that the
National Data Opt-Out:

- **Does** apply to the planning / audit / research re-use of screening
  data.
- **Does not** apply to the operational screening invite, attendance, and
  result-return flow (which is direct care).
- **Does not** apply to statutory public-health disclosures to UKHSA.

Operational policy reference:
<https://digital.nhs.uk/services/national-data-opt-out/operational-policy-guidance-document>

## ISO/IEC/IEEE 26514:2022

The notice is structured per the standard's §7 content design rules:
plain-English headings, explicit recipient names, and linked references to
each authoritative instrument.
