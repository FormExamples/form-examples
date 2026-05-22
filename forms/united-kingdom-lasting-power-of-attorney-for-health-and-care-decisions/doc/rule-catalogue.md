# LPA Validity Rule Catalogue

Canonical catalogue of every rule that the validity engine
(`calculateLpaValidity` in SvelteKit / static-HTML, `calculate_lpa_validity`
in Rust) is expected to evaluate. Rule identifiers are stable across
releases and across implementations; they are persisted in
`lpa_validity_fired_rule.rule_id`.

## Severity ladder

| Severity | Effect on `validityStatus` | Effect on `additionalFlags` |
| --- | --- | --- |
| `fatal` | sets `'invalid'`; blocks OPG submission | — |
| `high` | sets `'needs-correction'` unless any fatal fired | — |
| `medium` | does not change status | always surfaces |
| `informational` | does not change status | surfaces when relevant |

The composite cascade is: any **fatal** → `invalid`; else any **high** →
`needs-correction`; else `ready-to-register`.

## Donor rules (`R-MCA-S9-…`, `R-MCA-S10-…`)

| Rule ID | Predicate | Severity | Source |
| --- | --- | --- | --- |
| `R-MCA-S9-AGE` | donor age at signing ≥ 18 | fatal | MCA 2005 s.9(2)(c) |
| `R-MCA-S10-CAP` | donor.capacity_declared = 'yes' at signing | fatal | MCA 2005 s.9(2)(b) |
| `R-MCA-DONOR-JURISDICTION` | donor.jurisdiction ∈ {england, wales} | fatal | MCA 2005 (extent) |
| `R-MCA-DONOR-NAME` | donor.given_names and donor.family_name both populated | high | LP1H s.1 |
| `R-MCA-DONOR-ADDRESS` | donor.postal_address_as_full_text populated | high | LP1H s.1 |
| `R-MCA-DONOR-DOB` | donor.birth_date populated | high | LP1H s.1 |

## Attorney rules (`R-MCA-ATT-…`)

| Rule ID | Predicate | Severity | Source |
| --- | --- | --- | --- |
| `R-MCA-ATT-COUNT-MIN` | at least 1 attorney | fatal | MCA 2005 s.10(1) |
| `R-MCA-ATT-COUNT-MAX` | at most 4 attorneys | fatal | LP1H s.2 |
| `R-MCA-ATT-AGE` | every attorney age ≥ 18 | fatal | MCA 2005 s.10(1)(a) |
| `R-MCA-ATT-CAP` | every attorney capacity_declared = 'yes' | fatal | MCA 2005 s.10(1)(b) |
| `R-MCA-ATT-DISTINCT` | no attorney appears twice in the same LPA | fatal | LP1H s.2 |
| `R-MCA-ATT-NOT-DONOR` | no attorney is the donor | fatal | MCA 2005 s.10(1) |
| `R-MCA-ATT-BANKRUPT` | flag when any attorney.is_bankrupt = 'yes' | medium | MCA 2005 s.10(2) (note: bankruptcy bar is for P&FA LPAs only) |
| `R-MCA-REPL-COUNT-MAX` | at most 4 replacement attorneys | fatal | LP1H s.4 |
| `R-MCA-REPL-AGE` | every replacement attorney age ≥ 18 | fatal | MCA 2005 s.10(1)(a) |
| `R-MCA-REPL-DISTINCT` | no replacement attorney is also a primary attorney | high | OPG LP12 |

## Decision-rule rules (`R-MCA-JOINT-…`)

| Rule ID | Predicate | Severity | Source |
| --- | --- | --- | --- |
| `R-MCA-JOINT-CHOICE` | decision_rule populated | high | LP1H s.3 |
| `R-MCA-JOINT-MIXED-SCOPE` | when decision_rule = 'mixed', joint_decision_set populated | high | LPA Regs 2007 Sch.1 |
| `R-MCA-JOINT-COLLAPSE` | flag when decision_rule = 'jointly' AND replacement attorneys named | medium | OPG LP12 (joint cascade) |

## Certificate-provider rules (`R-MCA-CP-…`)

| Rule ID | Predicate | Severity | Source |
| --- | --- | --- | --- |
| `R-MCA-CP-PRESENT` | lpa.certificate_provider_id populated | fatal | LPA Regs 2007 Sch.1 Pt.2 |
| `R-MCA-CP-FAM` | certificate_provider.declared_not_family = 'yes' | fatal | LPA Regs 2007 Sch.1 Pt.2 |
| `R-MCA-CP-EMP` | certificate_provider.declared_not_employee = 'yes' | fatal | LPA Regs 2007 Sch.1 Pt.2 |
| `R-MCA-CP-ATT` | certificate_provider.declared_not_attorney = 'yes' | fatal | LPA Regs 2007 Sch.1 Pt.2 |
| `R-MCA-CP-ROUTE` | route = 'skill-based' AND profession populated; OR route = 'knowledge-based' AND years_known_donor ≥ 2 | fatal | LPA Regs 2007 Sch.1 Pt.2 |
| `R-MCA-CP-REGISTRATION` | when route = 'skill-based', profession_registration_number populated | high | OPG guidance |

## Life-sustaining-treatment rules (`R-MCA-LST-…`)

