# Validation rules

Rule-by-rule reference for the HIPAA-authorization validity engine.
Each rule fires when its predicate evaluates to `true`. The engine
reports the union of fired rules; `validityStatus = 'valid'` iff no
rule fires and no high-priority additional flag is raised.

## Core-element rules (45 CFR § 164.508(c)(1))

| Rule ID                          | Predicate                                                                                                  | Citation     | Priority |
| -------------------------------- | ---------------------------------------------------------------------------------------------------------- | ------------ | -------- |
| `phi-description-specific`       | `records_to_disclose.other_description === ''` AND no category yes/initials are set                        | (c)(1)(i)    | high     |
| `phi-description-not-vague`      | description matches /(all|any|every).*records?/i                                                           | (c)(1)(i)    | medium   |
| `disclosing-source-identified`   | `disclosing_source.identification_mode === ''` OR (mode `specific` AND `specific_persons_or_organizations === ''`) | (c)(1)(ii)   | high     |
| `recipient-identified`           | `authorized_recipient.recipient_name === ''` AND `authorized_recipient.recipient_organization === ''`       | (c)(1)(iii)  | high     |
| `purpose-stated`                 | `purpose_of_disclosure.purposes` is empty array AND `other_details === ''`                                  | (c)(1)(iv)   | high     |
| `expiration-stated`              | `expiration.expiration_date IS NULL` AND `expiration.expiration_event === ''`                              | (c)(1)(v)    | high     |
| `expiration-not-none`            | `expiration.expiration_event` matches /^(none|n\/a)$/i                                                     | (c)(1)(v)    | high     |
| `signature-and-date`             | `signature_witness.individual_signature_confirmed !== 'yes'` OR `signature_witness.signature_date IS NULL`  | (c)(1)(vi)   | high     |
| `representative-authority`       | `signer.relationship !== 'self'` AND `signer.representative_authority_description === ''`                  | (c)(1)(vi)(B)| high     |

## Required-statement rules (45 CFR § 164.508(c)(2))

| Rule ID                          | Predicate                                                                                                  | Citation     | Priority |
| -------------------------------- | ---------------------------------------------------------------------------------------------------------- | ------------ | -------- |
| `right-to-revoke-statement`      | `patient_rights_acknowledgement.acknowledged_right_to_revoke !== 'yes'`                                    | (c)(2)(i)    | medium   |
| `no-conditioning-statement`      | `patient_rights_acknowledgement.acknowledged_no_conditioning !== 'yes'`                                    | (c)(2)(ii)   | medium   |
| `redisclosure-warning`           | `patient_rights_acknowledgement.acknowledged_redisclosure_warning !== 'yes'`                               | (c)(2)(iii)  | medium   |
| `right-to-copy-acknowledged`     | `patient_rights_acknowledgement.acknowledged_right_to_copy !== 'yes'`                                      | (c)(4)       | low      |

## Sensitive-category rules

| Rule ID                          | Predicate                                                                                                  | Citation         | Priority |
| -------------------------------- | ---------------------------------------------------------------------------------------------------------- | ---------------- | -------- |
| `substance-use-part-2-consent`   | `records_to_disclose.include_substance_use === 'yes'` AND `records_to_disclose.part2_redisclosure_notice_included !== 'yes'` | 42 CFR Part 2    | high     |
| `substance-use-initials`         | `records_to_disclose.include_substance_use === 'yes'` AND `records_to_disclose.substance_use_initials === ''` | 42 CFR § 2.31 | high     |
| `hiv-aids-state-consent`         | `records_to_disclose.include_hiv_aids === 'yes'` AND `records_to_disclose.hiv_aids_state_consent_included !== 'yes'` | state-specific | high     |
| `hiv-aids-initials`              | `records_to_disclose.include_hiv_aids === 'yes'` AND `records_to_disclose.hiv_aids_initials === ''`        | state-specific   | high     |
| `mental-health-separate-initial` | `records_to_disclose.include_mental_health === 'yes'` AND `records_to_disclose.mental_health_initials === ''` | state-specific | medium   |
| `psychotherapy-separate-auth`    | `records_to_disclose.include_psychotherapy_notes === 'yes'` AND (any other `include_*` is `yes`)           | (a)(2)           | high     |
| `va-records-7332-notice`         | disclosing source contains "VA" OR "Veterans" AND `records_to_disclose.section_7332_notice_included !== 'yes'` | 38 U.S.C. § 7332 | high   |

## Compound-authorization rules

| Rule ID                          | Predicate                                                                                                  | Citation     | Priority |
| -------------------------------- | ---------------------------------------------------------------------------------------------------------- | ------------ | -------- |
| `no-compound-with-research`      | `purpose_of_disclosure.purposes` includes `'research'` AND any other purpose is set                        | (b)(3)       | medium   |
| `no-conditioning-on-signing`     | metadata reports the disclosing entity required signature as a condition of treatment AND no permitted exception applies | (b)(4) | high     |

## Expiration rules

| Rule ID                          | Predicate                                                                                                  | Citation     | Priority |
| -------------------------------- | ---------------------------------------------------------------------------------------------------------- | ------------ | -------- |
| `expiration-passed`              | `expiration.expiration_date < CURRENT_DATE`                                                                 | (b)(2)(i)    | high     |
| `expiration-over-12-months`      | `expiration.expiration_date > signature_date + interval '12 months'` AND `purpose` is `'eligibility-determination'` | best practice | medium |

## Additional flags (priority-graded, not gating)

- `reproductive-health-investigation` (high) — purpose appears to be an
  investigation of reproductive-health care (HHS 2024 rule).
- `signed-by-minor` (medium) — signer is patient but patient
  `birth_date` places age below the state age of majority and no
  parent/guardian co-signature is present.
- `language-jargon` (low) — PHI description contains medical jargon
  unlikely to be understood by a lay reader.
- `electronic-witness-missing` (low) — electronic submission without a
  digital witness signature.
