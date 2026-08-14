# Cross-walk — state-agency HIPAA authorization templates

This document maps the fields of the canonical HIPAA-authorization
schema in `sql/` to the state-agency templates that the
schema must accommodate. The reference templates are:

- **Tennessee Department of Human Services HS-2557 (revised 12-15)** —
  reproduced in `../seed.pdf`.
- **Pennsylvania Department of Human Services HIPAA Authorization
  Form** — PA HS-1549.
- **HHS Office for Civil Rights — Sample HIPAA Authorization Form** —
  the model template published with the OCR HIPAA training materials.

## Field cross-walk

| Schema field                                            | TN HS-2557                              | PA HS-1549                          | HHS-OCR sample             |
| ------------------------------------------------------- | --------------------------------------- | ----------------------------------- | -------------------------- |
| `patient.name`                                          | "PRINT NAME"                            | "Print Name"                        | "Patient Name"             |
| `patient.birth_date`                                    | "Date of Birth"                         | "DOB"                               | "Date of Birth"            |
| `patient.social_security_number`                        | "Social Security Number (not required)" | "SSN (optional)"                    | not required               |
| `patient.postal_address_as_full_text`                   | "Street Address" / "City State Zip"     | "Address"                           | "Address"                  |
| `patient.phone`                                         | "Phone Number (with area code)"         | "Phone"                             | "Phone"                    |
| `signer.relationship`                                   | "Identify Signer" radio group           | "Relationship to Patient"           | "If signed by representative" |
| `signer.representative_authority_description`           | "Other authorized representative (explain)" | "Authority"                     | "Description of authority" |
| `disclosing_source.identification_mode`                 | initials radio group                    | "From whom"                         | "Person(s) authorized to disclose" |
| `disclosing_source.specific_persons_or_organizations`   | free-text                               | free-text                           | free-text                  |
| `disclosing_source.class_of_persons`                    | "doctors, hospitals, clinics, nursing homes, …" pre-printed text | similar pre-printed text | "class of persons"     |
| `authorized_recipient.recipient_name`                   | implicit — "Tennessee Department of Human Services (TDHS) and its authorized agents/contractors" | "PA DHS …" | "Recipient name" |
| `authorized_recipient.recipient_organization`           | "TDHS"                                  | "PA DHS"                            | configurable               |
| `records_to_disclose.include_medical_health`            | "TDHS may get any and all medical / health records" Yes/No + initials | similar | "Medical / health" |
| `records_to_disclose.include_mental_health`             | "TDHS may get any and all mental health records" Yes/No + initials | similar | "Mental health" |
| `records_to_disclose.include_substance_use`             | "TDHS may get drug or alcohol treatment / referral records" Yes/No + initials | similar | "Substance use" |
| `records_to_disclose.include_hiv_aids`                  | "TDHS may get HIV / AIDS test / treatment records" Yes/No + initials | similar | "HIV / AIDS" |
| `records_to_disclose.other_description`                 | "Specific Description of any other medical / health information" | "Other" | "Other description" |
| `purpose_of_disclosure.purposes`                        | "to help decide eligibility for services or benefits" | similar | configurable |
| `purpose_of_disclosure.other_details`                   | n/a — state purpose is pre-printed     | "Other" free-text                   | "Other"                    |
| `expiration.kind`                                       | implicit — 12 months                    | configurable                        | configurable               |
| `expiration.duration_label`                             | "This permission is good for 12 months from the date you sign this form" | configurable | configurable |
| `patient_rights_acknowledgement.right_to_revoke`        | "You have the right to withdraw your permission at any time." | similar | required by (c)(2)(i) |
| `patient_rights_acknowledgement.no_conditioning`        | "YOU DO NOT HAVE TO SIGN THIS FORM."     | similar                             | required by (c)(2)(ii)     |
| `patient_rights_acknowledgement.redisclosure_warning`   | "All information provided to TDHS is protected …" | similar                  | required by (c)(2)(iii)    |
| `patient_rights_acknowledgement.right_to_copy`          | "You will get a copy of this form after you sign it." | similar               | required by (c)(4)         |
| `signature_witness.individual_signature`                | "Signature of Person or Person's Authorized Representative" | similar          | required by (c)(1)(vi)     |
| `signature_witness.signature_date`                      | "Date"                                  | "Date"                              | "Date"                     |
| `signature_witness.witness_name`                        | "Witness"                               | sometimes                           | optional                   |
| `signature_witness.witness_date`                        | "Date"                                  | sometimes                           | optional                   |

## Notes

- TN HS-2557 has the recipient (TDHS) pre-printed; the schema treats
  recipient as configurable so the same form can be used with any
  state agency.
- HHS-OCR sample form makes the witness optional; TN HS-2557 makes it
  mandatory. The schema requires the field but lets the validation
  engine downgrade a missing witness to a low-priority flag where
  state law does not require one.
- PA HS-1549 adds an "Acknowledgement of Receipt of Notice of Privacy
  Practices" section; this is tracked as a separate flag rather than
  as a core element.