| Rule ID | Predicate | Severity | Source |
| --- | --- | --- | --- |
| `R-MCA-LST-CHOICE` | lpa_lst_choice.lst_choice ∈ {option-a, option-b} | fatal | MCA 2005 s.11(7) |
| `R-MCA-LST-INITIAL` | when lst_choice populated, donor_initialled = 'yes' | fatal | LP1H s.5 |

## Signature-order rules (`R-MCA-ORDER`, `R-MCA-WIT-…`)

| Rule ID | Predicate | Severity | Source |
| --- | --- | --- | --- |
| `R-MCA-SIG-DONOR` | a donor signature exists with signed_at populated | fatal | LP1H s.9 |
| `R-MCA-SIG-CP` | a certificate-provider signature exists with signed_at populated | fatal | LP1H s.10 |
| `R-MCA-SIG-ATT-ALL` | every named attorney has a corresponding signature | fatal | LP1H s.11 |
| `R-MCA-ORDER-DONOR-FIRST` | donor.signed_at ≤ certificate_provider.signed_at | fatal | LPA Regs 2007 Sch.1 |
| `R-MCA-ORDER-CP-BEFORE-ATT` | certificate_provider.signed_at ≤ each attorney.signed_at | fatal | LPA Regs 2007 Sch.1 |
| `R-MCA-WIT-NOT-ATT` | for every signature, witness_is_attorney = 'no' | fatal | LPA Regs 2007 Sch.1 |
| `R-MCA-WIT-NOT-DONOR` | the witness on the donor's signature is not the donor | fatal | LPA Regs 2007 Sch.1 |

## Instruction rules (`R-MCA-INSTR-…`, `R-MCA-COP-…`)

| Rule ID | Predicate | Severity | Source |
| --- | --- | --- | --- |
| `R-MCA-INSTR-LAW` | every instruction.lawfulness_assessed = 'yes' | high | MCA 2005 s.9(4) |
| `R-MCA-INSTR-ADRT` | no instruction.contradicts_adrt = 'yes' | high | MCA 2005 s.25 |
| `R-MCA-COP-PROHIBITED` | no instruction authorises assisted dying or unlawful restraint | fatal | Suicide Act 1961 s.2; MCA 2005 s.6 |

## Registration rules (`R-MCA-REG-…`, `R-MCA-NOTIFY-…`, `R-MCA-FEE-…`)

| Rule ID | Predicate | Severity | Source |
| --- | --- | --- | --- |
| `R-MCA-NOTIFY-MAX` | at most 5 persons to notify | fatal | LPA Regs 2007 |
| `R-MCA-REG-APPLICANT` | lpa_registration_application.applicant_role populated | fatal | LPA Regs 2007 reg.6 |
| `R-MCA-REG-SIGNED` | lpa_registration_application.applicant_signed_at populated | fatal | LPA Regs 2007 reg.6 |
| `R-MCA-FEE` | fee_amount_pounds > 0 OR fee_remission ∈ {half, full-exempt} | fatal | LPA Regs 2007 reg.6 |
| `R-MCA-FEE-REASON` | when fee_remission ≠ 'none', fee_remission_reason populated | high | LPA Regs 2007 reg.6 |

## Informational rules

| Rule ID | Predicate | Severity | Source |
| --- | --- | --- | --- |
| `R-MCA-WALES` | flag when donor.preferred_language = 'cy'; Welsh-language LP1H is available | informational | Welsh Language (Wales) Measure 2011 |
| `R-MCA-DIGITAL-CHANNEL` | flag when submission_channel = 'opg-digital'; depends on Powers of Attorney Act 2023 commencement | informational | Powers of Attorney Act 2023 |

## Non-rule flags (informational only, surfaced via `lpa_validity_additional_flag`)

| Flag category | Trigger | Suggested action |
| --- | --- | --- |
| `donor-capacity-concern` | answers suggest fluctuating capacity | request a capacity assessment under MCA s.2 |
| `coercion-concern` | preferences / witness identity suggests undue influence | the certificate provider should re-interview the donor in private |
| `adrt-conflict` | paired ADRT row contradicts an instruction | reconcile ADRT and LPA instructions |
| `foreign-domicile` | donor.country_as_iso_3166_1_alpha_2 ≠ 'GB' | refer to a solicitor for jurisdictional advice |
| `solicitor-recommended` | instructions are complex or LST + religious-dietary interact | refer to a solicitor |
| `replacement-trigger-ambiguous` | replacement_trigger is free text not matching enumerated triggers | clarify when the replacement steps in |
| `bilingual-donor` | preferred_language is `cy` or BSL | offer Welsh / BSL-supported workflow |
| `attorney-bankrupt` | any attorney.is_bankrupt = 'yes' | inform the attorney that the bankruptcy bar applies to P&FA LPAs |
| `multiple-lpas-detected` | multiple LPA rows for the same donor NHS number | confirm intent (replacement vs. revocation) |
| `opg-historical-rejection` | the OPG previously rejected an LPA from this donor | review rejection grounds before resubmitting |

## Engine versioning

The rule catalogue is the authoritative list. The engine's `engineVersion`
(stored in `lpa_validity.engine_version`) ties each saved result to a
particular catalogue revision. When a rule is added, removed, or its
severity changes, bump the catalogue revision and the engine version.

| Engine version | Catalogue revision | Notes |
| --- | --- | --- |
| `0.1.0` | initial | this document |
